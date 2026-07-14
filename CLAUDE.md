---
type: guideline
title: CLAUDE.md（エージェント向け作業方針）
description: "このリポジトリで作業する際の方針を Claude などのコーディングエージェントに伝える指示書。"
timestamp: 2026-07-13T16:30:00+09:00
tags: [運用ルール]
---

# CLAUDE.md

このファイルは、このリポジトリで作業する際の方針を Claude（および各種コーディングエージェント）に伝えるためのものです。

## このリポジトリについて

「思考」に関する知識を網羅的に一覧管理するためのリポジトリです。
メンタルモデル・思考フレームワーク・思考法・思考術などを収集し、それぞれの違いを定義したうえで、項目ごとに Markdown で整理します。

## 用語

**階層と呼称（3段）**: 思考の知識は次の3階層で呼び分ける。包含関係は **思考ツール ⊃ グループ ⊃ タイプ**。数えるときは「2グループ」「4タイプ」と言う。経緯: [adr/20260604-tier-terminology](./adr/20260604-tier-terminology/README.md)

| 階層 | 呼称 | 数 | 中身 |
| --- | --- | --- | --- |
| 総称 | 思考ツール | 1 | 4つすべてを束ねる総称 |
| 中間 | グループ | 2 | 🔍 レンズ ／ ⚙️ プロセス |
| 最小 | タイプ | 4 | 🧠 メンタルモデル ／ 🧩 思考フレームワーク ／ 🌊 思考法 ／ ⚡ 思考術 |

- **思考ツール（thinking tools）**: 4タイプ（🧠 メンタルモデル / 🧩 思考フレームワーク / 🌊 思考法 / ⚡ 思考術）を束ねて指す総称。文章中で4つをまとめて言いたいときはこの語を使う。
  - **4タイプの確定絵文字**: 🧠 メンタルモデル / 🧩 思考フレームワーク / 🌊 思考法 / ⚡ 思考術。一覧・見出し・図ではこの絵文字で統一する。経緯: [adr/20260604-type-emoji](./adr/20260604-type-emoji/README.md)
  - リポジトリ全体の呼称としての `thinking` / 「思考」とは役割が異なる（全体の総称＝thinking、4タイプを束ねる中間概念＝思考ツール）。
  - 経緯: [adr/20260604-umbrella-term-thinking-tools](./adr/20260604-umbrella-term-thinking-tools/README.md)
- **🔍 レンズ / ⚙️ プロセス**: 思考ツールを2つに大別した中間階層＝**グループ**（1＋3）。4タイプの違いを説明するときの大枠として使い、図・見出しではこの絵文字で統一する。
  - **🔍 レンズ**＝🧠 メンタルモデル … 状況を**見る・捉える**静的な視点（手順なし／別軸）。
  - **⚙️ プロセス**＝🌊 思考法 ⊃ 🧩 フレームワーク ⊃ ⚡ 思考術 … 実際に**考えを進める・手を動かす**道具（抽象→具体の入れ子）。
  - 経緯: [adr/20260604-lens-vs-process-grouping](./adr/20260604-lens-vs-process-grouping/README.md)

## 言語方針（最重要）

- **このリポジトリのメイン言語は日本語です。**
- **本文・見出し・説明・README・コミットメッセージ・PR 文面などは、すべて日本語で生成してください。**
- 「アプリ ID」にあたる **ファイル名・ディレクトリ名（スラッグ）は英語（kebab-case）** とします。
  - 理由: URL・git・各種ツールでの文字化けや非互換を避けるため。
  - 例: `thinking-mental-models/first-principles.md`（本文タイトルは「第一原理思考」）
- 4タイプのディレクトリ名は **`thinking-` prefix で統一**します（メインコンテンツを一覧で判別するため）。経緯: [adr/20260713-thinking-prefix-for-type-directories](./adr/20260713-thinking-prefix-for-type-directories/README.md)
- スラッグには対応する日本語名を、各 Markdown のフロントマターと本文タイトルで必ず併記してください。
- 英語名など多言語の正式名は、フロントマターの `titles`（言語コード → 名称のマップ。例: `titles: { en: First Principles Thinking }`）で管理します。経緯: [adr/20260713-titles-frontmatter-for-multilingual-names](./adr/20260713-titles-frontmatter-for-multilingual-names/README.md)

## 思考ツールの ID

思考ツールの詳細ファイルには、変更しない通し番号の `id` を付ける。
採番・変更禁止・一覧表示の規則は [docs/thinking-ids.md](./docs/thinking-ids.md) を参照する。

## ディレクトリ構成

タイプ（思考の種類）ごとにディレクトリを分けます。種類の定義そのものが、ディレクトリの境界になります。

この節が示すのは配置の規則だけです。
いまあるファイルの網羅的な一覧は、この節には書かず、各ディレクトリの `index.md`（自動生成の目次）を参照してください。経緯: [adr/20260713-rules-not-inventory](./adr/20260713-rules-not-inventory/README.md)

```
README.md                  # トップの一覧（手書きで維持するコアコンテンツ）
index.md                   # 機械・エージェント向けの目次（自動生成。Concept を含む各ディレクトリに置く）
thinking-frameworks/       # 思考フレームワーク
  README.md                # ジャンルの概要（一覧は index.md に委ねる）
  index.md                 # 一覧（自動生成）
  <slug>.md                # 各項目の詳細（英語 kebab-case）
thinking-mental-models/    # メンタルモデル
thinking-methods/          # 思考法
thinking-skills/           # 思考術
adr/                       # 意思決定の記録（ADR）
  yyyymmdd-<name>/         # 1意思決定 = 1ディレクトリ
    README.md              # 決定の本文
docs/                      # 運用ドキュメント（分類の定義・OKF-AT 規約など）
scripts/                   # 支援ツール（OKF-AT linter・index.md ジェネレータ）
CLAUDE.md                  # 執筆・運用方針（このファイル）
```

各タイプの定義は `docs/taxonomy.md` を正本とします。新しい項目を追加する前に必ず参照してください。

## ナレッジ管理フォーマット（OKF-AT）

リポジトリ内の Markdown は、OKF v0.1 ベースの独自プロファイル **OKF-AT** の frontmatter 規約に従います。
規約の正典は [`docs/okf-at/README.md`](./docs/okf-at/README.md)、採用の経緯は [adr/20260713-adopt-okf-at-knowledge-format](./adr/20260713-adopt-okf-at-knowledge-format/README.md) を参照してください。
準拠は CI（`lint-okf-at`）で検査されます。ローカルでは `node scripts/lint-okf-at` で確認できます。

各ディレクトリの `index.md`（OKF の目次）は自動生成物です。手で編集せず、Markdown の追加・改名・削除や frontmatter の `title` / `description` を変更したら `node scripts/gen-okf-index` で再生成してください（最新かどうかは CI が検査します）。`index.md` を置くディレクトリには、サブディレクトリの説明の引用元となる `README.md` が必須です（欠けていると同ツールが fail します）。経緯: [adr/20260713-generate-okf-index](./adr/20260713-generate-okf-index/README.md)

## 一覧と詳細の関係

- **一覧（インデックス）**: 各ディレクトリの `index.md`（自動生成）が一覧です。README.md は概要だけを書き、一覧の列挙はせず `index.md` へのリンクを置きます（`index.md` 相当の列挙を README に書くと二重管理になるため）。経緯: [adr/20260713-readme-delegates-listing-to-index](./adr/20260713-readme-delegates-listing-to-index/README.md)
- **例外はトップ `README.md` だけ**: 全項目の一覧はこのリポジトリのコアコンテンツなので、トップ `README.md` は手書きの統合テーブルを持ち続けます。
- **詳細**: 各項目は、そのジャンルのディレクトリ配下の個別 Markdown ファイルに詳細を記載します。

## 項目を追加するときの手順

項目追加の **詳細な手順とテンプレートは、スキル `add-thinking-concept`**（`.claude/skills/add-thinking-concept/SKILL.md`）を正本とします。重複管理を避けるため、ここには手順・テンプレートを再掲しません。

- エージェント（Claude Code 等）で作業する場合は、「〇〇を追加したい」と依頼すれば自動で参照されます。
- 人が手作業で追加する場合も、上記 SKILL.md の手順とテンプレートに従ってください。

判断の拠り所（こちらは本ファイル／docs 側が正本）:

- タイプ（どのディレクトリか）の判定基準 → `docs/taxonomy.md`
- 言語・命名の方針 → 本ファイル上部「言語方針」

> この「手順・テンプレートの置き場所をスキルに集約する」という決定の経緯は [`adr/20260604-procedure-in-skill/`](./adr/20260604-procedure-in-skill/README.md) を参照。

## 執筆スタイル

- 専門用語には初出時に短い説明を添える。
- 出典が明確な概念（提唱者・書籍など）は分かる範囲で触れる。ただし不確かな出典を断定しない。
- 項目名は、特定の著者・一冊の本の造語より、その分野で一般的・確立した呼称を優先する。出典は単一に依存せず、特定著者の整理は「整理の一つ」として明示する。命名・採否は概念自体の一般性・正確さ・出典で決め、「既存項目との対比が綺麗」などリポジトリ内の収まりを根拠にしない。経緯: [adr/20260608-prefer-established-general-naming](./adr/20260608-prefer-established-general-naming/README.md)
- 過度に長くせず、1項目は読み切れる分量に保つ。

## 意思決定の記録（ADR）

このリポジトリの構成・方針・分類などに関する **意思決定は必ず `adr/` に記録** します。
「なぜそう決めたか」を後から追えるようにするための仕組みです（ADR = Architecture Decision Record）。

### 何を記録するか

- ディレクトリ構成・分類（タイプ定義）の変更や、その変更を見送った判断
- 命名規則・テンプレート・運用ルールの新設や変更
- 「採用しなかった案」とその理由（却下・NG の判断も記録する）

軽微な誤字修正や、単なる項目追加（既存ルールに沿うもの）は対象外です。

### 置き場所と命名

- 1つの意思決定ごとに **`adr/yyyymmdd-<name>/` ディレクトリ** を作る。
  - `yyyymmdd` は決定日（例: `20260602`）。`<name>` は英語 kebab-case の短い識別子。
  - 例: `adr/20260602-no-layer-numbering/`
- 本文は そのディレクトリ直下の **`README.md`** に書く。
  - 関連する図・補足資料があれば同じディレクトリ内に置く（`**` 配下に自由に追加してよい）。
- 一度確定した ADR は原則として書き換えず、方針が変わった場合は新しい ADR を起こし、`Status` を `Superseded by <新ADR>` に更新する。

### ADR のテンプレート

```markdown
---
type: adr
title: 日本語タイトル
description: "決定の1文要約"
timestamp: yyyy-mm-dd
status: Accepted | Rejected | Superseded by <adr-slug>
tags: [adr]
---

# 日本語タイトル

## ステータス
Accepted（採用） / Rejected（却下） / Superseded（後継ADRに置換）

## 背景・課題
（なぜこの判断が必要になったか）

## 決定
（何を決めたか。1〜数文で端的に）

## 理由
（その決定に至った根拠）

## 検討した代替案
（採用しなかった案と、却下した理由）

## 影響
（この決定によって変わること・今後の運用）
```

### 手順

1. `adr/yyyymmdd-<name>/README.md` を上記テンプレートで作成する。
2. `node scripts/gen-okf-index` を実行し、一覧（`adr/index.md` ほか）を再生成する。
