// zones/symbol-mountain/scenes/pond/PondSceneSimplified.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PondScene.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import { ClickableElement } from "../../../../lib/components/scenes/InteractionManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import { useGameCoach, ProgressCoach, TriggerCoach } from '../../../../lib/components/coach/GameCoach';

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Celebration from '../../../../lib/components/feedback/Celebration';
//import SimplifiedHintSystem from '../../../../lib/components/interactive/SimplifiedHintSystem';
import ScrollUnfurlAnimation from '../../../../lib/components/animation/ScrollUnfurlAnimation';
// Add this to your imports at the top of the file
import Fireworks from '../../../../lib/components/feedback/Fireworks';
// Import at the top with other components
import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';

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
  // Debug log the props
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
          phase: PHASES.INITIAL,
          currentFocus: 'lotus',
          discoveredSymbols: {},
          
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
  // Debug logs to trace component rendering and state
  console.log('PondSceneContent render', {
    sceneState, 
    isReload,
    zoneId,
    sceneId
    
  });

  // Access GameCoach functionality
  const { showMessage } = useGameCoach();

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationConfig, setCelebrationConfig] = useState({});
  const [showSparkle, setShowSparkle] = useState(null);

  // Popup related states
  const [activePopup, setActivePopup] = useState(-1);
  const [popupAnimation, setPopupAnimation] = useState('');
  
  // Scroll animation states
  const [showScrollAnimation, setShowScrollAnimation] = useState(false);
  const [scrollConfig, setScrollConfig] = useState({
    image: null,
    type: "unfurl",
    character: "both"
  });

  // Timeouts ref for cleanup
  const timeoutsRef = useRef([]);

  // Add this ref in your PondSceneContent component
const progressiveHintRef = useRef(null);

// Add this new state for tracking if hint has been used
const [hintUsed, setHintUsed] = useState(false);

// Add these callback functions in PondSceneContent
const handleHintShown = (level) => {
  console.log(`Hint level ${level} shown`);
  setHintUsed(true);
};

const handleHintButtonClick = () => {
  // Track interaction in analytics if needed
  console.log("Hint button clicked");
};

// Configure hint levels based on scene state
const getHintConfigs = () => [
  // Lotus hints
  {
    id: 'lotus-hint',
    message: 'Try clicking on the lotus flowers!',
    explicitMessage: 'Click on all three lotus flowers to make them bloom!',
    position: { top: '40%', left: '30%' },
    condition: (sceneState, hintLevel) => {
      if (!sceneState) return false;
      const lotusStates = sceneState.lotusStates || [0, 0, 0];
      return !lotusStates.every(state => state === 1) && 
             sceneState.currentFocus === 'lotus' && 
             !showCelebration;
    }
  },
  
  // Golden lotus hint
  {
    id: 'golden-hint',
    message: 'The golden lotus holds a secret!',
    explicitMessage: 'Click on the golden lotus to discover its power!',
    position: { top: '45%', left: '45%' },
    condition: (sceneState, hintLevel) => {
      if (!sceneState) return false;
      return sceneState.goldenLotusVisible && 
            !sceneState.goldenLotusBloom && 
            sceneState.currentFocus === 'golden' && 
            !showCelebration;
    }
  },
  
  // Elephant hint
  {
    id: 'elephant-hint',
    message: 'The elephant wants to show you something!',
    explicitMessage: 'Click on the elephant to see what it can do!',
    position: { bottom: '45%', right: '25%' },
    condition: (sceneState, hintLevel) => {
      if (!sceneState) return false;
      return sceneState.elephantVisible && 
            !sceneState.elephantTransformed && 
            sceneState.currentFocus === 'elephant' && 
            !showCelebration;
    }
  }
];

// Simplified GameCoach messages for young children
const gameCoachStoryMessages = [
  // Initial welcome (shorter and more playful)
  {
    message: "Let's explore the magical pond!",
    timing: 3000,
    condition: () => !hintUsed && sceneState?.phase === PHASES.INITIAL
  },
  
  // First lotus discovery (simple excitement)
  {
    message: "Wow! A lotus flower!",
    timing: 1000,
    condition: () => {
      const lotusCount = sceneState?.lotusStates?.filter(s => s === 1).length || 0;
      return lotusCount === 1 && sceneState?.phase === PHASES.SOME_BLOOMED;
    }
  },
  
  // All lotuses bloomed (simple reaction)
  {
    message: "Look! Something magical!",
    timing: 1000,
    condition: () => sceneState?.phase === PHASES.ALL_BLOOMED
  },
  
  // Golden lotus appears (wonder, not explanation)
  {
    message: "Ooooh! Golden lotus!",
    timing: 1000,
    condition: () => sceneState?.phase === PHASES.GOLDEN_VISIBLE
  },
  
  // Elephant appears (excitement)
  {
    message: "An elephant friend!",
    timing: 1000,
    condition: () => sceneState?.phase === PHASES.ELEPHANT_VISIBLE
  },
  
  // Water animation (simple observation)
  {
    message: "Water magic!",
    timing: 1000,
    condition: () => sceneState?.phase === PHASES.ELEPHANT_TRANSFORMED
  },
  
  // Final celebration (pure celebration)
  {
    message: "Hooray! You did it!",
    timing: 1000,
    condition: () => sceneState?.phase === PHASES.COMPLETE
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
  
  // Add ref for hint system
  const hintSystemRef = useRef(null);
  
  // Hint system state
  const [hintsEnabled, setHintsEnabled] = useState(true);
  
 // Update this function to use the new progressive hint system
const hideActiveHints = () => {
  if (progressiveHintRef.current && typeof progressiveHintRef.current.hideHint === 'function') {
    progressiveHintRef.current.hideHint();
  }
};
  
  const discoverSymbol = (symbolId) => {
  if (!sceneState || !sceneActions) return;
  
  const newSymbols = { 
    ...(sceneState.discoveredSymbols || {}), 
    [symbolId]: true 
  };
  
  // Update progress for GameCoach
  const discoveredCount = Object.keys(newSymbols).length;
  const totalSymbols = 3; // lotus, trunk, golden
  const percentage = Math.round((discoveredCount / totalSymbols) * 100);
  
  sceneActions.updateState({ 
    discoveredSymbols: newSymbols,
    progress: {
      ...sceneState.progress,
      percentage: percentage,
      starsEarned: discoveredCount * 2 // 2 stars per symbol
    }
  });
};
  
 const messages = [
 
];
  // Update focus based on game state
  useEffect(() => {
    if (!sceneState || !sceneActions) return;
    
    let newFocus = sceneState.currentFocus || 'lotus';
    const lotusStates = sceneState.lotusStates || [0, 0, 0];
    
    if (sceneState.elephantVisible && !sceneState.elephantTransformed) {
      // Elephant is visible but not transformed - prioritize elephant focus
      newFocus = 'elephant';
    } else if (lotusStates.every(state => state === 1) && 
               sceneState.goldenLotusVisible && 
               !sceneState.goldenLotusBloom) {
      // Golden lotus is visible but not bloomed
      newFocus = 'golden';
    } else if (!lotusStates.every(state => state === 1)) {
      // Not all lotuses are bloomed
      newFocus = 'lotus';
    }
    
    if (newFocus !== sceneState.currentFocus) {
      sceneActions.updateState({ currentFocus: newFocus });
      console.log(`Focus changed to: ${newFocus}`);
    }
  }, [sceneState, sceneActions]);
  
  // Auto-progress golden lotus after all bloom
  useEffect(() => {
    if (!sceneState || !sceneActions) return;
    
    const lotusStates = sceneState.lotusStates || [0, 0, 0];
    const allBloomed = lotusStates.every(state => state === 1);
    
    if ((sceneState.phase === PHASES.ALL_BLOOMED || allBloomed) && 
        !sceneState.goldenLotusVisible) {
      console.log('All lotuses bloomed, showing golden lotus soon...');
      
      // Show sparkle effect
      setShowSparkle('all-lotuses');
      
      const timer = safeSetTimeout(() => {
        // Show golden lotus
        console.log('Showing golden lotus now');
        sceneActions.updateState({ 
          goldenLotusVisible: true,
          phase: PHASES.GOLDEN_VISIBLE,
          currentFocus: 'golden'
        });
        
        setShowSparkle('golden-lotus');
        
        // Show scroll with lotus information first
        safeSetTimeout(() => {
          setScrollConfig({
            image: popup1,
            type: "pop",
            character: "both"
          });
          setShowScrollAnimation(true);
          setShowSparkle(null);
        }, 2000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [sceneState, sceneActions]);

     
      // Add this useEffect to trigger storytelling GameCoach messages based on game state
useEffect(() => {
  if (!sceneState || !showMessage) return;
  
  // Find matching story message
  const matchingMessage = gameCoachStoryMessages.find(
    item => typeof item.condition === 'function' && item.condition()
  );
  
  if (matchingMessage) {
    // Use timeout to slightly delay the message for better timing
    const timer = setTimeout(() => {
      showMessage(matchingMessage.message, {
        duration: 5000,
        animation: 'bounce',
        position: 'bottom-left'
      });
    }, matchingMessage.timing);
    
    return () => clearTimeout(timer);
  }
}, [sceneState?.phase, sceneState?.lotusStates, showMessage]);

 const createWaterDrop = () => {
  if (!sceneActions || !sceneState) return;
  
  const id = Date.now();
  const size = Math.floor(Math.random() * 3) + 1; 
  const speedFactor = Math.random() * 0.5 + 0.8;
  
  // Position variables to match CSS
  const trunkPositionRight = 15; // Match CSS right: 15%
  const trunkPositionBottom = 35; // Match CSS bottom: 35%
  
  // Reduced randomness
  const startPositionX = Math.random() * 10 - 5;  
  const startPositionY = Math.random() * 5 - 2.5;
  const rotationAngle = Math.random() * 20 - 10;
  
  const newDrop = { 
    id, 
    size, 
    speedFactor, 
    startPositionX, 
    startPositionY,
    rotationAngle,
    trunkPositionRight,
    trunkPositionBottom
  };
  
  // Add new drop to existing drops
  const currentDrops = [...(sceneState.waterDrops || [])];
  sceneActions.updateState({ waterDrops: [...currentDrops, newDrop] });
  
  // Remove the drop after animation completes
  safeSetTimeout(() => {
    const currentDrops = [...(sceneState.waterDrops || [])];
    sceneActions.updateState({ 
      waterDrops: currentDrops.filter(drop => drop.id !== id)
    });
  }, 1000); // Match animation duration in CSS
};

  // Handle lotus click
  const handleLotusClick = (index) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`Lotus ${index} clicked`);
    
    // Hide current hint when interaction happens
    hideActiveHints();
    
    // Ensure lotusStates exists
    const lotusStates = [...(sceneState.lotusStates || [0, 0, 0])];
    
    if (lotusStates[index] === 1) {
      console.log(`Lotus ${index} already bloomed`);
      return; // Already bloomed
    }
    
    lotusStates[index] = 1;
    
    // Show sparkle
    setShowSparkle(`lotus-${index}`);
    setTimeout(() => setShowSparkle(null), 1500);
    
    // Update state
    const bloomedCount = lotusStates.filter(s => s === 1).length;
    
    if (bloomedCount === 3) {
      console.log('All lotuses bloomed');
      sceneActions.updateState({ 
        lotusStates,
        phase: PHASES.ALL_BLOOMED,
        progress: {
          ...sceneState.progress,
          percentage: 30,
          starsEarned: 1
        }
      });
      
      // Use GameCoach to provide encouragement
      showMessage("Great job! You found all the lotus flowers!", {
        duration: 3000
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
      
      // First lotus found - use GameCoach
      if (bloomedCount === 1) {
        showMessage("Wonderful! You found your first lotus flower!", {
          duration: 3000
        });
      }
    }
  }; // Added closing brace here to fix the error

  // Handle golden lotus click
  const handleGoldenLotusClick = () => {
    if (!sceneState || !sceneActions) return;
    
    console.log('Golden lotus clicked');
    
    // Hide current hint when interaction happens
    hideActiveHints();
    
    if (sceneState.goldenLotusBloom) {
      console.log('Golden lotus already bloomed');
      return;
    }
    
    // Show sparkle - visual feedback from action
    setShowSparkle('golden-lotus-clicked');

    // Use GameCoach to explain the golden lotus significance
    showMessage("The golden lotus is special in ancient traditions!", {
      duration: 3000
    });
    
    // Important thing happens - immediately update state
    // This ensures reload will maintain correct state
    sceneActions.updateState({
      phase: PHASES.GOLDEN_POPUP
    });
    
    // THEN show popup message
    safeSetTimeout(() => {
      setActivePopup(3); // Show golden lotus popup
      setPopupAnimation('unfurl-scroll');
      setShowSparkle(null);
    }, 500);
  };

  // Handle close popup function
const handleClosePopup = () => {
  setPopupAnimation('close');
  
  // Wait for closing animation to finish
  safeSetTimeout(() => {
    setActivePopup(-1);
    
    // Check which popup was just closed to determine next steps
    if (activePopup === 3) { // Golden lotus popup
      // Show elephant after golden lotus popup closes
      // In handleClosePopup, don't add any animations yet - just make the elephant visible
// ...in the simplified version, update this part:
safeSetTimeout(() => {
  // Only set this ONCE - make visible but DON'T add slide-in yet
  sceneActions.updateState({ 
    elephantVisible: true,
    phase: PHASES.ELEPHANT_VISIBLE,
    currentFocus: 'elephant'
  });
  
  // Add sparkle effect to draw attention
  setShowSparkle('elephant-appear');
  
  safeSetTimeout(() => {
    setShowSparkle(null);
  }, 1500);
}, 300);

    }
  }, 400);
};
  
 // In handleElephantClick, make it match how the original adds the slide-in class
const handleElephantClick = () => {
  if (!sceneState || !sceneActions || sceneState.elephantTransformed) return;
  
  // Hide current hint when interaction happens
  hideActiveHints();
  
  // Set elephant as transforming first
  setShowSparkle('elephant');
  
  // Get the elephant element
  const elephant = document.getElementById('elephant-container');
  if (elephant) {
    // First, add slide-in class - will trigger CSS animation
    elephant.classList.add('elephant-slide-in');
    
    // Wait for the slide-in animation to complete
    safeSetTimeout(() => {
      // Lock the position and add the class for permanence
      elephant.style.right = '4%'; // Matches the CSS value in animation
      elephant.classList.add('elephant-position-locked');
      
      // Update state
      sceneActions.updateState({ 
        elephantTransformed: true,
        trunkActive: true,
        phase: PHASES.ELEPHANT_TRANSFORMED
      });
      
      // Start water animation
      let dropCount = 0;
      const maxDrops = 12;
      
      // Create first water drop
      createWaterDrop();
      dropCount++;
      
      // Create water drops with intervals
      const waterInterval = setInterval(() => {
        if (dropCount >= maxDrops) {
          clearInterval(waterInterval);
          
          // After water animation completes
          safeSetTimeout(() => {
            sceneActions.updateState({ trunkActive: false });
            
            // Show trunk information
            setScrollConfig({
              image: popupTrunk,
              type: "unfurl",
              character: "ganesha"
            });
            setShowScrollAnimation(true);
            setShowSparkle(null);
          }, 1000);
          return;
        }
        
        createWaterDrop();
        dropCount++;
      }, 300);
      
      // Store interval ID for cleanup
      timeoutsRef.current.push(waterInterval);
    }, 1000); // Wait for slide-in animation to complete
  }
};
     

  // Show celebration function with logging
const showSymbolCelebration = (symbol) => {
  let message = "";
  let image = null;
  let stars = 0;
  
  console.log(`Showing celebration for: ${symbol}`); // Add logging
  
  // Set appropriate content based on the symbol
  switch(symbol) {
    case 'lotus':
      message = "Amazing! You've discovered the Lotus Symbol!";
      image = popup1;
      stars = 3;
      discoverSymbol('lotus');
      break;
    case 'trunk':
      message = "Great job! You've discovered the Elephant's Trunk Symbol!";
      image = popupTrunk;
      stars = 2;
      discoverSymbol('trunk');
      break;
    case 'golden':
      message = "Wonderful! The Golden Lotus has bloomed!";
      image = popupGolden;
      stars = 3;
      discoverSymbol('golden');
      break;
    case 'final':
      message = "Amazing! You've discovered all the symbols!";
      image = null; // No image for final celebration
      stars = 5;
      break;
    default:
      message = "Congratulations on your discovery!";
      stars = 1;
  }
  
  // Update celebration config and show
  setCelebrationConfig({
    message,
    image,
    stars
  });
  
  // Make sure celebration shows
  setShowCelebration(true);
  console.log("Celebration should be visible now");
};

 // Handle scroll close with immediate celebration trigger
const handleCloseScroll = () => {
  setShowScrollAnimation(false);
  
  // Check which scroll was just closed based on the current image
  if (scrollConfig.image === popupTrunk) {
    console.log("Trunk scroll closed, showing trunk celebration");
    // Immediately show trunk celebration
    showSymbolCelebration('trunk');
  }
  else if (scrollConfig.image === popup1) {
    console.log("Lotus scroll closed, showing lotus celebration");
    // Immediately show lotus celebration
    showSymbolCelebration('lotus');
  }
};
  
  // Handle celebration close
  const handleCloseCelebration = () => {
    setShowCelebration(false);
    
    // Continue game progression after celebration closes
    if (celebrationConfig.message?.includes("Trunk Symbol")) {
      // After trunk celebration, bloom golden lotus then celebrate
      safeSetTimeout(() => {
        // Add sparkle effect to golden lotus
        setShowSparkle('golden-lotus-bloom');
        
        // Bloom the golden lotus
        safeSetTimeout(() => {
          sceneActions.updateState({
            goldenLotusBloom: true,
            phase: PHASES.GOLDEN_BLOOM
          });
          setShowSparkle(null);
          
          // Show golden lotus celebration
          safeSetTimeout(() => {
            showSymbolCelebration('golden');
          }, 1000);
        }, 1500);
      }, 500);
    }
    else if (celebrationConfig.message?.includes("Golden Lotus")) {
      // After golden celebration, show final "all symbols" celebration
      safeSetTimeout(() => {
        showSymbolCelebration('final');
      }, 1000);
    }
    // Final celebration - game complete
    else if (celebrationConfig.message?.includes("discovered all the symbols")) {
      console.log("Game completed! All symbols discovered!");
      
      // Complete the scene
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
          totalStars: 5  // Added the value 5 here
        });
      }

      // Final GameCoach message - moved outside the object
      showMessage("You've mastered the pond scene! On to the next adventure!", {
        duration: 5000,
        priority: 10
      });
    }
  };
  
  // Handle hint interaction
  const handleHintInteraction = () => {
    console.log('User interacted with a hint');
  };
  
  // Simplified Hint System configurations
  /*const getHintConfigs = () => [
    // Lotus hints
    {
      id: 'lotus-initial',
      message: 'Try clicking on the lotus flowers to make them bloom!',
      position: { top: '40%', left: '30%' },
      condition: () => {
        if (!sceneState) return false;
        const lotusStates = sceneState.lotusStates || [0, 0, 0];
        return !lotusStates.some(state => state === 1) && 
              sceneState.currentFocus === 'lotus' && 
              !showCelebration;
      }
    },
    {
      id: 'lotus-subsequent',
      message: 'Find and click all three lotus flowers!',
      position: { top: '40%', left: '30%' },
      condition: () => {
        if (!sceneState) return false;
        const lotusStates = sceneState.lotusStates || [0, 0, 0];
        return lotusStates.some(state => state === 1) && 
              !lotusStates.every(state => state === 1) && 
              sceneState.currentFocus === 'lotus' && 
              !showCelebration;
      }
    },
    
    // Golden lotus hints
    {
      id: 'golden-initial',
      message: 'A golden lotus has appeared. Click on it to discover its secret!',
      position: { top: '45%', left: '45%' },
      condition: () => {
        if (!sceneState) return false;
        return sceneState.goldenLotusVisible && 
              !sceneState.goldenLotusBloom && 
              sceneState.currentFocus === 'golden' && 
              !showCelebration;
      }
    },
    
    // Elephant hints
    {
      id: 'elephant-initial',
      message: 'Look, an elephant appeared! Tap it to see what happens.',
      position: { bottom: '45%', right: '25%' },
      condition: () => {
        if (!sceneState) return false;
        return sceneState.elephantVisible && 
              !sceneState.elephantTransformed && 
              sceneState.currentFocus === 'elephant' && 
              !showCelebration;
      }
    },
    
    // Reload hints
    {
      id: 'reload-continue-hint',
      message: 'Something magical is about to happen! Watch the pond carefully.',
      position: { top: '40%', left: '50%' },
      condition: () => {
        if (!sceneState) return false;
        const lotusStates = sceneState.lotusStates || [0, 0, 0];
        return lotusStates.every(state => state === 1) && 
              !sceneState.goldenLotusVisible && 
              sceneState.phase === PHASES.ALL_BLOOMED &&
              !showCelebration && 
              sceneState.currentFocus === 'lotus';
      }
    }
  ];*/
  
  // Render helpers
  const getLotusImage = (index) => {
    const lotusStates = sceneState?.lotusStates || [0, 0, 0];
    return lotusStates[index] === 0 ? lotusClosed : lotusBloomed;
  };
  
  // Helper for popup image
  const getPopupImage = () => {
    switch (activePopup) {
      case 3: return popupGolden;
      default: return null;
    }
  };

  // Render celebration function
const renderCelebration = () => {
  if (!showCelebration) return null;
  
  return (
    <>
      <Celebration
        show={showCelebration}
        message={celebrationConfig.message || "Congratulations!"}
        symbolImage={celebrationConfig.image}
        imageAlt="Symbol discovery"
        stars={celebrationConfig.stars || 1}
        onContinue={handleCloseCelebration}
        showConfetti={celebrationConfig.message?.includes("discovered all the symbols")}
      />
      {/* Show fireworks for the final celebration */}
      {celebrationConfig.message?.includes("discovered all the symbols") && (
        <Fireworks
          show={true}
          duration={5000}
          count={8}
          colors={['#FFD700', '#FF1493', '#00CED1', '#98FB98', '#FF6347', '#9370DB']}
          onComplete={() => {
            console.log('Fireworks complete!');
          }}
        />
      )}
    </>
  );
};

  // Render animated popup function
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

  // Render the scroll animation with image
  const renderScrollAnimation = () => {
    if (!showScrollAnimation) return null;
    
    return (
      <div className="scroll-animation-overlay">
        <ScrollUnfurlAnimation
          scrollContent={
            <div className="scroll-image-container">
              <img 
                src={scrollConfig.image} 
                alt="Symbol Information"
                className="scroll-image"
              />
            </div>
          }
          character={scrollConfig.character}
          animation={scrollConfig.type}
          showSparkle={true}
          onAnimationComplete={() => {
            // You can add logic here to execute after animation completes
          }}
          buttonProps={{ 
            text: "I understand!", 
            onClick: handleCloseScroll
          }}
        />
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
  
  // If sceneState is undefined, show a loading message
  if (!sceneState) {
    return <div className="loading">Loading scene state...</div>;
  }
  
  return (
      <ProgressCoach sceneId={sceneId} sceneState={sceneState}>
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager 
        messages={messages}
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

            {/* GameCoach Triggers for lotus interactions */}
<TriggerCoach 
  message="You found your first lotus flower! Find two more!"
  condition={sceneState.lotusStates && sceneState.lotusStates.filter(state => state === 1).length === 1}
  once={true}
/>

<TriggerCoach 
  message="Just one more lotus to find! You're doing great!"
  condition={sceneState.lotusStates && sceneState.lotusStates.filter(state => state === 1).length === 2}
  once={true}
/>
            
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

            {/* GameCoach Trigger for golden lotus */}
<TriggerCoach 
  message="The golden lotus is special - click it to learn more!"
  condition={sceneState.goldenLotusVisible && !sceneState.elephantVisible}
  once={true}
/>
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

{/* GameCoach Trigger for elephant */}
<TriggerCoach 
  message="The elephant represents Lord Ganesha. Click it to see what happens!"
  condition={sceneState.elephantVisible && !sceneState.elephantTransformed}
  once={true}
/>
              </div>
            )}
            
            {/* Simplified Hint System 
            <SimplifiedHintSystem 
              ref={hintSystemRef}
              hints={getHintConfigs()}
              enabled={hintsEnabled}
              initialDelay={5000}     // Initial hint after 5 seconds
              initialDuration={3000}  // Initial hint stays for 3 seconds
              subsequentDelay={8000}  // 8 seconds between hints
              coachDelay={5000}       // Coach appears after 5 seconds if hint not dismissed
              coachEnabled={true}     
              coachImage={mooshikaCoach}
              onUserInteraction={handleHintInteraction}
            />

            {/* Progressive Hint System */}
<ProgressiveHintSystem
  ref={progressiveHintRef}
  sceneId={sceneId}
  sceneState={sceneState}
  hintConfigs={getHintConfigs()}
  characterImage={mooshikaCoach}
  initialDelay={15000}  // 15 seconds before pulsing
  hintDisplayTime={7000}  // 7 seconds display time
  position="bottom-right"
  iconSize={60}
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
            
       // Update the water drop rendering
{(sceneState.waterDrops || []).map(drop => (
  <div 
    key={drop.id} 
    className="water-drop active"
    style={{
      fontSize: `${drop.size * 2 + 1}vh`,
      right: `${drop.trunkPositionRight + drop.startPositionX}%`,
      bottom: `${drop.trunkPositionBottom + drop.startPositionY}%`, 
      transform: `rotate(${drop.rotationAngle}deg)`,
      // Add custom animation to override default
      animation: `fall ${drop.speedFactor}s forwards`,
      animationFillMode: 'forwards'
    }}
  >
    💧
  </div>
))}
          </div>
          
          {/* Scroll Animation Overlay with Image */}
          {renderScrollAnimation()}
          
          {/* Celebration with simplified props */}
       {/* Celebration Component */}
{renderCelebration()}

          {/* Popup overlay with animation */}
          {renderAnimatedPopup()}
          
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
        </div>
      </MessageManager>
    </InteractionManager>
    </ProgressCoach>



  );
};

export default PondSceneSimplified;