import React, { useEffect } from 'react';
import '../../styles/components.css';

/**
 * Confetti component for celebration effects
 */
const Confetti = ({ count = 50, colors = ['#FF5722', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'] }) => {
  useEffect(() => {
    // Clean up confetti pieces after animation
    const timeout = setTimeout(() => {
      const confettiPieces = document.querySelectorAll('.confetti-piece');
      confettiPieces.forEach(piece => {
        piece.remove();
      });
    }, 4000); // Match animation duration
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Create confetti pieces
  const confettiPieces = [];
  
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100; // Random horizontal position
    const color = colors[Math.floor(Math.random() * colors.length)]; // Random color
    const delay = Math.random() * 3; // Random animation delay
    
    confettiPieces.push(
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${left}%`,
          backgroundColor: color,
          animationDelay: `${delay}s`
        }}
      />
    );
  }
  
  return <div className="confetti-container">{confettiPieces}</div>;
};

/**
 * Star Rating component
 */
const StarRating = ({ stars, maxStars = 3 }) => {
  return (
    <div className="stars-container">
      {Array.from({ length: maxStars }).map((_, index) => (
        <div 
          key={index} 
          className={`star ${index < stars ? 'earned' : 'unearned'}`}
          style={{ animationDelay: `${0.3 * index}s` }}
        >
          ★
        </div>
      ))}
    </div>
  );
};

/**
 * Celebration - Component to show achievement celebration
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the celebration
 * @param {string} props.message - Congratulatory message
 * @param {number} props.score - Score to display
 * @param {number} props.stars - Number of stars earned (1-3)
 * @param {function} props.onContinue - Function to call when continue button is clicked
 * @param {function} props.onReplay - Function to call when replay button is clicked
 * @param {boolean} props.showConfetti - Whether to show confetti animation
 */
const Celebration = ({
  show = false,
  message = 'Congratulations!',
  score,
  stars = 0,
  onContinue,
  onReplay,
  showConfetti = true,
  ...rest
}) => {
  if (!show) return null;
  
  return (
    <div className="popup-overlay" {...rest}>
      {showConfetti && <Confetti />}
      
      <div className="popup-container" style={{ textAlign: 'center' }}>
        <div className="popup-content">
          <h2>{message}</h2>
          
          {score !== undefined && (
            <div style={{ fontSize: 'var(--font-size-xl)', margin: 'var(--spacing-md) 0' }}>
              Score: {score}
            </div>
          )}
          
          {stars > 0 && <StarRating stars={stars} />}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-lg)'
          }}>
            {onReplay && (
              <button 
                className="game-button game-button-secondary"
                onClick={onReplay}
              >
                Play Again
              </button>
            )}
            
            {onContinue && (
              <button 
                className="game-button game-button-primary"
                onClick={onContinue}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Celebration;