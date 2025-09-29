// zones/shloka-river/scenes/Scene2/components/CombinedMemoryGame.jsx
// Combined game using Vakratunda template: Suryakoti → Samaprabha

import React, { useState, useEffect, useRef } from 'react';

// Combined syllable sequences for both phases
const SYLLABLE_SEQUENCES = {
  suryakoti: {
    1: ['sur', 'ya'],
    2: ['sur', 'ya', 'ko'],
    3: ['sur', 'ya', 'ko', 'ti']
  },
  samaprabha: {
    1: ['sa', 'ma'],
    2: ['sa', 'ma', 'pra'],
    3: ['sa', 'ma', 'pra', 'bha']
  }
};

const ELEMENT_DATA = {
  suryakoti: {
    singers: ['sun-orb-sur', 'sun-orb-ya', 'sun-orb-ko', 'sun-orb-ti'],
    clickers: ['sun-orb-sur', 'sun-orb-ya', 'sun-orb-ko', 'sun-orb-ti'], // SAME as singers
    rewards: ['bloomed-flower-sur', 'bloomed-flower-ya', 'bloomed-flower-ko', 'bloomed-flower-ti'],
    positions: {
      singers: [
        { left: '15%', top: '25%' },  // Use sun orb positions
        { left: '35%', top: '20%' },
        { left: '55%', top: '15%' },
        { left: '75%', top: '25%' }
      ],
      clickers: [
        { left: '15%', top: '25%' },  // SAME as singers
        { left: '35%', top: '20%' },
        { left: '55%', top: '15%' },
        { left: '75%', top: '25%' }
      ],
      rewards: [
        { left: '25%', top: '55%' },  // Keep flower positions for visual
        { left: '45%', top: '65%' },
        { left: '65%', top: '50%' },
        { left: '75%', top: '60%' }
      ]
    }
  },
  samaprabha: {
    singers: ['rainbow-sa', 'rainbow-ma', 'rainbow-pra', 'rainbow-bha'],
    clickers: ['rainbow-sa', 'rainbow-ma', 'rainbow-pra', 'rainbow-bha'], // SAME as singers
    rewards: ['happy-animal-sa', 'happy-animal-ma', 'happy-animal-pra', 'happy-animal-bha'],
    positions: {
      singers: [
        { left: '20%', top: '25%' },  // Use rainbow positions
        { left: '40%', top: '20%' },
        { left: '60%', top: '25%' },
        { left: '80%', top: '30%' }
      ],
      clickers: [
        { left: '20%', top: '25%' },  // SAME as singers
        { left: '40%', top: '20%' },
        { left: '60%', top: '25%' },
        { left: '80%', top: '30%' }
      ],
      rewards: [
        { left: '18%', top: '75%' },  // Keep animal positions for visual
        { left: '38%', top: '70%' },
        { left: '58%', top: '75%' },
        { left: '78%', top: '70%' }
      ]
    }
  }
};

const CombinedMemoryGame = ({
  isActive = false,
  hideElements = false,
  powerGained = false,
  onPhaseComplete,
  onGameComplete,
  profileName = 'little explorer',
  
  // Animation component props
  SunRayComponent,
  SparkleTrailComponent,
  
  // Reload support props
  isReload = false,
  initialGamePhase = 'waiting',
  initialCurrentPhase = 'suryakoti',
  initialCurrentRound = 1,
  initialPlayerInput = [],
  initialCurrentSequence = [],
  initialSequenceItemsShown = 0,
  initialPermanentTransformations = {},
  initialPermanentlyActivatedClickers = {},
  initialComboStreak = 0,
  initialMistakeCount = 0,
  phaseJustCompleted = false,
  lastCompletedPhase = null,
  gameJustCompleted = false,
  initialIsCountingDown = false,
  initialCountdown = 0,
  forcePhase = null,
  
  // Assets - Suryakoti (sun orbs + flowers)
  getSunOrbImage,          // (index) -> sun orb images (clickers for suryakoti)
  getClosedFlowerImage,    // (index) -> closed flower images (singers for suryakoti)
  getOpenFlowerImage,      // (index) -> open flower images (rewards for suryakoti)
  
  // Assets - Samaprabha (rainbows + fruits + animals)
  getRainbowImage,         // (index) -> rainbow images (clickers for samaprabha)
  getFruitImage,           // (index, transformed) -> fruit images (singers for samaprabha)
  getAnimalImage,          // (index, happy) -> animal images (rewards for samaprabha)
  
  // Audio functions
  isAudioOn,
  playAudio,
  
  // State saving for reload support
  onSaveGameState,
  
  // Cleanup callback
  onCleanup

}) => {
  console.log('🌻🌈 Combined Memory Game render:', { 
    isActive, 
    hideElements,
    isReload,
    initialCurrentPhase,
    initialCurrentRound,
    powerGained,
    phaseJustCompleted,
    gameJustCompleted
  });

  // Core game state (same as Vakratunda template)
  const [gamePhase, setGamePhase] = useState('waiting');
  const [currentPhase, setCurrentPhase] = useState('suryakoti');
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
  const [clickerMoods, setClickerMoods] = useState({});
  const [singerGlow, setSingerGlow] = useState({});
  const [mistakeCount, setMistakeCount] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [hasGameStarted, setHasGameStarted] = useState(false);

  // Animation and transformation states
  const [activeAnimation, setActiveAnimation] = useState(null);
  const [permanentTransformations, setPermanentTransformations] = useState({});
  const [permanentlyActivatedClickers, setPermanentlyActivatedClickers] = useState({});
  const [currentRoundClicks, setCurrentRoundClicks] = useState({});
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
      console.log('🧹 Combined Memory Game: Component unmounting - cleaning up');
      isComponentMountedRef.current = false;
      clearAllTimers();
      
      // Cleanup global references
      if (window.combinedMemoryGame) {
        window.combinedMemoryGame.isReady = false;
        delete window.combinedMemoryGame.startSamaprabhaPhase;
        delete window.combinedMemoryGame.clearCompletionState;
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
      console.log('🛑 Combined Memory Game: Component deactivated - clearing timers');
      clearAllTimers();
      setIsCountingDown(false);
      setIsSequencePlaying(false);
      
      if (window.combinedMemoryGame) {
        window.combinedMemoryGame.isReady = false;
      }
    } else {
      if (window.combinedMemoryGame) {
        window.combinedMemoryGame.isReady = true;
      }
    }
  }, [isActive]);

  // Save state for reload support
  const saveGameState = (additionalState = {}) => {
    const currentState = {
      gamePhase,
      currentPhase,
      currentRound,
      playerInput,
      currentSequence,
      sequenceItemsShown,
      permanentTransformations,
      permanentlyActivatedClickers,
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

  // Register element positions for animation targeting
  const registerElementPosition = (id, element) => {
    if (element && isComponentMountedRef.current) {
      const rect = element.getBoundingClientRect();
      const container = element.closest('.combined-game-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        
        elementsRef.current[id] = {
          left: ((rect.left - containerRect.left + rect.width / 2) / containerRect.width * 100) + '%',
          top: ((rect.top - containerRect.top + rect.height / 2) / containerRect.height * 100) + '%'
        };
      }
    }
  };

  // Audio playback functions - UPDATED FOR BOTH PHASES
  const playSyllableAudio = (syllable) => {
    if (!isAudioOn) return;
    
    try {
      console.log(`🔊 Playing syllable: ${syllable}`);
      
      const syllableFileMap = {
        // Suryakoti syllables
        'sur': 'suryakoti-sur',
        'ya': 'suryakoti-ya', 
        'ko': 'suryakoti-ko',
        'ti': 'suryakoti-ti',
        // Samaprabha syllables
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

  const playCompleteWord = (word) => {
    if (!isAudioOn) return;
    
    try {
      const wordFileMap = {
        'suryakoti': 'suryakoti',
        'samaprabha': 'samaprabha'
      };
      
      const fileName = wordFileMap[word];
      if (!fileName) {
        console.log(`No file mapping found for word: ${word}`);
        return;
      }
      
      playAudio(`/audio/words/${fileName}.mp3`, 0.9);
    } catch (error) {
      console.log('Word audio not available:', error);
    }
  };

  // Get sequence for current phase and round
  const getSequenceForRound = (phase, round) => {
    return SYLLABLE_SEQUENCES[phase][round] || [];
  };

  // Reset clicking state at start of each round
  const startNewRound = (roundNumber) => {
    const sequence = getSequenceForRound(currentPhase, roundNumber);
    setCurrentRound(roundNumber);
    setCurrentSequence(sequence);
    setPlayerInput([]);
    setCurrentRoundClicks({});
    setGamePhase('waiting');
    setCanPlayerClick(false);
    setSequenceItemsShown(0);
    
    console.log(`🌟 Starting ${currentPhase} Round ${roundNumber} with sequence:`, sequence);
    console.log('🔄 Click state reset - all clickers clickable again');
    
    saveGameState({
      currentRound: roundNumber,
      currentSequence: sequence,
      gamePhase: 'waiting',
      playerInput: []
    });
  };

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
            handlePlaySequence();
          }
          return 0;
        }
        return newCount;
      });
    }, 800);
  };

  // Dynamic clicker moods with permanent activation priority
  const updateClickerMoods = () => {
    if (!isComponentMountedRef.current) return;
    
    const moods = {};
    currentSequence.forEach((syllable, index) => {
      const clickerId = `${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`;
      
      // Priority system: Permanent state overrides everything
      if (permanentlyActivatedClickers[clickerId]) {
        moods[syllable] = 'permanently_activated';
      } else if (currentRoundClicks[clickerId]) {
        moods[syllable] = 'activated';
      } else if (gamePhase === 'listening' && playerInput.length === index) {
        moods[syllable] = 'ready';
      } else if (gamePhase === 'celebration') {
        moods[syllable] = 'celebrating';
      } else if (isCountingDown) {
        moods[syllable] = 'ready';
      } else {
        moods[syllable] = 'dim';
      }
    });
    setClickerMoods(moods);
  };

  // Progressive singer glow effects
  const updateSingerGlow = () => {
    if (!isComponentMountedRef.current) return;
    
    const glowStates = {};
    currentSequence.forEach((syllable, index) => {
      const singerId = `${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`;
      
      if (permanentTransformations[singerId]) {
        glowStates[syllable] = 'transformed';
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
    setSingerGlow(glowStates);
  };

  // Update animations based on game state
  useEffect(() => {
    updateClickerMoods();
    updateSingerGlow();
  }, [gamePhase, playerInput, sequenceItemsShown, singingSyllable, isCountingDown, permanentTransformations, currentRoundClicks, permanentlyActivatedClickers]);

  // Initialize game when activated or on reload (same pattern as Vakratunda)
  useEffect(() => {
    if (!isActive) return;

    if (isReload && (initialCurrentSequence.length > 0 || forcePhase)) {      
      console.log('🔄 RELOAD: Restoring Combined game state');
            
      // Restore all state
      setCurrentPhase(initialCurrentPhase);
      setCurrentRound(initialCurrentRound);
      setCurrentSequence(initialCurrentSequence);
      setPlayerInput(initialPlayerInput);
      setGamePhase(initialGamePhase);
      setPermanentTransformations(initialPermanentTransformations || {});
      setPermanentlyActivatedClickers(initialPermanentlyActivatedClickers || {});
      setComboStreak(initialComboStreak || 0);
      setMistakeCount(initialMistakeCount || 0);
      setHasGameStarted(true);
      setIsCountingDown(initialIsCountingDown);
      setCountdown(initialCountdown);

      // Restore current round click state
      const clickState = {};
      initialPlayerInput.forEach(syllable => {
        clickState[`${initialCurrentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`] = true;
      });
      setCurrentRoundClicks(clickState);

      // Handle celebration phase reload
      if (initialGamePhase === 'celebration') {
        console.log('🎉 RELOAD: Was celebrating - resuming auto-continuation');
        setGamePhase('celebration');
        setCanPlayerClick(false);
        
        safeSetTimeout(() => {
          if (!isComponentMountedRef.current) return;
          
          if (initialCurrentRound < 3) {
            console.log(`➡️ AUTO-RESUME: Continuing to round ${initialCurrentRound + 1} of ${initialCurrentPhase}`);
            
            setRoundTransition(true);
            
            safeSetTimeout(() => {
              if (!isComponentMountedRef.current) return;
              
              startNewRound(initialCurrentRound + 1);
              setRoundTransition(false);
            }, 1500);
            
          } else {
            console.log('🏆 AUTO-RESUME: Completing phase after reload');
            handlePhaseComplete(initialCurrentPhase);
          }
        }, 2000);
        
      } else {
        setGamePhase(initialGamePhase);
        setCanPlayerClick(initialGamePhase === 'listening');
      }

      if (initialIsCountingDown && initialCountdown > 0) {
        console.log('🔄 RELOAD: Restarting countdown from', initialCountdown);
        
        const countdownInterval = safeSetInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setIsCountingDown(false);
              if (isComponentMountedRef.current) {
                handlePlaySequence();
              }
              return 0;
            }
            return prev - 1;
          });
        }, 800);
      }
      
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
          handlePhaseComplete(lastCompletedPhase);
        }, 1000);
      }
      
    } else {
      console.log('🆕 NEW GAME: Starting Suryakoti phase immediately');
      const sequence = getSequenceForRound('suryakoti', 1);
      setCurrentPhase('suryakoti');
      setCurrentRound(1);
      setCurrentSequence(sequence);
      setHasGameStarted(true);
      setPermanentTransformations({});
      setPermanentlyActivatedClickers({});
      setComboStreak(0);
      setMistakeCount(0);
      
      saveGameState({
        gamePhase: 'waiting',
        currentPhase: 'suryakoti',
        currentRound: 1,
        currentSequence: sequence,
        playerInput: [],
        sequenceItemsShown: 0,
        permanentTransformations: {},
        permanentlyActivatedClickers: {},
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

  // Samaprabha phase starter (same pattern as Mahakaya in Vakratunda)
  const startSamaprabhaPhase = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('🌈 Starting Samaprabha phase - direct game start');
    
    const nextSequence = getSequenceForRound('samaprabha', 1);
    
    clearAllTimers();
    
    setCurrentPhase('samaprabha');
    setCurrentRound(1);
    setCurrentSequence(nextSequence);
    setPlayerInput([]);
    setGamePhase('waiting');
    setCanPlayerClick(false);
    setSequenceItemsShown(0);
    setComboStreak(0);
    setPermanentTransformations({});
    setPermanentlyActivatedClickers({});
    
    saveGameState({
      currentPhase: 'samaprabha',
      currentRound: 1,
      currentSequence: nextSequence,
      gamePhase: 'waiting',
      playerInput: [],
      permanentTransformations: {},
      permanentlyActivatedClickers: {},
      phaseJustCompleted: false
    });
  };

  // Global function exposure
  useEffect(() => {
    if (!isActive) return;
    
    if (!window.combinedMemoryGame) {
      window.combinedMemoryGame = {};
    }
    
    window.combinedMemoryGame.startSamaprabhaPhase = startSamaprabhaPhase;
    window.combinedMemoryGame.isReady = true;
    window.combinedMemoryGame.clearCompletionState = () => {
      if (isComponentMountedRef.current) {
        setGamePhase('waiting');
        setSequenceItemsShown(0);
        console.log('🧹 Combined memory game completion state cleared');
      }
    };
    
    console.log('🌐 Combined Memory Game: Global functions exposed and ready flag set');
    
    return () => {
      if (window.combinedMemoryGame) {
        window.combinedMemoryGame.isReady = false;
        delete window.combinedMemoryGame.startSamaprabhaPhase;
        delete window.combinedMemoryGame.clearCompletionState;
        console.log('🧹 Combined Memory Game: Global functions cleaned up');
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
              console.log('👂 Sequence complete, player can now click');
            }
          }, 800);
        }
      }, index * 1200);
    });
  };

  // Trigger animation effect on correct click
  const triggerAnimation = (syllableIndex) => {
    const syllable = currentSequence[syllableIndex];
    const sourceId = `${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`;
    const targetId = `${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`;
    
    const sourcePos = elementsRef.current[sourceId];
    const targetPos = elementsRef.current[targetId];
    
    if (sourcePos && targetPos) {
      setActiveAnimation({
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        phase: currentPhase,
        syllableIndex: syllableIndex,
        timestamp: Date.now()
      });
      
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          setActiveAnimation(null);
        }
      }, 1500);
      
      // Transform singer and activate reward
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          const singerId = `${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`;
          const rewardId = `${currentPhase === 'suryakoti' ? 'open-flower' : 'animal'}-${syllable}`;
          
          setPermanentTransformations(prev => ({ 
            ...prev, 
            [singerId]: true,
            [rewardId]: true 
          }));
        }
      }, 1200);
    }
  };

  // Trigger sparkles from clicker to singer
  const triggerClickerToSingerSparkles = (syllableIndex) => {
    if (!isComponentMountedRef.current) return;
    
    const syllable = currentSequence[syllableIndex];
    const clickerId = `${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`;
    const singerId = `${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`;
    
    setActiveSparkles(prev => ({ ...prev, [clickerId]: true }));
    
    safeSetTimeout(() => {
      if (isComponentMountedRef.current) {
        setActiveSparkles(prev => ({ 
          ...prev, 
          [clickerId]: false,
          [singerId]: 'permanent'
        }));
      }
    }, 800);
  };

  // Success celebration with multiple effects
  const triggerSuccessCelebration = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log('🎉 Triggering success celebration');
    
    // Animation celebration for all syllables
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        if (isComponentMountedRef.current) {
          triggerAnimation(index);
        }
      }, index * 200);
    });
    
    setGamePhase('celebration');
    setMistakeCount(0);
    setComboStreak(prev => prev + 1);
  };

  // Handle clicker click with permanent activation and transformations
  const handleClickerClick = (syllableIndex) => {
    const currentTime = Date.now();
    
    if (currentTime - lastClickTime < 300 || !isComponentMountedRef.current) {
      console.log('Click ignored - too fast or component unmounted!');
      return;
    }
    
    if (!canPlayerClick || isSequencePlaying) {
      console.log('Clicker click ignored - not ready');
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

    console.log(`✅ Player clicked clicker for syllable: ${clickedSyllable} (position ${syllableIndex + 1})`);
    
    playSyllableAudio(clickedSyllable);
    
    // Track both current round and permanent activation + transformations
    const clickerId = `${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${clickedSyllable}`;
    const singerId = `${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${clickedSyllable}`;
    const rewardId = `${currentPhase === 'suryakoti' ? 'open-flower' : 'animal'}-${clickedSyllable}`;
    
    setCurrentRoundClicks(prev => ({ ...prev, [clickerId]: true }));
    setPermanentlyActivatedClickers(prev => ({ ...prev, [clickerId]: true }));
    
    // Transform singer and activate reward
    setPermanentTransformations(prev => ({ 
      ...prev, 
      [singerId]: true,
      [rewardId]: true 
    }));
    
    const newPlayerInput = [...playerInput, clickedSyllable];
    setPlayerInput(newPlayerInput);
    
    triggerAnimation(syllableIndex);
    triggerClickerToSingerSparkles(syllableIndex);
    
    saveGameState({
      gamePhase: 'listening',
      playerInput: newPlayerInput,
      currentSequence: currentSequence,
      sequenceItemsShown: sequenceItemsShown,
      permanentlyActivatedClickers: {
        ...permanentlyActivatedClickers,
        [clickerId]: true
      },
      permanentTransformations: {
        ...permanentTransformations,
        [singerId]: true,
        [rewardId]: true
      }
    });
    
    if (newPlayerInput.length === currentSequence.length) {
      handleSequenceSuccess();
    }
  };

  // Automatic sequence success
  const handleSequenceSuccess = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🎊 Round ${currentRound} of ${currentPhase} completed successfully!`);
    
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
        console.log(`➡️ AUTO-ADVANCE: Starting round ${currentRound + 1} of ${currentPhase}`);
        
        setRoundTransition(true);
        
        safeSetTimeout(() => {
          if (!isComponentMountedRef.current) return;
          
          startNewRound(currentRound + 1);
          setRoundTransition(false);
        }, 1500);
        
      } else {
        handlePhaseComplete(currentPhase);
      }
    }, 2000);
  };

  // Handle phase completion
  const handlePhaseComplete = (completedPhase) => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🏆 Phase ${completedPhase} completed!`);
    setGamePhase('phase_complete');
    
    playCompleteWord(completedPhase);
    
    saveGameState({
      gamePhase: 'phase_complete',
      phaseJustCompleted: true,
      lastCompletedPhase: completedPhase
    });
    
    if (onPhaseComplete) {
      onPhaseComplete(completedPhase);
    }
    
    // Only auto-advance for Samaprabha completion
    if (completedPhase === 'samaprabha') {
      safeSetTimeout(() => {
        if (!isComponentMountedRef.current) return;
        
        console.log('🎯 Game complete!');
        saveGameState({
          gameJustCompleted: true
        });
        
        if (onGameComplete) {
          onGameComplete();
        }
      }, 3000);
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
    if (!canPlayerClick || syllableIndex >= currentSequence.length) return false;
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const isCorrect = (syllableIndex) => {
    return playerInput[syllableIndex] === currentSequence[syllableIndex];
  };

  const isWrong = (syllableIndex) => {
    return playerInput.length > syllableIndex && playerInput[syllableIndex] !== currentSequence[syllableIndex];
  };

  // Check if singer is transformed
  const isSingerTransformed = (syllable) => {
    const singerId = `${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`;
    return permanentTransformations[singerId];
  };

  // Check if reward is activated
  const isRewardActivated = (syllable) => {
    const rewardId = `${currentPhase === 'suryakoti' ? 'open-flower' : 'animal'}-${syllable}`;
    return permanentTransformations[rewardId];
  };

  // Check if clicker is permanently activated
  const isClickerPermanentlyActivated = (syllable) => {
    const clickerId = `${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`;
    return permanentlyActivatedClickers[clickerId];
  };

  const shouldHighlightClicker = (syllableIndex) => {
    if (!canPlayerClick) return false;
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const isClickerDisabled = (syllableIndex) => {
    if (!canPlayerClick) return true;
    const expectedIndex = playerInput.length;
    return syllableIndex !== expectedIndex;
  };

  const hasBeenClicked = (syllableIndex) => {
    return syllableIndex < playerInput.length;
  };

  // Status messages
  const getStatusMessage = () => {
    if (roundTransition) return `Preparing Round ${currentRound + 1}...`;
    if (isCountingDown) return `Get Ready... ${countdown}`;
    if (gamePhase === 'playing') return 'Listen to the sounds...';
    if (gamePhase === 'listening') return `Repeat! (${playerInput.length}/${currentSequence.length})`;
    if (gamePhase === 'celebration') return comboStreak >= 3 ? 'Perfect streak!' : 'Well done!';
    if (gamePhase === 'phase_complete') return '';
    if (gamePhase === 'error') return mistakeCount >= 3 ? 'Listen carefully...' : 'Try again!';
    if (gamePhase === 'order_error') return 'Click in order!';
    return `Round ${currentRound} - ${currentPhase.toUpperCase()}`;
  };

  // Quick jump to round
  const jumpToRound = (phase, round) => {
    if (!isComponentMountedRef.current) return;
    
    const newSequence = getSequenceForRound(phase, round);
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

  // Progress bar
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
        fontSize: '14px',
        fontWeight: 'bold', 
        color: currentPhase === 'suryakoti' ? '#FF9800' : '#E91E63',
        letterSpacing: '0.3px'
      }}>
        {currentPhase.toUpperCase()}
      </div>
      
      {/* Round Progress Dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[1, 2, 3].map(round => (
          <button
            key={round}
            onClick={() => jumpToRound(currentPhase, round)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              background: round <= currentRound 
                ? (round < currentRound ? '#4CAF50' : (currentPhase === 'suryakoti' ? '#FF9800' : '#E91E63'))
                : '#E0E0E0',
              transition: 'all 0.3s ease',
              boxShadow: round === currentRound ? `0 0 8px ${currentPhase === 'suryakoti' ? 'rgba(255, 152, 0, 0.4)' : 'rgba(233, 30, 99, 0.4)'}` : 'none',
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

      {/* Simple Syllable Progress */}
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

      {/* Combo Streak */}
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

      {/* Reload indicator */}
      {isReload && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: currentPhase === 'suryakoti' ? '#FF9800' : '#E91E63',
          animation: 'fadeOut 3s ease-out forwards'
        }} />
      )}
    </div>
  );

  // Render singer elements (closed flowers/fruits) - disappear when rewards appear
  /*const renderSinger = (syllable, index) => {
    const rewardId = `${currentPhase === 'suryakoti' ? 'open-flower' : 'animal'}-${syllable}`;
    const isRewarded = permanentTransformations[rewardId];
    
    // If this syllable already has a reward, don't show the singer
    if (isRewarded) return null;
    
    const glowState = singerGlow[syllable] || 'dormant';
    const position = phaseData.positions.singers[index];
    
    const getImage = () => {
      if (currentPhase === 'suryakoti') {
        return getClosedFlowerImage ? getClosedFlowerImage(index) : null;
      } else {
        const transformed = isSingerTransformed(syllable);
        return getFruitImage ? getFruitImage(index, transformed ? 1 : 0) : null;
      }
    };
    
    const hasSparkles = activeSparkles[`${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`];
    const hasPermanentSparkles = hasSparkles === 'permanent';
    const transformed = isSingerTransformed(syllable);
    
    const glowStyles = {
      dormant: { 
        filter: 'brightness(0.8)', 
        opacity: 0.7,
        transform: 'translate(-50%, -50%) scale(1)'
      },
      singing: { 
        filter: 'brightness(1.1) drop-shadow(0 0 8px #ffd700)', 
        animation: 'sing 0.6s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.15)',
        opacity: 1
      },
      success: { 
        filter: 'brightness(1.1) saturate(1.2) drop-shadow(0 0 6px #4caf50)',
        animation: 'successGlow 0.5s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.05)',
        opacity: 1
      },
      victory: { 
        filter: 'brightness(1.1) saturate(1.2) drop-shadow(0 0 8px #ffd700)',
        animation: 'victory 1s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.1)',
        opacity: 1
      },
      error: { 
        filter: 'brightness(1.1) drop-shadow(0 0 6px #f44336)',
        animation: 'errorShake 0.5s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      transformed: {
        filter: 'brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
        transform: 'translate(-50%, -50%) scale(1.08)',
        opacity: 1
      }
    };

    return (
      <div
        key={`singer-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`${currentPhase === 'suryakoti' ? 'closed-flower' : 'fruit'}-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '80px',
          height: '80px',
          transition: 'all 0.3s ease',
          zIndex: 10,
          ...glowStyles[transformed ? 'transformed' : glowState]
        }}
      >
        <img
          src={getImage()}
          alt={`${currentPhase === 'suryakoti' ? 'Closed flower' : 'Fruit'} ${syllable}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        {/* Singing indicator 
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
        
        {/* Sparkles 
        {(hasSparkles || hasPermanentSparkles) && (
          <div className="singer-sparkles">
            {Array.from({length: 4}).map((_, i) => (
              <div 
                key={i} 
                className="singer-sparkle"
                style={{ 
                  '--delay': `${i * 0.15}s`,
                  '--color': '#FFB74D',
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
      </div>
    );
  };*/

  // Render reward elements (open flowers/animals) - appear after singers disappear
  const renderReward = (syllable, index) => {
    const rewardId = `${currentPhase === 'suryakoti' ? 'open-flower' : 'animal'}-${syllable}`;
    const activated = isRewardActivated(syllable);
    
    // Only render if activated
    if (!activated) return null;
    
    const position = phaseData.positions.rewards[index];
    
    const getImage = () => {
      if (currentPhase === 'suryakoti') {
        return getOpenFlowerImage ? getOpenFlowerImage(index) : null;
      } else {
        return getAnimalImage ? getAnimalImage(index, 1) : null; // Always happy when activated
      }
    };
    
    const hasSparkles = activeSparkles[rewardId];
    const shouldSing = isSinging(syllable);
    
    const rewardStyle = {
      filter: shouldSing 
        ? 'brightness(1.1) drop-shadow(0 0 6px #ffd700)'
        : 'brightness(1.1) saturate(1.2) drop-shadow(0 0 4px rgba(255, 215, 0, 0.2))',
      transform: shouldSing 
        ? 'translate(-50%, -50%) scale(1.15)' 
        : 'translate(-50%, -50%) scale(1)',
      animation: shouldSing 
        ? 'sing 0.6s ease-in-out' 
        : 'rewardGlow 2s ease-in-out infinite',
      opacity: 1
    };

    return (
      <div
        key={`reward-${syllable}-${index}`}
        ref={(el) => registerElementPosition(rewardId, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: '90px',
          height: '90px',
          transition: 'all 0.3s ease',
          zIndex: 15,
          ...rewardStyle
        }}
      >
        <img
          src={getImage()}
          alt={`${currentPhase === 'suryakoti' ? 'Open flower' : 'Happy animal'} reward ${syllable}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        {/* Reward sparkles */}
        <div className="reward-sparkles">
          {Array.from({length: 3}).map((_, i) => (
            <div 
              key={i} 
              className="reward-sparkle"
              style={{ 
                '--delay': `${i * 0.2}s`,
                '--color': '#FFD700',
                animation: 'sparkleFloat 1.5s ease-in-out infinite'
              }}
            >
              ✨
            </div>
          ))}
        </div>
        
        {/* Singing indicator for rewards */}
        {shouldSing && (
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
        
        {/* Success indicator */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '18px',
          animation: 'rewardAppear 1s ease-out'
        }}>
          🎉
        </div>
      </div>
    );
  };

  // Render clicker elements with existing approach + permanent activation
  const renderClicker = (syllable, index) => {
    const mood = clickerMoods[syllable] || 'dim';
    const position = phaseData.positions.clickers[index];

      const isSingingNow = isSinging(syllable); // ADD THIS LIN
    
    const getImage = () => {
      if (currentPhase === 'suryakoti') {
        return getSunOrbImage ? getSunOrbImage(index) : null;
      } else {
        return getRainbowImage ? getRainbowImage(index) : null;
      }
    };
    
    const hasSparkles = activeSparkles[`${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`];
    
    const clickable = isClickable(index);
    const isNextExpected = shouldHighlightClicker(index);
    const isDisabled = isClickerDisabled(index);
    const alreadyClicked = hasBeenClicked(index);
    const isPermanentlyLearned = isClickerPermanentlyActivated(syllable);
    
    // Mood styles with permanent activation
    const moodStyles = {
      dim: { 
        filter: 'brightness(0.6) grayscale(0.5)', 
        animation: 'breathe 4s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 0.7
      },
      ready: { 
        filter: 'brightness(1)', 
        animation: 'breathe 3s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      activated: { 
        filter: 'brightness(1.2) saturate(1.3)', 
        animation: 'bounce 0.6s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.02)',
        opacity: 1
      },
      celebrating: { 
        filter: 'brightness(1.4) saturate(1.5) hue-rotate(45deg)', 
        animation: 'celebrate 1s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.08)',
        opacity: 1
      },
      permanently_activated: {
        filter: 'brightness(1) saturate(1.1) drop-shadow(0 0 6px rgba(255, 217, 0, 0.3))',
        animation: 'gentleGlow 3s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.03)',
        opacity: 1
      }
    };

    let finalStyle = { ...moodStyles[mood] };

    // Special styling when singing
if (isSingingNow) {
  finalStyle = {
    ...finalStyle,
    filter: 'brightness(1.4) drop-shadow(0 0 15px #FFD700)',
    animation: 'sing 0.6s ease-in-out',
    transform: 'translate(-50%, -50%) scale(1.15)'
  };
}
    
    // Priority system
    if (isPermanentlyLearned && !alreadyClicked) {
      finalStyle = { ...moodStyles.permanently_activated };
    } else if (alreadyClicked) {
      finalStyle.opacity = 1;
    } else if (isNextExpected) {
      finalStyle.animation = 'nextToClick 1.5s ease-in-out infinite';
    } else if (isDisabled) {
      finalStyle.filter = 'brightness(0.7) saturate(0.5) grayscale(0.3)';
      finalStyle.opacity = 0.6;
    }

    return (
      <button
        key={`clicker-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`${currentPhase === 'suryakoti' ? 'sun-orb' : 'rainbow'}-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          width: currentPhase === 'suryakoti' ? '100px' : '120px',
          height: currentPhase === 'suryakoti' ? '100px' : '80px',
          border: 'none',
          background: 'transparent',
          cursor: (clickable && !isDisabled) ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          zIndex: 20,
          borderRadius: '50%',
          ...finalStyle
        }}
        onClick={() => handleClickerClick(index)}
        disabled={!clickable || isDisabled}
      >
        <img
          src={getImage()}
          alt={`${currentPhase === 'suryakoti' ? 'Sun Orb' : 'Rainbow'} ${syllable}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        {/* Syllable label */}
        {(canPlayerClick || alreadyClicked) && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: alreadyClicked 
              ? 'rgba(76, 175, 80, 0.9)' 
              : isNextExpected 
              ? (currentPhase === 'suryakoti' ? 'rgba(255, 165, 0, 0.9)' : 'rgba(233, 30, 99, 0.9)')
              : isPermanentlyLearned
              ? 'rgba(255, 215, 0, 0.9)'
              : 'rgba(158, 158, 158, 0.8)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            {syllable.toUpperCase()}
          </div>
        )}

        {/* Completion indicator */}
        {alreadyClicked && (
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
            fontSize: '14px',
            color: 'white',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
            animation: 'checkmarkAppear 0.5s ease-out'
          }}>
            ✓
          </div>
        )}

        {/* Golden crown for permanently learned */}
        {isPermanentlyLearned && !alreadyClicked && (
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

        {/* Sparkles */}
        {hasSparkles && (
          <div className="clicker-sparkles">
            {Array.from({length: 6}).map((_, i) => (
              <div 
                key={i} 
                className="clicker-sparkle"
                style={{ 
                  '--delay': `${i * 0.1}s`,
                  '--color': currentPhase === 'suryakoti' 
                    ? ['#FF9800', '#FFB74D', '#FFCC02', '#FFC107', '#FF8F00', '#E65100'][i]
                    : ['#FF69B4', '#FFD700', '#00CED1', '#98FB98', '#DDA0DD', '#FFA500'][i]
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* Golden glow for next expected click */}
        {isNextExpected && !alreadyClicked && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            height: '85%',
            border: `2px solid ${currentPhase === 'suryakoti' ? '#FFD700' : '#FF69B4'}`,
            borderRadius: '50%',
            animation: 'goldenPulse 2s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
        )}
      </button>
    );
  };

  if (!isActive) {
    return null;
  }

  const phaseData = ELEMENT_DATA[currentPhase];

  return (
    <div className="combined-memory-game" style={containerStyle}>
      
      {/* Progress Bar */}
      {!hideElements && renderProgressBar()}
      
      {/* Status Display */}
      {!hideElements && gamePhase !== 'phase_complete' && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '20%',
          transform: 'translateX(-50%)',
          background: isCountingDown 
            ? (currentPhase === 'suryakoti' ? 'rgba(255, 152, 0, 0.9)' : 'rgba(156, 39, 176, 0.95)')
            : gamePhase === 'celebration'
            ? (currentPhase === 'suryakoti' ? 'rgba(255, 165, 0, 0.95)' : 'rgba(233, 30, 99, 0.95)')
            : gamePhase === 'error' || gamePhase === 'order_error'
            ? 'rgba(244, 67, 54, 0.9)'
            : (currentPhase === 'suryakoti' ? 'rgba(255, 152, 0, 0.9)' : 'rgba(156, 39, 176, 0.95)'),
          color: 'white',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500',
          textAlign: 'center',
          zIndex: 50,
          maxWidth: '220px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease'
        }}>
          {getStatusMessage()}
        </div>
      )}

      {/* Round Selector Buttons */}
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
                background: round === currentRound 
                  ? (currentPhase === 'suryakoti' ? '#FF9800' : '#E91E63')
                  : (currentPhase === 'suryakoti' ? 'rgba(255, 183, 77, 0.8)' : 'rgba(233, 30, 99, 0.8)'), 
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

      {/* Countdown Display */}
      {!hideElements && isCountingDown && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          fontWeight: 'bold',
          color: currentPhase === 'suryakoti' ? '#FF9800' : '#E91E63',
          textShadow: `0 0 30px ${currentPhase === 'suryakoti' ? 'rgba(255, 152, 0, 0.8)' : 'rgba(233, 30, 99, 0.8)'}`,
          zIndex: 100,
          animation: 'countdownPulse 0.8s ease-in-out'
        }}>
          {countdown}
        </div>
      )}

 {/* Game Elements */}
{!hideElements && ((currentPhase === 'suryakoti') || (currentPhase === 'samaprabha' && powerGained)) && (
  <>
    {/* Wilted Flowers (Visual background for Suryakoti) */}
    {currentPhase === 'suryakoti' && currentSequence.map((syllable, index) => {
      const isBloomedAlready = isRewardActivated(syllable);
      if (isBloomedAlready) return null; // Don't show wilted if already bloomed
      
      const position = phaseData.positions.rewards[index];
      return (
        <div
          key={`wilted-flower-${syllable}-${index}`}
          style={{
            position: 'absolute',
            left: position.left,
            top: position.top,
            width: '80px',
            height: '80px',
            zIndex: 5,
            opacity: 0.6
          }}
        >
          <img 
            src={getClosedFlowerImage ? getClosedFlowerImage(index) : null}
            alt={`Wilted flower ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      );
    })}
    
    {/* Sad Animals (Visual background for Samaprabha) */}
    {currentPhase === 'samaprabha' && currentSequence.map((syllable, index) => {
      const isHappyAlready = isRewardActivated(syllable);
      if (isHappyAlready) return null; // Don't show sad if already happy
      
      const position = phaseData.positions.rewards[index];
      return (
        <div
          key={`sad-animal-${syllable}-${index}`}
          style={{
            position: 'absolute',
            left: position.left,
            top: position.top,
            width: '80px',
            height: '80px',
            zIndex: 5,
            opacity: 0.6
          }}
        >
          <img 
            src={getAnimalImage ? getAnimalImage(index, 0) : null}
            alt={`Sad animal ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      );
    })}
    
    {/* Clickers (Sun Orbs/Rainbows) - Now also singers */}
    {currentSequence.map((syllable, index) => {
      if (currentPhase === 'samaprabha' && !powerGained) {
        return null;
      }
      return renderClicker(syllable, index);
    })}
    
    {/* Rewards (Bloomed Flowers/Happy Animals) - Visual only */}
    {currentSequence.map((syllable, index) => {
      if (currentPhase === 'samaprabha' && !powerGained) {
        return null;
      }
      return renderReward(syllable, index);
    })}
  </>
)}
      
      
      {/* Animation Component */}
      {activeAnimation && (
        <>
          {currentPhase === 'suryakoti' && SunRayComponent && (
            <SunRayComponent
              sourcePosition={activeAnimation.sourcePosition}
              targetPosition={activeAnimation.targetPosition}
              isActive={true}
              rayCount={12}
              duration={1500}
            />
          )}
          {currentPhase === 'samaprabha' && SparkleTrailComponent && (
            <SparkleTrailComponent
              sourcePosition={activeAnimation.sourcePosition}
              targetPosition={activeAnimation.targetPosition}
              isActive={true}
              sparkleCount={20}
              duration={1500}
            />
          )}
        </>
      )}
      
      {/* CSS Animations */}
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
        
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) scale(1.02); }
          50% { transform: translate(-50%, -50%) translateY(-8px) scale(1.02); }
        }
        
        @keyframes celebrate {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1.08); }
          25% { transform: translate(-50%, -50%) rotate(-3deg) scale(1.1); }
          75% { transform: translate(-50%, -50%) rotate(3deg) scale(1.1); }
        }
        
        @keyframes gentleGlow {
          0%, 100% { 
            filter: brightness(1) saturate(1.1) drop-shadow(0 0 6px rgba(255, 217, 0, 0.3));
          }
          50% { 
            filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(255, 217, 0, 0.4));
          }
        }
        
        @keyframes nextToClick {
          0%, 100% { 
            filter: brightness(1.2) drop-shadow(0 0 8px #FF9800);
          }
          50% { 
            filter: brightness(1.4) drop-shadow(0 0 12px #FFB74D);
          }
        }
        
        @keyframes crownFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-3px); }
        }
        
        @keyframes sing {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes victory {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes successGlow {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
          100% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          25% { transform: translate(-50%, -50%) translateX(-5px); }
          75% { transform: translate(-50%, -50%) translateX(5px); }
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
        
        @keyframes rewardGlow {
          0%, 100% { 
            filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 4px rgba(255, 215, 0, 0.2));
          }
          50% { 
            filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 6px rgba(255, 215, 0, 0.3));
          }
        }

        @keyframes rewardAppear {
          0% { transform: translateX(-50%) scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: translateX(-50%) scale(1.2) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
        }
        
        .clicker-sparkles, .singer-sparkles, .reward-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .clicker-sparkle, .singer-sparkle, .reward-sparkle {
          position: absolute;
          animation: sparkleFloat 1s ease-out forwards;
          animation-delay: var(--delay);
          color: var(--color);
          font-size: 16px;
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
              calc(-50% + 30px), 
              calc(-50% - 30px)
            ) scale(1.2) rotate(180deg);
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

export default CombinedMemoryGame;