// zones/shloka-river/scenes/Scene2/components/SuryakotiMemoryGame.jsx
// Sun→Flower blooming memory game for Suryakoti learning

import React, { useState, useEffect, useRef } from 'react';

// Suryakoti syllable sequences for each round
const SYLLABLE_SEQUENCES = {
  suryakoti: {
    1: ['sur', 'ya'],
    2: ['sur', 'ya', 'ko'],
    3: ['sur', 'ya', 'ko', 'ti']
  }
};

const ELEMENT_DATA = {
  suryakoti: {
    singers: ['sunflower-sur', 'daisy-ya', 'rose-ko', 'tulip-ti'],
    clickers: ['sun-orb-sur', 'sun-orb-ya', 'sun-orb-ko', 'sun-orb-ti'],
    positions: {
      singers: [
        { left: '25%', top: '55%' },  // Sunflower
        { left: '45%', top: '65%' },  // Daisy
        { left: '65%', top: '50%' },  // Rose
        { left: '75%', top: '60%' }   // Tulip
      ],
      clickers: [
        { left: '15%', top: '25%' },  // Sun orb 1
        { left: '35%', top: '20%' },  // Sun orb 2
        { left: '55%', top: '15%' },  // Sun orb 3
        { left: '75%', top: '25%' }   // Sun orb 4
      ]
    }
  }
};

const SuryakotiMemoryGame = ({
  isActive = false,
  hideElements = false,
  onPhaseComplete,
  onGameComplete,
  profileName = 'little explorer',
  
  // Sun ray component prop
  SunRayComponent,
  
  // Reload support props
  isReload = false,
  initialGamePhase = 'waiting',
  initialCurrentRound = 1,
  initialPlayerInput = [],
  initialCurrentSequence = [],
  initialSequenceItemsShown = 0,
  initialPermanentlyBloomed = {},
    initialPermanentlyActivated = {}, // ADD THIS LINE
  initialComboStreak = 0,
  initialMistakeCount = 0,
  phaseJustCompleted = false,
  lastCompletedPhase = null,
  gameJustCompleted = false,
  initialIsCountingDown = false,
  initialCountdown = 0,
  
  // Assets - passed from parent component
  getSunflowerImage,     // (0) -> sunflower-close, (1) -> sunflower-open
  getDaisyImage,         // (0) -> daisy-close, (1) -> daisy-open  
  getRoseImage,          // (0) -> rose-close, (1) -> rose-open
  getTulipImage,         // (0) -> tulip-close, (1) -> tulip-open
  getSunOrbImage,        // (index) -> sun orb images
  
  // Audio functions
  isAudioOn,
  playAudio,
    forcePhase = null,

  
  // State saving for reload support
  onSaveGameState,
    onRoundJump,  // ADD THIS

  
  // Cleanup callback
  onCleanup

}) => {
  console.log('🌻 SuryakotiMemoryGame render:', { 
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

  // Enhanced state for automatic flow and animations
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [roundTransition, setRoundTransition] = useState(false);
  const [sunMoods, setSunMoods] = useState({});
  const [flowerGlow, setFlowerGlow] = useState({});
  const [mistakeCount, setMistakeCount] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [permanentlyActivated, setPermanentlyActivated] = useState({}); // NEW: Track permanently bright suns
const [currentPhase, setCurrentPhase] = useState('suryakoti');


  // Sun ray state
  const [activeSunRay, setActiveSunRay] = useState(null);
  const [permanentlyBloomed, setPermanentlyBloomed] = useState({});
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
      console.log('🧹 SuryakotiMemoryGame: Component unmounting - cleaning up');
      isComponentMountedRef.current = false;
      clearAllTimers();
      
      // Cleanup global references
      if (window.suryakotiMemoryGame) {
        window.suryakotiMemoryGame.isReady = false;
        delete window.suryakotiMemoryGame.startGame;
        delete window.suryakotiMemoryGame.clearCompletionState;
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
      console.log('🛑 SuryakotiMemoryGame: Component deactivated - clearing timers');
      clearAllTimers();
      setIsCountingDown(false);
      setIsSequencePlaying(false);
      
      if (window.suryakotiMemoryGame) {
        window.suryakotiMemoryGame.isReady = false;
      }
    } else {
      if (window.suryakotiMemoryGame) {
        window.suryakotiMemoryGame.isReady = true;
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
      permanentlyBloomed,
          permanentlyActivated, // ADD THIS LINE
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

  // Register element positions for sun ray targeting
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
        'sur': 'suryakoti-sur',
        'ya': 'suryakoti-ya', 
        'ko': 'suryakoti-ko',
        'ti': 'suryakoti-ti'
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
      playAudio('/audio/words/suryakoti.mp3', 0.9);
    } catch (error) {
      console.log('Word audio not available:', error);
    }
  };

  // Get sequence for current round
  const getSequenceForRound = (round) => {
    return SYLLABLE_SEQUENCES.suryakoti[round] || [];
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

const updateSunMoods = () => {
  if (!isComponentMountedRef.current) return;
  
  const moods = {};
  currentSequence.forEach((syllable, index) => {
    const sunId = `sun-orb-${syllable}`;
    
    // NEW: Check if permanently activated first
    if (permanentlyActivated[sunId]) {
      moods[syllable] = 'permanently_bright';
    } else if (gamePhase === 'listening' && index < playerInput.length) {
      moods[syllable] = playerInput[index] === currentSequence[index] ? 'happy' : 'sad';
    } else if (gamePhase === 'playing' || singingSyllable === syllable) {
      moods[syllable] = 'excited';
    } else if (gamePhase === 'celebration') {
      moods[syllable] = 'celebrating';
    } else if (isCountingDown) {
      moods[syllable] = 'ready';
    } else {
      moods[syllable] = 'idle';
    }
  });
  setSunMoods(moods);
};

  // Progressive flower glow effects
  const updateFlowerGlow = () => {
    if (!isComponentMountedRef.current) return;
    
    const glowStates = {};
    currentSequence.forEach((syllable, index) => {
      const targetId = `flower-${syllable}`;
      
      if (permanentlyBloomed[targetId]) {
        glowStates[syllable] = 'bloomed';
      } else if (gamePhase === 'celebration') {
        glowStates[syllable] = 'victory';
      } else if (index < playerInput.length) {
        glowStates[syllable] = playerInput[index] === syllable ? 'success' : 'error';
      } else if (gamePhase === 'playing' && singingSyllable === syllable) {
        glowStates[syllable] = 'singing';
      } else {
        glowStates[syllable] = 'dormant';
      }
    });
    setFlowerGlow(glowStates);
  };

  // Update animations based on game state
  useEffect(() => {
    updateSunMoods();
    updateFlowerGlow();
  }, [gamePhase, playerInput, sequenceItemsShown, singingSyllable, isCountingDown, permanentlyBloomed]);

  // Initialize game when activated or on reload
  useEffect(() => {
    if (!isActive) return;

  if (isReload && (initialCurrentSequence.length > 0 || forcePhase)) {      
      console.log('🔄 RELOAD: Restoring Suryakoti game state');
            
      // Restore all state
      setCurrentRound(initialCurrentRound);
      setCurrentSequence(initialCurrentSequence);
      setPlayerInput(initialPlayerInput);
      setGamePhase(initialGamePhase);
      setPermanentlyBloomed(initialPermanentlyBloomed || {});
        setPermanentlyActivated(initialPermanentlyActivated || {});
      setComboStreak(initialComboStreak || 0);
      setMistakeCount(initialMistakeCount || 0);
      setHasGameStarted(true); // Always true on reload
      setIsCountingDown(initialIsCountingDown);
      setCountdown(initialCountdown);

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
              
              const nextRound = initialCurrentRound + 1;
              const nextSequence = getSequenceForRound(nextRound);
              
              setCurrentRound(nextRound);
              setCurrentSequence(nextSequence);
              setPlayerInput([]);
              setGamePhase('waiting');
              setCanPlayerClick(false);
              setSequenceItemsShown(0);
              setRoundTransition(false);
              
              saveGameState({
                currentRound: nextRound,
                currentSequence: nextSequence,
                gamePhase: 'waiting',
                playerInput: []
              });
            }, 1500);
            
          } else {
            console.log('🏆 AUTO-RESUME: Completing phase after reload');
            handlePhaseComplete();
          }
        }, 2000);
        
      } else {
        // Handle other phases normally  
        setGamePhase(initialGamePhase);
        setCanPlayerClick(initialGamePhase === 'listening');
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
      console.log('🆕 NEW GAME: Starting Suryakoti phase immediately');
      const sequence = getSequenceForRound(1);
      setCurrentRound(1);
      setCurrentSequence(sequence);
      setHasGameStarted(true);
      setPermanentlyBloomed({});
      setComboStreak(0);
      setMistakeCount(0);
      
      // Save initial state
      saveGameState({
        gamePhase: 'waiting',
        currentRound: 1,
        currentSequence: sequence,
        playerInput: [],
        sequenceItemsShown: 0,
        permanentlyBloomed: {},
        comboStreak: 0,
        mistakeCount: 0,
        hasGameStarted: true
      });
    }
}, [isActive, isReload, forcePhase]);

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
    if (!window.suryakotiMemoryGame) {
      window.suryakotiMemoryGame = {};
    }
    
    // Expose functions and set ready flag
    window.suryakotiMemoryGame.isReady = true;
    window.suryakotiMemoryGame.clearCompletionState = () => {
      if (isComponentMountedRef.current) {
        setGamePhase('waiting');
        setSequenceItemsShown(0);
        console.log('🧹 Suryakoti memory game completion state cleared');
      }
    };
    
    console.log('🌐 SuryakotiMemoryGame: Global functions exposed and ready flag set');
    
    // Cleanup on unmount or deactivation
    return () => {
      if (window.suryakotiMemoryGame) {
        window.suryakotiMemoryGame.isReady = false;
        delete window.suryakotiMemoryGame.clearCompletionState;
        console.log('🧹 SuryakotiMemoryGame: Global functions cleaned up');
      }
    };
  }, [isActive]);

  // Play the syllable sequence
  const handlePlaySequence = async () => {
    if (isSequencePlaying || currentSequence.length === 0 || !isComponentMountedRef.current) return;

    console.log('🎵 Playing syllable sequence:', currentSequence);
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
        
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            setSingingSyllable(null);
          }
        }, 600);
        
        if (index === currentSequence.length - 1) {
          safeSetTimeout(() => {
            if (isComponentMountedRef.current) {
              setIsSequencePlaying(false);
              setGamePhase('listening');
              setCanPlayerClick(true);
              saveGameState({ gamePhase: 'listening' });
              console.log('👂 Sequence complete, player can now click sun orbs');
            }
          }, 800);
        }
      }, index * 1200);
    });
  };

  // Trigger sun ray effect on correct click
  const triggerSunRay = (syllableIndex) => {
    if (!SunRayComponent || !isComponentMountedRef.current) return;
    
    const syllable = currentSequence[syllableIndex];
    const sourceId = `sun-orb-${syllable}`;
    const targetId = `flower-${syllable}`;
    
    const sourcePos = elementsRef.current[sourceId];
    const targetPos = elementsRef.current[targetId];
    
    if (sourcePos && targetPos) {
      setActiveSunRay({
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        syllableIndex: syllableIndex,
        timestamp: Date.now()
      });
      
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          setActiveSunRay(null);
        }
      }, 1500);
      
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          setPermanentlyBloomed(prev => ({ ...prev, [targetId]: true }));
        }
      }, 800);
    }
  };

  // Success celebration with multiple effects
  const triggerSuccessCelebration = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('🎉 Triggering success celebration');
    
    // Sun ray celebration for all syllables
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          triggerSunRay(index);
        }
      }, index * 200);
    });
    
    // Set celebration phase for animations
    setGamePhase('celebration');
    
    // Reset mistake count on success
    setMistakeCount(0);
    
    // Increment combo streak
    setComboStreak(prev => prev + 1);
  };

  // Handle sun orb click
  const handleSunOrbClick = (syllableIndex) => {
    const currentTime = Date.now();
    
    // Prevent rapid clicking and ensure component is active
    if (currentTime - lastClickTime < 300 || !isComponentMountedRef.current) {
      console.log('Click ignored - too fast or component unmounted!');
      return;
    }
    
    if (!canPlayerClick || isSequencePlaying) {
      console.log('Sun orb click ignored - not ready');
      return;
    }

    const clickedSyllable = currentSequence[syllableIndex];
    if (!clickedSyllable) return;

    // Sequential clicking validation
    const expectedIndex = playerInput.length;
    
    if (syllableIndex !== expectedIndex) {
      const expectedSyllable = currentSequence[expectedIndex];
      console.log(`❌ Wrong order! Expected syllable ${expectedIndex + 1} (${expectedSyllable}), but clicked syllable ${syllableIndex + 1} (${clickedSyllable})`);
      
      setGamePhase('order_error');
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          setGamePhase('listening');
        }
      }, 1500);
      return;
    }

    setLastClickTime(currentTime);

    console.log(`✅ Player clicked sun orb for syllable: ${clickedSyllable} (position ${syllableIndex + 1})`);
    
    playSyllableAudio(clickedSyllable);
    
    const newPlayerInput = [...playerInput, clickedSyllable];
    setPlayerInput(newPlayerInput);
    
    triggerSunRay(syllableIndex);

    // ADD THESE LINES:
const sunId = `sun-orb-${clickedSyllable}`;
setPermanentlyActivated(prev => ({ ...prev, [sunId]: true }));
    
    saveGameState({
      gamePhase: 'listening',
      playerInput: newPlayerInput,
      currentSequence: currentSequence,
      sequenceItemsShown: sequenceItemsShown
    });
    
    if (newPlayerInput.length === currentSequence.length) {
      handleSequenceSuccess();
    }
  };

  // Automatic sequence success
  const handleSequenceSuccess = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🎊 Round ${currentRound} of Suryakoti completed successfully!`);
    
    setCanPlayerClick(false);
    triggerSuccessCelebration();
    
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
        console.log(`➡️ AUTO-ADVANCE: Starting round ${currentRound + 1} of Suryakoti`);
        
        setRoundTransition(true);
        
        safeSetTimeout(() => {
          if (!isComponentMountedRef.current) return;
          
          const nextRound = currentRound + 1;
          const nextSequence = getSequenceForRound(nextRound);
          
          setCurrentRound(nextRound);
          setCurrentSequence(nextSequence);
          setPlayerInput([]);
          setGamePhase('waiting');
          setCanPlayerClick(false);
          setSequenceItemsShown(0);
          setRoundTransition(false);
          
          saveGameState({
            currentRound: nextRound,
            currentSequence: nextSequence,
            gamePhase: 'waiting',
            playerInput: []
          });
        }, 1500);
        
      } else {
        handlePhaseComplete();
      }
    }, 2000);
  };

  // Handle phase completion
  const handlePhaseComplete = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('🏆 Suryakoti phase completed!');
    setGamePhase('phase_complete');
    
    playCompleteWord();
    
    saveGameState({
      gamePhase: 'phase_complete',
      phaseJustCompleted: true,
      lastCompletedPhase: 'suryakoti'
    });
    
    if (onPhaseComplete) {
      onPhaseComplete('suryakoti');
    }
  };

  // Helper functions
  const getSyllableIndex = (syllable) => {
    return currentSequence.indexOf(syllable);
  };

  const isSinging = (syllable) => {
    return singingSyllable === syllable;
  };

  const isClickable = (syllableIndex) => {
    return canPlayerClick && syllableIndex < currentSequence.length;
  };

  const isCorrect = (syllableIndex) => {
    return playerInput[syllableIndex] === currentSequence[syllableIndex];
  };

  const isWrong = (syllableIndex) => {
    return playerInput.length > syllableIndex && playerInput[syllableIndex] !== currentSequence[syllableIndex];
  };

  const isBloomed = (syllable) => {
    const targetId = `flower-${syllable}`;
    return permanentlyBloomed[targetId];
  };

  const shouldHighlightSun = (syllableIndex) => {
    if (!canPlayerClick) return false;
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const isSunDisabled = (syllableIndex) => {
    if (!canPlayerClick) return true;
    const expectedIndex = playerInput.length;
    return syllableIndex !== expectedIndex;
  };

  const hasBeenClicked = (syllableIndex) => {
    return syllableIndex < playerInput.length;
  };

  // Dynamic status messages
  const getStatusMessage = () => {
    if (roundTransition) return `Preparing Round ${currentRound + 1}...`;
    if (isCountingDown) return `Get Ready... ${countdown}`;
    if (gamePhase === 'playing') return 'Listen to the solar sounds...';
    if (gamePhase === 'listening') return `Click the sun orbs! (${playerInput.length}/${currentSequence.length})`;
    if (gamePhase === 'celebration') return comboStreak >= 3 ? 'Solar streak! Brilliant!' : 'Radiant! Well done!';
    if (gamePhase === 'phase_complete') return '';
    if (gamePhase === 'error') return mistakeCount >= 3 ? 'Feel the warmth, listen carefully...' : 'Try again!';
    if (gamePhase === 'order_error') return 'Click the sun orbs in order!';
    return `Round ${currentRound} - SURYAKOTI`;
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

  // Get flower image based on syllable and bloomed state
  const getFlowerImage = (syllable, index) => {
    const isBloomed = permanentlyBloomed[`flower-${syllable}`];
    
    switch(syllable) {
      case 'sur': return getSunflowerImage ? getSunflowerImage(isBloomed ? 1 : 0) : null;
      case 'ya': return getDaisyImage ? getDaisyImage(isBloomed ? 1 : 0) : null;
      case 'ko': return getRoseImage ? getRoseImage(isBloomed ? 1 : 0) : null;
      case 'ti': return getTulipImage ? getTulipImage(isBloomed ? 1 : 0) : null;
      default: return null;
    }
  };

  // Render sun orb
  const renderSunOrb = (syllable, index) => {
    const mood = sunMoods[syllable] || 'idle';
    const position = ELEMENT_DATA.suryakoti.positions.clickers[index];
    const clickable = isClickable(index);
    
    const isNextExpected = shouldHighlightSun(index);
    const isDisabled = isSunDisabled(index);
    const alreadyClicked = hasBeenClicked(index);
    
 const moodStyles = {
  idle: { 
    filter: 'brightness(0.9)', 
    animation: 'sunBreath 4s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1)'
  },
  ready: { 
    filter: 'brightness(1)', 
    animation: 'sunBreath 3s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1)'
  },
  excited: { 
    filter: 'brightness(1.3) saturate(1.4)', 
    animation: 'sunBounce 0.6s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1.02)'
  },
  happy: { 
    filter: 'brightness(1.4) hue-rotate(15deg)', 
    animation: 'sunWiggle 0.8s ease-in-out',
    transform: 'translate(-50%, -50%) scale(1.05)'
  },
  celebrating: { 
    filter: 'brightness(1.5) saturate(1.6) hue-rotate(30deg)', 
    animation: 'sunCelebrate 1s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1.08)'
  },
  sad: { 
    filter: 'grayscale(0.3) brightness(0.8)', 
    animation: 'sunShake 0.5s ease-in-out',
    transform: 'translate(-50%, -50%) scale(0.95)'
  },
  // ADD THIS NEW STYLE:
  permanently_bright: {
    filter: 'brightness(1.2) saturate(1.3) drop-shadow(0 0 8px #FFA500)',
    animation: 'sunGlow 2s ease-in-out infinite',
    transform: 'translate(-50%, -50%) scale(1.02)',
    opacity: 1
  }
};
    let finalStyle = { ...moodStyles[mood] };
    
    if (alreadyClicked) {
      finalStyle.filter = 'brightness(0.8) saturate(0.7)';
      finalStyle.opacity = 0.8;
    } else if (isNextExpected) {
      finalStyle.filter = 'brightness(1.2) drop-shadow(0 0 5px #FFA500)';
      finalStyle.animation = 'sunPulse 1s ease-in-out infinite';
    } else if (isDisabled) {
      finalStyle.filter = 'brightness(0.7) saturate(0.5) grayscale(0.3)';
      finalStyle.opacity = 0.6;
    }

    return (
      <button
        key={`sun-orb-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`sun-orb-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '100px',
          height: '100px',
          border: 'none',
          background: 'transparent',
          cursor: (clickable && !isDisabled) ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          zIndex: 25,
          ...finalStyle
        }}
        onClick={() => handleSunOrbClick(index)}
        disabled={!clickable || isDisabled}
      >
        {getSunOrbImage && (
          <img
            src={getSunOrbImage(index)}
            alt={`Sun Orb ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: alreadyClicked 
            ? 'rgba(76, 175, 80, 0.9)' 
            : isNextExpected 
            ? 'rgba(255, 165, 0, 0.9)' 
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
            color: '#FFA500'
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
            background: 'rgba(255, 165, 0, 0.9)',
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
        
        {isDisabled && !alreadyClicked && (
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

  // Render flower
  const renderFlower = (syllable, index) => {
    const glowState = flowerGlow[syllable] || 'dormant';
    const position = ELEMENT_DATA.suryakoti.positions.singers[index];
    
    const glowStyles = {
      dormant: { 
        filter: 'brightness(0.8)', 
        opacity: 0.7,
        transform: 'translate(-50%, -50%) scale(1)'
      },
      singing: { 
        filter: 'brightness(1.6) drop-shadow(0 0 25px #FFD700)', 
        animation: 'flowerSing 0.6s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.15)',
        opacity: 1
      },
      success: { 
        filter: 'brightness(1.3) saturate(1.4) drop-shadow(0 0 15px #FFA500)',
        animation: 'flowerSuccessGlow 0.5s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.05)',
        opacity: 1
      },
      victory: { 
        filter: 'brightness(1.5) saturate(1.6) drop-shadow(0 0 25px #FFD700)',
        animation: 'flowerVictory 1s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.1)',
        opacity: 1
      },
      error: { 
        filter: 'brightness(1.2) drop-shadow(0 0 15px #f44336)',
        animation: 'flowerErrorShake 0.5s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      bloomed: {
        filter: 'brightness(1.4) saturate(1.6) drop-shadow(0 0 20px rgba(255, 165, 0, 0.8))',
        transform: 'translate(-50%, -50%) scale(1.08)',
        opacity: 1
      }
    };

    return (
      <div
        key={`flower-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`flower-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '90px',
          height: '90px',
          transition: 'all 0.3s ease',
          zIndex: 10,
          ...glowStyles[glowState]
        }}
      >
        <img
          src={getFlowerImage(syllable, index)}
          alt={`${syllable} flower`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
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
      color: '#FF9800',
      letterSpacing: '0.3px'
    }}>
      SURYAKOTI
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
              ? (round < currentRound ? '#4CAF50' : '#FF9800')
              : '#E0E0E0',
            transition: 'all 0.3s ease',
            boxShadow: round === currentRound ? '0 0 8px rgba(255, 152, 0, 0.4)' : 'none',
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
    <div className="suryakoti-memory-game" style={containerStyle}>
      
      {/* Progress Bar */}
      {!hideElements && renderProgressBar()}
      
      {/* Status Display */}
      {!hideElements && gamePhase !== 'phase_complete' && (
        <div style={{
          position: 'absolute',
        top: '15px',
left: '20%', // Doc 1 positioning
fontSize: '13px', // Smaller
maxWidth: '220px', // Smaller width
          transform: 'translateX(-50%)',
          background: isCountingDown 
            ? 'rgba(255, 152, 0, 0.95)' 
            : gamePhase === 'celebration'
            ? 'rgba(255, 165, 0, 0.95)'
            : gamePhase === 'error' || gamePhase === 'order_error'
            ? 'rgba(244, 67, 54, 0.95)'
            : 'rgba(255, 152, 0, 0.95)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '25px',
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
          color: '#FF9800',
          textShadow: '0 0 30px rgba(255, 152, 0, 0.8)',
          zIndex: 100,
          animation: 'countdownPulse 0.8s ease-in-out'
        }}>
          {countdown}
        </div>
      )}

{/* Round Selector Buttons - Mobile Friendly */}
{!hideElements && (gamePhase === 'waiting' || gamePhase === 'listening') && (
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
          background: round === currentRound ? '#FF9800' : 'rgba(255, 183, 77, 0.8)', 
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
          {/* Singing Flowers */}
          {currentSequence.map((syllable, index) => {
            return renderFlower(syllable, index);
          })}
          
          {/* Clickable Sun Orbs */}
          {currentSequence.map((syllable, index) => {
            return renderSunOrb(syllable, index);
          })}

          {/* Player Progress 
          {canPlayerClick && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 165, 0, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 30,
              textAlign: 'center',
              minWidth: '150px'
            }}>
              Progress: {playerInput.length} / {currentSequence.length}
              {comboStreak >= 2 && (
                <div style={{ fontSize: '10px', marginTop: '2px', color: '#FFD700' }}>
                  Solar Combo: {comboStreak}x
                </div>
              )}
            </div>
          )}*/}
        </>
      )}
      
      {/* Sun Ray Animation */}
      {activeSunRay && SunRayComponent && (
        <SunRayComponent
          sourcePosition={activeSunRay.sourcePosition}
          targetPosition={activeSunRay.targetPosition}
          isActive={true}
          rayCount={12}
          duration={1500}
        />
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
        
        @keyframes sunBreath {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
        }
        
        @keyframes sunBounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) scale(1.02); }
          50% { transform: translate(-50%, -50%) translateY(-8px) scale(1.02); }
        }
        
        @keyframes sunCelebrate {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1.08); }
          25% { transform: translate(-50%, -50%) rotate(-3deg) scale(1.1); }
          75% { transform: translate(-50%, -50%) rotate(3deg) scale(1.1); }
        }
        
        @keyframes sunWiggle {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1.05); }
          25% { transform: translate(-50%, -50%) rotate(2deg) scale(1.05); }
          75% { transform: translate(-50%, -50%) rotate(-2deg) scale(1.05); }
        }
        
        @keyframes sunShake {
          0%, 100% { transform: translate(-50%, -50%) translateX(0) scale(0.95); }
          25% { transform: translate(-50%, -50%) translateX(-3px) scale(0.95); }
          75% { transform: translate(-50%, -50%) translateX(3px) scale(0.95); }
        }
        
        @keyframes sunPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes flowerSing {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes flowerVictory {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes flowerSuccessGlow {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
          100% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes flowerErrorShake {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          25% { transform: translate(-50%, -50%) translateX(-5px); }
          75% { transform: translate(-50%, -50%) translateX(5px); }
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
        
        @keyframes comboPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        @keyframes sunGlow {
  0%, 100% { 
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 8px #FFA500);
  }
  50% { 
    filter: brightness(1.4) saturate(1.5) drop-shadow(0 0 12px #FFD700);
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

export default SuryakotiMemoryGame;