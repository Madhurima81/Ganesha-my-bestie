import React, { useState, useEffect } from 'react';

const GaneshaSymbolismMatch = () => {
  // Game states
  const [symbols, setSymbols] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [matches, setMatches] = useState({});
  const [draggingItem, setDraggingItem] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [matchAnimation, setMatchAnimation] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  
  // Ganesha symbolism items - these will be shuffled for the game
  const symbolismItems = [
    {
      id: 'head',
      symbol: 'Elephant Head',
      meaning: 'Wisdom and Knowledge',
      description: 'The elephant head symbolizes wisdom, knowledge, and the ability to think big!',
      image: '🐘',
      color: '#B388FF'
    },
    {
      id: 'ears',
      symbol: 'Large Ears',
      meaning: 'Good Listening',
      description: 'The big ears remind us to listen more than we speak. Good listeners learn more!',
      image: '👂',
      color: '#80D8FF'
    },
    {
      id: 'trunk',
      symbol: 'Curved Trunk',
      meaning: 'Adaptability',
      description: 'The curved trunk represents efficiency and adaptability. It can do both big and small tasks!',
      image: '🐘',
      color: '#FF9E80'
    },
    {
      id: 'stomach',
      symbol: 'Big Belly',
      meaning: 'Digesting Experiences',
      description: 'The large belly shows that Ganesha can digest all experiences - both good and bad!',
      image: '🍽️',
      color: '#FFAB91'
    },
    {
      id: 'mouse',
      symbol: 'Mouse Friend',
      meaning: 'Control Over Desires',
      description: 'The mouse represents control over desires. Even though small, it helps Ganesha travel!',
      image: '🐁',
      color: '#CCFF90'
    },
    {
      id: 'axe',
      symbol: 'Axe',
      meaning: 'Cutting Away Obstacles',
      description: 'The axe cuts away obstacles and unhealthy attachments that hold us back.',
      image: '🪓',
      color: '#EA80FC'
    },
    {
      id: 'modak',
      symbol: 'Sweet Modak',
      meaning: 'Rewards of Hard Work',
      description: 'The modak (sweet) represents the rewards we get from hard work and good deeds.',
      image: '🍬',
      color: '#FFD180'
    }
  ];
  
  // Initialize game based on difficulty
  useEffect(() => {
    if (gameStarted) {
      let itemsToUse = [];
      
      // Select items based on difficulty
      if (difficulty === 'easy') {
        // Use 4 random items for easy mode
        const shuffled = [...symbolismItems].sort(() => 0.5 - Math.random());
        itemsToUse = shuffled.slice(0, 4);
      } else if (difficulty === 'medium') {
        // Use 5 random items for medium mode
        const shuffled = [...symbolismItems].sort(() => 0.5 - Math.random());
        itemsToUse = shuffled.slice(0, 5);
      } else {
        // Use all items for hard mode
        itemsToUse = [...symbolismItems];
      }
      
      // Create and shuffle symbols array
      const symbolsArray = itemsToUse.map(item => ({
        id: item.id,
        text: item.symbol,
        image: item.image,
        color: item.color
      })).sort(() => 0.5 - Math.random());
      
      // Create and shuffle meanings array
      const meaningsArray = itemsToUse.map(item => ({
        id: item.id,
        text: item.meaning,
        description: item.description
      })).sort(() => 0.5 - Math.random());
      
      // Reset game state
      setSymbols(symbolsArray);
      setMeanings(meaningsArray);
      setMatches({});
      setScore(0);
      setAttempts(0);
      setGameComplete(false);
    }
  }, [gameStarted, difficulty]);
  
  // Check if game is complete
  useEffect(() => {
    if (Object.keys(matches).length > 0 && Object.keys(matches).length === symbols.length && gameStarted) {
      setGameComplete(true);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [matches, symbols.length, gameStarted]);
  
  // Handle drag start
  const handleDragStart = (e, item, type) => {
    setDraggingItem({ item, type });
    e.dataTransfer.setData('text/plain', item.id);
    
    // For Firefox compatibility
    if (e.dataTransfer.setDragImage) {
      const dragIcon = document.createElement('div');
      dragIcon.innerHTML = type === 'symbol' ? item.image : '📄';
      dragIcon.style.fontSize = '2rem';
      document.body.appendChild(dragIcon);
      e.dataTransfer.setDragImage(dragIcon, 25, 25);
      setTimeout(() => {
        document.body.removeChild(dragIcon);
      }, 0);
    }
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Handle drop
  const handleDrop = (e, target, type) => {
    e.preventDefault();
    
    if (!draggingItem) return;
    
    // Can't drop on the same type (symbol to symbol or meaning to meaning)
    if (draggingItem.type === type) return;
    
    const sourceId = draggingItem.item.id;
    const targetId = target.id;
    
    // Check if it's a match
    if (sourceId === targetId) {
      // It's a match!
      const newMatches = { ...matches, [sourceId]: true };
      setMatches(newMatches);
      setMatchAnimation(sourceId);
      setScore(score + 1);
      
      // Clear match animation after a delay
      setTimeout(() => {
        setMatchAnimation(null);
      }, 1000);
    } else {
      // Not a match
      setAttempts(attempts + 1);
    }
    
    setDraggingItem(null);
  };
  
  // Start the game
  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameStarted(false);
    setGameComplete(false);
    setMatches({});
    setScore(0);
    setAttempts(0);
    setDraggingItem(null);
  };
  
  return (
    <div className="ganesha-symbolism-match" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        marginBottom: '15px'
      }}>
        Ganesha Symbolism Matching Game
      </h2>
      
      {!gameStarted ? (
        /* Start screen */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#FFE0B2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            marginBottom: '20px'
          }}>
            🐘
          </div>
          
          <h3 style={{
            marginBottom: '15px',
            color: '#5D1049'
          }}>
            Match Ganesha's Symbols to Their Meanings
          </h3>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#333',
            fontSize: '16px'
          }}>
            Drag each symbol of Ganesha to its correct meaning. Learn what each part of Ganesha represents!
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <button
              onClick={() => startGame('easy')}
              style={{
                padding: '12px 25px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              Easy (4 matches)
            </button>
            
            <button
              onClick={() => startGame('medium')}
              style={{
                padding: '12px 25px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              Medium (5 matches)
            </button>
            
            <button
              onClick={() => startGame('hard')}
              style={{
                padding: '12px 25px',
                backgroundColor: '#F44336',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              Hard (7 matches)
            </button>
          </div>
        </div>
      ) : (
        /* Game play area */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Game stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 20px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div>
              <strong>Matches:</strong> {Object.keys(matches).length}/{symbols.length}
            </div>
            <div>
              <strong>Score:</strong> {score}
            </div>
            <div>
              <strong>Attempts:</strong> {attempts}
            </div>
            <div>
              <strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
          </div>
          
          {/* Game instructions */}
          <div style={{
            padding: '10px 20px',
            backgroundColor: '#FFF9C4',
            borderRadius: '10px',
            fontSize: '16px',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            <p>Drag each symbol to its matching meaning!</p>
          </div>
          
          {/* Game area with two columns */}
          <div style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'space-between',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row'
          }}>
            {/* Symbols column */}
            <div style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '15px',
                color: '#5D1049'
              }}>
                Ganesha's Symbols
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {symbols.map(symbol => (
                  <div
                    key={symbol.id}
                    draggable={!matches[symbol.id]}
                    onDragStart={(e) => handleDragStart(e, symbol, 'symbol')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, symbol, 'symbol')}
                    style={{
                      backgroundColor: matches[symbol.id] ? '#E8F5E9' : symbol.color,
                      padding: '15px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: matches[symbol.id] ? 'default' : 'grab',
                      opacity: matches[symbol.id] ? 0.7 : 1,
                      boxShadow: matchAnimation === symbol.id 
                        ? '0 0 20px #4CAF50' 
                        : '0 2px 5px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      transform: matchAnimation === symbol.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <div style={{
                      fontSize: '30px',
                      marginRight: '5px'
                    }}>
                      {symbol.image}
                    </div>
                    <div style={{
                      flex: 1,
                      fontWeight: 'bold'
                    }}>
                      {symbol.text}
                    </div>
                    {matches[symbol.id] && (
                      <div style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Meanings column */}
            <div style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '15px',
                color: '#5D1049'
              }}>
                Meanings
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {meanings.map(meaning => (
                  <div
                    key={meaning.id}
                    draggable={!matches[meaning.id]}
                    onDragStart={(e) => handleDragStart(e, meaning, 'meaning')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, meaning, 'meaning')}
                    style={{
                      backgroundColor: matches[meaning.id] ? '#E8F5E9' : '#f5f5f5',
                      padding: '15px',
                      borderRadius: '10px',
                      cursor: matches[meaning.id] ? 'default' : 'grab',
                      opacity: matches[meaning.id] ? 0.7 : 1,
                      boxShadow: matchAnimation === meaning.id 
                        ? '0 0 20px #4CAF50' 
                        : '0 2px 5px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      transform: matchAnimation === meaning.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <div style={{
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {meaning.text}
                    </div>
                    
                    {matches[meaning.id] && (
                      <div style={{
                        fontSize: '14px',
                        marginTop: '5px',
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        {meaning.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Reset button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px'
          }}>
            <button
              onClick={resetGame}
              style={{
                padding: '10px 20px',
                backgroundColor: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Reset Game
            </button>
          </div>
        </div>
      )}
      
      {/* Game complete overlay */}
      {gameComplete && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          animation: 'fadeIn 0.5s'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '80%',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(76, 175, 80, 0.5)'
          }}>
            <h2 style={{ 
              color: '#4CAF50',
              marginBottom: '20px'
            }}>
              Wonderful Job! 🎉
            </h2>
            
            <p style={{
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              You've matched all of Ganesha's symbols to their meanings!
            </p>
            
            <p style={{
              fontSize: '16px',
              marginBottom: '20px'
            }}>
              Score: {score} | Attempts: {attempts}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <button
                onClick={resetGame}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Celebration effect */}
      {showCelebration && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 0.5;
            const color = [
              '#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'
            ][Math.floor(Math.random() * 5)];
            
            return (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: '-10px',
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: '50%',
                  animation: `confettiFall ${animationDuration}s ease-in ${animationDelay}s forwards`
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
          }
          
          @media (max-width: 768px) {
            .ganesha-symbolism-match [style*="flex-direction: row"] {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GaneshaSymbolismMatch;