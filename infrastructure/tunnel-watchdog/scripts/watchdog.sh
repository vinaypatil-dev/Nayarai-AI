#!/usr/bin/env bash

# ==============================================================================
# Tunnel Watchdog — Main Health Monitoring Loop
# Checks tmole process vitality and public tunnel responsiveness.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

source "$SCRIPT_DIR/utils.sh"
load_config

# 1. First, verify local application health at http://localhost:TARGET_PORT
LOCAL_ERR_CODE=$(is_local_app_healthy)
if [ $? -ne 0 ]; then
  log_message "ERROR" "Local application at http://localhost:${TARGET_PORT} is DOWN (Status Code: ${LOCAL_ERR_CODE:-000}). Skipping Tunnelmole restart."
  exit 1
fi
log_message "INFO" "Local application at http://localhost:${TARGET_PORT} is HEALTHY."

# 2. Verify tmole process is active in PM2
if ! is_tmole_running; then
  log_message "WARN" "Tunnelmole process is NOT running. Triggering PM2 recovery..."
  "$SCRIPT_DIR/recover-tunnel.sh"
  exit $?
fi

# 3. Read stored active public URL
CURRENT_URL=$(read_stored_url)
if [ -z "$CURRENT_URL" ]; then
  log_message "WARN" "No active URL found in $URL_STORAGE_FILE. Triggering recovery..."
  "$SCRIPT_DIR/recover-tunnel.sh"
  exit $?
fi

# 4. Perform 3 health check retries with a short delay before recovering
TARGET_ENDPOINT="${CURRENT_URL}${HEALTH_CHECK_PATH}"
MAX_RETRIES=3
RETRY_DELAY=3
ATTEMPT=1
IS_HEALTHY=false

while [ $ATTEMPT -le $MAX_RETRIES ]; do
  RESPONSE_FILE="/tmp/watchdog_response_$$.tmp"
  
  HTTP_STATUS=$(curl -s -o "$RESPONSE_FILE" -w "%{http_code}" \
    --connect-timeout "$HTTP_TIMEOUT" \
    --max-time "$((HTTP_TIMEOUT + 5))" \
    "$TARGET_ENDPOINT" 2>/dev/null)

  RESPONSE_BODY=""
  if [ -f "$RESPONSE_FILE" ]; then
    RESPONSE_BODY=$(cat "$RESPONSE_FILE" 2>/dev/null)
    rm -f "$RESPONSE_FILE"
  fi

  # Check if public tunnel returned valid HTTP status (200, 3xx)
  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ] || [ "$HTTP_STATUS" = "307" ] || [ "$HTTP_STATUS" = "308" ]; then
    IS_HEALTHY=true
    log_message "INFO" "Public tunnel is HEALTHY [$CURRENT_URL] (Attempt $ATTEMPT/$MAX_RETRIES, HTTP Status: $HTTP_STATUS)"
    break
  fi

  # Log failed attempt signature
  if [ "$HTTP_STATUS" = "404" ] && echo "$RESPONSE_BODY" | grep -iq "No matching tunnelmole domain"; then
    log_message "WARN" "Attempt $ATTEMPT/$MAX_RETRIES: Tunnelmole domain expired signature detected (HTTP 404: No matching tunnelmole domain)."
  else
    log_message "WARN" "Attempt $ATTEMPT/$MAX_RETRIES: Public tunnel check failed (HTTP Status: $HTTP_STATUS)."
  fi

  if [ $ATTEMPT -lt $MAX_RETRIES ]; then
    sleep $RETRY_DELAY
  fi
  ATTEMPT=$((ATTEMPT + 1))
done

# 5. Recover ONLY if all retries failed
if [ "$IS_HEALTHY" = "false" ]; then
  log_message "WARN" "All $MAX_RETRIES public tunnel health checks failed. Triggering PM2 recovery for $CURRENT_URL..."
  "$SCRIPT_DIR/recover-tunnel.sh"
  exit $?
else
  exit 0
fi
