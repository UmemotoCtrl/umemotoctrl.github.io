# pip install requests
import requests
import xml.etree.ElementTree as ET

SITEMAP_FILE = "sitemap.xml"

def check_url_status(url):
    try:
        response = requests.get(url, timeout=5)
        return response.status_code
    except requests.exceptions.RequestException as e:
        return f"ERROR: {e}"

def main():
    tree = ET.parse(SITEMAP_FILE)
    root = tree.getroot()

    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [url_elem.text for url_elem in root.findall("ns:url/ns:loc", ns)]

    print(f"🔍 Checking {len(urls)} URLs from sitemap...\n")

    for url in urls:
        status = check_url_status(url)
        print(f"{url} -> {status}")

if __name__ == "__main__":
    main()