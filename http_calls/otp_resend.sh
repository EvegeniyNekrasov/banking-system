#!/usr/bin/env bash
EMAIL=$1
PURPOSE=$2

curl -X POST http://localhost:6969/api/otp/resend \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"purpose\": \"$PURPOSE\"}"