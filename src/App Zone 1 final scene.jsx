// App.jsx - Simple Test App for Sacred Assembly Scene
import React, { useState, useEffect } from 'react';
import './App.css';

// Import the Sacred Assembly Scene
import SacredAssemblyScene from './zones/symbol-mountain/scenes/final scene/SacredAssemblyScene';

// Import GameCoach Provider
import { GameCoachProvider } from './lib/components/coach/GameCoach';

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

// Mock ProgressManager for testing
const MockProgressManager = {
  updateSceneCompletion: (profileId, zoneId, sceneId, data) => {
    console.log('📊 Mock Progress Update:', { profileId, zoneId, sceneId, data });
  },
  
  updateZoneCompletion: (profileId, zoneId, data) => {
    console.log('🏆 Mock Zone Completion:', { profileId, zoneId, data });
  }
};

// Mock SimpleSceneManager for testing
const MockSimpleSceneManager = {
  setCurrentScene: (zoneId, sceneId, completed, isReplay) => {
    console.log('🎯 Mock Scene Set:', { zoneId, sceneId, completed, isReplay });
  },
  
  clearCurrentScene: () => {
    console.log('🧹 Mock Scene Clear');
  }
};

// Add mocks to window for the scene to use
window.MockGameStateManager = MockGameStateManager;
window.MockProgressManager = MockProgressManager; 
window.MockSimpleSceneManager = MockSimpleSceneManager;

function App() {
  const [currentView, setCurrentView] = useState('assembly');
  const [completionData, setCompletionData] = useState(null);

  // Set up active profile for testing
  useEffect(() => {
    localStorage.setItem('activeProfileId', 'test-profile');
    console.log('🎭 Test profile set up');
  }, []);

  // Mock navigation handler
  const handleNavigate = (destination) => {
    console.log('🧭 Navigation called:', destination);
    
    switch(destination) {
      case 'home':
        setCurrentView('home');
        break;
      case 'zones':
        setCurrentView('zones');
        break;
      case 'zone-complete':
        setCurrentView('zone-complete');
        break;
      case 'scene-complete-continue':
        setCurrentView('next-adventure');
        break;
      default:
        console.log('Unknown navigation:', destination);
    }
  };

  // Mock completion handler
  const handleComplete = (sceneId, data) => {
    console.log('🎉 Scene completion called:', { sceneId, data });
    setCompletionData(data);
    setCurrentView('completed');
  };

  // Render different views for testing
  const renderCurrentView = () => {
    switch(currentView) {
      case 'assembly':
        return (
          <GameCoachProvider>
            <SacredAssemblyScene
              onComplete={handleComplete}
              onNavigate={handleNavigate}
              zoneId="symbol-mountain"
              sceneId="final-scene"
            />
          </GameCoachProvider>
        );
        
      case 'completed':
        return (
          <div className="test-view">
            <h2>🎉 Scene Completed!</h2>
            <p>Completion data:</p>
            <pre>{JSON.stringify(completionData, null, 2)}</pre>
            <button onClick={() => setCurrentView('assembly')}>
              🔄 Play Again
            </button>
          </div>
        );
        
      case 'zone-complete':
        return (
          <div className="test-view">
            <h2>🏆 Zone Completed!</h2>
            <p>Congratulations! You've completed the Symbol Mountain zone!</p>
            <button onClick={() => setCurrentView('assembly')}>
              🔄 Play Scene Again
            </button>
          </div>
        );
        
      case 'home':
        return (
          <div className="test-view">
            <h2>🏠 Home Screen</h2>
            <button onClick={() => setCurrentView('assembly')}>
              ▶️ Back to Sacred Assembly
            </button>
          </div>
        );
        
      case 'zones':
        return (
          <div className="test-view">
            <h2>🗺️ Zones Screen</h2>
            <button onClick={() => setCurrentView('assembly')}>
              ▶️ Back to Sacred Assembly
            </button>
          </div>
        );
        
      case 'next-adventure':
        return (
          <div className="test-view">
            <h2>🚀 Next Adventure</h2>
            <p>Ready for the next zone!</p>
            <button onClick={() => setCurrentView('assembly')}>
              🔄 Play Assembly Again
            </button>
          </div>
        );
        
      default:
        return (
          <div className="test-view">
            <h2>❓ Unknown View</h2>
            <button onClick={() => setCurrentView('assembly')}>
              🏠 Back to Assembly
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {/* Debug Info *
      <div className="debug-info">
        <div className="debug-header">
          🧪 Sacred Assembly Test App | Current View: <strong>{currentView}</strong>
        </div>
        
        {currentView !== 'assembly' && (
          <div className="debug-controls">
            <button onClick={() => setCurrentView('assembly')}>
              🎯 Back to Sacred Assembly
            </button>
            <button onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>
              🗑️ Clear Storage & Reload
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderCurrentView()}
      </div>

     {/* Footer Info */}
{/* {currentView === 'assembly' && (
  <div className="test-instructions">
    <h4>🎮 Test Instructions:</h4>
    <ul>
      <li>Drag symbols from around the screen to Ganesha's body parts</li>
      <li>Watch for magnetic snapping when you're close to the right zone</li>
      <li>Each correct placement triggers a blessing message</li>
      <li>Complete all 8 symbols to see the final celebration</li>
      <li>Use the debug buttons to test different scenarios</li>
    </ul>
  </div>
)} */}
    </div>
  );
}

export default App;