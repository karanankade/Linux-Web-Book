with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    content = f.read()

old_toc = """        <ul class="right-toc-list" id="right-toc-list">
          <li class="right-toc-item active"><a href="#intro-os" class="right-toc-link">Introduction</a></li>
          <li class="right-toc-item"><a href="#client-server" class="right-toc-link">Client vs Server</a></li>
          <li class="right-toc-item"><a href="#linux-open-source" class="right-toc-link">Open Source</a></li>
          <li class="right-toc-item"><a href="#linux-founder" class="right-toc-link">Linux Founder</a></li>
          <li class="right-toc-item"><a href="#history-linux" class="right-toc-link">Linux History</a></li>
          <li class="right-toc-item"><a href="#unix-intro" class="right-toc-link">UNIX Roots</a></li>
          <li class="right-toc-item"><a href="#what-is-redhat" class="right-toc-link">What is Red Hat</a></li>
          <li class="right-toc-item"><a href="#rhel-history" class="right-toc-link">RHEL Versioning</a></li>
          <li class="right-toc-item"><a href="#rhcsa-certification" class="right-toc-link">RHCSA Certification</a></li>
          <li class="right-toc-item"><a href="#lab-setup" class="right-toc-link">Lab Setup</a></li>
          <li class="right-toc-item"><a href="#vm-troubleshooting" class="right-toc-link">VM Troubleshooting</a></li>
          <li class="right-toc-item"><a href="#file-system" class="right-toc-link">File System</a></li>
          <li class="right-toc-item"><a href="#bash-commands" class="right-toc-link">Bash Shell & Commands</a></li>
          <li class="right-toc-item"><a href="#file-commands" class="right-toc-link">File Operations</a></li>
          <li class="right-toc-item"><a href="#group-management" class="right-toc-link">Group Management</a></li>
          <li class="right-toc-item"><a href="#basic-permissions" class="right-toc-link">Basic Permissions</a></li>
          <li class="right-toc-item"><a href="#acl-permissions" class="right-toc-link">ACL Permissions</a></li>
          <li class="right-toc-item"><a href="#system-security" class="right-toc-link">System Security</a></li>
          <li class="right-toc-item"><a href="#terminal-sandbox" class="right-toc-link">Interactive Terminal</a></li>
          <li class="right-toc-item"><a href="#knowledge-check" class="right-toc-link">Knowledge Quiz</a></li>
        </ul>"""

new_toc = """        <ul class="right-toc-list" id="right-toc-list">
          <li class="right-toc-item active"><a href="#intro-os" class="right-toc-link">Introduction</a></li>
          <li class="right-toc-item"><a href="#client-server" class="right-toc-link">Client vs Server</a></li>
          <li class="right-toc-item"><a href="#linux-open-source" class="right-toc-link">Open Source</a></li>
          <li class="right-toc-item"><a href="#linux-founder" class="right-toc-link">Linux Founder</a></li>
          <li class="right-toc-item"><a href="#history-linux" class="right-toc-link">Linux History</a></li>
          <li class="right-toc-item"><a href="#unix-intro" class="right-toc-link">UNIX Roots</a></li>
          <li class="right-toc-item"><a href="#what-is-redhat" class="right-toc-link">What is Red Hat</a></li>
          <li class="right-toc-item"><a href="#rhel-history" class="right-toc-link">RHEL Versioning</a></li>
          <li class="right-toc-item"><a href="#rhcsa-certification" class="right-toc-link">RHCSA Certification</a></li>
          <li class="right-toc-item"><a href="#lab-setup" class="right-toc-link">Lab Setup</a></li>
          <li class="right-toc-item"><a href="#vm-troubleshooting" class="right-toc-link">VM Troubleshooting</a></li>
          <li class="right-toc-item"><a href="#boot-process" class="right-toc-link">Boot Process</a></li>
          <li class="right-toc-item"><a href="#file-system" class="right-toc-link">File System Hierarchy</a></li>
          <li class="right-toc-item"><a href="#bash-commands" class="right-toc-link">Bash Shell & Commands</a></li>
          <li class="right-toc-item"><a href="#file-commands" class="right-toc-link">File Operations</a></li>
          <li class="right-toc-item"><a href="#vim-editor" class="right-toc-link">Vim Text Editor</a></li>
          <li class="right-toc-item"><a href="#user-management" class="right-toc-link">User Account Management</a></li>
          <li class="right-toc-item"><a href="#group-management" class="right-toc-link">Group Management</a></li>
          <li class="right-toc-item"><a href="#basic-permissions" class="right-toc-link">Basic Permissions</a></li>
          <li class="right-toc-item"><a href="#acl-permissions" class="right-toc-link">ACL Permissions</a></li>
          <li class="right-toc-item"><a href="#system-security" class="right-toc-link">System Security</a></li>
          <li class="right-toc-item"><a href="#regular-expressions" class="right-toc-link">Regular Expressions & Filters</a></li>
          <li class="right-toc-item"><a href="#archive-files" class="right-toc-link">Archive & Compression</a></li>
          <li class="right-toc-item"><a href="#job-automation" class="right-toc-link">Job Automation</a></li>
          <li class="right-toc-item"><a href="#bash-scripting" class="right-toc-link">Bash Scripting</a></li>
          <li class="right-toc-item"><a href="#network-management" class="right-toc-link">Network Management</a></li>
          <li class="right-toc-item"><a href="#disk-partitioning" class="right-toc-link">Disk Partitioning & Storage</a></li>
          <li class="right-toc-item"><a href="#terminal-sandbox" class="right-toc-link">Interactive Terminal</a></li>
          <li class="right-toc-item"><a href="#knowledge-check" class="right-toc-link">Knowledge Quiz</a></li>
        </ul>"""

if old_toc in content:
    content = content.replace(old_toc, new_toc, 1)
    with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully updated right panel 'In This Chapter' list in index.html!")
else:
    print("Could not find old_toc string in index.html!")
