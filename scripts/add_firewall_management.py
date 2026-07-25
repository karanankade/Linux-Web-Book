import os
import re

index_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html"
script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"

# ==========================================
# 1. UPDATE INDEX.HTML
# ==========================================
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# Sidebar link
sidebar_target = '<li class="menu-item" data-hash="network-management">'
sidebar_addition = """<li class="menu-item" data-hash="firewall-management">
            <a href="#firewall-management" class="menu-link">
              <span>Firewall Management</span>
              <div class="progress-dot"></div>
            </a>
          </li>
          """ + sidebar_target

if 'data-hash="firewall-management"' not in html:
    html = html.replace(sidebar_target, sidebar_addition, 1)

# Right TOC link
right_toc_target = '<li class="right-toc-item"><a href="#network-management" class="right-toc-link">Network Management</a></li>'
right_toc_addition = """<li class="right-toc-item"><a href="#firewall-management" class="right-toc-link">Firewall Management</a></li>
          """ + right_toc_target

if 'href="#firewall-management"' not in html:
    html = html.replace(right_toc_target, right_toc_addition, 1)

# Main Book Section HTML
section_html = """
          <!-- SECTION: Firewall Management (firewalld & firewall-cmd) -->
          <section id="firewall-management" class="book-section">
            <h2>Firewall Management (firewalld & firewall-cmd)</h2>
            <p class="subtitle">Control network security filtering, trust zones, ports, and services in RHEL 10 using firewalld and firewall-cmd</p>

            <p>A <strong>Firewall</strong> acts as the primary security barrier ("first line of defense" or "first security gate") for a Linux system. It inspects incoming and outgoing network traffic, granting or denying access based on predefined security rules. In Red Hat Enterprise Linux (RHEL 10), network filtering is dynamically managed by the <code>firewalld</code> background daemon using the <code>firewall-cmd</code> command line tool.</p>

            <div class="callout" style="border-left: 4px solid var(--accent); margin-top: 20px;">
              <div class="callout-title" style="color: var(--accent);"><i class="fas fa-shield-alt"></i> What is a Firewall Zone?</div>
              <p>A <strong>Zone</strong> is a predefined security profile configured with rules based on the level of trust assigned to attached network interfaces and connections. Common built-in zones include:</p>
              <ul style="margin-top: 8px; margin-left: 20px; font-size: 0.9rem; line-height: 1.6;">
                <li><code>public</code> (Default): Untrusted public networks. Only specified incoming services/ports are allowed.</li>
                <li><code>work</code> / <code>home</code>: Semi-trusted private networks where most computers on the network are trusted.</li>
                <li><code>trusted</code>: All network connections are accepted without filtering.</li>
              </ul>
            </div>

            <!-- Subsection 1: systemctl firewalld -->
            <h3 style="margin-top: 35px;"><i class="fas fa-cogs"></i> 1. Managing the firewalld Service (<code>systemctl</code>)</h3>
            <p>Before executing firewall configuration rules, ensure the <code>firewalld</code> daemon service is running and enabled on boot:</p>

            <pre style="background-color: var(--bg-tertiary); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff; margin-top: 10px;">
# systemctl start firewalld     - Start the firewall daemon immediately
# systemctl stop firewalld      - Stop the firewall daemon
# systemctl restart firewalld   - Restart the firewall service
# systemctl enable firewalld    - Enable automatic startup on system boot
# systemctl disable firewalld   - Disable automatic startup on system boot
# systemctl status firewalld    - Inspect active status, PID, and runtime state</pre>

            <!-- Subsection 2: firewall-cmd 10 core operations -->
            <h3 style="margin-top: 40px;"><i class="fas fa-terminal"></i> 2. Top 10 Core <code>firewall-cmd</code> Operations</h3>
            <p>The <code>firewall-cmd</code> utility provides administrative controls for zones, services, ports, and permanent runtime configurations.</p>

            <div class="comparison-table-wrapper" style="margin-top: 15px;">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Operation / Task</th>
                    <th>Command Example</th>
                    <th>Result & Action Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1. Check Default Zone</strong></td>
                    <td><code>firewall-cmd --get-default-zone</code></td>
                    <td>Prints the name of the active default zone (e.g. <code>public</code>).</td>
                  </tr>
                  <tr>
                    <td><strong>2. List All Zones</strong></td>
                    <td><code>firewall-cmd --list-all-zones</code></td>
                    <td>Displays configurations for all predefined firewall zones.</td>
                  </tr>
                  <tr>
                    <td><strong>3. Set Default Zone</strong></td>
                    <td><code>firewall-cmd --set-default-zone=work</code></td>
                    <td>Changes the active default zone persistently to <code>work</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>4. Show Active Zone Details</strong></td>
                    <td><code>firewall-cmd --list-all</code></td>
                    <td>Lists open services, ports, protocols, and interfaces for active default zone.</td>
                  </tr>
                  <tr>
                    <td><strong>5. Add Service(s)</strong></td>
                    <td><code>firewall-cmd --permanent --add-service=ssh</code><br><code>firewall-cmd --permanent --add-service={ssh,http,https,dhcp}</code></td>
                    <td>Permits traffic for specified service(s) permanently across reboots.</td>
                  </tr>
                  <tr>
                    <td><strong>6. Remove Service(s)</strong></td>
                    <td><code>firewall-cmd --permanent --remove-service=ssh</code><br><code>firewall-cmd --permanent --remove-service={ssh,http,https,dhcp}</code></td>
                    <td>Blocks traffic for specified service(s) from entering the zone.</td>
                  </tr>
                  <tr>
                    <td><strong>7. Reload Firewall</strong></td>
                    <td><code>firewall-cmd --reload</code></td>
                    <td>Applies permanent disk configurations into active memory runtime state.</td>
                  </tr>
                  <tr>
                    <td><strong>8. Add Port</strong></td>
                    <td><code>firewall-cmd --permanent --add-port=22/tcp</code></td>
                    <td>Opens specific TCP or UDP port number directly in the firewall.</td>
                  </tr>
                  <tr>
                    <td><strong>9. Remove Port</strong></td>
                    <td><code>firewall-cmd --permanent --remove-port=22/tcp</code></td>
                    <td>Closes specific port number, blocking incoming connections.</td>
                  </tr>
                  <tr>
                    <td><strong>10. Add Service to Inactive Zone</strong></td>
                    <td><code>firewall-cmd --permanent --add-service=ssh --zone=public</code></td>
                    <td>Applies service rules specifically to non-default zone (e.g. <code>public</code>).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Interactive Firewall Visualizer Widget -->
            <div class="perm-builder-container" style="margin-top: 30px;">
              <h3><i class="fas fa-fire"></i> Interactive Firewall & Zone Manager (firewall-cmd)</h3>
              <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-secondary);">Select firewall actions below to inspect zones, open services/ports, and reload configuration rules live:</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background-color: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Target Zone</label>
                  <select id="fw-zone-val" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">
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

                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="fw-log-display">
                  Select a firewall-cmd operation on the left to execute live rules...
                </div>
              </div>
            </div>
          </section>
"""

sec_target = '<section id="network-management" class="book-section">'
if 'id="firewall-management"' not in html:
    html = html.replace(sec_target, section_html + "\n          " + sec_target, 1)

# Quiz Topic Card in #quiz-grid
quiz_card_html = """<div class="quiz-topic-card" data-topic="firewall-management">
                <div class="quiz-topic-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="quiz-topic-content">
                  <h4>Firewall Management (firewall-cmd)</h4>
                  <p>Test your knowledge on firewall zones, adding/removing services, opening ports, and reload operations.</p>
                </div>
                <div class="quiz-topic-meta">
                  <span class="quiz-topic-status" id="quiz-status-firewall-management">Not Started</span>
                  <button class="quiz-start-btn" data-topic="firewall-management">Start Quiz</button>
                </div>
              </div>

              """

quiz_target = '<div class="quiz-topic-card" data-topic="network-management">'
if 'data-topic="firewall-management"' not in html:
    html = html.replace(quiz_target, quiz_card_html + quiz_target, 1)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with Firewall Management section & quiz card!")

# ==========================================
# 2. UPDATE JS/SCRIPT.JS
# ==========================================
with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

# Update sectionsList and sectionTitles
target_sec_list = "'remote-file-transfer',"
new_sec_list = "'remote-file-transfer',\n    'firewall-management',"

if "'firewall-management'" not in js:
    js = js.replace(target_sec_list, new_sec_list, 1)

target_sec_titles = "'remote-file-transfer': 'Remote File Transfer (scp & rsync)',"
new_sec_titles = "'remote-file-transfer': 'Remote File Transfer (scp & rsync)',\n    'firewall-management': 'Firewall Management (firewall-cmd)',"

if "'firewall-management':" not in js:
    js = js.replace(target_sec_titles, new_sec_titles, 1)

# Add state.firewallZones if not present
if "firewallZones:" not in js:
    js_state_target = "firewallServices: ['ssh', 'dhcpv6-client'],"
    js_state_addition = """firewallServices: ['ssh', 'dhcpv6-client'],
    defaultZone: 'public',
    firewallZones: {
      public: { services: ['ssh', 'dhcpv6-client'], ports: [], interfaces: ['enp0s3'] },
      work: { services: ['ssh', 'dhcpv6-client', 'http', 'https'], ports: ['8080/tcp'], interfaces: [] },
      home: { services: ['ssh', 'mdns', 'samba-client'], ports: [], interfaces: [] },
      trusted: { services: ['all'], ports: [], interfaces: [] }
    },"""
    js = js.replace(js_state_target, js_state_addition, 1)

# Add Man pages for firewall-cmd
man_target = "case 'scp':"
man_addition = """case 'firewall-cmd':
               output = `FIREWALL-CMD(1)                 User Commands               FIREWALL-CMD(1)

NAME
       firewall-cmd - firewalld command line client

SYNOPSIS
       firewall-cmd [OPTIONS...]

DESCRIPTION
       firewall-cmd is the command line client of the firewalld daemon. It provides interface to manage runtime and permanent configurations for zones, services, and ports.`;
               break;
             """ + man_target

if "case 'firewall-cmd':" not in js:
    js = js.replace(man_target, man_addition, 1)

# Add processCommand case for firewall-cmd
cmd_target = "case 'scp':"
cmd_addition = """case 'firewall-cmd':
          {
            let argsStr = rawArgs.trim();
            if (!argsStr) {
              output = 'Usage: firewall-cmd [--get-default-zone | --list-all | --add-service=... | --reload]';
              styleClass = 'error';
              break;
            }

            let isPerm = argsStr.includes('--permanent');
            let targetZone = state.defaultZone || 'public';
            if (argsStr.includes('--zone=')) {
              let match = argsStr.match(/--zone=([^\s]+)/);
              if (match) targetZone = match[1];
            }

            if (!state.firewallZones) {
              state.firewallZones = {
                public: { services: ['ssh', 'dhcpv6-client'], ports: [], interfaces: ['enp0s3'] },
                work: { services: ['ssh', 'dhcpv6-client', 'http', 'https'], ports: ['8080/tcp'], interfaces: [] },
                home: { services: ['ssh', 'mdns', 'samba-client'], ports: [], interfaces: [] },
                trusted: { services: ['all'], ports: [], interfaces: [] }
              };
            }

            let zObj = state.firewallZones[targetZone] || { services: [], ports: [], interfaces: [] };

            if (argsStr.includes('--get-default-zone')) {
              output = state.defaultZone || 'public';
              styleClass = 'success-text';
            } else if (argsStr.includes('--list-all-zones')) {
              output = Object.keys(state.firewallZones).map(z => {
                let item = state.firewallZones[z];
                return `${z} (active)\n  target: default\n  interfaces: ${item.interfaces.join(' ') || 'none'}\n  services: ${item.services.join(' ')}\n  ports: ${item.ports.join(' ')}`;
              }).join('\n\n');
              styleClass = 'success-text';
            } else if (argsStr.includes('--set-default-zone=')) {
              let match = argsStr.match(/--set-default-zone=([^\s]+)/);
              if (match) {
                state.defaultZone = match[1];
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--list-all')) {
              output = `${targetZone} (active)\n  target: default\n  icmp-block-inversion: no\n  interfaces: ${zObj.interfaces.join(' ') || 'enp0s3'}\n  sources: \n  services: ${zObj.services.join(' ')}\n  ports: ${zObj.ports.join(' ')}\n  protocols: \n  forward: yes\n  masquerade: no`;
              styleClass = 'success-text';
            } else if (argsStr.includes('--add-service=')) {
              let match = argsStr.match(/--add-service=([^\s]+)/);
              if (match) {
                let rawSvcs = match[1].replace('{', '').replace('}', '').split(',');
                rawSvcs.forEach(s => {
                  if (!zObj.services.includes(s.trim())) zObj.services.push(s.trim());
                });
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--remove-service=')) {
              let match = argsStr.match(/--remove-service=([^\s]+)/);
              if (match) {
                let rawSvcs = match[1].replace('{', '').replace('}', '').split(',');
                zObj.services = zObj.services.filter(s => !rawSvcs.includes(s.trim()));
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--add-port=')) {
              let match = argsStr.match(/--add-port=([^\s]+)/);
              if (match) {
                let p = match[1].trim();
                if (!zObj.ports.includes(p)) zObj.ports.push(p);
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--remove-port=')) {
              let match = argsStr.match(/--remove-port=([^\s]+)/);
              if (match) {
                let p = match[1].trim();
                zObj.ports = zObj.ports.filter(x => x !== p);
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--reload')) {
              output = 'success';
              styleClass = 'success-text';
            } else {
              output = `firewall-cmd: command completed for ${argsStr}`;
              styleClass = 'success-text';
            }
          }
          break;

        """ + cmd_target

if "case 'firewall-cmd':" not in js:
    js = js.replace(cmd_target, cmd_addition, 1)

# Add setupFirewallVisualizer function & call in init
vis_fn = r'''
  // Firewall & Zone Manager Visualizer (firewall-cmd)
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
  }
'''

init_call_target = "setupDiskManagerVisualizer();"
init_call_addition = "setupDiskManagerVisualizer();\n    setupFirewallVisualizer();"

if "setupFirewallVisualizer();" not in js:
    js = js.replace(init_call_target, init_call_addition, 1)

fn_target = "function setupDiskManagerVisualizer() {"
if "function setupFirewallVisualizer()" not in js:
    js = js.replace(fn_target, vis_fn + "\n\n  " + fn_target, 1)

# Add Quiz category 'firewall-management'
quiz_cat = r''''firewall-management': {
      title: "Firewall Management (firewall-cmd)",
      questions: [
        {
          question: "What is the primary role of a firewall in Linux operating systems?",
          options: [
            "Filter incoming and outgoing network traffic based on predefined security rules",
            "Encrypt files stored on local hard drives",
            "Speed up CPU processing for network packets",
            "Automatically configure DHCP IP address leases"
          ],
          correct: 0,
          explanation: "A firewall acts as a security barrier filtering incoming and outgoing network traffic to allow or deny connections."
        },
        {
          question: "What is a 'Zone' in firewalld security management?",
          options: [
            "A predefined security profile with rules based on network trust level",
            "A physical partition on the hard drive",
            "A group of user accounts with admin rights",
            "A sub-folder inside the /etc directory"
          ],
          correct: 0,
          explanation: "A zone is a trust profile (e.g., public, work, trusted) containing tailored rules for attached network interfaces."
        },
        {
          question: "Which command displays the current active default firewall zone?",
          options: [
            "firewall-cmd --get-default-zone",
            "firewall-cmd --show-active",
            "systemctl status default-zone",
            "firewall-cmd --list-zones-only"
          ],
          correct: 0,
          explanation: "'firewall-cmd --get-default-zone' outputs the active default zone name (e.g. public)."
        },
        {
          question: "Which command permanently opens the 'ssh' service in the default firewall zone?",
          options: [
            "firewall-cmd --permanent --add-service=ssh",
            "firewall-cmd --open-service=ssh",
            "systemctl enable ssh --firewall",
            "firewall-cmd --add-port=22 --permanent"
          ],
          correct: 0,
          explanation: "'firewall-cmd --permanent --add-service=ssh' adds the ssh service rule persistently across reboots."
        },
        {
          question: "Which command reloads permanent firewall configuration rules into active runtime memory?",
          options: [
            "firewall-cmd --reload",
            "systemctl restart network",
            "firewall-cmd --refresh",
            "firewall-cmd --save"
          ],
          correct: 0,
          explanation: "'firewall-cmd --reload' loads permanent configuration rules into the active runtime memory."
        },
        {
          question: "Which command opens TCP port 22 permanently in the default firewall zone?",
          options: [
            "firewall-cmd --permanent --add-port=22/tcp",
            "firewall-cmd --allow-port=22",
            "systemctl open-port 22/tcp",
            "firewall-cmd --port=22/tcp --enable"
          ],
          correct: 0,
          explanation: "'firewall-cmd --permanent --add-port=22/tcp' opens port 22 with the TCP protocol specification."
        },
        {
          question: "How do you permanently add multiple services (ssh, http, https, dhcp) in a single command?",
          options: [
            "firewall-cmd --permanent --add-service={ssh,http,https,dhcp}",
            "firewall-cmd --add-service ssh http https dhcp",
            "firewall-cmd --services=ssh+http+https+dhcp",
            "systemctl add-services ssh,http,https,dhcp"
          ],
          correct: 0,
          explanation: "Using bash brace expansion '--add-service={ssh,http,https,dhcp}' enables multiple services in one command."
        },
        {
          question: "Which command sets the active default zone persistently to 'work'?",
          options: [
            "firewall-cmd --set-default-zone=work",
            "firewall-cmd --zone=work --default",
            "systemctl set-zone work",
            "firewall-cmd --change-zone=work"
          ],
          correct: 0,
          explanation: "'firewall-cmd --set-default-zone=work' updates the default active security zone to work."
        }
      ]
    },
    'remote-file-transfer': {'''

if "'firewall-management': {" not in js:
    js = js.replace("'remote-file-transfer': {", quiz_cat, 1)

with open(script_path, "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/script.js with Firewall Management logic, terminal commands, visualizer, and quiz questions!")
