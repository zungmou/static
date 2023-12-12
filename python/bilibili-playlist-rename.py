import os
import re
import sys

import requests

args = sys.argv

if len(args) == 1:
    url = input("URL:")
else:
    url = args[1]

if len(args) > 2:
    directory_path = args[2]
else:
    directory_path = input("Directory path:")


response = requests.get(
    url,
    headers={
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
    },
)
content = response.content.decode("utf-8")
scripts = re.findall("<script>(.*?)</script>", content, re.S)

for script in scripts:
    if not str.startswith(script, "window.__INITIAL_STATE__="):
        continue

    parts = re.findall('"part":"(.*?)"', script, re.S)
    parts = [f"P{n+1:0>2} {x}" for n, x in enumerate(parts)]

    if directory_path:
        for file in os.scandir(directory_path):
            for part in parts:
                p = re.findall("^P(\d+)", part)
                if p:
                    p = int(p[0])
                    if f"P{p}." in file.name:
                        os.rename(
                            file,
                            os.path.join(os.path.dirname(file.path), f"{part}.mp4"),
                        )
                        break

    else:
        print("\n".join(parts))
