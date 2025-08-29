// lib/components/coach/SimpleGameCoach.jsx
// Lightweight GameCoach for single scenes (no complex discovery flows)

import React, { useState, useEffect, useRef } from 'react';
import { useGameCoach } from './GameCoach';

/**
 * SimpleGameCoach - Clean messaging system for single scenes
 * Perfect for completion scenes, drag-and-drop games, final scenes
 * 
 * @param {Object} config - Scene-specific message configuration
 * @param {Object} sceneState - Current scene state
 * @param {Object} sceneActions - Scene state actions
 * @param {string} profileName - Child's name for personalization
 * @param {Function} onSparkleEffect - Optional sparkle effect trigger
 */
const SimpleGameCoach = ({
  config,
  sceneState,
  sceneActions,
  profileName = 'little explorer',
  onSparkleEffect = null
}) => {
  const { showMessage, hideCoach, isVisible, clearManualCloseTracking } = useGameCoach();
  
  // Track which messages have been shown in this session
  const [shownMessages, setShownMessages] = useState(new Set());
  const timeoutsRef = useRef([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // Clean GameCoach on scene entry
  useEffect(() => {
    console.log('🧹 SimpleGameCoach: Cleaning on scene entry');
    
    if (hideCoach) {
      hideCoach();
    }
    if (clearManualCloseTracking) {
      clearManualCloseTracking();
    }
  }, []);

  // Safe timeout function
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

 // Main message checking logic - COMPLETE useEffect after sparkle removal
useEffect(() => {
  if (!sceneState || !showMessage || !config?.messages) return;
  
  // Block during reload process
  if (sceneState.isReloadingGameCoach) {
    console.log('🚫 SimpleGameCoach blocked: Reload in progress');
    return;
  }

  // Find matching message that should trigger
  const matchingMessage = config.messages.find(messageConfig => {
    const messageId = messageConfig.id;
    
    // Skip if already shown this session
    if (shownMessages.has(messageId)) {
      return false;
    }
    
    // Check if state flag indicates message was shown
    const stateFlag = sceneState[messageConfig.stateFlag];
    if (stateFlag) {
      return false;
    }
    
    // Check condition function
    if (typeof messageConfig.condition === 'function') {
      return messageConfig.condition(sceneState);
    }
    
    return false;
  });

  if (matchingMessage) {
    console.log(`🎭 SimpleGameCoach: Triggering ${matchingMessage.id}`);
    
    const timer = safeSetTimeout(() => {
      // No sparkle effects - let scene handle them
      showActualMessage(matchingMessage);
    }, matchingMessage.timing || 500);

    timeoutsRef.current.push(timer);
  }
}, [
  sceneState?.phase,
  sceneState?.welcomeShown,
  sceneState?.isReloadingGameCoach,
  ...(config?.dependencies || []),
  showMessage
]);

  // Show the actual GameCoach message
  const showActualMessage = (messageConfig) => {
    const personalizedMessage = messageConfig.message.replace('{profileName}', profileName);
    
    showMessage(personalizedMessage, {
      duration: messageConfig.duration || 8000,
      animation: messageConfig.animation || 'bounce',
      position: messageConfig.position || 'top-right',
      source: 'scene',
      messageType: messageConfig.messageType || 'welcome'
    });

    // Mark message as shown
    setShownMessages(prev => new Set([...prev, messageConfig.id]));
    
    // Update scene state flags
    const updates = { [messageConfig.stateFlag]: true };
    
    // Add any additional state updates
    if (messageConfig.additionalUpdates) {
      Object.assign(updates, messageConfig.additionalUpdates(sceneState));
    }
    
    sceneActions.updateState(updates);
  };

  // Handle reload scenarios
  useEffect(() => {
    if (!sceneState?.isReload) return;
    
    console.log('🔄 SimpleGameCoach: Handling reload');
    
    // Block normal flow during reload
    sceneActions.updateState({ isReloadingGameCoach: true });
    
    safeSetTimeout(() => {
      // Check if we need to resume a message
      const resumeMessage = config?.messages?.find(msg => 
        sceneState[msg.stateFlag] && msg.resumeOnReload
      );
      
      if (resumeMessage) {
        console.log(`🔄 SimpleGameCoach: Resuming ${resumeMessage.id}`);
        
        // Mark as already shown to prevent duplicate
        setShownMessages(prev => new Set([...prev, resumeMessage.id]));
        
        // Show the message
        showActualMessage(resumeMessage);
      }
      
      // Clear reload blocking
      sceneActions.updateState({ isReloadingGameCoach: false });
    }, 500);
  }, [sceneState?.isReload]);

  // This component doesn't render anything - it's a logic-only component
  return null;
};

/**
 * Configuration factory for common scene types
 */
export const SimpleGameCoachConfigs = {
  
  // Sacred Assembly Scene Configuration
  sacredAssembly: (placedSymbols = {}) => ({
    messages: [
      {
        id: 'welcome',
        stateFlag: 'welcomeShown',
        message: `Welcome to the Sacred Summit, {profileName}! You've collected all of Ganesha's sacred symbols. Now assemble them to awaken his divine form!`,
        timing: 500,
        sparkleType: 'divine-light',
        sparkleDelay: 2000,
        condition: (sceneState) => 
          sceneState?.phase === 'initial' && 
          !sceneState?.welcomeShown,
        messageType: 'welcome'
      },
      {
        id: 'assembly_wisdom',
        stateFlag: 'assemblyWisdomShown',
        message: `Magnificent, {profileName}! You're bringing Ganesha to life! Each symbol you place awakens his divine power!`,
        timing: 1000,
        sparkleType: 'divine-light',
        sparkleDelay: 2000,
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
        timing: 1000,
        sparkleType: 'divine-light',
        sparkleDelay: 2000,
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
  }),

  // Template for other single scenes
  createCustomConfig: ({
    sceneType,
    welcomeMessage,
    milestoneMessage,
    completionMessage,
    progressTracker, // e.g., 'clickedElements', 'solvedPuzzles'
    milestoneThreshold = 3,
    completionThreshold = 8
  }) => ({
    messages: [
      {
        id: 'welcome',
        stateFlag: 'welcomeShown',
        message: welcomeMessage,
        timing: 500,
        sparkleType: 'divine-light',
        condition: (sceneState) => 
          sceneState?.phase === 'initial' && !sceneState?.welcomeShown,
        messageType: 'welcome'
      },
      {
        id: 'milestone',
        stateFlag: 'milestoneShown',
        message: milestoneMessage,
        timing: 1000,
        sparkleType: 'divine-light',
        condition: (sceneState) => {
          const progress = Object.keys(sceneState?.[progressTracker] || {}).length;
          return progress >= milestoneThreshold && 
                 !sceneState?.milestoneShown && 
                 sceneState?.readyForWisdom;
        },
        messageType: 'wisdom1'
      },
      {
        id: 'completion',
        stateFlag: 'completionShown',
        message: completionMessage,
        timing: 1000,
        sparkleType: 'divine-light',
        condition: (sceneState) => {
          const progress = Object.keys(sceneState?.[progressTracker] || {}).length;
          return progress >= completionThreshold && !sceneState?.completionShown;
        },
        messageType: 'wisdom3'
      }
    ],
    dependencies: [
      `sceneState?.${progressTracker}`,
      'sceneState?.readyForWisdom',
      'sceneState?.milestoneShown',
      'sceneState?.completionShown'
    ]
  })
};

export default SimpleGameCoach;