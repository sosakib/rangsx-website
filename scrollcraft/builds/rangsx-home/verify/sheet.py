import sys, glob
from PIL import Image, ImageDraw
prefix, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
files = sorted(glob.glob(f"shots/{prefix}-*.png"))
ims = [Image.open(f) for f in files]
h = round(ims[0].height * w / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 8), rows * (h + 26)), (40, 40, 40))
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * (w + 8), (i // cols) * (h + 26)
    sheet.paste(im.convert("RGB").resize((w, h), Image.LANCZOS), (x, y + 22))
    ImageDraw.Draw(sheet).text((x + 4, y + 4), f.split("-")[-1][:-4] + "%", fill=(255, 220, 0))
sheet.save(f"sheet-{prefix}.png")
