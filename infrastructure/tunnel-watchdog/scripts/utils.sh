#!/usr/bin/env bash

# ==============================================================================
# Tunnel Watchdog Utilities & Logging Library
# Shared helper functions for health checks, logging, and environment parsing.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

load_config() {
  CONFIG_FILE="$BASE_DIR/config.env"
  if [ -f "$CONFIG_FILE" ]; then
    # Load config without executing arbitrary code
    export $(grep -v '^#' "$CONFIG_FILE" | xargs 2>/dev/null)
  fi

  # Apply production-safe defaults if not configured
  TARGET_PORT="${TARGET_PORT:-3001}"
  PM2_TUNNELMOLE_APP="${PM2_TUNNELMOLE_APP:-tunnelmole}"
  HEALTH_CHECK_PATH="${HEALTH_CHECK_PATH:-/}"
  
  # External state directory outside repository to keep git working tree clean
  STATE_DIR="${STATE_DIR:-$HOME/.nayarai/tunnel-watchdog}"
  URL_STORAGE_FILE="${URL_STORAGE_FILE:-$STATE_DIR/current_tunnel_url.txt}"
  LOG_FILE="${LOG_FILE:-$STATE_DIR/tunnel-watchdog.log}"
  
  HTTP_TIMEOUT="${HTTP_TIMEOUT:-10}"
  RECOVERY_TIMEOUT="${RECOVERY_TIMEOUT:-30}"
  ENABLE_HOOKS="${ENABLE_HOOKS:-false}"
  HOOKS_DIR="${HOOKS_DIR:-$BASE_DIR/hooks}"

  # Ensure external log and storage directories exist
  mkdir -p "$STATE_DIR"
  mkdir -p "$(dirname "$LOG_FILE")"
  mkdir -p "$(dirname "$URL_STORAGE_FILE")"
}

log_message() {
  local level="$1"
  local message="$2"
  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  local formatted="[$timestamp] [$level] $message"

  echo "$formatted"
  if [ -n "$LOG_FILE" ]; then
    echo "$formatted" >> "$LOG_FILE"
  fi
}

is_tmole_running() {
  if pgrep -f "tmole" >/dev/null 2>&1 || pgrep -f "tunnelmole" >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

is_local_app_healthy() {
  local local_url="http://localhost:${TARGET_PORT}${HEALTH_CHECK_PATH}"
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 --max-time 5 "$local_url" 2>/dev/null)
  
  # Consider 200, 301, 302, 307, 308 as healthy local application response
  if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "302" ] || [ "$http_code" = "307" ] || [ "$http_code" = "308" ]; then
    return 0
  else
    echo "$http_code"
    return 1
  fi
}

read_stored_url() {
  if [ -f "$URL_STORAGE_FILE" ]; then
    cat "$URL_STORAGE_FILE" | tr -d ' \n\r'
  else
    echo ""
  fi
}
