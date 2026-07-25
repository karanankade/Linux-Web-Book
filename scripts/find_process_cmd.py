with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "processCommand" in line:
            print(f"{idx+1}: {line.strip()}")
