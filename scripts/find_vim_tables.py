import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- SEARCHING VIM TABLES IN INDEX.HTML ---")
for m in re.finditer(r'<table[^>]*>.*?</table>', html, re.DOTALL):
    snippet = m.group(0)
    if 'vim' in snippet.lower() or 'mode' in snippet.lower() or 'shortcut' in snippet.lower() or 'key' in snippet.lower():
        line_no = html[:m.start()].count('\n') + 1
        title_m = re.search(r'<th>(.*?)</th>', snippet)
        title = title_m.group(1) if title_m else "Table"
        print(f"Line {line_no}: Table header: {title}")
