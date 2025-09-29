import React, { useState, useEffect } from 'react';

const MultipleChoice = ({ question, options, correctAnswer, explanation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Reset component when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowConfetti(false);
  }, [question]);
  
  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setShowConfetti(true);
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
    
    // Show explanation after selection
    setShowExplanation(true);
  };
  
  const Confetti = () => {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        {Array.from({ length: 50 }).map((_, index) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 2;
          const delay = Math.random() * 0.5;
          const color = [
            '#ffcc00', '#ff3355', '#5599ff', 
            '#44cc44', '#9966ff', '#ff66cc'
          ][Math.floor(Math.random() * 6)];
          
          return (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: '-20px',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                animation: `fall ${animationDuration}s ease-in ${delay}s forwards`
              }}
            />
          );
        })}
        <style>
          {`
            @keyframes fall {
              0% { transform: translateY(-20px) rotate(0deg); }
              100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
            }
          `}
        </style>
      </div>
    );
  };
  
  return (
    <div className="multiple-choice" style={{ position: 'relative', padding: '15px', maxWidth: '350px' }}>
      {showConfetti && <Confetti />}
      
      <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>{question}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: 'none',
              cursor: selectedOption ? 'default' : 'pointer',
              backgroundColor: selectedOption === option 
                ? (isCorrect ? '#c8e6c9' : '#ffcdd2') 
                : (option === correctAnswer && selectedOption !== null ? '#c8e6c9' : '#f5f5f5'),
              transition: 'background-color 0.3s',
              textAlign: 'left',
              fontSize: '16px'
            }}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showExplanation && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '14px' }}>
            {isCorrect ? '🎉 Correct!' : '❌ Not quite.'}
            {explanation && <span> {explanation}</span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;