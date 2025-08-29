// zones/symbol-mountain/scenes/modak/NewModakScene.jsx
// 🎯 Cultural Flow: Mooshika → Modaks → Belly (Template from PondScene)

import React, { useState, useEffect, useRef } from 'react';
import './ModakScene.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import { ClickableElement } from "../../../../lib/components/scenes/InteractionManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach, TriggerCoach } from '../../../../lib/components/coach/GameCoach';
import ProgressManager from '../../../../lib/services/ProgressManager';

// 🎯 NEW: Import Drag & Drop Components
import DraggableItem from '../../../../lib/components/interactive/DraggableItem';
import DropZone from '../../../../lib/components/interactive/DropZone';
import FreeDraggableItem from '../../../../lib/components/interactive/FreeDraggableItem';

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import SymbolSceneIntegration from '../../../../lib/components/animation/SymbolSceneIntegration';
import MagicalCardFlip from '../../../../lib/components/animation/MagicalCardFlip';
import SymbolSidebar from '../../shared/components/SymbolSidebar';
import SceneCompletionCelebration from '../../../../lib/components/celebration/SceneCompletionCelebration';

// Images - 🎯 UPDATED for ModakScene
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
// Add these imports after the existing image imports
import symbolMooshikaColored from '../../shared/images/icons/symbol-mooshika-colored.png';
import symbolModakColored from '../../shared/images/icons/symbol-modak-colored.png';
import symbolBellyColored from '../../shared/images/icons/symbol-belly-colored.png';

// 🎯 UPDATED PHASES - Cultural Sequence: Mooshika → Modaks → Belly
const PHASES = {
  MOOSHIKA_SEARCH: 'mooshika_search',     // Phase 1: Find Mooshika first
  MOOSHIKA_FOUND: 'mooshika_found',       // Phase 2: Mooshika discovered
  MODAKS_UNLOCKED: 'modaks_unlocked',     // Phase 3: Modaks become clickable
  SOME_COLLECTED: 'some_collected',       // Phase 4: Collecting modaks
  ALL_COLLECTED: 'all_collected',         // Phase 5: All modaks collected
  ROCK_VISIBLE: 'rock_visible',           // Phase 6: Rock appears
  ROCK_FEEDING: 'rock_feeding',           // Phase 7: Feeding rock
  ROCK_TRANSFORMED: 'rock_transformed',   // Phase 8: Belly revealed
  COMPLETE: 'complete'                    // Phase 9: Scene complete
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

const NewModakScene = ({ 
  onComplete, 
  onNavigate, 
  zoneId = 'symbol-mountain', 
  sceneId = 'modak' 
}) => {
  console.log('NewModakScene props:', { onComplete, onNavigate, zoneId, sceneId });

  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          // 🎯 UPDATED: Mooshika search first
          moundStates: [0, 0, 0, 0, 0],         // 5 mud mounds
          correctMound: Math.floor(Math.random() * 5) + 1, // Random mound 1-5
          mooshikaVisible: false,
          mooshikaFound: false,
          mooshikaDragHintShown: false,  // Track if drag hint was shown
          mooshikaLastPosition: { top: '45%', left: '25%' },  // 🌟 ADD THIS LINE
          moundsVanished: false,   // Scene transformation
          moundsVanishing: false,  // Scene transformation

          // 🎯 UPDATED: Modaks unlock after Mooshika
          modakStates: [0, 0, 0, 0, 0],         // 5 modaks
          modaksUnlocked: false,                // Control when modaks appear
          basketVisible: false,
          basketFull: false,
          collectedModaks: [],
          fedModaks: [],
          
          // 🎯 UPDATED: Rock/Belly last
          rockVisible: false,
          rockFeedCount: 0,
          rockTransformed: false,
          rockFeedingComplete: false,  // 🌟 ADD THIS LIN
          
          celebrationStars: 0,
          phase: PHASES.MOOSHIKA_SEARCH,        // Start with Mooshika search
          currentFocus: 'mooshika',             // Start focus on Mooshika
          discoveredSymbols: {},
          
          // Message flags to prevent duplicates
          welcomeShown: false,
          mooshikaWisdomShown: false,
          modakWisdomShown: false,
          bellyWisdomShown: false,
          masteryShown: false,
          readyForWisdom: false,
          
          // KEEP RELOAD SYSTEM IDENTICAL
          currentPopup: null,  // 'mooshika_info', 'mooshika_card', 'modak_info', 'modak_card', 'belly_info', 'belly_card', 'final_fireworks'
          
          // Symbol discovery state tracking
          symbolDiscoveryState: null,  // 'mooshika_discovering', 'modak_discovering', 'belly_discovering'
          sidebarHighlightState: null, // 'mooshika_highlighting', 'modak_highlighting', 'belly_highlighting'
          
          // GameCoach reload tracking
          gameCoachState: null,  // 'mooshika_wisdom', 'modak_wisdom', 'belly_wisdom', 'mastery_wisdom'
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
          <NewModakSceneContent 
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

const NewModakSceneContent = ({ 
  sceneState, 
  sceneActions, 
  isReload, 
  onComplete, 
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('NewModakSceneContent render', { sceneState, isReload, zoneId, sceneId });

  // MINIMAL DEBUG - Just log what's happening
  console.log('🧪 MODAK RENDER:', { 
    hasSceneState: !!sceneState,
    phase: sceneState?.phase,
    isReload 
  });

  // SAFETY CHECK - Prevent crashes if props missing
  if (!sceneState || !sceneActions) {
    console.warn('⚠️ MODAK: Missing required props');
    return <div>Loading Modak scene...</div>;
  }


  if (!sceneState?.phase) sceneActions.updateState({ phase: PHASES.MOOSHIKA_SEARCH });

  // Add this function near the top of NewModakSceneContent
const getCollectedModakPosition = (displayIndex) => {
  // Calculate position relative to basket container
  const basketLeft = 12; // Same as basket-collection-container left: 12%
  const basketTop = 40;  // Same as basket-collection-container top: 40%
  const basketWidth = 170; // Same as basket width
  const basketHeight = 150; // Same as basket height
  
  // Positions within the basket (convert percentages to absolute)
  const positions = [
    { top: basketTop + (basketHeight * 0.20), left: basketLeft + (basketWidth * 0.30) },
    { top: basketTop + (basketHeight * 0.35), left: basketLeft + (basketWidth * 0.55) },
    { top: basketTop + (basketHeight * 0.25), left: basketLeft + (basketWidth * 0.70) },
    { bottom: '25%', left: basketLeft + (basketWidth * 0.20) },
    { bottom: '30%', left: basketLeft + (basketWidth * 0.60) }
  ];
  
  const pos = positions[displayIndex] || positions[0];
  
  // Convert to viewport percentages
  return {
    top: `${(pos.top / window.innerHeight) * 100}%`,
    left: `${(pos.left / window.innerWidth) * 100}%`
  };
};

  // Access GameCoach functionality
const { showMessage, hideCoach, isVisible, clearManualCloseTracking } = useGameCoach();

  const [showSparkle, setShowSparkle] = useState(null);
  const [currentSourceElement, setCurrentSourceElement] = useState(null);
  const [showPopupBook, setShowPopupBook] = useState(false);
  const [popupBookContent, setPopupBookContent] = useState({});
  const [showMagicalCard, setShowMagicalCard] = useState(false);
  const [cardContent, setCardContent] = useState({});

  const [mooshikaAnimation, setMooshikaAnimation] = useState('breathing');

const [showMooshikaSpeech, setShowMooshikaSpeech] = useState(false);
const [mooshikaSpeechMessage, setMooshikaSpeechMessage] = useState('');

  
  // Timeouts ref for cleanup
  const timeoutsRef = useRef([]);
  const progressiveHintRef = useRef(null);
  const [hintUsed, setHintUsed] = useState(false);

  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const previousVisibilityRef = useRef(false);

  // 🐭 ADD THESE TWO LINES HERE:
const [mooshikaPosition, setMooshikaPosition] = useState({ top: '45%', left: '25%' });
const [mooshikaDragging, setMooshikaDragging] = useState(false);

// Add this function inside your scene component (around line 200-300)
const resetSceneForNewPlaythrough = () => {
  console.log('🔄 RESET: Starting fresh playthrough');
  
  // 1. FIRST: Clear all UI states immediately
  setShowSparkle(null);
  setShowPopupBook(false);
  setShowMagicalCard(false);
  setShowSceneCompletion(false);
  setCurrentSourceElement(null);
  setPopupBookContent({});
  setCardContent({});
  setPendingAction(null);
  
  // 2. For ModakScene, also clear these:
  if (typeof setShowMooshikaSpeech !== 'undefined') {
    setShowMooshikaSpeech(false);
    setMooshikaSpeechMessage('');
    setMooshikaAnimation('breathing');
    setMooshikaPosition({ top: '45%', left: '25%' });
    setMooshikaDragging(false);
  }
  
  // 3. THEN: Reset scene state to initial values
  setTimeout(() => {
    sceneActions.updateState({
      // Copy the EXACT initial state from your SceneManager
      // For ModakScene:
      moundStates: [0, 0, 0, 0, 0],
      correctMound: Math.floor(Math.random() * 5) + 1,
      mooshikaVisible: false,
      mooshikaFound: false,
      // ... all the other initial state values
      
      // For PondScene:
      // lotusStates: [0, 0, 0],
      // goldenLotusVisible: false,
      // elephantVisible: false,
      // ... all the other initial state values
    });
  }, 100);
  
  // 4. FINALLY: Hide GameCoach if active
  if (hideCoach) {
    hideCoach();
  }
};

// Add this function around line 300
const getMessageType = (messageId) => {
  switch(messageId) {
    case 'welcome': return 'welcome';
    case 'mooshika_wisdom': return 'wisdom1';
    case 'modak_wisdom': return 'wisdom2'; 
    case 'belly_wisdom': return 'wisdom3';
    default: return 'welcome';
  }
};

  // 🎯 UPDATED GAMECOACH MESSAGES - Cultural Sequence
  const gameCoachStoryMessages = [
    {
      id: 'welcome',
      message: "Welcome to Ganesha's magical garden! Someone is playing hide and seek!",
      timing: 500,
      condition: () => sceneState?.phase === PHASES.MOOSHIKA_SEARCH && !sceneState?.welcomeShown && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'mooshika_wisdom',
      message: "Amazing! Mooshika shows us that even the smallest acts of service are precious!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.mooshika && !sceneState?.mooshikaWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'modak_wisdom',
      message: "Wonderful! These modaks represent the sweetness of devotion and life's rewards!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.modak && !sceneState?.modakWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'belly_wisdom',
      message: "Incredible! Ganesha's belly contains the entire universe - he holds all our joys and troubles!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.belly && !sceneState?.bellyWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    /*{
      id: 'mastery_wisdom',
      message: "You've learned about Ganesha's faithful friend, sweet blessings, and cosmic nature! Amazing!",
      timing: 1000,
      condition: () => sceneState?.phase === PHASES.COMPLETE && !sceneState?.masteryShown && !sceneState?.isReloadingGameCoach
    }*/
  ];

  // 🎯 UPDATED HINT CONFIGS - Cultural Sequence Order + Drag & Drop
  const getHintConfigs = () => [
    {
      id: 'mooshika-hint',  // FIRST: Find Mooshika
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
      id: 'modak-hint',    // SECOND: Drag Modaks
      message: 'Drag the golden modaks to the basket!',
      explicitMessage: 'Drag all five modaks to the basket to collect them!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        const modakStates = sceneState.modakStates || [0, 0, 0, 0, 0];
        return sceneState.modaksUnlocked &&
               !modakStates.every(state => state === 1) && 
               !showMagicalCard &&
               !isVisible &&
               !showPopupBook;
      }
    },
    {
      id: 'rock-hint',     // THIRD: Feed Rock
      message: 'Drag modaks from the basket to feed the sacred rock!',
      explicitMessage: 'Drag modaks from the basket to the rock to feed it and transform it!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        return sceneState.rockVisible && 
              !sceneState.rockTransformed && 
              sceneState.rockFeedCount < 5 &&  // 🌟 ADD THIS - Only show hint if not fully fed
          (sceneState.collectedModaks || []).length > 0 &&  // 🌟 ADD TH
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
          case 'unlock-modaks':
            console.log('🍯 Unlocking modaks after Mooshika wisdom');
            setShowSparkle('modaks-unlock');
            
            safeSetTimeout(() => {
              sceneActions.updateState({
                modaksUnlocked: true,
                basketVisible: true,
                phase: PHASES.MODAKS_UNLOCKED,
                currentFocus: 'modaks',
                gameCoachState: null,
                isReloadingGameCoach: false
              });
              
              setShowSparkle(null);
            }, 1500);
            break;
            
          case 'show-rock':
            console.log('🪨 Revealing sacred rock after modak wisdom');
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
            }, 1500);
            break;
            
          case 'transform-rock':
  // Rock already transformed, just trigger final celebration
  console.log('✨ Rock already transformed, showing final celebration');
  showSymbolCelebration('final');
  break;
        }
        
        setPendingAction(null);
      }, 1000);
      
      timeoutsRef.current.push(actionTimer);
    }
    
    previousVisibilityRef.current = isVisible;
  }, [isVisible, pendingAction]);

  // ✅ ADD this useEffect in both scenes (after existing useEffects):

/*useEffect(() => {
  // Auto-reset completed scenes for fresh start
  if (sceneState?.completed && !isReload) {
    console.log('🔄 AUTO-RESET: Scene was completed, starting fresh');
    
    // Call the same reset function as "Start Fresh" button
        window.location.reload();

  }
}, [sceneState?.completed, isReload]);*/

  useEffect(() => {
  // Show speech bubble 3 seconds after Mooshika is discovered
  if (sceneState.mooshikaFound && 
      !sceneState.mooshikaDragHintShown && 
      !mooshikaDragging && 
      !showMooshikaSpeech) {
    
    const speechTimer = setTimeout(() => {
      setMooshikaSpeechMessage("Drag me around! Let's explore together!");
      setShowMooshikaSpeech(true);
      
      // Mark hint as shown
      sceneActions.updateState({ mooshikaDragHintShown: true });
      
    }, 3000); // 3 seconds after discovery
    
    timeoutsRef.current.push(speechTimer);
  }
}, [sceneState.mooshikaFound, sceneState.mooshikaDragHintShown, mooshikaDragging, showMooshikaSpeech]);

  // Hide active hints function
  const hideActiveHints = () => {
    if (progressiveHintRef.current && typeof progressiveHintRef.current.hideHint === 'function') {
      progressiveHintRef.current.hideHint();
    }
  };

  useEffect(() => {
  // Restore Mooshika's last known position on scene load
  if (sceneState.mooshikaVisible && sceneState.mooshikaLastPosition) {
    console.log('🐭 Restoring Mooshika position:', sceneState.mooshikaLastPosition);
    setMooshikaPosition(sceneState.mooshikaLastPosition);
  }
}, [sceneState.mooshikaVisible, sceneState.mooshikaLastPosition]);



  // GAMECOACH LOGIC - Keep identical to PondScene
  useEffect(() => {
    // 🚫 COMMENT OUT THIS ENTIRE BLOCK:
/*
console.log('🎯 MODAK GAMECOACH DEBUG:', {
  'sceneState exists': !!sceneState,
  'showMessage exists': !!showMessage,
  'welcomeShown': sceneState?.welcomeShown,
  'phase': sceneState?.phase,
  'gameCoachMessages length': gameCoachStoryMessages.length,
  'matching message': gameCoachStoryMessages.find(item => typeof item.condition === 'function' && item.condition()),  // ← THIS KILLS IT!
  'isReloadingGameCoach': sceneState?.isReloadingGameCoach
});
*/

// ✅ REPLACE WITH SIMPLE DEBUG:
console.log('🎯 MODAK GAMECOACH: Starting check');
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
      (sceneState.mooshikaWisdomShown && sceneState.readyForWisdom === false && 
       !sceneState.gameCoachState && Date.now() - (sceneState.lastGameCoachTime || 0) < 8000) ||
      (sceneState.modakWisdomShown && sceneState.readyForWisdom === false && 
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
        (matchingMessage.id === 'mooshika_wisdom' && sceneState.mooshikaWisdomShown && !isReloadRecovery) ||
        (matchingMessage.id === 'modak_wisdom' && sceneState.modakWisdomShown && !isReloadRecovery) ||
        (matchingMessage.id === 'belly_wisdom' && sceneState.bellyWisdomShown && !isReloadRecovery) ||
        (matchingMessage.id === 'mastery_wisdom' && sceneState.masteryShown && !isReloadRecovery) ||
        (matchingMessage.id === 'welcome' && sceneState.welcomeShown);
      
      if (messageAlreadyShown) {
        console.log(`🚫 GameCoach: ${matchingMessage.id} already shown this session`);
        return;
      }
      
      const timer = setTimeout(() => {
        console.log(`🎭 GameCoach: Showing ${matchingMessage.id} message (normal flow)`);
        
        console.log('🐭 DEBUG: matchingMessage.id =', matchingMessage.id);

        showMessage(matchingMessage.message, {
          duration: 8000,
          animation: 'bounce',
          position: 'top-right',
            source: 'scene',  // ← ADD THIS LINE
  messageType: getMessageType(matchingMessage.id)  // ← ADD THIS LINE
       });
        
        switch (matchingMessage.id) {
          case 'welcome':
            sceneActions.updateState({ welcomeShown: true });
            break;
          case 'mooshika_wisdom':
            sceneActions.updateState({ 
              mooshikaWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'mooshika_wisdom',
              lastGameCoachTime: Date.now()
            });
            setPendingAction('unlock-modaks');
            break;
          case 'modak_wisdom':
            sceneActions.updateState({ 
              modakWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'modak_wisdom',
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
          /*case 'mastery_wisdom':
            sceneActions.updateState({ 
              masteryShown: true,
              gameCoachState: 'mastery_wisdom',
              lastGameCoachTime: Date.now()
            });
            break;*/
        }
      }, matchingMessage.timing);
      
      return () => clearTimeout(timer);
    }
  }, [
    sceneState?.phase, 
    sceneState?.discoveredSymbols, 
    sceneState?.welcomeShown,
    sceneState?.mooshikaWisdomShown,
    sceneState?.modakWisdomShown,
    sceneState?.bellyWisdomShown,
    sceneState?.masteryShown,
    sceneState?.readyForWisdom,
    sceneState?.gameCoachState,
    sceneState?.symbolDiscoveryState,
    sceneState?.sidebarHighlightState,
    showMessage
  ]);

  // RELOAD LOGIC - Handle all interrupted states
// COMPLETELY REWRITTEN RELOAD LOGIC - Handles all ModakScene states
useEffect(() => {
  if (!isReload || !sceneState) return;
  
  console.log('🔄 RELOAD: Starting ModakScene reload sequence', {
    currentPopup: sceneState.currentPopup,
    gameCoachState: sceneState.gameCoachState,
    symbolDiscoveryState: sceneState.symbolDiscoveryState,
    sidebarHighlightState: sceneState.sidebarHighlightState,
    phase: sceneState.phase,
    discoveredSymbols: sceneState.discoveredSymbols
  });

  // IMMEDIATELY block GameCoach normal flow
  sceneActions.updateState({ isReloadingGameCoach: true });
  
  setTimeout(() => {
    
    // 🔥 PRIORITY 1: Handle active symbol discovery states first
    if (sceneState.symbolDiscoveryState) {
      console.log('🔄 Resuming symbol discovery:', sceneState.symbolDiscoveryState);
      
      switch(sceneState.symbolDiscoveryState) {
        case 'mooshika_discovering':
          // Ensure mounds are vanished for visual consistency
          if (sceneState.moundsVanishing && !sceneState.moundsVanished) {
            sceneActions.updateState({ moundsVanished: true });
          }
          
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
          return;
          
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
          return;
          
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
          return;
      }
    }
    
    // 🔥 PRIORITY 2: Handle sidebar highlight states
    else if (sceneState.sidebarHighlightState) {
      console.log('🔄 Resuming sidebar highlight:', sceneState.sidebarHighlightState);
      
      setTimeout(() => {
        if (sceneState.sidebarHighlightState === 'mooshika_highlighting') {
          showSymbolCelebration('mooshika');
        } else if (sceneState.sidebarHighlightState === 'modak_highlighting') {
          showSymbolCelebration('modak');
        } else if (sceneState.sidebarHighlightState === 'belly_highlighting') {
          showSymbolCelebration('belly');
        }
      }, 1000);
      
      sceneActions.updateState({ isReloadingGameCoach: false });
      return;
    }

    // 🔥 PRIORITY 3: Handle explicit popup states
    else if (sceneState.currentPopup) {
      console.log('🔄 Resuming popup:', sceneState.currentPopup);
      
      switch(sceneState.currentPopup) {
        case 'mooshika_info':
          setPopupBookContent({
            title: "Mooshika - Divine Vehicle",
            symbolImage: popupMooshika,
            description: "Mooshika is Ganesha's faithful mouse companion! Though small, he carries the mighty Ganesha, teaching us that no act of love or service is too small!"
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

        case 'belly_info':
          setPopupBookContent({
            title: "Ganesha's Cosmic Belly",
            symbolImage: popupBelly,
            description: "Ganesha's cosmic belly contains the entire universe! It represents his ability to digest all experiences and transform them into wisdom."
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
      return;
    }
    
    // 🔥 PRIORITY 4: Handle GameCoach states
    else if (sceneState.gameCoachState) {
      console.log('🔄 Resuming GameCoach:', sceneState.gameCoachState);
      
      switch(sceneState.gameCoachState) {
        case 'mooshika_wisdom':
          sceneActions.updateState({ 
            readyForWisdom: true,
            mooshikaWisdomShown: false,
            isReloadingGameCoach: false
          });
          setPendingAction('unlock-modaks');
          break;
          
        case 'modak_wisdom':
          sceneActions.updateState({ 
            readyForWisdom: true,
            modakWisdomShown: false,
            isReloadingGameCoach: false
          });
          setPendingAction('show-rock');
          break;
          
        case 'belly_wisdom':
          sceneActions.updateState({ 
            readyForWisdom: true,
            bellyWisdomShown: false,
            isReloadingGameCoach: false
          });
          setPendingAction('transform-rock');
          break;
          
        case 'mastery_wisdom':
          sceneActions.updateState({ 
            masteryShown: false,
            isReloadingGameCoach: false
          });
          break;
      }
      return;
    }

    // 🔥 PRIORITY 5: Handle mid-game states that need special attention
    
    // Handle partial rock feeding (normal state - no action needed)
    else if (sceneState.rockVisible && sceneState.rockFeedCount > 0 && sceneState.rockFeedCount < 5) {
      console.log('🔄 Resuming partial rock feeding - no special action needed');
      sceneActions.updateState({ isReloadingGameCoach: false });
      return;
    }

    // Handle incomplete mound transformation
    else if (sceneState.moundsVanishing && !sceneState.moundsVanished && !sceneState.symbolDiscoveryState) {
      console.log('🔄 Completing mound transformation and starting Mooshika discovery');
      sceneActions.updateState({ 
        moundsVanished: true,
        symbolDiscoveryState: 'mooshika_discovering',
        currentPopup: 'mooshika_info',
        isReloadingGameCoach: false
      });
      
      setPopupBookContent({
        title: "Mooshika - Divine Vehicle", 
        symbolImage: popupMooshika,
        description: "Mooshika is Ganesha's faithful mouse companion! Though small, he carries the mighty Ganesha, teaching us that no act of love or service is too small!"
      });
      setCurrentSourceElement('mooshika-1');
      setShowPopupBook(true);
      return;
    }

    // Handle incomplete rock transformation
    else if (sceneState.rockFeedingComplete && !sceneState.rockTransformed) {
      console.log('🔄 Resuming rock transformation to belly');
      
      setShowSparkle('belly-transform');
      
      safeSetTimeout(() => {
        sceneActions.updateState({
          rockTransformed: true,
          phase: PHASES.ROCK_TRANSFORMED,
          isReloadingGameCoach: false
        });
        
        safeSetTimeout(() => {
          sceneActions.updateState({
            symbolDiscoveryState: 'belly_discovering',
            currentPopup: 'belly_info'
          });
          
          setPopupBookContent({
            title: "Ganesha's Cosmic Belly",
            symbolImage: popupBelly,
            description: "Ganesha's cosmic belly contains the entire universe! It represents his ability to digest all experiences and transform them into wisdom."
          });
          setCurrentSourceElement('belly-1');
          setShowPopupBook(true);
          setShowSparkle(null);
        }, 2000);
        
      }, 2000);
      return;
    }

    // ⚠️ CRITICAL FIX: Handle phase states that shouldn't trigger symbol discovery
    else if (sceneState.phase === PHASES.MODAKS_UNLOCKED || 
             sceneState.phase === PHASES.SOME_COLLECTED || 
             sceneState.phase === PHASES.ROCK_VISIBLE || 
             sceneState.phase === PHASES.ROCK_FEEDING) {
      console.log('🔄 Normal mid-game state, no special reload needed:', sceneState.phase);
      sceneActions.updateState({ isReloadingGameCoach: false });
      return;
    }
    
    // ⚠️ CRITICAL FIX: Detect if all modaks collected but no discovery started
    else if ((sceneState.phase === PHASES.ALL_COLLECTED || 
              sceneState.modakStates?.every(state => state === 1)) && 
             !sceneState.discoveredSymbols?.modak &&
             !sceneState.symbolDiscoveryState &&
             !sceneState.currentPopup) {
      console.log('🔄 All modaks collected but discovery not started - triggering modak discovery');
      sceneActions.updateState({ 
        symbolDiscoveryState: 'modak_discovering',
        currentPopup: 'modak_info',
        isReloadingGameCoach: false
      });
      
      setPopupBookContent({
        title: "Ganesha's Favorite Sweet",
        symbolImage: popupModak,
        description: "Modaks are Ganesha's favorite sweets! These golden dumplings represent the sweetness of life and the rewards of spiritual devotion."
      });
      setCurrentSourceElement('modak-1');
      setShowPopupBook(true);
      return;
    }
    
    // 🔥 DEFAULT: No special reload handling needed
    else {
      console.log('🔄 No special reload needed, clearing flags');
      setTimeout(() => {
        sceneActions.updateState({ isReloadingGameCoach: false });
      }, 1500);
    }
    
  }, 500);
  
}, [isReload]);



  // 🎯 PHASE 1: Mud Mound Click Handler (Primary action) - UPDATED with Magical Transformation
  const handleMoundClick = (moundIndex) => {
    // 🔍 ADD THIS DEBUG LINE:
  console.log('🔧 DEBUG: handleMoundClick called', { 
    moundIndex, 
    sceneState: !!sceneState, 
    sceneActions: !!sceneActions,
    phase: sceneState?.phase,
    correctMound: sceneState?.correctMound
  });
    if (!sceneState || !sceneActions) return;
    
    console.log(`Mound ${moundIndex} clicked`);
    hideActiveHints();
    hideCoach();

    if (!sceneState.welcomeShown) {
      sceneActions.updateState({ welcomeShown: true });
    }
    
    if (sceneState.phase !== PHASES.MOOSHIKA_SEARCH) {
      return; // Only allow clicking during search phase
    }
    
    const moundStates = [...(sceneState.moundStates || [0, 0, 0, 0, 0])];
    moundStates[moundIndex - 1] = 1;
    
if (moundIndex === sceneState.correctMound) {
      // 🐭 SET INITIAL POSITION BASED ON MOUND:
      const moundPositions = {
        1: { top: '45%', left: '25%' },
        2: { top: '55%', left: '75%' },
        3: { top: '60%', left: '30%' },
        4: { top: '60%', left: '50%' },
        5: { top: '60%', left: '60%' }
      };
      
const initialPosition = moundPositions[moundIndex] || { top: '45%', left: '25%' };
setMooshikaPosition(initialPosition);

// 🌟 SAVE POSITION TO STATE FOR RELOAD
sceneActions.updateState({
  mooshikaLastPosition: initialPosition
});

      // Found Mooshika!
      console.log('🐭 Mooshika found!');
      setShowSparkle('mooshika-found');
      
      sceneActions.updateState({ 
        mooshikaVisible: true,
        mooshikaFound: true,
        moundStates,
        phase: PHASES.MOOSHIKA_FOUND,
        currentFocus: 'mooshika',
          moundsVanishing: true,
        progress: {
          ...sceneState.progress,
          percentage: 20,
          starsEarned: 1
        }
      });
      
      // 🌟 NEW: Start magical scene transformation sequence
      safeSetTimeout(() => {
        console.log('🌟 Starting magical scene transformation');
        
        // 1. Scene transformation sparkle
        setShowSparkle('scene-transformation');
        
        // 2. Fade out all mounds
        sceneActions.updateState({ 
          moundsVanishing: true  // Add this new state
        });
        
        // 3. FIXED: Save state immediately, then show UI after delay
sceneActions.updateState({ 
  moundsVanished: true,
  symbolDiscoveryState: 'mooshika_discovering',
  currentPopup: 'mooshika_info'
});

safeSetTimeout(() => {
  setPopupBookContent({
    title: "Mooshika - Divine Vehicle",
    symbolImage: popupMooshika,
    description: "Mooshika is Ganesha's faithful mouse companion! Though small, he carries the mighty Ganesha, teaching us that no act of love or service is too small!"
  });
  
  setCurrentSourceElement('mooshika-1');
  setShowPopupBook(true);
  setShowSparkle(null);
}, 1500); // Wait for mound fade-out animation
        
      }, 2000); // Wait for initial Mooshika celebration
    } else {
      // Wrong mound - gentle feedback
      setShowSparkle(`mound-${moundIndex}`);
      sceneActions.updateState({ moundStates });
      setTimeout(() => setShowSparkle(null), 1000);
    }
  };

  // 🎯 NEW: Handle modak dropped in basket
  const handleModakDrop = (dragData) => {
    const { id, data } = dragData;
    const modakIndex = data.index;
    
    console.log(`Modak ${modakIndex} dropped in basket`);
    hideActiveHints();
    hideCoach();

    // NEW: Add to collection array
  const newCollectedModaks = [...(sceneState.collectedModaks || [])];
  if (!newCollectedModaks.includes(modakIndex)) {
    newCollectedModaks.push(modakIndex);
  }
    
    const modakStates = [...(sceneState.modakStates || [0, 0, 0, 0, 0])];
    modakStates[modakIndex] = 1;
    
    setShowSparkle(`modak-${modakIndex}`);
    setTimeout(() => setShowSparkle(null), 1500);
    
const collectedCount = newCollectedModaks.length;  // ✅ Use the actual collection array    
    if (collectedCount === 5) {
      console.log('All modaks collected via drag & drop');
      sceneActions.updateState({ 
        modakStates,
            collectedModaks: newCollectedModaks,  // ✅ Make sure this is saved
        phase: PHASES.ALL_COLLECTED,
        basketFull: true,
        currentFocus: 'waiting-for-discovery',
        progress: {
          ...sceneState.progress,
          percentage: 60,
          starsEarned: 4
        }
      });
    } else {
      console.log(`${collectedCount} modaks collected`);
      sceneActions.updateState({ 
        modakStates,
              collectedModaks: newCollectedModaks,  // NEW: Save collection
        phase: PHASES.SOME_COLLECTED,
        progress: {
          ...sceneState.progress,
          percentage: 20 + (8 * collectedCount)
        }
      });
    }
  if (sceneState.mooshikaVisible && Math.random() < 0.5) { // 30% chance
  console.log('🐭 Mooshika celebrates modak collection!');
  // Simple sparkle effect instead of animation
  setShowSparkle('mooshika-happy');
  setTimeout(() => setShowSparkle(null), 1000);
}

  };

const handleRockFeed = (dragData) => {
  if (!sceneState.basketFull) {
    showMessage("Collect all modaks in the basket first!", {
      duration: 3000,
      animation: 'bounce',
      position: 'top-center'
    });
    return;
  }

// 🌟 ADD THESE LINES - Hide hints when feeding rock
  console.log('🪨 Feeding rock - hiding active hints');
  hideActiveHints();
  hideCoach();

  const { id, data } = dragData;
  
  // ✅ DECLARE VARIABLES OUTSIDE THE IF BLOCK
  let newCollectedModaks = [...(sceneState.collectedModaks || [])];
  let newFedModaks = [...(sceneState.fedModaks || [])];
  
  if (data.type === 'basket-modak') {
    // ✅ ADD TO FED MODAKS ARRAY
    if (!newFedModaks.includes(data.index)) {
      newFedModaks.push(data.index);
    }
    
    // ✅ REMOVE FROM COLLECTED MODAKS ARRAY
    const indexToRemove = newCollectedModaks.indexOf(data.index);
    if (indexToRemove > -1) {
      newCollectedModaks.splice(indexToRemove, 1);
    }
  }
  
  const newFeedCount = sceneState.rockFeedCount + 1;
  
  setShowSparkle('rock-feeding');
  
  // ✅ NOW BOTH VARIABLES ARE DEFINED
sceneActions.updateState({
  collectedModaks: newCollectedModaks,
  fedModaks: newFedModaks,
  rockFeedCount: newFeedCount,
  phase: PHASES.ROCK_FEEDING,
    ...(newFeedCount >= 5 && { rockFeedingComplete: true })
});
  
  console.log(`🧪 TESTING: Rock fed ${newFeedCount} times. Fed modaks:`, newFedModaks);
  
  if (newFeedCount >= 5) {
  // 🌟 FIXED: Save transformation intent immediately for reload
  sceneActions.updateState({ 
    rockFeedingComplete: true  // New flag for reload detection
  });
  
  // Rock fully fed - SMOOTH transformation
  safeSetTimeout(() => {
    console.log('🪨➡️🌌 Transforming rock to belly first');
    setShowSparkle('belly-transform');
    
    sceneActions.updateState({ 
      rockTransformed: true,
      phase: PHASES.ROCK_TRANSFORMED
    });
    
    // THEN start belly discovery after transformation - SMOOTH timing
    safeSetTimeout(() => {
      sceneActions.updateState({ 
        symbolDiscoveryState: 'belly_discovering',
        currentPopup: 'belly_info'
      });
      
      setPopupBookContent({
        title: "Ganesha's Cosmic Belly",
        symbolImage: popupBelly,
        description: "Ganesha's cosmic belly contains the entire universe! It represents his ability to digest all experiences and transform them into wisdom."
      });
      setCurrentSourceElement('belly-1');
      setShowPopupBook(true);
      setShowSparkle(null);
    }, 2000);  // Keep the smooth 2-second delay

  }, 2000);  // Keep the smooth 2-second delay

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
// ✅ ADD THIS: Save to permanent storage immediately
  const profileId = localStorage.getItem('activeProfileId');
  if (profileId) {
    GameStateManager.saveGameState('symbol-mountain', 'modak', {
      completed: true,
      stars: 8,
      symbols: { mooshika: true, modak: true, belly: true },
      phase: 'complete',
      timestamp: Date.now()
    });
    console.log('✅ MANUAL FINAL: Saved to permanent storage');
  }

  
    //GameStateManager.clearLastLocation();

  setShowSparkle('final-fireworks');
// ✅ ADD THIS LINE - Clear temp session so ZoneWelcome shows "Play Again"

  
  /*safeSetTimeout(() => {
    showMessage("Amazing! You've mastered all of Ganesha's garden symbols! You're now a true keeper of ancient wisdom!", {
      duration: 6000,
      animation: 'bounce',
      position: 'top-center'
    });
  }, 500);*/
  
safeSetTimeout(() => {
  sceneActions.updateState({ currentPopup: null });
  
  // ✅ ONLY show celebration - don't call onComplete yet
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
    
    if (cardContent.title?.includes("Mooshika Symbol")) {
      console.log('🐭 Mooshika card closed - continuing progression');
      
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'mooshika_wisdom'
        });
        setPendingAction('unlock-modaks');
      }, 1500);
    }
    
    else if (cardContent.title?.includes("Modak Symbol")) {
      console.log('🍯 Modak card closed - continuing progression');
      
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'modak_wisdom'
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

  // Show modak info after all collected (auto-trigger)
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
        description: "Modaks are Ganesha's favorite sweets! These golden dumplings represent the sweetness of life and the rewards of spiritual devotion."
      });
      
      setCurrentSourceElement('modak-1');
      
      safeSetTimeout(() => {
        setShowPopupBook(true);
      }, 500);
    }
  }, [sceneState?.phase, sceneState?.modakStates, sceneActions]);

  // 🎯 GENTLE GAMECOACH FIX - Add this to BOTH scene files
// Add this useEffect at the end of your existing useEffect hooks

// 🛡️ GENTLE: Hide GameCoach when navigating away (don't destroy it)
/*useEffect(() => {
  return () => {
    console.log('🧹 GENTLE CLEANUP: Hiding active GameCoach messages');
    
    // Only hide active messages - don't destroy GameCoach
    if (hideCoach) {
      hideCoach();
    }
    
    // Clear any pending scene-specific actions
    setPendingAction(null);
    
    console.log('✅ GENTLE CLEANUP: GameCoach messages hidden');
  };
}, []); // Empty dependency array - only runs on unmount*/

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
    return modak; // Same image for now
  };

  const getBasketImage = () => {
    return basket;
  };

  const getMooshikaImage = () => {
    return mooshika;
  };

  const getRockImage = () => {
    return sceneState?.rockTransformed ? belly : rock;
  };

  // Mooshika animation controller
const getMooshikaAnimationClass = () => {
  if (!sceneState.mooshikaVisible) return '';
  
  if (mooshikaAnimation === 'happy') return 'happy';
  if (mooshikaAnimation === 'scurrying') return 'scurrying';
  if (mooshikaAnimation === 'ear-twitch') return 'ear-twitch breathing';
  
  return 'breathing'; // Default animation
};

 const renderCounter = () => {
  if (!sceneState.modaksUnlocked) return null;
  
  const collectedCount = sceneState?.collectedModaks?.length || 0;  // NEW: Use collection array
  
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
            
            
            {/* 🎯 MUD MOUNDS - Only show if not vanished */}
            {!sceneState.moundsVanished && [1, 2, 3, 4, 5].map((index) => (
              <div key={index} className={`mud-mound mound-${index} ${sceneState.moundsVanishing ? 'fade-out' : ''}`}>
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

            {/* Scene transformation sparkle */}
            {showSparkle === 'scene-transformation' && (
              <div className="scene-transformation-sparkle">
                <SparkleAnimation
                  type="magic"
                  count={50}
                  color="#FFD700"
                  size={15}
                  duration={2000}
                  fadeOut={true}
                  area="full"
                />
              </div>
            )}
            
{sceneState.mooshikaVisible && (
  <FreeDraggableItem
    id="mooshika-companion"
    position={mooshikaPosition}
    onPositionChange={(newPosition) => {
      console.log('🐭 Mooshika moved to:', newPosition);
      setMooshikaPosition(newPosition);
      
      // Save position in scene state
      sceneActions.updateState({
        mooshikaLastPosition: newPosition
      });
    }}
    onDragStart={() => {
      console.log('🐭 Mooshika drag started');
      setMooshikaDragging(true);
        setShowMooshikaSpeech(false); // ✅ ADD THIS LINE
      hideActiveHints();
    }}
    onDragEnd={() => {
      console.log('🐭 Mooshika drag ended');
      setMooshikaDragging(false);

      // ✅ ADD: Happy dance after drop
  setMooshikaAnimation('happy');
  setTimeout(() => {
    setMooshikaAnimation('breathing');
  }, 800);
    }}
    disabled={!sceneState.mooshikaFound}
className={`mooshika-container ${getMooshikaAnimationClass()}`}    style={{
      width: '60px',
      height: '60px'
    }}
    bounds={{ top: 5, left: 5, right: 90, bottom: 90 }}
  >
    <img 
      src={getMooshikaImage()}
      alt={sceneState.mooshikaFound ? "Mooshika - Drag me around!" : "Mooshika"}
      style={{ 
        width: '100%', 
        height: '100%',
        filter: mooshikaDragging ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255, 105, 180, 0.8))' : 'none',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
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

   {showSparkle === 'mooshika-happy' && (
  <div style={{
    position: 'fixed',
    top: mooshikaPosition.top,
    left: mooshikaPosition.left,
    width: '60px',
    height: '60px',
    zIndex: 25,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  }}>
    <SparkleAnimation
      type="star"
      count={10}
      color="#ff69b4"
      size={8}
      duration={1000}
      fadeOut={true}
      area="full"
    />
  </div>
)}

{showMooshikaSpeech && (
  <div className="mooshika-speech-bubble">
    <div className="speech-content">
      {mooshikaSpeechMessage}
    </div>
    <div className="speech-arrow"></div>
  </div>
)}
  </FreeDraggableItem>
)}

{/* 🎯 MODAKS - Draggable when unlocked (FIXED VERSION) */}
{sceneState.modaksUnlocked && [0, 1, 2, 3, 4].map((index) => {
  const isCollected = (sceneState.collectedModaks || []).includes(index);
  const isFed = (sceneState.fedModaks || []).includes(index);
  
  // ✅ FIX: Check BOTH conditions
  if (isCollected || isFed) {
    return null;
  }
  
  // Only render if NOT collected AND NOT fed
  return (
    <div key={index} className={`modak modak-${index + 1}`}>
      <DraggableItem
        id={`modak-${index}`}
        data={{ type: 'modak', index: index }}
        onDragStart={(id, data) => console.log('Dragging:', id, data)}
        onDragEnd={(id) => console.log('Drag ended:', id)}
      >
        <img 
          src={getModakImage(index)}
          alt={`Modak ${index + 1}`}
          style={{ width: '100%', height: '100%' }}
        />
      </DraggableItem>
      
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
  );
})}
            
            {/* Modaks unlock sparkle */}
            {showSparkle === 'modaks-unlock' && (
              <div className="all-modaks-sparkle">
                <SparkleAnimation
                  type="glitter"
                  count={30}
                  color="gold"
                  size={12}
                  duration={2000}
                  fadeOut={true}
                  area="full"
                />
              </div>
            )}
            
           {/* 🧺 SIMPLIFIED: Basket without nested modaks */}
{sceneState.basketVisible && (
<div className={`basket-collection-container ${sceneState.basketFull ? 'full' : ''}`}>    
    <DropZone
      id="modak-basket"
      acceptTypes={['modak']}
      onDrop={handleModakDrop}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img 
          src={basket}
          alt="Collection Basket"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Collection counter */}
        <div className="basket-counter">
          {(sceneState.collectedModaks || []).length}/5
        </div>
      </div>
    </DropZone>
  </div>
)}

{/* ✅ NEW: Render collected modaks as separate scene elements (like Phase 2 modaks) */}

{/* ✅ NEW: Render collected modaks exactly like Phase 2 modaks */}
{sceneState.basketVisible && (sceneState.collectedModaks || []).map((modakIndex, displayIndex) => (
  <div 
    key={`collected-${modakIndex}`}
    className={`modak modak-collected-${displayIndex + 1}`}  // ✅ Use same 'modak' class as Phase 2
    style={{
      zIndex: 15
    }}
  >
    <DraggableItem
      id={`basket-modak-${modakIndex}`}
      data={{ type: 'basket-modak', index: modakIndex }}
      onDragStart={(id, data) => console.log('Dragging from basket:', id, data)}
      onDragEnd={(id) => console.log('Basket drag ended:', id)}
    >
      <img 
        src={modak} 
        alt={`Collected Modak ${modakIndex + 1}`}
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: 'grab'
        }}
      />
    </DraggableItem>
  </div>
))}

          {/* ✅ Phase 3: Fed modaks around rock - Use fedModaks array */}
{sceneState.rockVisible && (sceneState.fedModaks || []).map((fedModakIndex, displayIndex) => (
  <div 
    key={`fed-modak-${fedModakIndex}`}
    className={`modak fed-modak-${displayIndex + 1}`}
    style={{ zIndex: 9 }}
  >
    <img 
      src={modak} 
      alt={`Fed Modak ${fedModakIndex + 1}`}
      style={{ 
        width: '100%', 
        height: '100%',
        filter: 'brightness(1.1) saturate(1.2)'
      }}
    />
  </div>
))}

            {/* 🎯 ROCK/BELLY - Drop zone for feeding */}
            {sceneState.rockVisible && (
<div className="rock-container breathing">
    <DropZone
                  id="feeding-rock"
                  acceptTypes={['basket-modak', 'modak']}
                  onDrop={handleRockFeed}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px dashed transparent'
                  }}
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

                  {/* Show feeding progress */}
                  <div className="rock-feed-count" style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {sceneState.rockFeedCount || 0}/5
                  </div>
                </DropZone>
                
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

            {/* 🧪 COMPLETION TEST BUTTON */}
<div style={{
  position: 'fixed',
  top:' 170px',
  right: '10px',
  zIndex: 9999,
  background: 'purple',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
}} onClick={() => {
  console.log('🧪 MODAK COMPLETION TEST CLICKED');
  sceneActions.updateState({
    // Set all phases complete
    moundStates: [1, 1, 1, 1, 1],
    correctMound: 1,
    mooshikaVisible: true,
    mooshikaFound: true,
    moundsVanished: true,
    moundsVanishing: false,
    
    // All modaks collected and fed
    modakStates: [1, 1, 1, 1, 1],
    collectedModaks: [],  // All fed to rock
    fedModaks: [0, 1, 2, 3, 4],  // All 5 modaks fed
    modaksUnlocked: true,
    basketVisible: true,
    basketFull: false,  // Empty because all fed
    
    // Rock fully transformed
    rockVisible: true,
    rockFeedCount: 5,
    rockTransformed: true,
    rockFeedingComplete: true,
    
    // All symbols discovered
    discoveredSymbols: {
      mooshika: true,
      modak: true,
      belly: true
    },
    
    // All messages shown
    welcomeShown: true,
    mooshikaWisdomShown: true,
    modakWisdomShown: true,
    bellyWisdomShown: true,
    masteryShown: false,  // Will trigger final message
    
    // Set to final phase
    phase: PHASES.COMPLETE,
    currentFocus: 'complete',
    
    // COMPLETION DATA
    completed: true,
    stars: 8,
    progress: {
      percentage: 100,
      starsEarned: 8,
      completed: true
    },
    
    // Clear popup states
    currentPopup: null,
    symbolDiscoveryState: null,
    gameCoachState: null,
    isReloadingGameCoach: false
  });
  
  // Clear all UI states
  setShowSparkle(null);
  setShowPopupBook(false);
  setShowMagicalCard(false);
  setShowSceneCompletion(false);
  
  // Trigger final celebration
  setTimeout(() => {
    showSymbolCelebration('final');
  }, 1000);
}}>
  COMPLETE
</div>

{/* 🆘 EMERGENCY: Start Fresh Button */}
<div style={{
  position: 'fixed',
  top: '20px',
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
  if (confirm('Start this scene from the beginning? You will lose current progress.')) {
    console.log('🔄 MODAK EMERGENCY RESTART: User chose to start fresh');
    
    // 1. FIRST: Clear all UI states immediately
    setShowSparkle(null);
    setShowPopupBook(false);
    setShowMagicalCard(false);
    setShowSceneCompletion(false);
    setCurrentSourceElement(null);
    setPopupBookContent({});
    setCardContent({});
    setPendingAction(null);
    setShowMooshikaSpeech(false);
    setMooshikaSpeechMessage('');
    setMooshikaAnimation('breathing');
    setMooshikaPosition({ top: '45%', left: '25%' });
    setMooshikaDragging(false);
    
    // 2. THEN: Reset scene state after UI cleared
    setTimeout(() => {
      sceneActions.updateState({
        // Reset all Modak-specific states
        moundStates: [0, 0, 0, 0, 0],
        correctMound: Math.floor(Math.random() * 5) + 1,
        mooshikaVisible: false,
        mooshikaFound: false,
        mooshikaDragHintShown: false,
        mooshikaLastPosition: { top: '45%', left: '25%' },
        moundsVanished: false,
        moundsVanishing: false,
        
        modakStates: [0, 0, 0, 0, 0],
        modaksUnlocked: false,
        basketVisible: false,
        basketFull: false,
        collectedModaks: [],
        fedModaks: [],
        
        rockVisible: false,
        rockFeedCount: 0,
        rockTransformed: false,
        rockFeedingComplete: false,
        
        phase: PHASES.MOOSHIKA_SEARCH,
        currentFocus: 'mooshika',
        discoveredSymbols: {},

        welcomeShown: false,           // ← ENSURE THIS IS FALSE
    isReloadingGameCoach: false,   // ← ENSURE THIS IS FALSE
    gameCoachState: null,          // ← CLEAR ANY COACH STATE
           
        // Clear all message flags
        welcomeShown: false,
        mooshikaWisdomShown: false,
        modakWisdomShown: false,
        bellyWisdomShown: false,
        masteryShown: false,
        readyForWisdom: false,
        
        // Clear reload states
        currentPopup: null,
        symbolDiscoveryState: null,
        sidebarHighlightState: null,
        gameCoachState: null,
        isReloadingGameCoach: false,
        lastGameCoachTime: 0,
        
        // Reset progress
        stars: 0,
        completed: false,
        progress: {
          percentage: 0,
          starsEarned: 0,
          completed: false
        }
      });
    }, 100);
    
    // 3. FINALLY: Hide GameCoach if active
    if (hideCoach) {
      hideCoach();
    }
  }
}}>
  🔄 Start Fresh
</div>

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
          {showMagicalCard && (cardContent.title?.includes("Mooshika Symbol") || cardContent.title?.includes("Modak Symbol") || cardContent.title?.includes("Belly Symbol")) && (
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

          {showSparkle === 'final-fireworks' && (
  <Fireworks
  show={true}
  duration={8000}
  onComplete={() => {
    console.log('🎯 Fireworks complete');
    setShowSparkle(null);
    
    // 🎯 ADD COMPLETION PATTERN HERE
    const profileId = localStorage.getItem('activeProfileId');
    if (profileId) {
      GameStateManager.saveGameState('symbol-mountain', 'modak', {
        completed: true,
        stars: 8,
        symbols: { mooshika: true, modak: true, belly: true },
        phase: 'complete',
        timestamp: Date.now()
      });
      
      localStorage.removeItem(`temp_session_${profileId}_symbol-mountain_modak`);
      console.log('✅ MODAK: Completion saved and temp session cleared');
    }
    
    // Then show scene completion UI
    setTimeout(() => {
      setShowSceneCompletion(true);
    }, 500);
  }}
/>

)}

          <SceneCompletionCelebration
  show={showSceneCompletion}
  sceneName="Garden Adventure"
  sceneNumber={1}
  totalScenes={4}
  starsEarned={8}
  totalStars={8}
  discoveredSymbols={['mooshika', 'modak', 'belly']}
  symbolImages={{
  mooshika: symbolMooshikaColored,
  modak: symbolModakColored,
  belly: symbolBellyColored
}}
  nextSceneName="Temple Discovery"
  sceneId="modak"                    // ← ADD THIS LINE
  completionData={{                  // ← ADD THIS BLOCK
    stars: 8,
    symbols: { mooshika: true, modak: true, belly: true },
    completed: true,
    totalStars: 8
  }}

    onComplete={onComplete}  // ← ADD THIS LINE

onReplay={() => {
  console.log('🔧 PLAY AGAIN: Using Start Fresh logic');
    console.log('🔧 PLAY AGAIN: onReplay started'); // ← ADD THIS

  // Wait a moment, then restart using proven Start Fresh logic
  setTimeout(() => {// 1. FIRST: Clear all UI states immediately
        console.log('🔧 PLAY AGAIN: About to clear UI states'); // ← ADD THIS

    setShowSparkle(null);
    setShowPopupBook(false);
    setShowMagicalCard(false);
    setShowSceneCompletion(false);
    setCurrentSourceElement(null);
    setPopupBookContent({});
    setCardContent({});
    setPendingAction(null);
    setShowMooshikaSpeech(false);
    setMooshikaSpeechMessage('');
    setMooshikaAnimation('breathing');
    setMooshikaPosition({ top: '45%', left: '25%' });
    setMooshikaDragging(false);
        console.log('🔧 PLAY AGAIN: UI states cleared'); // ← ADD THIS

    
    // 2. THEN: Reset scene state after UI cleared
    setTimeout(() => {
            console.log('🔧 PLAY AGAIN: About to reset scene state'); // ← ADD THIS
      sceneActions.updateState({
        // Reset all Modak-specific states
        moundStates: [0, 0, 0, 0, 0],
        correctMound: Math.floor(Math.random() * 5) + 1,
        mooshikaVisible: false,
        mooshikaFound: false,
        mooshikaDragHintShown: false,
        mooshikaLastPosition: { top: '45%', left: '25%' },
        moundsVanished: false,
        moundsVanishing: false,
        
        modakStates: [0, 0, 0, 0, 0],
        modaksUnlocked: false,
        basketVisible: false,
        basketFull: false,
        collectedModaks: [],
        fedModaks: [],
        
        rockVisible: false,
        rockFeedCount: 0,
        rockTransformed: false,
        rockFeedingComplete: false,
        
        phase: PHASES.MOOSHIKA_SEARCH,
        currentFocus: 'mooshika',
        discoveredSymbols: {},
        welcomeShown: false,           // ← ENSURE THIS IS FALSE
    isReloadingGameCoach: false,   // ← ENSURE THIS IS FALSE
    gameCoachState: null,          // ← CLEAR ANY COACH STATE
    
        // Clear all message flags
        welcomeShown: false,
        mooshikaWisdomShown: false,
        modakWisdomShown: false,
        bellyWisdomShown: false,
        masteryShown: false,
        readyForWisdom: false,
        
        // Clear reload states
        currentPopup: null,
        symbolDiscoveryState: null,
        sidebarHighlightState: null,
        gameCoachState: null,
        isReloadingGameCoach: false,
        lastGameCoachTime: 0,
        
        // Reset progress
        stars: 0,
        completed: false,
        progress: {
          percentage: 0,
          starsEarned: 0,
          completed: false
        }
      });
            console.log('🔧 PLAY AGAIN: Scene state reset complete'); // ← ADD THIS
    }, 100);

// Hide GameCoach
  if (hideCoach) {
    hideCoach();
  }
  
  // ✅ CRITICAL: Clear GameCoach persistent state
  if (clearManualCloseTracking) {
    clearManualCloseTracking();
    console.log('✅ ModakScene: GameCoach persistent state cleared');
  }
}, 500);
}} // ← ADD THIS MISSING CLOSING BRACKET AND COMMA

    
  


  onContinue={() => {
  console.log('🔧 SCENE CONTINUE: Saving data and navigating');
  
  // Save completion data manually (same as onComplete would do)
  const profileId = localStorage.getItem('activeProfileId');
  if (profileId) {
    ProgressManager.updateSceneCompletion(
      profileId, 
      'symbol-mountain', 
      'modak', 
      {
        completed: true,
        stars: 8,
        symbols: { mooshika: true, modak: true, belly: true }
      }
    );
    
    // Also save with GameStateManager for consistency
    GameStateManager.saveGameState('symbol-mountain', 'modak', {
      completed: true,
      stars: 8,
      symbols: { mooshika: true, modak: true, belly: true }
    });
  }

  // ✅ Clear GameCoach persistent state before navigation
  if (clearManualCloseTracking) {
    clearManualCloseTracking();
    console.log('✅ CONTINUE: GameCoach persistent state cleared');
  }

  
  // Navigate directly to next scene
  setTimeout(() => {
    onNavigate?.('next-scene'); // No zone-welcome involved!
  }, 100);
}}
/>

        </div>       
      </MessageManager>
    </InteractionManager>
  );
};

export default NewModakScene