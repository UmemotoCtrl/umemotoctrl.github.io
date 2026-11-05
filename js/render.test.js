import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownParser, extractTitle, renderArticleDom } from "./render.js";

test("renders KaTeX, code, and footnotes without browser scripts", () => {
    const { window } = renderArticleDom([
        "# Sample",
        "",
        "Inline $\\alpha$ and display:",
        "",
        "$$\\frac{a}{b}$$",
        "",
        "```latex",
        "\\begin{equation}",
        "x=1",
        "\\end{equation}",
        "```",
        "",
        "Reference[^note].",
        "",
        "[^note]: Reference text."
    ].join("\n"));
    const { document } = window;
    assert.ok(document.querySelector(".katex-display .katex"), document.querySelector("main").innerHTML);
    assert.equal(document.querySelectorAll(".katex-display .katex").length, 1);
    assert.ok(document.querySelector("p > .katex-display"));
    assert.ok(document.querySelector("pre code.hljs.language-latex"));
    assert.ok(document.querySelector("pre code .hljs-keyword"));
    assert.equal(document.querySelector("[data-footnotes] h2").textContent, "参考文献");
    assert.equal(document.querySelector("h1").classList.contains("title"), true);
    assert.equal(document.querySelector("script"), null);
});

test("extracts the article title", () => {
    assert.equal(extractTitle("<!-- comment -->\n# A title[^1]\n"), "A title");
    assert.equal(extractTitle("No heading"), "");
    assert.ok(createMarkdownParser());
});
