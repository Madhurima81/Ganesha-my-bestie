import React, { useState, useEffect } from 'react';
import { useGameCoach } from "../coach/GameCoach";
import './SceneCompletionCelebration.css';

const SceneCompletionCelebration = ({ 
  show = false, 
  sceneName = "Pond Adventure",
  sceneNumber = 2,
  totalScenes = 4,
  starsEarned = 5,
  totalStars = 5,
  discoveredSymbols = ['lotus', 'trunk', 'golden'],
  symbolImages = {},
  nextSceneName = "Temple Discovery",
  onContinue,
  onReplay,
  onExploreZones,
  onViewProgress,
  onHome,
  sceneId = 'pond',
  completionData = null,
  onComplete = null,
  childName = "little explorer",
  isFinalScene = false,
  
  // NEW: Zone-aware container props
  containerType = "backpack",        // "backpack" or "smartwatch"
  containerImage = null,             // Base container image (smartwatch-base.png)
  containerScreenImage = null,       // Screen overlay (smartwatch-screen.png)
  appImages = {},                    // App icon mappings {appName: imagePath}
  zoneId = 'symbol-mountain'         // Zone identifier for theming
}) => {
  const [stage, setStage] = useState('hidden');
  const [symbolsInContainer, setSymbolsInContainer] = useState([]);
  
  const { clearManualCloseTracking } = useGameCoach();

  useEffect(() => {
    if (!show) {
      setStage('hidden');
      setSymbolsInContainer([]);
      return;
    }

    // Show immediately when scene tells us to
    setStage('celebrating');
    
    // Remove duplicates from discoveredSymbols first
    const uniqueSymbols = [...new Set(discoveredSymbols)];
    
    // Symbols appear in container one by one
    setTimeout(() => {
      uniqueSymbols.forEach((symbol, index) => {
        setTimeout(() => {
          setSymbolsInContainer(prev => {
            // Prevent duplicates in state too
            if (prev.includes(symbol)) return prev;
            return [...prev, symbol];
          });
        }, index * 500);
      });
    }, 500);

    // Show action buttons after symbols
    setTimeout(() => {
      setStage('actions-ready');
    }, 500 + (uniqueSymbols.length * 500) + 2500);

  }, [show, discoveredSymbols]);

  // Generic action handler with GameCoach cleanup
  const handleAction = (actionCallback, skipComplete = false) => {
    console.log('🔧 ACTION: Scene-level handling + GameCoach cleanup');
    
    if (clearManualCloseTracking) {
      clearManualCloseTracking();
      console.log('✅ GameCoach state cleared');
    }
    
    setStage('exiting');
    setTimeout(() => {
      // Save completion data if needed
      if (!skipComplete && onComplete && completionData) {
        onComplete(sceneId, completionData);
      }
      actionCallback?.();
    }, 400);
  };

  // Regular scene handlers
  const handleContinue = () => {
    handleAction(() => onContinue?.());
  };

  const handleReplay = () => {
    handleAction(() => onReplay?.(), true); // Skip complete for replay
  };

  const handleBackToMap = () => {
    handleAction(() => console.log('Navigate to zone map'));
  };

  // Final scene handlers
  const handleExploreZones = () => {
    handleAction(() => onExploreZones?.());
  };

  const handleViewProgress = () => {
    handleAction(() => onViewProgress?.());
  };

  const handleHome = () => {
    handleAction(() => onHome?.());
  };

  // Helper function for 3-2-3 app layout on smartwatch
  const getAppGridPosition = (index) => {
    if (index < 3) return { gridColumn: index + 1, gridRow: 1 };      // Row 1: positions 1,2,3
    if (index < 5) return { gridColumn: (index - 3) + 2, gridRow: 2 }; // Row 2: positions 2,3 
    return { gridColumn: (index - 5) + 1, gridRow: 3 };               // Row 3: positions 1,2,3
  };

  if (stage === 'hidden') return null;

  return (
    <>
      {/* Light overlay to dim scene slightly */}
      <div className={`celebration-backdrop stage-${stage}`} />
      
      {/* Sparkle effects */}
      <div className="sparkle-effects">
        {Array.from({length: 15}).map((_, i) => (
          <div 
            key={i} 
            className="floating-sparkle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${12 + Math.random() * 8}px`
            }}
          >
            ✨
          </div>
        ))}
      </div>
      
      {/* Main celebration card */}
      <div className={`celebration-card stage-${stage}`}>
        
        {/* Background sparkles inside card */}
        <div className="card-sparkles">
          {Array.from({length: 12}).map((_, i) => (
            <div 
              key={i} 
              className="card-sparkle" 
              style={{
                left: `${5 + (i % 4) * 25 + Math.random() * 15}%`,
                top: `${5 + Math.floor(i / 4) * 25 + Math.random() * 15}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
        
        {/* Container - Backpack or Smartwatch */}
        <div 
          className={`container-holder ${containerType}`}
          style={{
            width: containerType === 'smartwatch' ? '320px' : '280px',
            height: containerType === 'smartwatch' ? '300px' : '260px',
            position: 'absolute',
            left: containerType === 'smartwatch' ? '40px' : '10px',
            top: containerType === 'smartwatch' ? '5px' : '10px'
          }}
        >
          {containerType === 'backpack' ? (
            // Existing backpack code
            <div className="backpack">
              <img 
                src="/images/symbol-backpack.png" 
                alt="Adventure Backpack" 
                className="backpack-image"
                style={{
                  width: '280px',
                  height: '260px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block'
                }} 
              />
              <div 
                className="backpack-symbols-overlay"
                style={{
                  position: 'absolute',
                  top: '90px',
                  left: '50px', 
                  right: '50px',
                  bottom: '60px',
                  pointerEvents: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)', 
                  gap: '8px',
                  alignItems: 'center',
                  justifyItems: 'center'
                }}
              >
                {/* Symbols inside backpack */}
                {symbolsInContainer.map((symbol, index) => (
                  <div 
                    key={`backpack-${symbol}-${index}`}
                    className="backpack-symbol"
                    style={{
                      left: `${15 + (index % 3) * 20}%`,
                      top: `${15 + Math.floor(index / 3) * 30}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    {symbolImages[symbol] ? 
                      <img src={symbolImages[symbol]} alt={symbol} className="symbol-img" /> :
                      <span className="symbol-emoji">{
                        {lotus: '🪷', trunk: '🐘', golden: '⭐', om: '🕉️', temple: '🛕', garden: '🌺', water: '💧', mooshika: '🐭', modak: '🍯', belly: '🌌', eyes: '👁️', ear: '👂', tusk: '🦷'}[symbol] || '✨'
                      }</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // NEW: Smartwatch code
            <div className="smartwatch-container">
              {/* Base smartwatch image 
              <img 
                src={containerImage || "/images/smartwatch-base.png"} 
                alt="Sacred Smartwatch" 
                className="smartwatch-base"
                style={{
                  width: '320px',
                  height: '300px',
                  objectFit: 'contain',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }} 
              />
              
              {/* Screen overlay (optional) */}
              {containerScreenImage && (
                <img 
                  src={containerScreenImage} 
                  alt="Smartwatch Screen" 
                  className="smartwatch-screen"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: '40px',
                    left: '60px',
                    zIndex: 2
                  }} 
                />
              )}
              
              {/* Apps overlay - 3-2-3 layout */}
              <div 
                className="smartwatch-apps-overlay"
                style={{
                  position: 'absolute',
                  top: '60px',          // Adjust for your screen area
                  left: '80px',         // Adjust for your screen area  
                  width: '160px',       // Screen width
                  height: '160px',      // Screen height
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap: '6px',
                  alignItems: 'center',
                  justifyItems: 'center',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              >
                {symbolsInContainer.map((symbol, index) => {
                  const gridPosition = getAppGridPosition(index);
                  
                  return (
                    <div 
                      key={`smartwatch-${symbol}-${index}`}
                      className="smartwatch-app"
                      style={{
                        gridColumn: gridPosition.gridColumn,
                        gridRow: gridPosition.gridRow,
                        width: '36px',
                        height: '36px',
                        animation: 'symbolPop 0.6s ease-out both',
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      {appImages[symbol] ? 
                        <img 
                          src={appImages[symbol]} 
                          alt={symbol} 
                          className="app-icon" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
                          }}
                        /> :
                        <span className="app-emoji" style={{ 
                          fontSize: '28px',
                          filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
                        }}>
                          📱
                        </span>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Trekker Ganesha on right */}
        <div className="trekker-container">
          {/* Trekker Ganesha character */}
          <div className="trekker-ganesha">
            <img src="/images/ganesha-character.png" alt="Trekker Ganesha" />
          </div>
          
          {/* Speech bubble - Different text for final scene */}
          <div 
            className={`speech-bubble ${stage === 'actions-ready' ? 'stage-actions-ready' : ''}`}
            style={{
              '--bubble-color': stage === 'celebrating' ? '#FF6B6B' : '#4ECDC4',
              '--bubble-border': stage === 'celebrating' ? '#E55A5A' : '#45B7D1'
            }}
          >
            <div className="bubble-content">
              {stage === 'celebrating' && (
                <>
                  <div className="bubble-title">Amazing work, {childName}!</div>
                  <div className="bubble-text">
                    {isFinalScene ? 
                      `You completed the entire ${sceneName} zone!` : 
                      `You completed ${sceneName}!`
                    }
                  </div>
                </>
              )}
              {stage === 'actions-ready' && (
                <>
                  <div className="bubble-title">
                    {isFinalScene ? 'Zone mastered!' : 
                     containerType === 'smartwatch' ? 'Sacred apps collected!' : 'Sacred symbols collected!'}
                  </div>
                  <div className="bubble-text">
                    {isFinalScene ? 
                      'What divine adventure awaits next?' : 
                      'Where shall your adventure lead next?'
                    }
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons - Different for final scene */}
        <div className="action-buttons">
          {!isFinalScene ? (
            // Regular scene buttons
            <>
              <button className="action-btn continue-btn" onClick={handleContinue}>
                <div className="btn-text">
                  <div className="btn-title">Continue</div>
                  <div className="btn-subtitle">{nextSceneName}</div>
                </div>
              </button>
              
              <button className="action-btn replay-btn" onClick={handleReplay}>
                <div className="btn-text">
                  <div className="btn-title">Play Again</div>
                  <div className="btn-subtitle">Replay scene</div>
                </div>
              </button>
              
              <button className="action-btn map-btn" onClick={handleBackToMap}>
                <div className="btn-text">
                  <div className="btn-title">Zone Map</div>
                  <div className="btn-subtitle">Choose scene</div>
                </div>
              </button>
            </>
          ) : (
            // Final scene buttons
            <>
              <button className="action-btn explore-btn" onClick={handleExploreZones}>
                <div className="btn-text">
                  <div className="btn-title">🌟 Explore Zones</div>
                  <div className="btn-subtitle">New adventures await</div>
                </div>
              </button>
              
              <button className="action-btn replay-btn" onClick={handleReplay}>
                <div className="btn-text">
                  <div className="btn-title">🔄 Play Again</div>
                  <div className="btn-subtitle">Replay this zone</div>
                </div>
              </button>
              
              <button className="action-btn home-btn" onClick={handleHome}>
                <div className="btn-text">
                  <div className="btn-title">🏠 Home</div>
                  <div className="btn-subtitle">Back to start</div>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SceneCompletionCelebration;