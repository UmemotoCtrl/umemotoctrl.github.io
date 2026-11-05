import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "docs");
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".webp": "image/webp",
    ".xml": "application/xml; charset=utf-8"
};

const server = http.createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        let filePath = path.resolve(root, `.${pathname}`);
        if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== root) {
            response.writeHead(403).end("Forbidden");
            return;
        }
        let fileStat = await stat(filePath);
        if (fileStat.isDirectory() && !pathname.endsWith("/")) {
            const requestUrl = new URL(request.url, "http://localhost");
            response.writeHead(308, { Location: `${pathname}/${requestUrl.search}` }).end();
            return;
        }
        if (fileStat.isDirectory()) {
            filePath = path.join(filePath, "index.html");
            fileStat = await stat(filePath);
        }
        response.writeHead(200, {
            "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
            "Content-Length": fileStat.size
        });
        if (request.method === "HEAD") {
            response.end();
        } else {
            createReadStream(filePath).pipe(response);
        }
    } catch {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Static site: http://localhost:${port}`);
});
