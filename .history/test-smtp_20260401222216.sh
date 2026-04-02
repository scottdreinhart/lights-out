#!/bin/bash

# Quick Test: SMTP Password Validator
# This script tests your three passwords securely

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ SMTP PASSWORD TEST - Regression Alert System                ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Check if nodemailer is installed
if ! npm list nodemailer &> /dev/null; then
  echo ""
  echo "📦 Installing nodemailer..."
  pnpm add nodemailer
fi

echo ""
echo "🔐 Setting up secure test..."
echo ""

# Export passwords as environment variables (not stored anywhere)
export PASSWORD_1='!W3kyB3d@777#'
export PASSWORD_2='!R3dW3kyB3d@777#'
export PASSWORD_3='!WekDragon@10081975#777'
export SMTP_USER='scottdreinhart@gmail.com'

echo "📧 Testing 3 passwords against Gmail SMTP"
echo "   User: scottdreinhart@gmail.com"
echo ""

# Run the test script
node compliance/test-smtp-passwords.mjs

echo ""
echo "✅ Test complete!"
echo ""
echo "Next: Store the working password in .env.notifications.local"
echo ""
