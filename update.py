import subprocess
import json
from pathlib import Path

def get_git_last_modified_unix(filepath):
    try:
        output = subprocess.check_output(
            ["git", "log", "-1", "--format=%at", str(filepath)],
            stderr=subprocess.DEVNULL,
        )
        return int(output.decode("utf-8").strip())
    except subprocess.CalledProcessError:
        return None

def build_labeled_tree(path: Path):
    tree = {}
    for item in sorted(path.iterdir()):
        if item.name.startswith('.'):
            continue
        if item.is_dir():
            tree[item.name] = {
                "type": "directory",
                "children": build_labeled_tree(item)
            }
        else:
            tree[item.name] = {
                "type": "file",
                "last_modified": get_git_last_modified_unix(item)
            }
    return tree

# --- メイン処理 ---
content_root = Path("md")  # 適宜パスを変更
result = {
    content_root.name: build_labeled_tree(content_root)
}

with open("folder_tree.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("✅ Unixタイムスタンプでツリーを書き出しました: tree_with_unix_timestamps.json")