// zones/shloka-river/scenes/Scene1/VakratundaGrove.jsx - Updated with Water Spray Integration
import React, { useState, useEffect, useRef } from 'react';
import './VakratundaGrove.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach } from '../../../../lib/components/coach/GameCoach';
import ProgressManager from '../../../../lib/services/ProgressManager';
import SimpleSceneManager from '../../../../lib/services/SimpleSceneManager';
import mooshikaCoach from "./assets/images/mooshika-coach.png";


// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import SceneCompletionCelebration from '../../../../lib/components/celebration/SceneCompletionCelebration';

// NEW: Import water spray and updated memory game components
import SanskritMemoryGame from './components/SanskritMemoryGame';
import WaterSprayArc from './components/WaterSprayArc';
import SanskritVoiceRecorder from '../../../../lib/components/audio/SanskritVoiceRecorder';

import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import SanskritRiverProgress from './components/SanskritRiverProgress';

// Images - River scene assets
import riverBackground from './assets/images/elephant-grove-bg.png';
import lotusVa from './assets/images/lotus-va.png';
import lotusKra from './assets/images/lotus-kra.png';
import lotusTun from './assets/images/lotus-tun.png';
import lotusDa from './assets/images/lotus-da.png';
import stoneMa from './assets/images/stone-ma.png';
import stoneHa from './assets/images/stone-ha.png';
import stoneKa from './assets/images/stone-ka.png';
import stoneYa from './assets/images/stone-ya.png';
import elephantBabyVa from './assets/images/elephant-baby-va.png';
import elephantBabyKra from './assets/images/elephant-baby-kra.png';
import elephantBabyTun from './assets/images/elephant-baby-tun.png';
import elephantBabyDa from './assets/images/elephant-baby-da.png';
import elephantHa from './assets/images/elephant-ha.png';
import elephantKa from './assets/images/elephant-ka.png';
import elephantMa from './assets/images/elephant-ma.png';
import elephantYa from './assets/images/elephant-ya.png';

const PHASES = {
  INITIAL: 'initial',
  MEMORY_GAME_ACTIVE: 'memory_game_active',
  VAKRATUNDA_COMPLETE: 'vakratunda_complete',
  MAHAKAYA_COMPLETE: 'mahakaya_complete',
  SCENE_COMPLETE: 'scene_complete'
};

// Simple Error Boundary Component
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
          <button onClick={() => window.location.reload()}>Reload Scene</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const VakratundaGrove = ({
  onComplete,
  onNavigate,
  zoneId = 'shloka-river',
  sceneId = 'vakratunda-grove'
}) => {
  console.log('VakratundaGrove props:', { onComplete, onNavigate, zoneId, sceneId });

  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          // Simplified state - memory game handles its own logic
          phase: PHASES.INITIAL,
          
          // Learning progress (for progress tracking)
          learnedSyllables: {
            va: false, kra: false, tun: false, da: false,
            ma: false, ha: false, ka: false, ya: false
          },
          learnedWords: {
            vakratunda: false,
            mahakaya: false
          },
          
          // Memory game state (for reload support)
          memoryGameState: null,
          
          // Message flags
          welcomeShown: false,
          vakratundaWisdomShown: false,
          mahakayaWisdomShown: false,
          
          // System state
          currentPopup: null,
          showingCompletionScreen: false,
          gameCoachState: null,
          isReloadingGameCoach: false,
          
          // Progress
          stars: 0,
          completed: false,
          progress: { percentage: 0, starsEarned: 0, completed: false }
        }}
      >
        {({ sceneState, sceneActions, isReload }) => (
          <VakratundaGroveContent
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

const VakratundaGroveContent = ({
  sceneState,
  sceneActions,
  isReload,
  onComplete,
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('VakratundaGroveContent render', { sceneState, isReload, zoneId, sceneId });

  if (!sceneState?.phase) sceneActions.updateState({ phase: PHASES.INITIAL });

  // Access GameCoach functionality
  const { showMessage, hideCoach, clearManualCloseTracking } = useGameCoach();

  const [showSparkle, setShowSparkle] = useState(null);
  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  
  // Timeouts ref for cleanup
  const timeoutsRef = useRef([]);

  // Get profile name for messages
  const activeProfile = GameStateManager.getActiveProfile();
  const profileName = activeProfile?.name || 'little explorer';

  const [showRecording, setShowRecording] = useState(false);
  const [currentRecordingWord, setCurrentRecordingWord] = useState('');
  const [showAudioTracker, setShowAudioTracker] = useState(true);

  const progressiveHintRef = useRef(null);
    const [hintUsed, setHintUsed] = useState(false);
    const previousVisibilityRef = useRef(false);
  
  // Safe setTimeout function
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // Get element images
  const getLotusImage = (index) => {
    const images = [lotusVa, lotusKra, lotusTun, lotusDa];
    return images[index];
  };

  const getStoneImage = (index) => {
    const images = [stoneMa, stoneHa, stoneKa, stoneYa];
    return images[index];
  };

  const getBabyElephantImage = (index) => {
    const images = [elephantBabyVa, elephantBabyKra, elephantBabyTun, elephantBabyDa];
    return images[index];
  };

  const getAdultElephantImage = (index) => {
    const images = [elephantMa, elephantHa, elephantKa, elephantYa];
    return images[index];
  };

  // Handle memory game state saving for reload support
  const handleSaveMemoryGameState = (gameState) => {
    console.log('Saving memory game state:', gameState);
    sceneActions.updateState({ memoryGameState: gameState });
  };

  // Handle phase completion from memory game
  /*const handlePhaseComplete = (phase) => {
    console.log(`Phase ${phase} completed!`);
    
    if (phase === 'vakratunda') {
      // Update learning progress
      sceneActions.updateState({
        learnedWords: { ...sceneState.learnedWords, vakratunda: true },
        learnedSyllables: {
          ...sceneState.learnedSyllables,
          va: true, kra: true, tun: true, da: true
        },
        phase: PHASES.VAKRATUNDA_COMPLETE,
        progress: { ...sceneState.progress, percentage: 50, starsEarned: 3 }
      });
      
      setShowSparkle('vakratunda-complete');
      safeSetTimeout(() => setShowSparkle(null), 3000);
      
    } else if (phase === 'mahakaya') {
      // Complete scene
      sceneActions.updateState({
        learnedWords: { ...sceneState.learnedWords, mahakaya: true },
        learnedSyllables: {
          ...sceneState.learnedSyllables,
          ma: true, ha: true, ka: true, ya: true
        },
        phase: PHASES.SCENE_COMPLETE,
        stars: 5,
        completed: true,
        progress: { percentage: 100, starsEarned: 5, completed: true }
      });
      
      setShowSparkle('scene-complete');
      safeSetTimeout(() => {
        setShowSparkle('final-fireworks');
      }, 2000);
    }
  };*/

const handlePhaseComplete = (phase) => {
  console.log(`Phase ${phase} completed!`);
  
  // Update learning progress
  if (phase === 'vakratunda') {
    sceneActions.updateState({
      learnedWords: { ...sceneState.learnedWords, vakratunda: true },
      learnedSyllables: {
        ...sceneState.learnedSyllables,
        va: true, kra: true, tun: true, da: true
      },
      phase: PHASES.VAKRATUNDA_COMPLETE,
      progress: { ...sceneState.progress, percentage: 50, starsEarned: 3 }
    });
    
    setShowSparkle('vakratunda-complete');
    safeSetTimeout(() => setShowSparkle(null), 3000);
    
    // ADDED: Show recording after celebration
    safeSetTimeout(() => {
      setCurrentRecordingWord('vakratunda');
      setShowRecording(true);
    }, 4000);
    
  } else if (phase === 'mahakaya') {
// Complete mahakaya learning but DON'T trigger fireworks yet
sceneActions.updateState({
  learnedWords: { ...sceneState.learnedWords, mahakaya: true },
  learnedSyllables: {
    ...sceneState.learnedSyllables,
    ma: true, ha: true, ka: true, ya: true
  },
  phase: PHASES.MAHAKAYA_COMPLETE,  // Add this phase to your PHASES constant
  progress: { percentage: 90, starsEarned: 4 }
});

setShowSparkle('mahakaya-complete');
safeSetTimeout(() => setShowSparkle(null), 3000);

// Show recording after celebration
safeSetTimeout(() => {
  setCurrentRecordingWord('mahakaya');
  setShowRecording(true);
}, 4000);
  }
};

  // Handle complete game from memory game
  const handleGameComplete = () => {
    console.log('Memory game complete! Both words learned.');
    // The final phase completion will be handled by handlePhaseComplete
  };

const handleSyllablePlay = (syllable) => {
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
  
  const fileName = syllableFileMap[syllable] || syllable;
  const audio = new Audio(`/audio/syllables/${fileName}.mp3`);
  audio.play().catch(e => console.log('Audio not found'));
};

const handleWordPlay = (word) => {
  if (word === 'complete') {
    const audio = new Audio('/audio/words/vakratunda-mahakaya-complete.mp3');
    audio.play().catch(e => console.log('Complete shloka audio not found'));
  } else {
    const audio = new Audio(`/audio/words/${word}.mp3`);
    audio.play().catch(e => console.log('Word audio not found'));
  }
};

  const getHintConfigs = () => [
  {
    id: 'sequence-listening-hint',
    message: 'Listen carefully to the sacred sounds!',
    explicitMessage: 'Wait for the sequence to finish, then click the elephants in the same order!',
    position: { bottom: '60%', left: '50%', transform: 'translateX(-50%)' },
    condition: (sceneState) => {
      return sceneState?.gamePhase === 'playing' && !showRecording;
    }
  },
  {
    id: 'elephant-clicking-hint', 
    message: 'Click the elephants to repeat the sequence!',
    explicitMessage: 'Click the baby elephants in the order you heard: va-kra-tun-da!',
    position: { bottom: '60%', left: '50%', transform: 'translateX(-50%)' },
    condition: (sceneState) => {
      return sceneState?.gamePhase === 'listening' && !showRecording;
    }
  },
  {
    id: 'recording-hint',
    message: 'Try chanting the word you just learned!',
    explicitMessage: 'Listen to the syllables first, then record yourself saying the complete word!',
    position: { bottom: '30%', left: '50%', transform: 'translateX(-50%)' },
    condition: (sceneState) => {
      return showRecording === true;
    }
  }
];

  // Auto-start memory game after welcome
  useEffect(() => {
    if (sceneState?.phase === PHASES.INITIAL && sceneState?.welcomeShown) {
      console.log('Starting memory game');
      safeSetTimeout(() => {
        sceneActions.updateState({ phase: PHASES.MEMORY_GAME_ACTIVE });
      }, 1000);
    }
  }, [sceneState?.phase, sceneState?.welcomeShown]);

  // GameCoach messages with enhanced story
  useEffect(() => {
    if (!sceneState || !showMessage || sceneState.isReloadingGameCoach) return;
    
    if (sceneState.phase === PHASES.INITIAL && !sceneState.welcomeShown) {
      const timer = setTimeout(() => {
        showMessage(`Welcome to the Sacred Grove, ${profileName}! The baby elephants know ancient sounds that can awaken sleeping lotus flowers. Click an elephant to see their magical water spray!`, {
          duration: 8000,
          animation: 'bounce',
          position: 'top-right'
        });
        sceneActions.updateState({ welcomeShown: true });
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Phase completion messages
    if (sceneState.phase === PHASES.VAKRATUNDA_COMPLETE && !sceneState.vakratundaWisdomShown) {
      const timer = setTimeout(() => {
        showMessage(`Beautiful! The lotus flowers have learned the sacred word 'Vakratunda' and will remember it forever. Now the adult elephants want to teach their stone friends with their powerful water sprays!`, {
          duration: 6000,
          animation: 'slideInRight',
          position: 'top-right'
        });
        sceneActions.updateState({ vakratundaWisdomShown: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
    
  }, [sceneState?.phase, sceneState?.welcomeShown, sceneState?.vakratundaWisdomShown, showMessage]);

  // Render progress counter with bloom visualization
  const renderProgressCounter = () => {
    const totalSyllables = 8;
    const learnedCount = Object.values(sceneState?.learnedSyllables || {}).filter(Boolean).length;
    
    return (
      <div className="syllable-counter">
        <div className="counter-icon">🌸</div>
        <div className="counter-progress">
          <div
            className="counter-progress-fill"
            style={{
              width: `${(learnedCount / totalSyllables) * 100}%`,
              background: `linear-gradient(90deg, #4ECDC4 0%, #44A08D 50%, #FFD700 100%)`
            }}
          />
        </div>
        <div className="counter-display">{learnedCount}/{totalSyllables}</div>
        <div className="counter-label">Sacred Sounds</div>
      </div>
    );
  };

  // Handle recording completion
const handleRecordingComplete = (recordingData) => {
  console.log('Recording completed:', recordingData);
  setShowRecording(false);
  continueAfterRecording();
};

// Handle recording skip
const handleRecordingSkip = () => {
  console.log('User skipped recording');
  setShowRecording(false);
  continueAfterRecording();
};

// Continue game flow after recording
const continueAfterRecording = () => {
  if (currentRecordingWord === 'vakratunda') {
    // Start Mahakaya phase (existing logic)
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
    
  } else if (currentRecordingWord === 'mahakaya') {
    // FINAL COMPLETION - Trigger fireworks
    console.log('All words learned - starting final fireworks!');
    
    sceneActions.updateState({
      phase: PHASES.SCENE_COMPLETE,
      stars: 5,
      completed: true,
      progress: { percentage: 100, starsEarned: 5, completed: true }
    });
    
    setShowSparkle('final-fireworks');
  }
};

const getSyllableState = (syllable) => {
  const learned = sceneState.learnedSyllables?.[syllable.toLowerCase()];
  if (learned) return 'learned';
  
  const currentPhase = sceneState.learnedWords?.vakratunda ? 'mahakaya' : 'vakratunda';
  const phaseSyllables = currentPhase === 'vakratunda' 
    ? ['va', 'kra', 'tun', 'da'] 
    : ['ma', 'ha', 'ka', 'ya'];
  
  if (phaseSyllables.includes(syllable.toLowerCase())) return 'current';
  return 'locked';
};

  // Determine if memory game should be active
  const isMemoryGameActive = sceneState.phase === PHASES.MEMORY_GAME_ACTIVE || 
                           sceneState.phase === PHASES.VAKRATUNDA_COMPLETE;

  // Extract reload props for memory game
  const memoryGameReloadProps = sceneState.memoryGameState ? {
    isReload: isReload,
    initialGamePhase: sceneState.memoryGameState.gamePhase || 'waiting',
    initialCurrentPhase: sceneState.memoryGameState.currentPhase || 'vakratunda',
    initialCurrentRound: sceneState.memoryGameState.currentRound || 1,
    initialPlayerInput: sceneState.memoryGameState.playerInput || [],
    initialCurrentSequence: sceneState.memoryGameState.currentSequence || [],
    initialSequenceItemsShown: sceneState.memoryGameState.sequenceItemsShown || 0,
    phaseJustCompleted: sceneState.memoryGameState.phaseJustCompleted || false,
    lastCompletedPhase: sceneState.memoryGameState.lastCompletedPhase || null,
    initialPermanentlyBloomed: sceneState.memoryGameState.permanentlyBloomed || {}
  } : {};

  // Hide active hints
  const hideActiveHints = () => {
    if (progressiveHintRef.current && typeof progressiveHintRef.current.hideHint === 'function') {
      progressiveHintRef.current.hideHint();
    }
  };

  const handleHintShown = (level) => {
    console.log(`Cave hint level ${level} shown`);
    setHintUsed(true);
  };

  const handleHintButtonClick = () => {
    console.log("Cave hint button clicked");
  };

  if (!sceneState) {
    return <div className="loading">Loading scene state...</div>;
  }

  return (
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager messages={[]} sceneState={sceneState} sceneActions={sceneActions}>
        <div className="vakratunda-grove-container">
          <div className="river-background" style={{ backgroundImage: `url(${riverBackground})` }}>
{/* {renderProgressCounter()} */}

            {/* Sanskrit Memory Game Component with Water Spray Integration */}
            <SanskritMemoryGame
              isActive={isMemoryGameActive}
              onPhaseComplete={handlePhaseComplete}
              onGameComplete={handleGameComplete}
              profileName={profileName}
              
              // Asset getters
              getLotusImage={getLotusImage}
              getStoneImage={getStoneImage}
              getBabyElephantImage={getBabyElephantImage}
              getAdultElephantImage={getAdultElephantImage}
              
              // NEW: Pass WaterSprayArc component
              WaterSprayComponent={WaterSprayArc}
              
              // State saving for reload support
              onSaveGameState={handleSaveMemoryGameState}
              
              // Reload support props
              {...memoryGameReloadProps}
            />

            {/* Add this before the closing </div> of your main container */}
<SanskritVoiceRecorder
  show={showRecording}
  prompt="Try chanting"
  word={currentRecordingWord}
  title="Practice Your Sanskrit"
  theme="sanskrit"
  allowSkip={true}
  maxRecordingTime={10}
  onComplete={handleRecordingComplete}
  onSkip={handleRecordingSkip}
/>

{/*{showAudioTracker && (
  <AudioProgressTracker
    learnedSyllables={sceneState.learnedSyllables || {}}
    learnedWords={sceneState.learnedWords || {}}
    currentPhase={sceneState.learnedWords?.vakratunda ? 'mahakaya' : 'vakratunda'} // Derive from state
    onSyllablePlay={handleSyllablePlay}
    onWordPlay={handleWordPlay}
    mode="chanting"
  />
)}*/}

{/* Simple Bottom Syllable Bar 
<div className="syllable-progress-bar">
  {['VA', 'KRA', 'TUN', 'DA', 'MA', 'HA', 'KA', 'YA'].map(syllable => (
    <button 
      key={syllable}
      className={`syllable-btn ${getSyllableState(syllable)}`}
      onClick={() => handleSyllablePlay(syllable.toLowerCase())}
      disabled={getSyllableState(syllable) === 'locked'}
    >
      {syllable}
    </button>
  ))}
</div>

{/* Replace the existing syllable-progress-bar with this */}
<SanskritRiverProgress
  learnedWords={sceneState.learnedWords || {}}
  currentScene={1}
  onWordClick={(word, state) => {
    if (state === 'learned') {
      handleWordPlay(word.id);
    }
  }}
/>

       {/* Progressive Hints System */}
            <ProgressiveHintSystem
              ref={progressiveHintRef}
              sceneId={sceneId}
              sceneState={sceneState}
              hintConfigs={getHintConfigs()}
              characterImage={mooshikaCoach}
              initialDelay={20000}        
              hintDisplayTime={10000}    
              position="bottom-right"
              iconSize={60}
              zIndex={2000}
              onHintShown={handleHintShown}
              onHintButtonClick={handleHintButtonClick}
              enabled={true}
            />

            {/* Enhanced Sparkle Effects */}
            {showSparkle === 'vakratunda-complete' && (
              <SparkleAnimation
                type="glitter"
                count={40}
                color="#4ECDC4"
                size={18}
                duration={4000}
                fadeOut={true}
                area="full"
              />
            )}
            
            {showSparkle === 'scene-complete' && (
              <SparkleAnimation
                type="magic"
                count={60}
                color="gold"
                size={25}
                duration={3000}
                fadeOut={true}
                area="full"
              />
            )}
          </div>
          
   {/* Final Fireworks */}
{showSparkle === 'final-fireworks' && (
  <Fireworks
    show={true}
    duration={5000}
    count={25}
    colors={['#FFD700', '#FF1493', '#00CED1', '#98FB98', '#FF6347', '#9370DB', '#4ECDC4']}
    onComplete={() => {
      console.log('Sanskrit fireworks complete - saving and showing completion');
      
      // Stop all sparkle effects
      setShowSparkle(null);
      
      // Save completion data
      const profileId = localStorage.getItem('activeProfileId');
      if (profileId) {
        GameStateManager.saveGameState('shloka-river', 'vakratunda-grove', {
          completed: true,
          stars: 5,
          syllables: sceneState.learnedSyllables,
          words: sceneState.learnedWords,
          phase: 'complete',
          timestamp: Date.now()
        });
        
        localStorage.removeItem(`temp_session_${profileId}_shloka-river_vakratunda-grove`);
        SimpleSceneManager.clearCurrentScene();
      }
      
      // Show completion screen
      setShowSceneCompletion(true);
    }}
  />
)}
          
<SceneCompletionCelebration
  show={showSceneCompletion}
  sceneName="Vakratunda Grove"
  sceneNumber={1}
  totalScenes={5}
  starsEarned={5}
  totalStars={5}
  discoveredSymbols={Object.keys(sceneState.learnedSyllables || {}).filter(syl =>
    sceneState.learnedSyllables?.[syl]
  )}
  nextSceneName="Firefly Garden"
  sceneId="vakratunda-grove"
  completionData={{
    stars: 5,
    syllables: sceneState.learnedSyllables,
    words: sceneState.learnedWords,
    completed: true
  }}
  onComplete={onComplete}
  onReplay={() => {
    const profileId = localStorage.getItem('activeProfileId');
    if (profileId) {
      localStorage.removeItem(`temp_session_${profileId}_shloka-river_vakratunda-grove`);
      SimpleSceneManager.setCurrentScene('shloka-river', 'vakratunda-grove', false, false);
    }
    setTimeout(() => window.location.reload(), 100);
  }}
  onContinue={() => {
    if (clearManualCloseTracking) clearManualCloseTracking();
    if (hideCoach) hideCoach();
    
    const profileId = localStorage.getItem('activeProfileId');
    if (profileId) {
      ProgressManager.updateSceneCompletion(profileId, 'shloka-river', 'vakratunda-grove', {
        completed: true,
        stars: 5,
        syllables: sceneState.learnedSyllables,
        words: sceneState.learnedWords
      });
    }
    
    setTimeout(() => {
      SimpleSceneManager.setCurrentScene('shloka-river', 'firefly-garden', false, false);
      onNavigate?.('scene-complete-continue');
    }, 100);
  }}
/>
          
          {/* Navigation */}
          <TocaBocaNav
            onHome={() => {
              if (hideCoach) hideCoach();
              if (clearManualCloseTracking) clearManualCloseTracking();
              setTimeout(() => onNavigate?.('home'), 100);
            }}
            onProgress={() => {
              console.log(`Memory game progress, ${profileName}!`);
              if (hideCoach) hideCoach();
            }}
            onHelp={() => console.log('Show help')}
            onParentMenu={() => console.log('Parent menu')}
            isAudioOn={true}
            onAudioToggle={() => console.log('Toggle audio')}
            onZonesClick={() => {
              if (hideCoach) hideCoach();
              if (clearManualCloseTracking) clearManualCloseTracking();
              setTimeout(() => onNavigate?.('zones'), 100);
            }}
            currentProgress={{
              stars: sceneState.stars || 0,
              completed: sceneState.completed ? 1 : 0,
              total: 1
            }}
          />

          {/* Sanskrit Scene Test Buttons */}
<div style={{
  position: 'fixed',
  top: '40px',
  right: '60px',
  zIndex: 9999,
  background: 'green',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
}} onClick={() => {
  console.log('Sanskrit completion test clicked');
  
  // Set all syllables and words as learned
  sceneActions.updateState({
    // All syllables learned
    learnedSyllables: {
      va: true, kra: true, tun: true, da: true,
      ma: true, ha: true, ka: true, ya: true
    },
    
    // Both words learned
    learnedWords: {
      vakratunda: true,
      mahakaya: true
    },
    
    // Set to final phase
    phase: PHASES.SCENE_COMPLETE,
    
    // Completion data
    completed: true,
    stars: 5,
    progress: {
      percentage: 100,
      starsEarned: 5,
      completed: true
    },
    
    // Clear any active states
    currentPopup: null,
    gameCoachState: null,
    isReloadingGameCoach: false
  });
  
  // Clear all UI states
  setShowSparkle(null);
  setShowRecording(false);
  setShowSceneCompletion(false);
  
  // Trigger final fireworks
  setTimeout(() => {
    setShowSparkle('final-fireworks');
  }, 1000);
}}>
  COMPLETE SANSKRIT
</div>

{/* Emergency Reset Button */}
<div style={{
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 9999,
  background: '#FF4444',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(255, 68, 68, 0.3)',
  border: '2px solid white'
}} onClick={() => {
  if (confirm('Start this Sanskrit scene from the beginning? You will lose current progress.')) {
    console.log('Sanskrit emergency restart: User chose to start fresh');
    
    // Clear all UI states immediately
    setShowSparkle(null);
    setShowRecording(false);
    setShowSceneCompletion(false);
    setCurrentRecordingWord('');
    setShowAudioTracker(true);
    
    // Reset scene state
    setTimeout(() => {
      sceneActions.updateState({
        // Reset learning progress
        learnedSyllables: {},
        learnedWords: {},
        
        // Reset memory game state
        memoryGameState: null,
        
        // Reset phases
        phase: PHASES.INITIAL,
        
        // Clear all message flags
        welcomeShown: false,
        vakratundaWisdomShown: false,
        mahakayaWisdomShown: false,
        
        // Clear system state
        currentPopup: null,
        showingCompletionScreen: false,
        gameCoachState: null,
        isReloadingGameCoach: false,
        
        // Reset progress
        stars: 0,
        completed: false,
        progress: { percentage: 0, starsEarned: 0, completed: false }
      });
    }, 100);
    
    // Hide GameCoach if active
    if (hideCoach) hideCoach();
    if (clearManualCloseTracking) clearManualCloseTracking();
  }
}}>
  Start Fresh
</div>
        </div>
      </MessageManager>
    </InteractionManager>
  );
};

export default VakratundaGrove;