import { SudokuGame } from '@/ui/organisms'
import React from 'react'
import styles from '../../styles.module.css'

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <SudokuGame />
    </div>
  )
}

export default App