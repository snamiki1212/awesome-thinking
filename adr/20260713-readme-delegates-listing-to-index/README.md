---
type: adr
title: README の一覧列挙は index.md に委ねる（トップ README を除く）
description: "README.md には配下の一覧を列挙せず index.md へのリンクを置き、コアコンテンツであるトップ README の一覧だけを手書きで維持すると定める。"
timestamp: 2026-07-13T13:00:00+09:00
status: Accepted
tags: [adr, okf, ナレッジ管理]
---

# README の一覧列挙は index.md に委ねる（トップ README を除く）

## ステータス

Accepted（採用）

## 背景・課題

[index.md の自動生成](../20260713-generate-okf-index/README.md)を導入した結果、各ディレクトリに「一覧」が2つ存在するようになった。
自動生成される `index.md` と、手書きの README.md の一覧表（ジャンル別 README の項目テーブル・`adr/README.md` の ADR テーブル）である。
両者はほぼ同じ内容（リンク＋短い説明）を持つため、項目を追加するたびに両方を更新する必要があり、手書き側は更新漏れで実体と食い違っていく。

## 決定

- README.md には配下の一覧を列挙しない。一覧は `index.md` に委ね、README.md は概要と `index.md` へのリンクだけを持つ
- 一覧の列挙をしない README.md にも、原則として `index.md` へのリンクを置く（人間の読者を機械可読な目次へ誘導する）
- 例外はトップの README.md だけとする。全項目の一覧はこのリポジトリのコアコンテンツなので、手書きの統合テーブルを維持する
- トップ README の「一覧 →」リンクは、ジャンル別 README ではなく各ディレクトリの `index.md` を指す

## 理由

- 一覧の正体は各ファイルの frontmatter（`title` / `description`）の写しであり、その写しを機械（`index.md`）と手（README.md）で二重に管理すると、手書き側が必ず陳腐化する。`index.md` は CI が鮮度を検査するため、一覧を `index.md` に一本化すれば食い違いが起きない
- トップ README を例外にするのは、全項目の統合テーブル（ジャンル・ひとこと付き）がこのリポジトリの見せたい成果物そのものであり、`index.md` の機械的な形式（ディレクトリ単位・単一リスト）では代替できないため

## 検討した代替案

- **README.md の一覧表も自動生成する**: 食い違いは防げるが、手書きの本文と生成部分が1ファイルに混在し、「index.md は生成物・README.md は手書き」という役割分担が崩れる。一覧が2つ並ぶ冗長も残る
- **ジャンル別 README の一覧表を残し、index.md と併存させる**: 現状維持案。別名（aliases）列など README 側にしかない情報を残せるが、二重管理の更新漏れが解消しない。別名は各詳細ファイルの frontmatter と本文に残っており、一覧から消えても検索性は失われない
- **トップ README の一覧も index.md に委ねる**: 管理は最も単純になるが、統合テーブル（4タイプを1表で見比べる形式）はリポジトリのコアコンテンツであり、ジャンル横断の手書き編集に価値がある。採用しない

## 影響

- ジャンル別 README（`thinking-*/README.md`）・`adr/README.md`・`docs/README.md` から一覧表を撤去し、`index.md` へのリンクに置き換える。項目の別名（aliases）列は一覧から消える（各詳細ファイルには残る）
- 項目追加時のインデックス更新は「トップ README への1行追加」＋「`node scripts/gen-okf-index` の実行」になる。スキル `add-thinking-concept` の手順・チェックリストを更新する
- ADR 追加時に `adr/README.md` の表へ1行足す手順は廃止し、`index.md` の再生成に置き換える（CLAUDE.md の手順を更新する）
