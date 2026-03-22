import { useI18nContext } from '@/app'
import React, { ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, info: { componentStack: string }) => void
}

interface ErrorBoundaryState {
  error: Error | null
  retryCount: number
}

interface OrganismErrorFallbackProps {
  error: Error
  retryCount: number
  onRetry: () => void
}

function OrganismErrorFallback({ error, retryCount, onRetry }: OrganismErrorFallbackProps) {
  const { t } = useI18nContext()

  return (
    <div className={styles.errorContainer} role="alert">
      <h1>{t('error.title')}</h1>
      <p className={styles.message}>{error.message || t('error.unexpected')}</p>
      <details className={styles.details}>
        <summary>{t('error.details')}</summary>
        <pre>{error.stack || t('error.noStack')}</pre>
      </details>
      <button className={styles.retryButton} onClick={onRetry}>
        {t('error.retry')}
      </button>
      {retryCount > 0 && <p className={styles.retryInfo}>{t('error.attempt', { count: retryCount + 1 })}</p>}
    </div>
  )
}

/**
 * React Error Boundary component
 * Catches rendering errors from any component in the tree
 * Provides fallback UI and retry mechanism
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, retryCount: 0 }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to crash logger if provided
    if (this.props.onError) {
      this.props.onError(error, {
        componentStack: info.componentStack ?? '',
      })
    }
    // Also log to console for debugging
    console.error('ErrorBoundary caught:', error, info)
  }

  handleRetry = () => {
    this.setState((prev) => ({
      error: null,
      retryCount: prev.retryCount + 1,
    }))
  }

  render() {
    if (this.state.error) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      // Default fallback
      return (
        <OrganismErrorFallback
          error={this.state.error}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
