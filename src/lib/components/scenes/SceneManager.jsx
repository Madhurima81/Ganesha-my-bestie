// lib/components/scenes/SceneManager.jsx - DISNEY RELOAD-ONLY VERSION
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
  const completionInProgress = useRef(false); // ✅ Track completion state
  
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
  
// ✅ DISNEY: RELOAD-ONLY AUTO-SAVE - FIXED TO PREVENT OVERWRITES
useEffect(() => {
  // Don't auto-save if still loading, no state, or completion in progress
  if (isLoading || !sceneState || !hasInitialized.current) {
    return;
  }
  
  // ✅ DISNEY RULE: Never auto-save completed scenes - scenes handle their own completion
  if (sceneState.completed === true || sceneState.phase === 'complete') {
    console.log(`🚫 DISNEY: Skipping auto-save for completed scene: ${sceneId}`);
    return;
  }
  
  // ✅ DISNEY RULE: Block auto-save during completion sequences
  if (completionInProgress.current) {
    console.log(`🚫 DISNEY: Completion in progress, no auto-save for ${sceneId}`);
    return;
  }
  
  // 🚫 NEW: Don't auto-save fresh/empty scene states that could overwrite other scenes
  const currentProgress = GameStateManager.getGameProgress();
  const isEmpty = !sceneState.completed && 
                 (sceneState.stars === 0 || !sceneState.stars) && 
                 (!sceneState.discoveredSymbols || Object.keys(sceneState.discoveredSymbols).length === 0);
  
  if (isEmpty) {
    console.log(`🚫 DISNEY: Skipping auto-save for empty scene state: ${sceneId}`);
    return;
  }
  
  // Clear existing timeout
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
  
  // Debounced auto-save for mid-scene progress ONLY
  saveTimeoutRef.current = setTimeout(() => {
    try {
      console.log(`💾 DISNEY: Auto-saving progress for ${sceneId}:`, sceneState);
      
      // ✅ DISNEY: Only save progress, never completion
      const progressState = {
        ...sceneState,
        completed: false, // Force to false for progress saves
        phase: sceneState.phase === 'complete' ? 'in-progress' : sceneState.phase
      };
      
      GameStateManager.saveGameState(zoneId, sceneId, progressState);
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
    
    // ✅ DISNEY: DISABLED - Scenes handle their own completion
    completeScene: (stars = 0, data = {}) => {
      console.log('🚫 DISNEY: completeScene disabled - scenes handle completion directly');
      console.log('🎯 DISNEY: Use GameStateManager.saveGameState() directly in scenes instead');
      console.log('📊 DISNEY: Completion data attempted:', { zoneId, sceneId, stars, data });
      
      // Just update local state for UI feedback, don't save anything
      const completionData = {
        completed: true,
        stars,
        completedAt: Date.now(),
        phase: 'complete',
        ...data
      };
      
      updateState(completionData);
      
      // ✅ DISNEY: No GameStateManager calls - scenes handle this directly
      console.log('✨ DISNEY: Local state updated for UI only - scene must handle actual save');
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