// lib/components/scenes/SceneManager.jsx - FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';
import GameStateManager from '../../services/GameStateManager';
import ProgressManager from '../../services/ProgressManager';  // 🎯 ADD THIS LINE

export const SceneManager = ({ 
  children, 
  zoneId, 
  sceneId,
  initialState = {},
}) => {
  const [sceneState, setSceneState] = useState(null); // Start with null to prevent render issues
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const saveTimeoutRef = useRef(null);
  const hasInitialized = useRef(false);
  
  // 🔧 FIX: Initialize state properly in useEffect to prevent render loops
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const loadSavedState = async () => {
      try {
        console.log(`🔄 SceneManager: Loading state for ${zoneId}/${sceneId}`);
        
        const savedState = GameStateManager.getSceneState(zoneId, sceneId);
        
        if (savedState && Object.keys(savedState).length > 0) {
          console.log(`📂 Found saved state for ${sceneId}:`, savedState);
          
          // 🔧 FIX: Only set isReload if we're actually recovering from a page refresh
          // Not when navigating normally through the app
          const isActualReload = performance.navigation?.type === 1 || 
                                performance.getEntriesByType('navigation')[0]?.type === 'reload';
          
          console.log(`🔍 Reload detection: ${isActualReload ? 'ACTUAL RELOAD' : 'NORMAL NAVIGATION'}`);
          
          // Fixed: Always preserve completion status
const mergedState = {
  phase: 'initial',
  messagesShown: {},
  interactions: {},
  progress: {},
  ...initialState,  // Apply initial state first
  ...savedState,    // Override with saved state
  // 🔧 CRITICAL FIX: Always preserve completion if it exists
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
          setIsReload(isActualReload);  // 🔧 Use actual reload detection
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
        
        // Fallback to initial state on error
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
  }, [zoneId, sceneId]); // Remove initialState from deps to prevent re-runs
  
  // 🔧 FIX: Auto-save with better error handling and debouncing
  /*

  useEffect(() => {
    // Don't save if still loading or no state yet
    if (isLoading || !sceneState || !hasInitialized.current) return;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    
    // Debounced save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        console.log(`💾 Auto-saving state for ${sceneId}:`, sceneState);
        GameStateManager.saveGameState(zoneId, sceneId, sceneState);
      } catch (error) {
        console.error('Error saving state:', error);
      }
    }, 500);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sceneState, zoneId, sceneId, isLoading]);
  */
  // 🔧 FIX: Safe state update function that prevents render loops
  const updateState = (updates) => {
    // Use functional update to ensure we have latest state
    setSceneState(currentState => {
      if (!currentState) {
        console.warn('Trying to update null state, skipping');
        return currentState;
      }
      
      const newState = { ...currentState, ...updates };
      
      // Immediate save for critical updates (like completion)
      if (updates.completed || updates.phase === 'complete') {
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          try {
            console.log(`🎯 Immediate save for completion: ${sceneId}`, newState);
            GameStateManager.saveGameState(zoneId, sceneId, newState);
          } catch (error) {
            console.error('Error in immediate save:', error);
          }
        }, 0);
      }
      
      return newState;
    });
  };
  
  // Scene action handlers with better error handling
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
    
   /*completeScene: (stars = 0, data = {}) => {
  const completionData = {
    completed: true,
    stars,
    completedAt: Date.now(),
    phase: 'complete',
    ...data
  };
  
  updateState(completionData);
  
  // Also update GameWelcomeScreen progress immediately
  setTimeout(() => {
    try {
      const currentProfile = GameStateManager.getCurrentProfile();
      if (currentProfile) {
        console.log(`🏆 Scene completed: ${zoneId}/${sceneId} with ${stars} stars`);
        
        // Save to GameStateManager (existing)
        GameStateManager.saveGameState(zoneId, sceneId, {
          ...sceneState,
          ...completionData
        });

        // 🎯 NEW: Also save to ProgressManager for consistency
        try {
          ProgressManager.updateSceneCompletion(
            currentProfile.id,
            zoneId,
            sceneId,
            {
              completed: true,
              stars: stars,
              symbols: data.symbols || {}
            }
          );
          console.log('✅ Scene completion saved to ProgressManager');
        } catch (pmError) {
          console.error('❌ Error saving to ProgressManager:', pmError);
        }
      }
    } catch (error) {
      console.error('Error in completeScene:', error);
    }
  }, 100);*/
  completeScene: (stars = 0, data = {}) => {
  console.log('🏆 COMPLETE SCENE CALLED:', { zoneId, sceneId, stars, data });
  
  const completionData = {
    completed: true,
    stars,
    completedAt: Date.now(),
    phase: 'complete',
    ...data
  };
  
  console.log('🏆 Completion data prepared:', completionData);
  
  // Update state immediately
  updateState(completionData);
  
  // Save to GameStateManager immediately
  setTimeout(() => {
    try {
      const currentProfile = GameStateManager.getCurrentProfile();
      if (!currentProfile) {
        console.error('❌ No active profile found');
        return;
      }
      
      console.log('💾 Saving to GameStateManager with profile:', currentProfile.id);
      
      // Get the current state and merge with completion data
      setSceneState(currentState => {
        const finalState = {
          ...currentState,
          ...completionData
        };
        
        console.log('💾 Final state to save:', finalState);
        
        // Save to GameStateManager
        GameStateManager.saveGameState(zoneId, sceneId, finalState);
        
        // Verify the save worked
        setTimeout(() => {
          const zoneSummary = GameStateManager.getZoneSummary(zoneId);
          console.log('✅ Zone summary after save:', zoneSummary);
          
          const sceneState = GameStateManager.getSceneState(zoneId, sceneId);
          console.log('✅ Scene state after save:', sceneState);
        }, 100);
        
        return finalState;
      });
      
    } catch (error) {
      console.error('❌ Error in completeScene:', error);
    }
  }, 0);
}
  };
  
  // Show loading state until initialized
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
  
  // 🔧 FIX: Only render children when state is fully ready
  return children({
    sceneState,
    sceneActions,
    isReload
  });
};

export default SceneManager;