/**
 * OKF-AT ツール共通ライブラリ
 *
 * lint-okf-at（準拠チェック）と gen-okf-index（index.md 生成）が共有する、
 * 除外パターンの解釈と frontmatter のパースを持つ。
 * 除外パターンの正典（SoT）は scripts/lint-okf-at/ignore.txt のまま変わらない。
 */
const fs = require('fs');

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

/** 除外パターンファイルを読み込み、RegExp 配列を返す。ファイルがなければ throw する。 */
function loadIgnorePatterns(ignorePath) {
  return fs
    .readFileSync(ignorePath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map(patternToRegExp);
}

/**
 * frontmatter を素朴にパースする（依存なし）。
 * トップレベルの `key: value` と、直後のブロックリスト（`- item`）のみ解釈する。
 * 戻り値: { fields: Map<key, {hasValue, value}> } / frontmatter がない・閉じていない場合は null
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

module.exports = { patternToRegExp, loadIgnorePatterns, parseFrontmatter };
