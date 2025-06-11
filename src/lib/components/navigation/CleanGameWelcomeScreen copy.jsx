// GameWelcomeScreen.jsx - CLEAN VERSION - No State Conflicts
import React, { useState, useEffect } from 'react';
import GameStateManager from '../../services/GameStateManager';
import CleanProfileSelector from './CleanProfileSelector';
import './CleanGameWelcomeScreen.css';

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
      
      // Check for active profile
      const activeProfileId = localStorage.getItem('activeProfileId');
      if (activeProfileId && profilesObj[activeProfileId]) {
        const profile = profilesObj[activeProfileId];
        setCurrentProfile(profile);
        console.log('🔍 Active profile found, checking progress...');
        checkProgress(activeProfileId);
      } else if (Object.keys(profilesObj).length === 0) {
        // No profiles exist - show profile selector
        setShowProfileSelector(true);
      } else {
        console.log('🔍 No active profile but profiles exist');
        setHasProgress(false);
      }
    } catch (error) {
      console.error('Clean initialization error:', error);
      setProfiles({});
    }
  };
  
  const checkProgress = (profileId) => {
    if (!profileId) return;
    
    try {
      console.log('🔍 Checking progress for profile:', profileId);
      
      // Method 1: Check profile stats
      const gameProfiles = JSON.parse(localStorage.getItem('gameProfiles') || '{"profiles":{}}');
      if (gameProfiles.profiles && gameProfiles.profiles[profileId]) {
        const profile = gameProfiles.profiles[profileId];
        if (profile.totalStars > 0 || profile.completedScenes > 0) {
          console.log('✅ Found progress in profile stats:', { stars: profile.totalStars, scenes: profile.completedScenes });
          setHasProgress(true);
          return;
        }
      }
      
      // Method 2: Check game progress
      const progressKey = `${profileId}_gameProgress`;
      const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
      if (progressData.totalStars > 0 || progressData.completedScenes > 0) {
        console.log('✅ Found progress in game progress:', progressData);
        setHasProgress(true);
        return;
      }
      
      // Method 3: Check for any scene states (most thorough)
      let foundSceneProgress = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(profileId) && key.includes('_state')) {
          try {
            const stateData = JSON.parse(localStorage.getItem(key) || '{}');
            if (stateData.stars > 0 || stateData.completed || stateData.phase !== 'initial') {
              console.log('✅ Found progress in scene state:', key, stateData);
              foundSceneProgress = true;
              break;
            }
          } catch (e) {
            // Skip invalid state data
          }
        }
      }
      
      console.log('🔍 Final progress result:', foundSceneProgress);
      setHasProgress(foundSceneProgress);
    } catch (error) {
      console.error('Progress check error:', error);
      setHasProgress(false);
    }
  };
  
  const handleProfileSelect = (profileId) => {
    try {
      console.log('🎯 Profile selected:', profileId);
      GameStateManager.setActiveProfile(profileId);
      
      // Load the selected profile
      const selectedProfile = profiles[profileId];
      setCurrentProfile(selectedProfile);
      
      // IMPORTANT: Always check progress after selecting profile
      console.log('🔍 About to check progress for selected profile...');
      checkProgress(profileId);
      
      setShowProfileSelector(false);
    } catch (error) {
      console.error('Profile selection error:', error);
    }
  };
  
  const handleProfileCreated = (profileId) => {
    // Reload profiles and select new one
    initializeClean();
    handleProfileSelect(profileId);
  };
  
  const handleBackToProfiles = () => {
    setCurrentProfile(null);
    setHasProgress(false);
    setShowProfileSelector(true);
  };
  
  const handleContinue = () => {
    console.log('🚀 Continue clicked - clean handoff');
    if (hasProgress) {
      // Resume from last played location
      onContinue();
    } else {
      // No progress - start fresh but go to map for scene selection
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
  
  // Show profile selection grid if no current profile
  if (!currentProfile) {
    const profileArray = Object.values(profiles);
    
    return (
      <div className="clean-welcome-overlay">
        <div className="clean-welcome-content">
          <h1>Welcome to Symbol Mountain Adventure!</h1>
          <p className="welcome-subtitle">Who's playing today?</p>
          
          <div className="profile-selection-grid">
            {profileArray.map((profile) => (
              <button
                key={profile.id}
                className="profile-select-card"
                onClick={() => handleProfileSelect(profile.id)}
                style={{ borderColor: profile.color || '#8B4513' }}
              >
                <div className="profile-select-avatar">{profile.avatar}</div>
                <div className="profile-select-name">{profile.name}</div>
                <div className="profile-select-stats">
                  <span>⭐ {profile.totalStars || 0}</span>
                  <span>📍 {profile.completedScenes || 0}</span>
                </div>
              </button>
            ))}
            
            {profileArray.length < 4 && (
              <button
                className="profile-select-card new-profile"
                onClick={() => setShowProfileSelector(true)}
              >
                <div className="profile-select-avatar">+</div>
                <div className="profile-select-name">New Explorer</div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Main menu for selected profile
  return (
    <div className="clean-welcome-overlay">
      <div className="clean-welcome-content">
        <h1>Welcome Back, {currentProfile.name}!</h1>
        
        <div className="current-profile-display">
          <button 
            className="back-to-profiles-btn"
            onClick={handleBackToProfiles}
          >
            ← Choose Different Explorer
          </button>
          <div 
            className="profile-badge"
            style={{ backgroundColor: (currentProfile.color || '#8B4513') + '30' }}
          >
            <span className="profile-avatar">{currentProfile.avatar}</span>
            <span className="profile-name">{currentProfile.name}</span>
          </div>
        </div>
        
        {/* 🔍 DEBUG: Show progress detection */}
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginBottom: '10px', 
          textAlign: 'center',
          background: '#f0f0f0',
          padding: '8px',
          borderRadius: '8px'
        }}>
          DEBUG: hasProgress = {hasProgress ? 'TRUE' : 'FALSE'} | 
          Profile Stars: {progress.totalStars} | 
          Profile Scenes: {progress.completedScenes}
        </div>
        
        {/* 🌟 ALWAYS show both options when profile is selected */}
        <div className="overall-progress">
          <h3>{hasProgress ? 'Your Journey So Far' : 'Ready for Adventure'}</h3>
          
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
            <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', margin: '20px 0' }}>
              Choose your path through the magical Symbol Mountain!
            </p>
          )}
        </div>
        
        {/* 🌟 ALWAYS show both options */}
        <div className="welcome-actions">
          <button className="primary-btn" onClick={handleContinue}>
            {hasProgress ? 'Continue Journey' : 'Start Adventure'}
            <span className="sub-text">
              {hasProgress ? 'Resume from where you left off' : 'Begin your magical journey'}
            </span>
          </button>
          
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