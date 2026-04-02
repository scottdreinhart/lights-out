/**
 * Regression Dashboard Component
 *
 * Phase 2 Week 3: Dashboard Alerts & Visualization
 *
 * Handles:
 * - Regression alert banner (high visibility, dismissable)
 * - Regression details list with severity indicators
 * - Historical trend charts
 * - Regression log viewer
 * - Alert acknowledgment and justification tracking
 */

class RegressionDashboard {
  constructor() {
    this.alertsFile = './regression-alerts.json'
    this.dismissedAlerts = new Set(this.loadDismissedAlerts())
  }

  /**
   * Load regression alerts from JSON file
   */
  async loadAlerts() {
    try {
      const response = await fetch(this.alertsFile)
      if (!response.ok) throw new Error('Failed to load alerts')
      return await response.json()
    } catch (error) {
      console.warn('Could not load regression alerts:', error)
      return { alerts: [] }
    }
  }

  /**
   * Get dismissed alerts from localStorage
   */
  loadDismissedAlerts() {
    const stored = localStorage.getItem('dismissedAlerts')
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Save dismissed alerts to localStorage
   */
  saveDismissedAlerts() {
    localStorage.setItem('dismissedAlerts', JSON.stringify(Array.from(this.dismissedAlerts)))
  }

  /**
   * Dismiss an alert (persisted to localStorage)
   */
  dismissAlert(alertIndex) {
    this.dismissedAlerts.add(alertIndex)
    this.saveDismissedAlerts()
    this.refresh()
  }

  /**
   * Get active regressions (from latest non-dismissed alert)
   */
  getActiveRegressions(alerts) {
    if (!alerts.length) return []

    // Find latest non-dismissed alert with regressions
    for (let i = alerts.length - 1; i >= 0; i--) {
      if (!this.dismissedAlerts.has(i) && alerts[i].regressions?.length > 0) {
        return alerts[i].regressions
      }
    }
    return []
  }

  /**
   * Get severity for CSS styling
   */
  getSeverityClass(severity) {
    switch (severity) {
      case 'NO_ISSUE':
        return 'severity-ok'
      case 'INVESTIGATE':
        return 'severity-investigate'
      case 'FIX_REQUIRED':
        return 'severity-critical'
      default:
        return 'severity-unknown'
    }
  }

  /**
   * Get severity emoji
   */
  getSeverityEmoji(severity) {
    switch (severity) {
      case 'NO_ISSUE':
        return '✅'
      case 'INVESTIGATE':
        return '⚠️'
      case 'FIX_REQUIRED':
        return '❌'
      default:
        return '❓'
    }
  }

  /**
   * Format time for display
   */
  formatTime(isoString) {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  /**
   * Render regression alert banner (top of page)
   */
  renderAlertBanner(container, regressions) {
    if (!regressions || regressions.length === 0) {
      container.innerHTML = ''
      return
    }

    const hasCritical = regressions.some((r) => r.severity === 'FIX_REQUIRED')
    const severityClass = hasCritical ? 'alert-critical' : 'alert-warning'

    const html = `
      <div class="regression-alert-banner ${severityClass}">
        <div class="alert-content">
          <div class="alert-header">
            <span class="alert-emoji">${hasCritical ? '❌' : '⚠️'}</span>
            <span class="alert-title">
              ${hasCritical ? 'CRITICAL REGRESSIONS DETECTED' : 'REGRESSIONS DETECTED'}
            </span>
            <button class="alert-dismiss" onclick="regressionDashboard.dismissAlert(0)">
              ✕ Dismiss
            </button>
          </div>
          <div class="alert-summary">
            ${regressions.length} regression${regressions.length > 1 ? 's' : ''} found
            ${hasCritical ? '(requires immediate attention)' : '(review recommended)'}
          </div>
          <div class="alert-apps">
            ${regressions
              .map(
                (r) =>
                  `<span class="alert-app-tag ${this.getSeverityClass(r.severity)}">
                  ${r.app}: ${Math.abs(r.regressionPercent).toFixed(1)}%
                </span>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    `

    container.innerHTML = html
  }

  /**
   * Render regression details table
   */
  renderRegressionDetails(container, regressions) {
    if (!regressions || regressions.length === 0) {
      container.innerHTML = '<p class="no-data">No regressions detected.</p>'
      return
    }

    // Sort by regression percent (descending)
    const sorted = [...regressions].sort((a, b) => b.regressionPercent - a.regressionPercent)

    const html = `
      <table class="regression-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>App</th>
            <th>Difficulty</th>
            <th>Baseline (ms)</th>
            <th>Current (ms)</th>
            <th>Regression</th>
            <th>Percent</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          ${sorted
            .map(
              (r) => `
            <tr class="${this.getSeverityClass(r.severity)}">
              <td class="severity-badge">${this.getSeverityEmoji(r.severity)}</td>
              <td class="app-name">${r.app}</td>
              <td>${r.difficulty}</td>
              <td class="metric">${r.baselineMs.toFixed(3)}</td>
              <td class="metric">${r.currentMs.toFixed(3)}</td>
              <td class="metric regression-ms">+${r.regressionMs.toFixed(3)}</td>
              <td class="metric regression-percent">+${r.regressionPercent.toFixed(2)}%</td>
              <td class="threshold">${r.threshold}%</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `

    container.innerHTML = html
  }

  /**
   * Render regression trend chart (simple text-based)
   */
  renderTrendChart(container, alerts) {
    if (!alerts || alerts.length === 0) {
      container.innerHTML = '<p class="no-data">No historical data.</p>'
      return
    }

    // Get last 10 alerts
    const recent = alerts.slice(-10)

    // Count regressions per alert
    const trendData = recent.map((alert, idx) => ({
      index: idx,
      date: alert.timestamp,
      total: alert.summary.totalApps,
      ok: alert.summary.ok,
      investigate: alert.summary.investigate,
      fixRequired: alert.summary.fixRequired,
    }))

    // Find max for scaling
    const maxIssues = Math.max(...trendData.map((d) => d.investigate + d.fixRequired), 1)

    const html = `
      <div class="trend-chart">
        <h3>Regression Trend (Last 10 Builds)</h3>
        <div class="trend-bars">
          ${trendData
            .map((d, idx) => {
              const issues = d.investigate + d.fixRequired
              const height = Math.max((issues / maxIssues) * 100, 5)
              const color =
                d.fixRequired > 0 ? '#dc3545' : d.investigate > 0 ? '#ffc107' : '#28a745'
              const date = new Date(d.date)
              const timeStr = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })

              return `
                <div class="trend-bar-wrapper">
                  <div class="trend-bar" style="height: ${height}%; background-color: ${color};"
                    title="Build ${idx + 1}: ${d.ok} OK, ${d.investigate} INVESTIGATE, ${d.fixRequired} FIX_REQUIRED">
                  </div>
                  <div class="trend-label">#${idx + 1}</div>
                  <div class="trend-time">${timeStr}</div>
                </div>
              `
            })
            .join('')}
        </div>
        <div class="trend-legend">
          <span class="legend-item">
            <span class="legend-color" style="background-color: #28a745;"></span>
            OK
          </span>
          <span class="legend-item">
            <span class="legend-color" style="background-color: #ffc107;"></span>
            INVESTIGATE
          </span>
          <span class="legend-item">
            <span class="legend-color" style="background-color: #dc3545;"></span>
            FIX_REQUIRED
          </span>
        </div>
      </div>
    `

    container.innerHTML = html
  }

  /**
   * Render regression log (all historical entries)
   */
  renderLogViewer(container, alerts) {
    if (!alerts || alerts.length === 0) {
      container.innerHTML = '<p class="no-data">No alert history.</p>'
      return
    }

    const html = `
      <div class="log-viewer">
        <h3>Regression Alert History</h3>
        <div class="log-entries">
          ${alerts
            .map(
              (alert, idx) => `
            <div class="log-entry">
              <div class="log-header">
                <span class="log-build">Build #${alert.buildNumber}</span>
                <span class="log-timestamp">${this.formatTime(alert.timestamp)}</span>
                <span class="log-baseline">v${alert.baselineVersion}</span>
              </div>
              <div class="log-summary">
                <span class="log-stat">Total: ${alert.summary.totalApps}</span>
                <span class="log-stat ok">✅ ${alert.summary.ok} OK</span>
                <span class="log-stat investigate">⚠️ ${alert.summary.investigate} INVESTIGATE</span>
                <span class="log-stat critical">❌ ${alert.summary.fixRequired} FIX_REQUIRED</span>
              </div>
              ${
                alert.regressions.length > 0
                  ? `
                <div class="log-regressions">
                  ${alert.regressions
                    .map(
                      (r) =>
                        `<span class="log-regression ${this.getSeverityClass(r.severity)}">
                      ${r.app}: +${r.regressionPercent.toFixed(1)}%
                    </span>`,
                    )
                    .join('')}
                </div>
              `
                  : ''
              }
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `

    container.innerHTML = html
  }

  /**
   * Refresh all regression UI components
   */
  async refresh() {
    const alertsData = await this.loadAlerts()
    const alerts = alertsData.alerts || []
    const activeRegressions = this.getActiveRegressions(alerts)

    // Update banner
    const bannerContainer = document.getElementById('regression-alert-banner')
    if (bannerContainer) {
      this.renderAlertBanner(bannerContainer, activeRegressions)
    }

    // Update details table
    const detailsContainer = document.getElementById('regression-details')
    if (detailsContainer) {
      this.renderRegressionDetails(detailsContainer, activeRegressions)
    }

    // Update trend chart
    const trendContainer = document.getElementById('regression-trend')
    if (trendContainer) {
      this.renderTrendChart(trendContainer, alerts)
    }

    // Update log viewer
    const logContainer = document.getElementById('regression-log')
    if (logContainer) {
      this.renderLogViewer(logContainer, alerts)
    }
  }

  /**
   * Initialize dashboard
   */
  async init() {
    // Initial render
    await this.refresh()

    // Auto-refresh every 30 seconds
    setInterval(() => this.refresh(), 30000)
  }
}

// Global instance
let regressionDashboard
