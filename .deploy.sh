#!/usr/bin/env bash
#
# Simple Spring Boot build‑and‑deploy script
# ------------------------------------------
# 1. Builds the project (Maven example shown)
# 2. Copies the resulting JAR to the remote server
# 3. Restarts the systemd service that runs the JAR
#
# Prerequisites
#   • SSH key‑based auth from this machine → server
#   • The systemd service "newborn" already exists on the server
#   • Remote user has sudo rights for systemctl restart
#   • JAVA is installed on the server
# -------------------------------------------------

set -euo pipefail   # abort on error, unset vars, or pipe fail

###############
# PARAMETERS PUBLIC #
###############
APP_SERVICE="public"            # systemd service name
JAR_NAME="publicapi-0.0.1-SNAPSHOT"            # jar name
REMOTE_USER="hundaoln"           # Linux user on the server
REMOTE_HOST="10.12.53.56"          # replace with real IP / DNS
REMOTE_DIR="/home/hundaoln"      # where the JAR lives on the server


MVN_CMD="./mvnw clean package -DskipTests"   # or "mvn ..." if wrapper not present

# SSH options for better authentication handling
SSH_OPTS="-o ConnectTimeout=10 -o BatchMode=yes -o StrictHostKeyChecking=accept-new"
SCP_OPTS="-o ConnectTimeout=10 -o BatchMode=yes -o StrictHostKeyChecking=accept-new"

################
# 0. PREFLIGHT #
################
echo "🔍 Starting deployment..."

###############
# 1. BUILD    #
###############
echo "▶ Building Spring Boot project with test profile…"
mvn clean package -DskipTests -Ptest


echo "▶ Building Spring Boot project with test profile…"
export SPRING_PROFILES_ACTIVE=prod
$MVN_CMD

# Grab the first JAR produced under target/
JAR_FILE=$(ls publicapi/target/*.jar | head -n1)
[[ -f "$JAR_FILE" ]] || { echo "❌ No jar found – build failed?"; exit 1; }
echo "   Built JAR: $JAR_FILE"

################
# 2. COPY PUBLIC     #
################
echo "▶ Copying JAR to ${REMOTE_HOST}:${REMOTE_DIR} …"
if scp $SCP_OPTS "$JAR_FILE" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${JAR_NAME}.jar"; then
    echo "✅ JAR copied successfully"
else
    echo "❌ Failed to copy JAR file"
    exit 1
fi

# Grab the first JAR produced under target/
PRIVATE_JAR_FILE=$(ls privateapi/target/*.jar | head -n1)
[[ -f "$PRIVATE_JAR_FILE" ]] || { echo "❌ No jar found – build failed?"; exit 1; }
echo "   Built JAR: $PRIVATE_JAR_FILE"

################
# 3. RESTART   #
################
echo "▶ Restarting remote service ${APP_SERVICE} …"
if ssh $SSH_OPTS "${REMOTE_USER}@${REMOTE_HOST}" \
  "sudo -n /usr/bin/systemctl restart ${APP_SERVICE}.service && sudo -n /usr/bin/systemctl status ${APP_SERVICE}.service --no-pager"; then
    echo "✅ Service restarted successfully"
else
    echo "❌ Failed to restart service"
    exit 1
fi

################
# 3.1 RESTART PRIVATE     #
################
echo "▶ Restarting remote service ${APP_SERVICE_PRIVATE} …"
if ssh $SSH_OPTS "${REMOTE_USER_PRIVATE}@${REMOTE_HOST_PRIVATE}" \
  "sudo -n /usr/bin/systemctl restart ${APP_SERVICE_PRIVATE}.service && sudo -n /usr/bin/systemctl status ${APP_SERVICE_PRIVATE}.service --no-pager"; then
    echo "✅ Service restarted successfully"
else
    echo "❌ Failed to restart service"
    exit 1
fi



echo "✅ Deployment complete."
