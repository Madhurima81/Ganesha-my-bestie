import React, { useState, useEffect, useRef } from 'react';

const GaneshaSaysGame = () => {
  // Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showSymbolism, setShowSymbolism] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Refs
  const timerRef = useRef(null);
  const playerTurnTimeoutRef = useRef(null);
  
  // Parts of Ganesha with their symbolism
  const ganeshaParts = [
    {
      id: 'head',
      name: 'Head',
      symbolism: 'The large elephant head represents wisdom, intelligence, and big thinking.',
      color: '#B388FF',
      position: { top: '10%', left: '50%' }
    },
    {
      id: 'ears',
      name: 'Ears',
      symbolism: 'The big ears mean we should listen more than we speak. Good listeners learn more!',
      color: '#80D8FF',
      position: { top: '20%', left: '15%' }
    },
    {
      id: 'trunk',
      name: 'Trunk',
      symbolism: 'The curved trunk represents adaptability and efficiency - it can do both big and small tasks!',
      color: '#FF9E80',
      position: { top: '40%', left: '40%' }
    },
    {
      id: 'stomach',
      name: 'Stomach',
      symbolism: 'The big stomach shows that Ganesha can digest all experiences - good and bad.',
      color: '#FFAB91',
      position: { top: '60%', left: '50%' }
    },
    {
      id: 'mouse',
      name: 'Mouse',
      symbolism: 'The mouse friend represents control over desires and being humble.',
      color: '#CCFF90',
      position: { top: '80%', left: '30%' }
    },
    {
      id: 'axe',
      name: 'Axe',
      symbolism: 'The axe cuts away unhealthy attachments and obstacles in our path.',
      color: '#EA80FC',
      position: { top: '50%', left: '85%' }
    }
  ];
  
  // Start a new game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setLevel(1);
    setScore(0);
    setPlayerSequence([]);
    
    // Start with a single random part
    const initialSequence = [Math.floor(Math.random() * ganeshaParts.length)];
    setSequence(initialSequence);
    
    // Show initial sequence to player
    showSequence(initialSequence);
  };
  
  // Show the sequence to the player
  const showSequence = (currentSequence) => {
    setIsShowingSequence(true);
    setPlayerSequence([]);
    
    // Show each button in sequence with timing
    currentSequence.forEach((buttonIndex, i) => {
      setTimeout(() => {
        setActiveButton(buttonIndex);
        
        // Turn off after a delay
        setTimeout(() => {
          setActiveButton(null);
          
          // If it's the last button in sequence, allow player to start
          if (i === currentSequence.length - 1) {
            setTimeout(() => {
              setIsShowingSequence(false);
              
              // Set a time limit for player to complete the sequence
              playerTurnTimeoutRef.current = setTimeout(() => {
                if (playerSequence.length < currentSequence.length) {
                  handleGameOver();
                }
              }, 10000); // 10 seconds to complete
            }, 300);
          }
        }, 500);
      }, i * 800); // Time between showing each button
    });
  };
  
  // Handle player clicking a part
  const handlePartClick = (index) => {
    // Ignore clicks when showing sequence or game over
    if (isShowingSequence || gameOver) return;
    
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    
    // Highlight the clicked button
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 300);
    
    // Show symbolism for the part
    setSelectedPart(ganeshaParts[index]);
    setShowSymbolism(true);
    
    // Clear previous symbolism timeout
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Hide symbolism after a few seconds
    timerRef.current = setTimeout(() => {
      setShowSymbolism(false);
    }, 2000);
    
    // Check if the player's sequence matches the game sequence so far
    const currentIndex = playerSequence.length;
    if (index !== sequence[currentIndex]) {
      // Wrong selection!
      handleGameOver();
      return;
    }
    
    // Check if the player completed the full sequence
    if (newPlayerSequence.length === sequence.length) {
      // Clear player turn timeout
      if (playerTurnTimeoutRef.current) {
        clearTimeout(playerTurnTimeoutRef.current);
      }
      
      // Player completed this level!
      setScore(score + sequence.length);
      
      // Move to next level after a short delay
      setTimeout(() => {
        goToNextLevel();
      }, 1000);
    }
  };
  
  // Go to the next level
  const goToNextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    
    // Create a new sequence by adding one more random button
    const newSequence = [
      ...sequence,
      Math.floor(Math.random() * ganeshaParts.length)
    ];
    setSequence(newSequence);
    
    // Show the new sequence to the player
    setTimeout(() => {
      showSequence(newSequence);
    }, 1000);
  };
  
  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    
    // Clear any pending timeouts
    if (timerRef.current) clearTimeout(timerRef.current);
    if (playerTurnTimeoutRef.current) clearTimeout(playerTurnTimeoutRef.current);
  };
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (playerTurnTimeoutRef.current) clearTimeout(playerTurnTimeoutRef.current);
    };
  }, []);
  
  return (
    <div className="ganesha-says-game" style={{ 
      position: 'relative',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      backgroundColor: '#f5f5f5',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        marginBottom: '15px'
      }}>
        Ganesha Says!
      </h2>
      
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '16px'
      }}>
        {!gameStarted ? (
          <p>Watch the parts of Ganesha light up, then click them in the same order. Learn about each part's special meaning!</p>
        ) : gameOver ? (
          <p>Game Over! You reached level {level} with a score of {score} points.</p>
        ) : isShowingSequence ? (
          <p>Watch carefully! Ganesha is showing the pattern...</p>
        ) : (
          <p>Your turn! Click the parts in the same order.</p>
        )}
      </div>
      
      {/* Game stats */}
      {gameStarted && !gameOver && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#FFF',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div>
            <strong>Level:</strong> {level}
          </div>
          <div>
            <strong>Score:</strong> {score}
          </div>
          <div>
            <strong>Pattern:</strong> {sequence.length} parts
          </div>
        </div>
      )}
      
      {/* Game buttons - Ganesha parts */}
      <div className="ganesha-image" style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        backgroundColor: '#FFF9C4',
        borderRadius: '10px',
        marginBottom: '20px',
        backgroundImage: 'url("/api/placeholder/300/400")',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Placeholder for Ganesha image - parts are positioned over this */}
        
        {/* Clickable parts */}
        {ganeshaParts.map((part, index) => (
          <button
            key={part.id}
            onClick={() => handlePartClick(index)}
            disabled={isShowingSequence || gameOver || !gameStarted}
            style={{
              position: 'absolute',
              top: part.position.top,
              left: part.position.left,
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: activeButton === index ? '#FFFFFF' : part.color,
              border: activeButton === index ? `4px solid ${part.color}` : '2px solid #FFF',
              boxShadow: activeButton === index ? `0 0 20px ${part.color}, 0 0 30px ${part.color}` : '0 4px 8px rgba(0,0,0,0.2)',
              cursor: isShowingSequence || gameOver || !gameStarted ? 'default' : 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#333'
            }}
          >
            {part.name}
          </button>
        ))}
      </div>
      
      {/* Symbolism information popup */}
      {showSymbolism && selectedPart && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: selectedPart.color,
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 20,
          maxWidth: '80%',
          textAlign: 'center',
          animation: 'fadeIn 0.3s'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{selectedPart.name}</h3>
          <p style={{ margin: '0', fontSize: '14px' }}>{selectedPart.symbolism}</p>
        </div>
      )}
      
      {/* Game control buttons */}
      <div style={{ textAlign: 'center' }}>
        {!gameStarted || gameOver ? (
          <button
            onClick={startGame}
            style={{
              padding: '12px 30px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <button
            onClick={handleGameOver}
            style={{
              padding: '8px 20px',
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '50px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            End Game
          </button>
        )}
      </div>
      
      {/* Instructions */}
      {!gameStarted && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>How to Play:</h3>
          <ol style={{ margin: '0 0 0 20px', padding: '0' }}>
            <li>Ganesha will highlight different parts of himself</li>
            <li>Remember the order of the highlighted parts</li>
            <li>Click the parts in the same order</li>
            <li>Each time you succeed, Ganesha adds one more part to the pattern</li>
            <li>Learn about the symbolism of each part as you play!</li>
          </ol>
        </div>
      )}
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @media (max-width: 500px) {
            .ganesha-image {
              height: 300px;
            }
            
            .ganesha-says-game button[style*="width: 60px"] {
              width: 50px !important;
              height: 50px !important;
              font-size: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GaneshaSaysGame;