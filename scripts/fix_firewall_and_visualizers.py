import os
import re

script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"

with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

# 1. Fix processCommand(commandToRun) to processCommand(cmdStr) in visualizers
fixes_count = 0

# Fix in runNetCmd
old_net = """    function runNetCmd(cmdStr) {
      cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(commandToRun);
      logDisplay.textContent = output || `Command '${cmdStr}' executed successfully.`;
    }"""
new_net = """    function runNetCmd(cmdStr) {
      cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(cmdStr);
      logDisplay.textContent = output || `Command '${cmdStr}' executed successfully.`;
    }"""
if old_net in js:
    js = js.replace(old_net, new_net, 1)
    fixes_count += 1
    print("Fixed runNetCmd!")

# Fix in setupRemoteTransferVisualizer
old_transfer = """      const output = processCommand(commandToRun);
      logDisplay.textContent = `# ${cmdStr}\\n\\n` + output;"""
new_transfer = """      const output = processCommand(cmdStr);
      logDisplay.textContent = `# ${cmdStr}\\n\\n` + (output || 'Transfer completed successfully.');"""
if old_transfer in js:
    js = js.replace(old_transfer, new_transfer, 1)
    fixes_count += 1
    print("Fixed setupRemoteTransferVisualizer!")

# Fix in runFwCmd
old_fw = """    function runFwCmd(cmdStr) {
      const output = processCommand(commandToRun);
      logDisplay.textContent = `# ${cmdStr}\\n\\n` + (output || 'success');
    }"""
new_fw = """    function runFwCmd(cmdStr) {
      const output = processCommand(cmdStr);
      logDisplay.textContent = `# ${cmdStr}\\n\\n` + (output || 'success');
    }"""
if old_fw in js:
    js = js.replace(old_fw, new_fw, 1)
    fixes_count += 1
    print("Fixed runFwCmd!")

# Fix in runPkgCmd
old_pkg = """    function runPkgCmd(cmdStr) {
      cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(commandToRun);
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = output || `Command '${cmdStr}' executed successfully.`;
    }"""
new_pkg = """    function runPkgCmd(cmdStr) {
      cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(cmdStr);
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = output || `Command '${cmdStr}' executed successfully.`;
    }"""
if old_pkg in js:
    js = js.replace(old_pkg, new_pkg, 1)
    fixes_count += 1
    print("Fixed runPkgCmd!")

# 2. Add firewall-cmd, scp, rsync support inside processCommand(cmdStr)
# Find insertion target in processCommand: after journalctl check or at end before return ''
target_str = "    } else if (cmd === 'journalctl') {"

firewall_cmd_code = """    } else if (cmd === 'firewall-cmd') {
      let argsStr = rawArgs.trim();
      if (!argsStr) {
        return `Usage: firewall-cmd [options]\\nOptions:\\n  --get-default-zone            Print default zone\\n  --list-all-zones              List all predefined zones\\n  --set-default-zone=<zone>     Set active default zone\\n  --list-all                    List configured rules in active zone\\n  --add-service=<service>       Add service to zone\\n  --remove-service=<service>    Remove service from zone\\n  --add-port=<port/protocol>    Open port in zone\\n  --remove-port=<port/protocol> Close port in zone\\n  --reload                      Reload firewall configurations`;
      }

      if (!state.defaultZone) state.defaultZone = 'public';
      if (!state.firewallZones) {
        state.firewallZones = {
          public: { services: ['ssh', 'dhcpv6-client'], ports: [], interfaces: ['enp0s3'] },
          work: { services: ['ssh', 'dhcpv6-client', 'http', 'https'], ports: ['8080/tcp'], interfaces: [] },
          home: { services: ['ssh', 'mdns', 'samba-client'], ports: [], interfaces: [] },
          trusted: { services: ['all'], ports: [], interfaces: [] }
        };
      }

      let targetZone = state.defaultZone;
      if (argsStr.includes('--zone=')) {
        let m = argsStr.match(/--zone=([^\\s]+)/);
        if (m) targetZone = m[1];
      }

      if (!state.firewallZones[targetZone]) {
        state.firewallZones[targetZone] = { services: ['ssh'], ports: [], interfaces: [] };
      }

      let zObj = state.firewallZones[targetZone];

      if (argsStr.includes('--get-default-zone')) {
        return state.defaultZone;
      } else if (argsStr.includes('--list-all-zones')) {
        return Object.keys(state.firewallZones).map(z => {
          let item = state.firewallZones[z];
          return `${z} (${z === state.defaultZone ? 'active' : 'inactive'})\\n  target: default\\n  interfaces: ${item.interfaces.join(' ') || 'none'}\\n  services: ${item.services.join(' ')}\\n  ports: ${item.ports.join(' ')}`;
        }).join('\\n\\n');
      } else if (argsStr.includes('--set-default-zone=')) {
        let m = argsStr.match(/--set-default-zone=([^\\s]+)/);
        if (m) {
          state.defaultZone = m[1];
          if (!state.firewallZones[m[1]]) {
            state.firewallZones[m[1]] = { services: ['ssh'], ports: [], interfaces: [] };
          }
          return 'success';
        }
      } else if (argsStr.includes('--list-all')) {
        return `${targetZone} (${targetZone === state.defaultZone ? 'active' : 'inactive'})\\n  target: default\\n  icmp-block-inversion: no\\n  interfaces: ${zObj.interfaces.join(' ') || 'enp0s3'}\\n  sources: \\n  services: ${zObj.services.join(' ')}\\n  ports: ${zObj.ports.join(' ')}\n  protocols: \\n  forward: yes\\n  masquerade: no`;
      } else if (argsStr.includes('--add-service=')) {
        let m = argsStr.match(/--add-service=([^\\s]+)/);
        if (m) {
          let rawSvcs = m[1].replace('{', '').replace('}', '').split(',');
          rawSvcs.forEach(s => {
            let cleanS = s.trim();
            if (cleanS && !zObj.services.includes(cleanS)) zObj.services.push(cleanS);
            if (cleanS && state.firewallServices && !state.firewallServices.includes(cleanS)) state.firewallServices.push(cleanS);
          });
          return 'success';
        }
      } else if (argsStr.includes('--remove-service=')) {
        let m = argsStr.match(/--remove-service=([^\\s]+)/);
        if (m) {
          let rawSvcs = m[1].replace('{', '').replace('}', '').split(',');
          rawSvcs.forEach(s => {
            let cleanS = s.trim();
            zObj.services = zObj.services.filter(x => x !== cleanS);
            if (state.firewallServices) state.firewallServices = state.firewallServices.filter(x => x !== cleanS);
          });
          return 'success';
        }
      } else if (argsStr.includes('--add-port=')) {
        let m = argsStr.match(/--add-port=([^\\s]+)/);
        if (m) {
          let p = m[1].trim();
          if (!zObj.ports.includes(p)) zObj.ports.push(p);
          return 'success';
        }
      } else if (argsStr.includes('--remove-port=')) {
        let m = argsStr.match(/--remove-port=([^\\s]+)/);
        if (m) {
          let p = m[1].trim();
          zObj.ports = zObj.ports.filter(x => x !== p);
          return 'success';
        }
      } else if (argsStr.includes('--reload')) {
        return 'success';
      } else if (argsStr.includes('--state')) {
        return 'running';
      } else {
        return 'success';
      }
    } else if (cmd === 'scp' || cmd === 'rsync') {
      return `[${cmd}]: Transfer operation completed successfully.`;
"""

if target_str in js and "cmd === 'firewall-cmd'" not in js[js.find("function processCommand"):]:
    js = js.replace(target_str, firewall_cmd_code + target_str, 1)
    print("Added firewall-cmd, scp, rsync to processCommand!")

with open(script_path, "w", encoding="utf-8") as f:
    f.write(js)

print(f"Total visualizer functions fixed: {fixes_count}")
