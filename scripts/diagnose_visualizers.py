with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    content = f.read()

import re

for fn in ["setupSshVisualizer", "setupServiceVisualizer", "setupNetworkVisualizer", "setupGrubVisualizer"]:
    matches = [m.start() for m in re.finditer(fn, content)]
    print(f"Function {fn} matches at indices:", matches)
    for m in matches:
        line_num = content[:m].count('\n') + 1
        snippet = content[m:m+100].replace('\n', ' ')
        print(f"  Line {line_num}: {snippet}")
