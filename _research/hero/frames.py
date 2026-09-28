# Homepage scroll film: the client's 10 s intro video -> WebP frame sequences the page draws on a canvas.
# A frame sequence scrubs smoothly on every device (a scrubbed <video> freezes on iPhones and needs a special
# encode everywhere else). Run from the project root: python _research/hero/frames.py
#
# Source: the TensorPix upscale of the client's clip, 1920x1080 at 60 fps (same timing as the 720p original).
# Timing measured from the pixels (see progress.md): warp 0-2.7 s, slow-down to 4.9 s, beam ignites 4.9-5.6 s
# at x 50% / y 69%, floor line 5.6-6.8 s, chevrons 6.8-7.7 s, then no visible change until 10 s.
# So each set samples 0-8.0 s evenly, then adds the true last frame. site.js derives the rate from the count:
# fps = (frames - 2) / 8.
#   d (desktop): full 1920x1080, every 3rd frame = 20 fps -> 162 frames
#   m (phone):   centre 840x1080 crop (covers portrait screens up to 0.78 wide/tall), every 4th = 15 fps -> 122
import subprocess, os, glob
import imageio_ffmpeg

SRC = "_research/hero/intro-video.mp4"
OUT = "site/static/img/home/seq"
LAST = 599  # 10 s x 60 fps, zero-based
SETS = {"d": (3, ""), "m": (4, "crop=840:1080:540:0,")}

for d, (step, crop) in SETS.items():
    os.makedirs(f"{OUT}/{d}", exist_ok=True)
    for f in glob.glob(f"{OUT}/{d}/*.webp"):
        os.remove(f)
    pick = f"select='lte(n\\,480)*not(mod(n\\,{step}))+eq(n\\,{LAST})'"
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-i", SRC, "-an",
                    "-vf", crop + pick, "-fps_mode", "passthrough", "-c:v", "libwebp", "-quality", "60",
                    "-compression_level", "6", "-start_number", "0", f"{OUT}/{d}/%03d.webp"], check=True)
    files = glob.glob(f"{OUT}/{d}/*.webp")
    print(f"{d}: {len(files)} frames, {sum(map(os.path.getsize, files)) / 1e6:.2f} MB")
