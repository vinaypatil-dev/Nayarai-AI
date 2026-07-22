# Tunnel Watchdog Automation Package
**Target Environment:** Samsung S25 (Termux / Android Linux)  
**Target Application:** Next.js Production Server (Port 3001)  
**Purpose:** Autonomous health monitoring, retry validation, local app verification, and PM2 self-healing for Tunnelmole public tunnels.

---

## 1. Executive Summary & Overview

Free Tunnelmole (`tmole`) tunnels automatically expire after approximately 12 hours, causing public URLs to fail with **HTTP 404: "No matching tunnelmole domain"**.

The **Tunnel Watchdog** provides autonomous health monitoring designed specifically for Termux on mobile Linux:
1. **Local App Safety First**: Verifies `http://localhost:3001` is HEALTHY before attempting any tunnel restarts (prevents restarting Tunnelmole when the application server itself is down).
2. **3x Retry Resilience**: Retries public tunnel health checks 3 times before declaring a tunnel degraded.
3. **PM2 Process Ownership**: PM2 remains the single owner of the Tunnelmole process (`pm2 restart tunnelmole`). No duplicate or unmanaged background processes are created.
4. **External State Isolation**: State files (`current_tunnel_url.txt` and `logs/tunnel-watchdog.log`) are stored outside the working directory in `~/.nayarai/tunnel-watchdog/` to keep git working trees completely clean.

---

## 2. Folder Structure & Component Map

```text
infrastructure/tunnel-watchdog/
├── config.env.example                 # Configuration template (copy to config.env)
├── ecosystem.config.js                # PM2 process manager configuration for watchdog
├── README.md                          # Operation & installation guide
├── hooks/                             # Extension hook placeholders
│   ├── github-secret-updater.sh.placeholder
│   ├── deployment-health-checker.sh.placeholder
│   └── rss-health-checker.sh.placeholder
└── scripts/
    ├── utils.sh                       # Helper functions, state paths & local health checks
    ├── watchdog.sh                    # 3x Retry health check & local app verification
    └── recover-tunnel.sh              # PM2 Tunnelmole restart & URL extraction engine
```

### External Runtime State Directory (Created automatically at runtime)
```text
~/.nayarai/tunnel-watchdog/
├── current_tunnel_url.txt              # Active public Tunnelmole URL
└── logs/
    └── tunnel-watchdog.log            # Timestamped monitoring logs
```

---

## 3. Purpose of Every Script

| File | Purpose |
| :--- | :--- |
| `scripts/watchdog.sh` | Main health check. Verifies `localhost:3001` first, retries public URL checks 3x, and invokes `recover-tunnel.sh` only if all retries fail. |
| `scripts/recover-tunnel.sh` | PM2 recovery engine. Triggers `pm2 restart tunnelmole`, extracts the new URL from PM2 output logs, and saves to `~/.nayarai/current_tunnel_url.txt`. |
| `scripts/utils.sh` | Shared helper library for logging, loading config, and testing `is_local_app_healthy` on port 3001. |
| `config.env` | Config file holding `TARGET_PORT=3001`, `PM2_TUNNELMOLE_APP="tunnelmole"`, and `STATE_DIR="$HOME/.nayarai/tunnel-watchdog"`. |
| `ecosystem.config.js` | PM2 task configuration to run `watchdog.sh` on a 5-minute cron schedule using standard `bash` interpreter. |

---

## 4. Setup & Operation on Samsung S25 (Termux)

```bash
# 1. Navigate to package directory
cd ~/infrastructure/tunnel-watchdog

# 2. Make scripts executable
chmod +x scripts/*.sh

# 3. Create config.env from template
cp config.env.example config.env

# 4. Start PM2 Watchdog
pm2 start ecosystem.config.js
pm2 save
```

### Reading Current Active Tunnel URL
```bash
cat ~/.nayarai/current_tunnel_url.txt
```

