import React, { useState, useEffect } from 'react';
import GameStateManager from '../../services/GameStateManager';
import './ProfileSelector.css';

const ProfileSelector = ({ onProfileSelect, onClose, currentProfileId }) => {
  console.log('ProfileSelector component rendering');
  
  const [profiles, setProfiles] = useState({});
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('owl');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animal avatar options with your beautiful images
  const animalAvatars = [
    { id: 'owl', name: 'Wise Owl', emoji: '🦉', personality: 'Thoughtful and clever' },
    { id: 'panda', name: 'Gentle Panda', emoji: '🐼', personality: 'Kind and peaceful' },
    { id: 'tiger', name: 'Brave Tiger', emoji: '🐯', personality: 'Bold and adventurous' },
    { id: 'mouse', name: 'Quick Mouse', emoji: '🐭', personality: 'Swift and curious' }
  ];

  // Default color for all profiles
  const defaultColor = '#8B4513'; // Forest Brown

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    try {
      setIsLoading(true);
      const gameProfiles = GameStateManager.getProfiles();
      console.log('Loaded profiles:', gameProfiles);
      
      if (gameProfiles && gameProfiles.profiles) {
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

  // Updated handleCreateProfile without color selection
  const handleCreateProfile = () => {
    console.log('🎯 handleCreateProfile called!');
    
    if (!newProfileName.trim()) {
      console.log('❌ Name is empty, returning');
      return;
    }

    console.log('🎯 Current state:', {
      newProfileName,
      selectedAvatar
    });

    // Find the selected animal data
    const selectedAnimal = animalAvatars.find(animal => animal.id === selectedAvatar);
    console.log('🎯 Selected animal found:', selectedAnimal);
    
    try {
      // Pass the emoji and default color
      const avatarToSave = selectedAnimal?.emoji || '🦉';
      
      console.log('🎯 About to create profile with:', {
        name: newProfileName.trim(),
        avatar: avatarToSave,
        color: defaultColor
      });
      
      const newProfile = GameStateManager.createProfile(
        newProfileName.trim(),
        avatarToSave,  // Pass emoji directly
        defaultColor   // Use default color for all profiles
      );
      
      console.log('🎯 Profile created successfully:', newProfile);
      
      if (newProfile && newProfile.id) {
        // Reset form
        setNewProfileName('');
        setSelectedAvatar('owl');
        setShowCreateProfile(false);
        
        // Reload profiles and select the new one
        loadProfiles();
        
        // Call the callback with the profile ID
        onProfileSelect(newProfile.id);
      } else {
        console.error('❌ Failed to create profile - no profile returned');
        alert('Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      alert('Error creating profile. Please try again.');
    }
  };

  const handleSelectProfile = (profileId) => {
    console.log('Selecting profile:', profileId);
    onProfileSelect(profileId);
  };

  const confirmDelete = (profileId) => {
    try {
      GameStateManager.deleteProfile(profileId);
      loadProfiles();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  // Helper function to get animal ID from stored avatar
  const getAnimalId = React.useCallback((avatarData) => {
    console.log('🔍 getAnimalId called with:', avatarData);
    
    // Handle both old emoji format and new animal ID format
    if (typeof avatarData === 'string') {
      // If it's already an animal ID, return it
      if (['owl', 'panda', 'tiger', 'mouse'].includes(avatarData)) {
        console.log('✅ Avatar is animal ID:', avatarData);
        return avatarData;
      }
      
      // Check if it's an emoji (new format) and convert to animal ID for display
      const emojiToAnimal = {
        '🦉': 'owl',
        '🐼': 'panda', 
        '🐯': 'tiger',
        '🐭': 'mouse'
      };
      
      if (emojiToAnimal[avatarData]) {
        console.log('✅ Avatar is emoji, converted to:', emojiToAnimal[avatarData]);
        return emojiToAnimal[avatarData];
      }
    }
    
    console.log('⚠️ Avatar not recognized, defaulting to owl');
    return 'owl'; // Default fallback
  }, []);

  const profileArray = Object.values(profiles || {});
  const emptySlots = Math.max(0, 4 - profileArray.length);

  if (isLoading) {
    return (
      <div className="profile-selector-overlay">
        <div className="profile-selector-container">
          <div className="loading-content">
            <div className="loading-spinner">🌟</div>
            <div className="loading-text">Preparing your magical adventure...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selector-overlay">
      {/* Full screen forest background */}
      <div className="forest-background"></div>
      
      {/* Floating magical particles */}
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              animationDelay: `${i * 0.8}s`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="profile-selector-container">
        <h2 className="profile-title forest-title">Choose Your Forest Friend</h2>
        <p className="profile-subtitle">Who will join Ganesha on this magical journey?</p>
        
        <div className="profiles-grid">
          {profileArray.map((profile) => {
            const animalId = getAnimalId(profile.avatar);
            const animalData = animalAvatars.find(a => a.id === animalId) || animalAvatars[0];
            
            console.log('🎨 Rendering profile:', profile.name, 'with avatar:', profile.avatar, 'animalId:', animalId);
            
            return (
              <div 
                key={profile.id}
                className={`profile-card forest-card ${currentProfileId === profile.id ? 'current' : ''}`}
                style={{ 
                  borderColor: defaultColor, // Use default color for border
                  boxShadow: currentProfileId === profile.id ? `0 0 20px ${defaultColor}40` : undefined
                }}
                onClick={() => handleSelectProfile(profile.id)}
              >
                {/* Animal avatar image */}
                <div className="animal-avatar-container">
                  <img 
                    src={`/images/new-explorer-${animalId}.png`}
                    alt={animalData.name}
                    className="animal-avatar-image"
                    onError={(e) => {
                      console.error('Failed to load image:', e.target.src);
                      // Show emoji fallback if image fails
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div 
                    className="emoji-fallback" 
                    style={{
                      display: 'none',
                      fontSize: '60px',
                      textAlign: 'center',
                      lineHeight: '90px',
                      color: '#fff'
                    }}
                  >
                    {profile.avatar}
                  </div>
                </div>
                
                <div className="profile-content">
                  <div className="profile-name">{profile.name}</div>
                  <div className="animal-name">{animalData.name}</div>
                  <div className="profile-stats">
                    <span>⭐ {profile.totalStars || 0}</span>
                    <span>🎯 {profile.completedScenes || 0}</span>
                  </div>
                </div>
                
                <button 
                  className="delete-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(profile.id);
                  }}
                >
                  ×
                </button>
                
                {showDeleteConfirm === profile.id && (
                  <div className="delete-confirm-popup">
                    <p>Say goodbye to {profile.name}'s adventure?</p>
                    <div className="confirm-buttons">
                      <button onClick={() => confirmDelete(profile.id)} className="confirm-yes">Yes</button>
                      <button onClick={() => setShowDeleteConfirm(null)} className="confirm-no">Keep</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {[...Array(emptySlots)].map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="profile-card empty forest-card"
              onClick={() => setShowCreateProfile(true)}
            >
              <div className="add-profile">
                <div className="add-icon">✨</div>
                <div className="add-text">New Explorer</div>
                <div className="add-subtext">Join the adventure!</div>
              </div>
            </div>
          ))}
        </div>
        
        {showCreateProfile && (
          <div className="create-profile-modal">
            <h3>Create Your Forest Friend</h3>
            <p className="modal-subtitle">Choose your companion for the magical journey ahead!</p>
            
            <input
              type="text"
              placeholder="What's your name, explorer?"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              maxLength={12}
              className="name-input"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newProfileName.trim()) {
                  handleCreateProfile();
                }
              }}
            />
            
            <div className="avatar-selection">
              <p>Choose your forest animal guide:</p>
              <div className="avatar-grid">
                {animalAvatars.map((animal) => (
                  <div
                    key={animal.id}
                    className={`avatar-option animal-option ${selectedAvatar === animal.id ? 'selected' : ''}`}
                    onClick={() => {
                      console.log('🎯 Animal selected:', animal.id, animal.emoji);
                      setSelectedAvatar(animal.id);
                    }}
                  >
                    <img 
                      src={`/images/new-explorer-${animal.id}.png`}
                      alt={animal.name}
                      className="avatar-image"
                    />
                    <div className="animal-info">
                      <div className="animal-name-small">{animal.name}</div>
                      <div className="animal-personality">{animal.personality}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Color selection removed */}
            
            <div className="create-profile-buttons">
              <button 
                onClick={() => {
                  console.log('🎯 Begin Adventure clicked!', {
                    name: newProfileName,
                    avatar: selectedAvatar,
                    nameValid: !!newProfileName.trim()
                  });
                  handleCreateProfile();
                }}
                className="create-btn"
                disabled={!newProfileName.trim()}
                style={{
                  opacity: !newProfileName.trim() ? 0.5 : 1,
                  cursor: !newProfileName.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Begin Adventure ✨
              </button>
              <button 
                onClick={() => {
                  console.log('🎯 Maybe Later clicked!');
                  setShowCreateProfile(false);
                }}
                className="cancel-btn"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}
        
        {onClose && (
          <button className="close-selector" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;