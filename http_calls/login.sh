#!/usr/bin/env bash

source "$(dirname "$0")/common.sh"

API_BASE="$HOST:$PORT"
COOKIE_JAR="$(dirname "$0")/cookies.txt"

USER_NAME="${1:-admin}"
PASSWORD="${2:-admin}"


curl -s -c "$COOKIE_JAR" \
	-X POST "$API_BASE/api/auth/login/" \
	-H "Content-Type: application/json" \
	-d "{\"username\":\"$USER_NAME\", \"password\":\"$PASSWORD\"}"

