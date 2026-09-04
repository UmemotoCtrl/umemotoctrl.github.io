import os
import subprocess

BASE_URL = "https://umemotoctrl.github.io"
ROOT_DIR = "./md"
SITEMAP_FILENAME = "sitemap.xml"

# 手動で追加するURL
MANUAL_URLS = [
    "https://umemotoctrl.github.io/mdpjs/",
    "https://umemotoctrl.github.io/onlineTest.html"
]

def generate_url(file_path: str) -> str:
    relative_path = os.path.relpath(file_path, ROOT_DIR)
    without_ext = os.path.splitext(relative_path)[0]
    if without_ext == "index":
        return BASE_URL + "/"
    else:
        url_id = without_ext.replace(os.path.sep, "/")
        return f"{BASE_URL}/?id=/{url_id}"

def get_git_lastmod(file_path: str) -> str:
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", file_path],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return "2025-01-01"  # fallback

def get_priority(file_path: str) -> str:
    relative_path = os.path.relpath(file_path, ROOT_DIR)
    if relative_path == "index.md":
        return "1.0"
    elif os.path.dirname(relative_path) == "":
        return "0.7"
    else:
        return "0.5"

def collect_md_files():
    for root, _, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".md"):
                yield os.path.join(root, file)

def generate_sitemap():
    urls = []

    # 手動で追加したURLを最初に追加
    for manual_url in MANUAL_URLS:
        urls.append(f"""  <url>
    <loc>{manual_url}</loc>
    <lastmod>2025-01-01</lastmod>  <!-- 固定日付 -->
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>""")

    # MDファイルからURLを生成
    for md_file in collect_md_files():
        url = generate_url(md_file)
        lastmod = get_git_lastmod(md_file)
        priority = get_priority(md_file)

        urls.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>{priority}</priority>
  </url>""")

    sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>
"""

    with open(SITEMAP_FILENAME, "w", encoding="utf-8") as f:
        f.write(sitemap_content)

    print(f"Sitemap generated: {SITEMAP_FILENAME}")

if __name__ == "__main__":
    generate_sitemap()