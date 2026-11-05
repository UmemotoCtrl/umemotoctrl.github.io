# umemotoctrl.github.io
[![Build and Deploy to GitHub Pages](https://github.com/UmemotoCtrl/umemotoctrl.github.io/actions/workflows/static.yml/badge.svg)](https://github.com/UmemotoCtrl/umemotoctrl.github.io/actions/workflows/static.yml)

Research activity on Control Engineering and Robotics by Kazuki UMEMOTO https://umemotoctrl.github.io/

* The source code is under the MIT License.
* The text and images are licensed under CC BY-ND 4.0. Redistribution is permitted with attribution, but modifications are not allowed. Please display information sources whenever possible.
* The license for the University of Fukui logo is subject to the regulations of the University of Fukui.

## Development with Dev Container

This repository includes a [Dev Container](https://containers.dev/) configuration
(`.devcontainer/devcontainer.json`) based on
`mcr.microsoft.com/devcontainers/javascript-node:24-bookworm`.

* Reopen the folder in VS Code with **Dev Containers: Reopen in Container**.
* Install dependencies with `npm ci`.
* Run `npm start` to build the site and start a preview server on port 3000.
  Open http://localhost:3000 to preview the site.
* `index.html` is the shared template. The custom Node.js builder in `js/build.js`
  converts `md/*.md` with the renderer in `js/render.js` and writes the complete site to `docs/`.
* Article links in Markdown use paths to source Markdown files, such as `researchworks.md`.
  The builder converts them to page URLs. Links to images, PDFs, and `md/*.md` source downloads
  remain relative to the repository root.
* `onlineTest.html` remains a dynamic Markdown editor. The other articles contain pre-rendered
  Markdown, KaTeX, and highlighted code, so they are readable without browser-side rendering.
* Run `npm run check` to verify rendering, generated metadata, sitemap URLs, and local links.
* Push to `master` to build and deploy `docs/` through `.github/workflows/static.yml`.
  Set GitHub Pages **Source** to **GitHub Actions**. Git history supplies article update dates.
