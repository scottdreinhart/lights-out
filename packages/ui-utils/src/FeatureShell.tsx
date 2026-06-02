import React from 'react'
import styles from './FeatureShell.module.css'

/**
 * Props for FeatureShell component
 */
export interface FeatureShellProps {
  /** Title displayed in the app header */
  title: string
  /** Main content to render */
  children: React.ReactNode
  /** Optional header component (e.g., AppHeader) */
  header?: React.ReactNode
  /** Optional modals/dialogs to render (e.g., RulesModal, SettingsModal, AboutModal) */
  modals?: React.ReactNode
}

/**
 * FeatureShell — Standardized app layout wrapper
 *
 * Provides consistent theming, layout structure, and styling across game apps.
 * Handles header area, content area, and modal rendering.
 *
 * @example
 * ```tsx
 * <FeatureShell
 *   title="Bingo"
 *   header={<AppHeader title="Bingo" onOpenRules={...} />}
 *   modals={
 *     <>
 *       <RulesModal isOpen={showRules} onClose={...} />
 *       <SettingsModal isOpen={showSettings} onClose={...} />
 *     </>
 *   }
 * >
 *   <BingoBoard />
 * </FeatureShell>
 * ```
 */
export function FeatureShell({ children, header, modals }: FeatureShellProps) {
  return (
    <div className={styles.shell} data-theme="platform-default">
      {header || null}

      <main className={styles.content}>{children}</main>

      {modals || null}
    </div>
  )
}

export default FeatureShell
