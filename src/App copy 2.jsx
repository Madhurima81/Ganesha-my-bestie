// Combined App.jsx - Test Both Sacred Assembly Scene (Final) and Symbol Mountain Scene (Scene 3)
import React, { useState, useEffect } from 'react';
import './App.css';

// Import both scenes
import SacredAssemblyScene from './zones/symbol-mountain/scenes/final scene/SacredAssemblyScene';
import SymbolMountainSceneV2 from './zones/symbol-mountain/scenes/tusk/SymbolMountainSceneV2.jsx';

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

// Add mocks to window for the scenes to use
window.MockGameStateManager = MockGameStateManager;
window.MockProgressManager = MockProgressManager; 
window.MockSimpleSceneManager = MockSimpleSceneManager;

function App() {
  const [currentScene, setCurrentScene] = useState('assembly'); // 'assembly' or 'mountain'
  const [currentView, setCurrentView] = useState('scene');
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

  // Scene reload handlers
  const reloadScene3 = () => {
    console.log('🔄 Reloading Scene 3 (Musical Tusk)');
    // Clear only Scene 3 data
    localStorage.removeItem('game_symbol-mountain_symbol');
    setCurrentScene('mountain');
    setCurrentView('scene');
    setCompletionData(null);
    // Force component remount
    window.location.reload();
  };

  const reloadFinalScene = () => {
    console.log('🔄 Reloading Final Scene (Sacred Assembly)');
    // Clear only Final Scene data
    localStorage.removeItem('game_symbol-mountain_final-scene');
    setCurrentScene('assembly');
    setCurrentView('scene');
    setCompletionData(null);
    // Force component remount
    window.location.reload();
  };

  const clearAllAndReload = () => {
    console.log('🗑️ Clearing all data and reloading');
    localStorage.clear();
    window.location.reload();
  };

  // Scene selector component - With individual reload buttons
  const SceneSelector = () => (
    <div className="scene-selector" style={{
      position: 'fixed',
      top: '5px',
      left: '10px',
      zIndex: 9999,
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
      maxWidth: '300px'
    }}>
      {/* Scene 3 Buttons */}
      <div style={{ display: 'flex', gap: '2px' }}>
        <button
          onClick={() => {
            setCurrentScene('mountain');
            setCurrentView('scene');
            setCompletionData(null);
          }}
          style={{
            padding: '6px 10px',
            background: currentScene === 'mountain' ? '#4CAF50' : 'rgba(255,255,255,0.9)',
            color: currentScene === 'mountain' ? 'white' : '#333',
            border: '1px solid #ccc',
            borderRadius: '12px 0 0 12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          🏔️ Scene 3
        </button>
        <button
          onClick={reloadScene3}
          style={{
            padding: '6px 8px',
            background: '#ff9800',
            color: 'white',
            border: '1px solid #ff9800',
            borderRadius: '0 12px 12px 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          title="Reload Scene 3"
        >
          🔄
        </button>
      </div>
      
      {/* Final Scene Buttons */}
      <div style={{ display: 'flex', gap: '2px' }}>
        <button
          onClick={() => {
            setCurrentScene('assembly');
            setCurrentView('scene');
            setCompletionData(null);
          }}
          style={{
            padding: '6px 10px',
            background: currentScene === 'assembly' ? '#4CAF50' : 'rgba(255,255,255,0.9)',
            color: currentScene === 'assembly' ? 'white' : '#333',
            border: '1px solid #ccc',
            borderRadius: '12px 0 0 12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          🕉️ Final
        </button>
        <button
          onClick={reloadFinalScene}
          style={{
            padding: '6px 8px',
            background: '#ff9800',
            color: 'white',
            border: '1px solid #ff9800',
            borderRadius: '0 12px 12px 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          title="Reload Final Scene"
        >
          🔄
        </button>
      </div>
      
      {/* Clear All Button */}
      <button
        onClick={clearAllAndReload}
        style={{
          padding: '6px 10px',
          background: 'rgba(244,67,54,0.9)',
          color: 'white',
          border: '1px solid #f44336',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
        title="Clear All Data & Reload"
      >
        🗑️ All
      </button>
    </div>
  );

  // Render current scene
  const renderCurrentScene = () => {
    if (currentView !== 'scene') return null;
    
    if (currentScene === 'assembly') {
      return (
        <SacredAssemblyScene
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="symbol-mountain"
          sceneId="final-scene"
        />
      );
    } else {
      return (
        <SymbolMountainSceneV2
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="symbol-mountain"
          sceneId="symbol"
        />
      );
    }
  };

  // Render different views for testing
  const renderCurrentView = () => {
    switch(currentView) {
      case 'scene':
        return renderCurrentScene();
        
      case 'completed':
        return (
          <div className="test-view" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '2.5em', marginBottom: '20px' }}>🎉 Scene Completed!</h2>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              maxWidth: '500px'
            }}>
              <p style={{ fontSize: '1.2em', marginBottom: '15px' }}>
                <strong>{currentScene === 'assembly' ? '🕉️ Sacred Assembly' : '🏔️ Musical Tusk'}</strong> scene completed!
              </p>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(completionData, null, 2)}
              </pre>
            </div>
            <button 
              onClick={() => setCurrentView('scene')}
              style={{
                padding: '12px 24px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔄 Play Again
            </button>
          </div>
        );
        
      case 'zone-complete':
        return (
          <div className="test-view" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '3em' }}>🏆 Zone Completed!</h2>
            <p style={{ fontSize: '1.5em', marginBottom: '30px' }}>
              Congratulations! You've completed the Symbol Mountain zone!
            </p>
            <button 
              onClick={() => setCurrentView('scene')}
              style={{
                padding: '12px 24px',
                background: '#fff',
                color: '#f5576c',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔄 Play Scene Again
            </button>
          </div>
        );
        
      case 'home':
        return (
          <div className="test-view" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2.5em' }}>🏠 Home Screen</h2>
            <button 
              onClick={() => setCurrentView('scene')}
              style={{
                padding: '12px 24px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ▶️ Back to Scene
            </button>
          </div>
        );
        
      case 'zones':
        return (
          <div className="test-view" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2.5em' }}>🗺️ Zones Screen</h2>
            <button 
              onClick={() => setCurrentView('scene')}
              style={{
                padding: '12px 24px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ▶️ Back to Scene
            </button>
          </div>
        );
        
      case 'next-adventure':
        return (
          <div className="test-view" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: '#333'
          }}>
            <h2 style={{ fontSize: '2.5em' }}>🚀 Next Adventure</h2>
            <p style={{ fontSize: '1.3em', marginBottom: '30px' }}>Ready for the next zone!</p>
            <button 
              onClick={() => setCurrentView('scene')}
              style={{
                padding: '12px 24px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔄 Play Scene Again
            </button>
          </div>
        );
        
      default:
        return (
          <div className="test-view">
            <h2>❓ Unknown View</h2>
            <button onClick={() => setCurrentView('scene')}>
              🏠 Back to Scene
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {/* Scene Selector - Always visible */}
      <SceneSelector />

      {/* Main Content */}
      <div className="main-content">
        <GameCoachProvider>
          {renderCurrentView()}
        </GameCoachProvider>
      </div>

      {/* Debug Console Info - Minimal */}
      {currentView === 'scene' && (
        <div style={{
          position: 'fixed',
          bottom: '5px',
          right: '5px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          zIndex: 9998
        }}>
          {currentScene === 'assembly' ? '🕉️ Final' : '🏔️ Scene 3'}
        </div>
      )}
    </div>
  );
}

export default App;