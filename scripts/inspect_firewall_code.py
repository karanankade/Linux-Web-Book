with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

print("=== SETUP FIREWALL VISUALIZER ===")
m_vis = re.search(r'function setupFirewallVisualizer\(\) \{[\s\S]*?\n  \}', js)
if m_vis:
    print(m_vis.group(0))

print("\n=== CASE FIREWALL-CMD ===")
m_cmd = re.search(r"case 'firewall-cmd':[\s\S]*?break;", js)
if m_cmd:
    print(m_cmd.group(0))
