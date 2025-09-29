import React, { useState, useRef, useEffect } from 'react';

const BeforeAfterScenes = () => {
  // State variables
  const [currentScene, setCurrentScene] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [animateTransition, setAnimateTransition] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Refs
  const containerRef = useRef(null);
  
  // Define the transformation scenes
  const scenes = [
    {
      id: 'test-anxiety',
      title: 'Test Anxiety',
      beforeDescription: "Feeling nervous and worried about a big test. The questions look hard and scary!",
      afterDescription: "After saying the shloka, you feel calm and focused. The test doesn't seem so scary anymore.",
      beforeEmoji: '😰',
      afterEmoji: '😌',
      beforeColor: '#ffcdd2', // Light red
      afterColor: '#c8e6c9',  // Light green
      character: '👧'
    },
    {
      id: 'messy-room',
      title: 'Messy Room',
      beforeDescription: "Your room is very messy with toys everywhere. It feels overwhelming to clean up!",
      afterDescription: "After saying the shloka, you have the energy and focus to organize your room step by step.",
      beforeEmoji: '😩',
      afterEmoji: '😊',
      beforeColor: '#ffecb3', // Light amber
      afterColor: '#bbdefb',  // Light blue
      character: '👦'
    },
    {
      id: 'new-friends',
      title: 'Making New Friends',
      beforeDescription: "It's hard to make new friends. You feel shy and don't know what to say.",
      afterDescription: "After saying the shloka, you feel confident and brave enough to introduce yourself!",
      beforeEmoji: '😳',
      afterEmoji: '🤗',
      beforeColor: '#e1bee7', // Light purple
      afterColor: '#dcedc8',  // Light lime
      character: '🧒'
    },
    {
      id: 'difficult-homework',
      title: 'Difficult Homework',
      beforeDescription: "The homework problems are so difficult. You're stuck and feeling frustrated.",
      afterDescription: "After saying the shloka, your mind clears and you can think of solutions!",
      beforeEmoji: '🤯',
      afterEmoji: '🧠',
      beforeColor: '#b3e5fc', // Light blue
      afterColor: '#f8bbd0',  // Light pink
      character: '👧'
    },
    {
      id: 'sports-game',
      title: 'Big Game Day',
      beforeDescription: "It's the big game and you're feeling pressure. What if you don't play well?",
      afterDescription: "After saying the shloka, you feel strong, focused, and ready to do your best!",
      beforeEmoji: '😟',
      afterEmoji: '💪',
      beforeColor: '#d1c4e9', // Light deep purple
      afterColor: '#ffe0b2',  // Light orange
      character: '👦'
    }
  ];
  
  // Handle slider drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setShowHint(false);
    setHasInteracted(true);
    updateSliderPosition(e);
  };
  
  // Handle slider drag move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateSliderPosition(e);
  };
  
  // Handle slider drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setShowHint(false);
    setHasInteracted(true);
    updateSliderPositionTouch(e);
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    updateSliderPositionTouch(e);
    // Prevent scrolling while dragging
    e.preventDefault();
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Update slider position based on mouse event
  const updateSliderPosition = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate percentage (clamped between 0 and 100)
    const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(percentage);
  };
  
  // Update slider position based on touch event
  const updateSliderPositionTouch = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate percentage (clamped between 0 and 100)
    const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(percentage);
  };
  
  // Play the shloka audio (simulated)
  const playShlokaAudio = () => {
    if (audioPlaying) return;
    
    setAudioPlaying(true);
    setShowHint(false);
    setHasInteracted(true);
    
    // Simulate the shloka being played
    // In a real implementation, this would play an actual audio file
    
    // Start the transformation animation
    setTimeout(() => {
      setAnimateTransition(true);
      setSliderPosition(100); // Move slider all the way to "after" state
      
      // Reset animation state after completion
      setTimeout(() => {
        setAnimateTransition(false);
        setAudioPlaying(false);
      }, 3000);
    }, 1500);
  };
  
  // Go to next scene
  const goToNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
      resetScene();
    }
  };
  
  // Go to previous scene
  const goToPrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      resetScene();
    }
  };
  
  // Reset the current scene
  const resetScene = () => {
    setSliderPosition(50);
    setAnimateTransition(false);
    setShowHint(!hasInteracted);
  };
  
  // Set up event listeners for document to handle mouse/touch up outside component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);
  
  // Get current scene
  const currentSceneData = scenes[currentScene];
  
  return (
    <div className="before-after-scenes-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '15px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      position: 'relative'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        marginBottom: '15px'
      }}>
        Before & After Saying the Shloka
      </h2>
      
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: '#333',
        marginBottom: '20px'
      }}>
        Slide to see how Ganesha's shloka transforms each situation!
      </p>
      
      {/* Scene navigation and title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        backgroundColor: 'white',
        padding: '10px 15px',
        borderRadius: '30px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={goToPrevScene}
          disabled={currentScene === 0}
          style={{
            backgroundColor: currentScene === 0 ? '#e0e0e0' : '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentScene === 0 ? 'default' : 'pointer',
            fontSize: '16px'
          }}
        >
          ←
        </button>
        
        <h3 style={{ 
          margin: 0, 
          color: '#5D1049',
          fontSize: 'clamp(1rem, 3vw, 1.2rem)'
        }}>
          {currentSceneData.title}
        </h3>
        
        <button
          onClick={goToNextScene}
          disabled={currentScene === scenes.length - 1}
          style={{
            backgroundColor: currentScene === scenes.length - 1 ? '#e0e0e0' : '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentScene === scenes.length - 1 ? 'default' : 'pointer',
            fontSize: '16px'
          }}
        >
          →
        </button>
      </div>
      
      {/* Slider scene display */}
      <div 
        ref={containerRef}
        className="slider-container"
        style={{
          position: 'relative',
          height: '250px',
          borderRadius: '15px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          cursor: 'ew-resize',
          userSelect: 'none',
          touchAction: 'none' // Prevents scrolling while dragging on mobile
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* "Before" side */}
        <div 
          className="before-side"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: currentSceneData.beforeColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            zIndex: 1
          }}
        >
          <div style={{ 
            fontSize: '50px',
            marginBottom: '15px' 
          }}>
            {currentSceneData.beforeEmoji}
          </div>
          <div style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            textAlign: 'center',
            maxWidth: '80%'
          }}>
            {currentSceneData.beforeDescription}
          </div>
          
          {/* Character in before state */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            fontSize: '40px'
          }}>
            {currentSceneData.character}
          </div>
        </div>
        
        {/* "After" side */}
        <div 
          className="after-side"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: currentSceneData.afterColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            transition: animateTransition ? 'clip-path 2s ease-in-out' : 'none',
            zIndex: 2
          }}
        >
          <div style={{ 
            fontSize: '50px',
            marginBottom: '15px' 
          }}>
            {currentSceneData.afterEmoji}
          </div>
          <div style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            textAlign: 'center',
            maxWidth: '80%'
          }}>
            {currentSceneData.afterDescription}
          </div>
          
          {/* Character in after state */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            fontSize: '40px'
          }}>
            {currentSceneData.character}
          </div>
          
          {/* Ganesha appears in after state */}
          {sliderPosition > 60 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '40px',
              animation: 'fadeIn 0.5s'
            }}>
              🐘
            </div>
          )}
        </div>
        
        {/* Slider handle */}
        <div 
          className="slider-handle"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '4px',
            backgroundColor: 'white',
            transform: 'translateX(-50%)',
            zIndex: 3,
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            transition: animateTransition ? 'left 2s ease-in-out' : 'none'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30px',
            height: '30px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}>
            ↔️
          </div>
        </div>
        
        {/* Before/After labels */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '20px',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          zIndex: 4
        }}>
          Before
        </div>
        
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '20px',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          zIndex: 4
        }}>
          After
        </div>
        
        {/* Hint animation */}
        {showHint && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'sliderHint 1.5s infinite',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}>
            <div style={{ 
              fontSize: '24px',
              marginBottom: '5px'
            }}>
              👆
            </div>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
            }}>
              Slide to see the change!
            </div>
          </div>
        )}
      </div>
      
      {/* Play shloka button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={playShlokaAudio}
          disabled={audioPlaying}
          style={{
            backgroundColor: audioPlaying ? '#e0e0e0' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 25px',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            cursor: audioPlaying ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            animation: showHint && !hasInteracted ? 'pulse 1.5s infinite' : 'none'
          }}
        >
          <span style={{ fontSize: '20px' }}>
            {audioPlaying ? '🔊' : '▶️'}
          </span>
          {audioPlaying ? 'Reciting Shloka...' : 'Say the Shloka!'}
        </button>
      </div>
      
      {/* Scene indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '15px'
      }}>
        {scenes.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentScene(index);
              resetScene();
            }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentScene === index ? '#FF9800' : '#e0e0e0',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: currentScene === index ? '0 0 5px rgba(255,152,0,0.5)' : 'none'
            }}
          />
        ))}
      </div>
      
      {/* Shloka text display */}
      <div style={{
        backgroundColor: audioPlaying ? '#FFF8E1' : 'white', // Light yellow during recitation
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'background-color 0.5s',
        marginBottom: '15px'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontStyle: 'italic',
          color: '#5D4037',
          animation: audioPlaying ? 'glow 1.5s infinite' : 'none'
        }}>
          "Vakratunda Mahakaya Suryakoti Samaprabha<br />
          Nirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada"
        </p>
      </div>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes sliderHint {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(255,193,7,0.5); }
          50% { text-shadow: 0 0 15px rgba(255,193,7,0.8); }
        }
      `}</style>
    </div>
  );
};

export default BeforeAfterScenes;