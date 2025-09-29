// lib/hooks/useSceneReset.js - CORRECTED VERSION
const useSceneReset = (sceneActions, zoneId, sceneId, resetConfig = {}) => {
  
  const resetScene = () => {
    console.log(`🔄 SCENE RESET: Starting reset for ${zoneId}/${sceneId}`);
    
    // Step 1: Set play again flag
    const profileId = localStorage.getItem('activeProfileId');
    const tempKey = `temp_session_${profileId}_${zoneId}_${sceneId}`;
    localStorage.setItem(tempKey, JSON.stringify({ playAgainRequested: true }));
    
    // Step 2: Build complete reset using config structure
    const completeReset = {
      // Base states from config
      celebrationStars: 0,
      phase: resetConfig.initialPhase || 'initial',
      currentFocus: resetConfig.initialFocus || 'start', 
      discoveredSymbols: resetConfig.keepSymbols || {},
      
      // Common flags
      welcomeShown: false,
      readyForWisdom: false,
      currentPopup: null,
      showingCompletionScreen: false,
      
      // Progress reset
      stars: 0,
      completed: false,
      progress: { percentage: 0, starsEarned: 0, completed: false },
      
      // Merge all scene-specific states from config
      ...(resetConfig.specificResets || {})
    };
    
    sceneActions.updateState(completeReset);
  };

  return { resetScene };
};

export default useSceneReset;