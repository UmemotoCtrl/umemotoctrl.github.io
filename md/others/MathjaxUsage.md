# おすすめなMathJaxの使い方

**更新日：2020/6/19**

## 導入

MathJaxはWeb上で数式を表示するためのデファクトスタンダードなライブラリです．使い方は簡単で，Javascriptが使えるサーバーなら，すぐに実装できます．ver.3になって，読み込みが早くなったようです．早くなったとは言っても，どうしてもややもたつくので，コンテンツのレンダリング後に読み込む方法と，動的なサイトで使う場合の処理について紹介します．

## 使い方

### 最もシンプルな使い方

本家Webの[getting started](https://www.mathjax.org/#gettingstarted)にある，方法は

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

です．一行目はIEへの対応に必要なもので，なくても最近のブラウザなら動きます．この書き方で問題になる（ことがある）のは，１つ目がまずレンダリングをブロック（読み込んで処理するまでhtmlの表示が進まない）することと，tex-mml-chtml.jsのダウンロードが早く終わった時に，レンダリングをブロックする可能性があることです．画面の表示が遅れてしまいます（[参考](https://qiita.com/phanect/items/82c85ea4b8f9c373d684)からの受け売りです）．１つ目についてはdefer指定で解決できるかもしれませんが，asyncの２つ目があるために処理順が問題になる恐れがあるので止めた方が良さそうです．

### 後から読み込む方法

数式を綺麗に表示するのは後で良いのであれば，後から読み込む方法があります．画面読み込み時の処理を書く方法に

```javascript
document.addEventListener('DOMContentLoaded', function() {
// ここにhtmlロード時の処理を書く
});
```

```javascript
window.onload = function() {
// ここにhtmlロード時の処理を書く
};
```

があります．大抵は上の方法で問題ないように思います．下側は画像などの読み込みが優先されるとのこと．これを使って

```javascript
document.addEventListener('DOMContentLoaded', function() {
  	// この中の最後の方に以下をかく
       (function () {
        window.MathJax = {
          tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']]
          },
          svg: {
          fontCache: 'global'
          }
        };
        var scriptIE = document.createElement("script");
        scriptIE.src  = "https://polyfill.io/v3/polyfill.min.js?features=es6";
        document.getElementsByTagName("head")[0].appendChild(scriptIE);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src  = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
        script.async = true;
        document.getElementsByTagName("head")[0].appendChild(script);
      })();
});
```

とすれば，htmlが表示されてからMathJaxのダウンロードと処理が開始することになります．MathJaxは読み込みが終わった時に，ページ内の数式を自動で整形するので，ページ表示後少ししてから数式が整形されていく形になります．document.createElementでタグを作ってheadに追加するプログラムで，headに追加すればブラウザが処理してくれます．冒頭部分は設定です．

### 動的なサイトでの使用法

動的なサイトの場合は，後から追加された数式は自動では処理してくれません．数式を追加した後に，MathJax.typesetPromise()を実行してやれば整形してくれますが，せっかくなので，変更イベントを監視して自動で処理する方法を書きます．typesetPromise()は引数を与えないと全体を，引数を与えるとその引数の部分を整形してくれます．MathJax.typeset()というのもありますが，Promiseを使った方が良いと本家のドキュメントにあった気がします．

```javascript
document.addEventListener('DOMContentLoaded', function() {
  	// この中の最後の方に以下をかく
       (function () {
        window.MathJax = {
          tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']]
          },
          svg: {
          fontCache: 'global'
          }
        };
        var scriptIE = document.createElement("script");
        scriptIE.src  = "https://polyfill.io/v3/polyfill.min.js?features=es6";
        scriptIE.async = false;
        document.getElementsByTagName("head")[0].appendChild(scriptIE);
        var script = document.createElement("script");
        script.src  = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
        script.async = true;
        document.getElementsByTagName("head")[0].appendChild(script);
        script.onload = (function () {
          let observer = new MutationObserver( function () {
            if ( typeof MathJax.typesetPromise != "undefined" ) {
              MathJax.typesetPromise(targetElement.childNodes);
            }
          });
          observer.observe(targetElement, {childList: true});
        })();
      })();
});
```

このプログラムでは，MutationObserverを使って，targetElementの変更を監視します．inputタグだとonchangeイベントが取れますが，divタグなどは取れないので，MutationObserverを使います．{childList: true}を与えないと子要素の変更を検出してくれません．targetElementはdocument.getElementByIdやdocument.querySelectorなどから取得したものを与えることを想定しています．あらかじめ作ってください．

`(function () { ... })();`は即時実行関数で，なくても動きますが内部の変数を他から隔離する意図があります．

onloadでロード時に処理してくれるはずなのですが，typsetPromiseがundefinedになってしまったので，ifで判定しています．おそらくロードはできたが実行はまだなのかと思っています．Mathjaxオブジェクトは設定の時に作っているので存在しているはずです．他の部分にtypsetPromiseを書く場合はMathjaxオブジェクト自体の存在チェックもした方が良いかもしれません．

