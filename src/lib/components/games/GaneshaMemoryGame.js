import React, { useState, useEffect } from 'react';
import './GaneshaMemoryGame.css';

const GaneshaMemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  
  // Card data
  const cardData = [
    { id: 1, content: "Vakratunda", emoji: "🐘", matchId: 1, description: "The one with the curved trunk" },
    { id: 2, content: "Mahakaya", emoji: "💪", matchId: 2, description: "The one with the large body" },
    { id: 3, content: "Suryakoti", emoji: "☀️", matchId: 3, description: "Ten million suns" },
    { id: 4, content: "Samaprabha", emoji: "✨", matchId: 4, description: "Equally brilliant" },
    { id: 5, content: "Nirvighnam", emoji: "🚫", matchId: 5, description: "Without obstacles" },
    { id: 6, content: "Kuru Me Deva", emoji: "🙏", matchId: 6, description: "Make for me, O Lord" },
    { id: 7, content: "Sarva-Kaaryeshu", emoji: "📝", matchId: 7, description: "In all actions/works" },
    { id: 8, content: "Sarvada", emoji: "⏰", matchId: 8, description: "Always" },
    { id: 9, content: "Removes Obstacles", emoji: "🚧", matchId: 1, description: "Benefit of the shloka" },
    { id: 10, content: "Gives Strength", emoji: "🦾", matchId: 2, description: "Benefit of the shloka" },
    { id: 11, content: "Brings Light", emoji: "💡", matchId: 3, description: "Benefit of the shloka" },
    { id: 12, content: "Creates Positivity", emoji: "😊", matchId: 4, description: "Benefit of the shloka" },
    { id: 13, content: "Clears the Path", emoji: "🛣️", matchId: 5, description: "Benefit of the shloka" },
    { id: 14, content: "Divine Blessing", emoji: "🌈", matchId: 6, description: "Benefit of the shloka" },
    { id: 15, content: "Helps in All Activities", emoji: "🎯", matchId: 7, description: "Benefit of the shloka" },
    { id: 16, content: "Constant Support", emoji: "🔄", matchId: 8, description: "Benefit of the shloka" }
  ];
  
  // Setup game based on difficulty
  const setupGame = (selectedDifficulty) => {
    setGameStarted(true);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameComplete(false);
    
    let numPairs;
    switch (selectedDifficulty) {
      case 'easy':
        numPairs = 4;
        break;
      case 'medium':
        numPairs = 6;
        break;
      case 'hard':
        numPairs = 8;
        break;
      default:
        numPairs = 4;
    }
    
    // Select random pairs based on difficulty
    const selectedPairs = [];
    const matchIdPool = [...new Set(cardData.map(card => card.matchId))];
    
    for (let i = 0; i < numPairs; i++) {
      if (matchIdPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchIdPool.length);
        const selectedMatchId = matchIdPool[randomIndex];
        
        // Find the pair of cards with this matchId
        const pair = cardData.filter(card => card.matchId === selectedMatchId);
        selectedPairs.push(...pair);
        
        // Remove this matchId from the pool
        matchIdPool.splice(randomIndex, 1);
      }
    }
    
    // Shuffle the selected cards
    const shuffledCards = [...selectedPairs].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setDifficulty(selectedDifficulty);
  };
  
  // Handle card click
  const handleCardClick = (id) => {
    if (
      flippedCards.length === 2 || // Don't allow more than 2 cards flipped at once
      flippedCards.includes(id) || // Don't allow the same card to be flipped twice
      matchedPairs.includes(id) // Don't allow already matched cards to be flipped
    ) {
      return;
    }
    
    // Add the card to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // If this is the second card
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      // Find the two flipped cards
      const firstCardId = newFlippedCards[0];
      const secondCardId = newFlippedCards[1];
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      // Check if they match
      if (firstCard.matchId === secondCard.matchId) {
        // They match! Add them to matched pairs
        const newMatchedPairs = [...matchedPairs, firstCardId, secondCardId];
        setMatchedPairs(newMatchedPairs);
        setFlippedCards([]); // Reset flipped cards immediately
        
        // Play match sound
        const matchSound = new Audio('/audio/match-sound.mp3');
        matchSound.volume = 0.3;
        matchSound.play().catch(e => console.log("Audio play prevented:", e));
        
        // Check if game is complete
        if (newMatchedPairs.length === cards.length) {
          setGameComplete(true);
          
          // Play completion sound
          const completionSound = new Audio('/audio/game-complete.mp3');
          completionSound.volume = 0.5;
          completionSound.play().catch(e => console.log("Audio play prevented:", e));
        }
      } else {
        // No match, reset after a delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
        
        // Play no match sound
        const noMatchSound = new Audio('/audio/no-match-sound.mp3');
        noMatchSound.volume = 0.2;
        noMatchSound.play().catch(e => console.log("Audio play prevented:", e));
      }
    }
  };
  
  // Determine the grid layout based on difficulty
  const getGridClass = () => {
    switch (difficulty) {
      case 'easy':
        return 'grid-easy'; // 2x4 grid
      case 'medium':
        return 'grid-medium'; // 3x4 grid
      case 'hard':
        return 'grid-hard'; // 4x4 grid
      default:
        return 'grid-easy';
    }
  };
  
  return (
    <div className="memory-game-container">
      {!gameStarted ? (
        <div className="game-setup">
          <h3 className="game-title">Memory Match Challenge</h3>
          <p>Match the shloka words with their meanings!</p>
          
          <div className="difficulty-selection">
            <p>Choose difficulty:</p>
            <div className="difficulty-buttons">
              <button 
                className="difficulty-btn easy" 
                onClick={() => setupGame('easy')}
              >
                Easy (4 pairs)
              </button>
              <button 
                className="difficulty-btn medium" 
                onClick={() => setupGame('medium')}
              >
                Medium (6 pairs)
              </button>
              <button 
                className="difficulty-btn hard" 
                onClick={() => setupGame('hard')}
              >
                Hard (8 pairs)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="game-info">
            <div className="moves-counter">Moves: {moves}</div>
            <div className="pairs-counter">
              Matches: {matchedPairs.length / 2} of {cards.length / 2}
            </div>
            <button 
              className="restart-btn" 
              onClick={() => setupGame(difficulty)}
            >
              Restart
            </button>
          </div>
          
          <div className={`memory-grid ${getGridClass()}`}>
            {cards.map((card) => (
              <div
                key={card.id}
                className={`memory-card ${
                  flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                    ? 'flipped'
                    : ''
                } ${matchedPairs.includes(card.id) ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span role="img" aria-label="Question mark">❓</span>
                  </div>
                  <div className="card-back">
                    <div className="card-emoji">{card.emoji}</div>
                    <div className="card-content">{card.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {gameComplete && (
            <div className="game-complete-message">
              <h3>Great job! You completed the memory game!</h3>
              <p>You found all {cards.length / 2} pairs in {moves} moves.</p>
              <button 
                className="play-again-btn" 
                onClick={() => setGameStarted(false)}
              >
                Play Again with Different Difficulty
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GaneshaMemoryGame;