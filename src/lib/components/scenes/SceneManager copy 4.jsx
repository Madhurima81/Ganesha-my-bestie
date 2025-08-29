// lib/components/scenes/SceneManager.jsx - ROLE SEPARATED VERSION
import React, { useState, useEffect, useRef } from 'react';
import GameStateManager from '../../services/GameStateManager';

export const SceneManager = ({ 
  children, 
  zoneId, 
  sceneId,
  initialState = {},
  forceRestart = false,
}) => {
  const [sceneState, setSceneState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const saveTimeoutRef = useRef(null);
  const hasInitialized = useRef(false);
  
  // 🎯 ROLE: SceneManager handles ALL scene playback (normal + replay)
  // GameStateManager handles ONLY permanent completion data
  
  // Get storage key based on mode
  const getStorageKey = (isReplayMode) => {
    const profileId = GameStateManager.activeProfileId;
    if (isReplayMode) {
      return `replay_session_${profileId}_${zoneId}_${sceneId}`;
    } else {
      return `temp_session_${profileId}_${zoneId}_${sceneId}`;
    }
  };
  
  // Save scene progress to SceneManager's own storage
  const saveSceneProgress = (state, isReplayMode) => {
    try {
      const storageKey = getStorageKey(isReplayMode);
      const progressData = {
        ...state,
        isReplaySession: isReplayMode,
        lastSaved: Date.now(),
        sceneId,
        zoneId
      };
      
      localStorage.setItem(storageKey, JSON.stringify(progressData));
      
      if (isReplayMode) {
        console.log(`🎮 SCENE: Replay progress saved to ${storageKey}`);
      } else {
        console.log(`💾 SCENE: Normal progress saved to ${storageKey}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving scene progress:', error);
      return false;
    }
  };
  
  // Load scene progress from SceneManager's own storage
const loadSceneProgress = () => {
  try {
    const profileId = GameStateManager.activeProfileId;
    
    // Check completion status from GameStateManager (permanent data only)
    const permanentState = GameStateManager.getSceneState(zoneId, sceneId);
    const isCompleted = permanentState?.completed || false;
    
    console.log(`🔍 SCENE: Loading ${sceneId}, completed status:`, isCompleted);
    
    // Determine if this is a reload vs fresh start
    const isActualReload = performance.navigation?.type === 1 || 
                          performance.getEntriesByType('navigation')[0]?.type === 'reload';
    
    // ✅ FIXED: Check for temp session data FIRST, even if completed
    const normalKey = `temp_session_${profileId}_${zoneId}_${sceneId}`;
    const normalData = localStorage.getItem(normalKey);
    
    if (normalData) {
      console.log('🔄 SCENE: Found temp session data - loading progress');
      const normalState = JSON.parse(normalData);
      setIsReplay(false);
      setIsReload(isActualReload);
      return {
        ...initialState,
        ...normalState
      };
    }
    
    // Check for existing replay session
    const replayKey = `replay_session_${profileId}_${zoneId}_${sceneId}`;
    const replayData = localStorage.getItem(replayKey);
    
    if (isActualReload && replayData) {
      console.log('🔄 SCENE: Reload during replay detected');
      const replayState = JSON.parse(replayData);
      setIsReplay(true);
      setIsReload(true);
      return {
        ...initialState,
        ...replayState,
        originalCompletion: permanentState
      };
    }
    
    // If completed but no session data, start fresh
    if (isCompleted && !isActualReload) {
      console.log('🎮 SCENE: Starting fresh replay of completed scene');
      localStorage.removeItem(replayKey);
      setIsReplay(true);
      setIsReload(false);
      return {
        ...initialState,
        completed: false,
        stars: 0,
        originalCompletion: permanentState
      };
    }
    
    // Normal fresh start
    console.log('🆕 SCENE: Starting fresh normal play');
    setIsReplay(false);
    setIsReload(false);
    return { ...initialState };
    
  } catch (error) {
    console.error('Error loading scene progress:', error);
    setIsReplay(false);
    setIsReload(false);
    return { ...initialState };
  }
};
  
  // Initialize state
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const initializeScene = async () => {
      try {
        console.log(`🎬 SCENE: Initializing ${zoneId}/${sceneId}`);
        
        const loadedState = loadSceneProgress();
        setSceneState(loadedState);
        
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error initializing scene:', error);
        setSceneState({ ...initialState });
        hasInitialized.current = true;
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeScene();
  }, [zoneId, sceneId, forceRestart]);
  
  // 🎯 ROLE: SceneManager auto-saves to its OWN storage (never calls GameStateManager)
  useEffect(() => {
    // Don't auto-save if still loading or no state
    if (isLoading || !sceneState || !hasInitialized.current) {
      return;
    }
    
     // ✅ ADD THIS DEBUG:
  console.log('🧪 AUTO-SAVE DEBUG:', {
    sceneId,
    completed: sceneState.completed,
    phase: sceneState.phase,
    showingCompletionScreen: sceneState.showingCompletionScreen,
    timestamp: Date.now()
  });
  

    // Don't auto-save completed scenes UNLESS they're in fireworks/celebration
const isInCelebration = sceneState.currentPopup === 'final_fireworks' || 
                       sceneState.currentPopup === 'fireworks' ||
                       sceneState.phase === 'celebration' ||
                                              sceneState.phase === 'zone-complete' ||  // ← ADD THIS
                       (sceneState.phase === 'complete' && sceneState.currentPopup);

if ((sceneState.completed === true || sceneState.phase === 'complete') && !isInCelebration) {
  console.log(`🚫 SCENE: Skipping auto-save for completed scene: ${sceneId}`);
  return;
}
    
    // Don't auto-save empty/initial states
    const isEmpty = !sceneState.completed && 
                   (sceneState.stars === 0 || !sceneState.stars) && 
                   (!sceneState.discoveredSymbols || Object.keys(sceneState.discoveredSymbols).length === 0) &&
                   (!sceneState.lotusStates || sceneState.lotusStates.every(state => state === 0)) &&
                   (!sceneState.collectedModaks || sceneState.collectedModaks.length === 0) &&
                   (!sceneState.mooshikaFound || sceneState.mooshikaFound === false) &&
                   (!sceneState.mooshikaVisible || sceneState.mooshikaVisible === false) &&
                   (!sceneState.rockTransformed || sceneState.rockTransformed === false) &&
                   (!sceneState.phase || sceneState.phase === 'initial') &&
                   (!sceneState.interactions || Object.keys(sceneState.interactions).length === 0);
    
    if (isEmpty) {
      console.log(`🚫 SCENE: Skipping auto-save for empty scene state: ${sceneId}`);
      return;
    }
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // 🎯 ROLE: Save to SceneManager's own storage (NEVER GameStateManager)
    saveTimeoutRef.current = setTimeout(() => {
      const progressState = {
        ...sceneState,
        completed: false, // Force to false for progress saves
        phase: sceneState.phase === 'complete' ? 'in-progress' : sceneState.phase
      };
      
      saveSceneProgress(progressState, isReplay);

      // ✅ UPDATE CURRENT LOCATION - Add this after line 205
const activeProfileId = GameStateManager.activeProfileId;
if (activeProfileId && !isEmpty) {  // Add the !isEmpty condition
  const progressKey = `${activeProfileId}_gameProgress`;
  const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
  progress.currentZone = zoneId;
  progress.currentScene = sceneId;
  progress.lastUpdated = Date.now();
  localStorage.setItem(progressKey, JSON.stringify(progress));
  console.log(`📍 SCENE: Updated current location to ${zoneId}/${sceneId}`);
}
      
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sceneState, zoneId, sceneId, isLoading, isReplay]);
  
  // Safe state update function
  const updateState = (updates) => {
    setSceneState(currentState => {
      if (!currentState) {
        console.warn('Trying to update null state, skipping');
        return currentState;
      }
      
      return { ...currentState, ...updates };
    });
  };
  
  // 🎯 ROLE: SceneManager provides actions, GameStateManager handles ONLY completion
  const sceneActions = {
    setPhase: (newPhase) => {
      updateState({ phase: newPhase });
    },
    
    updateState: updateState,
    
    trackInteraction: (elementId, data = {}) => {
      updateState({
        interactions: {
          ...sceneState?.interactions,
          [elementId]: {
            ...sceneState?.interactions?.[elementId],
            ...data,
            lastInteracted: Date.now()
          }
        }
      });
    },
    
    markMessageShown: (messageId) => {
      updateState({
        messagesShown: {
          ...sceneState?.messagesShown,
          [messageId]: true
        }
      });
    },
    
    updateProgress: (key, value) => {
      updateState({
        progress: {
          ...sceneState?.progress,
          [key]: value
        }
      });
    },
    
    // 🎯 ROLE: Scene completion calls GameStateManager directly (not auto-save)
    completeScene: (stars = 0, symbols = {}, data = {}) => {
      console.log('🏆 SCENE: Scene completion triggered, calling GameStateManager');
      
      // Update local state for immediate UI feedback
      const completionData = {
        completed: true,
        stars,
        symbols,
        completedAt: Date.now(),
        phase: 'complete',
        ...data
      };
      
      updateState(completionData);
      
      // 🎯 ROLE: ONLY completion calls GameStateManager
      if (!isReplay) {
        console.log('💾 SCENE: Saving completion to GameStateManager (permanent)');
        GameStateManager.saveGameState(zoneId, sceneId, {
          completed: true,
          stars,
          symbols,
          completedAt: Date.now(),
          ...data
        });
      } else {
        console.log('🎮 SCENE: Replay completion - not saving to GameStateManager');
      }
      
      // Clean up temporary session storage
      const storageKey = getStorageKey(isReplay);
      localStorage.removeItem(storageKey);
      console.log(`🧹 SCENE: Cleaned up session storage: ${storageKey}`);
    }
  };
  
  // Show loading state
  if (isLoading || !sceneState) {
    return (
      <div className="scene-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading scene...
      </div>
    );
  }
  
  return children({
    sceneState,
    sceneActions,
    isReload,
    isReplay
  });
};

export default SceneManager;