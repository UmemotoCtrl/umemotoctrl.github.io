# おすすめなMathJax3の使い方

## 導入

MathJaxはWeb上で数式を表示するためのデファクトスタンダードなライブラリです．使い方は簡単で，Javascriptが使えるサーバーなら，すぐに実装できます．ver.3になって，読み込みが早くなったようです．早くなったとは言っても，どうしてもややもたつくので，コンテンツのレンダリング後に読み込む方法と，動的なサイトで使う場合の処理やもろもろの設定について紹介します．

## 使い方

### 最もシンプルな使い方

本家Webの[getting started](https://www.mathjax.org/#gettingstarted)にある方法は

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
```

です．一行目はIEへの対応に必要なもので，なくても最近のブラウザなら動きます．この書き方で問題になる（ことがある）のは，１つ目がまずレンダリングをブロック（読み込んで処理するまでhtmlの表示が進まない）することと，`tex-svg.js`のダウンロードが早く終わった時に，レンダリングをブロックする可能性があることです．画面の表示が遅れてしまいます（[参考](https://qiita.com/phanect/items/82c85ea4b8f9c373d684)からの受け売りです）．１つ目についてはdefer指定で解決できるかもしれませんが，asyncの２つ目があるために処理順が問題になる恐れがあるので止めた方が良さそうです．

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

があります．大抵は上の方法で問題ないように思います．下側は画像などの読み込みが優先されるとのこと．これを使って，[公式ドキュメント](http://docs.mathjax.org/en/latest/web/typeset.html)にもあるように

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

とすれば，htmlが表示されてからMathJaxのダウンロードと処理が開始することになります．MathJaxは読み込みが終わった時に，ページ内の数式を自動で整形するので，ページ表示後少ししてから数式が整形されていく形になります．`document.createElement`でタグを作ってheadに追加するプログラムで，headに追加すればブラウザが処理してくれます．冒頭部分は設定です．

### 動的なサイトでの使用法

動的なサイトの場合は，後から追加された数式は自動では処理してくれません．数式を追加した後に，`MathJax.typesetPromise()`を実行してやれば整形してくれますが，せっかくなので，変更イベントを監視して自動で処理する方法を書きます．`typesetPromise()`は引数を与えないと全体を，引数を与えるとその引数の部分を整形してくれます．`MathJax.typeset()`というのもありますが，Promiseを使った方が良いと本家のドキュメントにあった気がします．

```javascript
document.addEventListener('DOMContentLoaded', function() {
  	// この中の最後の方に以下をかく
       (function () {
        window.MathJax = {
          startup: {
            pageReady: function () {
              let observer = new MutationObserver( function () {
                  MathJax.texReset();
                  MathJax.typesetPromise(targetElement.childNodes);
              });
              observer.observe(targetElement, {childList: true});
              return MathJax.startup.defaultPageReady();
            },
          },
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
      })();
});
```

このプログラムでは，MutationObserverを使って，`targetElement`の変更を監視します．inputタグだと`onchange`イベントが取れますが，divタグなどは取れないので，MutationObserverを使います．`{childList: true}`を与えないと子要素の変更を検出してくれません．`targetElement`は`document.getElementById`や`document.querySelector`などから取得したものを与えることを想定しています．あらかじめ作ってください．`MathJax.texReset()`は上書き時にラベルが重複登録されてエラーが出ることへの処理，`typesetPromise`は与えた要素のレンダリング指示です．

`(function () { ... })();`は即時実行関数で，なくても動きますが内部の変数を他から隔離する意図があります．

`pageReady`はMathJaxオブジェクトが生成された時に呼び出されます．`script.onload`で関数を呼び出すこともできますが，`pageReady`はオブジェクト生成後に呼び出されるので扱いやすい．`MathJax.startup.defaultPageReady()`は標準の処理で，`typeset()`を呼び出します．他の部分に`typsetPromise`を書く場合はMathjaxオブジェクト自体の存在チェックやメソッドの存在チェックをする必要が出てきます．

[公式ドキュメント](http://docs.mathjax.org/en/latest/options/index.html)に詳しくありますが，便利そうな設定を紹介します．

```javascript
        window.MathJax = {
          startup: {
            elements: null,
            typeset: true,
            ready: Startup.defaultReady.bind(Startup),
            pageReady: MathJax.startup.defaultPageReady,
          },
          tex: {
            tags: 'ams',
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            macros: {
              RR: '{\\bf R}',
              bold: ['{\\bf #1}',1]
            },
          },
          svg: {
            fontCache: 'global',
          },
          options: {
            skipHtmlTags: [
              'script', 'noscript', 'style', 'textarea', 'pre',
              'code', 'annotation', 'annotation-xml'
            ],
            processHtmlClass: 'tex2jax_process',
            ignoreHtmlClass: 'tex2jax_ignore',
          },
        };
```

`startup - elements, typeset`はロード時のレンダリングを制御できます．`elements`に要素を指定し，`typeset`を`true`にすれば，指定の要素をロード時にレンダリングします．`elements`を指定したとしても，`typesetPromise()`と引数をなしで呼び出せば，`elements`指定以外のものもレンダリングします．`typeset`を`false`にすれば，初期のレンダリングを止められます．`ready`はMathJaxオブジェクト生成前に呼ばれる関数，`tex - tag: 'ams'`は環境数式に自動番号付，`'all'`にすれば`$$`含め全ての数式に番号付けします．式に`\label{label_name}`としておけば，`\ref{label_name}`, `\eqref{label_name}`で式番号を参照できます．`macros`で自作マクロを定義，`skipHtmlTags`は無視するタグ，`ignoreHtmlClass`は無視するクラスを指定できます．`processHtmlClass`は無視するタグ内で無視しない要素を指定するためでしょうか．未検証．

