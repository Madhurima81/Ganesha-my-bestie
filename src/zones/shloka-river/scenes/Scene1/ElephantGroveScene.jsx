// zones/shloka-river/scenes/elephant-grove/ElephantGroveScene.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './ElephantGroveScene.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach } from '../../../../lib/components/coach/GameCoach';
import SimpleSceneManager from '../../../../lib/services/SimpleSceneManager';

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import SceneCompletionCelebration from '../../../../lib/components/celebration/SceneCompletionCelebration';

// Asset imports
import elephantGroveBg from './assets/images/elephant-grove-bg.png';
import elephantGroveBg1 from './assets/images/elephant-grove-bg1.png';

// Baby elephants
import elephantBabyVa from './assets/images/elephant-baby-va.png';
import elephantBabyKra from './assets/images/elephant-baby-kra.png';
import elephantBabyTun from './assets/images/elephant-baby-tun.png';
import elephantBabyDa from './assets/images/elephant-baby-da.png';

// Adult elephants
import elephantHa from './assets/images/elephant-ha.png';
import elephantKa from './assets/images/elephant-ka.png';
import elephantMa from './assets/images/elephant-ma.png';
import elephantYa from './assets/images/elephant-ya.png';

// Lotus flowers
import lotusVa from './assets/images/lotus-va.png';
import lotusKra from './assets/images/lotus-kra.png';
import lotusTun from './assets/images/lotus-tun.png';
import lotusDa from './assets/images/lotus-da.png';

// Stones
import stoneHa from './assets/images/stone-ha.png';
import stoneKa from './assets/images/stone-ka.png';
import stoneMa from './assets/images/stone-ma.png';
import stoneYa from './assets/images/stone-ya.png';

const SCENE_PHASES = {
  SCENE_1A: 'scene_1a', // Baby elephants - Vakratunda
  SCENE_1B: 'scene_1b', // Adult elephants - Mahakaya
  COMPLETE: 'complete'
};

const ELEPHANT_CONFIG = {
  scene1a: [
    { id: 'va', syllable: 'Va', elephant: elephantBabyVa, trigger: lotusVa, position: { top: '70%', left: '5%' } },
    { id: 'kra', syllable: 'Kra', elephant: elephantBabyKra, trigger: lotusKra, position: { top: '40%', left: '25%' } },
    { id: 'tun', syllable: 'Tun', elephant: elephantBabyTun, trigger: lotusTun, position: { top: '60%', left: '15%' } },
    { id: 'da', syllable: 'Da', elephant: elephantBabyDa, trigger: lotusDa, position: { top: '30%', left: '5%' } }
  ],
  scene1b: [
    { id: 'ma', syllable: 'Ma', elephant: elephantMa, trigger: stoneMa, position: { top: '25%', left: '85%' } },
    { id: 'ha', syllable: 'Ha', elephant: elephantHa, trigger: stoneHa, position: { top: '45%', left: '75%' } },
    { id: 'ka', syllable: 'Ka', elephant: elephantKa, trigger: stoneKa, position: { top: '65%', left: '85%' } },
    { id: 'ya', syllable: 'Ya', elephant: elephantYa, trigger: stoneYa, position: { top: '35%', left: '95%' } }
  ]
};

// Water spray animation component
const WaterSpray = ({ show, elephant, onComplete }) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="water-spray-container">
      <div className="water-spray">
        <div className="water-arc"></div>
        <div className="water-droplets">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`droplet droplet-${i + 1}`}></div>
          ))}
        </div>
        <div className="splash-effect"></div>
      </div>
    </div>
  );
};

// Audio system using Web Speech API
const playAudio = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
};

// Recording component
const SimpleRecording = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [lastRecording, setLastRecording] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setLastRecording(audioUrl);
        onRecordingComplete?.(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          stream.getTracks().forEach(track => track.stop());
        }
      }, 3000);

    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const playRecording = () => {
    if (lastRecording) {
      const audio = new Audio(lastRecording);
      audio.play();
    }
  };

  return (
    <div className="simple-recording">
      <button 
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={startRecording}
        disabled={isRecording}
      >
        {isRecording ? '🎙️ Recording...' : '🎤 Try saying it!'}
      </button>
      
      {lastRecording && (
        <button className="playback-button" onClick={playRecording}>
          🔊 Hear yourself
        </button>
      )}
    </div>
  );
};

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong in the Elephant Grove.</h2>
          <button onClick={() => window.location.reload()}>Reload Scene</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ElephantGroveScene = ({
  onComplete,
  onNavigate,
  zoneId = 'shloka-river',
  sceneId = 'elephant-grove'
}) => {
  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          // Scene progression
          phase: SCENE_PHASES.SCENE_1A,
          
          // Elephant interaction states
          scene1aComplete: false,
          scene1bComplete: false,
          activatedElephants: [],
          currentWaterSpray: null,
          
          // Audio and learning
          playedSyllables: [],
          recordings: [],
          
          // Progress tracking
          stars: 0,
          completed: false,
          progress: {
            percentage: 0,
            starsEarned: 0,
            completed: false
          },
          
          // UI states
          showingCompletionScreen: false,
          currentPopup: null,
          
          // GameCoach states
          gameCoachState: null,
          welcomeShown: false,
          scene1aIntroShown: false,
          scene1bIntroShown: false
        }}
      >
        {({ sceneState, sceneActions, isReload }) => (
          <ElephantGroveSceneContent
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

const ElephantGroveSceneContent = ({
  sceneState,
  sceneActions,
  isReload,
  onComplete,
  onNavigate,
  zoneId,
  sceneId
}) => {
  // GameCoach functionality
  const { showMessage, hideCoach, isVisible, clearManualCloseTracking } = useGameCoach();
  
  // Local state
  const [showSparkle, setShowSparkle] = useState(null);
  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  
  // Refs
  const timeoutsRef = useRef([]);
  const progressiveHintRef = useRef(null);
  
  // Get profile info
  const activeProfile = GameStateManager.getActiveProfile();
  const profileName = activeProfile?.name || 'little explorer';

  // Safe timeout function
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // GameCoach messages
  const elephantGameCoachMessages = [
    {
      id: 'elephant_welcome',
      message: `Welcome to the Elephant Grove, ${profileName}! Tap the flowers to meet the baby elephants!`,
      timing: 1000,
      condition: () => sceneState?.phase === SCENE_PHASES.SCENE_1A && !sceneState?.welcomeShown
    },
    {
      id: 'scene1a_intro',
      message: `Beautiful! Now try the stones with the grown-up elephants, ${profileName}!`,
      timing: 500,
      condition: () => sceneState?.phase === SCENE_PHASES.SCENE_1B && !sceneState?.scene1bIntroShown
    }
  ];

  // GameCoach triggering - FIXED DEPENDENCIES
  useEffect(() => {
    if (!sceneState || !showMessage) return;

    // Check individual conditions to avoid recreating functions
    const shouldShowWelcome = sceneState.phase === SCENE_PHASES.SCENE_1A && !sceneState.welcomeShown;
    const shouldShowScene1B = sceneState.phase === SCENE_PHASES.SCENE_1B && !sceneState.scene1bIntroShown;

    let matchingMessage = null;

    if (shouldShowWelcome) {
      matchingMessage = {
        id: 'elephant_welcome',
        message: `Welcome to the Elephant Grove, ${profileName}! Tap the flowers to meet the baby elephants!`,
        timing: 1000
      };
    } else if (shouldShowScene1B) {
      matchingMessage = {
        id: 'scene1a_intro',
        message: `Beautiful! Now try the stones with the grown-up elephants, ${profileName}!`,
        timing: 500
      };
    }

    if (matchingMessage) {
      const timer = setTimeout(() => {
        showMessage(matchingMessage.message, {
          duration: 4000,
          animation: 'bounce',
          position: 'top-right'
        });

        switch (matchingMessage.id) {
          case 'elephant_welcome':
            sceneActions.updateState({ welcomeShown: true });
            break;
          case 'scene1a_intro':
            sceneActions.updateState({ scene1bIntroShown: true });
            break;
        }
      }, matchingMessage.timing);

      return () => clearTimeout(timer);
    }
  }, [
    sceneState?.phase, 
    sceneState?.welcomeShown, 
    sceneState?.scene1bIntroShown, 
    showMessage,
    sceneActions
  ]);

  // Handle trigger tap - STABILIZED
  const handleTriggerTap = useCallback((elephantConfig) => {
    console.log(`Trigger tapped: ${elephantConfig.syllable}`);
    
    // Hide hints
    if (progressiveHintRef.current?.hideHint) {
      progressiveHintRef.current.hideHint();
    }

    // Play audio
    playAudio(elephantConfig.syllable);

    // Show water spray effect
    setShowSparkle(`water-spray-${elephantConfig.id}`);
    sceneActions.updateState({
      currentWaterSpray: elephantConfig.id
    });

    // Update activated elephants
    const newActivated = [...(sceneState.activatedElephants || []), elephantConfig.id];
    const newPlayedSyllables = [...(sceneState.playedSyllables || []), elephantConfig.syllable];
    
    sceneActions.updateState({
      activatedElephants: newActivated,
      playedSyllables: newPlayedSyllables
    });

    // Clear water spray effect
    safeSetTimeout(() => {
      setShowSparkle(null);
      sceneActions.updateState({ currentWaterSpray: null });
    }, 1500);

    // Check scene completion
    const currentConfig = sceneState.phase === SCENE_PHASES.SCENE_1A ? 
      ELEPHANT_CONFIG.scene1a : ELEPHANT_CONFIG.scene1b;
    
    if (newActivated.filter(id => 
      currentConfig.some(config => config.id === id)
    ).length >= currentConfig.length) {
      
      if (sceneState.phase === SCENE_PHASES.SCENE_1A) {
        // Complete Scene 1A, move to 1B
        safeSetTimeout(() => {
          sceneActions.updateState({
            scene1aComplete: true,
            phase: SCENE_PHASES.SCENE_1B,
            progress: { percentage: 50, starsEarned: 4, completed: false }
          });
        }, 2000);
      } else {
        // Complete Scene 1B, finish scene
        safeSetTimeout(() => {
          handleSceneComplete();
        }, 2000);
      }
    }
  }, [sceneState.activatedElephants, sceneState.playedSyllables, sceneState.phase, sceneActions]);

  // Handle scene completion
  const handleSceneComplete = () => {
    console.log('Elephant Grove scene completed!');
    
    sceneActions.updateState({
      scene1bComplete: true,
      completed: true,
      stars: 8,
      progress: { percentage: 100, starsEarned: 8, completed: true },
      currentPopup: 'final_fireworks'
    });

    setShowSparkle('final-fireworks');
  };

  // Progressive hints configuration - MEMOIZED
  const hintConfigs = useMemo(() => [
    {
      id: 'flower-tap-hint',
      message: 'Try tapping the lotus flowers to meet the baby elephants!',
      explicitMessage: 'Tap any lotus flower to hear the elephant say a Sanskrit sound!',
      position: { bottom: '70%', left: '20%' },
      condition: (sceneState) => {
        return sceneState?.phase === SCENE_PHASES.SCENE_1A && 
               (sceneState?.activatedElephants?.length || 0) === 0;
      }
    },
    {
      id: 'stone-tap-hint',
      message: 'Now try tapping the stones with the grown-up elephants!',
      explicitMessage: 'Tap the stones to hear the big elephants say their Sanskrit sounds!',
      position: { bottom: '70%', right: '20%' },
      condition: (sceneState) => {
        return sceneState?.phase === SCENE_PHASES.SCENE_1B && 
               (sceneState?.activatedElephants?.filter(id => 
                 ELEPHANT_CONFIG.scene1b.some(config => config.id === id)
               ).length || 0) === 0;
      }
    }
  ], []);

  // Reload handling
  useEffect(() => {
    if (!isReload || !sceneState) return;

    console.log('Elephant Grove reload detected');

    if (sceneState.currentPopup === 'final_fireworks') {
      setShowSparkle('final-fireworks');
      return;
    }

    if (sceneState.showingCompletionScreen) {
      setShowSceneCompletion(true);
      return;
    }
  }, [isReload]);

  const getCurrentBackground = () => {
    return sceneState.phase === SCENE_PHASES.SCENE_1A ? elephantGroveBg : elephantGroveBg1;
  };

  const getCurrentElephants = () => {
    return sceneState.phase === SCENE_PHASES.SCENE_1A ? 
      ELEPHANT_CONFIG.scene1a : ELEPHANT_CONFIG.scene1b;
  };

  if (!sceneState) {
    return <div className="loading">Loading Elephant Grove...</div>;
  }

  return (
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager messages={[]} sceneState={sceneState} sceneActions={sceneActions}>
        <div className="elephant-grove-container" data-phase={sceneState.phase}>
          
          {/* Background */}
          <div 
            className="grove-background"
            style={{
              backgroundImage: `url(${getCurrentBackground()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100vh',
              position: 'relative'
            }}
          >

            {/* Scene indicator */}
            <div className="scene-indicator">
              {sceneState.phase === SCENE_PHASES.SCENE_1A ? 'Vakratunda' : 'Mahakaya'}
            </div>

            {/* Progress counter */}
            <div className="progress-counter">
              {sceneState.activatedElephants?.length || 0} / 8 elephants
            </div>



            {/* Render current elephants */}
{ELEPHANT_CONFIG.scene1a?.map((elephantConfig) => {
      console.log('Rendering elephant:', elephantConfig.id);
        console.log('Image src:', elephantConfig.elephant); // Add this line


                  const isActivated = sceneState.activatedElephants?.includes(elephantConfig.id);
              const hasWaterSpray = sceneState.currentWaterSpray === elephantConfig.id;

              return (
                <div key={elephantConfig.id} className="elephant-container">
                  
                  {/* Elephant */}
                  <div 
                    className={`elephant elephant-${elephantConfig.id} ${isActivated ? 'activated' : ''}`}
                    style={{
                      position: 'absolute',
                      ...elephantConfig.position,
                      //transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <img 
                      src={elephantConfig.elephant}
                      alt={`Elephant ${elephantConfig.syllable}`}
                      className="elephant-image"
                    />
                    
                    {/* Water spray effect */}
                    {hasWaterSpray && (
                      <WaterSpray 
                        show={true} 
                        elephant={elephantConfig.id}
                        onComplete={() => {
                          setShowSparkle(null);
                          sceneActions.updateState({ currentWaterSpray: null });
                        }}
                      />
                    )}
                  </div>

                  {/* Trigger (flower or stone) */}
                  <div 
                    className={`trigger trigger-${elephantConfig.id} ${isActivated ? 'used' : ''}`}
                 style={{
    position: 'absolute',
    top: `calc(${elephantConfig.position.top} + 60px)`,  // Position below elephant
    left: elephantConfig.position.left,
    cursor: isActivated ? 'default' : 'pointer'
  }}
                    onClick={() => !isActivated && handleTriggerTap(elephantConfig)}
                  >
                    <img 
                      src={elephantConfig.trigger}
                      alt={`Trigger for ${elephantConfig.syllable}`}
                      className="trigger-image"
                    />
                  </div>

                </div>
              );
            })}

            {/* Recording component */}
            <div className="recording-area">
              <SimpleRecording 
                onRecordingComplete={(audioUrl) => {
                  const newRecordings = [...(sceneState.recordings || []), audioUrl];
                  sceneActions.updateState({ recordings: newRecordings });
                }}
              />
            </div>

            {/* Sparkle effects */}
            {showSparkle && showSparkle.startsWith('water-spray-') && (
              <div className="water-spray-sparkles">
                <SparkleAnimation
                  type="sparkle"
                  count={15}
                  color="#4A90E2"
                  size={8}
                  duration={1500}
                  fadeOut={true}
                />
              </div>
            )}

            {/* Final fireworks */}
            {showSparkle === 'final-fireworks' && (
              <Fireworks
                show={true}
                duration={6000}
                count={20}
                colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']}
                onComplete={() => {
                  setShowSparkle(null);
                  setShowSceneCompletion(true);
                }}
              />
            )}

            {/* Progressive Hints - DISABLED TEMPORARILY TO FIX INFINITE LOOP */}
            {false && (
              <ProgressiveHintSystem
                ref={progressiveHintRef}
                sceneId={sceneId}
                sceneState={sceneState}
                hintConfigs={hintConfigs}
                initialDelay={15000}
                hintDisplayTime={8000}
                position="bottom-center"
                onHintShown={setHintUsed}
                enabled={true}
              />
            )}

            {/* Navigation */}
            <TocaBocaNav
              onHome={() => {
                if (hideCoach) hideCoach();
                if (clearManualCloseTracking) clearManualCloseTracking();
                setTimeout(() => onNavigate?.('home'), 100);
              }}
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

          </div>

          {/* Scene Completion - TEMPORARILY DISABLED TO FIX INFINITE LOOP */}
          {false && (
            <SceneCompletionCelebration
              show={showSceneCompletion}
              sceneName="Elephant Grove - Vakratunda Mahakaya"
              sceneNumber={1}
              totalScenes={5}
              starsEarned={sceneState.progress?.starsEarned || 8}
              totalStars={8}
              nextSceneName="Firefly Garden"
              sceneId="elephant-grove"
              completionData={{
                stars: 8,
                syllablesLearned: sceneState.playedSyllables || [],
                recordings: sceneState.recordings || [],
                completed: true
              }}
              onComplete={onComplete}
              onReplay={() => {
                const profileId = localStorage.getItem('activeProfileId');
                if (profileId) {
                  localStorage.removeItem(`temp_session_${profileId}_shloka-river_elephant-grove`);
                  SimpleSceneManager.clearCurrentScene();
                }
                setTimeout(() => window.location.reload(), 100);
              }}
              onContinue={() => {
                if (clearManualCloseTracking) clearManualCloseTracking();
                if (hideCoach) hideCoach();
                setTimeout(() => onNavigate?.('next-scene'), 100);
              }}
            />
          )}

          {/* TEMPORARY SIMPLE COMPLETION MESSAGE */}
          {showSceneCompletion && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              zIndex: 10000,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h2>🎉 Elephant Grove Complete! 🐘</h2>
              <p>You learned: {sceneState.playedSyllables?.join(', ') || 'Va Kra Tun Da Ma Ha Ka Ya'}</p>
              <p>Stars Earned: {sceneState.stars || 8} ⭐</p>
              <button 
                onClick={() => {
                  console.log('🔄 Manual reload requested');
                  setTimeout(() => window.location.reload(), 100);
                }}
                style={{
                  background: '#4ECDC4',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  margin: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔄 Play Again
              </button>
              <button 
                onClick={() => {
                  console.log('➡️ Continue to next scene');
                  onNavigate?.('next-scene');
                }}
                style={{
                  background: '#9B59B6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  margin: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ➡️ Continue
              </button>
            </div>
          )}

        </div>
      </MessageManager>
    </InteractionManager>
  );
};

export default ElephantGroveScene;