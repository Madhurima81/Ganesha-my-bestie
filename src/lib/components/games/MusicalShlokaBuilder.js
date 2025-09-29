import React, { useState, useEffect, useRef } from 'react';

const MusicalShlokaBuilder = () => {
  const [words, setWords] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [arrangedWords, setArrangedWords] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [draggedWord, setDraggedWord] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [celebration, setCelebration] = useState(false);
  
  // Audio context ref
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  
  // Define the shloka lines and their translations
  const shlokaLines = [
    {
      original: "Vakratunda Mahakaya",
      translation: "O Lord with the curved trunk and a mighty body",
      words: ["Vakratunda", "Mahakaya"],
      notes: [261.63, 293.66] // C4, D4 notes
    },
    {
      original: "Suryakoti Samaprabha",
      translation: "Who shines with the brilliance of ten million suns",
      words: ["Suryakoti", "Samaprabha"],
      notes: [329.63, 349.23] // E4, F4 notes
    },
    {
      original: "Nirvighnam Kuru Me Deva",
      translation: "Please make my path free from obstacles",
      words: ["Nirvighnam", "Kuru", "Me", "Deva"],
      notes: [392.00, 440.00, 466.16, 523.25] // G4, A4, A#4, C5 notes
    },
    {
      original: "Sarva-Kaaryeshu Sarvada",
      translation: "In all my work, always",
      words: ["Sarva-Kaaryeshu", "Sarvada"],
      notes: [587.33, 659.25] // D5, E5 notes
    }
  ];
  
  // Colors for the words
  const wordColors = [
    "#FF9800", "#2196F3", "#4CAF50", "#9C27B0", 
    "#FF5722", "#795548", "#607D8B", "#FFC107", 
    "#E91E63", "#3F51B5"
  ];
  
  // Initialize game on component mount and when currentLine changes
  useEffect(() => {
    if (currentLine < shlokaLines.length) {
      initializeGame(currentLine);
    }
  }, [currentLine]);
  
  // Initialize audio context
  useEffect(() => {
    // Create AudioContext only when needed to avoid browser autoplay restrictions
    const handleUserInteraction = () => {
      if (!audioContextRef.current) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
        } catch (e) {
          console.error('Web Audio API is not supported in this browser:', e);
        }
      }
      
      // Remove the event listeners once audioContext is created
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Initialize the game for the current line
  const initializeGame = (lineIndex) => {
    const currentLineWords = [...shlokaLines[lineIndex].words];
    // Shuffle the words
    const shuffledWords = currentLineWords
      .map(word => ({ word, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.word);
    
    setWords(shuffledWords);
    setTargetWords(currentLineWords);
    setArrangedWords(Array(currentLineWords.length).fill(null));
    setMessage(`Arrange the words to form: "${shlokaLines[lineIndex].original}"`);
  };
  
  // Play a note for a word
  const playNote = (note, duration = 0.5) => {
    if (!audioContextRef.current) return;
    
    // Stop any currently playing sound
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    // Create oscillator
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.value = note;
    
    // Apply fade in/out to avoid clicks
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration);
    
    oscillatorRef.current = oscillator;
  };
  
  // Play a melody for the full line
  const playLineAudio = (lineIndex) => {
    if (!audioContextRef.current || isPlaying) return;
    
    setIsPlaying(true);
    
    const line = shlokaLines[lineIndex];
    const notes = line.notes;
    const noteDuration = 0.6; // seconds
    
    let time = audioContextRef.current.currentTime;
    
    // Play each note with a delay
    notes.forEach((note, index) => {
      setTimeout(() => {
        playNote(note, noteDuration);
      }, index * noteDuration * 1000);
    });
    
    // Set playing to false after all notes have played
    setTimeout(() => {
      setIsPlaying(false);
    }, notes.length * noteDuration * 1000);
  };
  
  // Play the full shloka
  const playFullShloka = () => {
    if (!audioContextRef.current || isPlaying) return;
    
    setIsPlaying(true);
    
    let delay = 0;
    const noteDuration = 0.6; // seconds
    
    // Play each line with a pause between lines
    shlokaLines.forEach((line, lineIndex) => {
      line.notes.forEach((note, noteIndex) => {
        setTimeout(() => {
          playNote(note, noteDuration);
        }, delay);
        delay += noteDuration * 1000;
      });
      
      // Add a pause between lines
      delay += 800; // 800ms pause between lines
    });
    
    // Set playing to false after all notes have played
    setTimeout(() => {
      setIsPlaying(false);
    }, delay);
  };
  
  // Handle starting to drag a word
  const handleDragStart = (e, word, index, from) => {
    setDraggedWord({ word, index, from });
    
    // Play the corresponding note
    if (from === 'words' && currentLine < shlokaLines.length) {
      const wordIndex = shlokaLines[currentLine].words.indexOf(word);
      if (wordIndex !== -1) {
        playNote(shlokaLines[currentLine].notes[wordIndex]);
      }
    }
    
    // Required for Firefox
    e.dataTransfer.setData('text/plain', word);
  };
  
  // Handle dropping a word
  const handleDrop = (e, dropIndex, to) => {
    e.preventDefault();
    
    if (!draggedWord) return;
    
    const { word, index, from } = draggedWord;
    
    if (from === 'words' && to === 'arranged') {
      // Move from word bank to arranged area
      if (arrangedWords[dropIndex] === null) {
        // Update arrays
        const newWords = [...words];
        newWords.splice(index, 1);
        
        const newArranged = [...arrangedWords];
        newArranged[dropIndex] = word;
        
        setWords(newWords);
        setArrangedWords(newArranged);
        
        // Check if the arrangement is correct
        checkArrangement(newArranged);
      }
    } else if (from === 'arranged' && to === 'words') {
      // Move from arranged area back to word bank
      const newArranged = [...arrangedWords];
      newArranged[index] = null;
      
      setWords([...words, word]);
      setArrangedWords(newArranged);
    } else if (from === 'arranged' && to === 'arranged') {
      // Swap positions within arranged area
      if (index !== dropIndex) {
        const newArranged = [...arrangedWords];
        newArranged[index] = arrangedWords[dropIndex];
        newArranged[dropIndex] = word;
        
        setArrangedWords(newArranged);
        
        // Check if the arrangement is correct
        checkArrangement(newArranged);
      }
    }
    
    setDraggedWord(null);
    setDragOverIndex(null);
  };
  
  // Check if the current arrangement is correct
  const checkArrangement = (arrangement) => {
    // Check if all slots are filled
    if (arrangement.includes(null)) return;
    
    // Check if the arrangement matches the target
    const isCorrect = arrangement.every((word, i) => word === targetWords[i]);
    
    if (isCorrect) {
      // Play the melody for the correct line
      playLineAudio(currentLine);
      
      // Set success message
      setMessage(`Great job! "${shlokaLines[currentLine].original}" is correct!`);
      
      // Move to the next line or complete the game
      setTimeout(() => {
        if (currentLine < shlokaLines.length - 1) {
          setCurrentLine(currentLine + 1);
        } else {
          setGameComplete(true);
          setCelebration(true);
          setMessage("Amazing! You've completed the entire shloka!");
          
          // Play the full shloka melody as a reward
          setTimeout(() => {
            playFullShloka();
          }, 1000);
          
          // Turn off celebration after a few seconds
          setTimeout(() => {
            setCelebration(false);
          }, 5000);
        }
      }, 2000);
    }
  };
  
  // Handle drag over to show dropzone
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };
  
  // Restart the game
  const handleRestart = () => {
    setCurrentLine(0);
    setGameComplete(false);
    setCelebration(false);
  };
  
  return (
    <div className="musical-shloka-builder" style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#5D1049', marginBottom: '10px' }}>
        Musical Shloka Builder
      </h2>
      
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
        Arrange the words in the correct order to build the Vakratunda shloka.
        Each word has a unique musical tone!
      </p>
      
      {/* Progress bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Progress:</span>
          <span>{currentLine}/{shlokaLines.length} lines</span>
        </div>
        <div style={{ 
          height: '10px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${(currentLine / shlokaLines.length) * 100}%`, 
            height: '100%', 
            backgroundColor: '#4CAF50',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>
      
      {/* Current task message */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <p style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>{message}</p>
      </div>
      
      {/* Translation area */}
      {currentLine < shlokaLines.length && (
        <div style={{ 
          backgroundColor: '#FFF9C4', 
          padding: '15px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#5D4037' }}>
            Meaning: {shlokaLines[currentLine].translation}
          </p>
        </div>
      )}
      
      {/* Arranged words area */}
      {!gameComplete && (
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          minHeight: '60px',
          padding: '15px',
          backgroundColor: '#E8EAF6',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
        }}>
          {arrangedWords.map((word, index) => (
            <div 
              key={`arranged-${index}`}
              style={{ 
                width: '120px', 
                height: '45px',
                border: '2px dashed',
                borderColor: dragOverIndex === index ? '#4CAF50' : '#ccc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: word ? wordColors[index % wordColors.length] : 'transparent',
                color: word ? 'white' : 'transparent',
                fontWeight: 'bold',
                cursor: word ? 'grab' : 'default',
                transition: 'all 0.2s ease'
              }}
              onDrop={(e) => handleDrop(e, index, 'arranged')}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              draggable={!!word}
              onDragStart={(e) => word && handleDragStart(e, word, index, 'arranged')}
            >
              {word || 'Drop here'}
            </div>
          ))}
        </div>
      )}
      
      {/* Word bank */}
      {!gameComplete && (
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          minHeight: '60px',
          padding: '15px',
          backgroundColor: '#FFF',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {words.map((word, index) => (
            <div 
              key={`word-${index}`}
              style={{ 
                padding: '10px 15px',
                backgroundColor: wordColors[shlokaLines[currentLine].words.indexOf(word) % wordColors.length],
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'grab',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transform: draggedWord && draggedWord.word === word ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, word, index, 'words')}
              onClick={() => playNote(shlokaLines[currentLine].notes[shlokaLines[currentLine].words.indexOf(word)])}
            >
              {word}
            </div>
          ))}
          
          {/* Drop area to return words */}
          <div 
            style={{ 
              width: '100%',
              height: '40px',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              marginTop: '10px',
              display: words.length === 0 ? 'none' : 'flex'
            }}
            onDrop={(e) => handleDrop(e, null, 'words')}
            onDragOver={(e) => e.preventDefault()}
          >
            Drop here to return a word
          </div>
        </div>
      )}
      
      {/* Completed message and play button */}
      {gameComplete && (
        <div style={{ 
          backgroundColor: '#E8F5E9', 
          padding: '20px', 
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2E7D32', marginTop: '0' }}>
            Complete Shloka: Vakratunda Mahakaya
          </h3>
          
          {shlokaLines.map((line, index) => (
            <p key={index} style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
              {line.original}
            </p>
          ))}
          
          <button 
            onClick={playFullShloka}
            disabled={isPlaying}
            style={{
              backgroundColor: isPlaying ? '#90CAF9' : '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isPlaying ? 'default' : 'pointer',
              marginTop: '15px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '15px auto'
            }}
          >
            {isPlaying ? 'Playing...' : 'Play Full Shloka Melody'}
          </button>
        </div>
      )}
      
      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {!gameComplete && currentLine < shlokaLines.length && (
          <button 
            onClick={() => playLineAudio(currentLine)}
            disabled={isPlaying}
            style={{
              backgroundColor: isPlaying ? '#90CAF9' : '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: isPlaying ? 'default' : 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            🎵 Play Melody
          </button>
        )}
        
        {!gameComplete && (
          <button 
            onClick={() => initializeGame(currentLine)}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            🔄 Reset Words
          </button>
        )}
        
        {gameComplete && (
          <button 
            onClick={handleRestart}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            🔄 Start Again
          </button>
        )}
      </div>
      
      {/* Celebration effect */}
      {celebration && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 8 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 1;
            const color = ['#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0'][Math.floor(Math.random() * 5)];
            
            return (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: '-10px',
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: '50%',
                  animation: `confettiFall ${animationDuration}s ease-in ${animationDelay}s forwards`
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default MusicalShlokaBuilder;