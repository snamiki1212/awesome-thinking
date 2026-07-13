#!/usr/bin/env node
/**
 * OKF-AT frontmatter リンター
 *
 * リポジトリ内の Markdown が OKF-AT（OKF v0.1 ベースの本リポジトリ独自プロファイル）に
 * 準拠しているかを検査する。仕様の正典（SoT）は docs/okf-at/README.md。
 *
 * 検査項目（仕様の「準拠チェックリスト」と一致させる）:
 *   - frontmatter が `---` で始まりパース可能な YAML である
 *   - 必須フィールド（type / title / description / timestamp / tags）がすべて埋まっている
 *   - type が空でない
 *   - timestamp が ISO 8601 形式である
 *   - 禁止フィールド（created_at / updated_at）を使っていない
 *
 * 検査対象から外すファイルは、同ディレクトリの 2 つの管理ファイルで扱う（ハードコードしない）:
 *   - ignore.txt … 恒久的な除外パターン（gitignore 形式）。独自スキーマ・生成物等、
 *     そもそも Concept でないもの。除外パターンの正典（SoT）
 *   - allowlist.txt … 導入時点で非準拠だった既存ファイルのベースライン。
 *     違反は警告として報告するのみで exit code に影響させない（段階移行のため）。
 *     準拠させたら一覧から削除して縮小していく
 *
 * OKF の予約ファイル（index.md / log.md）はプロファイル仕様そのものなので、
 * 管理ファイルではなく本スクリプトが直接対象外とする。
 *
 * 使い方:
 *   node scripts/lint-okf-at
 *
 * 終了コード: allowlist 外の違反あり=1 / それ以外=0
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const IGNORE_PATH = path.join(__dirname, 'ignore.txt');
const ALLOWLIST_PATH = path.join(__dirname, 'allowlist.txt');
const SPEC_PATH = 'docs/okf-at/README.md';

const REQUIRED_FIELDS = ['type', 'title', 'description', 'timestamp', 'tags'];
const FORBIDDEN_FIELDS = ['created_at', 'updated_at'];
// 日付のみ、または日時（タイムゾーン付き可）の ISO 8601
const ISO_8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

// OKF の予約ファイル。Concept ではないため frontmatter を要求しない。
const RESERVED_FILES = new Set(['index.md', 'log.md']);

/**
 * ignore.txt の 1 パターンを正規表現に変換する（gitignore 記法のサブセット）。
 *   - 末尾 `/` はディレクトリ（配下すべてに一致）
 *   - 先頭 `/` または `/` を含むパターンはリポジトリルート起点
 *   - `/` を含まないパターンはファイル名としてどの階層でも一致
 *   - `**` は `/` を跨ぐ、`*` は跨がない、`?` は任意の 1 文字。否定 (`!`) は未対応
 */
function patternToRegExp(raw) {
  let pat = raw;
  const dirOnly = pat.endsWith('/');
  if (dirOnly) pat = pat.slice(0, -1);
  let anchored = false;
  if (pat.startsWith('/')) {
    anchored = true;
    pat = pat.slice(1);
  } else if (pat.includes('/')) {
    anchored = true;
  }
  let src = '';
  for (let i = 0; i < pat.length; i++) {
    const c = pat[i];
    if (c === '*') {
      if (pat[i + 1] === '*') {
        src += '.*';
        i++;
      } else {
        src += '[^/]*';
      }
    } else if (c === '?') {
      src += '[^/]';
    } else {
      src += c.replace(/[.+^${}()|[\]\\]/, '\\$&');
    }
  }
  const prefix = anchored ? '^' : '(^|.*/)';
  const suffix = dirOnly ? '(/.*)?$' : '$';
  return new RegExp(prefix + src + suffix);
}

/** ignore.txt を読み込み、パターンの RegExp 配列を返す。 */
function loadIgnorePatterns() {
  if (!fs.existsSync(IGNORE_PATH)) {
    console.error(`❌ 除外パターンファイルがない: ${path.relative(REPO_ROOT, IGNORE_PATH)}`);
    process.exit(1);
  }
  return fs
    .readFileSync(IGNORE_PATH, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map(patternToRegExp);
}

/** ディレクトリ配下の .md ファイルを再帰的に列挙する（リポジトリルート相対パスで返す）。 */
function listMarkdown(dir, ignore) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(REPO_ROOT, full).split(path.sep).join('/');
    if (ignore.some((re) => re.test(rel))) continue; // 除外パターン（ディレクトリは配下ごと枝刈り）
    if (entry.isDirectory()) out.push(...listMarkdown(full, ignore));
    else if (entry.isFile() && entry.name.endsWith('.md') && !RESERVED_FILES.has(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

/**
 * frontmatter を素朴にパースする（依存なし）。
 * トップレベルの `key: value` と、直後のブロックリスト（`- item`）のみ解釈する。
 * 戻り値: { fields: Map<key, {hasValue}> } / frontmatter がない・閉じていない場合は null
 */
function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return null;
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---' || lines[i] === '...') {
      end = i;
      break;
    }
  }
  if (end === -1) return null;

  const fields = new Map();
  let lastKey = null;
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (/^\s*(#|$)/.test(line)) continue; // コメント・空行
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (kv) {
      const value = kv[2].replace(/\s+#.*$/, '').trim();
      const stripped = value.replace(/^['"]|['"]$/g, '');
      // 空文字・空リストは「値なし」とみなす
      const hasValue = stripped !== '' && stripped !== '[]';
      fields.set(kv[1], { hasValue, value: stripped });
      lastKey = kv[1];
      continue;
    }
    // ブロックリスト項目は直前のキーの値とみなす（YAML はインデントなしの項目も許す）
    if (/^\s*-\s+\S/.test(line) && lastKey) {
      fields.get(lastKey).hasValue = true;
    }
  }
  return { fields };
}

/** 1 ファイルを検査し、違反メッセージの配列を返す。 */
function lintFile(relPath) {
  const text = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) {
    return ['frontmatter がない（`---` で始まる YAML ブロックが必要）'];
  }
  const violations = [];
  for (const key of REQUIRED_FIELDS) {
    const field = fm.fields.get(key);
    if (!field) violations.push(`必須フィールド \`${key}\` がない`);
    else if (!field.hasValue) violations.push(`必須フィールド \`${key}\` が空`);
  }
  const ts = fm.fields.get('timestamp');
  if (ts && ts.hasValue && !ISO_8601.test(ts.value)) {
    violations.push(`\`timestamp\` が ISO 8601 形式でない: ${ts.value}`);
  }
  for (const key of FORBIDDEN_FIELDS) {
    if (fm.fields.has(key)) {
      violations.push(`禁止フィールド \`${key}\` を使っている（\`timestamp\` に一本化する）`);
    }
  }
  return violations;
}

/** allowlist を読み込む（# コメント・空行を除いた相対パスの集合）。 */
function loadAllowlist() {
  if (!fs.existsSync(ALLOWLIST_PATH)) return new Set();
  return new Set(
    fs
      .readFileSync(ALLOWLIST_PATH, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
  );
}

function main() {
  const ignore = loadIgnorePatterns();
  const allowlist = loadAllowlist();
  const targets = listMarkdown(REPO_ROOT, ignore).sort();

  const errors = [];
  const warns = [];
  const staleAllowlist = [];

  for (const relPath of targets) {
    const violations = lintFile(relPath);
    if (violations.length === 0) {
      if (allowlist.has(relPath)) staleAllowlist.push(relPath);
      continue;
    }
    (allowlist.has(relPath) ? warns : errors).push({ relPath, violations });
  }

  for (const { relPath, violations } of warns) {
    console.log(`⚠️  ${relPath} (allowlist 済み・段階移行待ち)`);
    for (const v of violations) console.log(`    - ${v}`);
  }
  for (const { relPath, violations } of errors) {
    console.error(`❌ ${relPath}`);
    for (const v of violations) console.error(`    - ${v}`);
  }
  for (const relPath of staleAllowlist) {
    console.log(`ℹ️  ${relPath} は準拠済み。allowlist (${path.relative(REPO_ROOT, ALLOWLIST_PATH)}) から削除できます`);
  }

  console.log(
    `\n検査対象 ${targets.length} 件 / 違反 ${errors.length} 件 / allowlist 済み ${warns.length} 件`
  );
  if (errors.length > 0) {
    console.error(`\nOKF-AT 仕様（必須フィールドの正典）: ${SPEC_PATH}`);
    console.error(`除外パターンの正典: ${path.relative(REPO_ROOT, IGNORE_PATH)}`);
    process.exit(1);
  }
}

main();
