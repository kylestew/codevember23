import os
import re
import sys


def find_exports_in_file(file_path):
    exports = []
    export_pattern = re.compile(
        r"export\s+(function|const|let|var|class|default)?\s*(\w+)?\s*(\w+)?"
    )

    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            match = export_pattern.search(line)
            if match:
                export_type = match.group(1)
                export_name = match.group(2) or match.group(3)
                if export_name:
                    if export_type == "default":
                        exports.append(f"export default {export_name or 'anonymous'}")
                    else:
                        exports.append(f"export {export_type or ''} {export_name}")
    return exports


def find_exports_in_folder(folder_path):
    all_exports = {}
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".js") or file.endswith(".ts"):
                file_path = os.path.join(root, file)
                exports = find_exports_in_file(file_path)
                if exports:
                    relative_path = os.path.relpath(file_path, folder_path)
                    all_exports[relative_path] = exports
    return all_exports


def print_exports(all_exports):
    if not all_exports:
        print("\nNo exported functions found.")
    else:
        print("\n## Exported Functions")
        for file_path, exports in all_exports.items():
            print(f"\n### {file_path}")
            for export in exports:
                export_name = export.split()[-1]
                if export_name and export_name != "None":
                    print(f"- [`{export}`]({file_path})")


def main(target_folder):
    if not os.path.isdir(target_folder):
        print(f"The folder {target_folder} does not exist.")
        return

    all_exports = find_exports_in_folder(target_folder)
    print_exports(all_exports)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python list_exports.py <target_folder>")
    else:
        target_folder = sys.argv[1]
        main(target_folder)
