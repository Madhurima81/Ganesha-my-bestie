// AutoSaveRecovery.jsx - Recover from crashes
export const AutoSaveRecovery = ({ children }) => {
  useEffect(() => {
    // Check for incomplete saves
    const checkRecovery = () => {
      const lastSave = localStorage.getItem('last_autosave');
      if (lastSave) {
        const data = JSON.parse(lastSave);
        if (Date.now() - data.timestamp < 60000) { // Less than 1 minute old
          console.log('Recovering from crash...');
          GameStateManager.recoverState(data.state);
        }
      }
    };
    
    checkRecovery();
    
    // Set up periodic autosave
    const interval = setInterval(() => {
      const state = GameStateManager.getCurrentState();
      localStorage.setItem('last_autosave', JSON.stringify({
        state,
        timestamp: Date.now()
      }));
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return children;
};