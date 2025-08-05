#!/bin/bash

source "$(dirname "$0")/../server/.env"

echo "🧪 Testing OTP generation..."
echo "Email: $MAIL_USER"
echo "Host: $MAIL_HOST"
echo "Port: $MAIL_PORT"

curl -s -X POST "http://localhost:6969/api/otp/generate" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$MAIL_USER\", \"purpose\":\"LOGIN\"}" \
  | jq '.' || echo "Response is not JSON"

echo ""
echo "✅ Check your email for the OTP!"
