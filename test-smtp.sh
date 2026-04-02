#!/bin/bash
set -e

# SMTP Password Verification for Gmail App Password
# This script tests the working Gmail app password

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ SMTP PASSWORD TEST - Gmail App Password Verification      ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Check if nodemailer is installed
if ! node -e "import('nodemailer')" 2>/dev/null; then
  echo "📦 Installing nodemailer..."
  pnpm add -D nodemailer
fi

# Export the Gmail app password
export PASSWORD='yjbilqulswpxlbjy'
export SMTP_USER='scottdreinhart@gmail.com'

echo ""
echo "🧪 Testing Gmail App Password..."
echo ""

# Run the test
node compliance/test-smtp-passwords.mjs

# Show next steps
echo ""
echo "✅ Test complete!"
echo ""
echo "📝 To set up notifications:"
echo "   1. Create .env.notifications.local:"
echo "      cat > .env.notifications.local << 'EOF'"
echo "      EMAIL_ENABLED=true"
echo "      SMTP_HOST=smtp.gmail.com"
echo "      SMTP_PORT=587"
echo "      SMTP_USER=scottdreinhart@gmail.com"
echo "      SMTP_PASS=yjbilqulswpxlbjy"
echo "      NOTIFICATION_EMAIL=scottdreinhart@gmail.com"
echo "      SMS_EMAIL=4246664233@msg.fi.google.com"
echo "      DASHBOARD_URL=http://localhost:3000/compliance/dashboard.html"
echo "      EMAIL_ENABLED=true"
echo "      EOF"
echo ""
echo "   2. Test notifications:"
echo "      source .env.notifications.local"
echo "      SEND_ALL_NOTIFICATIONS=true pnpm check:regressions"
echo ""
