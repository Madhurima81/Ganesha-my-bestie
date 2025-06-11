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

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import SymbolSceneIntegration from '../../../../lib/components/animation/SymbolSceneIntegration';
import MagicalCardFlip from '../../../../lib/components/animation/MagicalCardFlip';
import SymbolSidebar from '../../shared/components/SymbolSidebar';
//import DivineBlessingRain from '../../../../lib/components/celebration/DivineBlessingRain';
//import LevelProgressionPortal from '../../../../lib/components/celebration/LevelProgressionPortal';
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
  lotusInfoShown: false,        // ADD THIS
  readyForWisdom: false,
  elephantInfoShown: false,     // ADD THIS - for elephant symbol integration  
  lotusCardShown: false,        // ADD THIS LINE
  trunkCardShown: false,        // ADD THIS LINE
    resumeCompleted: false, 
    stepLotusCompleted: false,
stepElephantCompleted: false,
stepGoldenCompleted: false,
stepFinalCompleted: false,       // ADD THIS LINE

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
  const MAX_WATER_DROPS = 15; // Limit concurrent drops

  //const [showBlessingRain, setShowBlessingRain] = useState(false);
//const [showProgressionPortal, setShowProgressionPortal] = useState(false);
const [showSceneCompletion, setShowSceneCompletion] = useState(false);
const [pendingAction, setPendingAction] = useState(null);


  // DEBUG: Log the current state values
console.log('🔍 Current scene state:', {
  phase: sceneState?.phase,
  welcomeShown: sceneState?.welcomeShown,
  PHASES_INITIAL: PHASES.INITIAL
});


  // CLEANED DISNEY-STYLE GAMECOACH MESSAGES - ONLY THESE WILL SHOW
  const gameCoachStoryMessages = [
    // 1. Opening Magic (Scene Start)
    {
      message: "Welcome to Ganesha's magical world! You're about to discover ancient secrets!",
      timing: 500,
  condition: () => sceneState?.phase === PHASES.INITIAL && !sceneState?.welcomeShown
    },
    
    // 2. First Success Connection (After Lotus Symbol Discovery)
    {
      message: "Wonderful! Like the lotus, you're growing wiser! Ganesha would be proud!",
      timing: 1000,
  condition: () => sceneState?.discoveredSymbols?.lotus && !sceneState?.lotusWisdomShown && sceneState?.readyForWisdom
    },
    
    // 3. Power Moment (After Elephant Symbol Discovery)  
    {
      message: "Amazing! You've learned about Ganesha's strength and kindness!",
      timing: 1000,
  condition: () => sceneState?.discoveredSymbols?.trunk && !sceneState?.elephantWisdomShown && sceneState?.readyForWisdom
    },
    
    // 4. Mastery Celebration (Scene Complete)
    {
      message: "You've become a keeper of Ganesha's wisdom! Ready for your next adventure?",
      timing: 1000,
      condition: () => sceneState?.phase === PHASES.COMPLETE && !sceneState?.masteryShown
    }
  ];

  const getHintConfigs = () => [
  {
    id: 'lotus-hint',
    message: 'Try clicking on the lotus flowers!',
    explicitMessage: 'Click on all three lotus flowers to make them bloom!',
    //position: { top: '40%', left: '30%' },
    position: { bottom: '60%', left: '30%', transform: 'translateX(-50%)' },
    condition: (sceneState, hintLevel) => {
      if (!sceneState) return false;
      const lotusStates = sceneState.lotusStates || [0, 0, 0];
      // SIMPLIFIED: Only check if lotuses aren't all bloomed
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
      // SIMPLIFIED: Only check if golden lotus is visible but not bloomed
      return sceneState.goldenLotusVisible && 
            !sceneState.goldenLotusBloom &&
            !sceneState.elephantVisible &&  // ADD THIS LINE
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
      // SIMPLIFIED: Only check if elephant is visible but not transformed
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

// Watch for GameCoach visibility changes to trigger pending actions
/*useEffect(() => {
  // Only act when GameCoach goes from visible to hidden AND we have a pending action
  if (!isVisible && pendingAction) {
    console.log(`GameCoach closed, executing pending action: ${pendingAction}`);
    
    // Start short timer (2-3 seconds) after GameCoach closes
    const actionTimer = setTimeout(() => {
      switch (pendingAction) {
        case 'show-golden-lotus':
          console.log('Showing golden lotus after GameCoach wisdom');
          setShowSparkle('all-lotuses');
          
          safeSetTimeout(() => {
            sceneActions.updateState({ 
              goldenLotusVisible: true,
              phase: PHASES.GOLDEN_VISIBLE,
              currentFocus: 'golden'
            });
            
            setShowSparkle('golden-lotus');
            safeSetTimeout(() => setShowSparkle(null), 2000);
          }, 1000);
          break;
          
        case 'bloom-golden-lotus':
          console.log('Blooming golden lotus after GameCoach wisdom');
          setShowSparkle('golden-lotus-bloom');
          
          safeSetTimeout(() => {
            sceneActions.updateState({
              goldenLotusBloom: true,
              phase: PHASES.GOLDEN_BLOOM
            });
            setShowSparkle(null);
            
            safeSetTimeout(() => {
              showSymbolCelebration('golden');
            }, 1000);
          }, 1500);
          break;
      }
      
      // Clear the pending action
      setPendingAction(null);
    }, 2500); // 2.5 seconds after GameCoach closes
    
    timeoutsRef.current.push(actionTimer);
  }
}, [isVisible, pendingAction]);*/

// Add this ref at the top with your other refs
const previousVisibilityRef = useRef(false);

// Watch for GameCoach visibility changes to trigger pending actions
useEffect(() => {
  // Only act when GameCoach goes from visible to hidden AND we have a pending action
  if (previousVisibilityRef.current && !isVisible && pendingAction) {
    console.log(`GameCoach closed, executing pending action: ${pendingAction}`);
    
    // Start short timer (2-3 seconds) after GameCoach closes
    const actionTimer = setTimeout(() => {
      switch (pendingAction) {
        case 'show-golden-lotus':
          console.log('Showing golden lotus after GameCoach wisdom');
          setShowSparkle('all-lotuses');
          
          safeSetTimeout(() => {
            sceneActions.updateState({ 
              goldenLotusVisible: true,
              phase: PHASES.GOLDEN_VISIBLE,
              currentFocus: 'golden'
            });
            
            setShowSparkle('golden-lotus');
            safeSetTimeout(() => setShowSparkle(null), 2000);
          }, 1000);
          break;
          
        case 'bloom-golden-lotus':
          console.log('Blooming golden lotus after GameCoach wisdom');
          setShowSparkle('golden-lotus-bloom');
          
          safeSetTimeout(() => {
            sceneActions.updateState({
              goldenLotusBloom: true,
              phase: PHASES.GOLDEN_BLOOM
            });
            setShowSparkle(null);
            
            safeSetTimeout(() => {
              showSymbolCelebration('golden');
            }, 1000);
          }, 1500);
          break;
      }
      
      // Clear the pending action
      setPendingAction(null);
    }, 2500); // 2.5 seconds after GameCoach closes
    
    timeoutsRef.current.push(actionTimer);
  }
  
  // Update previous visibility for next check
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

  // CLEANED GameCoach useEffect - Only Disney-style messages
  useEffect(() => {
    if (!sceneState || !showMessage) return;
    
    const matchingMessage = gameCoachStoryMessages.find(
      item => typeof item.condition === 'function' && item.condition()
    );
    
    if (matchingMessage) {
      const timer = setTimeout(() => {
        showMessage(matchingMessage.message, {
          duration: 8000,
          animation: 'bounce',
          position: 'top-right'
        });
        
        // Mark message as shown to prevent repeats
if (matchingMessage.message.includes("Welcome to Ganesha's")) {
  sceneActions.updateState({ welcomeShown: true });
} else if (matchingMessage.message.includes("Like the lotus")) {
  sceneActions.updateState({ lotusWisdomShown: true, readyForWisdom: false });
} else if (matchingMessage.message.includes("Ganesha's strength")) {
  sceneActions.updateState({ elephantWisdomShown: true, readyForWisdom: false });
} else if (matchingMessage.message.includes("keeper of Ganesha's wisdom")) {
  sceneActions.updateState({ masteryShown: true });
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
      sceneState?.readyForWisdom,  // ADD THIS LINE
    showMessage
  ]);

  // FIXED Water Drop Creation - With cleanup and limits
  const createWaterDrop = () => {
    if (!sceneActions || !sceneState) return;
    
    // Limit concurrent water drops
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
    
    // Add new drop
    const currentDrops = [...(sceneState.waterDrops || [])];
    sceneActions.updateState({ waterDrops: [...currentDrops, newDrop] });
    
    // FIXED cleanup - Remove from both state and tracking
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
        !sceneState.lotusInfoShown) {
      
      console.log('Showing symbol integration for lotus information');
      
      setPopupBookContent({
        title: "The Sacred Lotus",
        symbolImage: popup1,
        description: "The lotus represents purity and spiritual awakening in Ganesha's story. Just like the lotus grows from muddy water yet remains pure, we can rise above challenges!"
      });
      
      setCurrentSourceElement('lotus-1');
      sceneActions.updateState({ lotusInfoShown: true });
      
      safeSetTimeout(() => {
        setShowPopupBook(true);
        sceneActions.updateState({ elephantInfoShown: true });  // ADD THIS LINE
      }, 500);
    }
  }, [sceneState?.phase, sceneState?.lotusStates, sceneActions]);

  

  // Add save state logging for testing
useEffect(() => {
  const logSaveState = () => {
    console.log('💾 Current Save State:', {
      phase: sceneState?.phase,
      lotusStates: sceneState?.lotusStates,
      goldenLotusVisible: sceneState?.goldenLotusVisible,
      elephantVisible: sceneState?.elephantVisible,
      elephantTransformed: sceneState?.elephantTransformed,
      discoveredSymbols: sceneState?.discoveredSymbols,
      progress: sceneState?.progress
    });
  };
  
  // Log every 2 seconds
  const saveStateLogger = setInterval(logSaveState, 2000);
  
  return () => clearInterval(saveStateLogger);
}, [sceneState]);

// Complete resume logic for PondScene - RESUME DISCOVERY CARD VERSION
/*useEffect(() => {
  if (!sceneState || !sceneActions || !isReload || sceneState.resumeCompleted) return;
  
  console.log('🔄 Checking for interrupted flows...', {
    phase: sceneState.phase,
    lotusStates: sceneState.lotusStates,
    goldenLotusVisible: sceneState.goldenLotusVisible,
    discoveredSymbols: sceneState.discoveredSymbols
  });
  
  // Case 1: Symbol learning interrupted
  if (sceneState.lotusStates?.every(state => state === 1) && 
      sceneState.lotusInfoShown && 
      !sceneState.discoveredSymbols?.lotus) {
    
    console.log('📚 Resuming lotus symbol learning');
    setTimeout(() => {
      setPopupBookContent({
        title: "The Sacred Lotus",
        symbolImage: popup1,
        description: "The lotus represents purity and spiritual awakening in Ganesha's story. Just like the lotus grows from muddy water yet remains pure, we can rise above challenges!"
      });
      setCurrentSourceElement('lotus-1');
      setShowPopupBook(true);
      sceneActions.updateState({ resumeCompleted: true });
    }, 1000);
  }
  
  // Case 2: Lotus Discovery Card - COPY CASE 1 PATTERN
else if (sceneState.discoveredSymbols?.lotus && 
         !sceneState.lotusCardShown && 
         sceneState.phase === 'all_bloomed') {  // CHANGE THIS LINE

      sceneActions.updateState({ lotusCardShown: true });
          console.log('🎉 Resuming lotus discovery card');
  setTimeout(() => {
    setCardContent({ 
      title: "You've discovered the Lotus Symbol!",
      image: popup1,
      stars: 3
    });
    setShowMagicalCard(true);
    sceneActions.updateState({ resumeCompleted: true });
  }, 1000);
}

// Case 3: Elephant Symbol Integration - COPY CASE 1 PATTERN
else if (sceneState.elephantTransformed &&              // CHANGE THIS LINE
         sceneState.elephantInfoShown && 
         !sceneState.discoveredSymbols?.trunk) {
  
  console.log('🐘 Resuming elephant symbol learning');
  setTimeout(() => {
    setPopupBookContent({
      title: "The Sacred Elephant",
      symbolImage: popupTrunk,
      description: "The elephant represents Lord Ganesha, the remover of obstacles. The trunk blessing shows Ganesha's power to purify and bless the sacred lotus!"
    });
    setCurrentSourceElement('elephant');
    setShowPopupBook(true);
    sceneActions.updateState({ resumeCompleted: true });
  }, 1000);
}

// Case 4: Elephant Discovery Card - COPY CASE 1 PATTERN  
else if (sceneState.discoveredSymbols?.trunk && 
         sceneState.trunkCardShown && 
         sceneState.elephantTransformed) {                // CHANGE THIS LINE
  
  console.log('🎊 Resuming trunk discovery card');
  setTimeout(() => {
    setCardContent({ 
      title: "You've discovered the Trunk Symbol!",
      image: popupTrunk,
      stars: 2
    });
    setShowMagicalCard(true);
    sceneActions.updateState({ resumeCompleted: true });
  }, 1000);
}

// If no resume needed, mark as completed
else {
  sceneActions.updateState({ resumeCompleted: true });
}

  
}, [isReload, sceneState, sceneActions]);*/

// Simple Resume Logic
// Simple Resume Logic  
useEffect(() => {
  if (!isReload || !sceneState) return;
  
  setTimeout(() => {
    // If lotus discovery card was interrupted (symbol exists but not completed)
    if (sceneState.discoveredSymbols?.lotus && !sceneState.stepLotusCompleted) {
      showSymbolCelebration('lotus');
    }
    // If elephant discovery card was interrupted
    else if (sceneState.discoveredSymbols?.trunk && !sceneState.stepElephantCompleted) {
      showSymbolCelebration('trunk');
    }
  }, 1000);
}, [isReload]);

  // CLEANED Lotus Click Handler - NO duplicate GameCoach messages
  const handleLotusClick = (index) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`Lotus ${index} clicked`);
    hideActiveHints();
      hideCoach();

      // NEW: Mark welcome as shown to prevent it from reappearing
  if (!sceneState.welcomeShown) {
    sceneActions.updateState({ welcomeShown: true });
  }
    
    const lotusStates = [...(sceneState.lotusStates || [0, 0, 0])];
    
    if (lotusStates[index] === 1) {
      console.log(`Lotus ${index} already bloomed - showing sparkle`);
    // NEW: Show sparkle for already bloomed lotus
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
            currentFocus: 'waiting-for-golden', // CHANGE THIS LINE
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
    // NO GameCoach messages here - only the Disney-style array handles them
  };

  const handleGoldenLotusClick = () => {
  if (!sceneState || !sceneActions) return;
  
  console.log('Golden lotus clicked');
  hideActiveHints();
  
  if (sceneState.goldenLotusBloom) {
    console.log('Golden lotus already bloomed');
    return;
  }

  // NEW: If golden lotus is already bloomed, just sparkle
  if (sceneState.goldenLotusBloom) {
    console.log('Golden lotus already bloomed - showing sparkle');
    setShowSparkle('golden-lotus-bloom');
    setTimeout(() => setShowSparkle(null), 1500);
    return;
  }
  
  // NEW: If elephant has appeared, just sparkle - no popup
  if (sceneState.elephantVisible) {
    console.log('Elephant already appeared - just sparkle');
    setShowSparkle('golden-lotus-clicked');
    setTimeout(() => setShowSparkle(null), 1500);
    return;
  }
  
  // Original popup logic only if elephant hasn't appeared yet
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

  // CLEANED Elephant Click Handler
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
        
        // CLEANED water creation - with limits
        let dropCount = 0;
        const maxDrops = 15; // Reduced from 25
        
        createWaterDrop();
        dropCount++;
        
        const waterInterval = setInterval(() => {
          if (dropCount >= maxDrops) {
            clearInterval(waterInterval);
            
            safeSetTimeout(() => {
              sceneActions.updateState({ trunkActive: false });
              
              setPopupBookContent({
                title: "The Sacred Elephant",
                symbolImage: popupTrunk,
                description: "The elephant represents Lord Ganesha, the remover of obstacles. The trunk blessing shows Ganesha's power to purify and bless the sacred lotus!"
              });
              
              setCurrentSourceElement('elephant');
              setShowPopupBook(true);
              setShowSparkle(null);
            }, 1000);
            return;
          }
          
          createWaterDrop();
          dropCount++;
        }, 250); // Slightly slower drop creation
        
        timeoutsRef.current.push(waterInterval);
      }, 1000);
    }
    // NO GameCoach messages here
  };

  // Symbol celebration function
  const showSymbolCelebration = (symbol) => {
    let title = "";
    let image = null;
    let stars = 0;
    
    console.log(`Showing celebration for: ${symbol}`);
    
    switch(symbol) {
      case 'lotus':
        title = "You've discovered the Lotus Symbol!";
        image = popup1;
        stars = 3;
        discoverSymbol('lotus');
          console.log('🔥 SETTING lotusCardShown to true');  // ADD THIS LINE
sceneActions.updateState({ lotusCardShown: true });
console.log('🔍 sceneActions:', sceneActions);
console.log('🔍 Current sceneState after update:', sceneState);
        setCardContent({ title, image, stars });
setShowMagicalCard(true);
        break;

      case 'trunk':
        title = "You've discovered the Trunk Symbol!";
        image = popupTrunk;
        stars = 2;
        discoverSymbol('trunk');
          sceneActions.updateState({ trunkCardShown: true });  // ADD THIS
        setCardContent({ title, image, stars });
setShowMagicalCard(true);
        break;

      case 'golden':
  // NO CARD for golden lotus - just update symbols
  console.log('Golden lotus discovered - no card celebration');
  discoverSymbol('golden');
  // Continue directly to final celebration
  safeSetTimeout(() => {
    showSymbolCelebration('final');
  }, 2000);
  return;
     

  // In showSymbolCelebration, case 'final' - REVERT to original fireworks
case 'final':
  // Show fireworks celebration for this scene
  console.log('Final mastery achieved - showing fireworks celebration');
  
  // Trigger fireworks state (your original code)
  setShowSparkle('final-fireworks');
  
  // Special GameCoach message during fireworks
  safeSetTimeout(() => {
    showMessage("Amazing! You've mastered all of Ganesha's symbols! You're now a true keeper of ancient wisdom!", {
      duration: 6000,
      animation: 'bounce',
      position: 'top-center'
    });
  }, 500);
  
  // Complete scene after fireworks show
  safeSetTimeout(() => {
    setShowSceneCompletion(true); // Show scene completion after fireworks
  }, 8000);
  return;
  
  // Complete scene after fireworks show
  safeSetTimeout(() => {
    sceneActions.updateState({
      phase: PHASES.COMPLETE,
      progress: {
        percentage: 100,
        starsEarned: 5,
        completed: true
      }
    });
    
    sceneActions.completeScene(5, {
      symbolsFound: ['lotus', 'trunk', 'golden'],
      completed: true
    });
    
    if (onComplete) {
      onComplete('pond', { 
        stars: 5, 
        completed: true,
        totalStars: 5
      });
    }
    
    setShowSparkle(null);
  }, 6000);
  return;

      default:
        title = "Congratulations on your discovery!";
        stars = 1;
    }
    
  };

  // REPLACE your entire handleCloseCard function with this:
/*const handleCloseCard = () => {
  setShowMagicalCard(false);
  
  // NEW: Perfect Disney-style timing sequence
  if (cardContent.title?.includes("Lotus Symbol")) {
    console.log('Lotus celebration closed - starting timed wisdom sequence');
    
    // Step 1: Update discovered symbols (triggers sidebar highlight)
    sceneActions.updateState({
      discoveredSymbols: {
        ...sceneState.discoveredSymbols,
        lotus: true
      }
    });
    
    // Step 2: Brief pause, then enable GameCoach wisdom
    safeSetTimeout(() => {
      console.log('Enabling GameCoach wisdom for lotus');
      sceneActions.updateState({ readyForWisdom: true });
    }, 1500);
    
    // Step 3: After GameCoach wisdom completes, continue game progression  
    safeSetTimeout(() => {
      console.log('GameCoach wisdom complete, continuing to golden lotus');
      sceneActions.updateState({ readyForWisdom: false });
      
      // Now show golden lotus
      setShowSparkle('all-lotuses');
      
      safeSetTimeout(() => {
        sceneActions.updateState({ 
          goldenLotusVisible: true,
          phase: PHASES.GOLDEN_VISIBLE,
          currentFocus: 'golden'
        });
        
        setShowSparkle('golden-lotus');
        safeSetTimeout(() => setShowSparkle(null), 2000);
      }, 1000);
    }, 12000); // GameCoach duration (4000ms) + pause (500ms)
  }
  
  else if (cardContent.title?.includes("Trunk Symbol")) {
    console.log('Trunk celebration closed - starting timed wisdom sequence');
    
    // Step 1: Update discovered symbols
    sceneActions.updateState({
      discoveredSymbols: {
        ...sceneState.discoveredSymbols,
        trunk: true
      }
    });
    
    // Step 2: Brief pause, then enable GameCoach wisdom
    safeSetTimeout(() => {
      console.log('Enabling GameCoach wisdom for trunk');
      sceneActions.updateState({ readyForWisdom: true });
    }, 500);
    
    // Step 3: After GameCoach wisdom, continue with golden lotus bloom
    safeSetTimeout(() => {
      console.log('GameCoach wisdom complete, blooming golden lotus');
      sceneActions.updateState({ readyForWisdom: false });
      
      // Bloom the golden lotus
      setShowSparkle('golden-lotus-bloom');
      
      safeSetTimeout(() => {
        sceneActions.updateState({
          goldenLotusBloom: true,
          phase: PHASES.GOLDEN_BLOOM
        });
        setShowSparkle(null);
        
        safeSetTimeout(() => {
          showSymbolCelebration('golden');
        }, 1000);
      }, 1500);
    }, 12000); // GameCoach duration (4000ms) + pause (500ms)
  }
  
  else if (cardContent.title?.includes("Golden Lotus")) {
    safeSetTimeout(() => {
      showSymbolCelebration('final');
    }, 1000);
  }
  
  else if (cardContent.title?.includes("discovered all")) {
    console.log("Game completed! All symbols discovered!");
    
    sceneActions.updateState({
      phase: PHASES.COMPLETE,
      progress: {
        percentage: 100,
        starsEarned: 5,
        completed: true
      }
    });
    
    sceneActions.completeScene(5, {
      symbolsFound: ['lotus', 'trunk', 'golden'],
      completed: true
    });
    
    if (onComplete) {
      onComplete('pond', { 
        stars: 5, 
        completed: true,
        totalStars: 5
      });
    }
  }
};*/

const handleCloseCard = () => {
  setShowMagicalCard(false);
  
  // Set completion flags when cards close (for resume functionality)
  if (cardContent.title?.includes("Lotus Symbol")) {
    sceneActions.updateState({ stepLotusCompleted: true });
    
    // Continue normal flow: Update discovered symbols and show golden lotus
    sceneActions.updateState({
      discoveredSymbols: {
        ...sceneState.discoveredSymbols,
        lotus: true
      }
    });
    
    // Show golden lotus after brief pause
    setTimeout(() => {
      setShowSparkle('all-lotuses');
      
      setTimeout(() => {
        sceneActions.updateState({ 
          goldenLotusVisible: true,
          phase: PHASES.GOLDEN_VISIBLE,
          currentFocus: 'golden'
        });
        
        setShowSparkle('golden-lotus');
        setTimeout(() => setShowSparkle(null), 2000);
      }, 1000);
    }, 1500);
  }
  
  else if (cardContent.title?.includes("Trunk Symbol")) {
    sceneActions.updateState({ stepElephantCompleted: true });
    
    // Continue normal flow: Update discovered symbols and bloom golden lotus
    sceneActions.updateState({
      discoveredSymbols: {
        ...sceneState.discoveredSymbols,
        trunk: true
      }
    });
    
    // Bloom golden lotus after brief pause
    setTimeout(() => {
      setShowSparkle('golden-lotus-bloom');
      
      setTimeout(() => {
        sceneActions.updateState({
          goldenLotusBloom: true,
          phase: PHASES.GOLDEN_BLOOM
        });
        setShowSparkle(null);
        
        setTimeout(() => {
          showSymbolCelebration('golden');
        }, 1000);
      }, 1500);
    }, 1000);
  }
  
  else if (cardContent.title?.includes("Golden Lotus")) {
    setTimeout(() => {
      showSymbolCelebration('final');
    }, 1000);
  }
  
  else if (cardContent.title?.includes("discovered all")) {
    console.log("Game completed! All symbols discovered!");
    
    sceneActions.updateState({
      phase: PHASES.COMPLETE,
      progress: {
        percentage: 100,
        starsEarned: 5,
        completed: true
      }
    });
    
    sceneActions.completeScene(5, {
      symbolsFound: ['lotus', 'trunk', 'golden'],
      completed: true
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
/*<ProgressCoach sceneId={sceneId} sceneState={null}>*/
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

    {renderCounter()}

{/* TEST BUTTON - Remove after testing */}
<button 
  style={{
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'red',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000
  }}
  onClick={() => {
    console.log('🧪 TEST: Triggering lotus discovery');
    // Set all lotuses to bloomed
    sceneActions.updateState({
      lotusStates: [1, 1, 1],
      phase: PHASES.ALL_BLOOMED,
      lotusInfoShown: true
    });
    
    // Show lotus celebration directly
    setTimeout(() => {
      showSymbolCelebration('lotus');
    }, 500);
  }}
>
  TEST LOTUS
</button>
        
              
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
  zIndex={2000}               // ADD THIS LINE
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
              
              {/* FIXED Water Drops with Cleanup */}
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

              {/* Water Blessing Effect */}
              {showSparkle === 'water-blessing' && (
                <div 
                  className="water-blessing-sparkle"
                  style={{
                    position: 'absolute',
                    right: '10%',
                    bottom: '45%',
                    width: '15%',
                    height: '15%',
                    zIndex: 20
                  }}
                >
                  <SparkleAnimation
                    type="magic"
                    count={15}
                    color="lightblue"
                    size={8}
                    duration={2000}
                    fadeOut={true}
                    area="full"
                  />
                </div>
              )}

              {/* Golden Lotus Splash Effect */}
              {showSparkle === 'golden-lotus-splash' && (
                <div 
                  className="golden-lotus-splash"
                  style={{
                    position: 'absolute',
                    left: '40%',
                    top: '40%',
                    width: '20%',
                    height: '20%',
                    zIndex: 15
                  }}
                >
                  <SparkleAnimation
                    type="glitter"
                    count={25}
                    color="gold"
                    size={12}
                    duration={2000}
                    fadeOut={true}
                    area="full"
                  />
                </div>
              )}

              {/* Golden Lotus Glow During Blessing */}
              {showSparkle === 'golden-lotus-glow' && (
                <div 
                  className="golden-lotus-glow"
                  style={{
                    position: 'absolute',
                    left: '42%',
                    top: '42%',
                    width: '16%',
                    height: '16%',
                    zIndex: 10
                  }}
                >
                  <SparkleAnimation
                    type="firefly"
                    count={20}
                    color="orange"
                    size={6}
                    duration={3000}
                    fadeOut={true}
                    area="full"
                  />
                </div>
              )}

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
              onClose={() => {
                console.log('Closing SymbolSceneIntegration');
                setShowPopupBook(false);
                setPopupBookContent({});
                setCurrentSourceElement(null);
                
                // Discovery fanfare sequence with sidebar integration
                if (popupBookContent.title?.includes("Sacred Elephant")) {
                  sceneActions.updateState({
                    discoveredSymbols: {
                      ...sceneState.discoveredSymbols,
                      trunk: true
                    }
                  });
                  
                  safeSetTimeout(() => {
                    console.log('Showing trunk celebration after sidebar highlight');
                    showSymbolCelebration('trunk');
                  }, 2500);
                  
                } else if (popupBookContent.title?.includes("Sacred Lotus")) {
  // Step 1: Update sidebar symbols immediately (sidebar highlights)
  sceneActions.updateState({
    discoveredSymbols: {
      ...sceneState.discoveredSymbols,
      lotus: true
    }
  });
  
  // Step 2: Wait for sidebar animation, then show discovery celebration
  safeSetTimeout(() => {
    console.log('Showing lotus celebration after sidebar highlight');
    showSymbolCelebration('lotus');
  }, 3000); // Increased from 500 to 2000 (2 seconds gap)
}
              }}
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

            {/* Final Mastery Fireworks - KEEP THIS */}
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
  onContinue={() => {
    console.log('Going to next scene');
    onNavigate?.('temple-scene');
  }}
  onReplay={() => {
    console.log('Replaying pond scene');
    window.location.reload();
  }}
/>

          </div>       
        </MessageManager>
      </InteractionManager>
    /*</ProgressCoach>*/
  );
};

export default PondSceneSimplified;