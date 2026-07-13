---
type: guideline
title: ナレッジ管理ルール（OKF-AT）
description: OKF v0.1 をベースにした本リポジトリ独自プロファイル OKF-AT の frontmatter とリンクの規約を定める。
timestamp: 2026-07-13T12:00:00+09:00
tags: [okf, ナレッジ管理]
---

# ナレッジ管理ルール（OKF-AT）

本リポジトリのナレッジ管理は、OKF v0.1 をそのまま使うのではなく、OKF を土台に「本リポジトリで必須とする項目」を上乗せした独自プロファイル **OKF-AT** で運用する。
OKF-AT は OKF v0.1 の制約を壊さずに強めるラッパーであり、**OKF-AT に準拠したバンドルは OKF v0.1 にも準拠する**。

背景と意思決定は [ADR: ナレッジ管理フォーマットに OKF-AT を採用する](../../adr/20260713-adopt-okf-at-knowledge-format/README.md)、OKF 自体の仕様は [okf-primer.md](./okf-primer.md) を参照。
このディレクトリの文書一覧は [index.md](./index.md) を参照。

## 適用範囲

- バンドルルート: リポジトリルート
- 対象: 予約ファイル（`index.md` / `log.md`）と後述の除外パターンを除く、リポジトリ内のすべての `.md`

## Frontmatter フィールド

各 Concept ファイルは `---` で囲んだ YAML frontmatter を先頭に持つ。
各フィールドについて、**OKF v0.1 での位置づけ**と、**本リポジトリ（OKF-AT）で必須とするか**を分けて示す。

| フィールド | OKF v0.1 | OKF-AT（本リポジトリ） | 型 | 内容 |
|---|---|---|---|---|
| `type` | Required | **必須** | string | Concept の種別。空でない文字列。値は自由（free-form） |
| `title` | Recommended | **必須** | string | 人間向けの表示名（日本語タイトル） |
| `titles` | Extension | 任意 | map | 言語コード（ISO 639-1）→ その言語での正式名。思考ツールの詳細ファイルで使う（後述） |
| `description` | Recommended | **必須** | string | 1 文の要約。人間とエージェントの検索性のため |
| `timestamp` | Recommended | **必須** | string | 最終更新日時（ISO 8601） |
| `tags` | Recommended | **必須** | string[] | 横断的な分類タグ |
| `resource` | Recommended | 任意 | string | 対象アセットを一意に識別する URI |
| `slug` | Extension | 任意 | string | 英語 kebab-case のスラッグ。思考ツールの詳細ファイルで使う |
| `aliases` | Extension | 任意 | string[] | 別名・略称・別表記。思考ツールの詳細ファイルで使う |
| `status` | Extension | 任意 | string | ADR のステータス（Accepted / Rejected / Superseded by <adr-slug>） |
| `created_at` | Extension | **禁止** | date | 廃止。作成日は Git 履歴で追う |
| `updated_at` | Extension | **禁止** | date | 廃止。更新日時は `timestamp` に一本化する |
| （上記以外） | Extension | 任意 | any | 自由に追加してよい。ツールは未知フィールドを拒否せず保持する |

- **OKF v0.1 列**: OKF 仕様上の位置づけ（Required / Recommended / Extension）。OKF は任意キーを Extension として許容するため、禁止する `created_at` / `updated_at` も OKF 上は Extension。OKF が必須とするのは `type` のみ
- **OKF-AT 列**: 本リポジトリで必須とするか、任意とするか、禁止とするか
- OKF で「推奨」の項目も、検索性・分類・鮮度管理のため OKF-AT では必須に格上げする

### 記述例

```yaml
---
title: 第一原理思考
titles:
  en: First Principles Thinking
slug: first-principles
type: mental-model
aliases: [第一原理, 原理原則思考]
description: "「当たり前」とされている前提を疑い、これ以上分解できない根本の事実まで遡ってから考え直す見方。"
timestamp: 2026-06-04T09:00:00+09:00
tags: [問題解決, 意思決定]
---
```

### `title` / `titles` / `aliases` の使い分け

多言語の正式名は `titles` で管理する。経緯は [ADR: 英語名など多言語の正式名を frontmatter の titles で管理する](../../adr/20260713-titles-frontmatter-for-multilingual-names/README.md) を参照。

- **`title`（必須・string）**: 日本語の正式名。リポジトリのメイン言語が日本語のため、`title` を日本語の正とし、`titles` に `ja` は書かない（二重管理を避ける）
- **`titles`（任意・map）**: 言語コード（ISO 639-1、小文字）をキーに、その言語での正式名を書く。英語名は `titles.en`。由来言語の呼称があれば `de` / `fr` などを追加してよい
- **`aliases`（任意・string[]）**: 正式名以外の別名・略称・別表記（言語は問わない）。`title` / `titles` に載せた正式名は重複させない

OKF v0.1 は `title` を string と定めているため、`title` をマップにする形（`title.en` のような入れ子）は採らない。`titles` を別フィールドにすることで OKF 互換を保つ。

## `type` の値

OKF の思想に従い `type` は free-form とし、CI では**空でないこと**のみを検査する。
特定の語彙を強制はしないが、一貫性のため以下を推奨語彙とする。

| 推奨値 | 用途 |
|---|---|
| `mental-model` | 🧠 メンタルモデルの詳細ファイル（`thinking-mental-models/`） |
| `framework` | 🧩 思考フレームワークの詳細ファイル（`thinking-frameworks/`） |
| `thinking-method` | 🌊 思考法の詳細ファイル（`thinking-methods/`） |
| `thinking-skill` | ⚡ 思考術の詳細ファイル（`thinking-skills/`） |
| `adr` | 意思決定の記録（`adr/`） |
| `guideline` | 分類の定義・運用ルール（`docs/taxonomy.md` など） |
| `readme` | ディレクトリの概要・人間向けナビゲーションを書く README.md |
| `note` | その他のメモ・記録 |

思考ツール 4 タイプの定義と判定基準は [docs/taxonomy.md](../taxonomy.md) を正本とする。

## 予約ファイル・除外ファイル

### OKF-AT の予約ファイル

OKF-AT は OKF の予約ファイル `index.md` と `log.md` をそのまま引き継ぐ。
この 2 つだけが予約ファイルで、Concept 文書ではなく OKF-AT 必須フィールドを要求しない。
README.md は予約ファイルではない。

| ファイル | 扱い |
|---|---|
| `index.md` | 機械可読な目次。ツールで自動生成する（次項） |
| `log.md` | 更新履歴。使う場合のみ設置する |

### README.md と index.md は役割で分ける

両者は用途が異なるため統合せず、役割で分ける。

- **README.md**: 人間向けの概要・ナビゲーション。手書きし、他の Concept と同じく OKF-AT 必須フィールドを持つ（予約ファイルではない）。この用途では `type: readme` とする
- **index.md**: 機械・エージェント向けの目次。ツールで自動生成する（手書きしない）。frontmatter は持たないが、ルートの `index.md` だけは OKF §11 に従い `okf_version: "0.1"` を宣言する

README.md に配下の一覧を列挙しない。
`index.md` 相当の列挙を README.md にも書くと二重管理になり、片方の更新漏れで食い違うため。
README.md は概要だけを書き、原則として `index.md` へのリンクを置く。
例外はトップの README.md だけで、全項目の一覧はこのリポジトリのコアコンテンツなので手書きの一覧を持ち続ける。
経緯: [ADR: README の一覧列挙は index.md に委ねる](../../adr/20260713-readme-delegates-listing-to-index/README.md)

### index.md の自動生成

`index.md` は `node scripts/gen-okf-index` が全ディレクトリ分を一括生成する。
Concept を含むすべてのディレクトリ（と、そうしたディレクトリを配下に持つディレクトリ）に置く。
生成規則は次のとおり。経緯は [ADR: OKF の目次 index.md をツールで自動生成する](../../adr/20260713-generate-okf-index/README.md) を参照。

- 各エントリは OKF §6 の形式（`* [Title](url) - description`）で書き、リンク先 frontmatter の `title` と `description` を使う
- サブディレクトリのエントリは、その配下の `README.md` の frontmatter から引く
- そのため、`index.md` を置くディレクトリには `README.md` を必須とする。欠けているとサブディレクトリのエントリに説明を入れられないため、ツールが検査して fail する
- 出力はファイルツリーと frontmatter だけから決まり、何度実行しても同じ結果になる

Markdown の追加・改名・削除や `title` / `description` の変更をしたら、`node scripts/gen-okf-index` で再生成する。
最新かどうかは CI が `node scripts/gen-okf-index --check` で検査し、差分があれば fail する。

### 除外パターン（独自スキーマ・生成物）

次のいずれかに該当し、OKF-AT の Concept として扱わないファイルは対象外とする。

- 独自のスキーマを持つ（スキル・エージェント・ルール定義、テンプレート等）
- 人手で管理しない（生成物、依存パッケージ、自動生成ドキュメント等）
- テスト fixture 用の Markdown

具体的なパターンは `scripts/lint-okf-at/ignore.txt`（gitignore 形式）で管理する。
**除外パターンの正典（SoT）は同ファイル**であり、本仕様には列挙しない（二重管理を避ける）。
バリデータ（CI・ローカルとも）も同ファイルを読む。
パターンの追加・変更は、理由コメントを添えて同ファイルに対して行う。

## リンク規約

- バンドル内の Concept 間リンクは Markdown リンクで書く。本リポジトリの慣習に合わせ、参照元ファイルからの相対パス（`./` / `../` 始まり）で書く（OKF はバンドルルート起点の絶対パスも許容する）
- wikilink（`[[スラッグ]]`。Obsidian 等の記法）は使わない。GitHub 上でリンクとして機能しないため、`関連`・`似ている用語との違い` 節の関連項目も `[スラッグ](相対パス)` の Markdown リンクで書く。経緯は [ADR: 関連セクションのリンクを Markdown リンクに統一する](../../adr/20260713-markdown-links-for-related-sections/README.md)
- リンクは関係の存在を示すのみとし、関係の種類は周囲の文章で説明する
- リンク切れは許容する（ファイル移動に寛容にする）

## 準拠チェックリスト

新規・更新時に確認する。
CI でも同項目を検査する（バリデータ: `scripts/lint-okf-at/`。ローカルでは `node scripts/lint-okf-at` で実行できる）。

- [ ] frontmatter が `---` で始まりパース可能な YAML である
- [ ] OKF-AT 必須（`type` / `title` / `description` / `timestamp` / `tags`）がすべて埋まっている
- [ ] `type` が空でない
- [ ] `timestamp` が ISO 8601 形式である
- [ ] 禁止フィールド（`created_at` / `updated_at`）を使っていない
- [ ] 本文に wikilink（`[[スラッグ]]`）を使っていない（コードスパン・コードブロック内の記載は除く）
- [ ] ファイルが除外パターンに該当しない Concept である
