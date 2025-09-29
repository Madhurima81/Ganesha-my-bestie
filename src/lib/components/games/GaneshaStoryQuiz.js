import React, { useState, useEffect } from 'react';

// Visual storytelling quiz component (Option 6)
const GaneshaStoryQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showStory, setShowStory] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Quiz questions and associated story segments
  const questionsWithStories = [
    {
      id: 1,
      question: "What's my name?",
      options: ["Krishna", "Hanuman", "Ganesha", "Shiva"],
      correctAnswer: "Ganesha",
      explanation: "I'm Ganesha, also called Ganapati or Vinayaka!",
      story: {
        title: "The Birth of Ganesha",
        content: "Long ago, Goddess Parvati wanted someone to guard her door while she bathed. She created a boy from the sandalwood paste on her body and gave him life! She named him Ganesha and asked him to allow no one to enter while she bathed.",
        image: "/api/placeholder/300/200"
      }
    },
    {
      id: 2,
      question: "Who are my parents?",
      options: ["Vishnu & Lakshmi", "Shiva & Parvati", "Ram & Sita", "Brahma & Saraswati"],
      correctAnswer: "Shiva & Parvati",
      explanation: "My parents are Lord Shiva and Goddess Parvati.",
      story: {
        title: "Meeting Lord Shiva",
        content: "When Lord Shiva returned home, Ganesha wouldn't let him in because he was following his mother's orders. Shiva became angry that this boy was preventing him from seeing his wife. They began to argue, and the situation quickly escalated.",
        image: "/api/placeholder/300/200"
      }
    },
    {
      id: 3,
      question: "What happened to my head?",
      options: ["I was born with an elephant head", "I lost my head and got an elephant's head", "My head changes shape", "I wear an elephant mask"],
      correctAnswer: "I lost my head and got an elephant's head",
      explanation: "My father Shiva replaced my original head with an elephant's head.",
      story: {
        title: "The Elephant Head",
        content: "In his anger, Lord Shiva cut off Ganesha's head! When Parvati saw this, she was devastated and demanded Shiva restore her son. Shiva promised to replace Ganesha's head with the first living being that came their way - which happened to be an elephant. And so, Ganesha was brought back to life with an elephant's head!",
        image: "/api/placeholder/300/200"
      }
    },
    {
      id: 4,
      question: "What's my favorite food?",
      options: ["Dosa", "Modak", "Jalebi", "Biryani"],
      correctAnswer: "Modak",
      explanation: "I love modaks! They're sweet dumplings filled with coconut and jaggery.",
      story: {
        title: "The Sweet Tooth",
        content: "Ganesha loves sweets, especially modaks! Once, he ate so many modaks that his stomach was about to burst! To keep his stomach from bursting, he caught a snake and tied it around his belly like a belt. That's why you often see Ganesha with a snake around his waist!",
        image: "/api/placeholder/300/200"
      }
    },
    {
      id: 5,
      question: "What is my superpower?",
      options: ["I can fly", "I can remove obstacles", "I can turn invisible", "I can become super tall"],
      correctAnswer: "I can remove obstacles",
      explanation: "I'm known as the remover of obstacles!",
      story: {
        title: "The First God",
        content: "Because of his wisdom and ability to remove obstacles, the gods declared that Ganesha should be worshipped first before beginning any important task. That's why before starting something new, people pray to Ganesha first! He helps clear the path to success and removes any difficulties that might come up.",
        image: "/api/placeholder/300/200"
      }
    }
  ];
  
  // Handle option selection
  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(option);
    const correct = option === questionsWithStories[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      
      // Show story segment after correct answer
      setTimeout(() => {
        setShowStory(true);
        setStoryProgress(storyProgress + 1);
      }, 1000);
    }
  };
  
  // Go to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questionsWithStories.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowStory(false);
    } else {
      // Game completed
      setShowCelebration(true);
      setTimeout(() => {
        setGameCompleted(true);
      }, 3000);
    }
  };
  
  // Try again after wrong answer
  const tryAgain = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };
  
  // Reset the game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowStory(false);
    setScore(0);
    setGameCompleted(false);
    setStoryProgress(0);
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
  
  // Render story segment
  const renderStorySegment = () => {
    const currentStory = questionsWithStories[currentQuestionIndex].story;
    
    return (
      <div className="story-segment" style={{
        backgroundColor: '#fff9c4',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        animation: 'fadeIn 0.5s'
      }}>
        <h3 style={{ 
          color: '#5D1049',
          marginTop: 0,
          marginBottom: '15px',
          fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
          textAlign: 'center'
        }}>
          {currentStory.title}
        </h3>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <img 
            src={currentStory.image} 
            alt={currentStory.title}
            style={{
              width: '100%',
              maxWidth: '300px',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
          
          <p style={{ 
            margin: 0,
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            lineHeight: 1.6
          }}>
            {currentStory.content}
          </p>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={goToNextQuestion}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Continue the Story
          </button>
        </div>
      </div>
    );
  };
  
  // Render story progress
  const renderStoryProgress = () => {
    return (
      <div className="story-progress" style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '15px 0'
      }}>
        {questionsWithStories.map((_, index) => (
          <div 
            key={index}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              margin: '0 5px',
              backgroundColor: index < storyProgress ? '#FF9800' : '#e0e0e0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            {index + 1}
          </div>
        ))}
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
          Ganesha's Story Complete!
        </h2>
        
        <div style={{
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          marginBottom: '20px',
          color: '#4CAF50'
        }}>
          You scored {score} out of {questionsWithStories.length}!
        </div>
        
        <div style={{
          backgroundColor: score === questionsWithStories.length ? '#e8f5e9' : '#fff9c4',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px'
        }}>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>
            {score === questionsWithStories.length 
              ? "Amazing! You've learned Ganesha's complete story!" 
              : "You've learned part of Ganesha's story. Try again to learn more!"}
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
          Start Over
        </button>
      </div>
    );
  };
  
  // Render current question
  const renderCurrentQuestion = () => {
    const currentQuestion = questionsWithStories[currentQuestionIndex];
    
    if (showStory) {
      return renderStorySegment();
    }
    
    return (
      <div className="question-container" style={{
        backgroundColor: '#f9f1ff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0',
          color: '#5D1049',
          fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
          textAlign: 'center'
        }}>
          Question {currentQuestionIndex + 1} of {questionsWithStories.length}
        </h3>
        
        <p style={{ 
          margin: '0 0 20px 0',
          fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center'
        }}>
          {currentQuestion.question}
        </p>
        
        <div className="options-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
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
        
        {/* Feedback and explanation */}
        {selectedOption && (
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
                ? '🎉 Correct! A new part of my story will appear!' 
                : '😕 Not quite right.'}
            </p>
            
            <p style={{ 
              margin: 0,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              {currentQuestion.explanation}
            </p>
            
            {!isCorrect && (
              <button
                onClick={tryAgain}
                style={{
                  marginTop: '10px',
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
    <div className="ganesha-story-quiz" style={{ 
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
        The Story of Ganesha
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
        color: '#333'
      }}>
        Answer questions to unlock parts of my story!
      </p>
      
      {/* Story progress indicator */}
      {renderStoryProgress()}
      
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

export default GaneshaStoryQuiz;