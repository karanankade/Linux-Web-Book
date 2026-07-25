import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

sections = re.findall(r'<div class="menu-section-title">(.*?)</div>|<li class="menu-item" data-hash="(.*?)">.*?<span>(.*?)</span>', content, re.DOTALL)

for sec in sections:
    if sec[0]:
        print(f"\n=== {sec[0]} ===")
    else:
        print(f"  - [{sec[1]}] {sec[2]}")
