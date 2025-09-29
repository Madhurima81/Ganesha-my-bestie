// lib/config/SceneResetConfigs.js
// Scene-specific reset configurations for all 20+ scenes

export const SCENE_RESET_CONFIGS = {
  // ========== SYMBOL MOUNTAIN ZONE (COMPLETE 4/4) ==========
  
  'modak': {
    initialPhase: 'mooshika_search',
    initialFocus: 'mooshika',
    specificResets: {
      // Phase 1: Mooshika search states
      moundStates: [0, 0, 0, 0, 0],
      correctMound: Math.floor(Math.random() * 5) + 1,
      mooshikaVisible: false,
      mooshikaFound: false,
      mooshikaDragHintShown: false,
      mooshikaLastPosition: { top: '45%', left: '25%' },
      moundsVanished: false,
      moundsVanishing: false,
      
      // Phase 2: Modak collection states
      modakStates: [0, 0, 0],
      modaksUnlocked: false,
      basketVisible: false,
      basketFull: false,
      collectedModaks: [],
      fedModaks: [],
      
      // Phase 3: Rock/Belly transformation states
      rockVisible: false,
      rockFeedCount: 0,
      rockTransformed: false,
      rockFeedingComplete: false,
      
      // Game progression states
      celebrationStars: 0,
      discoveredSymbols: {},
      
      // Message flags
      welcomeShown: false,
      mooshikaWisdomShown: false,
      modakWisdomShown: false,
      bellyWisdomShown: false,
      masteryShown: false,
      readyForWisdom: false,
      
      // Animated text states
      showMooshikaText: false,
      showModakText: false,
      showBellyText: false,
      
      // Reload and completion states
      currentPopup: null,
      showingCompletionScreen: false,
      playAgainRequested: false,
      fireworksCompleted: false,
      fireworksStartTime: 0,
      completionScreenShown: false,
      
      // Symbol discovery states
      symbolDiscoveryState: null,
      sidebarHighlightState: null,
      
      // GameCoach states
      gameCoachState: null,
      isReloadingGameCoach: false,
      lastGameCoachTime: 0,
      
      // Progress states
      stars: 0,
      completed: false,
      progress: {
        percentage: 0,
        starsEarned: 0,
        completed: false
      }
    }
  },
  
  'pond': {
    initialPhase: 'initial',
    initialFocus: 'lotus',
    keepSymbols: { mooshika: true, modak: true, belly: true },
    specificResets: {
      // Pond scene specific states
      lotusStates: [0, 0, 0],
      goldenLotusVisible: false,
      goldenLotusBloom: false,
      elephantVisible: false,
      elephantTransformed: false,
      trunkActive: false,
      waterDrops: [],
      celebrationStars: 0,
      
      // UI text states
      showLotusText: false,
      showTrunkText: false,
      
      // Message flags
      welcomeShown: false,
      lotusWisdomShown: false,
      elephantWisdomShown: false,
      masteryShown: false,
      readyForWisdom: false,
      
      // Popup and discovery states
      currentPopup: null,
      showingCompletionScreen: false,
      playAgainRequested: false,
      symbolDiscoveryState: null,
      sidebarHighlightState: null,
      
      // GameCoach states
      gameCoachState: null,
      isReloadingGameCoach: false,
      lastGameCoachTime: 0,
      
      // Progress states
      stars: 0,
      completed: false,
      progress: {
        percentage: 0,
        starsEarned: 0,
        completed: false
      }
    }
  },

  'symbol': {
    initialPhase: 'eyes_game',
    initialFocus: 'eyes',
    keepSymbols: { mooshika: true, modak: true, belly: true, lotus: true, trunk: true },
    specificResets: {
      // Game progression states
      activeGame: 'eyes',
      completedGames: [],
      currentFocus: 'eyes',
      
      // Eyes telescope game states
      showEyesTelescopeGame: false,
      eyesGameActive: false,
      eyesGameComplete: false,
      foundInstruments: [],
      discoveredInstruments: {},
      instrumentsFound: 0,
      
      // Ears rhythm game states
      earsVisible: false,
      showEarsRhythmGame: false,
      earsGameActive: false,
      earsGameComplete: false,
      musicalNotesVisible: false,
      currentNote: 'note1',
      musicalNoteStates: {
        note1: 'gray',
        note2: 'gray',
        note3: 'gray'
      },
      earsGamePhase: 'waiting',
      earsPlayerInput: [],
      earsCurrentSequence: [],
      earsSequenceItemsShown: 0,
      earsSequenceJustCompleted: false,
      earsReadyForNextNote: false,
      earsLastCompletedNote: null,
      
      // Tusk assembly game states
      showTuskAssemblyGame: false,
      tuskGameActive: false,
      tuskPower: 0,
      tuskFullyPowered: false,
      tuskFloating: false,
      ganeshaComplete: false,
      ganeshaAssembling: false,
      showGaneshaOutline: false,
      
      // Symbol discovery states
      symbolDiscoveryState: null,
      sidebarHighlightState: null,
      
      // Message flags
      welcomeShown: false,
      eyesWisdomShown: false,
      earsWisdomShown: false,
      tuskWisdomShown: false,
      readyForWisdom: false,
      
      // Reload and UI states
      currentPopup: null,
      showingCompletionScreen: false,
      playAgainRequested: false,
      fireworksCompleted: false,
      fireworksStartTime: 0,
      completionScreenShown: false,
      
      // GameCoach states
      gameCoachState: null,
      isReloadingGameCoach: false,
      lastGameCoachTime: 0,
      
      // Animated text states
      showEyesText: false,
      showEarsText: false,
      showTuskText: false,
      
      // Progress states
      stars: 0,
      completed: false,
      progress: {
        percentage: 0,
        starsEarned: 0,
        completed: false
      }
    }
  },

  'final-scene': {
    initialPhase: 'initial',
    initialFocus: 'assembly',
    keepSymbols: { 
      mooshika: true, modak: true, belly: true, lotus: true,
      trunk: true, eyes: true, ear: true, tusk: true 
    },
    specificResets: {
      // Assembly game states
      placedSymbols: {},           // {eyes: true, trunk: true, ...}
      ganeshaState: 'stone',       // stone, awakening, divine, blessed
      
      // V8 Click-based interaction states
      selectedSymbol: null,        // Currently selected symbol for placement
      highlightedZone: null,       // Zone highlighted for selected symbol
      placementAnimation: null,    // Active teleport animation
      
      // Audio/blessing states
      currentBlessing: null,
      blessingsHeard: [],
      finalBlessingShown: false,
      
      // GameCoach message flags
      welcomeShown: false,
      assemblyWisdomShown: false,
      masteryShown: false,
      readyForWisdom: false,
      gameCoachState: null,
      lastGameCoachTime: 0,
      isReloadingGameCoach: false,
      
      // Reload and completion states
      currentPopup: null,
      showingCompletionScreen: false,
      showingZoneCompletion: false,
      celebrationActive: false,    // Track celebration state
      
      // Progress states
      stars: 0,
      completed: false,
      progress: {
        percentage: 0,
        starsEarned: 0,
        completed: false
      }
    }
  },

  // ========== CAVE OF SECRETS ZONE (PLACEHOLDER 0/3) ==========
  
'vakratunda-mahakaya': {
  initialPhase: 'door1_active',
  initialFocus: 'door1',
  specificResets: {
    // Door 1 state (Va-kra-tun-da)
    door1State: 'waiting',
    door1SyllablesPlaced: [],
    door1Completed: false,
    door1CurrentStep: 0,
    door1Syllables: ['Va', 'kra', 'tun', 'da'],
    
    // Door 2 state (Ma-ha-ka-ya)   
    door2State: 'waiting',
    door2SyllablesPlaced: [],
    door2Completed: false,
    door2CurrentStep: 0,
    door2Syllables: ['Ma', 'ha', 'ka', 'ya'],
    
    // Game 1: Tracing state with sequential validation
    tracingStarted: false,
    tracedPoints: [],
    traceProgress: 0,
    traceQuality: 'good',
    tracingCompleted: false,
    trunkPosition: { x: 50, y: 100 },
    canResumeTracing: false,
    currentPathSegment: 0,
    segmentsCompleted: [],
    mustFollowSequence: true,
    
    // Mini Ganesha states
    ganeshaVisible: false,
    ganeshaAnimation: 'breathing',
    ganeshaSize: 0.8,
    ganeshaGlow: 0.2,
    
    // Game 2: Growing Ganesha with stone clicking
    growingStarted: false,
    stonesClicked: 0,
    floatingStones: [
      { id: 1, clicked: false, x: 20, y: 30 },
      { id: 2, clicked: false, x: 70, y: 20 },
      { id: 3, clicked: false, x: 30, y: 60 },
      { id: 4, clicked: false, x: 80, y: 50 }
    ],
    growingCompleted: false,
    
    // Sanskrit learning states
    learnedWords: {
      vakratunda: { learned: false, scene: 1 },
      mahakaya: { learned: false, scene: 1 }
    },
    
    // Discovery and symbol states
    discoveredSymbols: {},
    currentPopup: null,
    symbolDiscoveryState: null,
    sidebarHighlightState: null,
    showCurvedText: false,
    showMightyText: false,
    
    // GameCoach states
    gameCoachState: null,
    isReloadingGameCoach: false,
    welcomeShown: false,
    vakratundaWisdomShown: false,
    mahakayaWisdomShown: false,
    readyForWisdom: false,
    lastGameCoachTime: 0,
    tracingIntroShown: false,
    
    // Progress states
    stars: 0,
    completed: false,
    progress: {
      percentage: 0,
      starsEarned: 0,
      completed: false
    },
    
    // UI completion states
    showingCompletionScreen: false,
    fireworksCompleted: false
  }
},

  'suryakoti-samaprabha': {
    initialPhase: 'initial', 
    initialFocus: 'start',
    specificResets: {
      // Add cave-specific states when analyzed
    }
  },

  'nirvighnam-kurumedeva': {
    initialPhase: 'initial',
    initialFocus: 'start', 
    specificResets: {
      // Add cave-specific states when analyzed
    }
  },

  // ========== SHLOKA RIVER ZONE (PLACEHOLDER 0/1+) ==========
  
  'vakratunda-grove': {
    initialPhase: 'initial',
    initialFocus: 'grove',
    specificResets: {
      // Add shloka-specific states when analyzed
    }
  },

  // ========== FESTIVAL SQUARE ZONE (PLACEHOLDER 0/2+) ==========
  
  'game1': {
    initialPhase: 'initial',
    initialFocus: 'piano',
    specificResets: {
      // Add game-specific states when analyzed
    }
  },

  'game2': {
    initialPhase: 'initial',
    initialFocus: 'rangoli',
    specificResets: {
      // Add game-specific states when analyzed
    }
  },

  // ========== STORY TREEHOUSE ZONE (PLACEHOLDER) ==========
  // Scenes to be added when analyzed

  // ========== OBSTACLE FOREST ZONE (PLACEHOLDER) ==========
  // Scenes to be added when analyzed

  // ========== ABOUT ME HUT ZONE (PLACEHOLDER) ==========
  // Scenes to be added when analyzed
};

// Helper function to get reset config for a scene
export const getSceneResetConfig = (sceneId) => {
  return SCENE_RESET_CONFIGS[sceneId] || {
    initialPhase: 'initial',
    initialFocus: 'start',
    specificResets: {}
  };
};

// Progress tracking: 4 scenes complete out of 20+ total scenes