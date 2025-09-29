import React, { useState, useRef, useEffect } from 'react';

// Draggable answers quiz component (Option 2 - Interactive Answering System)
const GaneshaDraggableQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedAnswer, setDraggedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [trunkWiggling, setTrunkWiggling] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [answers, setAnswers] = useState([]);
  
  const dragRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  // Quiz questions based on the About Me document
  const questions = [
    {
      id: 1,
      question: "What's my name?",
      options: ["Krishna", "Hanuman", "Ganesha", "Shiva"],
      correctAnswer: "Ganesha",
      explanation: "I'm Ganesha, also called Ganapati or Vinayaka. I'm the elephant-headed god!"
    },
    {
      id: 2,
      question: "When is my birthday celebrated?",
      options: ["Diwali", "Ganesh Chaturthi", "Holi", "Navratri"],
      correctAnswer: "Ganesh Chaturthi",
      explanation: "My birthday is celebrated as Ganesh Chaturthi, a 10-day festival!"
    },
    {
      id: 3,
      question: "What's my favorite food?",
      options: ["Dosa", "Modak", "Jalebi", "Biryani"],
      correctAnswer: "Modak",
      explanation: "I love modaks! They're sweet dumplings filled with coconut and jaggery."
    },
    {
      id: 4,
      question: "What animal is my vehicle?",
      options: ["Lion", "Mouse", "Peacock", "Cow"],
      correctAnswer: "Mouse",
      explanation: "My vehicle is a mouse named Mooshika. Though small, he helps me travel everywhere!"
    },
    {
      id: 5,
      question: "Who are my parents?",
      options: ["Vishnu & Lakshmi", "Shiva & Parvati", "Ram & Sita", "Brahma & Saraswati"],
      correctAnswer: "Shiva & Parvati",
      explanation: "My parents are Lord Shiva and Goddess Parvati, two of the most powerful deities!"
    }
  ];
  
  // Initialize or shuffle answers for current question
  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      // Create a shuffled copy of the options
      const shuffledOptions = [...questions[currentQuestionIndex].options].sort(() => Math.random() - 0.5);
      setAnswers(shuffledOptions);
      setIsCorrect(null);
      setShowExplanation(false);
    }
  }, [currentQuestionIndex]);
  
  // Handle start of dragging
  const handleDragStart = (e, answer) => {
    setIsDragging(true);
    setDraggedAnswer(answer);
    
    if (dragRef.current) {
      // Initialize position at the center of the element
      const rect = e.target.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  // Handle dragging
  const handleDrag = (e) => {
    if (isDragging && dragRef.current) {
      // Update the dragged element's position
      dragRef.current.style.left = `${e.clientX - dragPosition.x}px`;
      dragRef.current.style.top = `${e.clientY - dragPosition.y}px`;
    }
  };
  
  // Handle release of drag
  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (draggedAnswer && dropZoneRef.current) {
      const dragRect = dragRef.current.getBoundingClientRect();
      const dropRect = dropZoneRef.current.getBoundingClientRect();
      
      // Check if dragged element overlaps with drop zone
      if (
        dragRect.right > dropRect.left &&
        dragRect.left < dropRect.right &&
        dragRect.bottom > dropRect.top &&
        dragRect.top < dropRect.bottom
      ) {
        // Check if answer is correct
        const isAnswerCorrect = draggedAnswer === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(isAnswerCorrect);
        
        if (isAnswerCorrect) {
          setScore(score + 1);
          setTrunkWiggling(true);
          
          // Reset trunk wiggle animation after 2 seconds
          setTimeout(() => {
            setTrunkWiggling(false);
          }, 2000);
          
          // Move to next question after a delay
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
              setGameCompleted(true);
            }
          }, 3000);
        }
        
        setShowExplanation(true);
      }
    }
    
    // Reset dragged element
    if (dragRef.current) {
      dragRef.current.style.left = 'auto';
      dragRef.current.style.top = 'auto';
    }
  };
  
  // Render completed game view
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
          Quiz Completed!
        </h2>
        
        <div style={{
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          marginBottom: '20px',
          color: score === questions.length ? '#4CAF50' : '#FF9800'
        }}>
          You scored {score} out of {questions.length}!
        </div>
        
        <div style={{
          backgroundColor: score === questions.length ? '#e8f5e9' : '#fff9c4',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px'
        }}>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>
            {score === questions.length 
              ? "Amazing! You're a true friend of Ganesha!" 
              : "Good job! Want to try again and learn more?"}
          </p>
        </div>
        
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setGameCompleted(false);
          }}
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
  
  // Render current question
  const renderCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="question-container">
        <h3 style={{ 
          margin: '0 0 20px 0',
          color: '#5D1049',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          textAlign: 'center'
        }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        
        <div className="ganesha-container" style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          position: 'relative',
          height: '200px'
        }}>
          {/* Ganesha character */}
          <div style={{
            width: '150px',
            height: '200px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Ganesha head (circle with trunk) */}
            <div style={{
              width: '80px',
              height: '80px',
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
                width: '30px',
                height: '60px',
                backgroundColor: '#FFB74D',
                borderRadius: '15px',
                bottom: '-30px',
                transform: trunkWiggling ? 'rotate(20deg)' : 'rotate(0deg)',
                transformOrigin: 'top center',
                transition: 'transform 0.5s ease',
                animation: trunkWiggling ? 'wiggle 0.5s infinite alternate' : 'none',
                zIndex: 2
              }} />
              
              {/* Eyes */}
              <div style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: 'black',
                borderRadius: '50%',
                top: '25px',
                left: '20px'
              }} />
              <div style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: 'black',
                borderRadius: '50%',
                top: '25px',
                right: '20px'
              }} />
            </div>
            
            {/* Ganesha body */}
            <div style={{
              width: '90px',
              height: '100px',
              backgroundColor: '#FF9800',
              borderRadius: '40px 40px 30px 30px',
              marginTop: '-10px',
              border: '2px solid #e65100'
            }} />
          </div>
          
          {/* Drop zone */}
          <div 
            ref={dropZoneRef}
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              width: '120px',
              height: '70px',
              border: '2px dashed #5D1049',
              borderRadius: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              transform: 'translateX(-50%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#666',
              fontSize: '12px',
              pointerEvents: 'none'
            }}
          >
            Drop Answer Here
          </div>
        </div>
        
        <div className="question-text" style={{
          backgroundColor: '#f9f1ff',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {currentQuestion.question}
          </p>
        </div>
        
        {/* Draggable answers */}
        <div className="answers-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {answers.map((answer, index) => (
            <div
              key={index}
              className={answer === draggedAnswer ? 'dragging' : ''}
              ref={answer === draggedAnswer ? dragRef : null}
              onMouseDown={(e) => handleDragStart(e, answer)}
              onMouseMove={isDragging ? handleDrag : null}
              onMouseUp={isDragging ? handleDragEnd : null}
              onMouseLeave={isDragging ? handleDragEnd : null}
              style={{
                padding: '10px 15px',
                backgroundColor: '#f5f5f5',
                border: '2px solid #ccc',
                borderRadius: '10px',
                cursor: 'grab',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                textAlign: 'center',
                userSelect: 'none',
                position: answer === draggedAnswer && isDragging ? 'absolute' : 'relative',
                zIndex: answer === draggedAnswer && isDragging ? 100 : 1,
                opacity: answer === draggedAnswer && isDragging ? 0.8 : 1,
                touchAction: 'none'
              }}
            >
              {answer}
            </div>
          ))}
        </div>
        
        {/* Explanation */}
        {showExplanation && (
          <div style={{
            backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
            padding: '15px',
            borderRadius: '12px',
            marginTop: '20px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s'
          }}>
            <p style={{ 
              margin: '0 0 10px 0',
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              fontWeight: 'bold'
            }}>
              {isCorrect 
                ? '🎉 Correct! Ganesha is happy!' 
                : '😕 Not quite right. Try another answer!'}
            </p>
            
            {isCorrect && (
              <p style={{ 
                margin: 0,
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="ganesha-draggable-quiz" style={{ 
      padding: '15px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ffe8cc 0%, #ffcbe5 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
        margin: '10px 0 20px 0'
      }}>
        Feed Ganesha The Right Answer!
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
        color: '#333'
      }}>
        Drag the correct answer and drop it for Ganesha!
      </p>
      
      {gameCompleted ? renderGameCompleted() : renderCurrentQuestion()}
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes wiggle {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(20deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GaneshaDraggableQuiz;