with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "data-hash" in line or "hash" in line:
            if "switch" in line or "if (" in line or "addEventListener" in line or "classList" in line:
                print(f"{idx+1}: {line.strip()}")
