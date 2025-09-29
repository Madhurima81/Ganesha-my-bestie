// zones/shloka-river/scenes/Scene2/SuryakotiBank.jsx - Scene 2 with Sun/Rainbow mechanics
import React, { useState, useEffect, useRef } from 'react';
import './SuryakotiBank.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach } from '../../../../lib/components/coach/GameCoach';
import ProgressManager from '../../../../lib/services/ProgressManager';
import SimpleSceneManager from '../../../../lib/services/SimpleSceneManager';
//import mooshikaCoach from "./assets/images/mooshika-coach.png";

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import SceneCompletionCelebration from '../../../../lib/components/celebration/SceneCompletionCelebration';

// NEW: Import sun/rainbow game components
import SuryakotiMemoryGame from './components/SuryakotiMemoryGame';
import SamaprabhaRainbowGame from './components/SamaprabhaRainbowGame';
import SunRayArc from './components/SunRayArc';
import SanskritVoiceRecorder from '../../../../lib/components/audio/SanskritVoiceRecorder';
import SmartwatchWidget from '../Scene1/components/SmartwatchWidget';
import HelperSignatureAnimation from '../../../../lib/components/animation/HelperSignatureAnimation';

import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import SaveAnimalMission from '../../../../lib/components/missions/SaveAnimalMission';

// Images - Suryakoti scene assets
import suryakotiBankBg from './assets/images/Scene2-bg.png';
import sunflowerClose from './assets/images/Suryakoti/sunflower-close.png';
import sunflowerOpen from './assets/images/Suryakoti/sunflower-open.png';
import daisyClose from './assets/images/Suryakoti/daisy-close.png';
import daisyOpen from './assets/images/Suryakoti/daisy-open.png';
import roseClose from './assets/images/Suryakoti/rose-close.png';
import roseOpen from './assets/images/Suryakoti/rose-open.png';
import tulipClose from './assets/images/Suryakoti/tulip-close.png';
import tulipOpen from './assets/images/Suryakoti/tulip-open.png';

import rainbowRed from './assets/images/Samaprabha/rainbow-red.png';
import rainbowBlue from './assets/images/Samaprabha/rainbow-blue.png';
import rainbowGreen from './assets/images/Samaprabha/rainbow-green.png';
import rainbowPurple from './assets/images/Samaprabha/rainbow-purple.png';

import bunnySad from './assets/images/Samaprabha/bunny-sad.png';
import bunnyHappy from './assets/images/Samaprabha/bunny-happy.png';
import kittenSad from './assets/images/Samaprabha/kitten-sad.png';
import kittenHappy from './assets/images/Samaprabha/kitten-happy.png';
import puppySad from './assets/images/Samaprabha/puppy-sad.png';
import puppyHappy from './assets/images/Samaprabha/puppy-happy.png';
import squirrelSad from './assets/images/Samaprabha/squirrel-sad.png';
import squirrelHappy from './assets/images/Samaprabha/squirrel-happy.png';

import mangoBubble from './assets/images/Samaprabha/mango-bubble.png';
import mangoPlate from './assets/images/Samaprabha/mango-plate.png';

import ganeshaWithHeadphones from '../assets/images/ganesha_with_headphones.png';
import smartwatchBase from '../assets/images/smartwatch-base.png';
import smartwatchScreen from '../assets/images/smartwatch-screen.png';
import appSuryakoti from '../assets/images/apps/app-suryakoti.png';
import appSamaprabha from '../assets/images/apps/app-samaprabha.png';
import boyNamaste from '../assets/images/boy-namaste.png';

// Rescue mission images
import suryakotiBefore from './assets/images/Suryakoti/suryakoti-before.png';
import suryakotiAfter from './assets/images/Suryakoti/suryakoti-after.png';
import samaprabhaBefore from './assets/images/Samaprabha/samaprabha-before.png'; 
import samaprabhaAfter from './assets/images/Samaprabha/samaprabha-after.png';

// Updated PHASES constant for Scene 2
const PHASES = {
  INITIAL: 'initial',
  SURYAKOTI_GAME_ACTIVE: 'suryakoti_game_active',
  SURYAKOTI_COMPLETE: 'suryakoti_complete',
  GANESHA_BLESSING_SURYAKOTI: 'ganesha_blessing_suryakoti',
  CHOICE_BUTTONS_SURYAKOTI: 'choice_buttons_suryakoti',
  RESCUE_MISSION_SURYAKOTI: 'rescue_mission_suryakoti',
  SAMAPRABHA_STORY: 'samaprabha_story',
  SAMAPRABHA_GAME_ACTIVE: 'samaprabha_game_active',
  SAMAPRABHA_COMPLETE: 'samaprabha_complete',
  GANESHA_BLESSING_SAMAPRABHA: 'ganesha_blessing_samaprabha',
  CHOICE_BUTTONS_SAMAPRABHA: 'choice_buttons_samaprabha',
  RESCUE_MISSION_SAMAPRABHA: 'rescue_mission_samaprabha',
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

const SuryakotiBank = ({
  onComplete,
  onNavigate,
  zoneId = 'shloka-river',
  sceneId = 'suryakoti-bank'
}) => {
  console.log('SuryakotiBank props:', { onComplete, onNavigate, zoneId, sceneId });

  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          // Simplified state - memory games handle their own logic
          phase: PHASES.INITIAL,
          
          // Learning progress (for progress tracking)
          learnedSyllables: {
            sur: false, ya: false, ko: false, ti: false,
            sa: false, ma: false, pra: false, bha: false
          },
          learnedWords: {
            suryakoti: false,
            samaprabha: false
          },
          
          // UNIFIED: Combined state for both games
          suryakotiGameState: null,
          samaprabhaGameState: null,
          missionState: {
            rescuePhase: 'problem',
            showParticles: false,
            word: null,
            missionJustCompleted: false
          },
          
          // Message flags
          welcomeShown: false,
          suryakotiWisdomShown: false,
          samaprabhaWisdomShown: false,
          
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
          <SuryakotiBankContent
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

const SuryakotiBankContent = ({
  sceneState,
  sceneActions,
  isReload,
  onComplete,
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('🌞 SuryakotiBankContent render', { 
    sceneState: sceneState?.phase, 
    isReload, 
    suryakotiGameState: !!sceneState?.suryakotiGameState,
    samaprabhaGameState: !!sceneState?.samaprabhaGameState,
    missionState: sceneState?.missionState 
  });

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

  const [showGaneshaBlessing, setShowGaneshaBlessing] = useState(false);
  const [showAudioPractice, setShowAudioPractice] = useState(false);
  const [currentPracticeWord, setCurrentPracticeWord] = useState('');
  const [showChoiceButtons, setShowChoiceButtons] = useState(false);
  const [unlockedApps, setUnlockedApps] = useState([]);
  
  const [blessingPhase, setBlessingPhase] = useState('welcome');
  const [showParticles, setShowParticles] = useState(false);
  const [showPulseRings, setShowPulseRings] = useState(false);

  const [suryakotiPowerGained, setSuryakotiPowerGained] = useState(false);
  const [showCenteredApp, setShowCenteredApp] = useState(null);
  const [blessingWord, setBlessingWord] = useState('');

  // UNIFIED: Single state for rescue mission
  const [showRescueMission, setShowRescueMission] = useState(false);
  const [currentRescueWord, setCurrentRescueWord] = useState('');
  const [showWordCelebration, setShowWordCelebration] = useState(false);

  const [showSamaprabhaStory, setShowSamaprabhaStory] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Add power configuration for Scene 2
  const powerConfig = {
    suryakoti: { name: 'Solar Clarity', icon: '☀️', color: '#FFA500' },
    samaprabha: { name: 'Radiant Light', icon: '🌟', color: '#FFD700' }
  };

  // Safe setTimeout function
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const playAudio = (audioPath, volume = 1.0) => {
    if (!isAudioOn) return Promise.resolve();
    
    try {
      const audio = new Audio(audioPath);
      audio.volume = volume;
      return audio.play().catch(e => {
        console.log(`Audio not found: ${audioPath}`);
        return Promise.resolve();
      });
    } catch (error) {
      console.log(`Audio error: ${error.message}`);
      return Promise.resolve();
    }
  };

  const toggleAudio = () => {
    const newAudioState = !isAudioOn;
    setIsAudioOn(newAudioState);
    localStorage.setItem('sanskritGameAudio', newAudioState.toString());
    
    if (!newAudioState) {
      document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    
    console.log(`Audio ${newAudioState ? 'enabled' : 'muted'}`);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // Load audio preference on component mount
  useEffect(() => {
    const savedAudioPreference = localStorage.getItem('sanskritGameAudio');
    if (savedAudioPreference !== null) {
      setIsAudioOn(savedAudioPreference === 'true');
    }
  }, []);

  // UNIFIED: Single state saving function for both games
  const handleSaveComponentState = (componentType, componentState) => {
    console.log(`💾 Saving ${componentType} state:`, componentState);
    
    const updatedState = {
      ...(componentType === 'suryakotiGame' && { suryakotiGameState: componentState }),
      ...(componentType === 'samaprabhaGame' && { samaprabhaGameState: componentState }),
      ...(componentType === 'mission' && { 
        missionState: {
          ...sceneState.missionState,
          ...componentState
        }
      })
    };
    
    console.log(`⏬ Updating scene state with ${componentType}:`, updatedState);
    sceneActions.updateState(updatedState);
  };

  // Get flower images
  const getFlowerCloseImage = (index) => {
    const images = [sunflowerClose, daisyClose, roseClose, tulipClose];
    return images[index];
  };

  const getFlowerOpenImage = (index) => {
    const images = [sunflowerOpen, daisyOpen, roseOpen, tulipOpen];
    return images[index];
  };

  // Get rainbow images
  const getRainbowImage = (index) => {
    const images = [rainbowRed, rainbowBlue, rainbowGreen, rainbowPurple];
    return images[index];
  };

  // Get animal images
  const getAnimalSadImage = (index) => {
    const images = [bunnySad, kittenSad, puppySad, squirrelSad];
    return images[index];
  };

  const getAnimalHappyImage = (index) => {
    const images = [bunnyHappy, kittenHappy, puppyHappy, squirrelHappy];
    return images[index];
  };

  // Handle phase completion
  const handlePhaseComplete = (phase) => {
    console.log(`Phase ${phase} completed!`);
    
    if (phase === 'suryakoti') {
      sceneActions.updateState({
        learnedWords: { ...sceneState.learnedWords, suryakoti: true },
        learnedSyllables: {
          ...sceneState.learnedSyllables,
          sur: true, ya: true, ko: true, ti: true
        },
        phase: PHASES.SURYAKOTI_COMPLETE,
        progress: { ...sceneState.progress, percentage: 50, starsEarned: 3 }
      });
      
      setBlessingWord('suryakoti');
      setCurrentPracticeWord('suryakoti');
      setShowSparkle('suryakoti-complete');
      setShowWordCelebration(true);
      
      safeSetTimeout(() => {
        setShowSparkle(null);
        setShowWordCelebration(false);
        sceneActions.updateState({
          phase: PHASES.GANESHA_BLESSING_SURYAKOTI
        });
        setBlessingPhase('welcome');
        setShowGaneshaBlessing(true);
      }, 4000);
      
    } else if (phase === 'samaprabha') {
      sceneActions.updateState({
        learnedWords: { ...sceneState.learnedWords, samaprabha: true },
        learnedSyllables: {
          ...sceneState.learnedSyllables,
          sa: true, ma: true, pra: true, bha: true
        },
        phase: PHASES.SAMAPRABHA_COMPLETE,
        progress: { percentage: 90, starsEarned: 4 }
      });

      setSuryakotiPowerGained(false);
      
      setBlessingWord('samaprabha');
      setCurrentPracticeWord('samaprabha');
      setShowSparkle('samaprabha-complete');
      setShowWordCelebration(true);
      
      safeSetTimeout(() => {
        setShowSparkle(null);
        setShowWordCelebration(false);
        sceneActions.updateState({
          phase: PHASES.GANESHA_BLESSING_SAMAPRABHA
        });
        setBlessingPhase('welcome');
        setShowGaneshaBlessing(true);
      }, 4000);
    }
  };

  // Continue learning handler
  const handleContinueLearning = () => {
    console.log('Continue Learning clicked for:', currentPracticeWord);
    
    setShowChoiceButtons(false);
    
    if (currentPracticeWord === 'suryakoti') {
      console.log('Suryakoti continue - showing Samaprabha story first');

      setIsTransitioning(true);
      
      sceneActions.updateState({
        phase: PHASES.SAMAPRABHA_STORY,
        suryakotiGameState: null
      });
      
      setSuryakotiPowerGained(true);
      setShowGaneshaBlessing(false);
      setShowSparkle(null);           
      setShowWordCelebration(false);  
      
      setTimeout(() => {
        setIsTransitioning(false);
        setShowSamaprabhaStory(true);
      }, 100);
    } else if (currentPracticeWord === 'samaprabha') {
      console.log('Samaprabha continue - ending scene');
      sceneActions.updateState({
        phase: PHASES.SCENE_COMPLETE,
        stars: 5,
        completed: true,
        progress: { percentage: 100, starsEarned: 5, completed: true }
      });
      
      setTimeout(() => {
        setShowSparkle('final-fireworks');
      }, 500);
    }
  };

  const handleSaveAnimal = () => {
    console.log('🐱 RESCUE MISSION: Starting animal rescue');
    
    setShowChoiceButtons(false);
    setCurrentRescueWord(currentPracticeWord || blessingWord);
    
    const word = currentPracticeWord || blessingWord;
    sceneActions.updateState({
      phase: word === 'suryakoti' 
        ? PHASES.RESCUE_MISSION_SURYAKOTI 
        : PHASES.RESCUE_MISSION_SAMAPRABHA
    });
    
    handleSaveComponentState('mission', {
      rescuePhase: 'problem',
      word: word,
      showParticles: false
    });
    
    setShowRescueMission(true);
  };

  const handleRescueComplete = () => {
    console.log('✅ Rescue complete for:', currentRescueWord);
    
    handleSaveComponentState('mission', {
      rescuePhase: 'success',
      word: currentRescueWord,
      missionJustCompleted: true
    });
    
    setShowRescueMission(false);
    
    if (currentRescueWord === 'suryakoti') {
      console.log('Suryakoti rescue complete - showing Samaprabha story first');
      
      setShowChoiceButtons(false);
      setShowGaneshaBlessing(false);
      setSuryakotiPowerGained(true);
      
      sceneActions.updateState({
        phase: PHASES.SAMAPRABHA_STORY
      });
      
      setTimeout(() => {
        setShowSamaprabhaStory(true);
      }, 500);
      
    } else if (currentRescueWord === 'samaprabha') {
      console.log('Samaprabha rescue complete - FINAL FIREWORKS NOW!');
      
      setShowRescueMission(false);
      setShowChoiceButtons(false);
      setShowGaneshaBlessing(false);
      
      sceneActions.updateState({
        phase: PHASES.SCENE_COMPLETE,
        stars: 5,
        completed: true,
        progress: { percentage: 100, starsEarned: 5, completed: true }
      });
      
      setTimeout(() => {
        setShowSparkle('final-fireworks');
      }, 500);
    }
  };

  return (
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager messages={[]} sceneState={sceneState} sceneActions={sceneActions}>
        <div className="suryakoti-bank-container">
          <div className="river-background" style={{ backgroundImage: `url(${suryakotiBankBg})` }}>

            {/* Story Introduction - Show immediately when scene starts */}
            {sceneState.phase === PHASES.INITIAL && !sceneState.welcomeShown && (
              <div style={{
                position: 'absolute',
                top: '35%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '25px 35px',
                borderRadius: '20px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                zIndex: 100,
                maxWidth: '400px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#FF8C00',
                  marginBottom: '10px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  The Solar Garden
                </div>
                
                <div style={{
                  fontSize: '15px',
                  color: '#1565C0',
                  marginBottom: '8px'
                }}>
                  Help the sun orbs bloom the sleeping flowers
                </div>
                
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '20px',
                  fontStyle: 'italic'
                }}>
                  Click sun orbs to send golden rays and awaken flowers
                </div>
                
                <button
                  onClick={() => {
                    sceneActions.updateState({ 
                      welcomeShown: true,
                      phase: PHASES.SURYAKOTI_GAME_ACTIVE 
                    });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)'
                  }}
                >
                  Begin Solar Adventure
                </button>
              </div>
            )}

            {/* Suryakoti Memory Game */}
            <SuryakotiMemoryGame
              // Add these props:
  getSunflowerImage={getSunflowerImage}
  getDaisyImage={getDaisyImage} 
  getRoseImage={getRoseImage}
  getTulipImage={getTulipImage}
              isActive={sceneState.phase === PHASES.SURYAKOTI_GAME_ACTIVE || 
                       sceneState.phase === PHASES.SURYAKOTI_COMPLETE}
              hideElements={isTransitioning || 
                showGaneshaBlessing || showSamaprabhaStory || 
                sceneState.phase === PHASES.SURYAKOTI_COMPLETE || 
                sceneState.phase === PHASES.SCENE_COMPLETE}
              powerGained={suryakotiPowerGained}
              onPhaseComplete={handlePhaseComplete}
              profileName={profileName}
              
              // Asset getters
              getFlowerCloseImage={getFlowerCloseImage}
              getFlowerOpenImage={getFlowerOpenImage}
              
              isAudioOn={isAudioOn}
              playAudio={playAudio}
              
              // Pass SunRayArc component
              SunRayComponent={SunRayArc}
              
              // State saving for reload support
              onSaveGameState={(gameState) => handleSaveComponentState('suryakotiGame', gameState)}
              onCleanup={() => console.log('Suryakoti game cleaned up')}
              
              // Reload support props (similar pattern to Scene 1)
              isReload={isReload}
              initialGameState={sceneState.suryakotiGameState}
            />

            {/* Samaprabha Rainbow Game */}
            <SamaprabhaRainbowGame
              isActive={sceneState.phase === PHASES.SAMAPRABHA_GAME_ACTIVE || 
                       sceneState.phase === PHASES.SAMAPRABHA_COMPLETE}
              hideElements={isTransitioning || 
                showGaneshaBlessing || 
                sceneState.phase === PHASES.SAMAPRABHA_COMPLETE || 
                sceneState.phase === PHASES.SCENE_COMPLETE}
              suryakotiPowerGained={suryakotiPowerGained}
              onPhaseComplete={handlePhaseComplete}
              profileName={profileName}
              
              // Asset getters
              getRainbowImage={getRainbowImage}
              getAnimalSadImage={getAnimalSadImage}
              getAnimalHappyImage={getAnimalHappyImage}
              fruitBubbleImage={mangoBubble}
              fruitPlateImage={mangoPlate}
              
              isAudioOn={isAudioOn}
              playAudio={playAudio}
              
              // State saving for reload support
              onSaveGameState={(gameState) => handleSaveComponentState('samaprabhaGame', gameState)}
              onCleanup={() => console.log('Samaprabha game cleaned up')}
              
              // Reload support props
              isReload={isReload}
              initialGameState={sceneState.samaprabhaGameState}
            />

            {/* Rest of the component remains largely the same as Scene 1, with updated references */}
            {/* ... (Ganesha blessing, recording, choice buttons, etc. - same structure, different words) */}
            
          </div>
        </div>
      </MessageManager>
    </InteractionManager>
  );
};

export default SuryakotiBank;
