import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//CSS
import './App.css'

//React
import { useState, useEffect, useCallback } from 'react'

//data
import {wordsList} from "./data/words.jsx"

//components
import StartScreen from './components/StartScreen.jsx'
import Game from './components/Game.jsx'
import GameOver from './components/GameOver.jsx'

const stages = [
  { id: 1, name: "start"},
  { id: 2, name: "game"},
  { id: 3, name: "end"},
]

const guessesTry = 3

function App() {
  const[gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList)
  
  const[pickedWord, setPickedWord] = useState("");
  const[pickedCategory, setPickedCategory] = useState("")
  const[letters, setLetters] = useState([]) // colocar ([]) dps pra ver se tem diferença

  const[guessedLetters, setGuessedLetters] = useState([])
  const[wrongLetters, setWrongLetters] = useState([])
  const[guesses, setGuesses] = useState(guessesTry)
  const[score, setScore] = useState(50)
  


  const pickWordAndCategory = useCallback(() =>{

    //pegar uma categoria aleatoria
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random()*Object.keys(categories).length)]

    //pegar uma palavra aleatoria

    const word = words[category][Math.floor(Math.random()*words[category].length)]
    
    //usar chaves pra retornar objetos e não usar colchetes
    return{word, category}
  },[words])
  // começa o jogo 
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();

    // choose a word
    const { category, word } = pickWordAndCategory();

    console.log(category, word);

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // console.log(category, word);

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);
  //verifica o input da letra
  const verifyLetter = (letter) =>{
    const normalizedLetter = letter.toLowerCase()

    // checar se a letra ja foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }

    //
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) =>[
        // esse reticência pega todos os elementos do array
        ...actualGuessedLetters, normalizedLetter
      ]) 
    } else {
      setWrongLetters((actualWrongLetters)=>[
        ...actualWrongLetters, normalizedLetter,
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  
  }

  //reinicia as letras escolhidas, letras erradas
  //e astentativas
  const clearLetterStates = () =>{
    setGuessedLetters([]);
    setWrongLetters([])
    setGuesses(guessesTry)
  }

  //checa se as tentativas terminaram
  useEffect(()=>{
    if(guesses <= 0){
      // resetar todos os estados
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  //checar a condição de vitória

  useEffect(() =>{
    const uniqueLetters = [... new Set(letters)]

    //condição de vitória

    if(guessedLetters.length === uniqueLetters.length){
      //add score
      setScore((actualScore) => (actualScore += 100))

      //reiniciar o jogo com uma nova palavra
      startGame()
    }
    
  }, [guessedLetters, letters, startGame])
  //reinicia o jogo
  const retryGame = () =>{

    setScore(0)
    setGuesses(guessesTry)
    setGameStage(stages[0].name)
  }


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameStage === 'end' && <GameOver retryGame={retryGame} score={score} pickedWord={pickedWord}/>}

    </div>
  )
}

export default App
