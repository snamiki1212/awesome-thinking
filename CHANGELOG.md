---
type: changelog
title: 変更履歴
description: "利用者に影響する変更を概要で記録する、このリポジトリの変更履歴。"
timestamp: 2026-07-13T16:00:00+09:00
tags: [運用ルール, 変更履歴]
---

# 変更履歴

このファイルは、利用者が追うべき変更を概要で記録します。
PR 単位の詳細は、各バージョンの [GitHub Releases](https://github.com/snamiki1212/awesome-thinking/releases) を参照してください。
記載基準と公開手順は [docs/changelog.md](./docs/changelog.md) に定めます。

## [Unreleased]

### Changed

- 変更履歴と GitHub Releases を併用する運用を導入した。

## [v0.1.0] - 2026-07-13

この版は、変更履歴を導入する直前の収録内容を基準として遡及記録したものである。

### Added

- 思考ツールを、🧠 メンタルモデル・🧩 思考フレームワーク・🌊 思考法・⚡ 思考術の4タイプとして整理した。
- 4タイプを、🔍 レンズと⚙️ プロセスの2グループとして位置付けた。

#### 🧠 メンタルモデル

- [AT-0001: 第一原理思考](./thinking-mental-models/first-principles.md) を収録した。
- [AT-0002: 機会費用](./thinking-mental-models/opportunity-cost.md) を収録した。
- [AT-0003: 複利](./thinking-mental-models/compound-interest.md) を収録した。
- [AT-0004: 地図は領土ではない](./thinking-mental-models/map-is-not-the-territory.md) を収録した。
- [AT-0005: パレートの法則](./thinking-mental-models/pareto-principle.md) を収録した。
- [AT-0006: センターピン](./thinking-mental-models/center-pin.md) を収録した。

#### 🧩 思考フレームワーク

- [AT-0007: SWOT分析](./thinking-frameworks/swot.md) を収録した。
- [AT-0008: MECE](./thinking-frameworks/mece.md) を収録した。
- [AT-0009: ロジックツリー](./thinking-frameworks/logic-tree.md) を収録した。
- [AT-0010: 5W1H](./thinking-frameworks/5w1h.md) を収録した。
- [AT-0011: PDCAサイクル](./thinking-frameworks/pdca.md) を収録した。
- [AT-0012: KPT](./thinking-frameworks/kpt.md) を収録した。
- [AT-0013: なぜなぜ分析](./thinking-frameworks/5-whys.md) を収録した。
- [AT-0014: KWLチャート](./thinking-frameworks/kwl-chart.md) を収録した。
- [AT-0015: 意思決定マトリクス](./thinking-frameworks/decision-matrix.md) を収録した。

#### 🌊 思考法

- [AT-0016: ロジカルシンキング](./thinking-methods/logical-thinking.md) を収録した。
- [AT-0017: クリティカルシンキング](./thinking-methods/critical-thinking.md) を収録した。
- [AT-0018: ラテラルシンキング](./thinking-methods/lateral-thinking.md) を収録した。
- [AT-0019: システム思考](./thinking-methods/systems-thinking.md) を収録した。
- [AT-0020: デザイン思考](./thinking-methods/design-thinking.md) を収録した。
- [AT-0021: 仮説思考](./thinking-methods/hypothesis-thinking.md) を収録した。
- [AT-0022: イシュー思考](./thinking-methods/issue-driven.md) を収録した。
- [AT-0023: ネガティブ・ケイパビリティ](./thinking-methods/negative-capability.md) を収録した。
- [AT-0024: エッセンシャル思考](./thinking-methods/essentialism.md) を収録した。
- [AT-0025: 不確実性マネジメント](./thinking-methods/uncertainty-management.md) を収録した。
- [AT-0026: アナロジー思考](./thinking-methods/analogical-reasoning.md) を収録した。

#### ⚡ 思考術

- [AT-0027: 抽象化と具体化](./thinking-skills/abstraction-and-concretization.md) を収録した。
- [AT-0028: ゼロベース思考](./thinking-skills/zero-based-thinking.md) を収録した。
- [AT-0029: 悪魔の代弁者](./thinking-skills/devils-advocate.md) を収録した。
- [AT-0030: リフレーミング](./thinking-skills/reframing.md) を収録した。
- [AT-0031: 極端思考](./thinking-skills/extreme-case-thinking.md) を収録した。
- [AT-0032: 命名](./thinking-skills/naming.md) を収録した。
- [AT-0033: 思考実験](./thinking-skills/thought-experiment.md) を収録した。
- [AT-0034: 虫の目・鳥の目・魚の目](./thinking-skills/birds-worms-fish-eye.md) を収録した。
- [AT-0035: アクティブリコール](./thinking-skills/active-recall.md) を収録した。

#### 運用・構成

- 各タイプの定義・収録要件・収録対象外の判断を文書化した。
- 分類・命名・ディレクトリ構成に関する判断を ADR として記録した。
- Markdown のメタデータ規約として OKF-AT を導入した。
- `index.md` を自動生成し、OKF-AT 準拠と目次の最新性を GitHub Actions で検査する仕組みを導入した。
