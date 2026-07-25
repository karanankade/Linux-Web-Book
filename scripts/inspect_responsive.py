import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- INLINE GRID STYLES IN INDEX.HTML ---")
for m in re.finditer(r'style="[^"]*grid-template-columns:[^"]*"', html):
    line_no = html[:m.start()].count('\n') + 1
    print(f"Line {line_no}: {m.group(0)}")

print("\n--- TABLES IN INDEX.HTML ---")
table_count = html.count('<table')
print(f"Total <table> elements: {table_count}")

print("\n--- CODE PRE BLOCKS ---")
pre_count = html.count('<pre')
print(f"Total <pre> elements: {pre_count}")
