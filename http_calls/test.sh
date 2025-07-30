
#!/usr/bin/env bash

source "$(dirname "$0")/common.sh"

API_BASE="$HOST:$PORT"

curl "$API_BASE"
