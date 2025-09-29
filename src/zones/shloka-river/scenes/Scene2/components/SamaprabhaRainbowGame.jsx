// zones/shloka-river/scenes/Scene2/components/SamaprabhaRainbowGame.jsx
// Rainbow→Fruit→Animal feeding game for Samaprabha learning

import React, { useState, useEffect, useRef } from 'react';

// Samaprabha syllable sequences for each round
const SYLLABLE_SEQUENCES = {
  samaprabha: {
    1: ['sa', 'ma'],
    2: ['sa', 'ma', 'pra'],
    3: ['sa', 'ma', 'pra', 'bha']
  }
};

const ELEMENT_DATA = {
  samaprabha: {
    rainbows: ['rainbow-sa', 'rainbow-ma', 'rainbow-pra', 'rainbow-bha'],
    fruits: ['mango-sa', 'apple-ma', 'berry-pra', 'grape-bha'],
    animals: ['bunny-sa', 'kitten-ma', 'puppy-pra', 'squirrel-bha'],
    positions: {
      rainbows: [
        { left: '20%', top: '25%' },  // Rainbow sa
        { left: '40%', top: '20%' },  // Rainbow ma
        { left: '60%', top: '25%' },  // Rainbow pra
        { left: '80%', top: '30%' }   // Rainbow bha
      ],
      fruits: [
        { left: '20%', top: '50%' },  // Fruit sa - ALIGNED with rainbow
        { left: '40%', top: '45%' },  // Fruit ma - ALIGNED with rainbow
        { left: '60%', top: '50%' },  // Fruit pra - ALIGNED with rainbow
        { left: '80%', top: '55%' }   // Fruit bha - ALIGNED with rainbow
      ],
      animals: [
        { left: '18%', top: '75%' },  // Animal sa - NEXT TO fruit
        { left: '38%', top: '70%' },  // Animal ma - NEXT TO fruit
        { left: '58%', top: '75%' },  // Animal pra - NEXT TO fruit
        { left: '78%', top: '70%' }   // Animal bha - NEXT TO fruit
      ]
    }
  }
};

const SamaprabhaRainbowGame = ({
  isActive = false,
  hideElements = false,
  onPhaseComplete,
  onGameComplete,
  profileName = 'little explorer',
  
  // Reload support props
  isReload = false,
  initialGamePhase = 'waiting',
  initialCurrentRound = 1,
  initialPlayerInput = [],
  initialCurrentSequence = [],
  initialSequenceItemsShown = 0,
  initialPermanentTransformations = {}, // FIXED: Separate visual state
    initialPermanentlyActivatedRainbows = {}, // ADD THIS LINE
  initialComboStreak = 0,
  initialMistakeCount = 0,
  phaseJustCompleted = false,
  lastCompletedPhase = null,
  gameJustCompleted = false,
  initialIsCountingDown = false,
  initialCountdown = 0,
  
  // Assets - passed from parent component
  getRainbowImage,      // (index) -> rainbow arc images
  getFruitImage,        // (index, collected) -> fruit images (0=visible, 1=collected/gone)
  getAnimalImage,       // (index, happy) -> animal images (0=sad, 1=happy)
  
  // Audio functions
  isAudioOn,
  playAudio,
  
  // State saving for reload support
  onSaveGameState,
  
  // Cleanup callback
  onCleanup

}) => {
  console.log('🌈 SamaprabhaRainbowGame render:', { 
    isActive, 
    hideElements,
    isReload,
    initialCurrentRound,
    phaseJustCompleted,
    gameJustCompleted
  });

  // Core game state
  const [gamePhase, setGamePhase] = useState('waiting');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [canPlayerClick, setCanPlayerClick] = useState(false);
  const [singingSyllable, setSingingSyllable] = useState(null);
  const [sequenceItemsShown, setSequenceItemsShown] = useState(0);

  const [currentPhase, setCurrentPhase] = useState('samaprabha');
  

  // Enhanced state for automatic flow and animations
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [roundTransition, setRoundTransition] = useState(false);
  const [rainbowMoods, setRainbowMoods] = useState({});
  const [fruitGlow, setFruitGlow] = useState({});
  const [mistakeCount, setMistakeCount] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [hasGameStarted, setHasGameStarted] = useState(false);

  // FIXED: Separate states for visual persistence vs clicking
  const [permanentTransformations, setPermanentTransformations] = useState({}); // Visual state - persists across rounds
  const [permanentlyActivatedRainbows, setPermanentlyActivatedRainbows] = useState({});

  const [currentRoundClicks, setCurrentRoundClicks] = useState({}); // Click state - resets each round
  const [activeSparkles, setActiveSparkles] = useState({});
  const elementsRef = useRef({});

  // Refs for better cleanup and state management
  const timeoutsRef = useRef([]);
  const intervalsRef = useRef([]);
  const isComponentMountedRef = useRef(true);
  const currentStateRef = useRef(null);

  // Safe timeout function with component mount check
  const safeSetTimeout = (callback, delay) => {
    const timeout = setTimeout(() => {
      if (isComponentMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };

  // Safe interval function with component mount check
  const safeSetInterval = (callback, delay) => {
    const interval = setInterval(() => {
      if (isComponentMountedRef.current) {
        callback();
      }
    }, delay);
    intervalsRef.current.push(interval);
    return interval;
  };

  // Clear all timeouts and intervals
  const clearAllTimers = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    intervalsRef.current.forEach(interval => clearInterval(interval));
    timeoutsRef.current = [];
    intervalsRef.current = [];
  };

  // Cleanup on unmount/hide with callback
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      console.log('🧹 SamaprabhaRainbowGame: Component unmounting - cleaning up');
      isComponentMountedRef.current = false;
      clearAllTimers();
      
      // Cleanup global references
      if (window.samaprabhaRainbowGame) {
        window.samaprabhaRainbowGame.isReady = false;
        delete window.samaprabhaRainbowGame.startGame;
        delete window.samaprabhaRainbowGame.clearCompletionState;
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
      console.log('🛑 SamaprabhaRainbowGame: Component deactivated - clearing timers');
      clearAllTimers();
      setIsCountingDown(false);
      setIsSequencePlaying(false);
      
      if (window.samaprabhaRainbowGame) {
        window.samaprabhaRainbowGame.isReady = false;
      }
    } else {
      if (window.samaprabhaRainbowGame) {
        window.samaprabhaRainbowGame.isReady = true;
      }
    }
  }, [isActive]);

  // Save state for reload support
  const saveGameState = (additionalState = {}) => {
    const currentState = {
      gamePhase,
      currentRound,
      playerInput,
      currentSequence,
      sequenceItemsShown,
      permanentTransformations, // FIXED: Save visual state
          permanentlyActivatedRainbows, // ADD THIS LINE
      comboStreak,
      mistakeCount,
      hasGameStarted,
      isCountingDown,
      countdown,
      timestamp: Date.now(),
      ...additionalState
    };
    
    // Update ref for quick access
    currentStateRef.current = currentState;
    
    if (onSaveGameState) {
      onSaveGameState(currentState);
    }
  };

  // Register element positions for sparkle targeting
  const registerElementPosition = (id, element) => {
    if (element && isComponentMountedRef.current) {
      const rect = element.getBoundingClientRect();
      const container = element.closest('.suryakoti-bank-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        
        elementsRef.current[id] = {
          left: ((rect.left - containerRect.left + rect.width / 2) / containerRect.width * 100) + '%',
          top: ((rect.top - containerRect.top + rect.height / 2) / containerRect.height * 100) + '%'
        };
      }
    }
  };

  // Audio playback functions
  const playSyllableAudio = (syllable) => {
    if (!isAudioOn) return;
    
    try {
      console.log(`🔊 Playing syllable: ${syllable}`);
      
      const syllableFileMap = {
        'sa': 'samaprabha-sa',
        'ma': 'samaprabha-ma', 
        'pra': 'samaprabha-pra',
        'bha': 'samaprabha-bha'
      };
      
      const fileName = syllableFileMap[syllable];
      if (!fileName) {
        console.log(`No file mapping found for syllable: ${syllable}`);
        return;
      }
      
      const playbackRate = Math.max(0.7, 1 - (mistakeCount * 0.1));
      playAudio(`/audio/syllables/${fileName}.mp3`, playbackRate);
      
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  const playCompleteWord = () => {
    if (!isAudioOn) return;
    
    try {
      playAudio('/audio/words/samaprabha.mp3', 0.9);
    } catch (error) {
      console.log('Word audio not available:', error);
    }
  };

  // Get sequence for current round
  const getSequenceForRound = (round) => {
    return SYLLABLE_SEQUENCES.samaprabha[round] || [];
  };

  // FIXED: Reset clicking state at start of each round
  const startNewRound = (roundNumber) => {
    const sequence = getSequenceForRound(roundNumber);
    setCurrentRound(roundNumber);
    setCurrentSequence(sequence);
    setPlayerInput([]);
    setCurrentRoundClicks({}); // FIXED: Reset click state each round
    setGamePhase('waiting');
    setCanPlayerClick(false);
    setSequenceItemsShown(0);
    
    console.log(`🌈 Starting Samaprabha Round ${roundNumber} with sequence:`, sequence);
    console.log('🔄 Click state reset - all rainbows clickable again');
    
    saveGameState({
      currentRound: roundNumber,
      currentSequence: sequence,
      gamePhase: 'waiting',
      playerInput: []
    });
  };

  // Start countdown to sequence
  const startCountdownToSequence = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('⏱️ Starting automatic countdown to sequence');
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
            handlePlaySequence(); // Auto-start sequence
          }
          return 0;
        }
        return newCount;
      });
    }, 800);
  };

const updateRainbowMoods = () => {
  if (!isComponentMountedRef.current) return;
  
  const moods = {};
  currentSequence.forEach((syllable, index) => {
    const rainbowId = `rainbow-${syllable}`;
    
    // NEW: Check if permanently activated first
    if (permanentlyActivatedRainbows[rainbowId]) {
      moods[syllable] = 'permanently_activated';
    } else if (gamePhase === 'rainbow_clicking' && currentRoundClicks[rainbowId]) {
      moods[syllable] = 'activated';
    } else if (gamePhase === 'rainbow_clicking') {
      moods[syllable] = 'ready';
    } else if (gamePhase === 'celebration') {
      moods[syllable] = 'celebrating';
    } else if (isCountingDown) {
      moods[syllable] = 'ready';
    } else {
      moods[syllable] = 'dim';
    }
  });
  setRainbowMoods(moods);
};

  // Progressive fruit glow effects (fruits are singers)
  const updateFruitGlow = () => {
    if (!isComponentMountedRef.current) return;
    
    const glowStates = {};
    currentSequence.forEach((syllable, index) => {
      const fruitId = `fruit-${syllable}`;
      
      if (permanentTransformations[fruitId]) {
        glowStates[syllable] = 'transformed'; // bubble → plate (persists)
      } else if (gamePhase === 'celebration') {
        glowStates[syllable] = 'victory';
      } else if (gamePhase === 'playing' && singingSyllable === syllable) {
        glowStates[syllable] = 'singing';
      } else {
        glowStates[syllable] = 'bubble'; // initial state
      }
    });
    setFruitGlow(glowStates);
  };

  // Update animations based on game state
  useEffect(() => {
    updateRainbowMoods();
    updateFruitGlow();
  }, [gamePhase, playerInput, sequenceItemsShown, singingSyllable, isCountingDown, currentRoundClicks, permanentTransformations]);

  // Initialize game when activated or on reload
  useEffect(() => {
    if (!isActive) return;

    if (isReload && initialCurrentSequence.length > 0) {      
      console.log('🔄 RELOAD: Restoring Samaprabha game state');
            
      // Restore all state
      setCurrentRound(initialCurrentRound);
      setCurrentSequence(initialCurrentSequence);
      setPlayerInput(initialPlayerInput);
      setGamePhase(initialGamePhase);
      setPermanentTransformations(initialPermanentTransformations || {});
      setComboStreak(initialComboStreak || 0);
      setMistakeCount(initialMistakeCount || 0);
      setHasGameStarted(true); // Always true on reload
      setIsCountingDown(initialIsCountingDown);
      setCountdown(initialCountdown);

      // FIXED: Rebuild current round click state from playerInput
      const clickState = {};
      initialPlayerInput.forEach(syllable => {
        clickState[`rainbow-${syllable}`] = true;
      });
      setCurrentRoundClicks(clickState);

      // Handle celebration phase reload
      if (initialGamePhase === 'celebration') {
        console.log('🎉 RELOAD: Was celebrating - resuming auto-continuation');
        setGamePhase('celebration');
        setCanPlayerClick(false);
        
        // Trigger auto-continuation after 2 seconds
        safeSetTimeout(() => {
          if (!isComponentMountedRef.current) return;
          
          if (initialCurrentRound < 3) {
            console.log(`➡️ AUTO-RESUME: Continuing to round ${initialCurrentRound + 1}`);
            
            setRoundTransition(true);
            
            safeSetTimeout(() => {
              if (!isComponentMountedRef.current) return;
              
              startNewRound(initialCurrentRound + 1);
              setRoundTransition(false);
            }, 1500);
            
          } else {
            console.log('🏆 AUTO-RESUME: Completing phase after reload');
            handlePhaseComplete();
          }
        }, 2000);
        
      } else {
        // Handle other phases normally  
        setGamePhase(initialGamePhase);
        setCanPlayerClick(initialGamePhase === 'rainbow_clicking');
      }

      // If we were counting down, restart the countdown
      if (initialIsCountingDown && initialCountdown > 0) {
        console.log('🔄 RELOAD: Restarting countdown from', initialCountdown);
        
        const countdownInterval = safeSetInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setIsCountingDown(false);
              if (isComponentMountedRef.current) {
                handlePlaySequence(); // This will play the audio
              }
              return 0;
            }
            return prev - 1;
          });
        }, 800);
      }
      
      // Handle special reload scenarios
      if (gameJustCompleted) {
        console.log('🎉 Game just completed during reload - calling onGameComplete');
        safeSetTimeout(() => {
          if (onGameComplete) {
            onGameComplete();
          }
        }, 1000);
      } else if (phaseJustCompleted && lastCompletedPhase) {
        console.log('✅ Phase just completed during reload - auto-continuing');
        safeSetTimeout(() => {
          handlePhaseComplete();
        }, 1000);
      }
      
    } else {
      console.log('🆕 NEW GAME: Starting Samaprabha phase immediately');
      startNewRound(1);
      setHasGameStarted(true);
      setPermanentTransformations({});
      setComboStreak(0);
      setMistakeCount(0);
    }
  }, [isActive, isReload]);

  // Auto-start logic
  useEffect(() => {
    if (!isActive || !isComponentMountedRef.current) return;
    
    if (gamePhase === 'waiting' && currentSequence.length > 0 && !isCountingDown) {
      if (!hasGameStarted && !isReload) {
        console.log('🎮 FIRST TIME: Auto-starting for new game');
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            startCountdownToSequence();
          }
        }, 1200);
      } else if (hasGameStarted) {
        console.log('🔄 AUTO-FLOW: Starting countdown automatically for subsequent round');
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            startCountdownToSequence();
          }
        }, 1200);
      }
    }
  }, [gamePhase, isActive, currentSequence, isCountingDown, hasGameStarted, isReload]);

  // Global function exposure
  useEffect(() => {
    if (!isActive) return;
    
    // Ensure the global object exists
    if (!window.samaprabhaRainbowGame) {
      window.samaprabhaRainbowGame = {};
    }
    
    // Expose functions and set ready flag
    window.samaprabhaRainbowGame.isReady = true;
    window.samaprabhaRainbowGame.clearCompletionState = () => {
      if (isComponentMountedRef.current) {
        setGamePhase('waiting');
        setSequenceItemsShown(0);
        console.log('🧹 Samaprabha rainbow game completion state cleared');
      }
    };
    
    console.log('🌐 SamaprabhaRainbowGame: Global functions exposed and ready flag set');
    
    // Cleanup on unmount or deactivation
    return () => {
      if (window.samaprabhaRainbowGame) {
        window.samaprabhaRainbowGame.isReady = false;
        delete window.samaprabhaRainbowGame.clearCompletionState;
        console.log('🧹 SamaprabhaRainbowGame: Global functions cleaned up');
      }
    };
  }, [isActive]);

  // Play the fruit sequence (fruits are singers)
  const handlePlaySequence = async () => {
    if (isSequencePlaying || currentSequence.length === 0 || !isComponentMountedRef.current) return;

    console.log('🎵 Playing fruit sequence:', currentSequence);
    setIsSequencePlaying(true);
    setGamePhase('playing');
    setCanPlayerClick(false);
    setPlayerInput([]);
    setSequenceItemsShown(0);
    setSingingSyllable(null);
    
    saveGameState({ gamePhase: 'playing' });
    
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        if (!isComponentMountedRef.current) return;
        
        console.log(`🔊 Playing syllable ${index + 1}/${currentSequence.length}: ${syllable}`);
        
        setSequenceItemsShown(index + 1);
        setSingingSyllable(syllable);
        playSyllableAudio(syllable);
        
        // Trigger fruit glow (fruits are singers)
        triggerFruitGlow(index);
        
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            setSingingSyllable(null);
          }
        }, 600);
        
        if (index === currentSequence.length - 1) {
          safeSetTimeout(() => {
            if (isComponentMountedRef.current) {
              setIsSequencePlaying(false);
              setGamePhase('rainbow_clicking');
              setCanPlayerClick(true);
              saveGameState({ gamePhase: 'rainbow_clicking' });
              console.log('🌈 Sequence complete, player can now click rainbows');
            }
          }, 800);
        }
      }, index * 1200);
    });
  };

  // Trigger fruit glow effect (during singing phase)
  const triggerFruitGlow = (syllableIndex) => {
    if (!isComponentMountedRef.current) return;
    
    const syllable = currentSequence[syllableIndex];
    const fruitId = `fruit-${syllable}`;
    
    setActiveSparkles(prev => ({ ...prev, [fruitId]: true }));
    
    safeSetTimeout(() => {
      if (isComponentMountedRef.current) {
        setActiveSparkles(prev => ({ ...prev, [fruitId]: false }));
      }
    }, 1000);
  };

  // Handle rainbow click (rainbows are clickers)
  const handleRainbowClick = (syllableIndex) => {
    const currentTime = Date.now();
    
    // Prevent rapid clicking and ensure component is active
    if (currentTime - lastClickTime < 300 || !isComponentMountedRef.current) {
      console.log('Click ignored - too fast or component unmounted!');
      return;
    }
    
    if (!canPlayerClick || isSequencePlaying) {
      console.log('Rainbow click ignored - not ready');
      return;
    }

    const clickedSyllable = currentSequence[syllableIndex];
    if (!clickedSyllable) return;

    // FIXED: Check current round clicks instead of permanent state
    const rainbowId = `rainbow-${clickedSyllable}`;
    if (currentRoundClicks[rainbowId]) {
      console.log('Rainbow already clicked this round!');
      return;
    }

    // FIXED: Sequential clicking validation (like Suryakoti)
    const expectedIndex = playerInput.length;
    if (syllableIndex !== expectedIndex) {
      const expectedSyllable = currentSequence[expectedIndex];
      console.log(`❌ Wrong order! Expected syllable ${expectedIndex + 1} (${expectedSyllable}), but clicked syllable ${syllableIndex + 1} (${clickedSyllable})`);
      
      setGamePhase('order_error');
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          setGamePhase('rainbow_clicking');
        }
      }, 1500);
      
      return;
    }

    setLastClickTime(currentTime);

    console.log(`✅ Player clicked rainbow for syllable: ${clickedSyllable} (position ${syllableIndex + 1})`);
    
    playSyllableAudio(clickedSyllable);
    
    // FIXED: Mark as clicked in current round + transform permanently
    const fruitId = `fruit-${clickedSyllable}`;
    const animalId = `animal-${clickedSyllable}`;
    
    // Update current round clicks (for preventing re-clicks this round)
    setCurrentRoundClicks(prev => ({ ...prev, [rainbowId]: true }));
    setPermanentlyActivatedRainbows(prev => ({ ...prev, [rainbowId]: true }));

    
    // Update permanent transformations (for visual persistence)
    setPermanentTransformations(prev => ({ 
      ...prev, 
      [fruitId]: true,
      [animalId]: true 
    }));
    
    // Trigger sparkles from rainbow to fruit
    triggerRainbowToFruitSparkles(syllableIndex);
    
    const newPlayerInput = [...playerInput, clickedSyllable];
    setPlayerInput(newPlayerInput);
    
    saveGameState({
      gamePhase: 'rainbow_clicking',
      playerInput: newPlayerInput,
      currentSequence: currentSequence,
      sequenceItemsShown: sequenceItemsShown,
      permanentTransformations: {
        ...permanentTransformations,
        [fruitId]: true,
        [animalId]: true
      }
    });
    
    if (newPlayerInput.length === currentSequence.length) {
      handleSequenceSuccess();
    }
  };

  // Trigger sparkles from rainbow to fruit
  const triggerRainbowToFruitSparkles = (syllableIndex) => {
    if (!isComponentMountedRef.current) return;
    
    const syllable = currentSequence[syllableIndex];
    const rainbowId = `rainbow-${syllable}`;
    const fruitId = `fruit-${syllable}`;
    
    // Activate rainbow sparkles
    setActiveSparkles(prev => ({ ...prev, [rainbowId]: true }));
    
    // After delay, activate fruit transformation with PERMANENT sparkles
    safeSetTimeout(() => {
      if (isComponentMountedRef.current) {
        setActiveSparkles(prev => ({ 
          ...prev, 
          [rainbowId]: false,
          [fruitId]: 'permanent' // FIXED: Permanent sparkles for transformed fruits
        }));
      }
    }, 800);
  };

  // Automatic sequence success
  const handleSequenceSuccess = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🎊 Round ${currentRound} of Samaprabha completed successfully!`);
    
    setCanPlayerClick(false);
    setGamePhase('celebration');
    
    // Reset mistake count on success
    setMistakeCount(0);
    
    // Increment combo streak
    setComboStreak(prev => prev + 1);
    
    saveGameState({
      gamePhase: 'celebration',
      playerInput: playerInput,
      currentSequence: currentSequence,
      sequenceItemsShown: sequenceItemsShown
    });
    
    // Automatic progression with smooth transitions
    safeSetTimeout(() => {
      if (!isComponentMountedRef.current) return;
      
      if (currentRound < 3) {
        console.log(`➡️ AUTO-ADVANCE: Starting round ${currentRound + 1} of Samaprabha`);
        
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

  // Handle phase completion
  const handlePhaseComplete = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('🏆 Samaprabha phase completed!');
    setGamePhase('phase_complete');
    
    playCompleteWord();
    
    saveGameState({
      gamePhase: 'phase_complete',
      phaseJustCompleted: true,
      lastCompletedPhase: 'samaprabha'
    });
    
    if (onPhaseComplete) {
      onPhaseComplete('samaprabha');
    }
  };

  // Helper functions
  const getSyllableIndex = (syllable) => {
    return currentSequence.indexOf(syllable);
  };

  const isSinging = (syllable) => {
    return singingSyllable === syllable;
  };

  const isRainbowClickable = (syllableIndex) => {
    if (!canPlayerClick || syllableIndex >= currentSequence.length) return false;
    
    // FIXED: Sequential clicking - only the next expected rainbow is clickable
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const isRainbowActivated = (syllable) => {
    const rainbowId = `rainbow-${syllable}`;
    return currentRoundClicks[rainbowId]; // FIXED: Use current round state
  };

  const isFruitTransformed = (syllable) => {
    const fruitId = `fruit-${syllable}`;
    return permanentTransformations[fruitId]; // Visual state persists
  };

  const isAnimalHappy = (syllable) => {
    const animalId = `animal-${syllable}`;
    return permanentTransformations[animalId]; // Visual state persists
  };

  const hasBeenClickedThisRound = (syllableIndex) => {
    return syllableIndex < playerInput.length;
  };

  // Dynamic status messages
  const getStatusMessage = () => {
    if (roundTransition) return `Preparing Round ${currentRound + 1}...`;
    if (isCountingDown) return `Get Ready... ${countdown}`;
    if (gamePhase === 'playing') return 'Listen to the magical fruit sounds...';
    if (gamePhase === 'rainbow_clicking') return `Click the rainbow arcs! (${playerInput.length}/${currentSequence.length})`;
    if (gamePhase === 'celebration') return comboStreak >= 3 ? 'Rainbow streak! Magical!' : 'Brilliant! Well done!';
    if (gamePhase === 'phase_complete') return '';
    if (gamePhase === 'error') return mistakeCount >= 3 ? 'Feel the rainbow magic, listen carefully...' : 'Try again!';
    if (gamePhase === 'order_error') return 'Click the rainbow arcs in order!';
    return `Round ${currentRound} - SAMAPRABHA`;
  };

    // Quick jump to round (for testing/development)
  const jumpToRound = (phase, round) => {
    if (!isComponentMountedRef.current) return;
    
    const newSequence = getSequenceForRound(round);
    setCurrentRound(round);
    setCurrentSequence(newSequence);
    setPlayerInput([]);
    setGamePhase('waiting');
    setCanPlayerClick(false);
    setSequenceItemsShown(0);
    
    saveGameState({
      currentRound: round,
      currentSequence: newSequence,
      gamePhase: 'waiting',
      playerInput: []
    });
  };

  // Render rainbow arc (clickers)
  const renderRainbow = (syllable, index) => {
    const mood = rainbowMoods[syllable] || 'dim';
    const position = ELEMENT_DATA.samaprabha.positions.rainbows[index];
    const hasSparkles = activeSparkles[`rainbow-${syllable}`];
    const activated = isRainbowActivated(syllable);
    const clickable = isRainbowClickable(index);
    const isNextExpected = isRainbowClickable(index);
    const alreadyClicked = hasBeenClickedThisRound(index);
    
  const moodStyles = {
  dim: { 
    filter: 'brightness(0.6) grayscale(0.5)', 
    animation: 'rainbowBreath 4s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: 0.7
  },
  ready: { 
    filter: 'brightness(1)', 
    animation: 'rainbowPulse 2s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: 1
  },
  activated: { 
    filter: 'brightness(1.4) saturate(1.6)', 
    animation: 'rainbowShimmer 0.8s ease-in-out',
    transform: 'translate(-50%, -50%) scale(1.05)',
    opacity: 1
  },
  celebrating: { 
    filter: 'brightness(1.5) saturate(1.8) hue-rotate(15deg)', 
    animation: 'rainbowCelebrate 1s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1.08)',
    opacity: 1
  },
  // ADD THIS NEW STYLE:
  permanently_activated: {
    filter: 'brightness(1.2) saturate(1.4) drop-shadow(0 0 10px #E91E63)',
    animation: 'rainbowGlow 2s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1.03)',
    opacity: 1
  }
};

    // FIXED: Override styles for better visual feedback
    let finalStyle = { ...moodStyles[mood] };
    
    if (alreadyClicked) {
      finalStyle.filter = 'brightness(0.8) saturate(0.7)';
      finalStyle.opacity = 0.8;
    } else if (isNextExpected) {
      finalStyle.filter = 'brightness(1.2) drop-shadow(0 0 8px #E91E63)';
      finalStyle.animation = 'rainbowPulse 1s ease-in-out infinite';
    } else if (!clickable && canPlayerClick) {
      finalStyle.filter = 'brightness(0.7) saturate(0.5) grayscale(0.3)';
      finalStyle.opacity = 0.6;
    }

    return (
      <button
        key={`rainbow-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`rainbow-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '120px',
          height: '80px',
          border: 'none',
          background: 'transparent',
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          zIndex: 20,
          ...finalStyle
        }}
        onClick={() => handleRainbowClick(index)}
        disabled={!clickable}
      >
        {getRainbowImage && (
          <img
            src={getRainbowImage(index)}
            alt={`Rainbow ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {hasSparkles && (
          <div className="rainbow-sparkles">
            {Array.from({length: 6}).map((_, i) => (
              <div 
                key={i} 
                className="rainbow-sparkle"
                style={{ 
                  '--delay': `${i * 0.1}s`,
                  '--color': ['#FF69B4', '#FFD700', '#00CED1', '#98FB98', '#DDA0DD', '#FFA500'][i]
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* FIXED: Better button labels */}
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: alreadyClicked 
            ? 'rgba(76, 175, 80, 0.9)' 
            : isNextExpected 
            ? 'rgba(233, 30, 99, 0.9)' 
            : 'rgba(255, 255, 255, 0.95)',
          color: alreadyClicked || isNextExpected ? 'white' : '#333',
          padding: '2px 6px',
          borderRadius: '8px',
          fontSize: '10px',
          fontWeight: 'bold',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}>
          {syllable.toUpperCase()}
        </div>
        
        {alreadyClicked && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            color: '#E91E63'
          }}>
            ✓
          </div>
        )}
        
        {/*{isNextExpected && !alreadyClicked && (
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(233, 30, 99, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            Click me next!
          </div>
        )}
        
        {!clickable && canPlayerClick && !alreadyClicked && (
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '9px'
          }}>
            Wait...
          </div>
        )}*/}
      </button>
    );
  };

  // Render fruit (singers - not clickable)
  const renderFruit = (syllable, index) => {
    const glowState = fruitGlow[syllable] || 'bubble';
    const position = ELEMENT_DATA.samaprabha.positions.fruits[index];
    const transformed = isFruitTransformed(syllable);
    const hasSparkles = activeSparkles[`fruit-${syllable}`];
    const hasPermanentSparkles = activeSparkles[`fruit-${syllable}`] === 'permanent';
    
    const glowStyles = {
      bubble: { 
        filter: 'brightness(0.9)', 
        opacity: 0.8,
        transform: 'translate(-50%, -50%) scale(1)'
      },
      singing: { 
        filter: 'brightness(1.4) drop-shadow(0 0 15px #FFD700)', 
        animation: 'fruitGlow 0.6s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.1)',
        opacity: 1
      },
      transformed: {
        filter: 'brightness(1.3) saturate(1.4) drop-shadow(0 0 12px #4CAF50)',
        transform: 'translate(-50%, -50%) scale(1.05)',
        opacity: 1,
        animation: 'fruitTransform 0.5s ease-out'
      },
      victory: { 
        filter: 'brightness(1.4) saturate(1.4) drop-shadow(0 0 15px #FFD700)',
        animation: 'fruitVictory 1s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.1)',
        opacity: 1
      }
    };

    return (
      <div
        key={`fruit-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`fruit-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '60px',
          height: '60px',
          transition: 'all 0.3s ease',
          zIndex: 15,
          ...glowStyles[glowState]
        }}
      >
        {getFruitImage && (
          <img
            src={getFruitImage(index, transformed ? 1 : 0)}
            alt={`Fruit ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {/* FIXED: Permanent sparkles for transformed fruits */}
        {(hasSparkles || hasPermanentSparkles) && (
          <div className="fruit-sparkles">
            {Array.from({length: 4}).map((_, i) => (
              <div 
                key={i} 
                className="fruit-sparkle"
                style={{ 
                  '--delay': `${i * 0.15}s`,
                  '--color': '#4CAF50',
                  animation: hasPermanentSparkles 
                    ? 'sparkleFloat 2s ease-in-out infinite' 
                    : 'sparkleFloat 1s ease-out forwards'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
        
        {isSinging(syllable) && (
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
        
        {transformed && (
          <div style={{
            position: 'absolute',
            bottom: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#4CAF50',
            fontWeight: 'bold'
          }}>
            Fed!
          </div>
        )}
      </div>
    );
  };

  // Render animal
  const renderAnimal = (syllable, index) => {
    const position = ELEMENT_DATA.samaprabha.positions.animals[index];
    const happy = isAnimalHappy(syllable);
    
    const animalStyle = {
      filter: happy ? 'brightness(1.3) saturate(1.4)' : 'brightness(0.8) grayscale(0.3)',
      animation: happy ? 'animalHappy 1s ease-in-out infinite' : 'animalSad 2s ease-in-out infinite',
      transform: 'translate(-50%, -50%) scale(1)'
    };

    return (
      <div
        key={`animal-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`animal-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '80px',
          height: '80px',
          transition: 'all 0.3s ease',
          zIndex: 10,
          ...animalStyle
        }}
      >
        {getAnimalImage && (
          <img
            src={getAnimalImage(index, happy ? 1 : 0)}
            alt={`${happy ? 'Happy' : 'Sad'} animal ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {happy && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            animation: 'heartFloat 1s ease-in-out infinite'
          }}>
            💖
          </div>
        )}
      </div>
    );
  };

  const renderProgressBar = () => (
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
    
    {/* Compact Phase Title */}
    <div style={{ 
      fontSize: '14px', // Bigger for mobile
      fontWeight: 'bold', 
      color: '#E91E63',
      letterSpacing: '0.3px'
    }}>
      SAMAPRABHA
    </div>
    
    {/* BIGGER Round Progress Dots - Now touchable */}
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3].map(round => (
        <button
          key={round}
          onClick={() => jumpToRound(currentPhase, round)}
          style={{
            width: '28px', // Much bigger for mobile touch
            height: '28px',
            borderRadius: '50%',
            border: 'none',
            background: round <= currentRound 
              ? (round < currentRound ? '#4CAF50' : '#E91E63')
              : '#E0E0E0',
            transition: 'all 0.3s ease',
            boxShadow: round === currentRound ? '0 0 8px rgba(233, 30, 99, 0.4)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: round <= currentRound ? 'white' : '#666'
          }}
        >
          {round}
        </button>
      ))}
    </div>

    {/* Simple Progress - Only during interaction */}
    {canPlayerClick && currentSequence.length > 0 && (
      <div style={{
        fontSize: '12px',
        color: '#666',
        fontWeight: '500',
        background: 'rgba(76, 175, 80, 0.1)',
        padding: '3px 8px',
        borderRadius: '10px'
      }}>
        {playerInput.length}/{currentSequence.length}
      </div>
    )}

    {/* Combo Streak - Only when impressive */}
    {comboStreak >= 3 && (
      <div style={{
        fontSize: '10px',
        color: '#FFB74D',
        fontWeight: 'bold',
        background: 'rgba(255, 183, 77, 0.15)',
        padding: '2px 6px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}>
        🔥 {comboStreak}x
      </div>
    )}
  </div>
);

  if (!isActive) {
    return null;
  }

  return (
    <div className="samaprabha-rainbow-game" style={containerStyle}>
      
      {/* Progress Bar */}
      {!hideElements && renderProgressBar()}
      
      {/* Status Display */}
      {!hideElements && gamePhase !== 'phase_complete' && (
        <div style={{
          position: 'absolute',
       top: '15px',
left: '20%', // Doc 1 positioning
fontSize: '13px', // Smaller
maxWidth: '250px', // Smaller width
          transform: 'translateX(-50%)',
          background: isCountingDown 
            ? 'rgba(156, 39, 176, 0.95)' 
            : gamePhase === 'celebration'
            ? 'rgba(233, 30, 99, 0.95)'
            : gamePhase === 'error' || gamePhase === 'order_error'
            ? 'rgba(244, 67, 54, 0.95)'
            : 'rgba(156, 39, 176, 0.95)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '15px',
          //fontSize: '15px',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 50,
          //minWidth: '300px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}>
          {getStatusMessage()}
        </div>
      )}

      {/* Countdown Display */}
      {!hideElements && isCountingDown && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#E91E63',
          textShadow: '0 0 30px rgba(233, 30, 99, 0.8)',
          zIndex: 100,
          animation: 'countdownPulse 0.8s ease-in-out'
        }}>
          {countdown}
        </div>
      )}
{/* Round Selector Buttons - Mobile Friendly */}
{!hideElements && (gamePhase === 'waiting' || gamePhase === 'rainbow_clicking') && (
  <div style={{
    position: 'absolute',
    top: '60px',
    left: '20%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 45
  }}>
    {[1, 2, 3].map(round => (
      <button 
        key={round} 
        onClick={() => jumpToRound(currentPhase, round)} 
        style={{
          fontSize: '14px', 
          padding: '8px 12px', 
          borderRadius: '12px',
          background: round === currentRound ? '#E91E63' : 'rgba(233, 30, 99, 0.8)', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          minWidth: '44px', // Mobile touch target
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


      {/* Game Elements */}
      {!hideElements && (
        <>
          {/* Rainbow Arcs (Clickable after sequence) */}
          {currentSequence.map((syllable, index) => {
            return renderRainbow(syllable, index);
          })}
          
          {/* Singing Fruits (Display only) */}
          {currentSequence.map((syllable, index) => {
            return renderFruit(syllable, index);
          })}
          
          {/* Animals */}
          {currentSequence.map((syllable, index) => {
            return renderAnimal(syllable, index);
          })}

          {/* Player Progress 
          {canPlayerClick && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(233, 30, 99, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 30,
              textAlign: 'center',
              minWidth: '150px'
            }}>
              Rainbows Clicked: {playerInput.length} / {currentSequence.length}
              {comboStreak >= 2 && (
                <div style={{ fontSize: '10px', marginTop: '2px', color: '#FFD700' }}>
                  Rainbow Combo: {comboStreak}x
                </div>
              )}
            </div>
          )}*/}
        </>
      )}
      
      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes countdownPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        }
        
        @keyframes rainbowBreath {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
        }
        
        @keyframes rainbowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1.02); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes rainbowCelebrate {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1.08); }
          25% { transform: translate(-50%, -50%) rotate(-2deg) scale(1.1); }
          75% { transform: translate(-50%, -50%) rotate(2deg) scale(1.1); }
        }
        
        @keyframes rainbowShimmer {
          0%, 100% { transform: translate(-50%, -50%) scale(1.05); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        
        @keyframes fruitGlow {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes fruitBounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) scale(1.05); }
          50% { transform: translate(-50%, -50%) translateY(-5px) scale(1.08); }
        }
        
        @keyframes fruitVictory {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes animalHappy {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes animalSad {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(0.98); }
        }
        
        @keyframes heartFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) translateY(-8px) scale(1.1); opacity: 0.8; }
        }
        
        @keyframes musicalNote {
          0% { transform: translateX(-50%) translateY(0) scale(0.8); opacity: 0; }
          50% { transform: translateX(-50%) translateY(-10px) scale(1.2); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-20px) scale(0.8); opacity: 0; }
        }
        
        @keyframes syllableAppear {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .rainbow-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .rainbow-sparkle {
          position: absolute;
          animation: sparkleFloat 1s ease-out forwards;
          animation-delay: var(--delay);
          color: var(--color);
          font-size: 16px;
          opacity: 0;
          left: 50%;
          top: 50%;
        }

        .fruit-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .fruit-sparkle {
          position: absolute;
          animation-delay: var(--delay);
          color: var(--color);
          font-size: 12px;
          opacity: 0;
          left: 50%;
          top: 50%;
        }
        
        @keyframes sparkleFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + ${Math.random() * 60 - 30}px), 
              calc(-50% - ${Math.random() * 40 + 20}px)
            ) scale(1.2) rotate(180deg);
          }
        }

        @keyframes rainbowGlow {
  0%, 100% { 
    filter: brightness(1.2) saturate(1.4) drop-shadow(0 0 10px #E91E63);
  }
  50% { 
    filter: brightness(1.4) saturate(1.6) drop-shadow(0 0 15px #FF69B4);
  }
}
      `}</style>
    </div>
  );
};

// Container styles
const containerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 20,
  pointerEvents: 'auto'
};

export default SamaprabhaRainbowGame;