import { useState, useEffect, useCallback } from "react";
import "./App.css";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const difficultyLevels = {
  easy: 10,
  medium: 5,
  hard: 3,
  very_hard: 1,
};

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(difficultyLevels.medium);
  const [score, setScore] = useState(null);

  const [difficulty, setDifficulty] = useState("medium");
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasWonOnce, setHasWonOnce] = useState(false); 

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    return { word, category };
  }, [words]);

  const normalizeLetter = (letter) => {
    return letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGuesses(difficultyLevels[selectedDifficulty]);

    clearLetterStates();

    const { category, word } = pickWordAndCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);

    if (score === null) {
      setScore(0);
    }
    
  };

  // Verifica a letra inputada pelo usuário
  const verifyLetter = (letter) => {
    const normalizedLetter = letter
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // checar se a letra já foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    if (letters.map(l => l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()).includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters.map(l => normalizeLetter(l)))];
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 50));
      setShowCongratulations(true);
      if (!hasWonOnce) {
        setShowCongratulations(true);
        setHasWonOnce(true);
      }
      setGameStage(stages[0].name); // Return to start screen
    }
  }, [guessedLetters, letters, hasWonOnce]);

  const retryGame = () => {
    setScore(0);
    setGuesses(difficultyLevels[difficulty]);
    setShowCongratulations(false);
    setGameStage(stages[0].name);
    setHasWonOnce(false)
  };

  return (
    <div className="App">
      {gameStage === "start" && (
        <StartScreen
          startGame={startGame}
          showCongratulations={showCongratulations}
          score={score}
        />
      )}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && (
        <GameOver retryGame={retryGame} score={score} pickedWord={pickedWord} />
      )}
    </div>
  );
}

export default App;
