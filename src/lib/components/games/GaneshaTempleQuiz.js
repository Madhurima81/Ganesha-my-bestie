import React, { useState, useEffect } from 'react';

// Temple progression map quiz component (Option 8)
const GaneshaTempleQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [templeProgress, setTempleProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Quiz questions with temple path steps
  const questions = [
    {
      id: 1,
      question: "What's my name?",
      options: ["Krishna", "Hanuman", "Ganesha", "Shiva"],
      correctAnswer: "Ganesha",
      explanation: "I'm Ganesha, also called Ganapati or Vinayaka. I'm the elephant-headed god!",
      pathLocation: "Village Entrance",
      pathDescription: "You're at the start of the path to Ganesha's temple."
    },
    {
      id: 2,
      question: "When is my birthday celebrated?",
      options: ["Diwali", "Ganesh Chaturthi", "Holi", "Navratri"],
      correctAnswer: "Ganesh Chaturthi",
      explanation: "My birthday is celebrated as Ganesh Chaturthi, a 10-day festival!",
      pathLocation: "Market Square",
      pathDescription: "You've reached the busy market where devotees buy offerings for Ganesha."
    },
    {
      id: 3,
      question: "What's my favorite food?",
      options: ["Dosa", "Modak", "Jalebi", "Biryani"],
      correctAnswer: "Modak",
      explanation: "I love modaks! They're sweet dumplings filled with coconut and jaggery.",
      pathLocation: "Forest Path",
      pathDescription: "You're now walking through a peaceful forest on the way to the temple."
    },
    {
      id: 4,
      question: "What animal is my vehicle?",
      options: ["Lion", "Mouse", "Peacock", "Cow"],
      correctAnswer: "Mouse",
      explanation: "My vehicle is a mouse named Mooshika. Though small, he helps me travel everywhere!",
      pathLocation: "River Crossing",
      pathDescription: "You've reached a river that flows near the temple."
    },
    {
      id: 5,
      question: "Who are my parents?",
      options: ["Vishnu & Lakshmi", "Shiva & Parvati", "Ram & Sita", "Brahma & Saraswati"],
      correctAnswer: "Shiva & Parvati",
      explanation: "My parents are Lord Shiva and Goddess Parvati, two of the most powerful deities!",
      pathLocation: "Temple Steps",
      pathDescription: "You're climbing the steps that lead to Ganesha's temple."
    },
    {
      id: 6,
      question: "What is my superpower?",
      options: ["I can fly", "I can remove obstacles", "I can turn invisible", "I can become super tall"],
      correctAnswer: "I can remove obstacles",
      explanation: "I'm known as the remover of obstacles! People pray to me before starting new things.",
      pathLocation: "Temple Entrance",
      pathDescription: "You're standing at the entrance to Ganesha's beautiful temple."
    },
    {
      id: 7,
      question: "What happened to my head?",
      options: ["I was born with an elephant head", "I lost my head and got an elephant's head", "My head changes shape", "I wear an elephant mask"],
      correctAnswer: "I lost my head and got an elephant's head",
      explanation: "My father Shiva replaced my original head with an elephant's head!",
      pathLocation: "Inner Sanctum",
      pathDescription: "You've reached the sacred inner chamber where Ganesha's statue resides."
    }
  ];
  
  // Path backgrounds for various stages
  const pathBackgrounds = [
    "linear-gradient(135deg, #e3f2fd, #bbdefb)", // Starting point
    "linear-gradient(135deg, #fff9c4, #fff59d)", // Market
    "linear-gradient(135deg, #c8e6c9, #a5d6a7)", // Forest
    "linear-gradient(135deg, #b3e5fc, #81d4fa)", // River
    "linear-gradient(135deg, #d1c4e9, #b39ddb)", // Temple steps
    "linear-gradient(135deg, #ffe0b2, #ffcc80)", // Temple entrance
    "linear-gradient(135deg, #ffcdd2, #ef9a9a)", // Inner sanctum
    "linear-gradient(135deg, #f8bbd0, #f48fb1)"  // Celebration
  ];
  
  // Handle option selection
  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(option);
    const correct = option === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setShowExplanation(true);
      
      // Update temple progress after a delay
      setTimeout(() => {
        setTempleProgress(templeProgress + 1);
        
        // Move to next question after another delay
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowExplanation(false);
          } else {
            // Game completed
            setShowCelebration(true);
            setTimeout(() => {
              setGameCompleted(true);
            }, 3000);
          }
        }, 1500);
      }, 1500);
    } else {
      setShowExplanation(true);
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
    setTempleProgress(0);
    setShowCelebration(false);
  };
  
  // Render confetti animation
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
  
  // Render temple progress map
  const renderTempleMap = () => {
    return (
      <div className="temple-map" style={{
        position: 'relative',
        height: '150px',
        backgroundColor: pathBackgrounds[templeProgress],
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '30px',
        border: '2px solid #8d6e63',
        transition: 'background 1s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Path */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '10%',
          width: '80%',
          height: '10px',
          backgroundColor: '#8d6e63',
          borderRadius: '5px',
          zIndex: 1
        }}>
          {/* Path dots */}
          {questions.map((_, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: '-5px',
                left: `${index * (100 / (questions.length - 1))}%`,
                width: '20px',
                height: '20px',
                backgroundColor: index <= templeProgress ? '#FF9800' : '#e0e0e0',
                borderRadius: '50%',
                transform: 'translateX(-50%)',
                transition: 'background-color 0.5s ease',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: index <= templeProgress ? 'white' : '#666',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Temple at the end */}
        {templeProgress >= questions.length - 1 && (
          <div style={{
            position: 'absolute',
            top: '5px',
            right: '15%',
            width: '50px',
            height: '60px',
            backgroundColor: '#FFB74D',
            borderRadius: '5px 5px 0 0',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            {/* Temple top */}
            <div style={{
              width: '60px',
              height: '20px',
              backgroundColor: '#FF9800',
              borderRadius: '50% 50% 0 0',
              marginTop: '-10px'
            }} />
            {/* Temple door */}
            <div style={{
              width: '15px',
              height: '25px',
              backgroundColor: '#5D1049',
              borderRadius: '5px 5px 0 0',
              marginTop: '10px'
            }} />
          </div>
        )}
        
        {/* Ganesha character */}
        <div style={{
          position: 'absolute',
          bottom: '25px',
          left: `${10 + templeProgress * (80 / (questions.length - 1))}%`,
          width: '30px',
          height: '40px',
          transition: 'left 1s ease',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Ganesha head */}
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#FFB74D',
            borderRadius: '50%',
            position: 'relative'
          }}>
            {/* Trunk */}
            <div style={{
              position: 'absolute',
              width: '7px',
              height: '12px',
              backgroundColor: '#FFB74D',
              borderRadius: '3px',
              bottom: '-5px',
              left: '7px',
              zIndex: 2
            }} />
            
            {/* Eyes */}
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              backgroundColor: 'black',
              borderRadius: '50%',
              top: '7px',
              left: '5px'
            }} />
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              backgroundColor: 'black',
              borderRadius: '50%',
              top: '7px',
              right: '5px'
            }} />
          </div>
          
          {/* Ganesha body */}
          <div style={{
            width: '15px',
            height: '20px',
            backgroundColor: '#FF9800',
            borderRadius: '7px',
            marginTop: '-5px',
            border: '1px solid #e65100'
          }} />
        </div>
        
        {/* Location indicator */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '5px 10px',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#5D1049',
          fontWeight: 'bold',
          zIndex: 2
        }}>
          {questions[Math.min(templeProgress, questions.length - 1)].pathLocation}
        </div>
      </div>
    );
  };
  
  // Render game completed view
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
          You've Reached the Temple!
        </h2>
        
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          maxWidth: '500px',
          margin: '0 auto 30px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="/api/placeholder/300/200"
            alt="Ganesha Temple" 
            style={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}
          />
          
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', marginBottom: '15px' }}>
            Congratulations! You've successfully completed the journey to Ganesha's temple!
          </p>
          
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
            You scored {score} out of {questions.length}! {score === questions.length ? "Perfect score!" : "Well done!"}
          </p>
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
          Start New Journey
        </button>
      </div>
    );
  };
  
  // Render current question
  const renderCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="question-container" style={{
        backgroundColor: '#f9f1ff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontStyle: 'italic',
            color: '#666'
          }}>
            {currentQuestion.pathDescription}
          </p>
        </div>
        
        <h3 style={{ 
          margin: '0 0 20px 0',
          color: '#5D1049',
          fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
          textAlign: 'center'
        }}>
          {currentQuestion.question}
        </h3>
        
        <div className="options-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
                transition: 'background-color 0.3s'
              }}
            >
              {option}
              
              {/* Show correct/incorrect indicators */}
              {selectedOption && option === currentQuestion.correctAnswer && (
                <span style={{ 
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px'
                }}>
                  ✓
                </span>
              )}
              
              {selectedOption === option && option !== currentQuestion.correctAnswer && (
                <span style={{ 
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px'
                }}>
                  ✗
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Explanation */}
        {showExplanation && (
          <div style={{
            backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s'
          }}>
            <p style={{ 
              margin: '0 0 10px 0',
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              fontWeight: 'bold'
            }}>
              {isCorrect 
                ? '🎉 Correct! Moving along the path...' 
                : '😕 Not quite right.'}
            </p>
            
            <p style={{ 
              margin: isCorrect ? 0 : '0 0 15px 0',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              {currentQuestion.explanation}
            </p>
            
            {!isCorrect && (
              <button
                onClick={tryAgain}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="ganesha-temple-quiz" style={{ 
      padding: '15px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ffe8cc 0%, #ffcbe5 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Celebration effects */}
      {showCelebration && renderConfetti()}
      
      <h2 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
        margin: '10px 0 20px 0'
      }}>
        Journey to Ganesha's Temple
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
        color: '#333'
      }}>
        Answer correctly to progress along the path to the temple!
      </p>
      
      {/* Temple progress map */}
      {renderTempleMap()}
      
      {/* Game content */}
      {gameCompleted ? renderGameCompleted() : renderCurrentQuestion()}
      
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

export default GaneshaTempleQuiz;