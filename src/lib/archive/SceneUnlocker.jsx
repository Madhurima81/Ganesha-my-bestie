// SceneUnlocker.jsx - Handles scene progression
export const SceneUnlocker = ({ currentScene, nextScene, requiredStars }) => {
  const checkUnlock = () => {
    const progress = GameStateManager.getSceneProgress(currentScene);
    if (progress.stars >= requiredStars) {
      GameStateManager.unlockScene(nextScene);
      return true;
    }
    return false;
  };
  
  return { checkUnlock };
};