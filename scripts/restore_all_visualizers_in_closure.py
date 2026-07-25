import os

script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"

with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

visualizers_code = r'''
  // GRUB PBKDF2 Password Generator Visualizer
  function setupGrubVisualizer() {
    const passInput = document.getElementById('grub-pass-input');
    const generateBtn = document.getElementById('grub-generate-btn');
    const hashOutput = document.getElementById('grub-hash-output');

    if (!generateBtn || !passInput || !hashOutput) return;

    generateBtn.addEventListener('click', () => {
      const pass = passInput.value.trim() || 'redhat123';
      let hashVal = '';
      for (let i = 0; i < pass.length; i++) {
        hashVal += pass.charCodeAt(i).toString(16).toUpperCase();
      }
      while (hashVal.length < 48) {
        hashVal += '8A9B0C1D2E3F456789';
      }
      const fullHash = 'grub.pbkdf2.sha512.10000.' + hashVal.substring(0, 48);
      hashOutput.textContent = 'set superusers="root"\npassword_pbkdf2 root ' + fullHash;
    });
  }

  // NetworkManager Interactive Visualizer
  function setupNetworkVisualizer() {
    const conNameInput = document.getElementById('net-con-name');
    const ifNameInput = document.getElementById('net-if-name');
    const ipInput = document.getElementById('net-ip-val');
    const gwInput = document.getElementById('net-gw-val');
    const dnsInput = document.getElementById('net-dns-val');
    const hostInput = document.getElementById('net-host-val');

    const statusBtn = document.getElementById('net-status-btn');
    const addStaticBtn = document.getElementById('net-add-static-btn');
    const addDhcpBtn = document.getElementById('net-add-dhcp-btn');
    const upBtn = document.getElementById('net-up-btn');
    const downBtn = document.getElementById('net-down-btn');
    const deleteBtn = document.getElementById('net-delete-btn');
    const hostBtn = document.getElementById('net-host-btn');
    const tuiBtn = document.getElementById('net-tui-btn');

    const cmdDisplay = document.getElementById('net-cmd-display');
    const logDisplay = document.getElementById('net-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runNetCmd(cmdStr) {
      cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(cmdStr);
      logDisplay.textContent = output || `Command '${cmdStr}' executed successfully.`;
    }

    if (statusBtn) statusBtn.addEventListener('click', () => runNetCmd('nmcli dev status'));
    if (addStaticBtn) {
      addStaticBtn.addEventListener('click', () => {
        const con = conNameInput ? conNameInput.value.trim() : 'delhi';
        const dev = ifNameInput ? ifNameInput.value.trim() : 'enp0s3';
        const ip = ipInput ? ipInput.value.trim() : '192.168.1.2/24';
        const gw = gwInput ? gwInput.value.trim() : '192.168.1.1';
        const dns = dnsInput ? dnsInput.value.trim() : '192.168.1.1';
        runNetCmd('nmcli conn add con-name ' + con + ' ifname ' + dev + ' type ethernet ipv4.addresses ' + ip + ' gw4 ' + gw + ' ipv4.dns ' + dns + ' connection.autoconnect yes ipv4.method manual');
      });
    }
    if (addDhcpBtn) {
      addDhcpBtn.addEventListener('click', () => {
        const dev = ifNameInput ? ifNameInput.value.trim() : 'enp0s3';
        runNetCmd('nmcli conn add con-name goa ifname ' + dev + ' type ethernet connection.autoconnect yes ipv4.method auto');
      });
    }
    if (upBtn) {
      upBtn.addEventListener('click', () => {
        const con = conNameInput ? conNameInput.value.trim() : 'delhi';
        runNetCmd('nmcli conn up ' + con);
      });
    }
    if (downBtn) {
      downBtn.addEventListener('click', () => {
        const dev = ifNameInput ? ifNameInput.value.trim() : 'enp0s3';
        runNetCmd('nmcli conn down ' + dev);
      });
    }
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const con = conNameInput ? conNameInput.value.trim() : 'delhi';
        runNetCmd('nmcli conn delete ' + con);
      });
    }
    if (hostBtn) {
      hostBtn.addEventListener('click', () => {
        const host = hostInput ? hostInput.value.trim() : 'server1.example.com';
        runNetCmd('hostnamectl set-hostname ' + host);
      });
    }
    if (tuiBtn) {
      tuiBtn.addEventListener('click', () => runNetCmd('nmtui'));
    }
  }

  // SSH Key Generator & Remote Access Visualizer
  function setupSshVisualizer() {
    const targetInput = document.getElementById('ssh-target-val');
    const keygenBtn = document.getElementById('ssh-keygen-btn');
    const copyBtn = document.getElementById('ssh-copy-btn');
    const outputDisplay = document.getElementById('ssh-output-display');

    if (!outputDisplay) return;

    if (keygenBtn) {
      keygenBtn.addEventListener('click', () => {
        const output = processCommand('ssh-keygen');
        outputDisplay.textContent = output;
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const target = targetInput ? targetInput.value.trim() : 'root@192.168.1.3';
        const output = processCommand('ssh-copy-id ' + target);
        outputDisplay.textContent = output;
      });
    }
  }

  // Service Controller Visualizer (systemctl)
  function setupServiceVisualizer() {
    const svcSelect = document.getElementById('svc-name-val');
    const startBtn = document.getElementById('svc-start-btn');
    const stopBtn = document.getElementById('svc-stop-btn');
    const restartBtn = document.getElementById('svc-restart-btn');
    const statusBtn = document.getElementById('svc-status-btn');
    const enableBtn = document.getElementById('svc-enable-btn');
    const disableBtn = document.getElementById('svc-disable-btn');
    const logDisplay = document.getElementById('svc-log-display');

    if (!logDisplay) return;

    function runSvcCmd(action) {
      const svc = svcSelect ? svcSelect.value : 'sshd';
      const output = processCommand('systemctl ' + action + ' ' + svc);
      logDisplay.textContent = `# systemctl ${action} ${svc}\n\n` + (output || `[systemctl ${action} ${svc} executed successfully]`);
    }

    if (startBtn) startBtn.addEventListener('click', () => runSvcCmd('start'));
    if (stopBtn) stopBtn.addEventListener('click', () => runSvcCmd('stop'));
    if (restartBtn) restartBtn.addEventListener('click', () => runSvcCmd('restart'));
    if (statusBtn) statusBtn.addEventListener('click', () => runSvcCmd('status'));
    if (enableBtn) enableBtn.addEventListener('click', () => runSvcCmd('enable'));
    if (disableBtn) disableBtn.addEventListener('click', () => runSvcCmd('disable'));
  }
'''

target_place = "function setupDiskManagerVisualizer() {"
if target_place in js:
    js = js.replace(target_place, visualizers_code + "\n\n  " + target_place, 1)
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(js)
    print("Successfully restored all visualizer function definitions inside closure!")
else:
    print("Could not find target_place in script.js!")
