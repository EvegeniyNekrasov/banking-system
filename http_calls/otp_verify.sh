#!/usr/bin/env bash
EMAIL=$1
OTP=$2
PURPOSE=$3

curl -X POST http://localhost:6969/api/otp/verify \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"otp\": \"$OTP\", \"purpose\": \"$PURPOSE\"}"