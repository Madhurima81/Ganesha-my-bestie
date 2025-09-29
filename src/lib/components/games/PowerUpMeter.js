import React, { useState, useEffect } from 'react';

const PowerUpMeter = () => {
  // State for tracking progress and animations
  const [powerLevel, setPowerLevel] = useState(0);
  const [isChanting, setIsChanting] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ganeshaState, setGaneshaState] = useState('normal');
  const [message, setMessage] = useState('Ready to power up Ganesha?');
  const [showHint, setShowHint] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Define the shloka lines
  const shlokaLines = [
    { text: "Vakratunda Mahakaya", 
      translation: "O Lord with the curved trunk and a mighty body" },
    { text: "Suryakoti Samaprabha", 
      translation: "Who shines with the brilliance of ten million suns" },
    { text: "Nirvighnam Kuru Me Deva", 
      translation: "Please make my path free from obstacles" },
    { text: "Sarva-Kaaryeshu Sarvada", 
      translation: "In all my work, always" }
  ];

  // Define power level thresholds and their effects
  const powerLevels = [
    { threshold: 0, name: "Starting Power", color: "#E0E0E0" },
    { threshold: 25, name: "Glowing Power", color: "#FFF176" },
    { threshold: 50, name: "Bright Power", color: "#FFCA28" },
    { threshold: 75, name: "Radiant Power", color: "#FFA000" },
    { threshold: 100, name: "Ultimate Power", color: "#FF6F00" }
  ];

  // Get current power level based on percentage
  const getCurrentPowerLevel = () => {
    for (let i = powerLevels.length - 1; i >= 0; i--) {
      if (powerLevel >= powerLevels[i].threshold) {
        return powerLevels[i];
      }
    }
    return powerLevels[0];
  };

  // Get current power level color
  const currentPowerColor = getCurrentPowerLevel().color;

  // Handle chanting a line of the shloka
  const handleChant = () => {
    if (isChanting || completed) return;

    setIsChanting(true);
    setShowHint(false);
    
    // Update message to show encouragement
    setMessage(`Great job saying: ${shlokaLines[currentLine].text}`);
    
    // Increase power based on which line is being recited
    // Each line gives 25% power (total of 100% for full shloka)
    const newPowerLevel = Math.min(powerLevel + 25, 100);
    
    // Animate power increase
    let tempPower = powerLevel;
    const powerInterval = setInterval(() => {
      tempPower += 1;
      setPowerLevel(tempPower);
      
      // Update Ganesha's animation state based on power level
      if (tempPower >= 75) {
        setGaneshaState('super');
      } else if (tempPower >= 50) {
        setGaneshaState('glowing');
      } else if (tempPower >= 25) {
        setGaneshaState('happy');
      }
      
      if (tempPower >= newPowerLevel) {
        clearInterval(powerInterval);
        
        // Move to next line or complete
        setTimeout(() => {
          if (currentLine < shlokaLines.length - 1) {
            setCurrentLine(currentLine + 1);
            setMessage(`Now let's say: ${shlokaLines[currentLine + 1].text}`);
          } else {
            // All lines completed!
            setMessage("Amazing! You've powered up Ganesha completely!");
            setShowCelebration(true);
            setCompleted(true);
            
            // Turn off celebration after some time
            setTimeout(() => {
              setShowCelebration(false);
            }, 5000);
          }
          setIsChanting(false);
        }, 1000);
      }
    }, 40); // Speed of power increase animation
  };

  // Reset everything to start over
  const handleReset = () => {
    setPowerLevel(0);
    setCurrentLine(0);
    setGaneshaState('normal');
    setMessage('Ready to power up Ganesha?');
    setCompleted(false);
    setShowHint(true);
  };

  // Get the appropriate Ganesha image/animation based on state
  const getGaneshaDisplay = () => {
    switch (ganeshaState) {
      case 'happy':
        return (
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            backgroundColor: '#FFC107',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            boxShadow: '0 0 15px rgba(255, 193, 7, 0.5)',
            transition: 'all 0.5s ease',
            margin: '0 auto 20px'
          }}>🐘</div>
        );
      case 'glowing':
        return (
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#FFA000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '85px',
            boxShadow: '0 0 25px rgba(255, 160, 0, 0.7)',
            animation: 'pulse 1.5s infinite',
            transition: 'all 0.5s ease',
            margin: '0 auto 20px'
          }}>🐘</div>
        );
      case 'super':
        return (
          <div style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: '#FF6F00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '90px',
            boxShadow: '0 0 35px rgba(255, 111, 0, 0.8)',
            animation: 'pulse 1s infinite alternate',
            transition: 'all 0.5s ease',
            margin: '0 auto 20px'
          }}>🐘</div>
        );
      default: // 'normal'
        return (
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '75px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.5s ease',
            margin: '0 auto 20px'
          }}>🐘</div>
        );
    }
  };

  return (
    <div className="power-up-meter-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '15px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      position: 'relative',
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        marginBottom: '15px'
      }}>
        Ganesha's Power-Up Meter
      </h2>
      
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: '#333',
        marginBottom: '20px'
      }}>
        Say each line of the shloka to power up Ganesha!
      </p>
      
      {/* Ganesha Display */}
      {getGaneshaDisplay()}
      
      {/* Power Meter */}
      <div style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: '30px',
        height: '30px',
        margin: '0 auto 15px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: '100%',
          width: `${powerLevel}%`,
          backgroundColor: currentPowerColor,
          borderRadius: '30px',
          transition: 'width 0.4s ease-in-out, background-color 0.4s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {powerLevel >= 20 && (
            <span style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              padding: '0 10px'
            }}>
              {powerLevel}% Power
            </span>
          )}
        </div>
        
        {/* Power level markers */}
        {powerLevels.filter(level => level.threshold > 0).map(level => (
          <div 
            key={level.threshold}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${level.threshold}%`,
              width: '2px',
              backgroundColor: 'rgba(0,0,0,0.1)',
              zIndex: 1
            }}
          />
        ))}
      </div>
      
      {/* Current Power Status */}
      <div style={{
        textAlign: 'center',
        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
        fontWeight: 'bold',
        color: currentPowerColor,
        marginBottom: '20px',
        textShadow: powerLevel >= 75 ? '0 0 10px rgba(255,111,0,0.5)' : 'none',
        transition: 'color 0.3s, text-shadow 0.3s'
      }}>
        {getCurrentPowerLevel().name}
      </div>
      
      {/* Current Line and Translation */}
      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s'
      }}>
        <div style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#5D1049',
          textAlign: 'center'
        }}>
          {currentLine < shlokaLines.length ? shlokaLines[currentLine].text : "Completed!"}
        </div>
        
        <div style={{
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontStyle: 'italic',
          color: '#666',
          textAlign: 'center'
        }}>
          {currentLine < shlokaLines.length ? shlokaLines[currentLine].translation : "You've said the full shloka!"}
        </div>
      </div>
      
      {/* Action Area with Message */}
      <div style={{
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: '#333',
          marginBottom: '15px',
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {message}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <button
            onClick={handleChant}
            disabled={isChanting || completed}
            style={{
              backgroundColor: isChanting || completed ? '#e0e0e0' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '10px 25px',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              cursor: isChanting || completed ? 'default' : 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s, transform 0.3s',
              transform: 'scale(1)',
              animation: showHint ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            {isChanting ? 'Chanting...' : completed ? 'Complete!' : 'I Said This Line!'}
          </button>
          
          <button
            onClick={handleReset}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s, transform 0.3s'
            }}
          >
            Start Over
          </button>
        </div>
      </div>
      
      {/* Progress Tracker */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '15px'
      }}>
        {shlokaLines.map((_, index) => (
          <div 
            key={index}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: index < currentLine ? '#4CAF50' 
                : index === currentLine ? '#2196F3' 
                : '#e0e0e0',
              margin: '0 5px',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      
      {/* Completed Message Area */}
      {completed && (
        <div style={{
          backgroundColor: '#E8F5E9',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.5s'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#2E7D32',
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
          }}>
            You Did It! 🎉
          </h3>
          
          <p style={{
            margin: '0 0 15px 0',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
          }}>
            You've powered up Ganesha to his full potential! Now he's ready to help you remove obstacles in your life.
          </p>
          
          <div style={{
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            backgroundColor: '#C8E6C9',
            padding: '10px',
            borderRadius: '8px'
          }}>
            <p style={{ margin: 0 }}>
              When you say the full shloka regularly, Ganesha's power stays with you all day long!
            </p>
          </div>
        </div>
      )}
      
      {/* Celebration effect */}
      {showCelebration && (
        <div className="celebration-effect" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
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
      
      {/* CSS Animations */}
      <style jsx>{`
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
          100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PowerUpMeter;