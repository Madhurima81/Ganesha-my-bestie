import React, { useState, useEffect } from 'react';

const MemoryGame = ({ theme = 'default' }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Theme content options
  const themeOptions = {
    default: {
      emojis: ['🍎', '🍌', '🍒', '🥑', '🍓', '🍇', '🥭', '🍉'],
      bgColor: '#1976d2',
      title: 'Memory Game'
    },
    ganesha: {
      emojis: ['🐘', '🪔', '🧡', '🪷', '🕉️', '🙏', '🪶', '🧠'],
      bgColor: '#6a5acd',
      title: 'Ganesha Memory Game'
    },
    animals: {
      emojis: ['🐘', '🐁', '🦁', '🐯', '🦒', '🦊', '🐢', '🐝'],
      bgColor: '#2e7d32',
      title: 'Animal Memory Game'
    }
  };

  // Get current theme settings
  const currentTheme = themeOptions[theme] || themeOptions.default;

  // Create card content
  useEffect(() => {
    const startGame = () => {
      // Select a subset of emojis if there are more than 4
      const cardEmojis = currentTheme.emojis.slice(0, 4);
      const duplicatedValues = [...cardEmojis, ...cardEmojis];
      
      // Shuffle the cards
      const shuffledCards = duplicatedValues
        .sort(() => Math.random() - 0.5)
        .map((value, index) => ({ id: index, value, isFlipped: false }));
      
      setCards(shuffledCards);
      setFlipped([]);
      setSolved([]);
      setMoves(0);
      setGameWon(false);
      setGameStarted(true);
    };

    if (gameStarted) {
      startGame();
    }
  }, [theme, gameStarted, currentTheme.emojis]);

  // Handle card click
  const handleCardClick = (id) => {
    if (disabled) return;
    
    // Don't allow to click on already solved or currently flipped cards
    if (solved.includes(id) || flipped.includes(id)) return;
    
    // Allow only 2 cards to be flipped at once
    if (flipped.length === 1) {
      setDisabled(true);
      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);
      setMoves(moves + 1);
      
      // Check if the two flipped cards match
      const firstCardId = flipped[0];
      const secondCardId = id;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      if (firstCard.value === secondCard.value) {
        setSolved([...solved, firstCardId, secondCardId]);
        setFlipped([]);
        setDisabled(false);
        
        // Check if all cards are solved
        if (solved.length + 2 === cards.length) {
          setGameWon(true);
        }
      } else {
        // If no match, flip the cards back after a short delay
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    } else {
      setFlipped([id]);
    }
  };

  // Reset the game
  const resetGame = () => {
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setMoves(0);
    setGameWon(false);
    
    // Reshuffle the cards
    const cardEmojis = currentTheme.emojis.slice(0, 4);
    const duplicatedValues = [...cardEmojis, ...cardEmojis];
    
    const shuffledCards = duplicatedValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value, isFlipped: false }));
    
    setCards(shuffledCards);
  };

  // Handle first game start
  const handleStartGame = () => {
    setGameStarted(true);
  };

  // Card and container styles
  const gameContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '280px',
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '15px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };
  
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={gameContainerStyle}>
      <h3 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '10px', 
        color: '#333',
        textAlign: 'center'
      }}>
        {currentTheme.title}
      </h3>
      
      {!gameStarted ? (
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <p style={{ marginBottom: '15px' }}>Match the pairs to complete the game!</p>
          <button 
            onClick={handleStartGame}
            style={buttonStyle}
          >
            Start Game
          </button>
        </div>
      ) : gameWon ? (
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#2e7d32',
            marginBottom: '10px'
          }}>
            You won in {moves} moves! 🎉
          </p>
          <button 
            onClick={resetGame}
            style={buttonStyle}
          >
            Play Again
          </button>
        </div>
      ) : (
        <p style={{ marginBottom: '10px' }}>Moves: {moves}</p>
      )}
      
      {gameStarted && !gameWon && (
        <div className="memory-game-grid">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="memory-card"
              style={{
                backgroundColor: flipped.includes(card.id) || solved.includes(card.id) ? 'white' : currentTheme.bgColor,
                boxShadow: flipped.includes(card.id) || solved.includes(card.id) 
                  ? '0 2px 10px rgba(0,0,0,0.1)' 
                  : '0 4px 8px rgba(0,0,0,0.2)',
                transform: flipped.includes(card.id) && !solved.includes(card.id) 
                  ? 'scale(1.05)' 
                  : solved.includes(card.id)
                    ? 'scale(0.95)'
                    : 'scale(1)',
              }}
            >
              {(flipped.includes(card.id) || solved.includes(card.id)) && (
                <span style={{ 
                  opacity: solved.includes(card.id) ? 0.8 : 1,
                  fontSize: '28px'
                }}>
                  {card.value}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;