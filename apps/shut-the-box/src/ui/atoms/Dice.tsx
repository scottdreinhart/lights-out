import styles from './Dice.module.css'

interface DiceProps {
  dice1?: number
  dice2?: number | null
  sum?: number
  isRolling?: boolean
}

export function Dice({ dice1, dice2, sum, isRolling = false }: DiceProps) {
  const showDice = dice1 !== undefined
  const isSingleDie = dice2 === null || dice2 === undefined

  return (
    <div className={`${styles.diceContainer} ${isRolling ? styles.rolling : ''}`}>
      {showDice ? (
        <>
          <div className={styles.die}>{dice1}</div>
          {!isSingleDie && (
            <>
              <div className={styles.plus}>+</div>
              <div className={styles.die}>{dice2}</div>
              <div className={styles.equals}>=</div>
            </>
          )}
          <div className={styles.sum}>{sum ?? dice1 + (dice2 ?? 0)}</div>
        </>
      ) : (
        <div className={styles.placeholder}>Roll dice to start</div>
      )}
    </div>
  )
}
