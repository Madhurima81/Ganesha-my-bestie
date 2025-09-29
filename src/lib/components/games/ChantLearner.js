import React, { useState, useEffect, useRef } from 'react';
import { AudioButton } from './AudioPlayer';

// Interactive component to learn a chant line by line
const ChantLearner = ({ 
  chantLines = [
    { text: "Vakratunda Mahakaya", meaning: "O Lord with the curved trunk and a mighty body" },
    { text: "Suryakoti Samaprabha", meaning: "Who shines with the brilliance of ten million suns" },
    { text: "Nirvighnam Kuru Me Deva", meaning: "Please make my work free from obstacles" },
    { text: "Sarva-Kaaryeshu Sarvada", meaning: "In all actions, always" }
  ],
  chantTitle = "Vakratunda Mahakaya Mantra",
  audioFiles = [], // Array of audio URLs matching chantLines
  fullChantAudio = "", // URL for the full chant audio
  onComplete = () => {} // Callback when all lines are practiced
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [confetti, setConfetti] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  
  // Track completed lines
  useEffect(() => {
    setAllCompleted(completed.length === chantLines.length);
    
    if (completed.length === chantLines.length && !confetti) {
      onComplete();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [completed, chantLines.length, onComplete, confetti]);
  
  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Start recording
  const startRecording = async (lineIndex) => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { 'type' : 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordings(prev => ({
          ...prev,
          [lineIndex]: audioUrl
        }));
        
        if (!completed.includes(lineIndex)) {
          setCompleted(prev => [...prev, lineIndex]);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(lineIndex);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access your microphone. Please check permissions.");
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording !== false) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks from the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  // Move to next line
  const goToNextLine = () => {
    if (currentStep < chantLines.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowMeaning(false);
    }
  };
  
  // Move to previous line
  const goToPreviousLine = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowMeaning(false);
    }
  };
  
  // Confetti animation
  const renderConfetti = () => {
    const pieces = Array.from({ length: 50 }, (_, i) => {
      const style = {
        position: 'absolute',
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        backgroundColor: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#ff9800'][Math.floor(Math.random() * 5)],
        top: `-10px`,
        left: `${Math.random() * 100}%`,
        opacity: 1,
        borderRadius: '50%',
        animation: `confetti ${Math.random() * 3 + 2}s ease-in forwards`,
        animationDelay: `${Math.random() * 0.5}s`,
        zIndex: 1000,
      };
      
      return <div key={i} style={style} />;
    });
    
    return (
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <style>
          {`
            @keyframes confetti {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
            }
          `}
        </style>
        {pieces}
      </div>
    );
  };
  
  // Progress indicator
  const renderProgressDots = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px' }}>
        {chantLines.map((_, index) => (
          <div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: completed.includes(index) 
                ? '#4CAF50' 
                : currentStep === index 
                  ? '#2196F3' 
                  : '#e0e0e0',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div style={{ 
      position: 'relative', 
      backgroundColor: '#fff',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {confetti && renderConfetti()}
      
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#333',
        fontSize: '1.5rem'
      }}>
        {chantTitle}
      </h2>
      
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '1.3rem', 
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          {chantLines[currentStep].text}
        </div>
        
        {showMeaning && (
          <div style={{
            fontSize: '1rem',
            color: '#666',
            fontStyle: 'italic',
            animation: 'fadeIn 0.5s',
            marginTop: '10px'
          }}>
            Meaning: {chantLines[currentStep].meaning}
          </div>
        )}
        
        <button
          onClick={() => setShowMeaning(!showMeaning)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#2196F3',
            cursor: 'pointer',
            marginTop: '10px',
            fontSize: '0.9rem',
            textDecoration: 'underline'
          }}
        >
          {showMeaning ? 'Hide Meaning' : 'Show Meaning'}
        </button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        {audioFiles.length > currentStep ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AudioButton
              audioSrc={audioFiles[currentStep]}
              iconType="sound"
              size="large"
            />
            <span>Listen</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9e9e9e',
                cursor: 'not-allowed'
              }}
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            </button>
            <span>Audio unavailable</span>
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '20px', 
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => isRecording !== false ? stopRecording() : startRecording(currentStep)}
          style={{
            padding: '10px 20px',
            backgroundColor: isRecording !== false ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            transition: 'background-color 0.3s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          {isRecording !== false ? (
            <>
              <span style={{ 
                display: 'inline-block', 
                width: '12px', 
                height: '12px', 
                backgroundColor: 'white', 
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }}></span>
              Stop Recording
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              Record Your Voice
            </>
          )}
        </button>
        
        {recordings[currentStep] && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <audio 
              src={recordings[currentStep]} 
              controls 
              style={{ height: '40px' }}
            />
            <button
              onClick={() => {
                URL.revokeObjectURL(recordings[currentStep]);
                setRecordings(prev => {
                  const newRecordings = { ...prev };
                  delete newRecordings[currentStep];
                  return newRecordings;
                });
                setCompleted(prev => prev.filter(i => i !== currentStep));
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f44336',
                cursor: 'pointer'
              }}
              title="Delete recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <button
          onClick={goToPreviousLine}
          disabled={currentStep === 0}
          style={{
            padding: '8px 15px',
            backgroundColor: currentStep === 0 ? '#e0e0e0' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.7 : 1
          }}
        >
          Previous Line
        </button>
        
        <button
          onClick={goToNextLine}
          disabled={currentStep === chantLines.length - 1}
          style={{
            padding: '8px 15px',
            backgroundColor: currentStep === chantLines.length - 1 ? '#e0e0e0' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentStep === chantLines.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === chantLines.length - 1 ? 0.7 : 1
          }}
        >
          Next Line
        </button>
      </div>
      
      {renderProgressDots()}
      
      {allCompleted && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '10px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s'
        }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#2e7d32' }}>
            🎉 Congratulations! You've practiced all lines!
          </p>
          
          {fullChantAudio && (
            <div style={{ marginTop: '10px' }}>
              <p>Now try the full chant:</p>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <audio src={fullChantAudio} controls />
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              setCompleted([]);
              setCurrentStep(0);
              setRecordings({});
              setAllCompleted(false);
            }}
            style={{
              marginTop: '15px',
              padding: '8px 15px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Practice Again
          </button>
        </div>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ChantLearner;