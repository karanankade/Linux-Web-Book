import os
import re

index_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html"
script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"

# 1. Update index.html section #firewall-management widget IDs
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

old_html_widget = """<select id="fw-zone-val" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">
                    <option value="public">public (Default)</option>
                    <option value="work">work</option>
                    <option value="home">home</option>
                    <option value="trusted">trusted</option>
                  </select>

                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Service / Port</label>
                  <input type="text" id="fw-item-val" value="http" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 15px;">

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="quiz-btn" id="fw-get-zone-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-info"></i> Get Default Zone</button>
                    <button class="quiz-btn" id="fw-list-all-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-list"></i> List Active Rules</button>
                    <button class="quiz-btn" id="fw-add-svc-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-plus-circle"></i> Add Service</button>
                    <button class="quiz-btn" id="fw-rm-svc-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-minus-circle"></i> Remove Service</button>
                    <button class="quiz-btn" id="fw-add-port-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-plug"></i> Add Port (80/tcp)</button>
                    <button class="quiz-btn" id="fw-reload-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-sync"></i> Reload Firewall</button>
                  </div>
                </div>

                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="fw-log-display">"""

new_html_widget = """<select id="fwm-zone-val" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">
                    <option value="public">public (Default)</option>
                    <option value="work">work</option>
                    <option value="home">home</option>
                    <option value="trusted">trusted</option>
                  </select>

                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Service / Port</label>
                  <input type="text" id="fwm-item-val" value="http" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 15px;">

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="quiz-btn" id="fwm-get-zone-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-info"></i> Get Default Zone</button>
                    <button class="quiz-btn" id="fwm-list-all-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-list"></i> List Active Rules</button>
                    <button class="quiz-btn" id="fwm-add-svc-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-plus-circle"></i> Add Service</button>
                    <button class="quiz-btn" id="fwm-rm-svc-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-minus-circle"></i> Remove Service</button>
                    <button class="quiz-btn" id="fwm-add-port-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-plug"></i> Add Port (80/tcp)</button>
                    <button class="quiz-btn" id="fwm-reload-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-sync"></i> Reload Firewall</button>
                  </div>
                </div>

                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="fwm-log-display">"""

if old_html_widget in html:
    html = html.replace(old_html_widget, new_html_widget, 1)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated index.html with unique fwm- element IDs!")
else:
    print("Could not find old_html_widget in index.html!")

# 2. Update setupFirewallVisualizer in js/script.js
with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

old_js_vis = r'''  // Firewall & Zone Manager Visualizer (firewall-cmd)
  function setupFirewallVisualizer() {
    const zoneSelect = document.getElementById('fw-zone-val');
    const itemInput = document.getElementById('fw-item-val');

    const getZoneBtn = document.getElementById('fw-get-zone-btn');
    const listAllBtn = document.getElementById('fw-list-all-btn');
    const addSvcBtn = document.getElementById('fw-add-svc-btn');
    const rmSvcBtn = document.getElementById('fw-rm-svc-btn');
    const addPortBtn = document.getElementById('fw-add-port-btn');
    const reloadBtn = document.getElementById('fw-reload-btn');

    const logDisplay = document.getElementById('fw-log-display');

    if (!logDisplay) return;

    function runFwCmd(cmdStr) {
      const output = processCommand(cmdStr);
      logDisplay.textContent = `# ${cmdStr}\n\n` + (output || 'success');
    }

    if (getZoneBtn) getZoneBtn.addEventListener('click', () => runFwCmd('firewall-cmd --get-default-zone'));
    if (listAllBtn) {
      listAllBtn.addEventListener('click', () => {
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd('firewall-cmd --list-all --zone=' + zone);
      });
    }
    if (addSvcBtn) {
      addSvcBtn.addEventListener('click', () => {
        const svc = itemInput ? itemInput.value.trim() : 'http';
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd(`firewall-cmd --permanent --add-service=${svc} --zone=${zone}`);
      });
    }
    if (rmSvcBtn) {
      rmSvcBtn.addEventListener('click', () => {
        const svc = itemInput ? itemInput.value.trim() : 'http';
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd(`firewall-cmd --permanent --remove-service=${svc} --zone=${zone}`);
      });
    }
    if (addPortBtn) {
      addPortBtn.addEventListener('click', () => {
        const port = itemInput && itemInput.value.includes('/') ? itemInput.value.trim() : '80/tcp';
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd(`firewall-cmd --permanent --add-port=${port} --zone=${zone}`);
      });
    }
    if (reloadBtn) reloadBtn.addEventListener('click', () => runFwCmd('firewall-cmd --reload'));
  }'''

new_js_vis = r'''  // Firewall & Zone Manager Visualizer (firewall-cmd)
  function setupFirewallVisualizer() {
    const zoneSelect = document.getElementById('fwm-zone-val');
    const itemInput = document.getElementById('fwm-item-val');

    const getZoneBtn = document.getElementById('fwm-get-zone-btn');
    const listAllBtn = document.getElementById('fwm-list-all-btn');
    const addSvcBtn = document.getElementById('fwm-add-svc-btn');
    const rmSvcBtn = document.getElementById('fwm-rm-svc-btn');
    const addPortBtn = document.getElementById('fwm-add-port-btn');
    const reloadBtn = document.getElementById('fwm-reload-btn');

    const logDisplay = document.getElementById('fwm-log-display');

    if (!logDisplay) return;

    function runFwCmd(cmdStr) {
      const output = processCommand(cmdStr);
      logDisplay.textContent = `# ${cmdStr}\n\n` + (output || 'success');
    }

    if (getZoneBtn) getZoneBtn.addEventListener('click', () => runFwCmd('firewall-cmd --get-default-zone'));
    if (listAllBtn) {
      listAllBtn.addEventListener('click', () => {
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd('firewall-cmd --list-all --zone=' + zone);
      });
    }
    if (addSvcBtn) {
      addSvcBtn.addEventListener('click', () => {
        const svc = itemInput ? itemInput.value.trim() : 'http';
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd(`firewall-cmd --permanent --add-service=${svc} --zone=${zone}`);
      });
    }
    if (rmSvcBtn) {
      rmSvcBtn.addEventListener('click', () => {
        const svc = itemInput ? itemInput.value.trim() : 'http';
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd(`firewall-cmd --permanent --remove-service=${svc} --zone=${zone}`);
      });
    }
    if (addPortBtn) {
      addPortBtn.addEventListener('click', () => {
        const port = itemInput && itemInput.value.includes('/') ? itemInput.value.trim() : '80/tcp';
        const zone = zoneSelect ? zoneSelect.value : 'public';
        runFwCmd(`firewall-cmd --permanent --add-port=${port} --zone=${zone}`);
      });
    }
    if (reloadBtn) reloadBtn.addEventListener('click', () => runFwCmd('firewall-cmd --reload'));
  }'''

if old_js_vis in js:
    js = js.replace(old_js_vis, new_js_vis, 1)
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(js)
    print("Updated setupFirewallVisualizer in script.js with fwm- IDs!")
else:
    print("Could not find old_js_vis in script.js!")
