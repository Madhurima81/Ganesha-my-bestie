import React, { useState, useEffect, useRef } from 'react';
import './ShlokaJump.css';

const ShlokaJump = () => {
  // Game states
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [wordOptions, setWordOptions] = useState([]);
  const [score, setScore] = useState(0);
  const gameRef = useRef(null);
  const ganeshaRef = useRef(null);
  
  // Shloka parts in order
  const shlokaWords = [
    "Vakratunda",
    "Mahakaya",
    "Suryakoti",
    "Samaprabha",
    "Nirvighnam",
    "Kuru",
    "Me",
    "Deva",
    "Sarva",
    "Karyeshu",
    "Sarvada"
  ];
  
  // Define the obstacle types
  const obstacleTypes = [
    { name: "Rock", emoji: "🪨" },
    { name: "Fire", emoji: "🔥" },
    { name: "Water", emoji: "💧" },
    { name: "Mountain", emoji: "🏔️" },
    { name: "Tree", emoji: "🌲" },
    { name: "Puzzle", emoji: "🧩" },
    { name: "Lock", emoji: "🔒" },
    { name: "Maze", emoji: "🌀" },
    { name: "Storm", emoji: "⚡" },
    { name: "Wall", emoji: "🧱" },
    { name: "Trap", emoji: "⚠️" }
  ];

  // Start the game
  const startGame = () => {
    // Reset all game state
    setCurrentLevel(0);
    setScore(0);
    setIsJumping(false);
    setGameCompleted(false);
    
    // Set game active last (this will trigger the useEffect)
    setGameActive(true);
  };

  // Generate word options for the current level
  const generateWordOptions = (level) => {
    if (level >= shlokaWords.length) {
      console.error("Attempted to generate options for invalid level:", level);
      return;
    }
    
    const correctWord = shlokaWords[level];
    console.log(`Generating options for level ${level}, correct word: ${correctWord}`);
    
    // Get 3 random incorrect words that are different from the correct one
    let incorrectOptions = [];
    
    // Make a copy of all words except the correct one
    const allOtherWords = shlokaWords.filter(word => word !== correctWord);
    
    // Shuffle and pick 3
    const shuffled = [...allOtherWords].sort(() => 0.5 - Math.random());
    incorrectOptions = shuffled.slice(0, 3);
    
    // Combine correct and incorrect options and shuffle
    const options = [correctWord, ...incorrectOptions];
    const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
    
    setWordOptions(shuffledOptions);
  };

  // Handle word selection
  const handleWordSelect = (word) => {
    if (!gameActive || isJumping) return;
    
    const correctWord = shlokaWords[currentLevel];
    console.log(`Selected: ${word}, Correct: ${correctWord}, Level: ${currentLevel}`);
    
    if (word === correctWord) {
      // Correct word selected
      setIsJumping(true);
      setScore(prevScore => prevScore + 100);
      
      // Jump animation
      if (ganeshaRef.current) {
        ganeshaRef.current.classList.add('jump');
        
        setTimeout(() => {
          if (ganeshaRef.current) {
            ganeshaRef.current.classList.remove('jump');
          }
          setIsJumping(false);
          
          // Move to next level or end game
          const nextLevel = currentLevel + 1;
          if (nextLevel < shlokaWords.length) {
            setCurrentLevel(nextLevel);
            // Use the next level index for generating options
            generateWordOptions(nextLevel);
          } else {
            // Game completed
            setGameCompleted(true);
            setGameActive(false);
          }
        }, 1000); // Match jump animation duration
      }
    } else {
      // Incorrect word selected
      setScore(prevScore => Math.max(0, prevScore - 20)); // Deduct points, minimum 0
      
      // Shake effect for wrong answer
      if (gameRef.current) {
        gameRef.current.classList.add('shake');
        setTimeout(() => {
          if (gameRef.current) {
            gameRef.current.classList.remove('shake');
          }
        }, 500);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameCompleted(false);
    setCurrentLevel(0);
    setScore(0);
  };

  // Render the introduction screen
  const renderIntroduction = () => (
    <div className="shloka-jump-intro">
      <h2>Shloka Jump – Help Ganesha Remove Obstacles!</h2>
      <div className="intro-content">
        <p>
          Help Lord Ganesha jump over obstacles by chanting the correct words of the shloka.
        </p>
        <p>
          Tap the correct next word of the shloka to make Ganesha jump over each obstacle!
        </p>
        <div className="intro-ganesha">🙏 🐘 🙏</div>
        <button className="start-game-btn" onClick={startGame}>Start Game</button>
      </div>
    </div>
  );

  // Render the game screen
  const renderGame = () => (
    <div className="shloka-jump-game" ref={gameRef}>
      <div className="game-info">
        <div className="level-info">
          Obstacle: {currentLevel + 1}/{shlokaWords.length}
        </div>
        <div className="score-info">
          Score: {score}
        </div>
      </div>
      
      <div className="game-path">
        {/* Progress bar showing completed obstacles */}
        <div 
          className="progress-bar" 
          style={{ width: `${(currentLevel / shlokaWords.length) * 100}%` }}
        ></div>
        
        {/* Ganesha character */}
        <div 
          className="ganesha-character" 
          ref={ganeshaRef}
          style={{ left: `${Math.min(85, (currentLevel / shlokaWords.length) * 85)}%` }}
        >
          🐘
        </div>
        
        {/* Current obstacle */}
        <div className="obstacle" style={{ 
          left: `${Math.min(90, ((currentLevel + 1) / shlokaWords.length) * 85)}%` 
        }}>
          {obstacleTypes[currentLevel % obstacleTypes.length].emoji}
        </div>
        
        {/* Debug info - only visible during development */}
        <div className="debug-info" style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '10px', color: '#999', display: 'none' }}>
          Level: {currentLevel}, Correct: {shlokaWords[currentLevel]}
        </div>
      </div>
      
      <div className="shloka-display">
        <h3>Select the next word of the shloka:</h3>
        <div className="current-word-status">
          Current word to find: <strong>{shlokaWords[currentLevel]}</strong>
        </div>
        <div className="word-options">
          {wordOptions.map((word, index) => (
            <button 
              key={index}
              className={`word-option ${word === shlokaWords[currentLevel] ? 'correct-option' : ''}`}
              onClick={() => handleWordSelect(word)}
              disabled={isJumping}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      
      <div className="shloka-progress">
        <div className="shloka-words">
          {shlokaWords.map((word, index) => (
            <span 
              key={index} 
              className={`shloka-word ${index < currentLevel ? 'completed' : ''} ${index === currentLevel ? 'current' : ''}`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <button className="reset-game-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );

  // Render the completion screen
  const renderCompletion = () => (
    <div className="shloka-jump-completion">
      <h2>Congratulations!</h2>
      <div className="completion-content">
        <div className="winning-ganesha">🐘✨</div>
        <p className="completion-message">
          You helped Ganesha overcome all obstacles!
        </p>
        <p className="completion-score">
          Your Score: {score}
        </p>
        <div className="completion-lesson">
          <h3>Remember:</h3>
          <p>
            "Chanting Ganesha's shloka helps us remove obstacles in life too!"
          </p>
        </div>
        <div className="full-shloka">
          <h3>The Complete Shloka:</h3>
          <p>
            Vakratunda Mahakaya Suryakoti Samaprabha<br />
            Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada
          </p>
        </div>
        <p className="shloka-meaning">
          "O Lord with the curved trunk and a mighty body, who shines like a million suns,<br />
          Please remove all obstacles from my endeavors, always."
        </p>
        <button className="play-again-btn" onClick={startGame}>
          Play Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="shloka-jump-container">
      {!gameActive && !gameCompleted && renderIntroduction()}
      {gameActive && renderGame()}
      {gameCompleted && renderCompletion()}
    </div>
  );
};

export default ShlokaJump;