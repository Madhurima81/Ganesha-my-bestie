// zones/symbol-mountain/scenes/modak/ModakScene.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ModakScene.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import { ClickableElement } from "../../../../lib/components/scenes/InteractionManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach, TriggerCoach } from '../../../../lib/components/coach/GameCoach';

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import SymbolSceneIntegration from '../../../../lib/components/animation/SymbolSceneIntegration';
import MagicalCardFlip from '../../../../lib/components/animation/MagicalCardFlip';
import SymbolSidebar from '../../shared/components/SymbolSidebar';
import SceneCompletionCelebration from '../../../../lib/components/celebration/SceneCompletionCelebration';

// Images
import forestBackground from './assets/images/forest-background.png';
import modak from './assets/images/modak.png';
import basket from './assets/images/basket.png';
import mooshika from './assets/images/mooshika.png';
import mudMound from './assets/images/mud-mound.png';
import rock from './assets/images/rock.png';
import belly from './assets/images/belly.png';
import popupModak from './assets/images/popup-modak-info.png';
import popupMooshika from './assets/images/popup-mooshika-info.png';
import popupBelly from './assets/images/popup-belly-info.png';
import mooshikaCoach from "./assets/images/mooshika-coach.png";

const PHASES = {
  INITIAL: 'initial',
  SOME_COLLECTED: 'some_collected',
  ALL_COLLECTED: 'all_collected',
  BASKET_READY: 'basket_ready',
  MOOSHIKA_SEARCH: 'mooshika_search',
  MOOSHIKA_FOUND: 'mooshika_found',
  ROCK_VISIBLE: 'rock_visible',
  ROCK_FEEDING: 'rock_feeding',
  ROCK_TRANSFORMED: 'rock_transformed',
  COMPLETE: 'complete'
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

const ModakScene = ({ 
  onComplete, 
  onNavigate, 
  zoneId = 'symbol-mountain', 
  sceneId = 'modak' 
}) => {
  console.log('ModakScene props:', { onComplete, onNavigate, zoneId, sceneId });

  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          modakStates: [0, 0, 0, 0, 0],  // 5 modaks
          basketReady: false,
          basketFull: false,
          modaksUnlocked: false,      // ✅ ADD this line
          mooshikaVisible: false,
          mooshikaFound: false,
          rockVisible: false,
          rockGlowLevel: 0,
          rockTransformed: false,
          rockFeedCount: 0,
          correctMound: Math.floor(Math.random() * 5) + 1, // Random mound 1-5
          moundStates: [0, 0, 0, 0, 0], // Track which mounds clicked
          celebrationStars: 0,
          phase: 'mooshika_search',   // ✅ New
currentFocus: 'mooshika',   // ✅ New
          discoveredSymbols: {},
          
          // Message flags to prevent duplicates
          welcomeShown: false,
          modakWisdomShown: false,
          mooshikaWisdomShown: false,
          bellyWisdomShown: false,
          masteryShown: false,
          readyForWisdom: false,
          
          // KEEP RELOAD SYSTEM IDENTICAL
          currentPopup: null,  // 'modak_info', 'modak_card', 'mooshika_info', 'mooshika_card', 'belly_info', 'belly_card', 'final_fireworks'
          
          // Symbol discovery state tracking
          symbolDiscoveryState: null,  // 'modak_discovering', 'mooshika_discovering', 'belly_discovering'
          sidebarHighlightState: null,  // 'modak_highlighting', 'mooshika_highlighting', 'belly_highlighting'
          
          // GameCoach reload tracking
          gameCoachState: null,  // 'modak_wisdom', 'mooshika_wisdom', 'belly_wisdom', 'mastery_wisdom'
          isReloadingGameCoach: false,
          lastGameCoachTime: 0,
          
          // Progress tracking for GameWelcomeScreen
          stars: 0,           
          completed: false,   
          progress: {
            percentage: 0,
            starsEarned: 0,
            completed: false
          }
        }}
      >
        {({ sceneState, sceneActions, isReload }) => (
          <ModakSceneContent 
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

const ModakSceneContent = ({ 
  sceneState, 
  sceneActions, 
  isReload, 
  onComplete, 
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('ModakSceneContent render', { sceneState, isReload, zoneId, sceneId });

  if (!sceneState?.phase) sceneActions.updateState({ phase: 'initial' });

  // Access GameCoach functionality
  const { showMessage, hideCoach, isVisible } = useGameCoach();

  const [showSparkle, setShowSparkle] = useState(null);
  const [currentSourceElement, setCurrentSourceElement] = useState(null);
  const [showPopupBook, setShowPopupBook] = useState(false);
  const [popupBookContent, setPopupBookContent] = useState({});
  const [showMagicalCard, setShowMagicalCard] = useState(false);
  const [cardContent, setCardContent] = useState({});
  
  // Timeouts ref for cleanup
  const timeoutsRef = useRef([]);
  const progressiveHintRef = useRef(null);
  const [hintUsed, setHintUsed] = useState(false);

  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const previousVisibilityRef = useRef(false);

  // DISNEY-STYLE GAMECOACH MESSAGES
  const gameCoachStoryMessages = [
    {
      id: 'welcome',
      message: "Welcome to Ganesha's magical garden! Help gather his favorite sweets scattered around!",
      timing: 500,
      condition: () => sceneState?.phase === PHASES.INITIAL && !sceneState?.welcomeShown && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'modak_wisdom',
      message: "Wonderful! These modaks represent the sweetness of devotion and life's rewards!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.modak && !sceneState?.modakWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'mooshika_wisdom',
      message: "Amazing! Mooshika shows us that even the smallest acts of service are precious!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.mooshika && !sceneState?.mooshikaWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'belly_wisdom',
      message: "Incredible! Ganesha's belly contains the entire universe - he holds all our joys and troubles!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.belly && !sceneState?.bellyWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'mastery_wisdom',
      message: "You've learned about Ganesha's sweet blessings, faithful friend, and cosmic nature! Amazing!",
      timing: 1000,
      condition: () => sceneState?.phase === PHASES.COMPLETE && !sceneState?.masteryShown && !sceneState?.isReloadingGameCoach
    }
  ];

  const getHintConfigs = () => [
    {
      id: 'mooshika-hint',
      message: 'Look for Mooshika hiding behind the mud mounds!',
      explicitMessage: 'Click on different mud mounds to find where Mooshika is hiding!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        return sceneState.phase === PHASES.MOOSHIKA_SEARCH && 
              !sceneState.mooshikaFound &&
              !showMagicalCard &&
              !isVisible &&
              !showPopupBook;
      }
    },
    {
      id: 'modak-hint',
      message: 'Try clicking on the golden modaks!',
      explicitMessage: 'Click on all five modaks to collect them in the basket!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        const modakStates = sceneState.modakStates || [0, 0, 0, 0, 0];
        return !modakStates.every(state => state === 1) && 
               !showMagicalCard &&
               !isVisible &&
               !showPopupBook;
      }
    },
    
    {
      id: 'rock-hint',
      message: 'Feed the sacred rock with modaks!',
      explicitMessage: 'Drag modaks from the basket to the rock to transform it!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        return sceneState.rockVisible && 
              !sceneState.rockTransformed && 
              !showMagicalCard &&
              !isVisible &&
              !showPopupBook;
      }
    }
  ];

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

  // Watch for GameCoach visibility changes to trigger pending actions
  useEffect(() => {
    if (previousVisibilityRef.current && !isVisible && pendingAction) {
      console.log(`🎬 GameCoach closed, executing pending action: ${pendingAction}`);
      
      const actionTimer = setTimeout(() => {
        switch (pendingAction) {
          case 'show-mooshika-search':
            console.log('🔍 Starting Mooshika search after GameCoach wisdom');
            sceneActions.updateState({
              phase: PHASES.MOOSHIKA_SEARCH,
              currentFocus: 'mooshika',
              gameCoachState: null,
              isReloadingGameCoach: false
            });
            
            safeSetTimeout(() => {
              showMessage("Now let's find Mooshika! He's hiding behind one of the mud mounds.", {
                duration: 4000,
                animation: 'bounce',
                position: 'top-right'
              });
            }, 1000);
            break;
            
          case 'show-rock':
            console.log('🪨 Revealing sacred rock after GameCoach wisdom');
            setShowSparkle('rock-appear');
            
            safeSetTimeout(() => {
              sceneActions.updateState({
                rockVisible: true,
                phase: PHASES.ROCK_VISIBLE,
                currentFocus: 'rock',
                gameCoachState: null,
                isReloadingGameCoach: false
              });
              
              setShowSparkle(null);
              
              safeSetTimeout(() => {
                showMessage("A sacred rock has appeared! Feed it modaks to awaken its true nature.", {
                  duration: 4000,
                  animation: 'bounce',
                  position: 'top-right'
                });
              }, 1000);
            }, 1500);
            break;
            
          case 'transform-rock':
            console.log('✨ Transforming rock to belly after GameCoach wisdom');
            setShowSparkle('belly-transform');
            
            safeSetTimeout(() => {
              sceneActions.updateState({
                rockTransformed: true,
                phase: PHASES.ROCK_TRANSFORMED,
                gameCoachState: null,
                isReloadingGameCoach: false
              });
              
              setShowSparkle(null);
              
              safeSetTimeout(() => {
                showSymbolCelebration('final');
              }, 1000);
            }, 1500);
            break;
        }
        
        setPendingAction(null);
      }, 1000);
      
      timeoutsRef.current.push(actionTimer);
    }
    
    previousVisibilityRef.current = isVisible;
  }, [isVisible, pendingAction]);

  // Hide active hints function
  const hideActiveHints = () => {
    if (progressiveHintRef.current && typeof progressiveHintRef.current.hideHint === 'function') {
      progressiveHintRef.current.hideHint();
    }
  };

  // GAMECOACH LOGIC - Identical to PondScene
  useEffect(() => {
    if (!sceneState || !showMessage) return;
    
    if (sceneState.isReloadingGameCoach) {
      console.log('🚫 GameCoach blocked: Reload in progress');
      return;
    }
    
    if (sceneState.symbolDiscoveryState) {
      console.log('🚫 GameCoach blocked: Symbol discovery in progress');
      return;
    }

    if (sceneState.sidebarHighlightState) {
      console.log('🚫 GameCoach blocked: Sidebar highlighting in progress');
      return;
    }

    const isReloadRecovery = sceneState.isReloadingGameCoach;

    const recentlyFinishedGameCoach = 
      (sceneState.modakWisdomShown && sceneState.readyForWisdom === false && 
       !sceneState.gameCoachState && Date.now() - (sceneState.lastGameCoachTime || 0) < 8000) ||
      (sceneState.mooshikaWisdomShown && sceneState.readyForWisdom === false && 
       !sceneState.gameCoachState && Date.now() - (sceneState.lastGameCoachTime || 0) < 8000) ||
      (sceneState.bellyWisdomShown && sceneState.readyForWisdom === false && 
       !sceneState.gameCoachState && Date.now() - (sceneState.lastGameCoachTime || 0) < 8000);

    if (recentlyFinishedGameCoach) {
      console.log('🚫 GameCoach: Recently finished message, preventing duplicate');
      return;
    }
    
    const matchingMessage = gameCoachStoryMessages.find(
      item => typeof item.condition === 'function' && item.condition()
    );
    
    if (matchingMessage) {
      const messageAlreadyShown = 
        (matchingMessage.id === 'modak_wisdom' && sceneState.modakWisdomShown && !isReloadRecovery) ||
        (matchingMessage.id === 'mooshika_wisdom' && sceneState.mooshikaWisdomShown && !isReloadRecovery) ||
        (matchingMessage.id === 'belly_wisdom' && sceneState.bellyWisdomShown && !isReloadRecovery) ||
        (matchingMessage.id === 'mastery_wisdom' && sceneState.masteryShown && !isReloadRecovery) ||
        (matchingMessage.id === 'welcome' && sceneState.welcomeShown);
      
      if (messageAlreadyShown) {
        console.log(`🚫 GameCoach: ${matchingMessage.id} already shown this session`);
        return;
      }
      
      const timer = setTimeout(() => {
        console.log(`🎭 GameCoach: Showing ${matchingMessage.id} message (normal flow)`);
        
        showMessage(matchingMessage.message, {
          duration: 8000,
          animation: 'bounce',
          position: 'top-right'
        });
        
        switch (matchingMessage.id) {
          case 'welcome':
            sceneActions.updateState({ welcomeShown: true });
            break;
          case 'modak_wisdom':
            sceneActions.updateState({ 
              modakWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'modak_wisdom',
              lastGameCoachTime: Date.now()
            });
            setPendingAction('show-mooshika-search');
            break;
          case 'mooshika_wisdom':
            sceneActions.updateState({ 
              mooshikaWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'mooshika_wisdom',
              lastGameCoachTime: Date.now()
            });
            setPendingAction('show-rock');
            break;
          case 'belly_wisdom':
            sceneActions.updateState({ 
              bellyWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'belly_wisdom',
              lastGameCoachTime: Date.now()
            });
            setPendingAction('transform-rock');
            break;
          case 'mastery_wisdom':
            sceneActions.updateState({ 
              masteryShown: true,
              gameCoachState: 'mastery_wisdom',
              lastGameCoachTime: Date.now()
            });
            break;
        }
      }, matchingMessage.timing);
      
      return () => clearTimeout(timer);
    }
  }, [
    sceneState?.phase, 
    sceneState?.discoveredSymbols, 
    sceneState?.welcomeShown,
    sceneState?.modakWisdomShown,
    sceneState?.mooshikaWisdomShown,
    sceneState?.bellyWisdomShown,
    sceneState?.masteryShown,
    sceneState?.readyForWisdom,
    sceneState?.gameCoachState,
    sceneState?.symbolDiscoveryState,
    sceneState?.sidebarHighlightState,
    showMessage
  ]);

  // Show modak info after all collected
  useEffect(() => {
    if (!sceneState || !sceneActions) return;
    
    if ((sceneState.phase === PHASES.ALL_COLLECTED || 
         sceneState.modakStates?.every(state => state === 1)) && 
        sceneState.currentPopup !== 'modak_info' && 
        !sceneState.discoveredSymbols?.modak &&
        !sceneState.symbolDiscoveryState) {
      
      console.log('🍯 Starting modak discovery sequence');
      
      sceneActions.updateState({ 
        symbolDiscoveryState: 'modak_discovering',
        currentPopup: 'modak_info'
      });
      
      setPopupBookContent({
        title: "Ganesha's Favorite Sweet",
        symbolImage: popupModak,
        description: "Modaks are Ganesha's favorite sweets! These golden dumplings represent the sweetness of life and the rewards of spiritual devotion. Just as modaks bring joy to the taste, wisdom brings happiness to the soul!"
      });
      
      setCurrentSourceElement('modak-1');
      
      safeSetTimeout(() => {
        setShowPopupBook(true);
      }, 500);
    }
  }, [sceneState?.phase, sceneState?.modakStates, sceneActions]);

  // RELOAD LOGIC - Updated for ModakScene
  useEffect(() => {
    if (!isReload || !sceneState) return;
    
    console.log('🔄 RELOAD: Starting reload sequence', {
      currentPopup: sceneState.currentPopup,
      gameCoachState: sceneState.gameCoachState,
      symbolDiscoveryState: sceneState.symbolDiscoveryState,
      sidebarHighlightState: sceneState.sidebarHighlightState
    });

    sceneActions.updateState({ isReloadingGameCoach: true });
    
    setTimeout(() => {
      if (sceneState.symbolDiscoveryState) {
        console.log('🔄 Resuming symbol discovery:', sceneState.symbolDiscoveryState);
        
        switch(sceneState.symbolDiscoveryState) {
          case 'modak_discovering':
            setPopupBookContent({
              title: "Ganesha's Favorite Sweet",
              symbolImage: popupModak,
              description: "Modaks are Ganesha's favorite sweets! These golden dumplings represent the sweetness of life and the rewards of spiritual devotion."
            });
            setCurrentSourceElement('modak-1');
            setShowPopupBook(true);
            sceneActions.updateState({ 
              currentPopup: 'modak_info',
              isReloadingGameCoach: false 
            });
            break;
            
          case 'mooshika_discovering':
            setPopupBookContent({
              title: "Mooshika - Divine Vehicle",
              symbolImage: popupMooshika,
              description: "Mooshika is Ganesha's faithful mouse companion! Though small, he carries the mighty Ganesha, teaching us that no act of love or service is too small!"
            });
            setCurrentSourceElement('mooshika-1');
            setShowPopupBook(true);
            sceneActions.updateState({ 
              currentPopup: 'mooshika_info',
              isReloadingGameCoach: false 
            });
            break;
            
          case 'belly_discovering':
            setPopupBookContent({
              title: "Ganesha's Cosmic Belly",
              symbolImage: popupBelly,
              description: "Ganesha's cosmic belly contains the entire universe! It represents his ability to digest all experiences and transform them into wisdom."
            });
            setCurrentSourceElement('belly-1');
            setShowPopupBook(true);
            sceneActions.updateState({ 
              currentPopup: 'belly_info',
              isReloadingGameCoach: false 
            });
            break;
        }
        return;
      }
      
      else if (sceneState.sidebarHighlightState) {
        console.log('🔄 Resuming sidebar highlight:', sceneState.sidebarHighlightState);
        
        setTimeout(() => {
          const symbolType = sceneState.sidebarHighlightState.replace('_highlighting', '');
          console.log(`🌟 Resuming ${symbolType} celebration after sidebar highlight`);
          showSymbolCelebration(symbolType);
        }, 1000);
        
        sceneActions.updateState({ isReloadingGameCoach: false });
        return;
      }

      else if (sceneState.currentPopup) {
        console.log('🔄 Resuming popup:', sceneState.currentPopup);
        
        switch(sceneState.currentPopup) {
          case 'modak_info':
            setPopupBookContent({
              title: "Ganesha's Favorite Sweet",
              symbolImage: popupModak,
              description: "Modaks are Ganesha's favorite sweets! These golden dumplings represent the sweetness of life and the rewards of spiritual devotion."
            });
            setCurrentSourceElement('modak-1');
            setShowPopupBook(true);
            break;
            
          case 'modak_card':
            setCardContent({ 
              title: "You've discovered the Modak Symbol!",
              image: popupModak,
              stars: 3
            });
            setShowMagicalCard(true);
            break;
            
          case 'mooshika_info':
            setPopupBookContent({
              title: "Mooshika - Divine Vehicle",
              symbolImage: popupMooshika,
              description: "Mooshika is Ganesha's faithful mouse companion! Though small, he carries the mighty Ganesha."
            });
            setCurrentSourceElement('mooshika-1');
            setShowPopupBook(true);
            break;
            
          case 'mooshika_card':
            setCardContent({ 
              title: "You've discovered the Mooshika Symbol!",
              image: popupMooshika,
              stars: 2
            });
            setShowMagicalCard(true);
            break;
            
          case 'belly_info':
            setPopupBookContent({
              title: "Ganesha's Cosmic Belly",
              symbolImage: popupBelly,
              description: "Ganesha's cosmic belly contains the entire universe!"
            });
            setCurrentSourceElement('belly-1');
            setShowPopupBook(true);
            break;
            
          case 'belly_card':
            setCardContent({ 
              title: "You've discovered the Belly Symbol!",
              image: popupBelly,
              stars: 3
            });
            setShowMagicalCard(true);
            break;

          case 'final_fireworks':
            console.log('🎆 Resuming final fireworks');
            setShowSparkle('final-fireworks');
            sceneActions.updateState({ 
              gameCoachState: null,  
              isReloadingGameCoach: false,
              phase: PHASES.COMPLETE,
              stars: 8,
              completed: true,
              progress: {
                percentage: 100,
                starsEarned: 8,
                completed: true
              }
            });
            return;
        }
        
        sceneActions.updateState({ isReloadingGameCoach: false });
      }
      
      else if (sceneState.gameCoachState) {
        console.log('🔄 Resuming GameCoach:', sceneState.gameCoachState);
        
        switch(sceneState.gameCoachState) {
          case 'modak_wisdom':
            console.log('🍯 Setting up modak wisdom resume');
            sceneActions.updateState({ 
              readyForWisdom: true,
              modakWisdomShown: false,
              isReloadingGameCoach: false
            });
            setPendingAction('show-mooshika-search');
            break;
            
          case 'mooshika_wisdom':
            console.log('🐭 Setting up mooshika wisdom resume');
            sceneActions.updateState({ 
              readyForWisdom: true,
              mooshikaWisdomShown: false,
              isReloadingGameCoach: false
            });
            setPendingAction('show-rock');
            break;
            
          case 'belly_wisdom':
            console.log('🌌 Setting up belly wisdom resume');
            sceneActions.updateState({ 
              readyForWisdom: true,
              bellyWisdomShown: false,
              isReloadingGameCoach: false
            });
            setPendingAction('transform-rock');
            break;
            
          case 'mastery_wisdom':
            console.log('🏆 Setting up mastery wisdom resume');
            sceneActions.updateState({ 
              masteryShown: false,
              isReloadingGameCoach: false
            });
            break;
        }
      }
      
      else {
        console.log('🔄 No special reload needed, clearing flags');
        setTimeout(() => {
          sceneActions.updateState({ isReloadingGameCoach: false });
        }, 1500);
      }
      
    }, 500);
    
  }, [isReload]);

  // Modak Click Handler (Drag/Drop simulation)
  const handleModakClick = (index) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`Modak ${index} clicked`);
    hideActiveHints();
    hideCoach();

    if (!sceneState.welcomeShown) {
      sceneActions.updateState({ welcomeShown: true });
    }
    
    const modakStates = [...(sceneState.modakStates || [0, 0, 0, 0, 0])];
    
    if (modakStates[index] === 1) {
      console.log(`Modak ${index} already collected - showing sparkle`);
      setShowSparkle(`modak-${index}`);
      setTimeout(() => setShowSparkle(null), 1500);
      return;
    }
    
    modakStates[index] = 1;
    
    setShowSparkle(`modak-${index}`);
    setTimeout(() => setShowSparkle(null), 1500);
    
    const collectedCount = modakStates.filter(s => s === 1).length;
    
    if (collectedCount === 5) {
      console.log('All modaks collected');
      sceneActions.updateState({ 
        modakStates,
        phase: PHASES.ALL_COLLECTED,
        basketReady: true,
        currentFocus: 'waiting-for-discovery',
        progress: {
          ...sceneState.progress,
          percentage: 30,
          starsEarned: 2
        }
      });
    } else {
      console.log(`${collectedCount} modaks collected`);
      sceneActions.updateState({ 
        modakStates,
        phase: PHASES.SOME_COLLECTED,
        progress: {
          ...sceneState.progress,
          percentage: 6 * collectedCount
        }
      });
    }
  };

  // Mud Mound Click Handler
  const handleMoundClick = (moundIndex) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`Mound ${moundIndex} clicked`);
    hideActiveHints();
    
    if (sceneState.phase !== PHASES.MOOSHIKA_SEARCH) {
      return; // Only allow clicking during search phase
    }
    
    const moundStates = [...(sceneState.moundStates || [0, 0, 0, 0, 0])];
    
    // Mark this mound as clicked
    moundStates[moundIndex - 1] = 1;
    
    if (moundIndex === sceneState.correctMound) {
      // Found Mooshika!
      console.log('🐭 Mooshika found!');
      setShowSparkle('mooshika-found');
      
      sceneActions.updateState({ 
        mooshikaVisible: true,
        mooshikaFound: true,
        moundStates,
        phase: PHASES.MOOSHIKA_FOUND,
        currentFocus: 'mooshika'
      });
      
      // Start mooshika discovery sequence after celebration
      safeSetTimeout(() => {
        sceneActions.updateState({ 
          symbolDiscoveryState: 'mooshika_discovering',
          currentPopup: 'mooshika_info'
        });
        
        setPopupBookContent({
          title: "Mooshika - Divine Vehicle",
          symbolImage: popupMooshika,
          description: "Mooshika is Ganesha's faithful mouse companion! Though small, he carries the mighty Ganesha, teaching us that no act of love or service is too small to be important!"
        });
        
        setCurrentSourceElement('mooshika-1');
        setShowPopupBook(true);
        setShowSparkle(null);
      }, 2000);
    } else {
      // Wrong mound - gentle feedback
      setShowSparkle(`mound-${moundIndex}`);
      sceneActions.updateState({ moundStates });
      setTimeout(() => setShowSparkle(null), 1000);
    }
  };

  // Rock Click Handler (feeding simulation)
  const handleRockClick = () => {
    if (!sceneState || !sceneActions) return;
    
    console.log('Rock clicked for feeding');
    hideActiveHints();
    
    if (!sceneState.rockVisible || sceneState.rockTransformed) {
      return;
    }
    
    // Simulate feeding modak to rock
    const newFeedCount = sceneState.rockFeedCount + 1;
    const newGlowLevel = Math.min(newFeedCount, 5);
    
    setShowSparkle('rock-feeding');
    
    sceneActions.updateState({
      rockFeedCount: newFeedCount,
      rockGlowLevel: newGlowLevel,
      phase: PHASES.ROCK_FEEDING
    });
    
    console.log(`Rock fed ${newFeedCount} times, glow level: ${newGlowLevel}`);
    
    if (newFeedCount >= 5) {
      // Rock fully fed - start belly discovery
      safeSetTimeout(() => {
        sceneActions.updateState({ 
          symbolDiscoveryState: 'belly_discovering',
          currentPopup: 'belly_info'
        });
        
        setPopupBookContent({
          title: "Ganesha's Cosmic Belly",
          symbolImage: popupBelly,
          description: "Ganesha's cosmic belly contains the entire universe! It represents his ability to digest all experiences and transform them into wisdom. He can hold all our worries and troubles!"
        });
        
        setCurrentSourceElement('belly-1');
        setShowPopupBook(true);
        setShowSparkle(null);
      }, 2000);
    } else {
      setTimeout(() => setShowSparkle(null), 1500);
    }
  };

  // SYMBOL CELEBRATION FUNCTION
  const showSymbolCelebration = (symbol) => {
    let title = "";
    let image = null;
    let stars = 0;
    
    console.log(`🎉 Showing celebration for: ${symbol}`);
    
    if (sceneState?.isReloadingGameCoach) {
      console.log('🚫 Skipping celebration during reload');
      return;
    }
    
    switch(symbol) {
      case 'modak':
        title = "You've discovered the Modak Symbol!";
        image = popupModak;
        stars = 3;
        
        sceneActions.updateState({ 
          symbolDiscoveryState: null,
          sidebarHighlightState: null,
          currentPopup: 'modak_card'
        });
        
        setCardContent({ title, image, stars });
        setShowMagicalCard(true);
        break;

      case 'mooshika':
        title = "You've discovered the Mooshika Symbol!";
        image = popupMooshika;
        stars = 2;
        
        sceneActions.updateState({ 
          symbolDiscoveryState: null,
          sidebarHighlightState: null,
          currentPopup: 'mooshika_card'
        });
        
        setCardContent({ title, image, stars });
        setShowMagicalCard(true);
        break;

      case 'belly':
        title = "You've discovered the Belly Symbol!";
        image = popupBelly;
        stars = 3;
        
        sceneActions.updateState({ 
          symbolDiscoveryState: null,
          sidebarHighlightState: null,
          currentPopup: 'belly_card'
        });
        
        setCardContent({ title, image, stars });
        setShowMagicalCard(true);
        break;

      case 'final':
        console.log('Final mastery achieved - showing fireworks celebration');
        sceneActions.updateState({ 
          currentPopup: 'final_fireworks',
          phase: PHASES.COMPLETE,
          stars: 8,
          completed: true,
          progress: {
            percentage: 100,
            starsEarned: 8,
            completed: true
          }
        });
        setShowSparkle('final-fireworks');
        
        safeSetTimeout(() => {
          showMessage("Amazing! You've mastered all of Ganesha's garden symbols! You're now a true keeper of ancient wisdom!", {
            duration: 6000,
            animation: 'bounce',
            position: 'top-center'
          });
        }, 500);
        
        safeSetTimeout(() => {
          sceneActions.updateState({ currentPopup: null });
          
          sceneActions.completeScene(8, {
            symbolsFound: ['modak', 'mooshika', 'belly'],
            completed: true,
            totalStars: 8
          });
          
          setShowSceneCompletion(true);
        }, 8000);
        return;

      default:
        title = "Congratulations on your discovery!";
        stars = 1;
    }
  };

  // CLOSE CARD HANDLER
  const handleCloseCard = () => {
    setShowMagicalCard(false);
    sceneActions.updateState({ currentPopup: null });
    
    if (cardContent.title?.includes("Modak Symbol")) {
      console.log('🍯 Modak card closed - continuing progression');
      
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'modak_wisdom'
        });
        setPendingAction('show-mooshika-search');
      }, 1500);
    }
    
    else if (cardContent.title?.includes("Mooshika Symbol")) {
      console.log('🐭 Mooshika card closed - continuing progression');
      
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'mooshika_wisdom'
        });
        setPendingAction('show-rock');
      }, 500);
    }
    
    else if (cardContent.title?.includes("Belly Symbol")) {
      console.log('🌌 Belly card closed - continuing progression');
      
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'belly_wisdom'
        });
        setPendingAction('transform-rock');
      }, 500);
    }
  };

  // SYMBOL INFO CLOSE HANDLER
  const handleSymbolInfoClose = () => {
    console.log('🔍 Closing SymbolSceneIntegration');
    setShowPopupBook(false);
    setPopupBookContent({});
    setCurrentSourceElement(null);
    sceneActions.updateState({ currentPopup: null });
    
    if (popupBookContent.title?.includes("Mooshika")) {
      console.log('🐭 Mooshika info closed - highlighting sidebar first');
      
      sceneActions.updateState({
        discoveredSymbols: {
          ...sceneState.discoveredSymbols,
          mooshika: true
        },
        symbolDiscoveryState: null,
        sidebarHighlightState: 'mooshika_highlighting'
      });
      
      safeSetTimeout(() => {
        console.log('🎉 Showing mooshika celebration after sidebar highlight');
        showSymbolCelebration('mooshika');
      }, 2500);
      
    } else if (popupBookContent.title?.includes("Modak") || popupBookContent.title?.includes("Favorite Sweet")) {
      console.log('🍯 Modak info closed - highlighting sidebar first');
      
      sceneActions.updateState({
        discoveredSymbols: {
          ...sceneState.discoveredSymbols,
          modak: true
        },
        symbolDiscoveryState: null,
        sidebarHighlightState: 'modak_highlighting'
      });
      
      safeSetTimeout(() => {
        console.log('🎉 Showing modak celebration after sidebar highlight');
        showSymbolCelebration('modak');
      }, 3000);
      
    } else if (popupBookContent.title?.includes("Belly") || popupBookContent.title?.includes("Cosmic")) {
      console.log('🌌 Belly info closed - highlighting sidebar first');
      
      sceneActions.updateState({
        discoveredSymbols: {
          ...sceneState.discoveredSymbols,
          belly: true
        },
        symbolDiscoveryState: null,
        sidebarHighlightState: 'belly_highlighting'
      });
      
      safeSetTimeout(() => {
        console.log('🎉 Showing belly celebration after sidebar highlight');
        showSymbolCelebration('belly');
      }, 2500);
    }
  };

  // Hint interaction handlers
  const handleHintShown = (level) => {
    console.log(`Hint level ${level} shown`);
    setHintUsed(true);
  };

  const handleHintButtonClick = () => {
    console.log("Hint button clicked");
    console.log("Current hint configs:", getHintConfigs());
  };

  // Render helpers
  const getModakImage = (index) => {
    const modakStates = sceneState?.modakStates || [0, 0, 0, 0, 0];
    return modakStates[index] === 0 ? modak : modak; // Same image for now, could add collected state
  };

  const getBasketImage = () => {
  return basket; // Always show same basket image
  };

  const getMooshikaImage = () => {
  return mooshika; // Always show same mooshika image
  };

  const getRockImage = () => {
    return sceneState?.rockTransformed ? belly : rock;
  };

  const renderCounter = () => {
    const modakStates = sceneState?.modakStates || [0, 0, 0, 0, 0];
    const collectedCount = modakStates.filter(state => state === 1).length;
    
    return (
      <div className="modak-counter">
        <div className="counter-icon">
          <img src={modak} alt="Modak" />
        </div>
        <div className="counter-progress">
          <div 
            className="counter-progress-fill"
            style={{width: `${(collectedCount / 5) * 100}%`}}
          />
        </div>
        <div className="counter-display">{collectedCount}/5</div>
      </div>
    );
  };

  if (!sceneState) {
    return <div className="loading">Loading scene state...</div>;
  }
  
  return (
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager 
        messages={[]}
        sceneState={sceneState}
        sceneActions={sceneActions}
      >
        <div className="modak-scene-container">
          <div className="forest-background" style={{ backgroundImage: `url(${forestBackground})` }}>
            {renderCounter()}

            {renderCounter()}

{/* 🔧 RESET BUTTON */}
<div style={{
  position: 'fixed',
  top: '10px',
  right: '10px',
  zIndex: 9999,
  background: 'red',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
}} onClick={() => {
  console.log('🔄 RESETTING SCENE');
  sceneActions.updateState({
    modakStates: [0, 0, 0, 0, 0],
    basketReady: false,
    phase: 'initial',
    currentFocus: 'modaks',
    discoveredSymbols: {},
    welcomeShown: false,
    currentPopup: null,
    stars: 0,
    completed: false,
    progress: { percentage: 0, starsEarned: 0, completed: false }
  });
  setShowSparkle(null);
  setShowPopupBook(false);
  setShowMagicalCard(false);
}}>
  RESET
</div>
            
{/* Modaks - Only show when unlocked */}
{sceneState.modaksUnlocked && [0, 1, 2, 3, 4].map((index) => (
  <div key={index} className={`modak modak-${index + 1}`}>
                <ClickableElement
                  id={`modak-${index}`}
                  onClick={() => handleModakClick(index)}
                  completed={(sceneState.modakStates || [])[index] === 1}
                  zone="garden-zone"
                  data-element={`modak-${index + 1}`}
                >
                  <img 
                    src={getModakImage(index)}
                    alt={`Modak ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      opacity: (sceneState.modakStates || [])[index] === 1 ? 0.5 : 1
                    }}
                  />
                </ClickableElement>
                {showSparkle === `modak-${index}` && (
                  <SparkleAnimation
                    type="star"
                    count={15}
                    color="#ffd700"
                    size={10}
                    duration={1500}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            ))}
            
            {/* Basket */}
{sceneState.modaksUnlocked && (
              <div className="basket-container">
                <img 
                  src={getBasketImage()}
                  alt="Collection Basket"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
            
            {/* Mud Mounds */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className={`mud-mound mound-${index}`}>
                <ClickableElement
                  id={`mound-${index}`}
                  onClick={() => handleMoundClick(index)}
                  completed={(sceneState.moundStates || [])[index - 1] === 1}
                  zone="mound-zone"
                >
                  <img 
                    src={mudMound}
                    alt={`Mud Mound ${index}`}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      opacity: (sceneState.moundStates || [])[index - 1] === 1 ? 0.7 : 1
                    }}
                  />
                </ClickableElement>
                {showSparkle === `mound-${index}` && (
                  <SparkleAnimation
                    type="firefly"
                    count={10}
                    color="#8B4513"
                    size={8}
                    duration={1000}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            ))}
            
            {/* Mooshika */}
            {sceneState.mooshikaVisible && (
              <div 
                className={`mooshika-container mound-${sceneState.correctMound}`}
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  zIndex: 20
                }}
              >
                <img 
                  src={getMooshikaImage()}
                  alt="Mooshika"
                  style={{ width: '100%', height: '100%' }}
                />
                {showSparkle === 'mooshika-found' && (
                  <SparkleAnimation
                    type="magic"
                    count={20}
                    color="#ff69b4"
                    size={12}
                    duration={2000}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            )}
            
            {/* Rock/Belly */}
            {sceneState.rockVisible && (
              <div 
                className={`rock-container ${sceneState.rockGlowLevel > 0 ? `rock-glow-${sceneState.rockGlowLevel}` : ''}`}
              >
                <ClickableElement
                  id="rock"
                  onClick={handleRockClick}
                  completed={sceneState.rockTransformed}
                  zone="rock-zone"
                >
                  <img 
                    src={getRockImage()}
                    alt={sceneState.rockTransformed ? "Ganesha's Belly" : "Sacred Rock"}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                  />
                </ClickableElement>
                {(showSparkle === 'rock-feeding' || showSparkle === 'rock-appear' || showSparkle === 'belly-transform') && (
                  <SparkleAnimation
                    type={showSparkle === 'belly-transform' ? 'glitter' : 'magic'}
                    count={25}
                    color={showSparkle === 'belly-transform' ? 'gold' : '#ff6347'}
                    size={12}
                    duration={2000}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            )}

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

          </div>
          
          {/* SymbolSceneIntegration for Symbol Information */}
          <SymbolSceneIntegration
            show={showPopupBook}
            symbolImage={popupBookContent.symbolImage}
            title={popupBookContent.title}
            description={popupBookContent.description}
            sourceElement={currentSourceElement}
            onClose={handleSymbolInfoClose}
          />

          {/* MagicalCardFlip for Symbol Celebrations */}
          <MagicalCardFlip
            show={showMagicalCard}
            backImage={cardContent.image}
            title={cardContent.title}
            stars={cardContent.stars}
            onClose={handleCloseCard}
            autoFlip={false}
            autoFlipDelay={5000}
            animationDuration={6000}
          />

          {/* Real Confetti Effect */}
          {showMagicalCard && (cardContent.title?.includes("Modak Symbol") || cardContent.title?.includes("Mooshika Symbol") || cardContent.title?.includes("Belly Symbol")) && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              zIndex: 9998, 
              pointerEvents: 'none',
              overflow: 'hidden'
            }}>
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: `${Math.random() * 100}%`,
                    width: '10px',
                    height: '10px',
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'][Math.floor(Math.random() * 6)],
                    animation: `confettiFall ${2 + Math.random() * 3}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              ))}
            </div>
          )}

          <style>{`
            @keyframes confettiFall {
              to {
                transform: translateY(100vh) rotate(720deg);
              }
            }
          `}</style>

          {/* Navigation */}
          <TocaBocaNav
            onHome={() => onNavigate?.('home')}
            onProgress={() => console.log('Show progress')}
            onHelp={() => console.log('Show help')}
            onParentMenu={() => console.log('Parent menu')}
            isAudioOn={true}
            onAudioToggle={() => console.log('Toggle audio')}
            onZonesClick={() => onNavigate?.('zones')}
            currentProgress={{
              stars: sceneState.celebrationStars || 0,
              completed: sceneState.phase === PHASES.COMPLETE ? 1 : 0,
              total: 1
            }}
          />

          {/* Symbol Sidebar */}
          <SymbolSidebar 
            discoveredSymbols={sceneState.discoveredSymbols || {}}
            onSymbolClick={(symbolId) => {
              console.log(`Sidebar symbol clicked: ${symbolId}`);
            }}
          />

          {/* Final Mastery Fireworks */}
          {showSparkle === 'final-fireworks' && (
            <Fireworks
              show={true}
              duration={8000}
              count={15}
              colors={['#FFD700', '#FF1493', '#00CED1', '#98FB98', '#FF6347', '#9370DB']}
              onComplete={() => {
                console.log('Fireworks complete - showing scene completion');
                setShowSparkle(null);
                setShowSceneCompletion(true);
              }}
            />
          )}

          {/* Scene Completion - For moving to next scene */}
          <SceneCompletionCelebration
            show={showSceneCompletion}
            sceneName="Garden Adventure"
            sceneNumber={1}
            totalScenes={4}
            starsEarned={sceneState.progress?.starsEarned || 8}
            totalStars={8}
            discoveredSymbols={Object.keys(sceneState.discoveredSymbols || {})}
            symbolImages={{
              modak: popupModak,
              mooshika: popupMooshika,
              belly: popupBelly
            }}
            nextSceneName="Temple Discovery"
            onContinue={() => {
              console.log('Going to next scene');
              onNavigate?.('temple-scene');
            }}
            onReplay={() => {
              console.log('Replaying modak scene');
              window.location.reload();
            }}
          />

        </div>       
      </MessageManager>
    </InteractionManager>
  );
};

export default ModakScene;