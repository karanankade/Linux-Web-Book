with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

m = re.search(r'function setupFirewallVisualizer\(\) \{[\s\S]*?\n  \}', js)
if m:
    print(m.group(0))
else:
    print("Not found!")
