import React, { useState, useEffect } from 'react';
import './GaneshaSays.css';

const GaneshaSays = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [isGaneshaSaying, setIsGaneshaSaying] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState({});
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  
  // Shloka lines with associated actions
  const shlokaPrompts = [
    { 
      line: "Vakratunda Mahakaya", 
      action: "Touch your head", 
      image: "head-touch.png" 
    },
    { 
      line: "Suryakoti Samaprabha", 
      action: "Raise hands up like the sun", 
      image: "hands-up.png" 
    },
    { 
      line: "Nirvighnam Kuru Me Deva", 
      action: "Fold hands in prayer", 
      image: "prayer-hands.png" 
    },
    { 
      line: "Sarva Karyeshu Sarvada", 
      action: "Stomp your feet", 
      image: "stomp-feet.png" 
    },
    { 
      line: "Gajananam Bhoota", 
      action: "Make an elephant trunk with your arm", 
      image: "elephant-trunk.png" 
    },
    { 
      line: "Ganadevamaharnitam", 
      action: "Spin around once", 
      image: "spin-around.png" 
    }
  ];

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentRound(0);
    setGameOver(false);
    nextRound();
  };

  // Move to next round
  const nextRound = () => {
    setCurrentRound(prevRound => prevRound + 1);
    
    // Randomly decide if Ganesha says or not (70% chance of Ganesha saying)
    const ganeshaSays = Math.random() < 0.7;
    setIsGaneshaSaying(ganeshaSays);
    
    // Pick a random prompt
    const randomPrompt = shlokaPrompts[Math.floor(Math.random() * shlokaPrompts.length)];
    setCurrentPrompt(randomPrompt);
    
    // Clear previous feedback
    setFeedback('');
  };

  // Handle player's response
  const handleResponse = (shouldPerform) => {
    // The player should perform the action if and only if "Ganesha says"
    const correctResponse = shouldPerform === isGaneshaSaying;
    
    if (correctResponse) {
      setFeedback('Correct! 🎉');
      setScore(prevScore => prevScore + 1);
      
      // Advance to next round after a delay
      setTimeout(() => {
        if (currentRound < 10) {
          nextRound();
        } else {
          // End game after 10 rounds
          setGameOver(true);
        }
      }, 1500);
    } else {
      setFeedback('Oops! Game over. 😔');
      setGameOver(true);
    }
  };

  // Restart game
  const restartGame = () => {
    startGame();
  };

  return (
    <div className="ganesha-says-container">
      <h1>Ganesha Says</h1>
      
      {!gameStarted && !gameOver ? (
        <div className="start-screen">
          <p>Learn the Ganesha shloka while playing this fun game!</p>
          <p>When "Ganesha says" perform the action, otherwise don't!</p>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <p>Your score: {score} out of 10</p>
          {score === 10 && <p>Perfect score! You're a Ganesha Says master!</p>}
          <button className="restart-button" onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div className="game-screen">
          <div className="score-display">Round: {currentRound}/10 | Score: {score}</div>
          
          <div className="prompt-container">
            <h2>
              {isGaneshaSaying ? "Ganesha says:" : ""}
            </h2>
            <p className="shloka-line">{currentPrompt.line}</p>
            <p className="action-prompt">{currentPrompt.action}</p>
            
            {/* Placeholder for action image */}
            <div className="action-image">
              {/* Replace with actual images */}
              {currentPrompt.image && <p>Image: {currentPrompt.image}</p>}
            </div>
          </div>
          
          <div className="response-buttons">
            <button 
              className="perform-button" 
              onClick={() => handleResponse(true)}
            >
              Perform Action
            </button>
            <button 
              className="skip-button" 
              onClick={() => handleResponse(false)}
            >
              Skip Action
            </button>
          </div>
          
          {feedback && <div className="feedback">{feedback}</div>}
        </div>
      )}
    </div>
  );
};

export default GaneshaSays;