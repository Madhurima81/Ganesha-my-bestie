// GameWelcomeScreen.jsx - Complete rewrite with better progress detection

import React, { useState, useEffect } from 'react';
import GameStateManager from '../../services/GameStateManager';
import ProfileSelector from './ProfileSelector';
import './GameWelcomeScreen.css';

// Access the class to get static properties
const GameStateManagerClass = GameStateManager.constructor;

const GameWelcomeScreen = ({ onContinue, onNewGame }) => {
  console.log('GameWelcomeScreen rendering');
  
  const [profiles, setProfiles] = useState({});
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showProfileCreator, setShowProfileCreator] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  
  // Debug state
  console.log('Component state:', {
    showProfileCreator,
    showMainMenu,
    profileCount: Object.keys(profiles).length,
    currentProfileId: currentProfile?.id,
    hasProgress
  });
  
  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);
  
  const loadProfiles = () => {
    console.log('Loading profiles...');
    const gameProfiles = GameStateManager.getProfiles();
    setProfiles(gameProfiles?.profiles || {});
    
    // Get active profile and set it in component state
    const activeProfileId = localStorage.getItem('activeProfileId');
    console.log('Active profile ID from localStorage:', activeProfileId);
    
    if (activeProfileId && gameProfiles.profiles && gameProfiles.profiles[activeProfileId]) {
      const profile = gameProfiles.profiles[activeProfileId];
      console.log('Setting active profile:', profile);
      setCurrentProfile(profile);
      setShowMainMenu(true);
      
      // Check if this profile has any progress
      checkProfileProgress(activeProfileId);
    }
  };
  
  // Directly check localStorage for ANY signs of progress
  const checkProfileProgress = (profileId) => {
    if (!profileId) return false;
    
    console.log('Checking progress for profile:', profileId);
    let foundProgress = false;
    
    // Step 1: Check profile stats first (fastest)
    try {
      const gameProfiles = JSON.parse(localStorage.getItem('gameProfiles') || '{"profiles":{}}');
      if (gameProfiles.profiles && gameProfiles.profiles[profileId]) {
        const profile = gameProfiles.profiles[profileId];
        if (profile.totalStars > 0 || profile.completedScenes > 0) {
          console.log('Found progress in profile stats:', profile);
          foundProgress = true;
        }
      }
    } catch (e) {
      console.error('Error checking profile stats:', e);
    }
    
    // Step 2: Check game progress
    if (!foundProgress) {
      try {
        const progressKey = `${profileId}_gameProgress`;
        const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
        if (progressData.totalStars > 0 || progressData.completedScenes > 0) {
          console.log('Found progress in game progress:', progressData);
          foundProgress = true;
        }
      } catch (e) {
        console.error('Error checking game progress:', e);
      }
    }
    
    // Step 3: Check individual scene states (most thorough)
    if (!foundProgress) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(profileId) && key.includes('_state')) {
          try {
            const stateData = JSON.parse(localStorage.getItem(key) || '{}');
            
            // Check for ANY sign of progress in the scene
            if (stateData.stars > 0 || 
                stateData.completed || 
    Object.keys(stateData).length > 2) {  // Has meaningful state beyond defaults
              console.log('Found progress in scene state:', key, stateData);
              foundProgress = true;
              break;
            }
          } catch (e) {
            console.error(`Error checking scene state ${key}:`, e);
          }
        }
      }
    }
    
    console.log('Profile progress check result:', foundProgress);
    setHasProgress(foundProgress);
    return foundProgress;
  };
  
  const calculateOverallProgress = () => {
    if (!currentProfile) {
      return {
        completedScenes: 0,
        totalScenes: 0,
        totalStars: 0,
        maxStars: 0,
        percentage: 0
      };
    }
    
    // Get the game state for the current profile
    const gameProgress = GameStateManager.getGameProgress();
    const completedScenes = gameProgress?.completedScenes || 0;
    const totalStars = gameProgress?.totalStars || 0;
    
    // Use the class to access ZONES
    const ZONES = GameStateManagerClass.ZONES;
    
    if (!ZONES) {
      console.error("GameStateManager.ZONES is undefined or null");
      return {
        completedScenes: completedScenes,
        totalScenes: 0,
        totalStars: totalStars,
        maxStars: 0,
        percentage: 0
      };
    }
    
    const totalScenes = Object.values(ZONES)
      .reduce((sum, zone) => sum + zone.scenes.length, 0);
    
    return {
      completedScenes: completedScenes,
      totalScenes,
      totalStars: totalStars,
      maxStars: totalScenes * 3,
      percentage: totalScenes > 0 ? 
        Math.round((completedScenes / totalScenes) * 100) : 0
    };
  };
  
  // Get current zone name
  const getCurrentZoneName = () => {
    if (!currentProfile) return 'Symbol Mountain';
    
    const ZONES = GameStateManagerClass.ZONES;
    
    if (!ZONES) {
      console.error("GameStateManager.ZONES is undefined");
      return 'Symbol Mountain';
    }
    
    const gameProgress = GameStateManager.getGameProgress();
    const currentZone = gameProgress?.currentZone || 'symbol-mountain';
    const zone = ZONES[currentZone];
    return zone ? zone.name : 'Symbol Mountain';
  };
  
  const handleProfileSelect = (profileId) => {
    console.log('Profile selected:', profileId);
    // Set the selected profile as active
    GameStateManager.setActiveProfile(profileId);
    
    // Load the selected profile
    const selectedProfile = profiles[profileId];
    setCurrentProfile(selectedProfile);
    
    // Check if this profile has progress
    checkProfileProgress(profileId);
    
    setShowMainMenu(true);
  };
  
  const handleProfileCreated = (profileId) => {
    setShowProfileCreator(false);
    loadProfiles();
    handleProfileSelect(profileId);
  };
  
  const handleBackToProfiles = () => {
    setShowMainMenu(false);
    setCurrentProfile(null);
    setHasProgress(false);
  };
  
  const handleContinue = () => {
    if (currentProfile) {
      console.log('Continuing game for profile:', currentProfile.id);
      onContinue();
    }
  };
  
  const handleNewGame = () => {
    if (hasProgress) {
      // Show confirmation if there's existing progress
      setShowNewGameConfirm(true);
    } else {
      // No progress to lose, start new game directly
      console.log('No existing progress, starting fresh game');
      GameStateManager.resetGame();
      onNewGame();
    }
  };
  
  const confirmNewGame = () => {
    console.log('Confirmed new game, resetting progress');
    GameStateManager.resetGame();
    setShowNewGameConfirm(false);
    onNewGame();
  };
  
  const progress = calculateOverallProgress();
  const profileArray = Object.values(profiles);
  
  // Show profile creator if requested
  if (showProfileCreator) {
    console.log('Showing ProfileSelector');
    return (
      <ProfileSelector
        onProfileSelect={handleProfileCreated}
        onClose={() => {
          console.log('Closing ProfileSelector');
          setShowProfileCreator(false);
        }}
        currentProfileId={null}
      />
    );
  }
  
  // If no profile is selected yet, show the profile selector
  if (!showMainMenu || !currentProfile) {
    return (
      <div className="game-welcome-overlay">
        <div className="game-welcome-content">
          <h1>Welcome to Symbol Mountain Adventure!</h1>
          <p className="welcome-subtitle">Who's playing today?</p>
          
          {/* Show existing profiles and create new option */}
          <div className="profile-selection-grid" onClick={(e) => e.stopPropagation()}>
            {profileArray.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className="profile-select-card"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleProfileSelect(profile.id);
                }}
                style={{ borderColor: profile.color }}
              >
                <div className="profile-select-avatar">{profile.avatar}</div>
                <div className="profile-select-name">{profile.name}</div>
                <div className="profile-select-stats">
                  <span>⭐ {profile.totalStars || 0}</span>
                  <span>📍 {profile.completedScenes || 0}</span>
                </div>
              </button>
            ))}
            
            {/* Add new profile button if less than 4 profiles */}
            {profileArray.length < 4 && (
              <button
                type="button"
                className="profile-select-card new-profile"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('New Explorer clicked');
                  setShowProfileCreator(true);
                }}
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
  
  // Show main menu for selected profile
  return (
    <div className="game-welcome-overlay">
      <div className="game-welcome-content">
        <h1>Welcome Back, {currentProfile.name}!</h1>
        
        {/* Profile display with back button */}
        <div className="current-profile-display">
          <button 
            className="back-to-profiles-btn"
            onClick={handleBackToProfiles}
          >
            ← Choose Different Explorer
          </button>
          <div 
            className="profile-badge"
            style={{ backgroundColor: currentProfile.color + '30' }}
          >
            <span className="profile-avatar">{currentProfile.avatar}</span>
            <span className="profile-name">{currentProfile.name}</span>
          </div>
        </div>
        
        {hasProgress ? (
          <>
            {/* Progress display */}
            <div className="overall-progress">
              <h3>Your Journey So Far</h3>
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
                  <span className="stat-label">Game Complete</span>
                </div>
              </div>
              
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large"
                  style={{width: `${progress.percentage}%`}}
                />
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="welcome-actions">
              <button className="primary-btn" onClick={handleContinue}>
                Continue Journey
                <span className="sub-text">
                  Resume from {getCurrentZoneName()}
                </span>
              </button>
              
              <button className="secondary-btn" onClick={handleNewGame}>
                New Adventure
                <span className="sub-text">Start fresh from the beginning</span>
              </button>
            </div>
          </>
        ) : (
          /* No saved progress for this profile */
          <div className="new-game-welcome">
            <p>Ready to begin your adventure through magical lands?</p>
            <button className="start-btn" onClick={handleNewGame}>
              Start Adventure
            </button>
          </div>
        )}
      </div>
      
      {/* New game confirmation */}
      {showNewGameConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <div className="confirm-icon">🤔</div>
            <h3>Start a New Adventure?</h3>
            <p>
              Starting a new adventure will erase {currentProfile.name}'s 
              current progress. Are you sure?
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
                Yes, Start New
              </button>
              <button 
                className="confirm-no-btn"
                onClick={() => setShowNewGameConfirm(false)}
              >
                No, Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameWelcomeScreen;