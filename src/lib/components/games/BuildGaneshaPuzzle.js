import React, { useState, useEffect } from 'react';

const BuildGaneshaPuzzle = () => {
  // State for tracking puzzle progress
  const [completedParts, setCompletedParts] = useState([]);
  const [activePart, setActivePart] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Parts of Ganesha with their symbolism
  const ganeshaParts = [
    {
      id: 'head',
      name: 'Elephant Head',
      symbolism: 'The elephant head symbolizes wisdom, intelligence, and the ability to think big!',
      shortInfo: 'Wisdom & Intelligence',
      position: { top: '10%', left: '50%', width: '40%', height: '40%' },
      zIndex: 5
    },
    {
      id: 'ears',
      name: 'Large Ears',
      symbolism: 'The big ears mean Ganesha listens more than he speaks. Good listeners learn more!',
      shortInfo: 'Listening Skills',
      position: { top: '15%', left: '80%', width: '30%', height: '25%' },
      zIndex: 3
    },
    {
      id: 'trunk',
      name: 'Curved Trunk',
      symbolism: 'The trunk represents adaptability and efficiency. It can do both big tasks and small, delicate ones!',
      shortInfo: 'Adaptability',
      position: { top: '35%', left: '60%', width: '30%', height: '30%' },
      zIndex: 6
    },
    {
      id: 'belly',
      name: 'Big Belly',
      symbolism: 'The large belly shows Ganesha can digest all life experiences - both good and bad - and learn from them!',
      shortInfo: 'Acceptance of All Experiences',
      position: { top: '60%', left: '50%', width: '35%', height: '25%' },
      zIndex: 4
    },
    {
      id: 'mouse',
      name: 'Mouse Friend',
      symbolism: 'The little mouse friend helps Ganesha get around. It shows that even small friends can help us accomplish big things!',
      shortInfo: 'Humility & Friendship',
      position: { top: '85%', left: '25%', width: '20%', height: '15%' },
      zIndex: 7
    },
    {
      id: 'axe',
      name: 'Axe',
      symbolism: 'The axe helps Ganesha cut away obstacles and unhealthy attachments that hold us back.',
      shortInfo: 'Removing Obstacles',
      position: { top: '45%', left: '15%', width: '20%', height: '20%' },
      zIndex: 8
    },
    {
      id: 'modak',
      name: 'Sweet Modak',
      symbolism: 'The modak (sweet) in Ganesha\'s hand represents the rewards of spiritual seeking and hard work.',
      shortInfo: 'Rewards of Hard Work',
      position: { top: '65%', left: '80%', width: '15%', height: '15%' },
      zIndex: 9
    }
  ];
  
  // Check if all parts are complete
  useEffect(() => {
    if (completedParts.length === ganeshaParts.length && gameStarted) {
      setAllComplete(true);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [completedParts, gameStarted]);
  
  // Start a new game
  const startGame = () => {
    setGameStarted(true);
    setCompletedParts([]);
    setActivePart(null);
    setAllComplete(false);
    setShowInfo(false);
  };
  
  // Handle clicking on a part in the parts tray
  const handlePartClick = (part) => {
    if (completedParts.includes(part.id)) return;
    
    setActivePart(part);
    setShowInfo(true);
  };
  
  // Add the active part to the Ganesha figure
  const addPartToFigure = () => {
    if (!activePart) return;
    
    setCompletedParts([...completedParts, activePart.id]);
    setShowInfo(false);
    
    // Check for special part combinations
    // Example: If they add both the head and trunk, we could give a special message
    if (activePart.id === 'head' && completedParts.includes('trunk')) {
      // Could show a special animation or message here
    }
    
    // Clear active part after adding
    setTimeout(() => {
      setActivePart(null);
    }, 300);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameStarted(false);
    setCompletedParts([]);
    setActivePart(null);
    setAllComplete(false);
    setShowInfo(false);
  };
  
  return (
    <div className="build-ganesha-puzzle" style={{
      position: 'relative',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff5f5',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      overflow: 'hidden'
    }}>
      {/* Header */}
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        marginBottom: '15px'
      }}>
        Build-a-Ganesha Puzzle
      </h2>
      
      {/* Game instructions */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '16px',
        color: '#333'
      }}>
        {!gameStarted ? (
          <p>Learn about Ganesha by building him piece by piece!</p>
        ) : allComplete ? (
          <p>Wonderful job! You've built the complete Ganesha!</p>
        ) : (
          <p>Click on a puzzle piece below to learn about it, then add it to Ganesha!</p>
        )}
      </div>
      
      {/* Main game area */}
      {!gameStarted ? (
        /* Start screen */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#FFE0B2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            marginBottom: '20px'
          }}>
            🧩
          </div>
          
          <h3 style={{
            marginBottom: '15px',
            color: '#5D1049'
          }}>
            Learn About Ganesha's Symbolism
          </h3>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333',
            fontSize: '16px'
          }}>
            Each part of Lord Ganesha has a special meaning. Click on the parts to learn about them, 
            then place them on Ganesha's outline to build the complete figure!
          </p>
          
          <button
            onClick={startGame}
            style={{
              padding: '12px 30px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            Start Building!
          </button>
        </div>
      ) : (
        /* Game play area */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Ganesha outline with added parts */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            backgroundColor: '#FFF9C4',
            borderRadius: '10px',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            {/* Ganesha outline - this would be replaced with an actual outline image */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              border: '2px dashed #ccc',
              borderRadius: '100px',
              opacity: 0.7,
              zIndex: 1
            }}></div>
            
            {/* Completed parts */}
            {ganeshaParts.map(part => 
              completedParts.includes(part.id) && (
                <div
                  key={part.id}
                  style={{
                    position: 'absolute',
                    top: part.position.top,
                    left: part.position.left,
                    width: part.position.width,
                    height: part.position.height,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: getPartColor(part.id),
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: part.zIndex,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#FFF',
                    fontWeight: 'bold',
                    opacity: 0.9,
                    transition: 'all 0.3s ease-in',
                    animation: 'addPart 0.5s ease-out'
                  }}
                >
                  {part.name}
                </div>
              )
            )}
            
            {/* Show progress */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '5px 10px',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#333'
            }}>
              {completedParts.length}/{ganeshaParts.length} parts
            </div>
          </div>
          
          {/* Information card */}
          {showInfo && activePart && (
            <div style={{
              backgroundColor: getPartColor(activePart.id),
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              color: '#FFF',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.3s'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '10px' }}>
                {activePart.name}
              </h3>
              <p style={{ marginBottom: '15px' }}>
                {activePart.symbolism}
              </p>
              <button
                onClick={addPartToFigure}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#FFFFFF',
                  color: '#333',
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Add to Ganesha
              </button>
            </div>
          )}
          
          {/* Parts tray */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            {ganeshaParts.map(part => (
              <button
                key={part.id}
                onClick={() => handlePartClick(part)}
                disabled={completedParts.includes(part.id)}
                style={{
                  padding: '10px 15px',
                  backgroundColor: completedParts.includes(part.id) 
                    ? '#e0e0e0' 
                    : getPartColor(part.id),
                  color: completedParts.includes(part.id) ? '#999' : '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: completedParts.includes(part.id) ? 'default' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  opacity: completedParts.includes(part.id) ? 0.6 : 1,
                  textDecoration: completedParts.includes(part.id) ? 'line-through' : 'none',
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>{part.name}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 'normal',
                  opacity: 0.9
                }}>
                  {part.shortInfo}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Game complete view */}
      {allComplete && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.5s'
        }}>
          <h3 style={{ 
            color: '#2E7D32',
            marginTop: 0,
            marginBottom: '15px'
          }}>
            Congratulations! 🎉
          </h3>
          <p style={{ 
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            You've built Ganesha and learned about all his symbolic parts!
          </p>
          <button
            onClick={resetGame}
            style={{
              padding: '10px 25px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            Start Again
          </button>
        </div>
      )}
      
      {/* Celebration effect */}
      {showCelebration && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 0.5;
            const color = [
              '#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'
            ][Math.floor(Math.random() * 5)];
            
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
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes addPart {
            from { 
              transform: translate(-50%, -50%) scale(1.2); 
              opacity: 0.5;
            }
            to { 
              transform: translate(-50%, -50%) scale(1); 
              opacity: 0.9;
            }
          }
          
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
          }
          
          @media (max-width: 600px) {
            .build-ganesha-puzzle button {
              padding: 8px 12px;
              font-size: 12px;
              min-width: 80px;
            }
          }
        `}
      </style>
    </div>
  );
};

// Helper function to get colors for different parts
function getPartColor(partId) {
  const colorMap = {
    head: '#9C27B0',
    ears: '#2196F3',
    trunk: '#FF9800',
    belly: '#4CAF50',
    mouse: '#795548',
    axe: '#F44336',
    modak: '#FF4081'
  };
  
  return colorMap[partId] || '#607D8B';
}

export default BuildGaneshaPuzzle;