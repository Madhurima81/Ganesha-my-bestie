// App.jsx - Complete Updated with Disney Auto-Unlock System

import React, { useState, useEffect } from 'react';
import './App.css';
import PondScene from './zones/symbol-mountain/scenes/pond/PondSceneSimplified';
import ModakScene from './zones/symbol-mountain/scenes/modak/NewModakScene';
import MainWelcomeScreen from './lib/components/navigation/MainWelcomeScreen';
import CleanGameWelcomeScreen from './lib/components/navigation/CleanGameWelcomeScreen';
import CleanMapZone from './pages/CleanMapZone';
import ZoneWelcome from './lib/components/zone/ZoneWelcome';
import { getZoneConfig } from './lib/components/zone/ZoneConfig';
import GameStateManager from './lib/services/GameStateManager';
import { GameCoachProvider } from './lib/components/coach/GameCoach';

const GameStateManagerClass = GameStateManager.constructor;

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [currentZone, setCurrentZone] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log('🌟 Clean App rendering - current view:', currentView);
  console.log('🎯 Current zone:', currentZone, 'Current scene:', currentScene);
  
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
// Check if there's an active profile on reload
const activeProfileId = localStorage.getItem('activeProfileId');
if (activeProfileId) {
  console.log('🌟 Found active profile, going to profile welcome');
  setCurrentView('profile-welcome');
} else {
  console.log('🌟 No active profile, starting with main welcome');
  setCurrentView('main-welcome');
}      
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
      // Scene selected - go directly to scene
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
      // Zone selected - go to zone welcome page
      console.log('🎯 Going to zone welcome page for:', zoneId);
      setCurrentView('zone-welcome');
    }
  };
  
  // Handle scene selection from zone welcome page
  const handleSceneSelect = (sceneId) => {
    console.log('🎯 Scene selected from zone welcome:', sceneId);
    restoreDefaultStyles();
    
    setCurrentScene(sceneId);
    setCurrentView('scene');
    
    // Save current location
    GameStateManager.saveGameState(currentZone, sceneId, {
      currentZone: currentZone,
      currentScene: sceneId,
      enteredAt: Date.now()
    });
  };
  
  // Handle navigation from scenes and zone welcome
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
      case 'next-scene':
        // Handle progression between scenes
        if (currentZone === 'symbol-mountain') {
          if (currentScene === 'modak') {
            setCurrentScene('pond');
            setCurrentView('scene');
          } else if (currentScene === 'pond') {
            // After pond, go back to zone welcome to see progression
            setCurrentScene(null);
            setCurrentView('zone-welcome');
          } else {
            setCurrentView('zone-welcome');
          }
        } else {
          setCurrentView('zone-welcome');
        }
        break;
      default:
        console.log('Unknown navigation:', destination);
        setCurrentView('map');
    }
  };
  
  // ✅ DISNEY SYSTEM: Enhanced scene completion with auto-unlock
  const handleSceneComplete = (sceneId, result) => {
    console.log('🎯 DISNEY: Scene completed:', sceneId, result);
    restoreDefaultStyles(); // Restore styles after completion
    
    // ✅ DISNEY STEP 1: Save completion data
    if (result && result.stars) {
      // Save scene state (for reload/resume)
      GameStateManager.saveGameState(currentZone, sceneId, {
        completed: true,
        stars: result.stars,
        completedAt: Date.now()
      });
      
      // ✅ DISNEY STEP 2: Update game progress with completion
      const activeProfileId = localStorage.getItem('activeProfileId');
      if (activeProfileId) {
        const progressKey = `${activeProfileId}_gameProgress`;
        const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        // Update scene completion in game progress
        if (progressData.zones && progressData.zones[currentZone] && progressData.zones[currentZone].scenes) {
          progressData.zones[currentZone].scenes[sceneId] = {
            ...progressData.zones[currentZone].scenes[sceneId], // Preserve existing data like unlocked flag
            completed: true,
            stars: result.stars,
            symbols: result.symbols || {},
            lastPlayed: Date.now()
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
          
          // Save updated progress
          localStorage.setItem(progressKey, JSON.stringify(progressData));
          
          console.log('✅ DISNEY: Game progress updated:', {
            scene: sceneId,
            stars: result.stars,
            totalStars,
            completedScenes
          });
          
          // ✅ DISNEY STEP 3: Update profile stats for GameWelcomeScreen
          const gameProfiles = JSON.parse(localStorage.getItem('gameProfiles') || '{"profiles":{}}');
          if (gameProfiles.profiles && gameProfiles.profiles[activeProfileId]) {
            gameProfiles.profiles[activeProfileId].totalStars = totalStars;
            gameProfiles.profiles[activeProfileId].completedScenes = completedScenes;
            gameProfiles.profiles[activeProfileId].lastPlayed = Date.now();
            localStorage.setItem('gameProfiles', JSON.stringify(gameProfiles));
            
            console.log('✅ DISNEY: Profile stats updated:', {
              profileId: activeProfileId,
              totalStars,
              completedScenes
            });
          }
        }
      }
      
      // ✅ DISNEY STEP 4: Auto-unlock next scene (THE MAGIC!)
      const unlockedScene = GameStateManager.unlockNextScene(currentZone, sceneId);
      if (unlockedScene) {
        console.log('🎉 DISNEY MAGIC: Next scene auto-unlocked:', unlockedScene);
      } else {
        console.log('🏁 DISNEY: Last scene in zone completed or zone completed');
      }
    }
    
    // ✅ DISNEY STEP 5: Navigate to zone welcome to show updated progress
    console.log('🎯 DISNEY: Navigating to zone welcome to show unlocked progress');
    setCurrentScene(null);
    setCurrentView('zone-welcome');
  };
  
  // Handle profile changes
  const handleProfileChange = () => {
    const activeProfile = GameStateManager.getCurrentProfile();
    setCurrentProfile(activeProfile);
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