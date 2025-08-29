import React, { useState, useEffect, useRef } from 'react';
import './SanskritSidebar.css';

// Sanskrit word information structure
const defaultWordInfo = {
  vakratunda: {
    sanskrit: "वक्रतुण्ड",
    transliteration: "VAKRATUNDA",
    meaning: "Curved Trunk",
    scene: 1,
    learned: false,
    pronunciation: "/audio/vakratunda.mp3" // Audio file path
  },
  mahakaya: {
    sanskrit: "महाकाय", 
    transliteration: "MAHAKAYA",
    meaning: "Mighty Form",
    scene: 1,
    learned: false,
    pronunciation: "/audio/mahakaya.mp3"
  },
  suryakoti: {
    sanskrit: "सूर्यकोटि",
    transliteration: "SURYAKOTI", 
    meaning: "Million Suns",
    scene: 2,
    learned: false,
    pronunciation: "/audio/suryakoti.mp3"
  },
  samaprabha: {
    sanskrit: "समप्रभ",
    transliteration: "SAMAPRABHA",
    meaning: "Equal Brilliance", 
    scene: 2,
    learned: false,
    pronunciation: "/audio/samaprabha.mp3"
  },
  nirvighnam: {
    sanskrit: "निर्विघ्नं",
    transliteration: "NIRVIGHNAM",
    meaning: "Without Obstacles",
    scene: 3,
    learned: false,
    pronunciation: "/audio/nirvighnam.mp3"
  },
  kurume: {
    sanskrit: "कुरुमे",
    transliteration: "KURUME", 
    meaning: "Make It So",
    scene: 3,
    learned: false,
    pronunciation: "/audio/kurume.mp3"
  },
  deva: {
    sanskrit: "देव",
    transliteration: "DEVA",
    meaning: "Divine One",
    scene: 3,
    learned: false,
    pronunciation: "/audio/deva.mp3"
  },
  sarvakaryeshu: {
    sanskrit: "सर्वकार्येषु",
    transliteration: "SARVAKARYESHU",
    meaning: "In All Tasks",
    scene: 4,
    learned: false,
    pronunciation: "/audio/sarvakaryeshu.mp3"
  },
  sarvada: {
    sanskrit: "सर्वदा",
    transliteration: "SARVADA",
    meaning: "Always",
    scene: 4, 
    learned: false,
    pronunciation: "/audio/sarvada.mp3"
  }
};

const SanskritSidebar = ({ 
  learnedWords = {},
  currentZone = "cave-of-secrets",
  currentScene = 1,
  unlockedScenes = [1],
  slidingEnabled = true,
  mode = "meanings", // "meanings" or "chanting"
  onWordClick,
  onSlideChange,
  className = ''
}) => {
  const [currentRow, setCurrentRow] = useState(0); // 0 = first row, 1 = second row
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [animatingWord, setAnimatingWord] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  
  const sidebarRef = useRef(null);
  const autoSlideTimeoutRef = useRef(null);

  // Combine default info with passed learned words
// ✅ CORRECT - deep merge preserves sanskrit text while updating learned state
const wordData = Object.keys(defaultWordInfo).reduce((acc, wordId) => {
  acc[wordId] = {
    ...defaultWordInfo[wordId],  // Keep sanskrit, transliteration, etc.
    ...(learnedWords[wordId] || {})  // Only override learned state
  };
  return acc;
}, {});

  // 🔍 ADD THIS DEBUG CODE TEMPORARILY
//console.log('=== SANSKRIT SIDEBAR DEBUG ===');
//console.log('learnedWords prop:', learnedWords);
//console.log('wordData combined:', wordData);
//console.log('Row 1 words:', rows[0]);
//console.log('First word (vakratunda):', wordData.vakratunda);
//console.log('Second word (mahakaya):', wordData.mahakaya);
//console.log('=== END DEBUG ===');

  // Define row structure - logical grouping of words
  const rows = [
    // Row 1: Scenes 1-2 (primary learning)
    ['vakratunda', 'mahakaya', 'suryakoti', 'samaprabha', 'nirvighnam'],
    // Row 2: Scenes 3-4 (advanced learning)  
    ['kurume', 'deva', 'sarvakaryeshu', 'sarvada']
  ];

  // Auto-slide back to first row after inactivity
  useEffect(() => {
    if (currentRow === 1) {
      autoSlideTimeoutRef.current = setTimeout(() => {
        slideToRow(0);
      }, 10000); // 10 seconds idle time
    }
    
    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, [currentRow]);

  // Auto-slide to show newly learned words
  useEffect(() => {
    const newlyLearned = Object.keys(wordData).find(wordId => 
      wordData[wordId].learned && !animatingWord
    );
    
    if (newlyLearned) {
      setAnimatingWord(newlyLearned);
      
      // Find which row contains the newly learned word
      const wordRowIndex = rows.findIndex(row => row.includes(newlyLearned));
      if (wordRowIndex !== -1 && wordRowIndex !== currentRow) {
        slideToRow(wordRowIndex);
      }
      
      // Clear animation after effect
      setTimeout(() => {
        setAnimatingWord(null);
      }, 2000);
    }
  }, [learnedWords]);

  const slideToRow = (rowIndex) => {
    if (rowIndex === currentRow || isSliding) return;
    
    setIsSliding(true);
    setCurrentRow(rowIndex);
    
    // Callback for parent component
    if (onSlideChange) {
      onSlideChange(rowIndex);
    }
    
    // Reset sliding state after animation
    setTimeout(() => {
      setIsSliding(false);
    }, 300);
  };

  const handleWordClick = (wordId) => {
    const word = wordData[wordId];
    
    if (word.learned) {
      // Play pronunciation if available
      if (word.pronunciation) {
        playPronunciation(word.pronunciation);
      }
      
      // Show word information popup
      setSelectedWord(wordId);
      setShowPopup(true);
      
      // Callback for parent component
      if (onWordClick) {
        onWordClick(wordId, word);
      }
    }
  };

  const playPronunciation = (audioPath) => {
    try {
      const audio = new Audio(audioPath);
      audio.play().catch(console.warn); // Graceful failure for missing audio
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedWord(null);
  };

const getWordState = (wordId) => {
  const word = wordData[wordId];
  
  if (word.learned) return 'learned';
  
  // Special logic for vakratunda - only current when door is started
  /*if (wordId === 'vakratunda') {
    if (word.doorStarted) return 'current';  // Orange when door syllables placed
    return 'unlocked';  // Blue when available but not started
  }
  
  // Special logic for mahakaya - only current during stone phase
  if (wordId === 'mahakaya') {
    if (currentScene === 1 && word.doorStarted) return 'unlocked';  // Blue when vakratunda is being learned
    // Add stone phase check here later
    return 'locked';  // Grey until time to learn
  }*/

    // Both Scene 1 words follow same pattern as other scenes
if (wordId === 'vakratunda' || wordId === 'mahakaya') {
  if (word.learned) return 'learned';  // Gold when completed
  if (currentScene === 1) return 'unlocked';  // Blue when in Scene 1
  return 'locked';  // Grey in other scenes
}
  
  // Other words logic
  const isCurrentScene = word.scene === currentScene;
  const isUnlockedScene = unlockedScenes.includes(word.scene);
  
  if (isCurrentScene) return 'unlocked';  // Changed from 'current' to 'unlocked'
  if (isUnlockedScene) return 'unlocked';
  return 'locked';
};

  const canSlideLeft = currentRow > 0;
  const canSlideRight = currentRow < rows.length - 1;

  // Handle touch/swipe gestures
  const handleTouchStart = (e) => {
    if (!slidingEnabled) return;
    const touch = e.touches[0];
    sidebarRef.current.touchStartX = touch.clientX;
  };

  const handleTouchEnd = (e) => {
    if (!slidingEnabled || !sidebarRef.current.touchStartX) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - sidebarRef.current.touchStartX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && canSlideLeft) {
        slideToRow(currentRow - 1); // Swipe right = go to previous row
      } else if (deltaX < 0 && canSlideRight) {
        slideToRow(currentRow + 1); // Swipe left = go to next row
      }
    }
    
    sidebarRef.current.touchStartX = null;
  };

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`sanskrit-sidebar ${className} ${isSliding ? 'sliding' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide navigation arrows */}
        {slidingEnabled && (
          <>
            {canSlideLeft && (
              <button 
                className="slide-arrow slide-left"
                onClick={() => slideToRow(currentRow - 1)}
                aria-label="Previous words"
              >
                ◀
              </button>
            )}
            
            {canSlideRight && (
              <button 
                className="slide-arrow slide-right" 
                onClick={() => slideToRow(currentRow + 1)}
                aria-label="More words"
              >
                ▶
              </button>
            )}
          </>
        )}

        {/* Row container with sliding effect */}
        <div 
          className="sanskrit-rows-container"
          style={{
    transform: `translateX(${-currentRow * 50 + 22}%)`, // 🆕 ADD +5% offset to push content right
            transition: isSliding ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
          }}
        >
          {rows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={`sanskrit-row ${rowIndex === currentRow ? 'active' : ''}`}
            >
              {row.map((wordId) => {
                const word = wordData[wordId];
                const wordState = getWordState(wordId);
                const isAnimating = animatingWord === wordId;
                
                return (
                  <div
                    key={wordId}
                    className={`sanskrit-word ${wordState} ${isAnimating ? 'newly-learned' : ''}`}
                    onClick={() => handleWordClick(wordId)}
                    title={wordState === 'learned' ? 
                      `${word.meaning} - Click to hear pronunciation` : 
                      wordState === 'locked' ? 
                      `Complete Scene ${word.scene} to unlock` :
                      `Learn this in Scene ${word.scene}`
                    }
                  >
                   <div className="transliteration-text">{word.transliteration}</div>
<div className="sanskrit-text">{word.sanskrit}</div>
                    
                    {/* Learning progress indicator */}
                    {wordState === 'learned' && (
                      <div className="learned-indicator">✓</div>
                    )}
                    
                    {wordState === 'locked' && (
                      <div className="locked-indicator">🔒</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Row indicator dots */}
        {slidingEnabled && rows.length > 1 && (
          <div className="row-indicators">
            {rows.map((_, index) => (
              <button
                key={index}
                className={`row-dot ${index === currentRow ? 'active' : ''}`}
                onClick={() => slideToRow(index)}
                aria-label={`Go to row ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Word Information Popup */}
      {showPopup && selectedWord && (
        <div className="sanskrit-popup-overlay" onClick={closePopup}>
          <div className="sanskrit-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closePopup}>×</button>
            
            <div className="popup-sanskrit-display">
              <div className="popup-sanskrit-text">{wordData[selectedWord].sanskrit}</div>
              <div className="popup-transliteration">{wordData[selectedWord].transliteration}</div>
            </div>
            
            <h2 className="popup-title">
              {mode === "chanting" ? "Chant This Word" : "Word Meaning"}
            </h2>
            
            <p className="popup-meaning">
              <strong>Meaning:</strong> {wordData[selectedWord].meaning}
            </p>
            
            <p className="popup-scene-info">
              Learned in Scene {wordData[selectedWord].scene}
            </p>
            
            {/* Pronunciation button */}
            {wordData[selectedWord].pronunciation && (
              <button 
                className="popup-pronunciation-btn"
                onClick={() => playPronunciation(wordData[selectedWord].pronunciation)}
              >
                🔊 Listen Again
              </button>
            )}
            
            <button className="popup-continue-btn" onClick={closePopup}>
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SanskritSidebar;