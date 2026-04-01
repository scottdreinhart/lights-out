import React from 'react'
import { SudokuGame } from '@/ui/organisms'
import styles from './styles.module.css'

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <SudokuGame />
    </div>
  )
}

export default App
