import React, { useState, useEffect } from 'react';
import './ShlokaSecretCode.css';

const ShlokaSecretCode = () => {
  // Shloka parts with their corresponding symbols
  const shlokaCode = [
    { 
      id: 1, 
      text: "Vakratunda", 
      symbol: "🐘", 
      hint: "Lord Ganesha has a curved trunk" 
    },
    { 
      id: 2, 
      text: "Mahakaya", 
      symbol: "⭐", 
      hint: "His body is large and magnificent" 
    },
    { 
      id: 3, 
      text: "Suryakoti", 
      symbol: "☀️", 
      hint: "Bright as millions of suns" 
    },
    { 
      id: 4, 
      text: "Samaprabha", 
      symbol: "✨", 
      hint: "Shines with divine light" 
    },
    { 
      id: 5, 
      text: "Nirvighnam", 
      symbol: "🛡️", 
      hint: "Removes obstacles from our path" 
    },
    { 
      id: 6, 
      text: "Kuru Me Deva", 
      symbol: "🙏", 
      hint: "We pray to you, O Lord" 
    },
    { 
      id: 7, 
      text: "Sarva Karyeshu", 
      symbol: "🌟", 
      hint: "In all our undertakings" 
    },
    { 
      id: 8, 
      text: "Sarvada", 
      symbol: "🕰️", 
      hint: "Always and forever" 
    }
  ];

  // State variables
  const [userSequence, setUserSequence] = useState([]);
  const [gameState, setGameState] = useState('introduction'); // introduction, playing, success
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [shakeDoor, setShakeDoor] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [revealContent, setRevealContent] = useState(false);
  const [treasureType, setTreasureType] = useState('garden'); // garden, treasure, guru

  // Setup the game when starting
  useEffect(() => {
    if (gameState === 'playing') {
      // Create available symbols array with correct and decoy symbols
      const decoySymbols = ['🔮', '🎭', '🧿', '🎪', '🎨', '🎯', '🧩', '🎲'];
      
      // Combine and shuffle symbols
      const allSymbols = [...shlokaCode.map(item => ({ ...item, isDecoy: false }))];
      const decoys = decoySymbols.map((symbol, index) => ({
        id: shlokaCode.length + index + 1,
        symbol,
        isDecoy: true,
        text: "Decoy"
      }));
      
      // Add some decoys but not too many
      const numberToAdd = Math.min(4, shlokaCode.length - 2);
      const selectedDecoys = decoys.slice(0, numberToAdd);
      
      const combinedSymbols = [...allSymbols, ...selectedDecoys];
      
      // Fisher-Yates shuffle
      for (let i = combinedSymbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedSymbols[i], combinedSymbols[j]] = [combinedSymbols[j], combinedSymbols[i]];
      }
      
      setAvailableSymbols(combinedSymbols);

      // Randomly select which treasure to show
      const treasureOptions = ['garden', 'treasure', 'guru'];
      setTreasureType(treasureOptions[Math.floor(Math.random() * treasureOptions.length)]);
    }
  }, [gameState]);

  // Handle symbol selection
  const handleSymbolClick = (symbol) => {
    // Add the selected symbol to the user sequence
    setUserSequence([...userSequence, symbol]);
    
    // Show hint briefly
    const shlokaItem = shlokaCode.find(item => item.symbol === symbol.symbol);
    if (shlokaItem) {
      setCurrentHint(shlokaItem.hint);
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
      }, 2000);
    }
    
    // Check if the sequence is correct
    const correctSequence = shlokaCode.map(item => item.symbol);
    const userSymbols = [...userSequence, symbol].map(item => item.symbol);
    
    // Check if the user sequence matches the correct sequence so far
    let isCorrectSoFar = true;
    for (let i = 0; i < userSymbols.length; i++) {
      if (userSymbols[i] !== correctSequence[i]) {
        isCorrectSoFar = false;
        break;
      }
    }
    
    if (!isCorrectSoFar) {
      // Shake the door to indicate wrong sequence
      setShakeDoor(true);
      setTimeout(() => {
        setShakeDoor(false);
      }, 500);
      
      // Reset sequence
      setUserSequence([]);
    } else if (userSymbols.length === correctSequence.length) {
      // Complete sequence! Open the door
      setDoorOpen(true);
      
      // Show the treasure after a delay
      setTimeout(() => {
        setRevealContent(true);
        setGameState('success');
      }, 1500);
    }
  };

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setUserSequence([]);
    setDoorOpen(false);
    setRevealContent(false);
  };
  
  // Add a learning mode to help players learn the shloka parts
  const [showLearningMode, setShowLearningMode] = useState(false);
  
  const toggleLearningMode = () => {
    setShowLearningMode(!showLearningMode);
  };

  // Restart the game
  const restartGame = () => {
    setGameState('introduction');
    setUserSequence([]);
    setDoorOpen(false);
    setRevealContent(false);
  };

  // Render introduction screen
  const renderIntroduction = () => (
    <div className="shloka-intro">
      <h2>The Shloka Secret Code</h2>
      <div className="intro-content">
        <p>The Ganesha shloka is like a <strong>secret code</strong> that unlocks special powers!</p>
        <p>Behind this magical door are amazing treasures and wisdom.</p>
        <p>Enter the symbols of the shloka in the correct order to unlock the door.</p>
        <button className="start-button" onClick={startGame}>Begin Your Journey</button>
      </div>
    </div>
  );

  // Render the main game
  const renderGame = () => (
    <div className="shloka-game">
      <h2>Unlock the Door with the Shloka Code</h2>
      
      {/* Door with obstacles visualization */}
      <div className="door-container">
        <div className={`door ${shakeDoor ? 'shake' : ''} ${doorOpen ? 'open' : ''}`}>
          <div className="door-symbols">
            {/* Symbols representing challenges on the door */}
            <span className="door-symbol">🧠</span>
            <span className="door-symbol">📚</span>
            <span className="door-symbol">👥</span>
            <span className="door-symbol">⏱️</span>
          </div>
        </div>
        
        {/* What's behind the door */}
        {revealContent && (
          <div className="behind-door">
            {treasureType === 'garden' && (
              <div className="treasure garden">
                <div className="garden-content">
                  <span className="treasure-item">🌷</span>
                  <span className="treasure-item">🌳</span>
                  <span className="treasure-item">🦋</span>
                  <span className="treasure-item">🌈</span>
                </div>
                <p>You discovered the Garden of Peace!</p>
              </div>
            )}
            
            {treasureType === 'treasure' && (
              <div className="treasure chest">
                <div className="chest-content">
                  <span className="treasure-item">💎</span>
                  <span className="treasure-item">👑</span>
                  <span className="treasure-item">🏆</span>
                  <span className="treasure-item">💰</span>
                </div>
                <p>You found the Treasure of Knowledge!</p>
              </div>
            )}
            
            {treasureType === 'guru' && (
              <div className="treasure guru">
                <div className="guru-content">
                  <span className="guru-emoji">🧙‍♂️</span>
                </div>
                <p>You met the Wise Guru of Wisdom!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* User's current sequence */}
      <div className="user-sequence">
        <h3>Your Shloka Code:</h3>
        <div className="sequence-display">
          {userSequence.map((item, index) => (
            <span key={index} className="selected-symbol">{item.symbol}</span>
          ))}
          {Array(shlokaCode.length - userSequence.length).fill().map((_, index) => (
            <span key={`empty-${index}`} className="empty-symbol">?</span>
          ))}
        </div>
      </div>
      
      {/* Hint display */}
      <div className={`hint-display ${showHint ? 'visible' : ''}`}>
        <p>{currentHint}</p>
      </div>
      
      {/* Available symbols to select */}
      <div className="symbols-container">
        <h3>Select the Shloka Symbols in Order:</h3>
        <div className="available-symbols">
          {availableSymbols.map((item) => (
            <button
              key={item.id}
              className="symbol-button"
              onClick={() => handleSymbolClick(item)}
              disabled={userSequence.some(selected => selected.id === item.id)}
            >
              {item.symbol}
              {!item.isDecoy && <span className="symbol-text">{item.text}</span>}
            </button>
          ))}
        </div>
      </div>
      
      <button className="reset-button" onClick={() => setUserSequence([])}>
        Reset Code
      </button>
    </div>
  );

  // Render success screen
  const renderSuccess = () => (
    <div className="success-screen">
      <h2>Congratulations!</h2>
      <p className="success-message">
        You unlocked the secret power of the Ganesha shloka!
      </p>
      
      <div className="success-content">
        <p>
          <strong>The shloka is a magical code that:</strong>
        </p>
        <ul>
          <li>Removes obstacles from your path</li>
          <li>Helps you overcome challenges</li>
          <li>Brings wisdom and positive energy</li>
          <li>Unlocks amazing possibilities in your life</li>
        </ul>
        
        <div className="full-shloka">
          <h3>The Complete Shloka:</h3>
          <p className="shloka-text">
            Vakratunda Mahakaya Suryakoti Samaprabha<br />
            Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada
          </p>
        </div>
        
        <p className="final-message">
          Remember this secret code whenever you face challenges!
        </p>
        
        <button className="play-again-button" onClick={restartGame}>
          Play Again
        </button>
      </div>
    </div>
  );

  // Learning mode component
  const renderLearningMode = () => (
    <div className="learning-mode">
      <h3>Shloka Guide</h3>
      <p>Learn each part of the shloka and its meaning</p>
      <div className="learning-content">
        {shlokaCode.map((item, index) => (
          <div key={index} className="learning-item">
            <div className="learning-symbol">{item.symbol}</div>
            <div className="learning-details">
              <p className="learning-text">{item.text}</p>
              <p className="learning-hint">{item.hint}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="close-learning-btn" onClick={toggleLearningMode}>
        Close Guide
      </button>
    </div>
  );

  return (
    <div className="shloka-secret-code-container">
      {gameState === 'introduction' && renderIntroduction()}
      {gameState === 'playing' && (
        <>
          {renderGame()}
          {gameState === 'playing' && (
            <button onClick={toggleLearningMode} className="learning-mode-btn">
              {showLearningMode ? "Hide Shloka Guide" : "Show Shloka Guide"}
            </button>
          )}
          {showLearningMode && renderLearningMode()}
        </>
      )}
      {gameState === 'success' && renderSuccess()}
    </div>
  );
};

export default ShlokaSecretCode;