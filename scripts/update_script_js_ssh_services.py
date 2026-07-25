import os

script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"
with open(script_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update virtualFilesContent with sshd_config and authorized_keys
target_vfiles = "'/etc/grub2.cfg': `### BEGIN /etc/grub.d/10_linux ###"
new_vfiles = """'/etc/ssh/sshd_config': `# SSH Server Configuration
Port 22
PermitRootLogin yes
PasswordAuthentication yes
# DenyUsers harry`,
      '/root/.ssh/authorized_keys': `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8v1a2... root@server1`,
      '/home/harry/.ssh/authorized_keys': `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC9w2b3... harry@server1`,
      '/etc/grub2.cfg': `### BEGIN /etc/grub.d/10_linux ###"""

content = content.replace(target_vfiles, new_vfiles, 1)

# 2. Update sectionsList and sectionTitles
target_sec_list = "'network-management',"
new_sec_list = "'ssh-remote-access',\n    'service-management',\n    'network-management',"

content = content.replace(target_sec_list, new_sec_list, 1)

target_sec_titles = "'network-management': 'Network Management in RHEL 10',"
new_sec_titles = "'ssh-remote-access': 'SSH Remote Access & Key Authentication',\n    'service-management': 'Managing Services & Daemons',\n    'network-management': 'Network Management in RHEL 10',"

content = content.replace(target_sec_titles, new_sec_titles, 1)

# 3. Add Man pages
target_man = "case 'grub2-mkpasswd-pbkdf2':"
new_man = """case 'ssh':
             case 'ssh-keygen':
             case 'ssh-copy-id':
               output = `SSH(1)                           User Commands                         SSH(1)

NAME
       ssh, ssh-keygen, ssh-copy-id - OpenSSH remote login client and key management

SYNOPSIS
       ssh [user@]hostname
       ssh-keygen [-t type]
       ssh-copy-id [user@]hostname

DESCRIPTION
       ssh is a program for logging into a remote machine and for executing commands on a remote machine. ssh-keygen generates public/private key pairs, and ssh-copy-id installs keys into authorized_keys.`;
               break;
             case 'grub2-mkpasswd-pbkdf2':"""

content = content.replace(target_man, new_man, 1)

# 4. Add Command Handlers in processCommand
target_cmd = "case 'grub2-mkpasswd-pbkdf2':"
new_cmds = """case 'ssh':
          {
            let sshArgs = rawArgs.trim();
            if (!sshArgs) {
              output = 'usage: ssh [user@]hostname';
              styleClass = 'error';
              break;
            }

            let uName = 'root';
            let host = '192.168.1.3';
            if (sshArgs.includes('@')) {
              let parts = sshArgs.split('@');
              uName = parts[0];
              host = parts[1];
            } else {
              host = sshArgs;
            }

            let sshdCfg = state.virtualFilesContent['/etc/ssh/sshd_config'] || '';
            if (uName === 'root' && sshdCfg.includes('PermitRootLogin no')) {
              output = `ssh: connect to host ${host} port 22: Permission denied (PermitRootLogin=no)`;
              styleClass = 'error';
              break;
            }

            if (sshdCfg.includes(`DenyUsers ${uName}`)) {
              output = `ssh: connect to host ${host} port 22: Permission denied for user ${uName}`;
              styleClass = 'error';
              break;
            }

            let authKeyPath = uName === 'root' ? '/root/.ssh/authorized_keys' : `/home/${uName}/.ssh/authorized_keys`;
            let hasAuthKey = state.virtualFilesContent[authKeyPath] !== undefined;

            state.currentUser = uName;
            state.currentDir = uName === 'root' ? '/root' : `/home/${uName}`;

            if (hasAuthKey) {
              output = `Authenticating with public key '${authKeyPath}'...\n[Connected to remote host ${host} as user '${uName}']`;
            } else {
              output = `${uName}@${host}'s password: \nLast login: Mon Apr 12 2026 from 192.168.1.2\n[Connected to remote host ${host} as user '${uName}']`;
            }
            styleClass = 'success-text';
          }
          break;

        case 'ssh-keygen':
          {
            let uHome = state.currentUser === 'root' ? '/root' : `/home/${state.currentUser}`;
            state.virtualFilesContent[`${uHome}/.ssh/id_rsa`] = '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXk...';
            state.virtualFilesContent[`${uHome}/.ssh/id_rsa.pub`] = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... ${state.currentUser}@server1`;
            
            output = `Generating public/private rsa key pair.
Enter file in which to save the key (${uHome}/.ssh/id_rsa): 
Your identification has been saved in ${uHome}/.ssh/id_rsa
Your public key has been saved in ${uHome}/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:7B9A2C0D4E1F8A9B0C1D2E3F4567890A ${state.currentUser}@server1`;
            styleClass = 'success-text';
          }
          break;

        case 'ssh-copy-id':
          {
            let target = rawArgs.trim() || 'root@192.168.1.3';
            let uName = 'root';
            if (target.includes('@')) uName = target.split('@')[0];

            let authKeyPath = uName === 'root' ? '/root/.ssh/authorized_keys' : `/home/${uName}/.ssh/authorized_keys`;
            state.virtualFilesContent[authKeyPath] = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... ${state.currentUser}@server1`;
            
            output = `/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now sanctions apply

Number of key(s) added: 1

Now try logging into the machine, with: "ssh '${target}'"
and check to make sure that only the key(s) you wanted were added.`;
            styleClass = 'success-text';
          }
          break;

        case 'grub2-mkpasswd-pbkdf2':"""

content = content.replace(target_cmd, new_cmds, 1)

# 5. Add Interactive Visualizers for SSH & Service Control
vis_code = r'''
  // SSH Key Generator & Remote Access Visualizer
  function setupSshVisualizer() {
    const targetInput = document.getElementById('ssh-target-val');
    const keygenBtn = document.getElementById('ssh-keygen-btn');
    const copyBtn = document.getElementById('ssh-copy-btn');
    const outputDisplay = document.getElementById('ssh-output-display');

    if (!keygenBtn || !copyBtn || !outputDisplay) return;

    keygenBtn.addEventListener('click', () => {
      const output = processCommand('ssh-keygen');
      outputDisplay.textContent = output;
    });

    copyBtn.addEventListener('click', () => {
      const target = targetInput ? targetInput.value.trim() : 'root@192.168.1.3';
      const output = processCommand('ssh-copy-id ' + target);
      outputDisplay.textContent = output;
    });
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

target_init_fn = "function setupGrubVisualizer() {"
content = vis_code + "\n" + content

target_init_call = "setupGrubVisualizer();"
new_init_call = "setupGrubVisualizer();\n    setupSshVisualizer();\n    setupServiceVisualizer();"

content = content.replace(target_init_call, new_init_call, 1)

# 6. Add Quiz Categories
target_quiz_end = "'network-management': {"
new_quiz_cats = r''''ssh-remote-access': {
      title: "SSH Remote Access & Key Authentication",
      questions: [
        {
          question: "Which default network TCP port number is used by the SSH (Secure Shell) protocol?",
          options: [
            "22",
            "23",
            "80",
            "443"
          ],
          correct: 0,
          explanation: "SSH operates on TCP Port 22 by default."
        },
        {
          question: "Which legacy unencrypted remote access protocol has been replaced by SSH?",
          options: [
            "Telnet",
            "FTP",
            "HTTP",
            "SMTP"
          ],
          correct: 0,
          explanation: "Telnet transmitted credentials in cleartext and has been replaced by encrypted SSH."
        },
        {
          question: "Which configuration file on the SSH server manages root login permissions and authentication settings?",
          options: [
            "/etc/ssh/sshd_config",
            "/etc/ssh/ssh_config",
            "/etc/security/ssh.conf",
            "/var/log/sshd.log"
          ],
          correct: 0,
          explanation: "The daemon configuration file '/etc/ssh/sshd_config' controls server-side SSH policies."
        },
        {
          question: "Which command generates an RSA public/private keypair for passwordless SSH authentication?",
          options: [
            "ssh-keygen",
            "ssh-copy-id",
            "keygen --ssh",
            "openssl genrsa"
          ],
          correct: 0,
          explanation: "The 'ssh-keygen' command creates public (~/.ssh/id_rsa.pub) and private (~/.ssh/id_rsa) key files."
        },
        {
          question: "Which command transfers a client's public key to a remote host for passwordless authentication?",
          options: [
            "ssh-copy-id user@hostname",
            "scp id_rsa.pub user@hostname",
            "ssh-add user@hostname",
            "cp ~/.ssh/id_rsa.pub /remote"
          ],
          correct: 0,
          explanation: "'ssh-copy-id user@hostname' installs the public key into the remote user's '~/.ssh/authorized_keys' file."
        },
        {
          question: "Where are authorized client public keys stored on the remote SSH server?",
          options: [
            "~/.ssh/authorized_keys",
            "~/.ssh/known_hosts",
            "/etc/ssh/keys.pub",
            "/var/log/authorized_keys"
          ],
          correct: 0,
          explanation: "Authorized keys for a user are appended to their personal '~/.ssh/authorized_keys' file."
        },
        {
          question: "How do you revoke passwordless SSH key authentication for a specific user on a server?",
          options: [
            "Delete or remove their authorized_keys file (e.g. rm -rf ~/.ssh/authorized_keys)",
            "Restart NetworkManager service",
            "Change the user shell to /bin/bash",
            "Run systemctl disable sshd"
          ],
          correct: 0,
          explanation: "Removing the target authorized_keys file revokes passwordless key-based access."
        }
      ]
    },
    'service-management': {
      title: "Managing Services & Daemons",
      questions: [
        {
          question: "What is a 'Daemon' in Linux operating systems?",
          options: [
            "A background process running independently to provide system services",
            "A virus program that infects the kernel",
            "A user interface window manager",
            "A hardware driver module for disk drives"
          ],
          correct: 0,
          explanation: "A daemon is a background process operating independently without user intervention."
        },
        {
          question: "Which primary CLI utility controls and manages systemd background services in RHEL 10?",
          options: [
            "systemctl",
            "service-control",
            "initctl",
            "daemonctl"
          ],
          correct: 0,
          explanation: "'systemctl' is the core command-line utility for managing systemd units and daemons."
        },
        {
          question: "Which systemctl command enables a service to start automatically whenever the server boots up?",
          options: [
            "systemctl enable service_name",
            "systemctl start service_name",
            "systemctl boot service_name",
            "systemctl auto service_name"
          ],
          correct: 0,
          explanation: "'systemctl enable' configures boot symlinks for automatic service startup."
        },
        {
          question: "Which command checks the active process ID, running state, and log output of the SSH daemon?",
          options: [
            "systemctl status sshd",
            "systemctl check sshd",
            "systemctl info sshd",
            "ps -ef sshd"
          ],
          correct: 0,
          explanation: "'systemctl status sshd' displays runtime state, memory usage, PID, and diagnostic log lines."
        }
      ]
    },
    'network-management': {'''

content = content.replace(target_quiz_end, new_quiz_cats, 1)

with open(script_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated js/script.js with SSH Remote Access & Service Management logic!")
