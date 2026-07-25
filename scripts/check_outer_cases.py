import re

with open('js/script.js', 'r', encoding='utf-8') as f:
    text = f.read()

handle_start = text.find('function handleTerminalKeyPress(e) {')
handle_end = text.find('function appendTerminalOutput', handle_start)
handle_code = text[handle_start:handle_end]

# Find the main switch (cmd) block
switch_start = handle_code.find('switch (cmd) {')
switch_code = handle_code[switch_start:]

# To avoid sub-switches like switch (manCmd), let's parse case statements at indentation level of switch
lines = switch_code.split('\n')
outer_cases = []
depth = 0
for line in lines:
    stripped = line.strip()
    if '{' in line:
        depth += line.count('{')
    if '}' in line:
        depth -= line.count('}')
    if depth == 1 and stripped.startswith('case '):
        c_match = re.match(r"case\s+['\"]([^'\"]+)['\"]", stripped)
        if c_match:
            outer_cases.append(c_match.group(1))

print("=== CASES DIRECTLY UNDER OUTER SWITCH (cmd) ===")
print(sorted(list(set(outer_cases))))
print("\nIs 'cd' in outer switch?", 'cd' in outer_cases)
