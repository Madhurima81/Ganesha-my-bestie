import React, { useState } from 'react';

const SoundEffects = () => {
  // This component displays a set of sound effect buttons children can interact with
  
  // For a real implementation, you would replace these with actual audio files
  // The sound URLs would be pointers to your hosted audio files
  const soundEffects = [
    { name: 'Cat', emoji: '🐱', sound: 'https://example.com/cat.mp3' },
    { name: 'Dog', emoji: '🐶', sound: 'https://example.com/dog.mp3' },
    { name: 'Duck', emoji: '🦆', sound: 'https://example.com/duck.mp3' },
    { name: 'Cow', emoji: '🐮', sound: 'https://example.com/cow.mp3' },
    { name: 'Sheep', emoji: '🐑', sound: 'https://example.com/sheep.mp3' },
    { name: 'Frog', emoji: '🐸', sound: 'https://example.com/frog.mp3' },
    { name: 'Elephant', emoji: '🐘', sound: 'https://example.com/elephant.mp3' },
    { name: 'Bird', emoji: '🐦', sound: 'https://example.com/bird.mp3' },
  ];
  
  const [playingSound, setPlayingSound] = useState(null);
  
  const playSound = (soundUrl) => {
    // For demo purposes, we'll just show which sound would play
    // In a real implementation, you would play the actual sound
    setPlayingSound(soundUrl);
    
    // Reset after 2 seconds (simulating sound duration)
    setTimeout(() => {
      setPlayingSound(null);
    }, 2000);
    
    // In actual implementation:
    // const audio = new Audio(soundUrl);
    // audio.play();
  };
  
  return (
    <div className="sound-effects" style={{ maxWidth: '350px' }}>
      <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Animal Sounds</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '10px',
        marginBottom: '10px'
      }}>
        {soundEffects.map((effect, index) => (
          <button
            key={index}
            onClick={() => playSound(effect.sound)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.1s, background-color 0.3s',
              transform: playingSound === effect.sound ? 'scale(0.95)' : 'scale(1)',
              backgroundColor: playingSound === effect.sound ? '#e0f7fa' : '#f0f0f0'
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>{effect.emoji}</span>
            <span style={{ fontSize: '12px' }}>{effect.name}</span>
          </button>
        ))}
      </div>
      
      {playingSound && (
        <div style={{ 
          textAlign: 'center', 
          padding: '8px', 
          backgroundColor: '#e0f7fa', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <p>Playing sound... 🔊</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            (In a real implementation, you would hear the actual sound)
          </p>
        </div>
      )}
    </div>
  );
};

export default SoundEffects;