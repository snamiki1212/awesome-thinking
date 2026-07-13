---
type: note
title: OKF (Open Knowledge Format) 基礎知識
description: OKF-AT 採用 ADR の前提となる OKF v0.1 の概要・用語・frontmatter・予約ファイル・リンク・準拠条件を仕様に沿って要約する。
timestamp: 2026-07-13T00:00:00Z
tags: [okf, ナレッジ管理]
---

# OKF (Open Knowledge Format) 基礎知識

[OKF-AT 採用 ADR](../../adr/20260713-adopt-okf-at-knowledge-format/README.md) の前提知識として、OKF v0.1 の仕様を節番号（§）付きで要約する。
一次情報は [OKF v0.1 SPEC](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)。
正確な規約は原文が優先される。
RFC 2119 の MUST / SHOULD / MAY をそのまま用いる。

## OKF とは何か

ナレッジを人間と AI エージェントの双方が扱いやすい形で表現するためのオープンフォーマット。
実体は YAML frontmatter 付き Markdown ファイルを集めたディレクトリで、専用の SDK・API・アカウントを必要とせず Git やテキストエディタで扱える。
現在のバージョンは v0.1（draft）。

## 目的と非目的（§1）

**目的**:

- enrichment エージェントが書き込む先となる普遍的なフォーマットを定める
- consumption エージェントの読み取り・巡回の挙動を導く
- システムや組織をまたいだナレッジ交換を容易にする
- 意味のある消費のために必須フィールドを標準化する

**非目的**:

- Concept 種別（`type`）の固定的な分類体系を定めない
- 保存・配信・クエリのインフラを規定しない
- ドメイン固有スキーマを置き換えない。置き換えるのではなく参照する

**設計原則**: 人間がツールなしで読める / エージェントが専用 SDK なしでパースできる / バージョン管理で diff できる / ツール・組織・時間を越えて持ち運べる。

## 用語集（§2）

| 用語 | 定義 |
|---|---|
| Knowledge Bundle | 自己完結した階層的なナレッジ文書の集合。配布の単位 |
| Concept | バンドル内のナレッジの最小単位。1 つの Markdown 文書。有形の資産・抽象概念のどちらも表せる |
| Concept ID | バンドル内のファイルパスから `.md` を除いたもの（例: `mental-models/first-principles.md` → `mental-models/first-principles`） |
| Frontmatter | ファイル先頭の `---` で囲まれた YAML メタデータブロック |
| Body | frontmatter 以降のすべて |
| Link | Concept 間の関係を表す標準的な Markdown リンク |
| Citation | 本文中の主張を裏付ける外部情報源へのリンク |

## バンドル構造と配布（§3）

バンドルは Markdown ファイルのディレクトリツリー。
ディレクトリ構造はドメインから独立で、producer が自由に組織する。

```
path/to/bundle/
├── index.md        # 任意
├── log.md          # 任意
├── <concept>.md
└── <subdirectory>/
    ├── index.md
    ├── <concept>.md
    └── <subdirectory>/…
```

配布方法（いずれも可）: Git リポジトリ（推奨。履歴・帰属・diff が得られる）／ tarball・zip アーカイブ／より大きなリポジトリのサブディレクトリ。

### 予約ファイル名（§3.1）

| 予約ファイル名 | 用途 | 規則 |
|---|---|---|
| `index.md` | ディレクトリの目次（§6） | Concept 文書に使ってはならない（MUST NOT） |
| `log.md` | 更新履歴（§7） | Concept 文書に使ってはならない（MUST NOT） |

これら以外の `.md` はすべて Concept 文書。
README.md は予約ファイルではなく、通常の Concept として扱われる（`type` が必要）。

タグ集約: OKF はタグで文書を束ねる専用ファイル形式を定めない。
consumer が消費時に frontmatter を走査して合成してよい（MAY）。

## Concept ドキュメント（§4）

文字コードは UTF-8。
Concept は frontmatter と body の 2 部で構成される。

### Frontmatter フィールド

必須は `type` の 1 つだけ。
他は推奨または拡張で、推奨は上から優先度順。

| フィールド | 区分 | 内容 |
|---|---|---|
| `type` | 必須 | Concept の種別を表す短い文字列。consumer はルーティング・フィルタ・表示に使う。中央登録はされない。producer は説明的で自己説明的な値を選ぶべき（SHOULD）、consumer は未知の type を許容しなければならない（MUST） |
| `title` | 推奨 | 人間向けの表示名。省略時は consumer がファイル名から導出してよい（MAY） |
| `description` | 推奨 | 1 文の要約。index.md 生成・検索スニペット・プレビューに使われる |
| `resource` | 推奨 | 対象アセットを一意に識別する URI。抽象概念を表す Concept では存在しない |
| `tags` | 推奨 | 横断的な分類のための短い文字列の YAML リスト |
| `timestamp` | 推奨 | 最後に意味のある変更をした日時（ISO 8601） |
| （任意のキー） | 拡張 | producer が自由に追加できる。consumer は round-trip 時に未知キーを保持すべき（SHOULD）、未知フィールドを理由に拒否すべきでない（SHOULD NOT） |

### Body の慣習

body は標準的な Markdown で、必須の節はない。
producer は散文より構造化 Markdown（見出し・リスト・表・コードブロック）を優先すべき（SHOULD）。
構造が人間の読解とエージェントの検索の双方を助けるため。
該当する場合に使う慣習的な見出し:

| 見出し | 用途 |
|---|---|
| `# Schema` | アセットのカラム・フィールドの構造的な説明 |
| `# Examples` | 具体的な利用例。多くはコードブロック |
| `# Citations` | 本文中の主張を裏付ける外部情報源（§8） |

## リンク（§5）

| 形式 | 記法 | 備考 |
|---|---|---|
| 絶対（バンドル相対） | `/` から始める（例: `/mental-models/first-principles.md`） | サブディレクトリ内で文書を移動しても安定 |
| 相対 | 標準の Markdown 相対パス（例: `./other.md`） | |

- リンクは関係の存在を主張するのみ。関係の種類（親子・参照・depends-on など）は周囲の文章が伝え、リンク自体は型を持たない。グラフを作る consumer は通常すべてのリンクを型なしの有向辺として扱う
- consumer はリンク切れを許容しなければならない（MUST）。ターゲット不在は不正ではなく、未執筆のナレッジを表すこともある

## index.md（目次）（§6）

段階的開示のための目次。
人間やエージェントが個々の文書を開く前に、何があるかを把握できるようにする。
任意のディレクトリ（ルート含む）に置ける。

- **frontmatter を持たない**（唯一の例外はルート index.md の `okf_version`。§11）
- 本文は見出しごとに Concept をグループ化したリンク一覧
- 各エントリはリンク先 frontmatter の `description` を含めるべき（SHOULD）
- producer が自動生成してよく（MAY）、無ければ consumer がその場で合成してもよい（MAY）

```markdown
# セクション / グループ見出し

* [Title 1](relative-url-1) - 項目1の短い説明
* [Subdirectory](subdir/) - サブディレクトリの説明
```

## log.md（更新履歴）（§7）

そのスコープの変更履歴を記録する任意ファイル。
階層のどの階層にも置ける。
日付でグループ化し新しい順に並べる。

- 日付見出しは ISO 8601 `YYYY-MM-DD` 形式でなければならない（MUST）
- エントリは散文。先頭の太字（`**Update**` / `**Creation**` / `**Deprecation**` など）は慣習であり必須ではない

```markdown
# Directory Update Log

## 2026-05-22
* **Update**: 新しい項目への参照を追加
* **Creation**: 新しいサブディレクトリを新設

## 2026-05-15
* **Initialization**: 基礎ディレクトリ構造を作成
```

## Citations（引用）（§8）

本文が外部資料を典拠に主張する場合、末尾の `# Citations` 見出しの下に番号付きで列挙すべき（SHOULD）。

```markdown
# Citations

[1] [公開データセットの発表](https://cloud.google.com/blog/products/...)
[2] [社内 runbook](https://wiki.example.internal/runbook)
```

引用リンクは絶対 URL・バンドル相対パス・`references/` サブディレクトリへのパスのいずれでもよい（MAY）。
`references/` は外部資料を第一級の OKF Concept として写したもの。

## 準拠条件（§9）

バンドルが OKF v0.1 に準拠するのは、以下をすべて満たすとき。

1. 予約ファイル以外のすべての `.md` がパース可能な YAML frontmatter を持つ
2. すべての frontmatter が空でない `type` を含む
3. 予約ファイル（`index.md` / `log.md`）が存在する場合、§6 / §7 の構造に従う

consumer はその他の制約を緩い指針として扱うべき。
特に、次を理由にバンドルを拒否してはならない（MUST NOT）: 任意フィールドの欠落・未知の `type`・未知の追加キー・リンク切れ・`index.md` の不在。
この寛容な消費モデルは意図的で、バンドルが成長・リファクタ・部分的に自動生成されても使い続けられるようにするため。

## 他フォーマットとの関係（§10）

OKF は次の既存パターンに意図的に近い: LLM 向けの Markdown wiki、Obsidian / Notion 等の階層 Markdown + 相互リンク、メタデータをコードと共に置く "metadata as code"。
違いは、相互運用に必要な最小限の規則を**仕様として固定**している点にある。
ツールは規定しない。

## バージョニング（§11）

- 現在のバージョンは v0.1。将来の形式は `<major>.<minor>`
- マイナー: 後方互換な追加（新しい任意フィールド、新しい慣習的見出し）
- メジャー: 破壊的変更（必須フィールドの改名、予約ファイル名の変更）
- バンドルは `okf_version: "0.1"` をルート `index.md` の frontmatter で宣言してよい（MAY）。ここが index.md に frontmatter を置ける唯一の場所
- 宣言バージョンを理解できない consumer は、拒否せず best-effort で消費すべき（SHOULD）

## 参考

- [OKF v0.1 SPEC](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [How the Open Knowledge Format can improve data sharing (Google Cloud Blog)](https://cloud.google.com/blog/ja/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)
- [knowledge-catalog リポジトリ](https://github.com/GoogleCloudPlatform/knowledge-catalog)
