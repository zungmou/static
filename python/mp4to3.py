# 使用 ffmpeg 将 mp4 视频转换为 mp3 音频。
import os
import subprocess

from utility import iter_argv_files

for src_file in iter_argv_files():
    splits = os.path.splitext(src_file)

    if splits[1] != ".mp4":
        continue

    subprocess.run(
        [
            "ffmpeg",
            "-i",
            src_file,
            "-c:v",
            "libnvenc",
            "-c:a",
            "libmp3lame",
            f"{splits[0]}.mp3",
        ]
    )
