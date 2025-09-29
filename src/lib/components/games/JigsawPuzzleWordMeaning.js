import React, { useState, useEffect } from 'react';

const JigsawPuzzleWordMeaning = () => {
  // States for the game
  const [wordPieces, setWordPieces] = useState([]);
  const [meaningPieces, setMeaningPieces] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hint, setHint] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [revealedImage, setRevealedImage] = useState(0);

  // Sanskrit words and their meanings for the puzzle
  const puzzleData = [
    { word: "Vakratunda", meaning: "Curved Trunk", id: 1 },
    { word: "Mahakaya", meaning: "Big Body", id: 2 },
    { word: "Suryakoti", meaning: "Million Suns", id: 3 },
    { word: "Samaprabha", meaning: "Equal Radiance", id: 4 },
    { word: "Nirvighnam", meaning: "Without Obstacles", id: 5 },
    { word: "Kuru", meaning: "Make", id: 6 },
    { word: "Me Deva", meaning: "For Me, Oh Lord", id: 7 },
    { word: "Sarva-Kaaryeshu", meaning: "All Works", id: 8 },
    { word: "Sarvada", meaning: "Always", id: 9 }
  ];

  // Data for puzzle pieces to form a grid
  const gridPositions = [
    { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
    { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }
  ];

  // Function to get puzzle piece shape paths
  const getPuzzlePieceShape = (position, type = 'word') => {
    // Base piece dimensions
    const width = 120;
    const height = 80;
    
    // Determine connector types (in/out) for each side based on position
    // 0 = flat, 1 = tab out, -1 = tab in
    let top, right, bottom, left;
    
    // For demonstration, create a simple pattern that ensures
    // complementary edges for adjacent pieces
    if (position.row === 0) top = 0;
    else top = gridPositions.find(p => p.row === position.row - 1 && p.col === position.col) ? -1 : 0;
    
    if (position.col === 2) right = 0;
    else right = gridPositions.find(p => p.row === position.row && p.col === position.col + 1) ? 1 : 0;
    
    if (position.row === 2) bottom = 0;
    else bottom = gridPositions.find(p => p.row === position.row + 1 && p.col === position.col) ? 1 : 0;
    
    if (position.col === 0) left = 0;
    else left = gridPositions.find(p => p.row === position.row && p.col === position.col - 1) ? -1 : 0;
    
    // Flip connectors for meaning pieces to make them complementary
    if (type === 'meaning') {
      top = -top;
      right = -right;
      bottom = -bottom;
      left = -left;
    }
    
    // Calculate path for the puzzle piece shape
    const tabSize = 10; // Size of the connector tabs
    
    // Start at top-left corner
    let path = `M 0,0`;
    
    // Top edge
    if (top === 0) {
      path += ` H ${width}`;
    } else if (top === 1) {
      path += ` H ${width/2 - tabSize} 
                C ${width/2 - tabSize/2},${-tabSize} ${width/2 + tabSize/2},${-tabSize} ${width/2 + tabSize},0 
                H ${width}`;
    } else {
      path += ` H ${width/2 - tabSize} 
                C ${width/2 - tabSize/2},${tabSize} ${width/2 + tabSize/2},${tabSize} ${width/2 + tabSize},0 
                H ${width}`;
    }
    
    // Right edge
    if (right === 0) {
      path += ` V ${height}`;
    } else if (right === 1) {
      path += ` V ${height/2 - tabSize} 
                C ${width + tabSize},${height/2 - tabSize/2} ${width + tabSize},${height/2 + tabSize/2} ${width},${height/2 + tabSize} 
                V ${height}`;
    } else {
      path += ` V ${height/2 - tabSize} 
                C ${width - tabSize},${height/2 - tabSize/2} ${width - tabSize},${height/2 + tabSize/2} ${width},${height/2 + tabSize} 
                V ${height}`;
    }
    
    // Bottom edge (right to left)
    if (bottom === 0) {
      path += ` H 0`;
    } else if (bottom === 1) {
      path += ` H ${width/2 + tabSize} 
                C ${width/2 + tabSize/2},${height + tabSize} ${width/2 - tabSize/2},${height + tabSize} ${width/2 - tabSize},${height} 
                H 0`;
    } else {
      path += ` H ${width/2 + tabSize} 
                C ${width/2 + tabSize/2},${height - tabSize} ${width/2 - tabSize/2},${height - tabSize} ${width/2 - tabSize},${height} 
                H 0`;
    }
    
    // Left edge (bottom to top)
    if (left === 0) {
      path += ` V 0`;
    } else if (left === 1) {
      path += ` V ${height/2 + tabSize} 
                C ${-tabSize},${height/2 + tabSize/2} ${-tabSize},${height/2 - tabSize/2} 0,${height/2 - tabSize} 
                V 0`;
    } else {
      path += ` V ${height/2 + tabSize} 
                C ${tabSize},${height/2 + tabSize/2} ${tabSize},${height/2 - tabSize/2} 0,${height/2 - tabSize} 
                V 0`;
    }
    
    return path;
  };

  // Initialize the game
  useEffect(() => {
    if (gameStarted) {
      // Shuffle the puzzle data
      const shuffledData = [...puzzleData]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      // Create word pieces with random positions
      const words = shuffledData.map((item, index) => ({
        ...item,
        type: 'word',
        gridPosition: gridPositions[index],
        shape: getPuzzlePieceShape(gridPositions[index], 'word'),
        matched: false,
        position: {
          x: Math.random() * 200 + 50,
          y: Math.random() * 200 + 50
        }
      }));

      // Create meaning pieces with random positions
      const meanings = shuffledData.map((item, index) => ({
        ...item,
        type: 'meaning',
        gridPosition: gridPositions[index],
        shape: getPuzzlePieceShape(gridPositions[index], 'meaning'),
        matched: false,
        position: {
          x: Math.random() * 200 + 300,
          y: Math.random() * 200 + 50
        }
      }));

      setWordPieces(words);
      setMeaningPieces(meanings);
      setMatchedPairs([]);
      setGameComplete(false);
    }
  }, [gameStarted]);

  // Check if game is complete when matched pairs change
  useEffect(() => {
    if (matchedPairs.length === puzzleData.length) {
      setGameComplete(true);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }

    // Update the revealed image percentage
    const percentRevealed = Math.floor((matchedPairs.length / puzzleData.length) * 100);
    setRevealedImage(percentRevealed);
  }, [matchedPairs]);

  // Handle selecting a puzzle piece
  const handlePieceClick = (piece) => {
    // Don't allow clicking on already matched pieces
    if (piece.matched) return;
    
    // If no piece is selected, select this one
    if (!selectedPiece) {
      setSelectedPiece(piece);
      setHint(`Now select a ${piece.type === 'word' ? 'meaning' : 'word'} piece`);
      return;
    }
    
    // Can't select two pieces of the same type
    if (selectedPiece.type === piece.type) {
      setSelectedPiece(piece);
      return;
    }
    
    // Check if the pieces match
    if (selectedPiece.id === piece.id) {
      // Match found!
      const newMatchedPairs = [...matchedPairs, selectedPiece.id];
      setMatchedPairs(newMatchedPairs);
      
      // Update matched status in the piece arrays
      setWordPieces(prevPieces => 
        prevPieces.map(p => 
          p.id === selectedPiece.id ? { ...p, matched: true } : p
        )
      );
      
      setMeaningPieces(prevPieces => 
        prevPieces.map(p => 
          p.id === selectedPiece.id ? { ...p, matched: true } : p
        )
      );
      
      setHint("Great match! Keep going!");
    } else {
      // Not a match
      setHint("Not a match. Try again!");
    }
    
    // Reset selection
    setSelectedPiece(null);
  };

  // Get color based on match status
  const getPieceColor = (piece) => {
    if (piece.matched) return '#4CAF50'; // Green for matched
    if (selectedPiece && selectedPiece.id === piece.id) return '#FFC107'; // Yellow for selected
    return piece.type === 'word' ? '#2196F3' : '#E91E63'; // Blue for words, pink for meanings
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };

  // Restart the game
  const restartGame = () => {
    setGameStarted(false);
    setSelectedPiece(null);
    setMatchedPairs([]);
    setHint('');
    setTimeout(() => {
      setGameStarted(true);
    }, 100);
  };

  return (
    <div className="jigsaw-puzzle-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Game header */}
      <div className="game-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#5D1049', marginBottom: '10px' }}>Sanskrit Word Puzzle</h2>
        <p style={{ color: '#666' }}>Match the Sanskrit words with their meanings to reveal the Ganesha image!</p>
      </div>
      
      {/* Game instructions or current status */}
      <div className="game-status" style={{
        backgroundColor: '#fff',
        padding: '10px 15px',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '20px',
        minHeight: '40px'
      }}>
        {!gameStarted ? (
          <p>Connect Sanskrit words with their meanings to build the puzzle.</p>
        ) : (
          <p>
            {hint || "Click on a piece to start matching."}
            {matchedPairs.length > 0 && ` Pairs matched: ${matchedPairs.length}/${puzzleData.length}`}
          </p>
        )}
      </div>
      
      {/* Game start screen */}
      {!gameStarted && !gameComplete && (
        <div className="start-screen" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          backgroundColor: '#E8EAF6',
          borderRadius: '15px',
          marginBottom: '20px'
        }}>
          <img 
            src="/api/placeholder/200/200" 
            alt="Ganesha Puzzle Preview" 
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              marginBottom: '20px',
              filter: 'blur(5px)'
            }}
          />
          <button 
            onClick={startGame}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            Start Puzzle
          </button>
        </div>
      )}
      
      {/* Game play area */}
      {gameStarted && !gameComplete && (
        <div className="game-play-area" style={{
          position: 'relative',
          minHeight: '400px',
          backgroundColor: '#E8EAF6',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          {/* Partially revealed Ganesha image in the background */}
          <div className="background-image" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            opacity: revealedImage / 100,
            transition: 'opacity 1s ease',
            zIndex: 1
          }}>
            <img 
              src="/api/placeholder/300/300" 
              alt="Ganesha" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          
          {/* Word pieces */}
          {wordPieces.map((piece, index) => (
            <div 
              key={`word-${piece.id}`}
              onClick={() => handlePieceClick(piece)}
              style={{
                position: 'absolute',
                left: `${piece.position.x}px`,
                top: `${piece.position.y}px`,
                width: '120px',
                height: '80px',
                cursor: piece.matched ? 'default' : 'pointer',
                zIndex: piece.matched ? 1 : 2,
                transition: 'transform 0.3s ease',
                transform: piece.matched ? 'scale(0.9)' : selectedPiece?.id === piece.id ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <svg width="120" height="80" viewBox="0 0 120 80">
                <path 
                  d={piece.shape} 
                  fill={getPieceColor(piece)} 
                  stroke="#333" 
                  strokeWidth="2"
                />
                <text 
                  x="60" 
                  y="45" 
                  textAnchor="middle" 
                  fill="white" 
                  fontWeight="bold"
                  fontSize="12"
                  fontFamily="Arial, sans-serif"
                >
                  {piece.word}
                </text>
              </svg>
            </div>
          ))}
          
          {/* Meaning pieces */}
          {meaningPieces.map((piece, index) => (
            <div 
              key={`meaning-${piece.id}`}
              onClick={() => handlePieceClick(piece)}
              style={{
                position: 'absolute',
                left: `${piece.position.x}px`,
                top: `${piece.position.y}px`,
                width: '120px',
                height: '80px',
                cursor: piece.matched ? 'default' : 'pointer',
                zIndex: piece.matched ? 1 : 2,
                transition: 'transform 0.3s ease',
                transform: piece.matched ? 'scale(0.9)' : selectedPiece?.id === piece.id ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <svg width="120" height="80" viewBox="0 0 120 80">
                <path 
                  d={piece.shape} 
                  fill={getPieceColor(piece)} 
                  stroke="#333" 
                  strokeWidth="2"
                />
                <text 
                  x="60" 
                  y="45" 
                  textAnchor="middle" 
                  fill="white" 
                  fontWeight="bold"
                  fontSize="12"
                  fontFamily="Arial, sans-serif"
                >
                  {piece.meaning}
                </text>
              </svg>
            </div>
          ))}
        </div>
      )}
      
      {/* Completed game view */}
      {gameComplete && (
        <div className="completion-view" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E8F5E9',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2E7D32', marginTop: 0 }}>Puzzle Complete!</h3>
          <p>You've successfully matched all Sanskrit words with their meanings!</p>
          
          <div className="completed-image" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <img 
              src="/api/placeholder/300/300" 
              alt="Completed Ganesha" 
              style={{
                width: '300px',
                height: '300px',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            />
          </div>
          
          <div className="word-meaning-pairs" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Sanskrit Word Meanings</h4>
            {puzzleData.map(pair => (
              <div 
                key={pair.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 15px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '5px'
                }}
              >
                <strong>{pair.word}</strong>
                <span>{pair.meaning}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={restartGame}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
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
      )}
      
      {/* Game controls */}
      <div className="game-controls" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '20px'
      }}>
        {gameStarted && !gameComplete && (
          <button 
            onClick={restartGame}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Restart Puzzle
          </button>
        )}
      </div>
      
      {/* Progress indicator */}
      {gameStarted && !gameComplete && (
        <div className="progress-indicator" style={{
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Image Revealed:</span>
            <span>{revealedImage}%</span>
          </div>
          <div style={{ 
            height: '10px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${revealedImage}%`, 
              height: '100%', 
              backgroundColor: '#4CAF50',
              transition: 'width 0.5s ease'
            }}></div>
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
          zIndex: 100
        }}>
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 8 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 1;
            const color = ['#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0'][Math.floor(Math.random() * 5)];
            
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
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default JigsawPuzzleWordMeaning;