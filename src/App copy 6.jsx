// App.jsx - SIMPLE DOOR TESTING
import React from 'react';
//import CaveSceneFixed from './zones/meaning cave/scenes/VakratundaMahakaya/CaveSceneFixed.jsx'
import SuryakotiScene from './zones/meaning cave/scenes/suryakoti-samaprabha/SuryakotiScene.jsx'
//import SunCollectionGame from './zones/meaning cave/components/SunCollectionGame.jsx'
import NirvighnamScene from './zones/meaning cave/scenes/nirvighnam-kurumedeva/NirvighnamScene.jsx'


import { GameCoachProvider } from './lib/components/coach/GameCoach';
import './App.css';

function App() {
  const handleComplete = (data) => {
    console.log('Scene completed:', data);
  };

  const handleNavigate = (action) => {
    console.log('Navigation:', action);
  };

  return (
    <div className="App">
      <GameCoachProvider>
        <NirvighnamScene
          onComplete={handleComplete}
          onNavigate={handleNavigate}
          zoneId="cave-of-secrets"
          sceneId="vakratunda-mahakaya"
        />
      </GameCoachProvider>
    </div>
  );
}

export default App;