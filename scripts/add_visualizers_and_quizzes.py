with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add setupGrubVisualizer and setupNetworkVisualizer implementations
visualizer_code = r'''
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
      hashOutput.textContent = 'password_pbkdf2 root ' + fullHash;
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
      if (cmdDisplay) cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(cmdStr);
      if (logDisplay) logDisplay.textContent = output;
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
'''

target_init = "setupDiskManagerVisualizer();"
new_init = "setupDiskManagerVisualizer();\n    setupGrubVisualizer();\n    setupNetworkVisualizer();"

if target_init in content:
    content = visualizer_code + "\n" + content
    content = content.replace(target_init, new_init, 1)

# Add quiz category 'network-management'
target_quiz_end = "'disk-partitioning': {"
new_quiz_cat = r''''network-management': {
      title: "Network Management & nmcli",
      questions: [
        {
          question: "Which modern command line utility is used to inspect network interface IP addresses in RHEL 10?",
          options: [
            "ip addr (or ip a)",
            "netstat -a",
            "route -n",
            "ping -c 4"
          ],
          correct: 0,
          explanation: "The 'ip addr' (or 'ip a') command from iproute2 is the standard modern utility for viewing IP addresses and interface states."
        },
        {
          question: "What does the abbreviation 'nmcli' stand for?",
          options: [
            "NetworkManager Command Line Interface",
            "New Media Client Connection Interface",
            "Node Machine Link Controller",
            "Network Module Core Layer Interface"
          ],
          correct: 0,
          explanation: "'nmcli' stands for NetworkManager Command Line Interface."
        },
        {
          question: "Which command displays the hardware interface status, device types, and active connection bindings?",
          options: [
            "nmcli dev status",
            "nmcli conn show",
            "ifconfig --all",
            "hostnamectl status"
          ],
          correct: 0,
          explanation: "'nmcli dev status' lists network interfaces, connection states (connected/disconnected), and bound profiles."
        },
        {
          question: "Which command lists all saved connection profiles along with their UUIDs and interface bindings?",
          options: [
            "nmcli conn show",
            "nmcli dev show",
            "ip link show",
            "cat /etc/hosts"
          ],
          correct: 0,
          explanation: "'nmcli conn show' lists saved NetworkManager connection profiles."
        },
        {
          question: "Which nmcli option creates a static IPv4 connection profile named 'delhi' bound to interface 'enp0s3'?",
          options: [
            "nmcli conn add con-name delhi ifname enp0s3 type ethernet ipv4.addresses 192.168.1.2/24 gw4 192.168.1.1 ipv4.dns 192.168.1.1 connection.autoconnect yes ipv4.method manual",
            "nmcli net create delhi --ip 192.168.1.2",
            "ifconfig enp0s3 192.168.1.2 static",
            "ip addr add 192.168.1.2 dev enp0s3 permanent"
          ],
          correct: 0,
          explanation: "'nmcli conn add' with 'con-name', 'ifname', 'ipv4.addresses', 'gw4', and 'ipv4.method manual' configures a static profile."
        },
        {
          question: "Where are NetworkManager persistent connection keyfile configuration files stored on disk?",
          options: [
            "/etc/NetworkManager/system-connections/",
            "/var/log/network/",
            "/etc/sysconfig/network-scripts/ifcfg-eth0",
            "/usr/lib/systemd/network/"
          ],
          correct: 0,
          explanation: "In modern RHEL, keyfiles are stored under '/etc/NetworkManager/system-connections/'."
        },
        {
          question: "Which command activates a saved connection profile named 'delhi'?",
          options: [
            "nmcli conn up delhi",
            "nmcli conn start delhi",
            "nmcli dev enable delhi",
            "systemctl restart delhi"
          ],
          correct: 0,
          explanation: "Executing 'nmcli conn up delhi' brings up and activates connection profile 'delhi'."
        },
        {
          question: "Which command sets the system static hostname persistently to 'server1.example.com'?",
          options: [
            "hostnamectl set-hostname server1.example.com",
            "hostname --set server1.example.com",
            "nmcli host set server1.example.com",
            "echo server1 > /proc/sys/kernel/hostname"
          ],
          correct: 0,
          explanation: "'hostnamectl set-hostname server1.example.com' updates static hostname settings persistently in /etc/hostname."
        },
        {
          question: "What is 'nmtui'?",
          options: [
            "A ncurses-based Text User Interface for managing NetworkManager interactively",
            "A background kernel daemon for managing routing tables",
            "An graphical web browser for viewing network status",
            "A command for tracing network packet hops"
          ],
          correct: 0,
          explanation: "'nmtui' is a Text User Interface menu-driven application for NetworkManager."
        },
        {
          question: "How do you configure an automatic DHCP connection profile named 'goa' via nmcli?",
          options: [
            "nmcli conn add con-name goa ifname enp0s3 type ethernet connection.autoconnect yes ipv4.method auto",
            "nmcli conn add goa dhcp=on",
            "ip dhcp client add goa",
            "ifconfig enp0s3 dhcp"
          ],
          correct: 0,
          explanation: "Setting 'ipv4.method auto' configures the connection profile to request IP settings from a local DHCP server."
        }
      ]
    },
    'disk-partitioning': {'''

if target_quiz_end in content:
    content = content.replace(target_quiz_end, new_quiz_cat, 1)

target_sys_sec_q = 'question: "What is the result of adding \'kiran ALL=/usr/sbin/useradd\' inside \'/etc/sudoers\'?",'
grub_quiz_qs = r'''question: "What does GRUB stand for, and who created it in 1995?",
          options: [
            "Grand Unified Bootloader; created by Erich Stefan Boleyn",
            "General Red Hat Universal Boot; created by Linus Torvalds",
            "Global Root Unit Binary; created by Ken Thompson",
            "Graphical User Bootloader; created by Richard Stallman"
          ],
          correct: 0,
          explanation: "GRUB stands for Grand Unified Bootloader, invented by Erich Stefan Boleyn in 1995."
        },
        {
          question: "Why is an unprotected GRUB bootloader considered a major security risk?",
          options: [
            "Anyone with console access can edit boot lines, enter Single User Mode (init=/bin/bash), and bypass root passwords",
            "It allows unauthorized users to read encrypted /etc/shadow files directly over network",
            "It automatically formats hard disk partitions upon power failure",
            "It disables firewalld network rules on system bootup"
          ],
          correct: 0,
          explanation: "Console users can edit GRUB boot entries to boot directly into Single User Mode or rescue targets, bypassing password authentication."
        },
        {
          question: "Which command generates a secure PBKDF2 password hash for GRUB configuration?",
          options: [
            "grub2-mkpasswd-pbkdf2",
            "mkpasswd -g grub",
            "passwd --grub-hash",
            "openssl grub-pbkdf2"
          ],
          correct: 0,
          explanation: "The 'grub2-mkpasswd-pbkdf2' utility hashes passwords for use inside GRUB configuration files."
        },
        {
          question: "Which configuration file is edited to define GRUB superuser permissions and password hashes?",
          options: [
            "/etc/grub2.cfg (or /etc/grub.d/40_custom)",
            "/etc/boot.conf",
            "/var/log/grub.log",
            "/etc/security/grub.conf"
          ],
          correct: 0,
          explanation: "GRUB password rules are configured inside '/etc/grub2.cfg' or '/etc/grub.d/' template scripts."
        },
        {
          ''' + target_sys_sec_q

if target_sys_sec_q in content:
    content = content.replace(target_sys_sec_q, grub_quiz_qs, 1)

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully added visualizers and quiz questions!")
