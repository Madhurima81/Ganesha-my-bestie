import React, { useState, useEffect, useRef } from 'react';
import './FestivalPianoGame.css';

import FestivalSquareCompletion from '../components/FestivalSquareCompletion';
// Add these imports at the top of FestivalSquareCompletion.jsx
//import ganeshaMusician from '../assets/images/ganesha-musician.png';
import musicBadge from './assets/images/music-badge.png';

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
    keyPosition: { x: 15, y: 65 },
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

const handleManualCompletion = () => {
  console.log('Manual completion triggered');
  
  setGameState(prev => ({
    ...prev,
    phase: PHASES.COMPLETE,
    completed: true,
    stars: Math.max(8, prev.stars)
  }));

  // Show completion badge briefly, then show Festival completion
  setShowCompletionBadge(true);
  setGaneshaMessage("You are now a Festival Musician! Amazing!");
  setShowGaneshaMessage(true);

  safeSetTimeout(() => {
    setShowCompletionBadge(false);
    setShowGaneshaMessage(false);
    setShowSceneCompletion(true); // This triggers the new completion screen
  }, 3000);
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
        {/* Piano Keys Frame - Decorative Container */}
        <div className="piano-keys-frame-simple" />
        
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
        <div className="stars">⭐ {gameState.stars}</div>
        <div className="taps">🎵 {gameState.tapCount}</div>
        <div className="instruments">🎼 {gameState.discoveredInstruments.size}/5</div>
      </div>

      {/* I'm Done Playing Button */}
      {gameState.showDoneButton && !gameState.completed && (
        <div className="done-playing-button" onClick={handleManualCompletion}>
          <span>🎵</span>
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
                <span key={i} className="star">⭐</span>
              ))}
            </div>
          </div>
        </div>
      )}


{/* Festival Square Completion */}
{showSceneCompletion && (
  <FestivalSquareCompletion
    show={showSceneCompletion}
    sceneName="Piano Mastery"
    sceneNumber={1}
    totalScenes={4}
    starsEarned={gameState.stars}
    totalStars={8}
    discoveredBadges={['musician']} // Add based on completion
    badgeImages={{
      musician: musicBadge  // Use the imported image
    }}
    nextSceneName="Rangoli Artistry"
    childName="little musician" // Or get from profile
    onContinue={() => {
      console.log('Continue to next festival activity');
      if (onComplete) {
        onComplete({
          stars: gameState.stars,
          completed: true,
          badges: ['musician']
        });
      }
    }}
    onReplay={() => {
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
    }}
    onHome={() => {
      if (onNavigate) {
        onNavigate('home');
      }
    }}
  />
)}

      {/* Scene Completion Modal - Commented out for separate handling */}
      {/* 
      {showSceneCompletion && (
        <div className="scene-completion-modal">
          <div className="modal-content">
            <h2>🎹 Piano Mastery Complete! 🎹</h2>
            <div className="completion-stats">
              <div className="stat">
                <span className="stat-icon">🎵</span>
                <span className="stat-value">{gameState.tapCount}</span>
                <span className="stat-label">Musical Taps</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🎼</span>
                <span className="stat-value">{gameState.discoveredInstruments.size}/5</span>
                <span className="stat-label">Instruments</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⭐</span>
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
                🎹 Play Again
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
                🎨 Next Game
              </button>
              
              <button 
                className="modal-button zone-map"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('zone-map');
                  }
                }}
              >
                🗺️ Festival Square
              </button>
            </div>
          </div>
        </div>
      )}
      */}


    </div>
  );
};

export default FestivalPianoGame;