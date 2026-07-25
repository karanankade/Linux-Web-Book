import re

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add virtual files /etc/grub2.cfg, /etc/hostname, /etc/NetworkManager/system-connections/
target_virtual_files = "'/etc/sudoers': `## Sudoers allow file"
new_virtual_files = """'/etc/grub2.cfg': `### BEGIN /etc/grub.d/10_linux ###
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
      '/etc/sudoers': `## Sudoers allow file"""

content = content.replace(target_virtual_files, new_virtual_files, 1)

# 2. Add man entries for grub2-mkpasswd-pbkdf2, ifconfig, ip, nmcli, nmtui, hostnamectl, hostname
target_man = "case 'sudo':"
new_man = """case 'grub2-mkpasswd-pbkdf2':
             case 'grub-mkpasswd-pbkdf2':
               output = `GRUB2-MKPASSWD-PBKDF2(1)              User Commands             GRUB2-MKPASSWD-PBKDF2(1)

NAME
       grub2-mkpasswd-pbkdf2 - generate a PBKDF2 password hash for GRUB bootloader

SYNOPSIS
       grub2-mkpasswd-pbkdf2

DESCRIPTION
       grub2-mkpasswd-pbkdf2 generates PBKDF2 password hashes for protecting GRUB boot entries and restricting single user mode.`;
               break;
             case 'nmcli':
               output = `NMCLI(1)                        User Commands                       NMCLI(1)

NAME
       nmcli - command-line tool for controlling NetworkManager

SYNOPSIS
       nmcli [OPTIONS] OBJECT { COMMAND | help }

DESCRIPTION
       nmcli is a command-line tool for controlling NetworkManager and getting its status. It can be used to create, display, edit, delete, activate, and deactivate network connections.`;
               break;
             case 'nmtui':
               output = `NMTUI(1)                        User Commands                       NMTUI(1)

NAME
       nmtui - Text User Interface for NetworkManager

SYNOPSIS
       nmtui [edit | activate | hostname]

DESCRIPTION
       nmtui is a ncurses-based Text User Interface application for interacting with NetworkManager.`;
               break;
             case 'ifconfig':
             case 'ip':
               output = `IP(8)                           System Administration                        IP(8)

NAME
       ip, ifconfig - show / manipulate network devices, IPv4/IPv6 addresses, and routing

SYNOPSIS
       ip [ OPTIONS ] OBJECT { COMMAND | help }
       ifconfig [interface]

DESCRIPTION
       ip and ifconfig inspect and configure network interface addresses, netmasks, broadcast flags, and device states.`;
               break;
             case 'hostnamectl':
             case 'hostname':
               output = `HOSTNAMECTL(1)                  System Administration               HOSTNAMECTL(1)

NAME
       hostnamectl, hostname - control or print the system hostname

SYNOPSIS
       hostnamectl [COMMAND]
       hostname [name]

DESCRIPTION
       hostnamectl may be used to query and change the system hostname and related metadata.`;
               break;
             case 'sudo':"""

content = content.replace(target_man, new_man, 1)

# 3. Add command handlers in processCommand
target_cmd = "case 'sudo':"
new_cmds = """case 'grub2-mkpasswd-pbkdf2':
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
                output = `DEVICE  TYPE      STATE      CONNECTION\nenp0s3  ethernet  connected  delhi`;
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
                state.virtualFilesContent[`/etc/NetworkManager/system-connections/${conName}.nmconnection`] = `[connection]\nid=${conName}\ntype=ethernet\ninterface-name=enp0s3\nautoconnect=true\n\n[ipv4]\nmethod=manual`;
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

        case 'sudo':"""

content = content.replace(target_cmd, new_cmds, 1)

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated js/script.js with commands and man pages!")
