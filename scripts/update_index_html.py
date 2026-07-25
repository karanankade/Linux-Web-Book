import re

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Sidebar Link for Network Management
sidebar_old = '<a href="#bash-scripting" class="menu-link">'
sidebar_new = '<a href="#network-management" class="menu-link"><i class="fas fa-network-wired"></i> Network Management</a>\n          ' + sidebar_old

content = content.replace(sidebar_old, sidebar_new, 1)

# 2. Add GRUB Password Security Subsection to #system-security right before callout success
grub_html = """
            <!-- Subsection 4: GRUB Bootloader Password Security -->
            <h3 style="margin-top: 45px;"><i class="fas fa-key"></i> 4. Protecting GRUB Bootloader with Password Security</h3>
            <p>The <strong>GRUB (Grand Unified Bootloader)</strong> was first created by Erich Stefan Boleyn in 1995 and serves as the default bootloader for Linux and Unix systems. It loads the Linux kernel into memory during bootup.</p>

            <div class="callout warning">
              <div class="callout-title"><i class="fas fa-exclamation-triangle"></i> Security Vulnerability: Single User Mode Bypass</div>
              <p>Without password protection, anyone with physical or VM console access can interrupt the GRUB bootloader menu, append <code>init=/bin/bash</code> or <code>rd.break</code> to kernel parameters, boot directly into Single User Mode, and change the root password or alter security settings without entering any credentials!</p>
            </div>

            <div class="perm-builder-group" style="padding: 20px; margin-top: 20px;">
              <h4 style="color: var(--accent); margin-bottom: 15px;"><i class="fas fa-shield-alt"></i> Step-by-Step GRUB Password Protection</h4>

              <p><strong>Step 1: Generate a Password Hash (PBKDF2)</strong></p>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">Run <code>grub2-mkpasswd-pbkdf2</code>, enter your desired GRUB root password, and copy the output hash string:</p>
              <pre style="background-color: var(--bg-tertiary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff;">
# grub2-mkpasswd-pbkdf2
Enter password: 
Re-enter password: 
PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.C62E4A91B87F...</pre>

              <p style="margin-top: 15px;"><strong>Step 2: Edit GRUB Configuration & Set Password</strong></p>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">Edit <code>/etc/grub2.cfg</code> (or <code>/etc/grub.d/40_custom</code>) and append superuser declarations inside the <code>10_linux</code> module block:</p>
              <pre style="background-color: var(--bg-tertiary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff;">
# vim /etc/grub2.cfg
###### Inside "### BEGIN /etc/grub.d/10_linux ###" module:
set superusers="root"             [ Line 107 ]
export superusers                 [ Line 108 ]
password_pbkdf2 root grub.pbkdf2.sha512.10000.C62E4A91B87F... [ Line 109 ]
:wq!</pre>

              <p style="margin-top: 15px;"><strong>Step 3: Reboot and Verify Security Enforcements</strong></p>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">Reboot the server. When the GRUB menu appears, press <code>e</code> to edit parameters. GRUB will demand valid superuser credentials (<code>root</code> and password) before granting entry to edit boot lines or enter Single User Mode.</p>
            </div>

            <!-- Interactive GRUB PBKDF2 Generator & Config Builder -->
            <div class="perm-builder-container" style="margin-top: 25px;">
              <h3><i class="fas fa-calculator"></i> Interactive GRUB PBKDF2 Password & Config Builder</h3>
              <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-secondary);">Enter a custom GRUB password below to simulate hash generation and preview the resulting <code>/etc/grub2.cfg</code> lines:</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: start;">
                <div style="background-color: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Desired GRUB Password</label>
                  <input type="password" id="grub-pass-input" value="redhat123" placeholder="Enter password..." style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); margin-bottom: 12px;">
                  <button class="quiz-btn" id="grub-generate-btn" style="width: 100%; font-size: 0.85rem; padding: 8px;"><i class="fas fa-lock"></i> Generate PBKDF2 Hash & Config</button>
                </div>
                
                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto;">
                  <span style="color: #6e7681;"># /etc/grub2.cfg Generated Policy Snippet:</span><br>
                  <span style="color: #ff7b72;">set superusers="root"</span><br>
                  <span style="color: #ff7b72;">export superusers</span><br>
                  <span style="color: #79c0ff;" id="grub-hash-output">password_pbkdf2 root grub.pbkdf2.sha512.10000.C62E4A91B87F...</span>
                </div>
              </div>
            </div>
"""

sys_sec_target = '<div class="callout success">\n              <div class="callout-title"><i class="fas fa-terminal"></i> Practice Security in Terminal!</div>'
content = content.replace(sys_sec_target, grub_html + "\n            " + sys_sec_target, 1)

# 3. Add #network-management section before #disk-partitioning
net_html = """
          <!-- SECTION 18b: Network Management in RHEL 10 -->
          <section id="network-management" class="book-section">
            <h2>Network Management in RHEL 10</h2>
            <p class="subtitle">Configure IP addresses, network interfaces, routing, DNS, and hostnames using nmcli & nmtui</p>

            <p>Networking is a fundamental responsibility of Linux system administration. In Red Hat Enterprise Linux (RHEL 10), NetworkManager manages network interfaces, connection profiles, and IP configurations.</p>

            <div class="callout" style="border-left: 4px solid var(--accent); margin-top: 20px;">
              <div class="callout-title" style="color: var(--accent);"><i class="fas fa-network-wired"></i> Network Verification Commands</div>
              <p>To inspect active IP address configurations and interface status, use:</p>
              <pre style="background-color: var(--bg-tertiary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; color: #58a6ff; margin-top: 8px;">
# ip addr      (or # ip a)   - Modern standard for inspecting IP addresses
# ifconfig                    - Legacy networking utility</pre>
            </div>

            <!-- Subsection 1: nmcli -->
            <h3 style="margin-top: 35px;"><i class="fas fa-terminal"></i> 1. NetworkManager Command Line Interface (<code>nmcli</code>)</h3>
            <p><code>nmcli</code> is a powerful command-line tool used to create, display, modify, activate, deactivate, and delete NetworkManager connection profiles.</p>

            <div class="comparison-table-wrapper" style="margin-top: 15px;">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Operation / Task</th>
                    <th>Command Syntax & Example</th>
                    <th>Result & Action Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1. Show Device Status</strong></td>
                    <td><code>nmcli dev status</code></td>
                    <td>Lists hardware ethernet interfaces, device types, states (connected/disconnected), and active connection profiles.</td>
                  </tr>
                  <tr>
                    <td><strong>2. Create Static IP Connection</strong></td>
                    <td><code>nmcli conn add con-name delhi ifname enp0s3 type ethernet ipv4.addresses 192.168.1.2/24 gw4 192.168.1.1 ipv4.dns 192.168.1.1 connection.autoconnect yes ipv4.method manual</code></td>
                    <td>Creates a static IPv4 connection profile named <code>delhi</code> bound to interface <code>enp0s3</code> with gateway and DNS settings.</td>
                  </tr>
                  <tr>
                    <td><strong>3. Show Connection List</strong></td>
                    <td><code>nmcli conn show</code></td>
                    <td>Displays all saved network connection profiles along with UUIDs, connection types, and device bindings.</td>
                  </tr>
                  <tr>
                    <td><strong>4. Deactivate Connection</strong></td>
                    <td><code>nmcli conn down enp0s3</code> (or <code>nmcli conn down delhi</code>)</td>
                    <td>Brings down the active connection interface, disabling network traffic on that device.</td>
                  </tr>
                  <tr>
                    <td><strong>5. Activate Connection</strong></td>
                    <td><code>nmcli conn up delhi</code></td>
                    <td>Brings up and activates the connection profile named <code>delhi</code>. Verify with <code>ifconfig</code> or <code>ip addr</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>6. Modify Connection Properties</strong></td>
                    <td><code>nmcli conn modify delhi ipv4.addresses 192.168.1.20/24</code><br><code>nmcli conn modify delhi gw4 192.168.1.254</code><br><code>nmcli conn modify delhi ipv4.dns 8.8.8.8</code><br><code>nmcli conn modify delhi +ipv4.dns 192.168.1.1</code></td>
                    <td>Updates IP address, gateway, or DNS servers on existing connection profile. (Re-activate using <code>conn down</code> & <code>conn up</code> to apply).</td>
                  </tr>
                  <tr>
                    <td><strong>7. Show Detailed Connection Info</strong></td>
                    <td><code>nmcli conn show delhi</code></td>
                    <td>Prints complete detailed properties of profile <code>delhi</code> including UUID, autoconnect status, and routing tables.</td>
                  </tr>
                  <tr>
                    <td><strong>8. Create DHCP (Auto) Connection</strong></td>
                    <td><code>nmcli conn add con-name goa ifname enp0s3 type ethernet connection.autoconnect yes ipv4.method auto</code></td>
                    <td>Creates an automatic DHCP connection profile named <code>goa</code> that obtains IP configurations dynamically from a local router.</td>
                  </tr>
                  <tr>
                    <td><strong>9. Connection Storage Location</strong></td>
                    <td><code>cd /etc/NetworkManager/system-connections/ && ls</code></td>
                    <td>Directory path where NetworkManager stores persistent connection keyfile configuration files (e.g., <code>delhi.nmconnection</code>).</td>
                  </tr>
                  <tr>
                    <td><strong>10. Delete Connection Profile</strong></td>
                    <td><code>nmcli conn delete delhi</code></td>
                    <td>Permanently deletes connection profile <code>delhi</code> and removes its keyfile from disk.</td>
                  </tr>
                  <tr>
                    <td><strong>11. Set & Verify Hostname</strong></td>
                    <td><code>hostnamectl set-hostname server1.example.com</code><br><code>hostname</code></td>
                    <td>Sets system static hostname persistently in <code>/etc/hostname</code> and updates active shell name.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Subsection 2: nmtui -->
            <h3 style="margin-top: 40px;"><i class="fas fa-window-maximize"></i> 2. NetworkManager Text User Interface (<code>nmtui</code>)</h3>
            <p><code>nmtui</code> is an interactive text-based user interface application for NetworkManager. It provides an intuitive, menu-driven terminal screen for editing connections, setting system hostnames, and activating network interfaces without typing long command flags.</p>

            <pre style="background-color: var(--bg-tertiary); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.9rem; color: #58a6ff;">
# nmtui    - Launches the interactive terminal menu screen for managing network connections</pre>

            <!-- Interactive Network Management Visualizer Widget -->
            <div class="perm-builder-container" style="margin-top: 30px;">
              <h3><i class="fas fa-network-wired"></i> Interactive RHEL 10 Network & nmcli Visualizer</h3>
              <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary);">Configure network profile parameters below and test interactive <code>nmcli</code> and <code>nmtui</code> operations:</p>

              <div class="perm-builder-grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="perm-builder-group">
                  <h4 style="color: var(--accent); margin-bottom: 12px;"><i class="fas fa-sliders-h"></i> Network Profile Parameters</h4>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Connection Name</label>
                      <input type="text" id="net-con-name" value="delhi" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 0.85rem;">
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Interface Name</label>
                      <input type="text" id="net-if-name" value="enp0s3" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 0.85rem;">
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">IPv4 Address & Subnet</label>
                      <input type="text" id="net-ip-val" value="192.168.1.2/24" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 0.85rem;">
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Default Gateway</label>
                      <input type="text" id="net-gw-val" value="192.168.1.1" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 0.85rem;">
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Primary DNS Server</label>
                      <input type="text" id="net-dns-val" value="192.168.1.1" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 0.85rem;">
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Static Hostname</label>
                      <input type="text" id="net-host-val" value="server1.example.com" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); font-size: 0.85rem;">
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="quiz-btn" id="net-status-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-list"></i> nmcli dev status</button>
                    <button class="quiz-btn" id="net-add-static-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-plus-circle"></i> Add Static Conn</button>
                    <button class="quiz-btn" id="net-add-dhcp-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-sync"></i> Add DHCP Conn</button>
                    <button class="quiz-btn" id="net-up-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-play"></i> conn up</button>
                    <button class="quiz-btn" id="net-down-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-stop"></i> conn down</button>
                    <button class="quiz-btn" id="net-delete-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-trash"></i> conn delete</button>
                    <button class="quiz-btn" id="net-host-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-server"></i> Set Hostname</button>
                    <button class="quiz-btn" id="net-tui-btn" style="font-size: 0.75rem; padding: 6px;"><i class="fas fa-desktop"></i> Launch nmtui</button>
                  </div>
                </div>

                <div class="perm-builder-group" style="display: flex; flex-direction: column;">
                  <h4 style="color: var(--accent); margin-bottom: 10px;"><i class="fas fa-terminal"></i> Executed Command & Network Status</h4>
                  <pre style="margin: 0 0 10px 0; background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; font-family: var(--font-mono); font-size: 0.8rem; color: #58a6ff; white-space: pre-wrap;" id="net-cmd-display"># NetworkManager CLI Console Log</pre>
                  <pre style="margin: 0; flex-grow: 1; min-height: 180px; background-color: #1a1a1a; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; font-family: var(--font-mono); font-size: 0.8rem; color: #39ff14; line-height: 1.3;" id="net-log-display">NetworkManager service active. Select an action above to execute nmcli operations.</pre>
                </div>
              </div>
            </div>

            <div class="callout success" style="margin-top: 30px;">
              <div class="callout-title"><i class="fas fa-check-circle"></i> Ready to manage network connections?</div>
              <p>Head over to the Terminal Playground, test <code>nmcli dev status</code>, create network profile <code>delhi</code>, switch IP addresses with <code>nmcli conn modify</code>, set your hostnames with <code>hostnamectl</code>, and inspect system files in <code>/etc/NetworkManager/system-connections/</code>!</p>
            </div>
          </section>
"""

disk_part_target = '<section id="disk-partitioning" class="book-section">'
content = content.replace(disk_part_target, net_html + "\n          " + disk_part_target, 1)

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated index.html!")
