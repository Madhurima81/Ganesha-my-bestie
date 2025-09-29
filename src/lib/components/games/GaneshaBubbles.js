import React, { useState, useEffect, useRef } from 'react';

const GaneshaBubbles = () => {
  const [activeBubble, setActiveBubble] = useState(null);
  const [bubblePositions, setBubblePositions] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const bubbleRefs = useRef([]);

  // Bubble content data
  const bubbles = [
    {
      id: 'name',
      title: 'My Name',
      content: "I'm Ganesha! I'm also called Ganapati and Vinayaka in different regions of India.",
      emoji: '📛',
      color: '#FF9E80',
      size: 120,
      animationDelay: 0,
      floatSpeed: 1.2,
      floatDirection: 1
    },
    {
      id: 'head',
      title: 'My Head',
      content: "I have an elephant head! My father Shiva replaced my original head with an elephant's head.",
      emoji: '🐘',
      color: '#80D8FF',
      size: 140,
      animationDelay: 1,
      floatSpeed: 0.8,
      floatDirection: -1
    },
    {
      id: 'family',
      title: 'My Family',
      content: "My father is Lord Shiva and my mother is Goddess Parvati. I also have a brother named Kartikeya.",
      emoji: '👪',
      color: '#B388FF',
      size: 110,
      animationDelay: 2,
      floatSpeed: 1.5,
      floatDirection: 1
    },
    {
      id: 'food',
      title: 'My Favorite Food',
      content: "I love modaks! They are sweet dumplings filled with coconut and jaggery. So delicious!",
      emoji: '🍬',
      color: '#FFD180',
      size: 130,
      animationDelay: 3,
      floatSpeed: 1,
      floatDirection: -1
    },
    {
      id: 'friend',
      title: 'My Special Friend',
      content: "Mooshika the mouse is my special friend! He's small but helps me travel everywhere.",
      emoji: '🐁',
      color: '#CCFF90',
      size: 125,
      animationDelay: 4,
      floatSpeed: 1.3,
      floatDirection: 1
    },
    {
      id: 'power',
      title: 'My Special Power',
      content: "I'm the remover of obstacles! People pray to me before starting something new.",
      emoji: '✨',
      color: '#EA80FC',
      size: 135,
      animationDelay: 5,
      floatSpeed: 0.9,
      floatDirection: -1
    },
    {
      id: 'writing',
      title: 'My Writing',
      content: "I wrote down the Mahabharata! I used my broken tusk as a pen when my regular pen broke.",
      emoji: '📝',
      color: '#80CBC4',
      size: 115,
      animationDelay: 6,
      floatSpeed: 1.1,
      floatDirection: 1
    },
    {
      id: 'birthday',
      title: 'My Birthday',
      content: "People celebrate my birthday as Ganesh Chaturthi with lots of singing, dancing, and delicious modaks!",
      emoji: '🎂',
      color: '#FFAB91',
      size: 120,
      animationDelay: 7,
      floatSpeed: 1.4,
      floatDirection: -1
    }
  ];

  // Check if a position overlaps with existing bubbles
  const isOverlapping = (newPosition, currentIndex, currentPositions) => {
    for (let i = 0; i < currentIndex; i++) {
      if (!currentPositions[i]) continue;
      
      const bubble1 = bubbles[currentIndex];
      const bubble2 = bubbles[i];
      
      const dx = newPosition.left - currentPositions[i].left;
      const dy = newPosition.top - currentPositions[i].top;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (bubble1.size + bubble2.size) / 1.5) {
        return true;
      }
    }
    
    return false;
  };

  // Calculate initial positions for bubbles
  const calculateBubblePositions = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Reset bubbleRefs
    bubbleRefs.current = Array(bubbles.length).fill().map(() => ({ y: 0 }));
    
    // Calculate positions to ensure bubbles don't overlap
    const newPositions = [];
    
    bubbles.forEach((bubble, index) => {
      let attempts = 0;
      let position;
      
      do {
        position = {
          left: Math.random() * (containerWidth - bubble.size),
          top: Math.random() * (containerHeight - bubble.size)
        };
        
        attempts++;
      } while (isOverlapping(position, index, newPositions) && attempts < 100);
      
      newPositions[index] = position;
    });
    
    setBubblePositions(newPositions);
  };

  // Initialize bubble positions
  useEffect(() => {
    // Give the component time to render before measuring
    const timer = setTimeout(() => {
      if (containerRef.current) {
        calculateBubblePositions();
      }
    }, 100);
    
    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Recalculate positions when window size changes
  useEffect(() => {
    // Wait a moment for the container to resize
    const timer = setTimeout(() => {
      calculateBubblePositions();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [windowSize]);

  // Start floating animation
  useEffect(() => {
    if (bubblePositions.length > 0) {
      animateBubbles();
    }
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [bubblePositions]);

  // Animate bubbles floating
  const animateBubbles = () => {
    const newPositions = [...bubblePositions];
    
    bubbles.forEach((bubble, index) => {
      if (!bubbleRefs.current[index]) bubbleRefs.current[index] = { y: 0 };
      
      // Only animate if this bubble is not active
      if (activeBubble !== bubble.id) {
        // Update the internal y value for smooth animation
        bubbleRefs.current[index].y += 0.02 * bubble.floatSpeed * bubble.floatDirection;
        
        // Calculate new position with a sine wave for floating effect
        const floatY = Math.sin(bubbleRefs.current[index].y) * 10;
        
        // Only update the position in state if significant change to avoid re-renders
        if (Math.abs(floatY) > 0.1) {
          if (newPositions[index]) {
            newPositions[index] = {
              ...newPositions[index],
              top: newPositions[index].top + floatY * 0.1
            };
          }
        }
      }
    });
    
    setBubblePositions(newPositions);
    animationFrameRef.current = requestAnimationFrame(animateBubbles);
  };

  // Handle bubble click
  const handleBubbleClick = (bubbleId) => {
    setActiveBubble(activeBubble === bubbleId ? null : bubbleId);
  };

  // Determine if we're on a mobile device
  const isMobile = windowSize.width < 768;
  
  // Get remaining space percentage when a bubble is active
  const getRemainingSpace = () => {
    if (!activeBubble) return '100%';
    return isMobile ? '30%' : '60%';
  };

  return (
    <div 
      className="ganesha-bubbles-container" 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '600px' : '700px',
        background: 'linear-gradient(135deg, #e1f5fe, #b3e5fc)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive",
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      {/* Title */}
      <h1 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: isMobile ? '24px' : '32px',
        margin: '0 0 20px 0',
        textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
      }}>
        All About Ganesha
      </h1>
      
      {/* Main Ganesha image when no bubble is active */}
      {!activeBubble && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '120px' : '150px',
          height: isMobile ? '120px' : '150px',
          backgroundColor: '#FFC7D1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '80px' : '100px',
          zIndex: 1,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          opacity: 0.8
        }}>
          🐘
        </div>
      )}
      
      {/* Floating bubbles */}
      <div style={{
        position: 'relative',
        width: getRemainingSpace(),
        height: '100%',
        transition: 'width 0.5s ease-in-out',
        float: activeBubble && !isMobile ? 'left' : 'none'
      }}>
        {bubbles.map((bubble, index) => (
          <div
            key={bubble.id}
            className={`bubble ${activeBubble === bubble.id ? 'active' : ''}`}
            style={{
              position: 'absolute',
              left: bubblePositions[index]?.left || 0,
              top: bubblePositions[index]?.top || 0,
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              backgroundColor: bubble.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              zIndex: activeBubble === bubble.id ? 10 : 2,
              transform: `scale(${activeBubble === bubble.id ? 1.1 : 1})`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              animation: `float-${bubble.id} ${3 + bubble.animationDelay * 0.2}s ease-in-out infinite alternate`,
              opacity: activeBubble && activeBubble !== bubble.id ? 0.3 : 1
            }}
            onClick={() => handleBubbleClick(bubble.id)}
          >
            <span style={{ fontSize: bubble.size * 0.4 }}>
              {bubble.emoji}
            </span>
          </div>
        ))}
      </div>
      
      {/* Active bubble detail panel */}
      {activeBubble && (
        <div 
          className="bubble-detail"
          style={{
            position: isMobile ? 'absolute' : 'relative',
            top: isMobile ? '50%' : 0,
            right: isMobile ? '20px' : 0,
            transform: isMobile ? 'translateY(-50%)' : 'none',
            width: isMobile ? '65%' : '40%',
            height: isMobile ? 'auto' : '100%',
            float: isMobile ? 'none' : 'right',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s'
          }}
        >
          {bubbles.filter(b => b.id === activeBubble).map(bubble => (
            <div key={bubble.id}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '15px'
              }}>
                <span style={{ 
                  fontSize: isMobile ? '30px' : '40px',
                  marginRight: '10px',
                  backgroundColor: bubble.color,
                  width: isMobile ? '50px' : '60px',
                  height: isMobile ? '50px' : '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  {bubble.emoji}
                </span>
                <h2 style={{ 
                  margin: 0,
                  color: '#5D1049',
                  fontSize: isMobile ? '20px' : '24px'
                }}>
                  {bubble.title}
                </h2>
              </div>
              
              <p style={{ 
                fontSize: isMobile ? '16px' : '18px', 
                lineHeight: '1.5',
                color: '#333'
              }}>
                {bubble.content}
              </p>
              
              <button
                onClick={() => setActiveBubble(null)}
                style={{
                  backgroundColor: bubble.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '8px 15px',
                  marginTop: '15px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  alignSelf: 'flex-start'
                }}
              >
                Close
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#666',
        fontSize: isMobile ? '12px' : '14px',
        width: '100%'
      }}>
        <p>Click on the bubbles to learn more about Ganesha!</p>
      </div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        ${bubbles.map(bubble => `
          @keyframes float-${bubble.id} {
            0% {
              transform: translateY(0px);
            }
            100% {
              transform: translateY(${10 * bubble.floatDirection}px);
            }
          }
        `).join('\n')}
        
        .bubble:hover {
          transform: ${activeBubble ? 'scale(1.1)' : 'scale(1.1)'};
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 768px) {
          .bubble {
            transform: scale(0.8);
          }
          
          .bubble.active {
            transform: scale(0.9);
          }
          
          .bubble:hover {
            transform: ${activeBubble ? 'scale(0.9)' : 'scale(0.9)'};
          }
        }
      `}</style>
    </div>
  );
};

export default GaneshaBubbles;