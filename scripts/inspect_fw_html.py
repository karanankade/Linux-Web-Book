with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

m = re.search(r'<!-- Interactive Firewall Visualizer Widget -->[\s\S]*?</section>', html)
if m:
    print(m.group(0))
else:
    print("Not found!")
