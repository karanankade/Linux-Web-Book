# 🐧 Linux & RHEL 10 Interactive Web Book

An interactive, web-based study guide and hands-on learning platform for **Red Hat Enterprise Linux 10 (RHEL 10)** and general Linux System Administration.

> An interactive Linux & RHEL 10 study guide featuring a live terminal simulator, firewall zone manager, SELinux visualizer, network configurator, and built-in quizzes. Master system administration concepts hands-on — from LVM and NFS to SSH, `firewall-cmd`, and SELinux — all in your browser.

---

## ✨ Features

- 🖥️ **Interactive Terminal Simulator**: A fully functional simulated Linux bash shell supporting commands like `ls`, `cd`, `chmod`, `firewall-cmd`, `systemctl`, `nmcli`, `rpm`, `dnf`, `chcon`, `semanage`, `ssh-keygen`, and more.
- 🔥 **Firewall & Zone Manager**: Interactive `firewall-cmd` visualizer to inspect zones, open/close ports, add/remove services, and reload configurations live.
- 🛡️ **SELinux Visualizer**: Visual interface to explore SELinux security contexts, file relabeling (`restorecon`, `chcon`), and booleans (`getsebool`, `setsebool`).
- 🌐 **Network & Remote Access Tools**: Interactive `nmcli` network manager, `systemctl` service controller, and `ssh` key generator/file transfer simulators (`scp`, `rsync`).
- 📚 **Comprehensive RHEL 10 Topics**: Covers user management, permissions, storage (LVM, XFS, swap), package management (RPM/DNF), networking, SELinux, Web/Database servers (Apache, MariaDB), and troubleshooting.
- 📝 **Interactive Quizzes**: Test your knowledge per topic with real-time feedback and score tracking.
- 📑 **Bookmarks & Search**: Bookmark key sections, track reading progress, and quickly search Q&A and technical concepts.
- 🎨 **Modern & Premium UI**: Responsive layout with sleek typography, smooth micro-animations, glassmorphism elements, and light/dark theme support.

---

## 📁 Project Structure

```text
Linux Web Book/
├── index.html          # Main SPA (Single Page Application) HTML file
├── css/
│   └── styles.css      # Core Design System, styling, layout, and components
├── js/
│   └── script.js       # App logic, SPA routing, virtual terminal, & visualizers
├── assets/             # Images, icons, and static web assets
└── scripts/            # Build, fix, diagnostic, and testing helper scripts
```

---

## 🚀 Getting Started

Since the application is built using vanilla HTML, CSS, and JavaScript, **no installation or build steps are required**.

### Running Locally

1. **Clone or Download** this repository.
2. **Open in Browser**: Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).
3. **Using a Local Server (Optional)**:
   ```bash
   # Using Python
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

---

## 🧰 Built With

- **HTML5**: Semantic document structure for SPA chapters and interactive visualizer widgets.
- **Vanilla CSS**: Clean, modern design system using CSS custom properties (variables), Flexbox, Grid, and smooth transitions.
- **Vanilla JavaScript (ES6+)**: SPA router, state management, simulated virtual filesystem, and interactive tools.

---

## 📄 License

This project is created for educational and training purposes for Linux enthusiasts and RHCSA/RHEL 10 certification learners.
