"""
可以用这个脚本批量压缩文件，同时支持加密压缩和自动删除源文件。
压缩密码设置一次后长期保存在系统的凭据管理器中。
"""
import os
import subprocess
import sys

from utility import get_password, iter_command_line_files

parameters = []
argv = list(sys.argv)


if "-帮助" in argv or len(argv) == 1:
    print(
        """
    用法: python archive.py [选项] [文件...]
          
    选项:
        -帮助          显示此帮助信息并退出。
        -加密          使用密码加密文件。
        -加密文件名    加密文件名。
        -删除源文件    压缩后删除源文件。
    """
    )
    sys.exit(0)

if "-加密" in argv:
    parameters.append(f"-p{get_password('7z', 'python')}")
    argv.remove("-加密")

    if "-加密文件名" in argv:
        parameters.append("-mhe")
        argv.remove("-加密文件名")

if "-删除源文件" in argv:
    parameters.append("-sdel")
    argv.remove("-删除源文件")


for src in iter_command_line_files(argv):
    # 如果 src 为相对地址，则转换为绝对地址。
    if not os.path.isabs(src):
        src = os.path.abspath(src)

    if os.path.splitext(src)[1].lower() == ".7z":
        continue

    if "-o" in "".join(parameters):
        # dst 取 src 的文件名。
        dst = os.path.basename(src) + ".7z"
    else:
        dst = f"{src}.7z"

    print(src, "->", dst)

    subprocess.run(["7z", "a", "-bso0"] + parameters + [dst, src])
