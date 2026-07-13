---
type: guideline
title: 変更履歴とリリースの運用
description: "CHANGELOG.md の概要と GitHub Releases の詳細を組み合わせて、利用者に変更を伝える手順を定める。"
timestamp: 2026-07-13T15:00:00+09:00
tags: [運用ルール, 変更履歴, GitHub]
---

# 変更履歴とリリースの運用

## 役割

利用者に影響する変更は [CHANGELOG.md](../CHANGELOG.md) に短く記録する。
このファイルは、何が変わったかを一覧で追うための正本である。

GitHub Releases は、対象バージョンに入った PR・共同作成者・比較リンクを確認する詳細ページとして使う。
GitHub の自動生成リリースノートは `.github/release.yml` のラベル分類を反映する。

この分担により、同じ説明を 2 か所で保守しない。
`CHANGELOG.md` に PR の列挙は書かず、Release に概要の文章を重複して書かない。

## CHANGELOG.md に書く変更

読者がリポジトリを使う、参照する、または構成を理解する際に影響する変更だけを書く。
各項目は「何がどう変わったか」を 1 文で記す。

| 分類 | 記載する変更 |
| --- | --- |
| `Added` | 思考ツール・資料・利用者向け機能を新設した |
| `Changed` | 定義・分類・構成・既存の説明を変更した |
| `Fixed` | 誤り・リンク切れ・参照上の不具合を修正した |
| `Removed` | 読者が参照していた項目・経路を廃止した |

CI・整形だけの変更、内部スクリプトのリファクタリング、リリースノートに不要な作業は書かない。
その PR には GitHub の `skip-changelog` ラベルを付ける。

## Pull Request を作るとき

利用者に影響する変更を含む PR は、`CHANGELOG.md` の `Unreleased` に項目を追加する。
既存の項目と同じ分類に置く。

PR には、変更内容を表すラベルを 1 つ付ける。
GitHub の自動生成リリースノートは、このラベルで変更を分類する。

| ラベル | 対象 |
| --- | --- |
| `content` | 思考ツールの追加・更新 |
| `taxonomy` | 分類・ディレクトリ構成・命名規則の変更 |
| `documentation` | 利用者向けの運用文書・案内の変更 |
| `skip-changelog` | 利用者向け変更履歴から除外する変更 |

初回だけは、リポジトリ管理者が GitHub 上で上のラベルを作成する。
同名の既存ラベルがある場合は、それを使う。

## Release を公開するとき

変更を外部に知らせる単位ごとに GitHub Release を公開する。
日付と連番を組み合わせたタグ `vYYYY.M.D-N` を使う。
`N` はその日の公開回数を 1 から数える。

1. `CHANGELOG.md` の `Unreleased` の下に `## [vYYYY.M.D-N] - YYYY-MM-DD` を追加し、公開する項目を移す。空の `Unreleased` は残す。
2. この変更を `main` にマージする。
3. GitHub の `Releases` で `Draft a new release` を選び、同名のタグを `main` から作る。
4. `Generate release notes` を実行する。
5. 生成内容が PR の分類・除外に沿っていることを確認し、公開する。

タグは、確定した `CHANGELOG.md` を含むコミットを指す。
公開後に `CHANGELOG.md` だけを遡及修正する必要がある場合は、理由を PR に残す。
