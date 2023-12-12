# Tips:
# * Add ffmpeg.exe to environment variables
# * Default to Nvidia GPU acceleration
# * Video transcoded to H.264
# * Audio transcoded to AAC

import datetime
import math
import os
import pathlib
import re
import subprocess
import typing

import utility


def get_media_file_info(source: pathlib.Path):
    output = subprocess.run(
        ["ffmpeg", "-i", str(source)], stderr=subprocess.PIPE, shell=True, check=False
    )
    output = output.stdout or output.stderr
    output = output.decode("utf-8")
    return output


def parse_bitrate_from_media_info(output: str):
    bitrate = None
    unit = None

    for bitrate, unit in re.findall("bitrate: (\d+) (kb/s)", output):
        bitrate = int(bitrate)

    return bitrate, unit


def parse_duration_from_media_info(output: str) -> typing.Optional[str]:
    for du in re.findall("Duration: (\d+:\d+:[\d\.]+)", output):
        return du


for source in utility.iter_argv_files():
    source = pathlib.Path(source)
    output = get_media_file_info(source)
    bitrate, unit = parse_bitrate_from_media_info(output)
    duration = parse_duration_from_media_info(output)

    if bitrate:
        print(f"Duration: {duration}")
        print(f"Bitrate: {bitrate} {unit}")

        default_target = f"{source.parent}{os.sep}{source.stem}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.mp4"
        target = input(f"Target File ({default_target})：")
        target = target or default_target
        target = pathlib.Path(target)

        re_encode = input("Re-encode(Yes): ")
        re_encode = re_encode.lower()
        re_encode = re_encode in ("yes", "y", "")

        duration = duration.split(":")
        duration = map(float, duration)
        duration = list(duration)
        duration = datetime.timedelta(
            hours=duration[0], minutes=duration[1], seconds=duration[2]
        )

        if duration > datetime.timedelta(minutes=60):
            durations = [duration / 2, duration]
        else:
            durations = [duration]

        for n, duration in enumerate(durations):
            args = [
                "ffmpeg",
                "-i",
                str(source),
                "-c:v",
                "h264_nvenc" if re_encode else "copy",
                "-b:v",
                f"{bitrate}k",
                "-c:a",
                "aac" if re_encode else "copy",
                "-ss",
                "0"
                if n == 0
                else str(math.ceil(durations[n - 1].total_seconds() - 0.5)),
                "-t",
                str(math.ceil(durations[0].total_seconds() + 0.5)),
                f"{target.parent}{os.sep}{target.stem}{('_'+str(n+1)) if n > 0 else ''}.mp4",
            ]
            subprocess.call(args)
