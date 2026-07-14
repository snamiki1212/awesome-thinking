---
type: guideline
title: 思考ツールの ID
description: "思考ツールを一意に参照する不変の連番 ID の形式、採番、表示、検査の規則を定める。"
timestamp: 2026-07-13T16:30:00+09:00
tags: [運用ルール, ID, 思考ツール]
---

# 思考ツールの ID

## 目的

思考ツールの名前・スラッグ・タイプ・配置が変わっても、同じ項目を一意に参照できるようにする。
変更履歴、ADR、Issue、外部の会話では、この ID を項目の識別子として使える。

## 形式と適用範囲

ID は `AT-0001` から始まる形式とする。
`AT-` は awesome-thinking を表し、数字部は 4 桁以上の十進連番とする。
`AT-9999` の次は `AT-10000` とする。

対象は、`thinking-mental-models/`、`thinking-frameworks/`、`thinking-methods/`、`thinking-skills/` 配下の詳細ファイルである。
各ファイルの frontmatter に `id` を 1 つだけ置く。

## 採番と変更

新しい項目には、既存 ID の最大値より 1 大きい番号を付ける。
削除した項目の番号は再利用しない。

項目名・スラッグ・タイプ・ディレクトリを変更しても ID は変更しない。
ID の欠落、形式違反、重複は `node scripts/lint-okf-at` が検査する。

## 表示

トップ `README.md` の一覧と、各ディレクトリの自動生成 `index.md` に ID を表示する。
一覧の ID は frontmatter の `id` から引くため、表示を手で更新しない。
