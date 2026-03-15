# ポータルサイト 確認結果・依頼反映チェック

## 文字化けの確認と修正

### 修正した箇所
- **index.html（トップ）**: `<title>` / `<meta name="description">`、ナビ（サービス・プロダクト・記事・コラム・お問い合わせ）、ヒーロー（section-eyebrow、lead-text、プロダクトを見る、NSP シリーズ: ストア審査中）を正しい日本語に修正。
- **nsp-link-preview/index.html**: `<title>` の「—」、カルーセル直上・価格セクションの「審査中」ボタンを統一。
- **nsp-onetab/index.html**: `<title>`、OG/Twitterメタ、カルーセル直上・価格セクションの「審査中」ボタンを統一。
- **nsp-lingua-shift/index.html**: `<title>` / `<meta name="description">`、OG/Twitterメタ、カルーセル直上・価格セクションの「審査中」ボタンを統一。

### 保存について
- すべて `StrReplace` で UTF-8 を維持して修正。PowerShell の一括置換は使用していません。

---

## 依頼内容の反映状況

| 依頼内容 | 状態 | 備考 |
|----------|------|------|
| デフォルトを日本語・ボタンで英語 | ✅ 反映 | `lang-manager.js` の `defaultLang = 'jp'`、全HTMLの `<html lang="ja">` |
| 各拡張紹介ページのヘッダーをトップと同じに | ✅ 反映 | サービス→プロダクト→記事・コラム→お問い合わせの順に統一 |
| カルーセル直上・価格の「審査中」ボタン統一 | ✅ 反映 | 3ページとも `<span class="btn btn-white" style="cursor: default; opacity: 0.9;" lang-jp="">審査中</span>` に統一 |
| note リンク用 OG/Twitter メタタグ | ✅ 反映 | 3拡張ページに og:*, twitter:* を追加 |
| 文字化けなし・レイアウト崩れなし | ✅ 修正済 | 上記のとおり修正 |

---

## 確認推奨

1. ブラウザでトップ・各拡張ページを開き、日本語が正しく表示されるか確認してください。
2. ヘッダーの JP/EN 切替で英語表示に変わるか確認してください。
3. 必要に応じて `git add` → `commit` → `push` でリモートに反映してください。
