with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find line where DOMContentLoaded starts
dom_idx = -1
for idx, line in enumerate(lines):
    if "DOMContentLoaded" in line:
        dom_idx = idx
        break

print("DOMContentLoaded at line:", dom_idx + 1)

top_code = "".join(lines[:dom_idx])
rest_code = "".join(lines[dom_idx:])

target = "  function setupDiskManagerVisualizer() {"
new_rest_code = rest_code.replace(target, top_code + "\n\n  " + target, 1)

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "w", encoding="utf-8") as f:
    f.write(new_rest_code)

print("Successfully moved visualizers into DOMContentLoaded closure!")
