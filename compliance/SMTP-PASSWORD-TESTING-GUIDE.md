# SMTP Password Testing Guide

## Secure Testing Approach

This guide helps you validate SMTP passwords without exposing them to git or public repositories.

### Step 1: Prepare Your Passwords

You have three passwords to test:
```
Password 1: yjbilqulswpxlbjy
Password 2: yjbilqulswpxlbjy
Password 3: yjbilqulswpxlbjy
```

### Step 2: Run the Secure Test

```bash
# Test all three passwords via environment variables
export PASSWORD_1='yjbilqulswpxlbjy'
export PASSWORD_2='yjbilqulswpxlbjy'
export PASSWORD_3='yjbilqulswpxlbjy#'
export SMTP_USER=scottdreinhart@gmail.com

# Run the test script
node compliance/test-smtp-passwords.mjs
```

Or test individually:

```bash
# Test just one password
export PASSWORD_1='yjbilqulswpxlbjy'
export SMTP_USER=scottdreinhart@gmail.com
node compliance/test-smtp-passwords.mjs
```

### Step 3: Interpret Results

**If a password works** ✅:
```
✅ SUCCESS: Password works!
   Ready to use for notifications.
```

**If a password fails** ❌:
```
❌ FAILED: Invalid login
   💡 Hint: Password may be incorrect or not an app password
```

### Step 4: Store the Working Password Securely

Once you find the working password:

```bash
# Create a git-ignored env file (add to .gitignore first)
cat > .env.notifications.local << 'EOF'
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=scottdreinhart@gmail.com
SMTP_PASS=YOUR_WORKING_PASSWORD_HERE
NOTIFICATION_EMAIL=scottdreinhart@gmail.com
SMS_EMAIL=4246664233@msg.fi.google.com
EOF
```

### Step 5: Load and Test Full System

```bash
# Load the env file
source .env.notifications.local

# Test the full notification system
export SEND_ALL_NOTIFICATIONS=true
pnpm check:regressions
```

You should receive:
- 📧 Email at scottdreinhart@gmail.com
- 📱 SMS text to your phone
- ✅ Console confirmation

## Security Checklist

- [ ] `.env.notifications.local` created
- [ ] `.env.notifications.local` added to `.gitignore`
- [ ] Passwords NOT committed to git
- [ ] `test-smtp-passwords.mjs` is development-only (not deployed)
- [ ] Secure credentials policy documented
- [ ] Team members aware of credential handling

## Troubleshooting

### "Invalid login" or "Authentication failed"

This usually means:
1. Password is incorrect
2. Gmail requires app password (not account password)
3. Account has security restrictions

**Solution**:
- Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Generate a fresh 16-character app password
- Test with that instead

### "Connection timeout"

Usually a network issue:
- Check internet connectivity
- Verify firewall isn't blocking port 587
- Try port 465 with `SMTP_SECURE=true`

### "SSL/TLS error"

Certificate validation issue:
- Ensure `SMTP_PORT=587` (not 465)
- Ensure `SMTP_SECURE=false` for port 587
- Check system date/time is correct

## Files in This System

| File | Purpose | Git-Ignored |
|------|---------|-------------|
| `test-smtp-passwords.mjs` | Email validator script | ❌ Tracked |
| `.env.notifications.example` | Template (no secrets) | ❌ Tracked |
| `.env.notifications.local` | Your actual credentials | ✅ **MUST be ignored** |
| `.gitignore` | Must include `*.local` | ✅ Tracked |

## Next Steps

1. Run `node compliance/test-smtp-passwords.mjs` with your passwords
2. Identify which password works
3. Store in `.env.notifications.local`
4. Run full system test
5. Delete `test-smtp-passwords.mjs` after verification (optional)

---

**Questions?** Check the main notification guide at `SPRINT-2-WEEK-4-MULTI-CHANNEL-ALERTS.md`
