import re

with open('js/script.js', 'r', encoding='utf-8') as f:
    text = f.read()

handle_start = text.find('function handleTerminalKeyPress(e) {')
handle_end = text.find('function appendTerminalOutput', handle_start)
handle_code = text[handle_start:handle_end]

cases_in_handle = set(re.findall(r"case\s+['\"]([^'\"]+)['\"]", handle_code))

proc_start = text.find('function processCommand(cmdStr) {')
proc_end = text.find('function setupTarVisualizer', proc_start)
proc_code = text[proc_start:proc_end]

cmds_in_proc = set(re.findall(r"cmd\s*===\s*['\"]([^'\"]+)['\"]", proc_code))

print("=== CASES IN HANDLE TERMINAL KEYPRESS ===")
print(sorted(list(cases_in_handle)))

print("\n=== CMDS IN PROCESS COMMAND ===")
print(sorted(list(cmds_in_proc)))

print("\n=== CMDS IN PROCESS COMMAND BUT MISSING IN HANDLE TERMINAL KEYPRESS ===")
print(sorted(list(cmds_in_proc - cases_in_handle)))

with open('index.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

codes = set(re.findall(r"<code>([a-zA-Z0-9_\-]+)(?:\s+[^<]*)?</code>", html_text))
print("\n=== FIRST WORDS IN CODE TAGS IN INDEX.HTML ===")
print(sorted([c for c in codes if len(c) < 25]))
