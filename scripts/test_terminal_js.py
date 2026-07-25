import subprocess
import os

# We can run node to load script.js or check syntax with node
res = subprocess.run(['node', '-c', 'js/script.js'], capture_output=True, text=True)
print("Node syntax check returncode:", res.returncode)
if res.returncode != 0:
    print("Node syntax errors:\n", res.stderr)
else:
    print("JS syntax check passed cleanly!")
