// zones/shloka-river/scenes/Scene4/components/KurumeDevaGame.jsx
// Divine decoration game - Animals click to activate items and create decor

import React, { useState, useEffect, useRef } from 'react';

// KurumeDeva syllable sequences for each round
const SYLLABLE_SEQUENCES = {
  kurumeDeva: {
    1: ['ku', 'ru'],
    2: ['ku', 'ru', 'me'],
    3: ['ku', 'ru', 'me', 'de'],
    4: ['ku', 'ru', 'me', 'de', 'va']
  }
};

const ELEMENT_DATA = {
  kurumeDeva: {
    animals: [
      { id: 'animal1-ku', position: { left: '25%', top: '60%' }, size: { width: '80px', height: '80px' } },
      { id: 'animal2-ru', position: { left: '35%', top: '55%' }, size: { width: '90px', height: '90px' } },
      { id: 'animal3-me', position: { left: '50%', top: '60%' }, size: { width: '85px', height: '85px' } },
      { id: 'animal4-de', position: { left: '65%', top: '55%' }, size: { width: '95px', height: '95px' } },
      { id: 'animal5-va', position: { left: '75%', top: '60%' }, size: { width: '100px', height: '100px' } }
    ],
    items: [
      { id: 'item1-ku', position: { left: '25%', top: '25%' }, size: { width: '50px', height: '50px' } },
      { id: 'item2-ru', position: { left: '35%', top: '20%' }, size: { width: '55px', height: '55px' } },
      { id: 'item3-me', position: { left: '50%', top: '25%' }, size: { width: '60px', height: '60px' } },
      { id: 'item4-de', position: { left: '65%', top: '20%' }, size: { width: '65px', height: '65px' } },
      { id: 'item5-va', position: { left: '75%', top: '25%' }, size: { width: '70px', height: '70px' } }
    ],
    decor: [
      { id: 'decor1-ku', position: { left: '50%', top: '45%' }, size: { width: '520px', height: '520px' } },
      { id: 'decor2-ru', position: { left: '35%', top: '55%' }, size: { width: '140px', height: '140px' } },
      { id: 'decor3-me', position: { left: '50%', top: '60%' }, size: { width: '160px', height: '160px' } },
      { id: 'decor4-de', position: { left: '65%', top: '55%' }, size: { width: '180px', height: '180px' } },
      { id: 'decor5-va', position: { left: '75%', top: '60%' }, size: { width: '200px', height: '200px' } }
    ]
  }
};

const KurumeDevaGame = ({
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
  initialPermanentTransformations = {},
  initialPermanentlyActivatedAnimals = {},
  initialComboStreak = 0,
  initialMistakeCount = 0,
  phaseJustCompleted = false,
  lastCompletedPhase = null,
  gameJustCompleted = false,
  initialIsCountingDown = false,
  initialCountdown = 0,
  
  // Assets - passed from parent component
  getAnimalImage,      // (index) -> animal images (clickers)
  getItemImage,        // (index, singing) -> kurub item images (singers)
  getDecorImage,       // (index, activated) -> kurufinal decor images (rewards)
  
  // Audio functions
  isAudioOn,
  playAudio,
  
  // State saving for reload support
  onSaveGameState,
  
  // Cleanup callback
  onCleanup

}) => {
  console.log('🌟 KurumeDevaGame render:', { 
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
  const [singingItem, setSingingItem] = useState(null);
  const [sequenceItemsShown, setSequenceItemsShown] = useState(0);

  const [currentPhase, setCurrentPhase] = useState('kurumeDeva');
  

  // Enhanced state for automatic flow and animations
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [roundTransition, setRoundTransition] = useState(false);
  const [animalMoods, setAnimalMoods] = useState({});
  const [itemGlow, setItemGlow] = useState({});
  const [mistakeCount, setMistakeCount] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [hasGameStarted, setHasGameStarted] = useState(false);

  // Separate states for visual persistence vs clicking
  const [permanentTransformations, setPermanentTransformations] = useState({});
  const [permanentlyActivatedAnimals, setPermanentlyActivatedAnimals] = useState({});

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
      console.log('🧹 KurumeDevaGame: Component unmounting - cleaning up');
      isComponentMountedRef.current = false;
      clearAllTimers();
      
      // Cleanup global references
      if (window.kurumeDevaGame) {
        window.kurumeDevaGame.isReady = false;
        delete window.kurumeDevaGame.startGame;
        delete window.kurumeDevaGame.clearCompletionState;
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
      console.log('🛑 KurumeDevaGame: Component deactivated - clearing timers');
      clearAllTimers();
      setIsCountingDown(false);
      setIsSequencePlaying(false);
      
      if (window.kurumeDevaGame) {
        window.kurumeDevaGame.isReady = false;
      }
    } else {
      if (window.kurumeDevaGame) {
        window.kurumeDevaGame.isReady = true;
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
      permanentTransformations,
      permanentlyActivatedAnimals,
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
      const container = element.closest('.kurume-deva-container');
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
        'ku': 'kurume-kuru',
        'ru': 'kurume-kuru', 
        'me': 'kurume-me',
        'de': 'deva-de',
        'va': 'deva-va'
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
      playAudio('/audio/words/kurumudeva.mp3', 0.9);
    } catch (error) {
      console.log('Word audio not available:', error);
    }
  };

  // Get sequence for current round
  const getSequenceForRound = (round) => {
    return SYLLABLE_SEQUENCES.kurumeDeva[round] || [];
  };

  // Reset clicking state at start of each round
  const startNewRound = (roundNumber) => {
    const sequence = getSequenceForRound(roundNumber);
    setCurrentRound(roundNumber);
    setCurrentSequence(sequence);
    setPlayerInput([]);
    setCurrentRoundClicks({});
    setGamePhase('waiting');
    setCanPlayerClick(false);
    setSequenceItemsShown(0);
    
    console.log(`🌟 Starting KurumeDeva Round ${roundNumber} with sequence:`, sequence);
    console.log('🔄 Click state reset - all animals clickable again');
    
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
            handlePlaySequence();
          }
          return 0;
        }
        return newCount;
      });
    }, 800);
  };

const updateAnimalMoods = () => {
  if (!isComponentMountedRef.current) return;
  
  const moods = {};
  currentSequence.forEach((syllable, index) => {
    const animalId = `animal-${syllable}`;
    
    if (permanentlyActivatedAnimals[animalId]) {
      moods[syllable] = 'permanently_activated';
    } else if (gamePhase === 'animal_clicking' && currentRoundClicks[animalId]) {
      moods[syllable] = 'activated';
    } else if (gamePhase === 'animal_clicking') {
      moods[syllable] = 'ready';
    } else if (gamePhase === 'celebration') {
      moods[syllable] = 'celebrating';
    } else if (isCountingDown) {
      moods[syllable] = 'ready';
    } else {
      moods[syllable] = 'dim';
    }
  });
  setAnimalMoods(moods);
};

  // Progressive item glow effects (items are singers)
  const updateItemGlow = () => {
    if (!isComponentMountedRef.current) return;
    
    const glowStates = {};
    currentSequence.forEach((syllable, index) => {
      const itemId = `item-${syllable}`;
      
      if (permanentTransformations[itemId]) {
        glowStates[syllable] = 'transformed';
      } else if (gamePhase === 'celebration') {
        glowStates[syllable] = 'victory';
      } else if (gamePhase === 'playing' && singingItem === syllable) {
        glowStates[syllable] = 'singing';
      } else {
        glowStates[syllable] = 'idle';
      }
    });
    setItemGlow(glowStates);
  };

  // Update animations based on game state
  useEffect(() => {
    updateAnimalMoods();
    updateItemGlow();
  }, [gamePhase, playerInput, sequenceItemsShown, singingItem, isCountingDown, currentRoundClicks, permanentTransformations]);

  // Initialize game when activated or on reload
  useEffect(() => {
    if (!isActive) return;

    if (isReload && initialCurrentSequence.length > 0) {      
      console.log('🔄 RELOAD: Restoring KurumeDeva game state');
            
      // Restore all state
      setCurrentRound(initialCurrentRound);
      setCurrentSequence(initialCurrentSequence);
      setPlayerInput(initialPlayerInput);
      setGamePhase(initialGamePhase);
      setPermanentTransformations(initialPermanentTransformations || {});
      setComboStreak(initialComboStreak || 0);
      setMistakeCount(initialMistakeCount || 0);
      setHasGameStarted(true);
      setIsCountingDown(initialIsCountingDown);
      setCountdown(initialCountdown);

      const clickState = {};
      initialPlayerInput.forEach(syllable => {
        clickState[`animal-${syllable}`] = true;
      });
      setCurrentRoundClicks(clickState);

      // Handle celebration phase reload
      if (initialGamePhase === 'celebration') {
        console.log('🎉 RELOAD: Was celebrating - resuming auto-continuation');
        setGamePhase('celebration');
        setCanPlayerClick(false);
        
        safeSetTimeout(() => {
          if (!isComponentMountedRef.current) return;
          
          if (initialCurrentRound < 4) {
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
        setGamePhase(initialGamePhase);
        setCanPlayerClick(initialGamePhase === 'animal_clicking');
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
          handlePhaseComplete();
        }, 1000);
      }
      
    } else {
      console.log('🆕 NEW GAME: Starting KurumeDeva phase immediately');
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
    
    if (!window.kurumeDevaGame) {
      window.kurumeDevaGame = {};
    }
    
    window.kurumeDevaGame.isReady = true;
    window.kurumeDevaGame.clearCompletionState = () => {
      if (isComponentMountedRef.current) {
        setGamePhase('waiting');
        setSequenceItemsShown(0);
        console.log('🧹 KurumeDeva game completion state cleared');
      }
    };
    
    console.log('🌐 KurumeDevaGame: Global functions exposed and ready flag set');
    
    return () => {
      if (window.kurumeDevaGame) {
        window.kurumeDevaGame.isReady = false;
        delete window.kurumeDevaGame.clearCompletionState;
        console.log('🧹 KurumeDevaGame: Global functions cleaned up');
      }
    };
  }, [isActive]);

  // Play the item sequence (items are singers)
  const handlePlaySequence = async () => {
    if (isSequencePlaying || currentSequence.length === 0 || !isComponentMountedRef.current) return;

    console.log('🎵 Playing item sequence:', currentSequence);
    setIsSequencePlaying(true);
    setGamePhase('playing');
    setCanPlayerClick(false);
    setPlayerInput([]);
    setSequenceItemsShown(0);
    setSingingItem(null);
    
    saveGameState({ gamePhase: 'playing' });
    
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        if (!isComponentMountedRef.current) return;
        
        console.log(`🔊 Playing syllable ${index + 1}/${currentSequence.length}: ${syllable}`);
        
        setSequenceItemsShown(index + 1);
        setSingingItem(syllable);
        playSyllableAudio(syllable);
        
        triggerItemGlow(index);
        
        safeSetTimeout(() => {
          if (isComponentMountedRef.current) {
            setSingingItem(null);
          }
        }, 600);
        
        if (index === currentSequence.length - 1) {
          safeSetTimeout(() => {
            if (isComponentMountedRef.current) {
              setIsSequencePlaying(false);
              setGamePhase('animal_clicking');
              setCanPlayerClick(true);
              saveGameState({ gamePhase: 'animal_clicking' });
              console.log('🐾 Sequence complete, player can now click animals');
            }
          }, 800);
        }
      }, index * 1200);
    });
  };

  // Trigger item glow effect (during singing phase)
  const triggerItemGlow = (syllableIndex) => {
    if (!isComponentMountedRef.current) return;
    
    const syllable = currentSequence[syllableIndex];
    const itemId = `item-${syllable}`;
    
    setActiveSparkles(prev => ({ ...prev, [itemId]: true }));
    
    safeSetTimeout(() => {
      if (isComponentMountedRef.current) {
        setActiveSparkles(prev => ({ ...prev, [itemId]: false }));
      }
    }, 1000);
  };

  // Handle animal click (animals are clickers)
  const handleAnimalClick = (syllableIndex) => {
    const currentTime = Date.now();
    
    if (currentTime - lastClickTime < 300 || !isComponentMountedRef.current) {
      console.log('Click ignored - too fast or component unmounted!');
      return;
    }
    
    if (!canPlayerClick || isSequencePlaying) {
      console.log('Animal click ignored - not ready');
      return;
    }

    const clickedSyllable = currentSequence[syllableIndex];
    if (!clickedSyllable) return;

    const animalId = `animal-${clickedSyllable}`;
    if (currentRoundClicks[animalId]) {
      console.log('Animal already clicked this round!');
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

    setLastClickTime(currentTime);

    console.log(`✅ Player clicked animal for syllable: ${clickedSyllable} (position ${syllableIndex + 1})`);
    
    playSyllableAudio(clickedSyllable);
    
    const itemId = `item-${clickedSyllable}`;
    const decorId = `decor-${clickedSyllable}`;
    
    // Update current round clicks and permanent state
    setCurrentRoundClicks(prev => ({ ...prev, [animalId]: true }));
    setPermanentlyActivatedAnimals(prev => ({ ...prev, [animalId]: true }));
    
    // Update permanent transformations
    setPermanentTransformations(prev => ({ 
      ...prev, 
      [itemId]: true,
      [decorId]: true 
    }));
    
    // Trigger sparkles from animal to item
    triggerAnimalToItemSparkles(syllableIndex);
    
    const newPlayerInput = [...playerInput, clickedSyllable];
    setPlayerInput(newPlayerInput);
    
    saveGameState({
      gamePhase: 'animal_clicking',
      playerInput: newPlayerInput,
      currentSequence: currentSequence,
      sequenceItemsShown: sequenceItemsShown,
      permanentTransformations: {
        ...permanentTransformations,
        [itemId]: true,
        [decorId]: true
      }
    });
    
    if (newPlayerInput.length === currentSequence.length) {
      handleSequenceSuccess();
    }
  };

  // Trigger sparkles from animal to item
  const triggerAnimalToItemSparkles = (syllableIndex) => {
    if (!isComponentMountedRef.current) return;
    
    const syllable = currentSequence[syllableIndex];
    const animalId = `animal-${syllable}`;
    const itemId = `item-${syllable}`;
    
    setActiveSparkles(prev => ({ ...prev, [animalId]: true }));
    
    safeSetTimeout(() => {
      if (isComponentMountedRef.current) {
        setActiveSparkles(prev => ({ 
          ...prev, 
          [animalId]: false,
          [itemId]: 'permanent'
        }));
      }
    }, 800);
  };

  // Automatic sequence success
  const handleSequenceSuccess = () => {
    if (!isComponentMountedRef.current) return;
    
    console.log(`🎊 Round ${currentRound} of KurumeDeva completed successfully!`);
    
    setCanPlayerClick(false);
    setGamePhase('celebration');
    
    setMistakeCount(0);
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
      
      if (currentRound < 4) {
        console.log(`➡️ AUTO-ADVANCE: Starting round ${currentRound + 1} of KurumeDeva`);
        
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
    
    console.log('🏆 KurumeDeva phase completed!');
    setGamePhase('phase_complete');
    
    playCompleteWord();
    
    saveGameState({
      gamePhase: 'phase_complete',
      phaseJustCompleted: true,
      lastCompletedPhase: 'kurumeDeva'
    });
    
    if (onPhaseComplete) {
      onPhaseComplete('kurumeDeva');
    }
  };

  // Helper functions
  const getSyllableIndex = (syllable) => {
    return currentSequence.indexOf(syllable);
  };

  const isSinging = (syllable) => {
    return singingItem === syllable;
  };

  const isAnimalClickable = (syllableIndex) => {
    if (!canPlayerClick || syllableIndex >= currentSequence.length) return false;
    
    const expectedIndex = playerInput.length;
    return syllableIndex === expectedIndex;
  };

  const isAnimalActivated = (syllable) => {
    const animalId = `animal-${syllable}`;
    return currentRoundClicks[animalId];
  };

  const isItemTransformed = (syllable) => {
    const itemId = `item-${syllable}`;
    return permanentTransformations[itemId];
  };

  const isDecorActivated = (syllable) => {
    const decorId = `decor-${syllable}`;
    return permanentTransformations[decorId];
  };

  const hasBeenClickedThisRound = (syllableIndex) => {
    return syllableIndex < playerInput.length;
  };

  // Dynamic status messages
  const getStatusMessage = () => {
    if (roundTransition) return `Preparing Round ${currentRound + 1}...`;
    if (isCountingDown) return `Get Ready... ${countdown}`;
    if (gamePhase === 'playing') return 'Listen to the divine item sounds...';
    if (gamePhase === 'animal_clicking') return `Click the animals! (${playerInput.length}/${currentSequence.length})`;
    if (gamePhase === 'celebration') return comboStreak >= 3 ? 'Divine decoration streak! Magnificent!' : 'Beautiful! Divine creation!';
    if (gamePhase === 'phase_complete') return '';
    if (gamePhase === 'error') return mistakeCount >= 3 ? 'Listen to the divine sounds...' : 'Try again!';
    if (gamePhase === 'order_error') return 'Click the animals in order!';
    return `Round ${currentRound} - KURUME DEVA`;
  };

  // Quick jump to round (for game feature - not dev)
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

  // Render animal (clickers)
  const renderAnimal = (syllable, index) => {
    const mood = animalMoods[syllable] || 'dim';
const animalData = ELEMENT_DATA.kurumeDeva.animals[index];
const position = animalData.position;
const size = animalData.size;
    const hasSparkles = activeSparkles[`animal-${syllable}`];
    const activated = isAnimalActivated(syllable);
    const clickable = isAnimalClickable(index);
    const isNextExpected = isAnimalClickable(index);
    const alreadyClicked = hasBeenClickedThisRound(index);
    
    const moodStyles = {
      dim: { 
        filter: 'brightness(0.6) grayscale(0.5)', 
        animation: 'animalBreath 4s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 0.7
      },
      ready: { 
        filter: 'brightness(1)', 
        animation: 'animalPulse 2s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      activated: { 
        filter: 'brightness(1.4) saturate(1.6)', 
        animation: 'animalShimmer 0.8s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.05)',
        opacity: 1
      },
      celebrating: { 
        filter: 'brightness(1.5) saturate(1.8) hue-rotate(15deg)', 
        animation: 'animalCelebrate 1s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.08)',
        opacity: 1
      },
      permanently_activated: {
        filter: 'brightness(1.2) saturate(1.4) drop-shadow(0 0 10px #FF9800)',
        animation: 'animalGlow 2s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.03)',
        opacity: 1
      }
    };

    let finalStyle = { ...moodStyles[mood] };
    
    if (alreadyClicked) {
      finalStyle.filter = 'brightness(0.8) saturate(0.7)';
      finalStyle.opacity = 0.8;
    } else if (isNextExpected) {
      finalStyle.filter = 'brightness(1.2) drop-shadow(0 0 8px #FF9800)';
      finalStyle.animation = 'animalPulse 1s ease-in-out infinite';
    } else if (!clickable && canPlayerClick) {
      finalStyle.filter = 'brightness(0.7) saturate(0.5) grayscale(0.3)';
      finalStyle.opacity = 0.6;
    }

    return (
      <button
        key={`animal-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`animal-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
        width: size.width,      // Individual size
        height: size.height,    // Individual size
          border: 'none',
          background: 'transparent',
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          zIndex: 20,
          ...finalStyle
        }}
        onClick={() => handleAnimalClick(index)}
        disabled={!clickable}
      >
        {getAnimalImage && (
          <img
            src={getAnimalImage(index)}
            alt={`Animal ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {hasSparkles && (
          <div className="animal-sparkles">
            {Array.from({length: 6}).map((_, i) => (
              <div 
                key={i} 
                className="animal-sparkle"
                style={{ 
                  '--delay': `${i * 0.1}s`,
                  '--color': ['#FF9800', '#FFB74D', '#FFCC02', '#FFC107', '#FF8F00', '#E65100'][i]
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: alreadyClicked 
            ? 'rgba(255, 152, 0, 0.9)' 
            : isNextExpected 
            ? 'rgba(255, 152, 0, 0.9)' 
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
            color: '#FF9800'
          }}>
            ✓
          </div>
        )}
        
        {isNextExpected && !alreadyClicked && (
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 152, 0, 0.9)',
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
        )}
      </button>
    );
  };

  // Render item (singers - not clickable)
  const renderItem = (syllable, index) => {
    const glowState = itemGlow[syllable] || 'idle';
const itemData = ELEMENT_DATA.kurumeDeva.items[index];
const position = itemData.position;
const size = itemData.size;
    const transformed = isItemTransformed(syllable);
    const hasSparkles = activeSparkles[`item-${syllable}`];
    const hasPermanentSparkles = activeSparkles[`item-${syllable}`] === 'permanent';
    
    const glowStyles = {
      idle: { 
        filter: 'brightness(0.9)', 
        opacity: 0.8,
        transform: 'translate(-50%, -50%) scale(1)'
      },
      singing: { 
        filter: 'brightness(1.4) drop-shadow(0 0 15px #FFD700)', 
        animation: 'itemGlow 0.6s ease-in-out',
        transform: 'translate(-50%, -50%) scale(1.1)',
        opacity: 1
      },
      transformed: {
        filter: 'brightness(1.3) saturate(1.4) drop-shadow(0 0 12px #FFB74D)',
        transform: 'translate(-50%, -50%) scale(1.05)',
        opacity: 1,
        animation: 'itemTransform 0.5s ease-out'
      },
      victory: { 
        filter: 'brightness(1.4) saturate(1.4) drop-shadow(0 0 15px #FFD700)',
        animation: 'itemVictory 1s ease-in-out infinite',
        transform: 'translate(-50%, -50%) scale(1.1)',
        opacity: 1
      }
    };

    return (
      <div
        key={`item-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`item-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
        width: size.width,      // Instead of fixed '60px'
height: size.height,    // Instead of fixed '60px'
          transition: 'all 0.3s ease',
          zIndex: 15,
          ...glowStyles[glowState]
        }}
      >
        {getItemImage && (
          <img
            src={getItemImage(index, transformed ? 1 : 0)}
            alt={`Item ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {(hasSparkles || hasPermanentSparkles) && (
          <div className="item-sparkles">
            {Array.from({length: 4}).map((_, i) => (
              <div 
                key={i} 
                className="item-sparkle"
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
            color: '#FFB74D',
            fontWeight: 'bold'
          }}>
            Used!
          </div>
        )}
      </div>
    );
  };

  // Render decor
  const renderDecor = (syllable, index) => {
const decorData = ELEMENT_DATA.kurumeDeva.decor[index];
  const position = decorData.position;
  const size = decorData.size;
      const activated = isDecorActivated(syllable);
    
    const decorStyle = {
      filter: 'none',
      animation: 'none',
      transform: 'translate(-50%, -50%) scale(1)'
    };

    return (
      <div
        key={`decor-${syllable}-${index}`}
        ref={(el) => registerElementPosition(`decor-${syllable}`, el)}
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
           width: size.width,      // Individual size for each decor
        height: size.height,
          transition: 'all 0.3s ease',
          zIndex: 10,
          ...decorStyle
        }}
      >
        {getDecorImage && (
          <img
            src={getDecorImage(index, activated ? 1 : 0)}
            alt={`${activated ? 'Glowing' : 'Dim'} decoration ${syllable}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
        
        {activated && (
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
        )}
      </div>
    );
  };

  // Progress bar component
  const renderProgressBar = () => (
    <div style={{
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      zIndex: 40,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,215,0,0.3)',
      minWidth: '140px',
      transition: 'all 0.3s ease'
    }}>
      
      {/* Reload Indicator */}
      {isReload && (
        <div style={{
          fontSize: '10px',
          color: '#FF9800',
          fontWeight: 'bold',
          background: 'rgba(255, 152, 0, 0.15)',
          padding: '2px 6px',
          borderRadius: '8px',
          animation: 'fadeOut 4s ease-out forwards'
        }}>
          RESTORED
        </div>
      )}
      
      {/* Phase Header with Round Dots */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: 'bold', 
          color: '#333',
          letterSpacing: '0.5px'
        }}>
          KURUME DEVA
        </div>
        
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4].map(round => (
            <div
              key={round}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: round <= currentRound 
                  ? (round < currentRound ? '#FF9800' : '#FFB74D')
                  : '#ddd',
                transition: 'all 0.3s ease',
                boxShadow: round === currentRound ? '0 0 6px rgba(255, 152, 0, 0.4)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Sequence Syllables */}
      {sequenceItemsShown > 0 && (
        <div style={{
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%'
        }}>
          {currentSequence.slice(0, sequenceItemsShown).map((syllable, index) => (
            <div 
              key={index}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                color: 'white',
                background: index < playerInput.length 
                  ? '#FF9800'
                  : 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
                transition: 'all 0.3s ease',
                animation: index === sequenceItemsShown - 1 ? 'syllableAppear 0.4s ease-out' : 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {syllable.toUpperCase()}
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {canPlayerClick && (
        <div style={{
          width: '100%',
          height: '4px',
          background: '#e8e8e8',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(playerInput.length / currentSequence.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FFB74D 0%, #FF9800 100%)',
            borderRadius: '2px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      )}

      {/* Active Decorations Counter */}
      {Object.values(permanentTransformations).filter(Boolean).length > 0 && (
        <div style={{
          fontSize: '10px',
          color: '#FFB74D',
          fontWeight: 'bold',
          background: 'rgba(255, 183, 77, 0.15)',
          padding: '3px 8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          ✨ {Math.floor(Object.values(permanentTransformations).filter(Boolean).length / 2)} Decor
        </div>
      )}
    </div>
  );

  if (!isActive) {
    return null;
  }

  return (
    <div className="kurume-deva-game" style={containerStyle}>
      
      {/* Progress Bar */}
      {!hideElements && renderProgressBar()}
      
      {/* Status Display */}
      {!hideElements && gamePhase !== 'phase_complete' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20%',
          transform: 'translateX(-50%)',
          background: isCountingDown 
            ? 'rgba(255, 152, 0, 0.95)' 
            : gamePhase === 'celebration'
            ? 'rgba(255, 183, 77, 0.95)'
            : gamePhase === 'error' || gamePhase === 'order_error'
            ? 'rgba(244, 67, 54, 0.95)'
            : 'rgba(255, 152, 0, 0.95)',
          color: 'white',
          padding: '12px 12px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 50,
          minWidth: '300px',
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

      {/* Round Selector Buttons (Game Feature) */}
      {!hideElements && (gamePhase === 'waiting' || gamePhase === 'animal_clicking') && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '20%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 45
        }}>
          <button onClick={() => jumpToRound(currentPhase, 1)} 
                  style={{fontSize: '10px', padding: '4px 8px', borderRadius: '10px', background: '#FFB74D', color: 'white', border: 'none'}}>
            Round 1
          </button>
          <button onClick={() => jumpToRound(currentPhase, 2)}
                  style={{fontSize: '10px', padding: '4px 8px', borderRadius: '10px', background: '#FFB74D', color: 'white', border: 'none'}}>
            Round 2
          </button>
          <button onClick={() => jumpToRound(currentPhase, 3)}
                  style={{fontSize: '10px', padding: '4px 8px', borderRadius: '10px', background: '#FFB74D', color: 'white', border: 'none'}}>
            Round 3
          </button>
          <button onClick={() => jumpToRound(currentPhase, 4)}
                  style={{fontSize: '10px', padding: '4px 8px', borderRadius: '10px', background: '#FFB74D', color: 'white', border: 'none'}}>
            Round 4
          </button>
        </div>
      )}

      {/* Game Elements */}
      {!hideElements && (
        <>
          {/* Animals (Clickable after sequence) */}
          {currentSequence.map((syllable, index) => {
            return renderAnimal(syllable, index);
          })}
          
          {/* Singing Items (Display only) */}
          {currentSequence.map((syllable, index) => {
            return renderItem(syllable, index);
          })}
          
          {/* Decorations - Only show after transformation */}
          {currentSequence.map((syllable, index) => {
            const decorId = `decor-${syllable}`;
            const activated = permanentTransformations[decorId];
            
            // Only render if activated
            if (!activated) return null;
            
            return renderDecor(syllable, index);
          })}

          {/* Player Progress */}
          {canPlayerClick && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '20%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 152, 0, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 30,
              textAlign: 'center',
              minWidth: '150px'
            }}>
              Animals Clicked: {playerInput.length} / {currentSequence.length}
              {comboStreak >= 2 && (
                <div style={{ fontSize: '10px', marginTop: '2px', color: '#FFE0B2' }}>
                  Divine Combo: {comboStreak}x
                </div>
              )}
            </div>
          )}
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
        
        @keyframes animalBreath {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
        }
        
        @keyframes animalPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1.02); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes animalCelebrate {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1.08); }
          25% { transform: translate(-50%, -50%) rotate(-2deg) scale(1.1); }
          75% { transform: translate(-50%, -50%) rotate(2deg) scale(1.1); }
        }
        
        @keyframes animalShimmer {
          0%, 100% { transform: translate(-50%, -50%) scale(1.05); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        
        @keyframes animalGlow {
          0%, 100% { 
            filter: brightness(1.2) saturate(1.4) drop-shadow(0 0 10px #FF9800);
          }
          50% { 
            filter: brightness(1.4) saturate(1.6) drop-shadow(0 0 15px #FFB74D);
          }
        }
        
        @keyframes itemGlow {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes itemTransform {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes itemVictory {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
        
        @keyframes decorGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes decorDim {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(0.98); }
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
        
        .animal-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .animal-sparkle {
          position: absolute;
          animation: sparkleFloat 1s ease-out forwards;
          animation-delay: var(--delay);
          color: var(--color);
          font-size: 16px;
          opacity: 0;
          left: 50%;
          top: 50%;
        }

        .item-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .item-sparkle {
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

export default KurumeDevaGame;