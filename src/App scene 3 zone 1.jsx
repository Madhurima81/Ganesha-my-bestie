// Simple App.jsx for testing SymbolMountainScene
// Replace your main App.jsx temporarily with this

import React from 'react';
import './App.css'; // Keep your existing App.css if you have one

// Import the Symbol Mountain Scene
import SymbolMountainSceneV2 from './zones/symbol-mountain/scenes/tusk/SymbolMountainSceneV2.jsx';

// ✅ ADD THIS IMPORT
import { GameCoachProvider } from './lib/components/coach/GameCoach.jsx';

function App() {
  
  // Mock completion handler
  const handleComplete = (completionData) => {
    console.log('🎉 SCENE COMPLETED:', completionData);
    alert(`🎉 Scene Complete!\nStars: ${completionData?.stars || 0}\nSymbols: ${Object.keys(completionData?.symbols || {}).length}`);
  };

  // Mock navigation handler  
  const handleNavigate = (destination) => {
    console.log('🧭 NAVIGATION:', destination);
    
    const messages = {
      'home': '🏠 Going to Home Screen',
      'zones': '🗺️ Going to Zone Selection', 
      'scene-complete-continue': '➡️ Going to Next Scene',
      'default': `🚀 Navigation to: ${destination}`
    };
    
    alert(messages[destination] || messages.default);
  };

  return (
    <div className="App">
      {/* Debug Header - Remove in production */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '5px 10px',
        fontSize: '14px',
        zIndex: 10000,
        textAlign: 'center',
        fontFamily: 'monospace'
      }}>
        🧪 <strong>TEST MODE</strong> | Symbol Mountain Scene | Press F12 for Console | 
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginLeft: '10px',
            padding: '2px 8px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          🔄 Reload
        </button>
      </div>

      {/* ✅ WRAP WITH GameCoachProvider */}
      <GameCoachProvider>
        {/* The Symbol Mountain Scene */}
        <SymbolMountainSceneV2
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