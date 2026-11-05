import hljs from "highlight.js";
import { JSDOM } from "jsdom";
import { Marked } from "marked";
import markedFootnote from "marked-footnote";
import markedKatex from "marked-katex-extension";

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function highlightCode({ text, lang }) {
    const language = lang?.trim().split(/\s+/)[0] ?? "";
    if (!language) {
        return `<pre><code>${escapeHtml(text)}</code></pre>\n`;
    }

    const code = hljs.getLanguage(language)
        ? hljs.highlight(text, { language }).value
        : escapeHtml(text);
    return `<pre><code class="hljs language-${escapeHtml(language)}">${code}</code></pre>\n`;
}

function addClasses(document, selector, ...classNames) {
    document.querySelectorAll(selector).forEach((element) => {
        element.classList.add(...classNames);
    });
}

function addContainerClass(element) {
    const container = element.ownerDocument.createElement("div");
    container.classList.add("content");
    element.replaceWith(container);
    container.append(element);
}

export function createMarkdownParser() {
    return new Marked()
        .use({ renderer: { code: highlightCode } })
        .use(markedKatex({
            throwOnError: false,
            displayMode: false,
            nonStandard: true
        }))
        .use(markedFootnote({ description: "参考文献" }));
}

export function decorateArticle(document) {
    addClasses(document, "h1", "title", "mt-4");
    addClasses(document, "h2, h3, h4", "subtitle", "mt-4", "py-1", "pl-3");
    addClasses(document, "pre", "has-background-inherit");
    addClasses(document, "table", "table", "is-striped");
    addClasses(document, "p > a, ul > li > a, ol > li > a", "button", "is-small");
    document.querySelectorAll("ul, ol").forEach(addContainerClass);
}

export function renderArticleDom(markdown, parser = createMarkdownParser()) {
    const rendered = parser.parse(markdown);
    const dom = new JSDOM(`<main id="article">${rendered}</main>`);
    decorateArticle(dom.window.document);
    return dom;
}

export function extractTitle(markdown) {
    return markdown.match(/^# (.+?)$/m)?.[1]
        .replace(/\[\^[^\]]*\]/g, "")
        .trim() ?? "";
}
