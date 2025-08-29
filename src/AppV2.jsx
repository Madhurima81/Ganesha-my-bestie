// Simple App.jsx - Elephant Grove Scene Test
import React, { useState, useEffect } from 'react';
import './App.css';

// Import Elephant Grove Scene
//import ElephantGroveScene from './zones/shloka-river/scenes/Scene1/ElephantGroveScene.jsx';
import VakratundaGroveV2 from './zones/shloka-river/scenes/Scene1/VakratundaGroveV2.jsx';


// Import GameCoach Provider
import { GameCoachProvider } from './lib/components/coach/GameCoach.jsx';

// Mock GameStateManager for testing
const MockGameStateManager = {
  getActiveProfile: () => ({
    id: 'test-profile',
    name: 'Maya',
    avatar: '🐘',
    color: '#4A90E2'
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
    if (destination === 'next-scene') {
      console.log('🦋 Would navigate to Firefly Garden scene');
    }
  };

  // Simple completion handler
  const handleComplete = (sceneId, data) => {
    console.log('🎉 Elephant Grove Complete:', { sceneId, data });
  };

  // Simple reload function
  const reloadScene = () => {
    console.log('🔄 Reloading Elephant Grove');
    
    // Clear all localStorage
    localStorage.clear();
    
    // Reset profile
    localStorage.setItem('activeProfileId', 'test-profile');
    
    // Force component remount
    setReloadKey(prev => prev + 1);
  };

  // Test state manipulation
  const testVakratundaComplete = () => {
    console.log('🐘 Testing Vakratunda Complete - Jump to Mahakaya');
    
    // Simulate Scene 1A completion
    const testState = {
      phase: 'scene_1b',
      scene1aComplete: true,
      activatedElephants: ['va', 'kra', 'tun', 'da'],
      playedSyllables: ['Va', 'Kra', 'Tun', 'Da'],
      progress: { percentage: 50, starsEarned: 4, completed: false }
    };
    
    localStorage.setItem('temp_session_test-profile_shloka-river_elephant-grove', JSON.stringify(testState));
    setReloadKey(prev => prev + 1);
  };

  const testFullCompletion = () => {
    console.log('🎊 Testing Full Scene Completion');
    
    // Simulate full completion
    const testState = {
      phase: 'complete',
      scene1aComplete: true,
      scene1bComplete: true,
      activatedElephants: ['va', 'kra', 'tun', 'da', 'ma', 'ha', 'ka', 'ya'],
      playedSyllables: ['Va', 'Kra', 'Tun', 'Da', 'Ma', 'Ha', 'Ka', 'Ya'],
      recordings: ['mock-recording-1.wav', 'mock-recording-2.wav'],
      completed: true,
      stars: 8,
      progress: { percentage: 100, starsEarned: 8, completed: true },
      currentPopup: 'final_fireworks'
    };
    
    localStorage.setItem('temp_session_test-profile_shloka-river_elephant-grove', JSON.stringify(testState));
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="App">
      {/* Simple Reload Button 
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
        🔄 Reload Elephant Grove
      </button>

      {/* Test State Buttons 
      <div style={{
        position: 'fixed',
        top: '60px',
        left: '10px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button 
          onClick={testVakratundaComplete}
          style={{
            padding: '6px 12px',
            background: '#4ECDC4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🐘 Test Scene 1B
        </button>
        
        <button 
          onClick={testFullCompletion}
          style={{
            padding: '6px 12px',
            background: '#9B59B6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🎊 Test Complete
        </button>
      </div>

      {/* Audio Test Info 
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 100
      }}>
        🎵 Audio: Web Speech API<br/>
        🎤 Recording: Browser microphone<br/>
        💧 Animations: CSS keyframes
      </div>

      {/* Elephant Grove Scene */}
      <GameCoachProvider>
        <VakratundaGroveV2
          key={reloadKey}
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="shloka-river"
          sceneId="vakratunda-grove"
        />
      </GameCoachProvider>
    </div>
  );
}

export default App;