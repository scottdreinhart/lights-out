import { useI18nContext } from '@/app'
import { IonButtons, IonIcon, IonMenu, IonMenuButton, IonMenuToggle } from '@ionic/react'
import { chevronForwardSharp } from 'ionicons/icons'
import React from 'react'
import { createPortal } from 'react-dom'

import styles from './HamburgerMenu.module.css'

interface HamburgerMenuProps {
  children: React.ReactNode
  contentId?: string
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ children, contentId = 'nim-main-content' }) => {
  const { t } = useI18nContext()

  return (
    <>
      {createPortal(
        <IonMenu
          side="end"
          type="overlay"
          contentId={contentId}
          menuId="nim-right-menu"
          className={styles.menu}
          swipeGesture
        >
          <div className={styles.panelContent}>
            <div className={styles.closeRow}>
              <IonMenuToggle menu="nim-right-menu" autoHide={false}>
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label={t('menu.close')}
                  title={t('menu.close')}
                >
                  <IonIcon icon={chevronForwardSharp} aria-hidden="true" />
                </button>
              </IonMenuToggle>
            </div>

            {children}
          </div>
        </IonMenu>,
        document.body,
      )}

      <IonButtons>
        <IonMenuButton
          menu="nim-right-menu"
          autoHide={false}
          className={styles.menuButton}
          aria-label={t('menu.open')}
          title={t('menu.open')}
        />
      </IonButtons>
    </>
  )
}

export default HamburgerMenu
