
function formatUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);  // Unixタイムスタンプは秒単位なので、ミリ秒に変換
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // 月は0から始まるため、1を足します
    const day = date.getDate();
    // フォーマットに合わせて年、月、日を返す
    return `${year}/${month}/${day}`;
}
async function fetchFileWithMetadata(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const lastModified = response.headers.get('Last-Modified');
    const content = await response.text(); // JSONなら response.json() にしてもOK
    return {
        content,
        lastModified: lastModified ? new Date(lastModified) : null
    };
}
function addClassToTags (tag, ...classnames) {
    const elements = document.querySelectorAll(tag);
    // const elements = Array.from( document.getElementsByTagName(tag) ) ;
    for (const name of classnames) {
        elements.forEach((element) => element.classList.add(name));
    }
}
function addConatainerClass (elem) {
    const element = document.createElement("div");
    element.classList.add("content");
    const pre = elem.nextElementSibling;
    const parent = elem.parentNode;
    element.prepend(elem);
    parent.insertBefore(element, pre);
}
function loadMd ( article, argText, inPageTransition ) {
  // Load markdown file
  let file = "./md/" + argText.replace("./?id=","").replace(/:/g, "/") + ".md";
  if (argText=="./")
    file="./md/index.md";
    fetchFileWithMetadata(file)
    .then(({ content, lastModified }) => {
        article.innerHTML = mdp.render(content);
        if (/^# (.+?)$/m.test(content))
            document.title = content.match(/^# (.+?)$/m)[1];

        addClassToTags("h1", "title", "mt-4");
        addClassToTags("h2, h3, h4", "subtitle", "mt-4", "has-text-weight-semibold");
        addClassToTags("pre", "has-background-inherit");
        addClassToTags("table", "table", "is-striped");
        addClassToTags("p > a, ul > li > a, ol > li > a", "button", "is-small");
        
        var uls = document.getElementsByTagName("ul");
        for (const ultag of uls) {
            addConatainerClass(ultag);
        }
        var uls = document.getElementsByTagName("ol");
        for (const ultag of uls) {
            addConatainerClass(ultag);
        }
    })
    .catch(error => {
        console.error("読み込みエラー:", error);
    });
    // JSONファイルを取得して処理
    const jsonFilePath = "./folder_tree.json";
    fetch(jsonFilePath)
    .then(response => {
        if (!response.ok) {
        throw new Error('ファイルの取得に失敗しました');
        }
        return response.json();
    })
    .then(data => {
        const hoge = file.split('/');
        let element = document.createElement("div");
        element.classList.add("my-2");
        element.style = "text-align: end;";
        var formattedDate;
        if (hoge.length == 3) {
            formattedDate = formatUnixTimestamp(data["md"][hoge[2]].last_modified);
        } else if (hoge.length == 5) {
            formattedDate = formatUnixTimestamp(data["md"][hoge[3]]["children"][hoge[4]].last_modified);
        }
        element.innerHTML = "<p class=''>"+formattedDate+"更新</p>";
        article.prepend(element);
    })
    .catch(error => {
        console.error('エラー:', error);
    });
}

var mdp;

document.addEventListener('DOMContentLoaded', () => {
  mdp = makeMDP();
  var article = document.getElementById("article");

  // Load Main md file
  loadMd( article, "./"+location.search, false);
  // Process Back/Forward buttons of browser
  window.addEventListener('popstate',  (e) => {
    loadMd( article, "./"+location.search, false);
  });
});

// MathJax Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
document.addEventListener('DOMContentLoaded', () => {  
    window.MathJax = {
      startup: {
        pageReady: function () {
          let observer = new MutationObserver( () => {
              MathJax.texReset();
              MathJax.typesetPromise(article.childNodes);
          });
          observer.observe(article, {childList: true});
          return MathJax.startup.defaultPageReady();
        },
      },
      tex: {
        tags: 'ams',
        inlineMath: [['$', '$'], ['\\(', '\\)']],
      },
      svg: {
        fontCache: 'global',
      },
    };
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    script.async = true;
    document.getElementsByTagName("head")[0].appendChild(script);
});

// highlight.js BSD 3-Clause License. Copyright (c) 2006, Ivan Sagalaev.
document.addEventListener('DOMContentLoaded', () => {
    var link = document.createElement("link");
    link.rel  = 'stylesheet'; // atom-one-dark, railscasts, monokai-sublime, zenburn, agate, lightfair, a11y-dark
    link.href = '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/monokai.min.css';
    document.getElementsByTagName("head")[0].appendChild(link);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/highlight.min.js";
    script.async = false;
    document.getElementsByTagName("head")[0].appendChild(script);
    var script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src  = "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/languages/latex.min.js";
    script1.async = false;
    document.getElementsByTagName("head")[0].appendChild(script1);
    script1.onload = (function () {
      let elements = document.querySelectorAll('#article pre code');
      for (let ii = 0; ii < (elements||[]).length; ii++) hljs.highlightBlock(elements[ii]);
      let observer = new MutationObserver( function () {
        // var elements = document.querySelectorAll('#article pre code');
        for (let ii = 0; ii < (elements||[]).length; ii++) hljs.highlightBlock(elements[ii]);
      });
      observer.observe(article, {childList: true});
    });
});

// ハンバーガーメニューを開閉するスクリプト
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.navbar-burger');
    const menu = document.getElementById(burger.dataset.target);

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
});
// Navbarの高さ分の調整
function adjustBodyPadding() {
    const navbar = document.querySelector('.navbar.is-fixed-top');
    if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        document.body.style.paddingTop = `${navbarHeight}px`;
    }
}
document.addEventListener('DOMContentLoaded', adjustBodyPadding);
window.addEventListener('resize', adjustBodyPadding);
