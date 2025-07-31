#!/usr/bin/env bash

source "$(dirname "$0")/common.sh"

API_BASE="$HOST:$PORT"
COOKIE_JAR="$(dirname "$0")/cookies.txt"

USER_NAME="${1:-admin}"
EMAIL="${2:-test@mail.com}"
PASSWORD="${3-admin}"


curl -s -c "COOKIE_JAR" \
	-X POST "$API_BASE/api/auth/register/" \
	-H "Content-Type: application/json" \
	-d "{\"username\":\"$USER_NAME\", \"password\":\"$PASSWORD\", \"email\": \"$EMAIL\"}"

