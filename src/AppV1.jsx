// Simple App.jsx - Scene 4 Only Test
import React, { useState, useEffect } from 'react';
import './App.css';

// Import Scene 4 (Sarvakaryeshu Sarvada)
import SarvakaryeshuSarvadaV5 from './zones/meaning cave/scenes/sarvakaryeshu-sarvada/SarvakaryeshuSarvadaV5.jsx';

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
    console.log('🔄 Reloading Scene 4');
    
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
        🔄 Reload Scene 4
      </button>

      {/* Scene 4 Test Buttons 
      <div style={{
        position: 'fixed',
        top: '60px',
        left: '10px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button 
          onClick={() => console.log('🎯 Testing Door Phase')}
          style={{
            padding: '8px 16px',
            background: '#4ECDC4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚪 Test Door
        </button>
        
        <button 
          onClick={() => console.log('👦👧 Testing Character Selection')}
          style={{
            padding: '8px 16px',
            background: '#9B59B6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          👦👧 Test Characters
        </button>
        
        <button 
          onClick={() => console.log('🎮 Testing Game 1')}
          style={{
            padding: '8px 16px',
            background: '#E67E22',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🎮 Test Game 1
        </button>
      </div>*/}

      {/* Scene 4 Only */}
      <GameCoachProvider>
        <SarvakaryeshuSarvadaV5
          key={reloadKey}
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="meaning-cave"
          sceneId="sarvakaryeshu-sarvada"
        />
      </GameCoachProvider>
    </div>
  );
}

export default App;