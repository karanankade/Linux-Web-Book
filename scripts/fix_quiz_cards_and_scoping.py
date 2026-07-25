import os

index_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\index.html"
script_path = r"C:\Users\Karan\OneDrive\Desktop\Linux Web Book\js\script.js"

# 1. Update index.html to include missing quiz cards
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

quiz_target = '<div class="quiz-topic-card" data-topic="disk-partitioning">'
quiz_addition = """<div class="quiz-topic-card" data-topic="ssh-remote-access">
                <div class="quiz-topic-icon"><i class="fas fa-key"></i></div>
                <div class="quiz-topic-content">
                  <h4>SSH Remote Access</h4>
                  <p>Test your knowledge on SSH, sshd_config policies, and passwordless RSA keypairs.</p>
                </div>
                <div class="quiz-topic-meta">
                  <span class="quiz-topic-status" id="quiz-status-ssh-remote-access">Not Started</span>
                  <button class="quiz-start-btn" data-topic="ssh-remote-access">Start Quiz</button>
                </div>
              </div>

              <div class="quiz-topic-card" data-topic="service-management">
                <div class="quiz-topic-icon"><i class="fas fa-cogs"></i></div>
                <div class="quiz-topic-content">
                  <h4>Managing Services & Daemons</h4>
                  <p>Test your knowledge on systemctl commands, background daemons, and systemd units.</p>
                </div>
                <div class="quiz-topic-meta">
                  <span class="quiz-topic-status" id="quiz-status-service-management">Not Started</span>
                  <button class="quiz-start-btn" data-topic="service-management">Start Quiz</button>
                </div>
              </div>

              <div class="quiz-topic-card" data-topic="network-management">
                <div class="quiz-topic-icon"><i class="fas fa-network-wired"></i></div>
                <div class="quiz-topic-content">
                  <h4>Network Management</h4>
                  <p>Test your knowledge on nmcli commands, nmtui, ip addr, and persistent keyfiles.</p>
                </div>
                <div class="quiz-topic-meta">
                  <span class="quiz-topic-status" id="quiz-status-network-management">Not Started</span>
                  <button class="quiz-start-btn" data-topic="network-management">Start Quiz</button>
                </div>
              </div>

              """ + quiz_target

if quiz_target in html and 'data-topic="ssh-remote-access"' not in html:
    html = html.replace(quiz_target, quiz_addition, 1)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Added missing quiz cards to index.html!")

# 2. Fix JS scoping for setupSshVisualizer, setupServiceVisualizer, setupGrubVisualizer, setupNetworkVisualizer
with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

# Extract top prepended visualizer definitions if present
top_marker = "  // SSH Key Generator & Remote Access Visualizer"
if js.startswith("\n  // SSH Key Generator"):
    parts = js.split("document.addEventListener('DOMContentLoaded', function () {", 1)
    vis_code = parts[0]
    rest = parts[1]
    
    # Place vis_code inside DOMContentLoaded right before setupDiskManagerVisualizer
    target_place = "function setupDiskManagerVisualizer() {"
    new_rest = rest.replace(target_place, vis_code + "\n\n  " + target_place, 1)
    js = "document.addEventListener('DOMContentLoaded', function () {" + new_rest

    with open(script_path, "w", encoding="utf-8") as f:
        f.write(js)
    print("Fixed JS visualizer scoping inside DOMContentLoaded!")
else:
    print("JS visualizer code already inside DOMContentLoaded or marker not at start.")
