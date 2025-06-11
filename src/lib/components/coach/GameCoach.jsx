// GameCoach.jsx - Reusable character guide for all scenes
import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import './GameCoach.css';

// Create context for coach
const GameCoachContext = createContext();

// Coach Provider - Wrap your entire app with this
export const GameCoachProvider = ({ children, defaultConfig }) => {
  const [coachVisible, setCoachVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [messageQueue, setMessageQueue] = useState([]);
  const [coachConfig, setCoachConfig] = useState(defaultConfig || {
    name: 'Mooshika',
    image: '/images/mooshika-coach.png',
    position: 'top-right'
  });

  // Refs for timers to prevent closure issues
  const dismissTimerRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const isProcessingRef = useRef(false);
  const debugInfoRef = useRef({
    lastMessage: '',
    lastShownAt: null,
    shouldHideAt: null,
    visibilityState: false
  });

  // Show a message
  const showMessage = (message, options = {}) => {
    console.log(`GameCoach: Request to show message: "${message}"`);
    
    const messageData = {
      text: message,
      duration: options.duration || 6000,
      priority: options.priority || 0,
      animation: options.animation || 'bounce',
      id: Date.now()
    };

    // Save debug info
    debugInfoRef.current.lastMessage = message;
    debugInfoRef.current.lastShownAt = new Date();
    debugInfoRef.current.shouldHideAt = new Date(Date.now() + messageData.duration);

    // Always clear any existing timers when showing a new message
    clearAllTimers();

    if (options.immediate) {
      console.log(`GameCoach: Showing message immediately: "${message}" for ${messageData.duration}ms`);
      setCurrentMessage(messageData);
      setCoachVisible(true);
      debugInfoRef.current.visibilityState = true;
      
      // Set a timer for this immediate message
      scheduleMessageDismissal(messageData.duration);
    } else {
      console.log(`GameCoach: Queueing message: "${message}"`);
      setMessageQueue(prev => [...prev, messageData]);
    }
  };

  // Helper function to clear all timers
  const clearAllTimers = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  };

  // Helper function to set dismissal timer
  const scheduleMessageDismissal = (duration) => {
    clearAllTimers();
    
    console.log(`GameCoach: Scheduling dismissal in ${duration}ms`);
    
    // Set new timer
    dismissTimerRef.current = setTimeout(() => {
      console.log('GameCoach: Primary timer fired - hiding coach');
      setCoachVisible(false);
      debugInfoRef.current.visibilityState = false;
      dismissTimerRef.current = null;
    }, duration);
    
    // Safety timer is always longer than the intended duration
    safetyTimerRef.current = setTimeout(() => {
      console.log('GameCoach: SAFETY timer fired - forcing coach hide');
      setCoachVisible(false);
      debugInfoRef.current.visibilityState = false;
      safetyTimerRef.current = null;
    }, duration + 2000);
  };

  // Process message queue - separate effect with fewer dependencies
  useEffect(() => {
    const processQueue = () => {
      if (!coachVisible && messageQueue.length > 0 && !isProcessingRef.current) {
        isProcessingRef.current = true;
        
        // Sort by priority and get the next message
        const sortedQueue = [...messageQueue].sort((a, b) => b.priority - a.priority);
        const nextMessage = sortedQueue[0];
        
        console.log(`GameCoach: Processing queued message: "${nextMessage.text}" for ${nextMessage.duration}ms`);
        
        // Update state
        setCurrentMessage(nextMessage);
        setCoachVisible(true);
        debugInfoRef.current.visibilityState = true;
        setMessageQueue(prev => prev.filter(msg => msg.id !== nextMessage.id));
        
        // Schedule auto-hide
        scheduleMessageDismissal(nextMessage.duration);
        
        // Reset processing flag after a small delay
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 100);
      }
    };
    
    processQueue();
  }, [messageQueue, coachVisible]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Manual hide function
  const hideCoach = () => {
    console.log('GameCoach: Manual hide requested');
    setCoachVisible(false);
    debugInfoRef.current.visibilityState = false;
    clearAllTimers();
  };

  // Debug function to check coach state
  const debugCoach = () => {
    return {
      ...debugInfoRef.current,
      currentVisibility: coachVisible,
      queueLength: messageQueue.length,
      activeTimers: {
        dismissTimer: dismissTimerRef.current !== null,
        safetyTimer: safetyTimerRef.current !== null
      }
    };
  };

  return (
    <GameCoachContext.Provider value={{ 
      showMessage, 
      hideCoach, 
      setCoachConfig,
      isVisible: coachVisible,
      debugCoach
    }}>
      {children}
      <GameCoach 
        visible={coachVisible}
        message={currentMessage}
        config={coachConfig}
        onClose={hideCoach}
      />
    </GameCoachContext.Provider>
  );
};

// Hook to use coach in any component
export const useGameCoach = () => {
  const context = useContext(GameCoachContext);
  if (!context) {
    throw new Error('useGameCoach must be used within GameCoachProvider');
  }
  return context;
};

// The actual coach component
const GameCoach = ({ visible, message, config, onClose }) => {
  // Don't render if coach is not visible or there's no message
  if (!visible || !message) return null;

  return (
    <div className={`game-coach ${config.position} ${visible ? 'visible' : ''}`}>
      <div className={`coach-container ${message.animation}`}>
        <div className="coach-character">
          <img src={config.image} alt={config.name} />
        </div>
        <div className="coach-message">
          <div className="message-bubble">
            {message.text}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>
    </div>
  );
};

// Pre-configured message sets
export const CoachMessages = {
  WELCOME: {
    pond: "Welcome to the magical pond! Click the lotus flowers to begin.",
    temple: "The ancient temple awaits! Solve its mysteries.",
    garden: "What a beautiful garden! Let's explore together."
  },
  
  ENCOURAGEMENT: [
    "You're doing great! Keep going!",
    "Almost there! Don't give up!",
    "Fantastic work! You're a natural!",
    "Wow! You're really getting the hang of this!",
    "Keep it up! You're making great progress!"
  ],
  
  HINTS: {
    stuck: "Hmm, looks like you might be stuck. Try looking around!",
    almostDone: "You're so close! Just a little more!",
    tryAgain: "Don't worry, everyone makes mistakes. Try again!",
    checkCarefully: "Take your time and look carefully."
  },
  
  COMPLETION: {
    scene: "Amazing! You've completed this scene!",
    zone: "Incredible! You've mastered this entire zone!",
    game: "Congratulations! You've completed the entire game!"
  },
  
  // Added specific messages from your pond scene flow
  POND: {
    firstLotus: "Wonderful! You found your first lotus flower!",
    secondLotus: "Just one more lotus to find! You're doing great!",
    thirdLotus: "Great job! You found all the lotus flowers!",
    goldenLotusAppears: "Amazing! All the lotuses have bloomed and revealed a golden lotus!",
    goldenLotusPrompt: "The golden lotus is special - click it to learn more!",
    goldenLotusClicked: "The golden lotus is special in ancient traditions!",
    elephantAppears: "Look! An elephant has appeared! In Indian mythology, elephants are sacred animals.",
    elephantPrompt: "The elephant represents Lord Ganesha. Click it to see what happens!",
    elephantClicked: "The elephant's trunk represents Ganesha, who removes obstacles!",
    sceneComplete: "You've mastered the pond scene! On to the next adventure!"
  }
};

// Progress-based coach that shows messages automatically
export const ProgressCoach = ({ children, sceneId, sceneState }) => {
  const { showMessage, isVisible, debugCoach } = useGameCoach();
  const [shownMessages, setShownMessages] = useState({});
  const welcomeShownRef = useRef(false);
  
  // Track component mount status to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set ref to track mount status
    isMountedRef.current = true;
    
    // Reset welcome shown flag when scene changes
    welcomeShownRef.current = false;
    
    return () => {
      isMountedRef.current = false;
    };
  }, [sceneId]);

  // Welcome message - with extra reliability
  /*useEffect(() => {
    const showWelcomeMessage = () => {
      if (!welcomeShownRef.current && !isVisible) {
        welcomeShownRef.current = true;
        
        // Get welcome message for scene or use default
        const welcomeMessage = CoachMessages.WELCOME[sceneId] || "Let's start this adventure!";
        
        console.log(`ProgressCoach: Showing welcome message for ${sceneId}: "${welcomeMessage}"`);
        
        showMessage(welcomeMessage, {
          duration: 5000, // 5 seconds for welcome messages
          priority: 5,
          animation: 'bounceIn'
        });
        
        if (isMountedRef.current) {
          setShownMessages(prev => ({ ...prev, welcome: true }));
        }
      }
    };
    
    // Small delay to ensure scene is fully loaded
    const welcomeTimer = setTimeout(showWelcomeMessage, 500);
    
    return () => clearTimeout(welcomeTimer);
  }, [sceneId, showMessage, isVisible]);*/

  // Progress-based messages
  /*useEffect(() => {
    if (!sceneState?.progress) return;
    
    const progress = sceneState.progress?.percentage || 0;
    
    // Only show progress messages if coach is not currently visible
    // And only if we haven't shown this progress message before
    if (progress >= 25 && progress < 50 && !shownMessages.quarter && !isVisible) {
      showMessage(CoachMessages.ENCOURAGEMENT[0], {
        duration: 3000,
        priority: 3
      });
      
      if (isMountedRef.current) {
        setShownMessages(prev => ({ ...prev, quarter: true }));
      }
    }
    
    if (progress >= 50 && progress < 75 && !shownMessages.half && !isVisible) {
      showMessage(CoachMessages.ENCOURAGEMENT[1], {
        duration: 3000,
        priority: 3
      });
      
      if (isMountedRef.current) {
        setShownMessages(prev => ({ ...prev, half: true }));
      }
    }
    
    if (progress >= 75 && progress < 100 && !shownMessages.threeQuarter && !isVisible) {
      showMessage(CoachMessages.HINTS.almostDone, {
        duration: 3000,
        priority: 3
      });
      
      if (isMountedRef.current) {
        setShownMessages(prev => ({ ...prev, threeQuarter: true }));
      }
    }
    
    if (progress === 100 && !shownMessages.complete) {
      showMessage(CoachMessages.COMPLETION.scene, { 
        duration: 5000,
        priority: 10,
        immediate: true  // Immediate display for completion
      });
      
      if (isMountedRef.current) {
        setShownMessages(prev => ({ ...prev, complete: true }));
      }
    }
  }, [sceneState?.progress, shownMessages, showMessage, isVisible]);*/

  // Idle timer with improved cleanup - 30 seconds as mentioned in your flow
  /*useEffect(() => {
  let idleTimer;
  
  const resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      // Only show hint if user is actually stuck
      if (
        (sceneState.lotusStates && sceneState.lotusStates.some(state => state === 0)) || 
        (sceneState.goldenLotusVisible && !sceneState.interactions?.['golden-lotus']) ||
        (sceneState.elephantVisible && !sceneState.waterVisible)
      ) {
        showMessage(CoachMessages.HINTS.stuck);
      }
    }, 60000); // Increased from 30000 to 60000 (1 minute)
  };
    
    // Add event listeners
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    
    // Start the timer
    resetTimer();
    
    // Cleanup
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, [showMessage, isVisible]);*/

  // Debug mechanism
  useEffect(() => {
    // Creates a reset mechanism if coach gets stuck visible
    const debugTimer = setInterval(() => {
      const debug = debugCoach();
      
      // If coach thinks it's visible but there are no active timers
      // and it's been more than 10 seconds since it should have hidden
      if (debug.visibilityState && 
          !debug.activeTimers.dismissTimer && 
          !debug.activeTimers.safetyTimer && 
          debug.shouldHideAt && 
          new Date() - debug.shouldHideAt > 10000) {
        
        console.log("ProgressCoach: DEBUG - Detected stuck coach, forcing hide");
        showMessage("", { duration: 0, immediate: true });
      }
    }, 5000);
    
    return () => clearInterval(debugTimer);
  }, [debugCoach, showMessage]);

  return children;
};

// Helper to trigger specific messages
export const TriggerCoach = ({ message, condition, once = true, options = {} }) => {
  const { showMessage, isVisible } = useGameCoach();
  const [shown, setShown] = useState(false);
  const prevConditionRef = useRef(false);
  const messageRef = useRef(message);
  
  // Update the messageRef if message changes
  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    // Only trigger when condition changes from false to true
    // and only if coach is not currently visible (to avoid message pileup)
    if (condition && !prevConditionRef.current && (!once || !shown) && !isVisible) {
      console.log(`TriggerCoach: Condition met for message: "${messageRef.current}"`);
      
      // Default duration is 3 seconds as per your flow
      const messageOptions = { 
        duration: 3000,
        priority: 4,
        ...options
      };
      
      showMessage(messageRef.current, messageOptions);
      
      if (once) {
        setShown(true);
      }
    }
    
    prevConditionRef.current = condition;
  }, [condition, once, shown, showMessage, options, isVisible]);

  return null;
};

export default GameCoachProvider;