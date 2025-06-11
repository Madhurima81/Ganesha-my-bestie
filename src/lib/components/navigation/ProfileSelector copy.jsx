import React, { useState, useEffect } from 'react';
import GameStateManager from '../../services/GameStateManager';
import './ProfileSelector.css';

const ProfileSelector = ({ onProfileSelect, onClose, currentProfileId }) => {
  const [profiles, setProfiles] = useState({});
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    try {
      setIsLoading(true);
      const gameProfiles = GameStateManager.getProfiles();
      console.log('Loaded profiles:', gameProfiles); // Debug log
      
      // Make absolutely sure we have a valid profiles object
      if (gameProfiles && typeof gameProfiles.profiles === 'object') {
        setProfiles(gameProfiles.profiles);
      } else {
        setProfiles({});
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      try {
        const newProfile = GameStateManager.createProfile(
          newProfileName.trim(),
          selectedAvatar,
          selectedColor
        );
        
        if (newProfile) {
          // Reset create form
          setNewProfileName('');
          setSelectedAvatar(0);
          setSelectedColor(0);
          setShowCreateProfile(false);
          
          // Reload profiles
          loadProfiles();
          
          // Auto-select the new profile
          handleSelectProfile(newProfile.id);
        } else {
          alert('Maximum 4 profiles allowed!');
        }
      } catch (error) {
        console.error('Error creating profile:', error);
        alert('Error creating profile. Please try again.');
      }
    }
  };

  const handleSelectProfile = (profileId) => {
    try {
      GameStateManager.setActiveProfile(profileId);
      onProfileSelect(profileId);
    } catch (error) {
      console.error('Error selecting profile:', error);
      alert('Error selecting profile. Please try again.');
    }
  };

  const handleDeleteProfile = (profileId) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirm(profileId);
  };

  const confirmDelete = () => {
    if (profileToDelete) {
      try {
        const success = GameStateManager.deleteProfile(profileToDelete);
        if (success) {
          loadProfiles();
          setShowDeleteConfirm(null);
          setProfileToDelete(null);
          
          // If deleted the current profile, we might need to handle that
          if (profileToDelete === currentProfileId) {
            // The parent component should handle this case
            console.log('Deleted current profile');
          }
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert('Error deleting profile. Please try again.');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
    setProfileToDelete(null);
  };

  // Safely get profile array - this is where the error might be
  let profileArray = [];
  try {
    if (profiles && typeof profiles === 'object') {
      profileArray = Object.values(profiles);
    }
  } catch (error) {
    console.error('Error creating profile array:', error);
    profileArray = [];
  }
  
  const emptySlots = Math.max(0, 4 - profileArray.length);

  // Safety check for PROFILE_AVATARS and PROFILE_COLORS
  const avatars = GameStateManager.PROFILE_AVATARS || ['🦁', '🐧', '🦊', '🐼', '🦝', '🐯', '🐨', '🦉'];
  const colors = GameStateManager.PROFILE_COLORS || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#DDA0DD', '#98FB98', '#FFB6C1'];

  if (isLoading) {
    return (
      <div className="profile-selector-overlay">
        <div className="profile-selector-container">
          <div className="loading">Loading profiles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selector-overlay">
      <div className="profile-selector-container">
        <h2 className="profile-title">Who's Playing?</h2>
        
        <div className="profiles-grid">
          {/* Existing profiles */}
          {profileArray.map((profile) => (
            <div 
              key={profile.id}
              className={`profile-card ${currentProfileId === profile.id ? 'current' : ''}`}
              style={{ 
                backgroundColor: (profile.color || '#FFFFFF') + '20', 
                borderColor: profile.color || '#CCCCCC' 
              }}
            >
              <div 
                className="profile-content"
                onClick={() => handleSelectProfile(profile.id)}
              >
                <div className="profile-avatar">{profile.avatar || '👤'}</div>
                <div className="profile-name">{profile.name || 'Unknown'}</div>
                <div className="profile-stats">
                  <span className="stars-count">⭐ {profile.totalStars || 0}</span>
                  <span className="progress-count">📍 {profile.completedScenes || 0}</span>
                </div>
              </div>
              
              {/* Delete button */}
              <button 
                className="delete-profile-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProfile(profile.id);
                }}
              >
                ×
              </button>
              
              {/* Delete confirmation */}
              {showDeleteConfirm === profile.id && (
                <div className="delete-confirm-popup">
                  <p>Delete {profile.name}'s adventure?</p>
                  <div className="confirm-buttons">
                    <button onClick={confirmDelete} className="confirm-yes">Yes</button>
                    <button onClick={cancelDelete} className="confirm-no">No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Empty slots */}
          {[...Array(emptySlots)].map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="profile-card empty"
              onClick={() => setShowCreateProfile(true)}
            >
              <div className="add-profile">
                <div className="add-icon">+</div>
                <div className="add-text">New Explorer</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Create profile form */}
        {showCreateProfile && (
          <div className="create-profile-modal">
            <h3>Create New Explorer</h3>
            
            <input
              type="text"
              placeholder="Enter your name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              maxLength="12"
              className="name-input"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newProfileName.trim()) {
                  handleCreateProfile();
                }
              }}
            />
            
            <div className="avatar-selection">
              <p>Choose your animal friend:</p>
              <div className="avatar-grid">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    className={`avatar-option ${selectedAvatar === index ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(index)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="color-selection">
              <p>Pick your favorite color:</p>
              <div className="color-grid">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${selectedColor === index ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="create-profile-buttons">
              <button 
                onClick={handleCreateProfile}
                className="create-btn"
                disabled={!newProfileName.trim()}
              >
                Start Adventure
              </button>
              <button 
                onClick={() => setShowCreateProfile(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Close button if needed */}
        {onClose && (
          <button className="close-selector" onClick={onClose}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;