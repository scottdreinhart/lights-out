import { useOnlineStatus } from '@games/app-hook-utils'

import styles from './OfflineIndicator.module.css'

/**
 * OfflineIndicator — Shows banner when browser is offline
 * Uses useOnlineStatus hook to detect connection status
 */
export function OfflineIndicator() {
  const online = useOnlineStatus()
  if (online) {
    return null
  }
  return <div className={styles.banner}>You are offline — game continues locally</div>
}

export default OfflineIndicator
