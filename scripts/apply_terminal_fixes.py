import re

with open('js/script.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add 'cd' command right after case 'help' block (after line 1394: break;)
cd_implementation = """        case 'cd':
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
          break;"""

# Replace right after case 'help' break
help_target = "case 'help':"
help_pos = code.find(help_target)
if help_pos != -1:
    break_pos = code.find("break;", help_pos)
    if break_pos != -1:
        insert_pos = break_pos + len("break;")
        code = code[:insert_pos] + "\n\n" + cd_implementation + code[insert_pos:]

# 2. Add 'vi' case before 'vim'
code = code.replace("case 'vim':", "case 'vi':\n        case 'vim':")

# 3. Fix processCommand(cmdStr) bug on line 4604
code = code.replace("output = processCommand(cmdStr);", "output = processCommand(commandToRun);")

# 4. Add additional Linux commands (df, rmdir, id, who, w, uptime, ping, chronyc, kill, pkill, dd)
additional_cases = """        case 'df':
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
          break;"""

# Insert additional cases right before case 'clear':
code = code.replace("case 'clear':", additional_cases + "\n\n        case 'clear':")

# 5. Update default case to fallback to processCommand(commandToRun)
old_default = """        default:
          if (cmd.startsWith('./') || cmd.endsWith('.sh')) {
            let res = executeScriptContent(cmd, false);
            output = res.output;
            styleClass = res.isError ? 'error' : 'success-text';
          } else {
            output = `bash: ${cmd}: command not found. Type "help" for a list of valid commands.`;
            styleClass = 'error';
          }"""

new_default = """        default:
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
          }"""

code = code.replace(old_default, new_default)

with open('js/script.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied terminal fixes successfully!")
