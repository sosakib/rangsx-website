# One-off asset pipeline: source images -> web-ready WebP at responsive widths.
from PIL import Image, ImageOps
import os
SA="_research/site-assets"; DR="_research/drive"; OUT="site/static/img"
def save(src, dst, widths, q=82, crop_alpha=False):
    im=ImageOps.exif_transpose(Image.open(src))
    im=im.convert("RGBA") if im.mode in("RGBA","LA","P") else im.convert("RGB")
    if crop_alpha and im.mode=="RGBA":
        bb=im.getchannel("A").point(lambda a:255 if a>8 else 0).getbbox()
        if bb:
            pad=int(max(im.size)*0.02); x0,y0,x1,y1=bb
            im=im.crop((max(0,x0-pad),max(0,y0-pad),min(im.width,x1+pad),min(im.height,y1+pad)))
    base,_=os.path.splitext(dst); out=[]
    for w in widths:
        r=im if im.width<=w else im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
        p=f"{base}-{w}.webp" if len(widths)>1 else f"{base}.webp"
        os.makedirs(os.path.dirname(p),exist_ok=True)
        r.save(p,"WEBP",quality=q,method=6); out.append((p,r.size,os.path.getsize(p)//1024))
    return out
jobs=[]
for m,cs in {"zs":["grey","red","yellow"],"es3":["grey","red","red-white"],"t60":["olive","orange","lavender"]}.items():
    for c in cs: jobs.append((f"{SA}/ebike/rx/{m}-{c}.webp",f"{OUT}/bikes/{m}-{c}",[1600,800],84,True))
for i in [1,2,3,4,5,7]: jobs.append((f"{SA}/ebike/CPx_PRO_RIQUADRO_{i}.jpg",f"{OUT}/life/detail-{i}",[1080,640],78,False))
jobs.append((f"{SA}/ebike/ofero/coming_soon.png",f"{OUT}/bikes/coming-soon",[1200,600],80,True))
for s,d in [("Image--9.png","front-quarter"),("Image--6.png","front-quarter-b"),("Image--4.png","front"),("Image--10.png","rear-quarter"),("Image--5.png","top")]:
    jobs.append((f"{DR}/{s}",f"{OUT}/fleet/em26/{d}",[2400,1600,800],84,True))
for s,d in [("Image--8.JPG","studio-side"),("Image--9.JPG","studio-quarter"),("Image--4.JPG","studio-front"),("Image--6.JPG","studio-quarter-b"),("Image--14.JPG","studio-rear")]:
    jobs.append((f"{DR}/{s}",f"{OUT}/fleet/em26/{d}",[2400,1200],80,False))
for i in [1,2,3]: jobs.append((f"{SA}/ev/{i}-DONGFENG-EM26-EV-INSIDE.png",f"{OUT}/fleet/em26/interior-{i}",[1080,640],78,False))
jobs.append((f"{SA}/ev/int_1.png",f"{OUT}/fleet/em26/cabin",[1440,800],78,False))
jobs.append((f"{SA}/ev/Dongfeng-EM-26-Brochure.jpg",f"{OUT}/fleet/em26/spec-sheet",[2230],85,False))
for c in ["grey","white","yellow"]: jobs.append((f"{SA}/ev/em27/{c}.webp",f"{OUT}/fleet/em27/{c}",[1600,800],84,True))
jobs.append((f"{DR}/chatgpt-hero.png",f"{OUT}/home/scooter-hero",[1536,800],84,True))
jobs.append((f"{SA}/landing/bike.png",f"{OUT}/home/es3-hero",[1536,800],84,True))
for p in ["rx-allweather-gloves","rx-phone-mount","rx-pro-helmet","rx-rider-jacket","rx-rider-tshirt","rx-saddlebag","rx-sport-gloves","rx-urban-helmet"]:
    jobs.append((f"{SA}/shop/{p}.jpg",f"{OUT}/shop/{p}",[800,480],80,False))
for j in jobs:
    for p,sz,kb in save(*j): print(f"{kb:>5}KB {sz} {p}")
# Round 2: home backdrop (beta landing art) and the EM-26 side view used by the hero carousel.
for j in [(f"{SA}/landing/landing_bg.webp",f"{OUT}/home/landing-bg",[1672,960],80,False),
          (f"{SA}/landing/landing_bg_mobile.webp",f"{OUT}/home/landing-bg-m",[567],80,False),
          (f"{SA}/ev/em26/side-quarter.webp",f"{OUT}/fleet/em26/side-quarter",[1600,800],84,True)]:
    for p,sz,kb in save(*j): print(f"{kb:>5}KB {sz} {p}")
