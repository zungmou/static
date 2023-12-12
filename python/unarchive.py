"""

"""
import os
import subprocess

from utility import get_password, iter_command_line_files

for src in iter_command_line_files():
    if os.path.splitext(src)[1].lower() != ".7z":
        continue

    dst = f"{src}.7z"
    print(src, "->", dst)

    subprocess.run(
        [
            "7z",
            "e",
            src,
            f"-p{get_password()}",
            "-bso0",
            f"-o{os.path.dirname(src)}",
        ]
    )
