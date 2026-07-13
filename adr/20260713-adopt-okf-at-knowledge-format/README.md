---
type: adr
title: ナレッジ管理フォーマットに OKF-AT を採用する
description: OKF v0.1 をベースにした独自プロファイル OKF-AT を定義し、リポジトリ全体のナレッジ管理フォーマットとして採用する。
timestamp: 2026-07-13
status: Accepted
tags: [adr, okf, ナレッジ管理]
---

# ナレッジ管理フォーマットに OKF-AT を採用する

## ステータス

Accepted（採用）

## 背景・課題

このリポジトリの Markdown は、思考ツールの詳細ファイル・各ジャンルの README・`docs/`・`adr/` に分散している。
ナレッジは人間だけでなく Claude Code などのエージェントも自動参照する前提だが、メタデータの規約が場所ごとにばらばらだった。

- 思考ツールの詳細ファイルには frontmatter（`title` / `slug` / `type` / `aliases` / `tags`）があるが、要約（`description`）と更新日時（`timestamp`）がなく、一覧を開かないと内容も鮮度も分からない
- ADR の frontmatter は `title` / `date` / `status` のみで、詳細ファイルと項目体系が揃っていない
- README・`docs/` 配下には frontmatter がなく、種別を機械的に判別する共通フィールドがない
- 独自スキーマを都度拡張すると、他のツールやエージェントとの相互運用性が失われる

独自にスキーマを再発明するのではなく、既存のオープン標準である OKF (Open Knowledge Format) を土台に据える。
OKF は Markdown + YAML frontmatter という構成で現状からの移行コストが小さく、必須項目が最小のため段階的に導入できる。
OKF の詳細は [okf-primer.md](../../docs/okf-at/okf-primer.md) を参照。

## 決定

ナレッジ管理フォーマットとして、Google が公開する Open Knowledge Format (OKF) v0.1 をベースに、独自プロファイル **OKF-AT**（AT = awesome-thinking）を定義して採用する。
**リポジトリ全体を 1 つの OKF-AT バンドルとみなす**。

OKF-AT は OKF をそのまま使うのではなく、OKF を土台に検索性・鮮度管理のための必須項目を最小限だけ上乗せしたラッパーである。
OKF の制約は壊さないため、**OKF-AT 準拠なら OKF v0.1 にも準拠する**。
基本方針は OKF 優先。

フィールド定義・予約ファイル・リンク規約などのルール本体は本 ADR には書かない。
[docs/okf-at/](../../docs/okf-at/README.md) を正典（SoT）とし、本 ADR は大方針だけを記録してそこへリンクする。

| ドキュメント | 役割 |
|---|---|
| 本 ADR | 大方針の決定・文脈・論点。why の記録 |
| [docs/okf-at/README.md](../../docs/okf-at/README.md) | OKF-AT の規約（正典・SoT）。フィールド定義など詳細はここ |
| [docs/okf-at/okf-primer.md](../../docs/okf-at/okf-primer.md) | OKF v0.1 の基礎知識・用語の解説 |

大方針として定めるのは次のとおり。

1. OKF v0.1 をベースにした独自プロファイル OKF-AT を定義・採用する（OKF 優先）
2. 適用範囲をリポジトリ全体とする（リポジトリルート = バンドルルート）
3. OKF に必須項目を最小限だけ上乗せする。詳細は [OKF-AT 仕様](../../docs/okf-at/README.md) に委譲する
4. ルールの置き場所を分ける（決定 = 本 ADR / ルール本体 = `docs/okf-at/` / 執行 = linter）
5. ルールを矯正する CI（`scripts/lint-okf-at/` + GitHub Actions）を導入する

## 理由

- 思考ツールの詳細ファイルは既に `type` を持つなど OKF に近い形をしており、`description` / `timestamp` の追加だけで準拠できる。移行コストが小さい
- `type` により種別を機械的に判別でき、エージェントが横断的に検索・参照しやすくなる
- オープン標準に乗ることで、独自スキーマの維持コストを負わず、他ツール・他エージェントへナレッジを持ち運びやすくなる

ルール本体を ADR に書かないのは、ADR が時点の決定記録であり、変わり続けるルールの正典には向かないため。
決定（why）は本 ADR、ルール本体（what）は `docs/okf-at/`、執行は linter と役割を分ける。

## 検討した代替案

- **現状維持（場所ごとのアドホックな frontmatter）**: 項目のばらつきと種別・鮮度の欠落が解決せず、項目数の増加に耐えない。却下
- **完全な独自スキーマ**: 仕様の維持・ツール対応を自前で負い、相互運用性も得られない。車輪の再発明。却下
- **OKF v0.1 をそのまま使う**: OKF の必須は `type` のみで、それだけでは検索性・鮮度管理を担保できない。必須項目を上乗せしたラッパーとして運用する方を採る。ただし上乗せは最小限にとどめ、OKF の制約は壊さない
- **名前を `AT-OKF` / 独自名にする**: 派生元の OKF を先頭に置く `OKF-AT` の方が、OKF の awesome-thinking 向けプロファイルだと名前から読み取りやすい。`OKF-AT` を採る

## 影響

- 既存のすべての対象 Markdown に OKF-AT 必須フィールドを付与する（本 ADR と同時に一括移行し、linter のベースライン allowlist は空で運用を始める）
- ADR の frontmatter は `date` を `timestamp` に置き換え、`type` / `description` / `tags` を加える。`CLAUDE.md` の ADR テンプレートも更新する
- 思考ツールの詳細ファイルのテンプレート（スキル `add-thinking-concept` が正本）に `description` / `timestamp` を加え、新規項目は最初から準拠させる
- 独自スキーマを持つファイル（`.claude/` 配下のスキル定義など）は検査対象外とする。除外パターンの正典は `scripts/lint-okf-at/ignore.txt`
- CI（GitHub Actions の `lint-okf-at`）が PR ごとに準拠を検査する。branch protection での required check 化は別途リポジトリ設定で行う
