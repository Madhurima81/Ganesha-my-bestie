import React, { useState, useEffect } from 'react';

const GaneshaObstacleCourse = () => {
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [pathProgress, setPathProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [obstacleRemoving, setObstacleRemoving] = useState(false);
  const [ganeshaMoving, setGaneshaMoving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Quiz questions based on the About Me document
  const questions = [
    {
      id: 1,
      question: "What's my name?",
      obstacle: "A heavy stone gate blocking the path",
      options: ["Krishna", "Hanuman", "Ganesha", "Shiva"],
      correctAnswer: "Ganesha",
      hint: "I have an elephant head!",
      explanation: "I'm Ganesha, also called Ganapati or Vinayaka. I'm the elephant-headed god!"
    },
    {
      id: 2,
      question: "When is my birthday celebrated?",
      obstacle: "A wide river flowing across the path",
      options: ["Diwali", "Ganesh Chaturthi", "Holi", "Navratri"],
      correctAnswer: "Ganesh Chaturthi",
      hint: "It's in late August or September!",
      explanation: "My birthday is celebrated as Ganesh Chaturthi, a 10-day festival!"
    },
    {
      id: 3,
      question: "What's my favorite food?",
      obstacle: "A pile of huge sweets blocking the way",
      options: ["Dosa", "Modak", "Jalebi", "Biryani"],
      correctAnswer: "Modak",
      hint: "It's a sweet dumpling filled with coconut!",
      explanation: "I love modaks! They're sweet dumplings filled with coconut and jaggery."
    },
    {
      id: 4,
      question: "What animal is my vehicle?",
      obstacle: "A steep cliff that needs climbing",
      options: ["Lion", "Mouse", "Peacock", "Cow"],
      correctAnswer: "Mouse",
      hint: "It's very small but strong!",
      explanation: "My vehicle is a mouse named Mooshika. Though small, he helps me travel everywhere!"
    },
    {
      id: 5,
      question: "Who are my parents?",
      obstacle: "A mysterious foggy area with low visibility",
      options: ["Vishnu & Lakshmi", "Shiva & Parvati", "Ram & Sita", "Brahma & Saraswati"],
      correctAnswer: "Shiva & Parvati",
      hint: "My father is known as the destroyer!",
      explanation: "My parents are Lord Shiva and Goddess Parvati, two of the most powerful deities!"
    },
    {
      id: 6,
      question: "What is my superpower?",
      obstacle: "A massive tangle of vines and thorns",
      options: ["I can fly", "I can remove obstacles", "I can turn invisible", "I can become super tall"],
      correctAnswer: "I can remove obstacles",
      hint: "People pray to me before starting something new!",
      explanation: "I'm known as the remover of obstacles! People pray to me before starting new things."
    },
    {
      id: 7,
      question: "What happened to my head?",
      obstacle: "A maze of confusing paths",
      options: ["I was born with an elephant head", "I lost my head and got an elephant's head", "My head changes shape", "I wear an elephant mask"],
      correctAnswer: "I lost my head and got an elephant's head",
      hint: "My father replaced my original head!",
      explanation: "My father Shiva once cut off my head, and then replaced it with an elephant's head!"
    }
  ];

  // Background positions for the path
  const pathPositions = [
    "0%",   // Starting point
    "15%",  // First obstacle
    "30%",  // Second obstacle
    "42%",  // Third obstacle
    "55%",  // Fourth obstacle
    "70%",  // Fifth obstacle
    "85%",  // Sixth obstacle
    "100%", // Temple (destination)
  ];

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(option);
    const correct = option === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setObstacleRemoving(true);
      
      // Wait for obstacle animation, then move Ganesha
      setTimeout(() => {
        setObstacleRemoving(false);
        setGaneshaMoving(true);
        
        // Wait for Ganesha movement to complete
        setTimeout(() => {
          setGaneshaMoving(false);
          setPathProgress(currentQuestionIndex + 1);
          
          // Move to next question or complete game
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowExplanation(false);
            setShowHint(false);
          } else {
            setShowCelebration(true);
            setTimeout(() => {
              setGameCompleted(true);
            }, 3000);
          }
        }, 2000);
      }, 1500);
    } else {
      // Show explanation after wrong answer
      setShowExplanation(true);
    }
  };

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  // Handle hint request
  const requestHint = () => {
    if (hintsUsed < 3 && !showHint) {
      setShowHint(true);
      setHintsUsed(hintsUsed + 1);
    }
  };

  // Try again after wrong answer
  const tryAgain = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  // Reset the game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setScore(0);
    setGameCompleted(false);
    setPathProgress(0);
    setShowHint(false);
    setHintsUsed(0);
    setShowCelebration(false);
  };

  // Rendering confetti animation
  const renderConfetti = () => {
    return (
      <div className="confetti-container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden'
      }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 2;
          const delay = Math.random() * 0.5;
          const color = [
            '#FFD700', '#FF6347', '#4169E1', 
            '#32CD32', '#9370DB', '#FF69B4'
          ][Math.floor(Math.random() * 6)];
          
          return (
            <div 
              key={i}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: '-20px',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                animation: `fall ${animationDuration}s ease-in ${delay}s forwards`,
                zIndex: 10
              }}
            />
          );
        })}
        <style>
          {`
            @keyframes fall {
              0% { transform: translateY(-20px) rotate(0deg); }
              100% { transform: translateY(800px) rotate(360deg); opacity: 0; }
            }
          `}
        </style>
      </div>
    );
  };

  // Render the completed game view
  const renderGameCompleted = () => {
    return (
      <div className="game-completed" style={{
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2 style={{ 
          color: '#5D1049',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          marginBottom: '20px'
        }}>
          Hooray! All Obstacles Cleared!
        </h2>
        
        <div style={{
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          marginBottom: '20px',
          color: '#4CAF50'
        }}>
          You helped Ganesha reach the temple!
        </div>
        
        <div style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          marginBottom: '30px',
        }}>
          Final Score: {score} out of {questions.length}
        </div>
        
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px'
        }}>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>
            {score === questions.length 
              ? "Amazing! You're a true friend of Ganesha and know everything about me!" 
              : "Thank you for helping me clear these obstacles! Want to try again and learn more?"}
          </p>
        </div>
        
        {/* Stylized Ganesha at temple */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 30px',
          background: 'url("/api/placeholder/200/200") center/contain no-repeat',
          position: 'relative'
        }}>
          {/* This would be replaced with your Ganesha celebration image */}
        </div>
        
        <button
          onClick={resetGame}
          style={{
            padding: '12px 24px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          Play Again
        </button>
      </div>
    );
  };

  // Render the main game
  const renderObstacleCourse = () => {
    return (
      <>
        <div className="path-container" style={{
          position: 'relative',
          height: '150px',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '30px',
          border: '2px solid #8d6e63'
        }}>
          {/* Path background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '20px',
            backgroundColor: '#d7ccc8',
            transform: 'translateY(-50%)',
            zIndex: 1
          }} />
          
          {/* Temple at the end */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            width: '50px',
            height: '80px',
            backgroundColor: '#ffcc80',
            borderRadius: '10px 10px 0 0',
            transform: 'translateY(-50%)',
            zIndex: 2,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '5px'
          }}>
            <div style={{
              width: '15px',
              height: '20px',
              backgroundColor: '#5D1049',
              borderRadius: '5px 5px 0 0'
            }} />
          </div>
          
          {/* Obstacles on the path */}
          {questions.map((question, index) => {
            // Skip rendering cleared obstacles
            if (index < pathProgress) return null;
            
            // Only render the current and next obstacles
            if (index > currentQuestionIndex + 1) return null;

            const isCurrent = index === currentQuestionIndex;
            
            // Determine obstacle appearance based on type
            let obstacleColor, obstacleShape;
            
            switch(index % 5) {
              case 0:
                obstacleColor = '#8d6e63'; // Brown
                obstacleShape = '0';
                break;
              case 1:
                obstacleColor = '#90caf9'; // Blue (river)
                obstacleShape = '50%';
                break;
              case 2:
                obstacleColor = '#4caf50'; // Green (vines)
                obstacleShape = '20% 80%';
                break;
              case 3:
                obstacleColor = '#9c27b0'; // Purple (mysterious fog)
                obstacleShape = '40% 10%';
                break;
              case 4:
                obstacleColor = '#ff9800'; // Orange
                obstacleShape = '10% 50%';
                break;
              default:
                obstacleColor = '#8d6e63';
                obstacleShape = '0';
            }
            
            return (
              <div 
                key={index}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: pathPositions[index],
                  width: isCurrent ? '40px' : '30px',
                  height: isCurrent ? '50px' : '40px',
                  backgroundColor: obstacleColor,
                  borderRadius: obstacleShape,
                  transform: 'translateY(-50%)',
                  zIndex: 3,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.5s ease',
                  opacity: obstacleRemoving && isCurrent ? 0 : 1,
                  scale: obstacleRemoving && isCurrent ? 0.5 : 1
                }}
              />
            );
          })}
          
          {/* Ganesha character */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: pathPositions[pathProgress],
            transform: 'translateY(-50%)',
            width: '40px',
            height: '60px',
            zIndex: 4,
            transition: 'left 2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Ganesha head (circle with trunk) */}
            <div style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#FFB74D',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Trunk */}
              <div style={{
                position: 'absolute',
                width: '10px',
                height: '20px',
                backgroundColor: '#FFB74D',
                borderRadius: '5px',
                bottom: '-5px',
                transform: isCorrect ? 'rotate(20deg)' : 'rotate(0deg)',
                transformOrigin: 'top center',
                transition: 'transform 0.5s ease',
                zIndex: 2
              }} />
              
              {/* Eyes */}
              <div style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: 'black',
                borderRadius: '50%',
                top: '10px',
                left: '8px'
              }} />
              <div style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: 'black',
                borderRadius: '50%',
                top: '10px',
                right: '8px'
              }} />
            </div>
            
            {/* Ganesha body */}
            <div style={{
              width: '25px',
              height: '30px',
              backgroundColor: '#FF9800',
              borderRadius: '10px',
              marginTop: '-5px'
            }} />
          </div>

          {/* Progress indicator */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#5D1049'
          }}>
            {pathProgress} / {questions.length} obstacles cleared
          </div>
        </div>
        
        {/* Current question */}
        <div className="question-container" style={{
          backgroundColor: '#f9f1ff',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
          position: 'relative'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0',
            color: '#5D1049',
            fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
            textAlign: 'center'
          }}>
            Obstacle: {currentQuestion.obstacle}
          </h3>
          
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {currentQuestion.question}
          </p>
          
          {/* Options */}
          <div className="options-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !selectedOption && handleOptionSelect(option)}
                disabled={selectedOption !== null}
                style={{
                  padding: '12px 15px',
                  backgroundColor: selectedOption === option 
                    ? option === currentQuestion.correctAnswer 
                      ? '#c8e6c9' // correct
                      : '#ffcdd2' // incorrect
                    : selectedOption !== null && option === currentQuestion.correctAnswer
                      ? '#c8e6c9' // show correct answer
                      : '#f5f5f5', // default
                  border: 'none',
                  borderRadius: '10px',
                  cursor: selectedOption ? 'default' : 'pointer',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  position: 'relative',
                  textAlign: 'center',
                  transition: 'transform 0.2s, background-color 0.3s',
                  transform: 'scale(1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontWeight: option === currentQuestion.correctAnswer && selectedOption !== null ? 'bold' : 'normal',
                  ':hover': {
                    transform: selectedOption ? 'scale(1)' : 'scale(1.03)'
                  }
                }}
              >
                {option}
                
                {/* Indicators for correct/incorrect answers */}
                {selectedOption && option === currentQuestion.correctAnswer && (
                  <span style={{ 
                    position: 'absolute',
                    right: '10px',
                    fontSize: '16px'
                  }}>
                    ✅
                  </span>
                )}
                
                {selectedOption === option && option !== currentQuestion.correctAnswer && (
                  <span style={{ 
                    position: 'absolute',
                    right: '10px',
                    fontSize: '16px'
                  }}>
                    ❌
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Hint button */}
          {!selectedOption && !showHint && hintsUsed < 3 && (
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <button
                onClick={requestHint}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFB74D',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span style={{ fontSize: '16px' }}>🐁</span>
                Ask Mooshika for a Hint ({3 - hintsUsed} left)
              </button>
            </div>
          )}
          
          {/* Hint display */}
          {showHint && !selectedOption && (
            <div style={{
              backgroundColor: '#fff3e0',
              padding: '10px 15px',
              borderRadius: '8px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeIn 0.5s'
            }}>
              <span style={{ fontSize: '24px' }}>🐁</span>
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                <strong>Mooshika whispers:</strong> {currentQuestion.hint}
              </p>
            </div>
          )}
          
          {/* Explanation */}
          {showExplanation && (
            <div style={{
              backgroundColor: isCorrect ? '#e8f5e9' : '#fff3e0',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s'
            }}>
              <p style={{ 
                margin: '0 0 15px 0',
                fontSize: 'clamp(1rem, 3vw, 1.1rem)'
              }}>
                {isCorrect 
                  ? '🎉 Wonderful! The obstacle is clearing!' 
                  : '😕 That\'s not quite right.'}
              </p>
              <p style={{ 
                margin: 0,
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}
          
          {/* Try again button */}
          {selectedOption && !isCorrect && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={tryAgain}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="ganesha-obstacle-course" style={{ 
      padding: '15px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ffe8cc 0%, #ffcbe5 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Celebration effects */}
      {showCelebration && renderConfetti()}
      
      <h2 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
        margin: '10px 0 20px 0'
      }}>
        Ganesha's Obstacle Course
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
        color: '#333'
      }}>
        Help Ganesha clear obstacles by answering questions about him!
      </p>
      
      {/* Game content */}
      {gameCompleted ? renderGameCompleted() : renderObstacleCourse()}
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          button:hover {
            filter: brightness(1.05);
          }
          
          button:active {
            transform: translateY(1px);
          }
        `}
      </style>
    </div>
  );
};

export default GaneshaObstacleCourse;