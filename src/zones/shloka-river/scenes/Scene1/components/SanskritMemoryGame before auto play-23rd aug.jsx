// zones/shloka-river/scenes/Scene1/components/SanskritMemoryGame.jsx
// Sanskrit memory game - listen to syllables, repeat by clicking elephants
// MINIMAL WATER SPRAY INTEGRATION - keeps existing working logic

import React, { useState, useEffect, useRef } from 'react';

// Sanskrit syllable sequences for each phase and round
const SYLLABLE_SEQUENCES = {
  vakratunda: {
    1: ['va', 'kra'],
    2: ['va', 'kra', 'tun'],
    3: ['va', 'kra', 'tun', 'da']
  },
  mahakaya: {
    1: ['ma', 'ha'],
    2: ['ma', 'ha', 'ka'], 
    3: ['ma', 'ha', 'ka', 'ya']
  }
};

const ELEMENT_DATA = {
  vakratunda: {
    singers: ['lotus-va', 'lotus-kra', 'lotus-tun', 'lotus-da'],
    clickers: ['baby-elephant-va', 'baby-elephant-kra', 'baby-elephant-tun', 'baby-elephant-da'],
    positions: {
      singers: [
        { left: '25%', top: '45%' },
        { left: '35%', top: '55%' },
        { left: '45%', top: '60%' },
        { left: '75%', top: '50%' }
      ],
      clickers: [
        { left: '18%', top: '65%' },
        { left: '38%', top: '35%' },
        { left: '58%', top: '30%' },
        { left: '68%', top: '28%' }
      ],
      elephantLabels: [
        { left: '12%', top: '70%' },
        { left: '32%', top: '65%' },
        { left: '52%', top: '72%' },
        { left: '72%', top: '68%' }
      ]
    }
  },
  mahakaya: {
    singers: ['stone-ma', 'stone-ha', 'stone-ka', 'stone-ya'],
    clickers: ['adult-elephant-ma', 'adult-elephant-ha', 'adult-elephant-ka', 'adult-elephant-ya'],
    positions: {
      singers: [
        { left: '20%', top: '60%' },
        { left: '40%', top: '65%' },
        { left: '60%', top: '58%' },
        { left: '80%', top: '62%' }
      ],
      clickers: [
        { left: '12%', top: '70%' },
        { left: '32%', top: '75%' },
        { left: '52%', top: '72%' },
        { left: '72%', top: '78%' }
      ],
      elephantLabels: [
        { left: '18%', top: '85%' },
        { left: '38%', top: '88%' },
        { left: '58%', top: '85%' },
        { left: '78%', top: '87%' }
      ]
    }
  }
};

const SanskritMemoryGame = ({
  isActive = false,
  hideElements = false,  // Added hideElements prop
    powerGained = false,  // Add this new prop
  onPhaseComplete,
  onGameComplete,
  profileName = 'little explorer',
  
  // NEW: Water spray component prop
  WaterSprayComponent,
  
  // Reload support props
  isReload = false,
  initialGamePhase = 'waiting',
  initialCurrentPhase = 'vakratunda',
  initialCurrentRound = 1,
  initialPlayerInput = [],
  initialCurrentSequence = [],
  initialSequenceItemsShown = 0,
  phaseJustCompleted = false,
  lastCompletedPhase = null,

  // Assets - passed from parent component
  getLotusImage,
  getStoneImage, 
  getBabyElephantImage,
  getAdultElephantImage,
  
  // Callback to save state for reload support
  onSaveGameState
}) => {
  console.log('SanskritMemoryGame render:', { 
    isActive, 
    hideElements,
    isReload,
    initialCurrentPhase,
    initialCurrentRound,
    initialPlayerInput
  });

  // Game state
  const [gamePhase, setGamePhase] = useState('waiting');
  const [currentPhase, setCurrentPhase] = useState('vakratunda');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [canPlayerClick, setCanPlayerClick] = useState(false);
  const [singingSyllable, setSingingSyllable] = useState(null);
  const [sequenceItemsShown, setSequenceItemsShown] = useState(0);

  // NEW: Water spray state
  const [activeWaterSpray, setActiveWaterSpray] = useState(null);
  const [permanentlyBloomed, setPermanentlyBloomed] = useState({});
  const elementsRef = useRef({});

  // Refs for cleanup
  const timeoutsRef = useRef([]);

  // Safe timeout function
  const safeSetTimeout = (callback, delay) => {
    const timeout = setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // NEW: Register element positions for water spray targeting
  const registerElementPosition = (id, element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const container = element.closest('.vakratunda-grove-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        
        elementsRef.current[id] = {
          left: ((rect.left - containerRect.left + rect.width / 2) / containerRect.width * 100) + '%',
          top: ((rect.top - containerRect.top + rect.height / 2) / containerRect.height * 100) + '%'
        };
      }
    }
  };

  const playSyllableAudio = (syllable) => {
    try {
      console.log(`Playing syllable: ${syllable}`);
      
      const syllableFileMap = {
        'va': 'vakratunda-va',
        'kra': 'vakratunda-kra', 
        'tun': 'vakratunda-tun',
        'da': 'vakratunda-da',
        'ma': 'mahakaya-ma',
        'ha': 'mahakaya-ha',
        'ka': 'mahakaya-ka',
        'ya': 'mahakaya-ya'
      };
      
      const fileName = syllableFileMap[syllable];
      if (!fileName) {
        console.log(`No file mapping found for syllable: ${syllable}`);
        return;
      }
      
      const audio = new Audio(`/audio/syllables/${fileName}.mp3`);
      audio.volume = 0.8;
      audio.play().catch(e => {
        console.log('Audio file not found, using speech synthesis fallback:', e);
        
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(syllable);
          utterance.rate = 0.7;
          utterance.pitch = 1.2;
          utterance.volume = 0.8;
          utterance.lang = 'en-US';
          speechSynthesis.speak(utterance);
        }
      });
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  const playCompleteWord = (word) => {
    try {
      const wordFileMap = {
        'vakratunda': 'Vakratunda',
        'mahakaya': 'Mahakaya'
      };
      
      const fileName = wordFileMap[word];
      if (!fileName) {
        console.log(`No file mapping found for word: ${word}`);
        return;
      }
      
      const audio = new Audio(`/audio/words/${fileName}.mp3`);
      audio.volume = 0.9;
      audio.play().catch(e => {
        console.log('Word audio not found, using speech synthesis:', e);
        
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(word);
          utterance.rate = 0.6;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          speechSynthesis.speak(utterance);
        }
      });
    } catch (error) {
      console.log('Word audio not available:', error);
    }
  };

  // Get sequence for current phase and round
  const getSequenceForRound = (phase, round) => {
    return SYLLABLE_SEQUENCES[phase][round] || [];
  };

  // Initialize game when activated or on reload
  useEffect(() => {
    if (!isActive) return;

    if (isReload && initialCurrentSequence.length > 0) {
      console.log('RELOAD: Restoring Sanskrit game state:', {
        initialGamePhase,
        initialCurrentPhase,
        initialCurrentRound,
        initialPlayerInput,
        initialCurrentSequence,
        phaseJustCompleted
      });
      
      setCurrentPhase(initialCurrentPhase);
      setCurrentRound(initialCurrentRound);
      setCurrentSequence(initialCurrentSequence);
      setPlayerInput(initialPlayerInput);
      setGamePhase(initialGamePhase);
      setSequenceItemsShown(initialCurrentSequence.length);
      setCanPlayerClick(initialGamePhase === 'listening');
      
      if (phaseJustCompleted && lastCompletedPhase) {
        console.log('POST-PHASE COMPLETION: Auto-continuing');
        safeSetTimeout(() => {
          handlePhaseComplete(lastCompletedPhase);
        }, 1000);
      }
      
    } else {
      console.log('NEW GAME: Starting Vakratunda phase');
      const sequence = getSequenceForRound('vakratunda', 1);
      setCurrentPhase('vakratunda');
      setCurrentRound(1);
      setCurrentSequence(sequence);
      setPlayerInput([]);
      setGamePhase('waiting');
      setCanPlayerClick(false);
      setSequenceItemsShown(0);
      clearAllTimeouts();
    }
  }, [isActive, isReload]);

  // Save state for reload support
  const saveGameState = (additionalState = {}) => {
    if (onSaveGameState) {
      onSaveGameState({
        gamePhase,
        currentPhase,
        currentRound,
        playerInput,
        currentSequence,
        sequenceItemsShown,
        permanentlyBloomed,
        ...additionalState
      });
    }
  };

  // Play the syllable sequence
  const handlePlaySequence = async () => {
    if (isSequencePlaying || currentSequence.length === 0) return;

    console.log('Playing syllable sequence:', currentSequence);
    setIsSequencePlaying(true);
    setGamePhase('playing');
    setCanPlayerClick(false);
    setPlayerInput([]);
    setSequenceItemsShown(0);
    setSingingSyllable(null);
    
    saveGameState({ gamePhase: 'playing' });
    
    currentSequence.forEach((syllable, index) => {
      safeSetTimeout(() => {
        console.log(`Playing syllable ${index + 1}/${currentSequence.length}: ${syllable}`);
        
        setSequenceItemsShown(index + 1);
        setSingingSyllable(syllable);
        playSyllableAudio(syllable);
        
        safeSetTimeout(() => {
          setSingingSyllable(null);
        }, 600);
        
        if (index === currentSequence.length - 1) {
          safeSetTimeout(() => {
            setIsSequencePlaying(false);
            setGamePhase('listening');
            setCanPlayerClick(true);
            saveGameState({ gamePhase: 'listening' });
            console.log('Sequence complete, player can now click elephants');
          }, 800);
        }
      }, index * 1200);
    });
  };

  // NEW: Handle water spray effect on correct click
  const triggerWaterSpray = (syllableIndex) => {
    if (!WaterSprayComponent) return;
    
    const syllable = currentSequence[syllableIndex];
    const sourceId = `${currentPhase === 'vakratunda' ? 'baby' : 'adult'}-elephant-${syllable}`;
    const targetId = `${currentPhase === 'vakratunda' ? 'lotus' : 'stone'}-${syllable}`;
    
    const sourcePos = elementsRef.current[sourceId];
    const targetPos = elementsRef.current[targetId];
    
    if (sourcePos && targetPos) {
      setActiveWaterSpray({
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        phase: currentPhase,
        syllableIndex: syllableIndex,
        timestamp: Date.now()
      });
      
      safeSetTimeout(() => {
        setActiveWaterSpray(null);
      }, 1500);
      
      safeSetTimeout(() => {
        setPermanentlyBloomed(prev => ({ ...prev, [targetId]: true }));
      }, 800);
    }
  };

  // UPDATED: Handle elephant click with water spray on success
  const handleElephantClick = (syllableIndex) => {
    if (!canPlayerClick || isSequencePlaying) {
      console.log('Elephant click ignored - not ready');
      return;
    }

    const clickedSyllable = currentSequence[syllableIndex];
    if (!clickedSyllable) return;

    console.log(`Player clicked elephant for syllable: ${clickedSyllable}`);
    
    playSyllableAudio(clickedSyllable);
    
    const newPlayerInput = [...playerInput, clickedSyllable];
    const currentIndex = newPlayerInput.length - 1;
    
    if (newPlayerInput[currentIndex] === currentSequence[currentIndex]) {
      console.log(`Correct! Position ${currentIndex + 1}/${currentSequence.length}`);
      setPlayerInput(newPlayerInput);
      
      triggerWaterSpray(syllableIndex);
      
      saveGameState({
        gamePhase: 'listening',
        playerInput: newPlayerInput,
        currentSequence: currentSequence,
        sequenceItemsShown: sequenceItemsShown
      });
      
      if (newPlayerInput.length === currentSequence.length) {
        handleSequenceSuccess();
      }
    } else {
      console.log(`Wrong! Expected: ${currentSequence[currentIndex]}, Got: ${clickedSyllable}`);
      handleSequenceError();
    }
  };

  // Handle correct sequence completion
  const handleSequenceSuccess = () => {
    console.log(`Round ${currentRound} of ${currentPhase} completed successfully!`);
    setGamePhase('success');
    setCanPlayerClick(false);
    
    saveGameState({
      gamePhase: 'success',
      playerInput: playerInput,
      currentSequence: currentSequence,
      sequenceItemsShown: sequenceItemsShown
    });
    
    safeSetTimeout(() => {
      if (currentRound < 3) {
        console.log(`Starting round ${currentRound + 1} of ${currentPhase}`);
        const nextRound = currentRound + 1;
        const nextSequence = getSequenceForRound(currentPhase, nextRound);
        
        setCurrentRound(nextRound);
        setCurrentSequence(nextSequence);
        setPlayerInput([]);
        setGamePhase('waiting');
        setCanPlayerClick(false);
        setSequenceItemsShown(0);
        
        saveGameState({
          currentRound: nextRound,
          currentSequence: nextSequence,
          gamePhase: 'waiting',
          playerInput: []
        });
        
      } else {
        handlePhaseComplete(currentPhase);
      }
    }, 1500);
  };

  // Handle phase completion
  const handlePhaseComplete = (completedPhase) => {
    console.log(`Phase ${completedPhase} completed!`);
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
    
    safeSetTimeout(() => {
      if (completedPhase === 'vakratunda') {
        console.log('Starting Mahakaya phase');
        const nextSequence = getSequenceForRound('mahakaya', 1);
        
        setCurrentPhase('mahakaya');
        setCurrentRound(1);
        setCurrentSequence(nextSequence);
        setPlayerInput([]);
        setGamePhase('waiting');
        setCanPlayerClick(false);
        setSequenceItemsShown(0);
        
        saveGameState({
          currentPhase: 'mahakaya',
          currentRound: 1,
          currentSequence: nextSequence,
          gamePhase: 'waiting',
          playerInput: [],
          phaseJustCompleted: false
        });
        
      } else {
        console.log('Game complete!');
        if (onGameComplete) {
          onGameComplete();
        }
      }
    }, 3000);
  };

  // Handle wrong input
  const handleSequenceError = () => {
    setGamePhase('error');
    setCanPlayerClick(false);
    setPlayerInput([]);
    
    safeSetTimeout(() => {
      console.log('Replaying sequence after error');
      setSequenceItemsShown(0);
      handlePlaySequence();
    }, 2000);
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
    const targetId = `${currentPhase === 'vakratunda' ? 'lotus' : 'stone'}-${syllable}`;
    return permanentlyBloomed[targetId];
  };

  if (!isActive) {
    return null;
  }

  const phaseData = ELEMENT_DATA[currentPhase];

  return (
    <div className="sanskrit-memory-game" style={containerStyle}>
      
{!hideElements && ((currentPhase === 'vakratunda') || (currentPhase === 'mahakaya' && powerGained)) && (
        <>
          {/* Game Status */}
          <div style={statusStyle}>
{gamePhase === 'waiting' && currentPhase === 'vakratunda' && `Ready to learn ${currentPhase.toUpperCase()} - Round ${currentRound}`}
{gamePhase === 'waiting' && currentPhase === 'mahakaya' && powerGained && `Ready to learn ${currentPhase.toUpperCase()} - Round ${currentRound}`}            {gamePhase === 'playing' && 'Listen to the sacred sounds...'}
            {gamePhase === 'listening' && `Repeat the sequence! (${playerInput.length}/${currentSequence.length})`}
            {gamePhase === 'success' && 'Perfect! Moving to next round...'}
            {gamePhase === 'phase_complete' && `${currentPhase.toUpperCase()} learned! Sacred word mastered!`}
            {gamePhase === 'error' && 'Try again, listen more carefully...'}
          </div>
          
          {/* Play Sequence Button */}
{(gamePhase === 'waiting' || gamePhase === 'error') && ((currentPhase === 'vakratunda') || (currentPhase === 'mahakaya' && powerGained)) && (            <button 
              style={playButtonStyle}
              onClick={handlePlaySequence}
              disabled={isSequencePlaying}
            >
              Play Sacred Sequence
            </button>
          )}
          
          {/* Sequence Display - Progressive revelation */}
          {sequenceItemsShown > 0 && (
            <div style={sequenceDisplayStyle}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>
                Sacred Sequence:
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {currentSequence.slice(0, sequenceItemsShown).map((syllable, index) => (
                  <div 
                    key={index}
                    style={{
                      ...sequenceItemStyle,
                      backgroundColor: index < playerInput.length 
                        ? (isCorrect(index) ? '#4caf50' : '#f44336')
                        : '#e0e0e0'
                    }}
                  >
                    {syllable.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Singing Elements (Lotus/Stones) */}
          {currentSequence.map((syllable, index) => {
              // ADD THIS BLOCK:
  if (currentPhase === 'mahakaya' && !powerGained) {
    return null;
  }
  
            const position = phaseData.positions.singers[index];
            if (!position) return null;
            
            const getImage = currentPhase === 'vakratunda' ? getLotusImage : getStoneImage;
            const bloomed = isBloomed(syllable);
            
            return (
              <div
                key={`singer-${syllable}-${index}`}
                ref={(el) => registerElementPosition(`${currentPhase === 'vakratunda' ? 'lotus' : 'stone'}-${syllable}`, el)}
                style={{
                  position: 'absolute',
                  left: position.left,
                  top: position.top,
                  width: '80px',
                  height: '80px',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.3s ease',
                  filter: isSinging(syllable) 
                    ? 'brightness(1.5) drop-shadow(0 0 20px #ffd700)' 
                    : bloomed 
                    ? 'brightness(1.3) saturate(1.4) drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
                    : 'brightness(1)',
                  opacity: bloomed ? 1 : 0.8,
                  zIndex: 10
                }}
              >
                {getImage && (
                  <img
                    src={getImage(index)}
                    alt={`${currentPhase === 'vakratunda' ? 'Lotus' : 'Stone'} ${syllable}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
                
                {isSinging(syllable) && (
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 215, 0, 0.9)',
                    color: '#000',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    animation: 'singPulse 1s infinite'
                  }}>
                  </div>
                )}
              </div>
            );
          })}

          {/* Clickable Elements (Elephants) */}
{currentSequence.map((syllable, index) => {
        if (currentPhase === 'mahakaya' && !powerGained) {
          return null;
        }
                const position = phaseData.positions.clickers[index];  // ADD THIS LINE
        if (!position) return null;
            
            const getImage = currentPhase === 'vakratunda' ? getBabyElephantImage : getAdultElephantImage;
            const clickable = isClickable(index);
            
            return (
              <button
                key={`clicker-${syllable}-${index}`}
                ref={(el) => registerElementPosition(`${currentPhase === 'vakratunda' ? 'baby' : 'adult'}-elephant-${syllable}`, el)}
                style={{
                  position: 'absolute',
                  left: position.left,
                  top: position.top,
                  width: '170px',
                  height: '170px',
                  transform: 'translate(-50%, -50%)',
                  border: 'none',
                  borderRadius: '0',
                  background: 'transparent',
                  cursor: clickable ? 'pointer' : 'default',
                  opacity: clickable ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  boxShadow: 'none',
                  zIndex: 20
                }}
                onClick={() => handleElephantClick(index)}
                disabled={!clickable}
              >
                {getImage && (
                  <img
                    src={getImage(index)}
                    alt={`${currentPhase === 'vakratunda' ? 'Baby' : 'Adult'} Elephant ${syllable}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
                
                <div style={{
                  position: 'absolute',
                  bottom: '85px',
                  left: '60%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {syllable.toUpperCase()}
                </div>
                
                {clickable && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(33, 150, 243, 0.9)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    animation: 'clickPulse 2s infinite'
                  }}>
                    Click!
                  </div>
                )}
              </button>
            );
          })}

          {/* Player Progress Indicator */}
          {canPlayerClick && (
            <div style={progressIndicatorStyle}>
              Progress: {playerInput.length} / {currentSequence.length}
            </div>
          )}
        </>
      )}
      
      {/* Water Spray Animation - Keep outside hideElements so it works during blessing */}
      {activeWaterSpray && WaterSprayComponent && (
        <WaterSprayComponent
          sourcePosition={activeWaterSpray.sourcePosition}
          targetPosition={activeWaterSpray.targetPosition}
          isActive={true}
          dropCount={activeWaterSpray.phase === 'mahakaya' ? 20 : 15}
          duration={1500}
          phase={activeWaterSpray.phase}
        />
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes clickPulse {
          0%, 100% { 
            opacity: 0.7;
            transform: translateX(-50%) scale(1);
          }
          50% { 
            opacity: 1;
            transform: translateX(-50%) scale(1.1);
          }
        }
        
        @keyframes singPulse {
          0%, 100% { 
            transform: translateX(-50%) scale(1);
          }
          50% { 
            transform: translateX(-50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

// Inline styles
const containerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 20,
  pointerEvents: 'auto'
};

const statusStyle = {
  position: 'absolute',
  top: '20px',
  left: '20%',
  transform: 'translateX(-50%)',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#f9f7f1ff',
  background: 'rgba(58, 178, 199, 0.9)',
  padding: '8px 16px',
  borderRadius: '15px',
  zIndex: 30,
  textAlign: 'center',
  minWidth: '250px'
};

const playButtonStyle = {
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 248, 220, 0.95)',
  color: '#90b8efff',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 'bold',
  cursor: 'pointer',
  zIndex: 30,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
};

const sequenceDisplayStyle = {
  position: 'absolute',
  top: '100px',
  left: '80%',
  transform: 'translateX(-50%)',
  background: 'rgba(171, 236, 248, 0.95)',
  padding: '15px 20px',
  borderRadius: '15px',
  zIndex: 30,
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

const sequenceItemStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '2px solid #333333ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'white',
  transition: 'all 0.3s ease'
};

const progressIndicatorStyle = {
  position: 'absolute',
  top: '200px',
  left: '80%',
  transform: 'translateX(-50%)',
  background: 'rgba(76, 175, 80, 0.9)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold',
  zIndex: 30
};

export default SanskritMemoryGame;