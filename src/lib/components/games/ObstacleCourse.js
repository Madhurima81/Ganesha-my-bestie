import React, { useState, useEffect } from 'react';

const ObstacleCourse = () => {
  // State variables
  const [currentStage, setCurrentStage] = useState(0);
  const [isReciting, setIsReciting] = useState(false);
  const [obstacleRemoved, setObstacleRemoved] = useState(false);
  const [characterMoving, setCharacterMoving] = useState(false);
  const [message, setMessage] = useState("Help our character overcome obstacles with Ganesha's shloka!");
  const [completedJourney, setCompletedJourney] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Define the narrative stages
  const stages = [
    {
      id: 'school-test',
      character: '👧',
      setting: 'School',
      obstacle: 'Big Test',
      obstacleEmoji: '📝',
      obstacleDescription: "Oh no! There's a big, scary test today. The questions look really hard!",
      shlokaEffect: "After saying the shloka, the character feels calmer and more focused. The test doesn't seem as scary anymore!",
      backgroundColor: '#E3F2FD', // Light blue
      obstacleColor: '#0D47A1' // Dark blue
    },
    {
      id: 'friendship',
      character: '👦',
      setting: 'Playground',
      obstacle: 'Making Friends',
      obstacleEmoji: '👥',
      obstacleDescription: "It's hard to make new friends. What if the other kids don't like you?",
      shlokaEffect: "After saying the shloka, the character feels more confident. Making friends seems easier now!",
      backgroundColor: '#E8F5E9', // Light green
      obstacleColor: '#2E7D32' // Dark green
    },
    {
      id: 'performance',
      character: '🧒',
      setting: 'School Play',
      obstacle: 'Stage Fright',
      obstacleEmoji: '🎭',
      obstacleDescription: "Everyone is watching. Your legs are shaking and you've forgotten your lines!",
      shlokaEffect: "After saying the shloka, the character feels brave and remembers all the lines perfectly!",
      backgroundColor: '#FFF3E0', // Light orange
      obstacleColor: '#E65100' // Dark orange
    },
    {
      id: 'difficult-puzzle',
      character: '👧',
      setting: 'Home',
      obstacle: 'Hard Puzzle',
      obstacleEmoji: '🧩',
      obstacleDescription: "This puzzle is so difficult! The pieces don't seem to fit no matter how hard you try.",
      shlokaEffect: "After saying the shloka, the character's mind becomes clear. The puzzle pieces start making sense!",
      backgroundColor: '#F3E5F5', // Light purple
      obstacleColor: '#6A1B9A' // Dark purple
    },
    {
      id: 'sports-game',
      character: '👦',
      setting: 'Sports Field',
      obstacle: 'Big Game',
      obstacleEmoji: '⚽',
      obstacleDescription: "It's the final game and everyone is counting on you. The pressure feels overwhelming!",
      shlokaEffect: "After saying the shloka, the character feels strong and ready. They play their best game ever!",
      backgroundColor: '#FFEBEE', // Light red
      obstacleColor: '#B71C1C' // Dark red
    }
  ];

  // Get current stage info
  const currentStageInfo = stages[currentStage];

  // Effect to reset state when stage changes
  useEffect(() => {
    setIsReciting(false);
    setObstacleRemoved(false);
    setCharacterMoving(false);
    
    // Update the message for the new stage
    setMessage(currentStageInfo.obstacleDescription);
  }, [currentStage, currentStageInfo.obstacleDescription]);

  // Handle reciting the shloka
  const handleReciteShloka = () => {
    if (isReciting || obstacleRemoved) return;
    
    setIsReciting(true);
    setShowHint(false);
    setMessage("Chanting the Vakratunda Mahakaya shloka...");
    
    // Simulate time taken to recite shloka
    setTimeout(() => {
      setIsReciting(false);
      setObstacleRemoved(true);
      setMessage(currentStageInfo.shlokaEffect);
      
      // After obstacle is removed, move character
      setTimeout(() => {
        setCharacterMoving(true);
        
        // After character moves, check if journey is complete or go to next stage
        setTimeout(() => {
          if (currentStage >= stages.length - 1) {
            // Journey completed!
            setCompletedJourney(true);
            setShowConfetti(true);
            setMessage("Congratulations! You've completed the journey with Ganesha's help!");
            
            // Hide confetti after a while
            setTimeout(() => {
              setShowConfetti(false);
            }, 5000);
          } else {
            // Move to next stage
            setCurrentStage(currentStage + 1);
          }
        }, 2000);
      }, 1500);
    }, 3000);
  };

  // Reset the entire journey
  const resetJourney = () => {
    setCurrentStage(0);
    setIsReciting(false);
    setObstacleRemoved(false);
    setCharacterMoving(false);
    setCompletedJourney(false);
    setMessage("Help our character overcome obstacles with Ganesha's shloka!");
    setShowHint(true);
  };

  return (
    <div className="obstacle-course-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '15px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        marginBottom: '15px'
      }}>
        The Obstacle Course
      </h2>
      
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: '#333',
        marginBottom: '20px'
      }}>
        Help our character overcome life's obstacles with Ganesha's shloka!
      </p>
      
      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        backgroundColor: 'white',
        padding: '10px 15px',
        borderRadius: '30px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <span style={{ 
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
          color: '#666' 
        }}>
          Stage: {currentStage + 1}/{stages.length}
        </span>
        
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {stages.map((_, index) => (
            <div
              key={index}
              style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: index < currentStage ? '#4CAF50' // completed
                  : index === currentStage ? '#2196F3' // current
                  : '#e0e0e0', // upcoming
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>
        
        <button
          onClick={resetJourney}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#5D1049',
            cursor: 'pointer',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>↺</span> Reset
        </button>
      </div>
      
      {/* Main story scene */}
      <div style={{
        backgroundColor: currentStageInfo.backgroundColor,
        borderRadius: '15px',
        padding: '15px',
        height: '250px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.5s ease',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Stage setting label */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '5px 12px',
          borderRadius: '15px',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {currentStageInfo.setting}
        </div>
        
        {/* Path line */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '10%',
          width: '80%',
          height: '10px',
          backgroundColor: '#8d6e63', // Brown path
          borderRadius: '5px',
          zIndex: 1
        }} />
        
        {/* Character */}
        <div style={{
          position: 'absolute',
          bottom: '70px',
          left: characterMoving ? '75%' : '20%',
          fontSize: '40px',
          transition: 'left 2s ease',
          zIndex: 3
        }}>
          {currentStageInfo.character}
        </div>
        
        {/* Obstacle */}
        <div style={{
          position: 'absolute',
          bottom: '70px',
          left: '60%',
          backgroundColor: currentStageInfo.obstacleColor,
          width: '50px',
          height: '50px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'white',
          opacity: obstacleRemoved ? 0 : 1,
          transform: obstacleRemoved ? 'scale(0.5)' : 'scale(1)',
          transition: 'opacity 1s ease, transform 1s ease',
          zIndex: 2
        }}>
          {currentStageInfo.obstacleEmoji}
        </div>
        
        {/* Ganesha appears when reciting */}
        {isReciting && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
            animation: 'float 2s infinite ease-in-out',
            zIndex: 4
          }}>
            🐘
          </div>
        )}
        
        {/* Hint animation on first stage */}
        {showHint && currentStage === 0 && (
          <div style={{
            position: 'absolute',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            zIndex: 10
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '8px 15px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}>
              <span style={{ fontSize: '20px', marginBottom: '5px' }}>👇</span>
              <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: 'bold' }}>
                Click "Recite Shloka" button!
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Message area */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        {message}
      </div>
      
      {/* Action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '15px',
        gap: '20px'
      }}>
        <button
          onClick={handleReciteShloka}
          disabled={isReciting || obstacleRemoved || characterMoving || completedJourney}
          style={{
            backgroundColor: isReciting || obstacleRemoved || characterMoving || completedJourney 
              ? '#e0e0e0' 
              : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 25px',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            cursor: isReciting || obstacleRemoved || characterMoving || completedJourney 
              ? 'default' 
              : 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s',
            animation: showHint ? 'pulse 1.5s infinite' : 'none'
          }}
        >
          {isReciting ? "Reciting..." : "Recite Shloka"}
        </button>
        
        {completedJourney && (
          <button
            onClick={resetJourney}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '12px 25px',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              animation: 'pulse 2s infinite'
            }}
          >
            Play Again
          </button>
        )}
      </div>
      
      {/* Shloka display */}
      <div style={{
        backgroundColor: isReciting ? '#FFF8E1' : 'transparent', // Light yellow when reciting
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '15px',
        textAlign: 'center',
        boxShadow: isReciting ? '0 0 15px rgba(255, 193, 7, 0.3)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontStyle: 'italic',
          color: isReciting ? '#5D4037' : '#666',
          fontWeight: isReciting ? 'bold' : 'normal'
        }}>
          {isReciting ? (
            <span style={{ animation: 'fadeIn 1s' }}>
              "Vakratunda Mahakaya Suryakoti Samaprabha<br />
              Nirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada"
            </span>
          ) : (
            <span>The Vakratunda Mahakaya shloka helps overcome obstacles!</span>
          )}
        </p>
      </div>
      
      {/* Celebration effect */}
      {showConfetti && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 0.5;
            const color = [
              '#FF9800', '#2196F3', '#4CAF50', 
              '#E91E63', '#9C27B0', '#FFEB3B'
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
                  animation: `fall ${animationDuration}s ease-in ${animationDelay}s forwards`
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Journey completed view */}
      {completedJourney && (
        <div style={{
          backgroundColor: '#E8F5E9',
          padding: '15px',
          borderRadius: '15px',
          marginTop: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.5s'
        }}>
          <h3 style={{ 
            textAlign: 'center', 
            color: '#2E7D32',
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            marginTop: 0
          }}>
            You've Completed All Obstacles!
          </h3>
          
          <p style={{ 
            textAlign: 'center',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            marginBottom: '15px'
          }}>
            Ganesha's shloka helped our characters overcome:
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            {stages.map((stage, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <span>{stage.obstacleEmoji}</span>
                <span>{stage.obstacle}</span>
              </div>
            ))}
          </div>
          
          <p style={{ 
            textAlign: 'center',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            backgroundColor: '#C8E6C9',
            padding: '10px',
            borderRadius: '10px',
            margin: '0'
          }}>
            Remember to say the shloka whenever you face an obstacle in your life!
          </p>
        </div>
      )}
      
      {/* Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-15px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ObstacleCourse;