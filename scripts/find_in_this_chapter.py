with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("--- SEARCHING 'In This Chapter' OR TOC IN INDEX.HTML ---")
for idx, line in enumerate(lines):
    if "In This Chapter" in line or "chapter-toc" in line or "toc-link" in line or 'href="#' in line:
        if "menu-link" not in line and "nav" not in line:
            print(f"{idx+1}: {line.strip()}")
