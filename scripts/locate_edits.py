with open('js/script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'output = processCommand(cmdStr);' in line:
        print(f"cmdStr bug line: {i+1}")
    if 'default:' in line and i > 6000 and i < 7000:
        print(f"default case line: {i+1}")
    if "case 'pwd':" in line and i < 2000:
        print(f"case pwd line: {i+1}")
    if "case 'vim':" in line and i < 5000:
        print(f"case vim line: {i+1}")
