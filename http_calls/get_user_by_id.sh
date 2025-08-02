#!/usr/bin/env bash

source "$(dirname "$0")/common.sh"

API_BASE="$HOST:$PORT"
COOKIE_JAR="$(dirname "$0")/cookies.txt"

USER_ID=$1

curl -s -b "$COOKIE_JAR" \
	-X POST "$API_BASE/api/user/get-user-by-id" \
	-H "Content-Type: application/json" \
	
