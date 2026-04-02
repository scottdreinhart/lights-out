/**
 * Regression Email Template Generator
 * Generates professional HTML emails for regression notifications
 * 
 * Usage:
 *   const template = new RegressionEmailTemplate(regressions, severity);
 *   const html = template.generateHTML();
 *   const subject = template.generateSubject();
 */

export class RegressionEmailTemplate {
  constructor(regressions = [], severity = 'INVESTIGATE', buildNumber = 0, timestamp = new Date()) {
    this.regressions = regressions;
    this.severity = severity; // NO_ISSUE, INVESTIGATE, FIX_REQUIRED
    this.buildNumber = buildNumber;
    this.timestamp = timestamp;
    this.dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000/compliance/dashboard.html';
  }

  /**
   * Generate email subject line based on severity
   */
  generateSubject() {
    const severityLabel = {
      'NO_ISSUE': 'Regression Check: No Issues',
      'INVESTIGATE': '⚠️ INVESTIGATE: Regression Detected',
      'FIX_REQUIRED': '🔴 CRITICAL: Performance Regression Detected',
    };
    
    return `${severityLabel[this.severity] || 'Regression Alert'} - Build #${this.buildNumber}`;
  }

  /**
   * Generate plain text version for email clients without HTML support
   */
  generateText() {
    const separator = '═'.repeat(80);
    const lines = [
      separator,
      'PERFORMANCE REGRESSION ALERT',
      separator,
      '',
      `Build Number: ${this.buildNumber}`,
      `Timestamp: ${this.timestamp.toISOString()}`,
      `Severity: ${this.severity}`,
      `Total Regressions: ${this.regressions.length}`,
      '',
      separator,
      'REGRESSION DETAILS',
      separator,
      '',
    ];

    this.regressions.forEach((reg, idx) => {
      lines.push(`${idx + 1}. ${reg.app}`);
      lines.push(`   Difficulty: ${reg.difficulty}`);
      lines.push(`   Baseline: ${reg.baselineMs.toFixed(2)}ms`);
      lines.push(`   Current: ${reg.currentMs.toFixed(2)}ms`);
      lines.push(`   Regression: ${reg.regressionPercent.toFixed(1)}%`);
      lines.push(`   Status: ${reg.severity}`);
      lines.push('');
    });

    lines.push(separator);
    lines.push('ACTION REQUIRED');
    lines.push(separator);
    
    if (this.severity === 'FIX_REQUIRED') {
      lines.push('This regression exceeds 10% performance degradation.');
      lines.push('Immediate investigation and remediation required.');
    } else if (this.severity === 'INVESTIGATE') {
      lines.push('This regression is between 5-10%. Monitor and plan remediation.');
    }

    lines.push('');
    lines.push(`View Dashboard: ${this.dashboardUrl}?tab=regressions`);
    lines.push('');
    lines.push('---');
    lines.push('This is an automated alert from the Regression Detection System');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Generate professional HTML email
   */
  generateHTML() {
    const severityColor = {
      'NO_ISSUE': '#28a745',
      'INVESTIGATE': '#ffc107',
      'FIX_REQUIRED': '#dc3545',
    };

    const severityBgColor = {
      'NO_ISSUE': '#e8f5e9',
      'INVESTIGATE': '#fff3cd',
      'FIX_REQUIRED': '#f8d7da',
    };

    const color = severityColor[this.severity] || '#ffc107';
    const bgColor = severityBgColor[this.severity] || '#fff9e6';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.generateSubject()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    
    .container {
      max-width: 800px;
      margin: 20px auto;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .header {
      background-color: ${color};
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.95;
    }
    
    .alert-banner {
      background-color: ${bgColor};
      border-left: 5px solid ${color};
      padding: 20px;
      margin: 20px;
    }
    
    .alert-banner h2 {
      color: ${color};
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    .alert-banner p {
      font-size: 14px;
      color: #555;
    }
    
    .content {
      padding: 20px;
    }
    
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    
    .metric-row:last-child {
      border-bottom: none;
    }
    
    .metric-label {
      font-weight: 600;
      color: #666;
    }
    
    .metric-value {
      color: #333;
      font-family: 'Monaco', 'Courier New', monospace;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    
    table th {
      background-color: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
      padding: 12px;
      text-align: left;
      font-weight: 700;
      color: #495057;
    }
    
    table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }
    
    table tr:hover {
      background-color: #f8f9fa;
    }
    
    .severity-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
    }
    
    .severity-no-issue {
      background-color: #e8f5e9;
      color: #28a745;
    }
    
    .severity-investigate {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .severity-fix-required {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .action-section {
      background-color: #f0f7ff;
      border-left: 4px solid #0066cc;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .action-section h3 {
      color: #0066cc;
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    .action-section p {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
    }
    
    .action-section ul {
      margin-left: 20px;
      font-size: 14px;
      color: #555;
    }
    
    .action-section li {
      margin-bottom: 6px;
    }
    
    .button {
      display: inline-block;
      background-color: #0066cc;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin-top: 10px;
      transition: background-color 0.2s;
    }
    
    .button:hover {
      background-color: #0052a3;
    }
    
    .footer {
      background-color: #f8f9fa;
      border-top: 1px solid #dee2e6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
    
    .footer a {
      color: #0066cc;
      text-decoration: none;
    }
    
    .regression-list {
      background-color: #fff;
    }
    
    .regression-item {
      padding: 15px;
      border-left: 4px solid ${color};
      margin-bottom: 10px;
      background-color: #fafafa;
      border-radius: 4px;
    }
    
    .regression-item:last-child {
      margin-bottom: 0;
    }
    
    .regression-app {
      font-weight: 700;
      color: #333;
      font-size: 15px;
      margin-bottom: 8px;
    }
    
    .regression-metrics {
      font-size: 13px;
      color: #666;
    }
    
    .metric-box {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 6px;
    }
    
    .metric-box-label {
      color: #999;
      font-size: 11px;
      text-transform: uppercase;
    }
    
    .metric-box-value {
      font-weight: 700;
      font-family: 'Monaco', 'Courier New', monospace;
      color: #333;
    }
    
    .metric-box-percent {
      color: ${color};
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${this.getSeverityEmoji(this.severity)} Regression Alert</h1>
      <p>Build #${this.buildNumber} · ${this.timestamp.toLocaleString()}</p>
    </div>
    
    <!-- Alert Banner -->
    <div class="alert-banner">
      <h2>${this.getAlertTitle()}</h2>
      <p>${this.getAlertMessage()}</p>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <!-- Summary Metrics -->
      <h2 style="margin-bottom: 15px; color: #333;">Build Summary</h2>
      <div class="metric-row">
        <span class="metric-label">Total Regressions Detected:</span>
        <span class="metric-value">${this.regressions.length}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Severity Level:</span>
        <span class="metric-value">${this.severity}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Build Number:</span>
        <span class="metric-value">#${this.buildNumber}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Generated:</span>
        <span class="metric-value">${this.timestamp.toISOString()}</span>
      </div>
      
      <!-- Regression Details -->
      <h2 style="margin-top: 30px; margin-bottom: 15px; color: #333;">Regression Details</h2>
      ${this.generateRegressionTable()}
      
      <!-- Action Section -->
      ${this.generateActionSection()}
      
      <!-- Button -->
      <div style="text-align: center; margin-top: 20px;">
        <a href="${this.dashboardUrl}?tab=regressions&build=${this.buildNumber}" class="button">
          📊 View Full Dashboard
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        This is an automated alert from the <strong>Regression Detection System</strong>
      </p>
      <p style="margin-top: 8px;">
        <a href="${this.dashboardUrl}">View Dashboard</a> · 
        <a href="https://github.com/your-org/your-repo">Repository</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate regression details table
   */
  generateRegressionTable() {
    if (!this.regressions || this.regressions.length === 0) {
      return '<p style="color: #999;">No regressions detected.</p>';
    }

    return `
<table>
  <thead>
    <tr>
      <th>App</th>
      <th>Difficulty</th>
      <th>Baseline</th>
      <th>Current</th>
      <th>Regression</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    ${this.regressions.map(reg => `
    <tr>
      <td><strong>${reg.app}</strong></td>
      <td>${reg.difficulty}</td>
      <td><code>${reg.baselineMs.toFixed(2)}ms</code></td>
      <td><code>${reg.currentMs.toFixed(2)}ms</code></td>
      <td><strong style="color: #dc3545;">${reg.regressionPercent.toFixed(1)}%</strong></td>
      <td>
        <span class="severity-badge severity-${this.getSeverityClass(reg.severity)}">
          ${reg.severity}
        </span>
      </td>
    </tr>
    `).join('')}
  </tbody>
</table>
    `;
  }

  /**
   * Generate action section based on severity
   */
  generateActionSection() {
    if (this.severity === 'NO_ISSUE') {
      return '';
    }

    if (this.severity === 'FIX_REQUIRED') {
      return `
<div class="action-section">
  <h3>🔴 CRITICAL ACTION REQUIRED</h3>
  <p>
    Performance regressions exceeding <strong>10%</strong> have been detected.
    Immediate investigation and remediation is required.
  </p>
  <h4 style="color: #0066cc; margin-top: 15px; font-size: 14px;">Recommended Actions:</h4>
  <ul>
    <li>Review recent WASM build changes (see dashboard for details)</li>
    <li>Check for new optimizations that might have regressed</li>
    <li>Run performance profiling on affected AI modules</li>
    <li>Roll back problematic commits if necessary</li>
    <li>File a high-priority bug for investigation</li>
  </ul>
</div>
      `;
    }

    if (this.severity === 'INVESTIGATE') {
      return `
<div class="action-section">
  <h3>⚠️ INVESTIGATION NEEDED</h3>
  <p>
    Performance regressions between <strong>5-10%</strong> have been detected.
    Monitor and plan remediation accordingly.
  </p>
  <h4 style="color: #0066cc; margin-top: 15px; font-size: 14px;">Recommended Actions:</h4>
  <ul>
    <li>Review recent changes to affected AI modules</li>
    <li>Schedule follow-up investigation</li>
    <li>Monitor in next build cycle</li>
    <li>Consider performance optimization task</li>
  </ul>
</div>
      `;
    }

    return '';
  }

  /**
   * Helper: Get severity emoji
   */
  getSeverityEmoji(severity) {
    const emojis = {
      'NO_ISSUE': '✅',
      'INVESTIGATE': '⚠️',
      'FIX_REQUIRED': '🔴',
    };
    return emojis[severity] || '📊';
  }

  /**
   * Helper: Get alert title
   */
  getAlertTitle() {
    const titles = {
      'NO_ISSUE': 'No Regressions Detected ✅',
      'INVESTIGATE': 'Performance Regression Detected (5-10%) ⚠️',
      'FIX_REQUIRED': 'Critical Regression Detected (>10%) 🔴',
    };
    return titles[this.severity] || 'Performance Alert';
  }

  /**
   * Helper: Get alert message
   */
  getAlertMessage() {
    const messages = {
      'NO_ISSUE': 'Performance is within acceptable thresholds. All regressions are below 5%.',
      'INVESTIGATE': `${this.regressions.length} regression(s) detected between 5-10%. Monitor and plan remediation.`,
      'FIX_REQUIRED': `${this.regressions.length} regression(s) detected exceeding 10%. Immediate action required.`,
    };
    return messages[this.severity] || 'Performance alert generated.';
  }

  /**
   * Helper: Get CSS class for severity badge
   */
  getSeverityClass(severity) {
    return severity.toLowerCase().replace(/_/g, '-');
  }
}

/**
 * Export factory for quick usage
 */
export function createRegressionEmail(regressions, severity, buildNumber, timestamp) {
  return new RegressionEmailTemplate(regressions, severity, buildNumber, timestamp);
}
