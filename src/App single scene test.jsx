// Simple App.jsx - Scene 3 Only Test
import React, { useState, useEffect } from 'react';
import './App.css';

// Import Scene 3 (Musical Mountain)
//import SymbolMountainSceneV2 from './zones/symbol-mountain/scenes/tusk/SymbolMountainSceneV2.jsx';
import NewModakSceneV2 from './zones/symbol-mountain/scenes/modak/NewModakSceneV2.jsx';
//import PondSceneSimplified from './zones/symbol-mountain/scenes/pond/PondSceneSimplified.jsx';
//import EyeEarTuskScene from './zones/symbol-mountain/scenes/eye-ear-tusk/EyeEarTuskScene.jsx';
//import SacredAssemblyScene from './zones/symbol-mountain/scenes/final scene/SacredAssemblyScene.jsx';





// Import GameCoach Provider
import { GameCoachProvider } from './lib/components/coach/GameCoach.jsx';

// Mock GameStateManager for testing
const MockGameStateManager = {
  getActiveProfile: () => ({
    id: 'test-profile',
    name: 'Alex',
    avatar: '👧',
    color: '#FF6B9D'
  }),
  
  saveGameState: (zoneId, sceneId, data) => {
    console.log('🎮 Mock Save:', { zoneId, sceneId, data });
    localStorage.setItem(`game_${zoneId}_${sceneId}`, JSON.stringify(data));
  },
  
  loadGameState: (zoneId, sceneId) => {
    const saved = localStorage.getItem(`game_${zoneId}_${sceneId}`);
    return saved ? JSON.parse(saved) : null;
  }
};

// Add mocks to window
window.MockGameStateManager = MockGameStateManager;

function App() {
  const [reloadKey, setReloadKey] = useState(0);

  // Set up test profile
  useEffect(() => {
    localStorage.setItem('activeProfileId', 'test-profile');
  }, []);

  // Simple navigation handler
  const handleNavigate = (destination) => {
    console.log('🧭 Navigation:', destination);
  };

  // Simple completion handler
  const handleComplete = (sceneId, data) => {
    console.log('🎉 Scene Complete:', { sceneId, data });
  };

  // Simple reload function
  const reloadScene = () => {
    console.log('🔄 Reloading Scene 3');
    
    // Clear all localStorage
    localStorage.clear();
    
    // Reset profile
    localStorage.setItem('activeProfileId', 'test-profile');
    
    // Force component remount
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="App">
      {/* Simple Reload Button */}
      <button 
        onClick={reloadScene}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          padding: '8px 16px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🔄 Reload Scene 3
      </button>

      {/* Scene 3 Only */}
      <GameCoachProvider>
        <NewModakSceneV2
          key={reloadKey}
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="symbol-mountain"
          sceneId="symbol"
        />
      </GameCoachProvider>
    </div>
  );
}

export default App;