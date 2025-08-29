// zones/symbol-mountain/scenes/final-scene/SacredAssemblyScene.jsx - V8 CLICK-BASED VERSION
import React, { useState, useEffect, useRef } from 'react';
import './SacredAssemblyScene.css';

// Import scene management components
import SceneManager from "../../../../lib/components/scenes/SceneManager";
import MessageManager from "../../../../lib/components/scenes/MessageManager";
import InteractionManager from "../../../../lib/components/scenes/InteractionManager";
import GameStateManager from "../../../../lib/services/GameStateManager";
import SceneCompletionCelebration from '../../../../lib/components/celebration/SceneCompletionCelebration';
import RotatingOrbsEffect from '../../../../lib/components/feedback/RotatingOrbsEffect';
import SimpleGameCoach, { SimpleGameCoachConfigs } from '../../../../lib/components/coach/SimpleGameCoach';

// UI Components
import TocaBocaNav from '../../../../lib/components/navigation/TocaBocaNav';
import CulturalCelebrationModal from '../../../../lib/components/progress/CulturalCelebrationModal';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import Fireworks from '../../../../lib/components/feedback/Fireworks';
import ProgressiveHintSystem from '../../../../lib/components/interactive/ProgressiveHintSystem';
import MagicalCardFlip from '../../../../lib/components/animation/MagicalCardFlip';
import SymbolSidebar from '../../shared/components/SymbolSidebar';

// Images - Background
import sacredBackground from './assets/images/final_symbol_background.png';

// Images - Ganesha Forms
import ganeshaStone from './assets/images/ganesha-stone.png';
import ganeshaDivine from './assets/images/ganesha-divine.png';

// Images - Symbol Icons
import symbolMooshikaColored from './assets/images/symbol-mooshika-colored.png';
import symbolModakColored from './assets/images/symbol-modak-colored.png';
import symbolBellyColored from './assets/images/symbol-belly-colored.png';
import symbolLotusColored from './assets/images/symbol-lotus-colored.png';
import symbolTrunkColored from './assets/images/symbol-trunk-colored.png';
import symbolEyesColored from './assets/images/symbol-eyes-colored.png';
import symbolEarsColored from './assets/images/symbol-ear-colored.png';
import symbolTuskColored from './assets/images/symbol-tusk-colored.png';

// Coach image (for hints only)
import mooshikaCoach from "../pond/assets/images/mooshika-coach.png";

// Sacred Assembly Game Configuration
const SACRED_SYMBOLS = [
  { 
    id: 'mooshika', 
    name: 'Mooshika', 
    emoji: '🐭', 
    image: symbolMooshikaColored,
    blessing: "Mooshika, Ganesha's divine vehicle awakens! May wisdom guide your every journey, dear child.",
    bodyPart: 'base'
  },
  { 
    id: 'modak', 
    name: 'Modak', 
    emoji: '🍯', 
    image: symbolModakColored,
    blessing: "Ganesha's blessing hand awakens! May sweetness and abundance fill your life.",
    bodyPart: 'left-hand'
  },
  { 
    id: 'belly', 
    name: 'Belly', 
    emoji: '🫄', 
    image: symbolBellyColored,
    blessing: "Ganesha's sacred belly awakens! May you hold the universe's love within you.",
    bodyPart: 'belly'
  },
  { 
    id: 'lotus', 
    name: 'Lotus', 
    emoji: '🪷', 
    image: symbolLotusColored,
    blessing: "Ganesha's wisdom hand comes alive! May purity and enlightenment guide you.",
    bodyPart: 'right-hand'
  },
  { 
    id: 'trunk', 
    name: 'Trunk', 
    emoji: '🐘', 
    image: symbolTrunkColored,
    blessing: "Ganesha's mighty trunk awakens! May all obstacles be removed from your path.",
    bodyPart: 'trunk'
  },
  { 
    id: 'eyes', 
    name: 'Eyes', 
    emoji: '👁️', 
    image: symbolEyesColored,
    blessing: "Ganesha's divine eyes awaken! May you see truth in all things.",
    bodyPart: 'eyes'
  },
  { 
    id: 'ears', 
    name: 'Ears', 
    emoji: '👂', 
    image: symbolEarsColored,
    blessing: "Ganesha's sacred ears come alive! May you listen with wisdom and compassion.",
    bodyPart: 'ears'
  },
  { 
    id: 'tusk', 
    name: 'Tusk', 
    emoji: '🦷', 
    image: symbolTuskColored,
    blessing: "Ganesha's powerful tusk glows! May you break through any challenge with determination.",
    bodyPart: 'tusk'
  }
];

// Body part drop zone configurations
const BODY_PART_ZONES = [
  {
    id: 'eyes',
    acceptTypes: ['eyes'],
    position: { top: '30%', left: '40%', transform: 'translateX(-50%)', width: '120px', height: '60px' },
    hint: 'Divine Sight'
  },
  {
    id: 'ears', 
    acceptTypes: ['ears'],
    position: { top: '25%', left: '25%', width: '80px', height: '80px' },
    hint: 'Deep Listening'
  },
  {
    id: 'trunk',
    acceptTypes: ['trunk'], 
    position: { top: '35%', left: '40%', transform: 'translateX(-50%)', width: '100px', height: '120px' },
    hint: 'Removing Obstacles'
  },
  {
    id: 'tusk',
    acceptTypes: ['tusk'],
    position: { top: '40%', right: '40%', width: '60px', height: '80px' },
    hint: 'Breaking Barriers'
  },
  {
    id: 'left-hand',
    acceptTypes: ['modak'],
    position: { top: '35%', left: '20%', width: '80px', height: '80px' },
    hint: 'Sweet Blessings'
  },
  {
    id: 'right-hand', 
    acceptTypes: ['lotus'],
    position: { top: '45%', right: '20%', width: '80px', height: '80px' },
    hint: 'Pure Wisdom'
  },
  {
    id: 'belly',
    acceptTypes: ['belly'],
    position: { top: '50%', left: '40%', transform: 'translateX(-50%)', width: '160px', height: '120px' },
    hint: 'Universe Within'
  },
  {
    id: 'base',
    acceptTypes: ['mooshika'], 
    position: { bottom: '25%', left: '60%', transform: 'translateX(-50%)', width: '120px', height: '80px' },
    hint: 'Divine Vehicle'
  }
];

// Ganesha transformation states
const GANESHA_STATES = {
  STONE: 'stone',
  AWAKENING: 'awakening', 
  DIVINE: 'divine',
  BLESSED: 'blessed'
};

const SYMBOL_POSITIONS = [
  { top: '38%', left: '25%' },      // mooshika
  { top: '12%', left: '75%' },     // modak
  { top: '35%', left: '8%' },      // belly
  { top: '20%', left: '86%' },     // lotus
  { top: '60%', left: '15%' },     // trunk
  { top: '55%', left: '85%' },     // eyes
  { bottom: '15%', left: '30%' },  // ears
  { bottom: '20%', left: '70%' }   // tusk
];

const SacredAssemblyScene = ({
  onComplete,
  onNavigate,
  zoneId = 'symbol-mountain',
  sceneId = 'final-scene'
}) => {
  console.log('🚀 V8 CLICK-BASED SacredAssemblyScene props:', { onComplete, onNavigate, zoneId, sceneId });

  return (
    <SceneManager
      zoneId={zoneId}
      sceneId={sceneId}
      initialState={{
        // Assembly game state
        placedSymbols: {},           // {eyes: true, trunk: true, ...}
        ganeshaState: GANESHA_STATES.STONE,
        
        // V8 NEW: Click-based interaction state
        selectedSymbol: null,        // Currently selected symbol for placement
        highlightedZone: null,       // Zone highlighted for selected symbol
        placementAnimation: null,    // Active teleport animation
        
        // Audio/blessing state
        currentBlessing: null,
        blessingsHeard: [],
        finalBlessingShown: false,
        
        // Core game state
        phase: 'initial',
        currentFocus: 'assembly',
        discoveredSymbols: {
          // Start with all symbols from previous scenes
          mooshika: true, modak: true, belly: true, lotus: true,
          trunk: true, eyes: true, ear: true, tusk: true
        },
        
        // GameCoach message flags
        welcomeShown: false,
        assemblyWisdomShown: false,
        masteryShown: false,
        readyForWisdom: false,
        gameCoachState: null,
        lastGameCoachTime: 0,
        isReloadingGameCoach: false,
        
        // FIXED: Simplified reload system
        currentPopup: null,
        showingCompletionScreen: false,
        showingZoneCompletion: false,
        celebrationActive: false,    // NEW: Track celebration state
        
        // Progress tracking
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
        <SacredAssemblyContent
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
  );
};

const SacredAssemblyContent = ({
  sceneState,
  sceneActions,
  isReload,
  onComplete,
  onNavigate,
  zoneId,
  sceneId
}) => {
  console.log('🚀 V8 CLICK-BASED SacredAssemblyContent render', { sceneState, isReload });

  // FIXED: Simplified state management
  const [showSparkle, setShowSparkle] = useState(null);
  const [showMagicalCard, setShowMagicalCard] = useState(false);
  const [cardContent, setCardContent] = useState({});
  const [showSceneCompletion, setShowSceneCompletion] = useState(false);
  const [showCulturalCelebration, setShowCulturalCelebration] = useState(false);
  const [showZoneCompletion, setShowZoneCompletion] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [isOrbsRunning, setIsOrbsRunning] = useState(false); // Track orbs state (with built-in fireworks)

  // Refs
  const timeoutsRef = useRef([]);
  const progressiveHintRef = useRef(null);

  // Get profile name
  const activeProfile = GameStateManager.getActiveProfile();
  const profileName = activeProfile?.name || 'little explorer';

  // GameCoach visibility helper (for hints)
  const isGameCoachVisible = sceneState?.gameCoachState || sceneState?.isReloadingGameCoach;

  // V8: Get currently selected symbol and highlighted zone
  const selectedSymbol = sceneState?.selectedSymbol ? 
    SACRED_SYMBOLS.find(s => s.id === sceneState.selectedSymbol) : null;
  const highlightedZone = sceneState?.highlightedZone ? 
    BODY_PART_ZONES.find(z => z.id === sceneState.highlightedZone) : null;

  // FIXED: Improved timeout management
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // FIXED: Clear all timeouts function
  const clearAllTimeouts = () => {
    console.log('🧹 V8: Clearing all timeouts');
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // V8: Handle symbol selection
  const handleSymbolClick = (symbol) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`🎯 V8: Symbol ${symbol.id} clicked`);
    
    // Check if already placed
    if (sceneState.placedSymbols?.[symbol.id]) {
      console.log(`Symbol ${symbol.id} already placed - showing sparkle`);
      setShowSparkle(`symbol-placed-${symbol.id}`);
      safeSetTimeout(() => setShowSparkle(null), 1500);
      return;
    }

    // Hide active hints
    if (progressiveHintRef.current?.hideHint) {
      progressiveHintRef.current.hideHint();
    }

    const currentSelected = sceneState.selectedSymbol;
    
    if (currentSelected === symbol.id) {
      // Deselect if clicking same symbol
      console.log(`Deselecting symbol ${symbol.id}`);
      sceneActions.updateState({
        selectedSymbol: null,
        highlightedZone: null
      });
    } else {
      // Select new symbol and find matching zone
      const matchingZone = BODY_PART_ZONES.find(zone => 
        zone.acceptTypes.includes(symbol.id)
      );
      
      console.log(`Selecting symbol ${symbol.id}, highlighting zone ${matchingZone?.id}`);
      sceneActions.updateState({
        selectedSymbol: symbol.id,
        highlightedZone: matchingZone?.id || null
      });
    }
  };

// V8: Handle drop zone click
const handleDropZoneClick = (zone) => {
  console.log('🎯 handleDropZoneClick called with zone:', zone.id);
  
  if (!sceneState || !sceneActions) {
    console.log('❌ Missing sceneState or sceneActions');
    return;
  }
  
  const selectedSymbolId = sceneState.selectedSymbol;
  console.log('🎯 Selected symbol ID:', selectedSymbolId);
  
  if (!selectedSymbolId) {
    console.log('❌ No symbol selected');
    return;
  }

  // Check if this zone accepts the selected symbol
  console.log('🎯 Zone accepts:', zone.acceptTypes);
  console.log('🎯 Checking if', zone.acceptTypes, 'includes', selectedSymbolId);
  
  if (!zone.acceptTypes.includes(selectedSymbolId)) {
    console.log('❌ Zone', zone.id, "doesn't accept symbol", selectedSymbolId);
    return;
  }

  console.log('✅ Valid placement -', selectedSymbolId, 'in', zone.id);

  // Start teleport animation
  const symbolElement = document.querySelector(`[data-symbol-id="${selectedSymbolId}"]`);
  const zoneElement = document.querySelector(`[data-zone-id="${zone.id}"]`);
  
  console.log('🎯 Found elements:', { 
    symbolElement: !!symbolElement, 
    zoneElement: !!zoneElement 
  });
  
  if (symbolElement && zoneElement) {
    const fromRect = symbolElement.getBoundingClientRect();
    const toRect = zoneElement.getBoundingClientRect();
    
    console.log('🎯 Setting animation state...');
    
    // Set animation state
    sceneActions.updateState({
      placementAnimation: {
        symbolId: selectedSymbolId,
        zoneId: zone.id,
        from: fromRect,
        to: toRect
      }
    });

    // Complete placement after animation
    safeSetTimeout(() => {
      console.log('🎯 Animation complete, placing symbol...');
      handleSymbolPlacement({ 
        id: selectedSymbolId, 
        zone: zone.id,
        data: SACRED_SYMBOLS.find(s => s.id === selectedSymbolId)
      });
    }, 600);
  } else {
    console.log('❌ Could not find DOM elements for animation');
    // Try direct placement without animation
    handleSymbolPlacement({ 
      id: selectedSymbolId, 
      zone: zone.id,
      data: SACRED_SYMBOLS.find(s => s.id === selectedSymbolId)
    });
  }
};

  // FIXED: Handle GameCoach mastery completion → trigger celebration
  useEffect(() => {
    // Trigger celebration when mastery is shown AND GameCoach is not visible
    if (sceneState?.masteryShown && 
        !isOrbsRunning &&
        !showSceneCompletion && 
        Object.keys(sceneState?.placedSymbols || {}).length === 8) {
      
      console.log('🎆 GameCoach mastery shown - triggering final celebration');
      
      safeSetTimeout(() => {
        triggerFinalCelebration();
      }, 4200); // Perfect timing - GameCoach (4000ms) + small buffer
    }
  }, [sceneState?.masteryShown, isOrbsRunning, showSceneCompletion]);

  // Add this useEffect for welcome message with sparkles
  useEffect(() => {
    if (sceneState?.phase === 'initial' && 
        !sceneState?.welcomeShown && 
        !sceneState?.isReloadingGameCoach) {
      
      console.log('🎭 V8: Scene started - showing welcome sparkles then GameCoach');
      
      // Show sparkles first
      safeSetTimeout(() => {
        setShowSparkle('divine-light');
        
        // Clear sparkles and trigger welcome GameCoach
        safeSetTimeout(() => {
          setShowSparkle(null);
          sceneActions.updateState({ 
            welcomeShown: true,  // FIXED: Mark as shown to prevent duplicate
            phase: 'initial'
          });
        }, 1800);
      }, 500);
    }
  }, [sceneState?.phase, sceneState?.welcomeShown]);

  // V8: Global click debugging
useEffect(() => {
  const handleGlobalClick = (e) => {
    console.log('🌍 GLOBAL CLICK:', e.target);
    console.log('🌍 Click coordinates:', e.clientX, e.clientY);
    console.log('🌍 Target classes:', e.target.className);
    console.log('🌍 Target data:', e.target.dataset);
  };
  
  document.addEventListener('click', handleGlobalClick);
  
  return () => {
    document.removeEventListener('click', handleGlobalClick);
  };
}, []);

  // FIXED: Simplified reload handling (same as V6)
  useEffect(() => {
    if (!isReload || !sceneState) return;
    
    console.log('🔄 V8: ASSEMBLY RELOAD:', {
      currentPopup: sceneState.currentPopup,
      showingZoneCompletion: sceneState.showingZoneCompletion,
      completed: sceneState.completed,
      celebrationActive: sceneState.celebrationActive,
      placedSymbols: Object.keys(sceneState.placedSymbols || {}).length,
      selectedSymbol: sceneState.selectedSymbol // V8: Also log selected symbol
    });

    // Handle zone completion reload
    if (sceneState.showingZoneCompletion || sceneState.celebrationActive) {
      console.log('🏆 RELOAD: Resuming zone completion');
      setIsOrbsRunning(true);
      setShowSparkle('final-fireworks');
      setTimeout(() => {
        setShowZoneCompletion(true);
      }, 500);
    }
    // Handle GameCoach reload states (same time-based logic as V6)
    else if (sceneState.gameCoachState) {
      console.log('🔄 RELOAD: Resuming GameCoach state:', sceneState.gameCoachState);
      
      // Complete switch statement with time-based logic
      switch(sceneState.gameCoachState) {
        case 'welcome':
          const timeSinceWelcomeCoach = Date.now() - (sceneState.lastGameCoachTime || 0);
          const welcomeCoachDuration = 4000;
          
          if (timeSinceWelcomeCoach > welcomeCoachDuration) {
            sceneActions.updateState({
              gameCoachState: null,
              isReloadingGameCoach: false
            });
          } else {
            sceneActions.updateState({
              welcomeShown: false,
              isReloadingGameCoach: false
            });
          }
          break;

        case 'assembly_wisdom':
          const timeSinceGameCoach = Date.now() - (sceneState.lastGameCoachTime || 0);
          const gameCoachDuration = 4000;
          
          if (timeSinceGameCoach > gameCoachDuration) {
            sceneActions.updateState({
              gameCoachState: null,
              isReloadingGameCoach: false
            });
          } else {
            sceneActions.updateState({
              readyForWisdom: true,
              assemblyWisdomShown: false,
              isReloadingGameCoach: false
            });
          }
          break;

        case 'mastery_wisdom':
          const timeSinceMasteryCoach = Date.now() - (sceneState.lastGameCoachTime || 0);
          const masteryCoachDuration = 4000;
          
          if (timeSinceMasteryCoach > masteryCoachDuration) {
            sceneActions.updateState({
              gameCoachState: null,
              isReloadingGameCoach: false
            });
          } else {
            sceneActions.updateState({
              masteryShown: false,
              isReloadingGameCoach: false
            });
          }
          break;

        default:
          sceneActions.updateState({ isReloadingGameCoach: false });
      }
    }
    else {
      sceneActions.updateState({ isReloadingGameCoach: false });
    }
  }, [isReload]);

  // Progressive Ganesha awakening functions (same as V6)
  const getGaneshaOpacity = () => {
    const placedCount = Object.keys(sceneState?.placedSymbols || {}).length;
    
    if (placedCount === 0) return 0;
    if (placedCount <= 2) return 0.15;
    if (placedCount <= 4) return 0.35;
    if (placedCount <= 6) return 0.6;
    if (placedCount === 7) return 0.85;
    return 1;
  };

  const getGaneshaAwakeningClass = () => {
    const placedCount = Object.keys(sceneState?.placedSymbols || {}).length;
    
    if (placedCount === 0) return 'sleeping';
    if (placedCount <= 2) return 'stirring';
    if (placedCount <= 4) return 'awakening';
    if (placedCount <= 6) return 'rising';
    if (placedCount === 7) return 'manifesting';
    return 'divine-radiance';
  };

  // FIXED: Streamlined final celebration (same as V6)
  const triggerFinalCelebration = () => {
    console.log('🎆 V8: triggerFinalCelebration called');

    clearAllTimeouts();

    const profileId = localStorage.getItem('activeProfileId');
    if (profileId) {
      console.log('💾 V8: Saving completion data');
      try {
        console.log('✅ V8: Completion saved successfully');
      } catch (error) {
        console.log('⚠️ V8: Save error ignored:', error.message);
      }
    }
    
    sceneActions.updateState({
      currentPopup: 'final_fireworks',
      showingCompletionScreen: true,
      showingZoneCompletion: true,
      celebrationActive: true,
      phase: 'complete',
      stars: 8,
      completed: true,
      // V8: Clear click-based interaction state
      selectedSymbol: null,
      highlightedZone: null,
      placementAnimation: null,
      progress: {
        percentage: 100,
        starsEarned: 8,
        completed: true
      }
    });
    
    console.log('🌟 V8: Starting RotatingOrbsEffect');
    setIsOrbsRunning(true);
    setShowSparkle('final-fireworks');
  };

  // V8: UPDATED symbol placement handler
  const handleSymbolPlacement = ({ id, zone, data }) => {
    if (!sceneState || !sceneActions) return;
    
    console.log(`🎯 V8: Symbol ${id} placed correctly in ${zone}!`);
    
    // Hide active hints
    if (progressiveHintRef.current?.hideHint) {
      progressiveHintRef.current.hideHint();
    }

    clearAllTimeouts();

    // Mark symbol as placed
    const newPlacedSymbols = {
      ...sceneState.placedSymbols,
      [id]: true
    };
    
    const placedCount = Object.keys(newPlacedSymbols).length;
    const percentage = Math.round((placedCount / 8) * 100);
    
    console.log(`📊 V8: Progress - ${placedCount}/8 symbols (${percentage}%)`);
    
    // Update Ganesha state based on placed count
    let newGaneshaState = GANESHA_STATES.STONE;
    if (placedCount >= 6) newGaneshaState = GANESHA_STATES.DIVINE;
    else if (placedCount >= 3) newGaneshaState = GANESHA_STATES.AWAKENING;
    
    // V8: Single state update for placement with click-based state clearing
    sceneActions.updateState({
      placedSymbols: newPlacedSymbols,
      ganeshaState: newGaneshaState,
      // V8: Clear click-based interaction state
      selectedSymbol: null,
      highlightedZone: null,
      placementAnimation: null,
      stars: placedCount,
      progress: {
        percentage: percentage,
        starsEarned: placedCount,
        completed: placedCount === 8
      }
    });

    // Create placement sparkles
    setShowSparkle(`symbol-placed-${id}`);
    safeSetTimeout(() => setShowSparkle(null), 2000);

    // GameCoach milestones with manual sparkles (same as V6)
    if (placedCount === 3) {
      console.log('🎭 V8: 3rd symbol placed - showing sparkles then assembly wisdom');
      
      setShowSparkle('divine-light');
      
      safeSetTimeout(() => {
        setShowSparkle(null);
        sceneActions.updateState({ 
          readyForWisdom: true,
          phase: 'awakening'
        });
      }, 1800);

    } else if (placedCount === 8) {
      console.log('🎭 V8: 8th symbol placed - showing sparkles then mastery');
      
      setShowSparkle('divine-light');
      
      safeSetTimeout(() => {
        setShowSparkle(null);
        sceneActions.updateState({
          phase: 'complete',
          completed: true
        });
      }, 1800);
    }
  };

  // Hint system configuration (same as V6)
  const getHintConfigs = () => [
    {
      id: 'assembly-hint',
      message: 'Tap a symbol, then tap where it belongs on Ganesha!', // V8: Updated hint text
      explicitMessage: 'Select a symbol by tapping it, then tap the glowing area on Ganesha to place it!', // V8: Updated
      position: { bottom: '60%', left: '50%', transform: 'translateX(-50%)' },
      condition: (sceneState, hintLevel) => {
        if (!sceneState) return false;
        const placedCount = Object.keys(sceneState.placedSymbols || {}).length;
        return placedCount < 3 && !showMagicalCard && !isOrbsRunning && !isGameCoachVisible;
      }
    }
  ];

  // Render
  if (!sceneState) {
    return <div className="loading">Loading sacred assembly...</div>;
  }

  return (
    <InteractionManager sceneState={sceneState} sceneActions={sceneActions}>
      <MessageManager
        messages={[]}
        sceneState={sceneState}
        sceneActions={sceneActions}
      >
        <div className="sacred-assembly-container">
          
          {/* V8: SimpleGameCoach Integration - Same as V6 but without sparkle props */}
          <SimpleGameCoach
            config={{
              messages: [
                {
                  id: 'welcome',
                  stateFlag: 'welcomeShown',
                  message: `Welcome to the Sacred Summit, ${profileName}! You've collected all of Ganesha's sacred symbols. Now assemble them to awaken his divine form!`,
                  timing: 300,
                  duration: 4000,
                  condition: (sceneState) => 
                    sceneState?.phase === 'initial' && 
                    !sceneState?.welcomeShown,
                  messageType: 'welcome',
                  additionalUpdates: (sceneState) => ({
                    gameCoachState: 'welcome',
                    lastGameCoachTime: Date.now()
                  })
                },
                {
                  id: 'assembly_wisdom',
                  stateFlag: 'assemblyWisdomShown',
                  message: `Magnificent, ${profileName}! You're bringing Ganesha to life! Each symbol you place awakens his divine power!`,
                  timing: 300,
                  duration: 4000,
                  condition: (sceneState) => {
                    const placedCount = Object.keys(sceneState?.placedSymbols || {}).length;
                    return placedCount >= 3 && 
                           !sceneState?.assemblyWisdomShown && 
                           sceneState?.readyForWisdom;
                  },
                  messageType: 'wisdom1',
                  additionalUpdates: (sceneState) => ({
                    readyForWisdom: false,
                    gameCoachState: 'assembly_wisdom',
                    lastGameCoachTime: Date.now()
                  })
                },
                {
                  id: 'mastery_wisdom',
                  stateFlag: 'masteryShown',
                  message: `Divine Child! You have awakened Ganesha completely! You are now a true keeper of ancient wisdom! The entire realm celebrates your achievement!`,
                  timing: 300,
                  duration: 4000,
                  condition: (sceneState) => {
                    const placedCount = Object.keys(sceneState?.placedSymbols || {}).length;
                    return placedCount === 8 && !sceneState?.masteryShown;
                  },
                  messageType: 'wisdom3',
                  additionalUpdates: (sceneState) => ({
                    gameCoachState: 'mastery_wisdom',
                    lastGameCoachTime: Date.now()
                  })
                }
              ],
              dependencies: [
                'sceneState?.placedSymbols',
                'sceneState?.readyForWisdom',
                'sceneState?.assemblyWisdomShown',
                'sceneState?.masteryShown'
              ]
            }}
            sceneState={sceneState}
            sceneActions={sceneActions}
            profileName={profileName}
          />

          {/* Sacred Mountain Background */}
          <div 
            className="sacred-background" 
            style={{ backgroundImage: `url(${sacredBackground})` }}
          >
            {/* DEBUG: Current State */}
{console.log('🔍 CURRENT STATE:', {
  selectedSymbol: sceneState?.selectedSymbol,
  highlightedZone: sceneState?.highlightedZone,
  placedSymbols: Object.keys(sceneState?.placedSymbols || {}),
  phase: sceneState?.phase
})}
            {/* Progress Display */}
            <div className="assembly-progress">
              <div className="progress-text">
                <span style={{ fontSize: '16px' }}>🏔️</span>
                {Object.keys(sceneState.placedSymbols || {}).length}/8 symbols
              </div>
              <div 
                className="assembly-progress-fill"
                style={{
                  width: `${(Object.keys(sceneState.placedSymbols || {}).length / 8) * 100}%`
                }}
              />
            </div>

            {/* V8: Instruction Banner */}
            <div className="instruction-banner-v8">
              {!sceneState.selectedSymbol ? (
                <div className="step-1">
                  <span className="step-number">1</span>
                  Tap a symbol to select it
                </div>
              ) : (
                <div className="step-2">
                  <span className="step-number">2</span>
                  Now tap the glowing area on Ganesha!
                </div>
              )}
            </div>

            {/* Ganesha Sacred Form Container */}
          <div className="ganesha-assembly-container" style={{
  pointerEvents: 'none'  // ← ADD THIS LINE - Prevent Ganesha from blocking clicks
}}>
              {/* Ganesha Progressive Awakening */}
              <div className="ganesha-awakening-container">
                {/* Base faint outline */}
                <img 
                  src={ganeshaStone}
                  alt="Ganesha Outline"
                  className="ganesha-outline"
                  style={{
                    opacity: 0.2,
                    filter: 'brightness(1.5) contrast(0.8)'
                  }}
                />
                
                {/* Progressive divine form */}
                <img 
                  src={ganeshaDivine}
                  alt="Ganesha Divine Form"
                  className={`ganesha-divine ${getGaneshaAwakeningClass()}`}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    height: '90%',
                    opacity: getGaneshaOpacity(),
                    transition: 'all 1s ease'
                  }}
                />
              </div>

              {/* V8: CLICK-BASED DROP ZONES */}
              {BODY_PART_ZONES.map(zone => {
                const isHighlighted = sceneState.highlightedZone === zone.id;
                const hasSymbol = Object.keys(sceneState.placedSymbols || {}).find(symbolId => {
                  return zone.acceptTypes.includes(symbolId);
                });

                return (
                    <div
  key={zone.id}
  data-zone-id={zone.id}
  className={`click-drop-zone ${isHighlighted ? 'highlighted' : ''} ${hasSymbol ? 'filled' : ''}`}
  style={{
    position: 'absolute',
    ...zone.position,
    cursor: isHighlighted ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    zIndex: isHighlighted ? 999 : 40,  // ← INCREASED Z-INDEX
    borderRadius: '8px',
    // ← ADD THESE LINES:
    pointerEvents: 'auto',
    backgroundColor: isHighlighted ? 'rgba(255, 215, 0, 0.3)' : 'transparent',
    border: isHighlighted ? '3px solid #FFD700' : '1px solid transparent',
    minWidth: '60px',
    minHeight: '60px'
  }}
  onClick={(e) => {  // ← CHANGE onClick TO THIS
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 ZONE CLICKED:', zone.id, 'isHighlighted:', isHighlighted);
    console.log('🔍 Event:', e);
    if (isHighlighted) {
      console.log('🔍 Calling handleDropZoneClick');
      handleDropZoneClick(zone);
    }
  }}
>
   
                    {isHighlighted && (
                      <div className="zone-highlight-v8">
                        <div className="glow-border-v8"></div>
                        <div className="hint-text-v8">{zone.hint}</div>
                        <div className="tap-here-v8">Tap here!</div>
                      </div>
                    )}
                    {hasSymbol && (
                      <div className="placed-symbol-v8">
                        <img 
                          src={SACRED_SYMBOLS.find(s => s.id === hasSymbol)?.image}
                          alt="Placed symbol"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #FFD700',
                            boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

     {/* Placed Symbol Sparkles */}
{Object.keys(sceneState.placedSymbols || {}).map(symbolId => {
  const zone = BODY_PART_ZONES.find(z => z.acceptTypes.includes(symbolId));
  
  return (
    <div
      key={`sparkle-${symbolId}`}
      className="placed-symbol-sparkle"
      style={{
        position: 'absolute',
        ...zone.position,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 60
      }}
    >
      <SparkleAnimation
        type="star"
        count={8}
        color="#FFD700"
        size={4}
        duration={3000}
        fadeOut={false}
        area="contained"
        key={`sparkle-${symbolId}-${Date.now()}`}
      />
    </div>
  );
})}
            </div>

            {/* V8: CLICK-BASED FLOATING SYMBOLS */}
            {SACRED_SYMBOLS.map((symbol, index) => {
              const isPlaced = sceneState.placedSymbols?.[symbol.id];
              const isSelected = sceneState.selectedSymbol === symbol.id;
              const isAnimating = sceneState.placementAnimation?.symbolId === symbol.id;
              
              if (isPlaced || isAnimating) return null;

              return (
        <div
  key={symbol.id}
  data-symbol-id={symbol.id}
  className={`click-floating-symbol ${isSelected ? 'selected' : ''}`}
  style={{
    position: 'absolute',
    ...SYMBOL_POSITIONS[index],
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: isSelected ? 100 : 50,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    pointerEvents: 'auto'  // ← ADD THIS LINE
  }}
  onClick={(e) => {  // ← CHANGE onClick TO THIS
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 SYMBOL CLICKED:', symbol.id);
    handleSymbolClick(symbol);
  }}
>
                  <div className={`symbol-container-v8 ${isSelected ? 'pulse-glow-v8' : ''}`}>
                    <img 
                      src={symbol.image} 
                      alt={symbol.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: isSelected ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.3)',
                        boxShadow: isSelected 
                          ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)' 
                          : '0 4px 8px rgba(0,0,0,0.2)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    {isSelected && (
                      <div className="selection-indicator-v8">
                        <div className="pulse-ring-v8"></div>
                        <div className="tap-instruction-v8">Now tap where it belongs!</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* V8: Teleport Animation */}
            {sceneState.placementAnimation && (
              <div className="teleport-animation-v8">
                <div 
                  className="flying-symbol-v8"
                  style={{
                    position: 'fixed',
                    left: sceneState.placementAnimation.from.left + sceneState.placementAnimation.from.width/2,
                    top: sceneState.placementAnimation.from.top + sceneState.placementAnimation.from.height/2,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 200,
                    animation: 'symbolTeleportV8 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                  }}
                >
                  <img 
                    src={SACRED_SYMBOLS.find(s => s.id === sceneState.placementAnimation.symbolId)?.image}
                    alt="Flying symbol"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '3px solid #FFD700',
                      boxShadow: '0 0 25px rgba(255, 215, 0, 1)',
                      filter: 'brightness(1.2)'
                    }}
                  />
                  <div className="magic-trail-v8"></div>
                </div>
              </div>
            )}

            {/* Symbol placement sparkles */}
            {showSparkle?.startsWith('symbol-placed-') && (
              <div className="symbol-placement-sparkles">
                <SparkleAnimation
                  type="star"
                  count={20}
                  color="#FFD700"
                  size={8}
                  duration={2000}
                  fadeOut={true}
                  area="full"
                />
              </div>
            )}

            {/* Divine firefly light for GameCoach entrance */}
            {showSparkle === 'divine-light' && (
              <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '200px',
                zIndex: 199,
                pointerEvents: 'none'
              }}>
                <SparkleAnimation
                  type="glitter"
                  count={80}
                  color="#860dc3ff" 
                  size={3}
                  duration={2000}
                  fadeOut={true}
                  area="full"
                />
              </div>
            )}

            {/* Sacred Orbs Effect with built-in fireworks */}
            {showSparkle === 'final-fireworks' && (
              <RotatingOrbsEffect
                show={true}
                duration={9000}
                symbolImages={{
                  mooshika: symbolMooshikaColored,
                  modak: symbolModakColored,
                  belly: symbolBellyColored,
                  lotus: symbolLotusColored,
                  trunk: symbolTrunkColored,
                  eyes: symbolEyesColored,
                  ears: symbolEarsColored,
                  tusk: symbolTuskColored
                }}
                ganeshaImage={ganeshaDivine}
                playerName={profileName}
                onComplete={() => {
                  console.log('🎯 V8: Orb effect complete - Showing completion screen');
                  setShowSparkle(null);
                  setIsOrbsRunning(false);
                  
                  const profileId = localStorage.getItem('activeProfileId');
                  if (profileId) {
                    console.log('💾 V8: Final save after orbs+fireworks complete');
                  }
                  
                  setShowSceneCompletion(true);
                }}
              />
            )}

            {/* Test buttons (same as V6) */}
            <div style={{
              position: 'fixed',
              top: '40px',
              right: '40px',
              zIndex: 9999,
              background: 'purple',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }} onClick={() => {
              console.log('🧪 V8: COMPLETE BUTTON CLICKED');
              
              clearAllTimeouts();
              setShowSparkle(null);
              setShowMagicalCard(false);
              setShowSceneCompletion(false);
              setIsOrbsRunning(false);
              
              const allPlaced = {};
              SACRED_SYMBOLS.forEach(symbol => {
                allPlaced[symbol.id] = true;
              });
              
              sceneActions.updateState({
                placedSymbols: allPlaced,
                ganeshaState: GANESHA_STATES.DIVINE,
                phase: 'complete',
                completed: true,
                stars: 8,
                // V8: Clear click interaction state
                selectedSymbol: null,
                highlightedZone: null,
                placementAnimation: null,
                progress: {
                  percentage: 100,
                  starsEarned: 8,
                  completed: true
                },
                welcomeShown: true,
                assemblyWisdomShown: true,
                masteryShown: false,
                readyForWisdom: false,
                gameCoachState: null,
                isReloadingGameCoach: false
              });
              
              console.log('🎭 V8: GameCoach will show mastery message → trigger celebration');
            }}>
              COMPLETE V8
            </div>

{/* TEST PLACEMENT BUTTON */}
<div style={{
  position: 'fixed',
  top: '120px',
  left: '20px',
  zIndex: 9999,
  background: 'green',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
}} onClick={() => {
  console.log('🧪 TEST PLACEMENT CLICKED');
  console.log('🧪 Current selected:', sceneState?.selectedSymbol);
  console.log('🧪 Current highlighted:', sceneState?.highlightedZone);
  
  if (sceneState?.selectedSymbol && sceneState?.highlightedZone) {
    console.log('🧪 Triggering placement...');
    const symbol = SACRED_SYMBOLS.find(s => s.id === sceneState.selectedSymbol);
    const zone = BODY_PART_ZONES.find(z => z.id === sceneState.highlightedZone);
    
    handleSymbolPlacement({ 
      id: sceneState.selectedSymbol, 
      zone: sceneState.highlightedZone,
      data: symbol
    });
  } else {
    console.log('🧪 Missing selected symbol or highlighted zone');
  }
}}>
  🧪 TEST PLACE
</div>

            {/* Start Fresh button */}
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
              if (confirm('Start this scene from the beginning? You will lose current progress.')) {
                console.log('🔄 V8: EMERGENCY RESTART');
                
                clearAllTimeouts();
                setShowSparkle(null);
                setShowMagicalCard(false);
                setShowSceneCompletion(false);
                setShowZoneCompletion(false);
                setIsOrbsRunning(false);
                
                setTimeout(() => {
                  sceneActions.updateState({
                    placedSymbols: {},
                    ganeshaState: GANESHA_STATES.STONE,
                    // V8: Reset click interaction state
                    selectedSymbol: null,
                    highlightedZone: null,
                    placementAnimation: null,
                    phase: 'initial',
                    currentFocus: 'assembly',
                    currentPopup: null,
                    showingCompletionScreen: false,
                    showingZoneCompletion: false,
                    celebrationActive: false,
                    
                    welcomeShown: false,
                    assemblyWisdomShown: false,
                    masteryShown: false,
                    readyForWisdom: false,
                    gameCoachState: null,
                    lastGameCoachTime: 0,
                    isReloadingGameCoach: false,
                    
                    stars: 0,
                    completed: false,
                    progress: {
                      percentage: 0,
                      starsEarned: 0,
                      completed: false
                    }
                  });
                }, 100);
              }
            }}>
              🔄 Start Fresh
            </div>
          </div>

          {/* Progressive Hint System */}
          <ProgressiveHintSystem
            ref={progressiveHintRef}
            sceneId={sceneId}
            sceneState={sceneState}
            hintConfigs={getHintConfigs()}
            characterImage={mooshikaCoach}
            initialDelay={30000}
            hintDisplayTime={10000}
            position="bottom-right"
            iconSize={60}
            zIndex={2000}
            onHintShown={(level) => {
              console.log(`V8 hint level ${level} shown`);
              setHintUsed(true);
            }}
            enabled={!isOrbsRunning && !isGameCoachVisible}
          />

          {/* Navigation */}
          <TocaBocaNav
            onHome={() => {
              console.log('🏠 V8: Home navigation');
              setTimeout(() => onNavigate?.('home'), 100);
            }}
            onProgress={() => {
              console.log(`📊 V8: Great progress, ${profileName}!`);
              setShowCulturalCelebration(true);
            }}
            onHelp={() => console.log('❓ V8: Show help')}
            onParentMenu={() => console.log('👨‍👩‍👧‍👦 V8: Parent menu')}
            isAudioOn={true}
            onAudioToggle={() => console.log('🔊 V8: Toggle audio')}
            onZonesClick={() => {
              console.log('🗺️ V8: Zones navigation');
              setTimeout(() => onNavigate?.('zones'), 100);
            }}
            currentProgress={{
              stars: sceneState.stars || 0,
              completed: sceneState.completed ? 1 : 0,
              total: 1
            }}
          />

          {/* Scene Completion */}
          <SceneCompletionCelebration
            show={showSceneCompletion}
            sceneName="Symbol Mountain"
            sceneNumber={4}
            totalScenes={4}
            starsEarned={8}
            totalStars={8}
            discoveredSymbols={Object.keys(sceneState.discoveredSymbols || {})}
            symbolImages={{
              mooshika: symbolMooshikaColored,
              modak: symbolModakColored,
              belly: symbolBellyColored,
              lotus: symbolLotusColored,
              trunk: symbolTrunkColored,
              eyes: symbolEyesColored,
              ear: symbolEarsColored,
              tusk: symbolTuskColored
            }}
            sceneId="final-scene"
            completionData={{
              stars: 8,
              symbols: { 
                mooshika: true, lotus: true, trunk: true, eyes: true,
                ears: true, tusk: true, modak: true, belly: true 
              },
              completed: true,
              totalStars: 8
            }}
            onComplete={onComplete}
            childName={profileName}
            isFinalScene={true}
            hideGanesha={true}
            
            onExploreZones={() => {
              console.log('🗺️ V8: Explore other zones');
              setShowSceneCompletion(false);
              onNavigate?.('zones');
            }}
            onHome={() => {
              console.log('🏠 V8: Home from completion');
              setShowSceneCompletion(false);
              onNavigate?.('zone-welcome');
            }}
            onReplay={() => {
              console.log('🔄 V8: Final scene replay');
              setShowSceneCompletion(false);
              const profileId = localStorage.getItem('activeProfileId');
              if (profileId) {
                localStorage.setItem(`play_again_${profileId}_${zoneId}_${sceneId}`, 'true');
              }
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
          />

          {/* Cultural Celebration Modal */}
          <CulturalCelebrationModal
            show={showCulturalCelebration}
            onClose={() => setShowCulturalCelebration(false)}
          />
        </div>

        {/* V8: CSS Styles for Click-Based Interaction */}
        <style jsx>{`
          .instruction-banner-v8 {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(139, 69, 19, 0.9);
            color: #FFD700;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
          }

          .step-number {
            background: #FFD700;
            color: #8B4513;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
          }

          .step-1 {
            animation: stepGlowV8 2s ease-in-out infinite;
          }

          .step-2 {
            animation: stepUrgentV8 1s ease-in-out infinite;
          }

          @keyframes stepGlowV8 {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          @keyframes stepUrgentV8 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .click-floating-symbol {
            user-select: none;
            -webkit-tap-highlight-color: transparent;
          }

          .symbol-container-v8 {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .pulse-glow-v8 {
            animation: pulseGlowV8 2s ease-in-out infinite;
          }

          @keyframes pulseGlowV8 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .selection-indicator-v8 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }

          .pulse-ring-v8 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border: 2px solid #FFD700;
            border-radius: 50%;
            animation: pulseRingV8 1.5s ease-out infinite;
          }

          @keyframes pulseRingV8 {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }

          .tap-instruction-v8 {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 215, 0, 0.9);
            color: #8B4513;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            animation: bounceV8 2s ease-in-out infinite;
          }

          @keyframes bounceV8 {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-5px); }
            60% { transform: translateX(-50%) translateY(-3px); }
          }

          .click-drop-zone {
            transition: all 0.3s ease;
          }

          .click-drop-zone.highlighted {
            background: rgba(255, 215, 0, 0.2);
            border: 2px solid #FFD700;
          }

          .zone-highlight-v8 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            pointer-events: none;
          }

          .glow-border-v8 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% + 10px);
            height: calc(100% + 10px);
            border: 3px solid #FFD700;
            border-radius: 12px;
            animation: glowPulseV8 1s ease-in-out infinite alternate;
          }

          @keyframes glowPulseV8 {
            from { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
            to { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
          }

          .hint-text-v8 {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 215, 0, 0.9);
            color: #8B4513;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
          }

          .tap-here-v8 {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            color: #FFD700;
            font-size: 12px;
            font-weight: bold;
            animation: tapBounceV8 1s ease-in-out infinite;
          }

          @keyframes tapBounceV8 {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.1); }
          }

          .placed-symbol-v8 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: sparkleInV8 0.6s ease-out;
          }

          @keyframes sparkleInV8 {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(180deg);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
              opacity: 1;
            }
          }

          @keyframes symbolTeleportV8 {
            0% {
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(0.3) rotate(180deg);
              opacity: 0.7;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(360deg);
              opacity: 0;
            }
          }

          .magic-trail-v8 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: trailExpandV8 0.6s ease-out;
          }

          @keyframes trailExpandV8 {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </MessageManager>
    </InteractionManager>
  );
};

export default SacredAssemblyScene;