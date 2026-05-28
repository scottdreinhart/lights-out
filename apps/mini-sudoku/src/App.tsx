import { useMiniSudokuApp } from '@/app/index'
import { SudokuGame } from '@/ui/organisms'
import React from 'react'
import styles from './styles.module.css'

const App: React.FC = () => {
  const app = useMiniSudokuApp()

  return (
    <div className={styles.appContainer}>
      <SudokuGame app={app} />
    </div>
  )
}

export default App
