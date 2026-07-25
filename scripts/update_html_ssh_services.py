import os

index_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html"
with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Sidebar Links
sidebar_target = '<li class="menu-item" data-hash="network-management">'
sidebar_addition = """<li class="menu-item" data-hash="ssh-remote-access">
            <a href="#ssh-remote-access" class="menu-link">
              <span>SSH Remote Access</span>
              <div class="progress-dot"></div>
            </a>
          </li>
          <li class="menu-item" data-hash="service-management">
            <a href="#service-management" class="menu-link">
              <span>Service Management</span>
              <div class="progress-dot"></div>
            </a>
          </li>
          """ + sidebar_target

content = content.replace(sidebar_target, sidebar_addition, 1)

# 2. Update Right Panel TOC Links
right_toc_target = '<li class="right-toc-item"><a href="#network-management" class="right-toc-link">Network Management</a></li>'
right_toc_addition = """<li class="right-toc-item"><a href="#ssh-remote-access" class="right-toc-link">SSH Remote Access</a></li>
          <li class="right-toc-item"><a href="#service-management" class="right-toc-link">Service Management</a></li>
          """ + right_toc_target

content = content.replace(right_toc_target, right_toc_addition, 1)

# 3. Add Section #ssh-remote-access and #service-management before #network-management
sections_addition = """
          <!-- SECTION 18c: SSH Remote Access & Security -->
          <section id="ssh-remote-access" class="book-section">
            <h2>SSH Remote Access & Key Authentication</h2>
            <p class="subtitle">Secure CLI remote computer access, sshd_config hardening, and passwordless SSH keypairs</p>

            <p>The <code>ssh</code> (<strong>Secure Shell</strong>) utility is used to access remote computers over a command-line interface. SSH creates an encrypted channel between source and destination machines using public/private key cryptography, operating on <strong>TCP Port 22</strong>. In legacy systems, <em>Telnet</em> was used for remote login, but Telnet sent credentials in plain text and has been replaced by SSH.</p>

            <div class="callout" style="border-left: 4px solid var(--accent); margin-top: 20px;">
              <div class="callout-title" style="color: var(--accent);"><i class="fas fa-terminal"></i> Basic SSH Connection Commands</div>
              <p>To connect from a local machine (e.g. <code>server1</code>) to a remote machine (e.g. <code>192.168.1.3</code>):</p>
              <pre style="background-color: var(--bg-tertiary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff; margin-top: 8px;">
# ssh root@192.168.1.3       - Connect as root user
# ssh harry@192.168.1.3      - Connect as standard user harry
# exit                       - Disconnect / logout session (or press Ctrl+D)</pre>
            </div>

            <!-- Subsection 1: sshd_config Configuration -->
            <h3 style="margin-top: 35px;"><i class="fas fa-sliders-h"></i> 1. Configuring SSH Server Access (<code>/etc/ssh/sshd_config</code>)</h3>
            <p>Access policies and root permissions on the SSH server (e.g. <code>server2</code>) are governed by the configuration file <code>/etc/ssh/sshd_config</code>:</p>

            <div class="comparison-table-wrapper" style="margin-top: 15px;">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Configuration Objective</th>
                    <th>sshd_config Directive & Line</th>
                    <th>Command & Service Reload</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Allow Root SSH Login</strong></td>
                    <td><code>PermitRootLogin yes</code> [ Line 40 ]<br><code>PasswordAuthentication yes</code> [ Line 65 ]</td>
                    <td><code>vim /etc/ssh/sshd_config</code><br><code>systemctl restart sshd</code></td>
                  </tr>
                  <tr>
                    <td><strong>Restrict Root & Specific Users</strong></td>
                    <td><code>PermitRootLogin no</code> [ Line 40 ]<br><code>DenyUsers harry</code> [ Line 41 ]</td>
                    <td><code>vim /etc/ssh/sshd_config</code><br><code>systemctl restart sshd</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Subsection 2: Passwordless Key-Based Authentication -->
            <h3 style="margin-top: 40px;"><i class="fas fa-key"></i> 2. Passwordless Key-Based Authentication</h3>
            <p>Key-based authentication allows users to log into remote servers securely without entering password prompts, using an RSA/ED25519 public-private keypair.</p>

            <div class="perm-builder-group" style="padding: 20px; margin-top: 15px;">
              <h4 style="color: var(--accent); margin-bottom: 12px;"><i class="fas fa-shield-alt"></i> Key-Based Setup & Revocation Steps</h4>

              <p><strong>Step 1: Generate SSH Key Pair (on Client server1)</strong></p>
              <pre style="background-color: var(--bg-tertiary); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff;">
# ssh-keygen    - Generates ~/.ssh/id_rsa (private key) & ~/.ssh/id_rsa.pub (public key)</pre>

              <p style="margin-top: 15px;"><strong>Step 2: Copy Public Key to Remote Host (server2)</strong></p>
              <pre style="background-color: var(--bg-tertiary); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff;">
# ssh-copy-id root@192.168.1.3     - Transfers key to /root/.ssh/authorized_keys
# ssh-copy-id harry@192.168.1.3    - Transfers key to /home/harry/.ssh/authorized_keys</pre>

              <p style="margin-top: 15px;"><strong>Step 3: Verify Passwordless Login & Revoke Keys</strong></p>
              <pre style="background-color: var(--bg-tertiary); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff;">
# ssh root@192.168.1.3             - Connects instantly without password prompt!

# Restrict/Remove Key Auth on Server2:
# rm -rvf /root/.ssh/auth*        - Revokes passwordless login for root
# rm -rvf /home/harry/.ssh/auth*   - Revokes passwordless login for harry</pre>
            </div>

            <!-- Interactive SSH Key Generator Widget -->
            <div class="perm-builder-container" style="margin-top: 25px;">
              <h3><i class="fas fa-key"></i> Interactive SSH Key Generator & Config Builder</h3>
              <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-secondary);">Test interactive SSH key pair generation and authorization commands below:</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background-color: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Remote Server IP & User</label>
                  <input type="text" id="ssh-target-val" value="root@192.168.1.3" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">
                  <div style="display: flex; gap: 8px;">
                    <button class="quiz-btn" id="ssh-keygen-btn" style="flex: 1; font-size: 0.8rem; padding: 6px;"><i class="fas fa-plus-circle"></i> ssh-keygen</button>
                    <button class="quiz-btn" id="ssh-copy-btn" style="flex: 1; font-size: 0.8rem; padding: 6px;"><i class="fas fa-paper-plane"></i> ssh-copy-id</button>
                  </div>
                </div>

                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="ssh-output-display">
                  Click 'ssh-keygen' above to generate RSA 4096-bit key pair...
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 18d: Service Management & Daemons (systemctl) -->
          <section id="service-management" class="book-section">
            <h2>Managing Services & Background Daemons</h2>
            <p class="subtitle">Control systemd background processes, startup units, and daemon health using systemctl</p>

            <p>System services in Linux run in the background as <strong>Daemons</strong> (from ancient Greek, meaning background spirits that work behind the scenes). Unlike regular programs launched by users in the foreground, daemons operate independently and start automatically when the operating system boots up. Common examples include <code>sshd</code> (SSH server), <code>httpd</code> (Web server), <code>crond</code> (Task scheduler), and <code>chronyd</code> (NTP time synchronization).</p>

            <div class="callout" style="border-left: 4px solid var(--accent); margin-top: 20px;">
              <div class="callout-title" style="color: var(--accent);"><i class="fas fa-cogs"></i> What is systemctl?</div>
              <p><code>systemctl</code> is the primary command-line utility used to manage and control systemd background services, target units, and system daemons in modern Linux distributions like RHEL 10.</p>
            </div>

            <!-- Subsection 1: systemctl operations -->
            <h3 style="margin-top: 35px;"><i class="fas fa-terminal"></i> 1. Core Service Control Commands (<code>systemctl</code>)</h3>

            <div class="comparison-table-wrapper" style="margin-top: 15px;">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Service Operation</th>
                    <th>Command Example</th>
                    <th>Result & Action Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Start Service</strong></td>
                    <td><code>systemctl start sshd</code></td>
                    <td>Launches the daemon process into execution immediately.</td>
                  </tr>
                  <tr>
                    <td><strong>Stop Service</strong></td>
                    <td><code>systemctl stop sshd</code></td>
                    <td>Terminates the running daemon process in background memory.</td>
                  </tr>
                  <tr>
                    <td><strong>Restart Service</strong></td>
                    <td><code>systemctl restart sshd</code></td>
                    <td>Stops and restarts the daemon process (reloads updated configurations).</td>
                  </tr>
                  <tr>
                    <td><strong>Check Status</strong></td>
                    <td><code>systemctl status sshd</code></td>
                    <td>Displays process ID (PID), active state (running/dead), memory usage, and recent log snippets.</td>
                  </tr>
                  <tr>
                    <td><strong>Enable on Boot</strong></td>
                    <td><code>systemctl enable sshd</code></td>
                    <td>Creates systemd symlinks so the service starts automatically every time the server boots up.</td>
                  </tr>
                  <tr>
                    <td><strong>Disable on Boot</strong></td>
                    <td><code>systemctl disable sshd</code></td>
                    <td>Removes boot symlinks, preventing the service from starting automatically on reboot.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Interactive Service Controller Widget -->
            <div class="perm-builder-container" style="margin-top: 30px;">
              <h3><i class="fas fa-cogs"></i> Interactive systemctl Service Controller</h3>
              <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-secondary);">Select a service and test interactive <code>systemctl</code> management commands:</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background-color: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Select Daemon Service</label>
                  <select id="svc-name-val" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 15px;">
                    <option value="sshd">sshd (Secure Shell Daemon)</option>
                    <option value="httpd">httpd (Apache Web Server)</option>
                    <option value="crond">crond (Cron Task Scheduler)</option>
                    <option value="chronyd">chronyd (NTP Time Synchronization)</option>
                  </select>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="quiz-btn" id="svc-start-btn" style="font-size: 0.8rem; padding: 6px;"><i class="fas fa-play"></i> start</button>
                    <button class="quiz-btn" id="svc-stop-btn" style="font-size: 0.8rem; padding: 6px;"><i class="fas fa-stop"></i> stop</button>
                    <button class="quiz-btn" id="svc-restart-btn" style="font-size: 0.8rem; padding: 6px;"><i class="fas fa-redo"></i> restart</button>
                    <button class="quiz-btn" id="svc-status-btn" style="font-size: 0.8rem; padding: 6px;"><i class="fas fa-info-circle"></i> status</button>
                    <button class="quiz-btn" id="svc-enable-btn" style="font-size: 0.8rem; padding: 6px;"><i class="fas fa-check"></i> enable</button>
                    <button class="quiz-btn" id="svc-disable-btn" style="font-size: 0.8rem; padding: 6px;"><i class="fas fa-times"></i> disable</button>
                  </div>
                </div>

                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="svc-log-display">
                  Select a service action on the left to execute systemctl commands...
                </div>
              </div>
            </div>

            <div class="callout success" style="margin-top: 30px;">
              <div class="callout-title"><i class="fas fa-check-circle"></i> Ready to control services?</div>
              <p>Practice remote access and daemon controls in the Terminal Playground below! Generate SSH keys with <code>ssh-keygen</code>, copy them with <code>ssh-copy-id</code>, and manage background daemons using <code>systemctl status sshd</code>!</p>
            </div>
          </section>
"""

net_section_target = '<section id="network-management" class="book-section">'
content = content.replace(net_section_target, sections_addition + "\n          " + net_section_target, 1)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated index.html with SSH Remote Access & Service Management sections!")
