import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test, { before } from "node:test";
import { JSDOM } from "jsdom";
import { buildSite } from "./build.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "docs");
let pages;

before(async () => {
    pages = await buildSite();
});

async function collectHtml(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? collectHtml(entryPath) : [entryPath];
    }));
    return files.flat().filter((file) => file.endsWith(".html"));
}

test("builds every Markdown page with metadata and static content", () => {
    assert.equal(pages.length, 15);
    assert.ok(pages.some((page) => page.route === ""));
    assert.ok(pages.some((page) => page.route === "research/drone/"));
});

test("resolves local article links and assets to existing output files", async () => {
    const htmlFiles = (await collectHtml(output)).filter((file) => !file.endsWith("onlineTest.html"));
    assert.equal(htmlFiles.length, 15);
    for (const file of htmlFiles) {
        const html = await readFile(file, "utf8");
        const { document } = new JSDOM(html).window;
        for (const element of document.querySelectorAll("[href], [src]")) {
            const attribute = element.hasAttribute("href") ? "href" : "src";
            const url = element.getAttribute(attribute);
            if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) continue;
            const baseUrl = new URL("https://example.test/");
            const pathname = new URL(url, baseUrl).pathname;
            const target = pathname.endsWith("/")
                ? path.join(output, pathname, "index.html")
                : path.join(output, pathname);
            await access(target);
        }
        assert.equal(document.querySelector("[data-root-script], [data-root-asset], [data-site-page]"), null, file);
    }
});

test("home links, source downloads, and online editor URLs are distinct", async () => {
    const home = new JSDOM(await readFile(path.join(output, "index.html"), "utf8")).window.document;
    assert.equal(home.querySelector('a[href="research/drone/"]').getAttribute("href"), "research/drone/");
    assert.ok(home.querySelector('script[src="js/site.js"]'));
    assert.ok(home.querySelector("#legacy-url-redirect"));
    assert.equal(home.querySelector('script[src*="marked"], script[src*="katex"]'), null);
    assert.equal(home.querySelector("#legacy-url-redirect").src, "js/legacy-url.js");
    const redirectScript = await readFile(path.join(output, "js/legacy-url.js"), "utf8");
    assert.match(redirectScript, /const routes =/);
    assert.doesNotThrow(() => new Function(redirectScript));
    assert.match(redirectScript, /research\/dob\//);

    const markdown = new JSDOM(await readFile(path.join(output, "others/markdown/index.html"), "utf8")).window.document;
    assert.ok(markdown.querySelector('a[href="../../md/others/markdown.md"]'));

    const sample = new JSDOM(await readFile(path.join(output, "sample/index.html"), "utf8")).window.document;
    assert.ok(sample.querySelector('a[href="../onlineTest.html?id=/others/markdown"]'));

    const profile = new JSDOM(await readFile(path.join(output, "piinfo/index.html"), "utf8")).window.document;
    assert.ok(profile.querySelector('a[href="../researchworks/"]'));
});

test("generates canonical URLs and sitemap entries", async () => {
    const html = await readFile(path.join(output, "research/drone/index.html"), "utf8");
    const { document } = new JSDOM(html).window;
    assert.equal(document.querySelector('link[rel="canonical"]').href, "https://umemotoctrl.github.io/research/drone/");
    assert.match(document.querySelector("#article > div").textContent, /^\d{4}\/\d{1,2}\/\d{1,2}更新$/);
    assert.ok(document.querySelector("#article .footnotes"));
    assert.equal(document.querySelector("#legacy-url-redirect"), null);
    const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
    assert.ok(sitemap.includes("<loc>https://umemotoctrl.github.io/research/drone/</loc>"));
    assert.ok(sitemap.includes("<loc>https://umemotoctrl.github.io/</loc>"));
});
