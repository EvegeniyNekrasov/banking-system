#!/usr/bin/env bash

source "$(dirname "$0")/common.sh"

API_BASE="$HOST:$PORT"
COOKIE_JAR="$(dirname "$0")/cookies.txt"


curl -s -X POST \
	-b $COOKIE_JAR \
	-c $COOKIE_JAR \
	"$API_BASE/api/auth/logout" \
	-o /dev/null -w "Codigo HTTP: %{http_code}\n"
