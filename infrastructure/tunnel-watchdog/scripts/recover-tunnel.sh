#!/usr/bin/env bash

# ==============================================================================
# Tunnel Watchdog — Recovery Engine
# Safely restarts Tunnelmole, establishes a new tunnel session, and updates storage.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

source "$SCRIPT_DIR/utils.sh"
load_config

log_message "WARN" "Initiating PM2 Tunnelmole recovery procedure..."

# 1. Safely restart the PM2 application managing Tunnelmole
log_message "INFO" "Restarting PM2 application '$PM2_TUNNELMOLE_APP'..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 restart "$PM2_TUNNELMOLE_APP" 2>/dev/null || pm2 restart tmole 2>/dev/null
else
  log_message "ERROR" "PM2 CLI not found in PATH."
  exit 1
fi

# 2. Identify PM2 output log file or capture via pm2 logs
PM2_LOG_FILE="$HOME/.pm2/logs/${PM2_TUNNELMOLE_APP}-out.log"
ALT_PM2_LOG="$HOME/.pm2/logs/tmole-out.log"

# 3. Poll PM2 log output for hardened URL extraction
ELAPSED=0
NEW_URL=""

while [ $ELAPSED -lt $RECOVERY_TIMEOUT ]; do
  sleep 2
  ELAPSED=$((ELAPSED + 2))

  # Capture log content either from PM2 log file or via pm2 logs CLI
  LOG_CONTENT=""
  if [ -f "$PM2_LOG_FILE" ]; then
    LOG_CONTENT=$(tail -n 50 "$PM2_LOG_FILE")
  elif [ -f "$ALT_PM2_LOG" ]; then
    LOG_CONTENT=$(tail -n 50 "$ALT_PM2_LOG")
  else
    LOG_CONTENT=$(pm2 logs "$PM2_TUNNELMOLE_APP" --lines 30 --nostream 2>/dev/null)
  fi

  # Hardened URL extraction regex (matches https://<id>.tunnelmole.net or https://<id>.tunnels.mole)
  MATCHED_URL=$(echo "$LOG_CONTENT" | grep -oE 'https://[a-zA-Z0-9.-]+\.(tunnelmole|tunnels)\.(net|mole)' | tail -n 1)

  if [ -n "$MATCHED_URL" ]; then
    NEW_URL="$MATCHED_URL"
    break
  fi
done

# 4. Handle outcome
if [ -n "$NEW_URL" ]; then
  log_message "SUCCESS" "Tunnelmole PM2 restart completed. New public URL: $NEW_URL"
  
  # Update external storage file (~/.nayarai/current_tunnel_url.txt)
  echo "$NEW_URL" > "$URL_STORAGE_FILE"
  log_message "INFO" "Saved URL to $URL_STORAGE_FILE"

  # Execute extension hooks if enabled
  if [ "$ENABLE_HOOKS" = "true" ] && [ -d "$HOOKS_DIR" ]; then
    log_message "INFO" "Executing extension hooks..."
    for hook in "$HOOKS_DIR"/*.sh; do
      if [ -x "$hook" ]; then
        log_message "INFO" "Running hook: $(basename "$hook")"
        "$hook" "$NEW_URL" >> "$LOG_FILE" 2>&1 || log_message "WARN" "Hook $(basename "$hook") returned non-zero code"
      fi
    done
  fi
  exit 0
else
  log_message "ERROR" "Failed to extract new Tunnelmole URL from PM2 logs within ${RECOVERY_TIMEOUT}s."
  exit 1
fi
