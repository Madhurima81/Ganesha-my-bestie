// zones/shloka-river/scenes/Scene4/components/SarvakaryeshuGame.jsx
// Thin wrapper for Sarvakaryeshu game - connects gameConfig to MemoryGameEngine

import React from 'react';
import MemoryGameEngine from '../../../core/MemoryGameEngine';
import { getGameConfig } from '../../../configs/gameConfigs';

const SarvakaryeshuGame = ({
  isActive, hideElements, onPhaseComplete, onGameComplete, profileName,

  // Sarvakaryeshu assets
  getSarSquirrelHelperImage,     // Helper/clicker for sar
  getVaBirdHelperImage,           // Helper/clicker for va
  getKarDuckHelperImage,          // Helper/clicker for kar
  getYeshuRabbitHelperImage,      // Helper/clicker for yeshu
  getSarSquirrelSadImage,         // Initial state for sar
  getVaBirdSadImage,              // Initial state for va
  getKarDuckSadImage,             // Initial state for kar
  getYeshuRabbitSadImage,         // Initial state for yeshu
  getSarSquirrelHappyImage,       // Reward state for sar
  getVaBirdHappyImage,            // Reward state for va
  getKarDuckHappyImage,           // Reward state for kar
  getYeshuRabbitHappyImage,       // Reward state for yeshu

  // Mode control
  selectedMode, skipModeSelection,

  // Audio
  isAudioOn, playAudio
}) => {
  const gameConfig = getGameConfig('sarvakaryeshu');

  // ⭐ DEBUG: Check if config was found
  if (!gameConfig) {
    console.error('❌ SarvakaryeshuGame: Config not found for "sarvakaryeshu"');
    console.log('Available configs:', Object.keys(require('../../../configs/gameConfigs').GAME_CONFIGS || {}));
    return <div style={{color: 'red', padding: '20px'}}>Error: Game config not found for sarvakaryeshu</div>;
  }

  const assetGetters = {
    // Clickers (animals that sing and you click)
    getSarSquirrelHelperImage,
    getVaBirdHelperImage,
    getKarDuckHelperImage,
    getYeshuRabbitHelperImage,

    // Initial state (sad animals)
    getSarSquirrelSadImage,
    getVaBirdSadImage,
    getKarDuckSadImage,
    getYeshuRabbitSadImage,

    // Reward state (happy animals)
    getSarSquirrelHappyImage,
    getVaBirdHappyImage,
    getKarDuckHappyImage,
    getYeshuRabbitHappyImage
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

export default SarvakaryeshuGame;
