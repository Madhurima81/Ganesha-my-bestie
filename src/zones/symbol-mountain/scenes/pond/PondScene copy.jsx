// PondScene.jsx - Updated imports only
import React, { useState, useEffect, useRef } from 'react';
import './PondScene.css';

// Updated import paths - go up 4 levels from scenes/pond to reach lib
import useAnimation from '../../../../lib/hooks/useAnimation';
import SimplifiedHintSystem from '../../../../lib/components/interactive/SimplifiedHintSystem';
import InteractiveElementWrapper from '../../../../lib/components/interactive/InteractiveElementWrapper';
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import ScrollUnfurlAnimation from '../../../../lib/components/animation/ScrollUnfurlAnimation';
import Celebration from '../../../../lib/components/feedback/Celebration';
import SymbolSidebar from '../../shared/components/SymbolSidebar';
import ZonesNav from '../../../../lib/components/navigation/ZonesNav';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
// At the top with other imports
import ProgressModal from '../../../../lib/components/progress/ProgressModal';
import GameStateManager from '../../../../lib/services/GameStateManager';



// Scene-specific images - now in local assets folder
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

// Character from global assets
import mooshikaCoach from "./assets/images/mooshika-coach.png";

const PondScene = ({ onComplete, isActive, onNavigate, onSceneSelect,  // ADD THIS
  zoneId,    // ADD THIS  
  sceneId  }) => {
    // State for the three regular lotuses (0 = closed, 1 = bloomed)
  const [lotusStates, setLotusStates] = useState([0, 0, 0]);
  
  // Animation states
  const [lotusAnimating, setLotusAnimating] = useState([-1, -1, -1]); // -1 = not animating, 0 = animating
  const [goldenAnimating, setGoldenAnimating] = useState(false);
  const [elephantFullAnimating, setElephantFullAnimating] = useState(false);
  
  // Sparkle animation states - Using refs to avoid re-renders
  const sparkleTargetRef = useRef(null);
  const sparkleTypeRef = useRef('star');
  const sparkleColorRef = useRef('gold');
  
  // Visible state for sparkles
  const [showSparkleOn, setShowSparkleOn] = useState(null);
  
  // Game counter state
  const [bloomedCount, setBloomedCount] = useState(0);
  const [gameStage, setGameStage] = useState(0); // 0=start, 1=some bloomed, 2=all bloomed, 3=golden visible, 4=elephant, 5=full elephant
  
  // State for which popup to show (-1 = none, 0, 3, 4 = specific popup)
  const [activePopup, setActivePopup] = useState(-1);
  const [popupAnimation, setPopupAnimation] = useState('');
  
  // State for game progression
  const [goldenLotusVisible, setGoldenLotusVisible] = useState(false);
  const [goldenLotusBloom, setGoldenLotusBloom] = useState(false);
  const [elephantVisible, setElephantVisible] = useState(false);
  const [elephantTransformed, setElephantTransformed] = useState(false); // New state for elephant transformation
  const [trunkActive, setTrunkActive] = useState(false);
  const [waterDrops, setWaterDrops] = useState([]);
  
  // New states for scroll animation
  const [showScrollAnimation, setShowScrollAnimation] = useState(false);
  const [scrollAnimationType, setScrollAnimationType] = useState("unfurl");
  const [scrollCharacter, setScrollCharacter] = useState("both");
  const [currentPopupImage, setCurrentPopupImage] = useState(popup1);
  
  // Celebration states
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [celebrationImage, setCelebrationImage] = useState("");
  const [celebrationStars, setCelebrationStars] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);


  // Navigation states
  const [isAudioOn, setIsAudioOn] = useState(true);
  // Add this with your other useState declarations (around line 35-50)
const [showProgressModal, setShowProgressModal] = useState(false);
  // Zones modal state
const [showZonesModal, setShowZonesModal] = useState(false);
const [currentZone, setCurrentZone] = useState({
  id: 1,
  name: 'Symbol Mountain',
  icon: '🏔️'
});

// Define your zones data
const zones = [
  { id: 1, name: 'Symbol Mountain', icon: '🏔️', unlocked: true, stars: 2, totalStars: 3 },
  { id: 2, name: 'Rainbow Valley', icon: '🌈', unlocked: true, stars: 0, totalStars: 3 },
  { id: 3, name: 'Ocean Depths', icon: '🌊', unlocked: false, stars: 0, totalStars: 4 },
  { id: 4, name: 'Sky Kingdom', icon: '☁️', unlocked: false, stars: 0, totalStars: 3 },
  { id: 5, name: 'Forest Haven', icon: '🌲', unlocked: false, stars: 0, totalStars: 5 },
  { id: 6, name: 'Desert Oasis', icon: '🏜️', unlocked: false, stars: 0, totalStars: 3 },
  { id: 7, name: 'Ice Palace', icon: '❄️', unlocked: false, stars: 0, totalStars: 4 },
  { id: 8, name: 'Volcano Peak', icon: '🌋', unlocked: false, stars: 0, totalStars: 5 }
];

// Create zones data for Progress Modal (adapts your existing zones)
const progressZones = zones.map(zone => ({
  ...zone,
  completed: zone.id === 1 && bloomedCount === 3 && goldenLotusVisible, // Example for Symbol Mountain
  completedScenes: zone.id === 1 ? (bloomedCount > 0 ? 1 : 0) : 0, // Example calculation
  scenes: Array(5).fill({}), // Assuming 5 scenes per zone
  stars: zone.id === 1 ? celebrationStars : zone.stars // Use actual stars for current zone
}));

// Track discovered symbols
const [discoveredSymbols, setDiscoveredSymbols] = useState(() => {
  const saved = localStorage.getItem('symbolMountainSymbols');
  return saved ? JSON.parse(saved) : {
    lotus: false,
    modak: false,
    mooshika: false,
    belly: false,
    ear: false,
    eyes: false
  };
});

  // Add this for our simplified hint system
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [currentFocus, setCurrentFocus] = useState('lotus'); // 'lotus', 'golden', 'elephant'

  useEffect(() => {
  // Remove all body padding/margin and center alignment
  const originalStyles = {
    margin: document.body.style.margin,
    padding: document.body.style.padding,
    display: document.body.style.display,
    placeItems: document.body.style.placeItems,
    backgroundColor: document.body.style.backgroundColor
  };
  
  // Set body to take full viewport
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.display = 'block';
  document.body.style.placeItems = 'normal';
  document.body.style.backgroundColor = 'transparent';
  
  // Also ensure #root takes full height
  const root = document.getElementById('root');
  if (root) {
    root.style.height = '100vh';
    root.style.margin = '0';
    root.style.padding = '0';
  }
  
  // Restore original styles when component unmounts
  return () => {
    Object.keys(originalStyles).forEach(key => {
      document.body.style[key] = originalStyles[key];
    });
    if (root) {
      root.style.height = '';
      root.style.margin = '';
      root.style.padding = '';
    }
  };
}, []);
  
  // Add ref to hint system for direct control
  const hintSystemRef = useRef(null);
  
  // Function to explicitly hide active hints
  const hideActiveHints = () => {
    if (hintSystemRef.current && typeof hintSystemRef.current.hideCurrentHint === 'function') {
      hintSystemRef.current.hideCurrentHint();
    }
  };
  
  // Ref for timeouts to clean up
  const timeoutsRef = useRef([]);
  
  // Function to safely set timeouts with cleanup
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };
  
  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // Handle user interaction with hints
  const handleHintInteraction = () => {
    // This can be used to reset timers or other logic when user interacts with a hint
    console.log('User interacted with a hint');
  };

  // Simplified Hint System configurations - this replaces all previous guidance systems
  const getHintConfigs = () => [
    // Lotus hints
    {
      id: 'lotus-initial',
      message: 'Try clicking on the lotus flowers to make them bloom!',
      position: { top: '40%', left: '30%' },
      // Condition will no longer be true when any lotus blooms or if user is focusing on a different element
      condition: () => !lotusStates.some(state => state === 1) && 
                     currentFocus === 'lotus' && 
                     !showScrollAnimation && !showCelebration && activePopup === -1
    },
    {
      id: 'lotus-subsequent',
      message: 'Find and click all three lotus flowers!',
      position: { top: '40%', left: '30%' },
      // Condition will no longer be true when all lotuses bloom or if user is focusing on a different element
      condition: () => lotusStates.some(state => state === 1) && 
                     !lotusStates.every(state => state === 1) && 
                     currentFocus === 'lotus' && 
                     !showScrollAnimation && !showCelebration && activePopup === -1
    },
    
    // Golden lotus hints
    {
      id: 'golden-initial',
      message: 'A golden lotus has appeared. Click on it to discover its secret!',
      position: { top: '45%', left: '45%' },
      // Condition will no longer be true after golden lotus is clicked (popup shows) or it blooms
      condition: () => goldenLotusVisible && 
                     !goldenLotusBloom && 
                     !trunkActive && 
                     currentFocus === 'golden' && 
                     activePopup !== 3 && 
                     !showScrollAnimation && !showCelebration && activePopup === -1
    },
    {
      id: 'golden-subsequent',
      message: 'The golden lotus is special! Try clicking on it.',
      position: { top: '45%', left: '45%' },
      // Condition will no longer be true after golden lotus is clicked (popup shows) or it blooms
      condition: () => goldenLotusVisible && 
                     !goldenLotusBloom && 
                     !trunkActive && 
                     currentFocus === 'golden' && 
                     activePopup !== 3 && 
                     !showScrollAnimation && !showCelebration && activePopup === -1
    },
    
    // Elephant hints - simplified and more direct conditions
    {
      id: 'elephant-initial',
      message: 'Look, an elephant appeared! Tap it to see what happens.',
      position: { bottom: '45%', right: '25%' }, // Adjusted position to ensure visibility
      condition: () => elephantVisible && 
                     !elephantTransformed && 
                     !elephantFullAnimating &&
                     currentFocus === 'elephant' && 
                     !showScrollAnimation && !showCelebration && activePopup === -1
    },
    {
      id: 'elephant-subsequent',
      message: 'The elephant wants to show you something special! Click on it.',
      position: { bottom: '45%', right: '25%' }, // Adjusted position to ensure visibility
      condition: () => elephantVisible && 
                     !elephantTransformed && 
                     !elephantFullAnimating &&
                     currentFocus === 'elephant' && 
                     !showScrollAnimation && !showCelebration && activePopup === -1
    },
    {
    id: 'reload-continue-hint',
    message: 'Something magical is about to happen! Watch the pond carefully.',
    position: { top: '40%', left: '50%' },
    condition: () => lotusStates.every(state => state === 1) && 
                   !goldenLotusVisible && 
                   gameStage >= 2 &&
                   !showScrollAnimation && 
                   !showCelebration && 
                   activePopup === -1 &&
                   currentFocus === 'lotus' // Only show if we're stuck after reload
  },

  ];
  
  // Update focus based on game state
  useEffect(() => {
    
    // Determine what should be the current focus based on game state
    if (elephantVisible && !elephantTransformed) {
      // Elephant is visible but not transformed - prioritize elephant focus
      setCurrentFocus('elephant');
      console.log("FOCUS SET TO ELEPHANT"); // Debugging log
    } else if (lotusStates.every(state => state === 1) && goldenLotusVisible && !goldenLotusBloom) {
      // Golden lotus is visible but not bloomed
      setCurrentFocus('golden');
      console.log("FOCUS SET TO GOLDEN"); // Debugging log
    } else if (!lotusStates.every(state => state === 1)) {
      // Not all lotuses are bloomed
      setCurrentFocus('lotus');
      console.log("FOCUS SET TO LOTUS"); // Debugging log
    }
  }, [lotusStates, goldenLotusVisible, goldenLotusBloom, elephantVisible, elephantTransformed]);
  
  // Show celebration function
  const showSymbolCelebration = (symbol) => {
    let message = "";
    let image = "";
    let stars = 0;
    
    // Set appropriate content based on the symbol
    switch(symbol) {
      case 'lotus':
        message = "Amazing! You've discovered the Lotus Symbol!";
        image = popup1;
        stars = 3;
              discoverSymbol('lotus'); // ADD THIS LINE
        break;
      case 'trunk':
        message = "Great job! You've discovered the Elephant's Trunk Symbol!";
        image = popupTrunk;
        stars = 2;
              discoverSymbol('trunk'); // ADD THIS (trunk might map to ear symbol)
        break;
      case 'golden':
        message = "Wonderful! The Golden Lotus has bloomed!";
        image = popupGolden;
        stars = 3;
        break;
      default:
        message = "Congratulations on your discovery!";
        stars = 1;
    }
    
    setCelebrationMessage(message);
    setCelebrationImage(image);
    setCelebrationStars(stars);
    setShowCelebration(true);
  };
  
 // Replace the entire handleCloseCelebration function with this:
const handleCloseCelebration = () => {
  setShowCelebration(false);
  
  // Continue game progression after celebration closes
  if (gameStage === 2 && !goldenLotusVisible) {
    // After lotus celebration, show golden lotus
    safeSetTimeout(() => {
      setGoldenLotusVisible(true);
      setGoldenAnimating(true);
      
      // Add sparkle effect
      sparkleTargetRef.current = 'golden-lotus';
      sparkleTypeRef.current = 'glitter';
      sparkleColorRef.current = 'gold';
      setShowSparkleOn('golden-lotus');
      
      safeSetTimeout(() => {
        setGameStage(3);
        
        // Reset golden animation after it completes
        safeSetTimeout(() => {
          setGoldenAnimating(false);
          setShowSparkleOn(null); // Remove sparkle
        }, 1500);
      }, 500);
    }, 1000);
  }
  // Add this new condition for after trunk celebration
  else if (celebrationMessage.includes("Trunk Symbol")) {
    // After trunk celebration, bloom golden lotus then celebrate
    safeSetTimeout(() => {
      // Add sparkle effect to golden lotus
      sparkleTargetRef.current = 'golden-lotus-bloom';
      sparkleTypeRef.current = 'glitter';
      sparkleColorRef.current = 'gold';
      setShowSparkleOn('golden-lotus-bloom');
      
      // Bloom the golden lotus
      safeSetTimeout(() => {
        setGoldenLotusBloom(true);
        setShowSparkleOn(null);
        
        // Show golden lotus celebration
        safeSetTimeout(() => {
          showSymbolCelebration('golden');
        }, 1000);
      }, 1500);
    }, 500);
  }
  // Add this for the final celebration
  else if (celebrationMessage.includes("Golden Lotus")) {
    // After golden celebration, show final "all symbols" celebration
    safeSetTimeout(() => {
      setCelebrationMessage("Amazing! You've discovered all the symbols!");
      setCelebrationImage(null); // or create a special combined image
      setCelebrationStars(5); // Maximum stars
      setShowCelebration(true);
    }, 1000);
  }
  // Final celebration - game complete
  else if (celebrationMessage.includes("discovered all the symbols")) {
    console.log("Game completed! All symbols discovered!");
      handleSceneComplete(); // Call scene completion

    // You could add navigation or restart logic here
  }
};

  // Add this near the top of the PondScene component
useEffect(() => {
  // Debug check for mooshika image
  console.log("mooshikaCoach image path:", mooshikaCoach);
  
  // Test if image loads
  const img = new Image();
  img.onload = () => console.log("Mooshika image loaded successfully! Size:", img.width, "x", img.height);
  img.onerror = () => console.error("Failed to load mooshika image!");
  img.src = mooshikaCoach;
}, []);
  
  // Check if all lotuses are bloomed to update counter and show popup
  useEffect(() => {
    // Count bloomed lotuses
    const newCount = lotusStates.filter(state => state === 1).length;
    setBloomedCount(newCount);
    
    // Update game stage based on count
    if (newCount > 0 && newCount < 3) {
      setGameStage(1); // Some lotuses bloomed
    } else if (newCount === 3 && gameStage < 2) {
      setGameStage(2); // All lotuses bloomed
      
      // Delay popup appearance slightly
      safeSetTimeout(() => {
        // Add sparkle effect
        sparkleTargetRef.current = 'all-lotuses';
        sparkleTypeRef.current = 'magic';
        sparkleColorRef.current = 'lightblue';
        setShowSparkleOn('all-lotuses');
        
        // Show scroll animation after all lotuses bloom
        safeSetTimeout(() => {
          setShowSparkleOn(null); // Remove sparkle
          setCurrentPopupImage(popup1);
          setScrollAnimationType("pop");
          setScrollCharacter("both");
          setShowScrollAnimation(true);
        }, 1500);
      }, 1000);
    }
  }, [lotusStates, gameStage]);

  useEffect(() => {
  // Load saved state if it exists
  const savedState = GameStateManager.getSceneState('symbol-mountain', 'pond');
  
  if (savedState) {
    console.log('Loading saved state:', savedState);
    // Restore game state
    setLotusStates(savedState.lotusStates || [0, 0, 0]);
    setGoldenLotusVisible(savedState.goldenLotusVisible || false);
    setGoldenLotusBloom(savedState.goldenLotusBloom || false);
    setElephantVisible(savedState.elephantVisible || false);
    setElephantTransformed(savedState.elephantTransformed || false);
    setCelebrationStars(savedState.stars || 0);
    setGameStage(savedState.gameStage || 0);
    setBloomedCount(savedState.bloomedCount || 0);
    
    // Restore symbols
    if (savedState.symbols) {
      setDiscoveredSymbols(savedState.symbols);
    }
  }
}, []); // Run once on mount

// This useEffect goes in PondScene.jsx to handle saving
useEffect(() => {
  // Skip saving on initial mount
  if (gameStage === 0 && bloomedCount === 0 && !goldenLotusVisible) {
    return;
  }
  
  // Create save state with popup/scroll states
  const saveState = {
    lotusStates,
    goldenLotusVisible,
    goldenLotusBloom,
    elephantVisible,
    elephantTransformed,
    gameStage,
    bloomedCount,
    stars: celebrationStars,
    symbols: discoveredSymbols,
    // Add these new fields to track popup/scroll states
    hasShownLotusScroll: gameStage >= 2 && goldenLotusVisible,
    hasShownGoldenPopup: goldenLotusBloom || elephantVisible,
    hasShownTrunkScroll: elephantTransformed,
    lastSaved: Date.now()
  };
  
  // Save to GameStateManager
  GameStateManager.saveGameState(
    zoneId || 'symbol-mountain',  // Use prop or default
    sceneId || 'pond',            // Use prop or default
    saveState
  );
  console.log('Game state saved:', saveState);
  
}, [
  lotusStates,
  goldenLotusVisible,
  goldenLotusBloom,
  elephantVisible,
  elephantTransformed,
  gameStage,
  bloomedCount,
  celebrationStars,
  discoveredSymbols,
  zoneId,
  sceneId
]);
  // After functions like handleCloseCelebration, add:

// Navigation handlers
const handleNavigate = (destination) => {
  console.log('Navigate to:', destination);
  // Implement navigation logic
};

const handleHome = () => {
  console.log('Return to main map');
  if (onNavigate) {
    onNavigate('home');
  }
};
const handleSettings = () => {
  console.log('Open settings');
  // Open settings modal
};

const handleParentDashboard = () => {
  console.log('Open parent dashboard');
  // Open parent dashboard
};

const handleHelp = () => {
  console.log('Show help');
  // Toggle hint system or show help modal
};

const handleActivities = () => {
  console.log('Show offline activities');
  // Open activities modal/page
};

const handleSELQuestions = () => {
  console.log('Show SEL questions');
  // Open SEL questions modal
};

const handleAudioToggle = () => {
  setIsAudioOn(!isAudioOn);
  // Toggle audio system
};

// Zones modal handlers
const handleZonesClick = () => {
  if (onNavigate) {
    onNavigate('zones');
  } else {
    setShowZonesModal(true);
  }
};

const handleZoneSelect = (zone) => {
  console.log('Selected zone:', zone);
  setCurrentZone(zone);
  setShowZonesModal(false);
  
  if (!zone.unlocked) {
    alert(`${zone.name} is locked! Complete more stars to unlock it.`);
  } else {
    alert(`Navigating to ${zone.name}...`);
    // In a real app, you'd use React Router or similar:
    // navigate(`/zones/${zone.id}`);
  }
};

// Function to mark a symbol as discovered
const discoverSymbol = (symbolId) => {
  const newSymbols = { ...discoveredSymbols, [symbolId]: true };
  setDiscoveredSymbols(newSymbols);
  localStorage.setItem('symbolMountainSymbols', JSON.stringify(newSymbols));
};

// Add scene completion handler
const handleSceneComplete = () => {
  console.log("Pond scene completed!");
  
  // Create final save state
  const finalState = {
    completed: true,
    stars: celebrationStars,
    symbols: discoveredSymbols,
    lotusStates,
    goldenLotusBloom,
    elephantTransformed,
    lastCompleted: Date.now()
  };
  
  // Save to GameStateManager
  GameStateManager.saveGameState('symbol-mountain', 'pond', finalState);
  
  // Call parent's onComplete
  if (onComplete) {
    onComplete('pond', { 
      stars: celebrationStars, 
      completed: true,
      totalStars: 8
    });
  }
};

  
  // Handle lotus click function
  const handleLotusClick = (index) => {
    // Allow clicking even if other lotuses are animating
    // Only check if THIS lotus is not already bloomed or animating
    if (lotusStates[index] === 0 && lotusAnimating[index] === -1) {
      // Hide current hint when interaction happens
      hideActiveHints();
      
      // Start animation on the clicked lotus
      const newLotusAnimating = [...lotusAnimating];
      newLotusAnimating[index] = 0;
      setLotusAnimating(newLotusAnimating);
      
      // Show sparkle effect on the clicked lotus
      sparkleTargetRef.current = `lotus-${index}`;
      sparkleTypeRef.current = 'star';
      sparkleColorRef.current = '#ff9ebd';
      setShowSparkleOn(`lotus-${index}`);
      
      // Mark the lotus as bloomed immediately
      // This allows for immediate visual feedback
      const newLotusStates = [...lotusStates];
      newLotusStates[index] = 1;
      setLotusStates(newLotusStates);
      
      // Keep animation running, but reset animation state after it completes
      safeSetTimeout(() => {
        const newLotusAnimating = [...lotusAnimating];
        newLotusAnimating[index] = -1;
        setLotusAnimating(newLotusAnimating);
        
        // Remove sparkle effect
        if (showSparkleOn === `lotus-${index}`) {
          setShowSparkleOn(null);
        }
      }, 1800);
    }
  };
  
  // Handle golden lotus click function
  const handleGoldenLotusClick = () => {
    // Remove the animation condition and check
    if (!goldenLotusBloom) {
      // Hide current hint when interaction happens
      hideActiveHints();
      
      // Just add sparkle effect and show popup
      sparkleTargetRef.current = 'golden-lotus-clicked';
      sparkleTypeRef.current = 'magic';
      sparkleColorRef.current = 'orange';
      setShowSparkleOn('golden-lotus-clicked');
      
      safeSetTimeout(() => {
        setActivePopup(3); // Show golden lotus popup
        setPopupAnimation('unfurl-scroll');
        setShowSparkleOn(null); // Remove sparkle
      }, 500); // Reduced from 1000 to 500 for faster response
    }
  };
  
  // Create water drop function
  const createWaterDrop = () => {
    const id = Date.now();
    const size = Math.floor(Math.random() * 3) + 1; // Random size 1-3
    const speedFactor = Math.random() * 0.5 + 0.8; // Random speed factor 0.8-1.3
    
    // Position variables for trunk
    // Trunk is positioned at right: 20%, bottom: 30% in the JSX
    const trunkPositionRight = 20; // Match with trunk position in JSX
    const trunkPositionBottom = 30; // Match with trunk position in JSX
    
    // Reduced randomness for more accurate positioning
    const startPositionX = Math.random() * 10 - 5; // Less random X position 
    const startPositionY = Math.random() * 5 - 2.5;  // Less random Y position
    const rotationAngle = Math.random() * 20 - 10;  // Less random rotation
    
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
    
    setWaterDrops(prev => [...prev, newDrop]);
    
    // Remove the drop after animation completes
    safeSetTimeout(() => {
      setWaterDrops(prev => prev.filter(drop => drop.id !== id));
    }, 1000 * speedFactor);
  };

  // Handle elephant click function
  const handleElephantClick = () => {
    if (!elephantFullAnimating && !trunkActive) {
      // Hide current hint when interaction happens
      hideActiveHints();
      
      setElephantFullAnimating(true);
      
      // Add sparkle effect
      sparkleTargetRef.current = 'elephant';
      sparkleTypeRef.current = 'firefly';
      sparkleColorRef.current = 'lightblue';
      setShowSparkleOn('elephant');
      
      // Get the elephant element
      const elephant = document.getElementById('elephant-container');
      if (elephant) {
        // First, slide the elephant in
        elephant.classList.add('elephant-slide-in');
        
        // Wait for the slide-in animation to complete
        safeSetTimeout(() => {
          // Lock the position to prevent sliding back
          elephant.style.right = '5%';
          elephant.classList.add('elephant-position-locked');
          
          // Now transform to water elephant
          setElephantTransformed(true);
          elephant.classList.add('transform-active');
          
          safeSetTimeout(() => {
            setElephantFullAnimating(false);
            setShowSparkleOn(null); // Remove sparkle
            elephant.classList.remove('transform-active');
            
            // Start the trunk and water animation
            setTrunkActive(true);
            
            // Start enhanced water animation with varying drops
            let dropCount = 0;
            const maxDrops = 12;
            
            // Create first water drop immediately
            createWaterDrop();
            dropCount++;
            
            // Create water drops with varying intervals
            const waterInterval = setInterval(() => {
              if (dropCount >= maxDrops) {
                clearInterval(waterInterval);
                
                // After water animation completes
                safeSetTimeout(() => {
                  setTrunkActive(false);
                  
                  // Show trunk information
                  setCurrentPopupImage(popupTrunk);
                  setScrollAnimationType("unfurl");
                  setScrollCharacter("ganesha");
                  setShowScrollAnimation(true);
                }, 1000);
                return;
              }
              
              createWaterDrop();
              dropCount++;
            }, 300);
            
            // Store interval ID for cleanup
            timeoutsRef.current.push(waterInterval);
          }, 800);
        }, 1000); // Wait for slide-in animation to complete
      }
    }
  };
  
// Replace the entire handleCloseScroll function with this:
const handleCloseScroll = () => {
  setShowScrollAnimation(false);
  
  // Check which scroll was just closed based on the current popup image
  if (currentPopupImage === popupTrunk) {
    // After trunk scroll, show trunk celebration
    safeSetTimeout(() => {
      showSymbolCelebration('trunk');
    }, 500);
  }
  else if (gameStage === 2 && bloomedCount === 3 && !goldenLotusVisible) {
    // After lotus scroll, show lotus celebration
    safeSetTimeout(() => {
      showSymbolCelebration('lotus');
    }, 500);
  }
};
  
  // Get lotus class
  const getLotusClass = (index) => {
    const baseClass = "lotus " + (index === 0 ? "lotus-1" : index === 1 ? "lotus-2" : "lotus-3");
    
    if (lotusAnimating[index] === 0) {
      return baseClass + " lotus-bloom-animation";
    }
    
    return baseClass;
  };
  
  // Get golden lotus class
  const getGoldenLotusClass = () => {
    let className = "golden-lotus";
    
   // if (goldenAnimating) {
//className += " golden-animation";
//}
    
    if (goldenLotusBloom) {
      className += " bloomed";
    }
    
    return className;
  };
  
  // Simplified get lotus image function
  const getLotusImage = (index) => {
    return lotusStates[index] === 0 ? lotusClosed : lotusBloomed;
  };
  
  // Get popup image based on active popup
  const getPopupImage = () => {
    switch (activePopup) {
      case 0: return popup1; // Popup 1 shown after all lotuses bloom
      case 3: return popupGolden;
      case 4: return popupTrunk;
      default: return null;
    }
  };
  
 // Replace your existing renderCounter function with this:
const renderCounter = () => {
  const bloomCount = lotusStates.filter(state => state === 1).length;
  
  return (
    <div className="lotus-counter">
      <div className="counter-icon">
        <img 
          src={bloomCount > 0 ? lotusBloomed : lotusClosed}
          alt="Lotus"
        />
      </div>
      <div className="counter-progress">
        <div 
          className="counter-progress-fill"
          style={{width: `${(bloomCount / 3) * 100}%`}}
        />
      </div>
      <div className="counter-display">
        {bloomCount}/3
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
                src={currentPopupImage} 
                alt="Symbol Information"
                className="scroll-image"
              />
            </div>
          }
          character={scrollCharacter}
          animation={scrollAnimationType}
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
  
  const renderCelebration = () => {
  if (!showCelebration) return null;
  
  return (
    <>
      <Celebration
        show={showCelebration}
        message={celebrationMessage}
        symbolImage={celebrationImage}
        imageAlt="Symbol discovery"
        stars={celebrationStars}
        onContinue={handleCloseCelebration}
        showConfetti={celebrationMessage.includes("discovered all the symbols")} // Only show confetti if NOT the final celebration
      />
      {/* Show fireworks for the final celebration */}
      {celebrationMessage.includes("discovered all the symbols") && (
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
  
  // Handle close popup function
  const handleClosePopup = () => {
    setPopupAnimation('close');
    
    // Wait for closing animation to finish
    safeSetTimeout(() => {
      setActivePopup(-1);
      
      // Check which popup was just closed to determine next steps
      if (activePopup === 3) {
        // After golden lotus popup, just make elephant visible without animation
        safeSetTimeout(() => {
          setElephantVisible(true); // Show partially visible elephant
          console.log("ELEPHANT SET VISIBLE, currentFocus=", currentFocus); // Debug log
          
          // Explicitly set focus to elephant here
          setCurrentFocus('elephant');
          
          // Add sparkle effect to draw attention
          sparkleTargetRef.current = 'elephant-appear';
          sparkleTypeRef.current = 'star';
          sparkleColorRef.current = '#aaaaaa';
          setShowSparkleOn('elephant-appear');
          
          // IMPORTANT: DON'T add any slide-in class here
          
          safeSetTimeout(() => {
            setShowSparkleOn(null); // Remove sparkle after a moment
            // Double check the focus is still on elephant
            if (currentFocus !== 'elephant') {
              console.log("RE-SETTING FOCUS TO ELEPHANT"); // Debug log
              setCurrentFocus('elephant');
            }
          }, 1500);
        }, 300);
      }
    }, 400);
  };
  
  return (
    <div className="pond-scene-container">
      {/* Add the animation to the document */}
      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }
      `}</style>
      
      {/* Pond background */}
      <div className="pond-background" style={{ backgroundImage: `url(${pondBackground})` }}>
        {/* Counter with lotus images at top and smaller text at bottom */}
        {renderCounter()}
        
        {/* Regular lotus flowers with tooltips */}
        {[0, 1, 2].map((index) => (
          <div key={index} className={getLotusClass(index)}>
            <InteractiveElementWrapper
              onClick={() => handleLotusClick(index)}
              zone="pond-zone"
              completed={lotusStates[index] === 1 ? "true" : undefined}
            >
              <img 
                src={getLotusImage(index)}
                alt={`Lotus ${index + 1}`}
                style={{ width: '100%', height: '100%' }}
              />
            </InteractiveElementWrapper>
            {showSparkleOn === `lotus-${index}` && (
              <SparkleAnimation
                type={sparkleTypeRef.current}
                count={15}
                color={sparkleColorRef.current}
                size={10}
                duration={1500}
                fadeOut={true}
                area="full"
                onComplete={() => {}}
              />
            )}
          </div>
        ))}
        
        {/* All lotuses sparkle */}
        {showSparkleOn === 'all-lotuses' && (
          <div className="all-lotuses-sparkle">
            <SparkleAnimation
              type={sparkleTypeRef.current}
              count={20}
              color={sparkleColorRef.current}
              size={10}
              duration={1500}
              fadeOut={true}
              area="full"
              onComplete={() => {}}
            />
          </div>
        )}
        
        {goldenLotusVisible && (
          <div 
            className={`golden-lotus-container ${goldenLotusBloom ? 'blooming' : ''} ${showSparkleOn === 'golden-lotus' || showSparkleOn === 'golden-lotus-clicked' || showSparkleOn === 'golden-lotus-bloom' ? 'glow' : ''}`}
          >
            <InteractiveElementWrapper
              onClick={handleGoldenLotusClick}
              preservePosition={true}
              zone="golden-zone"
              id="debug-golden-lotus"
              completed={goldenLotusBloom ? "true" : undefined}
              style={{ width: '100%', height: '100%' }}
            >
              <img 
                src={goldenLotusBloom ? goldenLotusBloomed : goldenLotusClosed}
                alt="Golden Lotus"
                style={{ width: '100%', height: '100%' }}
              />
            </InteractiveElementWrapper>
            {/* Sparkle effects */}
            {(showSparkleOn === 'golden-lotus' || 
              showSparkleOn === 'golden-lotus-clicked' || 
              showSparkleOn === 'golden-lotus-bloom') && (
              <SparkleAnimation
                type={sparkleTypeRef.current}
                count={20}
                color={sparkleColorRef.current}
                size={10}
                duration={1500}
                fadeOut={true}
                area="full"
                onComplete={() => {}}
              />
            )}
          </div>
        )}
        
        {/* Elephant */}
        {elephantVisible && (
          <div 
            className={`elephant-partial ${elephantTransformed ?
              'elephant-position-locked' : ''}`}
            id="elephant-container"
          >
            <InteractiveElementWrapper
              onClick={handleElephantClick}
              completed={elephantTransformed ? "true" : undefined}
            >
              <img 
                src={elephantTransformed ? waterElephant : elephantFull}
                alt="Elephant"
                style={{ width: '100%', height: '100%' }}
              />
            </InteractiveElementWrapper>
            {/* Sparkle effects */}
            {(showSparkleOn === 'elephant' || 
              showSparkleOn === 'elephant-appear') && (
              <SparkleAnimation
                type={sparkleTypeRef.current}
                count={20}
                color={sparkleColorRef.current}
                size={10}
                duration={1500}
                fadeOut={true}
                area="full"
                onComplete={() => {}}
              />
            )}
          </div>
        )}
        
        {/* Trunk/Water Spray Element */}
        {trunkActive && (
          <div className="trunk" style={{ position: 'absolute', right: '20%', bottom: '30%' }}>
            💦
          </div>
        )}
        
        {/* Water drops with corrected positioning */}
        {waterDrops.map(drop => (
          <div 
            key={drop.id} 
            className="water-drop active"
            style={{
              fontSize: `${drop.size * 2 + 1}vh`,
              animationDuration: `${drop.speedFactor}s`,
              right: `${drop.trunkPositionRight + drop.startPositionX}%`,
              bottom: `${drop.trunkPositionBottom + drop.startPositionY}%`, 
              transform: `rotate(${drop.rotationAngle}deg)`,
              zIndex: 6,
              position: 'absolute',
              display: 'block'
            }}
          >
            💧
          </div>
        ))}

        {/* Simplified Hint System */}
        <SimplifiedHintSystem 
          ref={hintSystemRef}
          hints={getHintConfigs()}
          enabled={hintsEnabled}
          initialDelay={5000}     // Initial hint after 5 seconds
          initialDuration={3000}  // Initial hint stays for 3 seconds
          subsequentDelay={8000}  // 8 seconds between hints
          coachDelay={5000}      // Coach appears after 15 seconds if hint not dismissed
          coachEnabled={true}     
          coachImage={mooshikaCoach}  // Import this at the top of PondScene
          onUserInteraction={handleHintInteraction}
        />

      </div>
      
      {/* Scroll Animation Overlay with Image */}
      {renderScrollAnimation()}
      
      {/* Celebration Component */}
      {renderCelebration()}
      
      {/* Popup overlay with animation */}
      {renderAnimatedPopup()}

      {/* Zones Modal */}
{showZonesModal && (
  <ZonesNav
    zones={zones}
    currentZoneId={currentZone.id}
    onZoneSelect={handleZoneSelect}
    onClose={() => setShowZonesModal(false)}
    showAsModal={true}
  />
)}

{/* Progress Modal */}
{showProgressModal && (
  <ProgressModal
    progress={{
      stars: zones.reduce((total, zone) => total + zone.stars, 0),
      completed: zones.filter(zone => zone.unlocked).length - 1, // Subtract 1 since first is always unlocked
      total: 8
    }}
    zones={progressZones} // Use the adapted zones data
    onClose={() => setShowProgressModal(false)}
  />
)}

{/* Temporarily disable to test
<SymbolSidebar 
  discoveredSymbols={discoveredSymbols}
  onSymbolClick={(symbolId) => {
    console.log('Symbol clicked:', symbolId);
  }}
/>
*/}
    
<TocaBocaNav
  onHome={handleHome}
  onProgress={() => setShowProgressModal(true)}
  onHelp={handleHelp}
  onParentMenu={handleParentDashboard}
  isAudioOn={isAudioOn}
  onAudioToggle={handleAudioToggle}
  onZonesClick={handleZonesClick}
  currentProgress={{
    stars: zones.reduce((total, zone) => total + zone.stars, 0),
    completed: zones.filter(zone => zone.unlocked).length - 1,
    total: 8
  }}
/>

    </div>
  );
}; // This closes the PondScene function

export default PondScene;