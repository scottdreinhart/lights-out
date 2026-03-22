import { useGameContext } from '@/app'
import type { Tile } from '@/domain'
import { Button, Dice } from '@/ui/atoms'
import { ScoreBoard, TileGrid } from '@/ui/molecules'
import { useState } from 'react'
import styles from './GamePlayBoard.module.css'

export function GamePlayBoard() {
  const { state, rollDice, selectTile, deselectTile, submitMove, endTurn, canUseOneDie } =
    useGameContext()
  const [isRolling, setIsRolling] = useState(false)
  const [diceValues, setDiceValues] = useState<{
    dice1: number
    dice2: number | null
  } | null>(null)

  const handleRoll = (useOneDie: boolean) => {
    setIsRolling(true)
    setTimeout(() => {
      const result = rollDice(useOneDie)
      setDiceValues(result)
      setIsRolling(false)
    }, 600)
  }

  const handleSelectTile = (tile: Tile) => {
    if (state.board.selectedTiles.includes(tile)) {
      deselectTile(tile)
    } else {
      selectTile(tile)
    }
  }

  const handleSubmitMove = () => {
    if (submitMove()) {
      setDiceValues(null)
    }
  }

  const handleEndTurn = () => {
    setDiceValues(null)
    endTurn()
  }

  const currentPlayer = state.players[state.currentPlayerIndex]
  const canSubmitMove =
    state.board.selectedTiles.length > 0 &&
    state.board.selectedTiles.reduce((sum, tile) => sum + tile, 0) === state.board.diceSum &&
    state.gamePhase === 'choosing'
  const showOneDieOption = canUseOneDie()

  return (
    <div className={styles.gameBoard}>
      <ScoreBoard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />

      <div className={styles.playingSurface}>
        <div className={styles.tileBridge}>
          <TileGrid
            tiles={state.board.tiles}
            selectedTiles={state.board.selectedTiles}
            onTileClick={handleSelectTile}
          />
        </div>

        <div className={styles.currentPlayer}>
          <span>{currentPlayer.name}&rsquo;s Turn</span>
        </div>

        <Dice
          dice1={diceValues?.dice1}
          dice2={diceValues?.dice2}
          sum={state.board.diceSum}
          isRolling={isRolling}
        />

        {state.gamePhase === 'rolling' && (
          <div className={styles.actions}>
            {showOneDieOption ? (
              <>
                <Button onClick={() => handleRoll(true)} disabled={isRolling} variant="primary">
                  {isRolling ? 'Rolling...' : 'Roll 1 Die'}
                </Button>
                <Button onClick={() => handleRoll(false)} disabled={isRolling} variant="secondary">
                  {isRolling ? 'Rolling...' : 'Roll 2 Dice'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleRoll(false)}
                disabled={isRolling}
                variant="primary"
                fullWidth
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
            )}
          </div>
        )}

        {state.gamePhase === 'choosing' && (
          <>
            <div className={styles.instruction}>
              Select tiles that sum to <strong>{state.board.diceSum}</strong>
            </div>

            <div className={styles.actions}>
              <Button onClick={handleSubmitMove} disabled={!canSubmitMove} variant="success">
                Submit Move
              </Button>
              <Button onClick={handleEndTurn} variant="secondary">
                End Turn
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
