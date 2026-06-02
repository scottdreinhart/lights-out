# Environment Variables Configuration Reference

## Scope note

This document is for `.env*` variables and local secret handling only.  
For agent/runtime repository context (tooling, shell, architecture, quality gates), use root [`/ENVIRONMENT.md`](../ENVIRONMENT.md).

## Overview

This document explains environment variables used across the platform. Environment configuration follows a **template-based, git-ignored, locally-modified pattern**.

## File Organization

### Committed (Template Only)

| File | Purpose | Contents |
|------|---------|----------|
| `.env.example` | Universal template | All available variables with explanations (no secrets) |

### Git-Ignored (Local & Credentials)

| File | Purpose | When Used |
|------|---------|-----------|
| `.env` | Base environment variables | Local development, never committed |
| `.env.local` | Local development overrides | Overrides `.env` for personal dev environment |
| `.env.*.local` | Platform-specific local files | `.env.android.local`, `.env.notifications.local`, etc. (infrastructure/credentials) |

All `.env*` except `.env.example` are in `.gitignore` and never committed.

## Variable Categories

### 1. Development Cache Control

**Variable**: `VITE_NO_CACHE`  
**Used By**: Vite development server  
**Default**: `false` (caching enabled)  
**Purpose**: Force re-optimization of dependencies, disable module caching during development  
**When To Use**: When module boundaries seem stale or you're experiencing caching artifacts

```bash
# Enable no-cache mode
VITE_NO_CACHE=true
pnpm dev:nocache
```

**Validation**: Check Vite console output for "caching disabled" message

---

### 2. Email Notifications (Infrastructure)

Used by CI/CD pipelines and build infrastructure to send regression alerts and deployment notifications.

| Variable | Example | Required | Purpose |
|----------|---------|----------|---------|
| `EMAIL_ENABLED` | `true` | No | Enable/disable email notifications |
| `SMTP_HOST` | `smtp.gmail.com` | Yes (if enabled) | SMTP server hostname |
| `SMTP_PORT` | `587` | Yes (if enabled) | SMTP server port (usually 587 for TLS, 25 for unencrypted) |
| `SMTP_SECURE` | `false` | Yes (if enabled) | Use TLS (false = StartTLS on 587, true = SSL on 465) |
| `SMTP_USER` | `your-email@gmail.com` | Yes (if enabled) | SMTP authentication username |
| `SMTP_PASS` | `your-app-password` | Yes (if enabled) | SMTP authentication password (16+ chars, use app-specific password for Gmail) |
| `NOTIFICATION_EMAIL` | `your-email@gmail.com` | Yes (if enabled) | Primary recipient for alerts |
| `CC_EMAIL` | `other@example.com` | No | CC recipient for alerts |
| `SMS_EMAIL` | `5551234567@sms-gateway.com` | No | SMS-to-email gateway address |

**Setup for Gmail (Recommended)**:

1. Enable 2-factor authentication on your Gmail account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Copy the 16-character password (no spaces)
4. Use this password in `SMTP_PASS=...` (not your Gmail password)

**Validation**:

```bash
# Test email configuration
node scripts/test-smtp-config.js  # (if such script exists)
# OR check CI logs for email delivery status
```

---

### 3. Slack Notifications (Optional, Infrastructure)

Post deployment status and regression alerts to Slack channel.

| Variable | Example | Required | Purpose |
|----------|---------|----------|---------|
| `SLACK_ENABLED` | `false` | No | Enable/disable Slack notifications |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/...` | Yes (if enabled) | Incoming webhook URL from Slack |

**Setup Webhook**:

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create new app or select existing
3. Enable "Incoming Webhooks"
4. Add new webhook to desired channel
5. Copy webhook URL to `SLACK_WEBHOOK_URL`

**Validation**:

```bash
# Test Slack webhook
curl -X POST "<YOUR_WEBHOOK_URL>" \
  -H 'Content-type: application/json' \
  -d '{"text":"Test message from platform"}'
```

---

### 4. Compliance Dashboard (Infrastructure)

URL for compliance dashboard used in deployment pipelines and monitoring.

| Variable | Example | Required | Purpose |
|----------|---------|----------|---------|
| `DASHBOARD_URL` | `http://localhost:3000/compliance/...` | No | URL to compliance status dashboard |

---

## Security Best Practices

### ✅ DO

- ✅ Store credentials in `.env.local` or `.env.*.local` (git-ignored)
- ✅ Use app-specific passwords for Gmail (not your account password)
- ✅ Rotate credentials quarterly
- ✅ Use strong, unique passwords (16+ characters with mixed case, numbers, symbols)
- ✅ For CI/CD: use GitHub Secrets instead of `.env` files
- ✅ Review `.gitignore` to ensure `.env` and `.env.*.local` are ignored
- ✅ Keep `.env.example` as a public template (no secrets)

### ❌ DON'T

- ❌ Commit `.env`, `.env.local`, or `.env.*.local` files
- ❌ Hardcode passwords or secrets in code
- ❌ Use your primary account password for SMTP (use app-specific password)
- ❌ Share credentials in Slack, email, or pull request comments
- ❌ Commit credentials to `.env.example`
- ❌ Check `.env` files into version control

### .gitignore Verification

Verify that sensitive files are ignored:

```bash
# Check .gitignore contains these patterns
grep -E "^\.env$|^\.env\.\*\.local$|^\.env\.local$" .gitignore

# Verify files are not tracked
git status --ignored | grep .env
```

If not ignored, add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

Then remove from git:
```bash
git rm --cached .env* .env.*.local
git commit -m "chore(config): remove committed .env files"
```

---

## Local Development Setup

### First-Time Setup

1. Copy template to local file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your local values:
   ```bash
   # VSCode
   code .env.local
   
   # Or any editor
   nano .env.local
   ```

3. For cache control (optional):
   ```bash
   echo "VITE_NO_CACHE=true" >> .env.nocache
   ```

4. Verify file is ignored:
   ```bash
   git status --ignored | grep .env.local
   # Should show: .env.local (git-ignored)
   ```

### Platform-Specific Configuration

For platform-specific environment variables (Android, Capacitor, etc.):

```bash
# Create platform-specific local file
cp .env.example .env.android.local
# Edit with Android-specific values
nano .env.android.local
```

File is automatically ignored (matches `.env.*.local` pattern in `.gitignore`).

---

## CI/CD & Deployment

### GitHub Actions

Use GitHub Secrets instead of `.env` files:

1. Go to repository: Settings → Secrets & Variables → Actions
2. Add secrets for `SMTP_USER`, `SMTP_PASS`, `SLACK_WEBHOOK_URL`, etc.
3. Reference in workflow:
   ```yaml
   - name: Run build with environment
     env:
       SMTP_USER: ${{ secrets.SMTP_USER }}
       SMTP_PASS: ${{ secrets.SMTP_PASS }}
     run: pnpm validate
   ```

**DO NOT** commit `.env` files to CI/CD repositories.

### Local CI Testing

To test CI build locally:

1. Create `.env.ci.local` (git-ignored):
   ```bash
   EMAIL_ENABLED=true
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=test@example.com
   SMTP_PASS=test-password-16-chars
   ```

2. Run build:
   ```bash
   pnpm validate
   ```

---

## Troubleshooting

### Email Not Sending

**Problem**: Emails not received after deployment  
**Diagnosis**:
```bash
# Check SMTP configuration
grep -E "SMTP|EMAIL" .env.local .env.notifications.local 2>/dev/null

# Verify credentials
echo "SMTP_USER: $SMTP_USER"
echo "SMTP_PASS length: ${#SMTP_PASS}"

# Check CI logs for SMTP errors
```

**Solutions**:
- Verify SMTP credentials are correct (use app-specific password for Gmail)
- Check SMTP_PORT matches SMTP_SECURE setting (587 with StartTLS, 465 with SSL)
- Ensure firewall/network allows outbound SMTP (port 587 or 465)
- Verify recipient email is configured in `NOTIFICATION_EMAIL`

### Cache Issues During Development

**Problem**: Changes not reflected in dev server despite reload  
**Solution**:
```bash
# Disable caching for development
VITE_NO_CACHE=true pnpm dev

# Or use alias
pnpm dev:nocache
```

### Variables Not Loading

**Problem**: `process.env.SMTP_USER` is undefined  
**Diagnosis**:
```bash
# Check .env file exists
ls -la .env .env.local .env.*.local 2>/dev/null

# Verify `VITE_` prefix (for Vite apps)
grep "^VITE_" .env.example

# Verify file format (no trailing spaces, valid KEY=VALUE)
cat .env.local | od -c | head -20
```

**Solutions**:
- Environment variables must be prefixed with `VITE_` for Vite applications
- Restart dev server after changing `.env` files
- Check `.env.local` file format (KEY=VALUE, one per line, no trailing spaces)

---

## Reference

- **Vite Env Docs**: https://vitejs.dev/guide/env-and-mode.html
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **Slack Incoming Webhooks**: https://api.slack.com/messaging/webhooks
- **SMTP Port Reference**: https://www.mailgun.com/blog/email/smtp-port/
