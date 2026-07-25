with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if 'id="vm-troubleshooting"' in line or 'id="system-security"' in line or 'id="user-management"' in line:
            print(f"{idx+1}: {line.strip()}")
