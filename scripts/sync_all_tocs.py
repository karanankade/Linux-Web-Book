with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

sections = re.findall(r'<section id="([^"]+)"', html)
print("ALL SECTIONS IN BOOK:", len(sections))
for s in sections:
    print(" -", s)

sidebar_links = re.findall(r'href="#([^"]+)" class="menu-link"', html)
print("\nSIDEBAR LINKS:", len(sidebar_links))
for s in sidebar_links:
    print(" -", s)

right_toc_links = re.findall(r'href="#([^"]+)" class="right-toc-link"', html)
print("\nRIGHT TOC LINKS:", len(right_toc_links))
for s in right_toc_links:
    print(" -", s)
