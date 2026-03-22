import './Score.css'

interface ScoreProps {
  playerScore: number
  cpuScore: number
  bestOf: number
}

export function Score({ playerScore, cpuScore, bestOf }: ScoreProps) {
  const winsNeeded = Math.floor(bestOf / 2) + 1

  return (
    <div className="score-board">
      <div className="score-item player">
        <h3>👤</h3>
        <div className="score-value">{playerScore}</div>
        <p className="score-needed">Need {winsNeeded}</p>
      </div>
      <div className="score-divider">of {bestOf}</div>
      <div className="score-item cpu">
        <h3>🤖</h3>
        <div className="score-value">{cpuScore}</div>
        <p className="score-needed">Need {winsNeeded}</p>
      </div>
    </div>
  )
}
