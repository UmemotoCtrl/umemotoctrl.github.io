import os

def print_tree(start_path, prefix=""):
    files = sorted(os.listdir(start_path))
    for index, name in enumerate(files):
        path = os.path.join(start_path, name)
        is_last = (index == len(files) - 1)
        connector = "└── " if is_last else "├── "
        print(prefix + connector + name)
        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            print_tree(path, prefix + extension)

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Print folder tree structure.")
    parser.add_argument("path", nargs="?", default=".", help="Start directory (default: current)")
    args = parser.parse_args()

    print(args.path)
    print_tree(args.path)