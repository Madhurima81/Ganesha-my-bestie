// zones/symbol-mountain/scenes/pond/PondSceneSimplified.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PondScene.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import { ClickableElement } from "../../../../lib/components/scenes/InteractionManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach, TriggerCoach } from '../../../../lib/components/coach/GameCoach';
import ProgressManager from '../../../../lib/services/ProgressManager';

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
import pondBackground from './assets/images/pond-background.png';
import lotusClosed from './assets/images/lotus-closed.png';
import lotusBloomed from './assets/images/lotus-bloomed.png';
import goldenLotusClosed from './assets/images/golden-lotus-closed.png';
import goldenLotusBloomed from './assets/images/golden-lotus-bloomed.png';
import elephantFull from './assets/images/elephant-full.png';
import waterElephant from './assets/images/water-elephant.png';
import popup1 from './assets/images/popup-1.png';
import popupGolden from './assets/images/popup-golden.png';
import popupTrunk from './assets/images/popup-trunk.png';
import mooshikaCoach from "./assets/images/mooshika-coach.png";

const PHASES = {
  INITIAL: 'initial',
  SOME_BLOOMED: 'some_bloomed',
  ALL_BLOOMED: 'all_bloomed',
  GOLDEN_VISIBLE: 'golden_visible',
  GOLDEN_POPUP: 'golden_popup',
  ELEPHANT_VISIBLE: 'elephant_visible',
  ELEPHANT_TRANSFORMED: 'elephant_transformed',
  GOLDEN_BLOOM: 'golden_bloom',
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

const PondSceneSimplified = ({ 
  onComplete, 
  onNavigate, 
  zoneId = 'symbol-mountain', 
  sceneId = 'pond' 
}) => {
  console.log('PondSceneSimplified props:', { onComplete, onNavigate, zoneId, sceneId });

  // 🧪 ADD THIS DEBUG
  console.log('🧪 POND WRAPPER PROPS DEBUG:');
  console.log('🧪 onComplete received by wrapper:', !!onComplete);
  console.log('🧪 onComplete type:', typeof onComplete);
  console.log('🧪 onComplete function:', onComplete);

  return (
    <ErrorBoundary>
      <SceneManager
        zoneId={zoneId}
        sceneId={sceneId}
        initialState={{
          lotusStates: [0, 0, 0],
          goldenLotusVisible: false,
          goldenLotusBloom: false,
          elephantVisible: false,
          elephantTransformed: false,
          trunkActive: false,
          waterDrops: [],
          celebrationStars: 0,
          phase: 'initial',
          currentFocus: 'lotus',
          discoveredSymbols: {},
          // Message flags to prevent duplicates
          welcomeShown: false,
          lotusWisdomShown: false,
          elephantWisdomShown: false,
          masteryShown: false,
          readyForWisdom: false,
          
          // FIXED RELOAD SYSTEM - Better state tracking
          currentPopup: null,  // 'lotus_info', 'lotus_card', 'elephant_info', 'trunk_card', 'final_fireworks'
          
          // Symbol discovery state tracking
          symbolDiscoveryState: null,  // 'lotus_discovering', 'trunk_discovering'
          sidebarHighlightState: null,  // 'lotus_highlighting', 'trunk_highlighting'
          
          // GameCoach reload tracking
          gameCoachState: null,  // 'lotus_wisdom', 'elephant_wisdom', 'mastery_wisdom'
          isReloadingGameCoach: false,
          lastGameCoachTime: 0,  // Timestamp tracking for duplicates
          
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
          <PondSceneContent 
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

const PondSceneContent = ({ 
  sceneState, 
  sceneActions, 
  isReload, 
  onComplete, 
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('PondSceneContent render', { sceneState, isReload, zoneId, sceneId });

  // 🧪 ADD THIS DEBUG
  console.log('🧪 POND CONTENT PROPS DEBUG:');
  console.log('🧪 onComplete received by content:', !!onComplete);
  console.log('🧪 onComplete type:', typeof onComplete);

  if (!sceneState?.phase) sceneActions.updateState({ phase: 'initial' });

  // Access GameCoach functionality
  const { showMessage, hideCoach, isVisible } = useGameCoach();

  const [showSparkle, setShowSparkle] = useState(null);
  const [activePopup, setActivePopup] = useState(-1);
  const [popupAnimation, setPopupAnimation] = useState('');
  const [currentSourceElement, setCurrentSourceElement] = useState(null);
  const [showPopupBook, setShowPopupBook] = useState(false);
  const [popupBookContent, setPopupBookContent] = useState({});
  const [showMagicalCard, setShowMagicalCard] = useState(false);
  const [cardContent, setCardContent] = useState({});
  
  // Timeouts ref for cleanup
  const timeoutsRef = useRef([]);
  const progressiveHintRef = useRef(null);
  const [hintUsed, setHintUsed] = useState(false);

  // Water drop management
  const activeDropsRef = useRef(new Set());
  const MAX_WATER_DROPS = 15;

  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Add this ref at the top with your other refs
  const previousVisibilityRef = useRef(false);

  // DISNEY-STYLE GAMECOACH MESSAGES - UPDATED with reload prevention
  const gameCoachStoryMessages = [
    {
      id: 'welcome',
      message: "Welcome to Ganesha's magical world! You're about to discover ancient secrets!",
      timing: 500,
      condition: () => sceneState?.phase === PHASES.INITIAL && !sceneState?.welcomeShown && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'lotus_wisdom',
      message: "Wonderful! Like the lotus, you're growing wiser! Ganesha would be proud!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.lotus && !sceneState?.lotusWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'elephant_wisdom',
      message: "Amazing! You've learned about Ganesha's strength and kindness!",
      timing: 1000,
      condition: () => sceneState?.discoveredSymbols?.trunk && !sceneState?.elephantWisdomShown && sceneState?.readyForWisdom && !sceneState?.isReloadingGameCoach
    },
    {
      id: 'mastery_wisdom',
      message: "You've become a keeper of Ganesha's wisdom! Ready for your next adventure?",
      timing: 1000,
      condition: () => sceneState?.phase === PHASES.COMPLETE && !sceneState?.masteryShown && !sceneState?.isReloadingGameCoach
    }
  ];

  const getHintConfigs = () => [
    {
      id: 'lotus-hint',
      message: 'Try clicking on the lotus flowers!',
      explicitMessage: 'Click on all three lotus flowers to make them bloom!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        const lotusStates = sceneState.lotusStates || [0, 0, 0];
        return !lotusStates.every(state => state === 1) && 
               !showMagicalCard &&
               !isVisible &&
               !showPopupBook;
      }
    },
    {
      id: 'golden-hint',
      message: 'The golden lotus holds a secret!',
      explicitMessage: 'Click on the golden lotus to discover its power!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        return sceneState.goldenLotusVisible && 
              !sceneState.goldenLotusBloom &&
              !sceneState.elephantVisible &&
              !showMagicalCard &&
              !isVisible &&
              !showPopupBook;
      }
    },
    {
      id: 'elephant-hint',
      message: 'The elephant wants to show you something!',
      explicitMessage: 'Click on the elephant to see what it can do!',
      position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        return sceneState.elephantVisible && 
              !sceneState.elephantTransformed && 
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
      activeDropsRef.current.clear();
    };
  }, []);

  // Watch for GameCoach visibility changes to trigger pending actions - PRESERVED ORIGINAL
  useEffect(() => {
    if (previousVisibilityRef.current && !isVisible && pendingAction) {
      console.log(`🎬 GameCoach closed, executing pending action: ${pendingAction}`);
      
      const actionTimer = setTimeout(() => {
        switch (pendingAction) {
          case 'show-golden-lotus':
            console.log('🌟 Showing golden lotus after GameCoach wisdom');
            setShowSparkle('all-lotuses');
            
            safeSetTimeout(() => {
              sceneActions.updateState({ 
                goldenLotusVisible: true,
                phase: PHASES.GOLDEN_VISIBLE,
                currentFocus: 'golden',
                gameCoachState: null,  // Clear GameCoach state after action
                isReloadingGameCoach: false
              });
              
              setShowSparkle('golden-lotus');
              safeSetTimeout(() => setShowSparkle(null), 2000);
            }, 1000);
            break;
            
          case 'bloom-golden-lotus':
            console.log('🌸 Blooming golden lotus after GameCoach wisdom');
            setShowSparkle('golden-lotus-bloom');
            
            safeSetTimeout(() => {
              sceneActions.updateState({
                goldenLotusBloom: true,
                phase: PHASES.GOLDEN_BLOOM,
                gameCoachState: null,  // Clear GameCoach state after action
                isReloadingGameCoach: false
              });
              setShowSparkle(null);
              
              safeSetTimeout(() => {
                showSymbolCelebration('golden');
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

  // Discover symbol function
  const discoverSymbol = (symbolId) => {
    if (!sceneState || !sceneActions) return;
    
    const newSymbols = { 
      ...(sceneState.discoveredSymbols || {}), 
      [symbolId]: true 
    };
    
    const discoveredCount = Object.keys(newSymbols).length;
    const totalSymbols = 3;
    const percentage = Math.round((discoveredCount / totalSymbols) * 100);
    
    sceneActions.updateState({ 
      discoveredSymbols: newSymbols,
      progress: {
        ...sceneState.progress,
        percentage: percentage,
        starsEarned: discoveredCount * 2
      }
    });
  };

  // FIXED GAMECOACH LOGIC - Better duplicate prevention with timestamps
  useEffect(() => {
    if (!sceneState || !showMessage) return;
    
    // Block during active reload process
    if (sceneState.isReloadingGameCoach) {
      console.log('🚫 GameCoach blocked: Reload in progress');
      return;
    }
    
    // Prevent messages during symbol discovery sequence
    if (sceneState.symbolDiscoveryState) {
      console.log('🚫 GameCoach blocked: Symbol discovery in progress');
      return;
    }

    // Block during sidebar highlight sequence
    if (sceneState.sidebarHighlightState) {
      console.log('🚫 GameCoach blocked: Sidebar highlighting in progress');
      return;
    }

    // ADD THIS DEBUG CODE HERE:
console.log('🔍 GameCoach Debug:', {
  phase: sceneState?.phase,
  lotusDiscovered: sceneState?.discoveredSymbols?.lotus,
  lotusWisdomShown: sceneState?.lotusWisdomShown,
  readyForWisdom: sceneState?.readyForWisdom,
  isReloadingGameCoach: sceneState?.isReloadingGameCoach,
  gameCoachState: sceneState?.gameCoachState
});

      const isReloadRecovery = sceneState.isReloadingGameCoach;


    // IMPROVED: Block if GameCoach message was recently shown (timestamp-based)
    const recentlyFinishedGameCoach = 
      (sceneState.lotusWisdomShown && sceneState.readyForWisdom === false && 
       !sceneState.gameCoachState && Date.now() - (sceneState.lastGameCoachTime || 0) < 8000) ||
      (sceneState.elephantWisdomShown && sceneState.readyForWisdom === false && 
       !sceneState.gameCoachState && Date.now() - (sceneState.lastGameCoachTime || 0) < 8000);

    if (recentlyFinishedGameCoach) {
      console.log('🚫 GameCoach: Recently finished message, preventing duplicate');
      return;
    }
    
    const matchingMessage = gameCoachStoryMessages.find(
      item => typeof item.condition === 'function' && item.condition()
    );
    
    if (matchingMessage) {
      // Check if this specific message was already shown in this session
     // Check if this specific message was already shown
const messageAlreadyShown = 
  (matchingMessage.id === 'lotus_wisdom' && sceneState.lotusWisdomShown && !isReloadRecovery) ||
  (matchingMessage.id === 'elephant_wisdom' && sceneState.elephantWisdomShown && !isReloadRecovery) ||
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
        
        // Mark message as shown and set GameCoach state for reload tracking
        switch (matchingMessage.id) {
          case 'welcome':
            sceneActions.updateState({ 
              welcomeShown: true 
            });
            break;
          case 'lotus_wisdom':
            sceneActions.updateState({ 
              lotusWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'lotus_wisdom',
              lastGameCoachTime: Date.now()  // Add timestamp
            });
            setPendingAction('show-golden-lotus');
            break;
          case 'elephant_wisdom':
            sceneActions.updateState({ 
              elephantWisdomShown: true, 
              readyForWisdom: false,
              gameCoachState: 'elephant_wisdom',
              lastGameCoachTime: Date.now()  // Add timestamp
            });
            setPendingAction('bloom-golden-lotus');
            break;
          case 'mastery_wisdom':
            sceneActions.updateState({ 
              masteryShown: true,
              gameCoachState: 'mastery_wisdom',
              lastGameCoachTime: Date.now()  // Add timestamp
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
    sceneState?.lotusWisdomShown,
    sceneState?.elephantWisdomShown,
    sceneState?.masteryShown,
    sceneState?.readyForWisdom,
    //sceneState?.isReloadingGameCoach,
    sceneState?.gameCoachState,
    sceneState?.symbolDiscoveryState,
    sceneState?.sidebarHighlightState,
    //isReload,
    showMessage
  ]);

  // Water Drop Creation
  const createWaterDrop = () => {
    if (!sceneActions || !sceneState) return;
    
    if (activeDropsRef.current.size >= MAX_WATER_DROPS) {
      return;
    }
    
    const id = Date.now() + Math.random();
    activeDropsRef.current.add(id);
    
    const size = Math.floor(Math.random() * 4) + 2;
    const speedFactor = Math.random() * 0.4 + 0.8;
    
    const trunkRight = 25;
    const trunkBottom = 52;
    const deltaX = (trunkRight + 35);
    const deltaY = (trunkBottom - 55);
    
    const spreadX = Math.random() * 8 - 4;
    const spreadY = Math.random() * 6 - 3;
    const arcHeight = Math.random() * 12 + 8;
    
    const newDrop = { 
      id, 
      size, 
      speedFactor,
      startRight: trunkRight + spreadX,
      startBottom: trunkBottom + spreadY,
      deltaX: deltaX + spreadX,
      deltaY: deltaY + spreadY,
      arcHeight: arcHeight,
      duration: speedFactor * 1.5,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.7
    };
    
    const currentDrops = [...(sceneState.waterDrops || [])];
    sceneActions.updateState({ waterDrops: [...currentDrops, newDrop] });
    
    safeSetTimeout(() => {
      activeDropsRef.current.delete(id);
      sceneActions.updateState({ 
        waterDrops: (sceneState.waterDrops || []).filter(drop => drop.id !== id)
      });
    }, newDrop.duration * 1000 + 500);
  };

  // Show lotus info after all bloom
  useEffect(() => {
    if (!sceneState || !sceneActions) return;
    
    if ((sceneState.phase === PHASES.ALL_BLOOMED || 
         sceneState.lotusStates?.every(state => state === 1)) && 
        sceneState.currentPopup !== 'lotus_info' && 
        !sceneState.discoveredSymbols?.lotus &&
        !sceneState.symbolDiscoveryState) {
      
      console.log('🌸 Starting lotus discovery sequence');
      
      // SET DISCOVERY STATE TO PREVENT GAMECOACH CONFLICTS
      sceneActions.updateState({ 
        symbolDiscoveryState: 'lotus_discovering',
        currentPopup: 'lotus_info'
      });
      
      setPopupBookContent({
        title: "The Sacred Lotus",
        symbolImage: popup1,
        description: "The lotus represents purity and spiritual awakening in Ganesha's story. Just like the lotus grows from muddy water yet remains pure, we can rise above challenges!"
      });
      
      setCurrentSourceElement('lotus-1');
      
      safeSetTimeout(() => {
        setShowPopupBook(true);
      }, 500);
    }
  }, [sceneState?.phase, sceneState?.lotusStates, sceneActions]);

  // COMPLETELY REWRITTEN RELOAD LOGIC - Handles all cases properly
  useEffect(() => {
    if (!isReload || !sceneState) return;
    
    console.log('🔄 RELOAD: Starting reload sequence', {
      currentPopup: sceneState.currentPopup,
      gameCoachState: sceneState.gameCoachState,
      symbolDiscoveryState: sceneState.symbolDiscoveryState,
      sidebarHighlightState: sceneState.sidebarHighlightState
    });

    // IMMEDIATELY block GameCoach normal flow
    sceneActions.updateState({ isReloadingGameCoach: true });
    
    setTimeout(() => {
      // 1. HANDLE SYMBOL DISCOVERY STATES FIRST
      if (sceneState.symbolDiscoveryState) {
        console.log('🔄 Resuming symbol discovery:', sceneState.symbolDiscoveryState);
        
        switch(sceneState.symbolDiscoveryState) {
          case 'lotus_discovering':
            setPopupBookContent({
              title: "The Sacred Lotus",
              symbolImage: popup1,
              description: "The lotus represents purity and spiritual awakening in Ganesha's story. Just like the lotus grows from muddy water yet remains pure, we can rise above challenges!"
            });
            setCurrentSourceElement('lotus-1');
            setShowPopupBook(true);
            sceneActions.updateState({ 
              currentPopup: 'lotus_info',
              isReloadingGameCoach: false 
            });
            break;
            
          case 'trunk_discovering':
            setPopupBookContent({
              title: "The Sacred Elephant",
              symbolImage: popupTrunk,
              description: "The elephant represents Lord Ganesha, the remover of obstacles. The trunk blessing shows Ganesha's power to purify and bless the sacred lotus!"
            });
            setCurrentSourceElement('lotus-1');
            setShowPopupBook(true);
            sceneActions.updateState({ 
              currentPopup: 'elephant_info',
              isReloadingGameCoach: false 
            });
            break;
        }
        return;
      }
      
      // 2. HANDLE SIDEBAR HIGHLIGHT STATES
      else if (sceneState.sidebarHighlightState) {
        console.log('🔄 Resuming sidebar highlight:', sceneState.sidebarHighlightState);
        
        // Continue the sidebar highlight flow
        setTimeout(() => {
          const symbolType = sceneState.sidebarHighlightState === 'lotus_highlighting' ? 'lotus' : 'trunk';
          console.log(`🌟 Resuming ${symbolType} celebration after sidebar highlight`);
          showSymbolCelebration(symbolType);
        }, 1000); // Short delay to let reload settle
        
        sceneActions.updateState({ isReloadingGameCoach: false });
        return;
      }

      // 3. HANDLE REGULAR POPUP STATES
      else if (sceneState.currentPopup) {
        console.log('🔄 Resuming popup:', sceneState.currentPopup);
        
        switch(sceneState.currentPopup) {
          case 'lotus_info':
            setPopupBookContent({
              title: "The Sacred Lotus",
              symbolImage: popup1,
              description: "The lotus represents purity and spiritual awakening in Ganesha's story. Just like the lotus grows from muddy water yet remains pure, we can rise above challenges!"
            });
            setCurrentSourceElement('lotus-1');
            setShowPopupBook(true);
            break;
            
          case 'lotus_card':
            setCardContent({ 
              title: "You've discovered the Lotus Symbol!",
              image: popup1,
              stars: 3
            });
            setShowMagicalCard(true);
            break;
            
          case 'elephant_info':
            setPopupBookContent({
              title: "The Sacred Elephant",
              symbolImage: popupTrunk,
              description: "The elephant represents Lord Ganesha, the remover of obstacles. The trunk blessing shows Ganesha's power to purify and bless the sacred lotus!"
            });
            setCurrentSourceElement('lotus-1');
            setShowPopupBook(true);
            break;
            
          case 'trunk_card':
            setCardContent({ 
              title: "You've discovered the Trunk Symbol!",
              image: popupTrunk,
              stars: 2
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
              stars: 5,
              completed: true,
              progress: {
                percentage: 100,
                starsEarned: 5,
                completed: true
              }
            });
            return;
        }
        
        sceneActions.updateState({ isReloadingGameCoach: false });
      }
      
// 4. HANDLE GAMECOACH STATES - COMPLETELY REWRITTEN
else if (sceneState.gameCoachState) {
  console.log('🔄 Resuming GameCoach:', sceneState.gameCoachState);
  
  // DON'T CALL showMessage HERE - instead set readyForWisdom and let normal flow handle it
  switch(sceneState.gameCoachState) {
    case 'lotus_wisdom':
      console.log('🌸 Setting up lotus wisdom resume');
      sceneActions.updateState({ 
        readyForWisdom: true,  // Let normal flow trigger
            lotusWisdomShown: false,  // Reset flag so message can show again
        isReloadingGameCoach: false  // Allow normal flow
      });
      setPendingAction('show-golden-lotus');
      break;
      
    case 'elephant_wisdom':
      console.log('🐘 Setting up elephant wisdom resume');
      sceneActions.updateState({ 
        readyForWisdom: true,  // Let normal flow trigger
            elephantWisdomShown: false,  // Reset flag so message can show again
        isReloadingGameCoach: false  // Allow normal flow
      });
      setPendingAction('bloom-golden-lotus');
      break;
      
    case 'mastery_wisdom':
      console.log('🏆 Setting up mastery wisdom resume');
      sceneActions.updateState({ 
            masteryShown: false,  // Reset flag so message can show again
        isReloadingGameCoach: false  // Allow normal flow
        // Don't clear gameCoachState - let normal flow handle it
      });
      break;
  }
}
      
      // 5. NO SPECIAL RELOAD NEEDED
      else {
        console.log('🔄 No special reload needed, clearing flags');
        setTimeout(() => {
          sceneActions.updateState({ isReloadingGameCoach: false });
        }, 1500);
      }
      
    }, 500);
    
  }, [isReload]);

  // Lotus Click Handler
  const handleLotusClick = (index) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`Lotus ${index} clicked`);
    hideActiveHints();
    hideCoach();

    if (!sceneState.welcomeShown) {
      sceneActions.updateState({ welcomeShown: true });
    }
    
    const lotusStates = [...(sceneState.lotusStates || [0, 0, 0])];
    
    if (lotusStates[index] === 1) {
      console.log(`Lotus ${index} already bloomed - showing sparkle`);
      setShowSparkle(`lotus-${index}`);
      setTimeout(() => setShowSparkle(null), 1500);
      return;
    }
    
    lotusStates[index] = 1;
    
    setShowSparkle(`lotus-${index}`);
    setTimeout(() => setShowSparkle(null), 1500);
    
    const bloomedCount = lotusStates.filter(s => s === 1).length;
    
    if (bloomedCount === 3) {
      console.log('All lotuses bloomed');
      sceneActions.updateState({ 
        lotusStates,
        phase: PHASES.ALL_BLOOMED,
        currentFocus: 'waiting-for-golden',
        progress: {
          ...sceneState.progress,
          percentage: 30,
          starsEarned: 1
        }
      });
    } else {
      console.log(`${bloomedCount} lotuses bloomed`);
      sceneActions.updateState({ 
        lotusStates,
        phase: PHASES.SOME_BLOOMED,
        progress: {
          ...sceneState.progress,
          percentage: 10 * bloomedCount
        }
      });
    }
  };

  const handleGoldenLotusClick = () => {
    if (!sceneState || !sceneActions) return;
    
    console.log('Golden lotus clicked');
    hideActiveHints();
    
    if (sceneState.goldenLotusBloom) {
      console.log('Golden lotus already bloomed - showing sparkle');
      setShowSparkle('golden-lotus-bloom');
      setTimeout(() => setShowSparkle(null), 1500);
      return;
    }
    
    if (sceneState.elephantVisible) {
      console.log('Elephant already appeared - just sparkle');
      setShowSparkle('golden-lotus-clicked');
      setTimeout(() => setShowSparkle(null), 1500);
      return;
    }
    
    setShowSparkle('golden-lotus-clicked');
    
    sceneActions.updateState({
      phase: PHASES.GOLDEN_POPUP
    });
    
    safeSetTimeout(() => {
      setActivePopup(3);
      setPopupAnimation('unfurl-scroll');
      setShowSparkle(null);
    }, 500);
  };

  // Handle close popup
  const handleClosePopup = () => {
    setPopupAnimation('close');
    
    safeSetTimeout(() => {
      setActivePopup(-1);
      
      if (activePopup === 3) {
        safeSetTimeout(() => {
          sceneActions.updateState({ 
            elephantVisible: true,
            phase: PHASES.ELEPHANT_VISIBLE,
            currentFocus: 'elephant'
          });
          
          setShowSparkle('elephant-appear');
          safeSetTimeout(() => setShowSparkle(null), 1500);
        }, 300);
      }
    }, 400);
  };

  // Elephant Click Handler
  const handleElephantClick = () => {
    if (!sceneState || !sceneActions || sceneState.elephantTransformed) return;
    
    hideActiveHints();
    setShowSparkle('elephant');
    
    const elephant = document.getElementById('elephant-container');
    if (elephant) {
      elephant.classList.add('elephant-slide-in');
      
      safeSetTimeout(() => {
        elephant.style.right = '4%';
        elephant.classList.add('elephant-position-locked');
        
        sceneActions.updateState({ 
          elephantTransformed: true,
          trunkActive: true,
          phase: PHASES.ELEPHANT_TRANSFORMED
        });
        
        let dropCount = 0;
        const maxDrops = 15;
        
        createWaterDrop();
        dropCount++;
        
        const waterInterval = setInterval(() => {
          if (dropCount >= maxDrops) {
            clearInterval(waterInterval);
            
            safeSetTimeout(() => {
              // START ELEPHANT DISCOVERY SEQUENCE
              sceneActions.updateState({ 
                trunkActive: false,
                symbolDiscoveryState: 'trunk_discovering',
                currentPopup: 'elephant_info'
              });
              
              setPopupBookContent({
                title: "The Sacred Elephant",
                symbolImage: popupTrunk,
                description: "The elephant represents Lord Ganesha, the remover of obstacles. The trunk blessing shows Ganesha's power to purify and bless the sacred lotus!"
              });
              
              setCurrentSourceElement('lotus-1');
              setShowPopupBook(true);
              setShowSparkle(null);
            }, 1000);
            return;
          }
          
          createWaterDrop();
          dropCount++;
        }, 250);
        
        timeoutsRef.current.push(waterInterval);
      }, 1000);
    }
  };

  // SYMBOL CELEBRATION FUNCTION - No longer marks symbols as discovered
  const showSymbolCelebration = (symbol) => {
    let title = "";
    let image = null;
    let stars = 0;
    
    console.log(`🎉 Showing celebration for: ${symbol}`);
    
    // Check if this is a reload scenario - don't duplicate celebrations
    if (sceneState?.isReloadingGameCoach) {
      console.log('🚫 Skipping celebration during reload');
      return;
    }
    
    switch(symbol) {
      case 'lotus':
        title = "You've discovered the Lotus Symbol!";
        image = popup1;
        stars = 3;
        
        // Clear discovery state but DON'T mark symbol again (already done by sidebar flow)
        sceneActions.updateState({ 
          symbolDiscoveryState: null,
          sidebarHighlightState: null,  // Clear sidebar highlight state
          currentPopup: 'lotus_card'
        });
        
        setCardContent({ title, image, stars });
        setShowMagicalCard(true);
        break;

      case 'trunk':
        title = "You've discovered the Trunk Symbol!";
        image = popupTrunk;
        stars = 2;
        
        // Clear discovery state but DON'T mark symbol again (already done by sidebar flow)
        sceneActions.updateState({ 
          symbolDiscoveryState: null,
          sidebarHighlightState: null,  // Clear sidebar highlight state
          currentPopup: 'trunk_card'
        });
        
        setCardContent({ title, image, stars });
        setShowMagicalCard(true);
        break;

      case 'golden':
        console.log('Golden lotus discovered - no card celebration');
        sceneActions.updateState({
          discoveredSymbols: {
            ...sceneState.discoveredSymbols,
            golden: true
          }
        });
        
        safeSetTimeout(() => {
          showSymbolCelebration('final');
        }, 2000);
        return;

      case 'final':
        console.log('Final mastery achieved - showing fireworks celebration');
        sceneActions.updateState({ 
          currentPopup: 'final_fireworks',
          phase: PHASES.COMPLETE,
          stars: 5,
          completed: true,
          progress: {
            percentage: 100,
            starsEarned: 5,
            completed: true
          }
        });
        setShowSparkle('final-fireworks');
        
        safeSetTimeout(() => {
          showMessage("Amazing! You've mastered all of Ganesha's symbols! You're now a true keeper of ancient wisdom!", {
            duration: 6000,
            animation: 'bounce',
            position: 'top-center'
          });
        }, 500);
        
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

  // CLOSE CARD HANDLER - Symbols already discovered, just continue flow
  const handleCloseCard = () => {
    setShowMagicalCard(false);
    sceneActions.updateState({ currentPopup: null });
    
    if (cardContent.title?.includes("Lotus Symbol")) {
      console.log('🌸 Lotus card closed - continuing progression');
      
      // Symbol was already marked as discovered by sidebar flow
      // Just trigger GameCoach wisdom
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'lotus_wisdom'
        });
        setPendingAction('show-golden-lotus');
      }, 1500);
    }
    
    else if (cardContent.title?.includes("Trunk Symbol")) {
      console.log('🐘 Trunk card closed - continuing progression');
      
      // Symbol was already marked as discovered by sidebar flow
      // Just trigger GameCoach wisdom
      setTimeout(() => {
        sceneActions.updateState({ 
          readyForWisdom: true,
          gameCoachState: 'elephant_wisdom'
        });
        setPendingAction('bloom-golden-lotus');
      }, 500);
    }
    
    else if (cardContent.title?.includes("Golden Lotus")) {
      setTimeout(() => {
        showSymbolCelebration('final');
      }, 1000);
    }
    
    else if (cardContent.title?.includes("discovered all")) {
      console.log("🏆 Game completed! All symbols discovered!");
      
      sceneActions.updateState({
        phase: PHASES.COMPLETE,
        stars: 5,
        completed: true,
        progress: {
          percentage: 100,
          starsEarned: 5,
          completed: true
        }
      });
      
      if (onComplete) {
        onComplete('pond', { 
          stars: 5, 
          completed: true,
          totalStars: 5
        });
      }
    }
  };

  // SYMBOL INFO CLOSE HANDLER - Proper flow with sidebar highlight
  const handleSymbolInfoClose = () => {
    console.log('🔍 Closing SymbolSceneIntegration');
    setShowPopupBook(false);
    setPopupBookContent({});
    setCurrentSourceElement(null);
    sceneActions.updateState({ currentPopup: null });
    
    // RESTORE THE PROPER FLOW: Info → Sidebar highlight → Celebration
    if (popupBookContent.title?.includes("Sacred Elephant")) {
      console.log('🐘 Elephant info closed - highlighting sidebar first');
      
      // Mark symbol as discovered to trigger sidebar highlight
      sceneActions.updateState({
        discoveredSymbols: {
          ...sceneState.discoveredSymbols,
          trunk: true
        },
        symbolDiscoveryState: null,  // Clear discovery state
        sidebarHighlightState: 'trunk_highlighting'  // Set highlight state
      });
      
      // THEN after sidebar highlight animation, show celebration
      safeSetTimeout(() => {
        console.log('🎉 Showing trunk celebration after sidebar highlight');
        showSymbolCelebration('trunk');
      }, 2500); // Give time for sidebar animation
      
    } else if (popupBookContent.title?.includes("Sacred Lotus")) {
      console.log('🌸 Lotus info closed - highlighting sidebar first');
      
      // Mark symbol as discovered to trigger sidebar highlight
      sceneActions.updateState({
        discoveredSymbols: {
          ...sceneState.discoveredSymbols,
          lotus: true
        },
        symbolDiscoveryState: null,  // Clear discovery state
        sidebarHighlightState: 'lotus_highlighting'  // Set highlight state
      });
      
      // THEN after sidebar highlight animation, show celebration
      safeSetTimeout(() => {
        console.log('🎉 Showing lotus celebration after sidebar highlight');
        showSymbolCelebration('lotus');
      }, 3000); // Give time for sidebar animation
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
    console.log("Scene state for hints:", {
      currentFocus: sceneState?.currentFocus,
      lotusStates: sceneState?.lotusStates,
      goldenLotusVisible: sceneState?.goldenLotusVisible,
      elephantVisible: sceneState?.elephantVisible
    });
  };

  // Render helpers
  const getLotusImage = (index) => {
    const lotusStates = sceneState?.lotusStates || [0, 0, 0];
    return lotusStates[index] === 0 ? lotusClosed : lotusBloomed;
  };

  const getPopupImage = () => {
    switch (activePopup) {
      case 3: return popupGolden;
      default: return null;
    }
  };

  const renderAnimatedPopup = () => {
    if (activePopup === -1) return null;
    
    return (
      <div className="popup-overlay">
        <div className={`popup-container ${popupAnimation}`}>
          <img 
            src={getPopupImage()}
            className="popup-image"
            alt="Popup"
          />
          <button 
            className="close-button" 
            onClick={handleClosePopup}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderCounter = () => {
    const lotusStates = sceneState?.lotusStates || [0, 0, 0];
    const bloomCount = lotusStates.filter(state => state === 1).length;
    
    return (
      <div className="lotus-counter">
        <div className="counter-icon">
          <img src={bloomCount > 0 ? lotusBloomed : lotusClosed} alt="Lotus" />
        </div>
        <div className="counter-progress">
          <div 
            className="counter-progress-fill"
            style={{width: `${(bloomCount / 3) * 100}%`}}
          />
        </div>
        <div className="counter-display">{bloomCount}/3</div>
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
        <div className="pond-scene-container">
          <div className="pond-background" style={{ backgroundImage: `url(${pondBackground})` }}>
            {renderCounter()}
            
            {/* Lotus flowers */}
            {[0, 1, 2].map((index) => (
              <div key={index} className={`lotus lotus-${index + 1}`}>
                <ClickableElement
                  id={`lotus-${index}`}
                  onClick={() => handleLotusClick(index)}
                  completed={(sceneState.lotusStates || [])[index] === 1}
                  zone="pond-zone"
                  data-element={`lotus-${index + 1}`}
                >
                  <img 
                    src={getLotusImage(index)}
                    alt={`Lotus ${index + 1}`}
                    style={{ width: '100%', height: '100%' }}
                  />
                </ClickableElement>
                {showSparkle === `lotus-${index}` && (
                  <SparkleAnimation
                    type="star"
                    count={15}
                    color="#ff9ebd"
                    size={10}
                    duration={1500}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            ))}
            
            {/* All lotuses sparkle */}
            {showSparkle === 'all-lotuses' && (
              <div className="all-lotuses-sparkle">
                <SparkleAnimation
                  type="magic"
                  count={20}
                  color="lightblue"
                  size={10}
                  duration={1500}
                  fadeOut={true}
                  area="full"
                />
              </div>
            )}
            
            {/* Golden lotus */}
            {sceneState.goldenLotusVisible && (
              <div className={`golden-lotus-container ${sceneState.goldenLotusBloom ? 'blooming' : ''}`}>
                <ClickableElement
                  id="golden-lotus"
                  onClick={handleGoldenLotusClick}
                  completed={sceneState.goldenLotusBloom}
                  zone="golden-zone"
                >
                  <img 
                    src={sceneState.goldenLotusBloom ? goldenLotusBloomed : goldenLotusClosed}
                    alt="Golden Lotus"
                    style={{ width: '100%', height: '100%' }}
                  />
                </ClickableElement>
                {(showSparkle === 'golden-lotus' || 
                  showSparkle === 'golden-lotus-clicked' || 
                  showSparkle === 'golden-lotus-bloom') && (
                  <SparkleAnimation
                    type={showSparkle === 'golden-lotus-bloom' ? 'glitter' : 'magic'}
                    count={20}
                    color={showSparkle === 'golden-lotus-bloom' ? 'gold' : 'orange'}
                    size={10}
                    duration={1500}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            )}

            {/* Elephant with proper ID */}
            {sceneState.elephantVisible && (
              <div 
                className={`elephant-partial ${sceneState.elephantTransformed ? 'elephant-position-locked' : ''}`}
                id="elephant-container"
              >
                <ClickableElement
                  id="elephant"
                  onClick={handleElephantClick}
                  completed={sceneState.elephantTransformed}
                  zone="elephant-zone"
                >
                  <img 
                    src={sceneState.elephantTransformed ? waterElephant : elephantFull}
                    alt="Elephant"
                    style={{ width: '100%', height: '100%' }}
                  />
                </ClickableElement>
                {(showSparkle === 'elephant' || showSparkle === 'elephant-appear') && (
                  <SparkleAnimation
                    type={showSparkle === 'elephant' ? 'firefly' : 'star'}
                    count={20}
                    color={showSparkle === 'elephant' ? 'lightblue' : '#aaaaaa'}
                    size={10}
                    duration={1500}
                    fadeOut={true}
                    area="full"
                  />
                )}
              </div>
            )}

          

{/* 🧪 POND COMPLETION TEST BUTTON */}
<div style={{
  position: 'fixed',
  top: '170px',
  left: '200px', // Different position 
  zIndex: 9999,
  background: 'purple',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
}} onClick={() => {
  console.log('🧪 POND COMPLETION TEST CLICKED');
  sceneActions.updateState({
    // All phases complete
    lotusStates: [1, 1, 1],
    goldenLotusVisible: true,
    goldenLotusBloom: true,
    elephantVisible: true,
    elephantTransformed: true,
    trunkActive: false,
    waterDrops: [],
    
    // All symbols discovered
    discoveredSymbols: {
      lotus: true,
      trunk: true,
      golden: true
    },
    
    // All messages shown
    welcomeShown: true,
    lotusWisdomShown: true,
    elephantWisdomShown: true,
    masteryShown: false,  // Will trigger final message
    
    // Set to final phase
    phase: PHASES.COMPLETE,
    currentFocus: 'complete',
    
    // COMPLETION DATA
    completed: true,
    stars: 5,
    progress: {
      percentage: 100,
      starsEarned: 5,
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
            
            {/* Trunk/Water Spray Element */}
            {sceneState.trunkActive && (
              <div className="trunk" style={{ position: 'absolute', right: '20%', bottom: '30%' }}>
                💦
              </div>
            )}
            
            {/* Water Drops */}
            {(sceneState.waterDrops || []).map(drop => (
              <div 
                key={drop.id} 
                className="water-drop enhanced-arc"
                style={{
                  fontSize: `${drop.size * 1.5 + 2}vh`,
                  right: `${drop.startRight}%`,
                  bottom: `${drop.startBottom}%`,
                  transform: `rotate(${drop.rotation}deg)`,
                  opacity: drop.opacity,
                  '--delta-x': `${drop.deltaX}vw`,
                  '--delta-y': `${drop.deltaY}vh`,
                  '--arc-height': `${drop.arcHeight}vh`,
                  '--duration': `${drop.duration}s`,
                  animation: `fixedWaterArc var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                  animationFillMode: 'forwards'
                }}
              >
                💧
              </div>
            ))}

          </div>
          
          {/* Popup overlay with animation */}
          {renderAnimatedPopup()}

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

          {/* Real Confetti Effect - Falling from Top */}
          {showMagicalCard && (cardContent.title?.includes("Lotus Symbol") || cardContent.title?.includes("Trunk Symbol")) && (
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

          {/* Add CSS for confetti animation */}
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
    count={15}
    colors={['#FFD700', '#FF1493', '#00CED1', '#98FB98', '#FF6347', '#9370DB']}
    
    onComplete={() => {
  console.log('🎯 Fireworks complete - using fixed GameStateManager');
  setShowSparkle(null);
  
    console.log('🔍 DEBUG: What we are about to save:', {
completed: true,
      stars: 5,
      symbols: { lotus: true, trunk: true, golden: true },
      phase: 'complete'
    });

  setTimeout(() => {
    GameStateManager.saveGameState('symbol-mountain', 'pond', {
      completed: true,
      stars: 5,
      symbols: { lotus: true, trunk: true, golden: true },
      phase: 'complete'
    });
    console.log('✅ POND: Saved with cumulative GameStateManager');
  }, 500);

}}
  />
)}
          {/* Scene Completion - For moving to next scene */}
          <SceneCompletionCelebration
            show={showSceneCompletion}
            sceneName="Pond Adventure"
            sceneNumber={2}
            totalScenes={4}
            starsEarned={sceneState.progress?.starsEarned || 5}
            totalStars={5}
            discoveredSymbols={Object.keys(sceneState.discoveredSymbols || {})}
            symbolImages={{
              lotus: popup1,
              trunk: popupTrunk,
              golden: popupGolden
            }}
            nextSceneName="Temple Discovery"
           // For Replay:
onReplay={() => {
  console.log('🔧 POND REPLAY: Saving progress then restarting scene');
  
  // Save progress first
  if (onComplete) {
    onComplete('pond', {
      stars: 5,
      symbols: { lotus: true, trunk: true, golden: true },
      completed: true,
      totalStars: 5
    });
  }
  
  // Then navigate to replay
  setTimeout(() => {
    onNavigate?.('scene');
  }, 500);
}}

onContinue={() => {
    console.log('🔧 CONTINUE: Saving progress then navigating to zone');
    
    // Save progress first
    if (onComplete) {
      onComplete('pond', {
        stars: 5,
      symbols: { lotus: true, trunk: true, golden: true },  // ✅ ADD golden: true
        completed: true,
        totalStars: 5
      });
    }
    
    // Then navigate to zone welcome
    setTimeout(() => {
      onNavigate?.('zone-welcome');
    }, 500);
  }}
          />

        </div>       
      </MessageManager>
    </InteractionManager>
  );
};

export default PondSceneSimplified