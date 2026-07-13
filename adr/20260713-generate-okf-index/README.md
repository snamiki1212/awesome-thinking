---
type: adr
title: OKF の目次 index.md をツールで自動生成する
description: "OKF の予約ファイル index.md を scripts/gen-okf-index で全ディレクトリに自動生成し、CI で最新かを検査する運用を定める。"
timestamp: 2026-07-13T12:00:00+09:00
status: Accepted
tags: [adr, okf, ナレッジ管理]
---

# OKF の目次 index.md をツールで自動生成する

## ステータス

Accepted（採用）

## 背景・課題

[OKF-AT 採用の ADR](../20260713-adopt-okf-at-knowledge-format/README.md) で、予約ファイル `index.md` は「機械・エージェント向けの目次。ツールで自動生成する（手書きしない）」と定めた。
ただし生成ツールは未整備で、「ツールが整うまでは不在でよい」としていた。
その結果、目次は 1 つも存在せず、エージェントはディレクトリの中身を知るために各ファイルの frontmatter を個別に読む必要があった。
また、目次を置くとしても、どのディレクトリに置くか・何を書くか・鮮度をどう保つかが決まっていなかった。

## 決定

生成ツール `scripts/gen-okf-index` を新設し、`index.md` を次の規則で自動生成する。

- Concept を含むすべてのディレクトリ（と、そうしたディレクトリを配下に持つディレクトリ）に `index.md` を置く。例外規則は持たない
- 各エントリは OKF §6 の形式（`* [Title](url) - description`）で書き、リンク先 frontmatter の `title` / `description` を使う。サブディレクトリのエントリは配下の `README.md` から引く
- `index.md` を置くディレクトリには `README.md` を必須とし、欠けていればツールが fail する。サブディレクトリのエントリの表示名と説明は README.md から引くため、これがないと説明の欠けた目次ができる（description の中身は既存の linter が必須検査するので、ツールは存在だけを検査する）
- ルートの `index.md` のみ、OKF §11 に従い frontmatter で `okf_version: "0.1"` を宣言する
- 出力はファイルツリーと frontmatter だけから決まる（日時等を含めず、何度実行しても同じ結果になる）
- 再生成は作業者（主に Claude などのエージェント）が `node scripts/gen-okf-index` で明示的に実行し、CI が `--check` で最新かを検査する

除外パターンは linter と同じ `scripts/lint-okf-at/ignore.txt` を正典として読む。
両ツールで重複するパターン解釈・frontmatter パースは `scripts/lib/okf-md.js` に共通化する。

## 理由

- 目次の実体は frontmatter の写しであり、手で保守すると必ず実体と食い違う。生成物にすれば、正典（各ファイルの frontmatter）だけを保守すればよい
- 生成を決定的・冪等にすることで、CI は「生成し直して差分があるか」だけで鮮度を検査できる
- 配置に例外規則を持たないことで、consumer は「どのディレクトリでも、まず `index.md` を読めば中身がわかる」と単純に振る舞える。OKF-AT 仕様の「理想は各ディレクトリに常に存在する状態」とも一致する

## 検討した代替案

- **エントリが README.md 1 つだけのディレクトリ（ADR の各ディレクトリなど）を生成対象から外す**: 生成されるファイル数は減るが、例外規則が増え、consumer が「このディレクトリに index.md はあるはず」と仮定できなくなる。生成・検査はどちらも自動なので、ファイル数の増加に保守コストはかからないと判断し、一様な配置を選んだ
- **git hook や Claude Code hook で自動再生成する**: コミット時の自動化はできるが、hook が入っていない環境（他のエージェント・手作業）で漏れる。漏れは CI の `--check` で確実に検出できるため、再生成は明示的な実行で足りると判断した
- **ルートの `okf_version` 宣言を省く**: 生成が少し単純になるが、OKF §11 が許す唯一の宣言箇所であり、バンドルの準拠バージョンを機械可読にできる利点が勝る

なお「`index.md` を手書きで保守する」「README.md と統合する」は、OKF-AT 採用の ADR で却下済みのため再検討していない。

## 影響

- 生成された `index.md` がリポジトリ全体にコミットされる（導入時点で 23 件）
- 新しいディレクトリを作るときは、`title` / `description` を持つ `README.md` を必ず添える（導入時点で欠けていた `docs/README.md` は本決定にあわせて作成した）
- Markdown の追加・改名・削除、または frontmatter の `title` / `description` の変更をしたら、`node scripts/gen-okf-index` での再生成が必要になる。忘れると CI（`lint-okf-at` workflow の `--check` ステップ）が fail する
- 生成規則の記述は [docs/okf-at/README.md](../../docs/okf-at/README.md) の「index.md の自動生成」節が正典になる
