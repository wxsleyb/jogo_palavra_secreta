import React, { useState, useRef } from 'react';
import './Game.css';

const Game = ({ verifyLetter, pickedWord, pickedCategory, letters, guessedLetters, wrongLetters, guesses, score }) => {
  const [letter, setLetter] = useState('');
  const letterInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    setLetter('');
    letterInputRef.current.focus();
  };

  // Função para normalizar as letras (remover acentos)
  const normalizeLetter = (l) => {
    return l.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Função para validar se a entrada é uma letra
  const isValidLetterInput = (input) => {
    return /^[a-zA-Z]+$/.test(input); // Apenas letras de A-Z (maiúsculas e minúsculas)
  };

  // Função para lidar com a mudança no input de letra
  const handleLetterChange = (e) => {
    const input = e.target.value;
    if (isValidLetterInput(input)) {
      setLetter(input.toUpperCase()); // Transforma a letra em maiúscula
    }
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativas(s).</p>
      <div className="wordContainer">
        {letters.map((letter, i) =>
          guessedLetters.includes(normalizeLetter(letter)) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength={1}
            required
            onChange={handleLetterChange}
            value={letter}
            ref={letterInputRef}
          />
          <button>Jogar</button>
        </form>
      </div>
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}, </span>
        ))}
      </div>
    </div>
  );
};

export default Game;
