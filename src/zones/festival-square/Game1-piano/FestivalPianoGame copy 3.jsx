import React, { useState, useEffect, useRef } from 'react';
import './FestivalPianoGame.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import { ClickableElement } from "../../../../lib/components/scenes/InteractionManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach, TriggerCoach } from '../../../../lib/components/coach/GameCoach';
import ProgressManager from '../../../../lib/services/ProgressManager';
import SimpleSceneManager from '../../../../lib/services/SimpleSceneManager';


import FestivalSquareCompletion from '../components/FestivalSquareCompletion';
import musicBadge from './assets/images/music-badge.png';
import ganeshaCompletion from './assets/images/ganesha-musician.png'; // Same image or different
import ganeshaGameScene from './assets/images/ganesha-musician.png';


// Game phases for progression
const PHASES = {
  DISCOVERY: 'discovery',
  CELEBRATION: 'celebration',
  COMPLETE: 'complete'
};

// Animal to instrument mapping
const ANIMAL_INSTRUMENT_MAP = {
  'dhol': 'monkey',        // Energetic drums = playful monkey
  'cymbals': 'peacock',    // Golden cymbals = majestic peacock
  'bells': 'elephant',     // Sacred bells = wise elephant
  'shehnai': 'squirrel',   // Nature horn = lively squirrel
  'drum': 'bunny'          // Bouncy drum = hopping bunny
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
  const [showCulturalNote, setShowCulturalNote] = useState(null);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  
  // Dancing animals state
  const [dancingAnimals, setDancingAnimals] = useState(new Set());
  const [showDanceFloor, setShowDanceFloor] = useState(false);
  const [danceParticles, setDanceParticles] = useState([]);

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

// Add this with your other useRef declarations
const particleCounterRef = useRef(0);

// Then update createDanceParticles to use the counter:
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
      id: `particle-${particleCounterRef.current}`, // Sequential unique IDs
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      left: Math.random() * 100,
      animationDelay: Math.random() * 0.5
    };
  });

  setDanceParticles(prev => [...prev, ...newParticles]);

  // Remove particles after animation
  safeSetTimeout(() => {
    setDanceParticles(prev => 
      prev.filter(p => !newParticles.some(np => np.id === p.id))
    );
  }, 2000);
};

  // Trigger animal dance
  const triggerAnimalDance = (instrumentId) => {
    const animalType = ANIMAL_INSTRUMENT_MAP[instrumentId];
    if (!animalType) return;

    console.log(`${animalType} is dancing to ${instrumentId}!`);

    // Add dancing animal
    setDancingAnimals(prev => new Set([...prev, animalType]));
    
    // Show dance floor effect
    setShowDanceFloor(true);
    
    // Create dance particles
    createDanceParticles(animalType);

    // Remove dancing state after animation
    safeSetTimeout(() => {
      setDancingAnimals(prev => {
        const newSet = new Set(prev);
        newSet.delete(animalType);
        return newSet;
      });
      setShowDanceFloor(false);
    }, 1200);
  };

  // Trigger group dance (when multiple animals dance together)
  const triggerGroupDance = () => {
    console.log('Group dance party!');
    
    const allAnimals = ['peacock', 'monkey', 'elephant', 'squirrel', 'bunny'];
    
    // Make all animals dance
    setDancingAnimals(new Set(allAnimals));
    setShowDanceFloor(true);
    
    // Create rainbow particles
    allAnimals.forEach((animal, index) => {
      safeSetTimeout(() => createDanceParticles(animal), index * 200);
    });

    // Extended dance time for group celebration
    safeSetTimeout(() => {
      setDancingAnimals(new Set());
      setShowDanceFloor(false);
    }, 2000);
  };

  // Handle key press with dancing
  const handleKeyPress = (instrumentId) => {
    const instrument = INSTRUMENTS.find(i => i.id === instrumentId);
    if (!instrument || gameState.phase === PHASES.COMPLETE) return;

    console.log(`Playing ${instrument.name}`);

    // Play sound
    playInstrumentSound(instrument);

    // Trigger animal dance
    triggerAnimalDance(instrumentId);

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

    // Trigger group dance for celebration
    if ((newTapCount === 7 || newTapCount === 8) && !gameState.celebrationStarted) {
      safeSetTimeout(() => {
        triggerGentleCelebration();
        // Add extra group dance
        safeSetTimeout(() => triggerGroupDance(), 1500);
      }, 1000);
    }

    // Multiple instruments in quick succession = group dance
    if (newDiscovered.size >= 3 && newTapCount % 4 === 0) {
      safeSetTimeout(() => triggerGroupDance(), 500);
    }

    // Clear visual effects
    safeSetTimeout(() => {
      setActiveKey(null);
      setShowSparkle(null);
    }, 600);
  };

  // Trigger gentle celebration with dancing
  const triggerGentleCelebration = () => {
    if (gameState.celebrationStarted) return;

    console.log('Starting gentle celebration with animal dance');
    
    setGameState(prev => ({
      ...prev,
      celebrationStarted: true,
      showDoneButton: true
    }));

    // Show confetti and sparkles
    setShowSparkle('gentle-celebration');
    
    safeSetTimeout(() => {
      setShowSparkle(null);
    }, 3000);
  };

  const handleManualCompletion = () => {
    console.log('Manual completion triggered');
    
    // Final group dance celebration
    triggerGroupDance();
    
    setGameState(prev => ({
      ...prev,
      phase: PHASES.COMPLETE,
      completed: true,
      stars: Math.max(8, prev.stars)
    }));

    // Show completion badge briefly, then show Festival completion
    setShowCompletionBadge(true);

    safeSetTimeout(() => {
      setShowCompletionBadge(false);
      setShowSceneCompletion(true);
    }, 3000);
  };

  const handleRestart = () => {
  console.log('Restarting game');
  
  // Reset all game state
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

  // Reset all UI state
  setActiveKey(null);
  setShowSparkle(null);
  setShowCulturalNote(null);
  setShowCompletionBadge(false);
  setShowSceneCompletion(false);
  setDancingAnimals(new Set());
  setShowDanceFloor(false);
  setDanceParticles([]);

  // Clear any active timeouts
  timeoutsRef.current.forEach(id => clearTimeout(id));
  timeoutsRef.current = [];
};

  return (
    <div className="festival-piano-container">
      {/* Background */}
      <div className="piano-background" />

      {/* Simple Ganesha Character - Peaceful Observer */}
<div className="ganesha-simple">
  <div 
    className="ganesha-simple-image" 
    style={{ backgroundImage: `url(${ganeshaGameScene})` }}
  />
</div>
      
      {/* Dancing Animals Container */}
      <div className="dancing-animals">
        {/* Peacock */}
        <div className={`animal-character animal-peacock ${
          dancingAnimals.has('peacock') ? 'animal-dancing' : ''
        }`}>
          {dancingAnimals.has('peacock') && (
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

        {/* Monkey */}
        <div className={`animal-character animal-monkey ${
          dancingAnimals.has('monkey') ? 'animal-dancing' : ''
        }`}>
          {dancingAnimals.has('monkey') && (
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

        {/* Elephant */}
        <div className={`animal-character animal-elephant ${
          dancingAnimals.has('elephant') ? 'animal-dancing' : ''
        }`}>
          {dancingAnimals.has('elephant') && (
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

        {/* Squirrel */}
        <div className={`animal-character animal-squirrel ${
          dancingAnimals.has('squirrel') ? 'animal-dancing' : ''
        }`}>
          {dancingAnimals.has('squirrel') && (
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

        {/* Bunny */}
        <div className={`animal-character animal-bunny ${
          dancingAnimals.has('bunny') ? 'animal-dancing' : ''
        }`}>
          {dancingAnimals.has('bunny') && (
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
      </div>

      {/* Dance Floor Effect */}
      {showDanceFloor && <div className="dance-floor-effect" />}

      {/* Dance Particles */}
      {danceParticles.length > 0 && (
        <div className="dance-particles">
          {danceParticles.map((particle) => (
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
        {/* Piano Keys Frame */}
        <div className="piano-keys-frame-simple" />
        
        {/* Piano Keys */}
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
            {/* Instrument Icon */}
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

      {/* Restart Button */}
<div className="restart-button" onClick={handleRestart}>
  <span>🔄</span>
  <span>Start Over</span>
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

      {/* Completion Badge */}
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
    
 // 🎮 REPLAY: Navigate through welcome screen (like pond scene)
onReplay={() => {
  console.log('🎮 FESTIVAL REPLAY: Going through welcome screen');
  
  const profileId = localStorage.getItem('activeProfileId');
  if (profileId) {
    // Clear ALL storage
    localStorage.removeItem(`temp_session_${profileId}_festival-square_game1`);
    localStorage.removeItem(`replay_session_${profileId}_festival-square_game1`);
    localStorage.removeItem(`play_again_${profileId}_festival-square_game1`);
    
    console.log('🗑️ FESTIVAL: All storage cleared');
  }
  
  // Clear current scene tracking
  SimpleSceneManager.clearCurrentScene();
  
  // Navigate to welcome screen (same as pond scene)
  if (onNavigate) {
    onNavigate('home'); // Goes to CleanGameWelcomeScreen
  }
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
  );
};

export default FestivalPianoGame;