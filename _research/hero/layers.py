# Build the homepage hero layers from the client's night aerial photo:
#   city  = background plate with the rooftop ledge removed (mirror-filled, softened, darkened)
#   ledge = foreground glass railing + parapet as a true alpha cutout, same canvas size (so both align 1:1)
# Desktop 16:9 and a 9:16 phone crop centred on the intersection. Run from _research/hero.
from PIL import Image, ImageFilter
import numpy as np
from ledge import GLASS_TOP, curve

OUT = "../../site/static/img/home"
src = Image.open("dhaka-night-aerial.webp").convert("RGB")
w, h = src.size
top = curve(GLASS_TOP, w)                                   # first ledge row, per column
rows = np.arange(h)[:, None]
alpha = np.clip((rows - (top[None, :] - 1.5)) / 3.0, 0, 1)  # ~3px feathered edge

# Plate: mirror the city above the ledge into the ledge area, then blur + darken that fill only.
a = np.asarray(src).astype(np.float32)
fill = a.copy()
for x in range(w):
    t = int(top[x])
    for y in range(t, h):
        fill[y, x] = a[max(0, 2 * t - y), x]
fill_img = Image.fromarray(fill.astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))
fill = np.asarray(fill_img).astype(np.float32) * 0.72
m = alpha[..., None]
plate = (a * (1 - m) + fill * m).astype(np.uint8)
plate = Image.fromarray(plate)
ledge = Image.fromarray(np.dstack([np.asarray(src), (alpha * 255).astype(np.uint8)]), "RGBA")

def save(im, name, widths):
    for wd in widths:
        r = im if im.width <= wd else im.resize((wd, round(im.height * wd / im.width)), Image.LANCZOS)
        r.save(f"{OUT}/{name}-{wd}.webp" if len(widths) > 1 else f"{OUT}/{name}.webp", "WEBP", quality=82, method=6)

save(plate, "city", [1672, 1200])
save(ledge, "ledge", [1672, 1200])
cx = 870                                                    # intersection centre
box = (cx - 265, 0, cx + 265, h)                            # 530 x 941 portrait
save(plate.crop(box), "city-m", [530])
save(ledge.crop(box), "ledge-m", [530])
# Contact check: ledge over magenta shows any halo; plate alone shows the fill.
chk = Image.new("RGBA", (w, h), (255, 0, 255, 255)); chk.alpha_composite(ledge)
chk.crop((0, 700, w, h)).save("check-ledge-alpha.png")
plate.crop((0, 700, w, h)).save("check-plate-fill.png")
print("ok")
