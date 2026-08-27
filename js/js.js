
function loadMd ( article, argText, inPageTransition ) {
    // Load markdown file
    let file;
    if (argText == "./") file = "./md/index.md";
    else {
        const match = argText.match(/^\.\/*\?id=(\/?[\w\/-]+)$/);
        if (!match) {
            // 不正な ?id= パラメータ（例: ?id=tips:markdown）では何も読み込まない
            console.warn("Invalid id parameter: " + argText);
            return;
        }
        const idPath = match[1].replace(/^\/?/, '');
        file = `./md/${idPath}.md`;
    }
    fetchFileWithMetadata(file)
    .then(({ content, lastModified }) => {
        // markdownコンテンツを追加
        // console.log(content);
        article.innerHTML = marked.parse(content);
        // タイトル編集
        const titleMatch = content.match(/^# (.+?)$/m);
        if (titleMatch) document.title = titleMatch[1].replace(/\[\^[^\]]*\]/g, '').trim();
        // Bulmaクラス追加
        addClassToTags("h1", "title", "mt-4");
        addClassToTags("h2, h3, h4", "subtitle", "mt-4", "py-1", "pl-3");
        addClassToTags("pre", "has-background-inherit");
        addClassToTags("table", "table", "is-striped");
        addClassToTags("p > a, ul > li > a, ol > li > a", "button", "is-small");
        for (const ultag of document.getElementsByTagName("ul")) addConatainerClass(ultag);
        for (const ultag of document.getElementsByTagName("ol")) addConatainerClass(ultag);
        // highlight.js sync
        document.querySelectorAll('pre code[class*="language-"]').forEach((dom) => {
            hljs.highlightElement(dom);
        });
        // JSONファイルを取得して処理
        const jsonFilePath = "./folder_tree.json";
        fetchFileWithMetadata(jsonFilePath)
        .then(({ content, lastModified }) => {
            // 更新時刻追加
            const hoge = file.split('/');
            let element = document.createElement("div");
            element.classList.add("my-2", "has-text-weight-semibold");
            element.style = "text-align: end;";
            let formattedDate;
            switch ((file.match(/\//g) || []).length) {
                case 2:
                    formattedDate = formatUnixTimestamp(content["md"][hoge[2]].last_modified);
                    break;
                case 3:
                    formattedDate = formatUnixTimestamp(content["md"][hoge[2]]["children"][hoge[3]].last_modified);
            }
            element.innerHTML = "<p class=''>"+formattedDate+"更新</p>";
            article.prepend(element);
        })
        .catch(error => {
            console.error('JSON読み込みエラー:', error);
        });
    })
    .catch(error => {
        console.error("MD読み込みエラー:", error);
        article.innerHTML = "<p>コンテンツの読み込みに失敗しました。再読み込みを試してください。</p>";
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const optionsMarkedKatex = {
        throwOnError: false,
        displayMode: false,
        nonStandard: true
    };
    const optionsFootnotes = {
        description: "参考文献"
    };
    marked.use(markedKatex(optionsMarkedKatex)).use(markedFootnote(optionsFootnotes));
    let article = document.getElementById("article");

    // Load Main md file
    loadMd( article, "./"+location.search, false);
    // Process Back/Forward buttons of browser
    window.addEventListener('popstate',  (e) => {
        loadMd( article, "./"+location.search, false);
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
