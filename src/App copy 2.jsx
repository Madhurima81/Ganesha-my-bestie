// App.jsx - Updated with Centralized Unlock System

import React, { useState, useEffect } from 'react';
import './App.css';
import PondScene from './zones/symbol-mountain/scenes/pond/PondSceneSimplified';
import ModakScene from './zones/symbol-mountain/scenes/modak/NewModakScene';
import MainWelcomeScreen from './lib/components/navigation/MainWelcomeScreen';
import CleanGameWelcomeScreen from './lib/components/navigation/CleanGameWelcomeScreen';
import CleanMapZone from './pages/CleanMapZone';
import ZoneWelcome from './lib/components/zone/ZoneWelcome with unlock';
import { getZoneConfig } from './lib/components/zone/ZoneConfig';
import GameStateManager from './lib/services/GameStateManager';
import { GameCoachProvider } from './lib/components/coach/GameCoach';
import { useZoneUnlocks } from './lib/hooks/useZoneUnlocks';

const GameStateManagerClass = GameStateManager.constructor;

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [currentZone, setCurrentZone] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // ✅ NEW: Get active profile ID for unlock system
  const [activeProfileId, setActiveProfileId] = useState(null);
  
  // ✅ NEW: Use the unlock system
  const {
    isSceneUnlocked,
    refreshUnlocks,
    getNextScene,
    debugUnlocks,
    getSceneStatus
  } = useZoneUnlocks(activeProfileId);
  
  console.log('🌟 Clean App rendering - current view:', currentView);
  console.log('🎯 Current zone:', currentZone, 'Current scene:', currentScene);
  
  // ✅ NEW: Load active profile on app start
  useEffect(() => {
    const savedProfileId = localStorage.getItem('activeProfileId');
    if (savedProfileId) {
      setActiveProfileId(savedProfileId);
    }
  }, []);
  
  // Initialize app and check for profiles/saves
  useEffect(() => {
    console.log('🌟 Clean App mounting, initializing...');
    initializeApp();
    
    // Cleanup function
    return () => {
      console.log('🧹 Clean App cleanup');
      // Clean up any persistent styles when app unmounts
      document.body.style.cssText = '';
      const root = document.getElementById('root');
      if (root) root.style.cssText = '';
    };
  }, []);
  
  const initializeApp = () => {
    try {
      if (!GameStateManager) {
        console.error('GameStateManager is not imported correctly');
        setCurrentView('error');
        return;
      }
      
      console.log('🌟 GameStateManager initialized successfully');
      
      // Always start with main welcome screen
      // Let CleanGameWelcomeScreen handle profile selection internally
      console.log('🌟 Starting with main welcome');
      setCurrentView('main-welcome');
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setCurrentView('error');
    }
  };
  
  // Clean style restoration helper
  const restoreDefaultStyles = () => {
    document.body.style.cssText = '';
    const root = document.getElementById('root');
    if (root) root.style.cssText = '';
  };
  
  // Handle main welcome "New Adventure" click
  const handleStartAdventure = () => {
    console.log('🌟 Start Adventure clicked from main welcome');
    restoreDefaultStyles();
    
    // Always go to CleanGameWelcomeScreen
    // It will handle profile selection internally if needed
    setCurrentView('profile-welcome');
  };
  
  // Handle continuing from last save
  const handleContinue = () => {
    try {
      console.log('🚀 Continuing game - clean handoff');
      restoreDefaultStyles(); // Clean styles before navigation
      
      const lastLocation = GameStateManager.getLastPlayedLocation();
      console.log('🌟 Last location:', lastLocation);
      
      if (lastLocation && lastLocation.zone && lastLocation.scene) {
        setCurrentZone(lastLocation.zone);
        setCurrentScene(lastLocation.scene);
        setCurrentView('scene');
      } else {
        setCurrentView('map');
      }
    } catch (error) {
      console.error('Error continuing game:', error);
      handleNewGame();
    }
  };
  
  // Handle new game - Start with map for zone selection
  const handleNewGame = () => {
    console.log('🚀 Choose scene clicked - clean handoff');
    restoreDefaultStyles(); // Clean styles before navigation
    
    setCurrentZone(null);
    setCurrentScene(null);
    setCurrentView('map');
  };
  
  // Handle zone selection from map
  const handleZoneSelect = (zoneId, sceneId = null) => {
    console.log('🎯 Zone selected:', zoneId, sceneId ? `Scene: ${sceneId}` : 'No scene');
    restoreDefaultStyles();
    
    setCurrentZone(zoneId);
    
    if (sceneId) {
      // ✅ IMPROVED: Check if scene is unlocked before allowing access
      if (isSceneUnlocked(zoneId, sceneId)) {
        console.log('🎯 Going directly to scene:', sceneId);
        setCurrentScene(sceneId);
        setCurrentView('scene');
        
        // Save current location
        GameStateManager.saveGameState(zoneId, sceneId, {
          currentZone: zoneId,
          currentScene: sceneId,
          enteredAt: Date.now()
        });
      } else {
        console.log('🔒 Scene is locked:', sceneId);
        alert('Complete previous scenes first!');
        setCurrentView('zone-welcome');
      }
    } else {
      // Zone selected - go to zone welcome page
      console.log('🎯 Going to zone welcome page for:', zoneId);
      setCurrentView('zone-welcome');
    }
  };
  
  // Handle scene selection from zone welcome page
  const handleSceneSelect = (sceneId) => {
    console.log('🎯 Scene selected from zone welcome:', sceneId);
    restoreDefaultStyles();
    
    // ✅ IMPROVED: Check if scene is unlocked
    if (isSceneUnlocked(currentZone, sceneId)) {
      setCurrentScene(sceneId);
      setCurrentView('scene');
      
      // Save current location
      GameStateManager.saveGameState(currentZone, sceneId, {
        currentZone: currentZone,
        currentScene: sceneId,
        enteredAt: Date.now()
      });
    } else {
      console.log('🔒 Scene is locked:', sceneId);
      alert('Complete previous scenes first!');
    }
  };
  
  // ✅ UPDATED: Handle navigation with unlock checking
  const handleNavigate = (destination) => {
    console.log('🎯 Navigate to:', destination);
    restoreDefaultStyles(); // Always restore styles when navigating
    
    // Save current location before navigating away
    if (currentZone && currentScene) {
      GameStateManager.saveGameState(currentZone, currentScene, {
        currentZone: currentZone,
        currentScene: currentScene,
        lastNavigated: Date.now()
      });
    }
    
    switch (destination) {
      case 'home':
        setCurrentZone(null);
        setCurrentScene(null);
        setCurrentView('main-welcome');
        break;
      case 'zones':
      case 'map':
        setCurrentZone(null);
        setCurrentScene(null);
        setCurrentView('map');
        break;
      case 'zone-welcome':
        // Go back to current zone's welcome page
        setCurrentScene(null);
        setCurrentView('zone-welcome');
        break;
      case 'profile':
        setCurrentView('profile-welcome');
        break;
        
      // ✅ NEW: Scene navigation with unlock checking
      case 'pond-scene':
        if (isSceneUnlocked('symbol-mountain', 'pond')) {
          setCurrentZone('symbol-mountain');
          setCurrentScene('pond');
          setCurrentView('scene');
        } else {
          console.log('🔒 Pond scene is locked');
          alert('Complete previous scenes first!');
        }
        break;
        
      case 'modak-scene':
        if (isSceneUnlocked('symbol-mountain', 'modak')) {
          setCurrentZone('symbol-mountain');
          setCurrentScene('modak');
          setCurrentView('scene');
        } else {
          console.log('🔒 Modak scene is locked');
          alert('Complete previous scenes first!');
        }
        break;
        
      case 'temple-scene':
        if (isSceneUnlocked('symbol-mountain', 'temple')) {
          setCurrentZone('symbol-mountain');
          setCurrentScene('temple');
          setCurrentView('scene');
        } else {
          console.log('🔒 Temple scene is locked');
          alert('Complete the Modak scene first!');
        }
        break;
        
      case 'garden-scene':
        if (isSceneUnlocked('symbol-mountain', 'garden')) {
          setCurrentZone('symbol-mountain');
          setCurrentScene('garden');
          setCurrentView('scene');
        } else {
          console.log('🔒 Garden scene is locked');
          alert('Complete the Temple scene first!');
        }
        break;
        
      case 'next-scene':
        // ✅ IMPROVED: Use unlock system to find next scene
        const nextScene = getNextScene();
        if (nextScene) {
          console.log('🎮 Continue adventure to:', nextScene);
          setCurrentZone(nextScene.zoneId);
          setCurrentScene(nextScene.sceneId);
          setCurrentView('scene');
        } else {
          setCurrentView('zone-welcome');
        }
        break;
        
      default:
        console.log('Unknown navigation:', destination);
        setCurrentView('map');
    }
  };
  
  // ✅ UPDATED: Centralized scene completion handler
  const handleSceneComplete = (sceneId, result) => {
    console.log(`🎯 Scene ${sceneId} completed:`, result);
    restoreDefaultStyles(); // Restore styles after completion
    
    if (!activeProfileId) {
      console.error('❌ No active profile for scene completion');
      return;
    }

    try {
      // Save to GameStateManager (keep existing logic)
      GameStateManager.saveGameState(currentZone, sceneId, {
        completed: true,
        stars: result.stars,
        completedAt: Date.now()
      });

      // Update zone progress (bulletproof version)
      const progressKey = `${activeProfileId}_gameProgress`;
      const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
      
      // Initialize structure if needed
      if (!progressData.zones) progressData.zones = {};
      if (!progressData.zones[currentZone]) {
        progressData.zones[currentZone] = { scenes: {} };
      }
      
      // Save scene completion
      progressData.zones[currentZone].scenes[sceneId] = {
        completed: true,
        stars: result.stars || 0,
        symbols: result.symbols || {},
        lastPlayed: Date.now(),
        totalStars: result.totalStars || result.stars || 0
      };
      
      // Recalculate totals
      let totalStars = 0;
      let completedScenes = 0;
      
      Object.values(progressData.zones).forEach(zone => {
        if (zone.scenes) {
          Object.values(zone.scenes).forEach(scene => {
            totalStars += scene.stars || 0;
            if (scene.completed) completedScenes++;
          });
        }
      });
      
      progressData.totalStars = totalStars;
      progressData.completedScenes = completedScenes;
      progressData.lastPlayed = Date.now();
      
      // Save updated progress
      localStorage.setItem(progressKey, JSON.stringify(progressData));
      
      // Update profile stats
      const gameProfiles = JSON.parse(localStorage.getItem('gameProfiles') || '{"profiles":{}}');
      if (gameProfiles.profiles && gameProfiles.profiles[activeProfileId]) {
        gameProfiles.profiles[activeProfileId].totalStars = totalStars;
        gameProfiles.profiles[activeProfileId].completedScenes = completedScenes;
        gameProfiles.profiles[activeProfileId].lastPlayed = Date.now();
        localStorage.setItem('gameProfiles', JSON.stringify(gameProfiles));
      }
      
      console.log('✅ Scene completion saved successfully');
      
      // ✅ NEW: Refresh unlock calculations
      setTimeout(() => {
        refreshUnlocks();
      }, 100);
      
    } catch (error) {
      console.error('❌ Error saving scene completion:', error);
    }
    
    // Navigate based on completion (keep existing logic)
    if (currentZone === 'symbol-mountain') {
      if (sceneId === 'modak') {
        setCurrentScene(null);
        setCurrentView('zone-welcome');
      } else if (sceneId === 'pond') {
        setCurrentScene(null);
        setCurrentView('zone-welcome');
      } else {
        setCurrentView('zone-welcome');
      }
    } else {
      setCurrentScene(null);
      setCurrentView('zone-welcome');
    }
  };
  
  // Handle profile changes
  const handleProfileChange = () => {
    const activeProfile = GameStateManager.getCurrentProfile();
    setCurrentProfile(activeProfile);
    // ✅ NEW: Update activeProfileId when profile changes
    const newProfileId = localStorage.getItem('activeProfileId');
    setActiveProfileId(newProfileId);
    initializeApp();
  };
  
  // Apply scene-specific styles only when rendering scenes
  const applySceneStyles = () => {
    document.body.className = '';
    document.body.style.cssText = 'margin: 0; padding: 0; overflow: hidden; width: 100vw; height: 100vh;';
    
    const root = document.getElementById('root');
    if (root) {
      root.className = '';
      root.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; margin: 0; padding: 0;';
    }
  };
  
  // Get zone data for current zone
  const getCurrentZoneData = () => {
    if (!currentZone) return null;
    return getZoneConfig(currentZone);
  };
  
  // Render different views - wrapped with GameCoachProvider
  return (
    <GameCoachProvider defaultConfig={{
      name: 'Ganesha',
      image: 'images/ganesha-character.png',
      position: 'top-right'
    }}>
      {currentView === 'loading' && (
        <div className="loading-screen">
          <div className="loading-spinner">🌟 Loading magical adventure...</div>
        </div>
      )}
      
      {currentView === 'error' && (
        <div className="error-screen">
          <h1>Initialization Error</h1>
          <p>Failed to load game resources. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )}
      
      {currentView === 'main-welcome' && (
        <MainWelcomeScreen
          onStartAdventure={handleStartAdventure}
        />
      )}
      
      {currentView === 'profile-welcome' && (
        <CleanGameWelcomeScreen
          onContinue={handleContinue}
          onNewGame={handleNewGame}
        />
      )}
      
      {currentView === 'map' && (
        <CleanMapZone 
          onZoneSelect={handleZoneSelect}
          currentZone={currentZone}
          highlightedScene={currentScene}
        />
      )}
      
      {currentView === 'zone-welcome' && currentZone && (
        <ZoneWelcome 
          zoneData={getCurrentZoneData()}
          onSceneSelect={handleSceneSelect}
          onBackToMap={() => setCurrentView('map')}
          onNavigate={handleNavigate}
        />
      )}
      
      {currentView === 'scene' && (() => {
        console.log('🎯 Rendering scene view');
        console.log('🎯 Zone:', currentZone, 'Scene:', currentScene);
        
        // Apply scene-specific styles
        applySceneStyles();
        
        // Render appropriate scene based on zone and scene
        if (currentZone === 'symbol-mountain') {
          if (currentScene === 'modak') {
            console.log('🎯 Rendering ModakScene');
            return (
              <ModakScene 
                onNavigate={handleNavigate}
                onComplete={handleSceneComplete}
                onSceneSelect={handleSceneSelect}
                zoneId={currentZone}
                sceneId={currentScene}
              />
            );
          } else if (currentScene === 'pond') {
            console.log('🎯 Rendering PondScene');
            return (
              <PondScene 
                onNavigate={handleNavigate}
                onComplete={handleSceneComplete}
                onSceneSelect={handleSceneSelect}
                zoneId={currentZone}
                sceneId={currentScene}
              />
            );
          } else if (currentScene === 'temple') {
            // Placeholder for temple scene
            return (
              <div className="scene-placeholder">
                <h2>🛕 Ancient Temple</h2>
                <p>This scene is coming soon!</p>
                <button onClick={() => handleNavigate('zone-welcome')}>
                  Back to Symbol Mountain
                </button>
              </div>
            );
          } else if (currentScene === 'garden') {
            // Placeholder for garden scene
            return (
              <div className="scene-placeholder">
                <h2>🌸 Sacred Garden</h2>
                <p>This scene is coming soon!</p>
                <button onClick={() => handleNavigate('zone-welcome')}>
                  Back to Symbol Mountain
                </button>
              </div>
            );
          }
        }
        
        // Fallback for other zones or unknown scenes
        return (
          <div className="scene-placeholder">
            <h2>Scene: {currentScene} in {currentZone}</h2>
            <p>This scene is not yet available.</p>
            <button onClick={() => handleNavigate('zone-welcome')}>
              Back to Zone Welcome
            </button>
            <button onClick={() => handleNavigate('map')}>
              Back to Map
            </button>
          </div>
        );
      })()}
      
      {/* ✅ NEW: Debug Panel (remove in production) */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}>
        <div>🔧 <strong>DEBUG PANEL</strong></div>
        <div>Current View: {currentView}</div>
        <div>Profile: {activeProfileId || 'None'}</div>
        <div>Zone: {currentZone || 'None'}</div>
        <div>Scene: {currentScene || 'None'}</div>
        <button 
          onClick={debugUnlocks}
          style={{
            background: 'purple',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Debug Unlocks
        </button>
      </div>
      
      {/* Fallback view */}
      {!['loading', 'error', 'main-welcome', 'profile-welcome', 'map', 'zone-welcome', 'scene'].includes(currentView) && (
        <div className="unknown-view-error">
          <h2>Error: Unknown view state</h2>
          <p>Current view: {currentView}</p>
          <button onClick={() => setCurrentView('map')}>Go to Map</button>
        </div>
      )}
    </GameCoachProvider>
  );
}

export default App;