#!/usr/bin/env bash
EMAIL=$1

curl -X POST http://localhost:6969/api/otp/generate \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"purpose\":\"LOGIN\"}"