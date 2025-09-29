import React, { useState, useRef, useEffect } from 'react';

const GaneshaSymbolismWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const wheelRef = useRef(null);
  const spinTimeoutRef = useRef(null);
  const spinButtonRef = useRef(null);
  
  // Ganesha symbolism data
  const symbols = [
    {
      id: 'trunk',
      name: 'Curved Trunk',
      description: 'The curved trunk represents efficiency and adaptability. It can do both heavy tasks and delicate ones!',
      color: '#FF9E80',
      emoji: '🐘'
    },
    {
      id: 'ears',
      name: 'Big Ears',
      description: 'The large ears mean we should listen more than we speak. Good listening helps us learn!',
      color: '#80D8FF',
      emoji: '👂'
    },
    {
      id: 'head',
      name: 'Big Head',
      description: 'The elephant head symbolizes wisdom, knowledge, and thinking big thoughts!',
      color: '#B388FF',
      emoji: '🧠'
    },
    {
      id: 'mouse',
      name: 'Mouse Friend',
      description: 'The mouse shows that we should control our desires. Even though it\'s small, it helps Ganesha travel!',
      color: '#CCFF90',
      emoji: '🐁'
    },
    {
      id: 'axe',
      name: 'Axe',
      description: 'The axe helps cut away unhealthy attachments and bad habits that hold us back.',
      color: '#EA80FC',
      emoji: '🪓'
    },
    {
      id: 'stomach',
      name: 'Big Stomach',
      description: 'The big stomach shows Ganesha can digest all experiences - both good and bad - and learn from them!',
      color: '#FFAB91',
      emoji: '🍽️'
    },
    {
      id: 'modak',
      name: 'Modak Sweet',
      description: 'The modak (sweet) represents the rewards we get from hard work and good deeds.',
      color: '#FFD180',
      emoji: '🍬'
    },
    {
      id: 'mouth',
      name: 'Small Mouth',
      description: 'The small mouth reminds us to talk less and listen more. Think before you speak!',
      color: '#CF9FFF',
      emoji: '👄'
    }
  ];
  
  // Calculate angle for each segment
  const segmentAngle = 360 / symbols.length;
  
  // Function to spin the wheel
  const spinWheel = () => {
    if (spinning) return;
    
    // Clear any existing timeouts
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    
    setSpinning(true);
    setSelectedSymbol(null);
    setShowInfo(false);
    
    // Calculate random rotation (2-5 full spins plus a random segment)
    const spinAmount = 2 + Math.floor(Math.random() * 3); // 2-5 spins
    const extraDegrees = Math.floor(Math.random() * 360); // Random final position
    
    const newRotation = rotation + (spinAmount * 360) + extraDegrees;
    setRotation(newRotation);
    
    // Determine which symbol is selected based on final rotation
    spinTimeoutRef.current = setTimeout(() => {
      // Calculate the final position (normalized between 0-360)
      const normalizedRotation = newRotation % 360;
      
      // Calculate which segment the wheel stopped on
      // We add 360 and then take modulo to handle negative angles correctly,
      // and we're calculating clockwise from the top (0 degrees)
      const segmentIndex = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
      
      setSelectedSymbol(symbols[segmentIndex]);
      setSpinning(false);
      
      // Show info card after a short delay
      setTimeout(() => {
        setShowInfo(true);
      }, 500);
    }, 3000);
  };
  
  // Handle when spin completes and wheel stops
  const handleTransitionEnd = () => {
    if (wheelRef.current) {
      // Animation is complete
    }
  };
  
  // Add confetti effect when info is shown
  useEffect(() => {
    if (showInfo && selectedSymbol) {
      // Focus the spin button after showing info (accessibility)
      if (spinButtonRef.current) {
        spinButtonRef.current.focus();
      }
    }
  }, [showInfo, selectedSymbol]);
  
  return (
    <div className="wheel-container" style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', 
      padding: '20px',
      position: 'relative',
      maxWidth: '500px',
      margin: '0 auto',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif"
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        margin: '0 0 20px 0'
      }}>
        Ganesha Symbolism Spinner
      </h2>
      
      <p style={{
        textAlign: 'center',
        margin: '0 0 20px 0',
        color: '#333',
        fontSize: '1rem'
      }}>
        Spin the wheel to learn about different parts of Ganesha and what they mean!
      </p>
      
      {/* Wheel Section */}
      <div style={{ 
        position: 'relative',
        width: '300px',
        height: '300px',
        marginBottom: '20px'
      }}>
        {/* Wheel */}
        <div 
          ref={wheelRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#FEF8E7',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 10px #FFF5D6, 0 0 0 15px #FFE0B2',
            overflow: 'hidden',
            transition: spinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
            transform: `rotate(${rotation}deg)`,
            cursor: spinning ? 'default' : 'pointer'
          }}
          onClick={spinning ? undefined : spinWheel}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Wheel segments */}
          {symbols.map((symbol, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            
            // Create a clipPath for each segment
            return (
              <div
                key={symbol.id}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${startAngle}deg)`,
                  transformOrigin: 'center center',
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((endAngle - startAngle) * Math.PI / 180)}% ${50 - 50 * Math.sin((endAngle - startAngle) * Math.PI / 180)}%, 50% 0%)`,
                  backgroundColor: symbol.color,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingTop: '30px',
                  fontSize: '20px'
                }}
              >
                <div style={{ 
                  transform: `rotate(${segmentAngle / 2}deg)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>{symbol.emoji}</span>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    maxWidth: '80px',
                    marginTop: '5px'
                  }}>
                    {symbol.name}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Center circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#FF9800',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            border: '5px solid white',
            fontSize: '30px',
            zIndex: 10
          }}>
            🐘
          </div>
        </div>
        
        {/* Spinner pointer */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30px',
          height: '30px',
          backgroundColor: '#D32F2F',
          clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
          zIndex: 10
        }}></div>
      </div>
      
      {/* Spin button */}
      <button
        ref={spinButtonRef}
        onClick={spinWheel}
        disabled={spinning}
        style={{
          padding: '12px 30px',
          backgroundColor: spinning ? '#E0E0E0' : '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: spinning ? 'not-allowed' : 'pointer',
          boxShadow: spinning ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          marginBottom: '20px'
        }}
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
      
      {/* Info card that appears when wheel stops */}
      {selectedSymbol && (
        <div 
          style={{
            width: '100%',
            backgroundColor: selectedSymbol.color,
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            marginTop: '20px',
            transform: showInfo ? 'scale(1)' : 'scale(0.8)',
            opacity: showInfo ? 1 : 0,
            transition: 'transform 0.5s, opacity 0.5s',
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            margin: '0 auto 15px'
          }}>
            {selectedSymbol.emoji}
          </div>
          
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {selectedSymbol.name}
          </h3>
          
          <p style={{ margin: '0', fontSize: '1rem' }}>
            {selectedSymbol.description}
          </p>
          
          {/* Confetti effect when info is shown */}
          {showInfo && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: -1,
            }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const size = Math.random() * 8 + 5;
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 3 + 2;
                const animationDelay = Math.random() * 0.5;
                const color = selectedSymbol.color;
                
                return (
                  <div 
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      top: '-10px',
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      borderRadius: '50%',
                      animation: `confettiFall ${animationDuration}s ease-in ${animationDelay}s forwards`
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes confettiFall {
            0% { 
              transform: translateY(-10px) rotate(0deg); 
              opacity: 1; 
            }
            100% { 
              transform: translateY(400px) rotate(720deg); 
              opacity: 0; 
            }
          }
          
          @media (max-width: 500px) {
            .wheel-container {
              padding: 10px;
            }
          }
          
          @media (max-width: 350px) {
            .wheel-container div[style*="width: 300px"] {
              width: 250px !important;
              height: 250px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GaneshaSymbolismWheel;