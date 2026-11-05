// 共通ユーティリティ関数（index.html / onlineTest.html で共用）
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
    const extension = url.split('.').pop().toLowerCase();
    let content;
    if (extension === 'json') {
        content = await response.json();
    } else {
        content = await response.text();
    }
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
