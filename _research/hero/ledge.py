# Rooftop ledge (glass railing + parapet) boundary for the homepage hero layers.
# Points traced by eye from 2x zooms of the source photo, joined with a smooth Catmull-Rom curve.
from PIL import Image, ImageDraw
import numpy as np
GLASS_TOP = [(0, 763), (280, 822), (560, 878), (840, 884), (1112, 879), (1400, 846), (1672, 803)]
PARAPET_TOP = [(0, 831), (135, 851), (560, 890), (1112, 895), (1672, 860)]

def curve(pts, w):
    pts = [pts[0]] + pts + [pts[-1]]
    xs, ys = [], []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = map(np.array, pts[i - 1:i + 3])
        for t in np.linspace(0, 1, 60, endpoint=False):
            q = 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t**2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t**3)
            xs.append(q[0]); ys.append(q[1])
    return np.interp(np.arange(w), xs, ys)

if __name__ == "__main__":
    im = Image.open("dhaka-night-aerial.webp").convert("RGB")
    w, h = im.size
    g, p = curve(GLASS_TOP, w), curve(PARAPET_TOP, w)
    d = ImageDraw.Draw(im)
    d.line(list(zip(range(w), g)), fill=(0, 255, 0), width=2)
    d.line(list(zip(range(w), p)), fill=(0, 200, 255), width=2)
    for i, (x0, x1) in enumerate([(0, 560), (560, 1120), (1112, 1672)]):
        im.crop((x0, 720, x1, 941)).resize(((x1 - x0) * 2, 442)).save(f"check{i}.png")
