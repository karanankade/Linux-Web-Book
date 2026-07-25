import re

index_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html"
script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"

with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

print("--- CHECKING FIREWALL VISUALIZER IN JS ---")
matches = [m.start() for m in re.finditer('setupFirewallVisualizer', js)]
print("Matches count:", len(matches))
for m in matches:
    line_num = js[:m].count('\n') + 1
    snippet = js[m:m+120].replace('\n', ' ')
    print(f"  Line {line_num}: {snippet}")

print("\n--- CHECKING HTML ELEMENT IDS FOR FIREWALL WIDGET ---")
fw_ids = [
    "fw-zone-val", "fw-item-val", "fw-get-zone-btn", "fw-list-all-btn",
    "fw-add-svc-btn", "fw-rm-svc-btn", "fw-add-port-btn", "fw-reload-btn", "fw-log-display"
]
for eid in fw_ids:
    in_html = f'id="{eid}"' in html
    in_js = f"'{eid}'" in js or f'"{eid}"' in js
    print(f"ID '{eid}': HTML={'EXISTS' if in_html else 'MISSING'}, JS={'EXISTS' if in_js else 'MISSING'}")
