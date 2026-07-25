with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

for case_name in ['firewall-cmd', 'ssh', 'scp', 'rsync', 'systemctl', 'grub2-mkpasswd-pbkdf2']:
    matches = [m.start() for m in re.finditer(f"case '{case_name}':", js)]
    print(f"Case '{case_name}': count={len(matches)}")
    for m in matches:
        line_num = js[:m].count('\n') + 1
        snippet = js[m:m+100].replace('\n', ' ')
        print(f"  Line {line_num}: {snippet}")
