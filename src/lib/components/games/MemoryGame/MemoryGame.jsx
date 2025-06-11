// games/MemoryGame/MemoryGame.jsx
import React, { useState, useEffect } from 'react';
import {
  GameContainer,
  GameCard,
  GameButton,
  ProgressBar,
  Timer,
  Celebration,
  useTimer,
  useAudio,
  shuffleArray
} from '../../lib';
import './MemoryGame.css';

// Sound imports
//import clickSound from '../../assets/sounds/click.mp3';
//import matchSound from '../../assets/sounds/match.mp3';
//import successSound from '../../assets/sounds/success.mp3';

const MemoryGame = ({ difficulty = 'easy', onComplete }) => {
  // Game configuration based on difficulty
  const gameConfig = {
    easy: { pairs: 6, timeLimit: 60 },
    medium: { pairs: 8, timeLimit: 90 },
    hard: { pairs: 12, timeLimit: 120 }
  };
  
  const { pairs, timeLimit } = gameConfig[difficulty];
  
  // Game state
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  // Sound effects
  //const playClick = useAudio(clickSound);
  //const playMatch = useAudio(matchSound);
  //const playSuccess = useAudio(successSound);
  
  // Timer
  const timer = useTimer({
    initialTime: timeLimit,
    countDown: true,
    endTime: 0,
    onTimeUp: () => {
      if (matched.length < cards.length / 2) {
        setIsGameOver(true);
      }
    }
  });
  
  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [difficulty]);
  
  const initializeGame = () => {
    // Reset state
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsGameOver(false);
    setIsLevelComplete(false);
    
    // Create card pairs
    const cardSymbols = ['🍎', '🍌', '🍒', '🍊', '🍇', '🍉', '🍓', '🍑', '🍍', '🥝', '🍋', '🥥'];
    const selectedSymbols = cardSymbols.slice(0, pairs);
    
    // Create pairs
    const cardPairs = [...selectedSymbols, ...selectedSymbols];
    
    // Shuffle and create card objects
    const shuffledCards = shuffleArray(cardPairs).map((symbol, index) => ({
      id: index,
      symbol,
      isMatched: false
    }));
    
    setCards(shuffledCards);
    
    // Reset and start timer
    timer.reset(timeLimit);
    timer.start();
  };
  
  // Handle card click
  const handleCardClick = (index) => {
    // Prevent clicking if already flipped or matched
    if (flipped.includes(index) || matched.includes(index) || flipped.length >= 2) {
      return;
    }
    
    playClick.play();
    
    // Flip the card
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    // If two cards are flipped, check for a match
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      // Check if the symbols match
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        playMatch.play();
        setMatched(prev => [...prev, firstIndex, secondIndex]);
        setFlipped([]);
        
        // Check if all cards are matched
        if (matched.length + 2 === cards.length) {
          // Game complete
          handleGameComplete();
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };
  
  // Handle game completion
  const handleGameComplete = () => {
    timer.pause();
    playSuccess.play();
    
    // Delay to let the last match animation finish
    setTimeout(() => {
      setIsLevelComplete(true);
    }, 500);
  };
  
  // Calculate score based on moves and time
  const calculateScore = () => {
    const timeBonus = Math.round((timer.time / timeLimit) * 100);
    const moveEfficiency = Math.max(0, 100 - (moves - pairs) * 5);
    return Math.round((timeBonus + moveEfficiency) / 2);
  };
  
  // Calculate stars based on score
  const calculateStars = (score) => {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    return 1;
  };
  
  // Render game over screen
  if (isGameOver) {
    return (
      <div className="memory-game-container">
        <div className="game-over-message">
          <h2>Time's Up!</h2>
          <p>You matched {matched.length / 2} of {pairs} pairs</p>
          <GameButton onClick={initializeGame}>Try Again</GameButton>
        </div>
      </div>
    );
  }
  
  // Render level complete celebration
  if (isLevelComplete) {
    const score = calculateScore();
    const stars = calculateStars(score);
    
    return (
      <Celebration
        show={true}
        message="Level Complete!"
        subtitle={`You matched all ${pairs} pairs in ${moves} moves`}
        score={score}
        stars={stars}
        onReplay={initializeGame}
        onContinue={() => {
          if (onComplete) {
            onComplete({
              score,
              stars,
              moves,
              timeRemaining: timer.time
            });
          }
        }}
      />
    );
  }
  
  // Render game board
  return (
    <div className="memory-game-container">
      <div className="memory-game-header">
        <div className="memory-game-info">
          <div className="memory-game-stats">
            <div>Moves: {moves}</div>
            <div>Matches: {matched.length / 2} / {pairs}</div>
          </div>
          <Timer
            time={timer.time}
            initial={timeLimit}
            showWarning={timer.time <= 10}
          />
        </div>
        <ProgressBar 
          current={matched.length / 2}
          total={pairs}
          label="Progress"
        />
      </div>
      
      <div className={`memory-game-grid memory-grid-${difficulty}`}>
        {cards.map((card, index) => (
          <GameCard
            key={index}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            isMatched={matched.includes(index)}
            onClick={() => handleCardClick(index)}
            frontContent={<div className="card-back">?</div>}
            backContent={<div className="card-symbol">{card.symbol}</div>}
          />
        ))}
      </div>
      
      <div className="memory-game-controls">
        <GameButton 
          variant="secondary" 
          onClick={initializeGame}
        >
          Restart
        </GameButton>
      </div>
    </div>
  );
};

export default MemoryGame;