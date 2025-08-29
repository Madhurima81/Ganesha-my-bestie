// CleanGameWelcomeScreen.jsx - ENHANCED WITH CELEBRATION - Streamlined Flow (No Screen 3)
import React, { useState, useEffect } from 'react';
import GameStateManager from '../../services/GameStateManager';
import CleanProfileSelector from './CleanProfileSelector';
import './CleanGameWelcomeScreen.css';
import SimpleSceneManager from '../../services/SimpleSceneManager';


const CleanGameWelcomeScreen = ({ onContinue, onNewGame }) => {
  console.log('🌟 Clean GameWelcomeScreen rendering');
  
  const [profiles, setProfiles] = useState({});
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);

  // Clean initialization - no persistent state
  useEffect(() => {
    initializeClean();
    
    // Cleanup function to prevent state leaks
    return () => {
      console.log('🧹 CleanGameWelcomeScreen cleanup');
    };
  }, []);
  
  const initializeClean = () => {
    try {
      const gameProfiles = GameStateManager.getProfiles();
      const profilesObj = gameProfiles?.profiles || {};
      setProfiles(profilesObj);
      
      // Check if there's already an active profile
      const activeProfileId = localStorage.getItem('activeProfileId');
      if (activeProfileId && profilesObj[activeProfileId]) {
        // Profile already selected - go directly to welcome back screen
        console.log('🌟 Active profile found, showing welcome back screen');
        handleProfileSelect(activeProfileId);
      } else {
        // No active profile - show profile selector
        console.log('🌟 No active profile, showing profile selector');
        setShowProfileSelector(true);
      }
    } catch (error) {
      console.error('Clean initialization error:', error);
      setProfiles({});
      setShowProfileSelector(true);
    }
  };
  

  // ✅ REPLACE the checkProgress function in CleanGameWelcomeScreen.jsx
const checkProgress = (profileId) => {
  if (!profileId) return;

  console.log('🔍 PROGRESS CHECK: Starting for profile:', profileId);
  
  try {
    let foundAnyProgress = false;

    // ✅ PRIORITY 1: Check for temp sessions first (most important!)
const tempPondKey = `temp_session_${profileId}_symbol-mountain_pond`;
const tempModakKey = `temp_session_${profileId}_symbol-mountain_modak`;

if (localStorage.getItem(tempPondKey) || localStorage.getItem(tempModakKey)) {
  console.log('✅ TEMP SESSION FOUND - setting hasProgress = TRUE');
  setHasProgress(true);
  return; // Early exit - we found progress!
}
    
    // ✅ METHOD 1: Check for IN-PROGRESS scenes (most important for your issue)
    console.log('🔍 PROGRESS CHECK: Looking for in-progress scenes...');
    
    Object.keys(localStorage).forEach(key => {
  // ✅ ADD TEMP SESSION DETECTION (most important!)
  if ((key.includes('sceneState') || 
       key.includes('symbol-mountain') || 
       key.includes('modak') ||
       key.includes('pond') ||
       key.startsWith(`temp_session_${profileId}`) ||  // ← ADD THIS
       key.startsWith(`${profileId}_symbol-mountain`)) &&  // ← ADD THIS  
      key.includes(profileId)) {
             try {
          const sceneState = JSON.parse(localStorage.getItem(key) || '{}');
          console.log(`🔍 Scene state ${key}:`, {
            completed: sceneState.completed,
            hasStars: !!(sceneState.stars && sceneState.stars > 0),
            hasProgress: !!(sceneState.progress && sceneState.progress > 0),
            hasPhase: !!(sceneState.phase && sceneState.phase !== 'initial'),
            hasAnyData: Object.keys(sceneState).length > 0
          });

          // Check for fireworks state first
          if (sceneState.currentPopup === 'final_fireworks' || 
              sceneState.currentPopup === 'fireworks') {
            console.log('✅ PROGRESS CHECK: Scene is in final fireworks - treating as completed');
            foundAnyProgress = true;
            return;
          }
          
          // ✅ CRITICAL FIX: Detect ANY meaningful progress, not just completion
          if (sceneState.completed || 
              (sceneState.stars && sceneState.stars > 0) ||
              (sceneState.progress && sceneState.progress > 0) ||
              (sceneState.phase && sceneState.phase !== 'initial' && sceneState.phase !== undefined) ||
              (sceneState.discoveredSymbols && Object.keys(sceneState.discoveredSymbols).length > 0) ||
              (sceneState.lotusStates && sceneState.lotusStates.some(state => state > 0)) ||
              (sceneState.mooshikaFound === true) ||
              (sceneState.modaksCollected && sceneState.modaksCollected > 0)) {
            
            console.log('✅ PROGRESS FOUND in scene state:', key);
            foundAnyProgress = true;
          }
        } catch (e) {
          console.warn('⚠️ Could not parse scene state:', key);
        }
      }
    });
    
    if (foundAnyProgress) {
      console.log('✅ PROGRESS CHECK: Found in-progress scenes, setting hasProgress = TRUE');
      setHasProgress(true);
      return;
    }
    
    // ✅ METHOD 2: Check ProgressManager for completed scenes (backup)
    try {
      const progressKey = `${profileId}_gameProgress`;
      const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
      
      if (progressData && progressData.zones) {
        let totalStars = 0;
        let completedScenes = 0;
        
        Object.values(progressData.zones).forEach(zone => {
          if (zone.scenes) {
            Object.values(zone.scenes).forEach(scene => {
              if (scene.completed) {
                completedScenes++;
                totalStars += scene.stars || 0;
              }
            });
          }
        });
        
        if (totalStars > 0 || completedScenes > 0) {
          console.log('✅ PROGRESS CHECK: Found completed scenes in ProgressManager');
          setHasProgress(true);
          return;
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not check ProgressManager:', e);
    }
    
    // ✅ METHOD 3: Check profile stats (final backup)
    try {
      const gameProfiles = JSON.parse(localStorage.getItem('gameProfiles') || '{"profiles":{}}');
      if (gameProfiles.profiles && gameProfiles.profiles[profileId]) {
        const profile = gameProfiles.profiles[profileId];
        if (profile.totalStars > 0 || profile.completedScenes > 0) {
          console.log('✅ PROGRESS CHECK: Found progress in profile stats');
          setHasProgress(true);
          return;
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not check profile stats:', e);
    }
    
    // ✅ No progress found anywhere
    console.log('❌ PROGRESS CHECK: No progress found, setting hasProgress = FALSE');
    setHasProgress(false);
    
  } catch (error) {
    console.error('❌ PROGRESS CHECK: Error:', error);
    setHasProgress(false);
  }
};

  // ✨ DISNEY ENHANCEMENT: Detect recent scene completion
const getRecentAchievement = () => {
  console.log('🧪 TESTING: Forcing achievement banner to appear');
  
  if (!currentProfile) return null;
  
  const activeProfileId = localStorage.getItem('activeProfileId');
  if (!activeProfileId) return null;
  
  // Check for scenes completed in last 5 minutes (300,000ms)
  const recentTimeThreshold = Date.now() - 300000;
  let recentCompletion = null;
  
  try {
    // Check scene states for recent completions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(activeProfileId) && key.includes('_state')) {
        const stateData = JSON.parse(localStorage.getItem(key) || '{}');
        
        // Check if scene was completed recently
        if (stateData.completed && stateData.completedAt && 
            stateData.completedAt > recentTimeThreshold) {
          
          // Extract zone and scene from key: "profile_123_symbol-mountain_modak_state"
          const keyParts = key.split('_');
          if (keyParts.length >= 4) {
            const zoneId = keyParts[2];
            const sceneId = keyParts[3];
            
            recentCompletion = {
              zone: zoneId,
              scene: sceneId,
              stars: stateData.stars || 0,
              completedAt: stateData.completedAt
            };
            break; // Found most recent
          }
        }
      }
    }
  } catch (e) {
    console.error('Error checking recent achievements:', e);
  }
  
  return recentCompletion;
  
};

// Find where GameWelcomeScreen checks for saved progress and add this debug:
useEffect(() => {
  const resumeCheck = SimpleSceneManager.shouldResumeScene();
  const profileId = localStorage.getItem('activeProfileId');
  console.log('🧪 GAME WELCOME: Resume detection:', {
    resumeCheck,
    profileId,
    timestamp: Date.now()
  });
}, []);


  // ✨ ENHANCEMENT: Recent Achievement Banner Component
  const RecentAchievementBanner = ({ achievement }) => {
    if (!achievement) return null;
    
    const zoneName = achievement.zone.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const sceneName = achievement.scene.charAt(0).toUpperCase() + achievement.scene.slice(1);
    
    return (
      <div className="recent-achievement-banner">
        <div className="achievement-sparkles">✨🎉✨</div>
        <div className="achievement-title">Congratulations!</div>
        <div className="achievement-content">
          You just completed <strong>{sceneName}</strong> in {zoneName}
        </div>
        <div className="achievement-stars">
          {'⭐'.repeat(achievement.stars)} {achievement.stars} star{achievement.stars !== 1 ? 's' : ''} earned!
        </div>
      </div>
    );
  };

  // ✨ ENHANCEMENT: Better Continue button text
  const getContinueButtonText = () => {
    const recentAchievement = getRecentAchievement();
    
    if (recentAchievement) {
      // Just completed something - suggest next logical step
      const zoneName = recentAchievement.zone.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        main: "Continue Adventure",
        sub: `See what's unlocked in ${zoneName}!`
      };
    } else {
      // Resume normal play
      return {
        main: hasProgress ? "Continue Journey" : "Start Adventure",
        sub: hasProgress ? "Resume from where you left off" : "Begin your magical journey"
      };
    }
  };


// 🌟 ADD THESE NEW FUNCTIONS HERE:
// ✨ DISNEY ENHANCEMENT: Detect if this is first time vs return visit
const isFirstTimeVisit = () => {
  if (!currentProfile) return true;
  
  // Check if this profile has ANY progress at all
  const activeProfileId = localStorage.getItem('activeProfileId');
  if (!activeProfileId) return true;
  
try {
  // ✅ PRIORITY: Check for temp sessions first!
  const tempPondKey = `temp_session_${activeProfileId}_symbol-mountain_pond`;
  const tempModakKey = `temp_session_${activeProfileId}_symbol-mountain_modak`;
  
  if (localStorage.getItem(tempPondKey) || localStorage.getItem(tempModakKey)) {
    console.log('🎯 FIRST TIME CHECK: Found temp session - this is NOT first time');
    return false; // Has progress = NOT first time
  }

  // Method 1: Check profile stats...    // Method 1: Check profile stats
    const gameProfiles = JSON.parse(localStorage.getItem('gameProfiles') || '{"profiles":{}}');
    if (gameProfiles.profiles && gameProfiles.profiles[activeProfileId]) {
      const profile = gameProfiles.profiles[activeProfileId];
      if (profile.totalStars > 0 || profile.completedScenes > 0) {
        return false; // Has progress = return visit
      }
    }
    
    // Method 2: Check if profile was just created (within last 30 seconds)
    if (gameProfiles.profiles && gameProfiles.profiles[activeProfileId]) {
      const profile = gameProfiles.profiles[activeProfileId];
      const timeSinceCreation = Date.now() - (profile.createdAt || 0);
      if (timeSinceCreation < 30000) { // 30 seconds
        return true; // Just created = first time
      }
    }
    
    // Method 3: Check for any scene states
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(activeProfileId) && key.includes('_state')) {
        try {
          const stateData = JSON.parse(localStorage.getItem(key) || '{}');
          if (stateData.stars > 0 || stateData.completed) {
            return false; // Has scene progress = return visit
          }
        } catch (e) {
          // Skip invalid data
        }
      }
    }
    
    return true; // No progress found = first time
  } catch (error) {
    console.error('Error checking first time visit:', error);
    return true; // Default to first time on error
  }
};

// ✨ ENHANCEMENT: Get welcome message based on visit type
const getWelcomeMessage = () => {
  const isFirstTime = isFirstTimeVisit();
  const recentAchievement = getRecentAchievement();
  
  if (isFirstTime) {
    return {
      title: `Welcome to the Adventure, ${currentProfile.name}!`,
      subtitle: "Are you excited? Let's begin your magical journey!",
      progressTitle: "Ready for Adventure",
      buttonText: {
        main: "Start Adventure",
        sub: "Begin your magical journey through Symbol Mountain"
      }
    };
  } else {
    const title = recentAchievement 
      ? `Amazing Work, ${currentProfile.name}!`
      : `Welcome Back, ${currentProfile.name}!`;
      
    return {
      title: title,
      subtitle: recentAchievement 
        ? "You're making incredible progress!" 
        : "Ready to continue your magical journey?",
      progressTitle: "Your Journey So Far",
      buttonText: getContinueButtonText()
    };
  }
};
  
  const handleProfileSelect = (profileId) => {
    try {
      console.log('🎯 Profile selected:', profileId);
      
      // Load profiles fresh to get the selected one
      const gameProfiles = GameStateManager.getProfiles();
      const profilesObj = gameProfiles?.profiles || {};
      
      // Set as active profile in GameStateManager
      GameStateManager.setActiveProfile(profileId);
      
      // Load the selected profile
      const selectedProfile = profilesObj[profileId];
      setCurrentProfile(selectedProfile);
      
      // Check progress for selected profile
      console.log('🔍 About to check progress for selected profile...');
      checkProgress(profileId);
      
      // Close profile selector and show welcome screen (Image 2)
      setShowProfileSelector(false);
    } catch (error) {
      console.error('Profile selection error:', error);
    }
  };
  
  const handleProfileCreated = (profileId) => {
    // Reload profiles after creation
    const gameProfiles = GameStateManager.getProfiles();
    const profilesObj = gameProfiles?.profiles || {};
    setProfiles(profilesObj);
    
    // Select the newly created profile
    handleProfileSelect(profileId);
  };
  
  const handleBackToProfiles = () => {
    setCurrentProfile(null);
    setHasProgress(false);
    setShowProfileSelector(true);
  };

/*const handleContinue = () => {
  console.log('🚀 Continue clicked - smart navigation');
  const profileId = localStorage.getItem('activeProfileId');
  if (!profileId) return;

  // 🔍 CRITICAL DEBUG: Show ALL localStorage keys related to this profile
  console.log('🔍 DEBUG: Profile ID:', profileId);
  console.log('🔍 DEBUG: All localStorage keys containing profile:');
  
  Object.keys(localStorage).forEach(key => {
    if (key.includes(profileId)) {
      const value = localStorage.getItem(key);
      console.log(`   ${key}:`, JSON.parse(value || '{}'));
    }
  });


  // Get current zone progress
  const currentZone = 'symbol-mountain';
  const allScenes = ['pond', 'modak', 'temple', 'garden']; // Add all zone scenes
  
  let completedScenes = [];
  let incompleteScenes = [];
  let inProgressScene = null;
  let mostRecentTimestamp = 0;

  // Check status of all scenes in zone
  allScenes.forEach(scene => {
    const sceneKey = `${profileId}_${currentZone}_${scene}_state`;
    const sceneState = JSON.parse(localStorage.getItem(sceneKey) || '{}');
    
    if (sceneState.completed) {
      completedScenes.push(scene);
    } else if (Object.keys(sceneState).length > 0) {
      // Has progress but not completed
      incompleteScenes.push(scene);
      const timestamp = sceneState.lastSaved || sceneState.lastPlayed || 0;
      if (timestamp > mostRecentTimestamp) {
        mostRecentTimestamp = timestamp;
        inProgressScene = scene;
      }
    } else {
      // No progress - available to start
      incompleteScenes.push(scene);
    }
  });

  console.log('🧭 Smart Navigation Analysis:', {
    completed: completedScenes,
    incomplete: incompleteScenes, 
    inProgress: inProgressScene
  });

  // ✅ FIXED: SMART NAVIGATION LOGIC
  if (incompleteScenes.length === 0) {
    // All scenes completed - go to zone map (shows completion celebration)
    console.log('🏆 All scenes completed - going to zone map');
    onNewGame(); // ✅ Use existing function
    
  } else if (inProgressScene) {
    // Resume most recent in-progress scene
    console.log(`⏸️ Resuming in-progress scene: ${inProgressScene}`);
onContinue('symbol-mountain', inProgressScene); // ✅ FIXED: Pass parameters!
    
  } else {
    // Has incomplete scenes but none in progress - show zone map for selection
    console.log('🗺️ Showing zone map for scene selection');
    onNewGame(); // ✅ Use existing function that goes to zone/map
  }
};*/
  
// 🔄 REPLACE the handleContinue function in CleanGameWelcomeScreen.jsx:
const handleContinue = () => {
  console.log('🚀 SIMPLE: Continue Journey clicked');
  
  // ✅ DEAD SIMPLE: Check if there's a saved scene location
  const resumeLocation = SimpleSceneManager.getCurrentScene();
  
  if (resumeLocation) {
    console.log('➡️ SIMPLE: Resuming saved scene:', resumeLocation);
    onContinue(resumeLocation.zone, resumeLocation.scene);
  } else {
    console.log('🗺️ SIMPLE: No saved scene, going to map');
    onNewGame();
  }
};

  const handleNewGame = () => {
    console.log('🚀 Choose Scene clicked - clean handoff');
    // Always go to map zone for scene selection (this allows replay)
    onNewGame();
  };
  
  const confirmNewGame = () => {
    console.log('🚀 New game confirmed - clean handoff');
    GameStateManager.resetGame();
    setShowNewGameConfirm(false);
    onNewGame();
  };
  
  // Calculate progress safely
  const getProgress = () => {
    if (!currentProfile) return { totalStars: 0, completedScenes: 0, percentage: 0 };
    
    try {
      const gameProgress = GameStateManager.getGameProgress();
      return {
        totalStars: gameProgress?.totalStars || 0,
        completedScenes: gameProgress?.completedScenes || 0,
        percentage: Math.min(100, Math.max(0, (gameProgress?.completedScenes || 0) * 10))
      };
    } catch (error) {
      console.error('Progress calculation error:', error);
      return { totalStars: 0, completedScenes: 0, percentage: 0 };
    }
  };
  
  const progress = getProgress();
  
  // Show profile selector if needed
  if (showProfileSelector) {
    return (
      <CleanProfileSelector
        onProfileSelect={handleProfileCreated}
        onClose={() => setShowProfileSelector(false)}
        profiles={profiles}
      />
    );
  }
  
  // Main menu for selected profile (only shown when profile is selected)
  if (!currentProfile) {
    // This should rarely happen due to initialization logic, but safety fallback
    return (
      <div className="clean-welcome-overlay">
        <div className="clean-welcome-content">
          <h1>Loading Profile...</h1>
          <button onClick={() => setShowProfileSelector(true)}>
            Select Profile
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="clean-welcome-overlay">
      <div className="clean-welcome-content">
{(() => {
  const welcomeMsg = getWelcomeMessage();
  return (
    <>
      <h1 className="welcome-title">{welcomeMsg.title}</h1>
      <p className="welcome-subtitle">{welcomeMsg.subtitle}</p>
    </>
  );
})()}        
       

  {/* ✨ ENHANCED: Better profile layout */}
        <div className="enhanced-profile-section">
          <div className="profile-header">
            <div className="profile-avatar-container">
              {(() => {
                const getAnimalId = (avatarData) => {
                  // If it's already an animal name, use it
                  if (typeof avatarData === 'string' && ['owl', 'panda', 'tiger', 'mouse'].includes(avatarData)) {
                    return avatarData;
                  }
                  
                  // Convert emoji to animal name
                  const emojiToAnimal = {
                    '🦉': 'owl', 
                    '🐼': 'panda', 
                    '🐯': 'tiger', 
                    '🐭': 'mouse',
                    '😃': 'owl' // Default smiley to owl
                  };
                  
                  return emojiToAnimal[avatarData] || 'owl';
                };

                const animalId = getAnimalId(currentProfile.avatar);
                
                return (
                  <img 
                    className="profile-avatar-large" 
                    src={`/images/new-explorer-${animalId}.png`}
                    alt={currentProfile.name}
                    onError={(e) => {
                      // Fallback to emoji if image doesn't load
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'profile-avatar-fallback';
                      fallback.textContent = currentProfile.avatar;
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                );
              })()}
            </div>
            
            <div className="profile-info">
              <h2 className="profile-name-large">{currentProfile.name}</h2>
              <div className="profile-role">Explorer of Symbol Mountain</div>
            </div>
          </div>
          
          <button 
            className="change-explorer-btn"
            onClick={handleBackToProfiles}
          >
            <span className="btn-icon">🔄</span>
            Choose Different Explorer
          </button>
        </div>
        
        {/* ✨ NEW: Recent Achievement Banner */}
        <RecentAchievementBanner achievement={getRecentAchievement()} />
        
        {/* 🔍 DEBUG: Show progress detection (remove in production) */}
        <div className="debug-info">
          DEBUG: hasProgress = {hasProgress ? 'TRUE' : 'FALSE'} | 
          Profile Stars: {progress.totalStars} | 
          Profile Scenes: {progress.completedScenes}
        </div>
        
        {/* 🌟 ALWAYS show both options when profile is selected */}
        <div className="overall-progress">
<h3>{getWelcomeMessage().progressTitle}</h3>          
          {hasProgress && (
            <>
              <div className="progress-stats">
                <div className="stat">
                  <span className="stat-value">{progress.completedScenes}</span>
                  <span className="stat-label">Scenes Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{progress.totalStars}</span>
                  <span className="stat-label">Stars Collected</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{progress.percentage}%</span>
                  <span className="stat-label">Adventure Complete</span>
                </div>
              </div>
              
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large"
                  style={{width: `${progress.percentage}%`}}
                />
              </div>
            </>
          )}
          
          {!hasProgress && (
            <p className="no-progress-text">
              Choose your path through the magical Symbol Mountain!
            </p>
          )}
        </div>
        
        {/* ✨ ENHANCED: Action buttons with smarter text */}
        <div className="welcome-actions">
          
            {(() => {
  const welcomeMsg = getWelcomeMessage();
  return (
    <button className="primary-btn enhanced-btn" onClick={handleContinue}>
      {welcomeMsg.buttonText.main}
      <span className="sub-text">{welcomeMsg.buttonText.sub}</span>
    </button>
  );
})()}
          
          <button className="secondary-btn" onClick={handleNewGame}>
            {hasProgress ? 'Choose Scene' : 'Explore Scenes'}
            <span className="sub-text">
              {hasProgress ? 'Pick any scene to play or replay' : 'Select which scene to start with'}
            </span>
          </button>
        </div>
      </div>
      
      {showNewGameConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <div className="confirm-icon">🤔</div>
            <h3>Reset All Progress?</h3>
            <p>
              This will erase {currentProfile.name}'s current progress. 
              You can also just pick any scene to replay without losing progress!
            </p>
            <div className="confirm-progress">
              <span>Current Progress: {progress.totalStars} stars</span>
              <span>{progress.completedScenes} scenes completed</span>
            </div>
            <div className="confirm-buttons">
              <button 
                className="confirm-yes-btn"
                onClick={confirmNewGame}
              >
                Yes, Reset Everything
              </button>
              <button 
                className="confirm-no-btn"
                onClick={() => setShowNewGameConfirm(false)}
              >
                No, Keep Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanGameWelcomeScreen;