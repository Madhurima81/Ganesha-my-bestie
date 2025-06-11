// SceneSelector.jsx - For navigating between scenes within a zone

import React from 'react';
import GameStateManager from '../../services/GameStateManager';
import './SceneSelector.css';

const SceneSelector = ({ currentZone, currentScene, onSceneSelect, onClose }) => {
  const zoneInfo = GameStateManager.ZONES[currentZone];
  const gameProgress = GameStateManager.getGameProgress();
  const zoneProgress = gameProgress.zones[currentZone];
  
  if (!zoneInfo || !zoneProgress) return null;
  
  const handleSceneClick = (sceneId) => {
    if (GameStateManager.isSceneUnlocked(currentZone, sceneId)) {
      onSceneSelect(sceneId);
      onClose();
    }
  };
  
  return (
    <div className="scene-selector-overlay">
      <div className="scene-selector-content">
        <h2>{zoneInfo.name} - Choose Your Scene</h2>
        
        <div className="scenes-grid">
          {zoneInfo.scenes.map((sceneId, index) => {
            const sceneProgress = zoneProgress.scenes[sceneId];
            const isUnlocked = GameStateManager.isSceneUnlocked(currentZone, sceneId);
            const isCurrent = sceneId === currentScene;
            
            return (
              <div
                key={sceneId}
                className={`scene-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                onClick={() => handleSceneClick(sceneId)}
              >
                <div className="scene-number">{index + 1}</div>
                <div className="scene-name">{getSceneName(sceneId)}</div>
                
                {isUnlocked && (
                  <div className="scene-stars">
                    {[...Array(3)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < (sceneProgress?.stars || 0) ? 'filled' : 'empty'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                )}
                
                {!isUnlocked && <div className="lock-icon">🔒</div>}
                
                {sceneProgress?.completed && (
                  <div className="completed-badge">✓</div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="zone-progress">
          <p>Zone Progress: {zoneProgress.stars} stars collected</p>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{width: `${(zoneProgress.stars / (zoneInfo.scenes.length * 3)) * 100}%`}}
            />
          </div>
        </div>
        
        <button className="close-btn" onClick={onClose}>
          Back to Scene
        </button>
      </div>
    </div>
  );
};

// Helper function to get human-readable scene names
const getSceneName = (sceneId) => {
  const names = {
    'pond': 'Lotus Pond',
    'temple': 'Sacred Temple',
    'garden': 'Symbol Garden',
    'waterfall': 'Mystic Waterfall',
    'summit': 'Mountain Summit',
    // Add more scene names as needed
  };
  
  return names[sceneId] || sceneId.charAt(0).toUpperCase() + sceneId.slice(1);
};

export default SceneSelector;