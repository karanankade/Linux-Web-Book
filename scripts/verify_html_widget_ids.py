with open(r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html", "r", encoding="utf-8") as f:
    html = f.read()

ids_to_check = [
    # GRUB
    "grub-pass-input", "grub-generate-btn", "grub-hash-output",
    # Network
    "net-con-name", "net-if-name", "net-ip-val", "net-gw-val", "net-dns-val", "net-host-val",
    "net-status-btn", "net-add-static-btn", "net-add-dhcp-btn", "net-up-btn", "net-down-btn",
    "net-delete-btn", "net-host-btn", "net-tui-btn", "net-cmd-display", "net-log-display",
    # SSH
    "ssh-target-val", "ssh-keygen-btn", "ssh-copy-btn", "ssh-output-display",
    # Service
    "svc-name-val", "svc-start-btn", "svc-stop-btn", "svc-restart-btn",
    "svc-status-btn", "svc-enable-btn", "svc-disable-btn", "svc-log-display"
]

print("--- VERIFYING WIDGET ELEMENT IDS IN INDEX.HTML ---")
for eid in ids_to_check:
    present = f'id="{eid}"' in html
    print(f"ID '{eid}': {'EXISTS' if present else 'MISSING'}")
