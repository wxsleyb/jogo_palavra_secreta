import { useState, useEffect } from "react";
import "../components/StartScreen.css";

const StartScreen = ({ startGame, showCongratulations, score }) => {
  const [difficulty, setDifficulty] = useState("medium");
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false); // Estado para controlar se o jogo já foi jogado pelo menos uma vez

  const handleChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleStartGame = () => {
    startGame(difficulty);
    setHasPlayedOnce(true); // Define que o jogo foi jogado pelo menos uma vez ao iniciar o jogo
  };

  useEffect(() => {
    // Reinicia o estado de showCongratulations quando o componente é montado novamente
    if (hasPlayedOnce) {
      setHasPlayedOnce(true);
    }
  }, [hasPlayedOnce]);


  return (
    <div>
      <h1>Jogo Palavra Secreta</h1>
      <label>
        Escolha a dificuldade:
        <select value={difficulty} onChange={handleChange}>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
          <option value="very_hard">Muito Difícil</option>
        </select>
      </label>
      <button onClick={handleStartGame}>Iniciar o Jogo</button>
      {score == 150 && (
        <p style={{ color: "yellow", marginTop: "10px" }}>
          Sua pontuação inicial/atual: {score}
        </p>
      )}
      {score != 150 && (
        <p style={{ color: "yellow", marginTop: "10px" }}>
          Sua pontuação atual: {score}
        </p>
      )}

      {score > 150 || score < 150 && score != 0 && (
        <p style={{ color: "green", marginTop: "10px" }}>
          Parabéns, você acertou!
        </p>
      )}

    </div>
  );
};

export default StartScreen;
