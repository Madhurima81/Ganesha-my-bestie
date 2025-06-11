import React, { useState } from 'react';
import FlipBook from '../../lib/components/flipbook/FlipBook';
import IntroScene from './scenes/intro/IntroScene';
import PondScene from './scenes/pond/PondScene';
import ForestScene from './scenes/forest/ForestScene';
import CaveScene from './scenes/cave/CaveScene';
import CompletionScene from './scenes/completion/CompletionScene';
import './SymbolMountain.css';

const SymbolMountain = ({ onComplete, onExit }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [completedScenes, setCompletedScenes] = useState([]);

  const scenes = [
    { id: 'intro', component: IntroScene, title: 'Welcome to Symbol Mountain' },
    { id: 'pond', component: PondScene, title: 'The Lotus Pond' },
    { id: 'forest', component: ForestScene, title: 'The Sacred Forest' },
    { id: 'cave', component: CaveScene, title: 'The Crystal Cave' },
    { id: 'completion', component: CompletionScene, title: 'Journey Complete!' }
  ];

  const handleSceneComplete = (sceneId) => {
    if (!completedScenes.includes(sceneId)) {
      setCompletedScenes([...completedScenes, sceneId]);
    }
    
    // Automatically go to next scene
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      // Zone complete
      onComplete();
    }
  };

  const handlePageChange = (pageIndex) => {
    setCurrentScene(pageIndex);
  };

  return (
    <div className="symbol-mountain-container">
      <FlipBook
        pages={scenes}
        currentPage={currentScene}
        onPageChange={handlePageChange}
        allowNavigation={true}
        showProgressBar={true}
      >
        {scenes.map((scene, index) => {
          const SceneComponent = scene.component;
          return (
            <div key={scene.id} className="scene-wrapper">
              <SceneComponent
                onComplete={() => handleSceneComplete(scene.id)}
                isActive={currentScene === index}
                onNavigate={setCurrentScene}
              />
            </div>
          );
        })}
      </FlipBook>
    </div>
  );
};

export default SymbolMountain;