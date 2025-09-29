import React, { useState, useEffect } from 'react';

const ShlokaSuperpower = () => {
  // State for discovered cards, flipped card, and confetti display
  const [discoveredPowers, setDiscoveredPowers] = useState([]);
  const [flippedCard, setFlippedCard] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [shakeTarget, setShakeTarget] = useState(null);

  // Superpower cards data
  const superpowers = [
    {
      id: 'wisdom',
      title: 'Wisdom Power',
      icon: '🧠',
      color: '#9C27B0',
      description: 'The shloka gives you the superpower of wisdom! Your mind becomes clear and you can solve problems more easily.',
      hint: 'Just like Lord Ganesha is very wise, saying his shloka makes your brain super smart!'
    },
    {
      id: 'courage',
      title: 'Courage Power',
      icon: '🦁',
      color: '#E91E63',
      description: 'The shloka gives you the superpower of courage! You become brave when facing scary or difficult situations.',
      hint: 'The shloka helps you become brave and strong'
    },
    {
      id: 'focus',
      title: 'Focus Power',
      icon: '🔍',
      color: '#2196F3',
      description: 'The shloka gives you the superpower of focus! Your mind stays calm and you can concentrate much better.',
      hint: 'The shloka helps you pay attention during class or when doing homework, just like having super vision!'
    },
    {
      id: 'peace',
      title: 'Peace Power',
      icon: '☮️',
      color: '#4CAF50',
      description: 'The shloka gives you the superpower of peace! Your heart feels calm and happy even when things get busy.',
      hint: 'When you feel upset or angry, the shloka can make you feel calm like a still pond.'
    },
    {
      id: 'patience',
      title: 'Patience Power',
      icon: '⏳',
      color: '#FF9800',
      description: 'The shloka gives you the superpower of patience! You can wait without getting angry or frustrated.',
      hint: 'Just like Ganesha waits calmly, the shloka helps you wait for your turn or for good things to happen.'
    },
    {
      id: 'friendship',
      title: 'Friendship Power',
      icon: '🤝',
      color: '#00BCD4',
      description: 'The shloka gives you the superpower of friendship! You become kind and understanding to others.',
      hint: 'The shloka helps you be a good friend, just like Ganesha is friendly to everyone who calls on him!'
    }
  ];

  // Clickable elements on the page that can reveal superpowers
  const hiddenSpots = [
    { id: 'ganesha-ear', label: 'Check Ganesha\'s Ear', position: 'top-left', power: 'wisdom' },
    { id: 'ganesha-trunk', label: 'Look at Ganesha\'s Trunk', position: 'top-right', power: 'courage' },
    { id: 'lotus-flower', label: 'Touch the Lotus', position: 'middle-left', power: 'focus' },
    { id: 'modak-sweet', label: 'Find the Modak', position: 'middle-right', power: 'peace' },
    { id: 'mouse-friend', label: 'Pet Mooshika the Mouse', position: 'bottom-left', power: 'patience' },
    { id: 'om-symbol', label: 'Click the Om Symbol', position: 'bottom-right', power: 'friendship' }
  ];

  // Map of positions to actual CSS positions
  const positionMap = {
    'top-left': { top: '10%', left: '10%' },
    'top-right': { top: '10%', right: '10%' },
    'middle-left': { top: '40%', left: '15%' },
    'middle-right': { top: '40%', right: '15%' },
    'bottom-left': { bottom: '15%', left: '10%' },
    'bottom-right': { bottom: '15%', right: '10%' },
  };

  // Discover a new superpower
  const discoverSuperpower = (spotId) => {
    const spot = hiddenSpots.find(s => s.id === spotId);
    if (!spot) return;
    
    // Find the corresponding superpower
    const power = superpowers.find(p => p.id === spot.power);
    if (!power) return;
    
    // Check if already discovered
    if (discoveredPowers.includes(power.id)) {
      // Already discovered, just show it again
      setFlippedCard(power.id);
      return;
    }
    
    // Add to discovered powers
    setDiscoveredPowers([...discoveredPowers, power.id]);
    setFlippedCard(power.id);
    setShowHint(false);
    
    // Show confetti for new discovery
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    // If all powers discovered, do something special
    if (discoveredPowers.length === superpowers.length - 1) {
      // All discovered! Extra celebration could go here
    }
  };

  // Close the flipped card view
  const closeFlippedCard = () => {
    setFlippedCard(null);
  };

  // Reset everything
  const resetDiscovery = () => {
    setDiscoveredPowers([]);
    setFlippedCard(null);
    setShowConfetti(false);
    setShowHint(true);
  };

  // Hint animation for an undiscovered power
  const giveHint = () => {
    if (discoveredPowers.length >= superpowers.length) return;
    
    // Find an undiscovered power
    const undiscoveredSpots = hiddenSpots.filter(
      spot => !discoveredPowers.includes(spot.power)
    );
    
    if (undiscoveredSpots.length === 0) return;
    
    // Pick a random undiscovered spot
    const randomSpot = undiscoveredSpots[Math.floor(Math.random() * undiscoveredSpots.length)];
    
    // Set that spot to shake
    setShakeTarget(randomSpot.id);
    
    // Stop shaking after a moment
    setTimeout(() => {
      setShakeTarget(null);
    }, 1000);
  };

  // Check if a power has been discovered
  const isPowerDiscovered = (powerId) => {
    return discoveredPowers.includes(powerId);
  };

  // Format position based on screen size (mobile-responsive)
  const getResponsivePosition = (position) => {
    const basePosition = positionMap[position];
    return basePosition;
  };

  return (
    <div className="shloka-superpowers" style={{
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      padding: '15px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      minHeight: '600px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    }}>
      {/* Title and introduction */}
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        marginBottom: '15px'
      }}>
        Discover Your Shloka Superpowers!
      </h2>
      
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: '#333',
        marginBottom: '20px'
      }}>
        Find the hidden spots to reveal special powers you gain from saying Ganesha's shloka!
      </p>
      
      {/* Superpower card collection */}
      <div className="superpower-collection" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '10px',
      }}>
        {superpowers.map(power => (
          <div
            key={power.id}
            className="superpower-card"
            style={{
              backgroundColor: isPowerDiscovered(power.id) ? power.color : '#e0e0e0',
              borderRadius: '10px',
              padding: '15px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: isPowerDiscovered(power.id) ? 'pointer' : 'default',
              opacity: isPowerDiscovered(power.id) ? 1 : 0.7,
              transition: 'transform 0.3s, opacity 0.3s, background-color 0.3s',
              transform: flippedCard === power.id ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isPowerDiscovered(power.id) 
                ? '0 4px 8px rgba(0,0,0,0.2)' 
                : '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
            onClick={() => isPowerDiscovered(power.id) && setFlippedCard(power.id)}
          >
            <span style={{ fontSize: '28px', marginBottom: '5px' }}>
              {isPowerDiscovered(power.id) ? power.icon : '?'}
            </span>
            <span style={{ 
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
              fontWeight: 'bold',
              color: isPowerDiscovered(power.id) ? 'white' : '#666',
              textAlign: 'center'
            }}>
              {isPowerDiscovered(power.id) ? power.title : 'Hidden Power'}
            </span>
            
            {/* Lock icon for undiscovered powers */}
            {!isPowerDiscovered(power.id) && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                fontSize: '12px'
              }}>
                🔒
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Status and progress */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '10px 15px',
        borderRadius: '30px',
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
          Powers Found: {discoveredPowers.length}/{superpowers.length}
        </span>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={giveHint}
            disabled={discoveredPowers.length >= superpowers.length}
            style={{
              backgroundColor: discoveredPowers.length >= superpowers.length ? '#e0e0e0' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '5px 10px',
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              cursor: discoveredPowers.length >= superpowers.length ? 'default' : 'pointer',
            }}
          >
            Hint
          </button>
          
          <button
            onClick={resetDiscovery}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '5px 10px',
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Main interactive area with the Ganesha scene */}
      <div className="discovery-area" style={{
        position: 'relative',
        height: '350px',
        backgroundColor: '#f8f3eb', // Light beige background
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundImage: `url('/api/placeholder/800/400')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '15px',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Hint banner at first visit */}
        {showHint && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 20px',
            borderRadius: '30px',
            zIndex: 5,
            maxWidth: '80%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            animation: 'float 2s infinite ease-in-out'
          }}>
            <p style={{ margin: 0, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
              🔍 Click on different parts of Ganesha to discover superpowers!
            </p>
          </div>
        )}
        
        {/* Hidden clickable spots - you would position these over corresponding areas in your background image */}
        {hiddenSpots.map((spot) => {
          const position = getResponsivePosition(spot.position);
          return (
            <div
              key={spot.id}
              onClick={() => discoverSuperpower(spot.id)}
              style={{
                position: 'absolute',
                ...position,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px dashed rgba(255, 255, 255, 0.5)',
                zIndex: 2,
                animation: shakeTarget === spot.id ? 'shake 0.5s infinite' : 'none',
                transition: 'transform 0.3s, background-color 0.3s',
                backdropFilter: 'blur(2px)'
              }}
            >
              <div style={{ 
                fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)'
              }}>
                {spot.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Detailed superpower card when opened */}
      {flippedCard && (
        <div className="superpower-detail" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '20px',
            maxWidth: '500px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            animation: 'scaleIn 0.3s ease-out'
          }}>
            <button
              onClick={closeFlippedCard}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#aaa'
              }}
            >
              ✕
            </button>
            
            <div style={{
              borderTop: `8px solid ${superpowers.find(p => p.id === flippedCard)?.color}`,
              borderRadius: '10px',
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: superpowers.find(p => p.id === flippedCard)?.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}>
                {superpowers.find(p => p.id === flippedCard)?.icon}
              </div>
              
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
                color: superpowers.find(p => p.id === flippedCard)?.color,
                textAlign: 'center'
              }}>
                {superpowers.find(p => p.id === flippedCard)?.title}
              </h3>
              
              <p style={{ 
                margin: '0 0 20px 0', 
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                {superpowers.find(p => p.id === flippedCard)?.description}
              </p>
              
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '10px',
                width: '100%'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontStyle: 'italic'
                }}>
                  <strong>How to use this power:</strong><br />
                  {superpowers.find(p => p.id === flippedCard)?.hint}
                </p>
              </div>
            </div>
            
            <div style={{
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <button
                onClick={closeFlippedCard}
                style={{
                  backgroundColor: superpowers.find(p => p.id === flippedCard)?.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 25px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                Use My Power!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confetti effect when discovering new power */}
      {showConfetti && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
        }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 0.5;
            // Random color from superpowers
            const randomSuperpower = superpowers[Math.floor(Math.random() * superpowers.length)];
            const color = randomSuperpower.color;
            
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
                  animation: `confettiFall ${animationDuration}s ease-in ${animationDelay}s forwards`,
                  zIndex: 10
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Instruction at the bottom */}
      <div style={{ textAlign: 'center', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#666' }}>
        <p>Each superpower comes from saying the Vakratunda Mahakaya shloka!</p>
      </div>
      
      {/* Animations */}
      <style jsx>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 0); }
          75% { transform: translate(5px, 0); }
        }
      `}</style>
    </div>
  );
};

export default ShlokaSuperpower;