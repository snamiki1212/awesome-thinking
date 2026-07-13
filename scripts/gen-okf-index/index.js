#!/usr/bin/env node
/**
 * OKF index.md ジェネレータ
 *
 * OKF の予約ファイル index.md（機械・エージェント向けの目次。OKF v0.1 §6）を
 * リポジトリ全体に対して自動生成する。仕様の正典（SoT）は docs/okf-at/README.md。
 *
 * 生成ルール:
 *   - Concept（予約ファイル・除外パターンを除く .md）を 1 つ以上含むディレクトリ、
 *     または index.md を持つサブディレクトリを含むディレクトリに index.md を置く
 *   - 各エントリは frontmatter の title をリンクテキスト、description を説明に使う
 *     思考ツールの詳細ファイルは id もリンクテキストの先頭に表示する
 *   - サブディレクトリのエントリは、その配下の README.md の frontmatter から引く。
 *     そのため index.md を置くディレクトリには README.md を必須とし、なければ fail する
 *   - ルートの index.md のみ `okf_version: "0.1"` を宣言する（OKF §11 の唯一の例外）
 *   - 出力はファイルツリーと frontmatter だけから決まる（日時等を含めず、冪等）
 *
 * 除外パターンは linter と同じ scripts/lint-okf-at/ignore.txt（SoT）を読む。
 *
 * 使い方:
 *   node scripts/gen-okf-index          # 生成・更新し、不要になった生成物を削除する
 *   node scripts/gen-okf-index --check  # 差分の検査のみ（CI 用）
 *
 * 終了コード: --check で差分あり=1 / それ以外=0
 */
const fs = require('fs');
const path = require('path');
const { loadIgnorePatterns, parseFrontmatter } = require('../lib/okf-md');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const IGNORE_PATH = path.join(REPO_ROOT, 'scripts', 'lint-okf-at', 'ignore.txt');
const RESERVED_FILES = new Set(['index.md', 'log.md']);

// 生成物であることの目印。孤児となった index.md は、この行を含む場合だけ削除する
// （手書きの index.md を誤って消さないための安全弁。仕様上 index.md の手書きは禁止）。
const GENERATED_MARKER =
  '<!-- このファイルは自動生成です。手で編集せず `node scripts/gen-okf-index` で再生成してください。 -->';

/**
 * ディレクトリを再帰的に走査し、目次の材料を集める。
 * 戻り値: { relDir, concepts: string[], subdirs: node[], indexPaths: string[] }
 * indexPaths は配下（自身を含む）で見つかった既存の index.md の相対パス一覧。
 */
function scanDir(absDir, relDir, ignore) {
  const concepts = [];
  const subdirs = [];
  const indexPaths = [];
  const entries = fs.readdirSync(absDir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (ignore.some((re) => re.test(rel))) continue; // 除外パターン（ディレクトリは配下ごと枝刈り）
    if (entry.isDirectory()) {
      const child = scanDir(path.join(absDir, entry.name), rel, ignore);
      indexPaths.push(...child.indexPaths);
      if (child.concepts.length > 0 || child.subdirs.length > 0) subdirs.push(child);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (entry.name === 'index.md') indexPaths.push(rel);
      else if (!RESERVED_FILES.has(entry.name)) concepts.push(entry.name);
    }
  }
  return { relDir, concepts, subdirs, indexPaths };
}

/** Concept ファイルの frontmatter から title / description / id を引く（なければ空文字）。 */
function readMeta(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(abs)) return { title: '', description: '', id: '' };
  const fm = parseFrontmatter(fs.readFileSync(abs, 'utf8'));
  const get = (key) => {
    const field = fm && fm.fields.get(key);
    return field && field.hasValue ? field.value : '';
  };
  return { title: get('title'), description: get('description'), id: get('id') };
}

/** 1 エントリを OKF §6 の形式（`* [Title](url) - description`）で書く。 */
function renderEntry(title, url, description) {
  return `* [${title}](${url})` + (description ? ` - ${description}` : '');
}

/** 1 ディレクトリ分の index.md の内容を組み立てる。 */
function renderIndex(node) {
  const lines = [];
  if (node.relDir === '') lines.push('---', 'okf_version: "0.1"', '---', '');
  lines.push(GENERATED_MARKER, '', '# 目次', '');

  // README.md はディレクトリの顔なので先頭に固定する。
  // 思考ツールは ID 順、それ以外はファイル名順に並べる。
  const files = [...node.concepts].sort((a, b) => {
    if (a === 'README.md') return -1;
    if (b === 'README.md') return 1;
    const aMeta = readMeta(node.relDir ? `${node.relDir}/${a}` : a);
    const bMeta = readMeta(node.relDir ? `${node.relDir}/${b}` : b);
    if (aMeta.id && bMeta.id) return aMeta.id.localeCompare(bMeta.id);
    if (aMeta.id) return -1;
    if (bMeta.id) return 1;
    return a < b ? -1 : a > b ? 1 : 0;
  });
  if (files.length > 0) {
    lines.push('## ドキュメント', '');
    for (const name of files) {
      const rel = node.relDir ? `${node.relDir}/${name}` : name;
      const meta = readMeta(rel);
      const title = meta.id ? `${meta.id} ${meta.title || name.replace(/\.md$/, '')}` : meta.title || name.replace(/\.md$/, '');
      lines.push(renderEntry(title, `./${name}`, meta.description));
    }
    lines.push('');
  }
  if (node.subdirs.length > 0) {
    lines.push('## サブディレクトリ', '');
    for (const sub of node.subdirs) {
      const name = sub.relDir.split('/').pop();
      const meta = readMeta(`${sub.relDir}/README.md`);
      lines.push(renderEntry(meta.title || name, `./${name}/`, meta.description));
    }
    lines.push('');
  }
  return lines.join('\n');
}

/** 目次を置くべき全ディレクトリのノードを平坦に集める。 */
function flattenNodes(node, out) {
  out.push(node);
  for (const sub of node.subdirs) flattenNodes(sub, out);
  return out;
}

function main() {
  const check = process.argv.includes('--check');
  if (!fs.existsSync(IGNORE_PATH)) {
    console.error(`❌ 除外パターンファイルがない: ${path.relative(REPO_ROOT, IGNORE_PATH)}`);
    process.exit(1);
  }
  const ignore = loadIgnorePatterns(IGNORE_PATH);
  const root = scanDir(REPO_ROOT, '', ignore);
  const nodes = flattenNodes(root, []);
  const expected = new Map(
    nodes.map((node) => [node.relDir ? `${node.relDir}/index.md` : 'index.md', renderIndex(node)])
  );

  // サブディレクトリのエントリの表示名・説明は配下の README.md から引くため、
  // 目次を置くディレクトリには README.md を必須とする（説明の欠けた目次を作らない）
  const missingReadme = nodes
    .filter((node) => !node.concepts.includes('README.md'))
    .map((node) => node.relDir || '(ルート)');

  const stale = []; // 期待と内容が違う・存在しない
  const orphans = []; // 目次を置く理由がなくなった生成物
  const handwritten = []; // 生成物の目印がない index.md（手書きの疑い）

  for (const [relPath, content] of expected) {
    const abs = path.join(REPO_ROOT, relPath);
    const current = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (current === content) continue;
    if (current !== null && !current.includes(GENERATED_MARKER)) handwritten.push(relPath);
    stale.push(relPath);
    if (!check) fs.writeFileSync(abs, content);
  }
  for (const relPath of root.indexPaths) {
    if (expected.has(relPath)) continue;
    const text = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    if (!text.includes(GENERATED_MARKER)) {
      handwritten.push(relPath);
      continue;
    }
    orphans.push(relPath);
    if (!check) fs.unlinkSync(path.join(REPO_ROOT, relPath));
  }

  for (const relPath of handwritten) {
    console.error(
      `❌ ${relPath} は生成物の目印を持たない（index.md の手書きは禁止。仕様: docs/okf-at/README.md）。` +
        '生成対象のディレクトリなら再生成で上書き、そうでなければ手で削除してください'
    );
  }
  for (const dir of missingReadme) {
    console.error(
      `❌ ${dir} に README.md がない（目次を置くディレクトリには必須。仕様: docs/okf-at/README.md）。` +
        'title / description を持つ README.md を書いてから再生成してください'
    );
  }
  if (check) {
    for (const relPath of stale) console.error(`❌ ${relPath} が最新でない`);
    for (const relPath of orphans) console.error(`❌ ${relPath} は不要（目次を置く対象のディレクトリでない）`);
    console.log(`\n目次 ${expected.size} 件 / 要更新 ${stale.length} 件 / 不要 ${orphans.length} 件`);
    if (stale.length > 0 || orphans.length > 0 || handwritten.length > 0 || missingReadme.length > 0) {
      if (stale.length > 0 || orphans.length > 0) {
        console.error('\n`node scripts/gen-okf-index` を実行して index.md を再生成してください');
      }
      process.exit(1);
    }
  } else {
    for (const relPath of stale) console.log(`✏️  ${relPath} を更新`);
    for (const relPath of orphans) console.log(`🗑️  ${relPath} を削除`);
    console.log(`\n目次 ${expected.size} 件 / 更新 ${stale.length} 件 / 削除 ${orphans.length} 件`);
    // README.md の欠落は再生成では直らないので、生成モードでも fail させて気付かせる
    if (missingReadme.length > 0) process.exit(1);
  }
}

main();
