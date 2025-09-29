import React, { useState } from 'react';

// Standalone GaneshaAboutMe component with built-in audio button mock
const GaneshaAboutMe = () => {
  // State to track which question is currently expanded
  const [activeQuestion, setActiveQuestion] = useState(null);
  // State to track animations
  const [animateQuestion, setAnimateQuestion] = useState(null);

  // Mock AudioButton component built-in to avoid dependencies
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

  // Define about me questions and answers
  const aboutMeQuestions = [
    {
      id: 1,
      question: "What's my name?",
      answer: "My name is Ganesha! I'm also called Ganapati, Vinayaka, and many other names.",
      emoji: "📛",
      animation: "bounce",
      audioSrc: "/audio/my-name.mp3" // Replace with actual audio file path
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

  // Handle clicking on a question
  const handleQuestionClick = (id) => {
    // If this question is already active, close it
    if (activeQuestion === id) {
      setActiveQuestion(null);
      return;
    }
    
    // Animate the question
    setAnimateQuestion(id);
    setTimeout(() => setAnimateQuestion(null), 1000);
    
    // Set this question as active
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

  return (
    <div className="ganesha-about-me" style={{ 
      padding: '15px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ffe8cc 0%, #ffcbe5 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
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

export default GaneshaAboutMe;