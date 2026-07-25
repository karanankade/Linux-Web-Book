with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("--- SIDEBAR MENU LINKS ---")
for idx, line in enumerate(lines[:220]):
    if 'class="menu-link"' in line:
        print(f"{idx+1}: {line.strip()}")

print("\n--- BOOK SECTIONS ---")
for idx, line in enumerate(lines):
    if '<section id=' in line:
        print(f"{idx+1}: {line.strip()}")
