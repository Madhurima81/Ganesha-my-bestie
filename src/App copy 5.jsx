// Simple App.jsx - Cave Scene 1 Test
import React, { useState, useEffect } from 'react';
import './App.css';

// Import Cave Scene 1 (VakratundaMahakaya)
import VakratundaMahakayaV2 from './zones/meaning cave/scenes/VakratundaMahakaya/VakratundaMahakayaV2.jsx';

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
    console.log('🔄 Reloading Cave Scene 1');
    
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
        🔄 Reload Cave Scene 1
      </button>

      {/* Cave Scene 1 Only */}
      <GameCoachProvider>
        <VakratundaMahakayaV2
          key={reloadKey}
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="cave-of-secrets"
          sceneId="vakratunda-mahakaya"
        />
      </GameCoachProvider>
    </div>
  );
}

export default App;