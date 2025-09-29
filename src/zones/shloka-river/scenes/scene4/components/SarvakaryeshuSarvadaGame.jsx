// SarvakaryeshuSarvadaGame.jsx - Combined Sarvakaryeshu + Sarvada
// Pattern: Animals sing → Player clicks animals → Visual rewards transform

import React, { useState, useEffect, useRef } from 'react';

// Game configuration - syllable sequences for each phase and round
const SYLLABLE_SEQUENCES = {
  sarvakaryeshu: {
    1: ['sar', 'va'],
    2: ['sar', 'va', 'kar'],
    3: ['sar', 'va', 'kar', 'yeshu']
  },
  sarvada: {
    1: ['sav', 'va'],
    2: ['sav', 'va', 'da']
  }
};

// Element positioning for both phases
const ELEMENT_POSITIONS = {
  sarvakaryeshu: {
    singers: [  // Helper animals that sing AND get clicked
      { left: '70%', top: '25%' },  // sarSquirrelHelper (sar)
      { left: '15%', top: '70%' },  // vaBirdHelper (va)
      { left: '80%', top: '65%' },  // karDuckHelper (kar)
      { left: '35%', top: '70%' }   // yeshuRabbitHelper (yeshu)
    ],
    initials: [  // Sad animals (initial state - same position as singers)
      { left: '60%', top: '35%' },  // sarSquirrelSad
      { left: '15%', top: '80%' },  // vaBirdSad
      { left: '80%', top: '75%' },  // karDuckSad
      { left: '35%', top: '80%' }   // yeshuRabbitSad
    ],
    rewards: [  // Happy animals (reward state - same position)
      { left: '70%', top: '35%' },  // sarSquirrelHappy
      { left: '15%', top: '80%' },  // vaBirdHappy
      { left: '80%', top: '75%' },  // karDuckHappy
      { left: '35%', top: '80%' }   // yeshuRabbitHappy
    ]
  },
  sarvada: {
    singers: [  // Helper animals that sing AND get clicked
      { left: '70%', top: '25%' },  // savButterflyHelper (sav)
      { left: '15%', top: '60%' },  // vaFawnHelper (va)
      { left: '80%', top: '95%' }   // daHedgehogHelper (da)
    ],
    initials: [  // Sad animals (initial state - same position as singers)
      { left: '70%', top: '35%' },  // savButterflySad
      { left: '15%', top: '80%' },  // vaFawnSad
      { left: '80%', top: '75%' }   // daHedgehogSad
    ],
    rewards: [  // Happy animals (reward state - same position)
      { left: '70%', top: '35%' },  // savButterflyHappy
      { left: '15%', top: '80%' },  // vaFawnHappy
      { left: '80%', top: '75%' }   // daHedgehogHappy
    ]
  }
};

const SarvakaryeshuSarvadaGame = ({
  isActive = false,
  hideElements = false,
  onPhaseComplete,
  onGameComplete,
  profileName = 'little explorer',
  
  // Asset functions for Sarvakaryeshu (Phase 1)
  getSarSquirrelHelperImage,     // () -> sarSquirrelHelper images (singer/clicker for sar)
  getVaBirdHelperImage,          // () -> vaBirdHelper images (singer/clicker for va)
  getKarDuckHelperImage,         // () -> karDuckHelper images (singer/clicker for kar)
  getYeshuRabbitHelperImage,     // () -> yeshuRabbitHelper images (singer/clicker for yeshu)
  getSarSquirrelSadImage,        // () -> sarSquirrelSad images (initial state)
  getVaBirdSadImage,             // () -> vaBirdSad images (initial state)
  getKarDuckSadImage,            // () -> karDuckSad images (initial state)
  getYeshuRabbitSadImage,        // () -> yeshuRabbitSad images (initial state)
  getSarSquirrelHappyImage,      // () -> sarSquirrelHappy images (reward state)
  getVaBirdHappyImage,           // () -> vaBirdHappy images (reward state)
  getKarDuckHappyImage,          // () -> karDuckHappy images (reward state)
  getYeshuRabbitHappyImage,      // () -> yeshuRabbitHappy images (reward state)
  
  // Asset functions for Sarvada (Phase 2)
  getSavButterflyHelperImage,    // () -> savButterflyHelper images (singer/clicker for sav)
  getVaFawnHelperImage,          // () -> vaFawnHelper images (singer/clicker for va)
  getDaHedgehogHelperImage,      // () -> daHedgehogHelper images (singer/clicker for da)
  getSavButterflySadImage,       // () -> savButterflySad images (initial state)
  getVaFawnSadImage,             // () -> vaFawnSad images (initial state)
  getDaHedgehogSadImage,         // () -> daHedgehogSad images (initial state)
  getSavButterflyHappyImage,     // () -> savButterflyHappy images (reward state)
  getVaFawnHappyImage,           // () -> vaFawnHappy images (reward state)
  getDaHedgehogHappyImage,       // () -> daHedgehogHappy images (reward state)
  
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
  powerGained = false // For sarvada phase activation
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
  
  // Visual state - handles both animal transformations
  const [visualRewards, setVisualRewards] = useState({});           // Which rewards have appeared
  const [activatedSingers, setActivatedSingers] = useState({});     // Which singers are permanently learned
  const [roundClicks, setRoundClicks] = useState({});              // Current round click tracking
  
  // Animation state
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  
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
      console.log('🧹 SarvakaryeshuSarvadaGame: Component unmounting - cleaning up thoroughly');
      isComponentMountedRef.current = false;
      clearAllTimers();
      
      // Cleanup global references
      if (window.sarvakaryeshuSarvadaGame) {
        window.sarvakaryeshuSarvadaGame.isReady = false;
        delete window.sarvakaryeshuSarvadaGame.startSarvadaPhase;
      }
    };
  }, []);

  // Audio functions for both phases
  const playSyllableAudio = (syllable) => {
    if (!isAudioOn || !playAudio) return;
    
    const syllableFiles = {
      // Sarvakaryeshu syllables
      'sar': 'sarvakaryeshu-sar',
      'va': currentPhase === 'sarvakaryeshu' ? 'sarvakaryeshu-va' : 'sarvada-va',
      'kar': 'sarvakaryeshu-kar',
      'yeshu': 'sarvakaryeshu-yeshu',
      // Sarvada syllables
      'sav': 'sarvada-sav',
      'da': 'sarvada-da'
    };
    
    const fileName = syllableFiles[syllable];
    if (fileName) {
      playAudio(`/audio/syllables/${fileName}.mp3`);
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
    
    console.log(`Starting ${currentPhase} round ${roundNumber}:`, sequence);
    
    // Save state
    if (onSaveGameState) {
      onSaveGameState({
        gamePhase: 'waiting',
        currentPhase,
        currentRound: roundNumber,
        currentSequence: sequence,
        playerInput: [],
        visualRewards,
        activatedSingers
      });
    }
  };

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(3);
    
    const countdownInterval = safeSetInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          playSequence();
          return 0;
        }
        return prev - 1;
      });
    }, 800);
  };

  const playSequence = () => {
    if (currentSequence.length === 0) return;
    
    setIsSequencePlaying(true);
    setGamePhase('playing');
    setCanPlayerClick(false);
    setPlayerInput([]);
    setSingingSyllable(null);
    
    // Play each syllable with timing
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        setSingingSyllable(syllable);
        playSyllableAudio(syllable);
        
        // Clear singing state after syllable
        safeSetTimeout(() => {
          setSingingSyllable(null);
        }, 600);
        
        // After last syllable, enable clicking
        if (index === currentSequence.length - 1) {
          safeSetTimeout(() => {
            setIsSequencePlaying(false);
            setGamePhase('listening');
            setCanPlayerClick(true);
            console.log('Sequence complete - ready for clicks');
          }, 800);
        }
      }, index * 1200);
    });
  };

  const handleSingerClick = (syllableIndex) => {
    if (!canPlayerClick || isSequencePlaying) return;
    
    const clickedSyllable = currentSequence[syllableIndex];
    if (!clickedSyllable) return;
    
    // Check if already clicked this round
    if (roundClicks[`singer-${clickedSyllable}`]) {
      console.log('Already clicked this round');
      return;
    }
    
    // Sequential clicking - must click in order
    const expectedIndex = playerInput.length;
    if (syllableIndex !== expectedIndex) {
      console.log(`Wrong order! Expected index ${expectedIndex}, clicked ${syllableIndex}`);
      return;
    }
    
    console.log(`Clicked ${currentPhase} singer: ${clickedSyllable}`);
    
    // Play audio
    playSyllableAudio(clickedSyllable);
    
    // Update state
    const newPlayerInput = [...playerInput, clickedSyllable];
    setPlayerInput(newPlayerInput);
    setRoundClicks(prev => ({ ...prev, [`singer-${clickedSyllable}`]: true }));
    setActivatedSingers(prev => ({ ...prev, [`singer-${clickedSyllable}`]: true }));
    
    // Transform visual reward - animal becomes happy
    setVisualRewards(prev => ({ ...prev, [`animal-${clickedSyllable}`]: true }));
    
    // Check if round complete
    if (newPlayerInput.length === currentSequence.length) {
      handleRoundSuccess();
    }
  };

  const handleRoundSuccess = () => {
    setCanPlayerClick(false);
    setGamePhase('celebration');
    
    console.log(`${currentPhase} round ${currentRound} complete!`);
    
    // Auto-advance to next round or complete phase
    safeSetTimeout(() => {
      const maxRounds = currentPhase === 'sarvakaryeshu' ? 3 : 2;
      if (currentRound < maxRounds) {
        startNewRound(currentRound + 1);
      } else {
        handlePhaseComplete();
      }
    }, 2000);
  };

  const handlePhaseComplete = () => {
    setGamePhase('phase_complete');
    console.log(`${currentPhase} phase completed!`);
    
    if (onPhaseComplete) {
      onPhaseComplete(currentPhase);
    }
    
    // Auto-start Sarvada if Sarvakaryeshu is complete and power gained
    if (currentPhase === 'sarvakaryeshu' && onGameComplete) {
      // Let parent handle phase transition
    } else if (currentPhase === 'sarvada' && onGameComplete) {
      onGameComplete();
    }
  };

  // ENHANCED: Start Sarvada phase with comprehensive state cleanup
  const startSarvadaPhase = () => {
    console.log('🎥 STARTING SARVADA PHASE - COMPREHENSIVE RESET 🎥');
    
    // CRITICAL: Clear all timers first to prevent interference
    clearAllTimers();
    
    // Complete state reset
    setCurrentPhase('sarvada');
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
    
    // Get sequence and set it
    const sequence = getSequenceForRound('sarvada', 1);
    console.log('Sarvada sequence:', sequence);
    setCurrentSequence(sequence);
    
    // Immediate state save with complete clean state
    if (onSaveGameState) {
      onSaveGameState({
        gamePhase: 'waiting',
        currentPhase: 'sarvada',
        currentRound: 1,
        currentSequence: sequence,
        playerInput: [],
        visualRewards: {},
        activatedSingers: {}
      });
    }
    
    console.log('✅ Sarvada phase initialized with clean state');
  };

  // Expose global function for parent to call
  useEffect(() => {
    if (!isActive) return;
    
    console.log('🌟 Setting up global functions for SarvakaryeshuSarvadaGame');
    
    if (!window.sarvakaryeshuSarvadaGame) {
      window.sarvakaryeshuSarvadaGame = {};
    }
    
    window.sarvakaryeshuSarvadaGame.startSarvadaPhase = startSarvadaPhase;
    window.sarvakaryeshuSarvadaGame.isReady = true;
    
    console.log('✅ Global function registered:', typeof window.sarvakaryeshuSarvadaGame.startSarvadaPhase);
    
    return () => {
      console.log('🧹 Cleaning up global functions');
      if (window.sarvakaryeshuSarvadaGame) {
        window.sarvakaryeshuSarvadaGame.isReady = false;
        delete window.sarvakaryeshuSarvadaGame.startSarvadaPhase;
      }
    };
  }, [isActive, startSarvadaPhase]);

  // Initialize game
  useEffect(() => {
    if (!isActive) return;
    
    console.log('🌯 INITIALIZING SarvakaryeshuSarvadaGame:', { 
      isReload, 
      initialCurrentPhase, 
      initialCurrentRound,
      hasValidReloadData: !!(isReload && initialCurrentPhase && initialCurrentSequence?.length > 0)
    });
    
    if (isReload && initialCurrentPhase && initialCurrentSequence?.length > 0) {
      // Only restore state if we have valid reload data
      console.log('📄 Restoring game state:', { initialCurrentPhase, initialCurrentRound });
      setCurrentPhase(initialCurrentPhase);
      setCurrentRound(initialCurrentRound);
      setCurrentSequence(initialCurrentSequence);
      setPlayerInput(initialPlayerInput);
      setGamePhase(initialGamePhase);
      setVisualRewards(initialVisualRewards || {});
      setActivatedSingers(initialActivatedSingers || {});
      
      // Rebuild round clicks from player input
      const clicks = {};
      initialPlayerInput.forEach(syllable => {
        clicks[`singer-${syllable}`] = true;
      });
      setRoundClicks(clicks);
      
    } else {
      // Start new game - always start with Sarvakaryeshu
      console.log('🎢 Starting fresh game - Sarvakaryeshu phase');
      setCurrentPhase('sarvakaryeshu');
      startNewRound(1);
    }
  }, [isActive, isReload]);

  // Auto-start countdown when waiting
  useEffect(() => {
    if (gamePhase === 'waiting' && currentSequence.length > 0 && !isCountingDown) {
      safeSetTimeout(() => {
        startCountdown();
      }, 1000);
    }
  }, [gamePhase, currentSequence, isCountingDown]);

// Auto-transition to Sarvada when power is gained
useEffect(() => {
  if (powerGained && currentPhase === 'sarvakaryeshu') {
    console.log('🎥 AUTO-TRANSITION: Power gained - switching to Sarvada immediately');
    // Small delay to ensure clean transition
    safeSetTimeout(() => {
      startSarvadaPhase();
    }, 500);
  }
}, [powerGained, currentPhase]);

  // Helper functions
  const isSingerSinging = (syllable) => {
    return singingSyllable === syllable;
  };

  const isSingerClickable = (syllableIndex) => {
    if (!canPlayerClick) return false;
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const hasSingerBeenClicked = (syllableIndex) => {
    return syllableIndex < playerInput.length;
  };

  const isSingerActivated = (syllable) => {
    return activatedSingers[`singer-${syllable}`];
  };

  const isAnimalHappy = (syllable) => {
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

  // Asset mapping functions
  const getSingerImage = (syllable, index) => {
    if (currentPhase === 'sarvakaryeshu') {
      if (syllable === 'sar') return getSarSquirrelHelperImage ? getSarSquirrelHelperImage() : null;
      if (syllable === 'va') return getVaBirdHelperImage ? getVaBirdHelperImage() : null;
      if (syllable === 'kar') return getKarDuckHelperImage ? getKarDuckHelperImage() : null;
      if (syllable === 'yeshu') return getYeshuRabbitHelperImage ? getYeshuRabbitHelperImage() : null;
    } else {
      if (syllable === 'sav') return getSavButterflyHelperImage ? getSavButterflyHelperImage() : null;
      if (syllable === 'va') return getVaFawnHelperImage ? getVaFawnHelperImage() : null;
      if (syllable === 'da') return getDaHedgehogHelperImage ? getDaHedgehogHelperImage() : null;
    }
    return null;
  };

  const getInitialImage = (syllable, index) => {
    if (currentPhase === 'sarvakaryeshu') {
      if (syllable === 'sar') return getSarSquirrelSadImage ? getSarSquirrelSadImage() : null;
      if (syllable === 'va') return getVaBirdSadImage ? getVaBirdSadImage() : null;
      if (syllable === 'kar') return getKarDuckSadImage ? getKarDuckSadImage() : null;
      if (syllable === 'yeshu') return getYeshuRabbitSadImage ? getYeshuRabbitSadImage() : null;
    } else {
      if (syllable === 'sav') return getSavButterflySadImage ? getSavButterflySadImage() : null;
      if (syllable === 'va') return getVaFawnSadImage ? getVaFawnSadImage() : null;
      if (syllable === 'da') return getDaHedgehogSadImage ? getDaHedgehogSadImage() : null;
    }
    return null;
  };

  const getRewardImage = (syllable, index) => {
    if (currentPhase === 'sarvakaryeshu') {
      if (syllable === 'sar') return getSarSquirrelHappyImage ? getSarSquirrelHappyImage() : null;
      if (syllable === 'va') return getVaBirdHappyImage ? getVaBirdHappyImage() : null;
      if (syllable === 'kar') return getKarDuckHappyImage ? getKarDuckHappyImage() : null;
      if (syllable === 'yeshu') return getYeshuRabbitHappyImage ? getYeshuRabbitHappyImage() : null;
    } else {
      if (syllable === 'sav') return getSavButterflyHappyImage ? getSavButterflyHappyImage() : null;
      if (syllable === 'va') return getVaFawnHappyImage ? getVaFawnHappyImage() : null;
      if (syllable === 'da') return getDaHedgehogHappyImage ? getDaHedgehogHappyImage() : null;
    }
    return null;
  };

  // Render functions
  const renderSinger = (syllable, index) => {
    const positions = getCurrentPositions();
    const position = positions.singers[index];
    const isSinging = isSingerSinging(syllable);
    const isClickable = isSingerClickable(index);
    const hasBeenClicked = hasSingerBeenClicked(index);
    const isActivated = isSingerActivated(syllable);
    const isNext = isNextExpected(index);
    
    // Enhanced visual states with glow effects
    let singerStyle = {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
      transition: 'all 0.3s ease'
    };
    
    if (isSinging) {
      singerStyle.transform = 'translate(-50%, -50%) scale(1.15)';
      singerStyle.filter = 'brightness(1.4) drop-shadow(0 0 15px #FFD700)';
      singerStyle.animation = 'sing 0.6s ease-in-out';
    } else if (isNext && !hasBeenClicked) {
      singerStyle.filter = currentPhase === 'sarvakaryeshu' 
        ? 'brightness(1.2) drop-shadow(0 0 8px #4CAF50)'
        : 'brightness(1.2) drop-shadow(0 0 8px #FF9800)';
      singerStyle.animation = 'nextToClick 1.5s ease-in-out infinite';
    } else if (hasBeenClicked) {
      singerStyle.opacity = 1;
      singerStyle.filter = 'brightness(1.1) saturate(1.2)';
    } else if (isActivated && !hasBeenClicked) {
      singerStyle.filter = currentPhase === 'sarvakaryeshu'
        ? 'brightness(1.1) saturate(1.1) drop-shadow(0 0 6px rgba(76, 175, 80, 0.4))'
        : 'brightness(1.1) saturate(1.1) drop-shadow(0 0 6px rgba(255, 152, 0, 0.4))';
      singerStyle.animation = 'gentleGlow 3s ease-in-out infinite';
    } else if (!canPlayerClick) {
      singerStyle.opacity = 0.6;
    }

    return (
      <button
        key={`singer-${syllable}`}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: currentPhase === 'sarvakaryeshu' ? '110px' : '80px',
          height: currentPhase === 'sarvakaryeshu' ? '110px' : '80px',
          border: 'none',
          background: 'transparent',
          cursor: isClickable ? 'pointer' : 'default',
          zIndex: 20,
          borderRadius: '50%',
          ...singerStyle
        }}
        onClick={() => handleSingerClick(index)}
        disabled={!isClickable}
      >
        <img
          src={getSingerImage(syllable, index)}
          alt={`${currentPhase} animal helper ${syllable}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        {/* Singing indicator */}
        {isSinging && (
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            animation: 'musicNote 0.6s ease-in-out'
          }}>
            🎵
          </div>
        )}
        
        {/* ENHANCED: Golden circle for next click */}
        {isNext && !hasBeenClicked && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            height: '85%',
            border: `2px solid ${currentPhase === 'sarvakaryeshu' ? '#4CAF50' : '#FF9800'}`,
            borderRadius: '50%',
            animation: 'goldenPulse 2s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
        )}
        
        {/* Golden crown for permanently learned */}
        {isActivated && !hasBeenClicked && (
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            animation: 'crownFloat 2s ease-in-out infinite',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))'
          }}>
            👑
          </div>
        )}
        
        {/* Syllable label */}
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: hasBeenClicked 
            ? 'rgba(76, 175, 80, 0.9)' 
            : isNext
            ? 'rgba(255, 193, 7, 0.9)'
            : isActivated
            ? (currentPhase === 'sarvakaryeshu' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 152, 0, 0.8)')
            : (currentPhase === 'sarvakaryeshu' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 152, 0, 0.9)'),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
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
            top: '10px',
            right: '10px',
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
            animation: 'checkmarkAppear 0.5s ease-out'
          }}>
            ✓
          </div>
        )}
      </button>
    );
  };

  const renderInitialVisual = (syllable, index) => {
    const positions = getCurrentPositions();
    const position = positions.initials[index];
    
    // Don't show initial if already transformed
    const animalHappy = visualRewards[`animal-${syllable}`];
    if (animalHappy) return null;

    return (
      <div
        key={`initial-${syllable}`}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: currentPhase === 'sarvakaryeshu' ? '110px' : '80px',
          height: currentPhase === 'sarvakaryeshu' ? '110px' : '80px',
          zIndex: 10,
          transform: 'translate(-50%, -50%)',
          opacity: 0.7
        }}
      >
        <img
          src={getInitialImage(syllable, index)}
          alt={`Sad animal ${syllable}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  };

  const renderVisualReward = (syllable, index) => {
    const positions = getCurrentPositions();
    const position = positions.rewards[index];
    
    // Only show if animal is happy
    const isVisible = isAnimalHappy(syllable);
    if (!isVisible) return null;
    
    return (
      <div
        key={`reward-${syllable}`}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: currentPhase === 'sarvakaryeshu' ? '110px' : '80px',
          height: currentPhase === 'sarvakaryeshu' ? '110px' : '80px',
          zIndex: 15,
          animation: 'rewardAppear 1s ease-out, rewardGlow 2s ease-in-out infinite 1s',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <img
          src={getRewardImage(syllable)}
          alt={`Happy animal ${syllable}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        {/* Sparkle effect */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '18px',
          animation: 'sparkle 2s ease-in-out infinite'
        }}>
          ✨
        </div>
      </div>
    );
  };

  const getStatusMessage = () => {
    if (isCountingDown) return `Get Ready... ${countdown}`;
    if (gamePhase === 'playing') return 'Listen carefully...';
    if (gamePhase === 'listening') {
      return `Click the animals! (${playerInput.length}/${currentSequence.length})`;
    }
    if (gamePhase === 'celebration') return 'Beautiful! Well done!';
    if (gamePhase === 'phase_complete') return 'Phase Complete!';
    return `Round ${currentRound} - ${currentPhase.toUpperCase()}`;
  };

  if (!isActive) return null;

  // Don't show Sarvada elements if power not gained
  const shouldShowElements = currentPhase === 'sarvakaryeshu' || (currentPhase === 'sarvada' && powerGained);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 20
    }}>
      
      {/* ENHANCED: Progress indicator with better styling */}
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
            fontSize: '14px',
            color: currentPhase === 'sarvakaryeshu' ? '#4CAF50' : '#FF9800',
            letterSpacing: '0.3px'
          }}>
            {currentPhase.toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(currentPhase === 'sarvakaryeshu' ? [1, 2, 3] : [1, 2]).map(round => (
              <div
                key={round}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: round <= currentRound 
                    ? (round < currentRound ? '#4CAF50' : (currentPhase === 'sarvakaryeshu' ? '#4CAF50' : '#FF9800'))
                    : '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: round <= currentRound ? 'white' : '#666',
                  boxShadow: round === currentRound ? `0 0 8px ${currentPhase === 'sarvakaryeshu' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 152, 0, 0.4)'}` : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {round}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENHANCED: Round Selector - Horizontal below status bar */}
      {!hideElements && (gamePhase === 'waiting' || gamePhase === 'listening') && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '20%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          zIndex: 45
        }}>
          {(currentPhase === 'sarvakaryeshu' ? [1, 2, 3] : [1, 2]).map(round => (
            <button 
              key={round} 
              onClick={() => jumpToRound(round)} 
              style={{
                fontSize: '14px', 
                padding: '8px 12px', 
                borderRadius: '10px',
                background: round === currentRound 
                  ? (currentPhase === 'sarvakaryeshu' ? '#4CAF50' : '#FF9800')
                  : (currentPhase === 'sarvakaryeshu' ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 152, 0, 0.7)'), 
                color: 'white', 
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '44px',
                minHeight: '44px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
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
          top: '20px',
          left: '20%',
          transform: 'translateX(-50%)',
          background: currentPhase === 'sarvakaryeshu' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 152, 0, 0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 50
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
          fontSize: '100px',
          fontWeight: 'bold',
          color: currentPhase === 'sarvakaryeshu' ? '#4CAF50' : '#FF9800',
          textShadow: `0 0 30px ${currentPhase === 'sarvakaryeshu' ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 152, 0, 0.8)'}`,
          zIndex: 100,
          animation: 'countdownPulse 0.8s ease-in-out'
        }}>
          {countdown}
        </div>
      )}

      {/* Game elements */}
      {!hideElements && shouldShowElements && (
        <>
          {/* Initial visual elements - show sad animals before transformation */}
          {currentSequence.map((syllable, index) => 
            renderInitialVisual(syllable, index)
          )}
          
          {/* Singers - helper animals with enhanced styling */}
          {currentSequence.map((syllable, index) => 
            renderSinger(syllable, index)
          )}
          
          {/* Visual rewards - happy animals */}
          {currentSequence.map((syllable, index) => 
            renderVisualReward(syllable, index)
          )}
        </>
      )}

      {/* ENHANCED: CSS Animations with golden effects */}
      <style>{`
        @keyframes sing {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes nextToClick {
          0%, 100% { 
            filter: brightness(1.2) drop-shadow(0 0 8px #4CAF50);
          }
          50% { 
            filter: brightness(1.4) drop-shadow(0 0 15px #81C784);
          }
        }
        
        @keyframes gentleGlow {
          0%, 100% { 
            filter: brightness(1.1) saturate(1.1) drop-shadow(0 0 6px rgba(76, 175, 80, 0.4));
          }
          50% { 
            filter: brightness(1.2) saturate(1.2) drop-shadow(0 0 12px rgba(76, 175, 80, 0.6));
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
        
        @keyframes crownFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-3px); }
        }
        
        @keyframes countdownPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        }
        
        @keyframes musicNote {
          0% { transform: translateX(-50%) translateY(0); opacity: 0; }
          50% { transform: translateX(-50%) translateY(-10px); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        }
        
        @keyframes checkmarkAppear {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes rewardAppear {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes rewardGlow {
          0%, 100% { 
            filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
          }
          50% { 
            filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 25px rgba(255, 215, 0, 0.8));
          }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default SarvakaryeshuSarvadaGame;