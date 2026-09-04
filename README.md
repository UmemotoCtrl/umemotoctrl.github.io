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
* A static server is started with `npm start` (port 3000).
  Open http://localhost:3000 to preview the site.
  Note that an HTTP server is required because the site loads `md/*.md` files via `fetch()`.
* The image includes Node.js 24 and Python 3. The scripts `update.py` and `generate_sitemap.py`
  use only the standard library, so they work as-is. `check_sitemap_urls.py` requires the
  `requests` package (`pip install requests`).
