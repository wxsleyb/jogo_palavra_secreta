import React from 'react'
import './GameOver.css'

const GameOver = ({retryGame, score, pickedWord}) => {
  return (
    <div>
      <h1>Fim de Jogo!</h1>
      <h2>A palavra era: {pickedWord}</h2>
      <h2>A sua pontuação foi: <span>{score}</span></h2>
      <button onClick={retryGame}>Reiniciar jogo</button>
    </div>
  )
}

export default GameOver
