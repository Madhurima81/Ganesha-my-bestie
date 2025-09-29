import React, { useState, useEffect, useRef } from 'react';
import './FestivalPianoGame.css';

// Game phases for progression
const PHASES = {
  DISCOVERY: 'discovery',
  CELEBRATION: 'celebration',
  COMPLETE: 'complete'
};

// Instrument configuration with cultural context
const INSTRUMENTS = [
  {
    id: 'dhol',
    name: 'Festival Drums',
    color: '#DC143C',
    culturalNote: 'Dhol drums call everyone to celebrate together!',
    keyPosition: { x: 15, y: 45 },
    soundFreq: { base: 100, harmonics: [150, 200] }
  },
  {
    id: 'cymbals',
    name: 'Rhythm Cymbals', 
    color: '#FFD700',
    culturalNote: 'Cymbals create the heartbeat of celebration!',
    keyPosition: { x: 30, y: 65 },
    soundFreq: { base: 800, harmonics: [1200, 1600] }
  },
  {
    id: 'bells',
    name: 'Temple Bells',
    color: '#4169E1', 
    culturalNote: 'Sacred bells bring divine blessings!',
    keyPosition: { x: 45, y: 65 },
    soundFreq: { base: 1000, harmonics: [2000, 3000] }
  },
  {
    id: 'shehnai',
    name: 'Celebration Horn',
    color: '#FF8C00',
    culturalNote: 'Shehnai announces joyous occasions!',
    keyPosition: { x: 60, y: 65 },
    soundFreq: { base: 440, harmonics: [660, 880] }
  },
  {
    id: 'drum',
    name: 'Sacred Drum',
    color: '#32CD32',
    culturalNote: 'Ancient rhythms connect us to tradition!',
    keyPosition: { x: 75, y: 65 },
    soundFreq: { base: 80, harmonics: [120, 160] }
  }
];

const FestivalPianoGame = ({ onComplete, onNavigate }) => {
  // Game state
  const [gameState, setGameState] = useState({
    phase: PHASES.DISCOVERY,
    tapCount: 0,
    discoveredInstruments: new Set(),
    celebrationStarted: false,
    gameStartTime: Date.now(),
    stars: 0,
    completed: false,
    showDoneButton: false
  });

  // UI state
  const [activeKey, setActiveKey] = useState(null);
  const [showSparkle, setShowSparkle] = useState(null);
  const [ganeshaMessage, setGaneshaMessage] = useState('');
  const [showGaneshaMessage, setShowGaneshaMessage] = useState(false);
  const [showCulturalNote, setShowCulturalNote] = useState(null);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const [showSceneCompletion, setShowSceneCompletion] = useState(false);

  // Audio context for Web Audio API
  const audioContextRef = useRef(null);
  const timeoutsRef = useRef([]);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    };

    initAudio();

    // Cleanup timeouts on unmount
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Safe timeout function
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Generate instrument sound using Web Audio API
  const playInstrumentSound = (instrument) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create oscillators for base frequency and harmonics
    const oscillators = [instrument.soundFreq.base, ...instrument.soundFreq.harmonics].map((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, now);
      osc.type = index === 0 ? 'sine' : 'triangle';
      
      // Different volume levels for base vs harmonics
      const volume = index === 0 ? 0.3 : 0.1;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      return { osc, gain };
    });

    // Start all oscillators
    oscillators.forEach(({ osc }) => {
      osc.start(now);
      osc.stop(now + 0.8);
    });
  };

  // Handle key press
  const handleKeyPress = (instrumentId) => {
    const instrument = INSTRUMENTS.find(i => i.id === instrumentId);
    if (!instrument || gameState.phase === PHASES.COMPLETE) return;

    console.log(`Playing ${instrument.name}`);

    // Play sound
    playInstrumentSound(instrument);

    // Visual feedback
    setActiveKey(instrumentId);
    setShowSparkle(instrumentId);
    
    // Show cultural note on first discovery
    if (!gameState.discoveredInstruments.has(instrumentId)) {
      setShowCulturalNote({
        instrument,
        position: instrument.keyPosition
      });
      
      safeSetTimeout(() => setShowCulturalNote(null), 3000);
    }

    // Update game state
    const newDiscovered = new Set(gameState.discoveredInstruments);
    newDiscovered.add(instrumentId);
    
    const newTapCount = gameState.tapCount + 1;
    
    setGameState(prev => ({
      ...prev,
      tapCount: newTapCount,
      discoveredInstruments: newDiscovered,
      stars: Math.min(8, Math.floor(newTapCount / 2))
    }));

    // Ganesha encouragement
    if (newTapCount % 3 === 0) {
      const encouragements = [
        "Beautiful music!",
        "The festival is dancing!",
        "Such wonderful sounds!",
        "Everyone loves your music!",
        "Keep playing, little musician!"
      ];
      
      const message = encouragements[Math.floor(Math.random() * encouragements.length)];
      setGaneshaMessage(message);
      setShowGaneshaMessage(true);
      
      safeSetTimeout(() => setShowGaneshaMessage(false), 2500);
    }

    // Check for gentle celebration trigger (no auto-completion)
    if ((newTapCount === 7 || newTapCount === 8) && !gameState.celebrationStarted) {
      safeSetTimeout(() => triggerGentleCelebration(), 1000);
    }

    // Clear visual effects
    safeSetTimeout(() => {
      setActiveKey(null);
      setShowSparkle(null);
    }, 600);
  };

  // Trigger gentle celebration (not completion)
  const triggerGentleCelebration = () => {
    if (gameState.celebrationStarted) return;

    console.log('Starting gentle celebration');
    
    setGameState(prev => ({
      ...prev,
      celebrationStarted: true,
      showDoneButton: true
    }));

    setGaneshaMessage("Beautiful music! You're a natural musician!");
    setShowGaneshaMessage(true);

    // Show confetti and sparkles
    setShowSparkle('gentle-celebration');
    
    safeSetTimeout(() => {
      setShowSparkle(null);
      setShowGaneshaMessage(false);
    }, 3000);
  };

  // Manual completion when child clicks "I'm Done Playing"
  const handleManualCompletion = () => {
    console.log('Manual completion triggered');
    
    setGameState(prev => ({
      ...prev,
      phase: PHASES.COMPLETE,
      completed: true,
      stars: Math.max(8, prev.stars)
    }));

    // Show completion badge with music badge
    setShowCompletionBadge(true);
    setGaneshaMessage("You are now a Festival Musician! Amazing!");
    setShowGaneshaMessage(true);

    safeSetTimeout(() => {
      setShowCompletionBadge(false);
      setShowGaneshaMessage(false);
      setShowSceneCompletion(true);
    }, 4000);
  };

  // Play automatic melody using all instruments
  const playAutoMelody = () => {
    const melody = [
      { instrument: INSTRUMENTS[2], delay: 0 },    // bells
      { instrument: INSTRUMENTS[1], delay: 500 },  // cymbals
      { instrument: INSTRUMENTS[0], delay: 1000 }, // dhol
      { instrument: INSTRUMENTS[3], delay: 1500 }, // shehnai
      { instrument: INSTRUMENTS[4], delay: 2000 }, // drum
      { instrument: INSTRUMENTS[2], delay: 2500 }  // bells again
    ];

    melody.forEach(({ instrument, delay }) => {
      safeSetTimeout(() => {
        playInstrumentSound(instrument);
        setActiveKey(instrument.id);
        setShowSparkle(instrument.id);
        
        safeSetTimeout(() => {
          setActiveKey(null);
          setShowSparkle(null);
        }, 400);
      }, delay);
    });
  };

  // Complete the game
  const completeGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: PHASES.COMPLETE,
      completed: true,
      stars: 8
    }));

    setGaneshaMessage("You are now a Festival Musician! Amazing!");
    setShowGaneshaMessage(true);

    if (onComplete) {
      safeSetTimeout(() => {
        onComplete({
          stars: 8,
          completed: true,
          timeSpent: Date.now() - gameState.gameStartTime,
          instrumentsDiscovered: gameState.discoveredInstruments.size,
          totalTaps: gameState.tapCount
        });
      }, 3000);
    }
  };

  // Welcome message
  useEffect(() => {
    safeSetTimeout(() => {
      setGaneshaMessage("Welcome to the magical festival piano! Tap the colorful keys to make beautiful music!");
      setShowGaneshaMessage(true);
      
      safeSetTimeout(() => setShowGaneshaMessage(false), 4000);
    }, 1000);
  }, []);

  return (
    <div className="festival-piano-container">
      {/* Background */}
      <div className="piano-background" />
      
      {/* Ganesha Character */}
      <div className="ganesha-character">
        <div className="ganesha-image" />
        {showGaneshaMessage && (
          <div className="ganesha-speech-bubble">
            {ganeshaMessage}
          </div>
        )}
      </div>

      {/* Piano Base - Bigger */}
      <div className="piano-base">
        {/* Piano Keys - Bigger, Icon Only */}
        {INSTRUMENTS.map((instrument) => (
          <div
            key={instrument.id}
            className={`piano-key key-${instrument.id} ${
              activeKey === instrument.id ? 'active' : ''
            } ${gameState.discoveredInstruments.has(instrument.id) ? 'discovered' : ''}`}
            style={{
              left: `${instrument.keyPosition.x}%`,
              top: `${instrument.keyPosition.y}%`,
              backgroundColor: instrument.color,
              transform: activeKey === instrument.id ? 'scale(0.95) translateY(2px)' : 'scale(1) translateY(0)'
            }}
            onClick={() => handleKeyPress(instrument.id)}
          >
            {/* Instrument Icon - Bigger */}
            <div className={`instrument-icon icon-${instrument.id}`} />

            {/* Sparkle Effect */}
            {showSparkle === instrument.id && (
              <div className="key-sparkles">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cultural Note Popup */}
      {showCulturalNote && (
        <div 
          className="cultural-note"
          style={{
            left: `${showCulturalNote.position.x}%`,
            top: `${showCulturalNote.position.y - 15}%`
          }}
        >
          {showCulturalNote.instrument.culturalNote}
        </div>
      )}

      {/* Progress Counter */}
      <div className="progress-counter">
        <div className="stars">â­ {gameState.stars}</div>
        <div className="taps">ðŸŽµ {gameState.tapCount}</div>
        <div className="instruments">ðŸŽ¼ {gameState.discoveredInstruments.size}/5</div>
      </div>

      {/* I'm Done Playing Button */}
      {gameState.showDoneButton && !gameState.completed && (
        <div className="done-playing-button" onClick={handleManualCompletion}>
          <span>ðŸŽµ</span>
          <span>I'm Done Playing!</span>
        </div>
      )}

      {/* Gentle Celebration Effects */}
      {showSparkle === 'gentle-celebration' && (
        <div className="gentle-celebration-effects">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="celebration-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)].color
              }}
            />
          ))}
        </div>
      )}

      {/* Completion Badge with Music Badge */}
      {showCompletionBadge && (
        <div className="completion-badge">
          <div className="badge-content">
            <div className="music-badge-icon" />
            <div className="badge-title">Festival Musician!</div>
            <div className="badge-stars">
              {Array.from({ length: gameState.stars }).map((_, i) => (
                <span key={i} className="star">â­</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scene Completion Modal */}
      {showSceneCompletion && (
        <div className="scene-completion-modal">
          <div className="modal-content">
            <h2>ðŸŽ¹ Piano Mastery Complete! ðŸŽ¹</h2>
            <div className="completion-stats">
              <div className="stat">
                <span className="stat-icon">ðŸŽµ</span>
                <span className="stat-value">{gameState.tapCount}</span>
                <span className="stat-label">Musical Taps</span>
              </div>
              <div className="stat">
                <span className="stat-icon">ðŸŽ¼</span>
                <span className="stat-value">{gameState.discoveredInstruments.size}/5</span>
                <span className="stat-label">Instruments</span>
              </div>
              <div className="stat">
                <span className="stat-icon">â­</span>
                <span className="stat-value">{gameState.stars}</span>
                <span className="stat-label">Stars Earned</span>
              </div>
            </div>
            
            <div className="modal-buttons">
              <button 
                className="modal-button play-again"
                onClick={() => {
                  // Reset game state
                  setGameState({
                    phase: PHASES.DISCOVERY,
                    tapCount: 0,
                    discoveredInstruments: new Set(),
                    celebrationStarted: false,
                    gameStartTime: Date.now(),
                    stars: 0,
                    completed: false,
                    showDoneButton: false
                  });
                  setShowSceneCompletion(false);
                  setShowCompletionBadge(false);
                }}
              >
                ðŸŽ¹ Play Again
              </button>
              
              <button 
                className="modal-button continue"
                onClick={() => {
                  if (onComplete) {
                    onComplete({
                      stars: gameState.stars,
                      completed: true,
                      timeSpent: Date.now() - gameState.gameStartTime,
                      instrumentsDiscovered: gameState.discoveredInstruments.size,
                      totalTaps: gameState.tapCount
                    });
                  }
                }}
              >
                ðŸŽ¨ Next Game
              </button>
              
              <button 
                className="modal-button zone-map"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('zone-map');
                  }
                }}
              >
                ðŸ—ºï¸ Festival Square
              </button>
            </div>
          </div>
        </div>
      )}

    {/*}  <style jsx>{`
        .festival-piano-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1);
          overflow: hidden;
          font-family: 'Comic Sans MS', cursive;
        }

        .piano-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('./assets/images/pianogame-bg.png');
          background-size: cover;
          background-position: center;
          opacity: 0.8;
        }

        .ganesha-character {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 120px;
          height: 150px;
          z-index: 100;
        }

        .ganesha-image {
          width: 100%;
          height: 80%;
          background-image: url('./assets/images/ganesha-musician.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          animation: gentle-bounce 3s ease-in-out infinite;
        }

        .ganesha-speech-bubble {
          position: absolute;
          bottom: 100%;
          right: 0;
          background: white;
          padding: 12px;
          border-radius: 15px;
          border: 3px solid #FFD700;
          max-width: 200px;
          font-size: 14px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          animation: bubble-appear 0.5s ease-out;
        }

        .ganesha-speech-bubble::after {
          content: '';
          position: absolute;
          top: 100%;
          right: 20px;
          border: 10px solid transparent;
          border-top-color: white;
        }

        .piano-base {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 800px;
          height: 200px;
          background-image: url('./assets/images/piano-base.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          z-index: 50;
        }

        .piano-key {
          position: absolute;
          width: 80px;
          height: 100px;
          border-radius: 10px;
          border: 3px solid #8B4513;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          user-select: none;
        }

        .piano-key:hover {
          transform: scale(1.02) translateY(-1px) !important;
          box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }

        .piano-key.active {
          box-shadow: 0 8px 20px currentColor, 0 0 30px currentColor;
        }

        .piano-key.discovered {
          border-color: #FFD700;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .instrument-icon {
          width: 40px;
          height: 40px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          margin-bottom: 5px;
        }

        .icon-dhol { background-image: url('./assets/images/red-drum.png'); }
        .icon-cymbals { background-image: url('./assets/images/yellow-cymbals.png'); }
        .icon-bells { background-image: url('./assets/images/blue-bells.png'); }
        .icon-shehnai { background-image: url('./assets/images/orange-shehnai.png'); }
        .icon-drum { background-image: url('./assets/images/green-dhol.png'); }

        .instrument-name {
          font-size: 11px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          text-align: center;
          line-height: 1.2;
        }

        .key-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: 10px;
          overflow: hidden;
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #FFD700;
          border-radius: 50%;
          animation: sparkle-float 1.5s ease-out forwards;
        }

        .cultural-note {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #FFD700;
          border-radius: 12px;
          padding: 10px;
          max-width: 180px;
          font-size: 12px;
          text-align: center;
          z-index: 200;
          animation: note-appear 3s ease-out forwards;
        }

        .progress-counter {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 15px;
          border-radius: 15px;
          display: flex;
          gap: 15px;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .celebration-effects {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 300;
        }

        .celebration-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, 
            rgba(255, 215, 0, 0.1),
            rgba(255, 165, 0, 0.1),
            rgba(255, 140, 0, 0.1));
          animation: celebration-pulse 2s ease-in-out infinite;
        }

        .celebration-confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }

        .fireworks-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 400;
        }

        .firework {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          animation: firework-explode 2s ease-out;
        }

        .completion-badge {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 500;
          animation: badge-appear 1s ease-out;
        }

        .badge-content {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .badge-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .badge-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .badge-stars {
          display: flex;
          justify-content: center;
          gap: 5px;
        }

        .star {
          font-size: 20px;
          animation: star-twinkle 1s ease-in-out infinite alternate;
        }

        /* Animations
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes bubble-appear {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes sparkle-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.5); }
        }

        @keyframes note-appear {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          20% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.8); }
        }

        @keyframes celebration-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes firework-explode {
          0% { transform: scale(0); opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 50px 20px currentColor; }
          100% { transform: scale(1.5); opacity: 0; box-shadow: 0 0 100px 40px transparent; }
        }

        @keyframes badge-appear {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes star-twinkle {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }

        /* Mobile Responsiveness 
        @media (max-width: 768px) {
          .piano-key {
            width: 60px;
            height: 80px;
          }
          
          .instrument-name {
            font-size: 9px;
          }
          
          .ganesha-character {
            width: 80px;
            height: 100px;
          }
          
          .progress-counter {
            flex-direction: column;
            gap: 5px;
            font-size: 12px;
          }
        }
      `}</style>*/}
    </div>
  );
};

export default FestivalPianoGame;