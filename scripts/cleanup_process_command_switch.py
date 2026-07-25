with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

# Remove duplicate case 'ssh' and case 'grub2-mkpasswd-pbkdf2' inside case 'man'
# Let's inspect where case 'man' is:
man_start = js.find("case 'man':")
print("case 'man': found at index:", man_start)

# Let's check man cases block:
old_man_block = """            case 'scp':
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
               break;"""

new_man_block = """            case 'scp':
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
               break;"""

if old_man_block in js:
    js = js.replace(old_man_block, new_man_block, 1)
    print("Cleaned up man block duplicate!")

# Also clean up the man page section for grub2-mkpasswd-pbkdf2, nmcli, nmtui, ifconfig, hostnamectl inside case 'man':
old_man_block2 = """        case 'grub2-mkpasswd-pbkdf2':
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
               break;"""

if old_man_block2 in js:
    js = js.replace(old_man_block2, "", 1)
    print("Cleaned up second man block duplicate!")

with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Saved cleaned script.js!")
