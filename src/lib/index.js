// Main export file for the library

// Import animation components
import AnimatedElement from './components/animation/AnimatedElement';

// Import feedback components
import Celebration from './components/feedback/Celebration';
import Popup from './components/feedback/Popup';
import ProgressBar from './components/feedback/ProgressBar';

// Import interactive components
import GameButton from './components/interactive/GameButton';
import InteractiveElement from './components/interactive/InteractiveElement';
import DraggableItem from './components/interactive/DraggableItem';
import DropZone from './components/interactive/DropZone';

// Import hooks
import useAnimation from './hooks/useAnimation';
import useAudio from './hooks/useAudio';
import useDragAndDrop from './hooks/useDragAndDrop';
import useGameState from './hooks/useGameState';
import useImagePreload from './hooks/useImagePreload';
import useResponsiveLayout from './hooks/useResponsiveLayout';

// Import Context
import { AudioProvider, useAudio as useAudioContext } from './Context/AudioContext';
import { ProgressProvider, useProgress } from './Context/ProgressContext';

// Export animation components
export { AnimatedElement };

// Export feedback components
export { Celebration, Popup, ProgressBar };

// Export interactive components
export { GameButton, InteractiveElement, DraggableItem, DropZone };

// Export hooks
export {
  useAnimation,
  useAudio,
  useDragAndDrop,
  useGameState,
  useImagePreload,
  useResponsiveLayout
};

// Export Context Providers
export {
  AudioProvider,
  useAudioContext,
  ProgressProvider,
  useProgress
};

// Export everything as a default object
export default {
  // Components
  AnimatedElement,
  Celebration,
  Popup,
  ProgressBar,
  GameButton,
  InteractiveElement,
  DraggableItem,
  DropZone,
  
  // Hooks
  useAnimation,
  useAudio,
  useDragAndDrop,
  useGameState,
  useImagePreload,
  useResponsiveLayout,
  
  // Context
  AudioProvider,
  useAudioContext,
  ProgressProvider,
  useProgress
};