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
sidebar_target = '<li class="menu-item" data-hash="service-management">'
sidebar_addition = """<li class="menu-item" data-hash="remote-file-transfer">
            <a href="#remote-file-transfer" class="menu-link">
              <span>Remote File Transfer</span>
              <div class="progress-dot"></div>
            </a>
          </li>
          """ + sidebar_target

if 'data-hash="remote-file-transfer"' not in html:
    html = html.replace(sidebar_target, sidebar_addition, 1)

# Right TOC link
right_toc_target = '<li class="right-toc-item"><a href="#service-management" class="right-toc-link">Service Management</a></li>'
right_toc_addition = """<li class="right-toc-item"><a href="#remote-file-transfer" class="right-toc-link">Remote File Transfer</a></li>
          """ + right_toc_target

if 'href="#remote-file-transfer"' not in html:
    html = html.replace(right_toc_target, right_toc_addition, 1)

# Main Book Section HTML
section_html = """
          <!-- SECTION: Remote File Transfer (scp & rsync) -->
          <section id="remote-file-transfer" class="book-section">
            <h2>Remote File Transfer (scp & rsync)</h2>
            <p class="subtitle">Securely copy and synchronize files and directories across local and remote Linux machines over SSH (Port 22)</p>

            <p>Remote file transfer allows Linux system administrators to copy files and directories between a local computer and a remote server or between two remote servers. Both <code>scp</code> and <code>rsync</code> rely on the <strong>SSH (Secure Shell)</strong> protocol on <strong>TCP Port 22</strong> for encrypted data transmission. Historically, <em>Telnet</em> and plain <em>FTP</em> were used, but because they lacked encryption, modern Linux systems standardize on <code>scp</code> and <code>rsync</code>.</p>

            <div class="callout" style="border-left: 4px solid var(--accent); margin-top: 20px;">
              <div class="callout-title" style="color: var(--accent);"><i class="fas fa-network-wired"></i> Key Differences: scp vs rsync</div>
              <ul style="margin-top: 8px; margin-left: 20px; font-size: 0.9rem; line-height: 1.6;">
                <li><strong>scp (Secure Copy)</strong>: Simple, straightforward file copying over SSH. Best for one-time file transfers.</li>
                <li><strong>rsync (Remote Synchronization)</strong>: Advanced tool that checks file timestamps and sizes, transferring <em>only modified delta blocks</em>. Ideal for continuous sync and incremental backups.</li>
              </ul>
            </div>

            <!-- Subsection 1: scp -->
            <h3 style="margin-top: 35px;"><i class="fas fa-copy"></i> 1. Secure Copy Command (<code>scp</code>)</h3>
            <p>The <code>scp</code> command recursively copies files and directories securely using SSH credentials or SSH keys.</p>

            <div class="comparison-table-wrapper" style="margin-top: 15px;">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Transfer Task</th>
                    <th>Command Example</th>
                    <th>Direction & Action Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Preparation</strong></td>
                    <td><code>mkdir /cisco && touch /cisco/router{1..9}.txt</code></td>
                    <td>Creates test directory <code>/cisco</code> with 9 router text files.</td>
                  </tr>
                  <tr>
                    <td><strong>Local to Remote File</strong></td>
                    <td><code>scp -r /cisco/router1.txt root@192.168.1.3:/home/</code></td>
                    <td>Copies single file <code>router1.txt</code> to remote <code>/home/</code> on server2.</td>
                  </tr>
                  <tr>
                    <td><strong>Local to Remote Directory</strong></td>
                    <td><code>scp -r /cisco root@192.168.1.3:/home/</code></td>
                    <td>Recursively copies full directory <code>/cisco/</code> to remote <code>/home/</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Remote to Local File</strong></td>
                    <td><code>scp -r root@192.168.1.3:/home/router1.txt /mnt/</code></td>
                    <td>Downloads remote file <code>/home/router1.txt</code> into local <code>/mnt/</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Remote to Local Directory</strong></td>
                    <td><code>scp -r root@192.168.1.3:/home/cisco /mnt/</code></td>
                    <td>Downloads remote directory <code>/home/cisco</code> into local <code>/mnt/</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Subsection 2: rsync -->
            <h3 style="margin-top: 40px;"><i class="fas fa-sync-alt"></i> 2. Remote Synchronization Command (<code>rsync</code>)</h3>
            <p>The <code>rsync</code> utility synchronizes files across locations while preserving permissions, ownership, and timestamps. Use <code>-r</code> for recursive directory traversal and <code>-v</code> for verbose output.</p>

            <div class="comparison-table-wrapper" style="margin-top: 15px;">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Transfer Task</th>
                    <th>Command Example</th>
                    <th>Direction & Action Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Preparation</strong></td>
                    <td><code>mkdir /aws && touch /aws/server{1..9}.txt</code></td>
                    <td>Creates test directory <code>/aws</code> with 9 server text files.</td>
                  </tr>
                  <tr>
                    <td><strong>Local to Remote File</strong></td>
                    <td><code>rsync -rv /aws/server1.txt root@192.168.1.3:/home/</code></td>
                    <td>Synchronizes <code>server1.txt</code> to remote <code>/home/</code> with verbose output.</td>
                  </tr>
                  <tr>
                    <td><strong>Local to Remote Directory</strong></td>
                    <td><code>rsync -rv /aws root@192.168.1.3:/home/</code></td>
                    <td>Synchronizes full <code>/aws/</code> folder recursively to remote <code>/home/</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Remote to Local File</strong></td>
                    <td><code>rsync -rv root@192.168.1.3:/home/server1.txt /mnt/</code></td>
                    <td>Synchronizes remote file <code>/home/server1.txt</code> into local <code>/mnt/</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Remote to Local Directory</strong></td>
                    <td><code>rsync -rv root@192.168.1.3:/aws /mnt/</code></td>
                    <td>Synchronizes remote directory <code>/aws</code> into local <code>/mnt/</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Interactive Remote Transfer Visualizer Widget -->
            <div class="perm-builder-container" style="margin-top: 30px;">
              <h3><i class="fas fa-exchange-alt"></i> Interactive Remote File Transfer Simulator (scp & rsync)</h3>
              <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-secondary);">Select a command scenario below to simulate live transfers between local and remote hosts:</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background-color: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Tool Selection</label>
                  <select id="transfer-tool-val" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">
                    <option value="scp">scp (Secure Copy Protocol)</option>
                    <option value="rsync">rsync (Remote Sync / Incremental Backup)</option>
                  </select>

                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Source Path</label>
                  <input type="text" id="transfer-src-val" value="/cisco/router1.txt" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">

                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Destination Path</label>
                  <input type="text" id="transfer-dest-val" value="root@192.168.1.3:/home/" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 15px;">

                  <div style="display: flex; gap: 8px;">
                    <button class="quiz-btn" id="transfer-run-btn" style="flex: 1; font-size: 0.85rem; padding: 8px;"><i class="fas fa-paper-plane"></i> Execute Transfer</button>
                    <button class="quiz-btn" id="transfer-reset-btn" style="flex: 1; font-size: 0.85rem; padding: 8px; background-color: var(--bg-tertiary);"><i class="fas fa-redo"></i> Reset Demo</button>
                  </div>
                </div>

                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="transfer-log-display">
                  Click 'Execute Transfer' to run scp or rsync simulation...
                </div>
              </div>
            </div>
          </section>
"""

sec_target = '<section id="service-management" class="book-section">'
if 'id="remote-file-transfer"' not in html:
    html = html.replace(sec_target, section_html + "\n          " + sec_target, 1)

# Quiz Topic Card in #quiz-grid
quiz_card_html = """<div class="quiz-topic-card" data-topic="remote-file-transfer">
                <div class="quiz-topic-icon"><i class="fas fa-exchange-alt"></i></div>
                <div class="quiz-topic-content">
                  <h4>Remote File Transfer (scp & rsync)</h4>
                  <p>Test your knowledge on scp syntax, rsync incremental sync, SSH port 22, and directory flags.</p>
                </div>
                <div class="quiz-topic-meta">
                  <span class="quiz-topic-status" id="quiz-status-remote-file-transfer">Not Started</span>
                  <button class="quiz-start-btn" data-topic="remote-file-transfer">Start Quiz</button>
                </div>
              </div>

              """

quiz_target = '<div class="quiz-topic-card" data-topic="service-management">'
if 'data-topic="remote-file-transfer"' not in html:
    html = html.replace(quiz_target, quiz_card_html + quiz_target, 1)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with Remote File Transfer section & quiz card!")

# ==========================================
# 2. UPDATE JS/SCRIPT.JS
# ==========================================
with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

# Update sectionsList and sectionTitles
target_sec_list = "'ssh-remote-access',"
new_sec_list = "'ssh-remote-access',\n    'remote-file-transfer',"

if "'remote-file-transfer'" not in js:
    js = js.replace(target_sec_list, new_sec_list, 1)

target_sec_titles = "'ssh-remote-access': 'SSH Remote Access & Key Authentication',"
new_sec_titles = "'ssh-remote-access': 'SSH Remote Access & Key Authentication',\n    'remote-file-transfer': 'Remote File Transfer (scp & rsync)',"

if "'remote-file-transfer':" not in js:
    js = js.replace(target_sec_titles, new_sec_titles, 1)

# Add Virtual directories and files for /cisco, /aws, /mnt
vfiles_target = "'/etc/ssh/sshd_config': `# SSH Server Configuration"
vfiles_addition = """'/cisco': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/cisco/router1.txt': `Router1 Config:\nhostname Router1\ninterface GigabitEthernet0/0\n ip address 192.168.1.1 255.255.255.0`,
      '/aws': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/aws/server1.txt': `AWS EC2 Instance Server1:\nInstanceId: i-0a1b2c3d4e5f\nStatus: running`,
      '/mnt': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:mnt_t:s0' },
      """ + vfiles_target

if "'/cisco'" not in js:
    js = js.replace(vfiles_target, vfiles_addition, 1)

# Add Man pages for scp and rsync
man_target = "case 'ssh':"
man_addition = """case 'scp':
             case 'rsync':
               output = `REMOTE-TRANSFER(1)                     User Commands                   REMOTE-TRANSFER(1)

NAME
       scp, rsync - secure remote file copy and synchronization program over SSH (Port 22)

SYNOPSIS
       scp [-r] source user@host:destination
       scp [-r] user@host:source destination
       rsync [-rv] source user@host:destination
       rsync [-rv] user@host:source destination

DESCRIPTION
       scp copies files securely over an encrypted SSH connection.
       rsync synchronizes files efficiently by copying only differences between files.`;
               break;
             """ + man_target

if "case 'scp':" not in js:
    js = js.replace(man_target, man_addition, 1)

# Add processCommand cases for scp & rsync
cmd_target = "case 'ssh':"
cmd_addition = """case 'scp':
          {
            let argsStr = rawArgs.trim();
            if (!argsStr) {
              output = 'usage: scp [-r] source user@host:destination';
              styleClass = 'error';
              break;
            }

            let isRecursive = argsStr.includes('-r') || argsStr.includes('-r');
            let cleanArgs = argsStr.replace(/-r/g, '').replace(/-r/g, '').trim();
            let parts = cleanArgs.split(/\s+/);

            if (parts.length < 2) {
              output = 'scp: missing destination file operand';
              styleClass = 'error';
              break;
            }

            let src = parts[0];
            let dest = parts[1];

            // Local to Remote or Remote to Local simulation
            if (dest.includes('@') || dest.includes(':')) {
              let hostInfo = dest.split(':')[0];
              let remotePath = dest.split(':')[1] || '/home/';
              output = `Sending ${src} to ${hostInfo}:${remotePath} via SSH (Port 22)...
${src}                                                    100%  1024     1.2MB/s   00:00
Transfer complete.`;
            } else if (src.includes('@') || src.includes(':')) {
              let hostInfo = src.split(':')[0];
              let remoteFile = src.split(':')[1] || 'file';
              output = `Downloading ${remoteFile} from ${hostInfo} into ${dest} via SSH (Port 22)...
${remoteFile}                                                100%  1024     2.4MB/s   00:00
Transfer complete.`;
            } else {
              output = `scp -r ${src} ${dest}\nTransfer complete.`;
            }

            styleClass = 'success-text';
          }
          break;

        case 'rsync':
          {
            let argsStr = rawArgs.trim();
            if (!argsStr) {
              output = 'usage: rsync [-rv] source user@host:destination';
              styleClass = 'error';
              break;
            }

            let cleanArgs = argsStr.replace(/-[a-zA-Z]+/g, '').trim();
            let parts = cleanArgs.split(/\s+/);

            let src = parts[0] || '/aws';
            let dest = parts[1] || 'root@192.168.1.3:/home/';

            output = `building file list ... done
sending incremental file list
${src}
${src}/server1.txt
${src}/server2.txt
${src}/server3.txt

sent 4,528 bytes  received 96 bytes  9,248.00 bytes/sec
total size is 4,096  speedup is 0.89 (rsync sync complete over SSH port 22)`;

            styleClass = 'success-text';
          }
          break;

        """ + cmd_target

if "case 'scp':" not in js:
    js = js.replace(cmd_target, cmd_addition, 1)

# Add setupRemoteTransferVisualizer function & call in init
vis_fn = r'''
  // Remote File Transfer Visualizer (scp & rsync)
  function setupRemoteTransferVisualizer() {
    const toolSelect = document.getElementById('transfer-tool-val');
    const srcInput = document.getElementById('transfer-src-val');
    const destInput = document.getElementById('transfer-dest-val');
    const runBtn = document.getElementById('transfer-run-btn');
    const resetBtn = document.getElementById('transfer-reset-btn');
    const logDisplay = document.getElementById('transfer-log-display');

    if (!runBtn || !logDisplay) return;

    runBtn.addEventListener('click', () => {
      const tool = toolSelect ? toolSelect.value : 'scp';
      const src = srcInput ? srcInput.value.trim() : '/cisco/router1.txt';
      const dest = destInput ? destInput.value.trim() : 'root@192.168.1.3:/home/';

      const flag = tool === 'rsync' ? '-rv' : '-r';
      const cmdStr = `${tool} ${flag} ${src} ${dest}`;

      const output = processCommand(cmdStr);
      logDisplay.textContent = `# ${cmdStr}\n\n` + output;
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (srcInput) srcInput.value = '/cisco/router1.txt';
        if (destInput) destInput.value = 'root@192.168.1.3:/home/';
        logDisplay.textContent = "Click 'Execute Transfer' to run scp or rsync simulation...";
      });
    }
  }
'''

init_call_target = "setupDiskManagerVisualizer();"
init_call_addition = "setupDiskManagerVisualizer();\n    setupRemoteTransferVisualizer();"

if "setupRemoteTransferVisualizer();" not in js:
    js = js.replace(init_call_target, init_call_addition, 1)

fn_target = "function setupDiskManagerVisualizer() {"
if "function setupRemoteTransferVisualizer()" not in js:
    js = js.replace(fn_target, vis_fn + "\n\n  " + fn_target, 1)

# Add Quiz category 'remote-file-transfer'
quiz_cat = r''''remote-file-transfer': {
      title: "Remote File Transfer (scp & rsync)",
      questions: [
        {
          question: "Which network port and underlying protocol are used by both 'scp' and 'rsync' for secure transfer?",
          options: [
            "TCP Port 22 over SSH",
            "TCP Port 21 over FTP",
            "TCP Port 80 over HTTP",
            "UDP Port 69 over TFTP"
          ],
          correct: 0,
          explanation: "Both scp and rsync encrypt file transfers using SSH over TCP Port 22 by default."
        },
        {
          question: "What is the primary advantage of 'rsync' over standard 'scp' for file transfers?",
          options: [
            "rsync supports remote synchronization and transfers only modified delta blocks for incremental backups",
            "rsync uses unencrypted plain text for 10x faster transfer speed",
            "rsync automatically deletes local source files upon completion",
            "rsync does not require user authentication on the remote host"
          ],
          correct: 0,
          explanation: "rsync checks file modification timestamps/checksums and transfers only differences (delta transfer), making it ideal for incremental backups."
        },
        {
          question: "Which option flag is required with 'scp' to recursively copy an entire directory?",
          options: [
            "-r (or -R)",
            "-f",
            "-v",
            "-p"
          ],
          correct: 0,
          explanation: "The '-r' (recursive) flag must be specified with 'scp' when copying folders containing subdirectories or multiple files."
        },
        {
          question: "Which command correctly transfers local file '/cisco/router1.txt' to directory '/home/' on remote server '192.168.1.3' as root?",
          options: [
            "scp -r /cisco/router1.txt root@192.168.1.3:/home/",
            "cp /cisco/router1.txt root@192.168.1.3:/home/",
            "rsync --download /cisco/router1.txt 192.168.1.3",
            "ssh 192.168.1.3 send /cisco/router1.txt"
          ],
          correct: 0,
          explanation: "'scp -r /cisco/router1.txt root@192.168.1.3:/home/' transfers the specified local file to the remote server location."
        },
        {
          question: "Which rsync command flags enable recursive directory traversal (-r) and verbose output (-v)?",
          options: [
            "-rv (or -r -v)",
            "-z -a",
            "-x -y",
            "-q -s"
          ],
          correct: 0,
          explanation: "The '-r' flag specifies recursive copying of directories, and '-v' enables verbose output during the rsync process."
        },
        {
          question: "How do you download a remote file '/home/router1.txt' from server '192.168.1.3' into local directory '/mnt/' using scp?",
          options: [
            "scp -r root@192.168.1.3:/home/router1.txt /mnt/",
            "scp -r /mnt/ root@192.168.1.3:/home/router1.txt",
            "rsync -get root@192.168.1.3:/home/router1.txt",
            "ssh pull root@192.168.1.3:/home/router1.txt"
          ],
          correct: 0,
          explanation: "To download from a remote host to a local path, place the remote specifier ('user@host:path') as the first argument and the local directory as the second argument."
        }
      ]
    },
    'ssh-remote-access': {'''

if "'remote-file-transfer': {" not in js:
    js = js.replace("'ssh-remote-access': {", quiz_cat, 1)

with open(script_path, "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/script.js with Remote File Transfer logic, terminal commands, visualizer, and quiz questions!")
