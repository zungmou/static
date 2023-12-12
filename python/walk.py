"""
可以用这个脚本针对某个目录下的所有文件（支持通配符：*, ?, _），通配符说明如下：

* 代表任意长度的任意字符
? 代表任意一个或零个字符
_ 代表任意一个字符

例如：

>>> python walk.py /Users/xxx/Downloads "echo"

这个命令会在 /Users/xxx/Downloads 目录下的所有文件上执行 echo 命令。

>>> python walk.py /Users/xxx/Downloads/*.txt "echo"

这个命令会在 /Users/xxx/Downloads 目录下的所有 txt 文件上执行 echo 命令。
"""

import os
import re
import subprocess
import sys


def execute_command_on_files(root: str, command: str):
    """
    针对某个目录下的所有文件执行某个命令。
    """
    assert isinstance(root, str)
    assert isinstance(command, str)

    # 分离出目录和文件名模式。
    root, pattern = os.path.split(root)

    # 将模式转换为正则表达式。
    pattern = (
        pattern.replace(".", "\\.")
        .replace("*", ".*")
        .replace("_", ".")
        .replace("?", ".?")
    )
    pattern = pattern or ".*"
    pattern = f"^{pattern}$"

    for path, _, files in os.walk(root):
        for file in files:
            file_path = os.path.join(path, file)

            if os.path.isfile(file_path) and re.match(pattern, file):
                subprocess.run(command + " " + file_path, shell=True)


if __name__ == "__main__":
    if len(sys.argv) >= 3:
        # 从命令行参数中获取目录和命令。
        root_directory = sys.argv[1]
        command_to_execute = sys.argv[2]
        execute_command_on_files(root_directory, command_to_execute)
    else:
        print("用法: python walk.py 目录 命令")
