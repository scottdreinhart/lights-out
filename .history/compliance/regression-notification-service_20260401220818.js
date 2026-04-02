/**
 * Regression Alert Notification Service
 * Handles email and Slack notifications for regression alerts
 * 
 * Environment Variables:
 *   EMAIL_ENABLED=true (default: false)
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password
 *   NOTIFICATION_EMAIL=recipient@example.com
 *   CC_EMAIL=optional-cc@example.com
 *   
 *   SLACK_ENABLED=true (default: false)
 *   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
 * 
 * Usage:
 *   import { NotificationService } from './regression-notification-service.js';
 *   
 *   const service = new NotificationService();
 *   await service.sendRegressionAlert(regressions, severity, buildNumber);
 */

export class NotificationService {
  constructor(config = {}) {
    // Email configuration
    this.emailEnabled = config.emailEnabled || process.env.EMAIL_ENABLED === 'true';
    this.smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
    this.notificationEmail = process.env.NOTIFICATION_EMAIL || 'notifications@example.com';
    this.ccEmail = process.env.CC_EMAIL;

    // Slack configuration
    this.slackEnabled = config.slackEnabled || process.env.SLACK_ENABLED === 'true';
    this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

    // Load nodemailer if email is enabled
    this.mailer = null;
    if (this.emailEnabled) {
      this.initializeMailer();
    }
  }

  /**
   * Initialize nodemailer (lazy load to avoid dependency if not used)
   */
  async initializeMailer() {
    try {
      // Try to import nodemailer dynamically
      const nodemailer = await import('nodemailer');
      this.mailer = nodemailer.default.createTransport(this.smtpConfig);
      
      // Verify connection (optional)
      try {
        await this.mailer.verify();
        console.log('📧 Email service initialized successfully');
      } catch (err) {
        console.warn('⚠️  Email verification failed, but service will attempt sends:', err.message);
      }
    } catch (err) {
      console.warn(
        '⚠️  nodemailer not installed. Email notifications will be skipped.\n' +
        'Install with: pnpm add nodemailer'
      );
      this.emailEnabled = false;
    }
  }

  /**
   * Send regression alert via email and/or Slack
   */
  async sendRegressionAlert(regressions, severity, buildNumber, emailTemplate) {
    const promises = [];

    // Send email if enabled
    if (this.emailEnabled && this.mailer && emailTemplate) {
      promises.push(
        this.sendEmail(emailTemplate, buildNumber)
          .catch(err => console.error('❌ Email send failed:', err.message))
      );
    }

    // Send Slack message if enabled
    if (this.slackEnabled && this.slackWebhookUrl) {
      promises.push(
        this.sendSlackMessage(regressions, severity, buildNumber)
          .catch(err => console.error('❌ Slack send failed:', err.message))
      );
    }

    // Execute all notifications in parallel
    if (promises.length > 0) {
      await Promise.all(promises);
    } else if (!this.emailEnabled && !this.slackEnabled) {
      console.log('ℹ️  No notification channels enabled. Set EMAIL_ENABLED or SLACK_ENABLED=true');
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(emailTemplate, buildNumber) {
    if (!this.emailEnabled || !this.mailer) {
      console.log('📧 Email notifications disabled');
      return;
    }

    try {
      const mailOptions = {
        from: this.smtpConfig.auth.user,
        to: this.notificationEmail,
        subject: emailTemplate.generateSubject(),
        html: emailTemplate.generateHTML(),
        text: emailTemplate.generateText(),
      };

      // Add CC if configured
      if (this.ccEmail) {
        mailOptions.cc = this.ccEmail;
      }

      const info = await this.mailer.sendMail(mailOptions);
      console.log(`✅ Email sent successfully (Build #${buildNumber})`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      throw error;
    }
  }

  /**
   * Send Slack notification
   */
  async sendSlackMessage(regressions, severity, buildNumber) {
    if (!this.slackEnabled || !this.slackWebhookUrl) {
      console.log('💬 Slack notifications disabled');
      return;
    }

    try {
      const color = {
        'NO_ISSUE': '#28a745',
        'INVESTIGATE': '#ffc107',
        'FIX_REQUIRED': '#dc3545',
      }[severity] || '#ffc107';

      const emoji = {
        'NO_ISSUE': '✅',
        'INVESTIGATE': '⚠️',
        'FIX_REQUIRED': '🔴',
      }[severity] || '📊';

      const slackMessage = {
        text: `${emoji} Performance Regression Alert - Build #${buildNumber}`,
        attachments: [
          {
            color,
            title: `${emoji} Build #${buildNumber} - ${severity}`,
            text: `Found ${regressions.length} regression(s) in WASM performance`,
            fields: [
              {
                title: 'Severity',
                value: severity,
                short: true,
              },
              {
                title: 'Regressions',
                value: regressions.length.toString(),
                short: true,
              },
              {
                title: 'Affected Apps',
                value: regressions.map(r => r.app).join(', '),
                short: false,
              },
            ],
            ts: Math.floor(Date.now() / 1000),
          },
          // Add detailed regressions as additional attachment
          {
            color: '#f0f0f0',
            title: 'Regression Details',
            text: regressions
              .map(
                r =>
                  `*${r.app}* (${r.difficulty}): ${r.baselineMs.toFixed(2)}ms → ${r.currentMs.toFixed(2)}ms (+${r.regressionPercent.toFixed(1)}%)`
              )
              .join('\n'),
            mrkdwn_in: ['text', 'title'],
          },
        ],
      };

      const response = await fetch(this.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Slack message sent successfully (Build #${buildNumber})`);
      return response;
    } catch (error) {
      console.error('❌ Failed to send Slack message:', error.message);
      throw error;
    }
  }

  /**
   * Check if notifications are properly configured
   */
  validateConfiguration() {
    const issues = [];

    if (this.emailEnabled) {
      if (!this.smtpConfig.auth.user || !this.smtpConfig.auth.pass) {
        issues.push('❌ Email enabled but SMTP_USER or SMTP_PASS not configured');
      }
      if (!this.notificationEmail) {
        issues.push('❌ Email enabled but NOTIFICATION_EMAIL not configured');
      }
    }

    if (this.slackEnabled) {
      if (!this.slackWebhookUrl) {
        issues.push('❌ Slack enabled but SLACK_WEBHOOK_URL not configured');
      }
    }

    if (issues.length > 0) {
      console.warn('\n⚠️  NOTIFICATION CONFIGURATION ISSUES:');
      issues.forEach(issue => console.warn(`   ${issue}`));
      return false;
    }

    return true;
  }

  /**
   * Get configuration status
   */
  getStatus() {
    return {
      emailEnabled: this.emailEnabled,
      emailConfigured: !!(this.smtpConfig.auth.user && this.smtpConfig.auth.pass),
      notificationEmail: this.notificationEmail,
      slackEnabled: this.slackEnabled,
      slackConfigured: !!this.slackWebhookUrl,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Factory function for creating notification service with defaults
 */
export function createNotificationService(config = {}) {
  return new NotificationService(config);
}
