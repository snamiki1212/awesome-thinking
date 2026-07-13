---
title: MECE
id: AT-0008
slug: mece
type: framework
aliases: [Mutually Exclusive and Collectively Exhaustive, モレなくダブりなく]
description: "物事を「漏れなく、重複なく」に分けて整理するための原則。"
timestamp: 2026-07-13T00:00:00+09:00
tags: [分析, 問題解決]
---

# MECE（モレなく・ダブりなく）

## 一言でいうと
物事を「漏れなく、重複なく」に分けて整理するための原則。

## 定義
Mutually Exclusive（互いに重ならない）かつ Collectively Exhaustive（全体として漏れがない）の頭字語。情報や要素を分類するときの「良い分け方」の条件を示す。

## 使いどころ
- 課題や選択肢を整理して全体像を押さえたいとき。
- ロジックツリーや各種フレームワークの土台として。

## 使い方・手順
1. 分類したい全体（母集合）を明確にする。
2. 切り口（軸）を1つ選ぶ。
3. その軸で要素に分け、重複がないか・漏れがないかを確認する。
4. 「その他」を最後に置くと漏れを防ぎやすい。

## 例
- 顧客を「新規／既存」で分ける → 重複なし・漏れなし（MECE）。
- 「20代／会社員」で分ける → 軸が混在して重複が起きる（MECEでない）。
- 年齢を「〜19／20〜39／40〜59／60以上」で区切る → 漏れも重複もない（MECE）。

## 注意点・落とし穴
- 完璧なMECEに固執しすぎると時間を浪費する。目的に対して十分なら良い。
- 細かく分けすぎて本質を見失わない。

## 関連
- [logic-tree](./logic-tree.md)（ロジックツリー）— MECEに分解して作る。
- [decision-matrix](./decision-matrix.md)（意思決定マトリクス）— 評価項目を MECE に立てると比較の質が上がる。
- [logical-thinking](../thinking-methods/logical-thinking.md)（ロジカルシンキング）
