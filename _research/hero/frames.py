# Homepage scroll film: the client's 10 s intro video -> a WebP frame sequence the page draws on a canvas.
# A frame sequence scrubs smoothly on every device (a scrubbed <video> freezes on iPhones and needs a special
# encode everywhere else). Run from the project root: python _research/hero/frames.py
#
# Timing measured from the pixels (see progress.md): warp 0-2.7 s, slow-down to 4.9 s, beam ignites 4.9-5.6 s
# at x 50% / y 69%, floor line 5.6-6.8 s, chevrons 6.8-7.7 s, then no visible change until 10 s.
# So: every 2nd frame from 0 to 192 (8.0 s), then the true last frame (239). 98 frames.
import subprocess, tempfile, os, glob
import imageio_ffmpeg
from PIL import Image

SRC = "_research/hero/intro-video.mp4"
OUT = "site/static/img/home/seq"
PICK = list(range(0, 193, 2)) + [239]
PHONE_CROP = (360, 0, 920, 720)   # centre 560 x 720: covers portrait screens up to 0.78 wide/tall

with tempfile.TemporaryDirectory() as tmp:
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-i", SRC, "-an",
                    os.path.join(tmp, "%03d.png")], check=True)
    frames = sorted(glob.glob(os.path.join(tmp, "*.png")))
    for d in ("d", "m"):
        os.makedirs(f"{OUT}/{d}", exist_ok=True)
    total = {"d": 0, "m": 0}
    for i, src in enumerate(PICK):
        im = Image.open(frames[src]).convert("RGB")
        for d, img in (("d", im), ("m", im.crop(PHONE_CROP))):
            p = f"{OUT}/{d}/{i:03d}.webp"
            img.save(p, "WEBP", quality=70, method=6)
            total[d] += os.path.getsize(p)
print(f"{len(PICK)} frames  desktop {total['d'] / 1e6:.2f} MB  phone {total['m'] / 1e6:.2f} MB")
