document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  const state = {
    currentSection: 'intro-os',
    completedSections: JSON.parse(localStorage.getItem('linux_book_completed')) || [],
    bookmarks: JSON.parse(localStorage.getItem('linux_book_bookmarks')) || [],
    theme: localStorage.getItem('linux_book_theme') || 'dark',
    currentDir: '/home/student',
    terminalHistory: [],
    terminalMode: 'command', // 'command', 'cat_write', 'cat_append'
    catBuffer: '',
    catTargetFile: '',
    defaultRunlevel: 'graphical.target',
    customTime: 'Mon Apr 12 23:25:50 IST 2026',
    chronydActive: true,
    blockDevices: {
      '/dev/sda': { name: 'sda', size: '20G', type: 'disk', rota: '1', parts: { '/dev/sda1': { name: 'sda1', size: '1G', type: 'part', fs: 'xfs', mount: '/boot', uuid: '4dfa8bfe-3a21-4f11-a101-sda100000001' }, '/dev/sda2': { name: 'sda2', size: '19G', type: 'part', fs: 'xfs', mount: '/', uuid: '98e12c45-8b32-4d12-a102-sda100000002' } } },
      '/dev/sdb': { name: 'sdb', size: '10G', type: 'disk', rota: '0', parts: {} },
      '/dev/vda': { name: 'vda', size: '15G', type: 'disk', rota: '0', parts: {} }
    },
    pvs: {},
    vgs: {},
    lvs: {},
    atJobs: [
      { id: 4, time: 'Mon Apr 12 21:15:00 2026', cmd: 'useradd ajay', user: 'root' }
    ],
    virtualFS: {
      '/': ['bin', 'boot', 'dev', 'etc', 'home', 'media', 'mnt', 'opt', 'proc', 'root', 'sbin', 'tmp', 'usr', 'var', 'gzip', 'bzip', 'xzip', 'jobs'],
      '/jobs': ['script1.sh'],
      '/home': ['student', 'bob', 'city.txt'],
      '/home/student': ['advantages.txt', 'cert_info.txt', 'history.txt', 'redhat_info.txt', 'torvalds_quote.txt', '.bash_profile', '.bashrc', '.bash_logout', 'app.conf', 'users.txt', 'file.txt', 'myscript.sh', 'backup.sh', 'restore.sh', 'app_data'],
      '/home/student/app_data': ['db.sqlite', 'config.json', 'data.csv'],
      '/home/bob': ['.bash_profile', '.bashrc', '.bash_logout'],
      '/etc': ['passwd', 'hosts', 'fstab', 'resolv.conf', 'shells', 'at.deny', 'cron.deny'],
      '/bin': ['ps', 'ls', 'ping', 'grep', 'cp', 'cat', 'uname', 'pwd', 'cd', 'clear', 'whoami', 'history', 'date', 'mkdir', 'touch', 'rm', 'mv', 'at', 'atq', 'atrm', 'crontab', 'timedatectl'],
      '/sbin': ['iptables', 'reboot', 'fdisk', 'ifconfig', 'swapon'],
      '/dev': ['tty1', 'usbmon0', 'sda', 'sda1'],
      '/var': ['log', 'lib', 'mail', 'tmp', 'spool'],
      '/var/spool': ['at', 'cron'],
      '/var/spool/at': ['a000010abdl11'],
      '/var/spool/cron': ['student', 'root'],
      '/gzip': [],
      '/bzip': [],
      '/xzip': [],
      '/var/log': ['messages', 'secure', 'dmesg', 'cron'],
      '/var/lib': [],
      '/var/mail': [],
      '/var/tmp': [],
      '/root': ['root_secrets.txt'],
      '/boot': ['vmlinuz-6.1.0-rhel10', 'initramfs-6.1.0-rhel10.img', 'grub'],
      '/boot/grub': ['grub.cfg'],
      '/opt': [],
      '/proc': ['cpuinfo', 'meminfo', 'version'],
      '/mnt': [],
      '/media': [],
      '/tmp': ['temp_cache.tmp']
    },
    virtualFilesContent: {
      '/home/student/.bash_profile': `# .bash_profile
# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi
PATH=$PATH:$HOME/bin
export PATH`,
      '/home/student/.bashrc': `# .bashrc
# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi
# User specific environment and startup programs`,
      '/home/student/.bash_logout': `# .bash_logout`,

      '/home/bob/.bash_profile': `# .bash_profile\nexport PATH`,
      '/home/bob/.bashrc': `# .bashrc\nalias ll='ls -l'`,
      '/etc/at.deny': `# Users denied from using at
ajay`,
      '/etc/cron.deny': `# Users denied from using crontab
ajay`,
      '/cisco': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/cisco/router1.txt': `Router1 Config:
hostname Router1
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0`,
      '/aws': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/aws/server1.txt': `AWS EC2 Instance Server1:
InstanceId: i-0a1b2c3d4e5f
Status: running`,
      '/mnt': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:mnt_t:s0' },
      '/etc/ssh/sshd_config': `# SSH Server Configuration
Port 22
PermitRootLogin yes
PasswordAuthentication yes
# DenyUsers harry`,
      '/root/.ssh/authorized_keys': `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8v1a2... root@server1`,
      '/home/harry/.ssh/authorized_keys': `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC9w2b3... harry@server1`,
      '/etc/grub2.cfg': `### BEGIN /etc/grub.d/10_linux ###
set superusers="root"
export superusers
password_pbkdf2 root grub.pbkdf2.sha512.10000.C62E4A91B87F90E1D2C3B4A5
### END /etc/grub.d/10_linux ###`,
      '/etc/hostname': `server1.example.com`,
      '/etc/NetworkManager/system-connections/delhi.nmconnection': `[connection]
id=delhi
uuid=a1b2c3d4-e5f6-7890-abcd-1234567890ef
type=ethernet
interface-name=enp0s3
autoconnect=true

[ipv4]
address1=192.168.1.2/24,192.168.1.1
dns=192.168.1.1;
method=manual`,
      '/etc/sudoers': `## Sudoers allow file
root    ALL=(ALL)       ALL
%wheel  ALL=(ALL)       ALL`,
      '/var/log/cron': `Apr 12 23:15:00 rhel10 crond[1204]: (root) CMD (date >> /city.txt)
Apr 12 23:16:00 rhel10 crond[1204]: (root) CMD (date >> /city.txt)
Apr 12 23:20:00 rhel10 crond[1204]: (student) CMD (date >> /city.txt)`,
      '/var/spool/at/a000010abdl11': `#!/bin/sh
# at job 4 for root
useradd ajay`,
      '/var/spool/cron/student': `*/1 * * * * date >> /city.txt`,
      '/var/spool/cron/root': `0 2 * * * /usr/bin/backup.sh`,

      '/jobs/script1.sh': `#!/bin/bash
echo "===================================================" >> /computer.txt
echo " This computer name is=" >> /computer.txt
hostname >> /computer.txt
echo "-----------------------------------------------------------------" >> /computer.txt
echo " kernel version is=" >> /computer.txt
uname -r >> /computer.txt
echo "------------------------------------------------------------------" >> /computer.txt
echo " last 5 user properties = " >> /computer.txt
tail -n 5 /etc/passwd >> /computer.txt
echo "=========================================================" >> /computer.txt`,

      '/home/student/myscript.sh': `#!/bin/bash
# This is my first RHEL shell script
echo "Hello, this is my first RHEL script!"
date`,

      '/home/student/backup.sh': `#!/bin/bash
SOURCE_DIR="./app_data"
BACKUP_DIR="./backups"
DATE=$(date +%F)
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" "$SOURCE_DIR"
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_DIR/app_backup_$DATE.tar.gz"
else
  echo "Backup failed!"
fi`,

      '/home/student/restore.sh': `#!/bin/bash
BACKUP_FILE=$1
RESTORE_DIR="./restore_data"
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore.sh <path_to_backup_tar_gz>"
  exit 1
fi
mkdir -p "$RESTORE_DIR"
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"
echo "Restore completed into $RESTORE_DIR"`,

      '/home/student/app_data/db.sqlite': `[SQLite DB Data]`,
      '/home/student/app_data/config.json': `{"app": "rhel_service", "status": "ok"}`,
      '/home/student/app_data/data.csv': `id,name,role\n1,admin,root\n2,user,student`,

      '/home/city.txt': `Linux is secure OS
linux easy to use
windows and linux OS both are popular
Linux is free`,

      '/home/student/app.conf': `server=localhost
port=8080
timeout=30
loglevel=INFO
enabled=true`,

      '/home/student/users.txt': `root admin 0 active
john dev 1001 active
mary qa 1002 inactive
paul dev 1003 active
lisa hr 1004 inactive`,

      '/home/student/file.txt': `This    is   a     sample   file
Linux		admins	use		sed
Multiple      spaces	and		tabs   here
Extra           spacing      everywhere
End	of	file`,

      '/home/student/advantages.txt': `=== KEY LINUX ADVANTAGES ===
- Open Source: Source code is fully accessible and developable.
- Free of Cost: Download and run without licensing fees.
- High Security: Highly resistant to malware and security breaches.
- Runs Fast on Old Hardware: Lightweight resource footprint.
- Network Friendliness: Powerful built-in networking stack and tools.
- Customizable: Highly configurable kernel and desktop interface.
- Easy & Fast Installation: Install in minutes.
- Stable Performance: Runs for years without rebooting (no blue screens).
- Multitasking: True multi-user, multitasking scheduling.`,

      '/home/student/torvalds_quote.txt': `"I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones..."
- Linus Torvalds, Minix News Group, August 25, 1991.`,

      '/home/student/history.txt': `=== LINUX VERSION TIMELINE ===
- 1969: UNIX created at Bell Labs by Ken Thompson, Dennis Ritchie.
- Sep 17, 1991: Linus Torvalds releases Linux v0.01 (student project Helsinki).
- Oct 5, 1991: First "official" Linux v0.02 released.
- Present: 90% of the world's 500 fastest supercomputers run on Linux (including the top 10).`,

      '/home/student/redhat_info.txt': `=== RED HAT enterprise linux ===
- Founded: 1993, Raleigh, North Carolina by Marc Ewing and Bob Young.
- Current CEO: Matt Hicks (since July 2022).
- Key Product: Red Hat Enterprise Linux (RHEL).
- Core Markets: Enterprises, Corporate datacenters, Cloud environments.`,

      '/home/student/cert_info.txt': `=== RHCSA CERTIFICATION ===
Red Hat Certified System Administrator is highly demanding in the IT industry.
It proves practical command of Red Hat administrative duties.
Key advantages:
- Industry proof of Linux administration knowledge.
- Boosts IT infrastructure support skills.
- Opens doors to developer and enterprise administrator vacancies.`,

      '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
student:x:1000:1000:Student User:/home/student:/bin/bash
bob:x:1001:1001:Secondary User:/home/bob:/bin/bash`,

      '/etc/hosts': `127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6`,

      '/etc/fstab': `/dev/mapper/rhel-root     /                       xfs     defaults        0 0
UUID=4dfa8bfe-3a21-4f11    /boot                   xfs     defaults        0 0
/dev/mapper/rhel-home     /home                   xfs     defaults        0 0`,

      '/etc/resolv.conf': `nameserver 8.8.8.8
nameserver 1.1.1.1`,

      '/etc/shells': `/bin/sh
/bin/bash
/usr/bin/sh
/usr/bin/bash`,

      '/root/root_secrets.txt': `=================================================
*        FLAG: ROOT_ACCESS_GRANTED              *
*                                               *
*   Congratulations! You successfully bypassed  *
*   the user boundaries and accessed /root.    *
*   This demonstrates proper sysadmin privileges *
*   understanding. Keep up the great work!     *
=================================================`,
      '/tmp/temp_cache.tmp': `SYSTEM CACHE: 0x4f8ae98`
    },
    quiz: {
      activeTopic: null,
      currentQuestion: 0,
      score: 0,
      answers: [],
      activeQuestions: []
    },
    vim: {
      active: false,
      fileName: '',
      filePath: '',
      contentLines: [],
      mode: 'normal',
      commandBuffer: '',
      showLineNumbers: false,
      clipboard: [],
      activeLineIndex: 0,
      cursorColIndex: 0,
      history: [],
      historyIndex: -1,
      hasUnsavedChanges: false
    },
    currentUser: 'student',
    userShellStack: ['student'],
    selinuxMode: 'Enforcing',
    firewallServices: ['ssh', 'dhcpv6-client'],
    defaultZone: 'public',
    firewallZones: {
      public: { services: ['ssh', 'dhcpv6-client'], ports: [], interfaces: ['enp0s3'] },
      work: { services: ['ssh', 'dhcpv6-client', 'http', 'https'], ports: ['8080/tcp'], interfaces: [] },
      home: { services: ['ssh', 'mdns', 'samba-client'], ports: [], interfaces: [] },
      trusted: { services: ['all'], ports: [], interfaces: [] }
    },
    virtualUsers: {
      root: { uid: 0, gid: 0, comment: 'root', home: '/root', shell: '/bin/bash', password: 'rootpassword', locked: false, expiry: '' },
      student: { uid: 1000, gid: 1000, comment: 'Student User', home: '/home/student', shell: '/bin/bash', password: 'studentpassword', locked: false, expiry: '' },
      bob: { uid: 1001, gid: 1001, comment: 'Secondary User', home: '/home/bob', shell: '/bin/bash', password: 'bobpassword', locked: false, expiry: '' },
      apache: { uid: 48, gid: 48, comment: 'Apache Web Server', home: '/usr/share/httpd', shell: '/sbin/nologin', password: '*', locked: true, expiry: '' }
    },
    virtualGroups: {
      root: { gid: 0, users: ['root'], admins: [] },
      student: { gid: 1000, users: ['student'], admins: [] },
      bob: { gid: 1001, users: ['bob'], admins: [] },
      apache: { gid: 48, users: ['apache'], admins: [] }
    },
    virtualFileMeta: {
      '/': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:root_t:s0' },
      '/etc': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:etc_t:s0' },
      '/etc/passwd': { owner: 'root', group: 'root', type: '-', permissions: 'rw-r--r--', selinuxContext: 'system_u:object_r:passwd_file_t:s0' },
      '/etc/shadow': { owner: 'root', group: 'root', type: '-', permissions: 'r--------', selinuxContext: 'system_u:object_r:shadow_t:s0' },
      '/home': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:home_root_t:s0' },
      '/home/city.txt': { owner: 'root', group: 'root', type: '-', permissions: 'rw-r--r--', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/jobs': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:admin_home_t:s0' },
      '/jobs/script1.sh': { owner: 'root', group: 'root', type: '-', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:admin_home_t:s0' },
      '/home/student': { owner: 'student', group: 'student', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/student/app.conf': { owner: 'student', group: 'student', type: '-', permissions: 'rw-r--r--', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/student/users.txt': { owner: 'student', group: 'student', type: '-', permissions: 'rw-r--r--', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/student/file.txt': { owner: 'student', group: 'student', type: '-', permissions: 'rw-r--r--', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/student/myscript.sh': { owner: 'student', group: 'student', type: '-', permissions: 'rw-r--r--', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/student/backup.sh': { owner: 'student', group: 'student', type: '-', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/student/restore.sh': { owner: 'student', group: 'student', type: '-', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/home/bob': { owner: 'bob', group: 'bob', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'unconfined_u:object_r:user_home_t:s0' },
      '/root': { owner: 'root', group: 'root', type: 'd', permissions: 'rwx------', selinuxContext: 'system_u:object_r:admin_home_t:s0' },
      '/var': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:var_t:s0' },
      '/var/www': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:httpd_sys_content_t:s0' },
      '/var/www/html': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxr-xr-x', selinuxContext: 'system_u:object_r:httpd_sys_content_t:s0' },
      '/tmp': { owner: 'root', group: 'root', type: 'd', permissions: 'rwxrwxrwt', selinuxContext: 'system_u:object_r:tmp_t:s0' }
    }
  };

  // Passwd and Group Line Builders
  window.updatePasswdLineBuilder = function () {
    const name = (document.getElementById('passwd-val-name')?.value || 'student').trim();
    const password = (document.getElementById('passwd-val-pass')?.value || 'x').trim();
    const uid = (document.getElementById('passwd-val-uid')?.value || '1000').trim();
    const gid = (document.getElementById('passwd-val-gid')?.value || '1000').trim();
    const comment = (document.getElementById('passwd-val-comment')?.value || '').trim();
    const home = (document.getElementById('passwd-val-home')?.value || '/home/student').trim();
    const shell = (document.getElementById('passwd-val-shell')?.value || '/bin/bash').trim();

    const outputEl = document.getElementById('passwd-output-line');
    const explainerEl = document.getElementById('passwd-field-explainer');

    if (!outputEl) return;

    const passwdLine = `${name}:${password}:${uid}:${gid}:${comment}:${home}:${shell}`;
    outputEl.textContent = passwdLine;

    if (explainerEl) {
      explainerEl.innerHTML = `
        <strong>Field Explainer:</strong><br>
        1. <code>${name}</code>: Username used during login.<br>
        2. <code>${password}</code>: Password placeholder (secure encrypted password hashes are stored in <code>/etc/shadow</code>).<br>
        3. <code>${uid}</code>: Unique User Identifier (UID).<br>
        4. <code>${gid}</code>: Primary Group Identifier (GID).<br>
        5. <code>${comment || '(Empty)'}</code>: User metadata/comment (GECOS).<br>
        6. <code>${home}</code>: User home directory.<br>
        7. <code>${shell}</code>: Default shell terminal interpreter.
      `;
    }
  };

  window.updateGroupLineBuilder = function () {
    const name = (document.getElementById('group-val-name')?.value || 'ibmgrp').trim();
    const gid = (document.getElementById('group-val-gid')?.value || '5050').trim();
    const members = (document.getElementById('group-val-members')?.value || '').trim();

    const outputEl = document.getElementById('group-output-line');
    const explainerEl = document.getElementById('group-field-explainer');

    if (!outputEl) return;

    const groupLine = `${name}:x:${gid}:${members}`;
    outputEl.textContent = groupLine;

    if (explainerEl) {
      explainerEl.innerHTML = `
        <strong>Field Explainer:</strong><br>
        1. <code>${name}</code>: Group Name used for access controls.<br>
        2. <code>x</code>: Password placeholder (secure group passwords are stored in <code>/etc/gshadow</code>).<br>
        3. <code>${gid}</code>: Group ID (GID) number.<br>
        4. <code>${members || '(Empty)'}</code>: Secondary group members (comma-separated).
      `;
    }
  };

  // Sections list for validation and navigation
  const sectionsList = [
    'intro-os',
    'client-server',
    'linux-open-source',
    'linux-founder',
    'history-linux',
    'unix-intro',
    'what-is-redhat',
    'rhel-history',
    'rhcsa-certification',
    'rhel10-rhcsa-rhce-roadmap',
    'lab-setup',
    'vm-troubleshooting',
    'boot-process',
    'file-system',
    'bash-commands',
    'file-commands',
    'file-links',
    'vim-editor',
    'user-management',
    'group-management',
    'basic-permissions',
    'acl-permissions',
    'system-security',
    'regular-expressions',
    'archive-files',
    'job-automation',
    'bash-scripting',
    'ssh-remote-access',
    'remote-file-transfer',
    'firewall-management',
    'service-management',
    'network-management',
    'package-management',
    'nfs-server',
    'subscription-manager',
    'selinux-security',
    'web-hosting',
    'mariadb-database',
    'rhel-lightspeed',
    'flatpak-packages',
    'performance-tuning',
    'system-logging',
    'disk-partitioning',
    'rhcsa-exam-practice',
    'linux-interview-qa',
    'terminal-sandbox',
    'knowledge-check'
  ];

  const sectionTitles = {
    'intro-os': 'Operating Systems Overview',
    'client-server': 'Client vs Server Operating Systems',
    'linux-open-source': 'What is Open Source?',
    'linux-founder': 'Linux Founder: Linus Torvalds',
    'history-linux': 'History of Linux',
    'unix-intro': 'UNIX Roots',
    'what-is-redhat': 'What is Red Hat?',
    'rhel-history': 'Red Hat Enterprise Linux',
    'rhcsa-certification': 'Why Become RHCSA Certified?',
    'rhel10-rhcsa-rhce-roadmap': 'RHEL 10 RHCSA & RHCE Official Roadmap',
    'lab-setup': 'Linux Lab Setup Guide',
    'vm-troubleshooting': 'Troubleshooting VM & BIOS',
    'boot-process': 'Linux Boot Process & Runlevels',
    'file-system': 'Linux File System Hierarchy',
    'bash-commands': 'Bash Shell & Basic Commands',
    'file-commands': 'Managing Files & Directories',
    'file-links': 'Soft Links & Hard Links',
    'vim-editor': 'Text Editing with Vim',
    'user-management': 'User Account Management',
    'group-management': 'Group Account Management',
    'basic-permissions': 'Basic File Permissions',
    'acl-permissions': 'ACL File Permissions',
    'system-security': 'Linux System Security',
    'regular-expressions': 'Regular Expressions & Filters',
    'archive-files': 'Archive & Compression',
    'job-automation': 'Job Automation & Scheduling',
    'bash-scripting': 'Bash Scripting & Automation',
    'ssh-remote-access': 'SSH Remote Access & Key Authentication',
    'remote-file-transfer': 'Remote File Transfer (scp & rsync)',
    'firewall-management': 'Firewall Management (firewall-cmd)',
    'service-management': 'Managing Services & Daemons',
    'network-management': 'Network Management in RHEL 10',
    'package-management': 'Package Management in RHEL 10',
    'nfs-server': 'Network File System (NFS Server in RHEL 10)',
    'subscription-manager': 'Red Hat Subscription Manager Registration',
    'selinux-security': 'SELinux (Security-Enhanced Linux in RHEL 10)',
    'web-hosting': 'Web Hosting & Apache Virtual Hosts',
    'mariadb-database': 'MariaDB Database Administration in RHEL 10',
    'rhel-lightspeed': 'RHEL Lightspeed (AI Assistant in RHEL 10)',
    'flatpak-packages': 'Flatpak Universal Application Packaging',
    'performance-tuning': 'System Performance Tuning & Monitoring',
    'system-logging': 'System Logging & Log Analysis',
    'disk-partitioning': 'Disk Partitioning & Storage',
    'rhcsa-exam-practice': 'RHCSA / RHEL 10 Hands-on Exam Practice Lab',
    'linux-interview-qa': 'Linux Student Technical Interview Question Bank (173 Q&As)',
    'terminal-sandbox': 'Linux Terminal Playground',
    'knowledge-check': 'Linux Knowledge Challenge'
  };

  // --- SELECTORS ---
  const elements = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    sidebar: document.getElementById('sidebar'),
    sidebarLinks: document.querySelectorAll('.menu-link'),
    mobileToggle: document.getElementById('mobile-toggle'),
    breadcrumbsSub: document.getElementById('breadcrumbs-sub'),
    contentBody: document.getElementById('content-body'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    progressPercent: document.getElementById('progress-percent'),
    prevBtn: document.getElementById('prev-chapter-btn'),
    nextBtn: document.getElementById('next-chapter-btn'),

    // Search
    searchInput: document.getElementById('search-input'),

    // Bookmark
    bookmarkBtn: document.getElementById('bookmark-btn'),
    bookmarkList: document.getElementById('bookmark-list'),

    // Client vs Server Tabs
    compBtnClient: document.getElementById('comp-btn-client'),
    compBtnServer: document.getElementById('comp-btn-server'),
    compBtnTable: document.getElementById('comp-btn-table'),
    compContentClient: document.getElementById('comp-content-client'),
    compContentServer: document.getElementById('comp-content-server'),
    compContentTable: document.getElementById('comp-content-table'),

    // Terminal
    terminalInput: document.getElementById('terminal-input'),
    terminalHistory: document.getElementById('terminal-history'),
    terminalBody: document.getElementById('terminal-body'),

    // Vim Editor
    terminalVimEditor: document.getElementById('terminal-vim-editor'),
    vimHiddenInput: document.getElementById('vim-hidden-input'),
    vimLineNumbers: document.getElementById('vim-line-numbers'),
    vimTextView: document.getElementById('vim-text-view'),
    vimStatusMode: document.getElementById('vim-status-mode'),
    vimStatusFile: document.getElementById('vim-status-file'),
    vimCommandLine: document.getElementById('vim-command-line'),

    // Quiz
    quizDashboard: document.getElementById('quiz-dashboard'),
    quizWidget: document.getElementById('quiz-widget'),
    quizActiveTopicTitle: document.getElementById('quiz-active-topic-title'),
    quizBackBtn: document.getElementById('quiz-back-btn'),
    quizResultsBackBtn: document.getElementById('quiz-results-back-btn'),
    quizProgressBar: document.getElementById('quiz-progress-bar'),
    quizQuestionContainer: document.getElementById('quiz-question-container'),
    quizResultsContainer: document.getElementById('quiz-results-container'),
    quizPrevBtn: document.getElementById('quiz-prev-btn'),
    quizNextBtn: document.getElementById('quiz-next-btn'),
    quizScoreNum: document.getElementById('quiz-score-num'),
    quizResultsDesc: document.getElementById('quiz-results-desc'),
    quizRetryBtn: document.getElementById('quiz-retry-btn')
  };

  // --- INITIALIZE APPLICATION ---
  function init() {
    // Set active theme
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
    syncUserDatabases();

    // Setup router
    window.addEventListener('hashchange', handleRouting);
    handleRouting(); // First load routing

    // Render bookmarks
    renderBookmarks();

    // Setup UI components listeners
    setupEventListeners();

    // Update progress tracker
    updateReadingProgress();

    // Setup File System Tree
    setupFhsTree();

    // Setup Interactive Permission Builder
    setupPermissionBuilder();

    // Setup Interactive ACL Builder
    setupAclBuilder();

    // Setup Interactive SELinux & Firewall Visualizer
    setupSecurityVisualizer();

    // Setup Interactive Regex Visualizer
    setupRegexVisualizer();

    // Setup Interactive Tar Visualizer
    setupTarVisualizer();

    // Setup Interactive Job Automation Visualizer
    setupJobAutomationVisualizer();

    // Setup Interactive Script Runner Visualizer
    setupScriptRunnerVisualizer();

    // Setup Interactive Disk Partition & Mount Manager Visualizer
    setupDiskManagerVisualizer();
    setupFirewallVisualizer();
    setupRemoteTransferVisualizer();
    setupGrubVisualizer();
    setupSshVisualizer();
    setupServiceVisualizer();
    setupNetworkVisualizer();
    setupPackageVisualizer();
    setupYumServerVisualizer();
    setupNfsVisualizer();
    setupSubManagerVisualizer();
    setupSelinuxVisualizer();
    setupWebServerVisualizer();
    setupMariadbVisualizer();
    setupLinkVisualizer();
    setupLightspeedVisualizer();
    setupFlatpakVisualizer();
    setupPerformanceVisualizer();
    setupLoggingVisualizer();
    setupRhcsaVisualizer();
    setupQaSearchVisualizer();
    setupRoadmapTrackerVisualizer();
    setupBootProcessWidget();

    // Render Quiz Dashboard statuses
    renderQuizDashboard();
  }

  // --- ROUTING / SPA NAVIGATION ---
  function handleRouting() {
    let hash = window.location.hash.substring(1);
    if (!hash || !sectionsList.includes(hash)) {
      hash = sectionsList[0];
      window.location.hash = hash;
      return;
    }

    state.currentSection = hash;

    // Toggle active sections in HTML
    document.querySelectorAll('.book-section').forEach(section => {
      section.classList.remove('active');
    });

    const activeSectionEl = document.getElementById(hash);
    if (activeSectionEl) {
      activeSectionEl.classList.add('active');
    }

    // Toggle sidebar menu state
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
      const itemHash = item.getAttribute('data-hash');
      if (itemHash === hash) {
        item.classList.add('active');
      }
    });

    // Update Breadcrumbs
    elements.breadcrumbsSub.textContent = sectionTitles[hash] || 'Overview';

    // Auto-mark previous sections as read when navigating forward
    const currentIndex = sectionsList.indexOf(hash);
    for (let i = 0; i < currentIndex; i++) {
      markSectionCompleted(sectionsList[i]);
    }

    // Update Bookmark Button state for current page
    updateBookmarkBtnState();

    // Reset layout elements
    elements.contentBody.scrollTop = 0;

    // Close sidebar on mobile
    elements.sidebar.classList.remove('open');

    // Update footer navigation buttons
    updateFooterNavButtons(currentIndex);

    // Initialize widgets in active section
    if (hash === 'terminal-sandbox') {
      setTimeout(() => elements.terminalInput.focus(), 100);
    } else if (hash === 'knowledge-check') {
      loadQuizQuestion();
    } else if (hash === 'user-management') {
      setTimeout(() => { if (window.updatePasswdLineBuilder) window.updatePasswdLineBuilder(); }, 50);
    } else if (hash === 'group-management') {
      setTimeout(() => { if (window.updateGroupLineBuilder) window.updateGroupLineBuilder(); }, 50);
    }
  }

  function updateFooterNavButtons(index) {
    // Previous Chapter Button
    if (index > 0) {
      elements.prevBtn.classList.remove('hidden');
      elements.prevBtn.href = `#${sectionsList[index - 1]}`;
      elements.prevBtn.querySelector('.footer-nav-title').textContent = sectionTitles[sectionsList[index - 1]];
    } else {
      elements.prevBtn.classList.add('hidden');
    }

    // Next Chapter Button
    if (index < sectionsList.length - 1) {
      elements.nextBtn.classList.remove('hidden');
      elements.nextBtn.href = `#${sectionsList[index + 1]}`;
      elements.nextBtn.querySelector('.footer-nav-title').textContent = sectionTitles[sectionsList[index + 1]];
    } else {
      elements.nextBtn.classList.remove('hidden');
      elements.nextBtn.href = '#knowledge-check';
      elements.nextBtn.querySelector('.footer-nav-title').textContent = 'Test Your Knowledge';
    }
  }

  // --- EVENT LISTENERS SETUP ---
  function setupEventListeners() {
    // Mobile menu toggle
    elements.mobileToggle.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
    });

    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('linux_book_theme', state.theme);
      updateThemeIcon();
    });

    // Bookmark actions
    elements.bookmarkBtn.addEventListener('click', toggleBookmark);

    // Client vs Server Tabs Toggle
    elements.compBtnClient.addEventListener('click', () => switchComparisonTab('client'));
    elements.compBtnServer.addEventListener('click', () => switchComparisonTab('server'));
    elements.compBtnTable.addEventListener('click', () => switchComparisonTab('table'));

    // Terminal Emulator
    elements.terminalInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        saveCatBufferAndExit();
      }
    });
    elements.terminalInput.addEventListener('keydown', handleTerminalKeyPress);
    elements.terminalBody.addEventListener('click', () => {
      if (!state.vim.active) {
        elements.terminalInput.focus();
      }
    });

    // Vim Editor Event Listeners
    elements.terminalVimEditor.addEventListener('click', () => {
      if (state.vim.active) {
        elements.vimHiddenInput.focus();
      }
    });
    elements.vimHiddenInput.addEventListener('keydown', handleVimKeyPress);
    elements.vimHiddenInput.addEventListener('input', handleVimInput);

    // Search Engine Filter
    elements.searchInput.addEventListener('input', handleSearch);

    // Quiz Buttons
    elements.quizPrevBtn.addEventListener('click', () => changeQuizQuestion(-1));
    elements.quizNextBtn.addEventListener('click', () => changeQuizQuestion(1));
    elements.quizRetryBtn.addEventListener('click', resetQuiz);
    elements.quizBackBtn.addEventListener('click', exitToDashboard);
    elements.quizResultsBackBtn.addEventListener('click', exitToDashboard);

    // Topic start buttons
    document.querySelectorAll('.quiz-start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topic = e.target.getAttribute('data-topic');
        startQuizTopic(topic);
      });
    });

    // Mobile sidebar toggle and backdrop overlay handlers
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const sidebarEl = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileToggleBtn && sidebarEl) {
      mobileToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebarEl.classList.toggle('open');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
      });
    }

    if (sidebarOverlay && sidebarEl) {
      sidebarOverlay.addEventListener('click', () => {
        sidebarEl.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }

    // Auto-dismiss mobile sidebar when menu item selected
    document.querySelectorAll('.menu-item, .menu-link').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768 && sidebarEl) {
          sidebarEl.classList.remove('open');
          if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
      });
    });

    // Mark current section completed on reaching bottom of page
    elements.contentBody.addEventListener('scroll', () => {
      const scrollHeight = elements.contentBody.scrollHeight;
      const clientHeight = elements.contentBody.clientHeight;
      const scrollTop = elements.contentBody.scrollTop;

      // If user scrolled 85% of page, mark completed
      if ((scrollTop + clientHeight) / scrollHeight > 0.85) {
        markSectionCompleted(state.currentSection);
      }
    });
  }

  // --- THEME ---
  function updateThemeIcon() {
    if (state.theme === 'dark') {
      elements.themeIcon.className = 'fas fa-sun';
      elements.themeToggleBtn.title = 'Switch to Light Mode';
    } else {
      elements.themeIcon.className = 'fas fa-moon';
      elements.themeToggleBtn.title = 'Switch to Dark Mode';
    }
  }

  // --- READING PROGRESS ---
  function markSectionCompleted(sectionHash) {
    if (!state.completedSections.includes(sectionHash)) {
      state.completedSections.push(sectionHash);
      localStorage.setItem('linux_book_completed', JSON.stringify(state.completedSections));

      // Mark sidebar menu element as completed
      const menuEl = document.querySelector(`.menu-item[data-hash="${sectionHash}"]`);
      if (menuEl) {
        menuEl.classList.add('completed');
      }

      updateReadingProgress();
    }
  }

  function updateReadingProgress() {
    // Check initial completed states in sidebar
    state.completedSections.forEach(sectionHash => {
      const menuEl = document.querySelector(`.menu-item[data-hash="${sectionHash}"]`);
      if (menuEl) {
        menuEl.classList.add('completed');
      }
    });

    const percent = Math.round((state.completedSections.length / sectionsList.length) * 100);
    elements.progressBarFill.style.width = `${percent}%`;
    elements.progressPercent.textContent = `${percent}%`;
  }

  // --- BOOKMARKS ENGINE ---
  function toggleBookmark() {
    const section = state.currentSection;
    const title = sectionTitles[section];
    const index = state.bookmarks.findIndex(b => b.hash === section);

    if (index > -1) {
      // Remove bookmark
      state.bookmarks.splice(index, 1);
      elements.bookmarkBtn.classList.remove('active');
      elements.bookmarkBtn.querySelector('span').textContent = 'Bookmark Section';
    } else {
      // Add bookmark
      state.bookmarks.push({ hash: section, title: title });
      elements.bookmarkBtn.classList.add('active');
      elements.bookmarkBtn.querySelector('span').textContent = 'Bookmarked';
    }

    localStorage.setItem('linux_book_bookmarks', JSON.stringify(state.bookmarks));
    renderBookmarks();
  }

  function updateBookmarkBtnState() {
    const section = state.currentSection;
    const isBookmarked = state.bookmarks.some(b => b.hash === section);

    if (isBookmarked) {
      elements.bookmarkBtn.classList.add('active');
      elements.bookmarkBtn.querySelector('span').textContent = 'Bookmarked';
    } else {
      elements.bookmarkBtn.classList.remove('active');
      elements.bookmarkBtn.querySelector('span').textContent = 'Bookmark Section';
    }
  }

  function renderBookmarks() {
    elements.bookmarkList.innerHTML = '';

    if (state.bookmarks.length === 0) {
      const emptyEl = document.createElement('li');
      emptyEl.className = 'bookmark-empty';
      emptyEl.style.color = 'var(--text-muted)';
      emptyEl.style.fontSize = '0.75rem';
      emptyEl.style.textAlign = 'center';
      emptyEl.textContent = 'No bookmarks added yet';
      elements.bookmarkList.appendChild(emptyEl);
      return;
    }

    state.bookmarks.forEach(bookmark => {
      const li = document.createElement('li');
      li.className = 'bookmark-item';

      const span = document.createElement('span');
      span.textContent = bookmark.title;
      span.title = bookmark.title;
      span.addEventListener('click', () => {
        window.location.hash = bookmark.hash;
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'bookmark-delete-btn';
      delBtn.innerHTML = '<i class="fas fa-trash"></i>';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBookmark(bookmark.hash);
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      elements.bookmarkList.appendChild(li);
    });
  }

  function removeBookmark(hash) {
    state.bookmarks = state.bookmarks.filter(b => b.hash !== hash);
    localStorage.setItem('linux_book_bookmarks', JSON.stringify(state.bookmarks));
    renderBookmarks();
    updateBookmarkBtnState();
  }

  // --- CLIENT VS SERVER OS VIEW CONTROLLER ---
  function switchComparisonTab(type) {
    // Remove active styles
    elements.compBtnClient.classList.remove('active');
    elements.compBtnServer.classList.remove('active');
    elements.compBtnTable.classList.remove('active');

    elements.compContentClient.classList.remove('active');
    elements.compContentServer.classList.remove('active');
    elements.compContentTable.classList.remove('active');

    // Add active styles to target
    if (type === 'client') {
      elements.compBtnClient.classList.add('active');
      elements.compContentClient.classList.add('active');
    } else if (type === 'server') {
      elements.compBtnServer.classList.add('active');
      elements.compContentServer.classList.add('active');
    } else {
      elements.compBtnTable.classList.add('active');
      elements.compContentTable.classList.add('active');
    }
  }

  // --- LOCAL SEARCH INDEX ---
  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    document.querySelectorAll('.menu-item').forEach(item => {
      const hash = item.getAttribute('data-hash');
      if (!hash || !sectionTitles[hash]) return;
      const title = sectionTitles[hash].toLowerCase();

      // Basic check
      if (title.includes(query) || query === '') {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // --- MOCK BASH TERMINAL EMULATOR ---
  const terminalFiles = {
    'advantages.txt': `=== KEY LINUX ADVANTAGES ===
- Open Source: Source code is fully accessible and developable.
- Free of Cost: Download and run without licensing fees.
- High Security: Highly resistant to malware and security breaches.
- Runs Fast on Old Hardware: Lightweight resource footprint.
- Network Friendliness: Powerful built-in networking stack and tools.
- Customizable: Highly configurable kernel and desktop interface.
- Easy & Fast Installation: Install in minutes.
- Stable Performance: Runs for years without rebooting (no blue screens).
- Multitasking: True multi-user, multitasking scheduling.`,

    'torvalds_quote.txt': `"I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones..."
- Linus Torvalds, Minix News Group, August 25, 1991.`,

    'history.txt': `=== LINUX VERSION TIMELINE ===
- 1969: UNIX created at Bell Labs by Ken Thompson, Dennis Ritchie.
- Sep 17, 1991: Linus Torvalds releases Linux v0.01 (student project Helsinki).
- Oct 5, 1991: First "official" Linux v0.02 released.
- Present: 90% of the world's 500 fastest supercomputers run on Linux (including the top 10).`,

    'redhat_info.txt': `=== RED HAT enterprise linux ===
- Founded: 1993, Raleigh, North Carolina by Marc Ewing and Bob Young.
- Current CEO: Matt Hicks (since July 2022).
- Key Product: Red Hat Enterprise Linux (RHEL).
- Core Markets: Enterprises, Corporate datacenters, Cloud environments.`,

    'cert_info.txt': `=== RHCSA CERTIFICATION ===
Red Hat Certified System Administrator is highly demanding in the IT industry.
It proves practical command of Red Hat administrative duties.
Key advantages:
- Industry proof of Linux administration knowledge.
- Boosts IT infrastructure support skills.
- Opens doors to developer and enterprise administrator vacancies.`
  };

  const etcFiles = {
    'passwd': `root:x:0:0:root:/root:/bin/bash
student:x:1000:1000:Student User:/home/student:/bin/bash
bob:x:1001:1001:Secondary User:/home/bob:/bin/bash`,
    'hosts': `127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6`,
    'fstab': `/dev/mapper/rhel-root     /                       xfs     defaults        0 0
UUID=4dfa8bfe-3a21-4f11    /boot                   xfs     defaults        0 0
/dev/mapper/rhel-home     /home                   xfs     defaults        0 0`,
    'resolv.conf': `nameserver 8.8.8.8
nameserver 1.1.1.1`,
    'shells': `/bin/sh
/bin/bash
/usr/bin/sh
/usr/bin/bash`
  };

  function getPromptPrefix() {
    if (state.terminalMode === 'cat_write' || state.terminalMode === 'cat_append' || state.terminalMode === 'passwd_prompt') {
      return '> ';
    }

    // Check if shell profile files exist in user's home directory
    const userHome = state.virtualUsers[state.currentUser]?.home || `/home/${state.currentUser}`;
    const rcPath = userHome === '/' ? '/.bashrc' : `${userHome}/.bashrc`;
    const profPath = userHome === '/' ? '/.bash_profile' : `${userHome}/.bash_profile`;
    const hasProfile = state.virtualFilesContent[rcPath] !== undefined || state.virtualFilesContent[profPath] !== undefined;

    const isRoot = state.currentUser === 'root';
    const char = isRoot ? '#' : '$';

    if (!hasProfile && state.currentUser !== 'root') {
      return `bash-5.1${char}`;
    }

    const user = state.currentUser;
    const host = 'rhel10-playground';
    let dir = state.currentDir;
    if (dir === userHome) {
      dir = '~';
    }
    return `${user}@${host}:${dir}${char}`;
  }

  function updatePrompt() {
    const promptEl = document.getElementById('terminal-prompt-prefix');
    if (promptEl) {
      promptEl.textContent = getPromptPrefix() + ' ';
    }
  }

  function getFileSelinuxContext(absPath) {
    const meta = state.virtualFileMeta[absPath];
    if (meta && meta.selinuxContext) return meta.selinuxContext;
    const isDir = state.virtualFS[absPath] !== undefined;
    if (absPath.startsWith('/home/')) {
      return 'unconfined_u:object_r:user_home_t:s0';
    } else if (absPath.startsWith('/var/www/')) {
      return 'system_u:object_r:httpd_sys_content_t:s0';
    } else if (absPath.startsWith('/tmp/')) {
      return 'system_u:object_r:tmp_t:s0';
    } else if (absPath.startsWith('/etc/')) {
      return 'system_u:object_r:etc_t:s0';
    }
    return isDir ? 'system_u:object_r:default_t:s0' : 'system_u:object_r:default_t:s0';
  }

  function resolvePath(path) {
    if (!path) return state.currentDir;

    // Handle home tilde
    const userHome = state.virtualUsers[state.currentUser]?.home || `/home/${state.currentUser}`;
    if (path === '~') {
      return userHome;
    }
    if (path.startsWith('~')) {
      path = userHome + path.substring(1);
    }

    let target = path.startsWith('/') ? path : (state.currentDir === '/' ? '/' + path : state.currentDir + '/' + path);

    // Resolve relative segments
    const segments = target.split('/');
    const resolvedSegments = [];
    for (const seg of segments) {
      if (seg === '' || seg === '.') {
        continue;
      }
      if (seg === '..') {
        resolvedSegments.pop();
      } else {
        resolvedSegments.push(seg);
      }
    }

    return '/' + resolvedSegments.join('/');
  }

  function syncUserDatabases() {
    let passwdContent = '';
    let shadowContent = '';
    let groupContent = '';
    let gshadowContent = '';

    // Sync Users
    Object.keys(state.virtualUsers).forEach(username => {
      const u = state.virtualUsers[username];
      passwdContent += `${username}:x:${u.uid}:${u.gid}:${u.comment || ''}:${u.home}:${u.shell}\n`;

      const passString = u.locked ? `!${u.password}` : u.password;
      shadowContent += `${username}:${passString}:19000:0:99999:7:::\n`;
    });

    // Sync Groups
    Object.keys(state.virtualGroups).forEach(groupname => {
      const g = state.virtualGroups[groupname];
      const membersStr = (g.users || []).join(',');
      const adminsStr = (g.admins || []).join(',');

      groupContent += `${groupname}:x:${g.gid}:${membersStr}\n`;
      gshadowContent += `${groupname}:!:${adminsStr}:${membersStr}\n`;
    });

    state.virtualFilesContent['/etc/passwd'] = passwdContent.trim();
    state.virtualFilesContent['/etc/shadow'] = shadowContent.trim();
    state.virtualFilesContent['/etc/group'] = groupContent.trim();
    state.virtualFilesContent['/etc/gshadow'] = gshadowContent.trim();
  }

  function expandBraces(str) {
    const regex = /(.*?)\{(.*?)\}(.*)/;
    const match = str.match(regex);
    if (!match) return [str];

    const prefix = match[1];
    const rangeStr = match[2];
    const suffix = match[3];

    const parts = rangeStr.split('..');
    if (parts.length !== 2) return [str];

    const start = parts[0];
    const end = parts[1];
    const results = [];

    // Number range, e.g. 4..9
    if (!isNaN(start) && !isNaN(end)) {
      const startNum = parseInt(start);
      const endNum = parseInt(end);
      const isAscending = startNum <= endNum;
      const step = isAscending ? 1 : -1;
      for (let i = startNum; isAscending ? i <= endNum : i >= endNum; i += step) {
        results.push(`${prefix}${i}${suffix}`);
      }
    } else if (start.length === 1 && end.length === 1) {
      // Character range, e.g. a..z
      const startCode = start.charCodeAt(0);
      const endCode = end.charCodeAt(0);
      const isAscending = startCode <= endCode;
      const step = isAscending ? 1 : -1;
      for (let i = startCode; isAscending ? i <= endCode : i >= endCode; i += step) {
        results.push(`${prefix}${String.fromCharCode(i)}${suffix}`);
      }
    } else {
      return [str];
    }
    return results;
  }

  function resolveWildcards(pattern) {
    let dirPath = '';
    let filePattern = '';
    const lastSlash = pattern.lastIndexOf('/');
    if (lastSlash > -1) {
      dirPath = pattern.substring(0, lastSlash) || '/';
      filePattern = pattern.substring(lastSlash + 1);
    } else {
      dirPath = state.currentDir;
      filePattern = pattern;
    }

    const dirContents = state.virtualFS[dirPath];
    if (!dirContents) return [];

    if (filePattern.includes('*') || filePattern.includes('?')) {
      const escapedPattern = filePattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        .replace(/\\\*/g, '.*')
        .replace(/\\\?/g, '.');
      const regex = new RegExp('^' + escapedPattern + '$');
      return dirContents
        .filter(name => regex.test(name))
        .map(name => dirPath === '/' ? '/' + name : dirPath + '/' + name);
    }

    return [pattern];
  }

  function saveCatBufferAndExit() {
    if (state.terminalMode === 'command') return;

    const filePath = state.catTargetFile;
    const content = state.catBuffer;

    const lastSlash = filePath.lastIndexOf('/');
    const dirPath = filePath.substring(0, lastSlash) || '/';
    const fileName = filePath.substring(lastSlash + 1);

    if (state.terminalMode === 'cat_write') {
      state.virtualFilesContent[filePath] = content;
      if (state.virtualFS[dirPath] && !state.virtualFS[dirPath].includes(fileName)) {
        state.virtualFS[dirPath].push(fileName);
      }
      appendTerminalOutput('^D', 'terminal-welcome');
      appendTerminalOutput(`File saved: ${filePath}`, 'success-text');
    } else if (state.terminalMode === 'cat_append') {
      const oldContent = state.virtualFilesContent[filePath] || '';
      state.virtualFilesContent[filePath] = oldContent + content;
      if (state.virtualFS[dirPath] && !state.virtualFS[dirPath].includes(fileName)) {
        state.virtualFS[dirPath].push(fileName);
      }
      appendTerminalOutput('^D', 'terminal-welcome');
      appendTerminalOutput(`File appended: ${filePath}`, 'success-text');
    }

    state.terminalMode = 'command';
    state.catBuffer = '';
    state.catTargetFile = '';
    updatePrompt();
    elements.terminalInput.placeholder = 'Type command...';
    elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
  }

  function handleTerminalKeyPress(e) {
    if (e.ctrlKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (state.terminalMode === 'cat_write' || state.terminalMode === 'cat_append') {
        saveCatBufferAndExit();
      } else {
        appendTerminalOutput(`${getPromptPrefix()} logout`, 'terminal-prompt');
        state.terminalHistory.push('logout');

        let output = '';
        let styleClass = '';
        if (state.userShellStack.length > 1) {
          const prevUser = state.userShellStack.pop();
          state.currentUser = prevUser;
          state.currentDir = state.virtualUsers[prevUser].home || '/home/student';
          output = `Logged out. Back to session as ${prevUser}.`;
          styleClass = 'success-text';
          updatePrompt();
        } else {
          output = 'logout: primary shell session cannot be terminated.';
          styleClass = 'error';
        }
        appendTerminalOutput(output, styleClass);
        elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
      }
      return;
    }

    if (e.key === 'Enter') {
      const commandLine = elements.terminalInput.value;
      elements.terminalInput.value = '';

      if (state.terminalMode === 'cat_write' || state.terminalMode === 'cat_append') {
        appendTerminalOutput(`> ${commandLine}`);

        if (commandLine.trim() === 'ctrl+d' || commandLine.trim() === 'Ctrl+D' || commandLine.trim() === '^D') {
          saveCatBufferAndExit();
        } else {
          state.catBuffer += commandLine + '\n';
        }
        elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
        return;
      }

      if (state.terminalMode === 'passwd_prompt') {
        appendTerminalOutput(`> ` + '*'.repeat(commandLine.length));
        state.virtualUsers[state.passwdTargetUser].password = commandLine || 'password';
        state.virtualUsers[state.passwdTargetUser].locked = false;
        syncUserDatabases();

        state.terminalMode = 'command';
        elements.terminalInput.placeholder = 'Type command...';
        appendTerminalOutput('passwd: all authentication tokens updated successfully.', 'success-text');
        updatePrompt();
        elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
        return;
      }

      if (state.terminalMode === 'su_password_prompt') {
        const inputPass = commandLine;
        const targetUser = state.suTargetUser;
        const targetUserRecord = state.virtualUsers[targetUser];

        appendTerminalOutput(`Password: ` + '*'.repeat(inputPass.length));

        if (targetUserRecord && (inputPass === targetUserRecord.password || inputPass === 'password')) {
          state.userShellStack.push(state.currentUser);
          state.currentUser = targetUser;
          state.currentDir = targetUserRecord.home || '/';
          appendTerminalOutput(`Logged in as ${targetUser}.`, 'success-text');
        } else {
          appendTerminalOutput('su: Authentication failure', 'error');
        }

        state.terminalMode = 'command';
        elements.terminalInput.placeholder = 'Type command...';
        updatePrompt();
        elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
        return;
      }

      let finalCommand = commandLine;
      if (finalCommand.trim().startsWith('!')) {
        const historyIdx = parseInt(finalCommand.trim().substring(1)) - 1;
        if (!isNaN(historyIdx) && state.terminalHistory[historyIdx]) {
          finalCommand = state.terminalHistory[historyIdx];
        }
      }

      const trimmedCommand = finalCommand.trim();
      if (trimmedCommand === '') return;

      // Echo command
      appendTerminalOutput(`${getPromptPrefix()} ${trimmedCommand}`, 'terminal-prompt');
      state.terminalHistory.push(trimmedCommand);

      let commandToRun = trimmedCommand;

      // Expand Environment Variables
      commandToRun = commandToRun.replace(/\$USER/g, state.currentUser);
      commandToRun = commandToRun.replace(/\$HOME/g, state.virtualUsers[state.currentUser]?.home || '/home/student');
      commandToRun = commandToRun.replace(/\$PATH/g, '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin');
      commandToRun = commandToRun.replace(/\$SHELL/g, '/bin/bash');
      commandToRun = commandToRun.replace(/\$PWD/g, state.currentDir);

      // Parse Redirection
      let redirectType = null;
      let redirectFile = null;

      const isCatRedirect = commandToRun.trim().startsWith('cat >') || commandToRun.trim().startsWith('cat >>') || commandToRun.trim().startsWith('cat <');
      if (!isCatRedirect) {
        if (commandToRun.includes('>>')) {
          const splitIdx = commandToRun.indexOf('>>');
          redirectFile = commandToRun.substring(splitIdx + 2).trim();
          commandToRun = commandToRun.substring(0, splitIdx).trim();
          redirectType = 'append';
        } else if (commandToRun.includes('>')) {
          const splitIdx = commandToRun.indexOf('>');
          redirectFile = commandToRun.substring(splitIdx + 1).trim();
          commandToRun = commandToRun.substring(0, splitIdx).trim();
          redirectType = 'write';
        }
      }

      // Parse Pipes
      let pipeTarget = null;
      let pipeArg = '';
      if (commandToRun.includes('|')) {
        const pipeSplit = commandToRun.split('|');
        commandToRun = pipeSplit[0].trim();
        const secondPart = pipeSplit[1].trim();
        const secondTokens = secondPart.split(' ').map(x => x.trim()).filter(Boolean);
        if (secondTokens[0]) {
          pipeTarget = secondTokens[0].toLowerCase();
          pipeArg = secondTokens.slice(1).join(' ');
        }
      }

      // Parse Command
      const parts = commandToRun.split(' ').map(x => x.trim()).filter(Boolean);
      if (parts.length === 0) return;

      let cmd = parts[0].toLowerCase();
      let rawArgs = parts.slice(1).join(' ').trim();

      let runAsRoot = false;
      if (cmd === 'sudo' && parts[1] && parts[1] !== '-i') {
        runAsRoot = true;
        cmd = parts[1].toLowerCase();
        rawArgs = parts.slice(2).join(' ').trim();
      }

      let output = '';
      let styleClass = '';

      const originalUser = state.currentUser;
      if (runAsRoot) {
        state.currentUser = 'root';
      }

      switch (cmd) {
        case 'help':
          output = `Available Commands:
  help               Show this help message
  ls [path]          List folder contents
  cd [path]          Change directory (e.g. cd /, cd ~, cd ..)
  pwd                Print present working directory
  mkdir [options]    Create directories (options: -p for parents)
  touch [files...]   Create empty text files (supports ranges {4..9}, {a..z})
  rm [options]       Remove files/folders (options: -r recursive, -v verbose, -f)
  cat [options]      View/write files (usage: cat file, cat > file, cat >> file)
  cp [options] src   Copy files/directories (options: -r recursive, -v verbose)
  mv src dest        Rename or move files/directories
  whoami             Show logged in user
  uname [-r]         Print kernel info
  history            Show commands history log
  date               Show current system date
  su / sudo -i       Switch user to root superuser
  chmod [options]    Change file/directory permissions (symbolic/octal)
  chown [owner:group] Change file/directory ownership
  chgrp [group]      Change file/directory group membership
  getfacl [file]     Get file Access Control List (ACL)
  setfacl [options]  Set file Access Control List (ACL)
  clear              Clear screen`;
          break;

        case 'cd':
          {
            let target = rawArgs.trim();
            const userHome = state.virtualUsers[state.currentUser]?.home || `/home/${state.currentUser}`;
            let destPath = '';
            if (!target || target === '~') {
              destPath = userHome;
            } else if (target === '-') {
              destPath = state.previousDir || userHome;
              output = destPath;
            } else {
              destPath = resolvePath(target);
            }

            if (state.virtualFS[destPath] !== undefined) {
              state.previousDir = state.currentDir;
              state.currentDir = destPath;
              updatePrompt();
              styleClass = 'success-text';
            } else if (state.virtualFilesContent[destPath] !== undefined) {
              output = `bash: cd: ${target}: Not a directory`;
              styleClass = 'error';
            } else {
              output = `bash: cd: ${target}: No such file or directory`;
              styleClass = 'error';
            }
          }
          break;

        case 'pwd':
          output = state.currentDir;
          break;

        case 'whoami':
          output = state.currentUser;
          break;

        case 'date':
          output = new Date().toString();
          break;

        case 'history':
          output = state.terminalHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
          break;

        case 'uname':
          if (rawArgs === '-r') {
            output = '6.1.0-rhel10';
          } else if (rawArgs === '-a') {
            output = 'Linux rhel10-playground 6.1.0-rhel10 #1 SMP PREEMPT_DYNAMIC Wed Jul 15 09:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux';
          } else if (rawArgs === '') {
            output = 'Linux';
          } else {
            output = `uname: invalid option -- '${rawArgs}'\nTry 'uname --help' for more info.`;
            styleClass = 'error';
          }
          break;

        case 'cal':
          output = `    July 2026      
Su Mo Tu We Th Fr Sa  
          1  2  3  4  
 5  6  7  8  9 10 11  
12 13 14 15 16 17 18  
19 20 21 22 23 24 25  
26 27 28 29 30 31`;
          styleClass = 'success-text';
          break;

        case 'which':
          if (!rawArgs) {
            output = '';
            break;
          }
          const binName = rawArgs.toLowerCase();
          if (['ls', 'cd', 'pwd', 'mkdir', 'touch', 'rm', 'cat', 'cp', 'mv', 'chmod', 'chown', 'chgrp', 'getfacl', 'setfacl', 'which', 'man', 'grep', 'vi', 'vim', 'su', 'useradd', 'userdel', 'usermod', 'groupadd', 'groupdel', 'gpasswd', 'groupmod'].includes(binName)) {
            output = `/usr/bin/${binName}`;
          } else if (['python', 'python3'].includes(binName)) {
            output = `/usr/bin/python3`;
          } else {
            output = `which: no ${binName} in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin)`;
          }
          styleClass = 'success-text';
          break;

        case 'man':
          if (!rawArgs) {
            output = 'What manual page do you want?';
            break;
          }
          const manCmd = rawArgs.toLowerCase();
          switch (manCmd) {
            case 'ls':
              output = `LS(1)                            User Commands                           LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List information about the FILEs (the current directory by default).
       Options:
       -l     use a long listing format
       -a     do not ignore entries starting with .`;
              break;
            case 'pwd':
              output = `PWD(1)                           User Commands                          PWD(1)

NAME
       pwd - print name of current/working directory`;
              break;
            case 'cd':
              output = `CD(1)                            Shell Builtin                          CD(1)

NAME
       cd - change the shell working directory`;
              break;
            case 'grep':
              output = `GREP(1)                          User Commands                          GREP(1)

NAME
       grep - print lines matching a pattern

SYNOPSIS
       grep [OPTIONS] PATTERN [FILE...]

DESCRIPTION
       grep searches the named input FILEs for lines containing a match to the given PATTERN.
       Options:
       -i     Ignore case distinctions in patterns and input data.
       -v     Invert the sense of matching, to select non-matching lines.
       -n     Prefix each line of output with the 1-based line number within its input file.
       -c     Suppress normal output; instead print a count of matching lines for each input file.
       -r     Read all files under each directory, recursively.`;
              break;
            case 'sed':
              output = `SED(1)                           User Commands                           SED(1)

NAME
       sed - stream editor for filtering and transforming text

SYNOPSIS
       sed [OPTION]... {script-only-if-no-other-script} [input-file]...

DESCRIPTION
       sed is a stream editor.  A stream editor is used to perform basic text transformations on an input stream.
       Options:
       -n     suppress automatic printing of pattern space.
       -i     edit files in place (saves changes back to file).
       -E     use extended regular expressions in the script.`;
              break;
            case 'awk':
              output = `AWK(1)                           User Commands                           AWK(1)

NAME
       awk - pattern scanning and processing language

SYNOPSIS
       awk [OPTIONS] 'script' [file...]

DESCRIPTION
       awk scans each input file for lines that match any of a set of patterns specified literally in the script.
       Fields are represented as $1, $2, ..., $NF. $0 represents the entire line.
       NR represents the Number of Records (line number).`;
              break;
            case 'find':
              output = `FIND(1)                          User Commands                          FIND(1)

NAME
       find - search for files in a directory hierarchy

SYNOPSIS
       find [-H] [-L] [-P] [path...] [expression]

DESCRIPTION
       find searches the directory tree rooted at each given file name by evaluating the given expression.
       Options:
       -name PATTERN     Match filename using shell glob.
       -perm MODE        Match file permissions (octal or symbolic).
       -user USERNAME    Match owner username.
       -group GROUPNAME  Match owner group.
       -size [+-]SIZE    Match file size.
       -exec CMD {} \\;   Execute CMD on matching files.`;
              break;
            case 'head':
              output = `HEAD(1)                          User Commands                          HEAD(1)

NAME
       head - output the first part of files

SYNOPSIS
       head [OPTION]... [FILE]...

DESCRIPTION
       Print the first 10 lines of each FILE to standard output.
       Options:
       -n NUM     print the first NUM lines instead of the first 10.`;
              break;
            case 'tail':
              output = `TAIL(1)                          User Commands                          TAIL(1)

NAME
       tail - output the last part of files

SYNOPSIS
       tail [OPTION]... [FILE]...

DESCRIPTION
       Print the last 10 lines of each FILE to standard output.
       Options:
       -n NUM     output the last NUM lines instead of the last 10.
       -f         output appended data as the file grows.`;
              break;
            case 'wc':
              output = `WC(1)                            User Commands                            WC(1)

NAME
       wc - print newline, word, and byte counts for each file

SYNOPSIS
       wc [OPTION]... [FILE]...

DESCRIPTION
       Print newline, word, and byte counts for each FILE.
       Options:
       -l     print the newline counts.
       -w     print the word counts.
       -c     print the byte counts.`;
              break;
            case 'useradd':
              output = `USERADD(8)                     System Administration                    USERADD(8)

NAME
       useradd - create a new user or update default new user information

SYNOPSIS
       useradd [options] LOGIN

DESCRIPTION
       useradd is a low-level utility for adding users.`;
              break;
            case 'usermod':
              output = `USERMOD(8)                     System Administration                    USERMOD(8)

NAME
       usermod - modify a user account

SYNOPSIS
       usermod [options] LOGIN

DESCRIPTION
       usermod modifies the system account files to reflect the changes that are specified on the command line.
       Options:
       -d HOME_DIR     set the user's home directory.`;
              break;
            case 'at':
              output = `AT(1)                            User Commands                            AT(1)

NAME
       at - queue, examine or delete jobs for later execution

SYNOPSIS
       at [-V] [-q queue] [-f file] [-mldbv] TIME

DESCRIPTION
       at executes commands at a specified time once.
       Access control is governed by /etc/at.deny.`;
              break;
            case 'atq':
              output = `ATQ(1)                           User Commands                           ATQ(1)

NAME
       atq - list user's pending at jobs

SYNOPSIS
       atq [-V] [-q queue]

DESCRIPTION
       atq lists the user's pending jobs, unless the user is a superuser.`;
              break;
            case 'atrm':
              output = `ATRM(1)                          User Commands                          ATRM(1)

NAME
       atrm - delete jobs, identified by their job number

SYNOPSIS
       atrm [-V] job...

DESCRIPTION
       atrm deletes jobs, identified by their job number from queue.`;
              break;
            case 'crontab':
              output = `CRONTAB(1)                       User Commands                       CRONTAB(1)

NAME
       crontab - maintain crontab files for individual users

SYNOPSIS
       crontab [-u user] file
       crontab [-u user] [-l | -r | -e]

DESCRIPTION
       crontab is the program used to install, deinstall or list the tables used to serve the crond daemon.
       Options:
       -l     displays the current crontab.
       -r     removes the current crontab.
       -e     edits the current crontab using the editor specified by VISUAL/EDITOR.
       -u     specifies the name of the user whose crontab is to be manipulated.`;
              break;
            case 'timedatectl':
              output = `TIMEDATECTL(1)                   timedatectl                   TIMEDATECTL(1)

NAME
       timedatectl - Control the system time and date

SYNOPSIS
       timedatectl [OPTIONS...] COMMAND ...

DESCRIPTION
       timedatectl may be used to query and change the system clock and its settings.
       Command:
       set-time "YYYY-MM-DD HH:MM:SS"     Set system clock to specified date/time.`;
              break;
            case 'fdisk':
              output = `FDISK(8)                        System Administration                       FDISK(8)

NAME
       fdisk - manipulate disk partition table

SYNOPSIS
       fdisk [-l] [device...]

DESCRIPTION
       fdisk is a dialog-driven program for creation and manipulation of partition tables.`;
              break;
            case 'lsblk':
              output = `LSBLK(8)                        System Administration                       LSBLK(8)

NAME
       lsblk - list block devices

SYNOPSIS
       lsblk [options] [device...]

DESCRIPTION
       lsblk lists information about all available or specified block devices.`;
              break;
            case 'mkfs.xfs':
            case 'mkfs':
              output = `MKFS.XFS(8)                     System Administration                    MKFS.XFS(8)

NAME
       mkfs.xfs - construct an XFS file system

SYNOPSIS
       mkfs.xfs [-f] device

DESCRIPTION
       mkfs.xfs constructs an XFS file system on a specified block partition.`;
              break;
            case 'mount':
              output = `MOUNT(8)                        System Administration                       MOUNT(8)

NAME
       mount - mount a filesystem

SYNOPSIS
       mount [-a] [-t vfstype] device dir

DESCRIPTION
       All files in the file system are attached in a tree structure. mount serves to attach a filesystem.`;
              break;
            case 'umount':
              output = `UMOUNT(8)                       System Administration                      UMOUNT(8)

NAME
       umount - unmount file systems

SYNOPSIS
       umount dir | device

DESCRIPTION
       The umount command detaches the target file system(s) from the file hierarchy.`;
              break;
            case 'blkid':
              output = `BLKID(8)                        System Administration                       BLKID(8)

NAME
       blkid - locate/print block device attributes

SYNOPSIS
       blkid [device...]

DESCRIPTION
       blkid displays UUID and filesystem attribute details for specified block devices.`;
              break;
            case 'e2fsck':
              output = `E2FSCK(8)                       System Administration                      E2FSCK(8)

NAME
       e2fsck - check a Linux ext2/ext3/ext4 file system

SYNOPSIS
       e2fsck [-f] device

DESCRIPTION
       e2fsck is used to check the family of ext2/ext3/ext4 file systems.`;
              break;
            case 'resize2fs':
              output = `RESIZE2FS(8)                    System Administration                   RESIZE2FS(8)

NAME
       resize2fs - ext2/ext3/ext4 file system resizer

SYNOPSIS
       resize2fs device

DESCRIPTION
       The resize2fs program will resize ext2, ext3, or ext4 file systems. It can be used to enlarge or shrink an unmounted filesystem.`;
              break;
            case 'xfs_growfs':
              output = `XFS_GROWFS(8)                   System Administration                  XFS_GROWFS(8)

NAME
       xfs_growfs - expand an XFS file system

SYNOPSIS
       xfs_growfs mount-point

DESCRIPTION
       xfs_growfs grows/expands an online mounted XFS file system.`;
              break;
            case 'free':
              output = `FREE(1)                         User Commands                        FREE(1)

NAME
       free - Display amount of free and used memory in the system

SYNOPSIS
       free [-m]

DESCRIPTION
       free displays the total amount of free and used physical and swap memory in the system.`;
              break;
            case 'mkswap':
              output = `MKSWAP(8)                       System Administration                      MKSWAP(8)

NAME
       mkswap - set up a Linux swap area

SYNOPSIS
       mkswap device

DESCRIPTION
       mkswap sets up a Linux swap area on a device or in a file.`;
              break;
            case 'swapon':
            case 'swapoff':
              output = `SWAPON(8)                       System Administration                      SWAPON(8)

NAME
       swapon, swapoff - enable/disable devices and files for paging and swapping

SYNOPSIS
       swapon [-a] [specialfile...]
       swapoff [-a] [specialfile...]

DESCRIPTION
       swapon and swapoff enable or disable block devices and files for paging and swapping.`;
              break;
            case 'pvcreate':
            case 'pvdisplay':
            case 'pvremove':
            case 'pvs':
              output = `PVCREATE(8)                     System Administration                    PVCREATE(8)

NAME
       pvcreate, pvdisplay, pvremove, pvs - LVM physical volume administration

SYNOPSIS
       pvcreate device [device...]
       pvdisplay [device...]
       pvremove device [device...]
       pvs

DESCRIPTION
       These commands initialize, format, remove, and list Physical Volumes for LVM.`;
              break;
            case 'vgcreate':
            case 'vgdisplay':
            case 'vgextend':
            case 'vgreduce':
            case 'vgremove':
            case 'vgs':
              output = `VGCREATE(8)                     System Administration                    VGCREATE(8)

NAME
       vgcreate, vgdisplay, vgextend, vgreduce, vgremove, vgs - LVM volume group administration

SYNOPSIS
       vgcreate vg_name device [device...]
       vgdisplay [vg_name...]
       vgextend vg_name device [device...]
       vgreduce vg_name device [device...]
       vgremove vg_name
       vgs

DESCRIPTION
       These commands create, display, extend, shrink, and remove Volume Groups.`;
              break;
            case 'lvcreate':
            case 'lvdisplay':
            case 'lvextend':
            case 'lvreduce':
            case 'lvremove':
            case 'lvs':
              output = `LVCREATE(8)                     System Administration                    LVCREATE(8)

NAME
       lvcreate, lvdisplay, lvextend, lvreduce, lvremove, lvs - LVM logical volume administration

SYNOPSIS
       lvcreate -L size -n lv_name vg_name
       lvdisplay [lv_path...]
       lvextend -L [+]size lv_path
       lvreduce -L [-]size lv_path
       lvremove lv_path
       These commands carve, display, extend, shrink, and remove Logical Volumes.`;
              break;
            case 'scp':
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
             case 'ssh':
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
              output = `Authenticating with public key '${authKeyPath}'...
[Connected to remote host ${host} as user '${uName}']`;
            } else {
              output = `${uName}@${host}'s password: 
Last login: Mon Apr 12 2026 from 192.168.1.2
[Connected to remote host ${host} as user '${uName}']`;
            }
            styleClass = 'success-text';
          }
          break;

        case 'ssh-keygen':
          {
            let uHome = state.currentUser === 'root' ? '/root' : `/home/${state.currentUser}`;
            state.virtualFilesContent[`${uHome}/.ssh/id_rsa`] = `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXk...`;
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


             case 'grub2-mkpasswd-pbkdf2':
        case 'grub-mkpasswd-pbkdf2':
          {
            output = `Enter password: 
Re-enter password: 
PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.C62E4A91B87F90E1D2C3B4A5968778E21029384756`;
            styleClass = 'success-text';
          }
          break;

        case 'ifconfig':
          {
            output = `enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe11:2233  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:11:22:33  txqueuelen 1000  (Ethernet)
        RX packets 12450  bytes 8920140 (8.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8420  bytes 1204890 (1.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 450  bytes 32100 (31.3 KiB)
        TX packets 450  bytes 32100 (31.3 KiB)`;
            styleClass = 'success-text';
          }
          break;

        case 'ip':
          {
            let ipArgs = rawArgs.trim();
            if (ipArgs.startsWith('a') || ipArgs.startsWith('addr') || !ipArgs) {
              output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:11:22:33 brd ff:ff:ff:ff:ff:ff
    altname enp0s3
    inet 192.168.1.2/24 brd 192.168.1.255 scope global noprefixroute enp0s3
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fe11:2233/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever`;
            } else if (ipArgs.startsWith('link')) {
              output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000`;
            } else {
              output = `Usage: ip [addr|link|route]`;
            }
            styleClass = 'success-text';
          }
          break;

        case 'nmcli':
          {
            let nmTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (nmTokens.length === 0) {
              output = 'Usage: nmcli [dev|conn] [status|show|add|modify|up|down|delete]';
              styleClass = 'error';
              break;
            }

            let sub = nmTokens[0];
            if (sub === 'dev' || sub === 'device') {
              if (nmTokens[1] === 'status' || nmTokens.length === 1) {
                output = `DEVICE  TYPE      STATE      CONNECTION 
enp0s3  ethernet  connected  delhi      
lo      loopback  unmanaged  --         `;
              } else {
                output = `DEVICE  TYPE      STATE      CONNECTION
enp0s3  ethernet  connected  delhi`;
              }
              styleClass = 'success-text';
            } else if (sub === 'conn' || sub === 'connection') {
              let action = nmTokens[1] || 'show';
              if (action === 'show') {
                let name = nmTokens[2];
                if (name) {
                  output = `connection.id:                         ${name}
connection.uuid:                       a1b2c3d4-e5f6-7890-abcd-1234567890ef
connection.type:                       802-3-ethernet
connection.interface-name:             enp0s3
connection.autoconnect:                yes
ipv4.method:                           manual
ipv4.addresses:                        192.168.1.2/24
ipv4.gateway:                          192.168.1.1
ipv4.dns:                              192.168.1.1`;
                } else {
                  output = `NAME   UUID                                  TYPE      DEVICE 
delhi  a1b2c3d4-e5f6-7890-abcd-1234567890ef  ethernet  enp0s3 
goa    b2c3d4e5-f6a7-8901-bcde-234567890efa  ethernet  --     `;
                }
                styleClass = 'success-text';
              } else if (action === 'add') {
                // nmcli conn add con-name delhi ...
                let conName = 'new-conn';
                for (let i = 2; i < nmTokens.length; i++) {
                  if (nmTokens[i] === 'con-name' && nmTokens[i+1]) conName = nmTokens[i+1];
                }
                state.virtualFilesContent[`/etc/NetworkManager/system-connections/${conName}.nmconnection`] = `[connection]
id=${conName}
type=ethernet
interface-name=enp0s3
autoconnect=true

[ipv4]
method=manual`;
                if (!state.virtualFS['/etc/NetworkManager/system-connections'].includes(`${conName}.nmconnection`)) {
                  state.virtualFS['/etc/NetworkManager/system-connections'].push(`${conName}.nmconnection`);
                }
                output = `Connection '${conName}' (a1b2c3d4-e5f6-7890-abcd-1234567890ef) successfully added.`;
                styleClass = 'success-text';
              } else if (action === 'up') {
                let target = nmTokens[2] || 'delhi';
                output = `Connection '${target}' successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/1)`;
                styleClass = 'success-text';
              } else if (action === 'down') {
                let target = nmTokens[2] || 'enp0s3';
                output = `Connection '${target}' successfully deactivated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/1)`;
                styleClass = 'success-text';
              } else if (action === 'modify') {
                let target = nmTokens[2] || 'delhi';
                output = `Connection '${target}' successfully modified.`;
                styleClass = 'success-text';
              } else if (action === 'delete') {
                let target = nmTokens[2] || 'delhi';
                delete state.virtualFilesContent[`/etc/NetworkManager/system-connections/${target}.nmconnection`];
                state.virtualFS['/etc/NetworkManager/system-connections'] = state.virtualFS['/etc/NetworkManager/system-connections'].filter(f => !f.startsWith(target));
                output = `Connection '${target}' (a1b2c3d4-e5f6-7890-abcd-1234567890ef) successfully deleted.`;
                styleClass = 'success-text';
              } else {
                output = `Unknown nmcli action: ${action}`;
                styleClass = 'error';
              }
            } else {
              output = 'Usage: nmcli [dev|conn] [status|show|add|modify|up|down|delete]';
              styleClass = 'error';
            }
          }
          break;

        case 'nmtui':
          {
            output = `+------------------ NetworkManager TUI -------------------+
|                                                         |
|  Please select an option                                |
|                                                         |
|  Edit a connection                                      |
|  Activate a connection                                  |
|  Set system hostname                                    |
|                                                         |
|  < Quit >                                               |
|                                                         |
+---------------------------------------------------------+`;
            styleClass = 'success-text';
          }
          break;

        case 'hostnamectl':
          {
            let hToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (hToks[0] === 'set-hostname' && hToks[1]) {
              let newHost = hToks[1];
              state.virtualFilesContent['/etc/hostname'] = newHost;
              output = `Static hostname updated to '${newHost}'`;
              styleClass = 'success-text';
            } else {
              let hName = state.virtualFilesContent['/etc/hostname'] || 'server1.example.com';
              output = ` Static hostname: ${hName.trim()}
       Icon name: computer-vm
         Chassis: vm
      Machine ID: a1b2c3d4e5f67890abcd1234567890ef
        Boot ID: f6e5d4c3b2a10987dcba654321fedcba
 Virtualization: oracle
Operating System: Red Hat Enterprise Linux 10.0 (Nightly Build)
     CPE OS Name: cpe:/o:redhat:enterprise_linux:10
          Kernel: Linux 6.11.0-100.el10.x86_64
    Architecture: x86-64`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'hostname':
          {
            let hName = rawArgs.trim();
            if (hName) {
              state.virtualFilesContent['/etc/hostname'] = hName;
              output = hName;
            } else {
              output = (state.virtualFilesContent['/etc/hostname'] || 'server1.example.com').trim();
            }
            styleClass = 'success-text';
          }
          break;

        case 'sudo':
            case 'visudo':
              output = `SUDO(8)                         System Administration                       SUDO(8)

NAME
       sudo, visudo - execute a command as another user or edit sudoers file

SYNOPSIS
       sudo [-u user] command
       visudo

DESCRIPTION
       sudo allows a permitted user to execute a command as the superuser or another user, according to specifications in /etc/sudoers.`;
              break;
            case 'gpasswd':
              output = `GPASSWD(1)                      User Commands                       GPASSWD(1)

NAME
       gpasswd - administer /etc/group and /etc/gshadow

SYNOPSIS
       gpasswd -a user group

DESCRIPTION
       The gpasswd command is used to administer /etc/group. Every group can have administrators, members and a password. Use -a to add a user to a group.`;
              break;
            case 'su':
              output = `SU(1)                           User Commands                         SU(1)

NAME
       su - run a command with substitute user and group ID

SYNOPSIS
       su [-] [username]

DESCRIPTION
       su is used to become another user during a login session.`;
              break;
            default:
              output = `No manual entry for ${rawArgs}`;
          }
          styleClass = 'success-text';
          break;

        case 'less':
        case 'more':
          if (!rawArgs) {
            output = `Usage: ${cmd} <file>`;
            styleClass = 'error';
            break;
          }
          const pagerAbs = resolvePath(rawArgs);
          if (state.virtualFilesContent[pagerAbs] !== undefined) {
            output = state.virtualFilesContent[pagerAbs];
          } else {
            output = `${cmd}: ${rawArgs}: No such file or directory`;
            styleClass = 'error';
          }
          styleClass = 'success-text';
          break;

        case 'head':
          let headLinesCount = 10;
          let headFile = rawArgs;
          let headMatch = rawArgs.match(/^-n\s+(\d+)\s+(.+)$/) || rawArgs.match(/^-(\d+)\s+(.+)$/);
          if (headMatch) {
            headLinesCount = parseInt(headMatch[1]);
            headFile = headMatch[2];
          }
          const headAbs = resolvePath(headFile);
          if (state.virtualFilesContent[headAbs] !== undefined) {
            let lines = state.virtualFilesContent[headAbs].split('\n');
            output = lines.slice(0, headLinesCount).join('\n');
          } else {
            output = `head: cannot open '${headFile}' for reading: No such file or directory`;
            styleClass = 'error';
          }
          styleClass = 'success-text';
          break;

        case 'tail':
          let tailLinesCount = 10;
          let tailFile = rawArgs;
          let isLive = false;
          if (rawArgs.startsWith('-f')) {
            isLive = true;
            tailFile = rawArgs.replace('-f', '').trim();
          } else {
            let tailMatch = rawArgs.match(/^-n\s+(\d+)\s+(.+)$/) || rawArgs.match(/^-(\d+)\s+(.+)$/);
            if (tailMatch) {
              tailLinesCount = parseInt(tailMatch[1]);
              tailFile = tailMatch[2];
            }
          }
          const tailAbs = resolvePath(tailFile);
          if (state.virtualFilesContent[tailAbs] !== undefined) {
            let lines = state.virtualFilesContent[tailAbs].split('\n');
            output = lines.slice(-tailLinesCount).join('\n');
            if (isLive) {
              output += '\n\n[Live log monitoring active... Press Ctrl+C to stop]';
            }
          } else {
            output = `tail: cannot open '${tailFile}' for reading: No such file or directory`;
            styleClass = 'error';
          }
          styleClass = 'success-text';
          break;

        case 'echo':
          let echoStr = rawArgs;
          const substMatch = echoStr.match(/\$\(([^)]+)\)/);
          if (substMatch) {
            const subCmd = substMatch[1].trim();
            if (subCmd === 'date') {
              echoStr = echoStr.replace(substMatch[0], new Date().toString());
            } else if (subCmd === 'whoami') {
              echoStr = echoStr.replace(substMatch[0], state.currentUser);
            } else if (subCmd === 'pwd') {
              echoStr = echoStr.replace(substMatch[0], state.currentDir);
            }
          }
          output = echoStr.replace(/^['"]|['"]$/g, '');
          styleClass = 'success-text';
          break;

        case 'env':
          output = `USER=${state.currentUser}
HOME=${state.virtualUsers[state.currentUser]?.home || '/home/student'}
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
SHELL=/bin/bash
PWD=${state.currentDir}`;
          styleClass = 'success-text';
          break;

        case 'ls':
          let lsTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          let showLong = false;
          let showDirItself = false;
          let showSelinux = false;
          let showHidden = false;
          let paths = [];

          lsTokens.forEach(t => {
            if (t.startsWith('-')) {
              if (t.includes('l')) showLong = true;
              if (t.includes('d')) showDirItself = true;
              if (t.includes('Z')) showSelinux = true;
              if (t.includes('a')) showHidden = true;
            } else {
              paths.push(t);
            }
          });

          let targetLs = paths[0] ? resolvePath(paths[0]) : state.currentDir;

          // Helper to get formatted string for a path
          const getLongListing = (absPath, nameOnly = false) => {
            const meta = state.virtualFileMeta[absPath] || {};
            const isDir = state.virtualFS[absPath] !== undefined;
            const owner = meta.owner || 'root';
            const group = meta.group || 'root';
            const typeChar = isDir ? 'd' : '-';
            let perms = meta.permissions || (isDir ? 'rwxr-xr-x' : 'rw-r--r--');

            // Apply special permissions formatting
            let permArr = perms.split('');
            if (meta.special) {
              if (meta.special.suid) permArr[2] = permArr[2] === 'x' ? 's' : 'S';
              if (meta.special.sgid) permArr[5] = permArr[5] === 'x' ? 's' : 'S';
              if (meta.special.sticky) permArr[8] = permArr[8] === 'x' ? 't' : 'T';
            }
            perms = permArr.join('');

            // Add + sign if custom ACLs exist
            let aclSign = '';
            if (meta.acls && (Object.keys(meta.acls.users || {}).length > 0 || Object.keys(meta.acls.groups || {}).length > 0)) {
              aclSign = '+';
            }

            // Hard link count
            const links = isDir ? 2 : 1;

            // Size
            let size = isDir ? 4096 : 0;
            if (!isDir && state.virtualFilesContent[absPath] !== undefined) {
              size = state.virtualFilesContent[absPath].length;
            }

            // Date
            const dateStr = 'Jul 15 22:30';

            const baseName = absPath === '/' ? '/' : absPath.substring(absPath.lastIndexOf('/') + 1);
            const dispName = nameOnly ? nameOnly : baseName;

            let sePart = '';
            if (showSelinux) {
              sePart = ' ' + getFileSelinuxContext(absPath);
            }

            return `${typeChar}${perms}${aclSign}${sePart} ${links} ${owner} ${group} ${size} ${dateStr} ${dispName}`;
          };

          if (showDirItself) {
            // Print the directory/file itself
            const exists = state.virtualFS[targetLs] !== undefined || state.virtualFilesContent[targetLs] !== undefined;
            if (!exists) {
              output = `ls: cannot access '${paths[0] || ''}': No such file or directory`;
              styleClass = 'error';
            } else {
              if (showLong) {
                output = getLongListing(targetLs, paths[0] || '.');
              } else if (showSelinux) {
                output = `${getFileSelinuxContext(targetLs)} ${paths[0] || '.'}`;
              } else {
                output = paths[0] || '.';
              }
              styleClass = 'success-text';
            }
          } else {
            // Standard directory listing
            if (state.virtualFS[targetLs]) {
              let files = state.virtualFS[targetLs];
              if (!showHidden) {
                files = files.filter(f => !f.startsWith('.'));
              }
              if (showLong) {
                let lines = [];
                files.forEach(f => {
                  const subPath = targetLs === '/' ? `/${f}` : `${targetLs}/${f}`;
                  lines.push(getLongListing(subPath));
                });
                output = lines.join('\n');
              } else if (showSelinux) {
                let lines = [];
                files.forEach(f => {
                  const subPath = targetLs === '/' ? `/${f}` : `${targetLs}/${f}`;
                  lines.push(`${getFileSelinuxContext(subPath)} ${f}`);
                });
                output = lines.join('\n');
              } else {
                output = files.join('    ');
              }
              styleClass = 'success-text';
            } else {
              // Check if it's a file
              const lastSlash = targetLs.lastIndexOf('/');
              const dirPath = targetLs.substring(0, lastSlash) || '/';
              const fileName = targetLs.substring(lastSlash + 1);
              if (state.virtualFS[dirPath] && state.virtualFS[dirPath].includes(fileName)) {
                if (showLong) {
                  output = getLongListing(targetLs);
                } else if (showSelinux) {
                  output = `${getFileSelinuxContext(targetLs)} ${fileName}`;
                } else {
                  output = fileName;
                }
                styleClass = 'success-text';
              } else {
                output = `ls: cannot access '${paths[0] || ''}': No such file or directory`;
                styleClass = 'error';
              }
            }
          }
          break;

        case 'mkdir':
          if (!rawArgs) {
            output = 'mkdir: missing operand';
            styleClass = 'error';
          } else {
            let tokens = rawArgs.split(' ');
            let parentMode = false;
            let verbose = false;

            // Filter flags
            tokens = tokens.filter(t => {
              if (t.startsWith('-')) {
                if (t.includes('p')) parentMode = true;
                if (t.includes('v')) verbose = true;
                return false;
              }
              return true;
            });

            if (tokens.length === 0) {
              output = 'mkdir: missing operand after flags';
              styleClass = 'error';
              break;
            }

            let logs = [];
            tokens.forEach(tok => {
              expandBraces(tok).forEach(pPath => {
                const absPath = resolvePath(pPath);
                const lastSlash = absPath.lastIndexOf('/');
                const parentPath = absPath.substring(0, lastSlash) || '/';
                const folderName = absPath.substring(lastSlash + 1);

                if (!state.virtualFS[parentPath]) {
                  if (parentMode) {
                    // Create intermediate parents
                    const parts = absPath.split('/').filter(x => x);
                    let runningPath = '';
                    parts.forEach(p => {
                      const prevPath = runningPath || '/';
                      runningPath += '/' + p;
                      if (!state.virtualFS[runningPath]) {
                        state.virtualFS[runningPath] = [];
                        if (state.virtualFS[prevPath] && !state.virtualFS[prevPath].includes(p)) {
                          state.virtualFS[prevPath].push(p);
                        }
                        if (verbose) logs.push(`mkdir: created directory '${runningPath}'`);
                      }
                    });
                  } else {
                    logs.push(`mkdir: cannot create directory '${pPath}': No such file or directory`);
                  }
                } else if (state.virtualFS[parentPath].includes(folderName)) {
                  if (!parentMode) {
                    logs.push(`mkdir: cannot create directory '${pPath}': File exists`);
                  }
                } else {
                  state.virtualFS[parentPath].push(folderName);
                  state.virtualFS[absPath] = [];
                  if (verbose) logs.push(`mkdir: created directory '${absPath}'`);
                }
              });
            });
            output = logs.join('\n');
          }
          break;

        case 'touch':
          if (!rawArgs) {
            output = 'touch: missing file operand';
            styleClass = 'error';
          } else {
            let tokens = rawArgs.split(' ');
            let logs = [];
            tokens.forEach(tok => {
              expandBraces(tok).forEach(fPath => {
                const absPath = resolvePath(fPath);
                const lastSlash = absPath.lastIndexOf('/');
                const parentPath = absPath.substring(0, lastSlash) || '/';
                const fileName = absPath.substring(lastSlash + 1);

                if (!state.virtualFS[parentPath]) {
                  logs.push(`touch: cannot touch '${fPath}': No such file or directory`);
                } else {
                  if (!state.virtualFS[parentPath].includes(fileName)) {
                    state.virtualFS[parentPath].push(fileName);
                  }
                  if (state.virtualFilesContent[absPath] === undefined) {
                    state.virtualFilesContent[absPath] = ''; // empty file
                  }
                }
              });
            });
            output = logs.join('\n');
          }
          break;

        case 'rm':
          if (!rawArgs) {
            output = 'rm: missing operand';
            styleClass = 'error';
          } else {
            let tokens = rawArgs.split(' ');
            let recursive = false;
            let verbose = false;
            let force = false;

            tokens = tokens.filter(t => {
              if (t.startsWith('-')) {
                if (t.includes('r')) recursive = true;
                if (t.includes('v')) verbose = true;
                if (t.includes('f')) force = true;
                return false;
              }
              return true;
            });

            if (tokens.length === 0 && !force) {
              output = 'rm: missing operand after flags';
              styleClass = 'error';
              break;
            }

            let logs = [];
            tokens.forEach(tok => {
              expandBraces(tok).forEach(patt => {
                resolveWildcards(patt).forEach(fPath => {
                  const absPath = resolvePath(fPath);
                  const lastSlash = absPath.lastIndexOf('/');
                  const parentPath = absPath.substring(0, lastSlash) || '/';
                  const fileName = absPath.substring(lastSlash + 1);

                  if (state.virtualFS[absPath]) {
                    // It's a directory
                    if (!recursive) {
                      if (!force) logs.push(`rm: cannot remove '${fPath}': Is a directory`);
                    } else {
                      // Recursively delete folder keys
                      Object.keys(state.virtualFS).forEach(k => {
                        if (k === absPath || k.startsWith(absPath + '/')) {
                          delete state.virtualFS[k];
                        }
                      });
                      Object.keys(state.virtualFilesContent).forEach(k => {
                        if (k.startsWith(absPath + '/')) {
                          delete state.virtualFilesContent[k];
                        }
                      });
                      if (state.virtualFS[parentPath]) {
                        state.virtualFS[parentPath] = state.virtualFS[parentPath].filter(n => n !== fileName);
                      }
                      if (verbose) logs.push(`removed directory '${absPath}'`);
                    }
                  } else if (state.virtualFS[parentPath] && state.virtualFS[parentPath].includes(fileName)) {
                    // It's a file
                    state.virtualFS[parentPath] = state.virtualFS[parentPath].filter(n => n !== fileName);
                    delete state.virtualFilesContent[absPath];
                    if (verbose) logs.push(`removed '${absPath}'`);
                  } else {
                    if (!force) logs.push(`rm: cannot remove '${fPath}': No such file or directory`);
                  }
                });
              });
            });
            output = logs.join('\n');
          }
          break;

        case 'du':
          {
            let duTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let showSum = false;
            let showHuman = false;
            let targets = [];
            duTokens.forEach(t => {
              if (t.startsWith('-')) {
                if (t.includes('s')) showSum = true;
                if (t.includes('h')) showHuman = true;
              } else {
                targets.push(t);
              }
            });
            if (targets.length === 0) {
              targets.push(state.currentDir);
            }

            let lines = [];
            targets.forEach(t => {
              if (t.endsWith('*')) {
                // Wildcard list
                let parentPath = resolvePath(t.slice(0, -1));
                if (parentPath === '') parentPath = '/';
                let children = state.virtualFS[parentPath] || [];
                children.forEach(c => {
                  let childAbs = parentPath === '/' ? '/' + c : parentPath + '/' + c;
                  let size = '4.0K';
                  if (c.endsWith('.tar.xz')) size = '2.1M';
                  else if (c.endsWith('.tar.bz2')) size = '2.8M';
                  else if (c.endsWith('.tar.gz') || c.endsWith('.gz')) size = '3.2M';
                  else if (c.endsWith('.tar')) size = '12M';
                  else if (c === 'etc') size = '4.0M';
                  else if (c === 'home') size = '16M';
                  else if (state.virtualFS[childAbs]) size = '4.0K';
                  else {
                    let len = state.virtualFilesContent[childAbs]?.length || 0;
                    size = len > 1024 ? (len / 1024).toFixed(1) + 'K' : len + 'B';
                  }
                  lines.push(`${size}\t${childAbs}`);
                });
              } else {
                let abs = resolvePath(t);
                let size = '4.0K';
                let base = abs.substring(abs.lastIndexOf('/') + 1) || '/';
                if (base.endsWith('.tar.xz')) size = '2.1M';
                else if (base.endsWith('.tar.bz2')) size = '2.8M';
                else if (base.endsWith('.tar.gz') || base.endsWith('.gz')) size = '3.2M';
                else if (base.endsWith('.tar')) size = '12M';
                else if (base === 'etc') size = '4.0M';
                else if (base === 'home') size = '16M';
                else if (state.virtualFS[abs]) size = '4.0K';
                else {
                  let len = state.virtualFilesContent[abs]?.length || 0;
                  size = len > 1024 ? (len / 1024).toFixed(1) + 'K' : len + 'B';
                }
                lines.push(`${size}\t${t}`);
              }
            });
            output = lines.join('\n');
            styleClass = 'success-text';
          }
          break;

        case 'tar':
          {
            let tarToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (tarToks.length < 1) {
              output = 'tar: You must specify one of the \'-Acdtrux\', \'--delete\' or \'--test-label\' options\nTry \'tar --help\' or \'tar --usage\' for more information.';
              styleClass = 'error';
              break;
            }

            let flags = '';
            let archiveFile = '';
            let destDir = '';
            let nextIsDest = false;
            let targets = [];

            for (let i = 0; i < tarToks.length; i++) {
              let tok = tarToks[i];
              if (tok.startsWith('-')) {
                if (tok === '-C') {
                  nextIsDest = true;
                } else {
                  flags += tok.substring(1);
                }
              } else if (i === 0 && !tok.includes('/') && !tok.includes('.')) {
                flags += tok;
              } else {
                if (nextIsDest) {
                  destDir = tok;
                  nextIsDest = false;
                } else if (flags.includes('f') && !archiveFile) {
                  archiveFile = tok;
                } else {
                  targets.push(tok);
                }
              }
            }

            let action = '';
            if (flags.includes('c')) action = 'create';
            else if (flags.includes('x')) action = 'extract';
            else if (flags.includes('t')) action = 'list';

            if (!action) {
              output = 'tar: You must specify one of the create (-c), extract (-x), or list (-t) options.';
              styleClass = 'error';
              break;
            }

            if (!archiveFile) {
              output = 'tar: Archive file must be specified with the \'-f\' option.';
              styleClass = 'error';
              break;
            }

            let archiveAbs = resolvePath(archiveFile);

            if (action === 'create') {
              if (targets.length === 0) {
                output = 'tar: Cowardly refusing to create an empty archive';
                styleClass = 'error';
                break;
              }

              let filesToArchive = [];
              let errorMsg = '';

              targets.forEach(t => {
                let targetAbs = resolvePath(t);
                if (state.virtualFS[targetAbs] === undefined && state.virtualFilesContent[targetAbs] === undefined) {
                  errorMsg = `tar: ${t}: Cannot stat: No such file or directory`;
                  return;
                }

                const gather = (d) => {
                  if (state.virtualFilesContent[d] !== undefined) {
                    filesToArchive.push(d);
                  }
                  if (state.virtualFS[d]) {
                    filesToArchive.push(d + '/');
                    state.virtualFS[d].forEach(f => {
                      gather(d === '/' ? '/' + f : d + '/' + f);
                    });
                  }
                };
                gather(targetAbs);
              });

              if (errorMsg) {
                output = errorMsg;
                styleClass = 'error';
                break;
              }

              // Save compression algorithm details inside the metadata prefix
              let compAlgo = 'none';
              if (flags.includes('z')) compAlgo = 'gzip';
              else if (flags.includes('j')) compAlgo = 'bzip2';
              else if (flags.includes('J')) compAlgo = 'xz';

              state.virtualFilesContent[archiveAbs] = `TARBALL_METADATA:${compAlgo}:${filesToArchive.join(',')}`;
              state.virtualFileMeta[archiveAbs] = {
                owner: state.currentUser,
                group: state.currentUser,
                permissions: 'rw-r--r--'
              };

              let parent = archiveAbs.substring(0, archiveAbs.lastIndexOf('/')) || '/';
              let name = archiveAbs.substring(archiveAbs.lastIndexOf('/') + 1);
              if (state.virtualFS[parent] && !state.virtualFS[parent].includes(name)) {
                state.virtualFS[parent].push(name);
              }

              let lines = [];
              if (flags.includes('v')) {
                filesToArchive.forEach(f => {
                  // Display relative to root
                  let rel = f.startsWith('/') ? f.substring(1) : f;
                  lines.push(rel);
                });
              }
              output = lines.join('\n');
              styleClass = 'success-text';

            } else if (action === 'list') {
              let content = state.virtualFilesContent[archiveAbs];
              if (content === undefined) {
                output = `tar: ${archiveFile}: Cannot open: No such file or directory`;
                styleClass = 'error';
                break;
              }

              if (!content.startsWith('TARBALL_METADATA:')) {
                output = `tar: ${archiveFile}: This does not look like a tar archive`;
                styleClass = 'error';
                break;
              }

              let parts = content.split(':');
              let files = parts[2].split(',');
              let lines = [];
              files.forEach(f => {
                let rel = f.startsWith('/') ? f.substring(1) : f;
                lines.push(rel);
              });
              output = lines.join('\n');
              styleClass = 'success-text';

            } else if (action === 'extract') {
              let content = state.virtualFilesContent[archiveAbs];
              if (content === undefined) {
                output = `tar: ${archiveFile}: Cannot open: No such file or directory`;
                styleClass = 'error';
                break;
              }

              if (!content.startsWith('TARBALL_METADATA:')) {
                output = `tar: ${archiveFile}: This does not look like a tar archive`;
                styleClass = 'error';
                break;
              }

              let destAbs = destDir ? resolvePath(destDir) : state.currentDir;
              if (state.virtualFS[destAbs] === undefined) {
                output = `tar: ${destDir || '.'}: Cannot open: No such file or directory`;
                styleClass = 'error';
                break;
              }

              let parts = content.split(':');
              let compAlgo = parts[1];
              let files = parts[2].split(',');

              // Validate compression flag matches archive type (optional for high-fidelity)
              if (compAlgo === 'gzip' && !flags.includes('z')) {
                // Warning, but RHEL tar autodetects, though user options say -xvzf, let's allow extraction
              }

              let extracted = [];
              files.forEach(f => {
                let rel = f.startsWith('/') ? f.substring(1) : f;
                let targetPath = destAbs === '/' ? '/' + rel : destAbs + '/' + rel;

                if (f.endsWith('/')) {
                  let dPath = targetPath.slice(0, -1);
                  if (state.virtualFS[dPath] === undefined) {
                    state.virtualFS[dPath] = [];
                  }
                  let p = dPath.substring(0, dPath.lastIndexOf('/')) || '/';
                  let n = dPath.substring(dPath.lastIndexOf('/') + 1);
                  if (state.virtualFS[p] && !state.virtualFS[p].includes(n)) {
                    state.virtualFS[p].push(n);
                  }
                } else {
                  state.virtualFilesContent[targetPath] = `Extracted from ${archiveFile}`;
                  state.virtualFileMeta[targetPath] = {
                    owner: state.currentUser,
                    group: state.currentUser,
                    permissions: 'rw-r--r--'
                  };
                  let p = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
                  let n = targetPath.substring(targetPath.lastIndexOf('/') + 1);
                  if (state.virtualFS[p] && !state.virtualFS[p].includes(n)) {
                    state.virtualFS[p].push(n);
                  }
                }
                if (flags.includes('v')) {
                  extracted.push(rel);
                }
              });

              output = flags.includes('v') ? extracted.join('\n') : '';
              styleClass = 'success-text';
            }
          }
          break;

        case 'date':
          {
            output = state.customTime || new Date().toString();
            styleClass = 'success-text';
          }
          break;

        case 'timedatectl':
          {
            let tToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (rawArgs.includes('set-time')) {
              let match = rawArgs.match(/set-time\s+["']?([^"']+)["']?/);
              if (match) {
                state.customTime = match[1];
                output = `Set system time to "${match[1]}"`;
                styleClass = 'success-text';
              } else {
                output = 'Failed to parse time string';
                styleClass = 'error';
              }
            } else {
              output = `               Local time: ${state.customTime}
           Universal time: Sun 2026-04-12 17:55:50 UTC
                 RTC time: Sun 2026-04-12 17:55:50
                Time zone: Asia/Kolkata (IST, +0530)
System clock synchronized: ${state.chronydActive ? 'yes' : 'no'}
              NTP service: ${state.chronydActive ? 'active (chronyd)' : 'inactive'}
          RTC in local TZ: no`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'init':
          {
            const arg = rawArgs.trim();
            if (arg === '0') {
              output = `[  OK  ] Stopped target Graphical Interface.\n[  OK  ] Stopped target Multi-User System.\n[  OK  ] Reached target Power-Off.\nSystem poweroff initiated... Hardware off.`;
              styleClass = 'warning';
            } else if (arg === '6') {
              output = `[  OK  ] Stopped target Graphical Interface.\n[  OK  ] Stopped target Multi-User System.\n[  OK  ] Reached target Reboot.\nRestarting system... Booting kernel vmlinuz-6.1.0-rhel10...`;
              styleClass = 'success-text';
            } else if (arg === '3') {
              output = `Switching to Runlevel 3 (multi-user.target - TUI)...\nSystem active in multi-user mode.`;
              styleClass = 'success-text';
            } else if (arg === '5') {
              output = `Switching to Runlevel 5 (graphical.target - GUI)...\nStarting Display Manager (gdm)... Graphical login ready.`;
              styleClass = 'success-text';
            } else {
              output = `init: switching to runlevel ${arg}...`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'systemctl':
          {
            if (rawArgs.includes('get-default')) {
              output = state.defaultRunlevel || 'graphical.target';
              styleClass = 'success-text';
            } else if (rawArgs.includes('set-default')) {
              if (rawArgs.includes('multi-user.target') || rawArgs.includes('runlevel3.target')) {
                state.defaultRunlevel = 'multi-user.target';
                output = `Removed /etc/systemd/system/default.target.\nCreated symlink /etc/systemd/system/default.target -> /usr/lib/systemd/system/multi-user.target.`;
                styleClass = 'success-text';
              } else if (rawArgs.includes('graphical.target') || rawArgs.includes('runlevel5.target')) {
                state.defaultRunlevel = 'graphical.target';
                output = `Removed /etc/systemd/system/default.target.\nCreated symlink /etc/systemd/system/default.target -> /usr/lib/systemd/system/graphical.target.`;
                styleClass = 'success-text';
              } else {
                output = `Created symlink /etc/systemd/system/default.target for specified target.`;
                styleClass = 'success-text';
              }
            } else if (rawArgs.includes('reboot')) {
              output = `System rebooting... Broadcast message from root@rhel10: Rebooting system now (reboot.target reached).`;
              styleClass = 'success-text';
            } else if (rawArgs.includes('poweroff')) {
              output = `System shutting down... Broadcast message from root@rhel10: Poweroff system now (poweroff.target reached).`;
              styleClass = 'success-text';
            } else if (rawArgs.includes('chronyd')) {
              if (rawArgs.includes('stop') || rawArgs.includes('disable')) {
                state.chronydActive = false;
                output = '';
                styleClass = 'success-text';
              } else if (rawArgs.includes('start') || rawArgs.includes('enable')) {
                state.chronydActive = true;
                output = '';
                styleClass = 'success-text';
              } else if (rawArgs.includes('status')) {
                output = `● chronyd.service - NTP client/server
     Loaded: loaded (/usr/lib/systemd/system/chronyd.service; ${state.chronydActive ? 'enabled' : 'disabled'}; preset: enabled)
     Active: ${state.chronydActive ? 'active (running)' : 'inactive (dead)'} since Mon 2026-04-12 20:00:00 IST`;
                styleClass = 'success-text';
              }
            } else {
              output = `systemctl: command completed for ${rawArgs}`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'at':
          {
            // Check /etc/at.deny
            let denyContent = state.virtualFilesContent['/etc/at.deny'] || '';
            let deniedUsers = denyContent.split('\n').map(u => u.trim()).filter(u => u && !u.startsWith('#'));
            if (deniedUsers.includes(state.currentUser)) {
              output = `You (${state.currentUser}) do not have permission to use at.`;
              styleClass = 'error';
              break;
            }

            if (!rawArgs.trim()) {
              output = 'garbled time';
              styleClass = 'error';
              break;
            }

            let nextId = state.atJobs.length > 0 ? Math.max(...state.atJobs.map(j => j.id)) + 1 : 1;
            let timeSpec = rawArgs.trim();
            state.atJobs.push({
              id: nextId,
              time: timeSpec,
              cmd: 'useradd ajay',
              user: state.currentUser
            });

            // Create spool file in /var/spool/at
            let fileName = `a0000${nextId}0abdl11`;
            state.virtualFilesContent[`/var/spool/at/${fileName}`] = `#!/bin/sh\n# at job ${nextId} for ${state.currentUser}\nuseradd ajay`;
            if (state.virtualFS['/var/spool/at'] && !state.virtualFS['/var/spool/at'].includes(fileName)) {
              state.virtualFS['/var/spool/at'].push(fileName);
            }

            output = `warning: commands will be executed using /bin/sh\njob ${nextId} at ${timeSpec}`;
            styleClass = 'success-text';
          }
          break;

        case 'atq':
          {
            if (state.atJobs.length === 0) {
              output = '';
            } else {
              let lines = state.atJobs.map(j => `${j.id}\t${j.time} a ${j.user}`);
              output = lines.join('\n');
            }
            styleClass = 'success-text';
          }
          break;

        case 'atrm':
          {
            let idNum = parseInt(rawArgs.trim());
            if (isNaN(idNum)) {
              output = 'usage: atrm job [job...]';
              styleClass = 'error';
              break;
            }

            let idx = state.atJobs.findIndex(j => j.id === idNum);
            if (idx === -1) {
              output = `atrm: cannot find job ${idNum}`;
              styleClass = 'error';
            } else {
              let removedJob = state.atJobs.splice(idx, 1)[0];
              let fileName = `a0000${idNum}0abdl11`;
              delete state.virtualFilesContent[`/var/spool/at/${fileName}`];
              if (state.virtualFS['/var/spool/at']) {
                state.virtualFS['/var/spool/at'] = state.virtualFS['/var/spool/at'].filter(f => f !== fileName);
              }
              output = `Removed job ${idNum} from queue`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'sudo':
          {
            let sudoArgs = rawArgs.trim();
            if (!sudoArgs) {
              output = 'usage: sudo [-u user] command';
              styleClass = 'error';
              break;
            }

            if (sudoArgs === '-i' || sudoArgs === 'su -' || sudoArgs === 'su') {
              state.currentUser = 'root';
              state.currentDir = '/root';
              output = `[Elevated to superuser root session]`;
              styleClass = 'success-text';
              break;
            }

            let sudoers = state.virtualFilesContent['/etc/sudoers'] || '';
            let userSudo = sudoers.includes(state.currentUser);
            let isWheel = (state.groupMembers && state.groupMembers['wheel'] && state.groupMembers['wheel'].includes(state.currentUser));
            let isRoot = state.currentUser === 'root';

            if (!isRoot && !userSudo && !isWheel) {
              output = `[sudo] password for ${state.currentUser}:\n${state.currentUser} is not in the sudoers file. This incident will be reported.`;
              styleClass = 'error';
              break;
            }

            let oldUser = state.currentUser;
            state.currentUser = 'root';
            let res = processCommand(sudoArgs);
            state.currentUser = oldUser;

            output = `[sudo elevated execution]\n${res}`;
            styleClass = 'success-text';
          }
          break;

        case 'su':
          {
            let suTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let targetUser = 'root';

            for (let i = 0; i < suTokens.length; i++) {
              if (suTokens[i] !== '-') {
                targetUser = suTokens[i];
              }
            }

            state.currentUser = targetUser;
            if (targetUser === 'root') {
              state.currentDir = '/root';
            } else {
              state.currentDir = `/home/${targetUser}`;
              if (!state.virtualFS[state.currentDir]) {
                state.virtualFS[state.currentDir] = [];
              }
            }
            output = `Switched session to user '${targetUser}' (Active directory: ${state.currentDir})`;
            styleClass = 'success-text';
          }
          break;

        case 'gpasswd':
          {
            let gToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (gToks[0] === '-a' && gToks[1] && gToks[2]) {
              let uName = gToks[1];
              let gName = gToks[2];

              if (!state.groupMembers) state.groupMembers = {};
              if (!state.groupMembers[gName]) state.groupMembers[gName] = [];
              if (!state.groupMembers[gName].includes(uName)) {
                state.groupMembers[gName].push(uName);
              }

              if (gName === 'wheel') {
                let sudoers = state.virtualFilesContent['/etc/sudoers'] || '';
                if (!sudoers.includes(uName)) {
                  state.virtualFilesContent['/etc/sudoers'] = sudoers + `\n${uName} ALL=(ALL) ALL`;
                }
              }

              output = `Adding user ${uName} to group ${gName}`;
              styleClass = 'success-text';
            } else {
              output = 'usage: gpasswd -a user group';
              styleClass = 'error';
            }
          }
          break;

        case 'visudo':
          {
            output = state.virtualFilesContent['/etc/sudoers'] || '## Sudoers allow file\nroot ALL=(ALL) ALL\n%wheel ALL=(ALL) ALL';
            styleClass = 'success-text';
          }
          break;

        case 'crontab':
          {
            let cToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let targetUser = state.currentUser;
            let opt = '';

            for (let i = 0; i < cToks.length; i++) {
              if (cToks[i] === '-u' && cToks[i+1]) {
                targetUser = cToks[i+1];
                i++;
              } else if (cToks[i].startsWith('-')) {
                opt = cToks[i];
              }
            }

            // Check /etc/cron.deny
            let denyContent = state.virtualFilesContent['/etc/cron.deny'] || '';
            let deniedUsers = denyContent.split('\n').map(u => u.trim()).filter(u => u && !u.startsWith('#'));
            if (deniedUsers.includes(state.currentUser) && state.currentUser !== 'root') {
              output = `You (${state.currentUser}) are not allowed to use this program (crontab).\nSee crontab(1) for more information.`;
              styleClass = 'error';
              break;
            }

            let spoolFile = `/var/spool/cron/${targetUser}`;

            if (opt === '-l') {
              let content = state.virtualFilesContent[spoolFile];
              if (!content || !content.trim()) {
                output = `no crontab for ${targetUser}`;
                styleClass = 'error';
              } else {
                output = content;
                styleClass = 'success-text';
              }
            } else if (opt === '-r') {
              delete state.virtualFilesContent[spoolFile];
              if (state.virtualFS['/var/spool/cron']) {
                state.virtualFS['/var/spool/cron'] = state.virtualFS['/var/spool/cron'].filter(f => f !== targetUser);
              }
              output = `crontab: removed crontab for ${targetUser}`;
              styleClass = 'success-text';
            } else if (opt === '-e') {
              // Edit simulation
              if (state.virtualFilesContent[spoolFile] === undefined) {
                state.virtualFilesContent[spoolFile] = '*/1 * * * * date >> /city.txt';
              }
              if (state.virtualFS['/var/spool/cron'] && !state.virtualFS['/var/spool/cron'].includes(targetUser)) {
                state.virtualFS['/var/spool/cron'].push(targetUser);
              }
              output = `crontab: installing new crontab for ${targetUser}`;
              styleClass = 'success-text';
            } else {
              output = 'usage:\tcrontab [-u user] file\n\tcrontab [-u user] [ -e | -l | -r ]';
              styleClass = 'error';
            }
          }
          break;

        case 'lsblk':
          {
            let isRota = rawArgs.includes('-d') || rawArgs.includes('rota');
            if (isRota) {
              let lines = ['NAME ROTA'];
              Object.keys(state.blockDevices).forEach(dKey => {
                let disk = state.blockDevices[dKey];
                lines.push(`${disk.name.padEnd(4)} ${disk.rota || '0'}`);
              });
              output = lines.join('\n');
              styleClass = 'success-text';
              break;
            }

            let lines = ['NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINTS'];
            let devKeys = Object.keys(state.blockDevices);

            devKeys.forEach((dKey, dIdx) => {
              let disk = state.blockDevices[dKey];
              let majMin = dKey.includes('sda') ? '8:0' : (dKey.includes('sdb') ? '8:16' : '252:0');
              lines.push(`${disk.name.padEnd(6)} ${majMin.padEnd(7)} 0 ${disk.size.padEnd(4)} 0 disk ${disk.mount || ''}`);

              let partKeys = Object.keys(disk.parts || {});
              partKeys.forEach((pKey, pIdx) => {
                let part = disk.parts[pKey];
                let prefix = (pIdx === partKeys.length - 1) ? '└─' : '├─';
                let pMajMin = dKey.includes('sda') ? `8:${pIdx + 1}` : `8:${17 + pIdx}`;
                let mPoint = part.mount ? part.mount : '';
                lines.push(`${prefix}${part.name.padEnd(4)} ${pMajMin.padEnd(7)} 0 ${part.size.padEnd(4)} 0 part ${mPoint}`);

                // If PV exists on this partition, print LVs as children
                if (state.pvs && state.pvs[pKey]) {
                  let pvVg = state.pvs[pKey].vg;
                  Object.keys(state.lvs || {}).forEach(lvKey => {
                    let lv = state.lvs[lvKey];
                    if (lv.vg === pvVg) {
                      let lvPrefix = '  └─';
                      let lvMajMin = '253:0';
                      let lvName = `${pvVg}-${lv.name}`;
                      lines.push(`${lvPrefix}${lvName.padEnd(12)} ${lvMajMin.padEnd(7)} 0 ${lv.size.padEnd(4)} 0 lvm  ${lv.mount || ''}`);
                    }
                  });
                }
              });
            });

            output = lines.join('\n');
            styleClass = 'success-text';
          }
          break;

        case 'fdisk':
          {
            let fToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (fToks[0] === '-l') {
              let lines = [];
              Object.keys(state.blockDevices).forEach(dKey => {
                let disk = state.blockDevices[dKey];
                lines.push(`Disk ${dKey}: ${disk.size}, 21474836480 bytes, 41943040 sectors`);
                lines.push(`Disk model: VirtIO Block Device`);
                lines.push(`Units: sectors of 1 * 512 = 512 bytes`);
                lines.push(`Sector size (logical/physical): 512 bytes / 512 bytes`);
                lines.push(`Disklabel type: dos`);
                lines.push(`Disk identifier: 0x4f8a1200\n`);
                lines.push(`Device     Boot Start      End  Sectors Size Id Type`);
                Object.keys(disk.parts || {}).forEach(pKey => {
                  let part = disk.parts[pKey];
                  let typeCode = part.fs === 'swap' ? '82' : (part.fs === 'lvm' || (state.pvs && state.pvs[pKey]) ? '8e' : '83');
                  let typeName = part.fs === 'swap' ? 'Linux swap' : (part.fs === 'lvm' || (state.pvs && state.pvs[pKey]) ? 'Linux LVM' : 'Linux');
                  lines.push(`${pKey.padEnd(10)} *   2048  2097151  2095104  ${part.size} ${typeCode} ${typeName}`);
                });
                lines.push('');
              });
              output = lines.join('\n');
              styleClass = 'success-text';
            } else if (fToks[0]) {
              let targetDisk = fToks[0];
              if (!state.blockDevices[targetDisk]) {
                output = `fdisk: cannot open ${targetDisk}: No such file or directory`;
                styleClass = 'error';
              } else {
                let disk = state.blockDevices[targetDisk];
                let isLvm = rawArgs.includes('8e') || rawArgs.includes('lvm');
                if (isLvm || rawArgs.includes('8e')) {
                  let partName = `${targetDisk}1`;
                  disk.parts[partName] = {
                    name: partName.substring(partName.lastIndexOf('/') + 1),
                    size: '1G',
                    type: 'part',
                    fs: 'lvm',
                    mount: '',
                    uuid: 'b3039e27-5c11-49d7-b2e5-e34fe23'
                  };
                  output = `Welcome to fdisk (util-linux 2.39.3).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help): n
Partition type: p (primary)
Partition number (1-4, default 1): 1
First sector (2048-20971519, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (+1G): 
Created a new partition 1 of type 'Linux' and of size 1 GiB.

Command (m for help): t
Partition number (1, default 1): 1
Hex code or alias (type L to list all codes): 8e
Changed type of partition 'Linux' to 'Linux LVM'.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.`;
                } else if (disk.parts[`${targetDisk}1`]) {
                  // Partition 1 exists, so create swap partition 3 (ID 82)
                  let partName = `${targetDisk}3`;
                  disk.parts[partName] = {
                    name: partName.substring(partName.lastIndexOf('/') + 1),
                    size: '2G',
                    type: 'part',
                    fs: 'swap',
                    mount: '',
                    uuid: 'c5123dbe-9e12-4fb2-b2a1-swap100000003'
                  };
                  output = `Welcome to fdisk (util-linux 2.39.3).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help): n
Partition type: p (primary)
Partition number (1-4, default 3): 3
First sector (2099200-20971519, default 2099200): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (+2G): 
Created a new partition 3 of type 'Linux' and of size 2 GiB.

Command (m for help): t
Partition number (1,3, default 3): 3
Hex code or alias (type L to list all codes): 82
Changed type of partition 'Linux' to 'Linux swap / Solaris'.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.`;
                } else {
                  // Create partition 1
                  let partName = `${targetDisk}1`;
                  disk.parts[partName] = {
                    name: partName.substring(partName.lastIndexOf('/') + 1),
                    size: '1G',
                    type: 'part',
                    fs: '',
                    mount: '',
                    uuid: 'b3039e27-5c11-49d7-b2e5-e34fe23'
                  };
                  output = `Welcome to fdisk (util-linux 2.39.3).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help): n
Partition type: p (primary)
Partition number (1-4, default 1): 1
First sector (2048-20971519, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (+1G): 
Created a new partition 1 of type 'Linux' and of size 1 GiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.`;
                }
                styleClass = 'success-text';
              }
            } else {
              output = 'usage: fdisk [-l] [device]';
              styleClass = 'error';
            }
          }
          break;

        case 'pvcreate':
          {
            let dev = rawArgs.trim();
            if (!dev) {
              output = 'usage: pvcreate <device>';
              styleClass = 'error';
            } else {
              let exists = false;
              Object.keys(state.blockDevices).forEach(dKey => {
                if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[dev]) {
                  exists = true;
                }
              });
              if (!exists) {
                let parentDisk = dev.substring(0, 8);
                if (state.blockDevices[parentDisk]) {
                  state.blockDevices[parentDisk].parts[dev] = {
                    name: dev.substring(dev.lastIndexOf('/') + 1),
                    size: '1G',
                    type: 'part',
                    fs: '',
                    mount: '',
                    uuid: 'b3039e27-5c11-49d7-b2e5-e34fe23'
                  };
                  exists = true;
                }
              }

              if (exists) {
                if (!state.pvs) state.pvs = {};
                state.pvs[dev] = { vg: '', size: '1G' };
                output = `  Physical volume "${dev}" successfully created.`;
                styleClass = 'success-text';
              } else {
                output = `Device ${dev} not found.`;
                styleClass = 'error';
              }
            }
          }
          break;

        case 'pvdisplay':
        case 'pvs':
          {
            let pvsList = Object.keys(state.pvs || {});
            if (pvsList.length === 0) {
              output = '  No physical volumes found.';
              styleClass = 'success-text';
              break;
            }

            if (cmd === 'pvs') {
              let lines = ['PV         VG    Fmt  Attr PSize PFree'];
              pvsList.forEach(pv => {
                let pvObj = state.pvs[pv];
                lines.push(`${pv.padEnd(10)} ${(pvObj.vg || '').padEnd(5)} lvm2 ---  ${pvObj.size}  ${pvObj.size}`);
              });
              output = lines.join('\n');
            } else {
              let lines = [];
              pvsList.forEach(pv => {
                let pvObj = state.pvs[pv];
                lines.push(`--- Physical volume ---`);
                lines.push(`PV Name               ${pv}`);
                lines.push(`VG Name               ${pvObj.vg || ''}`);
                lines.push(`PV Size               ${pvObj.size} / not usable 3.00 MiB`);
                lines.push(`Allocatable           yes`);
                lines.push(`PE Size               4.00 MiB`);
                lines.push(`Total PE              255`);
                lines.push(`Free PE               255`);
                lines.push(`Allocated PE          0`);
                lines.push('');
              });
              output = lines.join('\n');
            }
            styleClass = 'success-text';
          }
          break;

        case 'pvremove':
          {
            let dev = rawArgs.trim();
            if (dev && state.pvs && state.pvs[dev]) {
              delete state.pvs[dev];
              output = `  Labels on physical volume "${dev}" successfully wiped.`;
              styleClass = 'success-text';
            } else {
              output = `No physical volume found matching ${dev}`;
              styleClass = 'error';
            }
          }
          break;

        case 'vgcreate':
          {
            let tokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let customPe = false;
            let vgName = '';
            let devNames = [];

            for (let i = 0; i < tokens.length; i++) {
              if (tokens[i] === '-s') {
                customPe = true;
                i++;
              } else if (!vgName) {
                vgName = tokens[i];
              } else {
                devNames.push(tokens[i]);
              }
            }

            if (!vgName || devNames.length === 0) {
              output = 'usage: vgcreate [-s PE_size] vg_name device...';
              styleClass = 'error';
            } else {
              if (!state.vgs) state.vgs = {};
              state.vgs[vgName] = { size: '1G', pvs: devNames, lvs: {} };
              devNames.forEach(dev => {
                if (state.pvs && state.pvs[dev]) {
                  state.pvs[dev].vg = vgName;
                }
              });
              output = `  Volume group "${vgName}" successfully created.`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'vgdisplay':
        case 'vgs':
          {
            let vgsList = Object.keys(state.vgs || {});
            if (vgsList.length === 0) {
              output = '  No volume groups found.';
              styleClass = 'success-text';
              break;
            }

            if (cmd === 'vgs') {
              let lines = ['VG    #PV #LV #SN Attr   VSize  VFree'];
              vgsList.forEach(vg => {
                let vgObj = state.vgs[vg];
                let lvCount = Object.keys(vgObj.lvs || {}).length;
                lines.push(`${vg.padEnd(5)} ${String(vgObj.pvs.length).padEnd(3)} ${String(lvCount).padEnd(3)} 0 wz--n- ${vgObj.size}  ${vgObj.size}`);
              });
              output = lines.join('\n');
            } else {
              let lines = [];
              vgsList.forEach(vg => {
                let vgObj = state.vgs[vg];
                let lvCount = Object.keys(vgObj.lvs || {}).length;
                lines.push(`--- Volume group ---`);
                lines.push(`VG Name               ${vg}`);
                lines.push(`System ID             `);
                lines.push(`Format                lvm2`);
                lines.push(`Metadata Areas        1`);
                lines.push(`Metadata Sequence No  1`);
                lines.push(`VG Access             read/write`);
                lines.push(`VG Status             resizable`);
                lines.push(`MAX LV                0`);
                lines.push(`Cur LV                ${lvCount}`);
                lines.push(`Open LV               0`);
                lines.push(`Max PV                0`);
                lines.push(`Cur PV                ${vgObj.pvs.length}`);
                lines.push(`Act PV                ${vgObj.pvs.length}`);
                lines.push(`VG Size               1020.00 MiB`);
                lines.push(`PE Size               4.00 MiB`);
                lines.push(`Total PE              255`);
                lines.push(`Alloc PE / Size       0 / 0`);
                lines.push(`Free  PE / Size       255 / 1020.00 MiB`);
                lines.push('');
              });
              output = lines.join('\n');
            }
            styleClass = 'success-text';
          }
          break;

        case 'vgextend':
          {
            let tokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (tokens.length >= 2) {
              let vg = tokens[0];
              let dev = tokens[1];
              if (state.vgs && state.vgs[vg]) {
                state.vgs[vg].pvs.push(dev);
                if (state.pvs && state.pvs[dev]) state.pvs[dev].vg = vg;
                output = `  Volume group "${vg}" successfully extended.`;
                styleClass = 'success-text';
              } else {
                output = `Volume group "${vg}" not found.`;
                styleClass = 'error';
              }
            } else {
              output = 'usage: vgextend vg_name device';
              styleClass = 'error';
            }
          }
          break;

        case 'vgreduce':
          {
            let tokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (tokens.length >= 2) {
              let vg = tokens[0];
              let dev = tokens[1];
              if (state.vgs && state.vgs[vg]) {
                state.vgs[vg].pvs = state.vgs[vg].pvs.filter(p => p !== dev);
                if (state.pvs && state.pvs[dev]) state.pvs[dev].vg = '';
                output = `  Removed physical volume "${dev}" from volume group "${vg}".`;
                styleClass = 'success-text';
              } else {
                output = `Volume group "${vg}" not found.`;
                styleClass = 'error';
              }
            } else {
              output = 'usage: vgreduce vg_name device';
              styleClass = 'error';
            }
          }
          break;

        case 'vgremove':
          {
            let vgName = rawArgs.trim();
            if (vgName && state.vgs && state.vgs[vgName]) {
              state.vgs[vgName].pvs.forEach(pv => {
                if (state.pvs && state.pvs[pv]) state.pvs[pv].vg = '';
              });
              delete state.vgs[vgName];
              output = `  Volume group "${vgName}" successfully removed.`;
              styleClass = 'success-text';
            } else {
              output = `Volume group "${vgName}" not found.`;
              styleClass = 'error';
            }
          }
          break;

        case 'lvcreate':
          {
            let tokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let size = '200M';
            let name = 'punelv';
            let vg = '';

            for (let i = 0; i < tokens.length; i++) {
              if (tokens[i] === '-L' || tokens[i] === '-l') {
                size = tokens[i+1] + (tokens[i] === '-L' ? 'M' : ' PEs');
                i++;
              } else if (tokens[i] === '-n') {
                name = tokens[i+1];
                i++;
              } else {
                vg = tokens[i];
              }
            }

            if (!vg) {
              output = 'usage: lvcreate -L size -n lv_name vg_name';
              styleClass = 'error';
            } else {
              if (!state.vgs) state.vgs = {};
              if (!state.vgs[vg]) {
                state.vgs[vg] = { size: '1G', pvs: ['/dev/sdb1'], lvs: {} };
                if (!state.pvs) state.pvs = {};
                state.pvs['/dev/sdb1'] = { vg: vg, size: '1G' };
              }

              if (!state.lvs) state.lvs = {};
              let lvPath = `/dev/${vg}/${name}`;
              state.lvs[lvPath] = { name: name, size: size, vg: vg, fs: '', mount: '' };
              state.vgs[vg].lvs[lvPath] = state.lvs[lvPath];
              output = `  Logical volume "${name}" created.`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'lvdisplay':
        case 'lvs':
          {
            let lvsList = Object.keys(state.lvs || {});
            if (lvsList.length === 0) {
              output = '  No logical volumes found.';
              styleClass = 'success-text';
              break;
            }

            if (cmd === 'lvs') {
              let lines = ['LV     VG    Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert'];
              lvsList.forEach(lvKey => {
                let lv = state.lvs[lvKey];
                lines.push(`${lv.name.padEnd(6)} ${lv.vg.padEnd(5)} -wi-a----- ${lv.size}`);
              });
              output = lines.join('\n');
            } else {
              let lines = [];
              lvsList.forEach(lvKey => {
                let lv = state.lvs[lvKey];
                lines.push(`--- Logical volume ---`);
                lines.push(`LV Path                ${lvKey}`);
                lines.push(`LV Name                ${lv.name}`);
                lines.push(`VG Name                ${lv.vg}`);
                lines.push(`LV UUID                a123bcde-f456-7890-abcd-ef1234567890`);
                lines.push(`LV Write Access        read/write`);
                lines.push(`LV Creation host, time rhel10, 2026-04-12 23:30:00 +0530`);
                lines.push(`LV Status              available`);
                lines.push(`# open                 ${lv.mount ? '1' : '0'}`);
                lines.push(`LV Size                ${lv.size}`);
                lines.push(`Current LE             50`);
                lines.push(`Segments               1`);
                lines.push(`Allocation             inherit`);
                lines.push(`Read ahead sectors     auto`);
                lines.push(`- currently set to     256`);
                lines.push(`Block device           253:0`);
                lines.push('');
              });
              output = lines.join('\n');
            }
            styleClass = 'success-text';
          }
          break;

        case 'lvextend':
          {
            let tokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let addedSize = '';
            let lvPath = '';

            for (let i = 0; i < tokens.length; i++) {
              if (tokens[i] === '-L' || tokens[i] === '-l') {
                addedSize = tokens[i+1];
                i++;
              } else {
                lvPath = tokens[i];
              }
            }

            if (!lvPath && tokens[tokens.length-1]) lvPath = tokens[tokens.length-1];

            if (state.lvs && state.lvs[lvPath]) {
              let current = state.lvs[lvPath].size;
              let currentVal = parseInt(current) || 200;
              let addedVal = parseInt(addedSize) || 100;
              let newVal = (currentVal + addedVal) + (current.includes('M') ? 'M' : ' PEs');
              state.lvs[lvPath].size = newVal;
              output = `  Size of logical volume ${state.lvs[lvPath].vg}/${state.lvs[lvPath].name} changed from ${current} to ${newVal}.\n  Logical volume successfully resized.`;
              styleClass = 'success-text';
            } else {
              output = `Logical volume "${lvPath}" not found.`;
              styleClass = 'error';
            }
          }
          break;

        case 'lvreduce':
          {
            let tokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            let reducedSize = '';
            let lvPath = '';

            for (let i = 0; i < tokens.length; i++) {
              if (tokens[i] === '-L' || tokens[i] === '-l') {
                reducedSize = tokens[i+1];
                i++;
              } else {
                lvPath = tokens[i];
              }
            }

            if (state.lvs && state.lvs[lvPath]) {
              let current = state.lvs[lvPath].size;
              let currentVal = parseInt(current) || 200;
              let reducedVal = parseInt(reducedSize) || 100;
              let newVal = Math.max(10, currentVal - reducedVal) + (current.includes('M') ? 'M' : ' PEs');
              state.lvs[lvPath].size = newVal;
              output = `  Size of logical volume ${state.lvs[lvPath].vg}/${state.lvs[lvPath].name} changed from ${current} to ${newVal}.\n  Logical volume successfully resized.`;
              styleClass = 'success-text';
            } else {
              output = `Logical volume "${lvPath}" not found.`;
              styleClass = 'error';
            }
          }
          break;

        case 'lvremove':
          {
            let lvPath = rawArgs.trim();
            if (lvPath && state.lvs && state.lvs[lvPath]) {
              let lv = state.lvs[lvPath];
              if (state.vgs && state.vgs[lv.vg]) delete state.vgs[lv.vg].lvs[lvPath];
              delete state.lvs[lvPath];
              output = `  Logical volume "${lvPath}" successfully removed.`;
              styleClass = 'success-text';
            } else {
              output = `Logical volume "${lvPath}" not found.`;
              styleClass = 'error';
            }
          }
          break;

        case 'mkfs':
        case 'mkfs.xfs':
        case 'mkfs.ext4':
        case 'mkfs.ext3':
          {
            let fsType = cmd === 'mkfs' ? 'xfs' : cmd.replace('mkfs.', '');
            let devArg = rawArgs.trim();
            if (!devArg) {
              output = `Usage: ${cmd} /dev/sdb1`;
              styleClass = 'error';
              break;
            }

            let foundPart = null;
            Object.keys(state.blockDevices).forEach(dKey => {
              if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[devArg]) {
                foundPart = state.blockDevices[dKey].parts[devArg];
              }
            });

            if (!foundPart) {
              // Auto-create partition if user directly runs mkfs /dev/sdb1
              let parentDisk = devArg.substring(0, 8); // e.g. /dev/sdb
              if (state.blockDevices[parentDisk]) {
                foundPart = {
                  name: devArg.substring(devArg.lastIndexOf('/') + 1),
                  size: '1G',
                  type: 'part',
                  fs: fsType,
                  mount: '',
                  uuid: 'b3039e27-5c11-49d7-b2e5-e34fe23'
                };
                state.blockDevices[parentDisk].parts[devArg] = foundPart;
              }
            }

            if (foundPart) {
              foundPart.fs = fsType;
              if (!foundPart.uuid) {
                foundPart.uuid = 'b3039e27-5c11-49d7-b2e5-e34fe23';
              }
              output = `meta-data=${devArg}              isize=512    agcount=4, agsize=65536 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=0
data     =                       bsize=4096   blocks=262144, imaxpct=25
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=2560, version=2
realtime =none                   extsz=4096   blocks=0, rtextents=0
Discarding blocks...Done. Format completed with ${fsType.toUpperCase()}.`;
              styleClass = 'success-text';
            } else {
              output = `${cmd}: cannot open ${devArg}: No such device or address`;
              styleClass = 'error';
            }
          }
          break;

        case 'mount':
          {
            let mToks = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
            if (mToks[0] === '-a') {
              let fstabContent = state.virtualFilesContent['/etc/fstab'] || '';
              let fstabLines = fstabContent.split('\n');
              let mountedCount = 0;
              fstabLines.forEach(l => {
                let parts = l.trim().split(/\s+/);
                if (parts.length >= 2 && !parts[0].startsWith('#')) {
                  let devOrUuid = parts[0];
                  let mPoint = parts[1];
                  mountedCount++;

                  // Ensure directory exists in FS
                  let mAbs = resolvePath(mPoint);
                  if (!state.virtualFS[mAbs]) state.virtualFS[mAbs] = [];
                  let pDir = mAbs.substring(0, mAbs.lastIndexOf('/')) || '/';
                  let fName = mAbs.substring(mAbs.lastIndexOf('/') + 1);
                  if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
                    state.virtualFS[pDir].push(fName);
                  }

                  // Update block device state
                  Object.keys(state.blockDevices).forEach(dKey => {
                    Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                      let part = state.blockDevices[dKey].parts[pKey];
                      if (pKey === devOrUuid || (part.uuid && devOrUuid.includes(part.uuid))) {
                        part.mount = mPoint;
                      }
                    });
                  });
                }
              });
              output = `(mount -a completed: ${mountedCount} fstab record(s) processed)`;
              styleClass = 'success-text';
            } else if (mToks.length >= 2) {
              let srcDev = mToks[0];
              let targetDir = mToks[1];

              let mAbs = resolvePath(targetDir);
              if (!state.virtualFS[mAbs]) state.virtualFS[mAbs] = [];
              let pDir = mAbs.substring(0, mAbs.lastIndexOf('/')) || '/';
              let fName = mAbs.substring(mAbs.lastIndexOf('/') + 1);
              if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
                state.virtualFS[pDir].push(fName);
              }

              let updated = false;
              Object.keys(state.blockDevices).forEach(dKey => {
                if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[srcDev]) {
                  state.blockDevices[dKey].parts[srcDev].mount = targetDir;
                  updated = true;
                }
              });

              if (!updated) {
                // Auto create partition if missing
                let parentDisk = srcDev.substring(0, 8);
                if (state.blockDevices[parentDisk]) {
                  state.blockDevices[parentDisk].parts[srcDev] = {
                    name: srcDev.substring(srcDev.lastIndexOf('/') + 1),
                    size: '1G',
                    type: 'part',
                    fs: 'xfs',
                    mount: targetDir,
                    uuid: 'b3039e27-5c11-49d7-b2e5-e34fe23'
                  };
                }
              }

              output = `Mounted ${srcDev} on ${targetDir} successfully.`;
              styleClass = 'success-text';
            } else if (mToks.length === 0) {
              let mLines = [];
              Object.keys(state.blockDevices).forEach(dKey => {
                Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                  let part = state.blockDevices[dKey].parts[pKey];
                  if (part.mount) {
                    mLines.push(`${pKey} on ${part.mount} type ${part.fs || 'xfs'} (rw,relatime,seclabel)`);
                  }
                });
              });
              output = mLines.join('\n') || '/dev/sda2 on / type xfs (rw,relatime,seclabel)';
              styleClass = 'success-text';
            } else {
              output = 'usage: mount [-a] [<device> <directory>]';
              styleClass = 'error';
            }
          }
          break;

        case 'umount':
          {
            let target = rawArgs.trim();
            if (!target) {
              output = 'usage: umount <directory|device>';
              styleClass = 'error';
              break;
            }

            let found = false;
            Object.keys(state.blockDevices).forEach(dKey => {
              Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                let part = state.blockDevices[dKey].parts[pKey];
                if (pKey === target || part.mount === target) {
                  part.mount = '';
                  found = true;
                }
              });
            });

            if (found) {
              output = `Unmounted ${target} successfully.`;
              styleClass = 'success-text';
            } else {
              output = `umount: ${target}: target is not mounted.`;
              styleClass = 'error';
            }
          }
          break;

        case 'blkid':
          {
            let devFilter = rawArgs.trim();
            let lines = [];

            Object.keys(state.blockDevices).forEach(dKey => {
              Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                let part = state.blockDevices[dKey].parts[pKey];
                if (!devFilter || devFilter === pKey) {
                  lines.push(`${pKey}: UUID="${part.uuid || 'b3039e27-5c11-49d7-b2e5-e34fe23'}" BLOCK_SIZE="512" TYPE="${part.fs || 'xfs'}" PARTUUID="000${dKey.slice(-1)}-01"`);
                }
              });
            });

            output = lines.join('\n') || (devFilter ? `blkid: ${devFilter}: No such device` : '');
            styleClass = 'success-text';
          }
          break;

        case 'e2fsck':
          {
            let dev = rawArgs.replace('-f', '').trim();
            if (!dev) {
              output = 'usage: e2fsck [-f] device';
              styleClass = 'error';
            } else {
              output = `e2fsck 1.47.0 (5-Feb-2023)\nPass 1: Checking inodes, blocks, and sizes\nPass 2: Checking directory structure\nPass 3: Checking directory connectivity\nPass 4: Checking reference counts\nPass 5: Checking group summary information\n${dev}: 11/65536 files (0.0% non-contiguous), 12952/262144 blocks`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'resize2fs':
          {
            let dev = rawArgs.trim();
            if (!dev) {
              output = 'usage: resize2fs device';
              styleClass = 'error';
            } else {
              let partObj = null;
              Object.keys(state.blockDevices).forEach(dKey => {
                if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[dev]) {
                  partObj = state.blockDevices[dKey].parts[dev];
                }
              });
              if (partObj) {
                partObj.size = '2G';
                output = `resize2fs 1.47.0 (5-Feb-2023)\nResizing the filesystem on ${dev} to 524288 (4k) blocks.\nThe filesystem on ${dev} is now 524288 (4k) blocks long.`;
                styleClass = 'success-text';
              } else {
                output = `resize2fs: device ${dev} not found.`;
                styleClass = 'error';
              }
            }
          }
          break;

        case 'xfs_growfs':
          {
            let target = rawArgs.trim();
            if (!target) {
              output = 'usage: xfs_growfs mountpoint';
              styleClass = 'error';
            } else {
              let partObj = null;
              Object.keys(state.blockDevices).forEach(dKey => {
                Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                  let part = state.blockDevices[dKey].parts[pKey];
                  if (part.mount === target || pKey === target) {
                    partObj = part;
                  }
                });
              });

              if (partObj) {
                partObj.size = '2G';
                output = `meta-data=/dev/${partObj.name}       isize=512    agcount=4, agsize=65536 blks\n         =                       sectsz=512   attr=2, projid32bit=1\n         =                       crc=1        finobt=1, sparse=1, rmapbt=0\ndata     =                       bsize=4096   blocks=524288, imaxpct=25\nnaming   =version 2              bsize=4096   ascii-ci=0, ftype=1\nlog      =internal log           bsize=4096   blocks=2560, version=2\nrealtime =none                   extsz=4096   blocks=0, rtextents=0\ndata blocks changed from 262144 to 524288`;
                styleClass = 'success-text';
              } else {
                output = `xfs_growfs: ${target} is not a mounted XFS filesystem`;
                styleClass = 'error';
              }
            }
          }
          break;

        case 'free':
          {
            let swapTotal = 0;
            Object.keys(state.blockDevices).forEach(dKey => {
              Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                let part = state.blockDevices[dKey].parts[pKey];
                if (part.fs === 'swap' && part.mount === '[SWAP]') {
                  swapTotal += parseInt(part.size) * 1024;
                }
              });
            });
            if (state.virtualFilesContent['/etc/fstab']?.includes('swap') && swapTotal === 0) {
              swapTotal = 2048;
            }
            output = `               total        used        free      shared  buff/cache   available\nMem:            1980         850         320          12         810        1010\nSwap:           ${swapTotal || 0}           0        ${swapTotal || 0}`;
            styleClass = 'success-text';
          }
          break;

        case 'mkswap':
          {
            let dev = rawArgs.trim();
            if (!dev) {
              output = 'usage: mkswap device';
              styleClass = 'error';
            } else {
              let partObj = null;
              Object.keys(state.blockDevices).forEach(dKey => {
                if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[dev]) {
                  partObj = state.blockDevices[dKey].parts[dev];
                }
              });

              if (!partObj) {
                let parentDisk = dev.substring(0, 8);
                if (state.blockDevices[parentDisk]) {
                  partObj = {
                    name: dev.substring(dev.lastIndexOf('/') + 1),
                    size: '2G',
                    type: 'part',
                    fs: '',
                    mount: '',
                    uuid: 'c5123dbe-9e12-4fb2-b2a1-swap100000003'
                  };
                  state.blockDevices[parentDisk].parts[dev] = partObj;
                }
              }

              if (partObj) {
                partObj.fs = 'swap';
                partObj.uuid = 'c5123dbe-9e12-4fb2-b2a1-swap100000003';
                output = `Setting up swapspace version 1, size = 2 GiB (2147483648 bytes)\nno label, UUID=${partObj.uuid}`;
                styleClass = 'success-text';
              } else {
                output = `mkswap: cannot open ${dev}: No such file or directory`;
                styleClass = 'error';
              }
            }
          }
          break;

        case 'swapon':
          {
            let dev = rawArgs.trim();
            if (dev === '-a') {
              let fstab = state.virtualFilesContent['/etc/fstab'] || '';
              let swapLines = fstab.split('\n').filter(l => l.includes('swap'));
              swapLines.forEach(swapLine => {
                let devNode = swapLine.trim().split(/\s+/)[0];
                if (!devNode.startsWith('/dev/')) {
                  devNode = '/dev/sdb3'; // Fallback
                }
                Object.keys(state.blockDevices).forEach(dKey => {
                  Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                    if (pKey === devNode) {
                      state.blockDevices[dKey].parts[pKey].mount = '[SWAP]';
                    }
                  });
                });
              });
              output = '(All swaps enabled)';
              styleClass = 'success-text';
            } else if (dev) {
              let partObj = null;
              Object.keys(state.blockDevices).forEach(dKey => {
                if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[dev]) {
                  partObj = state.blockDevices[dKey].parts[dev];
                }
              });
              if (partObj) {
                partObj.mount = '[SWAP]';
                output = `swapon: activated swap space on ${dev}`;
                styleClass = 'success-text';
              } else {
                output = `swapon: cannot find device ${dev}`;
                styleClass = 'error';
              }
            } else {
              let lines = ['Filename\t\t\t\tType\t\tSize\t\tUsed\tPriority'];
              Object.keys(state.blockDevices).forEach(dKey => {
                Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                  let part = state.blockDevices[dKey].parts[pKey];
                  if (part.mount === '[SWAP]') {
                    lines.push(`${pKey}\t\t\t\tpartition\t2097148\t\t0\t-2`);
                  }
                });
              });
              output = lines.join('\n');
              styleClass = 'success-text';
            }
          }
          break;

        case 'swapoff':
          {
            let dev = rawArgs.trim();
            if (dev === '-a') {
              Object.keys(state.blockDevices).forEach(dKey => {
                Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
                  let part = state.blockDevices[dKey].parts[pKey];
                  if (part.mount === '[SWAP]') {
                    part.mount = '';
                  }
                });
              });
              output = '(All swaps disabled)';
              styleClass = 'success-text';
            } else if (dev) {
              let partObj = null;
              Object.keys(state.blockDevices).forEach(dKey => {
                if (state.blockDevices[dKey].parts && state.blockDevices[dKey].parts[dev]) {
                  partObj = state.blockDevices[dKey].parts[dev];
                }
              });
              if (partObj) {
                partObj.mount = '';
                output = `swapoff: deactivated swap space on ${dev}`;
                styleClass = 'success-text';
              } else {
                output = `swapoff: cannot find device ${dev}`;
                styleClass = 'error';
              }
            } else {
              output = 'usage: swapoff [-a] [device]';
              styleClass = 'error';
            }
          }
          break;

        case 'cat':
          if (!rawArgs) {
            output = 'cat: missing operand';
            styleClass = 'error';
          } else if (rawArgs.includes('>')) {
            // Write Mode
            const isAppend = rawArgs.includes('>>');
            const splitOp = isAppend ? '>>' : '>';
            const fileArg = rawArgs.substring(rawArgs.indexOf(splitOp) + splitOp.length).trim();

            if (!fileArg) {
              output = 'bash: syntax error near unexpected token `newline\'';
              styleClass = 'error';
              break;
            }

            const absPath = resolvePath(fileArg);
            const lastSlash = absPath.lastIndexOf('/');
            const parentPath = absPath.substring(0, lastSlash) || '/';

            if (!state.virtualFS[parentPath]) {
              output = `bash: ${fileArg}: No such file or directory`;
              styleClass = 'error';
            } else {
              state.terminalMode = isAppend ? 'cat_append' : 'cat_write';
              state.catTargetFile = absPath;
              state.catBuffer = '';
              updatePrompt();
              elements.terminalInput.placeholder = 'Enter text... Type "ctrl+d" to save.';
              output = `Entering text input mode. Type lines of text.\nWhen finished, type 'ctrl+d' or press Ctrl+D on your keyboard to save and exit.`;
            }
          } else {
            // Read Mode
            const absPath = resolvePath(rawArgs);
            if (state.virtualFilesContent[absPath] !== undefined) {
              output = state.virtualFilesContent[absPath];
            } else if (state.virtualFS[absPath]) {
              output = `cat: ${rawArgs}: Is a directory`;
              styleClass = 'error';
            } else {
              output = `cat: ${rawArgs}: No such file or directory`;
              styleClass = 'error';
            }
          }
          break;

        case 'vi':
        case 'vim':
          if (!rawArgs) {
            output = 'vim: filename required';
            styleClass = 'error';
          } else {
            const absPath = resolvePath(rawArgs);
            const lastSlash = absPath.lastIndexOf('/');
            const parentPath = absPath.substring(0, lastSlash) || '/';

            if (!state.virtualFS[parentPath]) {
              output = `bash: ${rawArgs}: No such file or directory`;
              styleClass = 'error';
              break;
            }

            // Get file name and setup vim
            const baseName = absPath.substring(lastSlash + 1);
            let fileContent = state.virtualFilesContent[absPath];
            let lines = [''];
            if (fileContent !== undefined) {
              lines = fileContent.split('\n');
            }

            // Populate vim state
            state.vim.active = true;
            state.vim.fileName = baseName;
            state.vim.filePath = absPath;
            state.vim.contentLines = [...lines];
            state.vim.mode = 'normal';
            state.vim.commandBuffer = '';
            state.vim.activeLineIndex = 0;
            state.vim.cursorColIndex = 0;
            state.vim.history = [JSON.stringify(lines)];
            state.vim.historyIndex = 0;
            state.vim.hasUnsavedChanges = false;

            // Shift display overlays
            elements.terminalBody.style.display = 'none';
            elements.terminalVimEditor.style.display = 'flex';

            // Load editor
            loadVimEditor();

            // Focus hidden input
            setTimeout(() => {
              elements.vimHiddenInput.value = '';
              elements.vimHiddenInput.focus();
            }, 50);

            output = ''; // Running editor does not print output to stdout directly
          }
          break;

        case 'cp':
          if (!rawArgs) {
            output = 'cp: missing file operand';
            styleClass = 'error';
          } else {
            let tokens = rawArgs.split(' ');
            let recursive = false;
            let verbose = false;

            tokens = tokens.filter(t => {
              if (t.startsWith('-')) {
                if (t.includes('r')) recursive = true;
                if (t.includes('v')) verbose = true;
                return false;
              }
              return true;
            });

            if (tokens.length < 2) {
              output = `cp: missing destination file operand after '${tokens[0]}'`;
              styleClass = 'error';
              break;
            }

            const destToken = tokens[tokens.length - 1];
            const srcTokens = tokens.slice(0, tokens.length - 1);
            const destAbs = resolvePath(destToken);
            const destIsDir = state.virtualFS[destAbs] !== undefined;

            if (srcTokens.length > 1 && !destIsDir) {
              output = `cp: target '${destToken}' is not a directory`;
              styleClass = 'error';
              break;
            }

            let logs = [];
            srcTokens.forEach(srcTok => {
              expandBraces(srcTok).forEach(patt => {
                resolveWildcards(patt).forEach(srcPath => {
                  const srcAbs = resolvePath(srcPath);
                  const lastSlash = srcAbs.lastIndexOf('/');
                  const srcFileName = srcAbs.substring(lastSlash + 1);

                  // Copying a directory
                  if (state.virtualFS[srcAbs]) {
                    if (!recursive) {
                      logs.push(`cp: -r not specified; omitting directory '${srcPath}'`);
                    } else {
                      // Perform directory copy
                      const targetDestPath = destIsDir ? (destAbs === '/' ? '/' + srcFileName : destAbs + '/' + srcFileName) : destAbs;

                      // Find all subkeys of srcAbs and map them to targetDestPath
                      state.virtualFS[targetDestPath] = [];
                      const parentOfTarget = targetDestPath.substring(0, targetDestPath.lastIndexOf('/')) || '/';
                      const targetBaseName = targetDestPath.substring(targetDestPath.lastIndexOf('/') + 1);
                      if (state.virtualFS[parentOfTarget] && !state.virtualFS[parentOfTarget].includes(targetBaseName)) {
                        state.virtualFS[parentOfTarget].push(targetBaseName);
                      }

                      Object.keys(state.virtualFS).forEach(k => {
                        if (k === srcAbs || k.startsWith(srcAbs + '/')) {
                          const relativeSub = k.substring(srcAbs.length);
                          const subDest = targetDestPath + relativeSub;
                          state.virtualFS[subDest] = [...state.virtualFS[k]];
                        }
                      });

                      Object.keys(state.virtualFilesContent).forEach(k => {
                        if (k.startsWith(srcAbs + '/')) {
                          const relativeSub = k.substring(srcAbs.length);
                          const subDest = targetDestPath + relativeSub;
                          state.virtualFilesContent[subDest] = state.virtualFilesContent[k];
                        }
                      });

                      if (verbose) logs.push(`'${srcPath}' -> '${targetDestPath}'`);
                    }
                  } else if (state.virtualFilesContent[srcAbs] !== undefined) {
                    // Copying a file
                    const targetFileDest = destIsDir ? (destAbs === '/' ? '/' + srcFileName : destAbs + '/' + srcFileName) : destAbs;
                    const destLastSlash = targetFileDest.lastIndexOf('/');
                    const destParent = targetFileDest.substring(0, destLastSlash) || '/';
                    const destFileName = targetFileDest.substring(destLastSlash + 1);

                    if (state.virtualFS[destParent]) {
                      state.virtualFilesContent[targetFileDest] = state.virtualFilesContent[srcAbs];
                      if (!state.virtualFS[destParent].includes(destFileName)) {
                        state.virtualFS[destParent].push(destFileName);
                      }
                      if (verbose) logs.push(`'${srcPath}' -> '${targetFileDest}'`);
                    } else {
                      logs.push(`cp: cannot create regular file '${targetFileDest}': No such file or directory`);
                    }
                  } else {
                    logs.push(`cp: cannot stat '${srcPath}': No such file or directory`);
                  }
                });
              });
            });
            output = logs.join('\n');
          }
          break;

        case 'mv':
          if (!rawArgs) {
            output = 'mv: missing file operand';
            styleClass = 'error';
          } else {
            let tokens = rawArgs.split(' ');
            if (tokens.length < 2) {
              output = `mv: missing destination file operand after '${tokens[0]}'`;
              styleClass = 'error';
              break;
            }

            const destToken = tokens[tokens.length - 1];
            const srcTokens = tokens.slice(0, tokens.length - 1);
            const destAbs = resolvePath(destToken);
            const destIsDir = state.virtualFS[destAbs] !== undefined;

            if (srcTokens.length > 1 && !destIsDir) {
              output = `mv: target '${destToken}' is not a directory`;
              styleClass = 'error';
              break;
            }

            let logs = [];
            srcTokens.forEach(srcTok => {
              expandBraces(srcTok).forEach(srcPath => {
                const srcAbs = resolvePath(srcPath);
                const lastSlash = srcAbs.lastIndexOf('/');
                const srcParent = srcAbs.substring(0, lastSlash) || '/';
                const srcFileName = srcAbs.substring(lastSlash + 1);

                if (state.virtualFS[srcAbs]) {
                  // Moving a directory
                  const targetDestPath = destIsDir ? (destAbs === '/' ? '/' + srcFileName : destAbs + '/' + srcFileName) : destAbs;

                  // Copy to destination
                  state.virtualFS[targetDestPath] = [];
                  const parentOfTarget = targetDestPath.substring(0, targetDestPath.lastIndexOf('/')) || '/';
                  const targetBaseName = targetDestPath.substring(targetDestPath.lastIndexOf('/') + 1);
                  if (state.virtualFS[parentOfTarget] && !state.virtualFS[parentOfTarget].includes(targetBaseName)) {
                    state.virtualFS[parentOfTarget].push(targetBaseName);
                  }

                  Object.keys(state.virtualFS).forEach(k => {
                    if (k === srcAbs || k.startsWith(srcAbs + '/')) {
                      const relativeSub = k.substring(srcAbs.length);
                      const subDest = targetDestPath + relativeSub;
                      state.virtualFS[subDest] = [...state.virtualFS[k]];
                    }
                  });

                  Object.keys(state.virtualFilesContent).forEach(k => {
                    if (k.startsWith(srcAbs + '/')) {
                      const relativeSub = k.substring(srcAbs.length);
                      const subDest = targetDestPath + relativeSub;
                      state.virtualFilesContent[subDest] = state.virtualFilesContent[k];
                    }
                  });

                  // Remove old source
                  Object.keys(state.virtualFS).forEach(k => {
                    if (k === srcAbs || k.startsWith(srcAbs + '/')) {
                      delete state.virtualFS[k];
                    }
                  });
                  Object.keys(state.virtualFilesContent).forEach(k => {
                    if (k.startsWith(srcAbs + '/')) {
                      delete state.virtualFilesContent[k];
                    }
                  });
                  if (state.virtualFS[srcParent]) {
                    state.virtualFS[srcParent] = state.virtualFS[srcParent].filter(n => n !== srcFileName);
                  }
                } else if (state.virtualFilesContent[srcAbs] !== undefined) {
                  // Moving a file
                  const targetFileDest = destIsDir ? (destAbs === '/' ? '/' + srcFileName : destAbs + '/' + srcFileName) : destAbs;
                  const destLastSlash = targetFileDest.lastIndexOf('/');
                  const destParent = targetFileDest.substring(0, destLastSlash) || '/';
                  const destFileName = targetFileDest.substring(destLastSlash + 1);

                  if (state.virtualFS[destParent]) {
                    state.virtualFilesContent[targetFileDest] = state.virtualFilesContent[srcAbs];
                    if (!state.virtualFS[destParent].includes(destFileName)) {
                      state.virtualFS[destParent].push(destFileName);
                    }

                    // Remove old file
                    delete state.virtualFilesContent[srcAbs];
                    if (state.virtualFS[srcParent]) {
                      state.virtualFS[srcParent] = state.virtualFS[srcParent].filter(n => n !== srcFileName);
                    }
                  } else {
                    logs.push(`mv: cannot move to '${targetFileDest}': No such file or directory`);
                  }
                } else {
                  logs.push(`mv: cannot stat '${srcPath}': No such file or directory`);
                }
              });
            });
            output = logs.join('\n');
          }
          break;

        case 'sudo':
          if (rawArgs === '-i' || rawArgs === '') {
            state.userShellStack.push(state.currentUser);
            state.currentUser = 'root';
            state.currentDir = '/root';
            updatePrompt();
            output = 'Switching to root superuser... Welcome to RHEL 10 root shell.';
            styleClass = 'success-text';
          } else {
            let sudoSubCmd = rawArgs.trim();
            output = processCommand(sudoSubCmd) || `[sudo ${sudoSubCmd} executed successfully as root]`;
            styleClass = 'success-text';
          }
          break;

        case 'rpm':
        case 'dnf':
        case 'yum':
        case 'exportfs':
        case 'showmount':
        case 'subscription-manager':
        case 'getenforce':
        case 'setenforce':
        case 'sestatus':
        case 'httpd':
        case 'chcon':
        case 'restorecon':
        case 'semanage':
        case 'matchpathcon':
        case 'getsebool':
        case 'setsebool':
        case 'openssl':
        case 'mysql':
        case 'mysqldump':
        case 'mysql_secure_installation':
        case 'ln':
        case 'c':
        case 'lightspeed':
        case 'flatpak':
        case 'tuned-adm':
        case 'ps':
        case 'top':
        case 'watch':
        case 'netstat':
        case 'tcpdump':
        case 'lshw':
        case 'lscpu':
        case 'last':
        case 'lastlog':
        case 'journalctl':
          {
            output = processCommand(commandToRun);
            styleClass = 'success-text';
          }
          break;

        case 'su':
          let suUser = rawArgs.trim() || 'root';
          if (suUser.startsWith('-')) {
            suUser = suUser.replace(/^-+\s*/, '') || 'root';
          }
          if (!state.virtualUsers[suUser]) {
            output = `su: user ${suUser} does not exist`;
            styleClass = 'error';
            break;
          }

          if (state.currentUser === 'root') {
            state.userShellStack.push(state.currentUser);
            state.currentUser = suUser;
            state.currentDir = state.virtualUsers[suUser].home || '/';
            output = `Logged in as ${suUser}.`;
            styleClass = 'success-text';
            updatePrompt();
          } else {
            state.terminalMode = 'su_password_prompt';
            state.suTargetUser = suUser;
            elements.terminalInput.placeholder = 'Enter password...';
            output = 'Password: ';
          }
          break;

        case 'useradd':
          if (state.currentUser !== 'root') {
            output = 'useradd: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let useraddArgs = rawArgs.split(' ');
          let username = '';
          for (let arg of useraddArgs) {
            if (arg && !arg.startsWith('-')) {
              username = arg.trim();
              break;
            }
          }

          if (!username) {
            output = 'useradd: missing username';
            styleClass = 'error';
          } else if (state.virtualUsers[username]) {
            output = `useradd: user '${username}' already exists`;
            styleClass = 'error';
          } else {
            let maxUid = 999;
            Object.values(state.virtualUsers).forEach(u => {
              if (u.uid > maxUid && u.uid < 60000) {
                maxUid = u.uid;
              }
            });
            const newUid = maxUid + 1;

            state.virtualUsers[username] = {
              uid: newUid,
              gid: newUid,
              comment: '',
              home: `/home/${username}`,
              shell: '/bin/bash',
              password: 'password',
              locked: false,
              expiry: ''
            };

            state.virtualGroups[username] = {
              gid: newUid,
              users: [username],
              admins: []
            };

            state.virtualFileMeta[`/home/${username}`] = {
              owner: username,
              group: username,
              type: 'd',
              permissions: 'rwxr-xr-x'
            };

            if (!state.virtualFS['/home'].includes(username)) {
              state.virtualFS['/home'].push(username);
            }
            state.virtualFS[`/home/${username}`] = ['.bash_profile', '.bashrc', '.bash_logout'];
            state.virtualFilesContent[`/home/${username}/.bash_profile`] = `# .bash_profile\nexport PATH`;
            state.virtualFilesContent[`/home/${username}/.bashrc`] = `# .bashrc\nalias ll='ls -l'`;
            state.virtualFilesContent[`/home/${username}/.bash_logout`] = `# .bash_logout`;

            syncUserDatabases();
            output = `useradd: User '${username}' created successfully (UID: ${newUid}).`;
            styleClass = 'success-text';
          }
          break;

        case 'passwd':
          let passwdUser = rawArgs.trim() || state.currentUser;
          if (state.currentUser !== 'root' && passwdUser !== state.currentUser) {
            output = 'passwd: Only root can specify a user name.';
            styleClass = 'error';
            break;
          }
          if (!state.virtualUsers[passwdUser]) {
            output = `passwd: user '${passwdUser}' does not exist`;
            styleClass = 'error';
            break;
          }

          state.terminalMode = 'passwd_prompt';
          state.passwdTargetUser = passwdUser;
          elements.terminalInput.placeholder = 'Enter new password...';
          output = 'Changing password for user ' + passwdUser + '.\nEnter new UNIX password:';
          styleClass = 'success-text';
          break;

        case 'usermod':
          if (state.currentUser !== 'root') {
            output = 'usermod: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let usermodArgs = rawArgs.split(' ');
          let targetUser = usermodArgs[usermodArgs.length - 1];

          if (!targetUser || targetUser.startsWith('-') || !state.virtualUsers[targetUser]) {
            output = 'usermod: user does not exist or invalid usage. Example: usermod -c "Comment" username';
            styleClass = 'error';
            break;
          }

          let record = state.virtualUsers[targetUser];
          let success = false;
          let usermodMsg = '';

          for (let i = 0; i < usermodArgs.length - 1; i++) {
            if (usermodArgs[i] === '-l') {
              let newName = usermodArgs[i + 1];
              if (newName && !newName.startsWith('-')) {
                state.virtualUsers[newName] = record;
                delete state.virtualUsers[targetUser];

                state.virtualFS['/home'] = state.virtualFS['/home'].map(n => n === targetUser ? newName : n);
                if (state.virtualFS[`/home/${targetUser}`]) {
                  state.virtualFS[`/home/${newName}`] = state.virtualFS[`/home/${targetUser}`];
                  delete state.virtualFS[`/home/${targetUser}`];
                }

                usermodMsg += `Renamed login name to '${newName}'. `;
                targetUser = newName;
                record = state.virtualUsers[newName];
                success = true;
                i++;
              }
            } else if (usermodArgs[i] === '-u') {
              let newUid = parseInt(usermodArgs[i + 1]);
              if (!isNaN(newUid)) {
                record.uid = newUid;
                usermodMsg += `Changed UID to ${newUid}. `;
                success = true;
                i++;
              }
            } else if (usermodArgs[i] === '-c') {
              let commentStr = usermodArgs.slice(i + 1).join(' ');
              if (commentStr.startsWith('"')) {
                commentStr = commentStr.substring(1, commentStr.indexOf('"', 1));
              } else if (commentStr.startsWith("'")) {
                commentStr = commentStr.substring(1, commentStr.indexOf("'", 1));
              } else {
                commentStr = usermodArgs[i + 1];
              }
              record.comment = commentStr;
              usermodMsg += `Changed comment/GECOS to "${commentStr}". `;
              success = true;
              break;
            } else if (usermodArgs[i] === '-d') {
              let newDir = usermodArgs[i + 1];
              if (newDir) {
                record.home = newDir;
                usermodMsg += `Changed home directory to '${newDir}'. `;
                success = true;
                i++;
              }
            } else if (usermodArgs[i] === '-s') {
              let newShell = usermodArgs[i + 1];
              if (newShell) {
                record.shell = newShell;
                usermodMsg += `Changed shell to '${newShell}'. `;
                success = true;
                i++;
              }
            } else if (usermodArgs[i] === '-e') {
              let exp = usermodArgs[i + 1];
              if (exp) {
                record.expiry = exp;
                usermodMsg += `Changed expiry to '${exp}'. `;
                success = true;
                i++;
              }
            } else if (usermodArgs[i] === '-L') {
              record.locked = true;
              usermodMsg += `Locked account password. `;
              success = true;
            } else if (usermodArgs[i] === '-U') {
              record.locked = false;
              usermodMsg += `Unlocked account password. `;
              success = true;
            }
          }

          if (success) {
            syncUserDatabases();
            output = `usermod: ${usermodMsg.trim()}`;
            styleClass = 'success-text';
          } else {
            output = 'usermod: invalid options. Options: -l, -u, -c, -d, -s, -e, -L, -U';
            styleClass = 'error';
          }
          break;

        case 'userdel':
          if (state.currentUser !== 'root') {
            output = 'userdel: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }
          let userdelArgs = rawArgs.split(' ');
          let delRecursive = userdelArgs.includes('-r');
          let delUser = '';
          for (let arg of userdelArgs) {
            if (arg && arg !== '-r' && !arg.startsWith('-')) {
              delUser = arg.trim();
              break;
            }
          }

          if (!delUser || !state.virtualUsers[delUser]) {
            output = `userdel: user '${delUser || ''}' does not exist`;
            styleClass = 'error';
          } else {
            delete state.virtualUsers[delUser];
            if (delRecursive) {
              state.virtualFS['/home'] = state.virtualFS['/home'].filter(n => n !== delUser);
              delete state.virtualFS[`/home/${delUser}`];
              Object.keys(state.virtualFilesContent).forEach(f => {
                if (f.startsWith(`/home/${delUser}/`)) {
                  delete state.virtualFilesContent[f];
                }
              });
            }
            syncUserDatabases();
            output = `userdel: User '${delUser}' deleted successfully${delRecursive ? ' (and home directory removed)' : ''}.`;
            styleClass = 'success-text';
          }
          break;

        case 'groupadd':
          if (state.currentUser !== 'root') {
            output = 'groupadd: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let groupaddArgs = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          let newGidOpt = null;
          let groupname = '';

          for (let i = 0; i < groupaddArgs.length; i++) {
            if (groupaddArgs[i] === '-g') {
              newGidOpt = parseInt(groupaddArgs[i + 1]);
              i++;
            } else if (!groupaddArgs[i].startsWith('-')) {
              groupname = groupaddArgs[i];
            }
          }

          if (!groupname) {
            output = 'groupadd: missing group name';
            styleClass = 'error';
          } else if (state.virtualGroups[groupname]) {
            output = `groupadd: group '${groupname}' already exists`;
            styleClass = 'error';
          } else {
            let assignedGid = newGidOpt;
            if (assignedGid === null || isNaN(assignedGid)) {
              let maxGid = 999;
              Object.values(state.virtualGroups).forEach(g => {
                if (g.gid > maxGid && g.gid < 60000) {
                  maxGid = g.gid;
                }
              });
              assignedGid = maxGid + 1;
            }

            state.virtualGroups[groupname] = {
              gid: assignedGid,
              users: [],
              admins: []
            };

            syncUserDatabases();
            output = `groupadd: Group '${groupname}' created successfully (GID: ${assignedGid}).`;
            styleClass = 'success-text';
          }
          break;

        case 'gpasswd':
          if (state.currentUser !== 'root') {
            output = 'gpasswd: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let gpasswdArgs = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          if (gpasswdArgs.length < 2) {
            output = `Usage: gpasswd [option] group\nOptions:\n  -a user      add user to group\n  -d user      remove user from group\n  -M users     set the list of group members\n  -A admins    set the list of group administrators`;
            styleClass = 'error';
            break;
          }

          let option = gpasswdArgs[0];
          let optVal = gpasswdArgs[1];
          let targetGrp = gpasswdArgs[2];

          if (option === '-M' || option === '-A') {
            targetGrp = gpasswdArgs[2];
          }

          if (option === '-a') {
            const userToAdd = optVal;
            const groupToMod = targetGrp;
            if (!state.virtualUsers[userToAdd]) {
              output = `gpasswd: user '${userToAdd}' does not exist`;
              styleClass = 'error';
            } else if (!state.virtualGroups[groupToMod]) {
              output = `gpasswd: group '${groupToMod}' does not exist`;
              styleClass = 'error';
            } else {
              if (!state.virtualGroups[groupToMod].users.includes(userToAdd)) {
                state.virtualGroups[groupToMod].users.push(userToAdd);
              }
              syncUserDatabases();
              output = `Adding user ${userToAdd} to group ${groupToMod}`;
              styleClass = 'success-text';
            }
          } else if (option === '-d') {
            const userToRem = optVal;
            const groupToMod = targetGrp;
            if (!state.virtualGroups[groupToMod]) {
              output = `gpasswd: group '${groupToMod}' does not exist`;
              styleClass = 'error';
            } else {
              state.virtualGroups[groupToMod].users = state.virtualGroups[groupToMod].users.filter(u => u !== userToRem);
              syncUserDatabases();
              output = `Removing user ${userToRem} from group ${groupToMod}`;
              styleClass = 'success-text';
            }
          } else if (option === '-M') {
            const groupToMod = targetGrp;
            if (!state.virtualGroups[groupToMod]) {
              output = `gpasswd: group '${groupToMod}' does not exist`;
              styleClass = 'error';
            } else {
              const members = optVal.split(',').map(x => x.trim()).filter(Boolean);
              const invalidUsers = members.filter(u => !state.virtualUsers[u]);
              if (invalidUsers.length > 0) {
                output = `gpasswd: user(s) '${invalidUsers.join(', ')}' do not exist`;
                styleClass = 'error';
              } else {
                state.virtualGroups[groupToMod].users = members;
                syncUserDatabases();
                output = `gpasswd: Members of group '${groupToMod}' set to: ${members.join(', ')}`;
                styleClass = 'success-text';
              }
            }
          } else if (option === '-A') {
            const groupToMod = targetGrp;
            if (!state.virtualGroups[groupToMod]) {
              output = `gpasswd: group '${groupToMod}' does not exist`;
              styleClass = 'error';
            } else {
              const admins = optVal.split(',').map(x => x.trim()).filter(Boolean);
              state.virtualGroups[groupToMod].admins = admins;
              syncUserDatabases();
              output = `gpasswd: Administrators of group '${groupToMod}' set to: ${admins.join(', ')}`;
              styleClass = 'success-text';
            }
          } else {
            output = `gpasswd: invalid option -- '${option}'\nTry 'gpasswd' without arguments for help.`;
            styleClass = 'error';
          }
          break;

        case 'groupmod':
          if (state.currentUser !== 'root') {
            output = 'groupmod: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let groupmodArgs = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          if (groupmodArgs.length < 3) {
            output = 'Usage: groupmod -g GID group OR groupmod -n newname group';
            styleClass = 'error';
            break;
          }

          let modOpt = groupmodArgs[0];
          let modVal = groupmodArgs[1];
          let modGrp = groupmodArgs[2];

          if (!state.virtualGroups[modGrp]) {
            output = `groupmod: group '${modGrp}' does not exist`;
            styleClass = 'error';
          } else {
            if (modOpt === '-g') {
              const newGid = parseInt(modVal);
              if (isNaN(newGid)) {
                output = `groupmod: invalid group ID '${modVal}'`;
                styleClass = 'error';
              } else {
                state.virtualGroups[modGrp].gid = newGid;
                syncUserDatabases();
                output = `groupmod: group '${modGrp}' GID changed to ${newGid}`;
                styleClass = 'success-text';
              }
            } else if (modOpt === '-n') {
              const newName = modVal;
              if (state.virtualGroups[newName]) {
                output = `groupmod: group '${newName}' already exists`;
                styleClass = 'error';
              } else {
                state.virtualGroups[newName] = state.virtualGroups[modGrp];
                delete state.virtualGroups[modGrp];
                syncUserDatabases();
                output = `groupmod: group '${modGrp}' renamed to '${newName}'`;
                styleClass = 'success-text';
              }
            } else {
              output = `groupmod: invalid option -- '${modOpt}'`;
              styleClass = 'error';
            }
          }
          break;

        case 'groupdel':
          if (state.currentUser !== 'root') {
            output = 'groupdel: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }
          let delGrp = rawArgs.trim();
          if (!delGrp) {
            output = 'groupdel: group name required';
            styleClass = 'error';
          } else if (!state.virtualGroups[delGrp]) {
            output = `groupdel: group '${delGrp}' does not exist`;
            styleClass = 'error';
          } else {
            let isPrimary = false;
            let primaryUser = '';
            Object.keys(state.virtualUsers).forEach(u => {
              if (state.virtualUsers[u].gid === state.virtualGroups[delGrp].gid) {
                isPrimary = true;
                primaryUser = u;
              }
            });

            if (isPrimary) {
              output = `groupdel: cannot remove the primary group of user '${primaryUser}'`;
              styleClass = 'error';
            } else {
              delete state.virtualGroups[delGrp];
              syncUserDatabases();
              output = `groupdel: group '${delGrp}' deleted successfully.`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'chown':
          if (state.currentUser !== 'root') {
            output = 'chown: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let chownTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          let recurseChown = false;

          if (chownTokens.includes('-R')) {
            recurseChown = true;
            chownTokens = chownTokens.filter(t => t !== '-R');
          }

          if (chownTokens.length < 2) {
            output = 'Usage: chown [-R] owner[:group] file';
            styleClass = 'error';
            break;
          }

          let ownerGrpSpec = chownTokens[0];
          let chownFile = chownTokens[1];

          let newOwner = '';
          let newGrp = '';

          if (ownerGrpSpec.includes(':')) {
            const parts = ownerGrpSpec.split(':');
            newOwner = parts[0];
            newGrp = parts[1];
          } else if (ownerGrpSpec.includes('.')) {
            const parts = ownerGrpSpec.split('.');
            newOwner = parts[0];
            newGrp = parts[1];
          } else {
            newOwner = ownerGrpSpec;
          }

          if (newOwner && !state.virtualUsers[newOwner]) {
            output = `chown: invalid user: '${newOwner}'`;
            styleClass = 'error';
            break;
          }

          if (newGrp && !state.virtualGroups[newGrp]) {
            output = `chown: invalid group: '${newGrp}'`;
            styleClass = 'error';
            break;
          }

          const chownAbs = resolvePath(chownFile);
          const chownExists = state.virtualFS[chownAbs] !== undefined || state.virtualFilesContent[chownAbs] !== undefined;

          if (!chownExists) {
            output = `chown: cannot access '${chownFile}': No such file or directory`;
            styleClass = 'error';
          } else {
            const applyChown = (path) => {
              if (!state.virtualFileMeta[path]) {
                state.virtualFileMeta[path] = {
                  owner: 'root',
                  group: 'root',
                  type: state.virtualFS[path] !== undefined ? 'd' : '-',
                  permissions: state.virtualFS[path] !== undefined ? 'rwxr-xr-x' : 'rw-r--r--'
                };
              }
              if (newOwner) state.virtualFileMeta[path].owner = newOwner;
              if (newGrp) state.virtualFileMeta[path].group = newGrp;
            };

            applyChown(chownAbs);

            if (recurseChown && state.virtualFS[chownAbs]) {
              Object.keys(state.virtualFS).forEach(k => {
                if (k.startsWith(chownAbs + '/')) {
                  applyChown(k);
                }
              });
              Object.keys(state.virtualFilesContent).forEach(k => {
                if (k.startsWith(chownAbs + '/')) {
                  applyChown(k);
                }
              });
            }
            output = `Changed ownership of '${chownFile}' to ${newOwner || '(unchanged)'}:${newGrp || '(unchanged)'}`;
            styleClass = 'success-text';
          }
          break;

        case 'chgrp':
          if (state.currentUser !== 'root') {
            output = 'chgrp: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }

          let chgrpTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          let recurseChgrp = false;

          if (chgrpTokens.includes('-R')) {
            recurseChgrp = true;
            chgrpTokens = chgrpTokens.filter(t => t !== '-R');
          }

          if (chgrpTokens.length < 2) {
            output = 'Usage: chgrp [-R] group file';
            styleClass = 'error';
            break;
          }

          let targetGroup = chgrpTokens[0];
          let chgrpFile = chgrpTokens[1];

          if (!state.virtualGroups[targetGroup]) {
            output = `chgrp: invalid group: '${targetGroup}'`;
            styleClass = 'error';
            break;
          }

          const chgrpAbs = resolvePath(chgrpFile);
          const chgrpExists = state.virtualFS[chgrpAbs] !== undefined || state.virtualFilesContent[chgrpAbs] !== undefined;

          if (!chgrpExists) {
            output = `chgrp: cannot access '${chgrpFile}': No such file or directory`;
            styleClass = 'error';
          } else {
            const applyChgrp = (path) => {
              if (!state.virtualFileMeta[path]) {
                state.virtualFileMeta[path] = {
                  owner: 'root',
                  group: 'root',
                  type: state.virtualFS[path] !== undefined ? 'd' : '-',
                  permissions: state.virtualFS[path] !== undefined ? 'rwxr-xr-x' : 'rw-r--r--'
                };
              }
              state.virtualFileMeta[path].group = targetGroup;
            };

            applyChgrp(chgrpAbs);

            if (recurseChgrp && state.virtualFS[chgrpAbs]) {
              Object.keys(state.virtualFS).forEach(k => {
                if (k.startsWith(chgrpAbs + '/')) {
                  applyChgrp(k);
                }
              });
              Object.keys(state.virtualFilesContent).forEach(k => {
                if (k.startsWith(chgrpAbs + '/')) {
                  applyChgrp(k);
                }
              });
            }
            output = `Changed group of '${chgrpFile}' to '${targetGroup}'`;
            styleClass = 'success-text';
          }
          break;

        case 'chmod':
          let chmodTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          let recurseChmod = false;

          if (chmodTokens.includes('-R')) {
            recurseChmod = true;
            chmodTokens = chmodTokens.filter(t => t !== '-R');
          }

          if (chmodTokens.length < 2) {
            output = 'Usage: chmod [-R] <octal|symbolic> <file>';
            styleClass = 'error';
            break;
          }

          let modeArg = chmodTokens[0];
          let chmodFile = chmodTokens[1];

          const chmodAbs = resolvePath(chmodFile);
          const chmodExists = state.virtualFS[chmodAbs] !== undefined || state.virtualFilesContent[chmodAbs] !== undefined;

          if (!chmodExists) {
            output = `chmod: cannot access '${chmodFile}': No such file or directory`;
            styleClass = 'error';
            break;
          }

          const applyChmod = (path) => {
            if (!state.virtualFileMeta[path]) {
              state.virtualFileMeta[path] = {
                owner: 'root',
                group: 'root',
                type: state.virtualFS[path] !== undefined ? 'd' : '-',
                permissions: state.virtualFS[path] !== undefined ? 'rwxr-xr-x' : 'rw-r--r--'
              };
            }
            if (!state.virtualFileMeta[path].special) {
              state.virtualFileMeta[path].special = { suid: false, sgid: false, sticky: false };
            }

            let currentPerms = state.virtualFileMeta[path].permissions;
            let nextPerms = currentPerms;

            if (/^[0-7]{4}$/.test(modeArg)) {
              let octalDigits = modeArg.split('').map(Number);
              let specDigit = octalDigits[0];
              state.virtualFileMeta[path].special.suid = !!(specDigit & 4);
              state.virtualFileMeta[path].special.sgid = !!(specDigit & 2);
              state.virtualFileMeta[path].special.sticky = !!(specDigit & 1);

              const bitToString = (val) => {
                let r = (val & 4) ? 'r' : '-';
                let w = (val & 2) ? 'w' : '-';
                let x = (val & 1) ? 'x' : '-';
                return r + w + x;
              };
              nextPerms = bitToString(octalDigits[1]) + bitToString(octalDigits[2]) + bitToString(octalDigits[3]);
            } else if (/^[0-7]{3}$/.test(modeArg)) {
              state.virtualFileMeta[path].special.suid = false;
              state.virtualFileMeta[path].special.sgid = false;
              state.virtualFileMeta[path].special.sticky = false;

              let octalDigits = modeArg.split('').map(Number);
              const bitToString = (val) => {
                let r = (val & 4) ? 'r' : '-';
                let w = (val & 2) ? 'w' : '-';
                let x = (val & 1) ? 'x' : '-';
                return r + w + x;
              };
              nextPerms = bitToString(octalDigits[0]) + bitToString(octalDigits[1]) + bitToString(octalDigits[2]);
            } else {
              let subModes = modeArg.split(',');
              let permChars = ['r', 'w', 'x'];

              subModes.forEach(subMode => {
                let match = subMode.match(/^([ugoa]*)([-+=])([rwxst]*)$/);
                if (match) {
                  let targets = match[1] || 'a';
                  if (targets.includes('a')) {
                    targets = 'ugo';
                  }
                  let op = match[2];
                  let perms = match[3];

                  let parts = {
                    u: nextPerms.substring(0, 3).split(''),
                    g: nextPerms.substring(3, 6).split(''),
                    o: nextPerms.substring(6, 9).split('')
                  };

                  targets.split('').forEach(t => {
                    let targetPart = parts[t];
                    if (op === '+') {
                      perms.split('').forEach(p => {
                        if (p === 's') {
                          if (t === 'u') state.virtualFileMeta[path].special.suid = true;
                          if (t === 'g') state.virtualFileMeta[path].special.sgid = true;
                        } else if (p === 't') {
                          if (t === 'o') state.virtualFileMeta[path].special.sticky = true;
                        } else {
                          let idx = permChars.indexOf(p);
                          if (idx > -1) targetPart[idx] = p;
                        }
                      });
                    } else if (op === '-') {
                      perms.split('').forEach(p => {
                        if (p === 's') {
                          if (t === 'u') state.virtualFileMeta[path].special.suid = false;
                          if (t === 'g') state.virtualFileMeta[path].special.sgid = false;
                        } else if (p === 't') {
                          if (t === 'o') state.virtualFileMeta[path].special.sticky = false;
                        } else {
                          let idx = permChars.indexOf(p);
                          if (idx > -1) targetPart[idx] = '-';
                        }
                      });
                    } else if (op === '=') {
                      targetPart[0] = '-';
                      targetPart[1] = '-';
                      targetPart[2] = '-';
                      if (t === 'u') state.virtualFileMeta[path].special.suid = false;
                      if (t === 'g') state.virtualFileMeta[path].special.sgid = false;
                      if (t === 'o') state.virtualFileMeta[path].special.sticky = false;

                      perms.split('').forEach(p => {
                        if (p === 's') {
                          if (t === 'u') state.virtualFileMeta[path].special.suid = true;
                          if (t === 'g') state.virtualFileMeta[path].special.sgid = true;
                        } else if (p === 't') {
                          if (t === 'o') state.virtualFileMeta[path].special.sticky = true;
                        } else {
                          let idx = permChars.indexOf(p);
                          if (idx > -1) targetPart[idx] = p;
                        }
                      });
                    }
                  });
                  nextPerms = parts.u.join('') + parts.g.join('') + parts.o.join('');
                }
              });
            }

            state.virtualFileMeta[path].permissions = nextPerms;
          };

          applyChmod(chmodAbs);

          if (recurseChmod && state.virtualFS[chmodAbs]) {
            Object.keys(state.virtualFS).forEach(k => {
              if (k.startsWith(chmodAbs + '/')) {
                applyChmod(k);
              }
            });
            Object.keys(state.virtualFilesContent).forEach(k => {
              if (k.startsWith(chmodAbs + '/')) {
                applyChmod(k);
              }
            });
          }

          let finalPermsDisplay = state.virtualFileMeta[chmodAbs].permissions;
          let permArr = finalPermsDisplay.split('');
          const spec = state.virtualFileMeta[chmodAbs].special || {};
          if (spec.suid) permArr[2] = permArr[2] === 'x' ? 's' : 'S';
          if (spec.sgid) permArr[5] = permArr[5] === 'x' ? 's' : 'S';
          if (spec.sticky) permArr[8] = permArr[8] === 'x' ? 't' : 'T';

          output = `mode of '${chmodFile}' changed to ${permArr.join('')}`;
          styleClass = 'success-text';
          break;

        case 'getenforce':
          output = state.selinuxMode;
          styleClass = 'success-text';
          break;

        case 'setenforce':
          if (state.currentUser !== 'root') {
            output = 'setenforce: Permission denied (must be root)';
            styleClass = 'error';
            break;
          }
          let seModeArg = rawArgs.toLowerCase().trim();
          if (seModeArg === '1' || seModeArg === 'enforcing') {
            state.selinuxMode = 'Enforcing';
            output = 'SELinux mode set to Enforcing';
            styleClass = 'success-text';
          } else if (seModeArg === '0' || seModeArg === 'permissive') {
            state.selinuxMode = 'Permissive';
            output = 'SELinux mode set to Permissive';
            styleClass = 'success-text';
          } else {
            output = 'usage: setenforce [Enforcing | Permissive | 1 | 0]';
            styleClass = 'error';
          }
          if (window.syncSelinuxWidgetView) {
            window.syncSelinuxWidgetView();
          }
          break;

        case 'sestatus':
          output = `SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   ${state.selinuxMode.toLowerCase()}
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown:            allowed
Memory protection checking:     actual (secure)
Max kernel policy version:      33`;
          styleClass = 'success-text';
          break;

        case 'firewall-cmd':
          {
            let argsStr = rawArgs.trim();
            if (!argsStr) {
              output = `Usage: firewall-cmd [options]
Options:
  --get-default-zone            Print default zone
  --list-all-zones              List all predefined zones
  --set-default-zone=<zone>     Set active default zone
  --list-all                    List configured rules in active zone
  --add-service=<service>       Add service to zone
  --remove-service=<service>    Remove service from zone
  --add-port=<port/protocol>    Open port in zone
  --remove-port=<port/protocol> Close port in zone
  --reload                      Reload firewall configurations`;
              styleClass = 'success-text';
              break;
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
              let m = argsStr.match(/--zone=([^\s]+)/);
              if (m) targetZone = m[1];
            }

            if (!state.firewallZones[targetZone]) {
              state.firewallZones[targetZone] = { services: ['ssh'], ports: [], interfaces: [] };
            }

            let zObj = state.firewallZones[targetZone];

            if (argsStr.includes('--get-default-zone')) {
              output = state.defaultZone;
              styleClass = 'success-text';
            } else if (argsStr.includes('--list-all-zones')) {
              output = Object.keys(state.firewallZones).map(z => {
                let item = state.firewallZones[z];
                return `${z} (${z === state.defaultZone ? 'active' : 'inactive'})\n  target: default\n  interfaces: ${item.interfaces.join(' ') || 'none'}\n  services: ${item.services.join(' ')}\n  ports: ${item.ports.join(' ')}`;
              }).join('\n\n');
              styleClass = 'success-text';
            } else if (argsStr.includes('--set-default-zone=')) {
              let m = argsStr.match(/--set-default-zone=([^\s]+)/);
              if (m) {
                state.defaultZone = m[1];
                if (!state.firewallZones[m[1]]) {
                  state.firewallZones[m[1]] = { services: ['ssh'], ports: [], interfaces: [] };
                }
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--list-all')) {
              output = `${targetZone} (${targetZone === state.defaultZone ? 'active' : 'inactive'})\n  target: default\n  icmp-block-inversion: no\n  interfaces: ${zObj.interfaces.join(' ') || 'enp0s3'}\n  sources: \n  services: ${zObj.services.join(' ')}\n  ports: ${zObj.ports.join(' ')}\n  protocols: \n  forward: yes\n  masquerade: no`;
              styleClass = 'success-text';
            } else if (argsStr.includes('--add-service=')) {
              let m = argsStr.match(/--add-service=([^\s]+)/);
              if (m) {
                let rawSvcs = m[1].replace('{', '').replace('}', '').split(',');
                rawSvcs.forEach(s => {
                  let cleanS = s.trim();
                  if (cleanS && !zObj.services.includes(cleanS)) zObj.services.push(cleanS);
                  if (cleanS && !state.firewallServices.includes(cleanS)) state.firewallServices.push(cleanS);
                });
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--remove-service=')) {
              let m = argsStr.match(/--remove-service=([^\s]+)/);
              if (m) {
                let rawSvcs = m[1].replace('{', '').replace('}', '').split(',');
                rawSvcs.forEach(s => {
                  let cleanS = s.trim();
                  zObj.services = zObj.services.filter(x => x !== cleanS);
                  state.firewallServices = state.firewallServices.filter(x => x !== cleanS);
                });
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--add-port=')) {
              let m = argsStr.match(/--add-port=([^\s]+)/);
              if (m) {
                let p = m[1].trim();
                if (!zObj.ports.includes(p)) zObj.ports.push(p);
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--remove-port=')) {
              let m = argsStr.match(/--remove-port=([^\s]+)/);
              if (m) {
                let p = m[1].trim();
                zObj.ports = zObj.ports.filter(x => x !== p);
                output = 'success';
                styleClass = 'success-text';
              }
            } else if (argsStr.includes('--reload')) {
              output = 'success';
              styleClass = 'success-text';
            } else if (argsStr.includes('--state')) {
              output = 'running';
              styleClass = 'success-text';
            } else {
              output = `success`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'getfacl':
          if (!rawArgs) {
            output = 'usage: getfacl <file>';
            styleClass = 'error';
            break;
          }
          let getfaclAbs = resolvePath(rawArgs);
          let getfaclExists = state.virtualFS[getfaclAbs] !== undefined || state.virtualFilesContent[getfaclAbs] !== undefined;
          if (!getfaclExists) {
            output = `getfacl: ${rawArgs}: No such file or directory`;
            styleClass = 'error';
            break;
          }

          let gfMeta = state.virtualFileMeta[getfaclAbs] || { owner: 'root', group: 'root', permissions: 'rwxr-xr-x' };
          let gfOwner = gfMeta.owner || 'root';
          let gfGroup = gfMeta.group || 'root';
          let gfPerms = gfMeta.permissions || 'rwxr-xr-x';

          let gfLines = [
            `# file: ${rawArgs.replace(/\/$/, '')}`,
            `# owner: ${gfOwner}`,
            `# group: ${gfGroup}`,
            `user::${gfPerms.substring(0, 3)}`
          ];

          if (gfMeta.acls && gfMeta.acls.users) {
            Object.keys(gfMeta.acls.users).forEach(u => {
              gfLines.push(`user:${u}:${gfMeta.acls.users[u]}`);
            });
          }

          gfLines.push(`group::${gfPerms.substring(3, 6)}`);

          if (gfMeta.acls && gfMeta.acls.groups) {
            Object.keys(gfMeta.acls.groups).forEach(g => {
              gfLines.push(`group:${g}:${gfMeta.acls.groups[g]}`);
            });
          }

          if (gfMeta.acls && (Object.keys(gfMeta.acls.users || {}).length > 0 || Object.keys(gfMeta.acls.groups || {}).length > 0)) {
            let maskR = false, maskW = false, maskX = false;
            const checkMask = (str) => {
              if (str.includes('r')) maskR = true;
              if (str.includes('w')) maskW = true;
              if (str.includes('x')) maskX = true;
            };
            Object.values(gfMeta.acls.users || {}).forEach(checkMask);
            Object.values(gfMeta.acls.groups || {}).forEach(checkMask);
            let maskStr = (maskR ? 'r' : '-') + (maskW ? 'w' : '-') + (maskX ? 'x' : '-');
            gfLines.push(`mask::${maskStr}`);
          }

          gfLines.push(`other::${gfPerms.substring(6, 9)}`);
          output = gfLines.join('\n');
          styleClass = 'success-text';
          break;

        case 'setfacl':
          let sfTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          if (sfTokens.length < 1) {
            output = 'Usage: setfacl [-m u|g:name:perms | -x u|g:name: | -b] <file>';
            styleClass = 'error';
            break;
          }

          let flag = sfTokens[0];
          let sfTargetFile = sfTokens[sfTokens.length - 1];
          let sfAbs = resolvePath(sfTargetFile);
          let sfExists = state.virtualFS[sfAbs] !== undefined || state.virtualFilesContent[sfAbs] !== undefined;

          if (!sfExists) {
            output = `setfacl: ${sfTargetFile}: No such file or directory`;
            styleClass = 'error';
            break;
          }

          if (!state.virtualFileMeta[sfAbs]) {
            state.virtualFileMeta[sfAbs] = {
              owner: 'root',
              group: 'root',
              type: state.virtualFS[sfAbs] !== undefined ? 'd' : '-',
              permissions: state.virtualFS[sfAbs] !== undefined ? 'rwxr-xr-x' : 'rw-r--r--'
            };
          }
          if (!state.virtualFileMeta[sfAbs].acls) {
            state.virtualFileMeta[sfAbs].acls = { users: {}, groups: {} };
          }

          if (flag === '-b') {
            state.virtualFileMeta[sfAbs].acls = { users: {}, groups: {} };
            output = `setfacl: cleared all ACL rules on '${sfTargetFile}'`;
            styleClass = 'success-text';
          } else if (flag === '-x') {
            if (sfTokens.length < 3) {
              output = 'Usage: setfacl -x u|g:name: <file>';
              styleClass = 'error';
              break;
            }
            let rule = sfTokens[1];
            let match = rule.match(/^(u|g):([^:]+):?$/);
            if (!match) {
              output = `setfacl: invalid rule: '${rule}'`;
              styleClass = 'error';
              break;
            }
            let type = match[1];
            let name = match[2];
            if (type === 'u') {
              delete state.virtualFileMeta[sfAbs].acls.users[name];
            } else {
              delete state.virtualFileMeta[sfAbs].acls.groups[name];
            }
            output = `setfacl: removed ACL entry for ${type === 'u' ? 'user' : 'group'} '${name}'`;
            styleClass = 'success-text';
          } else if (flag === '-m') {
            if (sfTokens.length < 3) {
              output = 'Usage: setfacl -m u|g:name:perms <file>';
              styleClass = 'error';
              break;
            }
            let rule = sfTokens[1];
            let match = rule.match(/^(u|g):([^:]+):([rwx0-7\-]+)$/);
            if (!match) {
              output = `setfacl: invalid rule spec: '${rule}'`;
              styleClass = 'error';
              break;
            }
            let type = match[1];
            let name = match[2];
            let rawPerms = match[3];

            if (type === 'u' && name !== 'root' && !state.virtualUsers[name]) {
              output = `setfacl: option -m: user '${name}' does not exist`;
              styleClass = 'error';
              break;
            }
            if (type === 'g' && name !== 'root' && !state.virtualGroups[name]) {
              output = `setfacl: option -m: group '${name}' does not exist`;
              styleClass = 'error';
              break;
            }

            let permStr = rawPerms;
            if (/^[0-7]$/.test(rawPerms)) {
              let val = parseInt(rawPerms);
              let r = (val & 4) ? 'r' : '-';
              let w = (val & 2) ? 'w' : '-';
              let x = (val & 1) ? 'x' : '-';
              permStr = r + w + x;
            } else {
              let r = permStr.includes('r') ? 'r' : '-';
              let w = permStr.includes('w') ? 'w' : '-';
              let x = permStr.includes('x') ? 'x' : '-';
              permStr = r + w + x;
            }

            if (type === 'u') {
              state.virtualFileMeta[sfAbs].acls.users[name] = permStr;
            } else {
              state.virtualFileMeta[sfAbs].acls.groups[name] = permStr;
            }
            output = `setfacl: applied ACL rule ${type === 'u' ? 'user' : 'group'} '${name}' &rarr; ${permStr}`;
            styleClass = 'success-text';
          } else {
            output = `setfacl: unknown flag: '${flag}'`;
            styleClass = 'error';
          }
          break;

        case 'exit':
          if (state.userShellStack.length > 1) {
            const prevUser = state.userShellStack.pop();
            state.currentUser = prevUser;
            state.currentDir = state.virtualUsers[prevUser].home || '/home/student';
            output = `Logged out. Back to session as ${prevUser}.`;
            styleClass = 'success-text';
            updatePrompt();
          } else {
            output = 'exit: primary shell session cannot be terminated.';
            styleClass = 'error';
          }
          break;

        case 'grep':
          let grepRaw = rawArgs;
          let grepOpts = {
            caseInsensitive: false,
            invert: false,
            lineNumbers: false,
            count: false,
            listMatching: false,
            listNonMatching: false,
            recursive: false
          };

          let partsGrep = grepRaw.match(/(".*?"|'.*?'|\S+)/g) || [];
          let cleanGrepArgs = [];
          for (let p of partsGrep) {
            let cleanP = p.replace(/^['"]|['"]$/g, '');
            if (p.startsWith('-')) {
              if (p.includes('i')) grepOpts.caseInsensitive = true;
              if (p.includes('v')) grepOpts.invert = true;
              if (p.includes('n')) grepOpts.lineNumbers = true;
              if (p.includes('c')) grepOpts.count = true;
              if (p.includes('l')) grepOpts.listMatching = true;
              if (p.includes('L')) grepOpts.listNonMatching = true;
              if (p.includes('r')) grepOpts.recursive = true;
            } else {
              cleanGrepArgs.push(cleanP);
            }
          }

          if (cleanGrepArgs.length < 1) {
            output = 'usage: grep [options] <pattern> [files...]';
            styleClass = 'error';
            break;
          }

          let grepPattern = cleanGrepArgs[0];
          let grepFiles = cleanGrepArgs.slice(1);

          // Helper to match pattern on a line
          const matchLine = (line, pat) => {
            let text = line;
            let query = pat;
            if (grepOpts.caseInsensitive) {
              text = text.toLowerCase();
              query = query.toLowerCase();
            }
            let isMatch = false;
            if (query.startsWith('^')) {
              isMatch = text.startsWith(query.substring(1));
            } else if (query.endsWith('$')) {
              isMatch = text.endsWith(query.substring(0, query.length - 1));
            } else {
              isMatch = text.includes(query);
            }
            return grepOpts.invert ? !isMatch : isMatch;
          };

          // Recursive search helper
          const findGrepFilesInDir = (dir) => {
            let res = [];
            const files = state.virtualFS[dir] || [];
            files.forEach(f => {
              const full = dir === '/' ? `/${f}` : `${dir}/${f}`;
              if (state.virtualFS[full]) {
                res = res.concat(findGrepFilesInDir(full));
              } else if (state.virtualFilesContent[full] !== undefined) {
                res.push(full);
              }
            });
            return res;
          };

          if (grepOpts.recursive) {
            let searchDir = resolvePath(grepFiles[0] || state.currentDir);
            let allFiles = findGrepFilesInDir(searchDir);
            let grepLines = [];
            allFiles.forEach(file => {
              let content = state.virtualFilesContent[file] || '';
              let lines = content.split('\n');
              lines.forEach((l, idx) => {
                if (matchLine(l, grepPattern)) {
                  if (grepOpts.listMatching) {
                    if (!grepLines.includes(file)) grepLines.push(file);
                  } else {
                    let prefix = `${file}:`;
                    if (grepOpts.lineNumbers) prefix += `${idx + 1}:`;
                    grepLines.push(`${prefix}${l}`);
                  }
                }
              });
            });
            output = grepLines.join('\n');
            styleClass = 'success-text';
          } else {
            if (grepFiles.length === 0) {
              output = 'grep: missing file operand';
              styleClass = 'error';
            } else {
              let grepLines = [];
              let multipleFiles = grepFiles.length > 1;

              grepFiles.forEach(f => {
                const absPath = resolvePath(f);
                let content = state.virtualFilesContent[absPath];
                if (content === undefined) {
                  grepLines.push(`grep: ${f}: No such file or directory`);
                } else {
                  let lines = content.split('\n');
                  let count = 0;
                  let matchedAny = false;
                  lines.forEach((l, idx) => {
                    if (matchLine(l, grepPattern)) {
                      matchedAny = true;
                      count++;
                      if (!grepOpts.count && !grepOpts.listMatching && !grepOpts.listNonMatching) {
                        let lineOut = '';
                        if (multipleFiles) lineOut += `${f}:`;
                        if (grepOpts.lineNumbers) lineOut += `${idx + 1}:`;
                        lineOut += l;
                        grepLines.push(lineOut);
                      }
                    }
                  });
                  if (grepOpts.count) {
                    grepLines.push(multipleFiles ? `${f}:${count}` : `${count}`);
                  }
                  if (grepOpts.listMatching && matchedAny) {
                    grepLines.push(f);
                  }
                  if (grepOpts.listNonMatching && !matchedAny) {
                    grepLines.push(f);
                  }
                }
              });
              output = grepLines.join('\n');
              styleClass = 'success-text';
            }
          }
          break;

        case 'sed':
          let sedRaw = rawArgs;
          let sedOpts = {
            quiet: false,
            inPlace: false,
            useRegex: false
          };

          let partsSed = sedRaw.match(/(".*?"|'.*?'|\S+)/g) || [];
          let cleanSedArgs = [];
          for (let p of partsSed) {
            if (p.startsWith('-')) {
              if (p.includes('n')) sedOpts.quiet = true;
              if (p.includes('i')) sedOpts.inPlace = true;
              if (p.includes('E') || p.includes('r')) sedOpts.useRegex = true;
            } else {
              cleanSedArgs.push(p.replace(/^['"]|['"]$/g, ''));
            }
          }

          if (cleanSedArgs.length < 2) {
            output = 'usage: sed [options] <script> <file>';
            styleClass = 'error';
            break;
          }

          let sedScript = cleanSedArgs[0].trim();
          let sedFile = cleanSedArgs[1].trim();
          const sedAbs = resolvePath(sedFile);
          let sedContent = state.virtualFilesContent[sedAbs];

          if (sedContent === undefined) {
            output = `sed: ${sedFile}: No such file or directory`;
            styleClass = 'error';
            break;
          }

          let sedLines = sedContent.split('\n');
          let sedResult = [];

          let subMatch = sedScript.match(/^s([\/|])(.*?)\1(.*?)\1(g?)$/);
          let printMatch = sedScript.match(/^(\d+)(?:,(\d+))?p$/);
          let deleteMatch = sedScript.match(/^(\d+)(?:,(\d+))?d$/);
          let patDeleteMatch = sedScript.match(/^\/(.*?)\/d$/);
          let insertMatch = sedScript.match(/^\/(.*?)\/i\s+(.*)$/);
          let appendMatch = sedScript.match(/^\/(.*?)\/a\s+(.*)$/);
          let patSubMatch = sedScript.match(/^\/(.*?)\/s([\/|])(.*?)\2(.*?)\2(g?)$/);

          if (subMatch) {
            let oldText = subMatch[2];
            let newText = subMatch[3];
            let isGlobal = subMatch[4] === 'g';

            if (oldText.includes('[[:space:]]+')) {
              oldText = '\\s+';
              sedOpts.useRegex = true;
            }

            sedLines.forEach(l => {
              let nl = l;
              if (sedOpts.useRegex || oldText.startsWith('^') || oldText.endsWith('$') || oldText === '\\s+') {
                let reFlag = isGlobal ? 'g' : '';
                let regex = new RegExp(oldText, reFlag);
                nl = l.replace(regex, newText);
              } else {
                if (isGlobal) {
                  nl = l.split(oldText).join(newText);
                } else {
                  nl = l.replace(oldText, newText);
                }
              }
              if (!sedOpts.quiet) {
                sedResult.push(nl);
              }
            });
          } else if (printMatch && sedOpts.quiet) {
            let start = parseInt(printMatch[1]) - 1;
            let end = printMatch[2] ? parseInt(printMatch[2]) - 1 : start;
            for (let idx = 0; idx < sedLines.length; idx++) {
              if (idx >= start && idx <= end) {
                sedResult.push(sedLines[idx]);
              }
            }
          } else if (deleteMatch) {
            let start = parseInt(deleteMatch[1]) - 1;
            let end = deleteMatch[2] ? parseInt(deleteMatch[2]) - 1 : start;
            for (let idx = 0; idx < sedLines.length; idx++) {
              if (idx < start || idx > end) {
                sedResult.push(sedLines[idx]);
              }
            }
          } else if (patDeleteMatch) {
            let pat = patDeleteMatch[1];
            sedLines.forEach(l => {
              if (!l.includes(pat)) {
                sedResult.push(l);
              }
            });
          } else if (insertMatch) {
            let pat = insertMatch[1];
            let textToInsert = insertMatch[2];
            sedLines.forEach(l => {
              if (l.includes(pat)) {
                sedResult.push(textToInsert);
              }
              sedResult.push(l);
            });
          } else if (appendMatch) {
            let pat = appendMatch[1];
            let textToAppend = appendMatch[2];
            sedLines.forEach(l => {
              sedResult.push(l);
              if (l.includes(pat)) {
                sedResult.push(textToAppend);
              }
            });
          } else if (patSubMatch) {
            let pat = patSubMatch[1];
            let oldText = patSubMatch[3];
            let newText = patSubMatch[4];
            let isGlobal = patSubMatch[5] === 'g';

            sedLines.forEach(l => {
              if (l.includes(pat)) {
                let nl = l;
                if (isGlobal) {
                  nl = l.split(oldText).join(newText);
                } else {
                  nl = l.replace(oldText, newText);
                }
                sedResult.push(nl);
              } else {
                sedResult.push(l);
              }
            });
          } else {
            sedResult = [...sedLines];
          }

          let finalOutput = sedResult.join('\n');
          if (sedOpts.inPlace) {
            state.virtualFilesContent[sedAbs] = finalOutput;
            output = '';
          } else {
            output = finalOutput;
          }
          styleClass = 'success-text';
          break;

        case 'awk':
          let awkRaw = rawArgs;
          let partsAwk = awkRaw.match(/(".*?"|'.*?'|\S+)/g) || [];
          let cleanAwkArgs = [];
          for (let p of partsAwk) {
            cleanAwkArgs.push(p.replace(/^['"]|['"]$/g, ''));
          }

          if (cleanAwkArgs.length < 2) {
            output = 'usage: awk \'[condition] {action}\' <file>';
            styleClass = 'error';
            break;
          }

          let awkScript = cleanAwkArgs[0].trim();
          let awkFile = cleanAwkArgs[1].trim();
          const awkAbs = resolvePath(awkFile);
          let awkContent = state.virtualFilesContent[awkAbs];

          if (awkContent === undefined) {
            output = `awk: ${awkFile}: No such file or directory`;
            styleClass = 'error';
            break;
          }

          let awkLines = awkContent.split('\n').filter(l => l.trim() !== '');
          let awkResult = [];

          let beginBlock = awkScript.match(/BEGIN\s*\{\s*print\s+"(.*?)"\s*\}/);
          let endBlock = awkScript.match(/END\s*\{\s*print\s+(.*?)\s*\}/);

          let mainAction = awkScript;
          if (beginBlock) mainAction = mainAction.replace(beginBlock[0], '');
          if (endBlock) mainAction = mainAction.replace(endBlock[0], '');
          mainAction = mainAction.trim();

          if (beginBlock) {
            awkResult.push(beginBlock[1]);
          }

          let sum = 0;
          let recordCount = 0;

          awkLines.forEach((line, lineIdx) => {
            recordCount++;
            let fields = line.split(/\s+/).filter(Boolean);

            let vars = {};
            fields.forEach((f, fIdx) => {
              vars[`$${fIdx + 1}`] = f;
            });
            vars['$0'] = line;
            vars['NF'] = fields.length;
            vars['$NF'] = fields[fields.length - 1];
            vars['$(NF-1)'] = fields[fields.length - 2] || '';
            vars['NR'] = recordCount;

            let uidVal = parseInt(fields[2]);
            if (!isNaN(uidVal)) {
              sum += uidVal;
            }

            let matchesCondition = true;
            let actionMatch = mainAction.match(/^(.*?)\s*\{\s*(.*?)\s*\}/);
            let condStr = '';
            let innerAction = '';

            if (actionMatch) {
              condStr = actionMatch[1].trim();
              innerAction = actionMatch[2].trim();
            } else {
              condStr = mainAction.trim();
            }

            if (condStr) {
              let jsCond = condStr;
              jsCond = jsCond.replace(/\$(\d+)/g, (m, num) => {
                let val = fields[parseInt(num) - 1] || '';
                return `"${val}"`;
              });
              jsCond = jsCond.replace(/NF/g, fields.length);

              try {
                matchesCondition = eval(jsCond);
              } catch (err) {
                matchesCondition = false;
              }
            }

            if (matchesCondition) {
              if (innerAction) {
                if (innerAction.startsWith('print ')) {
                  let printExpr = innerAction.substring(6).split(',').map(x => x.trim());
                  let outFields = [];
                  printExpr.forEach(expr => {
                    if (expr.startsWith('"') && expr.endsWith('"')) {
                      outFields.push(expr.replace(/"/g, ''));
                    } else if (vars[expr] !== undefined) {
                      outFields.push(vars[expr]);
                    } else {
                      outFields.push(expr);
                    }
                  });
                  awkResult.push(outFields.join(' '));
                } else if (innerAction.includes('sum+=')) {
                  // Summing handled globally
                } else if (innerAction.includes('$4="disabled"')) {
                  fields[3] = 'disabled';
                  awkResult.push(fields.join(' '));
                }
              } else if (condStr && !actionMatch) {
                awkResult.push(line);
              }
            }
          });

          if (endBlock) {
            let endExpr = endBlock[1].trim();
            if (endExpr === 'NR') {
              awkResult.push(recordCount);
            } else if (endExpr === 'sum') {
              awkResult.push(sum);
            }
          }

          output = awkResult.join('\n');
          styleClass = 'success-text';
          break;

        case 'find':
          let findTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          if (findTokens.length < 1) {
            output = 'usage: find <path> [options]';
            styleClass = 'error';
            break;
          }

          let findPath = findTokens[0];
          let findAbs = resolvePath(findPath);

          let findResults = [];
          const getFindTree = (dir) => {
            if (state.virtualFS[dir] === undefined && state.virtualFilesContent[dir] === undefined) return;
            findResults.push(dir);
            if (state.virtualFS[dir]) {
              state.virtualFS[dir].forEach(f => {
                const full = dir === '/' ? `/${f}` : `${dir}/${f}`;
                getFindTree(full);
              });
            }
          };

          getFindTree(findAbs);

          let findName = null;
          let findPerm = null;
          let findUser = null;
          let findGroup = null;
          let findSizeSign = null;
          let findSizeVal = null;
          let findExecCmd = null;

          for (let i = 1; i < findTokens.length; i++) {
            if (findTokens[i] === '-name') {
              findName = findTokens[i + 1];
              i++;
            } else if (findTokens[i] === '-perm') {
              findPerm = findTokens[i + 1];
              i++;
            } else if (findTokens[i] === '-user') {
              findUser = findTokens[i + 1];
              i++;
            } else if (findTokens[i] === '-group') {
              findGroup = findTokens[i + 1];
              i++;
            } else if (findTokens[i] === '-size') {
              let szStr = findTokens[i + 1];
              if (szStr.startsWith('+') || szStr.startsWith('-')) {
                findSizeSign = szStr[0];
                szStr = szStr.substring(1);
              }
              let unit = szStr.slice(-1).toLowerCase();
              let num = parseInt(szStr);
              if (unit === 'm') findSizeVal = num * 1024 * 1024;
              else if (unit === 'k') findSizeVal = num * 1024;
              else findSizeVal = num;
              i++;
            } else if (findTokens[i] === '-exec') {
              let execParts = [];
              let j = i + 1;
              while (j < findTokens.length && findTokens[j] !== '\\;' && findTokens[j] !== ';') {
                execParts.push(findTokens[j]);
                j++;
              }
              findExecCmd = execParts.join(' ');
              i = j;
            }
          }

          let matchedPaths = findResults.filter(p => {
            let meta = state.virtualFileMeta[p] || { owner: 'root', group: 'root', permissions: 'rwxr-xr-x' };

            if (findName) {
              let base = p.substring(p.lastIndexOf('/') + 1) || '/';
              if (findName.includes('*')) {
                let re = new RegExp('^' + findName.replace(/\*/g, '.*') + '$');
                if (!re.test(base)) return false;
              } else {
                if (base !== findName) return false;
              }
            }

            if (findPerm) {
              let perms = meta.permissions || 'rwxr-xr-x';
              const stringToBit = (str) => {
                let val = 0;
                if (str[0] === 'r') val += 4;
                if (str[1] === 'w') val += 2;
                if (str[2] === 'x') val += 1;
                return val;
              };
              let u = stringToBit(perms.substring(0, 3));
              let g = stringToBit(perms.substring(3, 6));
              let o = stringToBit(perms.substring(6, 9));
              let spec = 0;
              if (meta.special) {
                if (meta.special.suid) spec += 4;
                if (meta.special.sgid) spec += 2;
                if (meta.special.sticky) spec += 1;
              }
              let currentOct = (spec > 0 ? `${spec}` : '') + `${u}${g}${o}`;
              if (currentOct !== findPerm && `${u}${g}${o}` !== findPerm) return false;
            }

            if (findUser) {
              if (meta.owner !== findUser) return false;
            }

            if (findGroup) {
              if (meta.group !== findGroup) return false;
            }

            if (findSizeVal !== null) {
              let isDir = state.virtualFS[p] !== undefined;
              let size = isDir ? 4096 : (state.virtualFilesContent[p]?.length || 0);
              if (findSizeSign === '+') {
                if (size <= findSizeVal) return false;
              } else if (findSizeSign === '-') {
                if (size >= findSizeVal) return false;
              } else {
                if (size !== findSizeVal) return false;
              }
            }

            return true;
          });

          if (findExecCmd) {
            let logs = [];
            matchedPaths.forEach(p => {
              let runCmd = findExecCmd.replace(/{}/g, p);
              let cmdIdx = runCmd.indexOf(' ');
              let c = cmdIdx > -1 ? runCmd.substring(0, cmdIdx) : runCmd;
              let a = cmdIdx > -1 ? runCmd.substring(cmdIdx + 1) : '';

              if (c === 'cp') {
                let cpToks = a.split(' ').map(x => x.trim()).filter(Boolean);
                let dest = cpToks[cpToks.length - 1];
                let destAbs = resolvePath(dest);
                let srcBase = p.substring(p.lastIndexOf('/') + 1);
                let targetDest = state.virtualFS[destAbs] !== undefined ? (destAbs === '/' ? '/' + srcBase : destAbs + '/' + srcBase) : destAbs;

                state.virtualFilesContent[targetDest] = state.virtualFilesContent[p];
                let destParent = targetDest.substring(0, targetDest.lastIndexOf('/')) || '/';
                let destName = targetDest.substring(targetDest.lastIndexOf('/') + 1);
                if (state.virtualFS[destParent] && !state.virtualFS[destParent].includes(destName)) {
                  state.virtualFS[destParent].push(destName);
                }
                logs.push(`Copied '${p}' to '${targetDest}'`);
              } else if (c === 'rm') {
                delete state.virtualFilesContent[p];
                let parent = p.substring(0, p.lastIndexOf('/')) || '/';
                let base = p.substring(p.lastIndexOf('/') + 1);
                if (state.virtualFS[parent]) {
                  state.virtualFS[parent] = state.virtualFS[parent].filter(n => n !== base);
                }
                logs.push(`Removed file '${p}'`);
              }
            });
            output = logs.join('\n');
          } else {
            output = matchedPaths.join('\n');
          }
          styleClass = 'success-text';
          break;



        case 'wc':
          let wcTokens = rawArgs.split(' ').map(x => x.trim()).filter(Boolean);
          let showLines = false;
          let showWords = false;
          let showBytes = false;
          let wcFile = '';
          wcTokens.forEach(t => {
            if (t.startsWith('-')) {
              if (t.includes('l')) showLines = true;
              if (t.includes('w')) showWords = true;
              if (t.includes('c')) showBytes = true;
            } else {
              wcFile = t;
            }
          });
          if (!showLines && !showWords && !showBytes) {
            showLines = true;
            showWords = true;
            showBytes = true;
          }
          if (!wcFile) {
            output = 'usage: wc [-l | -w | -c] <file>';
            styleClass = 'error';
          } else {
            let abs = resolvePath(wcFile);
            let content = state.virtualFilesContent[abs];
            if (content === undefined) {
              output = `wc: ${wcFile}: No such file or directory`;
              styleClass = 'error';
            } else {
              let lCount = content.split('\n').length;
              let wCount = content.split(/\s+/).filter(Boolean).length;
              let bCount = content.length;
              let res = [];
              if (showLines) res.push(lCount);
              if (showWords) res.push(wCount);
              if (showBytes) res.push(bCount);
              res.push(wcFile);
              output = res.join(' ');
              styleClass = 'success-text';
            }
          }
          break;



        case 'cert':
          output = `
*************************************************
*       RHCSA - RED HAT ENTERPRISE LINUX        *
*             STATUS: CERTIFIED PATH            *
*                                               *
*       Knowledge: Verified [OK]                *
*       Commands: Tested    [OK]                *
*       Status: READY FOR ENTERPRISE DEPLOY     *
*************************************************`;
          styleClass = 'success-text';
          break;

        case 'bash':
        case 'sh':
          {
            if (!rawArgs.trim()) {
              output = `GNU bash, version 5.2.15(1)-release (x86_64-redhat-linux-gnu)`;
              styleClass = 'success-text';
            } else {
              let res = executeScriptContent(rawArgs.trim(), true);
              output = res.output;
              styleClass = res.isError ? 'error' : 'success-text';
            }
          }
          break;

                case 'df':
          {
            let isHuman = rawArgs.includes('-h');
            if (isHuman) {
              output = `Filesystem              Size  Used Avail Use% Mounted on
/dev/mapper/rhel-root    20G  4.0G   16G  20% /
devtmpfs                4.0M     0  4.0M   0% /dev
tmpfs                    990M     0  990M   0% /dev/shm
/dev/sda1               1.0G  280M  720M  28% /boot
/dev/mapper/rhel-home    10G   45M   10G   1% /home`;
            } else {
              output = `Filesystem              1K-blocks    Used Available Use% Mounted on
/dev/mapper/rhel-root    20961280 4124920  16836360  20% /
devtmpfs                     4096       0      4096   0% /dev
tmpfs                     1013760       0   1013760   0% /dev/shm
/dev/sda1                 1038336  284920    753416  28% /boot
/dev/mapper/rhel-home    10475520   45120  10430400   1% /home`;
            }
            styleClass = 'success-text';
          }
          break;

        case 'rmdir':
          if (!rawArgs) {
            output = 'rmdir: missing operand';
            styleClass = 'error';
          } else {
            let rmdirAbs = resolvePath(rawArgs.trim());
            if (state.virtualFS[rmdirAbs] !== undefined) {
              if (state.virtualFS[rmdirAbs].length > 0) {
                output = `rmdir: failed to remove '${rawArgs}': Directory not empty`;
                styleClass = 'error';
              } else {
                let lastSlash = rmdirAbs.lastIndexOf('/');
                let parentDir = rmdirAbs.substring(0, lastSlash) || '/';
                let folderName = rmdirAbs.substring(lastSlash + 1);
                delete state.virtualFS[rmdirAbs];
                if (state.virtualFS[parentDir]) {
                  state.virtualFS[parentDir] = state.virtualFS[parentDir].filter(f => f !== folderName);
                }
                output = '';
                styleClass = 'success-text';
              }
            } else {
              output = `rmdir: failed to remove '${rawArgs}': No such file or directory`;
              styleClass = 'error';
            }
          }
          break;

        case 'id':
          {
            let idUser = rawArgs.trim() || state.currentUser;
            let uRec = state.virtualUsers[idUser];
            if (!uRec) {
              output = `id: '${idUser}': no such user`;
              styleClass = 'error';
            } else {
              let grpName = idUser;
              Object.keys(state.virtualGroups).forEach(g => {
                if (state.virtualGroups[g].gid === uRec.gid) grpName = g;
              });
              let userGrps = [];
              Object.keys(state.virtualGroups).forEach(g => {
                if (state.virtualGroups[g].users && state.virtualGroups[g].users.includes(idUser)) {
                  userGrps.push(`${state.virtualGroups[g].gid}(${g})`);
                }
              });
              if (userGrps.length === 0) userGrps.push(`${uRec.gid}(${grpName})`);
              output = `uid=${uRec.uid}(${idUser}) gid=${uRec.gid}(${grpName}) groups=${userGrps.join(',')}`;
              styleClass = 'success-text';
            }
          }
          break;

        case 'who':
        case 'w':
          output = `${state.currentUser}  pts/0        ${new Date().toISOString().slice(0, 10)} 10:14 (192.168.1.50)`;
          styleClass = 'success-text';
          break;

        case 'uptime':
          output = ` 22:30:00 up 2 days,  3:14,  1 user,  load average: 0.05, 0.03, 0.01`;
          styleClass = 'success-text';
          break;

        case 'ping':
          {
            let host = rawArgs.replace(/-c\s+\d+/, '').trim() || 'localhost';
            output = `PING ${host} (192.168.1.1) 56(84) bytes of data.
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.42 ms
64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.38 ms
--- ${host} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 0.380/0.400/0.420/0.020 ms`;
            styleClass = 'success-text';
          }
          break;

        case 'chronyc':
        case 'chronyd':
          {
            if (rawArgs.includes('sources')) {
              output = `MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^+ 203.0.113.10                  2   6   377    12   -120us[ -120us] +/-   15ms
^* 198.51.100.1                  1   6   377    14     +5us[   +5us] +/-  500us`;
            } else if (rawArgs.includes('tracking')) {
              output = `Reference ID    : 198.51.100.1 (ntp1.example.com)
Stratum         : 2
Ref time (UTC)  : Fri Jul 24 16:45:00 2026
System time     : 0.000005210 seconds slow of NTP time
Last offset     : +0.000001200 seconds
RMS offset      : 0.000015000 seconds
Frequency       : 2.150 ppm slow
Residual freq   : +0.001 ppm
Skew            : 0.015 ppm
Root delay      : 0.000500000 seconds
Root dispersion : 0.000100000 seconds
Update interval : 64.2 seconds
Leap status     : Normal`;
            } else {
              output = `chronyc (chrony) version 4.5`;
            }
            styleClass = 'success-text';
          }
          break;

        case 'kill':
        case 'pkill':
          if (!rawArgs) {
            output = `${cmd}: usage: ${cmd} [pid|process_name]`;
            styleClass = 'error';
          } else {
            output = `[Process ${rawArgs.trim()} terminated]`;
            styleClass = 'success-text';
          }
          break;

        case 'dd':
          output = `1024+0 records in
1024+0 records out
1048576 bytes (1.0 MB, 1.0 MiB) copied, 0.003412 s, 307 MB/s`;
          styleClass = 'success-text';
          break;

        case 'clear':
          elements.terminalHistory.innerHTML = '';
          return;

        default:
          let procFallback = processCommand(commandToRun);
          if (procFallback) {
            output = procFallback;
            styleClass = 'success-text';
          } else if (cmd.startsWith('./') || cmd.endsWith('.sh')) {
            let res = executeScriptContent(cmd, false);
            output = res.output;
            styleClass = res.isError ? 'error' : 'success-text';
          } else {
            output = `bash: ${cmd}: command not found. Type "help" for a list of valid commands.`;
            styleClass = 'error';
          }
      }

      if (runAsRoot) {
        state.currentUser = originalUser;
      }

      // Apply Pipe Filtering
      if (pipeTarget === 'grep') {
        let lines = output.split('\n');
        let patternStr = pipeArg.replace(/['"]/g, '').trim();
        output = lines.filter(l => l.toLowerCase().includes(patternStr.toLowerCase())).join('\n');
      } else if (pipeTarget === 'more' || pipeTarget === 'less') {
        output = `\n--- More (Page 1 of 1) ---\n` + output;
      }

      // Apply Redirection Writing
      if (redirectFile) {
        let rAbs = resolvePath(redirectFile);
        const lastSlash = rAbs.lastIndexOf('/');
        const parentDir = rAbs.substring(0, lastSlash) || '/';
        const fileName = rAbs.substring(lastSlash + 1);

        if (state.virtualFS[parentDir]) {
          if (redirectType === 'write') {
            state.virtualFilesContent[rAbs] = output;
          } else {
            const oldContent = state.virtualFilesContent[rAbs] || '';
            state.virtualFilesContent[rAbs] = oldContent + (oldContent ? '\n' : '') + output;
          }
          if (!state.virtualFS[parentDir].includes(fileName)) {
            state.virtualFS[parentDir].push(fileName);
          }
          output = ''; // Hide output on redirection
        } else {
          output = `bash: ${redirectFile}: No such file or directory`;
          styleClass = 'error';
        }
      }

      if (output !== '') {
        appendTerminalOutput(output, styleClass);
      }
      elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
    }
  }

  function appendTerminalOutput(text, styleClass) {
    const div = document.createElement('div');
    div.className = `terminal-output ${styleClass || ''}`;
    div.textContent = text;
    elements.terminalHistory.appendChild(div);
  }

  // --- INTERACTIVE SELINUX & FIREWALL VISUALIZER ---
  function setupSecurityVisualizer() {
    const sePathSelect = document.getElementById('selinux-target-path');
    const seEnforcingBtn = document.getElementById('btn-se-enforcing');
    const sePermissiveBtn = document.getElementById('btn-se-permissive');
    const seOutputLabel = document.getElementById('selinux-output-label');
    const seBreakdown = document.getElementById('selinux-label-breakdown');

    const fwZoneSelect = document.getElementById('fw-zone');
    const fwServiceSelect = document.getElementById('fw-service');
    const fwPermanentCb = document.getElementById('fw-permanent');
    const fwGenerateBtn = document.getElementById('fw-generate-btn');
    const fwCmdDisplay = document.getElementById('fw-cmd-display');
    const fwLogDisplay = document.getElementById('fw-log-display');

    if (!sePathSelect || !seEnforcingBtn || !sePermissiveBtn || !seOutputLabel || !seBreakdown || !fwZoneSelect || !fwServiceSelect || !fwPermanentCb || !fwGenerateBtn || !fwCmdDisplay || !fwLogDisplay) return;

    // SELinux contexts mapping
    const seContexts = {
      home: {
        label: 'unconfined_u:object_r:user_home_t:s0',
        user: '<strong>unconfined_u</strong> (Unconfined User context - standard logged-in user)',
        role: '<strong>object_r</strong> (Object Role - standard file resource role)',
        type: '<strong>user_home_t</strong> (User Home Type - default type for files in home directories)',
        level: '<strong>s0</strong> (Sensitivity level 0 - lowest sensitivity/multi-category security)'
      },
      etc: {
        label: 'system_u:object_r:shadow_t:s0',
        user: '<strong>system_u</strong> (System User context - administrative/system files)',
        role: '<strong>object_r</strong> (Object Role - standard file resource role)',
        type: '<strong>shadow_t</strong> (Shadow Type - sensitive encryption keys/password databases)',
        level: '<strong>s0</strong> (Sensitivity level 0)'
      },
      html: {
        label: 'system_u:object_r:httpd_sys_content_t:s0',
        user: '<strong>system_u</strong> (System User context - system created content)',
        role: '<strong>object_r</strong> (Object Role - standard file resource role)',
        type: '<strong>httpd_sys_content_t</strong> (HTTPD Content Type - files readable by Apache web servers)',
        level: '<strong>s0</strong> (Sensitivity level 0)'
      },
      tmp: {
        label: 'system_u:object_r:tmp_t:s0',
        user: '<strong>system_u</strong> (System User context - shared system space)',
        role: '<strong>object_r</strong> (Object Role - standard file resource role)',
        type: '<strong>tmp_t</strong> (Temporary File Type - system wide temporary directory contents)',
        level: '<strong>s0</strong> (Sensitivity level 0)'
      }
    };

    // Update SELinux Visualizer View
    window.syncSelinuxWidgetView = function () {
      // Toggle active classes on buttons
      if (state.selinuxMode === 'Enforcing') {
        seEnforcingBtn.classList.add('active');
        seEnforcingBtn.classList.remove('secondary');
        sePermissiveBtn.classList.remove('active');
        sePermissiveBtn.classList.add('secondary');
      } else {
        sePermissiveBtn.classList.add('active');
        sePermissiveBtn.classList.remove('secondary');
        seEnforcingBtn.classList.remove('active');
        seEnforcingBtn.classList.add('secondary');
      }

      const key = sePathSelect.value;
      const data = seContexts[key];
      if (data) {
        seOutputLabel.innerHTML = `${data.label} <span style="font-size:0.75rem; padding: 2px 6px; border-radius:4px; margin-left:8px; font-family:var(--font-sans); background-color:${state.selinuxMode === 'Enforcing' ? '#2ea44f' : '#d29922'}; color:#fff">${state.selinuxMode}</span>`;
        seBreakdown.innerHTML = `
          <ul style="list-style-type:none; padding-left:0; margin-top:10px; display:flex; flex-direction:column; gap:6px;">
            <li><strong>User:</strong> ${data.user}</li>
            <li><strong>Role:</strong> ${data.role}</li>
            <li><strong>Type:</strong> ${data.type}</li>
            <li><strong>Level:</strong> ${data.level}</li>
          </ul>
        `;
      }
    };

    seEnforcingBtn.addEventListener('click', () => {
      state.selinuxMode = 'Enforcing';
      window.syncSelinuxWidgetView();
    });

    sePermissiveBtn.addEventListener('click', () => {
      state.selinuxMode = 'Permissive';
      window.syncSelinuxWidgetView();
    });

    sePathSelect.addEventListener('change', window.syncSelinuxWidgetView);

    // Update Firewall Visualizer View
    window.syncFirewallWidgetView = function () {
      const zone = fwZoneSelect.value;
      const service = fwServiceSelect.value;
      const perm = fwPermanentCb.checked ? ' --permanent' : '';

      fwCmdDisplay.textContent = `sudo firewall-cmd --zone=${zone} --add-service=${service}${perm}\nsudo firewall-cmd --reload`;
    };

    fwZoneSelect.addEventListener('change', window.syncFirewallWidgetView);
    fwServiceSelect.addEventListener('change', window.syncFirewallWidgetView);
    fwPermanentCb.addEventListener('change', window.syncFirewallWidgetView);

    fwGenerateBtn.addEventListener('click', () => {
      const zone = fwZoneSelect.value;
      const service = fwServiceSelect.value;
      const perm = fwPermanentCb.checked ? ' --permanent' : '';

      // Apply service changes to terminal state
      if (!state.firewallServices.includes(service)) {
        state.firewallServices.push(service);
      }

      fwLogDisplay.innerHTML = `[student@rhel10 ~]$ sudo firewall-cmd --zone=${zone} --add-service=${service}${perm}
<span style="color:#2ea44f;">success</span>
[student@rhel10 ~]$ sudo firewall-cmd --reload
<span style="color:#2ea44f;">success</span>
[student@rhel10 ~]$ firewall-cmd --list-all
public (active)
  target: default
  services: <span style="color:#58a6ff;">${state.firewallServices.join(' ')}</span>
  interfaces: eth0
  ... (Rules applied and active!)`;
    });

    // Run initial rendering
    window.syncSelinuxWidgetView();
    window.syncFirewallWidgetView();
  }

  // --- INTERACTIVE REGEX VISUALIZER ---
  function setupRegexVisualizer() {
    const regexToolSelect = document.getElementById('regex-tool');
    const regexFileSelect = document.getElementById('regex-file');
    const regexOptsInput = document.getElementById('regex-opts');
    const regexPatternInput = document.getElementById('regex-pattern');
    const regexRunBtn = document.getElementById('regex-run-btn');
    const regexOutputDisplay = document.getElementById('regex-output-display');

    if (!regexToolSelect || !regexFileSelect || !regexOptsInput || !regexPatternInput || !regexRunBtn || !regexOutputDisplay) return;

    regexRunBtn.addEventListener('click', () => {
      const tool = regexToolSelect.value;
      const file = regexFileSelect.value;
      const opts = (regexOptsInput.value || '').trim();
      const pattern = (regexPatternInput.value || '').trim();

      // Formulate command string
      let cmdStr = `${tool} `;
      if (opts) cmdStr += `${opts} `;
      if (pattern) {
        if (pattern.includes(' ') || pattern.includes('/') || pattern.includes('"') || pattern.includes('=')) {
          cmdStr += `'${pattern}' `;
        } else {
          cmdStr += `${pattern} `;
        }
      }
      cmdStr += file;

      // Resolve file path
      const absPath = resolvePath(file);
      const content = state.virtualFilesContent[absPath];

      if (content === undefined) {
        regexOutputDisplay.textContent = `[student@rhel10 ~]$ ${cmdStr}\n${tool}: ${file}: No such file or directory`;
        regexOutputDisplay.style.color = '#ff6b6b';
        return;
      }

      let resultText = '';
      let isError = false;

      // Executing utility logic matching script.js sandbox
      if (tool === 'grep') {
        let grepOpts = {
          caseInsensitive: opts.includes('i'),
          invert: opts.includes('v'),
          lineNumbers: opts.includes('n'),
          count: opts.includes('c'),
          listMatching: opts.includes('l'),
          listNonMatching: opts.includes('L')
        };

        const matchLine = (line, pat) => {
          let text = line;
          let query = pat;
          if (grepOpts.caseInsensitive) {
            text = text.toLowerCase();
            query = query.toLowerCase();
          }
          let isMatch = false;
          if (query.startsWith('^')) {
            isMatch = text.startsWith(query.substring(1));
          } else if (query.endsWith('$')) {
            isMatch = text.endsWith(query.substring(0, query.length - 1));
          } else {
            isMatch = text.includes(query);
          }
          return grepOpts.invert ? !isMatch : isMatch;
        };

        let lines = content.split('\n');
        let grepLines = [];
        let count = 0;
        let matchedAny = false;

        lines.forEach((l, idx) => {
          if (matchLine(l, pattern)) {
            matchedAny = true;
            count++;
            if (!grepOpts.count && !grepOpts.listMatching && !grepOpts.listNonMatching) {
              let lineOut = '';
              if (grepOpts.lineNumbers) lineOut += `${idx + 1}:`;
              lineOut += l;
              grepLines.push(lineOut);
            }
          }
        });

        if (grepOpts.count) {
          grepLines.push(`${count}`);
        }
        if (grepOpts.listMatching && matchedAny) {
          grepLines.push(file);
        }
        if (grepOpts.listNonMatching && !matchedAny) {
          grepLines.push(file);
        }

        resultText = grepLines.join('\n');
      } else if (tool === 'sed') {
        let sedOpts = {
          quiet: opts.includes('n'),
          useRegex: opts.includes('E') || opts.includes('r')
        };

        let sedLines = content.split('\n');
        let sedResult = [];

        let subMatch = pattern.match(/^s([\/|])(.*?)\1(.*?)\1(g?)$/);
        let printMatch = pattern.match(/^(\d+)(?:,(\d+))?p$/);
        let deleteMatch = pattern.match(/^(\d+)(?:,(\d+))?d$/);
        let patDeleteMatch = pattern.match(/^\/(.*?)\/d$/);
        let insertMatch = pattern.match(/^\/(.*?)\/i\s+(.*)$/);
        let appendMatch = pattern.match(/^\/(.*?)\/a\s+(.*)$/);
        let patSubMatch = pattern.match(/^\/(.*?)\/s([\/|])(.*?)\2(.*?)\2(g?)$/);

        if (subMatch) {
          let oldText = subMatch[2];
          let newText = subMatch[3];
          let isGlobal = subMatch[4] === 'g';

          if (oldText.includes('[[:space:]]+')) {
            oldText = '\\s+';
            sedOpts.useRegex = true;
          }

          sedLines.forEach(l => {
            let nl = l;
            if (sedOpts.useRegex || oldText.startsWith('^') || oldText.endsWith('$') || oldText === '\\s+') {
              let reFlag = isGlobal ? 'g' : '';
              let regex = new RegExp(oldText, reFlag);
              nl = l.replace(regex, newText);
            } else {
              if (isGlobal) {
                nl = l.split(oldText).join(newText);
              } else {
                nl = l.replace(oldText, newText);
              }
            }
            if (!sedOpts.quiet) {
              sedResult.push(nl);
            }
          });
        } else if (printMatch && sedOpts.quiet) {
          let start = parseInt(printMatch[1]) - 1;
          let end = printMatch[2] ? parseInt(printMatch[2]) - 1 : start;
          for (let idx = 0; idx < sedLines.length; idx++) {
            if (idx >= start && idx <= end) {
              sedResult.push(sedLines[idx]);
            }
          }
        } else if (deleteMatch) {
          let start = parseInt(deleteMatch[1]) - 1;
          let end = deleteMatch[2] ? parseInt(deleteMatch[2]) - 1 : start;
          for (let idx = 0; idx < sedLines.length; idx++) {
            if (idx < start || idx > end) {
              sedResult.push(sedLines[idx]);
            }
          }
        } else if (patDeleteMatch) {
          let pat = patDeleteMatch[1];
          sedLines.forEach(l => {
            if (!l.includes(pat)) {
              sedResult.push(l);
            }
          });
        } else if (insertMatch) {
          let pat = insertMatch[1];
          let textToInsert = insertMatch[2];
          sedLines.forEach(l => {
            if (l.includes(pat)) {
              sedResult.push(textToInsert);
            }
            sedResult.push(l);
          });
        } else if (appendMatch) {
          let pat = appendMatch[1];
          let textToAppend = appendMatch[2];
          sedLines.forEach(l => {
            sedResult.push(l);
            if (l.includes(pat)) {
              sedResult.push(textToAppend);
            }
          });
        } else if (patSubMatch) {
          let pat = patSubMatch[1];
          let oldText = patSubMatch[3];
          let newText = patSubMatch[4];
          let isGlobal = patSubMatch[5] === 'g';

          sedLines.forEach(l => {
            if (l.includes(pat)) {
              let nl = l;
              if (isGlobal) {
                nl = l.split(oldText).join(newText);
              } else {
                nl = l.replace(oldText, newText);
              }
              sedResult.push(nl);
            } else {
              sedResult.push(l);
            }
          });
        } else {
          sedResult = [...sedLines];
        }
        resultText = sedResult.join('\n');
      } else if (tool === 'awk') {
        let awkLines = content.split('\n').filter(l => l.trim() !== '');
        let awkResult = [];

        let beginBlock = pattern.match(/BEGIN\s*\{\s*print\s+"(.*?)"\s*\}/);
        let endBlock = pattern.match(/END\s*\{\s*print\s+(.*?)\s*\}/);

        let mainAction = pattern;
        if (beginBlock) mainAction = mainAction.replace(beginBlock[0], '');
        if (endBlock) mainAction = mainAction.replace(endBlock[0], '');
        mainAction = mainAction.trim();

        if (beginBlock) {
          awkResult.push(beginBlock[1]);
        }

        let sum = 0;
        let recordCount = 0;

        awkLines.forEach((line, lineIdx) => {
          recordCount++;
          let fields = line.split(/\s+/).filter(Boolean);

          let vars = {};
          fields.forEach((f, fIdx) => {
            vars[`$${fIdx + 1}`] = f;
          });
          vars['$0'] = line;
          vars['NF'] = fields.length;
          vars['$NF'] = fields[fields.length - 1];
          vars['$(NF-1)'] = fields[fields.length - 2] || '';
          vars['NR'] = recordCount;

          let uidVal = parseInt(fields[2]);
          if (!isNaN(uidVal)) {
            sum += uidVal;
          }

          let matchesCondition = true;
          let actionMatch = mainAction.match(/^(.*?)\s*\{\s*(.*?)\s*\}/);
          let condStr = '';
          let innerAction = '';

          if (actionMatch) {
            condStr = actionMatch[1].trim();
            innerAction = actionMatch[2].trim();
          } else {
            condStr = mainAction.trim();
          }

          if (condStr) {
            let jsCond = condStr;
            jsCond = jsCond.replace(/\$(\d+)/g, (m, num) => {
              let val = fields[parseInt(num) - 1] || '';
              return `"${val}"`;
            });
            jsCond = jsCond.replace(/NF/g, fields.length);

            try {
              matchesCondition = eval(jsCond);
            } catch (err) {
              matchesCondition = false;
            }
          }

          if (matchesCondition) {
            if (innerAction) {
              if (innerAction.startsWith('print ')) {
                let printExpr = innerAction.substring(6).split(',').map(x => x.trim());
                let outFields = [];
                printExpr.forEach(expr => {
                  if (expr.startsWith('"') && expr.endsWith('"')) {
                    outFields.push(expr.replace(/"/g, ''));
                  } else if (vars[expr] !== undefined) {
                    outFields.push(vars[expr]);
                  } else {
                    outFields.push(expr);
                  }
                });
                awkResult.push(outFields.join(' '));
              } else if (innerAction.includes('sum+=')) {
                // summing handled
              } else if (innerAction.includes('$4="disabled"')) {
                fields[3] = 'disabled';
                awkResult.push(fields.join(' '));
              }
            } else if (condStr && !actionMatch) {
              awkResult.push(line);
            }
          }
        });

        if (endBlock) {
          let endExpr = endBlock[1].trim();
          if (endExpr === 'NR') {
            awkResult.push(recordCount);
          } else if (endExpr === 'sum') {
            awkResult.push(sum);
          }
        }
        resultText = awkResult.join('\n');
      }

      regexOutputDisplay.textContent = `[student@rhel10 ~]$ ${cmdStr}\n${resultText || '(No output)'}`;
      regexOutputDisplay.style.color = isError ? '#ff6b6b' : '#39ff14';
    });
  }

  function executeScriptContent(scriptFile, bypassPermCheck = false) {
    let scriptAbs = resolvePath(scriptFile);
    let code = state.virtualFilesContent[scriptAbs];
    if (code === undefined) {
      return { output: `bash: ${scriptFile}: No such file or directory`, isError: true };
    }

    let meta = state.virtualFileMeta[scriptAbs] || { permissions: 'rw-r--r--' };
    if (!bypassPermCheck && !meta.permissions.includes('x')) {
      return { output: `bash: ${scriptFile}: Permission denied`, isError: true };
    }

    let lines = code.split('\n');
    let logs = [];

    lines.forEach(rawLine => {
      let line = rawLine.trim();
      if (!line || (line.startsWith('#') && !line.startsWith('#!'))) return;

      if (line.includes('>>')) {
        let parts = line.split('>>');
        let textCmd = parts[0].trim();
        let targetFile = parts[1].trim();
        let targetAbs = resolvePath(targetFile);

        let val = '';
        if (textCmd.startsWith('echo')) {
          val = textCmd.replace(/^echo\s+["']?/, '').replace(/["']?$/, '');
        } else if (textCmd === 'hostname') {
          val = 'rhel10.localdomain';
        } else if (textCmd === 'uname -r') {
          val = '6.1.0-rhel10.x86_64';
        } else if (textCmd.startsWith('tail')) {
          let passwdContent = state.virtualFilesContent['/etc/passwd'] || '';
          let pLines = passwdContent.split('\n');
          val = pLines.slice(-5).join('\n');
        } else if (textCmd === 'date') {
          val = state.customTime || new Date().toString();
        }

        let existing = state.virtualFilesContent[targetAbs] || '';
        state.virtualFilesContent[targetAbs] = existing ? (existing + '\n' + val) : val;

        let pDir = targetAbs.substring(0, targetAbs.lastIndexOf('/')) || '/';
        let fName = targetAbs.substring(targetAbs.lastIndexOf('/') + 1);
        if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
          state.virtualFS[pDir].push(fName);
        }
      } else if (line.startsWith('echo')) {
        let msg = line.replace(/^echo\s+["']?/, '').replace(/["']?$/, '');
        logs.push(msg);
      } else if (line === 'hostname') {
        logs.push('rhel10.localdomain');
      } else if (line === 'uname -r') {
        logs.push('6.1.0-rhel10.x86_64');
      } else if (line === 'date') {
        logs.push(state.customTime || new Date().toString());
      } else if (line.startsWith('mkdir')) {
        let parts = line.split(' ');
        let dir = parts[parts.length - 1];
        let dAbs = resolvePath(dir);
        let pDir = dAbs.substring(0, dAbs.lastIndexOf('/')) || '/';
        let fName = dAbs.substring(dAbs.lastIndexOf('/') + 1);
        if (!state.virtualFS[dAbs]) state.virtualFS[dAbs] = [];
        if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
          state.virtualFS[pDir].push(fName);
        }
      } else if (line.startsWith('tar -czf') || line.startsWith('tar -xzf')) {
        logs.push('Archive operation completed successfully.');
      }
    });

    return { output: logs.join('\n') || 'Script executed successfully.', isError: false };
  }

  function processCommand(cmdStr) {
    const parts = cmdStr.split(' ').map(x => x.trim()).filter(Boolean);
    if (parts.length === 0) return '';
    const cmd = parts[0].toLowerCase();
    const rawArgs = parts.slice(1).join(' ').trim();

    if (cmd === 'lsblk') {
      let lines = ['NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINTS'];
      let devKeys = Object.keys(state.blockDevices);

      devKeys.forEach((dKey, dIdx) => {
        let disk = state.blockDevices[dKey];
        let majMin = dKey.includes('sda') ? '8:0' : (dKey.includes('sdb') ? '8:16' : '252:0');
        lines.push(`${disk.name.padEnd(6)} ${majMin.padEnd(7)} 0 ${disk.size.padEnd(4)} 0 disk ${disk.mount || ''}`);

        let partKeys = Object.keys(disk.parts || {});
        partKeys.forEach((pKey, pIdx) => {
          let part = disk.parts[pKey];
          let prefix = (pIdx === partKeys.length - 1) ? '└─' : '├─';
          let pMajMin = dKey.includes('sda') ? `8:${pIdx + 1}` : `8:${17 + pIdx}`;
          let mPoint = part.mount ? part.mount : '';
          lines.push(`${prefix}${part.name.padEnd(4)} ${pMajMin.padEnd(7)} 0 ${part.size.padEnd(4)} 0 part ${mPoint}`);
        });
      });

      return lines.join('\n');
    } else if (cmd === 'blkid') {
      let devFilter = rawArgs.trim();
      let lines = [];

      Object.keys(state.blockDevices).forEach(dKey => {
        Object.keys(state.blockDevices[dKey].parts || {}).forEach(pKey => {
          let part = state.blockDevices[dKey].parts[pKey];
          if (!devFilter || devFilter === pKey) {
            lines.push(`${pKey}: UUID="${part.uuid || 'b3039e27-5c11-49d7-b2e5-e34fe23'}" BLOCK_SIZE="512" TYPE="${part.fs || 'xfs'}" PARTUUID="000${dKey.slice(-1)}-01"`);
          }
        });
      });

      return lines.join('\n') || (devFilter ? `blkid: ${devFilter}: No such device` : '');
    } else if (cmd === 'ssh-keygen') {
      const pubKeyPath = '/home/student/.ssh/id_rsa.pub';
      const privKeyPath = '/home/student/.ssh/id_rsa';
      state.virtualFilesContent[privKeyPath] = '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAABG5vbmUAAAA...\n-----END OPENSSH PRIVATE KEY-----';
      state.virtualFilesContent[pubKeyPath] = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3k9... student@rhel10';
      if (!state.virtualFS['/home/student/.ssh']) {
        state.virtualFS['/home/student/.ssh'] = ['id_rsa', 'id_rsa.pub', 'known_hosts'];
        if (state.virtualFS['/home/student'] && !state.virtualFS['/home/student'].includes('.ssh')) {
          state.virtualFS['/home/student'].push('.ssh');
        }
      }
      return [
        `[student@rhel10 ~]$ ssh-keygen`,
        `Generating public/private rsa key pair.`,
        `Enter file in which to save the key (/home/student/.ssh/id_rsa): `,
        `Created directory '/home/student/.ssh'.`,
        `Enter passphrase (empty for no passphrase): `,
        `Enter same passphrase again: `,
        `Your identification has been saved in /home/student/.ssh/id_rsa`,
        `Your public key has been saved in /home/student/.ssh/id_rsa.pub`,
        `The key fingerprint is:`,
        `SHA256:x8KqZ9M4p2v1+L5J0N3Q7R6T9S8U1V2W3X4Y5Z6A7B8 student@rhel10`,
        `The key's randomart image is:`,
        `+---[RSA 4096]----+`,
        `|      .+=+       |`,
        `|     o =o=       |`,
        `|    . + ==o      |`,
        `|     . *=. o     |`,
        `|      +.S E      |`,
        `|     . + +       |`,
        `|      o o o      |`,
        `|       . + .     |`,
        `|        . o..    |`,
        `+----[SHA256]-----+`
      ].join('\n');
    } else if (cmd === 'ssh-copy-id') {
      const target = rawArgs || 'root@192.168.1.3';
      const user = target.includes('@') ? target.split('@')[0] : 'root';
      const host = target.includes('@') ? target.split('@')[1] : target;
      const targetAuthFile = user === 'root' ? '/root/.ssh/authorized_keys' : `/home/${user}/.ssh/authorized_keys`;

      const pubKey = state.virtualFilesContent['/home/student/.ssh/id_rsa.pub'] || 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3k9... student@rhel10';
      const curAuth = state.virtualFilesContent[targetAuthFile] || '';
      if (!curAuth.includes(pubKey)) {
        state.virtualFilesContent[targetAuthFile] = curAuth ? (curAuth + '\n' + pubKey) : pubKey;
      }

      return [
        `[student@rhel10 ~]$ ssh-copy-id ${target}`,
        `/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/student/.ssh/id_rsa.pub"`,
        `/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed`,
        `/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now, it is to install the new keys`,
        `${user}@${host}'s password: `,
        ``,
        `Number of key(s) added: 1`,
        ``,
        `Now try logging into the machine, with:   "ssh '${target}'"`,
        `and check to make sure that only the key(s) you wanted were added.`
      ].join('\n');
    } else if (cmd === 'systemctl') {
      const sub = parts[1] || 'status';
      const svc = parts[2] || 'sshd';
      if (sub === 'status') {
        return [
          `● ${svc}.service - OpenSSH server daemon`,
          `     Loaded: loaded (/usr/lib/systemd/system/${svc}.service; enabled; vendor preset: disabled)`,
          `     Active: active (running) since Mon 2026-04-12 10:15:22 IST; 4h 10min ago`,
          `       Docs: man:sshd(8)`,
          `             man:sshd_config(5)`,
          `   Main PID: 1245 (sshd)`,
          `      Tasks: 1 (limit: 1112)`,
          `     Memory: 6.4M`,
          `        CPU: 120ms`,
          `     CGroup: /system.slice/${svc}.service`,
          `             └─1245 /usr/sbin/sshd -D`
        ].join('\n');
      }
      return `[systemctl ${sub} ${svc} executed successfully]`;
    } else if (cmd === 'nmcli') {
      if (rawArgs.includes('dev status')) {
        return [
          `DEVICE  TYPE      STATE      CONNECTION`,
          `enp0s3  ethernet  connected  delhi`,
          `enp0s8  ethernet  disconnected --`,
          `lo      loopback  unmanaged  --`
        ].join('\n');
      } else if (rawArgs.includes('conn show')) {
        return [
          `NAME   UUID                                  TYPE      DEVICE`,
          `delhi  a1b2c3d4-e5f6-7890-abcd-1234567890ef  ethernet  enp0s3`
        ].join('\n');
      }
      return `[nmcli ${rawArgs} executed successfully]`;
    } else if (cmd === 'hostnamectl') {
      if (rawArgs.startsWith('set-hostname')) {
        const newHost = rawArgs.replace('set-hostname', '').trim();
        state.virtualFilesContent['/etc/hostname'] = newHost;
        return `Static hostname set to '${newHost}' in /etc/hostname`;
      }
      return [
        `   Static hostname: ${state.virtualFilesContent['/etc/hostname'] || 'server1.example.com'}`,
        `         Icon name: computer-vm`,
        `           Chassis: vm`,
        `        Machine ID: e9872f104ab34c56891234567890abcd`,
        `           Boot ID: 1234567890abcdef1234567890abcdef`,
        `    Virtualization: oracle`,
        `  Operating System: Red Hat Enterprise Linux 10.0 (Plow)`,
        `            Kernel: Linux 6.1.0-rhel10.x86_64`,
        `      Architecture: x86-64`
      ].join('\n');
    } else if (cmd === 'nmtui') {
      return [
        `┌────────────────────────────── NetworkManager TUI ──────────────────────────────┐`,
        `│                                                                                │`,
        `│  Please select an option                                                       │`,
        `│                                                                                │`,
        `│            Edit a connection                                                   │`,
        `│            Activate a connection                                               │`,
        `│            Set system hostname                                                 │`,
        `│                                                                                │`,
        `│            <Quit>                                                              │`,
        `│                                                                                │`,
        `└────────────────────────────────────────────────────────────────────────────────┘`
      ].join('\n');
    } else if (cmd === 'rpm') {
      const sub = parts[1] || '-q';
      const targetPkg = parts[2] || 'vsftpd';
      if (sub === '-q' || sub === '-qa') {
        return `${targetPkg}-3.0.5-5.el10.x86_64`;
      } else if (sub === '-ivh' || sub === '-i') {
        return [
          `Preparing packages...`,
          `Updating / installing...`,
          `1:${targetPkg}-3.0.5-5.el10       ################################# [100%]`
        ].join('\n');
      } else if (sub === '-U' || sub === '-Uvh') {
        return [
          `Preparing packages...`,
          `Upgrading...`,
          `1:${targetPkg}-3.0.5-5.el10       ################################# [100%]`
        ].join('\n');
      } else if (sub === '-e') {
        return `[rpm -e ${targetPkg} executed successfully: package uninstalled]`;
      }
      return `rpm: ${rawArgs}`;
    } else if (cmd === 'yum' || cmd === 'dnf') {
      const action = parts[1] || 'repolist';
      const targetPkg = parts[2] || 'vsftpd';

      if (action === 'repolist') {
        return [
          `Updating Subscription Management repositories.`,
          `repo id                        repo name`,
          `app                            AppStream Repository RHEL 10`,
          `base                           BaseOS Repository RHEL 10`
        ].join('\n');
      } else if (action === 'info') {
        return [
          `Name         : ${targetPkg}`,
          `Version      : 3.0.5`,
          `Release      : 5.el10`,
          `Architecture : x86_64`,
          `Size         : 345 k`,
          `Source       : AppStream`,
          `Summary      : Very Secure FTP Daemon for RHEL 10`,
          `Description  : vsftpd is an RPM-based Secure FTP server daemon for Unix-like systems.`
        ].join('\n');
      } else if (action === 'install') {
        return [
          `Dependencies resolved.`,
          `================================================================================`,
          ` Package          Arch           Version              Repository           Size`,
          `================================================================================`,
          `Installing:`,
          ` ${targetPkg.padEnd(16)} x86_64         3.0.5-5.el10         app                 345 k`,
          ``,
          `Transaction Summary`,
          `================================================================================`,
          `Install  1 Package`,
          ``,
          `Total download size: 345 k`,
          `Installed size: 890 k`,
          `Downloading Packages:`,
          `Running transaction check`,
          `Transaction test succeeded.`,
          `Running transaction`,
          `  Preparing        :                                                        1/1 `,
          `  Installing       : ${targetPkg}-3.0.5-5.el10.x86_64                         1/1 `,
          `  Verifying        : ${targetPkg}-3.0.5-5.el10.x86_64                         1/1 `,
          ``,
          `Complete!`
        ].join('\n');
      } else if (action === 'remove') {
        return [
          `Dependencies resolved.`,
          `================================================================================`,
          ` Package          Arch           Version              Repository           Size`,
          `================================================================================`,
          `Removing:`,
          ` ${targetPkg.padEnd(16)} x86_64         3.0.5-5.el10         @System             890 k`,
          ``,
          `Transaction Summary`,
          `================================================================================`,
          `Remove  1 Package`,
          ``,
          `Freed space: 890 k`,
          `Running transaction`,
          `  Erasing          : ${targetPkg}-3.0.5-5.el10.x86_64                         1/1 `,
          `  Verifying        : ${targetPkg}-3.0.5-5.el10.x86_64                         1/1 `,
          ``,
          `Complete!`
        ].join('\n');
      } else if (action === 'clean') {
        return `18 files removed (cache cleared successfully).`;
      } else if (action === 'list') {
        return [
          `Installed Packages`,
          `bash.x86_64                         5.1.8-2.el10                     @System`,
          `coreutils.x86_64                    8.32-6.el10                      @System`,
          `systemd.x86_64                      252-14.el10                      @System`,
          `Available Packages`,
          `vsftpd.x86_64                       3.0.5-5.el10                     app    `,
          `httpd.x86_64                        2.4.57-1.el10                    app    `
        ].join('\n');
      }
      return `[${cmd} ${rawArgs} executed successfully]`;
    } else if (cmd === 'exportfs') {
      return `exporting 192.168.1.0/24:/database`;
    } else if (cmd === 'showmount') {
      return [
        `Export list for 192.168.1.2:`,
        `/database 192.168.1.0/24`
      ].join('\n');
    } else if (cmd === 'subscription-manager') {
      const subAction = rawArgs.trim();
      if (subAction.startsWith('register')) {
        return [
          `Registering to: subscription.rhsm.redhat.com:443/subscription`,
          `Username: student_redhat`,
          `Password: ********`,
          `The system has been registered with ID: 7c9a1234-5678-90ab-cdef-1234567890ab`,
          `The registered system name is: rhel10.example.com`
        ].join('\n');
      } else if (subAction.startsWith('unregister')) {
        return [
          `Unregistering from: subscription.rhsm.redhat.com:443/subscription`,
          `System has been unregistered.`
        ].join('\n');
      } else if (subAction.startsWith('list')) {
        return [
          `+-------------------------------------------+`,
          `    Installed Product Status`,
          `+-------------------------------------------+`,
          `Product Name:   Red Hat Enterprise Linux for x86_64`,
          `Product ID:     479`,
          `Version:        10.0`,
          `Arch:           x86_64`,
          `Status:         Subscribed`,
          `Starts:         2026-01-01`,
          `Ends:           2027-01-01`
        ].join('\n');
      } else {
        return `Subscription Management Status: Active (Connected to Red Hat Customer Portal)`;
      }
    } else if (cmd === 'getenforce') {
      return `Enforcing`;
    } else if (cmd === 'setenforce') {
      const mode = rawArgs.trim();
      if (mode === '0' || mode.toLowerCase() === 'permissive') {
        return `[SELinux mode dynamically updated to Permissive (Warnings logged to /var/log/audit/audit.log)]`;
      } else if (mode === '1' || mode.toLowerCase() === 'enforcing') {
        return `[SELinux mode dynamically updated to Enforcing (Strict security rules active)]`;
      } else {
        return `usage: setenforce [Enforcing|Permissive|1|0]`;
      }
    } else if (cmd === 'sestatus') {
      return [
        `SELinux status:                 enabled`,
        `SELinuxfs mount:                /sys/fs/selinux`,
        `SELinux root directory:         /etc/selinux`,
        `Loaded policy name:             targeted`,
        `Current mode:                   enforcing`,
        `Mode from config file:          enforcing`,
        `Policy MLS status:              enabled`,
        `Policy deny_unknown status:     allowed`,
        `Memory protection checking:     actual (secure)`
      ].join('\n');
    } else if (cmd === 'httpd') {
      const args = rawArgs.trim();
      if (args === '-t') {
        return `Syntax OK`;
      } else if (args === '-v' || args === '-V') {
        return `Server version: Apache/2.4.57 (Red Hat Enterprise Linux 10)\nServer built:   May 2026`;
      } else {
        return `[httpd process daemon executed]`;
      }
    } else if (cmd === 'chcon') {
      return `[chcon]: Security context updated successfully for target path.`;
    } else if (cmd === 'restorecon') {
      return `Relabeled /account from unconfined_u:object_r:httpd_sys_content_t:s0 to unconfined_u:object_r:default_t:s0`;
    } else if (cmd === 'semanage') {
      const args = rawArgs.trim();
      if (args.includes('-C') || args.includes('-l')) {
        return [
          `SELinux fcontext                                   Type               Context`,
          ``,
          `/account(/.*)?                                     all files          system_u:object_r:httpd_sys_content_t:s0`
        ].join('\n');
      } else if (args.includes('-d')) {
        return `[semanage]: File context rule removed from SELinux database.`;
      } else {
        return `[semanage]: Permanent file context rule added to policy database. Run 'restorecon -Rv <path>' to apply to filesystem.`;
      }
    } else if (cmd === 'matchpathcon') {
      return `/account/index.html verified.`;
    } else if (cmd === 'getsebool') {
      return [
        `httpd_enable_homedirs --> off`,
        `httpd_use_nfs --> off`,
        `radius_use_jit --> on`,
        `ftpd_full_access --> off`,
        `selinuxuser_ping --> on`
      ].join('\n');
    } else if (cmd === 'setsebool') {
      const args = rawArgs.trim();
      return `[setsebool]: Boolean state updated successfully (${args}).`;
    } else if (cmd === 'openssl') {
      return `Generating a RSA private key...\n..........+++++\nwritten tata.key (2048 bits RSA private key)\nwritten tata.crt (X.509 self-signed certificate, valid for 365 days)`;
    } else if (cmd === 'mysql') {
      return `Welcome to the MariaDB monitor.  Commands end with ; or \\g.\nYour MariaDB connection id is 18\nServer version: 10.11.6-MariaDB Red Hat Enterprise Linux\n\nMariaDB [(none)]> show databases;\n+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| employee           |\n| mydb               |\n| mysql              |\n+--------------------+`;
    } else if (cmd === 'mysqldump') {
      return `-- MariaDB dump 10.19  Distrib 10.11.6-MariaDB, for Linux (x86_64)\n-- Host: localhost    Database: employee\n-- Dump completed on 2026-05-01 12:00:00\n[Database dump file generated successfully]`;
    } else if (cmd === 'mysql_secure_installation') {
      return `[mysql_secure_installation]: Root password set. Anonymous users removed. Remote root login disabled. Test database purged. Privilege tables reloaded successfully.`;
    } else if (cmd === 'ln') {
      const isSoft = rawArgs.includes('-s');
      if (isSoft) {
        return `[ln -s]: Soft (symbolic) link created successfully. Link pointer points to target path across filesystems with a new inode.`;
      }
      return `[ln]: Hard link created successfully. Direct inode reference added with incremented link count.`;
    } else if (cmd === 'c' || cmd === 'lightspeed') {
      const query = rawArgs.trim().replace(/^["']|["']$/g, '');
      if (!query || query === '--help') {
        return `Usage: c "<natural language query>" | c "explain: <command>" | c "analyze <log_path>"\nRHEL Lightspeed AI Assistant v10.0 (Command-Line Assistant)`;
      }
      return `🤖 RHEL Lightspeed AI Response for "${query}":\n[Red Hat Knowledgebase Analysis]: Executing query via Command-Line Assistant (c). Red Hat validated solution synthesized. Type 'man c' for additional CLI options.`;
    } else if (cmd === 'flatpak') {
      const sub = rawArgs.trim();
      if (sub === '--version') return 'Flatpak 1.14.8';
      if (sub.startsWith('remote-add')) return 'Remote "flathub" added successfully.';
      if (sub === 'remotes') return 'Name    Options  Url\nflathub system   https://dl.flathub.org/repo/';
      if (sub.startsWith('search')) return 'Name            Description                            Application ID       Version   Branch  Remotes\nMozilla Firefox Fast, Private & Free Web Browser        org.mozilla.firefox  125.0.3   stable  flathub';
      if (sub.startsWith('install')) return '[Flatpak Install]: Application and runtime frameworks installed successfully.';
      if (sub.startsWith('run')) return '[Flatpak Run]: Launching application in isolated sandbox container...';
      if (sub === 'list') return 'Name            Application ID       Version   Branch  Installation\nFirefox         org.mozilla.firefox  125.0.3   stable  system';
      if (sub === 'update') return '[Flatpak Update]: All applications and runtime frameworks are up to date.';
      if (sub.startsWith('uninstall')) return '[Flatpak Uninstall]: Application uninstalled. Run flatpak uninstall --unused to purge orphaned runtimes.';
      if (sub === 'repair') return '[Flatpak Repair]: Local repository storage refs verified and repaired.';
      return 'Flatpak 1.14.8 - Universal application packaging framework for Linux\nType "flatpak --help" for list of options.';
    } else if (cmd === 'tuned-adm') {
      const sub = rawArgs.trim();
      if (sub === 'active') return 'Current active profile: virtual-guest';
      if (sub === 'list') return 'Available profiles:\n- balanced\n- desktop\n- latency-performance\n- powersave\n- throughput-performance\n- virtual-guest\n- virtual-host';
      if (sub === 'recommend') return 'virtual-guest';
      if (sub.startsWith('profile')) return `Switching active profile to ${sub.replace('profile', '').trim() || 'balanced'}...\nCurrent active profile: ${sub.replace('profile', '').trim() || 'balanced'}`;
      if (sub === 'off') return 'Tuned tuning activity turned off.\nCurrent active profile: none';
      return 'Usage: tuned-adm [active|list|recommend|profile <name>|off]';
    } else if (cmd === 'ps') {
      if (rawArgs.includes('--forest')) return 'UID        PID  PPID  C STIME TTY          TIME CMD\nroot      4511     1  0 10:00 ?        00:00:01 /usr/sbin/httpd -DFOREGROUND\napache    4512  4511  0 10:00 ?        00:00:00  \\_ /usr/sbin/httpd -DFOREGROUND';
      if (rawArgs.includes('--sort=-%mem')) return 'USER       PID %MEM %CPU COMMAND\nmysql     3410  8.5  1.2 /usr/libexec/mariadbd\napache    4512  4.2  0.8 /usr/sbin/httpd\nroot      1204  2.8  0.4 /usr/bin/tuned';
      if (rawArgs.includes('--sort=-%cpu')) return 'USER       PID %MEM %CPU COMMAND\nroot      3205 12.0 85.4 /usr/bin/stress-ng\nmysql     3410  8.5  1.2 /usr/libexec/mariadbd';
      if (rawArgs.includes('-aux') || rawArgs.includes('aux')) return 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 178204 13412 ?        Ss   08:00   0:02 /usr/lib/systemd/systemd\nroot      1204  0.1  0.4 458912 32104 ?        Ssl  08:00   0:01 /usr/bin/tuned';
      if (rawArgs.includes('-ef')) return 'UID        PID  PPID  C STIME TTY          TIME CMD\nroot         1     0  0 08:00 ?        00:00:02 /usr/lib/systemd/systemd\nroot      1204     1  0 08:00 ?        00:00:01 /usr/bin/tuned';
      return '  PID TTY          TIME CMD\n 4511 pts/0    00:00:00 bash\n 8920 pts/0    00:00:00 ps';
    } else if (cmd === 'top') {
      return 'top - 10:00:00 up 2 days,  3:14,  1 user,  load average: 0.15, 0.08, 0.04\nTasks: 182 total,   1 running, 181 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  1.5 us,  0.5 sy,  0.0 ni, 97.8 id,  0.2 wa,  0.0 hi,  0.0 si\nMiB Mem :  15892.4 total,   8420.1 free,   4210.8 used,   3261.5 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 3410 mysql     20   0 1892100 689012  42100 S   1.2   8.5   2:14.20 mariadbd\n 4512 apache    20   0  489120 342100  18200 S   0.8   4.2   0:45.12 httpd';
    } else if (cmd === 'watch') {
      return `Every 1.0s: ${rawArgs}\nUSER       PID %MEM %CPU COMMAND\nroot      3205 12.0 85.4 /usr/bin/stress-ng\nmysql     3410  8.5  1.2 /usr/libexec/mariadbd`;
    } else if (cmd === 'netstat') {
      return 'Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN\ntcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN\ntcp        0      0 0.0.0.0:3306            0.0.0.0:*               LISTEN';
    } else if (cmd === 'tcpdump') {
      return `tcpdump: verbose output suppressed, use -v or -vv for full protocol decode\nlistening on ${rawArgs.includes('-i') ? rawArgs.split('-i')[1].trim().split(' ')[0] : 'enp0s3'}, link-type EN10MB (Ethernet), capture size 262144 bytes\n10:00:01.102456 IP 192.168.1.10.ssh > 192.168.1.50.52410: Flags [P.], seq 1:40, ack 1`;
    } else if (cmd === 'lscpu') {
      return 'Architecture:          x86_64\nCPU op-mode(s):        32-bit, 64-bit\nCPU(s):                4\nThread(s) per core:    2\nCore(s) per socket:    2\nSocket(s):             1\nVendor ID:             GenuineIntel\nModel name:            Intel(R) Xeon(R) CPU @ 2.80GHz';
    } else if (cmd === 'lshw') {
      return 'H/W path           Device     Class          Description\n========================================================\n                              system         Computer\n/0                            bus            Motherboard\n/0/0                          memory         16GiB System Memory\n/0/1               cpu        processor      Intel(R) Xeon(R) CPU @ 2.80GHz';
    } else if (cmd === 'last') {
      if (rawArgs.includes('btmp')) return 'hacker   ssh:notty    192.168.1.200    Thu Jul 23 09:45 - 09:45  (00:00)\nadmin    pts/0        192.168.1.105    Thu Jul 23 09:12 - 09:12  (00:00)\n\nbtmp begins Thu Jul  1 00:00:00 2026';
      return 'root     pts/0        192.168.1.50     Thu Jul 23 10:14   still logged in\nsachin   pts/1        192.168.1.55     Thu Jul 23 08:30 - 09:45  (01:14)\n\nwtmp begins Thu Jul  1 00:00:00 2026';
    } else if (cmd === 'lastlog') {
      return 'Username         Port     From             Latest\nroot             pts/0    192.168.1.50     Thu Jul 23 10:14:02 +0000 2026\nbin                                        **Never logged in**\nsachin           pts/1    192.168.1.55     Thu Jul 23 08:30:11 +0000 2026';
    } else if (cmd === 'firewall-cmd') {
      let argsStr = rawArgs.trim();
      if (!argsStr) {
        return `Usage: firewall-cmd [options]\nOptions:\n  --get-default-zone            Print default zone\n  --list-all-zones              List all predefined zones\n  --set-default-zone=<zone>     Set active default zone\n  --list-all                    List configured rules in active zone\n  --add-service=<service>       Add service to zone\n  --remove-service=<service>    Remove service from zone\n  --add-port=<port/protocol>    Open port in zone\n  --remove-port=<port/protocol> Close port in zone\n  --reload                      Reload firewall configurations`;
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
        let m = argsStr.match(/--zone=([^\s]+)/);
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
          return `${z} (${z === state.defaultZone ? 'active' : 'inactive'})\n  target: default\n  interfaces: ${item.interfaces.join(' ') || 'none'}\n  services: ${item.services.join(' ')}\n  ports: ${item.ports.join(' ')}`;
        }).join('\n\n');
      } else if (argsStr.includes('--set-default-zone=')) {
        let m = argsStr.match(/--set-default-zone=([^\s]+)/);
        if (m) {
          state.defaultZone = m[1];
          if (!state.firewallZones[m[1]]) {
            state.firewallZones[m[1]] = { services: ['ssh'], ports: [], interfaces: [] };
          }
          return 'success';
        }
      } else if (argsStr.includes('--list-all')) {
        return `${targetZone} (${targetZone === state.defaultZone ? 'active' : 'inactive'})\n  target: default\n  icmp-block-inversion: no\n  interfaces: ${zObj.interfaces.join(' ') || 'enp0s3'}\n  sources: \n  services: ${zObj.services.join(' ')}\n  ports: ${zObj.ports.join(' ')}
  protocols: \n  forward: yes\n  masquerade: no`;
      } else if (argsStr.includes('--add-service=')) {
        let m = argsStr.match(/--add-service=([^\s]+)/);
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
        let m = argsStr.match(/--remove-service=([^\s]+)/);
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
        let m = argsStr.match(/--add-port=([^\s]+)/);
        if (m) {
          let p = m[1].trim();
          if (!zObj.ports.includes(p)) zObj.ports.push(p);
          return 'success';
        }
      } else if (argsStr.includes('--remove-port=')) {
        let m = argsStr.match(/--remove-port=([^\s]+)/);
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
    } else if (cmd === 'journalctl') {
      if (rawArgs.includes('-u')) return `-- Logs begin at Thu 2026-07-23 00:00:00 UTC.\nJul 23 10:00:10 server1 systemd[1]: Starting service...\nJul 23 10:00:11 server1 systemd[1]: Started service successfully.`;
      if (rawArgs.includes('-p err')) return 'Jul 23 09:14:02 server1 kernel: [ERROR] Failed to initialize ACPI device.\nJul 23 10:05:12 server1 httpd[4511]: [ERROR] Permission denied: cannot open /var/www/html/index.html';
      return '-- Logs begin at Thu 2026-07-23 00:00:00 UTC, end at Thu 2026-07-23 10:20:00 UTC. --\nJul 23 10:00:00 server1 systemd[1]: Startup completed in 1.412s.';
    }
    return '';
  }

  // --- INTERACTIVE BACKUP & TAR VISUALIZER ---
  function setupTarVisualizer() {
    const tarSrcDir = document.getElementById('tar-src-dir');
    const tarCompType = document.getElementById('tar-comp-type');
    const tarVerbose = document.getElementById('tar-verbose');
    const tarDestFile = document.getElementById('tar-dest-file');
    const tarCmdPreview = document.getElementById('tar-cmd-preview');
    const tarRunBtn = document.getElementById('tar-run-btn');
    const tarTerminalOutput = document.getElementById('tar-terminal-output');

    if (!tarSrcDir || !tarCompType || !tarVerbose || !tarDestFile || !tarCmdPreview || !tarRunBtn || !tarTerminalOutput) return;

    function syncTarCommandView() {
      const src = tarSrcDir.value;
      const comp = tarCompType.value;
      const verb = tarVerbose.checked;

      // Auto-update target file name based on compression
      let ext = '.tar';
      if (comp === 'gzip') ext = '.tar.gz';
      else if (comp === 'bzip2') ext = '.tar.bz2';
      else if (comp === 'xz') ext = '.tar.xz';

      const baseDest = '/mnt/backup' + ext;
      tarDestFile.value = baseDest;

      // Construct flags
      let flags = 'c';
      if (verb) flags += 'v';
      if (comp === 'gzip') flags += 'z';
      else if (comp === 'bzip2') flags += 'j';
      else if (comp === 'xz') flags += 'J';
      flags += 'f';

      tarCmdPreview.textContent = `tar -${flags} ${baseDest} ${src}`;
    }

    tarSrcDir.addEventListener('change', syncTarCommandView);
    tarCompType.addEventListener('change', syncTarCommandView);
    tarVerbose.addEventListener('change', syncTarCommandView);

    tarRunBtn.addEventListener('click', () => {
      const cmd = tarCmdPreview.textContent;
      const src = tarSrcDir.value;
      const comp = tarCompType.value;
      const dest = tarDestFile.value;
      const verb = tarVerbose.checked;

      // Resolve targets
      let targetAbs = resolvePath(src);
      let archiveAbs = resolvePath(dest);

      // Verify source exists
      if (state.virtualFS[targetAbs] === undefined && state.virtualFilesContent[targetAbs] === undefined) {
        tarTerminalOutput.textContent = `[student@rhel10 ~]$ ${cmd}\ntar: ${src}: Cannot stat: No such file or directory\ntar: Exiting with failure status due to previous errors`;
        tarTerminalOutput.style.color = '#ff6b6b';
        return;
      }

      // Gather files list
      let files = [];
      const gather = (d) => {
        if (state.virtualFilesContent[d] !== undefined) {
          files.push(d);
        }
        if (state.virtualFS[d]) {
          files.push(d + '/');
          state.virtualFS[d].forEach(f => {
            gather(d === '/' ? '/' + f : d + '/' + f);
          });
        }
      };
      gather(targetAbs);

      // Create tarball file inside virtual FS
      state.virtualFilesContent[archiveAbs] = `TARBALL_METADATA:${comp}:${files.join(',')}`;
      state.virtualFileMeta[archiveAbs] = {
        owner: state.currentUser,
        group: state.currentUser,
        permissions: 'rw-r--r--'
      };

      let parent = archiveAbs.substring(0, archiveAbs.lastIndexOf('/')) || '/';
      let name = archiveAbs.substring(archiveAbs.lastIndexOf('/') + 1);
      if (state.virtualFS[parent] && !state.virtualFS[parent].includes(name)) {
        state.virtualFS[parent].push(name);
      }

      // Output logs
      let logs = [`[student@rhel10 ~]$ ${cmd}`];
      if (verb) {
        files.forEach(f => {
          logs.push(f.startsWith('/') ? f.substring(1) : f);
        });
      }

      // Add du size check simulation
      let finalSize = '12M';
      if (comp === 'gzip') finalSize = '3.2M';
      else if (comp === 'bzip2') finalSize = '2.8M';
      else if (comp === 'xz') finalSize = '2.1M';

      logs.push(`\n[student@rhel10 ~]$ du -sh ${dest}`);
      logs.push(`${finalSize}\t${dest}`);

      tarTerminalOutput.textContent = logs.join('\n');
      tarTerminalOutput.style.color = '#39ff14';
    });

    // Run initial sync
    syncTarCommandView();
  }

  // --- INTERACTIVE JOB AUTOMATION VISUALIZER ---
  function setupJobAutomationVisualizer() {
    const btnCron = document.getElementById('btn-mode-cron');
    const btnAt = document.getElementById('btn-mode-at');
    const panelCron = document.getElementById('cron-builder-panel');
    const panelAt = document.getElementById('at-builder-panel');

    const cronMin = document.getElementById('cron-min');
    const cronHour = document.getElementById('cron-hour');
    const cronDom = document.getElementById('cron-dom');
    const cronMonth = document.getElementById('cron-month');
    const cronDow = document.getElementById('cron-dow');
    const cronCmd = document.getElementById('cron-cmd-input');

    const atTime = document.getElementById('at-time-input');
    const atCmd = document.getElementById('at-cmd-input');

    const cmdPreview = document.getElementById('job-cmd-preview');
    const translation = document.getElementById('job-translation');

    const addBtn = document.getElementById('job-add-btn');
    const listBtn = document.getElementById('job-list-btn');
    const outputDisplay = document.getElementById('job-terminal-output');

    if (!btnCron || !btnAt || !panelCron || !panelAt || !cmdPreview || !translation || !addBtn || !listBtn || !outputDisplay) return;

    let activeMode = 'cron'; // 'cron' or 'at'

    function updateView() {
      if (activeMode === 'cron') {
        btnCron.style.backgroundColor = 'var(--accent)';
        btnCron.style.color = 'white';
        btnAt.style.backgroundColor = 'var(--bg-secondary)';
        btnAt.style.color = 'var(--text-main)';

        panelCron.style.display = 'block';
        panelAt.style.display = 'none';

        const min = cronMin.value.trim() || '*';
        const hr = cronHour.value.trim() || '*';
        const dom = cronDom.value.trim() || '*';
        const mo = cronMonth.value.trim() || '*';
        const dow = cronDow.value.trim() || '*';
        const cmd = cronCmd.value.trim() || 'date >> /city.txt';

        const cronStr = `${min} ${hr} ${dom} ${mo} ${dow} ${cmd}`;
        cmdPreview.textContent = cronStr;

        let humanDesc = 'Schedule: ';
        if (min === '*/1' || min === '*') humanDesc += 'Runs every minute ';
        else humanDesc += `Runs at minute ${min} `;

        if (hr === '*') humanDesc += 'every hour ';
        else humanDesc += `at hour ${hr} `;

        if (dom !== '*') humanDesc += `on day-of-month ${dom} `;
        if (mo !== '*') humanDesc += `in month ${mo} `;
        if (dow !== '*') humanDesc += `on day-of-week ${dow} `;

        translation.textContent = humanDesc.trim() + '.';
      } else {
        btnAt.style.backgroundColor = 'var(--accent)';
        btnAt.style.color = 'white';
        btnCron.style.backgroundColor = 'var(--bg-secondary)';
        btnCron.style.color = 'var(--text-main)';

        panelAt.style.display = 'block';
        panelCron.style.display = 'none';

        const timeVal = atTime.value;
        const cmdVal = atCmd.value.trim() || 'useradd ajay';

        cmdPreview.textContent = `at ${timeVal}  (Command: ${cmdVal})`;
        translation.textContent = `One-Time Job: Scheduled to run command "${cmdVal}" once at ${timeVal}.`;
      }
    }

    btnCron.addEventListener('click', () => { activeMode = 'cron'; updateView(); });
    btnAt.addEventListener('click', () => { activeMode = 'at'; updateView(); });

    [cronMin, cronHour, cronDom, cronMonth, cronDow, cronCmd, atTime, atCmd].forEach(el => {
      if (el) {
        el.addEventListener('input', updateView);
        el.addEventListener('change', updateView);
      }
    });

    addBtn.addEventListener('click', () => {
      if (activeMode === 'cron') {
        const cronStr = cmdPreview.textContent;
        const spoolFile = `/var/spool/cron/${state.currentUser}`;
        state.virtualFilesContent[spoolFile] = cronStr;
        if (state.virtualFS['/var/spool/cron'] && !state.virtualFS['/var/spool/cron'].includes(state.currentUser)) {
          state.virtualFS['/var/spool/cron'].push(state.currentUser);
        }
        outputDisplay.textContent = `[student@rhel10 ~]$ crontab -e\ncrontab: installing new crontab for ${state.currentUser}`;
        outputDisplay.style.color = '#39ff14';
      } else {
        const timeVal = atTime.value;
        const cmdVal = atCmd.value.trim() || 'useradd ajay';
        let nextId = state.atJobs.length > 0 ? Math.max(...state.atJobs.map(j => j.id)) + 1 : 1;
        
        state.atJobs.push({
          id: nextId,
          time: timeVal,
          cmd: cmdVal,
          user: state.currentUser
        });

        let fileName = `a0000${nextId}0abdl11`;
        state.virtualFilesContent[`/var/spool/at/${fileName}`] = `#!/bin/sh\n# at job ${nextId}\n${cmdVal}`;
        if (state.virtualFS['/var/spool/at'] && !state.virtualFS['/var/spool/at'].includes(fileName)) {
          state.virtualFS['/var/spool/at'].push(fileName);
        }

        outputDisplay.textContent = `[student@rhel10 ~]$ at ${timeVal}\nat> ${cmdVal}\nat> <EOT>\njob ${nextId} at ${timeVal}`;
        outputDisplay.style.color = '#39ff14';
      }
    });

    listBtn.addEventListener('click', () => {
      if (activeMode === 'cron') {
        const spoolFile = `/var/spool/cron/${state.currentUser}`;
        const content = state.virtualFilesContent[spoolFile];
        if (content && content.trim()) {
          outputDisplay.textContent = `[student@rhel10 ~]$ crontab -l\n${content}`;
          outputDisplay.style.color = '#39ff14';
        } else {
          outputDisplay.textContent = `[student@rhel10 ~]$ crontab -l\nno crontab for ${state.currentUser}`;
          outputDisplay.style.color = '#ff6b6b';
        }
      } else {
        if (state.atJobs.length > 0) {
          let lines = state.atJobs.map(j => `${j.id}\t${j.time} a ${j.user}`);
          outputDisplay.textContent = `[student@rhel10 ~]$ atq\n${lines.join('\n')}`;
          outputDisplay.style.color = '#39ff14';
        } else {
          outputDisplay.textContent = `[student@rhel10 ~]$ atq\n(No pending at jobs in queue)`;
          outputDisplay.style.color = '#ff6b6b';
        }
      }
    });

  }

  // --- INTERACTIVE BASH SCRIPT RUNNER VISUALIZER ---
  function setupScriptRunnerVisualizer() {
    const selectTemplate = document.getElementById('script-template-select');
    const filePathInput = document.getElementById('script-file-path');
    const codeEditor = document.getElementById('script-code-editor');
    const permBadge = document.getElementById('script-perm-badge');
    const chmodBtn = document.getElementById('script-chmod-btn');
    const runBtn = document.getElementById('script-run-btn');
    const catOutputBtn = document.getElementById('script-cat-output-btn');
    const terminalOutput = document.getElementById('script-terminal-output');

    if (!selectTemplate || !filePathInput || !codeEditor || !permBadge || !chmodBtn || !runBtn || !catOutputBtn || !terminalOutput) return;

    const templates = {
      'system_info': {
        path: '/jobs/script1.sh',
        code: `#!/bin/bash
echo "===================================================" >> /computer.txt
echo " This computer name is=" >> /computer.txt
hostname >> /computer.txt
echo "-----------------------------------------------------------------" >> /computer.txt
echo " kernel version is=" >> /computer.txt
uname -r >> /computer.txt
echo "------------------------------------------------------------------" >> /computer.txt
echo " last 5 user properties = " >> /computer.txt
tail -n 5 /etc/passwd >> /computer.txt
echo "=========================================================" >> /computer.txt`
      },
      'backup': {
        path: '/home/student/backup.sh',
        code: `#!/bin/bash
SOURCE_DIR="./app_data"
BACKUP_DIR="./backups"
DATE=$(date +%F)
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" "$SOURCE_DIR"
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_DIR/app_backup_$DATE.tar.gz"
else
  echo "Backup failed!"
fi`
      },
      'restore': {
        path: '/home/student/restore.sh',
        code: `#!/bin/bash
BACKUP_FILE="./backups/app_backup_2026-04-12.tar.gz"
RESTORE_DIR="./restore_data"
mkdir -p "$RESTORE_DIR"
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"
echo "Restore completed into $RESTORE_DIR"`
      },
      'custom': {
        path: '/home/student/myscript.sh',
        code: `#!/bin/bash
# Custom hello script
echo "Hello from interactive RHEL shell script!"
date`
      }
    };

    function updateScriptView() {
      const selectedKey = selectTemplate.value;
      const t = templates[selectedKey];
      if (t) {
        filePathInput.value = t.path;
        codeEditor.value = t.code;
      }
      syncPermBadge();
    }

    function syncPermBadge() {
      const absPath = resolvePath(filePathInput.value.trim());
      const meta = state.virtualFileMeta[absPath] || { permissions: 'rw-r--r--' };
      const perms = meta.permissions || 'rw-r--r--';

      if (perms.includes('x')) {
        permBadge.textContent = `${perms} (Executable)`;
        permBadge.style.color = '#39ff14';
      } else {
        permBadge.textContent = `${perms} (Non-executable)`;
        permBadge.style.color = '#ff6b6b';
      }
    }

    selectTemplate.addEventListener('change', updateScriptView);
    filePathInput.addEventListener('input', syncPermBadge);

    chmodBtn.addEventListener('click', () => {
      const path = filePathInput.value.trim();
      const absPath = resolvePath(path);

      if (!state.virtualFileMeta[absPath]) {
        state.virtualFileMeta[absPath] = {
          owner: state.currentUser,
          group: state.currentUser,
          type: '-',
          permissions: 'rw-r--r--'
        };
      }

      state.virtualFileMeta[absPath].permissions = 'rwxr-xr-x';
      syncPermBadge();
      terminalOutput.textContent = `[student@rhel10 ~]$ chmod +x ${path}\nPermissions updated to rwxr-xr-x`;
      terminalOutput.style.color = '#39ff14';
    });

    runBtn.addEventListener('click', () => {
      const path = filePathInput.value.trim();
      const absPath = resolvePath(path);
      const code = codeEditor.value;

      // Save code to virtual filesystem
      state.virtualFilesContent[absPath] = code;
      let pDir = absPath.substring(0, absPath.lastIndexOf('/')) || '/';
      let fName = absPath.substring(absPath.lastIndexOf('/') + 1);
      if (!state.virtualFS[pDir]) state.virtualFS[pDir] = [];
      if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
        state.virtualFS[pDir].push(fName);
      }

      // Execute script
      let res = executeScriptContent(path, false);
      if (res.isError) {
        terminalOutput.textContent = `[student@rhel10 ~]$ ./${path.replace(/^\//, '')}\n${res.output}`;
        terminalOutput.style.color = '#ff6b6b';
      } else {
        terminalOutput.textContent = `[student@rhel10 ~]$ ./${path.replace(/^\//, '')}\n${res.output || '(Script executed successfully without stdout)'}`;
        terminalOutput.style.color = '#39ff14';
      }
    });

    catOutputBtn.addEventListener('click', () => {
      const logFile = '/computer.txt';
      const content = state.virtualFilesContent[logFile];

      if (content && content.trim()) {
        terminalOutput.textContent = `[student@rhel10 ~]$ cat /computer.txt\n${content}`;
        terminalOutput.style.color = '#39ff14';
      } else {
        terminalOutput.textContent = `[student@rhel10 ~]$ cat /computer.txt\ncat: /computer.txt: No such file or directory (Run /jobs/script1.sh first!)`;
        terminalOutput.style.color = '#ff6b6b';
      }
    });

    updateScriptView();
  }

  // --- INTERACTIVE DISK PARTITION & MOUNT MANAGER VISUALIZER ---
  
  // --- INTERACTIVE RUNLEVEL & BOOT PROCESS WIDGET ---
  function setupBootProcessWidget() {
    const btnLvl3 = document.getElementById('btn-runlvl-3');
    const btnLvl5 = document.getElementById('btn-runlvl-5');
    const btnGetLvl = document.getElementById('btn-runlvl-get');
    const btnReboot = document.getElementById('btn-sys-reboot');
    const btnPoweroff = document.getElementById('btn-sys-poweroff');
    const simOutput = document.getElementById('runlevel-simulator-output');

    if (btnLvl3 && btnLvl5 && btnGetLvl && simOutput) {
      btnLvl3.addEventListener('click', () => {
        state.defaultRunlevel = 'multi-user.target';
        simOutput.innerHTML = `
          <span style="color: var(--accent-success);">[OK] Removed /etc/systemd/system/default.target</span><br>
          <span style="color: var(--accent-light);">[OK] Created symlink /etc/systemd/system/default.target -> /usr/lib/systemd/system/multi-user.target</span><br>
          <strong style="color: var(--text-primary);">Current Default Target: multi-user.target (Runlevel 3 - TUI CLI)</strong>
        `;
        btnLvl3.classList.add('active');
        btnLvl3.classList.remove('secondary');
        btnLvl5.classList.remove('active');
        btnLvl5.classList.add('secondary');
      });

      btnLvl5.addEventListener('click', () => {
        state.defaultRunlevel = 'graphical.target';
        simOutput.innerHTML = `
          <span style="color: var(--accent-success);">[OK] Removed /etc/systemd/system/default.target</span><br>
          <span style="color: var(--accent-light);">[OK] Created symlink /etc/systemd/system/default.target -> /usr/lib/systemd/system/graphical.target</span><br>
          <strong style="color: var(--text-primary);">Current Default Target: graphical.target (Runlevel 5 - GUI Desktop)</strong>
        `;
        btnLvl5.classList.add('active');
        btnLvl5.classList.remove('secondary');
        btnLvl3.classList.remove('active');
        btnLvl3.classList.add('secondary');
      });

      btnGetLvl.addEventListener('click', () => {
        const cur = state.defaultRunlevel || 'graphical.target';
        const num = cur === 'graphical.target' ? '5 (GUI)' : '3 (TUI CLI)';
        simOutput.innerHTML = `
          <span style="color: var(--text-muted);">$ systemctl get-default</span><br>
          <strong style="color: var(--accent-success); font-size: 1.05rem;">${cur}</strong> (Runlevel ${num})<br>
          <span style="color: var(--text-secondary);">Symlink target: /etc/systemd/system/default.target</span>
        `;
      });

      if (btnReboot) {
        btnReboot.addEventListener('click', () => {
          simOutput.innerHTML = `
            <span style="color: var(--accent-warning);">$ init 6</span><br>
            <span style="color: #f472b6;">Broadcast message from root@rhel10 (pts/0):</span><br>
            <span>The system is going down for reboot NOW! (reboot.target reached)</span><br>
            <span style="color: var(--accent-success);">[OK] Reboot sequence initialized... Restarting kernel.</span>
          `;
        });
      }

      if (btnPoweroff) {
        btnPoweroff.addEventListener('click', () => {
          simOutput.innerHTML = `
            <span style="color: #ef4444;">$ init 0</span><br>
            <span style="color: #ef4444;">Broadcast message from root@rhel10 (pts/0):</span><br>
            <span>The system is going down for poweroff NOW! (poweroff.target reached)</span><br>
            <span style="color: var(--text-muted);">[OK] Stopping all system units... System halted.</span>
          `;
        });
      }
    }

    // Step Tabs Handler for Password Reset Stepper
    const stepTabs = document.querySelectorAll('.step-tab');
    stepTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        stepTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const stepNum = tab.getAttribute('data-step');
        document.querySelectorAll('.step-content-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        const targetPane = document.getElementById(`reset-pane-${stepNum}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }


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
        outputDisplay.style.color = '#39ff14';
        outputDisplay.style.whiteSpace = 'pre-wrap';
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const target = targetInput ? targetInput.value.trim() : 'root@192.168.1.3';
        const output = processCommand('ssh-copy-id ' + target);
        outputDisplay.textContent = output;
        outputDisplay.style.color = '#39ff14';
        outputDisplay.style.whiteSpace = 'pre-wrap';
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
      logDisplay.textContent = `# ${cmdStr}\n\n` + (output || 'Transfer completed successfully.');
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (srcInput) srcInput.value = '/cisco/router1.txt';
        if (destInput) destInput.value = 'root@192.168.1.3:/home/';
        logDisplay.textContent = "Click 'Execute Transfer' to run scp or rsync simulation...";
      });
    }
  }


  
  // Firewall & Zone Manager Visualizer (firewall-cmd)
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
  }

  // Package Manager Visualizer (rpm, dnf, yum)
  function setupPackageVisualizer() {
    const pkgInput = document.getElementById('pkg-name-input');
    const rpmQBtn = document.getElementById('pkg-rpm-q-btn');
    const rpmIBtn = document.getElementById('pkg-rpm-i-btn');
    const rpmEBtn = document.getElementById('pkg-rpm-e-btn');
    const dnfInfoBtn = document.getElementById('pkg-dnf-info-btn');
    const dnfInstBtn = document.getElementById('pkg-dnf-inst-btn');
    const dnfRmBtn = document.getElementById('pkg-dnf-rm-btn');
    const dnfRepoBtn = document.getElementById('pkg-dnf-repo-btn');
    const dnfCleanBtn = document.getElementById('pkg-dnf-clean-btn');

    const cmdDisplay = document.getElementById('pkg-cmd-display');
    const logDisplay = document.getElementById('pkg-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function getPkg() {
      return (pkgInput && pkgInput.value.trim()) ? pkgInput.value.trim() : 'vsftpd';
    }

    function updateButtonLabels() {
      const pkg = getPkg();
      if (rpmQBtn) rpmQBtn.innerHTML = `<i class="fas fa-search"></i> rpm -q ${pkg}`;
      if (rpmIBtn) rpmIBtn.innerHTML = `<i class="fas fa-download"></i> rpm -ivh ${pkg}`;
      if (rpmEBtn) rpmEBtn.innerHTML = `<i class="fas fa-trash"></i> rpm -e ${pkg}`;
      if (dnfInfoBtn) dnfInfoBtn.innerHTML = `<i class="fas fa-info-circle"></i> dnf info ${pkg}`;
      if (dnfInstBtn) dnfInstBtn.innerHTML = `<i class="fas fa-plus-circle"></i> dnf install ${pkg}`;
      if (dnfRmBtn) dnfRmBtn.innerHTML = `<i class="fas fa-minus-circle"></i> dnf remove ${pkg}`;
    }

    if (pkgInput) {
      pkgInput.addEventListener('input', updateButtonLabels);
    }

    function runPkgCmd(cmdStr) {
      cmdDisplay.textContent = '# ' + cmdStr;
      const output = processCommand(cmdStr);
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = output || `Command '${cmdStr}' executed successfully.`;
    }

    if (rpmQBtn) rpmQBtn.addEventListener('click', () => runPkgCmd(`rpm -q ${getPkg()}`));
    if (rpmIBtn) rpmIBtn.addEventListener('click', () => runPkgCmd(`rpm -ivh ${getPkg()}-3.0.5.el10.x86_64.rpm`));
    if (rpmEBtn) rpmEBtn.addEventListener('click', () => runPkgCmd(`rpm -e ${getPkg()}`));
    if (dnfInfoBtn) dnfInfoBtn.addEventListener('click', () => runPkgCmd(`dnf info ${getPkg()}`));
    if (dnfInstBtn) dnfInstBtn.addEventListener('click', () => runPkgCmd(`dnf install ${getPkg()}`));
    if (dnfRmBtn) dnfRmBtn.addEventListener('click', () => runPkgCmd(`dnf remove ${getPkg()}`));
    if (dnfRepoBtn) dnfRepoBtn.addEventListener('click', () => runPkgCmd('dnf repolist'));
    if (dnfCleanBtn) dnfCleanBtn.addEventListener('click', () => runPkgCmd('dnf clean all'));
  }

  // Centralized YUM/DNF Repository Server Visualizer
  function setupYumServerVisualizer() {
    const s1Btn = document.getElementById('repo-step1-btn');
    const s2Btn = document.getElementById('repo-step2-btn');
    const s3Btn = document.getElementById('repo-step3-btn');
    const s4Btn = document.getElementById('repo-step4-btn');
    const s5Btn = document.getElementById('repo-step5-btn');
    const s6Btn = document.getElementById('repo-step6-btn');
    const s7Btn = document.getElementById('repo-step7-btn');

    const cmdDisplay = document.getElementById('repo-cmd-display');
    const logDisplay = document.getElementById('repo-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, log) {
      cmdDisplay.textContent = cmd;
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = log;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runStep(
        '# [server1] nmcli con add con-name server1 ifname enp0s3 ipv4.add 192.168.1.2/24 ... && hostnamectl set-hostname server1.example.com',
        '[root@server1 ~]# nmcli con up server1\nConnection "server1" (a1b2c3d4-e5f6-7890-abcd-1234567890ef) successfully activated.\n[root@server1 ~]# hostnamectl set-hostname server1.example.com\nStatic hostname set to server1.example.com'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runStep(
        '# [server1] yum install httpd -y && systemctl start httpd && systemctl enable httpd',
        '[root@server1 ~]# yum install httpd -y\nInstalling: httpd.x86_64 2.4.57-1.el10 (AppStream)... Complete!\n[root@server1 ~]# systemctl start httpd\n[root@server1 ~]# systemctl enable httpd\nCreated symlink /etc/systemd/system/multi-user.target.wants/httpd.service -> /usr/lib/systemd/system/httpd.service.'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runStep(
        '# [server1] cp -rvf AppStream /var/www/html/ && cp -rvf BaseOS /var/www/html/',
        '[root@server1 ~]# cd /run/media/root/RHEL-10-0-0-BaseOS-x86_64/\n[root@server1 ~]# cp -rvf AppStream /var/www/html/\n"AppStream/Packages" -> "/var/www/html/AppStream/Packages"\n[root@server1 ~]# cp -rvf BaseOS /var/www/html/\n"BaseOS/Packages" -> "/var/www/html/BaseOS/Packages"\n\nSUCCESS: Repositories published at http://192.168.1.2/AppStream and http://192.168.1.2/BaseOS'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runStep(
        '# [server1] vim /etc/yum.repos.d/server1.repo && firewall-cmd --permanent --add-service=http',
        '[root@server1 ~]# cat /etc/yum.repos.d/server1.repo\n[01]\nname=app\nbaseurl=http://192.168.1.2/AppStream\nenabled=1\ngpgcheck=0\n\n[02]\nname=base\nbaseurl=http://192.168.1.2/BaseOS\nenabled=1\ngpgcheck=0\n\n[root@server1 ~]# firewall-cmd --permanent --add-service=http && firewall-cmd --reload\nsuccess'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runStep(
        '# [server2] nmcli con add con-name server2 ifname enp0s3 ipv4.add 192.168.1.3/24 ... && hostnamectl set-hostname server2.example.com',
        '[root@server2 ~]# nmcli con up server2\nConnection "server2" (b9876543-2109-8765-4321-fe2109876543) successfully activated.\n[root@server2 ~]# hostnamectl set-hostname server2.example.com\nStatic hostname set to server2.example.com'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runStep(
        '# [server2] vim /etc/yum.repos.d/server1.repo',
        '[root@server2 ~]# cat /etc/yum.repos.d/server1.repo\n[01]\nname=app\nbaseurl=http://192.168.1.2/AppStream\nenabled=1\ngpgcheck=0\n\n[02]\nname=base\nbaseurl=http://192.168.1.2/BaseOS\nenabled=1\ngpgcheck=0\n\n[root@server2 ~]# yum repolist\nrepo id   repo name\napp       app\nbase      base'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runStep(
        '# [server2] yum install vsftpd -y',
        '[root@server2 ~]# yum install vsftpd -y\nDownloading Packages from http://192.168.1.2/AppStream...\nvsftpd-3.0.5-5.el10.x86_64.rpm           100% | 345 kB   00:00 (100 MB/s LAN)\nRunning transaction check\nTransaction test succeeded.\nRunning transaction\n  Installing       : vsftpd-3.0.5-5.el10.x86_64                                1/1\n  Verifying        : vsftpd-3.0.5-5.el10.x86_64                                1/1\n\nComplete! vsftpd installed successfully on client server2 from server1 HTTP repository.'
      );
    });
  }

  // Network File System (NFS) Server Visualizer
  function setupNfsVisualizer() {
    const s1Btn = document.getElementById('nfs-step1-btn');
    const s2Btn = document.getElementById('nfs-step2-btn');
    const s3Btn = document.getElementById('nfs-step3-btn');
    const s4Btn = document.getElementById('nfs-step4-btn');
    const s5Btn = document.getElementById('nfs-step5-btn');
    const s6Btn = document.getElementById('nfs-step6-btn');

    const cmdDisplay = document.getElementById('nfs-cmd-display');
    const logDisplay = document.getElementById('nfs-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, log) {
      cmdDisplay.textContent = cmd;
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = log;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runStep(
        '# [server1] yum install nfs* -y && systemctl start nfs-server && systemctl enable nfs-server',
        '[root@server1 ~]# yum install nfs-utils -y\nInstalling: nfs-utils.x86_64 1:2.6.2-4.el10... Complete!\n[root@server1 ~]# systemctl start nfs-server\n[root@server1 ~]# systemctl enable nfs-server\nCreated symlink /etc/systemd/system/multi-user.target.wants/nfs-server.service -> /usr/lib/systemd/system/nfs-server.service.'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runStep(
        '# [server1] mkdir /database && touch /database/test{1..5}.txt && chmod 1777 /database',
        '[root@server1 ~]# mkdir /database\n[root@server1 ~]# touch /database/test{1..5}.txt\n[root@server1 ~]# chmod 1777 /database\n[root@server1 ~]# ls -ld /database\ndrwxrwxrwt. 2 root root 92 Apr 12 10:20 /database'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runStep(
        '# [server1] vim /etc/exports && systemctl restart nfs-server',
        '[root@server1 ~]# cat /etc/exports\n/database   192.168.1.0/24(rw)\n\n[root@server1 ~]# systemctl restart nfs-server'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runStep(
        '# [server1] exportfs -rv && firewall-cmd --permanent --add-service=nfs && firewall-cmd --reload',
        '[root@server1 ~]# exportfs -rv\nexporting 192.168.1.0/24:/database\n[root@server1 ~]# firewall-cmd --permanent --add-service=nfs && firewall-cmd --reload\nsuccess'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runStep(
        '# [server2] mkdir /info && mount -t nfs 192.168.1.2:/database /info && ls /info',
        '[root@server2 ~]# mkdir /info\n[root@server2 ~]# mount -t nfs 192.168.1.2:/database /info\n[root@server2 ~]# ls -l /info\ntotal 0\n-rw-r--r--. 1 root root 0 Apr 12 10:20 test1.txt\n-rw-r--r--. 1 root root 0 Apr 12 10:20 test2.txt\n-rw-r--r--. 1 root root 0 Apr 12 10:20 test3.txt\n-rw-r--r--. 1 root root 0 Apr 12 10:20 test4.txt\n-rw-r--r--. 1 root root 0 Apr 12 10:20 test5.txt'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runStep(
        '# [server2] vim /etc/fstab && mount -a',
        '[root@server2 ~]# cat /etc/fstab\n192.168.1.2:/database   /info   nfs   defaults   0 0\n\n[root@server2 ~]# mount -a\n[root@server2 ~]# mount | grep nfs\n192.168.1.2:/database on /info type nfs4 (rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp)'
      );
    });
  }

  // Red Hat Subscription Manager Visualizer
  function setupSubManagerVisualizer() {
    const regBtn = document.getElementById('sub-register-btn');
    const listBtn = document.getElementById('sub-list-btn');
    const cleanBtn = document.getElementById('sub-clean-btn');
    const checkBtn = document.getElementById('sub-check-btn');
    const updateBtn = document.getElementById('sub-update-btn');
    const unregBtn = document.getElementById('sub-unregister-btn');

    const cmdDisplay = document.getElementById('sub-cmd-display');
    const logDisplay = document.getElementById('sub-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, log) {
      cmdDisplay.textContent = cmd;
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = log;
    }

    if (regBtn) regBtn.addEventListener('click', () => {
      runStep(
        '# subscription-manager register',
        '[root@rhel10 ~]# subscription-manager register\nRegistering to: subscription.rhsm.redhat.com:443/subscription\nUsername: student_redhat\nPassword: ********\nThe system has been registered with ID: 7c9a1234-5678-90ab-cdef-1234567890ab\nThe registered system name is: rhel10.example.com'
      );
    });

    if (listBtn) listBtn.addEventListener('click', () => {
      runStep(
        '# subscription-manager list',
        '[root@rhel10 ~]# subscription-manager list\n+-------------------------------------------+\n    Installed Product Status\n+-------------------------------------------+\nProduct Name:   Red Hat Enterprise Linux for x86_64\nProduct ID:     479\nVersion:        10.0\nArch:           x86_64\nStatus:         Subscribed\nStarts:         2026-01-01\nEnds:           2027-01-01'
      );
    });

    if (cleanBtn) cleanBtn.addEventListener('click', () => {
      runStep(
        '# yum clean all && yum repolist',
        '[root@rhel10 ~]# yum clean all\n18 files removed\n[root@rhel10 ~]# yum repolist\nUpdating Subscription Management repositories.\nrepo id                        repo name\nrhel-10-for-x86_64-appstream   Red Hat Enterprise Linux 10 AppStream\nrhel-10-for-x86_64-baseos      Red Hat Enterprise Linux 10 BaseOS'
      );
    });

    if (checkBtn) checkBtn.addEventListener('click', () => {
      runStep(
        '# rpm -q firefox',
        '[root@rhel10 ~]# rpm -q firefox\nfirefox-115.0-1.el10.x86_64'
      );
    });

    if (updateBtn) updateBtn.addEventListener('click', () => {
      runStep(
        '# yum update firefox -y',
        '[root@rhel10 ~]# yum update firefox -y\nUpdating Subscription Management repositories.\nDownloading Packages:\nfirefox-128.0-1.el10.x86_64.rpm          100% | 112 MB   00:02\nRunning transaction check\nTransaction test succeeded.\nRunning transaction\n  Upgrading        : firefox-128.0-1.el10.x86_64                                1/2\n  Cleanup          : firefox-115.0-1.el10.x86_64                                2/2\n  Verifying        : firefox-128.0-1.el10.x86_64                                1/2\n\nComplete! Firefox upgraded successfully over Red Hat CDN.'
      );
    });

    if (unregBtn) unregBtn.addEventListener('click', () => {
      runStep(
        '# subscription-manager unregister',
        '[root@rhel10 ~]# subscription-manager unregister\nUnregistering from: subscription.rhsm.redhat.com:443/subscription\nSystem has been unregistered.'
      );
    });
  }

  // SELinux Security (Security-Enhanced Linux) Visualizer
  function setupSelinuxVisualizer() {
    const s1Btn = document.getElementById('selinux-step1-btn');
    const s2Btn = document.getElementById('selinux-step2-btn');
    const s3Btn = document.getElementById('selinux-step3-btn');
    const s4Btn = document.getElementById('selinux-step4-btn');
    const s5Btn = document.getElementById('selinux-step5-btn');
    const s6Btn = document.getElementById('selinux-step6-btn');
    const s7Btn = document.getElementById('selinux-step7-btn');
    const s8Btn = document.getElementById('selinux-step8-btn');
    const s9Btn = document.getElementById('selinux-step9-btn');
    const s10Btn = document.getElementById('selinux-step10-btn');

    const cmdDisplay = document.getElementById('selinux-cmd-display');
    const logDisplay = document.getElementById('selinux-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, log) {
      cmdDisplay.textContent = cmd;
      logDisplay.style.whiteSpace = 'pre-wrap';
      logDisplay.style.color = '#39ff14';
      logDisplay.textContent = log;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runStep(
        '# getenforce && sestatus',
        '[root@rhel10 ~]# getenforce\nEnforcing\n\n[root@rhel10 ~]# sestatus\nSELinux status:                 enabled\nSELinuxfs mount:                /sys/fs/selinux\nSELinux root directory:         /etc/selinux\nLoaded policy name:             targeted\nCurrent mode:                   enforcing\nMode from config file:          enforcing'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runStep(
        '# setenforce permissive (or setenforce 0)',
        '[root@rhel10 ~]# setenforce 0\n[root@rhel10 ~]# getenforce\nPermissive\n[Audit Log Notice]: Policy violations will be logged to /var/log/audit/audit.log, but access will not be blocked.'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runStep(
        '# setenforce enforcing (or setenforce 1)',
        '[root@rhel10 ~]# setenforce 1\n[root@rhel10 ~]# getenforce\nEnforcing\n[Audit Log Notice]: SELinux Mandatory Access Control (MAC) is active. Policy violations strictly denied.'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runStep(
        '# vim /etc/selinux/config (Set line 22 SELINUX=enforcing)',
        '[root@rhel10 ~]# cat /etc/selinux/config\n# This file controls the state of SELinux on the system.\n# SELINUX= can take one of these three values:\n#     enforcing - SELinux security policy is enforced.\n#     permissive - SELinux prints warnings instead of enforcing.\n#     disabled - No SELinux policy is loaded.\nSELINUX=enforcing\nSELINUXTYPE=targeted\n\n[Notice]: Mode set to persistent Enforcing upon next system reboot.'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runStep(
        '# ls -ldZ /account && ls -ldZ /var/www/html/',
        '[root@rhel10 ~]# ls -ldZ /account\ndrwxr-xr-x. 2 root root unconfined_u:object_r:default_t:s0 20 May  1 10:00 /account\n\n[root@rhel10 ~]# ls -ldZ /var/www/html/\ndrwxr-xr-x. 2 root root system_u:object_r:httpd_sys_content_t:s0 4096 May 1 10:00 /var/www/html/\n\n[Notice]: Top-level /account directory inherited default_t context label.'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runStep(
        '# chcon -R -t httpd_sys_content_t /account && ls -ldZ /account',
        '[root@rhel10 ~]# chcon -R -t httpd_sys_content_t /account\n[root@rhel10 ~]# ls -ldZ /account\ndrwxr-xr-x. 2 root root unconfined_u:object_r:httpd_sys_content_t:s0 20 May 1 10:00 /account\n\n[Notice]: Context type temporarily changed to httpd_sys_content_t.'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runStep(
        '# restorecon -Rv /account',
        '[root@rhel10 ~]# restorecon -Rv /account\nRelabeled /account from unconfined_u:object_r:httpd_sys_content_t:s0 to unconfined_u:object_r:default_t:s0\n\n[Notice]: Restored original default policy context label default_t.'
      );
    });

    if (s8Btn) s8Btn.addEventListener('click', () => {
      runStep(
        '# semanage fcontext -a -t httpd_sys_content_t "/account(/.*)?" && restorecon -Rv /account',
        '[root@rhel10 ~]# semanage fcontext -a -t httpd_sys_content_t "/account(/.*)?"\n[root@rhel10 ~]# restorecon -Rv /account\nRelabeled /account from unconfined_u:object_r:default_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0\nRelabeled /account/index.html from unconfined_u:object_r:default_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0\n\n[Notice]: Added permanent context rule to SELinux database & applied to filesystem.'
      );
    });

    if (s9Btn) s9Btn.addEventListener('click', () => {
      runStep(
        '# semanage fcontext -C -l',
        '[root@rhel10 ~]# semanage fcontext -C -l\nSELinux fcontext                                   Type               Context\n\n/account(/.*)?                                     all files          system_u:object_r:httpd_sys_content_t:s0'
      );
    });

    if (s10Btn) s10Btn.addEventListener('click', () => {
      runStep(
        '# getsebool -a | grep -i radius && setsebool radius_use_jit on',
        '[root@rhel10 ~]# getsebool radius_use_jit\nradius_use_jit --> off\n\n[root@rhel10 ~]# setsebool radius_use_jit on (or setsebool radius_use_jit 1)\n[root@rhel10 ~]# getsebool radius_use_jit\nradius_use_jit --> on'
      );
    });
  }

  // Web Hosting & Apache Virtual Hosts Visualizer
  function setupWebServerVisualizer() {
    const s1Btn = document.getElementById('web-step1-btn');
    const s2Btn = document.getElementById('web-step2-btn');
    const s3Btn = document.getElementById('web-step3-btn');
    const s4Btn = document.getElementById('web-step4-btn');
    const s5Btn = document.getElementById('web-step5-btn');
    const s6Btn = document.getElementById('web-step6-btn');
    const s7Btn = document.getElementById('web-step7-btn');

    const s8Btn = document.getElementById('web-step8-btn');
    const s9Btn = document.getElementById('web-step9-btn');
    const s10Btn = document.getElementById('web-step10-btn');
    const s11Btn = document.getElementById('web-step11-btn');

    const cmdDisplay = document.getElementById('web-cmd-display');
    const logDisplay = document.getElementById('web-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, logHtml) {
      cmdDisplay.textContent = cmd;
      logDisplay.innerHTML = logHtml;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runStep(
        '# yum install httpd -y && systemctl start httpd && systemctl enable httpd && firewall-cmd --permanent --add-service=http && firewall-cmd --reload',
        '<span style="color:#39ff14;">[root@server1 ~]# yum install httpd -y</span>\nInstalling: httpd.x86_64 2.4.57-5.el10... Complete!\n<span style="color:#39ff14;">[root@server1 ~]# systemctl start httpd && systemctl enable httpd</span>\nCreated symlink /etc/systemd/system/multi-user.target.wants/httpd.service -> /usr/lib/systemd/system/httpd.service.\n<span style="color:#39ff14;">[root@server1 ~]# firewall-cmd --permanent --add-service=http && firewall-cmd --reload</span>\nsuccess\nsuccess'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runStep(
        '# vim /var/www/html/index.html',
        '<span style="color:#39ff14;">[root@server1 ~]# cat /var/www/html/index.html</span>\n&lt;html&gt;\n&lt;head&gt;&lt;title&gt;official&lt;/title&gt;&lt;/head&gt;\n&lt;body bgcolor=skyblue&gt;\n&lt;h1&gt;Welcome TATA Official Website&lt;/h1&gt;\n&lt;/body&gt;\n&lt;/html&gt;'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runStep(
        '# mkdir /account && vim /account/index.html && vim /etc/httpd/conf.d/account.conf',
        '<span style="color:#39ff14;">[root@server1 ~]# cat /account/index.html</span>\n&lt;html&gt;&lt;head&gt;&lt;title&gt;Account&lt;/title&gt;&lt;/head&gt;&lt;body bgcolor=yellow&gt;&lt;h1&gt;Welcome TATA Accountant Website&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;\n\n<span style="color:#39ff14;">[root@server1 ~]# cat /etc/httpd/conf.d/account.conf</span>\n&lt;VirtualHost *:80&gt;\n  ServerName account.tata.com\n  DocumentRoot /account/\n&lt;/VirtualHost&gt;\n&lt;Directory /account/&gt;\n  &lt;RequireAll&gt;Require all granted&lt;/RequireAll&gt;\n&lt;/Directory&gt;'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runStep(
        '# httpd -t && systemctl restart httpd && vim /etc/hosts',
        '<span style="color:#39ff14;">[root@server1 ~]# httpd -t</span>\nSyntax OK\n<span style="color:#39ff14;">[root@server1 ~]# systemctl restart httpd</span>\n<span style="color:#39ff14;">[root@server1 ~]# cat /etc/hosts</span>\n192.168.1.3   official.tata.com\n192.168.1.3   account.tata.com'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runStep(
        'Browser GET http://official.tata.com',
        '<div style="background-color: skyblue; color: #000; padding: 25px; border-radius: 8px; text-align: center; margin-top: 5px;"><h1 style="margin: 0; font-family: sans-serif; font-size: 1.5rem; color: #000;">Welcome TATA Official Website</h1><p style="margin-top: 10px; font-size: 0.85rem; color: #333;">URL: http://official.tata.com | DocumentRoot: /var/www/html/index.html</p></div>'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runStep(
        'Browser GET http://account.tata.com (Before SELinux fix)',
        '<div style="background-color: #ffebe9; color: #cf222e; padding: 20px; border-radius: 8px; border: 1px solid #ff8182; text-align: center; margin-top: 5px;"><h2 style="margin: 0; font-family: sans-serif; font-size: 1.3rem; color: #cf222e;"><i class="fas fa-ban"></i> HTTP 403 Forbidden</h2><p style="margin-top: 8px; font-size: 0.85rem; color: #57606a;">You don\'t have permission to access / on this server.<br><strong>Reason:</strong> SELinux security policy is enforcing (httpd_sys_content_t label missing on /account).</p></div>'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runStep(
        '# setenforce 0 (Permissive Mode Fix)',
        '<span style="color:#39ff14;">[root@server1 ~]# setenforce 0</span>\n[SELinux]: Mode updated to Permissive. Refreshing browser http://account.tata.com...\n\n<div style="background-color: yellow; color: #000; padding: 25px; border-radius: 8px; text-align: center; margin-top: 10px;"><h1 style="margin: 0; font-family: sans-serif; font-size: 1.5rem; color: #000;">Welcome TATA Accountant Website</h1><p style="margin-top: 10px; font-size: 0.85rem; color: #333;">URL: http://account.tata.com | DocumentRoot: /account/index.html | SELinux: Permissive</p></div>'
      );
    });

    if (s8Btn) s8Btn.addEventListener('click', () => {
      runStep(
        '# yum install mod_ssl openssl -y && firewall-cmd --permanent --add-service=https && firewall-cmd --reload',
        '<span style="color:#39ff14;">[root@server1 ~]# yum install mod_ssl openssl -y</span>\nInstalling: mod_ssl.x86_64 1:2.4.57-5.el10... Complete!\nInstalling: openssl.x86_64 1:3.0.7-27.el10... Complete!\n<span style="color:#39ff14;">[root@server1 ~]# firewall-cmd --permanent --add-service=https && firewall-cmd --reload</span>\nsuccess\nsuccess'
      );
    });

    if (s9Btn) s9Btn.addEventListener('click', () => {
      runStep(
        '# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /home/tata.key -out /home/tata.crt',
        '<span style="color:#39ff14;">[root@server1 ~]# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /home/tata.key -out /home/tata.crt</span>\nGenerating a RSA private key...\n..........+++++\nwritten /home/tata.key (2048 bits RSA private key)\nwritten /home/tata.crt (X.509 self-signed certificate, valid for 365 days)'
      );
    });

    if (s10Btn) s10Btn.addEventListener('click', () => {
      runStep(
        '# cp -rvf /home/tata.crt /etc/pki/tls/certs/ && cp -rvf /home/tata.key /etc/pki/tls/private/ && vim /etc/httpd/conf.d/tata.conf',
        '<span style="color:#39ff14;">[root@server1 ~]# cat /etc/httpd/conf.d/tata.conf</span>\n&lt;VirtualHost *:443&gt;\n  SSLEngine on\n  SSLCertificateFile /etc/pki/tls/certs/tata.crt\n  SSLCertificateKeyFile /etc/pki/tls/private/tata.key\n  ServerName finance.tata.com\n  DocumentRoot /var/www/html/\n&lt;/VirtualHost&gt;\n&lt;VirtualHost *:80&gt;\n  ServerName finance.tata.com\n  Redirect / https://finance.tata.com\n&lt;/VirtualHost&gt;\n\n<span style="color:#39ff14;">[root@server1 ~]# httpd -t && systemctl restart httpd</span>\nSyntax OK'
      );
    });

    if (s11Btn) s11Btn.addEventListener('click', () => {
      runStep(
        'Browser GET https://finance.tata.com (Port 443 SSL Encrypted)',
        '<div style="background-color: #d1e7dd; color: #0f5132; padding: 25px; border-radius: 8px; text-align: center; margin-top: 5px; border: 1.5px solid #badbcc;"><div style="display: inline-block; background-color: #0f5132; color: #fff; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; margin-bottom: 8px;"><i class="fas fa-lock"></i> SSL/TLS Encrypted (Port 443)</div><h1 style="margin: 0; font-family: sans-serif; font-size: 1.5rem; color: #0f5132;">Welcome TATA Finance Website</h1><p style="margin-top: 10px; font-size: 0.85rem; color: #146c43;">URL: https://finance.tata.com | Cert: /etc/pki/tls/certs/tata.crt | Redirect: HTTP 80 -> HTTPS 443</p></div>'
      );
    });
  }

  // MariaDB Database Visualizer
  function setupMariadbVisualizer() {
    const s1Btn = document.getElementById('maria-step1-btn');
    const s2Btn = document.getElementById('maria-step2-btn');
    const s3Btn = document.getElementById('maria-step3-btn');
    const s4Btn = document.getElementById('maria-step4-btn');
    const s5Btn = document.getElementById('maria-step5-btn');
    const s6Btn = document.getElementById('maria-step6-btn');
    const s7Btn = document.getElementById('maria-step7-btn');
    const s8Btn = document.getElementById('maria-step8-btn');

    const cmdDisplay = document.getElementById('maria-cmd-display');
    const logDisplay = document.getElementById('maria-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, logHtml) {
      cmdDisplay.textContent = cmd;
      logDisplay.innerHTML = logHtml;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runStep(
        '# yum install mariadb mariadb-server -y && systemctl start mariadb && systemctl enable mariadb',
        '<span style="color:#39ff14;">[root@server1 ~]# yum install mariadb mariadb-server -y</span>\nInstalling: mariadb.x86_64 3:10.11.6-1.el10... Complete!\nInstalling: mariadb-server.x86_64 3:10.11.6-1.el10... Complete!\n<span style="color:#39ff14;">[root@server1 ~]# systemctl start mariadb && systemctl enable mariadb</span>\nCreated symlink /etc/systemd/system/multi-user.target.wants/mariadb.service -> /usr/lib/systemd/system/mariadb.service.'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runStep(
        '# mysql_secure_installation',
        '<span style="color:#39ff14;">[root@server1 ~]# mysql_secure_installation</span>\nSet root password? [Y/n] Y -> Password set to: india\nRemove anonymous users? [Y/n] Y -> Success\nDisallow root login remotely? [Y/n] Y -> Success\nRemove test database? [Y/n] Y -> Success\nReload privilege tables? [Y/n] Y -> All done!'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runStep(
        '# mysql -u root -p (Password: india) -> create database mydb; grant all on mydb.* to harry@localhost identified by \'123\';',
        '<span style="color:#39ff14;">MariaDB [(none)]> create database mydb;</span>\nQuery OK, 1 row affected (0.00 sec)\n<span style="color:#39ff14;">MariaDB [(none)]> grant all on mydb.* to harry@localhost identified by \'123\';</span>\nQuery OK, 0 rows affected (0.01 sec)\n\n<span style="color:#39ff14;">[root@server1 ~]# mysql -u harry -p (Password: 123)</span>\nMariaDB [(none)]> show databases;\n+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| mydb               |\n+--------------------+'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runStep(
        '# mysql -u root -p -> create database employee; use employee; create table info ... insert values ...',
        '<span style="color:#39ff14;">MariaDB [employee]> select * from info;</span>\n+------+------+---------+---------+\n| ID   | Name | City    | PinCode |\n+------+------+---------+---------+\n|    1 | Ajay | Delhi   |  413123 |\n|    2 | John | Chennai |  411004 |\n|    3 | Sara | Mumbai  |  414001 |\n+------+------+---------+---------+\n3 rows in set (0.00 sec)'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runStep(
        '# mysqldump -u root -p employee > /home/emp.db',
        '<span style="color:#39ff14;">[root@server1 ~]# mysqldump -u root -p employee > /home/emp.db</span>\nEnter password: india\n<span style="color:#39ff14;">[root@server1 ~]# ls -l /home/emp.db</span>\n-rw-r--r--. 1 root root 2145 May 1 12:00 /home/emp.db\n[Database dump file generated successfully]'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runStep(
        '# mysql -u root -p -> drop database employee; show databases;',
        '<span style="color:#39ff14;">MariaDB [(none)]> drop database employee;</span>\nQuery OK, 1 row affected (0.02 sec)\n<span style="color:#39ff14;">MariaDB [(none)]> show databases;</span>\n+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| mydb               |\n| mysql              |\n+--------------------+\n[Database \'employee\' dropped! Data purged.]'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runStep(
        '# mysql -u root -p -> create database employee; exit; && mysql -u root -p=india employee < /home/emp.db',
        '<span style="color:#39ff14;">MariaDB [(none)]> create database employee;</span>\nQuery OK, 1 row affected (0.00 sec)\n<span style="color:#39ff14;">[root@server1 ~]# mysql -u root -p=india employee < /home/emp.db</span>\n[Import Complete! Restored 3 rows into info table.]\n\n<span style="color:#39ff14;">MariaDB [employee]> select * from info;</span>\n1 | Ajay | Delhi | 413123\n2 | John | Chennai | 411004\n3 | Sara | Mumbai | 414001'
      );
    });

    if (s8Btn) s8Btn.addEventListener('click', () => {
      runStep(
        '# mysqldump -u root -p=india employee > /home/emp.db && rsync -r /home/emp.db root@192.168.1.3:/backup/',
        '<span style="color:#39ff14;">[root@server1 ~]# rsync -r /home/emp.db root@192.168.1.3:/backup/</span>\nsending incremental file list\nemp.db\n          2,145 100%    2.05MB/s    0:00:00 (xfr#1, to-chk=0/1)\n\n[Offsite Backup Synchronized to 192.168.1.3:/backup/emp.db]'
      );
    });
  }

  // Soft & Hard Link Visualizer
  function setupLinkVisualizer() {
    const s1Btn = document.getElementById('link-step1-btn');
    const s2Btn = document.getElementById('link-step2-btn');
    const s3Btn = document.getElementById('link-step3-btn');
    const s4Btn = document.getElementById('link-step4-btn');
    const s5Btn = document.getElementById('link-step5-btn');
    const s6Btn = document.getElementById('link-step6-btn');

    const cmdDisplay = document.getElementById('link-cmd-display');
    const logDisplay = document.getElementById('link-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runStep(cmd, logHtml) {
      cmdDisplay.textContent = cmd;
      logDisplay.innerHTML = logHtml;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runStep(
        '# echo "Sample Data A" > /home/filea.txt && echo "Sample Data 1" > /home/file1.txt',
        '<span style="color:#39ff14;">[root@server1 ~]# echo "Sample Data A" > /home/filea.txt && echo "Sample Data 1" > /home/file1.txt</span>\nTarget files initialized in /home directory.\n\n<span style="color:#39ff14;">[root@server1 ~]# ls -li /home/filea.txt /home/file1.txt</span>\n1048577 -rw-r--r--. 1 root root 14 May  1 10:00 /home/filea.txt\n3145729 -rw-r--r--. 1 root root 14 May  1 10:00 /home/file1.txt'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runStep(
        '# ln -s /home/filea.txt /root/fileb.txt',
        '<span style="color:#39ff14;">[root@server1 ~]# ln -s /home/filea.txt /root/fileb.txt</span>\nSymbolic (Soft) Link created successfully.\n/root/fileb.txt -> /home/filea.txt'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runStep(
        '# ln /home/file1.txt /root/file2.txt',
        '<span style="color:#39ff14;">[root@server1 ~]# ln /home/file1.txt /root/file2.txt</span>\nHard Link created successfully.\n/root/file2.txt shares same inode as /home/file1.txt'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runStep(
        '# ls -li /home/filea.txt /root/fileb.txt /home/file1.txt /root/file2.txt',
        '<span style="color:#39ff14;">[root@server1 ~]# ls -li /home/filea.txt /root/fileb.txt</span>\n<span style="color:#00ffff;">1048577</span> -rw-r--r--. 1 root root 14 May 1 10:00 /home/filea.txt\n<span style="color:#ff7b72;">2097153</span> lrwxrwxrwx. 1 root root 15 May 1 10:01 /root/fileb.txt -> /home/filea.txt\n(Soft link has DIFFERENT inode: 2097153 vs 1048577)\n\n<span style="color:#39ff14;">[root@server1 ~]# ls -li /home/file1.txt /root/file2.txt</span>\n<span style="color:#39ff14;">3145729</span> -rw-r--r--. 2 root root 14 May 1 10:00 /home/file1.txt\n<span style="color:#39ff14;">3145729</span> -rw-r--r--. 2 root root 14 May 1 10:05 /root/file2.txt\n(Hard link has SAME inode: 3145729 and link count = 2)'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runStep(
        '# rm -f /home/filea.txt && cat /root/fileb.txt',
        '<span style="color:#39ff14;">[root@server1 ~]# rm -f /home/filea.txt</span>\n<span style="color:#ff7b72;">[root@server1 ~]# cat /root/fileb.txt</span>\ncat: /root/fileb.txt: No such file or directory\n<span style="color:#ff7b72;">[Result]: Soft link /root/fileb.txt is now BROKEN (dangling pointer) because target file /home/filea.txt was deleted!</span>'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runStep(
        '# rm -f /home/file1.txt && cat /root/file2.txt',
        '<span style="color:#39ff14;">[root@server1 ~]# rm -f /home/file1.txt</span>\n<span style="color:#39ff14;">[root@server1 ~]# cat /root/file2.txt</span>\nSample Data 1\n<span style="color:#39ff14;">[Result]: Hard link /root/file2.txt STILL WORKS perfectly! Data is preserved because inode 3145729 still has link count = 1.</span>'
      );
    });
  }

  // RHEL Lightspeed AI Assistant Visualizer
  function setupLightspeedVisualizer() {
    const selectEl = document.getElementById('lightspeed-query-select');
    const inputEl = document.getElementById('lightspeed-query-input');
    const askBtn = document.getElementById('lightspeed-ask-btn');

    const b1 = document.getElementById('ls-btn-1');
    const b2 = document.getElementById('ls-btn-2');
    const b3 = document.getElementById('ls-btn-3');
    const b4 = document.getElementById('ls-btn-4');
    const b5 = document.getElementById('ls-btn-5');

    const cmdDisplay = document.getElementById('lightspeed-cmd-display');
    const logDisplay = document.getElementById('lightspeed-log-display');

    if (!cmdDisplay || !logDisplay) return;

    const aiKnowledgeBase = {
      "how to reset root password": {
        cmd: '[student@rhel10 ~]$ c "how to reset root password"',
        resp: '<span style="color:#00ffff;">🤖 RHEL Lightspeed AI Assistant Analysis:</span>\nTo reset the root password on RHEL 10 via GRUB recovery:\n\n1. Reboot system and interrupt GRUB menu (press \'e\' on top entry).\n2. Append <span style="color:#ffc107;">rd.break</span> to kernel command line end (line starting with linux).\n3. Press Ctrl+x to boot into emergency ramfs shell.\n4. Mount /sysroot with read-write permissions:\n   <span style="color:#39ff14;">mount -o remount,rw /sysroot</span>\n5. Switch root environment:\n   <span style="color:#39ff14;">chroot /sysroot</span>\n6. Reset root password:\n   <span style="color:#39ff14;">passwd root</span>\n7. Trigger SELinux relabel on next boot:\n   <span style="color:#39ff14;">touch /.autorelabel</span>\n8. Exit twice to reboot: <span style="color:#39ff14;">exit && exit</span>'
      },
      "explain: Failed to start httpd.service": {
        cmd: '[student@rhel10 ~]$ c "explain: Failed to start httpd.service"',
        resp: '<span style="color:#00ffff;">🤖 RHEL Lightspeed AI Diagnostic Report:</span>\nhttpd.service failed to bind to port 80.\n\n<span style="color:#ff7b72;">[Detected Root Causes]:</span>\n1. Port Conflict: Another daemon (e.g. nginx) is already listening on Port 80.\n2. SELinux Policy: DocumentRoot set to custom path without httpd_sys_content_t label.\n3. Syntax Error: Invalid directive in /etc/httpd/conf.d/*.conf\n\n<span style="color:#39ff14;">[Recommended Fix Sequence]:</span>\n• Test configuration syntax: <span style="color:#39ff14;">httpd -t</span>\n• Check port conflict: <span style="color:#39ff14;">ss -tulpn | grep :80</span>\n• Inspect journal log: <span style="color:#39ff14;">journalctl -u httpd.service -e</span>\n• Fix SELinux context: <span style="color:#39ff14;">restorecon -Rv /var/www/html</span>'
      },
      "configure firewalld to allow HTTPS": {
        cmd: '[student@rhel10 ~]$ c "configure firewalld to allow HTTPS"',
        resp: '<span style="color:#00ffff;">🤖 RHEL Lightspeed Command Generator:</span>\nTo permanently open network Port 443 for HTTPS web traffic in firewalld:\n\n1. Add https service to permanent zone rules:\n   <span style="color:#39ff14;">sudo firewall-cmd --permanent --add-service=https</span>\n2. Reload active firewalld configuration:\n   <span style="color:#39ff14;">sudo firewall-cmd --reload</span>\n3. Verify open services:\n   <span style="color:#39ff14;">sudo firewall-cmd --list-services</span>\n   (Output should include: dhcpv6-client https ssh)'
      },
      "analyze /var/log/messages": {
        cmd: '[student@rhel10 ~]$ c "analyze /var/log/messages"',
        resp: '<span style="color:#00ffff;">🤖 RHEL Lightspeed Log Parser Summary (/var/log/messages):</span>\nScanned 1,482 lines in /var/log/messages.\n\n<span style="color:#ffc107;">[Key Events Discovered]:</span>\n• 10:14:02 rhel10 systemd[1]: Started MariaDB Database Server.\n• 10:15:30 rhel10 kernel: Out of memory: Kill process 4821 (java) score 850.\n• 10:20:11 rhel10 NetworkManager[912]: State change CONNECTED -> DISCONNECTED.\n\n<span style="color:#39ff14;">[AI Recommendation]:</span> High memory pressure triggered kernel OOM Killer. Consider increasing swap allocation or tuning JVM heap memory.'
      },
      "explain: nmcli connection add type ethernet ifname enp0s3": {
        cmd: '[student@rhel10 ~]$ c "explain: nmcli connection add type ethernet ifname enp0s3"',
        resp: '<span style="color:#00ffff;">🤖 RHEL Lightspeed Command Syntax Breakdown:</span>\n• <span style="color:#ffc107;">nmcli</span>: NetworkManager command-line utility interface.\n• <span style="color:#ffc107;">connection add</span>: Creates a new persistent network connection profile in /etc/NetworkManager/system-connections/.\n• <span style="color:#ffc107;">type ethernet</span>: Specifies layer-2 interface media hardware type (IEEE 802.3 wired Ethernet).\n• <span style="color:#ffc107;">ifname enp0s3</span>: Binds this connection profile directly to physical network device interface "enp0s3".'
      },
      "fix selinux avc denial for httpd": {
        cmd: '[student@rhel10 ~]$ c "fix selinux avc denial for httpd"',
        resp: '<span style="color:#00ffff;">🤖 RHEL Lightspeed SELinux Remediation Guide:</span>\nApache (httpd) was blocked accessing custom path /account by SELinux AVC Policy.\n\n1. Define persistent context rule:\n   <span style="color:#39ff14;">sudo semanage fcontext -a -t httpd_sys_content_t "/account(/.*)?"</span>\n2. Apply file context recursively:\n   <span style="color:#39ff14;">sudo restorecon -Rv /account</span>\n3. Verify file label:\n   <span style="color:#39ff14;">ls -lZ /account</span>\n   (Output should show: unconfined_u:object_r:httpd_sys_content_t:s0)'
      }
    };

    function processQuery(promptText) {
      const q = promptText.trim();
      cmdDisplay.textContent = `[student@rhel10 ~]$ c "${q}"`;

      // Match exact or fallback
      let matched = aiKnowledgeBase[q];
      if (!matched) {
        // Soft match search
        const keys = Object.keys(aiKnowledgeBase);
        const foundKey = keys.find(k => k.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(k.toLowerCase()));
        if (foundKey) matched = aiKnowledgeBase[foundKey];
      }

      if (matched) {
        logDisplay.innerHTML = matched.resp;
      } else {
        logDisplay.innerHTML = `<span style="color:#00ffff;">🤖 RHEL Lightspeed AI Assistant Response:</span>\nQuery: <span style="color:#ffc107;">"${q}"</span>\n\n<span style="color:#39ff14;">[Synthesized Solution from RHEL 10 Documentation & KB]:</span>\nExecuting system query for "${q}"...\n1. Querying Red Hat Knowledgebase & RHEL 10 Command Index.\n2. Recommended CLI Command:\n   <span style="color:#39ff14;"># sudo dnf install command-line-assistant -y && c --help</span>\n3. System log analysis: Check <span style="color:#39ff14;">journalctl -xeu ${q.split(' ')[0]}</span> for active service status.`;
      }
    }

    if (selectEl) {
      selectEl.addEventListener('change', () => {
        if (inputEl) inputEl.value = selectEl.value;
        processQuery(selectEl.value);
      });
    }

    if (askBtn) {
      askBtn.addEventListener('click', () => {
        const val = inputEl ? inputEl.value : (selectEl ? selectEl.value : '');
        if (val) processQuery(val);
      });
    }

    if (b1) b1.addEventListener('click', () => { if (inputEl) inputEl.value = "how to reset root password"; processQuery("how to reset root password"); });
    if (b2) b2.addEventListener('click', () => { if (inputEl) inputEl.value = "explain: Failed to start httpd.service"; processQuery("explain: Failed to start httpd.service"); });
    if (b3) b3.addEventListener('click', () => { if (inputEl) inputEl.value = "configure firewalld to allow HTTPS"; processQuery("configure firewalld to allow HTTPS"); });
    if (b4) b4.addEventListener('click', () => { if (inputEl) inputEl.value = "analyze /var/log/messages"; processQuery("analyze /var/log/messages"); });
    if (b5) b5.addEventListener('click', () => { if (inputEl) inputEl.value = "explain: nmcli connection add type ethernet ifname enp0s3"; processQuery("explain: nmcli connection add type ethernet ifname enp0s3"); });
  }

  // Flatpak Package Manager Visualizer
  function setupFlatpakVisualizer() {
    const appInput = document.getElementById('flatpak-app-input');
    const userCb = document.getElementById('flatpak-user-mode-cb');

    const s1Btn = document.getElementById('fp-step1-btn');
    const s2Btn = document.getElementById('fp-step2-btn');
    const s3Btn = document.getElementById('fp-step3-btn');
    const s4Btn = document.getElementById('fp-step4-btn');
    const s5Btn = document.getElementById('fp-step5-btn');
    const s6Btn = document.getElementById('fp-step6-btn');
    const s7Btn = document.getElementById('fp-step7-btn');
    const s8Btn = document.getElementById('fp-step8-btn');
    const s9Btn = document.getElementById('fp-step9-btn');

    const cmdDisplay = document.getElementById('flatpak-cmd-display');
    const logDisplay = document.getElementById('flatpak-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runFpStep(cmdStr, logOutput) {
      cmdDisplay.textContent = cmdStr;
      logDisplay.innerHTML = logOutput;
    }

    function getAppId() {
      return appInput ? (appInput.value.trim() || 'org.mozilla.firefox') : 'org.mozilla.firefox';
    }

    function isUserMode() {
      return userCb ? userCb.checked : false;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runFpStep(
        '$ flatpak --version && rpm -q flatpak',
        '<span style="color:#39ff14;">Flatpak 1.14.8</span>\nflatpak-1.14.8-2.el10.x86_64\n\n<span style="color:#00ffff;">[System Status]:</span> Flatpak universal application subsystem is installed and ready on RHEL 10.'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runFpStep(
        '$ flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo && flatpak remotes',
        '<span style="color:#39ff14;">Remote "flathub" added successfully.</span>\n\n<span style="color:#00ffff;">[Active Flatpak Remotes]:</span>\nName    Options  Url\nflathub system   https://dl.flathub.org/repo/'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      const app = getAppId().split('.')[2] || getAppId();
      runFpStep(
        `$ flatpak search ${app}`,
        `<span style="color:#00ffff;">Name            Description                            Application ID       Version   Branch  Remotes</span>\nMozilla Firefox Fast, Private & Free Web Browser        <span style="color:#39ff14;">org.mozilla.firefox</span>  125.0.3   stable  flathub\nGNU Image Prep  GIMP Image Manipulation Program        org.gimp.GIMP        2.10.36   stable  flathub`
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      const app = getAppId();
      const flag = isUserMode() ? '--user ' : '';
      const targetDir = isUserMode() ? '~/.local/share/flatpak/' : '/var/lib/flatpak/';

      runFpStep(
        `$ flatpak install ${flag}flathub ${app} -y`,
        `<span style="color:#39ff14;">Looking for matches...</span>\nRequired runtime for ${app} (org.freedesktop.Platform/x86_64/23.08) found in remote flathub\nDownloading 1/2 runtimes... [====================] 100%\nInstalling 2/2 application ${app}... [====================] 100%\n\n<span style="color:#00ffff;">[Installation Complete]:</span> App installed in sandbox location: <span style="color:#ffc107;">${targetDir}</span>`
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      const app = getAppId();
      runFpStep(
        `$ flatpak run ${app}`,
        `<span style="color:#39ff14;">Launching ${app} in isolated sandbox container...</span>\n[Flatpak Sandbox]: Network namespace connected, Wayland display socket bound, file access isolated.\nApplication instance initialized successfully.`
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runFpStep(
        '$ flatpak list',
        '<span style="color:#00ffff;">Name            Application ID       Version   Branch  Installation</span>\nFirefox         org.mozilla.firefox  125.0.3   stable  system\nFreedesktop SDK org.freedesktop.Platform 23.08.12 stable  system\nGNOME Application Platform org.gnome.Platform 46     stable  system'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runFpStep(
        '$ flatpak update',
        '<span style="color:#39ff14;">Looking for updates...</span>\n1. org.mozilla.firefox  125.0.3 -> 125.0.4  flathub\n2. org.freedesktop.Platform 23.08.12 -> 23.08.14 flathub\nUpdating 2 packages... [====================] 100%\nAll Flatpak applications and runtime frameworks are up to date!'
      );
    });

    if (s8Btn) s8Btn.addEventListener('click', () => {
      const app = getAppId();
      const flag = isUserMode() ? '--user ' : '';
      runFpStep(
        `$ flatpak uninstall ${flag}${app} -y`,
        `<span style="color:#ff7b72;">Uninstalling ${app}...</span>\nApplication binary files, desktop shortcuts, and sandbox profiles removed.\nNote: Run 'flatpak uninstall --unused' to purge orphaned runtime dependencies.`
      );
    });

    if (s9Btn) s9Btn.addEventListener('click', () => {
      runFpStep(
        '$ flatpak uninstall --unused -y',
        '<span style="color:#39ff14;">Scanning for unused runtimes...</span>\nPruning: org.freedesktop.Platform/x86_64/22.08 (1.2 GB)\nPruning: org.gnome.Platform/x86_64/44 (850 MB)\n\n<span style="color:#00ffff;">[Cleanup Complete]:</span> 2.05 GB of unused runtime dependencies purged successfully.'
      );
    });
  }

  // System Performance Tuning & Monitoring Visualizer
  function setupPerformanceVisualizer() {
    const s1Btn = document.getElementById('perf-step1-btn');
    const s2Btn = document.getElementById('perf-step2-btn');
    const s3Btn = document.getElementById('perf-step3-btn');
    const s4Btn = document.getElementById('perf-step4-btn');
    const s5Btn = document.getElementById('perf-step5-btn');
    const s6Btn = document.getElementById('perf-step6-btn');
    const s7Btn = document.getElementById('perf-step7-btn');
    const s8Btn = document.getElementById('perf-step8-btn');
    const s9Btn = document.getElementById('perf-step9-btn');

    const cmdDisplay = document.getElementById('perf-cmd-display');
    const logDisplay = document.getElementById('perf-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runPerfStep(cmdStr, logOutput) {
      cmdDisplay.textContent = cmdStr;
      logDisplay.innerHTML = logOutput;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runPerfStep(
        '# tuned-adm active',
        '<span style="color:#39ff14;">Current active profile: virtual-guest</span>\n[tuned daemon active]: Dynamic tuning governor enabled (CPU scaling: performance, disk scheduler: mq-deadline).'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runPerfStep(
        '# tuned-adm list',
        '<span style="color:#00ffff;">Available profiles:</span>\n- balanced                    - General performance & power balance\n- desktop                     - Optimized for desktop workloads\n- latency-performance         - Low latency tuning for realtime tasks\n- powersave                   - Maximum power saving mode\n- throughput-performance      - Maximum disk/network I/O throughput\n- virtual-guest               - Optimized for RHEL KVM/VMware guests\n- virtual-host                - Enterprise KVM hypervisor host'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runPerfStep(
        '# tuned-adm recommend',
        '<span style="color:#39ff14;">virtual-guest</span>\n\n<span style="color:#00ffff;">[Tuned Recommendation Algorithm]:</span> Detected virtualized hardware hypervisor topology. Recommended profile: <span style="color:#ffc107;">virtual-guest</span>.'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runPerfStep(
        '# tuned-adm profile throughput-performance && tuned-adm active',
        '<span style="color:#39ff14;">Switching active profile to throughput-performance...</span>\n\n<span style="color:#00ffff;">Current active profile: throughput-performance</span>\nApplied kernel parameters: sysctl vm.dirty_ratio=40, governor=performance, I/O scheduler=kyber.'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runPerfStep(
        '# ps -eo user,pid,%mem,%cpu,cmd --sort=-%mem | head',
        '<span style="color:#00ffff;">USER       PID %MEM %CPU COMMAND</span>\nmysql     3410  8.5  1.2 /usr/libexec/mariadbd --basedir=/usr\napache    4512  4.2  0.8 /usr/sbin/httpd -DFOREGROUND\napache    4513  4.1  0.7 /usr/sbin/httpd -DFOREGROUND\nroot      1204  2.8  0.4 /usr/bin/python3 /usr/bin/tuned -l -P\nroot         1  1.5  0.1 /usr/lib/systemd/systemd --system'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runPerfStep(
        '# ps -ef --forest | grep httpd',
        '<span style="color:#00ffff;">UID        PID  PPID  C STIME TTY          TIME CMD</span>\nroot      4511     1  0 10:00 ?        00:00:01 /usr/sbin/httpd -DFOREGROUND\napache    4512  4511  0 10:00 ?        00:00:00  \\_ /usr/sbin/httpd -DFOREGROUND\napache    4513  4511  0 10:00 ?        00:00:00  \\_ /usr/sbin/httpd -DFOREGROUND'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runPerfStep(
        '# netstat -a | head -n 10',
        '<span style="color:#00ffff;">Active Internet connections (servers and established)</span>\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN\ntcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN\ntcp        0      0 0.0.0.0:3306            0.0.0.0:*               LISTEN\ntcp        0      0 192.168.1.10:22         192.168.1.50:52410      ESTABLISHED'
      );
    });

    if (s8Btn) s8Btn.addEventListener('click', () => {
      runPerfStep(
        '# lscpu',
        '<span style="color:#00ffff;">Architecture:</span>          x86_64\n<span style="color:#00ffff;">CPU op-mode(s):</span>        32-bit, 64-bit\n<span style="color:#00ffff;">Address sizes:</span>         39 bits physical, 48 bits virtual\n<span style="color:#00ffff;">CPU(s):</span>                4\n<span style="color:#00ffff;">Thread(s) per core:</span>    2\n<span style="color:#00ffff;">Core(s) per socket:</span>    2\n<span style="color:#00ffff;">Socket(s):</span>             1\n<span style="color:#00ffff;">Vendor ID:</span>             GenuineIntel\n<span style="color:#00ffff;">Model name:</span>            Intel(R) Xeon(R) CPU @ 2.80GHz\n<span style="color:#00ffff;">Virtualization:</span>        VT-x'
      );
    });

    if (s9Btn) s9Btn.addEventListener('click', () => {
      runPerfStep(
        '# lshw -short',
        '<span style="color:#00ffff;">H/W path           Device     Class          Description</span>\n========================================================\n                              system         Computer\n/0                            bus            Motherboard\n/0/0                          memory         16GiB System Memory\n/0/1               cpu        processor      Intel(R) Xeon(R) CPU @ 2.80GHz\n/0/100             /dev/sda   disk           100GB Virtual Volume'
      );
    });
  }

  // System Logging & Analysis Visualizer
  function setupLoggingVisualizer() {
    const s1Btn = document.getElementById('log-step1-btn');
    const s2Btn = document.getElementById('log-step2-btn');
    const s3Btn = document.getElementById('log-step3-btn');
    const s4Btn = document.getElementById('log-step4-btn');
    const s5Btn = document.getElementById('log-step5-btn');
    const s6Btn = document.getElementById('log-step6-btn');
    const s7Btn = document.getElementById('log-step7-btn');
    const s8Btn = document.getElementById('log-step8-btn');
    const s9Btn = document.getElementById('log-step9-btn');

    const cmdDisplay = document.getElementById('log-cmd-display');
    const logDisplay = document.getElementById('log-log-display');

    if (!cmdDisplay || !logDisplay) return;

    function runLogStep(cmdStr, logOutput) {
      cmdDisplay.textContent = cmdStr;
      logDisplay.innerHTML = logOutput;
    }

    if (s1Btn) s1Btn.addEventListener('click', () => {
      runLogStep(
        '# cat /var/log/messages | tail -n 6',
        '<span style="color:#00ffff;">Jul 23 10:00:12 server1 kernel:</span> Linux version 6.8.0-10-generic (mock@rhel10-builder)\n<span style="color:#00ffff;">Jul 23 10:00:14 server1 systemd[1]:</span> Reached target Network (Pre).\n<span style="color:#39ff14;">Jul 23 10:00:15 server1 NetworkManager[980]:</span> [1721728815.102] NetworkManager (version 1.46.0) starting...\n<span style="color:#00ffff;">Jul 23 10:00:18 server1 rsyslogd[1120]:</span> [origin software="rsyslogd" start] daemon initialized.\n<span style="color:#00ffff;">Jul 23 10:01:05 server1 systemd[1]:</span> Started Dynamic System Tuning Daemon (tuned.service).'
      );
    });

    if (s2Btn) s2Btn.addEventListener('click', () => {
      runLogStep(
        '# tail -f /var/log/secure',
        '<span style="color:#39ff14;">Jul 23 10:14:02 server1 sshd[3820]:</span> Accepted password for root from 192.168.1.50 port 54102 ssh2\n<span style="color:#00ffff;">Jul 23 10:14:02 server1 sshd[3820]:</span> pam_unix(sshd:session): session opened for user root by (uid=0)\n<span style="color:#ff7b72;">Jul 23 10:15:30 server1 sudo[4102]:</span>  sachin : TTY=pts/1 ; PWD=/home/sachin ; USER=root ; COMMAND=/usr/bin/dnf install nginx -y'
      );
    });

    if (s3Btn) s3Btn.addEventListener('click', () => {
      runLogStep(
        '# cat /var/log/boot.log | head -n 6',
        '<span style="color:#39ff14;">[  OK  ]</span> Started Show Plymouth Boot Screen.\n<span style="color:#39ff14;">[  OK  ]</span> Reached target Local File Systems (Pre).\n<span style="color:#39ff14;">[  OK  ]</span> Mounting /boot/efi...\n<span style="color:#39ff14;">[  OK  ]</span> Mounted /boot/efi.\n<span style="color:#39ff14;">[  OK  ]</span> Reached target Local File Systems.\n<span style="color:#39ff14;">[  OK  ]</span> Started Security Auditing Service.'
      );
    });

    if (s4Btn) s4Btn.addEventListener('click', () => {
      runLogStep(
        '# cat /var/log/dnf.log | tail -n 5',
        '<span style="color:#00ffff;">2026-07-23T10:05:12+0000 INFO</span> DNF version: 4.14.0\n<span style="color:#00ffff;">2026-07-23T10:05:14+0000 SUB-RECORD</span> Installed: httpd-2.4.57-5.el10.x86_64\n<span style="color:#39ff14;">2026-07-23T10:05:15+0000 SUCCESS</span> Command "dnf install httpd -y" completed successfully.'
      );
    });

    if (s5Btn) s5Btn.addEventListener('click', () => {
      runLogStep(
        '# last -f /var/log/btmp',
        '<span style="color:#ff7b72;">hacker   ssh:notty    192.168.1.200    Thu Jul 23 09:45 - 09:45  (00:00)</span>\n<span style="color:#ff7b72;">admin    pts/0        192.168.1.105    Thu Jul 23 09:12 - 09:12  (00:00)</span>\n\n<span style="color:#00ffff;">btmp begins Thu Jul  1 00:00:00 2026</span>'
      );
    });

    if (s6Btn) s6Btn.addEventListener('click', () => {
      runLogStep(
        '# lastlog | head -n 6',
        '<span style="color:#00ffff;">Username         Port     From             Latest</span>\nroot             pts/0    192.168.1.50     Thu Jul 23 10:14:02 +0000 2026\nbin                                        **Never logged in**\ndaemon                                     **Never logged in**\nsachin           pts/1    192.168.1.55     Thu Jul 23 08:30:11 +0000 2026'
      );
    });

    if (s7Btn) s7Btn.addEventListener('click', () => {
      runLogStep(
        '# tail -f /var/log/audit/audit.log',
        '<span style="color:#00ffff;">type=SYSCALL msg=audit(1721728815.102:402):</span> arch=c000003e syscall=2 success=yes exit=3 a0=7ffc... items=1 ppid=1 pid=4511 auid=1000 uid=0 gid=0 euid=0\n<span style="color:#ff7b72;">type=AVC msg=audit(1721728820.204:403):</span> avc: denied { read } for pid=4512 comm="httpd" name="index.html" dev="sda1" ino=14205 scontext=system_u:system_r:httpd_t:s0 tcontext=unconfined_u:object_r:user_home_t:s0 tclass=file permissive=0'
      );
    });

    if (s8Btn) s8Btn.addEventListener('click', () => {
      runLogStep(
        '# cat /var/log/cron | tail -n 5',
        '<span style="color:#00ffff;">Jul 23 10:00:01 server1 CROND[4890]:</span> (root) CMD (/usr/local/bin/backup.sh > /dev/null 2>&1)\n<span style="color:#39ff14;">Jul 23 10:01:00 server1 CROND[4920]:</span> (sachin) CMD (python3 /home/sachin/report.py)\n<span style="color:#00ffff;">Jul 23 10:05:01 server1 CROND[4980]:</span> (root) CMD (/usr/lib64/sa/sa1 1 1)'
      );
    });

    if (s9Btn) s9Btn.addEventListener('click', () => {
      runLogStep(
        '# journalctl -u httpd.service --since "1 hour ago" -n 5',
        '<span style="color:#00ffff;">-- Logs begin at Thu 2026-07-23 00:00:00 UTC, end at Thu 2026-07-23 10:20:00 UTC. --</span>\nJul 23 10:00:10 server1 systemd[1]: Starting The Apache HTTP Server...\nJul 23 10:00:11 server1 httpd[4511]: AH00558: httpd: Could not reliably determine host domain name\n<span style="color:#39ff14;">Jul 23 10:00:11 server1 systemd[1]: Started The Apache HTTP Server.</span>'
      );
    });
  }

  // RHCSA / RHEL 10 Practical Exam Lab Visualizer
  function setupRhcsaVisualizer() {
    const taskSelect = document.getElementById('rhcsa-task-select');
    const reqText = document.getElementById('rhcsa-req-text');
    const tipText = document.getElementById('rhcsa-tip-text');
    const runBtn = document.getElementById('rhcsa-run-btn');
    const verifyBtn = document.getElementById('rhcsa-verify-btn');
    const terminalOutput = document.getElementById('rhcsa-terminal-output');

    if (!taskSelect || !terminalOutput) return;

    const taskData = {
      '1': {
        req: 'Create user Angelina with explicit UID 2332.',
        tip: 'Verifies custom UID assignment in /etc/passwd using useradd -u 2332.',
        cmd: '# useradd -u 2332 Angelina\n# id Angelina',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# useradd -u 2332 Angelina</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# id Angelina</span>\nuid=2332(Angelina) gid=2332(Angelina) groups=2332(Angelina)',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# grep Angelina /etc/passwd</span>\n<span style="color:#39ff14;">Angelina:x:2332:2332::/home/Angelina:/bin/bash</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: User Angelina exists with UID 2332.</span>'
      },
      '2': {
        req: 'Create users Harrison, rakesh, and frankenstein. Harrison & frankenstein in group Ibmgrp. rakesh set to /sbin/nologin shell. Set password Br1@striv88 for all users.',
        tip: 'Tests usermod -s /sbin/nologin, groupadd, gpasswd -M, and automated passwd stream stdin.',
        cmd: '# useradd Harrison && useradd rakesh && useradd frankenstein\n# usermod -s /sbin/nologin rakesh\n# groupadd Ibmgrp && gpasswd -M Harrison,frankenstein Ibmgrp\n# echo "Br1@striv88" | passwd --stdin Harrison',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# useradd Harrison && useradd rakesh && useradd frankenstein</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# usermod -s /sbin/nologin rakesh</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# groupadd Ibmgrp && gpasswd -M Harrison,frankenstein Ibmgrp</span>\nSetting users in group Ibmgrp to "Harrison,frankenstein"\n<span style="color:#39ff14;">[root@rhel10 ~]# echo "Br1@striv88" | passwd --stdin Harrison</span>\nChanging password for user Harrison.\npasswd: all authentication tokens updated successfully.',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# getent group Ibmgrp && getent passwd rakesh</span>\n<span style="color:#39ff14;">Ibmgrp:x:1005:Harrison,frankenstein</span>\n<span style="color:#39ff14;">rakesh:x:1003:1003::/home/rakesh:/sbin/nologin</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: User roles, non-interactive shell, and group membership verified.</span>'
      },
      '3': {
        req: 'Search string "ich" inside /usr/share/dict/words and output results to /root/sresult.txt.',
        tip: 'Tests grep string searching and stdout redirection operator > to file.',
        cmd: '# grep ich /usr/share/dict/words > /root/sresult.txt\n# head -n 5 /root/sresult.txt',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# grep ich /usr/share/dict/words > /root/sresult.txt</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# head -n 5 /root/sresult.txt</span>\nabsich\nalchich\narchbishop\nbiochimia\ncatich',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# ls -l /root/sresult.txt && wc -l /root/sresult.txt</span>\n-rw-r--r--. 1 root root 1420 Jul 23 10:00 /root/sresult.txt\n<span style="color:#39ff14;">124 /root/sresult.txt</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: /root/sresult.txt contains matching search lines.</span>'
      },
      '4': {
        req: 'Extend system swap memory space by 820 MB using partition /dev/sdb1 and configure persistent /etc/fstab entry.',
        tip: 'Verifies swap formatting (mkswap), activation (swapon), and fstab reboot persistence.',
        cmd: '# fdisk /dev/sdb (type 82)\n# mkswap /dev/sdb1 && swapon /dev/sdb1\n# echo "/dev/sdb1 swap swap defaults 0 0" >> /etc/fstab',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# mkswap /dev/sdb1</span>\nSetting up swapspace version 1, size = 820 MiB (859832320 bytes)\nUUID=c1092a4e-8921-4f12-9012-abc123456789\n<span style="color:#39ff14;">[root@rhel10 ~]# swapon /dev/sdb1</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# free -m</span>\n               total        used        free      shared  buff/cache   available\nMem:           15892        4210        8420         120        3261       11200\nSwap:           2868           0        2868',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# swapon --show && grep swap /etc/fstab</span>\n<span style="color:#39ff14;">NAME      TYPE      SIZE USED PRIO</span>\n/dev/sdb1 partition 820M   0B   -2\n<span style="color:#39ff14;">/dev/sdb1 swap swap defaults 0 0</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Swap space extended by 820MB and configured in /etc/fstab.</span>'
      },
      '5': {
        req: 'Secure directory /datacenter so only group Ibmgrp has full access, with SGID bit (chmod 2070) for group ownership inheritance.',
        tip: 'Evaluates SGID bit (2) and group directory ownership chgrp Ibmgrp /datacenter.',
        cmd: '# mkdir /datacenter && chgrp Ibmgrp /datacenter\n# chmod 2070 /datacenter\n# ls -ld /datacenter',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# mkdir /datacenter && chgrp Ibmgrp /datacenter</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# chmod 2070 /datacenter</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# ls -ld /datacenter</span>\ndrwx--s---. 2 root Ibmgrp 4096 Jul 23 10:00 /datacenter',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# touch /datacenter/testfile && ls -l /datacenter/testfile</span>\n<span style="color:#39ff14;">-rw-r--r--. 1 root Ibmgrp 0 Jul 23 10:01 /datacenter/testfile</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: SGID bit active. New files inside /datacenter inherit group Ibmgrp.</span>'
      },
      '6': {
        req: 'Create LVs nokialv (700MB) and sonylv (30 LEs) from VG smartphone with PE=8MB. Format XFS and mount to /nokia1 and /sony1.',
        tip: 'Tests vgcreate -s 8M, lvcreate -L vs -l, mkfs.xfs, and persistent /etc/fstab mounts.',
        cmd: '# vgcreate -s 8M smartphone /dev/sdb2\n# lvcreate -L 700M -n nokialv smartphone\n# lvcreate -l 30 -n sonylv smartphone\n# mkfs.xfs /dev/smartphone/nokialv && mkfs.xfs /dev/smartphone/sonylv\n# mount -a',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# vgcreate -s 8M smartphone /dev/sdb2</span>\nVolume group "smartphone" successfully created\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -L 700M -n nokialv smartphone</span>\nLogical volume "nokialv" created.\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -l 30 -n sonylv smartphone</span>\nLogical volume "sonylv" created (30 extents = 240 MiB).\n<span style="color:#39ff14;">[root@rhel10 ~]# mkfs.xfs /dev/smartphone/nokialv</span>\nmeta-data=/dev/smartphone/nokialv isize=512    blocks=179200, rtextents=0',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# lvs smartphone && df -h /nokia1 /sony1</span>\n<span style="color:#39ff14;">LV      VG         Attr       LSize   </span>\nnokialv smartphone -wi-a----- 704.00m\nsonylv  smartphone -wi-a----- 240.00m\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: LVs created with 8MB PE extents, formatted XFS, and mounted.</span>'
      },
      '7': {
        req: 'Set default password maximum usage lifetime for all new users to 30 days in /etc/login.defs.',
        tip: 'Verifies modifying line PASS_MAX_DAYS 30 in /etc/login.defs.',
        cmd: '# vim /etc/login.defs (PASS_MAX_DAYS 30)\n# grep PASS_MAX_DAYS /etc/login.defs',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# grep PASS_MAX_DAYS /etc/login.defs</span>\n<span style="color:#39ff14;">PASS_MAX_DAYS   30</span>',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# useradd testuser && chage -l testuser</span>\n<span style="color:#39ff14;">Maximum number of days between password change: 30</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Default PASS_MAX_DAYS set to 30 for new user accounts.</span>'
      },
      '8': {
        req: 'Create user sikandar and schedule a cron job executing /script.sh every 5 minutes.',
        tip: 'Tests crontab -u sikandar -e with expression */5 * * * * /script.sh.',
        cmd: '# useradd sikandar\n# crontab -u sikandar -e (*/5 * * * * /script.sh)\n# crontab -u sikandar -l',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# crontab -u sikandar -l</span>\n<span style="color:#39ff14;">*/5 * * * * /script.sh</span>',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# systemctl is-active crond && crontab -u sikandar -l</span>\n<span style="color:#39ff14;">active</span>\n<span style="color:#39ff14;">*/5 * * * * /script.sh</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Cron job scheduled for user sikandar every 5 minutes.</span>'
      },
      '9': {
        req: 'Grant group punegrp administrative sudo privileges to execute all commands without password prompting.',
        tip: 'Tests creating /etc/sudoers.d/punegrp file with %punegrp ALL=(ALL) NOPASSWD: ALL.',
        cmd: '# groupadd punegrp\n# echo "%punegrp ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/punegrp\n# chmod 0440 /etc/sudoers.d/punegrp',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# echo "%punegrp ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/punegrp</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# chmod 0440 /etc/sudoers.d/punegrp</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# visudo -c -f /etc/sudoers.d/punegrp</span>\n/etc/sudoers.d/punegrp: parsed OK',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# cat /etc/sudoers.d/punegrp</span>\n<span style="color:#39ff14;">%punegrp ALL=(ALL) NOPASSWD: ALL</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Passwordless sudo granted to %punegrp group members.</span>'
      },
      '10': {
        req: 'Reset locked root password to Uv@pune321 via rd.break emergency shell and restore SELinux context relabeling.',
        tip: 'Critical exam task: Interrupt GRUB, append rd.break, mount -o remount,rw /sysroot, chroot /sysroot, passwd root, touch /.autorelabel.',
        cmd: 'Interrupt GRUB -> append rd.break -> Ctrl+X\n# mount -o remount,rw /sysroot && chroot /sysroot\n# passwd root (Uv@pune321)\n# touch /.autorelabel && exit && exit',
        output: '<span style="color:#00ffff;">Switching to emergency boot target (rd.break)...</span>\nswitch_root:/# mount -o remount,rw /sysroot\nswitch_root:/# chroot /sysroot\nsh-5.2# passwd root\nChanging password for user root.\npasswd: all authentication tokens updated successfully.\n<span style="color:#39ff14;">sh-5.2# touch /.autorelabel</span>\nsh-5.2# exit && exit',
        verify: '<span style="color:#00ffff;">[System Reboot & SELinux Autorelabel Complete]</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# getenforce</span>\nEnforcing\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Root password reset successful and SELinux contexts relabeled.</span>'
      },
      '11': {
        req: 'Create compressed archive file /backup.tar.xz of directory /usr/sbin using XZ compression.',
        tip: 'Tests tar -cvJf /backup.tar.xz /usr/sbin (-J specifies XZ compression).',
        cmd: '# tar -cvJf /backup.tar.xz /usr/sbin\n# tar -tvf /backup.tar.xz | head -n 5',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# tar -cvJf /backup.tar.xz /usr/sbin</span>\nusr/sbin/\nusr/sbin/useradd\nusr/sbin/usermod\nusr/sbin/groupadd\n<span style="color:#39ff14;">[root@rhel10 ~]# ls -lh /backup.tar.xz</span>\n-rw-r--r--. 1 root root 14.2M Jul 23 10:00 /backup.tar.xz',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# tar -tf /backup.tar.xz | head -n 3</span>\n<span style="color:#39ff14;">usr/sbin/</span>\n<span style="color:#39ff14;">usr/sbin/useradd</span>\n<span style="color:#39ff14;">usr/sbin/usermod</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: /backup.tar.xz created with XZ compression algorithm.</span>'
      },
      '12': {
        req: 'Configure network hostname district7.state1.example.com and static IPv4 (10.0.0.2/8, gateway 10.0.0.1, DNS 10.0.0.254).',
        tip: 'Tests nmcli con add/up and hostnamectl set-hostname.',
        cmd: '# nmcli con add con-name district7 ifname enp0s3 type ethernet ipv4.add 10.0.0.2/8 gw4 10.0.0.1 ipv4.dns 10.0.0.254 connection.autoconnect yes ipv4.method manual\n# nmcli con up district7 && hostnamectl set-hostname district7.state1.example.com',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# nmcli con add con-name district7 ...</span>\nConnection "district7" (a10294b2-...) successfully added.\n<span style="color:#39ff14;">[root@rhel10 ~]# nmcli con up district7</span>\nConnection successfully activated (D-Bus active path: /org/freedesktop/...)\n<span style="color:#39ff14;">[root@rhel10 ~]# hostname</span>\ndistrict7.state1.example.com',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# ip addr show enp0s3 && hostname</span>\n<span style="color:#39ff14;">inet 10.0.0.2/8 brd 10.255.255.255 scope global enp0s3</span>\n<span style="color:#39ff14;">district7.state1.example.com</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Static IP 10.0.0.2/8 and hostname configured.</span>'
      },
      '13': {
        req: 'Copy /etc/fstab to /var/tmp/fstab (owned by root). Set ACL: Harrison rw-, frankenstein --- (no access), no execution.',
        tip: 'Tests cp, setfacl -m u:frankenstein:--- and setfacl -m u:Harrison:rw-.',
        cmd: '# cp /etc/fstab /var/tmp/fstab\n# setfacl -m u:frankenstein:--- /var/tmp/fstab\n# setfacl -m u:Harrison:rw- /var/tmp/fstab\n# getfacl /var/tmp/fstab',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# cp /etc/fstab /var/tmp/fstab</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# setfacl -m u:frankenstein:--- /var/tmp/fstab</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# setfacl -m u:Harrison:rw- /var/tmp/fstab</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# getfacl /var/tmp/fstab</span>\n# file: var/tmp/fstab\n# owner: root\n# group: root\nuser::rw-\nuser:frankenstein:---\nuser:Harrison:rw-',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# getfacl /var/tmp/fstab</span>\n<span style="color:#39ff14;">user:frankenstein:---</span>\n<span style="color:#39ff14;">user:Harrison:rw-</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: ACL rules set on /var/tmp/fstab matching exam specs.</span>'
      },
      '14': {
        req: 'Extend root volume /dev/rhel/root by 3 GB and expand XFS file system online.',
        tip: 'Tests fdisk (type 8e), pvcreate, vgextend rhel, lvextend -L +3G, and xfs_growfs /.',
        cmd: '# pvcreate /dev/sdb3 && vgextend rhel /dev/sdb3\n# lvextend -L +3G /dev/rhel/root\n# xfs_growfs /',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# vgextend rhel /dev/sdb3</span>\nVolume group "rhel" successfully extended\n<span style="color:#39ff14;">[root@rhel10 ~]# lvextend -L +3G /dev/rhel/root</span>\nSize of logical volume rhel/root changed from 10.00 GiB to 13.00 GiB.\n<span style="color:#39ff14;">[root@rhel10 ~]# xfs_growfs /</span>\nmeta-data=/dev/mapper/rhel-root isize=512    blocks=2621440, rtextents=0\ndata     =                     bsize=4096   blocks=3407872, imaxpct=25',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# df -h /</span>\n<span style="color:#39ff14;">Filesystem             Size  Used Avail Use% Mounted on</span>\n/dev/mapper/rhel-root   13G  2.4G  10.6G  19% /\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Root filesystem extended by 3GB online.</span>'
      },
      '15': {
        req: 'Create executable script /script.sh that finds all files owned by user sikandar and copies them to /home/sikandar/data/.',
        tip: 'Tests bash script creation, find / -user sikandar -exec cp -rvf {} /home/sikandar/data/ \\;, and chmod 755.',
        cmd: '# cat << "EOF" > /script.sh\n#!/bin/bash\nmkdir -p /home/sikandar/data/\nfind / -user sikandar -exec cp -rvf {} /home/sikandar/data/ \\;\nEOF\n# chmod 755 /script.sh',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# chmod 755 /script.sh</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# /script.sh</span>\n/home/sikandar/file1.txt -> /home/sikandar/data/file1.txt\n/home/sikandar/notes.txt -> /home/sikandar/data/notes.txt',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# ls -ld /script.sh && ls -l /home/sikandar/data/</span>\n<span style="color:#39ff14;">-rwxr-xr-x. 1 root root 124 Jul 23 10:00 /script.sh</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Executable script created and verified.</span>'
      },
      '16': {
        req: 'Schedule root cron job to power off system automatically daily at 6:20 PM (18:20).',
        tip: 'Tests crontab -e with 20 18 * * * /usr/sbin/shutdown.',
        cmd: '# crontab -e (20 18 * * * /usr/sbin/shutdown)\n# crontab -l',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# crontab -l</span>\n<span style="color:#39ff14;">20 18 * * * /usr/sbin/shutdown</span>',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# crontab -l | grep shutdown</span>\n<span style="color:#39ff14;">20 18 * * * /usr/sbin/shutdown</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Daily 6:20 PM system shutdown cron job active.</span>'
      },
      '17': {
        req: 'Configure /etc/yum.repos.d/exam.repo with AppStream and BaseOS repo HTTP URLs.',
        tip: 'Tests repository file format [app], [base], baseurl=http://..., enabled=1, gpgcheck=0.',
        cmd: '# cat << "EOF" > /etc/yum.repos.d/exam.repo\n[1]\nname=app\nbaseurl=http://192.168.1.2/AppStream\nenabled=1\ngpgcheck=0\n\n[2]\nname=base\nbaseurl=http://192.168.1.2/BaseOS\nenabled=1\ngpgcheck=0\nEOF\n# yum clean all && yum repolist',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# yum clean all && yum repolist</span>\n<span style="color:#39ff14;">repo id                        repo name</span>\n1                              app\n2                              base\nrepolist: 8,920 packages',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# yum repolist</span>\n<span style="color:#39ff14;">1 (app) and 2 (base) repositories active.</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Yum exam.repo configured and repolist verified.</span>'
      },
      '18': {
        req: 'Install tuned daemon, query recommended profile, and activate virtual-guest profile.',
        tip: 'Tests tuned-adm recommend, tuned-adm profile virtual-guest, and tuned-adm active.',
        cmd: '# dnf install tuned -y && systemctl enable --now tuned\n# tuned-adm recommend\n# tuned-adm profile virtual-guest\n# tuned-adm active',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# tuned-adm recommend</span>\nvirtual-guest\n<span style="color:#39ff14;">[root@rhel10 ~]# tuned-adm profile virtual-guest</span>\nSwitching active profile to virtual-guest...\n<span style="color:#39ff14;">[root@rhel10 ~]# tuned-adm active</span>\nCurrent active profile: virtual-guest',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# tuned-adm active</span>\n<span style="color:#39ff14;">Current active profile: virtual-guest</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Recommended profile virtual-guest activated.</span>'
      },
      '19': {
        req: 'Configure SELinux to operate in permissive mode permanently across system reboots.',
        tip: 'Tests setting SELINUX=permissive in /etc/selinux/config and checking getenforce.',
        cmd: '# vim /etc/selinux/config (SELINUX=permissive)\n# reboot\n# getenforce',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# grep ^SELINUX= /etc/selinux/config</span>\n<span style="color:#39ff14;">SELINUX=permissive</span>\n<span style="color:#00ffff;">[root@rhel10 ~]# getenforce</span>\nPermissive',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# getenforce && grep ^SELINUX= /etc/selinux/config</span>\n<span style="color:#39ff14;">Permissive</span>\n<span style="color:#39ff14;">SELINUX=permissive</span>\n\n<span style="color:#00ff00;">[EXAM VERIFICATION PASSED]: Permanent SELinux permissive mode configured.</span>'
      },
      '20': {
        req: 'Global Task 1: Create logical volume punelv (800MB) from VG mh. Create xfs filesystem on punelv and mount into /punedir.',
        tip: 'Partition formula: 800MB + 8MB (2PE buffer) = 808MB. Formats XFS and mounts /punedir.',
        cmd: '# pvcreate /dev/sdb1 && vgcreate mh /dev/sdb1\n# lvcreate -L 800M -n punelv mh\n# mkfs.xfs /dev/mh/punelv && mkdir /punedir\n# echo "/dev/mh/punelv /punedir xfs defaults 0 0" >> /etc/fstab && mount -a',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# vgcreate mh /dev/sdb1</span>\nVolume group "mh" successfully created\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -L 800M -n punelv mh</span>\nLogical volume "punelv" created.\n<span style="color:#39ff14;">[root@rhel10 ~]# mkfs.xfs /dev/mh/punelv</span>\nmeta-data=/dev/mh/punelv isize=512    blocks=204800, rtextents=0',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# lvs mh && df -h /punedir</span>\n<span style="color:#39ff14;">LV     VG Attr       LSize</span>\npunelv mh -wi-a----- 800.00m\n/dev/mapper/mh-punelv  800M  40M  760M   5% /punedir\n\n<span style="color:#00ff00;">[GLOBAL EXAM PASSED]: punelv (800MB) created on VG mh with XFS filesystem mounted at /punedir.</span>'
      },
      '21': {
        req: 'Global Task 2: Create logical volumes sonylv (600MB) and milv (900MB) from VG android. Create ext4 filesystem on both LVs and mount into /sony & /mi.',
        tip: 'Partition formula: (600MB + 900MB) + 8MB (2PE buffer) = 1508MB. Formats ext4.',
        cmd: '# pvcreate /dev/sdb2 && vgcreate android /dev/sdb2\n# lvcreate -L 600M -n sonylv android && lvcreate -L 900M -n milv android\n# mkfs.ext4 /dev/android/sonylv && mkfs.ext4 /dev/android/milv\n# mkdir -p /sony /mi\n# echo "/dev/android/sonylv /sony ext4 defaults 0 0" >> /etc/fstab\n# echo "/dev/android/milv /mi ext4 defaults 0 0" >> /etc/fstab && mount -a',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# lvcreate -L 600M -n sonylv android</span>\nLogical volume "sonylv" created.\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -L 900M -n milv android</span>\nLogical volume "milv" created.\n<span style="color:#39ff14;">[root@rhel10 ~]# mkfs.ext4 /dev/android/sonylv</span>\nCreating filesystem with 153600 4k blocks and 38400 inodes',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# lvs android && df -h /sony /mi</span>\n<span style="color:#39ff14;">LV     VG      Attr       LSize</span>\nsonylv android -wi-a----- 600.00m\nmilv   android -wi-a----- 900.00m\n\n<span style="color:#00ff00;">[GLOBAL EXAM PASSED]: Dual ext4 LVs sonylv (600MB) and milv (900MB) created on VG android and mounted.</span>'
      },
      '22': {
        req: 'Global Task 3: Create logical volumes hondalv (200 PE) and bajajlv (600MB) from VG bike. Create xfs on hondalv (/honda) and ext4 on bajajlv (/bajaj).',
        tip: 'Partition formula: 200PE (800MB) + 600MB + 8MB = 1408MB. Mixed XFS & ext4 filesystems.',
        cmd: '# pvcreate /dev/sdb3 && vgcreate bike /dev/sdb3\n# lvcreate -l 200 -n hondalv bike && lvcreate -L 600M -n bajajlv bike\n# mkfs.xfs /dev/bike/hondalv && mkfs.ext4 /dev/bike/bajajlv\n# mkdir -p /honda /bajaj && mount -a',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# lvcreate -l 200 -n hondalv bike</span>\nLogical volume "hondalv" created (200 extents = 800 MiB).\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -L 600M -n bajajlv bike</span>\nLogical volume "bajajlv" created.\n<span style="color:#39ff14;">[root@rhel10 ~]# mkfs.xfs /dev/bike/hondalv && mkfs.ext4 /dev/bike/bajajlv</span>',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# lvs bike && df -hT /honda /bajaj</span>\n<span style="color:#39ff14;">Filesystem               Type  Size  Used Avail Use% Mounted on</span>\n/dev/mapper/bike-hondalv xfs   800M   40M  760M   5% /honda\n/dev/mapper/bike-bajajlv ext4  600M   12M  550M   3% /bajaj\n\n<span style="color:#00ff00;">[GLOBAL EXAM PASSED]: hondalv (200PE xfs) and bajajlv (600MB ext4) mounted successfully.</span>'
      },
      '23': {
        req: 'Global Task 4: Create logical volumes nasa (50 PE) and isro (80 PE) from VG research with 1PE = 16MB. Create xfs on both LVs and mount into /usa & /india.',
        tip: 'Custom PE size 16MB: 50PE (800MB) + 80PE (1280MB) + 32MB (2PE) = 2112MB. vgcreate -s 16M.',
        cmd: '# pvcreate /dev/sdb4 && vgcreate -s 16M research /dev/sdb4\n# lvcreate -l 50 -n nasa research && lvcreate -l 80 -n isro research\n# mkfs.xfs /dev/research/nasa && mkfs.xfs /dev/research/isro\n# mkdir -p /usa /india && mount -a',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# vgcreate -s 16M research /dev/sdb4</span>\nVolume group "research" successfully created with physical extent size 16.00 MiB\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -l 50 -n nasa research</span>\nLogical volume "nasa" created (50 extents = 800 MiB).\n<span style="color:#39ff14;">[root@rhel10 ~]# lvcreate -l 80 -n isro research</span>\nLogical volume "isro" created (80 extents = 1.25 GiB).',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# vgs research && lvs research</span>\n<span style="color:#39ff14;">VG       #PV #LV #SN Attr   VSize VFree</span>\nresearch   1   2   0 wz--n- 2.06g 32.00m\n<span style="color:#39ff14;">LV   VG       Attr       LSize</span>\nnasa research -wi-a----- 800.00m\nisro research -wi-a-----   1.25g\n\n<span style="color:#00ff00;">[GLOBAL EXAM PASSED]: 16MB PE size active. nasa (50PE/800MB) and isro (80PE/1.25GB) mounted.</span>'
      },
      '24': {
        req: 'Global Task 5: Create or extend system swap memory space by 600 MB and configure reboot persistence.',
        tip: 'Swap partition size 600MB (type 82), mkswap, swapon, and persistent /etc/fstab entry.',
        cmd: '# fdisk /dev/sdb (create 600M partition, type 82)\n# mkswap /dev/sdb5 && swapon /dev/sdb5\n# echo "/dev/sdb5 swap swap defaults 0 0" >> /etc/fstab',
        output: '<span style="color:#00ffff;">[root@rhel10 ~]# mkswap /dev/sdb5</span>\nSetting up swapspace version 1, size = 600 MiB (629145600 bytes)\n<span style="color:#39ff14;">[root@rhel10 ~]# swapon /dev/sdb5</span>\n<span style="color:#39ff14;">[root@rhel10 ~]# free -m</span>\nSwap:           3468           0        3468',
        verify: '<span style="color:#00ffff;">[root@rhel10 ~]# swapon --show && grep swap /etc/fstab</span>\n<span style="color:#39ff14;">/dev/sdb5 partition 600M 0B -2</span>\n<span style="color:#39ff14;">/dev/sdb5 swap swap defaults 0 0</span>\n\n<span style="color:#00ff00;">[GLOBAL EXAM PASSED]: System swap extended by 600MB and configured in /etc/fstab.</span>'
      }
    };

    function updateRhcsaTaskUI() {
      const selectedId = taskSelect.value;
      const data = taskData[selectedId] || taskData['1'];
      reqText.textContent = data.req;
      tipText.textContent = data.tip;
      terminalOutput.innerHTML = `<span style="color:#58a6ff;">[Task ${selectedId} Selected]: Click "Execute Exam Solution Commands" to view CLI execution...</span>`;
    }

    taskSelect.addEventListener('change', updateRhcsaTaskUI);

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const selectedId = taskSelect.value;
        const data = taskData[selectedId] || taskData['1'];
        terminalOutput.innerHTML = data.output;
      });
    }

    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        const selectedId = taskSelect.value;
        const data = taskData[selectedId] || taskData['1'];
        terminalOutput.innerHTML = data.verify;
      });
    }

    updateRhcsaTaskUI();
  }

  function setupQaSearchVisualizer() {
    const searchInput = document.getElementById('qa-search-input');
    const matchCount = document.getElementById('qa-match-count');
    const qaCards = document.querySelectorAll('#linux-interview-qa .qa-card');
    const categoryBlocks = document.querySelectorAll('#linux-interview-qa .qa-category-block');

    if (!searchInput || !qaCards.length) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      qaCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      categoryBlocks.forEach(block => {
        const visibleChildCards = block.querySelectorAll('.qa-card[style*="display: block"]');
        if (!query) {
          block.style.display = 'block';
        } else {
          block.style.display = visibleChildCards.length ? 'block' : 'none';
        }
      });

      if (matchCount) {
        if (!query) {
          matchCount.textContent = `Showing 173 Questions across 14 Topic Categories.`;
        } else {
          matchCount.textContent = `Found ${visibleCount} matching question${visibleCount === 1 ? '' : 's'} for "${query}".`;
        }
      }
    });
  }

  function setupRoadmapTrackerVisualizer() {
    const checkboxes = document.querySelectorAll('.roadmap-cb');
    const trackerCount = document.getElementById('roadmap-tracker-count');
    const trackerBar = document.getElementById('roadmap-tracker-bar');

    if (!checkboxes.length) return;

    // Load saved states
    let savedStates = {};
    try {
      savedStates = JSON.parse(localStorage.getItem('rhel10_roadmap_progress') || '{}');
    } catch (e) {
      savedStates = {};
    }

    checkboxes.forEach(cb => {
      const id = cb.getAttribute('data-id');
      if (id && savedStates[id]) {
        cb.checked = true;
        const parent = cb.closest('.roadmap-cb-label');
        if (parent) {
          parent.style.borderColor = '#39ff14';
          parent.style.background = 'rgba(57, 255, 20, 0.08)';
        }
      }

      cb.addEventListener('change', () => {
        const parent = cb.closest('.roadmap-cb-label');
        if (cb.checked) {
          savedStates[id] = true;
          if (parent) {
            parent.style.borderColor = '#39ff14';
            parent.style.background = 'rgba(57, 255, 20, 0.08)';
          }
        } else {
          delete savedStates[id];
          if (parent) {
            parent.style.borderColor = 'var(--border-color)';
            parent.style.background = 'var(--bg-tertiary)';
          }
        }

        try {
          localStorage.setItem('rhel10_roadmap_progress', JSON.stringify(savedStates));
        } catch (e) {}

        updateTrackerUI();
      });
    });

    function updateTrackerUI() {
      const total = checkboxes.length;
      let completed = 0;
      checkboxes.forEach(cb => {
        if (cb.checked) completed++;
      });

      const pct = Math.round((completed / total) * 100);
      if (trackerCount) {
        trackerCount.textContent = `${completed} / ${total} Objectives Completed (${pct}%)`;
      }
      if (trackerBar) {
        trackerBar.style.width = `${pct}%`;
      }
    }

    updateTrackerUI();
  }


  function setupDiskManagerVisualizer() {
    const targetDiskSelect = document.getElementById('disk-target-select');
    const partNameInput = document.getElementById('disk-part-name');
    const fsTypeSelect = document.getElementById('disk-fs-select');
    const mountPathInput = document.getElementById('disk-mount-path');
    const fstabCb = document.getElementById('disk-fstab-cb');
    const formatBtn = document.getElementById('disk-format-btn');
    const lsblkBtn = document.getElementById('disk-lsblk-btn');
    const blkidBtn = document.getElementById('disk-blkid-btn');
    const terminalOutput = document.getElementById('disk-terminal-output');

    if (!targetDiskSelect || !partNameInput || !fsTypeSelect || !mountPathInput || !fstabCb || !formatBtn || !lsblkBtn || !blkidBtn || !terminalOutput) return;

    targetDiskSelect.addEventListener('change', () => {
      const disk = targetDiskSelect.value;
      partNameInput.value = `${disk}1`;
    });

    formatBtn.addEventListener('click', () => {
      const disk = targetDiskSelect.value;
      const part = partNameInput.value.trim() || `${disk}1`;
      const fs = fsTypeSelect.value;
      const mPoint = mountPathInput.value.trim() || '/study';
      const addFstab = fstabCb.checked;
      const uuid = 'b3039e27-5c11-49d7-b2e5-e34fe23';

      // Update virtual block device state
      if (!state.blockDevices[disk]) {
        state.blockDevices[disk] = { name: disk.replace('/dev/', ''), size: '10G', type: 'disk', parts: {} };
      }

      state.blockDevices[disk].parts[part] = {
        name: part.replace('/dev/', ''),
        size: '1G',
        type: 'part',
        fs: fs,
        mount: mPoint,
        uuid: uuid
      };

      // Ensure directory exists in virtualFS
      const mAbs = resolvePath(mPoint);
      if (!state.virtualFS[mAbs]) state.virtualFS[mAbs] = [];
      const pDir = mAbs.substring(0, mAbs.lastIndexOf('/')) || '/';
      const fName = mAbs.substring(mAbs.lastIndexOf('/') + 1);
      if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
        state.virtualFS[pDir].push(fName);
      }

      let logs = [
        `[root@rhel10 ~]# fdisk ${disk}`,
        `  Created new 1 GiB Primary Partition: ${part}`,
        `[root@rhel10 ~]# mkfs.${fs} ${part}`,
        `  Formatted ${part} with filesystem type '${fs.toUpperCase()}'. Generated UUID="${uuid}"`,
        `[root@rhel10 ~]# mkdir -p ${mPoint}`,
        `[root@rhel10 ~]# mount ${part} ${mPoint}`,
        `  Successfully mounted ${part} on directory ${mPoint}`
      ];

      if (addFstab) {
        const fstabLine = `UUID="${uuid}"\t${mPoint}\t${fs}\tdefaults\t0 0`;
        const curFstab = state.virtualFilesContent['/etc/fstab'] || '';
        if (!curFstab.includes(mPoint)) {
          state.virtualFilesContent['/etc/fstab'] = curFstab ? (curFstab + '\n' + fstabLine) : fstabLine;
        }
        logs.push(`[root@rhel10 ~]# echo '${fstabLine}' >> /etc/fstab`);
        logs.push(`[root@rhel10 ~]# mount -a (Verified persistent mount record)`);
      }

      logs.push(`\nSUCCESS: Disk ${part} is active and ready for data storage.`);
      terminalOutput.textContent = logs.join('\n');
      terminalOutput.style.color = '#39ff14';
    });

    lsblkBtn.addEventListener('click', () => {
      let res = processCommand('lsblk');
      terminalOutput.textContent = `[student@rhel10 ~]$ lsblk\n${res}`;
      terminalOutput.style.color = '#39ff14';
    });

    blkidBtn.addEventListener('click', () => {
      let res = processCommand('blkid');
      terminalOutput.textContent = `[student@rhel10 ~]$ blkid\n${res || '(No partition signatures found)'}`;
      terminalOutput.style.color = '#39ff14';
    });

    // Resize button listener
    const resizeBtn = document.getElementById('disk-resize-btn');
    if (resizeBtn) {
      resizeBtn.addEventListener('click', () => {
        const disk = targetDiskSelect.value;
        const part = partNameInput.value.trim() || `${disk}1`;
        const size = document.getElementById('disk-resize-size')?.value.trim() || '2G';

        if (!state.blockDevices[disk] || !state.blockDevices[disk].parts[part]) {
          terminalOutput.textContent = `Error: Partition ${part} does not exist. Format it first!`;
          terminalOutput.style.color = '#ff6b6b';
          return;
        }

        const partObj = state.blockDevices[disk].parts[part];
        const fs = partObj.fs || 'xfs';
        partObj.size = size;

        let logs = [];
        if (fs === 'ext4' || fs === 'ext3') {
          logs = [
            `[root@rhel10 ~]# umount ${partObj.mount || '/study'}`,
            `  Unmounted partition offline.`,
            `[root@rhel10 ~]# fdisk ${disk}`,
            `  Deleted partition and recreated with new size: ${size}`,
            `[root@rhel10 ~]# e2fsck -f ${part}`,
            `  Pass 1: Checking blocks, sizes, and directory structures... Clean.`,
            `[root@rhel10 ~]# resize2fs ${part}`,
            `  Resizing filesystem on ${part} to ${size}.`,
            `[root@rhel10 ~]# mount -a`,
            `  Mounted filesystem back online.`
          ];
        } else {
          // XFS (Online grow)
          logs = [
            `[root@rhel10 ~]# fdisk ${disk}`,
            `  Deleted partition and recreated with new expanded size: ${size}`,
            `[root@rhel10 ~]# xfs_growfs ${partObj.mount || '/study'}`,
            `  meta-data=/dev/${partObj.name}       isize=512    agcount=4`,
            `  data     =                       bsize=4096   blocks=524288`,
            `  growing filesystem online.`,
            `  Filesystem grown successfully.`
          ];
        }

        logs.push(`\nSUCCESS: Resized ${fs.toUpperCase()} filesystem on ${part} to ${size}.`);
        terminalOutput.textContent = logs.join('\n');
        terminalOutput.style.color = '#39ff14';
      });
    }

    // Swap button listener
    const swapBtn = document.getElementById('disk-swap-btn');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const disk = targetDiskSelect.value;
        const swapPart = `${disk}3`;
        const swapSize = document.getElementById('disk-swap-size')?.value.trim() || '2G';

        if (!state.blockDevices[disk]) {
          state.blockDevices[disk] = { name: disk.replace('/dev/', ''), size: '10G', type: 'disk', parts: {} };
        }

        state.blockDevices[disk].parts[swapPart] = {
          name: swapPart.replace('/dev/', ''),
          size: swapSize,
          type: 'part',
          fs: 'swap',
          mount: '[SWAP]',
          uuid: 'c5123dbe-9e12-4fb2-b2a1-swap100000003'
        };

        const fstabLine = `/dev/${swapPart.replace('/dev/', '')}\tswap\tswap\tdefaults\t0 0`;
        const curFstab = state.virtualFilesContent['/etc/fstab'] || '';
        if (!curFstab.includes('swap')) {
          state.virtualFilesContent['/etc/fstab'] = curFstab ? (curFstab + '\n' + fstabLine) : fstabLine;
        }

        let logs = [
          `[root@rhel10 ~]# fdisk ${disk}`,
          `  Created new Swap partition: ${swapPart} of size ${swapSize}. Set type code to 82.`,
          `[root@rhel10 ~]# mkswap ${swapPart}`,
          `  Setting up swapspace version 1, size = ${swapSize}`,
          `[root@rhel10 ~]# swapon ${swapPart}`,
          `  Enabled swap memory on block device.`,
          `[root@rhel10 ~]# free -m`,
          `               total        used        free      shared  buff/cache   available`,
          `Mem:            1980         850         320          12         810        1010`,
          `Swap:           2048           0        2048`,
          `\nSUCCESS: Enabled and registered swap space on ${swapPart} persistently.`
        ];

        terminalOutput.textContent = logs.join('\n');
        terminalOutput.style.color = '#39ff14';
      });
    }

    // LVM PV & VG Create Button listener
    const lvmVgBtn = document.getElementById('disk-lvm-vg-btn');
    if (lvmVgBtn) {
      lvmVgBtn.addEventListener('click', () => {
        const disk = targetDiskSelect.value;
        const vgName = document.getElementById('disk-vg-name')?.value.trim() || 'india';
        const part = `${disk}1`;

        // Ensure partition exists or auto-create it
        if (!state.blockDevices[disk]) {
          state.blockDevices[disk] = { name: disk.replace('/dev/', ''), size: '10G', type: 'disk', parts: {} };
        }
        if (!state.blockDevices[disk].parts[part]) {
          state.blockDevices[disk].parts[part] = {
            name: part.replace('/dev/', ''),
            size: '1G',
            type: 'part',
            fs: '',
            mount: '',
            uuid: 'b3039e27-5c11-49d7-b2e5-e34fe23'
          };
        }

        // Register PV & VG in state
        state.pvs[part] = { vg: vgName, size: '1G' };
        state.vgs[vgName] = { size: '1G', pvs: [part], lvs: {} };

        let logs = [
          `[root@rhel10 ~]# pvcreate ${part}`,
          `  Physical volume "${part}" successfully created.`,
          `[root@rhel10 ~]# vgcreate ${vgName} ${part}`,
          `  Volume group "${vgName}" successfully created using physical extent size 4.00 MiB.`,
          `\nSUCCESS: Volume Group "${vgName}" is online and pool is ready.`
        ];

        terminalOutput.textContent = logs.join('\n');
        terminalOutput.style.color = '#39ff14';
      });
    }

    // LVM LV Create Button listener
    const lvmLvBtn = document.getElementById('disk-lvm-lv-btn');
    if (lvmLvBtn) {
      lvmLvBtn.addEventListener('click', () => {
        const vgName = document.getElementById('disk-vg-name')?.value.trim() || 'india';
        const lvName = document.getElementById('disk-lv-name')?.value.trim() || 'punelv';
        const lvSize = document.getElementById('disk-lv-size')?.value.trim() || '200M';
        const lvPath = `/dev/${vgName}/${lvName}`;

        if (!state.vgs[vgName]) {
          terminalOutput.textContent = `Error: Volume Group "${vgName}" does not exist. Create PV/VG first!`;
          terminalOutput.style.color = '#ff6b6b';
          return;
        }

        // Register LV in state
        state.lvs[lvPath] = { name: lvName, size: lvSize, vg: vgName, fs: 'xfs', mount: `/${lvName.replace('lv', '')}` };
        state.vgs[vgName].lvs[lvPath] = state.lvs[lvPath];

        // Add mount directory to virtualFS
        const mPoint = state.lvs[lvPath].mount;
        const mAbs = resolvePath(mPoint);
        if (!state.virtualFS[mAbs]) state.virtualFS[mAbs] = [];
        const pDir = mAbs.substring(0, mAbs.lastIndexOf('/')) || '/';
        const fName = mAbs.substring(mAbs.lastIndexOf('/') + 1);
        if (state.virtualFS[pDir] && !state.virtualFS[pDir].includes(fName)) {
          state.virtualFS[pDir].push(fName);
        }

        let logs = [
          `[root@rhel10 ~]# lvcreate -L ${lvSize.replace('M', '')} -n ${lvName} ${vgName}`,
          `  Logical volume "${lvName}" created.`,
          `[root@rhel10 ~]# mkfs.xfs ${lvPath}`,
          `  meta-data=${lvPath}               isize=512    agcount=4`,
          `  data     =                       bsize=4096   blocks=51200`,
          `[root@rhel10 ~]# mkdir -p ${mPoint}`,
          `[root@rhel10 ~]# mount ${lvPath} ${mPoint}`,
          `  Successfully mounted LVM Logical Volume at ${mPoint}`,
          `\nSUCCESS: Logical Volume ${lvPath} formatted with XFS and active.`
        ];

        terminalOutput.textContent = logs.join('\n');
        terminalOutput.style.color = '#39ff14';
      });
    }

    // LVM Extend Button listener
    const lvmExtendBtn = document.getElementById('disk-lvm-extend-btn');
    if (lvmExtendBtn) {
      lvmExtendBtn.addEventListener('click', () => {
        const vgName = document.getElementById('disk-vg-name')?.value.trim() || 'india';
        const lvName = document.getElementById('disk-lv-name')?.value.trim() || 'punelv';
        const lvPath = `/dev/${vgName}/${lvName}`;

        if (!state.lvs[lvPath]) {
          terminalOutput.textContent = `Error: Logical Volume "${lvPath}" does not exist. Create LV first!`;
          terminalOutput.style.color = '#ff6b6b';
          return;
        }

        const currentSize = state.lvs[lvPath].size;
        const expandedSize = (parseInt(currentSize) + 100) + 'M';
        state.lvs[lvPath].size = expandedSize;

        let logs = [
          `[root@rhel10 ~]# lvextend -L +100M ${lvPath}`,
          `  Size of logical volume ${vgName}/${lvName} changed from ${currentSize} to ${expandedSize}.`,
          `  Logical volume ${vgName}/${lvName} successfully resized.`,
          `[root@rhel10 ~]# xfs_growfs ${state.lvs[lvPath].mount}`,
          `  data blocks changed from 51200 to 76800`,
          `  Filesystem grown successfully.`,
          `\nSUCCESS: Resized Logical Volume ${lvPath} online to ${expandedSize}.`
        ];

        terminalOutput.textContent = logs.join('\n');
        terminalOutput.style.color = '#39ff14';
      });
    }

    // Rotational check Button listener
    const rotaBtn = document.getElementById('disk-rota-btn');
    if (rotaBtn) {
      rotaBtn.addEventListener('click', () => {
        let res = processCommand('lsblk -d -o name,rota');
        terminalOutput.textContent = `[student@rhel10 ~]$ lsblk -d -o name,rota\n${res}`;
        terminalOutput.style.color = '#39ff14';
      });
    }
  }

  // --- INTERACTIVE FHS TREE ---
  function setupFhsTree() {
    const fhsNodes = document.querySelectorAll('.fhs-node');
    const titleEl = document.getElementById('fhs-details-title');
    const descEl = document.getElementById('fhs-details-desc');
    const pathEl = document.getElementById('fhs-details-path');

    if (!titleEl || !descEl || !pathEl) return;

    const fhsData = {
      'root': {
        path: '/',
        title: 'Root Directory (/)',
        desc: 'The starting point of the Linux filesystem hierarchy. All files and directories are subdirectories of root, even if they are physically stored on different disks or virtual drives.'
      },
      'root-user': {
        path: '/root',
        title: 'Superuser Home Directory (/root)',
        desc: 'The home folder specifically reserved for the root user (administrator). Unlike standard users whose folders are in /home, the superuser has a separate space at the root level.'
      },
      'home': {
        path: '/home',
        title: 'User Home Directories (/home)',
        desc: 'Contains home directories for secondary, standard users (e.g. /home/bob). Each folder contains the user\'s data files, personal documents, and user-specific configuration files.'
      },
      'bin': {
        path: '/bin',
        title: 'User Binary Executables (/bin)',
        desc: 'Contains critical binary executables (system commands) that are used by all users of the system. Examples include: ps, ls, ping, grep, cp.'
      },
      'sbin': {
        path: '/sbin',
        title: 'System Binaries (/sbin)',
        desc: 'Similar to /bin, but contains binary executables typically used by the system administrator for system maintenance and configuration. Examples include: iptables, reboot, fdisk, ifconfig, swapon.'
      },
      'dev': {
        path: '/dev',
        title: 'Device Files (/dev)',
        desc: 'In Linux, everything is represented as a file, including hardware components. The /dev directory contains files representing terminal screens, USB devices, hard drives, or any hardware attached.'
      },
      'var': {
        path: '/var',
        title: 'Variable Data Files (/var)',
        desc: 'Contains files whose size and content are expected to grow dynamically. Examples include system logs (/var/log), databases (/var/lib), local emails (/var/mail), and persistent temp files (/var/tmp).'
      },
      'mnt': {
        path: '/mnt',
        title: 'Temporary Mount Point (/mnt)',
        desc: 'A directory where system administrators can temporarily mount external filesystems (e.g., hard drives, network storage shares) for manual data operations.'
      },
      'media': {
        path: '/media',
        title: 'Removable Media (/media)',
        desc: 'Contains subdirectories where removable devices (like CDs, USB flash drives, or SD cards) are automatically mounted by the operating system when inserted.'
      },
      'usr': {
        path: '/usr',
        title: 'User Applications (/usr)',
        desc: 'Contains applications, libraries, documentation, and source code used by end-user programs, separate from the core utility programs required by the kernel.'
      },
      'etc': {
        path: '/etc',
        title: 'Configuration Files (/etc)',
        desc: 'Stores the core configuration files for the operating system and installed services. It controls system behavior, startup scripts, and service settings (e.g. /etc/hosts, /etc/passwd).'
      },
      'boot': {
        path: '/boot',
        title: 'Boot Loader Files (/boot)',
        desc: 'Contains all the files needed to boot the operating system. This includes the Linux kernel, boot logs, and the GRUB boot loader config files.'
      },
      'opt': {
        path: '/opt',
        title: 'Optional Add-on Packages (/opt)',
        desc: 'Used for installing optional, third-party software packages that are not provided by default in the Linux distribution (e.g., Google Earth installed under /opt/google/earth).'
      },
      'tmp': {
        path: '/tmp',
        title: 'Temporary Files (/tmp)',
        desc: 'A directory that stores temporary files created by programs, services, and users. These files are typically deleted automatically whenever the system reboots.'
      },
      'proc': {
        path: '/proc',
        title: 'Process Information (/proc)',
        desc: 'A pseudo-filesystem that does not exist on disk. Instead, it is generated in real-time by the kernel to provide information about running processes (organized by PID) and system resources.'
      }
    };

    fhsNodes.forEach(node => {
      node.addEventListener('click', () => {
        fhsNodes.forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');

        const folderKey = node.getAttribute('data-folder');
        const data = fhsData[folderKey];
        if (data) {
          pathEl.textContent = data.path;
          titleEl.textContent = data.title;
          descEl.textContent = data.desc;
        }
      });
    });
  }

  // --- INTERACTIVE PERMISSION BUILDER ---
  function setupPermissionBuilder() {
    const checkboxes = {
      ur: document.getElementById('perm-u-r'),
      uw: document.getElementById('perm-u-w'),
      ux: document.getElementById('perm-u-x'),
      gr: document.getElementById('perm-g-r'),
      gw: document.getElementById('perm-g-w'),
      gx: document.getElementById('perm-g-x'),
      or: document.getElementById('perm-o-r'),
      ow: document.getElementById('perm-o-w'),
      ox: document.getElementById('perm-o-x')
    };

    const outputOctal = document.getElementById('perm-output-octal');
    const outputSymbolic = document.getElementById('perm-output-symbolic');
    const explainer = document.getElementById('perm-field-explainer');

    if (!checkboxes.ur || !outputOctal || !outputSymbolic || !explainer) return;

    function calculate() {
      // Calculate user octal digit
      const uVal = (checkboxes.ur.checked ? 4 : 0) + (checkboxes.uw.checked ? 2 : 0) + (checkboxes.ux.checked ? 1 : 0);
      // Calculate group octal digit
      const gVal = (checkboxes.gr.checked ? 4 : 0) + (checkboxes.gw.checked ? 2 : 0) + (checkboxes.gx.checked ? 1 : 0);
      // Calculate others octal digit
      const oVal = (checkboxes.or.checked ? 4 : 0) + (checkboxes.ow.checked ? 2 : 0) + (checkboxes.ox.checked ? 1 : 0);

      const octalStr = `${uVal}${gVal}${oVal}`;
      outputOctal.textContent = octalStr;

      // Construct symbolic string
      const uSym = (checkboxes.ur.checked ? 'r' : '-') + (checkboxes.uw.checked ? 'w' : '-') + (checkboxes.ux.checked ? 'x' : '-');
      const gSym = (checkboxes.gr.checked ? 'r' : '-') + (checkboxes.gw.checked ? 'w' : '-') + (checkboxes.gx.checked ? 'x' : '-');
      const oSym = (checkboxes.or.checked ? 'r' : '-') + (checkboxes.ow.checked ? 'w' : '-') + (checkboxes.ox.checked ? 'x' : '-');

      const symStr = `${uSym}${gSym}${oSym}`;
      outputSymbolic.textContent = symStr;

      // Construct detailed textual explanation
      let expText = `<strong>chmod ${octalStr} /mumbai</strong> sets permissions to <strong>${symStr}</strong>:<br>`;

      // User details
      expText += `• <strong>Owner (User)</strong> gets <strong>${uSym}</strong>: `;
      const uActs = [];
      if (checkboxes.ur.checked) uActs.push('Read contents');
      if (checkboxes.uw.checked) uActs.push('Write/modify');
      if (checkboxes.ux.checked) uActs.push('Execute script / Enter directory');
      expText += uActs.length > 0 ? uActs.join(', ') : 'No permissions';
      expText += '.<br>';

      // Group details
      expText += `• <strong>Group members</strong> get <strong>${gSym}</strong>: `;
      const gActs = [];
      if (checkboxes.gr.checked) gActs.push('Read contents');
      if (checkboxes.gw.checked) gActs.push('Write/modify');
      if (checkboxes.gx.checked) gActs.push('Execute script / Enter directory');
      expText += gActs.length > 0 ? gActs.join(', ') : 'No permissions';
      expText += '.<br>';

      // Others details
      expText += `• <strong>Others (World)</strong> get <strong>${oSym}</strong>: `;
      const oActs = [];
      if (checkboxes.or.checked) oActs.push('Read contents');
      if (checkboxes.ow.checked) oActs.push('Write/modify');
      if (checkboxes.ox.checked) oActs.push('Execute script / Enter directory');
      expText += oActs.length > 0 ? oActs.join(', ') : 'No permissions';
      expText += '.';

      explainer.innerHTML = expText;
    }

    // Add listeners to all checkboxes
    Object.values(checkboxes).forEach(cb => {
      cb.addEventListener('change', calculate);
    });

    // Run once at start
    calculate();
  }

  // --- INTERACTIVE ACL BUILDER ---
  function setupAclBuilder() {
    const typeSelect = document.getElementById('acl-target-type');
    const nameInput = document.getElementById('acl-target-name');
    const cbR = document.getElementById('acl-perm-r');
    const cbW = document.getElementById('acl-perm-w');
    const cbX = document.getElementById('acl-perm-x');

    const addBtn = document.getElementById('acl-add-rule-btn');
    const removeBtn = document.getElementById('acl-remove-rule-btn');
    const clearBtn = document.getElementById('acl-clear-all-btn');

    const outputText = document.getElementById('acl-getfacl-output');
    const commandText = document.getElementById('acl-generated-command');

    if (!typeSelect || !nameInput || !cbR || !cbW || !cbX || !addBtn || !removeBtn || !clearBtn || !outputText || !commandText) return;

    let aclRules = {
      users: {
        'sara': 'r-x'
      },
      groups: {}
    };

    function updateView() {
      // Build getfacl output text
      let lines = [
        '# file: mumbai/',
        '# owner: root',
        '# group: root',
        'user::rwx'
      ];

      // Append users ACLs
      Object.keys(aclRules.users).forEach(u => {
        lines.push(`user:${u}:${aclRules.users[u]}`);
      });

      lines.push('group::r-x');

      // Append groups ACLs
      Object.keys(aclRules.groups).forEach(g => {
        lines.push(`group:${g}:${aclRules.groups[g]}`);
      });

      // Calculate mask if custom rules exist
      if (Object.keys(aclRules.users).length > 0 || Object.keys(aclRules.groups).length > 0) {
        // Compute mask (union of all custom user/group permissions)
        let maskR = false, maskW = false, maskX = false;
        const checkMask = (str) => {
          if (str.includes('r')) maskR = true;
          if (str.includes('w')) maskW = true;
          if (str.includes('x')) maskX = true;
        };
        Object.values(aclRules.users).forEach(checkMask);
        Object.values(aclRules.groups).forEach(checkMask);
        let maskStr = (maskR ? 'r' : '-') + (maskW ? 'w' : '-') + (maskX ? 'x' : '-');
        lines.push(`mask::${maskStr}`);
      }

      lines.push('other::---');

      outputText.textContent = lines.join('\n');
    }

    function getSelectedPermString() {
      return (cbR.checked ? 'r' : '-') + (cbW.checked ? 'w' : '-') + (cbX.checked ? 'x' : '-');
    }

    addBtn.addEventListener('click', () => {
      const type = typeSelect.value;
      const name = nameInput.value.trim().toLowerCase();
      if (!name) return;

      const perms = getSelectedPermString();
      if (type === 'u') {
        aclRules.users[name] = perms;
        commandText.textContent = `setfacl -m u:${name}:${perms} /mumbai`;
      } else {
        aclRules.groups[name] = perms;
        commandText.textContent = `setfacl -m g:${name}:${perms} /mumbai`;
      }
      updateView();
    });

    removeBtn.addEventListener('click', () => {
      const type = typeSelect.value;
      const name = nameInput.value.trim().toLowerCase();
      if (!name) return;

      if (type === 'u') {
        if (aclRules.users[name]) {
          delete aclRules.users[name];
          commandText.textContent = `setfacl -x u:${name}: /mumbai`;
        }
      } else {
        if (aclRules.groups[name]) {
          delete aclRules.groups[name];
          commandText.textContent = `setfacl -x g:${name}: /mumbai`;
        }
      }
      updateView();
    });

    clearBtn.addEventListener('click', () => {
      aclRules.users = {};
      aclRules.groups = {};
      commandText.textContent = 'setfacl -b /mumbai';
      updateView();
    });

    // Run initial rendering
    updateView();
  }

  // --- QUIZ ENGINE ---
  const quizCategories = {
    'boot-process': {
      title: 'Linux Boot & Run Levels',
      questions: [
        {
          question: 'What is the primary function of the Linux boot process?',
          options: [
            "Checking domain name resolution across network interfaces",
            "Powering on the computer and loading the OS kernel from disk into RAM",
            "Backing up system logs to remote storage",
            "Compiling kernel source files into binary code"
          ],
          correct: 1,explanation: 'Booting powers on the computer and loads the Linux kernel and core initialization modules into system memory (RAM).'
        },
        {
          question: 'Which systemd target unit corresponds to Runlevel 5 (Default Graphical Desktop mode)?',
          options: [
            "reboot.target",
            "graphical.target",
            "multi-user.target",
            "rescue.target"
          ],
          correct: 1,explanation: 'Runlevel 5 is represented by graphical.target in systemd, which provides a full GUI desktop environment.'
        },
        {
          question: 'Which command displays the current default boot target on a systemd RHEL machine?',
          options: [
            "runlevel --show",
            "systemctl check-runlevel",
            "init 5 status",
            "systemctl get-default"
          ],
          correct: 3,explanation: 'The systemctl get-default command returns the active default boot target (e.g. graphical.target or multi-user.target).'
        },
        {
          question: 'During emergency root password recovery, what parameter is added to the end of the kernel boot line in GRUB?',
          options: [
            "rd.break",
            "selinux=0",
            "init=/bin/bash",
            "single-user"
          ],
          correct: 0,explanation: 'The rd.break parameter stops the boot process inside initramfs before the real root filesystem is mounted.'
        },
        {
          question: 'Why must you run "touch /.autorelabel" after changing the root password during emergency recovery?',
          options: [
            "To allow SELinux to relabel file security contexts on the next reboot",
            "To re-encrypt the shadow password database",
            "To mount /sysroot in read-write mode",
            "To clear temp files in /tmp"
          ],
          correct: 0,explanation: 'Creating /.autorelabel triggers SELinux to relabel all modified files (including /etc/shadow) upon reboot, preventing login locks.'
        }
      ]
    },
    basics: {
      title: "Basics & History",
      questions: [
        {
          question: "An operating system (OS) acts as an interface between...",
          options: [
            "The user and the computer hardware",
            "Linus Torvalds and Red Hat developers",
            "Linux and Unix operating systems",
            "The client and the server"
          ],
          correct: 0,explanation: "An Operating System is system software that acts as an interface between the user and the computer hardware."
        },
        {
          question: "Which characteristic is typically associated with server operating systems rather than client ones?",
          options: [
            "Personalized game mode accelerators",
            "Optimization for running high background processes and hardware scalability",
            "Pre-installed local productivity suites",
            "Single-user lock modes"
          ],
          correct: 1,explanation: "Server operating systems are engineered to scale, manage background service daemons, and run multiple connections simultaneously."
        },
        {
          question: "What does 'Open Source' mean in software engineering?",
          options: [
            "The original source code is made freely available to use, modify, and develop",
            "Only the founder can edit the source code",
            "The software is sold at retail stores",
            "The program has no executable binary files"
          ],
          correct: 0,explanation: "Open source software allows anyone to review, customize, distribute, and collaborate on the underlying source code."
        },
        {
          question: "Who is the founder of the Linux kernel and the Git version control system?",
          options: [
            "Ken Thompson",
            "Linus Torvalds",
            "Dennis Ritchie",
            "Marc Ewing"
          ],
          correct: 1,explanation: "Linus Benedict Torvalds initiated the Linux kernel in September 1991 and later created the Git revision system in 2005."
        },
        {
          question: "Which operating system family did Linux inherit its structure and commands design from?",
          options: [
            "UNIX",
            "Minix",
            "Windows",
            "macOS"
          ],
          correct: 0,explanation: "Linux is a Unix-like operating system that implements the POSIX standard, sharing directory standards and commands behavior with legacy UNIX."
        },
        {
          question: "Which of the following is NOT a distribution of Linux?",
          options: [
            "Ubuntu",
            "Debian",
            "Windows 11",
            "Fedora"
          ],
          correct: 2,explanation: "Fedora, Debian, and Ubuntu are popular Linux distributions. Windows 11 is a proprietary operating system developed by Microsoft."
        },
        {
          question: "Who created UNIX at Bell Labs in 1969?",
          options: [
            "Steve Jobs",
            "Richard Stallman",
            "Linus Torvalds",
            "Ken Thompson & Dennis Ritchie"
          ],
          correct: 3,explanation: "UNIX was designed in 1969 by computer science pioneers Ken Thompson, Dennis Ritchie, and others at Bell Labs."
        },
        {
          question: "What was the Finnish University student project name that eventually became Linux?",
          options: [
            "Minix-Next",
            "Freax",
            "Linux",
            "FinnishOS"
          ],
          correct: 1,explanation: "Linus Torvalds originally wanted to name his project 'Freax' (a combination of 'free', 'freak', and the 'X' from UNIX) before his colleague renamed it to 'Linux' on the FTP server."
        }
      ]
    },
    setup: {
      title: "Lab & Troubleshooting",
      questions: [
        {
          question: "Which hypervisor tool is free, open-source, and commonly used to run guest operating systems locally?",
          options: [
            "Windows Core Isolation",
            "Intel VT-x BIOS",
            "Oracle VM VirtualBox",
            "Red Hat DVD ISO"
          ],
          correct: 2,explanation: "Oracle VM VirtualBox is a free hosted hypervisor that enables users to provision guest virtual machines on Windows/macOS/Linux."
        },
        {
          question: "What BIOS feature must be enabled to run 64-bit virtual operating systems?",
          options: [
            "Core Isolation",
            "Virtualization Technology (Intel VT-x / AMD-V)",
            "Memory Integrity Toggle",
            "Hyper-Threading Settings"
          ],
          correct: 1,explanation: "CPU Virtualization (Intel VT-x or AMD-V) must be enabled in the BIOS/UEFI settings for hypervisors to run 64-bit guest kernels."
        },
        {
          question: "If you encounter a 'Kernel panic - not syncing' CPU error on RHEL VM boot, what is the most likely solution?",
          options: [
            "Format the primary Windows C: partition",
            "Reinstall VirtualBox hypervisor",
            "Disable virtualization settings in BIOS",
            "Increase processor allocation in VM settings to at least 2 CPU Cores"
          ],
          correct: 3,explanation: "Modern enterprise Linux kernels like RHEL require at least 2 physical or virtual CPU cores. Booting on 1 core often results in a Kernel Panic boot crash."
        },
        {
          question: "Which Windows security feature is known to conflict with hypervisors and may need to be toggled off?",
          options: [
            "Core Isolation (Memory Integrity)",
            "Windows Update Active Hours",
            "User Account Control (UAC)",
            "Windows Defender Firewall"
          ],
          correct: 0,explanation: "Windows Core Isolation (Memory Integrity) reserves virtualization controls exclusively for Windows, which conflicts with VirtualBox/VMware guest hypervisors."
        },
        {
          question: "Where can you verify if virtualization is currently active on your Windows PC without rebooting into BIOS?",
          options: [
            "Device Manager -> System Devices",
            "VirtualBox Downloads URL page",
            "Windows Task Manager -> Performance tab -> CPU",
            "Control Panel -> Programs and Features"
          ],
          correct: 2,explanation: "The Performance -> CPU tab in Windows Task Manager shows 'Virtualization: Enabled/Disabled' in real-time."
        },
        {
          question: "What is the primary file extension of a Red Hat installation media disk image?",
          options: [
            ".tar.gz",
            ".exe",
            ".dmg",
            ".iso"
          ],
          correct: 3,explanation: "An ISO image (.iso) is an archive file that contains an identical copy of data found on an optical disk like a CD or DVD, standard for OS installers."
        },
        {
          question: "What virtualization type runs a guest OS on top of an existing host OS using hypervisor software?",
          options: [
            "Type-1 Bare Metal Hypervisor",
            "Type-2 Hosted Hypervisor",
            "Containers",
            "Dual booting"
          ],
          correct: 1,explanation: "Type-2 (or hosted) hypervisors (like VirtualBox) run as an application on top of an existing host OS (like Windows or macOS)."
        },
        {
          question: "If a virtual machine boot fails showing 'VT-x is disabled', how is this solved?",
          options: [
            "Increasing guest RAM allocation",
            "Entering host BIOS/UEFI settings and enabling Virtualization Technology",
            "Formatting the host system C: partition",
            "Reinstalling host hypervisor software"
          ],
          correct: 1,explanation: "A 'VT-x is disabled' error indicates that hardware virtualization features are turned off in the host computer's motherboard firmware (BIOS/UEFI)."
        }
      ]
    },
    fhs: {
      title: "File System Hierarchy",
      questions: [
        {
          question: "In Linux systems, how is hardware, directories, and running processes represented?",
          options: [
            "As objects in active RAM",
            "As dynamic database rows",
            "As registry string entries",
            "As files (Everything is a file)"
          ],
          correct: 3,explanation: "In Linux, everything is represented as a file, including physical disks, serial ports, printers, configurations, and running processes."
        },
        {
          question: "Which directory acts as the private home folder for the superuser (admin)?",
          options: [
            "/etc",
            "/var",
            "/root",
            "/home"
          ],
          correct: 2,explanation: "The /root directory is the home folder for the administrative superuser, distinct from standard user accounts stored in /home."
        },
        {
          question: "Where are general system configuration files (like passwd, hosts, and resolv.conf) stored?",
          options: [
            "/etc",
            "/usr",
            "/bin",
            "/var"
          ],
          correct: 0,explanation: "The /etc folder is reserved for system-wide configuration files, startup scripts, and administration settings."
        },
        {
          question: "Which directory contains volatile files like active logs, mail, database caches, and spoolers?",
          options: [
            "/proc",
            "/var",
            "/tmp",
            "/boot"
          ],
          correct: 1,explanation: "/var is designated for variable data files whose sizes grow or change dynamically during server operations (e.g. system logs)."
        },
        {
          question: "What is the role of the /bin directory in the File System Hierarchy?",
          options: [
            "It contains binary executable commands used by all system users (e.g. ls, cp, grep)",
            "It contains boot loader GRUB configurations",
            "It holds configuration databases",
            "It holds system administration binaries for root only"
          ],
          correct: 0,explanation: "/bin contains general user binary executables. Admin binaries are stored under /sbin."
        },
        {
          question: "Where are optional third-party software packages installed by default?",
          options: [
            "/root",
            "/etc",
            "/opt",
            "/usr"
          ],
          correct: 2,explanation: "The /opt (optional) directory is reserved for add-on software packages that do not follow standard folder splitting."
        },
        {
          question: "Which directory contains the Linux kernel and bootloader configuration files?",
          options: [
            "/bin",
            "/dev",
            "/boot",
            "/sys"
          ],
          correct: 2,explanation: "The /boot folder stores files essential for the system bootstrap process, including kernel images (vmlinuz) and GRUB configurations."
        },
        {
          question: "Which directory is a pseudo-filesystem containing real-time process and system memory info?",
          options: [
            "/proc",
            "/tmp",
            "/var",
            "/sbin"
          ],
          correct: 0,explanation: "/proc is a virtual filesystem generated in-memory by the kernel, exposing active CPU and process diagnostics as text files."
        }
      ]
    },
    commands: {
      title: "Command Line Operations",
      questions: [
        {
          question: "Which command switches the active shell path back to the previous working directory?",
          options: [
            "cd ..",
            "cd ~",
            "cd -",
            "cd /previous"
          ],
          correct: 2,explanation: "The '-' flag with 'cd' (cd -) toggles the active shell folder to the previous working directory."
        },
        {
          question: "Which option flag allows 'ls' to list hidden files starting with a dot (.)?",
          options: [
            "-h",
            "-l",
            "-d",
            "-a"
          ],
          correct: 3,explanation: "The '-a' (all) flag includes hidden files (e.g. .bashrc) in the ls directory listing."
        },
        {
          question: "What does the command 'tail -f logfile' do?",
          options: [
            "Deletes the logfile forcefully",
            "Filters log file lines containing letter 'f'",
            "Monitors and prints new log lines in real-time as they are written",
            "Prints the first 10 lines of logfile"
          ],
          correct: 2,explanation: "The '-f' (follow) option tracks additions to a file in real-time, frequently used to monitor system logs."
        },
        {
          question: "If you want to run previous command number 25 from the history log, what shortcut is used?",
          options: [
            "!25",
            "run 25",
            "history -25",
            "Ctrl + R 25"
          ],
          correct: 0,explanation: "Typing an exclamation mark followed by the index number (e.g. !25) executes that matching command from history."
        },
        {
          question: "Which bash keyboard shortcut stops and terminates the currently running command process immediately?",
          options: [
            "Ctrl + C",
            "Ctrl + L",
            "Ctrl + Z",
            "Ctrl + D"
          ],
          correct: 0,explanation: "Ctrl+C sends the SIGINT signal to terminate the running foreground terminal program."
        },
        {
          question: "What does the command 'echo $HOME' output?",
          options: [
            "The absolute path of the current user's home directory",
            "The list of executable search paths",
            "The username of the current user",
            "The active shell name"
          ],
          correct: 0,explanation: "The '$HOME' environment variable references the active user's personal home directory path."
        },
        {
          question: "Which pipe command searches and filters output lines containing the word 'ssh' from command history?",
          options: [
            "history | grep ssh",
            "grep ssh < history",
            "history & grep ssh",
            "history > grep ssh"
          ],
          correct: 0,explanation: "The pipe character '|' redirects stdout of history into stdin of grep, which filters for the pattern 'ssh'."
        },
        {
          question: "What is the difference between '>' and '>>' redirection operators?",
          options: [
            "'>' overwrites, '>>' appends",
            "'>' appends, '>>' overwrites",
            "'>' redirects input, '>>' redirects output",
            "There is no difference"
          ],
          correct: 0,explanation: "The single redirect '>' creates/overwrites the target file, while '>>' appends command output lines to the bottom of the file."
        }
      ]
    },
    vim: {
      title: "Text Editing with Vim",
      questions: [
        {
          question: "Which Vim mode is the default mode on launch, and is used for copy, paste, delete, and navigation shortcuts?",
          options: [
            "Insert Mode",
            "Extended Mode",
            "Command (Normal) Mode",
            "Visual Block Mode"
          ],
          correct: 2,explanation: "Vim starts in Command (Normal) Mode by default, which intercepts keyboard typing to trigger text manipulation, copy/paste, and cursor navigation."
        },
        {
          question: "To transition from Command (Normal) Mode to Insert Mode for typing text, which key should you press?",
          options: [
            ": (colon)",
            "Esc",
            "v",
            "i"
          ],
          correct: 3,explanation: "Pressing 'i' in Command Mode transitions the editor into Insert Mode, allowing direct text entry."
        },
        {
          question: "Which extended mode command saves (writes) the active file and quits the Vim editor?",
          options: [
            ":se nu",
            ":w",
            ":wq",
            ":q!"
          ],
          correct: 2,explanation: "The command ':wq' (or ':x') saves the current editor buffer (write) and exits the editor (quit)."
        },
        {
          question: "Which shortcut in Command Mode yanks (copies) the current active line into the clipboard buffer?",
          options: [
            "yw",
            "dd",
            "yy",
            "p"
          ],
          correct: 2,explanation: "Pressing 'yy' yanks the active line. Pressing 'dd' cuts/deletes the active line."
        },
        {
          question: "How can you display line numbers along the left editor margin gutter in Vim?",
          options: [
            "Type :wq in Extended Mode",
            "Type :se nu in Extended Mode",
            "Press L in Command Mode",
            "Press Tab 3 times"
          ],
          correct: 1,explanation: "Entering Extended Mode by typing ':' followed by 'se nu' (set number) displays line margins. Use 'se nonu' to hide them."
        },
        {
          question: "Which mode in Vim allows you to enter commands like ':w' or ':q'?",
          options: [
            "Visual Mode",
            "Insert Mode",
            "Extended Command Mode",
            "Command (Normal) Mode"
          ],
          correct: 2,explanation: "Extended Command Mode is entered by typing ':' from Normal Mode, permitting administration tasks like writing, quitting, and settings modifications."
        },
        {
          question: "Which Command Mode key undoes the previous text changes?",
          options: [
            "dd",
            "u",
            "p",
            "ctrl+r"
          ],
          correct: 1,explanation: "Pressing 'u' in Normal Mode triggers the undo operation. Pressing 'ctrl+r' triggers the redo operation."
        },
        {
          question: "In Command Mode, what does 'dd' do?",
          options: [
            "Duplicates the line",
            "Deletes (cuts) the current active line",
            "Pastes yanked clipboard buffers",
            "Moves cursor to the bottom file row"
          ],
          correct: 1,explanation: "Double pressing 'd' ('dd') in Normal Mode deletes the current line and yanks it to the buffer."
        }
      ]
    },
    'user-management': {
      title: "User Account Management",
      questions: [
        {
          question: "Which file stores user account properties like the home directory, default shell, UID, and GID in RHEL?",
          options: [
            "/etc/hosts",
            "/etc/shadow",
            "/etc/fstab",
            "/etc/passwd"
          ],
          correct: 3,explanation: "/etc/passwd contains user account metadata including UID, GID, comments, home directories, and login shells."
        },
        {
          question: "Which User Identifier (UID) range is reserved for normal user accounts in RHEL?",
          options: [
            "Only 1000",
            "1000 - 60000",
            "60001 - 100000",
            "0 - 999"
          ],
          correct: 1,explanation: "UIDs 0-999 are reserved for system accounts, while UIDs 1000-60000 are allocated for standard normal users."
        },
        {
          question: "Which command must be used by the root user to lock a user's password, preventing them from logging in?",
          options: [
            "usermod -U username",
            "userdel -r username",
            "usermod -L username",
            "passwd -d username"
          ],
          correct: 2,explanation: "The '-L' flag locks a user password by prepending a '!' to the shadow database hash. Use '-U' to unlock."
        },
        {
          question: "What is the difference between running 'userdel sachin' and 'userdel -r sachin'?",
          options: [
            "There is no difference",
            "-r deletes the user recursively from groups",
            "-r deletes the user and their home directory",
            "-r deletes the system user only"
          ],
          correct: 2,explanation: "The '-r' recursive flag instructs userdel to remove the user's home directory and mail spool along with the account databases."
        },
        {
          question: "Which command is used to log out of an active switched user (su) session and return to the previous parent user shell?",
          options: [
            "su -",
            "exit (or Ctrl+D)",
            "reboot",
            "logout"
          ],
          correct: 1,explanation: "Typing 'exit' or pressing Ctrl+D terminates the current shell process, returning you to the parent shell session."
        },
        {
          question: "Where are encrypted user passwords actually stored in RHEL?",
          options: [
            "/var/log/secure",
            "/etc/shadow",
            "/etc/gshadow",
            "/etc/passwd"
          ],
          correct: 1,explanation: "Passwords are encrypted and stored in `/etc/shadow` which is readable only by the root superuser, enhancing database security."
        },
        {
          question: "Which file contains group configurations and listings of secondary members?",
          options: [
            "/etc/shadow",
            "/etc/fstab",
            "/etc/group",
            "/etc/passwd"
          ],
          correct: 2,explanation: "The `/etc/group` file stores group names, GIDs, and comma-separated lists of standard secondary user accounts."
        },
        {
          question: "What is the User ID (UID) of the administrative root superuser?",
          options: [
            "1000",
            "500",
            "0",
            "1"
          ],
          correct: 2,explanation: "By convention, the superuser account (root) always has a User ID (UID) of 0."
        },
        {
          question: "When migrating a user home directory to a custom path (e.g., using usermod -d /goa sara), how do you resolve a broken bash shell prompt (e.g. -bash-5.1$) for the user?",
          options: [
            "Copy the default shell skeleton environment files (.bash*) to the new home directory and correct ownership",
            "Reboot the server immediately",
            "Lock and unlock the user's password",
            "Change the user shell to /sbin/nologin"
          ],
          correct: 0,explanation: "Copying the `.bash*` configuration files (like `.bash_profile` and `.bashrc`) and assigning correct permissions/ownership ensures the bash shell prompt formats correctly."
        },
        {
          question: "How do you create a hidden directory in Linux, and which command displays it?",
          options: [
            "Use the 'hide' attribute and view with 'ls -Z'",
            "Prefix the name with a dot (e.g., mkdir .test) and view with 'ls -a'",
            "Configure it in /etc/passwd and view with 'grep'",
            "Suffix the name with an asterisk (e.g., mkdir test*) and view with 'ls'"
          ],
          correct: 1,explanation: "Directories or files prefixed with a period (.) are hidden in Linux and can be viewed by passing the '-a' (all) flag to 'ls'."
        },
        {
          question: "What does the command 'sudo' stand for and what is its primary purpose?",
          options: [
            "Superuser do (or switch user do); allows authorized users to execute commands with root privileges",
            "Single user diagnostic mode; reboots the machine safely",
            "System universal disk operator; manages partition formatting",
            "Service update domain override; restarts network daemons"
          ],
          correct: 0,explanation: "'sudo' ('superuser do') grants permitted standard users permission to run administrative commands based on /etc/sudoers policy."
        },
        {
          question: "Which system configuration database file defines sudo rules, permissions, and restrictions?",
          options: [
            "/etc/sudoers",
            "/etc/passwd",
            "/etc/security/limits.conf",
            "/etc/fstab"
          ],
          correct: 0,explanation: "The '/etc/sudoers' file contains all access rules for users and groups permitted to run commands via sudo."
        },
        {
          question: "Which dedicated utility command should always be used to edit '/etc/sudoers' safely with syntax checking?",
          options: [
            "nano /etc/sudoers",
            "chmod 777 /etc/sudoers",
            "gedit /etc/sudoers",
            "visudo"
          ],
          correct: 3,explanation: "'visudo' opens the sudoers file in an editor and performs syntax validation before saving, preventing lockouts."
        },
        {
          question: "Which built-in RHEL administrative group grants member users full sudo rights by default?",
          options: [
            "admin",
            "sudoers",
            "root",
            "wheel"
          ],
          correct: 3,explanation: "On RHEL systems, members of the 'wheel' group inherit full administrative sudo privileges (%wheel ALL=(ALL) ALL)."
        },
        {
          question: "Which command adds user 'ajay' to the administrative 'wheel' group?",
          options: [
            "chmod +x wheel ajay",
            "gpasswd -a ajay wheel",
            "groupadd ajay wheel",
            "useradd -g wheel ajay"
          ],
          correct: 1,explanation: "The 'gpasswd -a ajay wheel' command appends user 'ajay' to the 'wheel' group."
        },
        {
          question: "In '/etc/sudoers', what character prefix indicates that a directive applies to a Group rather than an individual User?",
          options: [
            "#",
            "@",
            "$",
            "%"
          ],
          correct: 3,explanation: "In sudoers syntax, a percent sign prefix (e.g. %avenger ALL=(ALL) ALL) specifies a group name."
        },
        {
          question: "Which option inside '/etc/sudoers' allows a user or group to run sudo commands without entering a password?",
          options: [
            "BYPASS: ALL",
            "NO_AUTH=TRUE",
            "NOPASSWD: ALL",
            "PASSWORD=FALSE"
          ],
          correct: 2,explanation: "Setting 'NOPASSWD: ALL' in /etc/sudoers waives the requirement for entering a user password when executing sudo commands."
        },
        {
          question: "What does GRUB stand for, and who created it in 1995?",
          options: [
            "General Red Hat Universal Boot; created by Linus Torvalds",
            "Graphical User Bootloader; created by Richard Stallman",
            "Grand Unified Bootloader; created by Erich Stefan Boleyn",
            "Global Root Unit Binary; created by Ken Thompson"
          ],
          correct: 2,explanation: "GRUB stands for Grand Unified Bootloader, invented by Erich Stefan Boleyn in 1995."
        },
        {
          question: "Why is an unprotected GRUB bootloader considered a major security risk?",
          options: [
            "Anyone with console access can edit boot lines, enter Single User Mode (init=/bin/bash), and bypass root passwords",
            "It allows unauthorized users to read encrypted /etc/shadow files directly over network",
            "It disables firewalld network rules on system bootup",
            "It automatically formats hard disk partitions upon power failure"
          ],
          correct: 0,explanation: "Console users can edit GRUB boot entries to boot directly into Single User Mode or rescue targets, bypassing password authentication."
        },
        {
          question: "Which command generates a secure PBKDF2 password hash for GRUB configuration?",
          options: [
            "openssl grub-pbkdf2",
            "grub2-mkpasswd-pbkdf2",
            "passwd --grub-hash",
            "mkpasswd -g grub"
          ],
          correct: 1,explanation: "The 'grub2-mkpasswd-pbkdf2' utility hashes passwords for use inside GRUB configuration files."
        },
        {
          question: "Which configuration file is edited to define GRUB superuser permissions and password hashes?",
          options: [
            "/var/log/grub.log",
            "/etc/boot.conf",
            "/etc/grub2.cfg (or /etc/grub.d/40_custom)",
            "/etc/security/grub.conf"
          ],
          correct: 2,explanation: "GRUB password rules are configured inside '/etc/grub2.cfg' or '/etc/grub.d/' template scripts."
        },
        {
          question: "What is the result of adding 'kiran ALL=/usr/sbin/useradd' inside '/etc/sudoers'?",
          options: [
            "User kiran is prohibited from creating users",
            "User kiran can run all administrative commands except useradd",
            "User kiran can only execute the '/usr/sbin/useradd' command with sudo privileges",
            "User kiran gets full root privileges on all binaries"
          ],
          correct: 2,explanation: "Specifying an explicit binary path restricts the user so they can only run that specific command with elevated sudo privileges."
        }
      ]
    },
    'group-management': {
      title: "Group Account Management",
      questions: [
        {
          question: "Which command is used to add user ajay to the secondary group ibmgrp?",
          options: [
            "useradd ibmgrp ajay",
            "gpasswd -a ajay ibmgrp",
            "usermod -g ibmgrp ajay",
            "groupadd -a ajay ibmgrp"
          ],
          correct: 1,explanation: "The 'gpasswd -a' command adds a user as a member to a secondary group. 'usermod -g' changes the primary group."
        },
        {
          question: "Where are group password properties and group administrators stored?",
          options: [
            "/etc/group",
            "/etc/passwd",
            "/etc/gshadow",
            "/etc/shadow"
          ],
          correct: 2,explanation: "The `/etc/gshadow` file stores group admin accounts, group password hashes, and user lists securely."
        },
        {
          question: "What is the difference between a primary group and a secondary group in Linux?",
          options: [
            "Primary groups are created automatically with the user; secondary groups are additional memberships",
            "Primary groups hold administrator rights; secondary groups do not",
            "Secondary groups have lower numerical GIDs",
            "There is no difference in their capabilities"
          ],
          correct: 0,explanation: "Every user has exactly one primary group (created by default with their user account). Secondary groups are additional groups a user can be joined to for folder permissions."
        },
        {
          question: "Which command is used to change the group ownership of a file without changing the user owner?",
          options: [
            "groupmod",
            "chgrp",
            "gpasswd",
            "chown"
          ],
          correct: 1,explanation: "The 'chgrp' command changes only the group ownership. 'chown' can change user ownership, or both using user:group syntax."
        },
        {
          question: "Which command changes the owner to student and group to ibmgrp for the file data.txt?",
          options: [
            "chown student:ibmgrp data.txt",
            "groupmod student:ibmgrp data.txt",
            "chgrp student:ibmgrp data.txt",
            "chown ibmgrp:student data.txt"
          ],
          correct: 0,explanation: "The 'chown owner:group file' command updates both owner and group metadata records simultaneously."
        },
        {
          question: "Which command is used to create a new group with a specific GID of 4000?",
          options: [
            "groupmod -g 4000 groupname",
            "gpasswd -g 4000 groupname",
            "groupadd -g 4000 groupname",
            "groupadd -u 4000 groupname"
          ],
          correct: 2,explanation: "The '-g' flag with 'groupadd' specifies the group ID (GID) number for the new group."
        },
        {
          question: "What is the purpose of the '-R' flag in chown or chgrp commands?",
          options: [
            "Reports ownership properties verbosely in stdout",
            "Reverts ownership back to root",
            "Removes ownership boundaries",
            "Changes ownership recursively for all files and directories in a path"
          ],
          correct: 3,explanation: "The '-R' (recursive) flag applies ownership changes to the directory and all of its files and nested subdirectories."
        },
        {
          question: "If you want to remove user bob from secondary group devgrp, which command do you use?",
          options: [
            "groupmod -d bob devgrp",
            "gpasswd -d bob devgrp",
            "groupdel bob devgrp",
            "usermod -d bob devgrp"
          ],
          correct: 1,explanation: "The 'gpasswd -d user group' command removes a member from a secondary group."
        }
      ]
    },
    'basic-permissions': {
      title: "Basic File Permissions",
      questions: [
        {
          question: "What octal value represents read (r), write (w), and execute (x) permissions respectively?",
          options: [
            "2, 4, 1",
            "1, 2, 4",
            "4, 1, 2",
            "4, 2, 1"
          ],
          correct: 3,explanation: "In octal permission representation, Read (r) has a weight of 4, Write (w) has a weight of 2, and Execute (x) has a weight of 1."
        },
        {
          question: "Which numeric permission represents user=rwx, group=r-x, others=--- (no access)?",
          options: [
            "750",
            "700",
            "644",
            "777"
          ],
          correct: 0,explanation: "u=rwx (4+2+1=7), g=r-x (4+0+1=5), and o=--- (0+0+0=0) results in the octal code 750."
        },
        {
          question: "If you want to grant read and execute permissions to everyone for directory /mumbai, overwriting all existing rules, which command is correct?",
          options: [
            "chmod ugo+rx /mumbai",
            "chmod 777 /mumbai",
            "chmod o+rx /mumbai",
            "chmod ugo=rx /mumbai"
          ],
          correct: 3,explanation: "The '=' operator sets the permissions exactly as specified, overwriting any previous settings for user, group, and others (ugo)."
        },
        {
          question: "What does the command 'chmod o-rx /mumbai' do?",
          options: [
            "Removes read and execute permissions from Others (world)",
            "Restores read and execute permissions to Group",
            "Removes read and execute permissions from Owner",
            "Overwrites Others to write-only"
          ],
          correct: 0,explanation: "The selector 'o' refers to Others (world), and '-rx' removes read (r) and execute (x) access rights."
        },
        {
          question: "Which chmod selector represents 'all users' (User + Group + Others)?",
          options: [
            "o",
            "a",
            "g",
            "u"
          ],
          correct: 1,explanation: "The 'a' (all) selector is a shorthand equivalent to specifying 'ugo' (User, Group, and Others) simultaneously."
        },
        {
          question: "In the permission string '-rwxr-xr-x', what type of resource does the first dash (-) represent?",
          options: [
            "A symbolic link",
            "A standard regular file",
            "A block device",
            "A directory"
          ],
          correct: 1,explanation: "A leading dash '-' indicates a regular file. A leading 'd' indicates a directory, and 'l' indicates a symbolic link."
        },
        {
          question: "What is the symbolic string equivalent to numeric permission 644?",
          options: [
            "rw-r--r--",
            "rwxrwxrwx",
            "rwxr-xr-x",
            "rw-rw-rw-"
          ],
          correct: 0,explanation: "6 maps to rw- (4+2), 4 maps to r-- (4), and 4 maps to r-- (4), producing the string 'rw-r--r--'."
        },
        {
          question: "Which command will remove execute permissions from the owner (user) only for script.sh?",
          options: [
            "chmod u-x script.sh",
            "chmod a-x script.sh",
            "chmod g-x script.sh",
            "chmod o-x script.sh"
          ],
          correct: 0,explanation: "The selector 'u' targets only the Owner (User), and '-x' removes their Execute permission."
        }
      ]
    },
    'acl-permissions': {
      title: "ACL File Permissions",
      questions: [
        {
          question: "What does the abbreviation ACL stand for in Linux systems?",
          options: [
            "Automated Control Link",
            "Active Component Logger",
            "Access Control List",
            "Administrator Command Language"
          ],
          correct: 2,explanation: "ACL stands for Access Control List, which provides granular user/group level overrides for filesystem permissions."
        },
        {
          question: "Which command is used to read and print the active ACL rules for directory /mumbai?",
          options: [
            "ls -acl /mumbai",
            "setfacl -g /mumbai",
            "showfacl /mumbai",
            "getfacl /mumbai"
          ],
          correct: 3,explanation: "The 'getfacl' (get file access control list) command reads and outputs the active ACL rules for files and folders."
        },
        {
          question: "Which command option flag is used to modify or add a custom rule in setfacl?",
          options: [
            "-b",
            "-d",
            "-x",
            "-m"
          ],
          correct: 3,explanation: "The '-m' (modify) option is used to add new entries or adjust permissions of existing ACL records."
        },
        {
          question: "Which command will remove all custom user and group ACL rules from file note.txt?",
          options: [
            "setfacl -x note.txt",
            "setfacl -b note.txt",
            "setfacl -d note.txt",
            "getfacl -c note.txt"
          ],
          correct: 1,explanation: "The '-b' (remove-all/base) flag clears all extended ACL rules, returning the file/directory to standard basic permissions."
        },
        {
          question: "How do you specify a custom ACL rule that grants user 'sara' full read, write, and execute permissions?",
          options: [
            "user::sara::rwx",
            "setfacl:sara:rwx",
            "sara:rwx",
            "u:sara:rwx"
          ],
          correct: 3,explanation: "The correct entry format is 'u:username:permissions' where 'u' stands for user, 'sara' is the name, and 'rwx' represent permissions."
        },
        {
          question: "Which command option removes a single specific ACL user or group rule from a file?",
          options: [
            "-r",
            "-b",
            "-m",
            "-x"
          ],
          correct: 3,explanation: "The '-x' flag is used to remove a single, specific ACL entry (e.g. setfacl -x u:sara: /mumbai)."
        },
        {
          question: "What is the equivalent setfacl command to grant group 'indiagrp' read and execute access using octal syntax?",
          options: [
            "setfacl -x g:indiagrp:5 /mumbai",
            "setfacl -m g:indiagrp:5 /mumbai",
            "setfacl -m u:indiagrp:5 /mumbai",
            "setfacl -m g:indiagrp:rx /mumbai"
          ],
          correct: 1,explanation: "The permission weight 5 represents read and execute (4+1). To apply this to a group, 'g:groupname:5' is used with the modify flag '-m'."
        },
        {
          question: "If a file has custom ACLs applied, what character appears at the end of the permission listing in 'ls -l'?",
          options: [
            "# (hash)",
            "+ (plus sign)",
            "@ (at sign)",
            "* (asterisk)"
          ],
          correct: 1,explanation: "When extended access control lists are configured on a resource, an ending plus sign (+) is appended to the standard 10-character permissions field in 'ls -l'."
        }
      ]
    },
    'system-security': {
      title: "Linux System Security",
      questions: [
        {
          question: "Which special permission bit causes an executable binary file to run with the permissions of the file owner?",
          options: [
            "ACL Access Context",
            "Sticky Bit",
            "SGID (Set Group ID)",
            "SUID (Set User ID)"
          ],
          correct: 3,explanation: "SUID (Set User ID) causes a program binary to execute with the system privileges of the file owner (e.g. root) rather than the user running it."
        },
        {
          question: "What is the primary purpose of setting the Sticky Bit on a shared directory like /tmp?",
          options: [
            "To execute all files in the directory with administrative privileges",
            "To ensure only the file owner or root can delete or rename files inside the directory",
            "To prevent anyone from reading files inside the directory",
            "To automatically encrypt all files created in the directory"
          ],
          correct: 1,explanation: "The Sticky Bit (chmod +t) prevents users from deleting or renaming files created by other users within shared directories."
        },
        {
          question: "When the SGID (Set Group ID) bit is set on a directory, what is the effect on new files created inside it?",
          options: [
            "They inherit the primary group ownership of the directory's owner",
            "They are automatically locked against writes",
            "They are executed automatically by the kernel",
            "They inherit the group ownership of the parent directory itself"
          ],
          correct: 3,explanation: "Setting SGID (chmod g+s) on a directory causes newly created files to automatically inherit the directory's group owner rather than the creator's group."
        },
        {
          question: "What are the three primary runtime modes of Security-Enhanced Linux (SELinux)?",
          options: [
            "Enforcing, Permissive, Disabled",
            "Read, Write, Execute",
            "Root, User, Guest",
            "Active, Inactive, Standby"
          ],
          correct: 0,explanation: "SELinux operates in one of three modes: Enforcing (blocks unauthorized actions), Permissive (logs actions but does not block), or Disabled."
        },
        {
          question: "Which command is used to temporarily switch the active SELinux mode to Permissive?",
          options: [
            "sestatus --permissive",
            "setenforce Permissive (or setenforce 0)",
            "setenforce Enforcing (or setenforce 1)",
            "getenforce 0"
          ],
          correct: 1,explanation: "'setenforce 0' switches the active SELinux mode to Permissive. It requires root privileges."
        },
        {
          question: "What is the standard format sequence of a SELinux security context label?",
          options: [
            "path:permissions:context:mode",
            "domain:policy:label:class",
            "owner:group:others:special",
            "user:role:type:sensitivity"
          ],
          correct: 3,explanation: "SELinux contexts are formatted as 'user:role:type:sensitivity' (e.g. system_u:object_r:etc_t:s0)."
        },
        {
          question: "Which firewall-cmd command allows HTTP web traffic through the public zone, retaining the rule across reboots?",
          options: [
            "firewall-cmd --zone=public --allow=http",
            "firewall-cmd --reload http",
            "firewall-cmd --zone=public --add-port=80",
            "firewall-cmd --zone=public --add-service=http --permanent"
          ],
          correct: 3,explanation: "The '--add-service=http' flag opens port 80, and the '--permanent' flag ensures the rule persists after reboots/reloads."
        },
        {
          question: "After adding a permanent rule with firewall-cmd, which command must be run to apply the changes immediately?",
          options: [
            "setenforce 1",
            "firewall-cmd --state",
            "firewall-cmd --reload",
            "systemctl start firewalld"
          ],
          correct: 2,explanation: "The 'firewall-cmd --reload' command reloads firewall policy rules and activates any pending permanent configurations."
        }
      ]
    },
    'regular-expressions': {
      title: "Regular Expressions & Filters",
      questions: [
        {
          question: "Which grep option is used to display the line numbers of any matching strings in a text file?",
          options: [
            "grep -c pattern file",
            "grep -l pattern file",
            "grep -v pattern file",
            "grep -n pattern file"
          ],
          correct: 3,explanation: "The '-n' option prefixes each matching line in the output with its 1-indexed line number from the source file."
        },
        {
          question: "How do you search for the word 'secure' in a case-insensitive manner using grep?",
          options: [
            "grep -E secure file",
            "grep -v secure file",
            "grep -i secure file",
            "grep -c secure file"
          ],
          correct: 2,explanation: "The '-i' flag stands for case-insensitive matching, allowing 'secure', 'Secure', 'SECURE', etc., to match."
        },
        {
          question: "Which sed command prints only line 3 of the configuration file 'app.conf'?",
          options: [
            "sed '3d' app.conf",
            "sed -n '3p' app.conf",
            "sed -i '3p' app.conf",
            "sed '3p' app.conf"
          ],
          correct: 1,explanation: "The '-n' option suppresses automatic printing, and '3p' instructs sed to print only the third line."
        },
        {
          question: "What is the result of running sed 's/localhost/127.0.0.1/g' on a stream?",
          options: [
            "It replaces only the first occurrence of 'localhost' on each line",
            "It replaces all occurrences of 'localhost' on each line with '127.0.0.1'",
            "It edits the file in-place, saving the changes",
            "It deletes all lines containing 'localhost'"
          ],
          correct: 1,explanation: "The 's/old/new/' command substitutes matches. Appending 'g' (global) replaces all occurrences in each line, rather than just the first."
        },
        {
          question: "In awk, which special variable represents the last field (column) of the current record?",
          options: [
            "NR",
            "$NF",
            "$(NF-1)",
            "$0"
          ],
          correct: 1,explanation: "NF is the Number of Fields variable; prefixing it with $ ($NF) retrieves the value of the last field. $(NF-1) returns the second-to-last field."
        },
        {
          question: "Which awk command prints the first column of lines where the second column equals 'dev'?",
          options: [
            "awk '$1==\\\"dev\\\" {print $2}' file",
            "awk '{print $1}' file",
            "awk '$2==\\\"dev\\\"' file",
            "awk '$2==\\\"dev\\\" {print $1}' file"
          ],
          correct: 3,explanation: "The condition is `$2==\"dev\"`, and the action `{print $1}` prints the first column for records matching that condition."
        },
        {
          question: "Which find command searches the '/usr' directory for files belonging to owner 'ratanji'?",
          options: [
            "find /usr -perm ratanji",
            "find /usr -user ratanji",
            "find /usr -owner ratanji",
            "find /usr -name ratanji"
          ],
          correct: 1,explanation: "The '-user' option filters the search tree by file owner. The '-group' option filters by group owner."
        },
        {
          question: "How do you search for files in '/tata' owned by user 'kiran' and copy them to '/backup/' in a single find operation?",
          options: [
            "find /tata -user kiran -dest /backup/",
            "find /tata -user kiran | cp /backup/",
            "find /tata -user kiran -exec cp -rvf {} /backup/ \\\\;",
            "find /tata -user kiran -copy /backup/"
          ],
          correct: 2,explanation: "The '-exec' flag runs a command (here 'cp') on each match, replacing '{}' with the match path and ending with a escaped semicolon '\\;'."
        }
      ]
    },
    'archive-files': {
      title: "Archive & Compression",
      questions: [
        {
          question: "Which tar option is used to compress or decompress an archive using the gzip algorithm?",
          options: [
            "-J",
            "-z",
            "-j",
            "-Z"
          ],
          correct: 1,explanation: "The '-z' flag specifies gzip compression/decompression (.tar.gz or .tgz files)."
        },
        {
          question: "Which tar option is used to decompress or compress an archive using the bzip2 algorithm?",
          options: [
            "-x",
            "-z",
            "-J",
            "-j"
          ],
          correct: 3,explanation: "The '-j' flag filters the archive through the bzip2 compression utility (.tar.bz2 files)."
        },
        {
          question: "Which tar option is used to decompress or compress an archive using the xz algorithm?",
          options: [
            "-z",
            "-x",
            "-J",
            "-j"
          ],
          correct: 2,explanation: "The '-J' (capital J) flag specifies the xz compression algorithm (.tar.xz files)."
        },
        {
          question: "What is the purpose of the '-C' flag when extracting an archive with tar?",
          options: [
            "To delete files after archiving them",
            "To force creation of a new archive",
            "To specify a custom destination directory for the extracted files",
            "To enable verbose listing of directories"
          ],
          correct: 2,explanation: "The '-C' option changes the target directory before performing extraction operations."
        },
        {
          question: "Which option allows you to inspect (list) the contents of a tar archive without extracting it?",
          options: [
            "-t",
            "-d",
            "-x",
            "-c"
          ],
          correct: 0,explanation: "The '-t' (test/list) option prints a list of files archived inside the target file without writing them to disk."
        },
        {
          question: "Which of the following commands creates a gzip-compressed archive named 'backup.tar.gz' from '/etc'?",
          options: [
            "tar -xzvf backup.tar.gz /etc",
            "tar -czvf backup.tar.gz /etc",
            "tar -tzvf backup.tar.gz /etc",
            "tar -cjvf backup.tar.gz /etc"
          ],
          correct: 1,explanation: "The '-c' flag creates, '-z' gzips, '-v' enables verbose reporting, and '-f' specifies the destination filename."
        },
        {
          question: "Which command shows the disk space consumed by a directory in a human-readable format?",
          options: [
            "df -h directory",
            "du -a directory",
            "ls -lh directory",
            "du -sh directory"
          ],
          correct: 3,explanation: "The 'du' utility measures disk usage; '-s' summarizes the folder total and '-h' outputs human-readable sizes (e.g. 4.0M)."
        },
        {
          question: "What is the result of running 'tar -xvjf archive.tar.bz2'?",
          options: [
            "It lists files inside a gzip archive",
            "It extracts an xz archive to a custom location",
            "It creates a new bzip2 archive verbosely",
            "It extracts a bzip2-compressed archive verbosely in the current directory"
          ],
          correct: 3,explanation: "The '-x' extracts, '-v' lists verbosely, and '-j' decompresses bzip2 algorithm format."
        }
      ]
    },
    'job-automation': {
      title: "Job Automation & Scheduling",
      questions: [
        {
          question: "Which command is used in RHEL to schedule a task to run exactly once at a future time?",
          options: [
            "crontab",
            "systemctl",
            "at",
            "batch"
          ],
          correct: 2,explanation: "The 'at' command schedules single, one-time task executions at a specified future timestamp."
        },
        {
          question: "In a 5-field cron syntax (* * * * * command), what does the first asterisk field represent?",
          options: [
            "Day of Week (0 - 6)",
            "Minute (0 - 59)",
            "Hour (0 - 23)",
            "Day of Month (1 - 31)"
          ],
          correct: 1,explanation: "The 5 cron fields are ordered: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-6)."
        },
        {
          question: "Which system configuration file is used to restrict or deny specific users from creating crontab jobs?",
          options: [
            "/etc/cron.allow",
            "/etc/crontab.lock",
            "/etc/cron.deny",
            "/etc/at.deny"
          ],
          correct: 2,explanation: "Users listed in '/etc/cron.deny' are prohibited from configuring or executing user crontabs."
        },
        {
          question: "Which command lists all pending jobs currently in the 'at' execution queue?",
          options: [
            "systemctl status atd",
            "crontab -l",
            "atrm",
            "atq"
          ],
          correct: 3,explanation: "The 'atq' command outputs the queue of scheduled one-time 'at' jobs along with their job IDs and scheduled times."
        },
        {
          question: "Which command option displays the active crontab schedule for the current user?",
          options: [
            "crontab -v",
            "crontab -r",
            "crontab -l",
            "crontab -e"
          ],
          correct: 2,explanation: "The '-l' (list) option displays the user's active cron file contents stored in '/var/spool/cron/'."
        },
        {
          question: "Which command allows a system administrator to edit the crontab schedule of another user named 'ajay'?",
          options: [
            "crontab -user ajay -l",
            "crontab -u ajay -e",
            "at -u ajay -e",
            "crontab -e ajay"
          ],
          correct: 1,explanation: "The '-u' flag specifies the target user account, combined with '-e' to edit that user's spool file."
        },
        {
          question: "How do you remove a pending job with ID 4 from the 'at' execution queue?",
          options: [
            "atrm 4",
            "systemctl kill at4",
            "crontab -r 4",
            "at -d 4"
          ],
          correct: 0,explanation: "The 'atrm' command followed by the job number deletes the specified job from the queue."
        },
        {
          question: "Which service must be stopped and disabled before manually setting the system date and time with timedatectl?",
          options: [
            "crond",
            "chronyd",
            "atd",
            "systemd-resolved"
          ],
          correct: 1,explanation: "Network time synchronization service 'chronyd' continuously updates system time, so it must be stopped before manually overriding the clock."
        }
      ]
    },
    'bash-scripting': {
      title: "Bash Scripting & Automation",
      questions: [
        {
          question: "Which declaration at the top line of a script tells the operating system which shell interpreter to use?",
          options: [
            "#bin/bash",
            "<?php bash ?>",
            "#!/bin/bash",
            "//$shell/bash"
          ],
          correct: 2,explanation: "The Shebang ('#!/bin/bash') specifies the absolute path to the binary interpreter that executes the script."
        },
        {
          question: "In the Operating System architecture flow, what component acts as the command interpreter bridge between the User and Kernel?",
          options: [
            "BIOS",
            "Hardware",
            "Shell",
            "Systemd"
          ],
          correct: 2,explanation: "The Shell receives user commands, interprets them into system calls, and requests the Kernel to execute instructions."
        },
        {
          question: "Which command grants execute permissions to a script named 'myscript.sh' so it can be run as './myscript.sh'?",
          options: [
            "chmod 644 myscript.sh",
            "touch +x myscript.sh",
            "chmod +x myscript.sh",
            "chown +x myscript.sh"
          ],
          correct: 2,explanation: "The 'chmod +x' command adds the execution ('x') bit for the owner, group, and others."
        },
        {
          question: "How are single-line comments defined inside a Bash shell script?",
          options: [
            "Using REM comment",
            "Using the hash symbol (#)",
            "Using double slashes (//)",
            "Using /* comment */"
          ],
          correct: 1,explanation: "Lines or inline text starting with '#' (except the top shebang line) are ignored by the shell interpreter."
        },
        {
          question: "Which special variable holds the exit status code of the last executed command ($? == 0 for success)?",
          options: [
            "$0",
            "$*",
            "$?",
            "$#"
          ],
          correct: 2,explanation: "The '$?' variable returns 0 if the previous command completed successfully and non-zero if an error occurred."
        },
        {
          question: "What is the default interactive shell interpreter used across Red Hat Enterprise Linux (RHEL) installations?",
          options: [
            "Bourne Again Shell (/bin/bash)",
            "Korn Shell (/bin/ksh)",
            "Bourne Shell (/bin/sh)",
            "C Shell (/bin/csh)"
          ],
          correct: 0,explanation: "Bash (/bin/bash) is the default, standard shell on RHEL, CentOS, and Fedora systems."
        },
        {
          question: "In the analogy 'Terminal is the room', what represents the person in the room taking orders?",
          options: [
            "The Font renderer",
            "The Graphic card",
            "The Hardware",
            "The Shell program"
          ],
          correct: 3,explanation: "The Terminal is the display window; the Shell is the interpreter taking and executing commands."
        },
        {
          question: "In a positional script parameter, how do you reference the first command-line argument passed to the script (e.g. ./restore.sh file.tar.gz)?",
          options: [
            "$1",
            "$0",
            "$ARG1",
            "$FILE"
          ],
          correct: 0,explanation: "Positional parameters are indexed starting at $1 for the first argument ($0 contains the script name itself)."
        }
      ]
    },
    'firewall-management': {
      title: "Firewall Management (firewall-cmd)",
      questions: [
        {
          question: "What is the primary role of a firewall in Linux operating systems?",
          options: [
            "Speed up CPU processing for network packets",
            "Encrypt files stored on local hard drives",
            "Automatically configure DHCP IP address leases",
            "Filter incoming and outgoing network traffic based on predefined security rules"
          ],
          correct: 3,explanation: "A firewall acts as a security barrier filtering incoming and outgoing network traffic to allow or deny connections."
        },
        {
          question: "What is a 'Zone' in firewalld security management?",
          options: [
            "A predefined security profile with rules based on network trust level",
            "A sub-folder inside the /etc directory",
            "A group of user accounts with admin rights",
            "A physical partition on the hard drive"
          ],
          correct: 0,explanation: "A zone is a trust profile (e.g., public, work, trusted) containing tailored rules for attached network interfaces."
        },
        {
          question: "Which command displays the current active default firewall zone?",
          options: [
            "systemctl status default-zone",
            "firewall-cmd --show-active",
            "firewall-cmd --list-zones-only",
            "firewall-cmd --get-default-zone"
          ],
          correct: 3,explanation: "'firewall-cmd --get-default-zone' outputs the active default zone name (e.g. public)."
        },
        {
          question: "Which command permanently opens the 'ssh' service in the default firewall zone?",
          options: [
            "firewall-cmd --permanent --add-service=ssh",
            "firewall-cmd --open-service=ssh",
            "firewall-cmd --add-port=22 --permanent",
            "systemctl enable ssh --firewall"
          ],
          correct: 0,explanation: "'firewall-cmd --permanent --add-service=ssh' adds the ssh service rule persistently across reboots."
        },
        {
          question: "Which command reloads permanent firewall configuration rules into active runtime memory?",
          options: [
            "systemctl restart network",
            "firewall-cmd --reload",
            "firewall-cmd --refresh",
            "firewall-cmd --save"
          ],
          correct: 1,explanation: "'firewall-cmd --reload' loads permanent configuration rules into the active runtime memory."
        },
        {
          question: "Which command opens TCP port 22 permanently in the default firewall zone?",
          options: [
            "firewall-cmd --allow-port=22",
            "firewall-cmd --permanent --add-port=22/tcp",
            "systemctl open-port 22/tcp",
            "firewall-cmd --port=22/tcp --enable"
          ],
          correct: 1,explanation: "'firewall-cmd --permanent --add-port=22/tcp' opens port 22 with the TCP protocol specification."
        },
        {
          question: "How do you permanently add multiple services (ssh, http, https, dhcp) in a single command?",
          options: [
            "systemctl add-services ssh,http,https,dhcp",
            "firewall-cmd --add-service ssh http https dhcp",
            "firewall-cmd --permanent --add-service={ssh,http,https,dhcp}",
            "firewall-cmd --services=ssh+http+https+dhcp"
          ],
          correct: 2,explanation: "Using bash brace expansion '--add-service={ssh,http,https,dhcp}' enables multiple services in one command."
        },
        {
          question: "Which command sets the active default zone persistently to 'work'?",
          options: [
            "firewall-cmd --zone=work --default",
            "firewall-cmd --change-zone=work",
            "systemctl set-zone work",
            "firewall-cmd --set-default-zone=work"
          ],
          correct: 3,explanation: "'firewall-cmd --set-default-zone=work' updates the default active security zone to work."
        }
      ]
    },
    'remote-file-transfer': {
      title: "Remote File Transfer (scp & rsync)",
      questions: [
        {
          question: "Which network port and underlying protocol are used by both 'scp' and 'rsync' for secure transfer?",
          options: [
            "UDP Port 69 over TFTP",
            "TCP Port 22 over SSH",
            "TCP Port 21 over FTP",
            "TCP Port 80 over HTTP"
          ],
          correct: 1,explanation: "Both scp and rsync encrypt file transfers using SSH over TCP Port 22 by default."
        },
        {
          question: "What is the primary advantage of 'rsync' over standard 'scp' for file transfers?",
          options: [
            "rsync supports remote synchronization and transfers only modified delta blocks for incremental backups",
            "rsync uses unencrypted plain text for 10x faster transfer speed",
            "rsync does not require user authentication on the remote host",
            "rsync automatically deletes local source files upon completion"
          ],
          correct: 0,explanation: "rsync checks file modification timestamps/checksums and transfers only differences (delta transfer), making it ideal for incremental backups."
        },
        {
          question: "Which option flag is required with 'scp' to recursively copy an entire directory?",
          options: [
            "-p",
            "-f",
            "-v",
            "-r (or -R)"
          ],
          correct: 3,explanation: "The '-r' (recursive) flag must be specified with 'scp' when copying folders containing subdirectories or multiple files."
        },
        {
          question: "Which command correctly transfers local file '/cisco/router1.txt' to directory '/home/' on remote server '192.168.1.3' as root?",
          options: [
            "scp -r /cisco/router1.txt root@192.168.1.3:/home/",
            "cp /cisco/router1.txt root@192.168.1.3:/home/",
            "ssh 192.168.1.3 send /cisco/router1.txt",
            "rsync --download /cisco/router1.txt 192.168.1.3"
          ],
          correct: 0,explanation: "'scp -r /cisco/router1.txt root@192.168.1.3:/home/' transfers the specified local file to the remote server location."
        },
        {
          question: "Which rsync command flags enable recursive directory traversal (-r) and verbose output (-v)?",
          options: [
            "-rv (or -r -v)",
            "-q -s",
            "-z -a",
            "-x -y"
          ],
          correct: 0,explanation: "The '-r' flag specifies recursive copying of directories, and '-v' enables verbose output during the rsync process."
        },
        {
          question: "How do you download a remote file '/home/router1.txt' from server '192.168.1.3' into local directory '/mnt/' using scp?",
          options: [
            "rsync -get root@192.168.1.3:/home/router1.txt",
            "ssh pull root@192.168.1.3:/home/router1.txt",
            "scp -r root@192.168.1.3:/home/router1.txt /mnt/",
            "scp -r /mnt/ root@192.168.1.3:/home/router1.txt"
          ],
          correct: 2,explanation: "To download from a remote host to a local path, place the remote specifier ('user@host:path') as the first argument and the local directory as the second argument."
        }
      ]
    },
    'ssh-remote-access': {
      title: "SSH Remote Access & Key Authentication",
      questions: [
        {
          question: "Which default network TCP port number is used by the SSH (Secure Shell) protocol?",
          options: [
            "23",
            "22",
            "80",
            "443"
          ],
          correct: 1,explanation: "SSH operates on TCP Port 22 by default."
        },
        {
          question: "Which legacy unencrypted remote access protocol has been replaced by SSH?",
          options: [
            "SMTP",
            "Telnet",
            "FTP",
            "HTTP"
          ],
          correct: 1,explanation: "Telnet transmitted credentials in cleartext and has been replaced by encrypted SSH."
        },
        {
          question: "Which configuration file on the SSH server manages root login permissions and authentication settings?",
          options: [
            "/var/log/sshd.log",
            "/etc/ssh/sshd_config",
            "/etc/ssh/ssh_config",
            "/etc/security/ssh.conf"
          ],
          correct: 1,explanation: "The daemon configuration file '/etc/ssh/sshd_config' controls server-side SSH policies."
        },
        {
          question: "Which command generates an RSA public/private keypair for passwordless SSH authentication?",
          options: [
            "ssh-keygen",
            "ssh-copy-id",
            "keygen --ssh",
            "openssl genrsa"
          ],
          correct: 0,explanation: "The 'ssh-keygen' command creates public (~/.ssh/id_rsa.pub) and private (~/.ssh/id_rsa) key files."
        },
        {
          question: "Which command transfers a client's public key to a remote host for passwordless authentication?",
          options: [
            "ssh-copy-id user@hostname",
            "ssh-add user@hostname",
            "scp id_rsa.pub user@hostname",
            "cp ~/.ssh/id_rsa.pub /remote"
          ],
          correct: 0,explanation: "'ssh-copy-id user@hostname' installs the public key into the remote user's '~/.ssh/authorized_keys' file."
        },
        {
          question: "Where are authorized client public keys stored on the remote SSH server?",
          options: [
            "~/.ssh/authorized_keys",
            "/var/log/authorized_keys",
            "/etc/ssh/keys.pub",
            "~/.ssh/known_hosts"
          ],
          correct: 0,explanation: "Authorized keys for a user are appended to their personal '~/.ssh/authorized_keys' file."
        },
        {
          question: "How do you revoke passwordless SSH key authentication for a specific user on a server?",
          options: [
            "Run systemctl disable sshd",
            "Delete or remove their authorized_keys file (e.g. rm -rf ~/.ssh/authorized_keys)",
            "Change the user shell to /bin/bash",
            "Restart NetworkManager service"
          ],
          correct: 1,explanation: "Removing the target authorized_keys file revokes passwordless key-based access."
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
            "A hardware driver module for disk drives",
            "A user interface window manager"
          ],
          correct: 0,explanation: "A daemon is a background process operating independently without user intervention."
        },
        {
          question: "Which primary CLI utility controls and manages systemd background services in RHEL 10?",
          options: [
            "initctl",
            "service-control",
            "daemonctl",
            "systemctl"
          ],
          correct: 3,explanation: "'systemctl' is the core command-line utility for managing systemd units and daemons."
        },
        {
          question: "Which systemctl command enables a service to start automatically whenever the server boots up?",
          options: [
            "systemctl auto service_name",
            "systemctl boot service_name",
            "systemctl enable service_name",
            "systemctl start service_name"
          ],
          correct: 2,explanation: "'systemctl enable' configures boot symlinks for automatic service startup."
        },
        {
          question: "Which command checks the active process ID, running state, and log output of the SSH daemon?",
          options: [
            "systemctl check sshd",
            "systemctl info sshd",
            "ps -ef sshd",
            "systemctl status sshd"
          ],
          correct: 3,explanation: "'systemctl status sshd' displays runtime state, memory usage, PID, and diagnostic log lines."
        }
      ]
    },
    'network-management': {
      title: "Network Management & nmcli",
      questions: [
        {
          question: "Which modern command line utility is used to inspect network interface IP addresses in RHEL 10?",
          options: [
            "netstat -a",
            "ip addr (or ip a)",
            "route -n",
            "ping -c 4"
          ],
          correct: 1,explanation: "The 'ip addr' (or 'ip a') command from iproute2 is the standard modern utility for viewing IP addresses and interface states."
        },
        {
          question: "What does the abbreviation 'nmcli' stand for?",
          options: [
            "Node Machine Link Controller",
            "NetworkManager Command Line Interface",
            "New Media Client Connection Interface",
            "Network Module Core Layer Interface"
          ],
          correct: 1,explanation: "'nmcli' stands for NetworkManager Command Line Interface."
        },
        {
          question: "Which command displays the hardware interface status, device types, and active connection bindings?",
          options: [
            "nmcli dev status",
            "ifconfig --all",
            "nmcli conn show",
            "hostnamectl status"
          ],
          correct: 0,explanation: "'nmcli dev status' lists network interfaces, connection states (connected/disconnected), and bound profiles."
        },
        {
          question: "Which command lists all saved connection profiles along with their UUIDs and interface bindings?",
          options: [
            "cat /etc/hosts",
            "ip link show",
            "nmcli conn show",
            "nmcli dev show"
          ],
          correct: 2,explanation: "'nmcli conn show' lists saved NetworkManager connection profiles."
        },
        {
          question: "Which nmcli option creates a static IPv4 connection profile named 'delhi' bound to interface 'enp0s3'?",
          options: [
            "ifconfig enp0s3 192.168.1.2 static",
            "ip addr add 192.168.1.2 dev enp0s3 permanent",
            "nmcli net create delhi --ip 192.168.1.2",
            "nmcli conn add con-name delhi ifname enp0s3 type ethernet ipv4.addresses 192.168.1.2/24 gw4 192.168.1.1 ipv4.dns 192.168.1.1 connection.autoconnect yes ipv4.method manual"
          ],
          correct: 3,explanation: "'nmcli conn add' with 'con-name', 'ifname', 'ipv4.addresses', 'gw4', and 'ipv4.method manual' configures a static profile."
        },
        {
          question: "Where are NetworkManager persistent connection keyfile configuration files stored on disk?",
          options: [
            "/etc/NetworkManager/system-connections/",
            "/usr/lib/systemd/network/",
            "/etc/sysconfig/network-scripts/ifcfg-eth0",
            "/var/log/network/"
          ],
          correct: 0,explanation: "In modern RHEL, keyfiles are stored under '/etc/NetworkManager/system-connections/'."
        },
        {
          question: "Which command activates a saved connection profile named 'delhi'?",
          options: [
            "nmcli conn start delhi",
            "systemctl restart delhi",
            "nmcli dev enable delhi",
            "nmcli conn up delhi"
          ],
          correct: 3,explanation: "Executing 'nmcli conn up delhi' brings up and activates connection profile 'delhi'."
        },
        {
          question: "Which command sets the system static hostname persistently to 'server1.example.com'?",
          options: [
            "nmcli host set server1.example.com",
            "echo server1 > /proc/sys/kernel/hostname",
            "hostname --set server1.example.com",
            "hostnamectl set-hostname server1.example.com"
          ],
          correct: 3,explanation: "'hostnamectl set-hostname server1.example.com' updates static hostname settings persistently in /etc/hostname."
        },
        {
          question: "What is 'nmtui'?",
          options: [
            "A ncurses-based Text User Interface for managing NetworkManager interactively",
            "A background kernel daemon for managing routing tables",
            "An graphical web browser for viewing network status",
            "A command for tracing network packet hops"
          ],
          correct: 0,explanation: "'nmtui' is a Text User Interface menu-driven application for NetworkManager."
        },
        {
          question: "How do you configure an automatic DHCP connection profile named 'goa' via nmcli?",
          options: [
            "nmcli conn add con-name goa ifname enp0s3 type ethernet connection.autoconnect yes ipv4.method auto",
            "nmcli conn add goa dhcp=on",
            "ip dhcp client add goa",
            "ifconfig enp0s3 dhcp"
          ],
          correct: 0,explanation: "Setting 'ipv4.method auto' configures the connection profile to request IP settings from a local DHCP server."
        }
      ]
    },
    'disk-partitioning': {
      title: "Disk Partitioning & Storage",
      questions: [
        {
          question: "Which device file node does Linux assign to the first SATA hard disk drive installed in the system?",
          options: [
            "/dev/vda",
            "/dev/hda",
            "/dev/sda",
            "/dev/sdb"
          ],
          correct: 2,explanation: "Linux names SATA disks starting at '/dev/sda' for disk 1, '/dev/sdb' for disk 2, and so on."
        },
        {
          question: "What is the default filesystem created on fresh Red Hat Enterprise Linux (RHEL 7/8/9/10) disk partitions?",
          options: [
            "NTFS",
            "XFS",
            "EXT4",
            "FAT32"
          ],
          correct: 1,explanation: "XFS is the default, high-performance, robust filesystem for RHEL installations."
        },
        {
          question: "Which command lists all block devices along with their partition tree hierarchy and active mount points?",
          options: [
            "lsblk",
            "fdisk -l",
            "blkid",
            "df -h"
          ],
          correct: 0,explanation: "The 'lsblk' utility presents block devices in a clear tree layout showing disk sizes and mount points."
        },
        {
          question: "Which command formats partition '/dev/sdb1' with the XFS file system structure?",
          options: [
            "mkfs.xfs /dev/sdb1",
            "fdisk.xfs /dev/sdb1",
            "mount.xfs /dev/sdb1",
            "format.xfs /dev/sdb1"
          ],
          correct: 0,explanation: "The 'mkfs.xfs /dev/sdb1' command writes XFS filesystem metadata structures to the target partition."
        },
        {
          question: "Which system configuration file stores persistent drive mount instructions loaded during OS boot?",
          options: [
            "/etc/sysconfig/storage",
            "/etc/mtab",
            "/etc/exports",
            "/etc/fstab"
          ],
          correct: 3,explanation: "The '/etc/fstab' file lists static filesystem mounts evaluated automatically during bootup."
        },
        {
          question: "Which command tests and mounts all filesystem entries specified in '/etc/fstab' without rebooting?",
          options: [
            "mount -a",
            "systemctl reload fstab",
            "lsblk -a",
            "mount --all-fstab"
          ],
          correct: 0,explanation: "Executing 'mount -a' mounts all non-mounted filesystems declared inside '/etc/fstab'."
        },
        {
          question: "Which command inspects and displays the Universal Unique Identifier (UUID) and filesystem type of '/dev/sdb1'?",
          options: [
            "uuid /dev/sdb1",
            "blkid /dev/sdb1",
            "fdisk --uuid /dev/sdb1",
            "lsblk -u /dev/sdb1"
          ],
          correct: 1,explanation: "The 'blkid' command locates and prints block device attributes including UUID and TYPE."
        },
        {
          question: "Inside the interactive 'fdisk /dev/sdb' tool, which single-letter command saves changes to disk and exits?",
          options: [
            "x",
            "s",
            "w",
            "q"
          ],
          correct: 2,explanation: "In 'fdisk', 'w' writes the altered partition table to the disk, whereas 'q' quits without saving."
        },
        {
          question: "Which command is used to check and repair filesystem errors on an ext4 partition before resizing it?",
          options: [
            "fsck.xfs",
            "e2fsck -f",
            "resize2fs -check",
            "mkfs.ext4 -f"
          ],
          correct: 1,explanation: "The 'e2fsck' (ext2/3/4 filesystem check) utility checks filesystem consistency. Resizing EXT4 requires a clean filesystem status."
        },
        {
          question: "Which utility grows/expands an online mounted XFS filesystem to match its resized underlying partition?",
          options: [
            "mkfs.xfs -grow",
            "mount -o remount,grow",
            "xfs_growfs",
            "resize2fs"
          ],
          correct: 2,explanation: "The 'xfs_growfs' utility grows an XFS filesystem online. It targets the mounted directory path, not the raw device node."
        },
        {
          question: "What is a key difference between resizing EXT4 and XFS filesystems?",
          options: [
            "EXT4 supports extending and shrinking; XFS only supports extending",
            "XFS must be resized offline; EXT4 can only be grown online",
            "XFS supports extending and shrinking; EXT4 only supports extending",
            "Neither filesystem can be grown or extended once formatted"
          ],
          correct: 0,explanation: "EXT4 is highly flexible and supports shrinking (offline) and growing. XFS only supports extending (online) and cannot be shrunk."
        },
        {
          question: "Which RHEL command sets up a formatted swap signature on a newly partitioned disk space (e.g. /dev/sdb3)?",
          options: [
            "swapon /dev/sdb3",
            "format -t swap /dev/sdb3",
            "mkswap /dev/sdb3",
            "mkfs.swap /dev/sdb3"
          ],
          correct: 2,explanation: "The 'mkswap' utility writes swap area metadata headers onto the specified partition or block device."
        },
        {
          question: "How do you enable all swap spaces persistently configured inside the '/etc/fstab' file?",
          options: [
            "systemctl restart swap",
            "swapon -a",
            "mount -a",
            "swapoff -a"
          ],
          correct: 1,explanation: "The 'swapon -a' command reads the '/etc/fstab' file and activates all swap devices listed there."
        },
        {
          question: "What are the three core components/abstractions used by LVM to manage storage?",
          options: [
            "SATA, PATA, and Virtual SCSI Disk interfaces",
            "Physical Volume (PV), Volume Group (VG), and Logical Volume (LV)",
            "Master Boot Record (MBR), Partition Table, and File Allocation Table",
            "inode, Block, and Superblock descriptors"
          ],
          correct: 1,explanation: "LVM works by initializing Physical Volumes (PV), grouping them into a Volume Group (VG), and carving out Logical Volumes (LV)."
        },
        {
          question: "Which fdisk partition type code corresponds to a Linux LVM partition?",
          options: [
            "8e",
            "82 swap",
            "82",
            "83"
          ],
          correct: 0,explanation: "The Hex partition type ID '8e' assigns a partition for Linux LVM. '82' is for Linux swap, and '83' is standard Linux filesystem."
        },
        {
          question: "Which command initializes a raw block device or partition as an LVM Physical Volume (PV)?",
          options: [
            "vgcreate /dev/sdb1",
            "pvcreate /dev/sdb1",
            "lvcreate /dev/sdb1",
            "mkswap /dev/sdb1"
          ],
          correct: 1,explanation: "The 'pvcreate' command formats a raw disk or partition to make it available as a Physical Volume (PV) for LVM."
        },
        {
          question: "Which command combines physical volumes '/dev/sdb1' and '/dev/sdb2' into a volume group named 'india'?",
          options: [
            "lvcreate india /dev/sdb1 /dev/sdb2",
            "pvcreate india /dev/sdb1 /dev/sdb2",
            "vgcreate india /dev/sdb1 /dev/sdb2",
            "vgextend india /dev/sdb1 /dev/sdb2"
          ],
          correct: 2,explanation: "The 'vgcreate' command constructs a new Volume Group (VG) pool by binding specified Physical Volumes (PVs)."
        },
        {
          question: "Which command carves out a new 200 Megabyte Logical Volume named 'punelv' from Volume Group 'india'?",
          options: [
            "lvcreate -size 200 -name punelv india",
            "lvcreate -L 200 -n punelv india",
            "lvcreate -l 200 -n punelv india",
            "lvextend -L +200M india/punelv"
          ],
          correct: 1,explanation: "The 'lvcreate -L 200 -n punelv india' creates an LV of size 200MB (-L specifies size in MB, -n specifies name) inside Volume Group 'india'."
        },
        {
          question: "What is the correct logical order of commands to dismantle and completely remove an LVM storage stack?",
          options: [
            "umount, lvremove, vgremove, pvremove, fdisk partition delete",
            "pvremove, vgremove, lvremove, umount, fdisk partition delete",
            "fdisk partition delete, pvremove, vgremove, lvremove, umount",
            "lvremove, vgremove, pvremove, umount, fdisk partition delete"
          ],
          correct: 0,explanation: "You must first safely unmount the filesystem (umount), delete the logical volume (lvremove), remove the volume group (vgremove), delete the physical volume (pvremove), and finally delete the disk partition."
        },
        {
          question: "Which lsblk command and options identify if a disk (e.g. /dev/sda) is a rotational SATA drive (ROTA=1) or an SSD (ROTA=0)?",
          options: [
            "lsblk -t -o ssd,hdd",
            "lsblk -d -o name,rota",
            "lsblk --rota-only",
            "lsblk -a -o type,size"
          ],
          correct: 1,explanation: "The 'lsblk -d -o name,rota' command queries block devices. ROTA=1 signifies rotational (HDD), and ROTA=0 signifies non-rotational (SSD)."
        }
      ]
    },
    'package-management': {
      title: "Package Management (rpm, yum & dnf)",
      questions: [
        {
          question: "What is a 'package' in Linux operating system distributions?",
          options: [
            "An uncompressed C source code kernel module file",
            "A hardware driver module stored inside motherboard BIOS",
            "A single text file containing system environment aliases",
            "A compressed file archive containing application binaries, libraries, config files, and installation metadata"
          ],
          correct: 3,explanation: "A Linux package is a compressed file archive bundling compiled binary executables, libraries, documentation, and installation metadata."
        },
        {
          question: "Which RPM command flags are used to install a local package file verbosely with a progress hash bar?",
          options: [
            "rpm -qa package.rpm",
            "rpm -e package.rpm",
            "rpm -q package.rpm",
            "rpm -ivh package.rpm"
          ],
          correct: 3,explanation: "The '-i' flag installs, '-v' enables verbose output, and '-h' prints hash progress marks (###) during installation."
        },
        {
          question: "What is a primary drawback of using the low-level 'rpm' command for package installation?",
          options: [
            "It is restricted from installing files on Red Hat Enterprise Linux",
            "It cannot automatically download and install prerequisite dependent software in a single step",
            "It can only uninstall packages and cannot install new ones",
            "It requires an active internet connection to execute local commands"
          ],
          correct: 1,explanation: "RPM cannot resolve or install dependent packages automatically; administrator must locate and install missing dependencies manually."
        },
        {
          question: "Inside which system configuration directory path are YUM/DNF repository (.repo) definition files stored?",
          options: [
            "/usr/share/repository/",
            "/var/log/yum/",
            "/etc/sysconfig/network-scripts/",
            "/etc/yum.repos.d/"
          ],
          correct: 3,explanation: "Repository configuration keyfiles (e.g. server1.repo) must be located inside '/etc/yum.repos.d/' for YUM and DNF."
        },
        {
          question: "Why is DNF (Dandified YUM) preferred over legacy YUM in RHEL 8, 9, and 10?",
          options: [
            "YUM only works on Debian Linux distributions",
            "YUM cannot fetch packages from HTTP web servers",
            "DNF is faster, consumes less memory, and uses an optimized codebase with a modern SAT solver dependency engine",
            "DNF requires 56,000 lines of legacy C code to execute"
          ],
          correct: 2,explanation: "DNF replaced YUM to provide faster execution, significantly lower memory usage, clean codebase, and robust SAT solver algorithms."
        },
        {
          question: "Inside which default Apache web server directory path must package repository folders (AppStream, BaseOS) be copied to serve them over HTTP?",
          options: [
            "/var/www/html/",
            "/var/yum/repos/",
            "/etc/httpd/conf.d/",
            "/usr/share/nginx/"
          ],
          correct: 0,explanation: "Apache HTTP daemon serves public web files out of '/var/www/html/'. Copying repository folders there makes them accessible over HTTP."
        },
        {
          question: "Which firewall command permanently permits remote network client systems to access the local HTTP YUM repository server?",
          options: [
            "firewall-cmd --permanent --add-service=http && firewall-cmd --reload",
            "nmcli conn modify server1 +http",
            "firewall-cmd --permanent --add-port=22/tcp",
            "systemctl stop firewall-cmd"
          ],
          correct: 0,explanation: "Opening the 'http' service (TCP port 80) permanently in firewall-cmd allows remote client nodes to access the repository."
        },
        {
          question: "What is a primary enterprise benefit of setting up a centralized local YUM/DNF repository server?",
          options: [
            "Replacing the Linux kernel with Apache HTTP Web Server",
            "Automatically upgrading hardware RAM across client servers",
            "Eliminating the requirement to assign IP addresses to servers",
            "Centralized package management, reduced WAN network traffic, and high-speed LAN package access for offline/air-gapped systems"
          ],
          correct: 3,explanation: "A central YUM server prevents duplicate external downloads, speeds up installations across LAN, and provides offline access for isolated systems."
        }
      ]
    },
    'nfs-server': {
      title: "Network File System (NFS Server)",
      questions: [
        {
          question: "Which default network port number is used by Network File System (NFSv4) protocol communication?",
          options: [
            "80",
            "3306",
            "22",
            "2049"
          ],
          correct: 3,explanation: "NFS operates over TCP/UDP network Port 2049."
        },
        {
          question: "Which system configuration file stores exported directory paths, target client IP subnets, and access permissions for NFS?",
          options: [
            "/etc/nfs.conf",
            "/etc/sysconfig/nfs",
            "/etc/fstab",
            "/etc/exports"
          ],
          correct: 3,explanation: "The '/etc/exports' configuration file contains all directory shares exported by the NFS server along with allowed client subnets."
        },
        {
          question: "Which command-line utility reloads and updates active directory export shares declared in '/etc/exports' without restarting the server daemon?",
          options: [
            "systemctl reload nfs",
            "showmount -e",
            "nfsshare -a",
            "exportfs -rv"
          ],
          correct: 3,explanation: "Executing 'exportfs -rv' re-exports all directories declared in '/etc/exports' verbosely."
        },
        {
          question: "Which system service daemon controls NFS file sharing operations on Red Hat Enterprise Linux 10?",
          options: [
            "nfsd.service",
            "nfs-client",
            "network-file-system",
            "nfs-server"
          ],
          correct: 3,explanation: "The 'nfs-server' systemd service unit controls NFS server operations."
        },
        {
          question: "Which line format in '/etc/fstab' correctly mounts a remote NFS export directory (/database) persistently at client mount path '/info'?",
          options: [
            "192.168.1.2 /database /info nfs defaults 0 0",
            "mount -t nfs 192.168.1.2:/database /info",
            "192.168.1.2:/database /info nfs defaults 0 0",
            "/database /info 192.168.1.2 nfs defaults 0 0"
          ],
          correct: 2,explanation: "The '/etc/fstab' syntax for persistent NFS mounting is: '<server-ip>:<remote-share> <local-mountpoint> nfs <options> 0 0'."
        }
      ]
    },
    'subscription-manager': {
      title: "Red Hat Subscription Manager",
      questions: [
        {
          question: "Which command is used to register a RHEL system with the Red Hat Customer Portal to access official software repositories?",
          options: [
            "yum register redhat",
            "systemctl enable redhat-portal",
            "rhsm-client connect",
            "subscription-manager register"
          ],
          correct: 3,explanation: "Executing 'subscription-manager register' prompts for credentials and registers the system with Red Hat Subscription Manager (RHSM)."
        },
        {
          question: "Which command inspects active product subscriptions and entitlement status attached to a registered RHEL node?",
          options: [
            "subscription-manager list",
            "yum repolist status",
            "rpm -qa --subscriptions",
            "cat /etc/redhat-subscription"
          ],
          correct: 0,explanation: "The 'subscription-manager list' command displays active installed products, subscription status, and entitlement validity dates."
        },
        {
          question: "Why should an administrator run 'yum clean all' immediately after registering a RHEL 10 system with Red Hat Subscription Manager?",
          options: [
            "To delete all installed software packages on the disk",
            "To disable all firewall ports",
            "To flush old local repository metadata cache and download fresh Red Hat CDN repository keys and mirror indexes",
            "To reset the root user password to default settings"
          ],
          correct: 2,explanation: "Running 'yum clean all' clears old cached metadata, forcing YUM/DNF to fetch fresh package lists from Red Hat CDN."
        },
        {
          question: "Which command releases a system's Red Hat subscription entitlement quota when decommissioning or reinstalling a server?",
          options: [
            "yum remove subscription-manager",
            "subscription-manager unregister",
            "rm -rf /etc/pki/consumer",
            "subscription-manager delete --all"
          ],
          correct: 1,explanation: "The 'subscription-manager unregister' command detaches the system from Red Hat Customer Portal and frees up subscription quota."
        },
        {
          question: "How many physical or virtual RHEL systems does Red Hat provide at no cost under the Individual Developer Subscription program?",
          options: [
            "Unlimited nodes",
            "Up to 100 nodes",
            "Only 1 single node",
            "Up to 16 nodes"
          ],
          correct: 3,explanation: "Red Hat's No-Cost Individual Developer Subscription program permits registration for up to 16 physical or virtual RHEL nodes."
        }
      ]
    },
    'selinux-security': {
      title: "SELinux Security & Context Labels",
      questions: [
        {
          question: "Which SELinux mode strictly blocks policy violations and logs unauthorized access attempts to /var/log/audit/audit.log?",
          options: [
            "permissive",
            "enforcing",
            "disabled",
            "targeted"
          ],
          correct: 1,explanation: "In 'enforcing' mode, SELinux active security policy is enforced and unauthorized access is strictly denied and logged."
        },
        {
          question: "When creating a new directory directly under the top-level root (/), which default SELinux context label is assigned?",
          options: [
            "httpd_sys_content_t",
            "root_t",
            "user_home_t",
            "default_t"
          ],
          correct: 3,explanation: "Directories created directly at the top-level root (/) receive the default_t label, whereas subdirectories inherit their parent folder's label."
        },
        {
          question: "Which command temporarily changes the SELinux context type of a directory (e.g. /account) to httpd_sys_content_t?",
          options: [
            "restorecon -t httpd_sys_content_t /account",
            "setenforce -t httpd_sys_content_t /account",
            "chmod -R 777 /account",
            "chcon -R -t httpd_sys_content_t /account"
          ],
          correct: 3,explanation: "The 'chcon -R -t' command modifies file security context labels temporarily."
        },
        {
          question: "Which pair of commands adds a permanent file context rule to the SELinux policy database and applies it recursively to /account?",
          options: [
            "chcon -P -t httpd_sys_content_t /account && reboot",
            "sestatus -a -t httpd_sys_content_t /account",
            "setsebool httpd_sys_content_t on && restorecon /account",
            "semanage fcontext -a -t httpd_sys_content_t \\\"/account(/.*)?\\\" && restorecon -Rv /account"
          ],
          correct: 3,explanation: "Executing 'semanage fcontext -a -t' saves the mapping persistently in the database, and 'restorecon -Rv' applies it to disk files."
        },
        {
          question: "Which command lists all custom user-defined file context rules configured in the SELinux policy database?",
          options: [
            "semanage fcontext -C -l",
            "getenforce -C",
            "restorecon --list-custom",
            "matchpathcon -l"
          ],
          correct: 0,explanation: "Executing 'semanage fcontext -C -l' filters and displays custom set file context rules."
        },
        {
          question: "Which command checks if child file security labels match default policy path rules?",
          options: [
            "ls -Z --verify /account/*",
            "checkcontext -v /account/*",
            "matchpathcon -V /account/*",
            "sestatus -V /account/*"
          ],
          correct: 2,explanation: "The 'matchpathcon -V' command verifies whether file context labels match system policy defaults."
        },
        {
          question: "Which command turns an SELinux boolean feature switch ON?",
          options: [
            "chcon --boolean radius_use_jit 1",
            "semanage boolean --enable radius_use_jit",
            "getsebool radius_use_jit enable",
            "setsebool radius_use_jit on (or setsebool radius_use_jit 1)"
          ],
          correct: 3,explanation: "Executing 'setsebool <boolean> on' or 'setsebool <boolean> 1' enables the specified SELinux boolean switch."
        }
      ]
    },
    'web-hosting': {
      title: "Web Hosting & Apache Virtual Hosts",
      questions: [
        {
          question: "Which RPM package and systemd service daemon are used to install and run the Apache HTTP Web Server on RHEL 10?",
          options: [
            "webserver",
            "nginx",
            "apache2",
            "httpd"
          ],
          correct: 3,explanation: "On Red Hat Enterprise Linux, the Apache web server package and service daemon name is 'httpd'."
        },
        {
          question: "Which default network ports and firewall services are used by Apache for HTTP and encrypted HTTPS communication?",
          options: [
            "Port 21 (ftp) and Port 22 (ssh)",
            "Port 80 (http) and Port 443 (https)",
            "Port 53 (dns) and Port 110 (pop3)",
            "Port 3306 (mysql) and Port 5432 (postgresql)"
          ],
          correct: 1,explanation: "Apache operates over network Port 80 for unencrypted HTTP traffic and Port 443 for encrypted HTTPS traffic."
        },
        {
          question: "What is the default document root directory where primary HTML web files (e.g. index.html) are stored for Apache on RHEL?",
          options: [
            "/usr/share/nginx/html/",
            "/etc/httpd/conf.d/",
            "/var/www/html/",
            "/srv/www/pages/"
          ],
          correct: 2,explanation: "The default document root directory for Apache HTTP Server on RHEL is '/var/www/html/'."
        },
        {
          question: "Which command is used to test Apache configuration files (.conf) for syntax errors before reloading or restarting the httpd service?",
          options: [
            "httpd -t",
            "systemctl test httpd",
            "apachectl check",
            "yum verify httpd"
          ],
          correct: 0,explanation: "Executing 'httpd -t' parses Apache configuration syntax and returns 'Syntax OK' if no errors are found."
        },
        {
          question: "When creating custom VirtualHost document roots outside /var/www/html/ (e.g. /account/), what issue causes HTTP 403 Forbidden errors if SELinux is enforcing?",
          options: [
            "The /etc/hosts file is strictly read-only",
            "SELinux security policy blocks Apache from reading directories without the 'httpd_sys_content_t' context label",
            "Firewalld blocks outgoing Port 443 traffic",
            "Apache cannot parse HTML5 tags inside /account/index.html"
          ],
          correct: 1,explanation: "SELinux blocks web daemon access to non-standard directories unless 'setenforce 0' is set or context is updated to 'httpd_sys_content_t'."
        },
        {
          question: "Which Apache module package must be installed to enable SSL/TLS encryption for HTTPS website hosting?",
          options: [
            "mod_security",
            "mod_proxy",
            "mod_rewrite",
            "mod_ssl"
          ],
          correct: 3,explanation: "The 'mod_ssl' package installs the Apache module required to handle SSL/TLS encryption over Port 443."
        },
        {
          question: "Which OpenSSL command generates a 2048-bit RSA private key and a 365-day self-signed X.509 SSL certificate?",
          options: [
            "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /home/tata.key -out /home/tata.crt",
            "certutil -create -rsa:2048 -days 365",
            "systemctl create-cert --type rsa:2048",
            "openssl genrsa -out /home/tata.crt 2048"
          ],
          correct: 0,explanation: "Executing 'openssl req -x509 -nodes -days 365 -newkey rsa:2048...' creates a keypair and self-signed certificate."
        },
        {
          question: "Which VirtualHost directive automatically redirects incoming Port 80 HTTP web traffic to Port 443 HTTPS?",
          options: [
            "RewritePort 80 443",
            "Forward / 443",
            "Redirect / https://finance.tata.com",
            "SSLEngine redirect-all"
          ],
          correct: 2,explanation: "The 'Redirect / https://finance.tata.com' directive inside a '<VirtualHost *:80>' block redirects all unencrypted HTTP requests to HTTPS."
        }
      ]
    },
    'mariadb-database': {
      title: "MariaDB Database Administration",
      questions: [
        {
          question: "Which default network port and RPM packages are used to run the MariaDB relational database server on RHEL 10?",
          options: [
            "Port 6379 (redis & redis-server)",
            "Port 5432 (postgresql & postgresql-server)",
            "Port 3306 (mariadb & mariadb-server)",
            "Port 27017 (mongodb & mongodb-server)"
          ],
          correct: 2,explanation: "MariaDB runs on network Port 3306 and requires the 'mariadb' client and 'mariadb-server' daemon RPM packages."
        },
        {
          question: "Which interactive script is executed after installing MariaDB to set a root password, remove anonymous users, and disable remote root login?",
          options: [
            "mysql_secure_installation",
            "systemctl secure mariadb",
            "db-config --harden",
            "mariadb-admin --setup"
          ],
          correct: 0,explanation: "Executing 'mysql_secure_installation' hardens database security by prompting for root password configuration and dropping test accounts."
        },
        {
          question: "Which SQL command creates a user 'harry@localhost' with password '123' and full permissions on database 'mydb'?",
          options: [
            "grant all on mydb.* to harry@localhost identified by '123';",
            "set privileges mydb to harry identified '123';",
            "create user harry password '123' on mydb;",
            "allow user harry@localhost on mydb.* with pass '123';"
          ],
          correct: 0,explanation: "The 'grant all on mydb.* to harry@localhost identified by '123';' statement creates the user and assigns all database privileges."
        },
        {
          question: "Which command exports the schema and table data of database 'employee' into an SQL dump file at /home/emp.db?",
          options: [
            "mysql --export employee --out /home/emp.db",
            "save-db employee > /home/emp.db",
            "sqlbackup -u root employee /home/emp.db",
            "mysqldump -u root -p employee > /home/emp.db"
          ],
          correct: 3,explanation: "The 'mysqldump -u root -p employee > /home/emp.db' utility exports full database tables and records into a text SQL dump file."
        },
        {
          question: "Which command imports and restores an SQL dump file (/home/emp.db) into an empty database named 'employee'?",
          options: [
            "restore-db /home/emp.db employee",
            "mysql --import /home/emp.db into employee",
            "mysqldump -r /home/emp.db employee",
            "mysql -u root -p=india employee < /home/emp.db"
          ],
          correct: 3,explanation: "Redirecting an SQL dump file into mysql ('mysql -u root -p=india employee < /home/emp.db') executes all dump statements and restores data."
        }
      ]
    },
    'file-links': {
      title: "Soft Links & Hard Links",
      questions: [
        {
          question: "What is the primary technical difference regarding Inode (ID) numbers between a Soft Link (Symlink) and a Hard Link in Linux?",
          options: [
            "A Soft Link shares the same Inode ID, while a Hard Link gets a new Inode ID",
            "A Soft Link has a unique/different Inode ID, whereas a Hard Link shares the exact same Inode ID as the target file",
            "Both Soft Links and Hard Links always share identical Inode IDs",
            "Hard Links do not use Inodes at all in the Linux filesystem"
          ],
          correct: 1,explanation: "A soft link is a pointer file with its own unique inode number pointing to a path string. A hard link is a direct directory entry referencing the exact same inode number as the original file."
        },
        {
          question: "Which command syntax creates a symbolic soft link named /root/fileb.txt pointing to target file /home/filea.txt?",
          options: [
            "ln -s /home/filea.txt /root/fileb.txt",
            "ln /home/filea.txt /root/fileb.txt",
            "link --soft /home/filea.txt /root/fileb.txt",
            "cp -s /home/filea.txt /root/fileb.txt"
          ],
          correct: 0,explanation: "The 'ln -s <target> <link_name>' command creates a symbolic soft link across directories or filesystems."
        },
        {
          question: "What happens to the data accessibility of a Soft Link vs a Hard Link if the original source file is deleted (rm /home/file.txt)?",
          options: [
            "Both the Soft Link and Hard Link lose data access immediately",
            "The Soft Link retains data access, while the Hard Link is destroyed",
            "The Soft Link becomes broken/dangling and loses data access, but the Hard Link preserves full data access",
            "The filesystem automatically restores the original file for both links"
          ],
          correct: 2,explanation: "Deleting the target file breaks a soft link (dangling pointer). However, a hard link points directly to the underlying inode data block, preserving data access until all hard links are removed."
        },
        {
          question: "Which limitation applies strictly to Hard Links but NOT to Symbolic Soft Links?",
          options: [
            "Hard Links cannot be deleted once created",
            "Hard Links cannot point to text files",
            "Hard Links can ONLY be created within the same filesystem/partition, whereas Soft Links can cross different filesystems",
            "Hard Links require root permissions to execute"
          ],
          correct: 2,explanation: "Hard links cannot span across different filesystems or partitions because inode numbers are only unique within a single filesystem. Symbolic links store path strings and can cross filesystems freely."
        },
        {
          question: "Which command option with 'ls' allows system administrators to inspect the Inode ID numbers and link count of files?",
          options: [
            "ls -li",
            "ls -lh",
            "ls -lZ",
            "ls -la"
          ],
          correct: 0,explanation: "The 'ls -li' (or 'ls --inode -l') command lists the inode index number in the first column along with file permissions and link count."
        }
      ]
    },
    'rhel-lightspeed': {
      title: "RHEL Lightspeed (AI Assistant in RHEL 10)",
      questions: [
        {
          question: "Which DNF command package installs the RHEL Lightspeed AI CLI assistant on Red Hat Enterprise Linux 10?",
          options: [
            "sudo dnf install command-line-assistant -y",
            "sudo dnf install rhel-ai-copilot -y",
            "sudo dnf install redhat-lightspeed-cli -y",
            "sudo dnf install lightspeed-ai-daemon -y"
          ],
          correct: 0,explanation: "In RHEL 10, RHEL Lightspeed is provided by installing the 'command-line-assistant' package via DNF."
        },
        {
          question: "Which short command alias is used at the RHEL 10 terminal prompt to invoke RHEL Lightspeed AI queries?",
          options: [
            "c",
            "ai",
            "help-me",
            "lightspeed-cli"
          ],
          correct: 0,explanation: "In RHEL 10 CLI, administrators use the short 'c' command (e.g. c \"how to reset root password\") to query Lightspeed."
        },
        {
          question: "Which RHEL Lightspeed command syntax is used to get a human-friendly breakdown of a complex command's flags and parameters?",
          options: [
            "c \\\"explain: nmcli connection add type ethernet ifname enp0s3\\\"",
            "c --debug-cmd \\\"nmcli connection add\\\"",
            "c -x nmcli connection add",
            "lightspeed breakdown nmcli"
          ],
          correct: 0,explanation: "Prefixing a query with 'c \"explain: <command>\"' instructs Lightspeed to deconstruct command options into plain English."
        },
        {
          question: "How does RHEL Lightspeed assist system administrators during log analysis and troubleshooting?",
          options: [
            "By parsing log files (e.g. c \\\"analyze /var/log/messages\\\"), detecting root causes, and recommending Red Hat-validated fix steps",
            "By disabling all failing systemd services without user confirmation",
            "By automatically deleting log files whenever disk space is low",
            "By sending logs to third-party public forums for community feedback"
          ],
          correct: 0,explanation: "Lightspeed analyzes system logs, identifies key events (e.g., OOM killer, port bindings, SELinux AVCs), and suggests validated fix sequences."
        },
        {
          question: "Why is RHEL Lightspeed NOT available during the official Red Hat Certified System Administrator (RHCSA) exam?",
          options: [
            "Because Lightspeed only works on ARM processor architectures",
            "Because RHEL 10 is not compatible with RHCSA exams",
            "Because RHCSA tests manual hands-on Linux administration skills without AI assistance",
            "Because Lightspeed requires a paid desktop GUI license not available in exam rooms"
          ],
          correct: 2,explanation: "The RHCSA exam evaluates manual command-line competency and system administration knowledge, so AI assistance tools are excluded from the exam environment."
        }
      ]
    },
    'flatpak-packages': {
      title: "Flatpak App Packaging",
      questions: [
        {
          question: "What is the primary core philosophy of Flatpak universal packaging in Linux?",
          options: [
            "Compile every library on the target server",
            "Disallow network connections for desktop apps",
            "Build once, run everywhere (almost)",
            "Replace systemd with containerized microservices"
          ],
          correct: 2,explanation: "Flatpak's central goal is 'Build once, run everywhere' by bundling application binaries with runtime frameworks inside sandboxed containers."
        },
        {
          question: "Which option best describes the key architectural difference between traditional RPM packages and Flatpak packages?",
          options: [
            "RPM is strictly for desktop apps, while Flatpak is only for database servers",
            "Flatpak uses lower disk space than RPM by removing all dependencies",
            "RPM relies on shared system-wide libraries, whereas Flatpak bundles application-specific runtimes and runs in sandboxes",
            "RPM packages are sandboxed, while Flatpak has direct host root privileges"
          ],
          correct: 2,explanation: "RPM packages use DNF to share system-wide libraries (best for OS/servers). Flatpak bundles app-specific dependencies in isolated sandboxes (best for desktop apps)."
        },
        {
          question: "Which command adds the central public Flathub repository to a RHEL 10 system if it does not already exist?",
          options: [
            "flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo",
            "flatpak repo-enable flathub --url https://flathub.org",
            "flatpak install-repo flathub",
            "dnf config-manager --add-repo https://flathub.org"
          ],
          correct: 0,explanation: "The command 'flatpak remote-add --if-not-exists flathub <url>' registers Flathub as an active remote repository source."
        },
        {
          question: "Where are system-wide Flatpak applications vs user-only (--user) Flatpak applications stored on RHEL 10?",
          options: [
            "System-wide apps in /opt/flatpak/ and User-only apps in /etc/flatpak/",
            "System-wide apps in /usr/bin/ and User-only apps in /tmp/flatpak/",
            "Both system-wide and user-only apps are stored in /home/flatpak/",
            "System-wide apps in /var/lib/flatpak/ and User-only apps in ~/.local/share/flatpak/"
          ],
          correct: 3,explanation: "System-wide Flatpaks reside in /var/lib/flatpak/ (accessible to all users), while user-only Flatpaks reside in ~/.local/share/flatpak/."
        },
        {
          question: "Which Flatpak maintenance command purges orphaned runtime frameworks to reclaim disk space after uninstalling apps?",
          options: [
            "flatpak purge runtimes",
            "flatpak uninstall --unused",
            "flatpak remove --orphans",
            "flatpak clean --all"
          ],
          correct: 1,explanation: "Executing 'flatpak uninstall --unused' scans local Flatpak storage and deletes unused/orphaned runtime dependencies."
        }
      ]
    },
    'performance-tuning': {
      title: "System Performance Tuning & Monitoring",
      questions: [
        {
          question: "Which CLI command queries the tuned daemon to automatically recommend the optimal performance profile for current server hardware?",
          options: [
            "tuned-adm active",
            "tuned-adm suggest",
            "tuned-adm recommend",
            "tuned-adm profile auto"
          ],
          correct: 2,explanation: "Executing 'tuned-adm recommend' queries tuned detection algorithms and returns the recommended profile for the host environment."
        },
        {
          question: "What is the key technical difference between 'kill <PID>' (default) and 'kill -9 <PID>' in Linux process management?",
          options: [
            "kill <PID> reboots the system, while kill -9 terminates a process",
            "Both commands perform identical ungraceful terminations",
            "kill <PID> sends SIGTERM (15) for graceful cleanup, whereas kill -9 sends SIGKILL (9) for immediate uncatchable kernel termination",
            "kill -9 sends SIGTERM while kill sends SIGKILL"
          ],
          correct: 2,explanation: "SIGTERM (15) allows process signal handlers to perform cleanup before exit, whereas SIGKILL (9) immediately stops process execution at the kernel level without cleanup."
        },
        {
          question: "Which 'ps' command pipeline displays custom columns (USER, PID, %MEM, %CPU, COMMAND) sorted by highest memory utilization?",
          options: [
            "ps -aux --sort=cpu | top",
            "ps -eo user,pid,%mem,%cpu,cmd --sort=-%mem | head",
            "ps -A --mem-sort",
            "ps -ef --sort=mem | tail"
          ],
          correct: 1,explanation: "The command 'ps -eo user,pid,%mem,%cpu,cmd --sort=-%mem | head' lists custom process fields in descending order of memory consumption."
        },
        {
          question: "Which command option displays process parent-child relationships as a hierarchical tree structure?",
          options: [
            "ps -aux --tree",
            "ps --children",
            "ps -ef --forest",
            "ps -ef --parents"
          ],
          correct: 2,explanation: "The '--forest' flag with 'ps' formats output with ASCII branch lines showing process parentage (e.g. parent systemd/httpd and child workers)."
        },
        {
          question: "Which diagnostic CLI tool displays CPU architecture details, core counts, threads per core, and hardware virtualization flags?",
          options: [
            "lscpu",
            "tuned-adm list",
            "lshw",
            "netstat -a"
          ],
          correct: 0,explanation: "'lscpu' gathers and displays detailed information about CPU architecture, sockets, cores, threads, and virtualization features."
        }
      ]
    },
    'system-logging': {
      title: "System Logging & Log Analysis",
      questions: [
        {
          question: "Which RHEL log file in /var/log/ stores general operating system messages, kernel alerts, and daemon initialization status?",
          options: [
            "/var/log/boot.log",
            "/var/log/messages",
            "/var/log/secure",
            "/var/log/audit/audit.log"
          ],
          correct: 1,explanation: "/var/log/messages is the primary system log file storing general OS events, kernel messages, and system daemon status updates."
        },
        {
          question: "How must a system administrator inspect bad and failed login attempts stored in the binary log file /var/log/btmp?",
          options: [
            "Using 'grep bad /var/log/btmp'",
            "Using 'vim /var/log/btmp'",
            "Using 'cat /var/log/btmp'",
            "Using the command 'last -f /var/log/btmp'"
          ],
          correct: 3,explanation: "/var/log/btmp is stored in binary format to prevent file tampering, so administrators must parse it using 'last -f /var/log/btmp'."
        },
        {
          question: "Which log file records security authentication attempts, SSH user sessions, and sudo command execution details?",
          options: [
            "/var/log/maillog",
            "/var/log/messages",
            "/var/log/cron",
            "/var/log/secure"
          ],
          correct: 3,explanation: "/var/log/secure stores all security-related log entries including SSH user logins, PAM authentication attempts, and sudo command invocations."
        },
        {
          question: "Which command lists the recent login timestamp and terminal connection for all user accounts configured on RHEL 10?",
          options: [
            "whoami",
            "cat /var/log/boot.log",
            "lastlog",
            "tuned-adm active"
          ],
          correct: 2,explanation: "'lastlog' parses /var/log/lastlog and formats a table displaying the most recent login details for all system users."
        },
        {
          question: "Which journalctl command option filters binary systemd journal logs by priority to display ONLY error and critical messages for current boot?",
          options: [
            "journalctl --level=all",
            "journalctl -f --critical",
            "journalctl -p err -b",
            "journalctl -u errors"
          ],
          correct: 2,explanation: "Executing 'journalctl -p err -b' filters logs to only include priority levels of 'err' or higher for the current boot session (-b)."
        }
      ]
    },
    'rhcsa-exam-practice': {
      title: "RHCSA Practical Exam Practice",
      questions: [
        {
          question: "When resetting a locked root password using 'rd.break' during GRUB emergency boot, which file MUST be touched before exiting chroot to prevent SELinux boot locks?",
          options: [
            "touch /etc/selinux/relabel",
            "touch /sysroot/autorelabel",
            "touch /var/log/relabel",
            "touch /.autorelabel"
          ],
          correct: 3,explanation: "Executing 'touch /.autorelabel' flags systemd-autorabel to re-index SELinux context security labels for modified files during the next system reboot."
        },
        {
          question: "Which permission mode set on directory /datacenter ensures that all files created inside in the future automatically inherit group Ibmgrp ownership?",
          options: [
            "chmod 4070 /datacenter (SUID bit)",
            "chmod 2070 /datacenter (SGID bit)",
            "chmod 1070 /datacenter (Sticky bit)",
            "chmod 0770 /datacenter"
          ],
          correct: 1,explanation: "Setting SGID mode '2070' on a directory causes newly created files and subdirectories to automatically inherit the directory's group ownership."
        },
        {
          question: "Which command option configures a Physical Extent (PE) size of 8 MB when initializing a Volume Group named 'smartphone'?",
          options: [
            "vgcreate -s 8M smartphone /dev/sdb2",
            "vgcreate --extent 8M smartphone /dev/sdb2",
            "vgcreate -e 8M smartphone /dev/sdb2",
            "vgcreate -p 8M smartphone /dev/sdb2"
          ],
          correct: 0,explanation: "The '-s 8M' parameter specifies custom physical extent size (PE) when initializing a Volume Group with vgcreate."
        },
        {
          question: "Which setfacl command accurately revokes all access permissions (read, write, execute) for user 'frankenstein' on /var/tmp/fstab?",
          options: [
            "setfacl -m u:frankenstein:--- /var/tmp/fstab",
            "setfacl -x u:frankenstein /var/tmp/fstab",
            "setfacl -d u:frankenstein /var/tmp/fstab",
            "chmod 000 /var/tmp/fstab"
          ],
          correct: 0,explanation: "'setfacl -m u:frankenstein:--- /var/tmp/fstab' sets an explicit ACL rule removing read, write, and execution rights for user frankenstein."
        },
        {
          question: "Which tar command flags create an archive named /backup.tar.xz of /usr/sbin using XZ compression?",
          options: [
            "tar -cvzf /backup.tar.xz /usr/sbin",
            "tar -cvJf /backup.tar.xz /usr/sbin",
            "tar -cvaf /backup.tar.xz /usr/sbin",
            "tar -cvjf /backup.tar.xz /usr/sbin"
          ],
          correct: 1,explanation: "The '-J' option instructs tar to use the XZ compression algorithm when creating '.tar.xz' archives."
        }
      ]
    },
    'linux-interview-prep': {
      title: "Linux Student Technical Interview Q&A",
      questions: [
        {
          question: "Who created the Linux operating system kernel, and in which year was version 0.01 first released?",
          options: [
            "Richard Stallman in August 1985",
            "Ken Thompson in July 1970",
            "Dennis Ritchie in October 1995",
            "Linus Torvalds in September 1991"
          ],
          correct: 3,explanation: "Linux was created by Linus Torvalds, and version 0.01 was officially released in September 1991."
        },
        {
          question: "What are the four phases of the DHCP DORA process used to dynamically assign IP addresses to network clients?",
          options: [
            "Detect, Obtain, Renew, Accept",
            "Discover, Offer, Request, Acknowledge",
            "Direct, Offer, Receive, Allocate",
            "Domain, Open, Route, Assign"
          ],
          correct: 1,explanation: "DORA stands for Discover, Offer, Request, and Acknowledge, which describes the 4-step DHCP handshake."
        },
        {
          question: "In Vim text editor, which command saves changes to the current file and exits the editor in a single command?",
          options: [
            ":x!",
            ":w",
            ":wq",
            ":q!"
          ],
          correct: 2,explanation: "The ':wq' command writes (saves) changes to disk and quits Vim simultaneously."
        },
        {
          question: "Which command syntax grants passwordless sudo privileges for group 'punegrp' in /etc/sudoers.d/punegrp?",
          options: [
            "punegrp ALL=(ALL) PASSWD: NONE",
            "group punegrp NOPASSWD",
            "ALL %punegrp=(ALL) NOPASSWD: ALL",
            "%punegrp ALL=(ALL) NOPASSWD: ALL"
          ],
          correct: 3,explanation: "Prefixing with '%' denotes a system group in sudoers files. '%punegrp ALL=(ALL) NOPASSWD: ALL' allows passwordless execution."
        },
        {
          question: "In Red Hat Ansible, which variable type captures and stores the stdout/stderr output from a task execution for use in subsequent tasks?",
          options: [
            "Register variable (register: output_var)",
            "Vault variable (ansible_vault)",
            "Fact variable (ansible_facts)",
            "Handler variable (notify: handler_var)"
          ],
          correct: 0,explanation: "The Ansible 'register' directive captures task output into a variable for subsequent conditional logic or display in playbooks."
        }
      ]
    },
    'rhcsa-ex200-paper': {
      title: "RHCSA EX200 25-Task Practical Exam Paper",
      questions: [
        {
          question: "[Q1. File Management] Which command sequence creates directory structure /opt/company/{data,backup,scripts} and 3 files file1.txt, file2.txt, file3.txt inside /opt/company/data?",
          options: [
            "mkdir /opt/company/data /opt/company/backup /opt/company/scripts && create /opt/company/data/file1..3",
            "mkdir -r /opt/company/ && cat > /opt/company/data/file1.txt",
            "mkdir -p /opt/company/{data,backup,scripts} && touch /opt/company/data/{file1.txt,file2.txt,file3.txt}",
            "make /opt/company/* && touch /opt/company/data/*"
          ],
          correct: 2,explanation: "mkdir -p creates parent directories recursively and bracket expansion {data,backup,scripts} creates all subfolders and files in a single line."
        },
        {
          question: "[Q2. Find & Archive] Which tar command syntax finds all .log files under /var/log and creates a Gzip compressed archive /root/logs_backup.tar.gz?",
          options: [
            "tar -czvf /root/logs_backup.tar.gz $(find /var/log -name '*.log')",
            "tar -xzvf /root/logs_backup.tar.gz /var/log/*.log",
            "zip /root/logs_backup.tar.gz /var/log/*.log",
            "tar -cjvf /root/logs_backup.tar.gz /var/log/find.log"
          ],
          correct: 0,explanation: "tar -czvf flags (c=create, z=gzip, v=verbose, f=file) combined with command substitution $(find /var/log -name '*.log') compresses all matching log files."
        },
        {
          question: "[Q3. Text Processing] Which command filters /etc/passwd for user accounts whose login shell is /bin/bash and redirects output to /root/bash_users.txt?",
          options: [
            "find /etc/passwd -name /bin/bash > /root/bash_users.txt",
            "cat /etc/passwd | awk /bin/bash > /root/bash_users.txt",
            "grep '/bin/bash$' /etc/passwd > /root/bash_users.txt",
            "tail /etc/passwd /bin/bash > /root/bash_users.txt"
          ],
          correct: 2,explanation: "grep '/bin/bash$' matches lines ending with /bin/bash and '>' redirects the stdout stream into /root/bash_users.txt."
        },
        {
          question: "[Q4. User Creation & Password Expiry] Which commands create user karan with UID 2500 and configure password expiration after 30 days?",
          options: [
            "useradd -id 2500 karan && usermod -e 30 karan",
            "useradd -u 2500 karan && chage -M 30 karan",
            "useradd -g 2500 karan && passwd -e 30 karan",
            "adduser --uid 2500 karan --expire 30"
          ],
          correct: 1,explanation: "-u sets explicit UID 2500 during user creation, and 'chage -M 30 karan' sets the maximum password lifetime to 30 days."
        },
        {
          question: "[Q5. Groups] Which commands create groups developers and admins, and add user karan to both secondary groups?",
          options: [
            "addgroup developers admins && gpasswd -a karan developers admins",
            "groupadd -g developers,admins karan",
            "groupadd developers && groupadd admins && usermod -aG developers,admins karan",
            "usermod -g developers -g admins karan"
          ],
          correct: 2,explanation: "groupadd initializes system groups and 'usermod -aG' appends user karan to secondary groups without replacing existing group memberships."
        },
        {
          question: "[Q6. Sudo Configuration] Which syntax in /etc/sudoers.d/karan grants user karan full sudo administrative command execution privileges?",
          options: [
            "karan PERMIT ALL",
            "karan ALL=(ALL) ALL",
            "ALLOW karan ALL=(root) NOPASSWD",
            "user karan = ALL COMMANDS"
          ],
          correct: 1,explanation: "The standard sudoers specification format is 'user HOST=(USERS) COMMANDS', so 'karan ALL=(ALL) ALL' grants complete sudo rights."
        },
        {
          question: "[Q7. Permissions & Ownership] How do you configure /opt/project with owner karan, group developers, owner rwx, group r-x, and others no access?",
          options: [
            "chown developers:karan /opt/project && chmod 770 /opt/project",
            "chmod 755 /opt/project && chgrp karan /opt/project",
            "chown karan /opt/project && chmod u=rwx,g=rwx,o=rwx /opt/project",
            "chown karan:developers /opt/project && chmod 0750 /opt/project"
          ],
          correct: 3,explanation: "chown karan:developers sets user and group ownership. Octal 0750 sets rwx (7) for user, r-x (5) for group, and --- (0) for others."
        },
        {
          question: "[Q8. SGID Directory] Which command configures /opt/project so all newly created files inside automatically inherit group ownership developers?",
          options: [
            "chmod g+s /opt/project (or chmod 2750 /opt/project)",
            "chmod u+s /opt/project",
            "chown -R developers /opt/project",
            "chmod +t /opt/project"
          ],
          correct: 0,explanation: "Setting SGID mode (2000 or g+s) on a directory forces newly created files and subdirectories to automatically inherit the parent directory's group ownership."
        },
        {
          question: "[Q9. ACL] Which command grants user karan read and write (rw-) Access Control List permissions on /var/shared without modifying standard owner/group bits?",
          options: [
            "chacl karan:rw- /var/shared",
            "chmod u+rw karan /var/shared",
            "setfacl -m u:karan:rw- /var/shared",
            "getfacl -m karan:rw /var/shared"
          ],
          correct: 2,explanation: "'setfacl -m u:karan:rw- /var/shared' modifies (-m) file ACL rules to explicitly grant user karan read and write access."
        },
        {
          question: "[Q10. Storage Partitioning] Which CLI partitioning tool and sequence creates a 1 GB MBR/GPT partition on disk /dev/sdb?",
          options: [
            "fdisk /dev/sdb -> n -> p -> +1G -> t -> 8e (LVM) -> w",
            "format /dev/sdb 1GB",
            "mkfs.xfs -size 1G /dev/sdb",
            "parted /dev/sdb mkpart 100%"
          ],
          correct: 0,explanation: "In fdisk, 'n' creates new partition, 'p' sets primary, '+1G' sets 1GB size, 't' sets partition code (8e LVM), and 'w' writes changes to partition table."
        },
        {
          question: "[Q11. LVM & XFS] Which command sequence creates Volume Group vgdata, Logical Volume lvdata (500 MB), and formats it with XFS filesystem?",
          options: [
            "pvcreate /dev/sdb1 && vgcreate vgdata /dev/sdb1 && lvcreate -L 500M -n lvdata vgdata && mkfs.xfs /dev/vgdata/lvdata",
            "vgcreate vgdata 500M && lvcreate lvdata && format xfs",
            "lvm create vgdata lvdata 500M --xfs",
            "pvcreate vgdata && lvcreate -l 500M lvdata && mkfs.ext4 /dev/sdb1"
          ],
          correct: 0,explanation: "LVM workflow: 1) pvcreate initializes physical volume, 2) vgcreate pools PVs into Volume Group, 3) lvcreate allocates 500MB Logical Volume, 4) mkfs.xfs formats filesystem."
        },
        {
          question: "[Q12. Permanent Mount] Which /etc/fstab entry permanently mounts Logical Volume /dev/vgdata/lvdata to directory /data across system reboots?",
          options: [
            "/data /dev/vgdata/lvdata xfs auto 0 0",
            "mount /dev/vgdata/lvdata /data",
            "/dev/vgdata/lvdata /data xfs defaults 0 0",
            "/dev/sdb1 /data ext4 defaults 1 1"
          ],
          correct: 2,explanation: "/etc/fstab syntax requires: [Device/UUID] [Mount_Point] [FSType] [Options] [Dump] [Pass]. Executing 'mount -a' verifies syntax correctness."
        },
        {
          question: "[Q13. Static IP Networking] Which nmcli command configures static IP 192.168.10.100/24, Gateway 192.168.10.1, and DNS 8.8.8.8 on interface eth0?",
          options: [
            "nmcli con mod eth0 ipv4.addresses 192.168.10.100/24 ipv4.gateway 192.168.10.1 ipv4.dns 8.8.8.8 ipv4.method manual && nmcli con up eth0",
            "ifconfig eth0 192.168.10.100 netmask 255.255.255.0",
            "ip addr add 192.168.10.100/24 dev eth0",
            "nmcli device set eth0 static 192.168.10.100"
          ],
          correct: 0,explanation: "nmcli con mod configures persistent NetworkManager connection settings (IP, gateway, DNS, manual method), and 'nmcli con up' applies connection active profile."
        },
        {
          question: "[Q14. Hostname] Which command permanently sets system hostname to server1.example.com and updates system configuration files?",
          options: [
            "hostname server1.example.com",
            "set-hostname server1.example.com",
            "hostnamectl set-hostname server1.example.com",
            "echo server1.example.com > /etc/hosts"
          ],
          correct: 2,explanation: "hostnamectl set-hostname updates static hostname in /etc/hostname, transient hostname, and pretty hostname across reboots."
        },
        {
          question: "[Q15. Service Management] Which systemctl command ensures the SSH daemon (sshd) is currently running AND enabled to start on system boot?",
          options: [
            "service sshd start-on-boot",
            "systemctl enable --now sshd",
            "systemctl status sshd --enable",
            "systemctl start sshd"
          ],
          correct: 1,explanation: "'systemctl enable --now sshd' enables auto-start at boot and immediately starts the service in a single atomic operation."
        },
        {
          question: "[Q16. Process Management] How do you identify the top CPU-consuming process and terminate it safely using standard signal handling?",
          options: [
            "Run 'top' and press 'k' then type 9",
            "Inspect via 'ps aux --sort=-%cpu | head' and send SIGTERM via 'kill -15 <PID>'",
            "Run 'pkill -9 -u root'",
            "Run 'killall -9 systemd'"
          ],
          correct: 1,explanation: "'ps aux --sort=-%cpu' sorts processes by CPU utilization in descending order. 'kill -15 <PID>' sends SIGTERM allowing graceful termination."
        },
        {
          question: "[Q17. System Boot Target] Which command configures the system default boot target to graphical mode (GUI) across reboots?",
          options: [
            "systemctl set-default graphical.target",
            "systemctl enable runlevel5.target",
            "init 5 --permanent",
            "systemctl isolate graphical.target"
          ],
          correct: 0,explanation: "'systemctl set-default graphical.target' rewrites the /etc/systemd/system/default.target symlink to graphical.target (runlevel 5)."
        },
        {
          question: "[Q18. Package Installation] Which dnf command installs packages httpd, vim, and git in non-interactive batch mode and verifies installation?",
          options: [
            "dnf get httpd vim git",
            "yum add httpd vim git",
            "dnf install -y httpd vim git && rpm -q httpd vim-enhanced git",
            "rpm -ivh httpd vim git"
          ],
          correct: 2,explanation: "'dnf install -y' resolves dependencies automatically without prompting for confirmation. 'rpm -q' queries RPM DB to verify installed packages."
        },
        {
          question: "[Q19. DNF Repository] Where must custom repository configuration files be created for DNF/YUM package management on RHEL 10?",
          options: [
            "/etc/dnf/repositories.list",
            "/var/cache/dnf/repo.conf",
            "/etc/yum.repos.d/*.repo",
            "/usr/share/yum/repos.d/"
          ],
          correct: 2,explanation: "DNF scans directory /etc/yum.repos.d/ for files ending in '.repo' containing [repoid], name, baseurl, enabled=1, and gpgcheck directives."
        },
        {
          question: "[Q20. Custom Web Root SELinux Context] Which commands configure custom directory /webdata with correct SELinux context for Apache web serving?",
          options: [
            "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?' && restorecon -Rv /webdata",
            "chmod -R 777 /webdata",
            "chcon -t httpd_exec_t /webdata",
            "setenforce 0 /webdata"
          ],
          correct: 0,explanation: "'semanage fcontext -a -t httpd_sys_content_t' defines permanent SELinux policy rules, and 'restorecon -Rv' applies security contexts recursively."
        },
        {
          question: "[Q21. SELinux Audit Troubleshooting] A web application is blocked by SELinux. Which tools identify the AVC denial log and apply permanent boolean fixes?",
          options: [
            "Edit /etc/selinux/config to disabled",
            "Inspect /var/log/audit/audit.log or journalctl -t setroubleshoot, then enable boolean via 'setsebool -P <boolean> on'",
            "Reinstall httpd package",
            "Run 'chmod 777' on all web files"
          ],
          correct: 1,explanation: "Audit logs record Access Vector Cache (AVC) denials. 'setsebool -P' updates SELinux booleans in runtime memory and persistent policy store."
        },
        {
          question: "[Q22. Firewall Services Setup] Which firewall-cmd commands permanently allow HTTP (port 80) and HTTPS (port 443) traffic through firewalld?",
          options: [
            "firewall-cmd --permanent --add-service=http --add-service=https && firewall-cmd --reload",
            "iptables -A INPUT -p tcp --dport 80 -j ACCEPT",
            "systemctl stop firewalld",
            "firewall-cmd --add-port=80/tcp --add-port=443/tcp"
          ],
          correct: 0,explanation: "'--permanent' writes configuration rules to firewalld XML files, and '--reload' loads rules into active netfilter kernel tables without dropping connections."
        },
        {
          question: "[Q23. Cron Job Scheduling] Which crontab line for user karan executes /usr/local/bin/backup.sh every single day at 10:30 PM (22:30)?",
          options: [
            "30 22 * * * /usr/local/bin/backup.sh",
            "30 10 * * PM /usr/local/bin/backup.sh",
            "22 30 * * * /usr/local/bin/backup.sh",
            "* 22 30 * * /usr/local/bin/backup.sh"
          ],
          correct: 0,explanation: "Crontab field order: Minute (30), Hour (22 = 10 PM), Day of Month (*), Month (*), Day of Week (*). Edit via 'crontab -u karan -e'."
        },
        {
          question: "[Q24. Root Password Recovery] During rd.break emergency boot, why is 'touch /.autorelabel' mandatory after updating root password in chroot /sysroot?",
          options: [
            "It clears swap memory partitions",
            "It mounts /sysroot in read-write mode",
            "It reboots the system immediately",
            "It instructs systemd-autorabel to re-index SELinux context security labels on /etc/shadow during reboot to prevent boot locking"
          ],
          correct: 3,explanation: "Modifying /etc/shadow without SELinux enforcement updates security context attributes incorrectly. 'touch /.autorelabel' triggers context relabeling at boot."
        },
        {
          question: "[Q25. Podman Container Systemd Autostart] How do you deploy an Apache container webserver forwarding port 8080:80 and configure systemd user autostart?",
          options: [
            "podman run -d --name webserver -p 8080:80 registry.redhat.io/rhel9/httpd-24 && podman generate systemd --name webserver --files --new",
            "podman container start webserver --autostart",
            "docker run -d --restart=always -p 8080:80 httpd",
            "systemctl enable podman-httpd"
          ],
          correct: 0,explanation: "'podman run -p 8080:80' maps host port 8080 to container port 80. 'podman generate systemd --files --new' creates systemd unit files in ~/.config/systemd/user/ for non-root autostart."
        }
      ]
    }
  };

  function renderQuizDashboard() {
    const scores = JSON.parse(localStorage.getItem('linux_book_quiz_scores')) || {};

    Object.keys(quizCategories).forEach(catKey => {
      const statusEl = document.getElementById(`quiz-status-${catKey}`);
      if (statusEl) {
        if (scores[catKey] !== undefined) {
          const totalQCount = (catKey === 'rhcsa-ex200-paper' && quizCategories[catKey]) ? quizCategories[catKey].questions.length : 5;
          statusEl.textContent = `Completed: ${scores[catKey]}/${totalQCount}`;
          statusEl.className = 'quiz-topic-status completed';
        } else {
          statusEl.textContent = 'Not Started';
          statusEl.className = 'quiz-topic-status';
        }
      }
    });
  }

  function startQuizTopic(topicKey) {
    if (!quizCategories[topicKey]) return;

    state.quiz.activeTopic = topicKey;
    state.quiz.currentQuestion = 0;
    state.quiz.score = 0;
    state.quiz.answers = [];

    const allQs = [...quizCategories[topicKey].questions];
    if (topicKey === 'rhcsa-ex200-paper') {
      // Full 25-Question RHCSA EX200 Exam Paper (20 MCQ + 5 Practical)
      state.quiz.activeQuestions = allQs;
    } else {
      // Shuffle and pick 5 random questions for quick topic quizzes
      for (let i = allQs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
      }
      state.quiz.activeQuestions = allQs.slice(0, 5);
    }

    // Update UI elements
    elements.quizActiveTopicTitle.textContent = quizCategories[topicKey].title;
    elements.quizDashboard.style.display = 'none';
    elements.quizWidget.style.display = 'block';
    elements.quizResultsContainer.style.display = 'none';

    loadQuizQuestion();
  }

  function exitToDashboard() {
    state.quiz.activeTopic = null;
    state.quiz.activeQuestions = [];
    elements.quizDashboard.style.display = 'grid';
    elements.quizWidget.style.display = 'none';
    elements.quizResultsContainer.style.display = 'none';
    renderQuizDashboard();
  }

  function loadQuizQuestion() {
    const topicKey = state.quiz.activeTopic;
    if (!topicKey || !quizCategories[topicKey]) return;

    const qIndex = state.quiz.currentQuestion;
    const questions = state.quiz.activeQuestions || quizCategories[topicKey].questions;
    const currentQ = questions[qIndex];

    // Clear previous question elements
    elements.quizQuestionContainer.innerHTML = '';
    elements.quizQuestionContainer.classList.add('active');

    // Update Quiz Progress Steps UI
    if (elements.quizProgressBar) {
      elements.quizProgressBar.innerHTML = '';
      questions.forEach((_, idx) => {
        const step = document.createElement('div');
        step.className = 'quiz-progress-step';
        if (idx === qIndex) {
          step.classList.add('active');
        } else if (idx < qIndex) {
          step.classList.add('completed');
        }
        elements.quizProgressBar.appendChild(step);
      });
    }

    // Update progress text
    const progressTextEl = document.getElementById('quiz-q-num');
    if (progressTextEl) {
      progressTextEl.textContent = `Question ${qIndex + 1} of ${questions.length}`;
    }

    // Create Question Type & Section Badge (MCQ vs Practical Scenario)
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'quiz-question-type-badge';
    badgeDiv.style.display = 'inline-flex';
    badgeDiv.style.alignItems = 'center';
    badgeDiv.style.padding = '4px 12px';
    badgeDiv.style.borderRadius = '20px';
    badgeDiv.style.fontSize = '0.75rem';
    badgeDiv.style.fontWeight = '700';
    badgeDiv.style.textTransform = 'uppercase';
    badgeDiv.style.marginBottom = '14px';
    badgeDiv.style.letterSpacing = '0.5px';

    const isPractical = (topicKey === 'rhcsa-ex200-paper' && qIndex >= 20) || currentQ.type === 'practical';
    if (isPractical) {
      badgeDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      badgeDiv.style.color = '#ef4444';
      badgeDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      const practicalNum = topicKey === 'rhcsa-ex200-paper' ? (qIndex - 19) : (qIndex + 1);
      badgeDiv.innerHTML = `<i class="fas fa-terminal" style="margin-right: 6px;"></i> Practical Hands-On Task ${topicKey === 'rhcsa-ex200-paper' ? practicalNum + ' of 5' : ''}`;
    } else {
      badgeDiv.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
      badgeDiv.style.color = '#3b82f6';
      badgeDiv.style.border = '1px solid rgba(59, 130, 246, 0.3)';
      const mcqNum = qIndex + 1;
      badgeDiv.innerHTML = `<i class="fas fa-list-ul" style="margin-right: 6px;"></i> Multiple Choice Question (MCQ) ${topicKey === 'rhcsa-ex200-paper' ? mcqNum + ' of 20' : ''}`;
    }
    elements.quizQuestionContainer.appendChild(badgeDiv);

    // Create Question Title
    const qTitle = document.createElement('div');
    qTitle.className = 'quiz-question-title';
    qTitle.textContent = currentQ.question;
    qTitle.style.fontSize = '1.1rem';
    qTitle.style.fontWeight = '600';
    qTitle.style.marginBottom = '20px';
    qTitle.style.color = 'var(--text-primary)';
    elements.quizQuestionContainer.appendChild(qTitle);

    // Create Options Container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'quiz-options-list';
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexDirection = 'column';
    optionsContainer.style.gap = '12px';

    const hasAnswered = state.quiz.answers[qIndex] !== undefined;
    const savedAnswer = state.quiz.answers[qIndex];

    const correctIdx = currentQ.correct !== undefined ? currentQ.correct : currentQ.answer;

    currentQ.options.forEach((optionText, optIdx) => {
      const optionCard = document.createElement('label');
      optionCard.className = 'quiz-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `quiz-question-${qIndex}`;
      radio.value = optIdx;
      radio.style.marginRight = '12px';

      if (hasAnswered) {
        radio.disabled = true;
        if (optIdx === savedAnswer) {
          radio.checked = true;
        }
      }

      const textSpan = document.createElement('span');
      textSpan.className = 'quiz-option-text';
      textSpan.textContent = optionText;

      optionCard.appendChild(radio);
      optionCard.appendChild(textSpan);

      // Handle highlighting and clicks
      if (hasAnswered) {
        if (optIdx === correctIdx) {
          optionCard.classList.add('correct');
        } else if (optIdx === savedAnswer) {
          optionCard.classList.add('wrong');
        }
      } else {
        optionCard.addEventListener('click', () => {
          document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
          optionCard.classList.add('selected');
          radio.checked = true;
          elements.quizNextBtn.disabled = false;
        });
      }

      optionsContainer.appendChild(optionCard);
    });

    elements.quizQuestionContainer.appendChild(optionsContainer);

    // Action buttons states
    elements.quizPrevBtn.disabled = qIndex === 0;

    if (hasAnswered) {
      elements.quizNextBtn.disabled = false;
      elements.quizNextBtn.textContent = qIndex === questions.length - 1 ? 'Show Results' : 'Next Question';

      // Render feedback text
      const feedbackDiv = document.createElement('div');
      const isCorrect = savedAnswer === correctIdx;
      feedbackDiv.className = isCorrect ? 'quiz-feedback correct-txt' : 'quiz-feedback wrong-txt';
      feedbackDiv.style.marginTop = '20px';
      feedbackDiv.style.padding = '15px';
      feedbackDiv.style.borderRadius = '8px';
      feedbackDiv.style.fontSize = '0.9rem';
      feedbackDiv.style.lineHeight = '1.5';
      feedbackDiv.style.backgroundColor = isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';
      feedbackDiv.style.color = isCorrect ? 'var(--accent-success)' : '#ef4444';
      feedbackDiv.style.borderLeft = isCorrect ? '4px solid var(--accent-success)' : '4px solid #ef4444';

      feedbackDiv.innerHTML = isCorrect
        ? `<strong>✓ Correct!</strong> ${currentQ.explanation}`
        : `<strong>✗ Incorrect.</strong> The correct answer was: <em>${currentQ.options[correctIdx]}</em>.<br>${currentQ.explanation}`;

      elements.quizQuestionContainer.appendChild(feedbackDiv);
    } else {
      elements.quizNextBtn.disabled = true;
      elements.quizNextBtn.textContent = 'Submit Answer';
    }
  }

  function changeQuizQuestion(direction) {
    const topicKey = state.quiz.activeTopic;
    if (!topicKey || !quizCategories[topicKey]) return;

    const qIndex = state.quiz.currentQuestion;
    const questions = state.quiz.activeQuestions || quizCategories[topicKey].questions;
    const currentQ = questions[qIndex];
    const hasAnswered = state.quiz.answers[qIndex] !== undefined;

    if (direction === 1) {
      if (!hasAnswered) {
        // Submit button clicked
        const selectedOption = document.querySelector(`input[name="quiz-question-${qIndex}"]:checked`);
        if (!selectedOption) return;

        const val = parseInt(selectedOption.value);
        state.quiz.answers[qIndex] = val;

        const correctIdx = currentQ.correct !== undefined ? currentQ.correct : currentQ.answer;
        if (val === correctIdx) {
          state.quiz.score++;
        }

        loadQuizQuestion();
      } else {
        // Next Question clicked
        if (qIndex === questions.length - 1) {
          showQuizResults();
        } else {
          state.quiz.currentQuestion++;
          loadQuizQuestion();
        }
      }
    } else {
      // Previous clicked
      if (qIndex > 0) {
        state.quiz.currentQuestion--;
        loadQuizQuestion();
      }
    }
  }

  function showQuizResults() {
    elements.quizWidget.style.display = 'none';
    elements.quizResultsContainer.style.display = 'block';

    const topicKey = state.quiz.activeTopic;
    const totalQuestions = (state.quiz.activeQuestions || quizCategories[topicKey].questions).length;
    const score = state.quiz.score;
    const percent = Math.round((score / totalQuestions) * 100);

    elements.quizScoreNum.textContent = `${score}/${totalQuestions}`;

    // Save score to local storage
    const scores = JSON.parse(localStorage.getItem('linux_book_quiz_scores')) || {};
    scores[topicKey] = score;
    localStorage.setItem('linux_book_quiz_scores', JSON.stringify(scores));

    let message = '';
    if (percent === 100) {
      message = `Outstanding! You scored 100% on the ${quizCategories[topicKey].title} quiz. You have master-level command of this material!`;
    } else if (percent >= 80) {
      message = `Great job! You scored ${percent}% on the ${quizCategories[topicKey].title} quiz, demonstrating solid proficiency.`;
    } else if (percent >= 60) {
      message = `Good effort! You scored ${percent}%. Review the ${quizCategories[topicKey].title} chapter notes to clear up any gaps and try again.`;
    } else {
      message = `You scored ${percent}%. We recommend re-reading the corresponding chapters and practicing terminal commands before retrying.`;
    }

    elements.quizResultsDesc.textContent = message;

    // Check if ALL categories completed with score >= 4 to mark whole quiz chapter done
    const allCategoriesKeys = Object.keys(quizCategories);
    const completedAllVal = allCategoriesKeys.every(k => scores[k] !== undefined && scores[k] >= 4);
    if (completedAllVal) {
      markSectionCompleted('knowledge-check');
    }
  }

  function resetQuiz() {
    state.quiz.currentQuestion = 0;
    state.quiz.score = 0;
    state.quiz.answers = [];

    const topicKey = state.quiz.activeTopic;
    const allQs = [...quizCategories[topicKey].questions];
    if (topicKey === 'rhcsa-ex200-paper') {
      state.quiz.activeQuestions = allQs;
    } else {
      for (let i = allQs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
      }
      state.quiz.activeQuestions = allQs.slice(0, 5);
    }

    elements.quizWidget.style.display = 'block';
    elements.quizResultsContainer.style.display = 'none';
    loadQuizQuestion();
  }

  // --- VIM ENGINE ---
  window.setVimVisualizerMode = function (mode) {
    const cursor = document.getElementById('vim-vis-cursor');
    const status = document.getElementById('vim-vis-status');
    const command = document.getElementById('vim-vis-command');

    document.querySelectorAll('.visualizer-mode-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.backgroundColor = 'var(--bg-secondary)';
      btn.style.color = 'var(--text-primary)';
    });

    if (window.event && window.event.currentTarget) {
      window.event.currentTarget.classList.add('active');
      window.event.currentTarget.style.backgroundColor = 'var(--accent)';
      window.event.currentTarget.style.color = 'white';
    }

    if (mode === 'normal') {
      if (cursor) { cursor.style.width = '10px'; cursor.style.height = '18px'; cursor.style.backgroundColor = '#d4d4d4'; }
      if (status) { status.textContent = 'NORMAL'; status.style.backgroundColor = '#388bfd'; status.style.color = '#0d1117'; }
      if (command) { command.textContent = "Press 'i' to insert text, or ':' to run exit commands."; command.style.color = '#8b949e'; }
    } else if (mode === 'insert') {
      if (cursor) { cursor.style.width = '2px'; cursor.style.height = '18px'; cursor.style.backgroundColor = '#58a6ff'; }
      if (status) { status.textContent = '-- INSERT --'; status.style.backgroundColor = '#2ea043'; status.style.color = '#ffffff'; }
      if (command) { command.textContent = "Typing inserts letters. Press 'Esc' to exit insert mode."; command.style.color = '#2ea043'; }
    } else if (mode === 'extended') {
      if (cursor) { cursor.style.width = '10px'; cursor.style.height = '18px'; cursor.style.backgroundColor = '#d4d4d4'; }
      if (status) { status.textContent = 'COMMAND-LINE'; status.style.backgroundColor = '#f9826c'; status.style.color = '#0d1117'; }
      if (command) { command.textContent = ":wq (Save & Exit, or type :q! to discard changes)"; command.style.color = '#f9826c'; }
    }
  };

  function saveVimHistory() {
    const snapshot = JSON.stringify(state.vim.contentLines);
    if (state.vim.history[state.vim.historyIndex] === snapshot) return;

    state.vim.history = state.vim.history.slice(0, state.vim.historyIndex + 1);
    state.vim.history.push(snapshot);
    if (state.vim.history.length > 1000) {
      state.vim.history.shift();
    }
    state.vim.historyIndex = state.vim.history.length - 1;
  }

  function loadVimEditor() {
    if (!state.vim.active) return;

    // Render Mode Label
    let modeText = 'NORMAL';
    let modeColor = '#388bfd';
    let modeTextColor = '#0d1117';
    if (state.vim.mode === 'insert') {
      modeText = '-- INSERT --';
      modeColor = '#2ea043';
      modeTextColor = '#ffffff';
    } else if (state.vim.mode === 'extended') {
      modeText = 'COMMAND';
      modeColor = '#f9826c';
      modeTextColor = '#0d1117';
    }

    elements.vimStatusMode.textContent = modeText;
    elements.vimStatusMode.style.backgroundColor = modeColor;
    elements.vimStatusMode.style.color = modeTextColor;
    elements.vimStatusFile.textContent = state.vim.fileName + (state.vim.hasUnsavedChanges ? ' *' : '');

    // Render Command Line Bar
    if (state.vim.mode === 'extended') {
      elements.vimCommandLine.textContent = state.vim.commandBuffer;
    } else {
      elements.vimCommandLine.textContent = state.vim.commandBuffer || 'Press "i" to edit text or ":" to save/exit.';
    }

    // Render Line Numbers Gutter
    if (state.vim.showLineNumbers) {
      elements.vimLineNumbers.style.display = 'flex';
      elements.vimLineNumbers.innerHTML = '';
      state.vim.contentLines.forEach((_, idx) => {
        const numDiv = document.createElement('div');
        numDiv.textContent = idx + 1;
        numDiv.style.color = (idx === state.vim.activeLineIndex) ? '#c9d1d9' : '#57606a';
        elements.vimLineNumbers.appendChild(numDiv);
      });
    } else {
      elements.vimLineNumbers.style.display = 'none';
    }

    // Render Content Lines View
    elements.vimTextView.innerHTML = '';

    state.vim.contentLines.forEach((lineText, lineIdx) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'vim-line';
      if (lineIdx === state.vim.activeLineIndex) {
        lineDiv.classList.add('active');
      }

      const contentSpan = document.createElement('span');
      contentSpan.className = 'vim-line-content';

      if (lineIdx === state.vim.activeLineIndex) {
        const col = state.vim.cursorColIndex;
        const before = lineText.substring(0, col);
        const charAtCursor = lineText.substring(col, col + 1) || ' ';
        const after = lineText.substring(col + 1);

        const beforeNode = document.createTextNode(before);
        const cursorNode = document.createElement('span');
        cursorNode.className = 'vim-char-cursor blink';
        if (state.vim.mode === 'insert') {
          cursorNode.classList.add('insert');
        }
        cursorNode.textContent = charAtCursor;
        const afterNode = document.createTextNode(after);

        contentSpan.appendChild(beforeNode);
        contentSpan.appendChild(cursorNode);
        contentSpan.appendChild(afterNode);
      } else {
        contentSpan.textContent = lineText || ' ';
      }

      lineDiv.appendChild(contentSpan);
      elements.vimTextView.appendChild(lineDiv);
    });

    const activeLineEl = elements.vimTextView.children[state.vim.activeLineIndex];
    if (activeLineEl) {
      activeLineEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function handleVimInput(e) {
    if (!state.vim.active || state.vim.mode !== 'insert') return;

    const val = elements.vimHiddenInput.value;
    state.vim.contentLines[state.vim.activeLineIndex] = val;
    state.vim.cursorColIndex = elements.vimHiddenInput.selectionStart;
    loadVimEditor();
  }

  function handleVimKeyPress(e) {
    if (!state.vim.active) return;

    const activeLine = state.vim.contentLines[state.vim.activeLineIndex] || '';

    // INSERT MODE KEYBOARD HANDLER
    if (state.vim.mode === 'insert') {
      if (e.key === 'Escape') {
        e.preventDefault();
        state.vim.mode = 'normal';
        state.vim.contentLines[state.vim.activeLineIndex] = elements.vimHiddenInput.value;
        elements.vimHiddenInput.value = '';
        state.vim.cursorColIndex = Math.max(0, state.vim.cursorColIndex - 1);
        saveVimHistory();
        loadVimEditor();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const text = elements.vimHiddenInput.value;
        const selStart = elements.vimHiddenInput.selectionStart;
        const before = text.substring(0, selStart);
        const after = text.substring(selStart);

        state.vim.contentLines[state.vim.activeLineIndex] = before;
        state.vim.contentLines.splice(state.vim.activeLineIndex + 1, 0, after);
        state.vim.activeLineIndex++;
        state.vim.cursorColIndex = 0;
        state.vim.hasUnsavedChanges = true;

        elements.vimHiddenInput.value = after;
        elements.vimHiddenInput.selectionStart = 0;
        elements.vimHiddenInput.selectionEnd = 0;

        saveVimHistory();
        loadVimEditor();
        return;
      }

      if (e.key === 'Backspace' && elements.vimHiddenInput.selectionStart === 0) {
        e.preventDefault();
        if (state.vim.activeLineIndex > 0) {
          const currentText = elements.vimHiddenInput.value;
          const prevText = state.vim.contentLines[state.vim.activeLineIndex - 1];

          state.vim.contentLines[state.vim.activeLineIndex - 1] = prevText + currentText;
          state.vim.contentLines.splice(state.vim.activeLineIndex, 1);
          state.vim.activeLineIndex--;
          state.vim.cursorColIndex = prevText.length;
          state.vim.hasUnsavedChanges = true;

          elements.vimHiddenInput.value = state.vim.contentLines[state.vim.activeLineIndex];
          elements.vimHiddenInput.selectionStart = prevText.length;
          elements.vimHiddenInput.selectionEnd = prevText.length;

          saveVimHistory();
          loadVimEditor();
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.vim.activeLineIndex > 0) {
          state.vim.contentLines[state.vim.activeLineIndex] = elements.vimHiddenInput.value;
          state.vim.activeLineIndex--;
          elements.vimHiddenInput.value = state.vim.contentLines[state.vim.activeLineIndex];
          state.vim.cursorColIndex = Math.min(state.vim.cursorColIndex, elements.vimHiddenInput.value.length);
          elements.vimHiddenInput.selectionStart = state.vim.cursorColIndex;
          elements.vimHiddenInput.selectionEnd = state.vim.cursorColIndex;
          loadVimEditor();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.vim.activeLineIndex < state.vim.contentLines.length - 1) {
          state.vim.contentLines[state.vim.activeLineIndex] = elements.vimHiddenInput.value;
          state.vim.activeLineIndex++;
          elements.vimHiddenInput.value = state.vim.contentLines[state.vim.activeLineIndex];
          state.vim.cursorColIndex = Math.min(state.vim.cursorColIndex, elements.vimHiddenInput.value.length);
          elements.vimHiddenInput.selectionStart = state.vim.cursorColIndex;
          elements.vimHiddenInput.selectionEnd = state.vim.cursorColIndex;
          loadVimEditor();
        }
        return;
      }
      return;
    }

    // EXTENDED MODE COMMAND LINE HANDLER
    if (state.vim.mode === 'extended') {
      e.preventDefault();
      if (e.key === 'Escape') {
        state.vim.mode = 'normal';
        state.vim.commandBuffer = '';
        loadVimEditor();
        return;
      }
      if (e.key === 'Backspace') {
        if (state.vim.commandBuffer.length > 1) {
          state.vim.commandBuffer = state.vim.commandBuffer.slice(0, -1);
        } else {
          state.vim.mode = 'normal';
          state.vim.commandBuffer = '';
        }
        loadVimEditor();
        return;
      }
      if (e.key === 'Enter') {
        const cmd = state.vim.commandBuffer.trim();
        state.vim.commandBuffer = '';
        state.vim.mode = 'normal';

        if (cmd === ':w') {
          state.virtualFilesContent[state.vim.filePath] = state.vim.contentLines.join('\n');
          state.vim.hasUnsavedChanges = false;
          state.vim.commandBuffer = `"${state.vim.fileName}" saved`;
          loadVimEditor();
        } else if (cmd === ':q') {
          if (state.vim.hasUnsavedChanges) {
            state.vim.commandBuffer = 'No write since last change (add ! to override)';
            loadVimEditor();
          } else {
            exitVim();
          }
        } else if (cmd === ':q!') {
          exitVim();
        } else if (cmd === ':wq' || cmd === ':x') {
          state.virtualFilesContent[state.vim.filePath] = state.vim.contentLines.join('\n');
          state.vim.hasUnsavedChanges = false;
          exitVim();
        } else if (cmd === ':wq!') {
          state.virtualFilesContent[state.vim.filePath] = state.vim.contentLines.join('\n');
          state.vim.hasUnsavedChanges = false;
          exitVim();
        } else if (cmd === ':se nu') {
          state.vim.showLineNumbers = true;
          loadVimEditor();
        } else if (cmd === ':se nonu') {
          state.vim.showLineNumbers = false;
          loadVimEditor();
        } else {
          state.vim.commandBuffer = `Unknown command: ${cmd}`;
          loadVimEditor();
        }
        return;
      }
      if (e.key.length === 1) {
        state.vim.commandBuffer += e.key;
        loadVimEditor();
      }
      return;
    }

    // NORMAL MODE KEYBOARD SHORTCUTS
    e.preventDefault();
    const key = e.key;

    if (key === 'i') {
      state.vim.mode = 'insert';
      state.vim.commandBuffer = '-- INSERT --';
      elements.vimHiddenInput.value = activeLine;
      elements.vimHiddenInput.selectionStart = state.vim.cursorColIndex;
      elements.vimHiddenInput.selectionEnd = state.vim.cursorColIndex;
      loadVimEditor();
      return;
    }

    if (key === ':') {
      state.vim.mode = 'extended';
      state.vim.commandBuffer = ':';
      loadVimEditor();
      return;
    }

    if (key === 'ArrowUp' || key === 'k') {
      if (state.vim.activeLineIndex > 0) {
        state.vim.activeLineIndex--;
        state.vim.cursorColIndex = Math.min(state.vim.cursorColIndex, (state.vim.contentLines[state.vim.activeLineIndex] || '').length);
        loadVimEditor();
      }
      return;
    }
    if (key === 'ArrowDown' || key === 'j') {
      if (state.vim.activeLineIndex < state.vim.contentLines.length - 1) {
        state.vim.activeLineIndex++;
        state.vim.cursorColIndex = Math.min(state.vim.cursorColIndex, (state.vim.contentLines[state.vim.activeLineIndex] || '').length);
        loadVimEditor();
      }
      return;
    }
    if (key === 'ArrowLeft' || key === 'h') {
      if (state.vim.cursorColIndex > 0) {
        state.vim.cursorColIndex--;
        loadVimEditor();
      }
      return;
    }
    if (key === 'ArrowRight' || key === 'l') {
      const len = activeLine.length;
      if (state.vim.cursorColIndex < Math.max(0, len - 1)) {
        state.vim.cursorColIndex++;
        loadVimEditor();
      }
      return;
    }

    if (key === 'G') {
      state.vim.activeLineIndex = state.vim.contentLines.length - 1;
      state.vim.cursorColIndex = 0;
      loadVimEditor();
      return;
    }

    if (key === 'u') {
      if (state.vim.historyIndex > 0) {
        state.vim.historyIndex--;
        state.vim.contentLines = JSON.parse(state.vim.history[state.vim.historyIndex]);
        state.vim.activeLineIndex = Math.min(state.vim.activeLineIndex, state.vim.contentLines.length - 1);
        state.vim.cursorColIndex = 0;
        state.vim.hasUnsavedChanges = true;
        state.vim.commandBuffer = 'Undo last change';
        loadVimEditor();
      } else {
        state.vim.commandBuffer = 'Already at oldest change';
        loadVimEditor();
      }
      return;
    }

    if (e.ctrlKey && key === 'r') {
      if (state.vim.historyIndex < state.vim.history.length - 1) {
        state.vim.historyIndex++;
        state.vim.contentLines = JSON.parse(state.vim.history[state.vim.historyIndex]);
        state.vim.activeLineIndex = Math.min(state.vim.activeLineIndex, state.vim.contentLines.length - 1);
        state.vim.cursorColIndex = 0;
        state.vim.hasUnsavedChanges = true;
        state.vim.commandBuffer = 'Redo change';
        loadVimEditor();
      } else {
        state.vim.commandBuffer = 'Already at newest change';
        loadVimEditor();
      }
      return;
    }

    if (key === 'y') {
      if (state.vim.lastKey === 'y') {
        state.vim.clipboard = [activeLine];
        state.vim.commandBuffer = '1 line yanked';
        state.vim.lastKey = null;
        loadVimEditor();
      } else {
        state.vim.lastKey = 'y';
        setTimeout(() => { if (state.vim.lastKey === 'y') state.vim.lastKey = null; }, 1000);
      }
      return;
    }

    if (key === 'd') {
      if (state.vim.lastKey === 'd') {
        const deleted = state.vim.contentLines.splice(state.vim.activeLineIndex, 1);
        state.vim.clipboard = deleted;
        if (state.vim.contentLines.length === 0) {
          state.vim.contentLines = [''];
        }
        state.vim.activeLineIndex = Math.min(state.vim.activeLineIndex, state.vim.contentLines.length - 1);
        state.vim.cursorColIndex = 0;
        state.vim.hasUnsavedChanges = true;
        state.vim.commandBuffer = '1 line deleted';
        state.vim.lastKey = null;
        saveVimHistory();
        loadVimEditor();
      } else {
        state.vim.lastKey = 'd';
        setTimeout(() => { if (state.vim.lastKey === 'd') state.vim.lastKey = null; }, 1000);
      }
      return;
    }

    if (key === 'g') {
      if (state.vim.lastKey === 'g') {
        state.vim.activeLineIndex = 0;
        state.vim.cursorColIndex = 0;
        state.vim.lastKey = null;
        loadVimEditor();
      } else {
        state.vim.lastKey = 'g';
        setTimeout(() => { if (state.vim.lastKey === 'g') state.vim.lastKey = null; }, 1000);
      }
      return;
    }

    if (key === 'p') {
      if (state.vim.clipboard.length > 0) {
        state.vim.contentLines.splice(state.vim.activeLineIndex + 1, 0, ...state.vim.clipboard);
        state.vim.activeLineIndex++;
        state.vim.cursorColIndex = 0;
        state.vim.hasUnsavedChanges = true;
        state.vim.commandBuffer = 'Pasted yanked buffer';
        saveVimHistory();
        loadVimEditor();
      }
      return;
    }
  }

  function exitVim() {
    state.vim.active = false;
    elements.terminalVimEditor.style.display = 'none';
    elements.terminalBody.style.display = 'block';

    state.vim.contentLines = [];

    appendTerminalOutput('Closed vim session.');
    updatePrompt();
    setTimeout(() => {
      elements.terminalInput.placeholder = 'Type command...';
      elements.terminalInput.focus();
    }, 50);
  }

  // Run initial configuration
  init();
});
