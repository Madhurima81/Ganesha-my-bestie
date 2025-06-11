// App.jsx - Updated with Async Scene Completion System

import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import MainWelcomeScreen from './lib/components/navigation/MainWelcomeScreen';
import CleanGameWelcomeScreen from './lib/components/navigation/CleanGameWelcomeScreen';
import CleanMapZone from './pages/CleanMapZone';
import ZoneWelcome from './lib/components/zone/ZoneWelcome';
import { getZoneConfig } from './lib/components/zone/ZoneConfig';
import GameStateManager from './lib/services/GameStateManager';
import { GameCoachProvider } from './lib/components/coach/GameCoach';
import ProgressManager from './lib/services/ProgressManager';

// 🎯 DYNAMIC SCENE MAPPING: Define available scenes
const SCENE_MAPPING = {
  'symbol-mountain': {
    'modak': () => import('./zones/symbol-mountain/scenes/modak/NewModakScene'),
    'pond': () => import('./zones/symbol-mountain/scenes/pond/PondSceneSimplified'),
    //'temple': () => import('./zones/symbol-mountain/scenes/temple/TempleScene'), // Future
    //'garden': () => import('./zones/symbol-mountain/scenes/garden/GardenScene')  // Future
  },
  //'cave-of-secrets': {
    //'crystal-cave': () => import('./zones/cave-of-secrets/scenes/crystal-cave/CrystalScene'),
    //'treasure-chamber': () => import('./zones/cave-of-secrets/scenes/treasure-chamber/TreasureScene')
  }
  // Add more zones as you create them


const GameStateManagerClass = GameStateManager.constructor;

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [currentZone, setCurrentZone] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log('🌟 Clean App rendering - current view:', currentView);
  console.log('🎯 Current zone:', currentZone, 'Current scene:', currentScene);
  
  // 🎯 DYNAMIC SCENE LOADER: Load scene component dynamically
  const loadSceneComponent = (zoneId, sceneId) => {
    const zoneMapping = SCENE_MAPPING[zoneId];
    if (!zoneMapping) {
      console.error(`🚫 Zone "${zoneId}" not found in SCENE_MAPPING`);
      return null;
    }
    
    const sceneLoader = zoneMapping[sceneId];
    if (!sceneLoader) {
      console.error(`🚫 Scene "${sceneId}" not found in zone "${zoneId}"`);
      return null;
    }
    
    console.log(`🎯 Loading scene: ${zoneId}/${sceneId}`);
    return lazy(sceneLoader);
  };

  // 🎯 PLACEHOLDER SCENE: For scenes that don't exist yet
  const PlaceholderScene = ({ zoneId, sceneId, onNavigate }) => (
    <div className="scene-placeholder" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2 style={{ fontSize: '48px', margin: '20px 0' }}>
        {sceneId === 'temple' ? '🛕' : sceneId === 'garden' ? '🌸' : '🎮'}
      </h2>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        {sceneId.charAt(0).toUpperCase() + sceneId.slice(1)} Scene
      </h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
        This magical scene is coming soon!
      </p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => onNavigate('zone-welcome')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to {zoneId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </button>
        <button 
          onClick={() => onNavigate('map')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🗺️ Back to Map
        </button>
      </div>
    </div>
  );

  // 🎯 SCENE LOADING COMPONENT: Handle dynamic loading with error boundaries
  const SceneLoader = ({ zoneId, sceneId, onNavigate, onComplete, onSceneSelect }) => {
    const SceneComponent = loadSceneComponent(zoneId, sceneId);
    
    if (!SceneComponent) {
      console.log(`🎯 Scene ${zoneId}/${sceneId} not implemented, showing placeholder`);
      return (
        <PlaceholderScene 
          zoneId={zoneId} 
          sceneId={sceneId} 
          onNavigate={onNavigate}
        />
      );
    }
    
    return (
      <Suspense fallback={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f9f9f9',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌟</div>
          <div style={{ fontSize: '24px', color: '#333' }}>
            Loading {sceneId} scene...
          </div>
        </div>
      }>
        <SceneComponent 
          onNavigate={onNavigate}
          onComplete={onComplete}
          onSceneSelect={onSceneSelect}
          zoneId={zoneId}
          sceneId={sceneId}
        />
      </Suspense>
    );
  };

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
    
    setCurrentZone(null);
    setCurrentScene(null);
    setCurrentView('map');
  };
  
  // Handle zone selection from map
  const handleZoneSelect = (zoneId, sceneId = null) => {
    console.log('🎯 Zone selected:', zoneId, sceneId ? `Scene: ${sceneId}` : 'No scene');
    
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
  
  // ✅ UPDATED: Async Scene Completion Handler
  const handleSceneComplete = async (sceneId, result) => {
    console.log('🎯 ASYNC PROGRESS MANAGER: Scene completed:', sceneId, result);
    
    try {
      // ✅ Use ProgressManager for unified saving with async handling
      const activeProfileId = localStorage.getItem('activeProfileId');
      if (activeProfileId && currentZone && result?.stars) {
        
        console.log('🧪 About to call ProgressManager.updateSceneCompletion with:');
        console.log('🧪 profileId:', activeProfileId);
        console.log('🧪 zoneId:', currentZone);
        console.log('🧪 sceneId:', sceneId);
        console.log('🧪 data:', {
          completed: true,
          stars: result?.stars || 0,
          symbols: result?.symbols || {}
        });
        
        // ✅ ADD: Wait for ProgressManager to complete
        await new Promise(resolve => {
          const updatedZoneProgress = ProgressManager.updateSceneCompletion(
            activeProfileId, 
            currentZone, 
            sceneId, 
            {
              completed: true,
              stars: result?.stars || 0,
              symbols: result?.symbols || {}
            }
          );
          
          console.log('✅ ASYNC PROGRESS MANAGER: Scene completion saved successfully');
          console.log('📊 ASYNC PROGRESS MANAGER: Updated zone progress:', updatedZoneProgress);
          
          // Small delay to ensure save completes
          setTimeout(resolve, 300);
        });
        
        // ✅ Auto-unlock next scene
        await new Promise(resolve => {
          const unlockedScene = GameStateManager.unlockNextScene(currentZone, sceneId);
          if (unlockedScene) {
            console.log('🎉 ASYNC PROGRESS MANAGER: Next scene auto-unlocked:', unlockedScene);
          } else {
            console.log('🏁 ASYNC PROGRESS MANAGER: Last scene in zone completed');
          }
          
          // Small delay for unlock processing
          setTimeout(resolve, 200);
        });
        
        // ✅ ADD: Additional delay before navigation to ensure localStorage writes complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('✅ ASYNC PROGRESS MANAGER: All saves completed, safe to navigate');
        
      } else {
        console.error('❌ ASYNC PROGRESS MANAGER: Missing required data for scene completion', {
          activeProfileId,
          currentZone,
          sceneId,
          result
        });
      }
      
      // Navigate to zone welcome to show updated progress
      console.log('🎯 ASYNC PROGRESS MANAGER: Navigating to zone welcome to show updated progress');
      setCurrentScene(null);
      setCurrentView('zone-welcome');
      
    } catch (error) {
      console.error('❌ ASYNC PROGRESS MANAGER: Error saving scene completion:', error);
      // Fallback navigation
      setCurrentScene(null);
      setCurrentView('zone-welcome');
    }
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
      
      {/* 🎯 DYNAMIC SCENE RENDERING: Replaces all hardcoded scene logic */}
      {currentView === 'scene' && currentZone && currentScene && (() => {
        console.log('🎯 Rendering scene view');
        console.log('🎯 Zone:', currentZone, 'Scene:', currentScene);
        
        // Apply scene-specific styles
        applySceneStyles();
        
        return (
          <SceneLoader 
            zoneId={currentZone}
            sceneId={currentScene}
            onNavigate={handleNavigate}
            onComplete={handleSceneComplete}
            onSceneSelect={handleSceneSelect}
          />
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