// SimplifiedCombinedShlokRiverGame.jsx - Sarvada → Sarvakaryeshu with enhanced UI
// Pattern: Helper Animals sing → Player clicks same → Sad Animals transform to Happy Animals

import React, { useState, useEffect, useRef } from 'react';

// Game configuration - syllable sequences for each phase and round
const SYLLABLE_SEQUENCES = {
  sarvada: {
    1: ['sar', 'va'],
    2: ['sar', 'va', 'da']
  },
  sarvakaryeshu: {
    1: ['sar', 'va'],
    2: ['sar', 'va', 'kar'],
    3: ['sar', 'va', 'kar', 'yeshu']
  }
};

// Element positioning for both phases
const ELEMENT_POSITIONS = {
  sarvada: {
    helpers: [  // Helper animals that sing AND click
      { left: '70%', top: '35%', width: '110px', height: '110px' },  // sar
      { left: '15%', top: '80%', width: '165px', height: '165px' },  // va
      { left: '80%', top: '75%', width: '168px', height: '168px' }   // da
    ],
    sadAnimals: [  // Sad animals needing transformation
      { left: '60%', top: '25%', width: '81px', height: '81px' },   // sar
      { left: '25%', top: '60%', width: '74px', height: '74px' },   // va
      { left: '50%', top: '25%', width: '42px', height: '42px' }    // da
    ],
    happyAnimals: [  // Happy animals after transformation
      { left: '50%', top: '45%', width: '81px', height: '81px' },   // sar
      { left: '50%', top: '40%', width: '80px', height: '80px' },   // va
      { left: '50%', top: '60%', width: '128px', height: '128px' }  // da
    ]
  },
  sarvakaryeshu: {
    helpers: [  // Helper animals that sing AND click
      { left: '70%', top: '35%', width: '100px', height: '100px' },  // sar
      { left: '15%', top: '80%', width: '105px', height: '105px' },  // va
      { left: '80%', top: '75%', width: '118px', height: '118px' },  // kar
      { left: '35%', top: '80%', width: '100px', height: '100px' }   // yeshu
    ],
    sadAnimals: [  // Sad animals needing transformation
      { left: '60%', top: '25%', width: '110px', height: '110px' },  // sar
      { left: '25%', top: '60%', width: '94px', height: '94px' },    // va
      { left: '50%', top: '25%', width: '100px', height: '100px' },  // kar
      { left: '80%', top: '25%', width: '100px', height: '100px' }   // yeshu
    ],
    happyAnimals: [  // Happy animals after transformation
      { left: '50%', top: '45%', width: '110px', height: '108px' },  // sar
      { left: '50%', top: '40%', width: '94px', height: '94px' },    // va
      { left: '50%', top: '60%', width: '100px', height: '100px' },  // kar
      { left: '80%', top: '60%', width: '100px', height: '100px' }   // yeshu
    ]
  }
};

const SimplifiedCombinedShlokRiverGame = ({
  isActive = false,
  hideElements = false,
  onPhaseComplete,
  onGameComplete,
  profileName = 'little explorer',
  
  // Asset functions for Sarvada
  getHelperAnimalImage,     // (index) -> helper animal images (singers/clickers for both phases)
  getSadAnimalImage,        // (index) -> sad animal images (initial state)
  getHappyAnimalImage,      // (index) -> happy animal images (reward state)
  
  // Audio functions
  isAudioOn = true,
  playAudio,
  
  // State saving
  onSaveGameState,
  
  // Reload support
  isReload = false,
  initialGamePhase = 'waiting',
initialCurrentPhase = 'sarvakaryeshu',
  initialCurrentRound = 1,
  initialPlayerInput = [],
  initialCurrentSequence = [],
  initialVisualRewards = {},
  initialActivatedSingers = {},
  
  // Phase control
  powerGained = false, // For sarvakaryeshu phase activation
        forceReset = false,   // ADD THIS LINE

  
  // Cleanup callback
  onCleanup
}) => {

  // Core game state
  const [gamePhase, setGamePhase] = useState('waiting');
const [currentPhase, setCurrentPhase] = useState('sarvakaryeshu');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [canPlayerClick, setCanPlayerClick] = useState(false);
  const [singingSyllable, setSingingSyllable] = useState(null);
  
  // Visual state - handles sadAnimals → happyAnimals transformation
  const [visualRewards, setVisualRewards] = useState({});           // Which happy animals have appeared
  const [activatedSingers, setActivatedSingers] = useState({});     // Which helpers are permanently learned
  const [roundClicks, setRoundClicks] = useState({});              // Current round click tracking
  
  // Animation state
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [roundTransition, setRoundTransition] = useState(false);
  const [comboStreak, setComboStreak] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  
  // Refs for cleanup
  const timeoutsRef = useRef([]);
  const intervalsRef = useRef([]);
  const isComponentMountedRef = useRef(true);

  // ENHANCED: Comprehensive timer cleanup - CRITICAL for phase transitions
  const clearAllTimers = () => {
    console.log('🧹 Clearing all timers for clean state transition');
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    intervalsRef.current.forEach(interval => clearInterval(interval));
    timeoutsRef.current = [];
    intervalsRef.current = [];
  };

  // Safe timeout with cleanup
  const safeSetTimeout = (callback, delay) => {
    const timeout = setTimeout(() => {
      if (isComponentMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };

  // Safe interval with cleanup
  const safeSetInterval = (callback, delay) => {
    const interval = setInterval(() => {
      if (isComponentMountedRef.current) {
        callback();
      }
    }, delay);
    intervalsRef.current.push(interval);
    return interval;
  };

  // ENHANCED: Cleanup on unmount with thorough timer clearing
  useEffect(() => {
    isComponentMountedRef.current = true;
    return () => {
      console.log('🧹 SimplifiedCombinedShlokRiverGame: Component unmounting - cleaning up thoroughly');
      isComponentMountedRef.current = false;
      clearAllTimers();
      
      // Cleanup global references
      if (window.simplifiedCombinedShlokRiverGame) {
        window.simplifiedCombinedShlokRiverGame.isReady = false;
        delete window.simplifiedCombinedShlokRiverGame.startSarvakaryeshuPhase;
      }
      
      // Call cleanup callback if provided
      if (onCleanup) {
        onCleanup();
      }
    };
  }, []);

  // Cleanup when component becomes inactive
  useEffect(() => {
    if (!isActive) {
      console.log('🛑 SimplifiedCombinedShlokRiverGame: Component deactivated - clearing timers');
      clearAllTimers();
      setIsCountingDown(false);
      setIsSequencePlaying(false);
      
      if (window.simplifiedCombinedShlokRiverGame) {
        window.simplifiedCombinedShlokRiverGame.isReady = false;
      }
    } else {
      if (window.simplifiedCombinedShlokRiverGame) {
        window.simplifiedCombinedShlokRiverGame.isReady = true;
      }
    }
  }, [isActive]);

  // Audio functions for both phases
  const playSyllableAudio = (syllable) => {
    if (!isAudioOn || !playAudio) return;
    
    const syllableFiles = {
      // Sarvada syllables
      'sar': currentPhase === 'sarvada' ? 'sarvada-sar' : 'sarvakaryeshu-sar',
      'va': currentPhase === 'sarvada' ? 'sarvada-va' : 'sarvakaryeshu-va',
      'da': 'sarvada-da',
      // Sarvakaryeshu syllables
      'kar': 'sarvakaryeshu-kar',
      'yeshu': 'sarvakaryeshu-yeshu'
    };
    
    const fileName = syllableFiles[syllable];
    if (fileName) {
      const playbackRate = Math.max(0.7, 1 - (mistakeCount * 0.1));
      playAudio(`/audio/syllables/${fileName}.mp3`, playbackRate);
    }
  };

  const playCompleteWord = () => {
    if (!isAudioOn || !playAudio) return;
    
    try {
      const wordFile = currentPhase === 'sarvada' ? 'sarvada.mp3' : 'sarvakaryeshu.mp3';
      playAudio(`/audio/words/${wordFile}`, 0.9);
    } catch (error) {
      console.log('Word audio not available:', error);
    }
  };

  // Game logic functions
  const getSequenceForRound = (phase, round) => {
    return SYLLABLE_SEQUENCES[phase][round] || [];
  };

  const startNewRound = (roundNumber) => {
    const sequence = getSequenceForRound(currentPhase, roundNumber);
    setCurrentRound(roundNumber);
    setCurrentSequence(sequence);
    setPlayerInput([]);
    setRoundClicks({}); // Reset round clicks but keep permanent state
    setGamePhase('waiting');
    setCanPlayerClick(false);
    
    console.log(`🌟 Starting ${currentPhase} round ${roundNumber}:`, sequence);
    console.log('🔄 Click state reset - all helpers clickable again');
    
    // Save state
    saveGameState({
      gamePhase: 'waiting',
      currentPhase,
      currentRound: roundNumber,
      currentSequence: sequence,
      playerInput: []
    });
  };

  // Save state for reload support
  const saveGameState = (additionalState = {}) => {
    const currentState = {
      gamePhase,
      currentPhase,
      currentRound,
      playerInput,
      currentSequence,
      visualRewards,
      activatedSingers,
      comboStreak,
      mistakeCount,
      hasGameStarted,
      isCountingDown,
      countdown,
      timestamp: Date.now(),
      ...additionalState
    };
    
    if (onSaveGameState) {
      onSaveGameState(currentState);
    }
  };

  const startCountdown = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('⏰ Starting automatic countdown to sequence');
    setIsCountingDown(true);
    setCountdown(3);
    
    saveGameState({ isCountingDown: true, countdown: 3 });
    
    const countdownInterval = safeSetInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        saveGameState({ isCountingDown: newCount > 0, countdown: newCount });
        
        if (newCount <= 0) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          if (isComponentMountedRef.current) {
            playSequence();
          }
          return 0;
        }
        return newCount;
      });
    }, 800);
  };

  const playSequence = () => {
    if (currentSequence.length === 0 || !isComponentMountedRef.current) return;
    
    console.log('🎵 Playing helper animal sequence:', currentSequence);
    setIsSequencePlaying(true);
    setGamePhase('playing');
    setCanPlayerClick(false);
    setPlayerInput([]);
    setSingingSyllable(null);
    
    saveGameState({ gamePhase: 'playing' });
    
    // Play each syllable with timing
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        if (!isComponentMountedRef.current) return;
        
        console.log(`🔊 Playing syllable ${index + 1}/${currentSequence.length}: ${syllable}`);
        setSingingSyllable(syllable);
        playSyllableAudio(syllable);
        
        // Clear singing state after syllable
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            setSingingSyllable(null);
          }
        }, 600);
        
        // After last syllable, enable clicking
        if (index === currentSequence.length - 1) {
          safeSetTimeout(() => {
            if (isComponentMountedRef.current) {
              setIsSequencePlaying(false);
              setGamePhase('animal_clicking');
              setCanPlayerClick(true);
              saveGameState({ gamePhase: 'animal_clicking' });
              console.log('🐾 Sequence complete - ready for helper clicks');
            }
          }, 800);
        }
      }, index * 1200);
    });
  };

  const handleHelperClick = (syllableIndex) => {
    const currentTime = Date.now();
    
    if (!canPlayerClick || isSequencePlaying || !isComponentMountedRef.current) {
      console.log('Helper click ignored - not ready');
      return;
    }

    const clickedSyllable = currentSequence[syllableIndex];
    if (!clickedSyllable) return;

    const helperId = `helper-${clickedSyllable}`;
    if (roundClicks[helperId]) {
      console.log('Helper already clicked this round!');
      return;
    }

    // Sequential clicking validation
    const expectedIndex = playerInput.length;
    if (syllableIndex !== expectedIndex) {
      const expectedSyllable = currentSequence[expectedIndex];
      console.log(`❌ Wrong order! Expected syllable ${expectedIndex + 1} (${expectedSyllable}), but clicked syllable ${syllableIndex + 1} (${clickedSyllable})`);
      
      setGamePhase('order_error');
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          setGamePhase('animal_clicking');
        }
      }, 1500);
      
      return;
    }

    console.log(`✅ Player clicked helper for syllable: ${clickedSyllable} (position ${syllableIndex + 1})`);
    
    playSyllableAudio(clickedSyllable);
    
    // Update state
    const newPlayerInput = [...playerInput, clickedSyllable];
    setPlayerInput(newPlayerInput);
    setRoundClicks(prev => ({ ...prev, [helperId]: true }));
    setActivatedSingers(prev => ({ ...prev, [helperId]: true }));
    
    // Transform sad animal to happy animal
    setVisualRewards(prev => ({ ...prev, [`animal-${clickedSyllable}`]: true }));
    
    saveGameState({
      gamePhase: 'animal_clicking',
      playerInput: newPlayerInput,
      currentSequence: currentSequence,
      visualRewards: {
        ...visualRewards,
        [`animal-${clickedSyllable}`]: true
      }
    });
    
    // Check if round complete
    if (newPlayerInput.length === currentSequence.length) {
      handleRoundSuccess();
    }
  };

  const handleRoundSuccess = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🎊 Round ${currentRound} of ${currentPhase} completed successfully!`);
    
    setCanPlayerClick(false);
    setGamePhase('celebration');
    
    setMistakeCount(0);
    setComboStreak(prev => prev + 1);
    
    saveGameState({
      gamePhase: 'celebration',
      playerInput: playerInput,
      currentSequence: currentSequence
    });
    
    // Automatic progression with smooth transitions
    safeSetTimeout(() => {
      if (!isComponentMountedRef.current) return;
      
      const maxRounds = currentPhase === 'sarvada' ? 2 : 3;
      if (currentRound < maxRounds) {
        console.log(`➡️ AUTO-ADVANCE: Starting round ${currentRound + 1} of ${currentPhase}`);
        
        setRoundTransition(true);
        
        safeSetTimeout(() => {
          if (!isComponentMountedRef.current) return;
          
          startNewRound(currentRound + 1);
          setRoundTransition(false);
        }, 1500);
        
      } else {
        handlePhaseComplete();
      }
    }, 2000);
  };

  const handlePhaseComplete = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🏆 ${currentPhase} phase completed!`);
    setGamePhase('phase_complete');
    
    playCompleteWord();
    
    saveGameState({
      gamePhase: 'phase_complete',
      phaseJustCompleted: true,
      lastCompletedPhase: currentPhase
    });
    
    if (onPhaseComplete) {
      onPhaseComplete(currentPhase);
    }
  };

  // ENHANCED: Start Sarvakaryeshu phase with comprehensive state cleanup
const startSarvadaPhase = () => {
    console.log('🔥 STARTING SARVAKARYESHU PHASE - COMPREHENSIVE RESET 🔥');
    
    // CRITICAL: Clear all timers first to prevent interference
    clearAllTimers();
    
    // Complete state reset - more thorough than before
    setCurrentPhase('sarvakaryeshu');
    setCurrentRound(1);
    setPlayerInput([]);
    setRoundClicks({});
    setVisualRewards({});
    setActivatedSingers({});
    setIsSequencePlaying(false);
    setCanPlayerClick(false);
    setSingingSyllable(null);
    setCountdown(0);
    setIsCountingDown(false);
    setGamePhase('waiting');
    setComboStreak(0);
    setMistakeCount(0);
    setRoundTransition(false);
    
    // Get sequence and set it
    const sequence = getSequenceForRound('sarvakaryeshu', 1);
    console.log('Sarvakaryeshu sequence:', sequence);
    setCurrentSequence(sequence);
    
    // Immediate state save with complete clean state
    saveGameState({
      gamePhase: 'waiting',
      currentPhase: 'sarvada',
      currentRound: 1,
      currentSequence: sequence,
      playerInput: [],
      visualRewards: {},
      activatedSingers: {}
    });
    
    console.log('✅ Sarvakaryeshu phase initialized with clean state');
  };

  // Expose global function for parent to call
  useEffect(() => {
    if (!isActive) return;
    
    console.log('🎮 Setting up global functions for SimplifiedCombinedShlokRiverGame');
    
    if (!window.simplifiedCombinedShlokRiverGame) {
      window.simplifiedCombinedShlokRiverGame = {};
    }
    
window.simplifiedCombinedShlokRiverGame.startSarvadaPhase = startSarvadaPhase;
    window.simplifiedCombinedShlokRiverGame.isReady = true;
    
    console.log('✅ Global function registered:', typeof window.simplifiedCombinedShlokRiverGame.startSarvakaryeshuPhase);
    
    return () => {
      console.log('🧹 Cleaning up global functions');
      if (window.simplifiedCombinedShlokRiverGame) {
        window.simplifiedCombinedShlokRiverGame.isReady = false;
        delete window.simplifiedCombinedShlokRiverGame.startSarvakaryeshuPhase;
      }
    };
  }, [isActive]);

 // Enhanced Initialize game with force reset support for SimplifiedCombinedShlokRiverGame
// Replace the existing initialization useEffect (around line 345) with this:

useEffect(() => {
  if (!isActive) return;
  
  // CHECK FOR FORCE RESET FIRST
  if (forceReset || (window.simplifiedCombinedShlokRiverGame && window.simplifiedCombinedShlokRiverGame.isForceReset)) {
    console.log('🔥 FORCE RESET: Starting completely fresh, clearing all visual rewards');
    
    // Clear the force reset flag
    if (window.simplifiedCombinedShlokRiverGame) {
      window.simplifiedCombinedShlokRiverGame.isForceReset = false;
    }
    
    // COMPLETE STATE RESET
    setCurrentPhase('sarvakaryeshu');  // Start with sarvakaryeshu as per your component
    setCurrentRound(1);
    setPlayerInput([]);
    setRoundClicks({});
    setVisualRewards({}); // CLEAR ALL REWARDS - shows sad animals in initial state
    setActivatedSingers({});
    setIsSequencePlaying(false);
    setCanPlayerClick(false);
    setSingingSyllable(null);
    setCountdown(0);
    setIsCountingDown(false);
    setGamePhase('waiting');
    setComboStreak(0);
    setMistakeCount(0);
    setRoundTransition(false);
    setHasGameStarted(false);
    
    const sequence = getSequenceForRound('sarvakaryeshu', 1);
    setCurrentSequence(sequence);
    
    console.log('🔥 FORCE RESET COMPLETE: All visual rewards cleared, back to sad animals state');
    return;
  }
  
  console.log('🎯 INITIALIZING SimplifiedCombinedShlokRiverGame:', { 
    isReload, 
    initialCurrentPhase, 
    initialCurrentRound,
    hasValidReloadData: !!(isReload && initialCurrentPhase && initialCurrentSequence?.length > 0)
  });
  
  if (isReload && initialCurrentPhase && initialCurrentSequence?.length > 0) {
    // Restore state from reload
    console.log('📂 Restoring game state:', { initialCurrentPhase, initialCurrentRound });
    setCurrentPhase(initialCurrentPhase);
    setCurrentRound(initialCurrentRound);
    setCurrentSequence(initialCurrentSequence);
    setPlayerInput(initialPlayerInput);
    setGamePhase(initialGamePhase);
    setVisualRewards(initialVisualRewards || {});
    setActivatedSingers(initialActivatedSingers || {});
    setHasGameStarted(true);
    
    // Rebuild round clicks from player input
    const clicks = {};
    initialPlayerInput.forEach(syllable => {
      clicks[`helper-${syllable}`] = true;
    });
    setRoundClicks(clicks);
    
  } else {
    // Start new game - always start with Sarvakaryeshu
    console.log('🆕 Starting fresh game - Sarvakaryeshu phase');
    setCurrentPhase('sarvakaryeshu');
    setHasGameStarted(true);
    startNewRound(1);
  }
}, [isActive, isReload, forceReset]); // Add forceReset to dependency array

  // Auto-start countdown when waiting
  useEffect(() => {
    if (!isActive || !isComponentMountedRef.current) return;
    
    if (gamePhase === 'waiting' && currentSequence.length > 0 && !isCountingDown) {
      if (!hasGameStarted && !isReload) {
        console.log('🎮 FIRST TIME: Auto-starting for new game');
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            startCountdown();
          }
        }, 1200);
      } else if (hasGameStarted) {
        console.log('🔄 AUTO-FLOW: Starting countdown automatically for subsequent round');
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            startCountdown();
          }
        }, 1200);
      }
    }
  }, [gamePhase, isActive, currentSequence, isCountingDown, hasGameStarted, isReload]);

  // Helper functions
  const isHelperSinging = (syllable) => {
    return singingSyllable === syllable;
  };

  const isHelperClickable = (syllableIndex) => {
    if (!canPlayerClick || syllableIndex >= currentSequence.length) return false;
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const hasHelperBeenClicked = (syllableIndex) => {
    return syllableIndex < playerInput.length;
  };

  const isHelperActivated = (syllable) => {
    return activatedSingers[`helper-${syllable}`];
  };

  const isHappyAnimalActive = (syllable) => {
    return visualRewards[`animal-${syllable}`];
  };

  const isNextExpected = (syllableIndex) => {
    if (!canPlayerClick) return false;
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  // Round jumping function
  const jumpToRound = (round) => {
    console.log(`Jumping to ${currentPhase} round ${round}`);
    startNewRound(round);
  };

  // Get current positions based on phase
  const getCurrentPositions = () => {
    return ELEMENT_POSITIONS[currentPhase];
  };

  // Render functions
  const renderHelper = (syllable, index) => {
    const positions = getCurrentPositions();
    const position = positions.helpers[index];
    const isSinging = isHelperSinging(syllable);
    const isClickable = isHelperClickable(index);
    const hasBeenClicked = hasHelperBeenClicked(index);
    const isActivated = isHelperActivated(syllable);
    const isNext = isNextExpected(index);
    
    // Enhanced visual states with glow effects
    let helperStyle = {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
      transition: 'all 0.3s ease'
    };
    
    if (isSinging) {
      helperStyle.transform = 'translate(-50%, -50%) scale(1.15)';
      helperStyle.filter = 'brightness(1.4) drop-shadow(0 0 15px #FFD700)';
      helperStyle.animation = 'sing 0.6s ease-in-out';
    } else if (isNext && !hasBeenClicked) {
      helperStyle.filter = 'brightness(1.2) drop-shadow(0 0 8px #FF9800)';
      helperStyle.animation = 'nextToClick 1.5s ease-in-out infinite';
    } else if (hasBeenClicked) {
      helperStyle.opacity = 0.8;
      helperStyle.filter = 'brightness(0.8) saturate(0.7)';
    } else if (isActivated && !hasBeenClicked) {
      helperStyle.filter = 'brightness(1.2) saturate(1.4) drop-shadow(0 0 10px #FF9800)';
      helperStyle.animation = 'animalGlow 2s ease-in-out infinite';
    } else if (!canPlayerClick) {
      helperStyle.opacity = 0.6;
    }

    return (
      <button
        key={`helper-${syllable}`}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          border: 'none',
          background: 'transparent',
          cursor: isClickable ? 'pointer' : 'default',
          zIndex: 20,
          borderRadius: '50%',
          ...helperStyle
        }}
        onClick={() => handleHelperClick(index)}
        disabled={!isClickable}
      >
        {getHelperAnimalImage && (
          <img
            src={getHelperAnimalImage(index)}
            alt={`Helper animal ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {/* Singing indicator */}
        {isSinging && (
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '16px',
            animation: 'musicalNote 0.6s ease-in-out'
          }}>
            🎵
          </div>
        )}
        
        {/* Golden circle for next click */}
        {isNext && !hasBeenClicked && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            height: '85%',
            border: '2px solid #FFD700',
            borderRadius: '50%',
            animation: 'goldenPulse 2s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
        )}
        
        {/* Syllable label */}
        <div style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: hasBeenClicked 
            ? 'rgba(76, 175, 80, 0.9)' 
            : isNext
            ? 'rgba(255, 193, 7, 0.9)'
            : 'rgba(158, 158, 158, 0.8)',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}>
          {syllable.toUpperCase()}
        </div>
        
        {/* Success checkmark */}
        {hasBeenClicked && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
            animation: 'checkmarkAppear 0.5s ease-out'
          }}>
            ✓
          </div>
        )}
      </button>
    );
  };

  const renderSadAnimal = (syllable, index) => {
    const positions = getCurrentPositions();
    const position = positions.sadAnimals[index];
    const isTransformed = isHappyAnimalActive(syllable);
    
    // Phase 2 behavior: Don't show sad animal if happy animal exists
    if (currentPhase === 'sarvakaryeshu' && isTransformed) return null;
    
    // Phase 1 behavior: Show sad animal until transformed, then show alongside happy
    if (currentPhase === 'sarvada' && isTransformed) return null;

    return (
      <div
        key={`sad-${syllable}`}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          zIndex: 15,
          transform: 'translate(-50%, -50%)',
          opacity: 0.8
        }}
      >
        {getSadAnimalImage && (
          <img
            src={getSadAnimalImage(index)}
            alt={`Sad animal ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
    );
  };

  const renderHappyAnimal = (syllable, index) => {
    const positions = getCurrentPositions();
    const position = positions.happyAnimals[index];
    const isVisible = isHappyAnimalActive(syllable);
    
    if (!isVisible) return null;
    
    // Phase 2 specific: Happy animals can sing when their syllable plays
    const shouldSing = currentPhase === 'sarvakaryeshu' && singingSyllable === syllable;
    
    const happyStyle = {
      filter: shouldSing 
        ? 'brightness(1.4) drop-shadow(0 0 25px #FFD700)'
        : 'brightness(1.3) saturate(1.4) drop-shadow(0 0 12px #FFB74D)',
      transform: shouldSing 
        ? 'translate(-50%, -50%) scale(1.15)' 
        : 'translate(-50%, -50%) scale(1)',
      animation: shouldSing 
        ? 'sing 0.6s ease-in-out'
        : 'rewardGlow 2s ease-in-out infinite'
    };
    
    return (
      <div
        key={`happy-${syllable}`}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          zIndex: 10,
          transition: 'all 0.3s ease',
          ...happyStyle
        }}
      >
        {getHappyAnimalImage && (
          <img
            src={getHappyAnimalImage(index, isVisible ? 1 : 0)}
            alt={`Happy animal ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {/* Sparkle effect */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '20px',
          animation: 'sparkleFloat 1s ease-in-out infinite'
        }}>
          ✨
        </div>
        
        {/* Phase 2: Musical note when singing */}
        {shouldSing && (
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '18px',
            animation: 'musicalNote 0.6s ease-in-out'
          }}>
            🎵
          </div>
        )}
      </div>
    );
  };

  const getStatusMessage = () => {
    if (roundTransition) return `Preparing Round ${currentRound + 1}...`;
    if (isCountingDown) return `Get Ready... ${countdown}`;
    if (gamePhase === 'playing') return 'Listen to the helper animals...';
    if (gamePhase === 'animal_clicking') return `Click the helpers! (${playerInput.length}/${currentSequence.length})`;
    if (gamePhase === 'celebration') return comboStreak >= 3 ? 'Amazing transformation streak!' : 'Beautiful! Animals are happy!';
    if (gamePhase === 'phase_complete') return 'Phase Complete!';
    if (gamePhase === 'order_error') return 'Click the helpers in order!';
    return `Round ${currentRound} - ${currentPhase.toUpperCase()}`;
  };

  if (!isActive) return null;

  // Don't show Sarvakaryeshu elements if power not gained
  const shouldShowElements = currentPhase === 'sarvada' || (currentPhase === 'sarvakaryeshu' && powerGained);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 20,
      pointerEvents: 'auto'
    }}>
      
      {/* Progress indicator */}
      {!hideElements && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 40,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,215,0,0.2)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '11px',
            color: '#FF9800',
            letterSpacing: '0.3px'
          }}>
            {currentPhase.toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(currentPhase === 'sarvada' ? [1, 2] : [1, 2, 3]).map(round => (
              <div
                key={round}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: round <= currentRound 
                    ? (round < currentRound ? '#4CAF50' : '#FF9800')
                    : '#E0E0E0',
                  transition: 'all 0.3s ease',
                  boxShadow: round === currentRound ? '0 0 6px rgba(255, 152, 0, 0.4)' : 'none'
                }}
              />
            ))}
          </div>
          {/* Syllable Progress */}
          {canPlayerClick && currentSequence.length > 0 && (
            <div style={{
              fontSize: '10px',
              color: '#666',
              fontWeight: '500',
              background: 'rgba(76, 175, 80, 0.1)',
              padding: '2px 6px',
              borderRadius: '8px'
            }}>
              {playerInput.length}/{currentSequence.length}
            </div>
          )}
        </div>
      )}

      {/* Round Selector */}
      {!hideElements && (gamePhase === 'waiting' || gamePhase === 'animal_clicking') && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '135px',
          display: 'flex',
          gap: '4px',
          zIndex: 45
        }}>
          {(currentPhase === 'sarvada' ? [1, 2] : [1, 2, 3]).map(round => (
            <button 
              key={round} 
              onClick={() => jumpToRound(round)} 
              style={{
                fontSize: '8px', 
                padding: '3px 6px', 
                borderRadius: '6px',
                background: round === currentRound ? '#FF9800' : 'rgba(255, 183, 77, 0.7)', 
                color: 'white', 
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                minWidth: '18px'
              }}
            >
              {round}
            </button>
          ))}
        </div>
      )}
      
      {/* Status message */}
      {!hideElements && gamePhase !== 'phase_complete' && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '20%',
          transform: 'translateX(-50%)',
          background: isCountingDown 
            ? 'rgba(255, 152, 0, 0.9)' 
            : gamePhase === 'celebration'
            ? 'rgba(76, 175, 80, 0.9)'
            : gamePhase === 'order_error'
            ? 'rgba(244, 67, 54, 0.9)'
            : 'rgba(255, 152, 0, 0.9)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          textAlign: 'center',
          zIndex: 50,
          maxWidth: '200px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease'
        }}>
          {getStatusMessage()}
        </div>
      )}

      {/* Countdown */}
      {!hideElements && isCountingDown && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#FF9800',
          textShadow: '0 0 30px rgba(255, 152, 0, 0.8)',
          zIndex: 100,
          animation: 'countdownPulse 0.8s ease-in-out'
        }}>
          {countdown}
        </div>
      )}

      {/* Game elements */}
      {!hideElements && shouldShowElements && (
        <>
          {/* Helper Animals (Singers/Clickers) */}
          {currentSequence.map((syllable, index) => 
            renderHelper(syllable, index)
          )}
          
          {/* Sad Animals (Initial state before transformation) */}
          {currentSequence.map((syllable, index) => 
            renderSadAnimal(syllable, index)
          )}
          
          {/* Happy Animals (Reward state after transformation) */}
          {currentSequence.map((syllable, index) => 
            renderHappyAnimal(syllable, index)
          )}
        </>
      )}

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes countdownPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        }
        
        @keyframes sing {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes nextToClick {
          0%, 100% { 
            filter: brightness(1.2) drop-shadow(0 0 8px #FF9800);
          }
          50% { 
            filter: brightness(1.4) drop-shadow(0 0 15px #FFB74D);
          }
        }
        
        @keyframes animalGlow {
          0%, 100% { 
            filter: brightness(1.2) saturate(1.4) drop-shadow(0 0 10px #FF9800);
          }
          50% { 
            filter: brightness(1.4) saturate(1.6) drop-shadow(0 0 15px #FFB74D);
          }
        }
        
        @keyframes goldenPulse {
          0%, 100% { 
            opacity: 0.7; 
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
        
        @keyframes musicalNote {
          0% { transform: translateX(-50%) translateY(0) scale(0.8); opacity: 0; }
          50% { transform: translateX(-50%) translateY(-10px) scale(1.2); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-20px) scale(0.8); opacity: 0; }
        }
        
        @keyframes checkmarkAppear {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes sparkleFloat {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.2); }
        }
        
        @keyframes rewardGlow {
          0%, 100% { 
            filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 12px #FFB74D);
          }
          50% { 
            filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 20px #FFD700);
          }
        }
      `}</style>
    </div>
  );
};

export default SimplifiedCombinedShlokRiverGame;