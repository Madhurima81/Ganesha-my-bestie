// ZoneWelcome.jsx - Updated with Disney/PBS Unlock Detection System
// Path: lib/components/zone/ZoneWelcome.jsx

import React, { useState, useEffect } from 'react';
import './ZoneWelcome.css';
import GameStateManager from '../../services/GameStateManager';
import ProgressManager from '../../services/ProgressManager';

const ZoneWelcome = ({ 
  zoneData,           // Zone configuration object
  onSceneSelect,      // Function to navigate to specific scene
  onBackToMap,        // Function to return to map
  onNavigate          // General navigation function
}) => {
  const [sceneProgress, setSceneProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  console.log('🏔️ ZoneWelcome rendered for zone:', zoneData?.name);

  // Add this near the top of ZoneWelcome component:
  const [highlightedScene, setHighlightedScene] = useState(null);

  // Add this useEffect to detect context:
  useEffect(() => {
    // You can pass context through URL params or props
    const urlParams = new URLSearchParams(window.location.search);
    const context = urlParams.get('context');
    const fromScene = urlParams.get('fromScene');
    
    if (context === 'replay' && fromScene) {
      setHighlightedScene(fromScene); // Highlight the scene they want to replay
    } else if (context === 'continue') {
      // Highlight next unlocked scene
      const nextScene = getNextUnlockedScene();
      setHighlightedScene(nextScene);
    }
  }, []);

  // Load scene progress for this zone
  useEffect(() => {
    if (!zoneData) return;
    
    loadSceneProgress();
    setIsLoading(false);
  }, [zoneData]);

  // ✅ DISNEY ENHANCED: Load scene progress with multiple data sources
 /* const loadSceneProgress = () => {
    if (!zoneData || !zoneData.scenes) return;
    
    try {
      const progressData = {};
      
      zoneData.scenes.forEach(scene => {
        // ✅ DISNEY SOURCE 1: GameStateManager scene progress
        const progress = GameStateManager.getSceneProgress(zoneData.id, scene.id);
        
        // ✅ DISNEY SOURCE 2: Direct scene state
        const sceneState = GameStateManager.getSceneState(zoneData.id, scene.id);
        
        // ✅ DISNEY SOURCE 3: Game progress (for unlock flags)
        const gameProgress = GameStateManager.getGameProgress();
        const gameSceneData = gameProgress.zones?.[zoneData.id]?.scenes?.[scene.id];
        
        // ✅ DISNEY MAGIC: Combine all sources for complete picture
        const isCompleted = (progress && progress.completed) || 
                           (sceneState && sceneState.completed) ||
                           (gameSceneData && gameSceneData.completed);
        
        const stars = (progress && progress.stars) || 
                     (sceneState && sceneState.stars) || 
                     (gameSceneData && gameSceneData.stars) || 0;
        
        const isUnlocked = (gameSceneData && gameSceneData.unlocked) || 
                          (scene.order === 1); // First scene always unlocked
        
        progressData[scene.id] = {
          completed: isCompleted,
          stars: stars,
          unlocked: isUnlocked
        };
        
        // 🧪 DISNEY DEBUG: Log comprehensive data
        console.log(`🔍 DISNEY ${scene.id} progress analysis:`, {
          'Scene Order': scene.order,
          'Progress Source': progress,
          'State Source': sceneState,
          'Game Source': gameSceneData,
          'Final Result': progressData[scene.id],
          'Explicit Unlock': gameSceneData?.unlocked,
          'Is First Scene': scene.order === 1
        });
      });
      
      setSceneProgress(progressData);
      console.log('📊 DISNEY: Final scene progress loaded:', progressData);
    } catch (error) {
      console.log('Error loading scene progress:', error);
      // Initialize with empty progress
      const emptyProgress = {};
      zoneData.scenes.forEach(scene => {
        emptyProgress[scene.id] = { 
          completed: false, 
          stars: 0, 
          unlocked: scene.order === 1 
        };
      });
      setSceneProgress(emptyProgress);
    }
  };*/

  // ✅ ENHANCED: Load scene progress with better completion detection
/*const loadSceneProgress = () => {
  if (!zoneData || !zoneData.scenes) return;
  
  try {
    const progressData = {};
    const activeProfileId = localStorage.getItem('activeProfileId');
    
    console.log('🔍 ENHANCED: Loading progress for profile:', activeProfileId);
    
    zoneData.scenes.forEach(scene => {
      // ✅ METHOD 1: Check scene state directly (most reliable)
      const sceneStateKey = `${activeProfileId}_${zoneData.id}_${scene.id}_state`;
      const sceneStateData = JSON.parse(localStorage.getItem(sceneStateKey) || '{}');
      
      // ✅ METHOD 2: GameStateManager scene progress
      const progress = GameStateManager.getSceneProgress(zoneData.id, scene.id);
      
      // ✅ METHOD 3: Game progress (for unlock flags)
      const gameProgress = GameStateManager.getGameProgress();
      const gameSceneData = gameProgress.zones?.[zoneData.id]?.scenes?.[scene.id];
      
      // ✅ ENHANCED: Multiple completion detection methods
      const isCompleted = 
        (sceneStateData && sceneStateData.completed === true) ||           // Scene state
        (sceneStateData && sceneStateData.phase === 'complete') ||         // Scene phase
        (progress && progress.completed === true) ||                       // GameState progress
        (gameSceneData && gameSceneData.completed === true);               // Game progress
      
      // ✅ ENHANCED: Multiple star detection methods  
      const stars = 
        (sceneStateData && sceneStateData.stars) ||                       // Scene state stars
        (progress && progress.stars) ||                                   // GameState stars
        (gameSceneData && gameSceneData.stars) ||                         // Game progress stars
        0;
      
      // ✅ ENHANCED: Unlock detection
      const isUnlocked = 
        (gameSceneData && gameSceneData.unlocked === true) ||             // Explicit unlock
        (scene.order === 1);                                              // First scene
      
      progressData[scene.id] = {
        completed: isCompleted,
        stars: stars,
        unlocked: isUnlocked
      };
      
      // 🧪 ENHANCED DEBUG: Show all data sources
      console.log(`🔍 ENHANCED ${scene.id} progress analysis:`, {
        'Scene Order': scene.order,
        'Scene State Key': sceneStateKey,
        'Scene State Data': sceneStateData,
        'GameState Progress': progress,
        'Game Progress': gameSceneData,
        'Final Completed': isCompleted,
        'Final Stars': stars,
        'Final Unlocked': isUnlocked
      });
    });
    
    setSceneProgress(progressData);
    
    // ✅ CALCULATE TOTALS FOR DEBUG
    const totalCompleted = Object.values(progressData).filter(p => p.completed).length;
    const totalStars = Object.values(progressData).reduce((sum, p) => sum + (p.stars || 0), 0);
    
    console.log('📊 ENHANCED: Final progress totals:', {
      'Completed Scenes': totalCompleted,
      'Total Scenes': zoneData.scenes.length,
      'Total Stars': totalStars,
      'Progress Data': progressData
    });
    
  } catch (error) {
    console.log('Error loading scene progress:', error);
    // Initialize with empty progress
    const emptyProgress = {};
    zoneData.scenes.forEach(scene => {
      emptyProgress[scene.id] = { 
        completed: false, 
        stars: 0, 
        unlocked: scene.order === 1 
      };
    });
    setSceneProgress(emptyProgress);
  }
};*/

// ✅ NEW: Use ProgressManager for consistent data
const loadSceneProgress = () => {
  if (!zoneData || !zoneData.scenes) return;
  
  try {
    const activeProfileId = localStorage.getItem('activeProfileId');
    console.log('🔍 PROGRESS MANAGER: Loading progress for profile:', activeProfileId);
    
    // ✅ Use ProgressManager instead of manual calculation
    const zoneProgress = ProgressManager.calculateZoneProgress(activeProfileId, zoneData.id);
    console.log('📊 PROGRESS MANAGER: Zone progress calculated:', zoneProgress);
    
    // Convert ProgressManager format to current format
    const progressData = {};
    
    zoneProgress.sceneProgress.forEach(scene => {
      progressData[scene.sceneId] = {
        completed: scene.completed,
        stars: scene.stars,
        unlocked: scene.unlocked
      };
    });
    
    setSceneProgress(progressData);
    
    // ✅ ENHANCED DEBUG with ProgressManager data
    console.log('📊 PROGRESS MANAGER: Final progress totals:', {
      'Completed Scenes': zoneProgress.completedScenes,
      'Total Scenes': zoneProgress.totalScenes,
      'Total Stars': zoneProgress.totalStars,
      'Progress Data': progressData
    });
    
  } catch (error) {
    console.log('Error loading scene progress:', error);
    // Initialize with empty progress
    const emptyProgress = {};
    zoneData.scenes.forEach(scene => {
      emptyProgress[scene.id] = { 
        completed: false, 
        stars: 0, 
        unlocked: scene.order === 1 
      };
    });
    setSceneProgress(emptyProgress);
  }
};

  const getSceneStatus = (scene) => {
    const progress = sceneProgress[scene.id];
    
    // ✅ DISNEY: Check unlock status first
    const isUnlocked = checkSceneUnlocked(scene);
    
    if (!isUnlocked) {
      return { status: 'locked', stars: 0 };
    }
    
    if (!progress) return { status: 'available', stars: 0 };
    
    if (progress.completed) {
      return { status: 'completed', stars: progress.stars || 0 };
    } else if (progress.stars > 0) {
      return { status: 'in-progress', stars: progress.stars };
    } else {
      return { status: 'available', stars: 0 };
    }
  };

  // ✅ DISNEY SYSTEM: Enhanced unlock detection with multiple paths
  const checkSceneUnlocked = (scene) => {
    if (!zoneData || !zoneData.scenes) return false;
    
    // ✅ DISNEY PATH 1: First scene is always unlocked
    if (scene.order === 1) {
      console.log(`🔓 DISNEY: Scene ${scene.id} unlocked (first scene)`);
      return true;
    }
    
    // ✅ DISNEY PATH 2: Check explicit unlock flag from auto-unlock system
    const gameProgress = GameStateManager.getGameProgress();
    const explicitUnlock = gameProgress.zones?.[zoneData.id]?.scenes?.[scene.id]?.unlocked;
    
    if (explicitUnlock === true) {
      console.log(`🔓 DISNEY: Scene ${scene.id} explicitly unlocked by auto-unlock system`);
      return true;
    }
    
    // ✅ DISNEY PATH 3: Check if previous scene is completed (fallback)
    const previousScene = zoneData.scenes.find(s => s.order === scene.order - 1);
    if (!previousScene) {
      console.log(`🔒 DISNEY: Scene ${scene.id} locked (no previous scene found)`);
      return false;
    }
    
    const previousProgress = sceneProgress[previousScene.id];
    const previousCompleted = previousProgress && previousProgress.completed;
    
    // ✅ DISNEY ENHANCED DEBUG: Show all unlock paths
    console.log(`🔍 DISNEY: Comprehensive unlock check for ${scene.id}:`, {
      'Scene Order': scene.order,
      'Previous Scene': previousScene.id,
      'Previous Completed': previousCompleted,
      'Explicit Unlock Flag': explicitUnlock,
      'Auto-Unlock Path': explicitUnlock === true ? '✅ UNLOCKED' : '❌ Not set',
      'Previous Completion Path': previousCompleted ? '✅ UNLOCKED' : '❌ Not completed',
      'Final Decision': explicitUnlock === true || previousCompleted ? '🔓 UNLOCKED' : '🔒 LOCKED'
    });
    
    const isUnlocked = explicitUnlock === true || previousCompleted;
    
    if (isUnlocked) {
      console.log(`🔓 DISNEY: Scene ${scene.id} unlocked via ${explicitUnlock ? 'auto-unlock system' : 'previous completion'}`);
    } else {
      console.log(`🔒 DISNEY: Scene ${scene.id} locked - waiting for previous scene completion or auto-unlock`);
    }
    
    return isUnlocked;
  };

  // ✅ DISNEY: Helper function for highlighting next available scene
  const getNextUnlockedScene = () => {
    if (!zoneData || !zoneData.scenes) return null;
    
    // Find first uncompleted but unlocked scene
    for (const scene of zoneData.scenes) {
      const progress = sceneProgress[scene.id];
      const isUnlocked = checkSceneUnlocked(scene);
      
      if (isUnlocked && (!progress || !progress.completed)) {
        return scene.id;
      }
    }
    
    return null;
  };

  const handleSceneClick = (scene) => {
    const status = getSceneStatus(scene);
    
    if (status.status === 'locked') {
      console.log('🔒 DISNEY: Scene locked, showing feedback:', scene.name);
      // You could show a tooltip or message here
      return;
    }
    
    console.log('🎯 DISNEY: Scene selected:', scene.id);
    if (onSceneSelect) {
      onSceneSelect(scene.id);
    }
  };

  const handleBackToMap = () => {
    console.log('⬅️ Back to map clicked');
    if (onBackToMap) {
      onBackToMap();
    } else if (onNavigate) {
      onNavigate('map');
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 3 }, (_, i) => (
      <span key={i} className={`scene-star ${i < count ? 'earned' : 'empty'}`}>
        {i < count ? '⭐' : '☆'}
      </span>
    ));
  };

  if (isLoading || !zoneData) {
    return (
      <div className="zone-welcome-loading">
        <div className="loading-spinner">🌟 Loading {zoneData?.name || 'zone'}...</div>
      </div>
    );
  }

  return (
    <div 
      className="zone-welcome-container"
      style={{
        backgroundImage: `url('${zoneData.background}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Back to Map Button */}
      <button className="zone-back-button" onClick={handleBackToMap}>
        ← Back to Map
      </button>

      {/* Zone Title (Optional - can be hidden for cleaner look) */}
      <div className="zone-title-badge">
        <div className="zone-icon">{zoneData.icon}</div>
        <h1 className="zone-name">{zoneData.name}</h1>
      </div>

      {/* ✅ DISNEY DEBUG: Enhanced debug panel with unlock analysis */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        maxWidth: '350px',
        maxHeight: '80vh',
        overflow: 'auto',
        zIndex: 1000,
        border: '2px solid #4CAF50'
      }}>
        <div style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: '8px' }}>
          🧪 DISNEY UNLOCK ANALYSIS
        </div>
        {zoneData.scenes.map(scene => {
          const progress = sceneProgress[scene.id];
          const status = getSceneStatus(scene);
          const gameProgress = GameStateManager.getGameProgress();
          const explicitUnlock = gameProgress.zones?.[zoneData.id]?.scenes?.[scene.id]?.unlocked;
          
          return (
            <div key={scene.id} style={{ 
              margin: '4px 0', 
              padding: '4px', 
              border: '1px solid #333',
              borderRadius: '4px',
              backgroundColor: status.status === 'locked' ? '#ffebee' : '#e8f5e8',
              color: status.status === 'locked' ? '#c62828' : '#2e7d32'
            }}>
              <div style={{ fontWeight: 'bold' }}>
                {scene.id} (Order: {scene.order})
              </div>
              <div style={{ fontSize: '10px' }}>
                Status: {status.status} {progress?.completed ? ' ✅' : ' ❌'} ({progress?.stars || 0}⭐)
              </div>
              <div style={{ fontSize: '10px' }}>
                Auto-Unlock: {explicitUnlock === true ? '🔓 YES' : explicitUnlock === false ? '🔒 NO' : '❓ UNSET'}
              </div>
              {scene.order > 1 && (
                <div style={{ fontSize: '10px' }}>
                  Prev Complete: {(() => {
                    const prevScene = zoneData.scenes.find(s => s.order === scene.order - 1);
                    const prevProgress = sceneProgress[prevScene?.id];
                    return prevProgress?.completed ? '✅ YES' : '❌ NO';
                  })()}
                </div>
              )}
            </div>
          );
        })}
        
        {/* ✅ DISNEY: Show localStorage debug */}
        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #666' }}>
          <div style={{ color: '#FFC107', fontWeight: 'bold', fontSize: '10px' }}>
            STORAGE DEBUG:
          </div>
          <div style={{ fontSize: '9px' }}>
            Active Profile: {localStorage.getItem('activeProfileId')?.slice(-8) || 'None'}
          </div>
          <div style={{ fontSize: '9px' }}>
            Progress Key: {localStorage.getItem('activeProfileId') ? `${localStorage.getItem('activeProfileId')}_gameProgress` : 'None'}
          </div>
        </div>
      </div>

      {/* Scene Icons Grid */}
      <div className="zone-scenes-container">
        {zoneData.scenes.map((scene, index) => {
          const status = getSceneStatus(scene);
          
          return (
            <div
              key={scene.id}
              className={`zone-scene-card ${status.status} ${
                highlightedScene === scene.id ? 'highlighted' : ''
              } ${status.status === 'locked' ? 'locked-scene' : 'unlocked-scene'}`}
              style={{
                top: `${scene.position.top}%`,
                left: `${scene.position.left}%`,
                cursor: status.status === 'locked' ? 'not-allowed' : 'pointer',
                filter: status.status === 'locked' ? 'grayscale(100%) brightness(0.5)' : 'none',
                transform: status.status === 'locked' ? 'scale(0.9)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleSceneClick(scene)}
            >
              {/* Order indicator */}
              <div className="scene-order-indicator" style={{
                backgroundColor: status.status === 'locked' ? '#666' : '#4CAF50'
              }}>
                {scene.order}
              </div>
              
              {/* Main scene icon container */}
              <div className="scene-icon-container">
                <div className={`scene-status-ring ${status.status}`}></div>
                <div className="scene-emoji" style={{
                  filter: status.status === 'locked' ? 'grayscale(100%)' : 'none'
                }}>
                  {scene.emoji}
                </div>
                
                {/* Lock overlay for locked scenes */}
                {status.status === 'locked' && (
                  <div className="scene-lock-overlay">
                    <span className="scene-lock-icon">🔒</span>
                  </div>
                )}
                
                {/* ✅ DISNEY: Unlock animation for recently unlocked scenes */}
                {status.status !== 'locked' && highlightedScene === scene.id && (
                  <div className="scene-unlock-animation">
                    <span className="unlock-sparkle">✨</span>
                  </div>
                )}
              </div>
              
              {/* Stars display */}
              {status.stars > 0 && (
                <div className="scene-stars-display">
                  {status.stars}⭐
                </div>
              )}
              
              {/* Scene name badge */}
              <div className="scene-name-badge" style={{
                backgroundColor: status.status === 'locked' ? '#666' : 'rgba(76, 175, 80, 0.9)',
                color: status.status === 'locked' ? '#999' : 'white'
              }}>
                {scene.name}
              </div>
              
              {/* Status indicator */}
              <div className="scene-status-indicator">
                {status.status === 'completed' && (
                  <span className="status-completed" style={{ color: '#4CAF50' }}>✅ Complete</span>
                )}
                {status.status === 'in-progress' && (
                  <span className="status-progress" style={{ color: '#FF9800' }}>🎯 Continue</span>
                )}
                {status.status === 'available' && (
                  <span className="status-available" style={{ color: '#2196F3' }}>🚀 Start</span>
                )}
                {status.status === 'locked' && (
                  <span className="status-locked" style={{ color: '#666' }}>🔒 Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ DISNEY: Debug button to test auto-unlock manually */}
      <button 
        style={{
          position: 'fixed', 
          top: '150px', 
          right: '10px', 
          background: '#4CAF50', 
          color: 'white', 
          padding: '8px 12px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 9999
        }}
        onClick={() => {
          console.log('🧪 DISNEY TEST: Manual unlock trigger');
          
          // Test auto-unlock for pond scene
          const unlocked = GameStateManager.unlockNextScene('symbol-mountain', 'modak');
          console.log('🧪 Manual unlock result:', unlocked);
          
          // Refresh the progress display
          loadSceneProgress();
        }}
      >
        🧪 Test Unlock
      </button>

      {/* ✅ DISNEY: localStorage debug button */}
      <button 
        style={{
          position: 'fixed', 
          top: '190px', 
          right: '10px', 
          background: '#2196F3', 
          color: 'white', 
          padding: '8px 12px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 9999
        }}
        onClick={() => {
          console.log('🧪 DISNEY STORAGE DEBUG:');
          console.log('🔍 All localStorage keys:');
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (key.includes('gameProgress') || key.includes('gameProfiles')) {
              console.log(`${key}:`, JSON.parse(value));
            } else {
              console.log(`${key}:`, value);
            }
          }
          
          console.log('🔍 Current game progress:');
          console.log(GameStateManager.getGameProgress());
        }}
      >
        🧪 Debug Storage
      </button>

      {/* Add these buttons to ZoneWelcome.jsx for testing */}

{/* Direct Modak Completion */}
<button 
  style={{
    position: 'fixed',
    top: '80px',
    right: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000,
    fontSize: '12px',
    fontWeight: 'bold'
  }}
  onClick={async () => {
    console.log('🧪 DIRECT MODAK COMPLETION');
    
    const { default: GameStateManager } = await import('../../services/GameStateManager');
    
    GameStateManager.saveGameState('symbol-mountain', 'modak', {
      completed: true,
      stars: 8,
      symbols: { basket: true, mooshika: true, belly: true },
      phase: 'complete'
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }}
>
  ✅ COMPLETE MODAK
</button>

{/* Direct Pond Completion */}
<button 
  style={{
    position: 'fixed',
    top: '120px',
    right: '10px',
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000,
    fontSize: '12px',
    fontWeight: 'bold'
  }}
  onClick={async () => {
    console.log('🧪 DIRECT POND COMPLETION');
    
    const { default: GameStateManager } = await import('../../services/GameStateManager');
    
    GameStateManager.saveGameState('symbol-mountain', 'pond', {
      completed: true,
      stars: 5,
      symbols: { lotus: true, trunk: true, golden: true },
      phase: 'complete'
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }}
>
  ✅ COMPLETE POND
</button>

{/* Test Both Button */}
<button 
  style={{
    position: 'fixed',
    top: '160px',
    right: '10px',
    backgroundColor: 'gold',
    color: 'black',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000,
    fontSize: '12px',
    fontWeight: 'bold'
  }}
  onClick={async () => {
    console.log('🧪 TESTING BOTH SCENES DIRECT');
    
    const { default: GameStateManager } = await import('../../services/GameStateManager');
    
    // Complete modak first
    GameStateManager.saveGameState('symbol-mountain', 'modak', {
      completed: true,
      stars: 8,
      symbols: { basket: true, mooshika: true, belly: true },
      phase: 'complete'
    });
    
    // Then complete pond
    setTimeout(() => {
      GameStateManager.saveGameState('symbol-mountain', 'pond', {
        completed: true,
        stars: 5,
        symbols: { lotus: true, trunk: true, golden: true },
        phase: 'complete'
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }, 200);
  }}
>
  ✅ COMPLETE BOTH
</button>

{/* Zone Progress Summary - Using ProgressManager */}
<div className="zone-progress-summary">
  <div className="progress-info">
    <span className="zone-progress-text">
      Progress: {(() => {
        const activeProfileId = localStorage.getItem('activeProfileId');
        const zoneProgress = ProgressManager.calculateZoneProgress(activeProfileId, zoneData.id);
        return `${zoneProgress.completedScenes} / ${zoneProgress.totalScenes} scenes`;
      })()}
    </span>
    <div className="zone-stars-total">
      Total Stars: {(() => {
        const activeProfileId = localStorage.getItem('activeProfileId');
        const zoneProgress = ProgressManager.calculateZoneProgress(activeProfileId, zoneData.id);
        return zoneProgress.totalStars;
      })()}
    </div>
  </div>
</div>

      {/* ✅ DISNEY: Add CSS for unlock animations */}
      {/* ✅ FIXED: Regular CSS styles instead of jsx */}
<style>{`
  .scene-unlock-animation {
    position: absolute;
    top: -10px;
    right: -10px;
    animation: unlockSparkle 2s ease-in-out infinite;
  }
  
  @keyframes unlockSparkle {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  }
  
  .locked-scene {
    pointer-events: none;
  }
  
  .unlocked-scene:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
  
  .scene-status-ring.completed {
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.6);
  }
  
  .scene-status-ring.available {
    box-shadow: 0 0 15px rgba(33, 150, 243, 0.6);
  }
  
  .scene-status-ring.locked {
    box-shadow: 0 0 15px rgba(102, 102, 102, 0.6);
  }
`}</style>
    </div>
  );
};

export default ZoneWelcome;