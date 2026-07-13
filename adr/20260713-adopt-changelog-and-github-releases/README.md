---
type: adr
title: CHANGELOG.md と GitHub Releases を併用する
description: "利用者向けの概要は CHANGELOG.md、PR 単位の詳細は GitHub Releases に分けて変更を公開する。"
timestamp: 2026-07-13T15:00:00+09:00
status: Accepted
tags: [adr, 運用ルール, 変更履歴, GitHub]
---

# CHANGELOG.md と GitHub Releases を併用する

## ステータス

Accepted（採用）

## 背景・課題

このリポジトリには、利用者が変更を時系列で追う入口がない。
Git のコミット履歴と Pull Request は変更の経緯を調べるには使えるが、複数コミットにまたがる変更の概要を知るには粒度が細かすぎる。

思考ツールの追加、分類の変更、文書構造の変更を利用者が見落とさずに把握できる変更履歴が必要である。
一方で、概要と PR 一覧を同じ Markdown に転記すると、二重管理になり更新漏れが起きる。

## 決定

利用者向けの変更概要はリポジトリルートの `CHANGELOG.md` に記録する。
各バージョンの PR 一覧・共同作成者・比較リンクは GitHub Releases の自動生成リリースノートに任せる。

Release の自動生成リリースノートは `.github/release.yml` で設定する。
PR に `content`、`taxonomy`、`documentation`、`skip-changelog` のラベルを付け、前者 3 つで表示を分類し、最後の 1 つで不要な変更を除外する。

運用の正典は [docs/changelog.md](../../docs/changelog.md) とする。
この ADR は、採用した理由と却下した方法だけを記録する。

## 理由

`CHANGELOG.md` はリポジトリを開いた利用者が見つけやすく、各バージョンで何が変わったかを短時間で確認できる。
記載を利用者への影響に絞ることで、コミット履歴より高い粒度で変更を説明できる。

GitHub Releases はタグを基準に変更範囲を固定し、生成時点の PR と比較リンクを残せる。
GitHub は自動生成リリースノートでマージ済み PR・共同作成者・完全な変更ログへのリンクを出力し、`.github/release.yml` のラベルでカテゴリを定義できる。[GitHub Docs: 自動生成リリースノート](https://docs.github.com/ja/repositories/releasing-projects-on-github/automatically-generated-release-notes)

概要と詳細を分ければ、`CHANGELOG.md` は短く保てる。
PR の列挙は GitHub が生成するため、同じ一覧を手で維持する必要がない。

## 検討した代替案

- **Git のコミット履歴だけを使う**：変更の正確な履歴は得られるが、利用者が複数のコミットや PR を読んで概要を組み立てる必要がある。概要を追う目的を満たさないため却下した。
- **GitHub Releases の自動生成リリースノートだけを使う**：PR 一覧をすぐに作れるが、PR の題名と一覧だけではリポジトリ全体の変化を短く把握しにくい。利用者向けの要約を残せないため却下した。
- **CHANGELOG.md だけを使う**：概要は残せるが、変更の根拠となる PR・比較リンク・共同作成者を手で転記することになる。GitHub が生成できる詳細を重複管理するため却下した。
- **各 PR の本文をそのまま CHANGELOG.md に集約する**：変更理由まで残せるが、履歴が長くなり、利用者が概要を追えなくなる。PR 本文は GitHub に残るため却下した。
- **OKF の予約ファイル `log.md` を変更履歴に使う**：OKF は `log.md` を更新履歴として予約しているが、GitHub で一般的な `CHANGELOG.md` より発見しにくい。このリポジトリでは利用者への案内を優先して `CHANGELOG.md` を採る。

## 影響

- 利用者に影響する PR は `CHANGELOG.md` の `Unreleased` を更新する。
- Release を公開するときは、`Unreleased` の下へ日付ベースのタグを確定し、その変更を含む `main` のコミットから GitHub の自動生成リリースノートを公開する。
- リポジトリ管理者は GitHub 上で、運用に必要なラベルを初回だけ作成する。
- GitHub CLI の認証が失効しているため、この決定の適用時点ではラベル作成と初回 Release の公開を行わない。
