import React, { useState, useEffect } from 'react';
import { 
  GameButton, 
  Celebration
} from '../..';
import DraggableItem from '../interactive/DraggableItem';
import DropZone from '../interactive/DropZone';
import { useAudio } from '../../Context/AudioContext';
import { useProgress } from '../../Context/ProgressContext';
// Import the CSS file
import './dragDropTest.css';

// Sample categorization game for items associated with Lord Ganesha
const GaneshaCategorizationGame = () => {
  // Audio context for sound effects
  const audio = useAudio ? useAudio() : { playSound: () => {} };
  
  // Progress context for tracking completion
  const progress = useProgress ? useProgress() : { updateProgress: () => {} };
  
  // Items to be categorized
  const [items] = useState([
    { id: 'item1', data: { type: 'food', name: 'Modak', image: '/placeholder.png' } },
    { id: 'item2', data: { type: 'food', name: 'Laddoo', image: '/placeholder.png' } },
    { id: 'item3', data: { type: 'symbol', name: 'Lotus', image: '/placeholder.png' } },
    { id: 'item4', data: { type: 'symbol', name: 'Om', image: '/placeholder.png' } },
    { id: 'item5', data: { type: 'animal', name: 'Mouse', image: '/placeholder.png' } },
    { id: 'item6', data: { type: 'animal', name: 'Elephant', image: '/placeholder.png' } },
  ]);
  
  // Categories/drop zones
  const [categories] = useState([
    { id: 'food', name: 'Ganesha\'s Favorite Foods', acceptTypes: ['food'] },
    { id: 'symbol', name: 'Sacred Symbols', acceptTypes: ['symbol'] },
    { id: 'animal', name: 'Animal Friends', acceptTypes: ['animal'] },
  ]);
  
  // Game state
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [itemLocations, setItemLocations] = useState({});
  
  // Track item availability and validity separately
  const [availableItems, setAvailableItems] = useState(
    items.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {})
  );
  
  // Count correctly placed items
  const countCorrectlyPlacedItems = () => {
    return Object.entries(itemLocations).filter(
      ([itemId, zoneId]) => {
        const item = items.find(i => i.id === itemId);
        return item && item.data.type === zoneId;
      }
    ).length;
  };
  
  // Check for game completion
  useEffect(() => {
    // Update score based on correctly placed items
    const correctCount = countCorrectlyPlacedItems();
    setScore(correctCount);
    
    // Check if all items are correctly placed
    if (correctCount === items.length && !isComplete) {
      setIsComplete(true);
      
      // Show celebration after a short delay
      setTimeout(() => {
        setShowCelebration(true);
        
        // Update progress
        if (progress.updateProgress) {
          progress.updateProgress(100);
        }
      }, 500);
    }
  }, [itemLocations, items.length, isComplete, progress]);
  
  // Handle item drag start
  const handleDragStart = (itemId, itemData) => {
    console.log(`Started dragging item: ${itemId}`, itemData);
  };
  
  // Handle item drag end
  const handleDragEnd = (itemId) => {
    console.log(`Drag ended for item: ${itemId}`);
  };
  
  // Handle item drop on a zone
  const handleDrop = (zoneId, item) => {
    console.log(`Item ${item.id} dropped on ${zoneId}`);
    
    // Increment attempts
    setAttempts(prev => prev + 1);
    
    // Check if the drop is valid (correct category)
    const isCorrect = item.data && item.data.type === zoneId;
    
    if (isCorrect) {
      // Update item location for correct drops only
      setItemLocations(prev => ({
        ...prev,
        [item.id]: zoneId
      }));
      
      // Make the item unavailable for dragging
      setAvailableItems(prev => ({
        ...prev,
        [item.id]: false
      }));
      
      // Check if game is now complete after this correct drop
      const updatedLocations = { ...itemLocations, [item.id]: zoneId };
      const correctlyPlaced = Object.entries(updatedLocations).filter(
        ([itemId, locationZoneId]) => {
          const matchingItem = items.find(i => i.id === itemId);
          return matchingItem && matchingItem.data.type === locationZoneId;
        }
      ).length;
      
      if (correctlyPlaced === items.length) {
        setIsComplete(true);
        
        // Show celebration after a short delay
        setTimeout(() => {
          setShowCelebration(true);
          
          // Update progress
          if (progress.updateProgress) {
            progress.updateProgress(100);
          }
        }, 500);
      }
    } else {
      // For incorrect drops, do not update location
      // This will cause the item to bounce back
      console.log(`Incorrect drop - "${item.data.name}" bounced back`);
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setIsComplete(false);
    setShowCelebration(false);
    setItemLocations({});
    
    // Make all items available again
    setAvailableItems(
      items.reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {})
    );
    
    if (progress.updateProgress) {
      progress.updateProgress(0);
    }
  };
  
  // Calculate accuracy percentage
  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  
  return (
    <div className="categorization-game">
      <div className="game-stats">
        <div>Score: {score} / {items.length}</div>
        <div>Accuracy: {accuracy}%</div>
      </div>
      
      <h2>Items to Categorize:</h2>
      <div className="draggable-items">
        {items.map(item => {
          // Only show items that are still available
          if (!availableItems[item.id]) {
            return null;
          }
          
          return (
            <DraggableItem
              key={item.id}
              id={item.id}
              data={item.data}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              disabled={isComplete}
            >
              <div className="item-card">
                <img src={item.data.image} alt={item.data.name} />
                <p>{item.data.name}</p>
              </div>
            </DraggableItem>
          );
        })}
      </div>
      
      {/* Show completion message when all items are correctly placed */}
      {score === items.length && (
        <div className="completion-message">
          <p>All items categorized correctly!</p>
        </div>
      )}
      
      <h2>Categories:</h2>
      <div className="drop-zones">
        {categories.map(category => (
          <div key={category.id} className="category-container">
            <h4>{category.name}</h4>
            <DropZone
              id={category.id}
              acceptTypes={category.acceptTypes} // Only accept correct types
              onDrop={(item) => handleDrop(category.id, item)}
              disabled={isComplete}
              className="drop-zone"
            >
              {/* Container for dropped items */}
              <div className="dropped-items-container">
                {Object.entries(itemLocations)
                  .filter(([itemId, zoneId]) => zoneId === category.id)
                  .map(([itemId]) => {
                    const item = items.find(i => i.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div 
                        key={itemId} 
                        className="dropped-item"
                      >
                        <img src={item.data.image} alt={item.data.name} />
                        <p>{item.data.name}</p>
                      </div>
                    );
                  })}
              </div>
              
              {/* Show placeholder when empty */}
              {!Object.values(itemLocations).includes(category.id) && (
                <div className="drop-placeholder">
                  <p>Drop items here</p>
                </div>
              )}
            </DropZone>
          </div>
        ))}
      </div>
      
      <div className="game-controls">
        <GameButton onClick={resetGame}>
          RESET GAME
        </GameButton>
      </div>
      
      {/* Celebration when game is complete */}
      {showCelebration && (
        <Celebration 
          show={showCelebration} 
          type="confetti"
        />
      )}
      
      <div className="footer">
        Drag and Drop Testing Environment
      </div>
    </div>
  );
};

export default GaneshaCategorizationGame;