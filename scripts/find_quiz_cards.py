with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "quiz-card" in line or "quiz-topic" in line or "data-topic" in line or "quiz-status" in line:
            print(f"{idx+1}: {line.strip()}")
