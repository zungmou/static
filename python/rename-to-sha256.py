import os
import pathlib

import utility

for src in utility.iter_command_line_files():
    src = pathlib.Path(src)
    hexdigest = utility.sha256(src.read_bytes())
    dst = f"{hexdigest}{os.path.splitext(src)[1]}"

    try:
        os.rename(src, dst)

    except Exception as ex:
        print(f"Failed to rename: {src}, {ex}")
