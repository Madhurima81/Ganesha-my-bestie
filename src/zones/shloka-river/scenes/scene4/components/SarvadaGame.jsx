// zones/shloka-river/scenes/Scene4/components/SarvadaGame.jsx
// Thin wrapper for Sarvada game - connects gameConfig to MemoryGameEngine

import React from 'react';
import MemoryGameEngine from '../../../core/MemoryGameEngine';
import { getGameConfig } from '../../../configs/gameConfigs';

const SarvadaGame = ({
  isActive, hideElements, onPhaseComplete, onGameComplete, profileName,

  // Sarvada assets
  getSavButterflyHelperImage,     // Helper/clicker for sav
  getVaFawnHelperImage,            // Helper/clicker for va
  getDaHedgehogHelperImage,        // Helper/clicker for da
  getSavButterflySadImage,         // Initial state for sav
  getVaFawnSadImage,               // Initial state for va
  getDaHedgehogSadImage,           // Initial state for da
  getSavButterflyHappyImage,       // Reward state for sav
  getVaFawnHappyImage,             // Reward state for va
  getDaHedgehogHappyImage,         // Reward state for da

  // Mode control
  selectedMode, skipModeSelection,

  // Audio
  isAudioOn, playAudio
}) => {
  const gameConfig = getGameConfig('sarvada');

  const assetGetters = {
    // Clickers (animals that sing and you click)
    getSavButterflyHelperImage,
    getVaFawnHelperImage,
    getDaHedgehogHelperImage,

    // Initial state (sad animals)
    getSavButterflySadImage,
    getVaFawnSadImage,
    getDaHedgehogSadImage,

    // Reward state (happy animals)
    getSavButterflyHappyImage,
    getVaFawnHappyImage,
    getDaHedgehogHappyImage
  };

  return (
    <MemoryGameEngine
      gameConfig={gameConfig}
      assetGetters={assetGetters}
      isActive={isActive}
      hideElements={hideElements}
      onPhaseComplete={onPhaseComplete}
      onGameComplete={onGameComplete}
      profileName={profileName}
      selectedMode={selectedMode}
      skipModeSelection={skipModeSelection}
      isAudioOn={isAudioOn}
      playAudio={playAudio}
    />
  );
};

export default SarvadaGame;
