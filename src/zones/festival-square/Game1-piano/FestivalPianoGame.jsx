// FestivalPianoGame.jsx - UPDATED with SceneManager wrapper pattern
import React, { useState, useEffect, useRef } from 'react';
import './FestivalPianoGame.css';

// Import scene management components (same as pond scene)
import SceneManager from "../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../lib/components/scenes/MessageManager";
import InteractionManager, { ClickableElement } from "../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../lib/services/GameStateManager";
//import { useGameCoach, TriggerCoach } from '../../../lib/components/coach/GameCoach';
import ProgressManager from '../../../lib/services/ProgressManager';
import SimpleSceneManager from '../../../lib/services/SimpleSceneManager';

import FestivalSquareCompletion from '../components/FestivalSquareCompletion';
import musicBadge from './assets/images/music-badge.png';
import ganeshaCompletion from './assets/images/ganesha-musician.png';
import ganeshaGameScene from './assets/images/ganesha-musician.png';

// Game phases for progression
const PHASES = {
  DISCOVERY: 'discovery',
  CELEBRATION: 'celebration',
  COMPLETE: 'complete'
};

// Animal to instrument mapping
const ANIMAL_INSTRUMENT_MAP = {
  'dhol': 'monkey',
  'cymbals': 'peacock',
  'bells': 'elephant',
  'shehnai': 'squirrel',
  'drum': 'bunny'
};

// Instrument configuration
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          <button onClick={() => window.location.reload()}>Reload Game</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 🎯 WRAPPER COMPONENT - Same pattern as PondSceneSimplified
const FestivalPianoGame = ({
  onComplete,
  onNavigate,
  zoneId = 'festival-square',
  sceneId = 'game1'
}) => {
  console.log('FestivalPianoGame props:', { onComplete, onNavigate, zoneId, sceneId });

  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          // Game state
          phase: PHASES.DISCOVERY,
          tapCount: 0,
          discoveredInstruments: {},  // Changed from Set to object for persistence
          celebrationStarted: false,
          gameStartTime: Date.now(),
          
          // Progress tracking
          stars: 0,
          completed: false,
          showDoneButton: false,
          
          // UI state
          activeKey: null,
          showSparkle: null,
          showCulturalNote: null,
          showCompletionBadge: false,
          showSceneCompletion: false,
          
          // Dancing animals state
          dancingAnimals: {},  // Changed from Set to object
          showDanceFloor: false,
          danceParticles: [],
          
          // Completion tracking (same as pond scene)
          currentPopup: null,
          showingCompletionScreen: false,
          progress: {
            percentage: 0,
            starsEarned: 0,
            completed: false
          }
        }}
      >
        {({ sceneState, sceneActions, isReload }) => (
          <FestivalPianoContent
            sceneState={sceneState}
            sceneActions={sceneActions}
            isReload={isReload}
            onComplete={onComplete}
            onNavigate={onNavigate}
            zoneId={zoneId}
            sceneId={sceneId}
          />
        )}
      </SceneManager>
    </ErrorBoundary>
  );
};

// 🎮 CONTENT COMPONENT - Actual game logic (similar to PondSceneContent)
const FestivalPianoContent = ({
  sceneState,
  sceneActions,
  isReload,
  onComplete,
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('FestivalPianoContent render', { sceneState, isReload, zoneId, sceneId });

  // Local UI state that doesn't need persistence
  const [localUIState, setLocalUIState] = useState({
    activeKey: null,
    showSparkle: null,
    showCulturalNote: null,
    danceParticles: []
  });

  // Audio context and refs
  const audioContextRef = useRef(null);
  const timeoutsRef = useRef([]);
  const particleCounterRef = useRef(0);

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

    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle reload scenarios
  useEffect(() => {
    if (!isReload || !sceneState) return;

    console.log('🔄 FESTIVAL RELOAD: Starting reload sequence', {
      currentPopup: sceneState.currentPopup,
      showingCompletionScreen: sceneState.showingCompletionScreen,
      completed: sceneState.completed,
      phase: sceneState.phase
    });

    // Handle completion screen reload
    if (sceneState.showingCompletionScreen) {
      console.log('🔄 Resuming completion screen');
      sceneActions.updateState({ showSceneCompletion: true });
      return;
    }

    // Handle other reload scenarios as needed
    console.log('🔄 Normal reload, continuing game');
  }, [isReload]);

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

    const oscillators = [instrument.soundFreq.base, ...instrument.soundFreq.harmonics].map((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, now);
      osc.type = index === 0 ? 'sine' : 'triangle';
      
      const volume = index === 0 ? 0.3 : 0.1;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      return { osc, gain };
    });

    oscillators.forEach(({ osc }) => {
      osc.start(now);
      osc.stop(now + 0.8);
    });
  };

  // Create dance particles
  const createDanceParticles = (animalType) => {
    const colors = {
      peacock: ['#4169E1', '#32CD32', '#FFD700'],
      monkey: ['#D2691E', '#FF8C00', '#FFFF00'],
      elephant: ['#708090', '#CCCCCC', '#FFD700'],
      squirrel: ['#8B4513', '#CD853F', '#32CD32'],
      bunny: ['#FFB6C1', '#FFC0CB', '#FF69B4']
    };

    const particleColors = colors[animalType] || ['#FFD700', '#FF69B4', '#00CED1'];
    
    const newParticles = Array.from({ length: 8 }, (_, i) => {
      particleCounterRef.current += 1;
      return {
        id: `particle-${particleCounterRef.current}`,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.5
      };
    });

    setLocalUIState(prev => ({
      ...prev,
      danceParticles: [...prev.danceParticles, ...newParticles]
    }));

    safeSetTimeout(() => {
      setLocalUIState(prev => ({
        ...prev,
        danceParticles: prev.danceParticles.filter(p => !newParticles.some(np => np.id === p.id))
      }));
    }, 2000);
  };

  // Trigger animal dance
  const triggerAnimalDance = (instrumentId) => {
    const animalType = ANIMAL_INSTRUMENT_MAP[instrumentId];
    if (!animalType) return;

    console.log(`${animalType} is dancing to ${instrumentId}!`);

    // Update persistent state
    sceneActions.updateState({
      dancingAnimals: {
        ...sceneState.dancingAnimals,
        [animalType]: true
      },
      showDanceFloor: true
    });
    
    createDanceParticles(animalType);

    safeSetTimeout(() => {
      const newDancing = { ...sceneState.dancingAnimals };
      delete newDancing[animalType];
      
      sceneActions.updateState({
        dancingAnimals: newDancing,
        showDanceFloor: false
      });
    }, 1200);
  };

  // Handle key press
  const handleKeyPress = (instrumentId) => {
    const instrument = INSTRUMENTS.find(i => i.id === instrumentId);
    if (!instrument || sceneState.phase === PHASES.COMPLETE) return;

    console.log(`Playing ${instrument.name}`);

    playInstrumentSound(instrument);
    triggerAnimalDance(instrumentId);

    // Visual feedback
    setLocalUIState(prev => ({
      ...prev,
      activeKey: instrumentId,
      showSparkle: instrumentId
    }));
    
    // Show cultural note on first discovery
    if (!sceneState.discoveredInstruments[instrumentId]) {
      setLocalUIState(prev => ({
        ...prev,
        showCulturalNote: {
          instrument,
          position: instrument.keyPosition
        }
      }));
      
      safeSetTimeout(() => {
        setLocalUIState(prev => ({
          ...prev,
          showCulturalNote: null
        }));
      }, 3000);
    }

    // Update persistent state
    const newDiscovered = {
      ...sceneState.discoveredInstruments,
      [instrumentId]: true
    };
    
    const newTapCount = sceneState.tapCount + 1;
    const discoveredCount = Object.keys(newDiscovered).length;
    
    sceneActions.updateState({
      tapCount: newTapCount,
      discoveredInstruments: newDiscovered,
      stars: Math.min(8, Math.floor(newTapCount / 2)),
      progress: {
        percentage: Math.round((discoveredCount / 5) * 100),
        starsEarned: Math.min(8, Math.floor(newTapCount / 2)),
        completed: false
      }
    });

    // Trigger celebration
    if ((newTapCount === 7 || newTapCount === 8) && !sceneState.celebrationStarted) {
      safeSetTimeout(() => {
        triggerGentleCelebration();
      }, 1000);
    }

    // Clear visual effects
    safeSetTimeout(() => {
      setLocalUIState(prev => ({
        ...prev,
        activeKey: null,
        showSparkle: null
      }));
    }, 600);
  };

  // Trigger gentle celebration
  const triggerGentleCelebration = () => {
    if (sceneState.celebrationStarted) return;

    console.log('Starting gentle celebration');
    
    sceneActions.updateState({
      celebrationStarted: true,
      showDoneButton: true
    });

    setLocalUIState(prev => ({
      ...prev,
      showSparkle: 'gentle-celebration'
    }));
    
    safeSetTimeout(() => {
      setLocalUIState(prev => ({
        ...prev,
        showSparkle: null
      }));
    }, 3000);
  };

  // Handle manual completion
  const handleManualCompletion = () => {
    console.log('Manual completion triggered');
    
    sceneActions.updateState({
      phase: PHASES.COMPLETE,
      completed: true,
      stars: Math.max(8, sceneState.stars),
      showCompletionBadge: true,
      showingCompletionScreen: true,
      progress: {
        percentage: 100,
        starsEarned: Math.max(8, sceneState.stars),
        completed: true
      }
    });

    safeSetTimeout(() => {
      sceneActions.updateState({
        showCompletionBadge: false,
        showSceneCompletion: true
      });
    }, 3000);
  };

  // Handle restart
  const handleRestart = () => {
    console.log('Restarting game');
    
    // Reset to initial state
    sceneActions.updateState({
      phase: PHASES.DISCOVERY,
      tapCount: 0,
      discoveredInstruments: {},
      celebrationStarted: false,
      gameStartTime: Date.now(),
      stars: 0,
      completed: false,
      showDoneButton: false,
      showCompletionBadge: false,
      showSceneCompletion: false,
      showingCompletionScreen: false,
      dancingAnimals: {},
      showDanceFloor: false,
      progress: {
        percentage: 0,
        starsEarned: 0,
        completed: false
      }
    });

    // Clear local UI state
    setLocalUIState({
      activeKey: null,
      showSparkle: null,
      showCulturalNote: null,
      danceParticles: []
    });

    // Clear timeouts
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  };

  if (!sceneState) {
    return <div className="loading">Loading game state...</div>;
  }

  return (
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager
        messages={[]}
        sceneState={sceneState}
        sceneActions={sceneActions}
      >
        <div className="festival-piano-container">
          {/* Background */}
          <div className="piano-background" />

          {/* Ganesha Character */}
          <div className="ganesha-simple">
            <div 
              className="ganesha-simple-image" 
              style={{ backgroundImage: `url(${ganeshaGameScene})` }}
            />
          </div>
          
          {/* Dancing Animals Container */}
          <div className="dancing-animals">
            {Object.keys(ANIMAL_INSTRUMENT_MAP).map(instrumentId => {
              const animalType = ANIMAL_INSTRUMENT_MAP[instrumentId];
              const isDancing = sceneState.dancingAnimals?.[animalType];
              
              return (
                <div key={animalType} className={`animal-character animal-${animalType} ${
                  isDancing ? 'animal-dancing' : ''
                }`}>
                  {isDancing && (
                    <div className="animal-sparkles">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="animal-sparkle"
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
              );
            })}
          </div>

          {/* Dance Floor Effect */}
          {sceneState.showDanceFloor && <div className="dance-floor-effect" />}

          {/* Dance Particles */}
          {localUIState.danceParticles.length > 0 && (
            <div className="dance-particles">
              {localUIState.danceParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="dance-particle"
                  style={{
                    left: `${particle.left}%`,
                    top: '20%',
                    backgroundColor: particle.color,
                    animationDelay: `${particle.animationDelay}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Piano Base */}
          <div className="piano-base">
            <div className="piano-keys-frame-simple" />
            
            {INSTRUMENTS.map((instrument) => (
              <div
                key={instrument.id}
                className={`piano-key key-${instrument.id} ${
                  localUIState.activeKey === instrument.id ? 'active' : ''
                } ${sceneState.discoveredInstruments[instrument.id] ? 'discovered' : ''}`}
                style={{
                  left: `${instrument.keyPosition.x}%`,
                  top: `${instrument.keyPosition.y}%`,
                  backgroundColor: instrument.color,
                  transform: localUIState.activeKey === instrument.id ? 'scale(0.95) translateY(2px)' : 'scale(1) translateY(0)'
                }}
                onClick={() => handleKeyPress(instrument.id)}
              >
                <div className={`instrument-icon icon-${instrument.id}`} />

                {localUIState.showSparkle === instrument.id && (
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
          {localUIState.showCulturalNote && (
            <div 
              className="cultural-note"
              style={{
                left: `${localUIState.showCulturalNote.position.x}%`,
                top: `${localUIState.showCulturalNote.position.y - 15}%`
              }}
            >
              {localUIState.showCulturalNote.instrument.culturalNote}
            </div>
          )}

          {/* Progress Counter */}
          <div className="progress-counter">
            <div className="stars">⭐ {sceneState.stars}</div>
            <div className="taps">🎵 {sceneState.tapCount}</div>
            <div className="instruments">🎼 {Object.keys(sceneState.discoveredInstruments).length}/5</div>
          </div>

          {/* Restart Button */}
          <div className="restart-button" onClick={handleRestart}>
            <span>🔄</span>
            <span>Start Over</span>
          </div>

          {/* I'm Done Playing Button */}
          {sceneState.showDoneButton && !sceneState.completed && (
            <div className="done-playing-button" onClick={handleManualCompletion}>
              <span>🎵</span>
              <span>I'm Done Playing!</span>
            </div>
          )}

          {/* Gentle Celebration Effects */}
          {localUIState.showSparkle === 'gentle-celebration' && (
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

          {/* Completion Badge */}
          {sceneState.showCompletionBadge && (
            <div className="completion-badge">
              <div className="badge-content">
                <div className="music-badge-icon" />
                <div className="badge-title">Festival Musician!</div>
                <div className="badge-stars">
                  {Array.from({ length: sceneState.stars }).map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          )}

       // In FestivalPianoGame.jsx - Replace your FestivalSquareCompletion section with this:

{showSceneCompletion && (
  <FestivalSquareCompletion
    show={showSceneCompletion}
    sceneName="Piano Mastery"
    sceneNumber={1}
    totalScenes={4}
    starsEarned={gameState.stars}
    totalStars={8}
    discoveredBadges={['musician']}
    badgeImages={{
      musician: musicBadge
    }}
    characterImages={{
      ganeshaMusician: ganeshaCompletion
    }}
    nextSceneName="Rangoli Artistry"
    childName="little musician"
    
    // 🎵 CONTINUE: Robust completion + progression
    onContinue={() => {
      console.log('🎵 FESTIVAL CONTINUE: Going to next game + preserving resume');
      
      const profileId = localStorage.getItem('activeProfileId');
      if (profileId) {
        ProgressManager.updateSceneCompletion(profileId, 'festival-square', 'game1', {
          completed: true,
          stars: gameState.stars,
          badges: { musician: true }
        });
        
        GameStateManager.saveGameState('festival-square', 'game1', {
          completed: true,
          stars: gameState.stars,
          badges: { musician: true }
        });
        
        console.log('✅ FESTIVAL CONTINUE: Completion data saved');
      }
      
      // Set next scene for resume
      setTimeout(() => {
        SimpleSceneManager.setCurrentScene('festival-square', 'game2', false, false);
        console.log('✅ FESTIVAL CONTINUE: Next game (game2) set for resume tracking');
        
        onNavigate?.('scene-complete-continue');
      }, 100);
    }}
    
    // 🎮 REPLAY: Nuclear option replay 
    onReplay={() => {
      console.log('🎮 FESTIVAL REPLAY: Bulletproof Play Again');
      
      const profileId = localStorage.getItem('activeProfileId');
      if (profileId) {
        // Clear ALL storage
        localStorage.removeItem(`temp_session_${profileId}_festival-square_game1`);
        localStorage.removeItem(`replay_session_${profileId}_festival-square_game1`);
        localStorage.removeItem(`play_again_${profileId}_festival-square_game1`);
        
        SimpleSceneManager.setCurrentScene('festival-square', 'game1', false, false);
        console.log('🗑️ FESTIVAL: All storage cleared');
      }
      
      // Force clean reload
      console.log('🔄 FESTIVAL: Forcing reload in 100ms');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }}
    
    // 🗺️ FESTIVAL MAP: Back to zone welcome
    onBackToMap={() => {
      console.log('🗺️ FESTIVAL MAP: Back to Festival Square');
      
      // Clear current scene tracking
      SimpleSceneManager.clearCurrentScene();
      
      if (onNavigate) {
        onNavigate('zone-welcome'); // Goes to Festival Square zone welcome
      }
    }}
  />
)}
        </div>
      </MessageManager>
    </InteractionManager>
  );
};

export default FestivalPianoGame;