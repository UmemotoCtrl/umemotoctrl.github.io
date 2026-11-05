import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { extractTitle, renderArticleDom } from "./render.js";

export const BASE_URL = "https://umemotoctrl.github.io";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIRECTORY = path.join(ROOT, "docs");
const STATIC_DIRECTORIES = ["etc", "img"];
const STATIC_FILES = ["onlineTest.html", "robots.txt"];
function toPosix(filePath) {
    return filePath.split(path.sep).join("/");
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function escapeXml(value) {
    return escapeHtml(value);
}

async function collectFiles(directory, extension = ".md") {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? collectFiles(entryPath, extension) : [entryPath];
    }));
    return files.flat().filter((file) => file.endsWith(extension)).sort();
}

export function pageRoute(markdownFile) {
    const relativePath = toPosix(path.relative(path.join(ROOT, "md"), markdownFile));
    const withoutExtension = relativePath.slice(0, -path.extname(relativePath).length);
    return withoutExtension === "index" ? "" : `${withoutExtension}/`;
}

function pageUrl(route) {
    return new URL(route, `${BASE_URL}/`).href;
}

function relativeUrl(route, targetRoute) {
    const fromDirectory = route ? `/${route}` : "/";
    const target = targetRoute ? `/${targetRoute}` : "/";
    const relative = path.posix.relative(fromDirectory, target);
    return relative ? `${relative}/` : "./";
}

function splitUrlSuffix(url) {
    const match = url.match(/^([^?#]*)(.*)$/);
    return { pathname: match[1], suffix: match[2] };
}

function isExternalUrl(url) {
    return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url);
}

export function rewriteUrl(url, currentFile, sourceFiles) {
    if (isExternalUrl(url)) return url;

    const { pathname, suffix } = splitUrlSuffix(url);
    if (!pathname || pathname.startsWith("/")) return url;

    const currentPath = toPosix(path.relative(ROOT, currentFile));
    const inMarkdown = currentFile.startsWith(path.join(ROOT, "md") + path.sep);
    const currentDirectory = path.posix.dirname(currentPath);
    const rootRelativePath = inMarkdown && pathname.startsWith("./")
        ? pathname.slice(2)
        : path.posix.normalize(path.posix.join(currentDirectory, pathname));
    const sourceFile = sourceFiles.get(path.resolve(ROOT, rootRelativePath).toLowerCase())
        || sourceFiles.get(path.resolve(ROOT, "md", pathname.replace(/^\.\//, "")).toLowerCase());
    const isSourceDownload = inMarkdown && pathname.startsWith("./md/");
    if (sourceFile && !isSourceDownload) {
        return relativeUrl(pageRoute(currentFile), pageRoute(sourceFile)) + suffix;
    }
    if (sourceFile && isSourceDownload) {
        return relativeAssetUrl(pageRoute(currentFile), rootRelativePath) + suffix;
    }
    if (inMarkdown && !rootRelativePath.startsWith("../") && !rootRelativePath.startsWith("md/")) {
        return relativeAssetUrl(pageRoute(currentFile), rootRelativePath) + suffix;
    }
    return url;
}

function relativeAssetUrl(route, rootRelativePath) {
    const fromDirectory = route ? `/${route}` : "/";
    return path.posix.relative(fromDirectory, `/${rootRelativePath}`);
}

function rewriteArticleUrls(document, currentFile, sourceFiles) {
    for (const element of document.querySelectorAll("[href], [src]")) {
        const attribute = element.hasAttribute("href") ? "href" : "src";
        const url = element.getAttribute(attribute);
        element.setAttribute(attribute, rewriteUrl(url, currentFile, sourceFiles));
    }
}

function gitLastModified(filePath) {
    try {
        return execFileSync("git", ["log", "-1", "--format=%cI", "--", filePath], {
            cwd: ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"]
        }).trim();
    } catch {
        return "";
    }
}

function formatDate(isoDate) {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "numeric",
        day: "numeric"
    }).format(date);
}

function fallbackDate(filePath) {
    return stat(filePath).then((fileStat) => fileStat.mtime.toISOString());
}

async function getLastModified(filePath) {
    return gitLastModified(filePath) || await fallbackDate(filePath);
}

function defaultDescription(title) {
    if (!title || title === "福井大学 梅本研究室") {
        return "福井大学 梅本研究室（梅本 和希 准教授）の公式サイト。非線形システムのロバスト制御法と、そのドローンや柔軟ロボットなどロボットシステムへの応用を研究しています。";
    }
    return `${title} | 福井大学 梅本研究室`;
}

function createPageDocument(template, { title, description, canonical, image }) {
    const dom = new JSDOM(template);
    const { document } = dom.window;
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute("content", description);

    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = canonical;
    document.head.append(canonicalLink);

    for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
        const meta = document.querySelector(`meta[property="${property}"]`);
        const content = {
            "og:title": title,
            "og:description": description,
            "og:url": canonical,
            "og:image": image
        }[property];
        meta.setAttribute("content", content);
    }
    for (const name of ["twitter:title", "twitter:description", "twitter:image"]) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        const content = {
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }[name];
        meta.setAttribute("content", content);
    }
    return dom;
}

function rewriteTemplateUrls(document, route) {
    for (const element of document.querySelectorAll("[data-site-page]")) {
        const targetRoute = element.getAttribute("data-site-page");
        element.setAttribute("href", relativeUrl(route, targetRoute));
        element.removeAttribute("data-site-page");
    }
    for (const element of document.querySelectorAll("[data-root-asset]")) {
        const assetPath = element.getAttribute("data-root-asset");
        element.setAttribute("src", relativeAssetUrl(route, assetPath));
        element.removeAttribute("data-root-asset");
    }
    for (const element of document.querySelectorAll("[data-root-script]")) {
        const scriptPath = element.getAttribute("data-root-script").replace(/^\.\//, "");
        element.setAttribute("src", relativeAssetUrl(route, scriptPath));
        element.removeAttribute("data-root-script");
    }
}

function addArticleContent(document, articleDocument, title, lastModified) {
    const article = document.getElementById("article");
    article.replaceChildren();
    if (lastModified) {
        const dateElement = document.createElement("div");
        dateElement.className = "my-2 has-text-weight-semibold";
        dateElement.style.textAlign = "end";
        const paragraph = document.createElement("p");
        paragraph.textContent = `${formatDate(lastModified)}更新`;
        dateElement.append(paragraph);
        article.append(dateElement);
    }

    for (const node of articleDocument.getElementById("article").childNodes) {
        article.append(document.importNode(node, true));
    }
    const noscript = document.querySelector("noscript");
    noscript?.remove();

    const personUrl = document.querySelector('script[type="application/ld+json"]');
    if (personUrl) {
        const data = JSON.parse(personUrl.textContent);
        const person = data["@graph"]?.find((entry) => entry["@type"] === "Person");
        if (person) person.url = `${BASE_URL}/piinfo/`;
        personUrl.textContent = JSON.stringify(data, null, 2);
    }
    if (title !== "福井大学 梅本研究室") {
        document.getElementById("legacy-url-redirect")?.remove();
    }
}

function generateSitemap(pages) {
    const urls = [
        { loc: `${BASE_URL}/mdpjs/`, lastmod: "2025-01-01", priority: "0.5" },
        ...pages.map((page) => ({
            loc: pageUrl(page.route),
            lastmod: page.lastmod,
            priority: page.route === "" ? "1.0" : page.route.split("/").length === 2 ? "0.7" : "0.5"
        })),
        { loc: `${BASE_URL}/onlineTest.html`, lastmod: "2025-01-01", priority: "0.5" }
    ];
    const entries = urls.map(({ loc, lastmod, priority }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

async function copyStaticFiles() {
    for (const directory of STATIC_DIRECTORIES) {
        await cp(path.join(ROOT, directory), path.join(OUTPUT_DIRECTORY, directory), { recursive: true });
    }
    await mkdir(path.join(OUTPUT_DIRECTORY, "js"), { recursive: true });
    await cp(path.join(ROOT, "md"), path.join(OUTPUT_DIRECTORY, "md"), { recursive: true });
    for (const file of STATIC_FILES) {
        await cp(path.join(ROOT, file), path.join(OUTPUT_DIRECTORY, file));
    }
    for (const script of ["common.js", "site.js"]) {
        await cp(path.join(ROOT, "js", script), path.join(OUTPUT_DIRECTORY, "js", script));
    }
}

export async function buildSite() {
    const template = await readFile(path.join(ROOT, "index.html"), "utf8");
    const markdownFiles = await collectFiles(path.join(ROOT, "md"));
    const sourceFiles = new Map(markdownFiles.map((file) => [file.toLowerCase(), file]));
    const pages = [];

    await rm(OUTPUT_DIRECTORY, { recursive: true, force: true });
    await mkdir(OUTPUT_DIRECTORY, { recursive: true });
    await copyStaticFiles();

    for (const file of markdownFiles) {
        const route = pageRoute(file);
        const markdown = await readFile(file, "utf8");
        const articleDom = renderArticleDom(markdown);
        rewriteArticleUrls(articleDom.window.document, file, sourceFiles);

        const title = extractTitle(markdown) || "福井大学 梅本研究室";
        const canonical = pageUrl(route);
        const description = defaultDescription(title);
        const image = `${BASE_URL}/img/photo_ume.jpg`;
        const dom = createPageDocument(template, { title, description, canonical, image });
        rewriteTemplateUrls(dom.window.document, route);
        const lastmod = await getLastModified(file);
        addArticleContent(dom.window.document, articleDom.window.document, title, lastmod);

        const outputFile = path.join(OUTPUT_DIRECTORY, route, "index.html");
        await mkdir(path.dirname(outputFile), { recursive: true });
        await writeFile(outputFile, `<!doctype html>\n${dom.serialize()}`, "utf8");
        pages.push({ route, lastmod });
    }

    const homeFile = path.join(OUTPUT_DIRECTORY, "index.html");
    const homeHtml = await readFile(homeFile, "utf8");
    const homeDom = new JSDOM(homeHtml);
    const redirectScript = homeDom.window.document.getElementById("legacy-url-redirect");
    redirectScript.src = "js/legacy-url.js";
    await writeFile(homeFile, `<!doctype html>\n${homeDom.serialize()}`, "utf8");
    const legacyUrlScript = await readFile(path.join(ROOT, "js/legacy-url.js"), "utf8");
    await writeFile(path.join(OUTPUT_DIRECTORY, "js/legacy-url.js"), legacyUrlScript.replace(
        "/* __ARTICLE_ROUTES__ */ []",
        JSON.stringify(pages.map((page) => page.route))
    ), "utf8");
    await writeFile(path.join(OUTPUT_DIRECTORY, "sitemap.xml"), generateSitemap(pages), "utf8");
    return pages;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const pages = await buildSite();
    console.log(`Built ${pages.length} Markdown pages in docs/.`);
}
