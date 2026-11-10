# 静的サイト生成の使い方

このサイトは、カスタムNode.jsビルダーでMarkdownファイルをHTMLに変換する静的サイト生成システムです。


## 構成概要

| ファイル・ディレクトリ | 役割 |
|---|---|
| `md/*.md` | 記事のMarkdownソース |
| `index.html` | サイト共通テンプレート（ヘッダ・ナビ・フッタ） |
| `js/build.js` | ビルドスクリプト。mdを読み込みHTMLを生成 |
| `js/render.js` | Markdownレンダラ。marked + KaTeX + highlight.js |
| `js/serve.js` | ローカルプレビューサーバ |
| `docs/` | ビルド成果物の出力先（GitHub Pagesで公開） |


## 環境構築

Node.js 22以上が必要です。リポジトリのルートで以下を実行してください。

```bash
npm ci
```


## 記事の書き方

1. `md/` ディレクトリに `.md` ファイルを作成します。
2. Markdown内のリンクは `.md` ファイルへの相対パスで書きます。ビルド時に自動でページURLに変換されます。

```markdown
[研究業績リスト](researchworks.md)
```

3. 画像やPDFへのリンクはリポジトリルートからの相対パスで記述します。

```markdown
![写真](./img/photo.jpg)
```

4. 数式はKaTeX記法が使えます。

```markdown
インライン: $E = mc^2$

ディスプレイ:
$$
\int_a^b f(x) \, dx = F(b) - F(a)
$$
```

5. コードブロックには言語指定を付けるとシンタックスハイライトが適用されます。

```markdown
```javascript
console.log("hello");
```
```


## ビルド

以下のコマンドで `md/*.md` をHTMLに変換し、`docs/` に出力します。

```bash
npm run build
```

ビルドの流れ:
- `index.html` をテンプレートとして読み込む
- `md/*.md` を1つずつパースし、記事本文を生成
- テンプレート内のプレースホルダに記事本文を挿入
- `docs/<記事名>/index.html` として出力


## ローカルプレビュー

ビルドとプレビューサーバの起動を同時に行います。

```bash
npm start
```

ブラウザで http://localhost:3000 を開くと確認できます。


## テスト・検証

リンク切れやサイトマップURLの検証を行います。

```bash
npm run check
```


## デプロイ

`master` ブランチにプッシュすると、`.github/workflows/static.yml` により自動でビルド＆デプロイされます。

GitHub Pagesの設定で **Source** を **GitHub Actions** にしておいてください。


## スタイル調整

`js/render.js` の `decorateArticle` 関数で、生成されたHTML要素にBulmaのCSSクラスを付与しています。見た目を変えたい場合はここを編集してください。
