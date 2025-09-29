import React, { useState } from 'react';

const GaneshaQuizGame = () => {
  // Different game modes
  const MODES = {
    ABOUT: 'about',
    QUIZ: 'quiz',
    LEARN_MORE: 'learnMore'
  };

  // State to track current game mode
  const [gameMode, setGameMode] = useState(MODES.ABOUT);
  
  // State for About Me section
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [animateQuestion, setAnimateQuestion] = useState(null);
  
  // State for Quiz section
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Define about me questions and answers - same as before
  const aboutMeQuestions = [
    {
      id: 1,
      question: "What's my name?",
      answer: "My name is Ganesha! I'm also called Ganapati, Vinayaka, and many other names.",
      emoji: "📛",
      animation: "bounce",
      audioSrc: "/audio/my-name.mp3"
    },
    {
      id: 2,
      question: "Who are my parents?",
      answer: "My father is Lord Shiva and my mother is Goddess Parvati. They are very powerful and loving!",
      emoji: "👪",
      animation: "heartbeat",
      audioSrc: "/audio/my-parents.mp3"
    },
    {
      id: 3,
      question: "Why do I have an elephant head?",
      answer: "My father Shiva once replaced my head with an elephant's head. It makes me special and helps me remove obstacles!",
      emoji: "🐘",
      animation: "wobble",
      audioSrc: "/audio/elephant-head.mp3"
    },
    {
      id: 4,
      question: "What's my favorite food?",
      answer: "I love modaks! They are sweet dumplings filled with coconut and jaggery. Yum!",
      emoji: "🍬",
      animation: "jump",
      audioSrc: "/audio/favorite-food.mp3"
    },
    {
      id: 5,
      question: "What's my special power?",
      answer: "I remove obstacles and bring good luck! When people start something new, they pray to me first.",
      emoji: "✨",
      animation: "sparkle",
      audioSrc: "/audio/special-power.mp3"
    },
    {
      id: 6,
      question: "Who is my special friend?",
      answer: "My special friend is a mouse named Mooshika! He is small but very smart and helps me travel everywhere.",
      emoji: "🐁",
      animation: "slide",
      audioSrc: "/audio/special-friend.mp3"
    },
    {
      id: 7,
      question: "What do I like to do?",
      answer: "I love writing, learning, and helping others! I'm known as the lord of wisdom and knowledge.",
      emoji: "📚",
      animation: "flip",
      audioSrc: "/audio/what-i-do.mp3"
    },
    {
      id: 8,
      question: "What's special about my trunk?",
      answer: "My trunk is curved and very powerful! I can use it to bless people and remove their troubles.",
      emoji: "💫",
      animation: "wave",
      audioSrc: "/audio/special-trunk.mp3"
    }
  ];

  // Define quiz questions with multiple choice options
  const quizQuestions = [
    {
      question: "What is Ganesha's favorite food?",
      options: ["Ice cream", "Modak", "Pizza", "Chocolate"],
      correctAnswer: "Modak",
      explanation: "Ganesha loves modaks! They are sweet dumplings filled with coconut and jaggery."
    },
    {
      question: "Who are Ganesha's parents?",
      options: ["Vishnu and Lakshmi", "Brahma and Saraswati", "Shiva and Parvati", "Indra and Sachi"],
      correctAnswer: "Shiva and Parvati",
      explanation: "Ganesha's father is Lord Shiva and his mother is Goddess Parvati."
    },
    {
      question: "What animal is Ganesha's special friend?",
      options: ["Elephant", "Lion", "Mouse", "Peacock"],
      correctAnswer: "Mouse",
      explanation: "Ganesha's special friend is a mouse named Mooshika who helps him travel."
    },
    {
      question: "What is Ganesha known as the lord of?",
      options: ["War", "Water", "Wisdom", "Weather"],
      correctAnswer: "Wisdom",
      explanation: "Ganesha is known as the lord of wisdom and knowledge."
    },
    {
      question: "What is special about Ganesha's trunk?",
      options: ["It's very short", "It's curved", "It's blue", "It can change color"],
      correctAnswer: "It's curved",
      explanation: "Ganesha's trunk is curved and very powerful! He can use it to bless people."
    }
  ];

  // Learn more fun facts about Ganesha
  const learnMoreFacts = [
    {
      title: "Ganesha's Birth",
      content: "One story says that Goddess Parvati created Ganesha from the sandalwood paste she used for her bath! She gave him life and asked him to guard her door while she bathed.",
      image: "/api/placeholder/150/150"
    },
    {
      title: "How Ganesha Got His Elephant Head",
      content: "When Lord Shiva returned home, Ganesha didn't let him enter because Parvati was bathing. Shiva got angry and cut off Ganesha's head! To console Parvati, Shiva replaced it with the head of an elephant.",
      image: "/api/placeholder/150/150"
    },
    {
      title: "The Broken Tusk",
      content: "Ganesha broke his own tusk to write the Mahabharata! When the sage Vyasa needed someone to write down the epic poem, Ganesha used his broken tusk as a pen.",
      image: "/api/placeholder/150/150"
    },
    {
      title: "First to be Worshipped",
      content: "Ganesha is the first god people pray to before starting anything new. That's why he's called 'Vighnaharta' - the remover of obstacles!",
      image: "/api/placeholder/150/150"
    },
    {
      title: "The Sweet Tooth",
      content: "Ganesha loves sweets, especially modaks! During Ganesh Chaturthi (his birthday festival), people offer him 21 modaks.",
      image: "/api/placeholder/150/150"
    }
  ];

  // Mock AudioButton component built-in
  const AudioButton = ({ audioSrc, iconType = 'play', size = 'medium' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    const sizeMap = {
      small: { width: 30, height: 30, iconSize: 16 },
      medium: { width: 40, height: 40, iconSize: 24 },
      large: { width: 50, height: 50, iconSize: 32 }
    };
    
    const dimensions = sizeMap[size] || sizeMap.medium;
    
    const togglePlayback = () => {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        setTimeout(() => {
          setIsPlaying(false);
        }, 2000);
      }
    };
    
    const icons = {
      sound: {
        play: <svg xmlns="http://www.w3.org/2000/svg" width={dimensions.iconSize} height={dimensions.iconSize} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>,
        pause: <svg xmlns="http://www.w3.org/2000/svg" width={dimensions.iconSize} height={dimensions.iconSize} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm7 1.14L8.14 12 10 13.86v-3.72zm7.5-1.5c0 3.11-2.39 5.64-5.5 5.89V20a7.99 7.99 0 0 0 7.5-7.5h-2zm-11 4.72L3.28 12 6.5 8.78v4.58z"/></svg>
      }
    };
    
    const currentIcon = isPlaying ? icons[iconType].pause : icons[iconType].play;
    
    return (
      <button 
        onClick={togglePlayback}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: '50%',
          background: isPlaying ? 'rgba(244, 67, 54, 0.9)' : 'rgba(76, 175, 80, 0.9)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }}
        title={isPlaying ? "Pause" : "Play"}
      >
        {currentIcon}
      </button>
    );
  };

  // Handle clicking on an about me question
  const handleQuestionClick = (id) => {
    if (activeQuestion === id) {
      setActiveQuestion(null);
      return;
    }
    
    setAnimateQuestion(id);
    setTimeout(() => setAnimateQuestion(null), 1000);
    
    setActiveQuestion(id);
  };

  // Get animation class based on the animation type
  const getAnimationClass = (animationType) => {
    switch (animationType) {
      case 'bounce':
        return 'animate-bounce';
      case 'heartbeat':
        return 'animate-heartbeat';
      case 'wobble':
        return 'animate-wobble';
      case 'jump':
        return 'animate-jump';
      case 'sparkle':
        return 'animate-sparkle';
      case 'slide':
        return 'animate-slide';
      case 'flip':
        return 'animate-flip';
      case 'wave':
        return 'animate-wave';
      default:
        return '';
    }
  };
  
  // Handle quiz option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowResult(true);
    
    // Check if answer is correct
    if (option === quizQuestions[currentQuizQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };
  
  // Go to next quiz question
  const goToNextQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };
  
  // Reset quiz to play again
  const resetQuiz = () => {
    setCurrentQuizQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  // Switch between game modes (About, Quiz, Learn More)
  const switchMode = (mode) => {
    setGameMode(mode);
    
    // Reset states when switching modes
    if (mode === MODES.QUIZ) {
      resetQuiz();
    } else if (mode === MODES.ABOUT) {
      setActiveQuestion(null);
    }
  };

  // Render the About Me section
  const renderAboutMe = () => {
    return (
      <>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#5D1049',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          margin: '10px 0 20px 0'
        }}>
          All About Ganesha!
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          fontSize: 'clamp(1rem, 3vw, 1.2rem)',
          color: '#333'
        }}>
          Tap on a question to learn about me!
        </p>
        
        <div className="questions-container" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {aboutMeQuestions.map((item) => (
            <div
              key={item.id}
              className={`question-card ${activeQuestion === item.id ? 'active' : ''} ${animateQuestion === item.id ? getAnimationClass(item.animation) : ''}`}
              onClick={() => handleQuestionClick(item.id)}
              style={{
                backgroundColor: activeQuestion === item.id ? '#ffffff' : '#f9f1ff',
                padding: '15px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: activeQuestion === item.id ? 'scale(1.05)' : 'scale(1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ 
                  margin: '0 0 10px 0',
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  color: '#5D1049'
                }}>
                  {item.question}
                </h3>
                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
              </div>
              
              {activeQuestion === item.id && (
                <div className="answer-container" style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 235, 205, 0.5)',
                  borderRadius: '8px',
                  animationName: 'fadeIn',
                  animationDuration: '0.5s'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
                    {item.answer}
                  </p>
                  
                  {item.audioSrc && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <AudioButton 
                        audioSrc={item.audioSrc}
                        iconType="sound"
                        size="small"
                      />
                      <span style={{ 
                        marginLeft: '10px', 
                        fontSize: '14px',
                        alignSelf: 'center',
                        color: '#666'
                      }}>
                        Listen
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="fun-fact" style={{
          backgroundColor: '#e0f7fa',
          padding: '15px',
          borderRadius: '12px',
          margin: '20px 0',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0',
            color: '#00695c',
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
          }}>
            Fun Fact! ✨
          </h3>
          <p style={{ margin: '0', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
            I wrote down the Mahabharata, one of the longest poems in the world! 
            My trunk helped me write really fast!
          </p>
        </div>
      </>
    );
  };

  // Render the Quiz section
  const renderQuiz = () => {
    if (quizCompleted) {
      return (
        <div className="quiz-completed" style={{
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
            color: score === quizQuestions.length ? '#4CAF50' : '#FF9800'
          }}>
            You scored {score} out of {quizQuestions.length}!
          </div>
          
          {score === quizQuestions.length ? (
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <p>Amazing! You know everything about me! You're a true Ganesha expert! 🎉</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fff9c4',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <p>Good job! Want to learn more about me and try again?</p>
            </div>
          )}
          
          <button
            onClick={resetQuiz}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              cursor: 'pointer',
              marginRight: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            Play Again
          </button>
          
          <button
            onClick={() => switchMode(MODES.ABOUT)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            Learn About Me
          </button>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuizQuestion];
    
    return (
      <div className="quiz-container">
        <h2 style={{ 
          textAlign: 'center', 
          color: '#5D1049',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          margin: '10px 0 20px 0'
        }}>
          Ganesha Quiz Challenge
        </h2>
        
        <div className="progress-bar" style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#e0e0e0',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            borderRadius: '5px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ color: '#666', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
            Question {currentQuizQuestion + 1} of {quizQuestions.length}
          </span>
        </div>
        
        <div className="question-container" style={{
          backgroundColor: '#f9f1ff',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0',
            color: '#333',
            fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
            textAlign: 'center'
          }}>
            {currentQuestion.question}
          </h3>
          
          <div className="options-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleOptionSelect(option)}
                style={{
                  padding: '15px',
                  backgroundColor: 
                    showResult 
                      ? option === currentQuestion.correctAnswer 
                        ? '#c8e6c9' // Correct answer (green)
                        : option === selectedOption 
                          ? '#ffcdd2' // Selected wrong answer (red)
                          : '#f5f5f5' // Other options
                      : '#f5f5f5', // Default color
                  border: showResult && option === selectedOption ? '2px solid #666' : '2px solid transparent',
                  borderRadius: '10px',
                  cursor: showResult ? 'default' : 'pointer',
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                  textAlign: 'left',
                  position: 'relative',
                  transition: 'background-color 0.3s'
                }}
                disabled={showResult}
              >
                {option}
                
                {showResult && option === currentQuestion.correctAnswer && (
                  <span style={{ 
                    position: 'absolute',
                    right: '15px',
                    fontSize: '20px'
                  }}>
                    ✅
                  </span>
                )}
                
                {showResult && option === selectedOption && option !== currentQuestion.correctAnswer && (
                  <span style={{ 
                    position: 'absolute',
                    right: '15px',
                    fontSize: '20px'
                  }}>
                    ❌
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {showResult && (
          <div className="result-container" style={{
            backgroundColor: selectedOption === currentQuestion.correctAnswer ? '#e8f5e9' : '#ffebee',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            animationName: 'fadeIn',
            animationDuration: '0.5s'
          }}>
            <p style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              {selectedOption === currentQuestion.correctAnswer 
                ? '🎉 Correct! Great job!' 
                : '😕 Not quite right. Try to remember!'}
            </p>
            
            {!showExplanation ? (
              <button
                onClick={() => setShowExplanation(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  cursor: 'pointer'
                }}
              >
                Tell Me Why
              </button>
            ) : (
              <p style={{ 
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: '10px',
                borderRadius: '8px'
              }}>
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}
        
        {showResult && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={goToNextQuestion}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {currentQuizQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render the Learn More section
  const renderLearnMore = () => {
    return (
      <>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#5D1049',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          margin: '10px 0 20px 0'
        }}>
          Learn More About Ganesha!
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          fontSize: 'clamp(1rem, 3vw, 1.2rem)',
          color: '#333'
        }}>
          Discover interesting stories and facts about me!
        </p>
        
        <div className="learn-more-container">
          {learnMoreFacts.map((fact, index) => (
            <div 
              key={index}
              className="fact-card"
              style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <h3 style={{
                color: '#5D1049',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
                textAlign: 'center',
                margin: 0
              }}>
                {fact.title}
              </h3>
              
              <img 
                src={fact.image} 
                alt={fact.title}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
              
              <p style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: '1.6',
                margin: 0
              }}>
                {fact.content}
              </p>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Render navigation tabs
  const renderTabs = () => {
    return (
      <div className="tabs" style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'white',
        padding: '10px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '0 0 15px 15px'
      }}>
        <button
          onClick={() => switchMode(MODES.ABOUT)}
          style={{
            padding: '10px 20px',
            backgroundColor: gameMode === MODES.ABOUT ? '#FF9800' : '#f5f5f5',
            color: gameMode === MODES.ABOUT ? 'white' : '#333',
            border: 'none',
            borderRadius: '30px',
            margin: '0 5px',
            cursor: 'pointer',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: gameMode === MODES.ABOUT ? 'bold' : 'normal',
            boxShadow: gameMode === MODES.ABOUT ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.3s'
          }}
        >
          About Me
        </button>
        
        <button
          onClick={() => switchMode(MODES.QUIZ)}
          style={{
            padding: '10px 20px',
            backgroundColor: gameMode === MODES.QUIZ ? '#4CAF50' : '#f5f5f5',
            color: gameMode === MODES.QUIZ ? 'white' : '#333',
            border: 'none',
            borderRadius: '30px',
            margin: '0 5px',
            cursor: 'pointer',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: gameMode === MODES.QUIZ ? 'bold' : 'normal',
            boxShadow: gameMode === MODES.QUIZ ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.3s'
          }}
        >
          Quiz Game
        </button>
        
        <button
          onClick={() => switchMode(MODES.LEARN_MORE)}
          style={{
            padding: '10px 20px',
            backgroundColor: gameMode === MODES.LEARN_MORE ? '#2196F3' : '#f5f5f5',
            color: gameMode === MODES.LEARN_MORE ? 'white' : '#333',
            border: 'none',
            borderRadius: '30px',
            margin: '0 5px',
            cursor: 'pointer',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: gameMode === MODES.LEARN_MORE ? 'bold' : 'normal',
            boxShadow: gameMode === MODES.LEARN_MORE ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.3s'
          }}
        >
          Learn More
        </button>
      </div>
    );
  };

  // Main render function
  return (
    <div className="ganesha-quiz-game" style={{ 
      padding: '15px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ffe8cc 0%, #ffcbe5 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      {renderTabs()}
      
      <div className="content-container" style={{ padding: '10px' }}>
        {gameMode === MODES.ABOUT && renderAboutMe()}
        {gameMode === MODES.QUIZ && renderQuiz()}
        {gameMode === MODES.LEARN_MORE && renderLearnMore()}
      </div>
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes wobble {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          
          @keyframes jump {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-15px) scale(1.05); }
          }
          
          @keyframes sparkle {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.3); }
          }
          
          @keyframes slide {
            0% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
          }
          
          @keyframes flip {
            0% { transform: rotateY(0); }
            100% { transform: rotateY(180deg); }
          }
          
          @keyframes wave {
            0% { transform: rotate(0); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0); }
          }
          
          .animate-bounce { animation: bounce 0.5s ease-in-out; }
          .animate-heartbeat { animation: heartbeat 0.5s ease-in-out; }
          .animate-wobble { animation: wobble 0.5s ease-in-out; }
          .animate-jump { animation: jump 0.5s ease-in-out; }
          .animate-sparkle { animation: sparkle 0.5s ease-in-out; }
          .animate-slide { animation: slide 0.5s ease-in-out; }
          .animate-flip { animation: flip 0.5s ease-in-out; }
          .animate-wave { animation: wave 0.5s ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default GaneshaQuizGame;