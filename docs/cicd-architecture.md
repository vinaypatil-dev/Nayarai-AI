# NAYARAi CI/CD Architecture & Operations Guide

## 1. Executive Summary

This document outlines the architecture, security model, operational mechanics, and extensibility roadmap for the **NAYARAi** website's CI/CD pipeline. 

The pipeline enforces a **Thin CI Trigger Pattern**: GitHub Actions serves solely as an automated orchestrator, validating triggers and securely authenticating via SSH to execute the pre-existing host-side deployment script (`~/scripts/deploy-nayarai.sh`) on the production Samsung S25 server (Termux environment).

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPER WORKSPACE                              │
│                   (Ubuntu 24.04 Dev Workstation)                        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                             Git Commit & Push
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       GITHUB REPOSITORY (REMOTE)                        │
│                   Branch: 'develop' (or 'main')                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                             Webhook Event Trigger
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          GITHUB ACTIONS RUNNER                          │
│                                                                         │
│  1. Validate Secrets (SSH_HOST, SSH_PORT, SSH_USER, SSH_PRIVATE_KEY)    │
│  2. Authenticate via SSH Key                                            │
│  3. Execute Remote Command: bash ~/scripts/deploy-nayarai.sh            │
│  4. Monitor Output & Report Job Status                                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                           Encrypted SSH Session
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PRODUCTION SERVER (TERMUX)                        │
│                       Samsung S25 (No Docker)                           │
│                                                                         │
│  Executes ~/scripts/deploy-nayarai.sh:                                   │
│   ├── 1. git pull origin develop                                        │
│   ├── 2. npm install / npm ci                                           │
│   ├── 3. npm run build                                                  │
│   ├── 4. pm2 reload / restart nayarai                                   │
│   └── 5. tunnelmole status / restart verification                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Architectural Principles & Decisions

### 3.1 Thin CI Trigger Pattern
- **Why**: The production environment is a Samsung S25 running Termux without Docker. Building or running Node.js tasks directly on GitHub Actions runners and attempting to push binaries or sync build outputs to a mobile Linux environment creates severe platform mismatches (glibc vs bionic, arm64 cross-compilation issues, etc.).
- **Decision**: All application lifecycle operations (`git pull`, `npm install`, `npm run build`, `pm2 restart`, `tunnelmole`) remain natively on the target host via `~/scripts/deploy-nayarai.sh`.

### 3.2 Non-Destructive Backward Compatibility
- **Why**: The application is actively running live in production.
- **Decision**: Zero application code files or host-side scripts were modified. The workflow acts strictly as an external trigger mechanism.

### 3.3 Strict Failure Propagation
- **Why**: Silent failures lead to drift between code and production state.
- **Decision**: The workflow requires non-zero exit codes from remote SSH commands to immediately abort the job and alert maintainers. `script_stop: true` and `timeout` limits ensure hung scripts fail fast.

---

## 4. Required GitHub Secrets Configuration

To configure the deployment pipeline, navigate to your GitHub Repository Settings:
**Settings -> Secrets and variables -> Actions -> Repository secrets**

Add the following required secrets:

| Secret Name | Description | Example / Note |
| :--- | :--- | :--- |
| `SSH_HOST` | IP address or hostname of the Samsung S25 device | `192.168.1.100` or dynamic DNS / Tailscale IP |
| `SSH_PORT` | SSH server port on Termux | `8022` (Termux default) or custom port |
| `SSH_USER` | SSH username on Termux | `u0_a123` or your SSH user |
| `SSH_PRIVATE_KEY` | Private SSH key matching `authorized_keys` on S25 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

*(Optional)* Additional Secrets for Extensibility:
- `SITE_URL`: Base URL of the live site for post-deployment health check pinging.
- `SLACK_WEBHOOK_URL` / `TELEGRAM_BOT_TOKEN`: For real-time deployment notifications.

---

## 5. Security & Best Practices

1. **Secret Masking**: GitHub Actions automatically masks secrets in step logs. The validation step explicitly avoids echoing secret values.
2. **Key Protection**: Use a dedicated, unpassphrased SSH key pair created specifically for CI/CD deployments. Restrict key permissions on the server:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
3. **Concurrency Guards**: The workflow includes `concurrency.group` setting to prevent multiple workflow runs from executing simultaneous deployment scripts on the server.

---

## 6. Future Extensibility Roadmap

The pipeline is pre-configured with modular extension hooks:

### 6.1 Multi-Environment Deployment (Dev / Staging / Production)
The workflow supports `workflow_dispatch` with an environment selector input. To expand to multi-branch auto-deployments:
- Configure GitHub Environments (`production`, `staging`).
- Map branches (`develop` -> `staging`, `main` -> `production`) in the workflow triggers.

### 6.2 Post-Deployment Health Checks
Add an automated HTTP status verification step immediately following execution:
```yaml
- name: 🩺 Run Health Check
  run: |
    curl --fail --silent --show-error https://nayarai.org/api/health || exit 1
```

### 6.3 Chat & Email Notifications (Slack / Telegram / Discord)
Add notification steps under `if: always()`:
```yaml
- name: 📢 Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: |
      {
        "text": "Deployment of NAYARAi status: ${{ job.status }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 6.4 Automatic Release Tagging & Rollbacks
- Host script can save previous commit SHAs before `git pull` to facilitate instant rollbacks via `git reset --hard PREV_SHA && pm2 restart nayarai`.
- GitHub Actions can automatically apply semantic release tags on successful main branch deployments.

---

## 7. Operational & Troubleshooting Checklist

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **SSH Connection Timeout** | Network unreachable, SSH server stopped, wrong SSH_PORT/SSH_HOST | Verify Termux SSH server is running (`sshd`), check IP address / port mapping. |
| **Permission Denied (publickey)** | `SSH_PRIVATE_KEY` mismatch or missing entry in `authorized_keys` | Ensure public key is appended to `~/.ssh/authorized_keys` on Termux. |
| **Remote Script Not Found** | File does not exist at `~/scripts/deploy-nayarai.sh` | Verify path on Samsung S25 (`ls -l ~/scripts/deploy-nayarai.sh`). |
| **Deployment Script Failed** | NPM build error, missing environment variables, PM2 error | Inspect GitHub Actions step logs for script output from host. |
