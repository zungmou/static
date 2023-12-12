import getpass
import hashlib
import os
import sys
import keyring


def iter_command_line_files(argv=sys.argv):
    """
    从命令行参数中获取文件路径。
    """
    for argv_file in argv[1:]:
        yield os.path.normpath(argv_file)


def sha256(s: str):
    """
    计算字符串的 SHA256 值。
    """
    assert isinstance(s, str)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def get_password(service, username):
    """
    获取密码，如果没有则提示用户输入并保存。
    """
    password = keyring.get_password(service, username)

    if password is None:
        password = getpass.getpass(f"请输入 {service} 的密码：")
        repeat_password = getpass.getpass(f"再输入 {service} 的密码：")

        if password != repeat_password:
            print("两次输入的密码不一致。")
            sys.exit(1)

        keyring.set_password(service, username, password)

    return password
