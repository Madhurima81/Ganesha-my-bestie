import React, { useState } from 'react';
import ChantLearner from './ChantLearner';

const ChantLearnerDemo = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Example data for the Vakratunda Mahakaya mantra
  const chantLines = [
    { 
      text: "Vakratunda Mahakaya", 
      meaning: "O Lord with the curved trunk and a mighty body" 
    },
    { 
      text: "Suryakoti Samaprabha", 
      meaning: "Who shines with the brilliance of ten million suns" 
    },
    { 
      text: "Nirvighnam Kuru Me Deva", 
      meaning: "Please make my work free from obstacles" 
    },
    { 
      text: "Sarva-Kaaryeshu Sarvada", 
      meaning: "In all actions, always" 
    }
  ];
  
  // In a real application, these would be actual audio files
  // For this demo, they are placeholder URLs
  const audioFiles = [
    "/assets/audio/vakratunda-mahakaya.mp3",
    "/assets/audio/suryakoti-samaprabha.mp3",
    "/assets/audio/nirvighnam-kuru-me-deva.mp3",
    "/assets/audio/sarva-kaaryeshu-sarvada.mp3"
  ];
  
  const fullChantAudio = "/assets/audio/full-vakratunda-mantra.mp3";
  
  // Handle completion
  const handleComplete = () => {
    console.log("All chant lines practiced!");
    setShowCelebration(true);
    
    // Hide celebration after 5 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };
  
  return (
    <div className="chant-learner-demo" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Learn the Vakratunda Mahakaya Mantra
      </h1>
      
      {showCelebration && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.5s'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            maxWidth: '80%'
          }}>
            <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>
              Amazing Job! 🎉
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              You've mastered the Vakratunda Mahakaya mantra!
            </p>
            <img 
              src="/assets/images/happy-ganesha.png" 
              alt="Happy Ganesha"
              style={{ 
                width: '150px', 
                height: 'auto',
                marginBottom: '20px'
              }}
            />
            <button
              onClick={() => setShowCelebration(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
      
      <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 30px', color: '#666' }}>
        Practice each line of the mantra by listening and recording your voice. 
        Try to memorize the full mantra by the end of this exercise!
      </p>
      
      <ChantLearner
        chantLines={chantLines}
        chantTitle="Vakratunda Mahakaya Mantra"
        audioFiles={audioFiles}
        fullChantAudio={fullChantAudio}
        onComplete={handleComplete}
      />
      
      <div style={{ marginTop: '30px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        <p>
          Note: In a real application, you'll need to replace the audio file paths with 
          actual audio recordings of each mantra line.
        </p>
      </div>
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ChantLearnerDemo;