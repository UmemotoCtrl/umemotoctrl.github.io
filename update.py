import os
import json
import time

def get_folder_tree_with_timestamp(path):
    folder_tree = {}

    # ディレクトリ内を再帰的に探索
    for root, dirs, files in os.walk(path):
        # 現在のディレクトリ名をキーにして、ファイルとサブディレクトリを格納
        current_dir = folder_tree
        dirs_and_files = root.replace(path, '').strip(os.sep).split(os.sep)
        
        # サブディレクトリがあれば辞書をネスト
        for dir_name in dirs_and_files:
            current_dir = current_dir.setdefault(dir_name, {})
        
        # ファイルをリストに追加（更新日時も一緒に保存）
        current_dir['files'] = []
        for file_name in files:
            file_path = os.path.join(root, file_name)
            # 更新日時を取得
            modified_time = os.path.getmtime(file_path)
            # 更新日時を人間が読める形式に変換
            modified_time_readable = time.strftime('%Y-%m-%d', time.localtime(modified_time))
            current_dir['files'].append({
                'file_name': file_name,
                'modified_time': modified_time_readable
            })

        # フォルダ自体の更新日時も保存
        folder_modified_time = os.path.getmtime(root)
        folder_modified_time_readable = time.strftime('%Y-%m-%d', time.localtime(folder_modified_time))
        current_dir['modified_time'] = folder_modified_time_readable

    return folder_tree

# フォルダツリーを取得
path = 'md'  # 実際のパスに変更してください
folder_tree = get_folder_tree_with_timestamp(path)

# JSONファイルに書き出し
with open('folder_tree_with_timestamp.json', 'w', encoding='utf-8') as f:
    json.dump(folder_tree, f, ensure_ascii=False, indent=4)

print("フォルダツリー（更新日時付き）がfolder_tree_with_timestamp.jsonに保存されました")
