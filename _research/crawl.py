import re, urllib.request, urllib.parse, json, sys, html
BASE="https://beta.rangsx.com"
seen={}; q=["/","/dongfeng","/electric-bikes","/about","/service","/dealers","/contact","/electric-bikes/rx/zs","/shop","/commercial-evs"]; edges={}
UA={"User-Agent":"Mozilla/5.0"}
while q and len(seen)<200:
    p=q.pop(0)
    if p in seen: continue
    try:
        r=urllib.request.urlopen(urllib.request.Request(BASE+p,headers=UA),timeout=25)
        body=r.read().decode("utf-8","ignore"); code=r.status
    except Exception as e:
        body=""; code=getattr(e,"code","ERR")
    t=re.search(r"<title>(.*?)</title>",body)
    seen[p]={"code":code,"title":html.unescape(t.group(1)) if t else "","bytes":len(body)}
    open("pages/"+(p.strip("/").replace("/","__") or "home")+".html","w",encoding="utf-8").write(body)
    hrefs=set(re.findall(r'href="(/[^"#?]*)"',body))
    hrefs={h for h in hrefs if not h.startswith("/_next") and not re.search(r"\.(ico|png|jpg|jpeg|webp|svg|css|js|pdf|mp4)$",h)}
    edges[p]=sorted(hrefs)
    for h in hrefs:
        if h not in seen and h not in q: q.append(h)
json.dump({"pages":seen,"edges":edges},open("crawl.json","w"),indent=1)
for k,v in sorted(seen.items()): print(v["code"],k,"|",v["title"],"|",v["bytes"])
