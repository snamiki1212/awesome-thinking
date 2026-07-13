---
type: adr
title: 4タイプのディレクトリ名を thinking- prefix で統一する
description: "メインコンテンツの4タイプを一覧で判別できるよう、ディレクトリ名を thinking- prefix で統一すると定めた記録。"
timestamp: 2026-07-13
status: Accepted
tags: [adr]
---

# 4タイプのディレクトリ名を thinking- prefix で統一する

## ステータス
Accepted（`frameworks/` → `thinking-frameworks/`、`mental-models/` → `thinking-mental-models/` にリネーム）

## 背景・課題

トップ直下には、メインコンテンツである4タイプのディレクトリと、メタなディレクトリ（`adr/`・`docs/`・`scripts/`）が同居している。
一覧はアルファベット順に表示されるため、両者が交互に混ざり、どれがメインコンテンツかパッと見て判別できない。

```
adr/
docs/
frameworks/          ← コンテンツ
mental-models/       ← コンテンツ
scripts/
thinking-methods/    ← コンテンツ
thinking-skills/     ← コンテンツ
```

コンテンツを親ディレクトリでまとめる案（`thinking/<type>/`）は、[adr/20260604-flat-directory-structure](../20260604-flat-directory-structure/README.md) で却下済みである（パスが1段深くなる・リポジトリ名との同義反復）。
フラット構成を維持したまま、一覧上でコンテンツを判別できる手段が必要になった。

## 決定

4タイプのディレクトリ名を **`thinking-` prefix で統一する**。

| 旧 | 新 |
| --- | --- |
| `frameworks/` | `thinking-frameworks/` |
| `mental-models/` | `thinking-mental-models/` |
| `thinking-methods/` | 変更なし |
| `thinking-skills/` | 変更なし |

## 理由

- prefix はアルファベット順のソートで4タイプを1つのブロックにまとめる。メタが前・コンテンツが後ろに並び、一覧を見るだけで境界がわかる。
- 階層は増やさないため、フラット構成 ADR の却下理由（パスが深くなる）には抵触しない。同 ADR が示した「本質的に意味を持つ軸は4タイプの違い」という整理も、トップ直下に4つ並ぶ形のまま保たれる。
- 「thinking はリポジトリ名との同義反復」という指摘は prefix にも当てはまるが、prefix の役割は意味の追加ではなくコンテンツの目印である。既に `thinking-methods/`・`thinking-skills/` がこの形を持つため、統一は新たな冗長の追加というより不揃いの解消に近い。
- リネームが2件で済み、参照更新の影響範囲が最小になる。

## 検討した代替案

- **案A: `thinking/` 親ディレクトリでまとめる** → 却下。[adr/20260604-flat-directory-structure](../20260604-flat-directory-structure/README.md) で却下済み。
- **案B: `at-` prefix（AT = awesome-thinking。OKF-AT と同じ略称）** → 却下。短く、略称は OKF-AT で確立している。しかし初見の読者には意味が取れず、`at-thinking-methods/` では略称に含まれる thinking と語が二重になる。
- **案C: リネームせず README のディレクトリマップで説明する** → 却下。リンク切れのリスクはゼロだが、「一覧をパッと見て判別できる」という目的そのものを満たさない。
- **案D: `mental-models` を `thinking-models` に縮め、4つとも「thinking-＋1ワード」に揃える** → 却下。ID の見た目は最も揃うが、「mental model」という確立した呼称からスラッグが離れる。「リポジトリ内の収まりの綺麗さ」を命名の根拠にしない方針（[adr/20260608-prefer-established-general-naming](../20260608-prefer-established-general-naming/README.md)）に反する。LLM の reasoning model（thinking model）を連想させる多義性もある。
- **案E: `mental-models` をグループ名から取って `thinking-lenses` にする** → 却下。レンズ＝メンタルモデルは 1:1 なので成立はするが、他の3つがタイプ名なのにこれだけグループ名になり、階層の呼び分けと食い違う。

## 影響

- `frameworks/` と `mental-models/` をリネームし、リポジトリ内の参照（トップ README・CLAUDE.md・`docs/taxonomy.md`・`docs/okf-at/`・skill `add-thinking-concept`）を更新する。
- 過去の ADR 本文に残る旧ディレクトリ名は、歴史的記録としてそのまま書き換えない。
- 旧パスへの外部リンク（ブックマーク・他リポジトリからの参照）はリンク切れになる。
- 今後タイプを追加する場合も、ディレクトリ名は `thinking-` prefix を付ける。
