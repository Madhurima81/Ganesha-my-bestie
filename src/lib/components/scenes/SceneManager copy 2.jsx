// lib/components/scenes/SceneManager.jsx - SMART AUTO-SAVE VERSION
import React, { useState, useEffect, useRef } from 'react';
import GameStateManager from '../../services/GameStateManager';

export const SceneManager = ({ 
  children, 
  zoneId, 
  sceneId,
  initialState = {},
}) => {
  const [sceneState, setSceneState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const saveTimeoutRef = useRef(null);
  const hasInitialized = useRef(false);
  const completionInProgress = useRef(false); // ✅ NEW: Track completion state
  
  // Initialize state
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const loadSavedState = async () => {
      try {
        console.log(`🔄 SceneManager: Loading state for ${zoneId}/${sceneId}`);
        
        const savedState = GameStateManager.getSceneState(zoneId, sceneId);
        
        if (savedState && Object.keys(savedState).length > 0) {
          console.log(`📂 Found saved state for ${sceneId}:`, savedState);
          
          const isActualReload = performance.navigation?.type === 1 || 
                                performance.getEntriesByType('navigation')[0]?.type === 'reload';
          
          const mergedState = {
            phase: 'initial',
            messagesShown: {},
            interactions: {},
            progress: {},
            ...initialState,
            ...savedState,
            // Always preserve completion data
            ...(savedState?.completed && {
              completed: savedState.completed,
              stars: savedState.stars || 0,
              progress: {
                ...initialState.progress,
                ...savedState.progress,
                completed: savedState.completed,
                starsEarned: savedState.stars || 0
              }
            })
          };
          
          setSceneState(mergedState);
          setIsReload(isActualReload);
        } else {
          console.log(`🆕 Using initial state for ${sceneId}:`, initialState);
          
          const defaultState = {
            phase: 'initial',
            messagesShown: {},
            interactions: {},
            progress: {},
            ...initialState
          };
          
          setSceneState(defaultState);
          setIsReload(false);
        }
        
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error loading state:', error);
        
        setSceneState({
          phase: 'initial',
          messagesShown: {},
          interactions: {},
          progress: {},
          ...initialState
        });
        setIsReload(false);
        hasInitialized.current = true;
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedState();
  }, [zoneId, sceneId]);
  
  // ✅ SMART AUTO-SAVE: Only saves non-completion states
  useEffect(() => {
    // Don't auto-save if still loading, no state, or completion in progress
    if (isLoading || !sceneState || !hasInitialized.current) {
      return;
    }
    
    // ✅ FIXED: Don't auto-save if completion is in progress OR if already completed for a while
    if (completionInProgress.current) {
      console.log(`🚫 Skipping auto-save: completion in progress for ${sceneId}`);
      return;
    }
    
    // Skip auto-save for scenes that have been completed (but allow initial completion save)
    if (sceneState.completed === true && sceneState.completedAt && (Date.now() - sceneState.completedAt > 5000)) {
      console.log(`🚫 Skipping auto-save for long-completed scene: ${sceneId}`);
      return;
    }
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounced auto-save for mid-scene progress
    saveTimeoutRef.current = setTimeout(() => {
      try {
        // ✅ FIXED: Save completion state if it exists, otherwise save progress
        if (sceneState.completed === true) {
          console.log(`💾 Auto-saving COMPLETION for ${sceneId}:`, sceneState);
          GameStateManager.saveGameState(zoneId, sceneId, sceneState);
        } else {
          console.log(`💾 Auto-saving progress for ${sceneId}:`, sceneState);
          // Save scene progress (but not as completion)
          const progressState = {
            ...sceneState,
            completed: false,
            phase: sceneState.phase === 'complete' ? 'in-progress' : sceneState.phase
          };
          GameStateManager.saveGameState(zoneId, sceneId, progressState);
        }
      } catch (error) {
        console.error('Error in auto-save:', error);
      }
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sceneState, zoneId, sceneId, isLoading]);
  
  // Safe state update function
  const updateState = (updates) => {
    setSceneState(currentState => {
      if (!currentState) {
        console.warn('Trying to update null state, skipping');
        return currentState;
      }
      
      const newState = { ...currentState, ...updates };
      
     
      
      return newState;
    });
  };
  
  // Scene action handlers
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
    
    // ✅ COMPLETION HANDLER: Properly manages completion flow
    completeScene: (stars = 0, data = {}) => {
      console.log('🏆 COMPLETE SCENE CALLED:', { zoneId, sceneId, stars, data });
      
      // Clear any pending auto-saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      const completionData = {
        completed: true,
        stars,
        completedAt: Date.now(),
        phase: 'complete',
        ...data
      };
      
      console.log('🏆 Completion data prepared:', completionData);

      GameStateManager.saveGameState(zoneId, sceneId, newState);

      
      // Update state - this will trigger completion save via updateState
      updateState(completionData);
      
      // Verify completion after save
      setTimeout(() => {
        const zoneSummary = GameStateManager.getZoneSummary(zoneId);
        console.log('✅ Zone summary after completion:', zoneSummary);
        
        const sceneCheck = GameStateManager.getSceneState(zoneId, sceneId);
        console.log('✅ Scene state after completion:', sceneCheck);
      }, 1000);
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
    isReload
  });
};

export default SceneManager;