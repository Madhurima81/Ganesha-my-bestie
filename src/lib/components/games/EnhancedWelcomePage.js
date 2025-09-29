import React, { useState, useEffect } from 'react';
import ganeshaImage from '../assets/image/ganesh-welcome.png'; 
import mooshikaImage from '../assets/image/mouse-welcome.png'; 
import titleImage from '../assets/image/heading-welcome.png'; 

const EnhancedWelcomePage = ({ onStart, setUserName }) => {
  const [name, setName] = useState('');
  const [isWaving, setIsWaving] = useState(false);
  const [mouseAnimating, setMouseAnimating] = useState(false);
  const [speechVisible, setSpeechVisible] = useState(false);
  
  // Handle clicking on Ganesha
  const handleGaneshaClick = () => {
    setIsWaving(true);
    setSpeechVisible(true);
    
    setTimeout(() => {
      setIsWaving(false);
    }, 2000);
    
    // Hide speech bubble after a while
    setTimeout(() => {
      setSpeechVisible(false);
    }, 4000);
  };
  
  // Handle clicking on Mooshika (mouse)
  const handleMouseClick = () => {
    setMouseAnimating(true);
    
    setTimeout(() => {
      setMouseAnimating(false);
    }, 1500);
  };
  
  // Handle start button click
  const handleStart = () => {
    if (name.trim()) {
      setUserName(name.trim());
    }
    
    // Call the parent component's onStart function
    setTimeout(() => {
      onStart();
    }, 300);
  };
  
  // Automatically animate Ganesha and show speech on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGaneshaClick();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="welcome-container">
      {/* Title Image */}
      <div className="title-container">
        <img 
          src={titleImage} 
          alt="Ganesha's Magical Journey" 
          className="title-image"
        />
      </div>
      
      <div className="characters-container">
        {/* Ganesha Character */}
        <div className="ganesha-container">
          <div 
            className={`ganesha-interactive ${isWaving ? 'waving' : ''}`}
            onClick={handleGaneshaClick}
          >
            <img 
              src={ganeshaImage} 
              alt="Lord Ganesha" 
              className="ganesha-image"
            />
            
            {/* Speech Bubble */}
            {speechVisible && (
              <div className="speech-bubble">
                <p>Hi! I'm Ganesha, your playful buddy! Let's learn a secret to feel happy and strong!</p>
              </div>
            )}
            
            <div className="tap-hint">Tap me!</div>
          </div>
        </div>
        
        {/* Mooshika (Mouse) Character */}
        <div className="mouse-container">
          <div 
            className={`mouse-interactive ${mouseAnimating ? 'jumping' : ''}`}
            onClick={handleMouseClick}
          >
            <img 
              src={mooshikaImage} 
              alt="Mooshika the Mouse" 
              className="mouse-image"
            />
            <div className="tap-hint small">Tap me too!</div>
          </div>
        </div>
      </div>
      
      <div className="input-section">
        <div className="name-input-container">
          <label htmlFor="name-input">What's your name?</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name here"
            maxLength={15}
          />
        </div>
        
        <button 
          className="start-button"
          onClick={handleStart}
          disabled={!name.trim()}
        >
          Start My Adventure!
        </button>
      </div>
      
      <style jsx>{`
        .welcome-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 3vh 5vw;
          height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
          border-radius: 15px;
          box-sizing: border-box;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        }
        
        .title-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 2vh;
        }
        
        .title-image {
          width: 90%;
          max-width: 400px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }
        
        .characters-container {
          display: flex;
          width: 100%;
          justify-content: space-around;
          align-items: flex-end;
          position: relative;
          margin-bottom: 2vh;
        }
        
        .ganesha-container {
          position: relative;
          z-index: 2;
        }
        
        .mouse-container {
          align-self: flex-end;
          margin-bottom: 20px;
          z-index: 1;
        }
        
        .ganesha-interactive {
          cursor: pointer;
          position: relative;
          transition: transform 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .ganesha-interactive:hover {
          transform: scale(1.05);
        }
        
        .ganesha-image {
          width: clamp(150px, 35vw, 250px);
          height: auto;
          border-radius: 10px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          object-fit: contain;
        }
        
        .ganesha-interactive.waving .ganesha-image {
          animation: wave 0.5s ease-in-out infinite alternate;
        }
        
        .mouse-interactive {
          cursor: pointer;
          position: relative;
          transition: transform 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .mouse-interactive:hover {
          transform: scale(1.1);
        }
        
        .mouse-image {
          width: clamp(60px, 15vw, 100px);
          height: auto;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          object-fit: contain;
        }
        
        .mouse-interactive.jumping .mouse-image {
          animation: jump 0.5s ease-in-out;
        }
        
        .speech-bubble {
          position: absolute;
          top: -20px;
          right: -30px;
          background-color: white;
          padding: 15px;
          border-radius: 20px;
          max-width: 200px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          animation: fadeIn 0.5s ease-in-out;
          z-index: 3;
        }
        
        .speech-bubble:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 30%;
          width: 0;
          height: 0;
          border: 15px solid transparent;
          border-top-color: white;
          border-bottom: 0;
          margin-left: -15px;
          margin-bottom: -15px;
        }
        
        .speech-bubble p {
          margin: 0;
          font-size: clamp(12px, 2vw, 16px);
          color: #5D1049;
        }
        
        .tap-hint {
          margin-top: 10px;
          font-size: clamp(14px, 2.5vw, 18px);
          color: #5D1049;
          font-weight: bold;
        }
        
        .tap-hint.small {
          font-size: clamp(10px, 2vw, 14px);
        }
        
        .input-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2vh;
        }
        
        .name-input-container {
          margin-bottom: 15px;
          width: 100%;
          max-width: clamp(280px, 60vw, 450px);
          text-align: center;
        }
        
        .name-input-container label {
          display: block;
          margin-bottom: 10px;
          font-size: clamp(16px, 2.5vw, 20px);
          color: #5D1049;
          font-weight: bold;
        }
        
        #name-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #E0E0E0;
          border-radius: 20px;
          font-size: clamp(16px, 2.5vw, 18px);
          text-align: center;
          outline: none;
          transition: border-color 0.3s;
          box-sizing: border-box;
          background-color: rgba(255, 255, 255, 0.9);
        }
        
        #name-input:focus {
          border-color: #FF9800;
          box-shadow: 0 0 8px rgba(255, 152, 0, 0.5);
        }
        
        .start-button {
          padding: 12px 25px;
          background-color: ${name.trim() ? '#FF9800' : '#E0E0E0'};
          color: ${name.trim() ? 'white' : '#9E9E9E'};
          border: none;
          border-radius: 30px;
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: bold;
          cursor: ${name.trim() ? 'pointer' : 'not-allowed'};
          transition: background-color 0.3s, transform 0.3s;
          width: 100%;
          max-width: clamp(280px, 60vw, 450px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .start-button:hover:not(:disabled) {
          background-color: #F57C00;
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        @keyframes wave {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes jump {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Media queries for larger screens like iPad */
        @media (min-width: 768px) {
          .welcome-container {
            padding: 4vh 8vw;
            justify-content: center;
            gap: 3vh;
          }
          
          .characters-container {
            margin-bottom: 3vh;
          }
          
          .speech-bubble {
            max-width: 250px;
          }
        }
        
        /* Media queries for large tablets and desktops */
        @media (min-width: 1024px) {
          .welcome-container {
            max-width: 90%;
            height: 90%;
          }
          
          .characters-container {
            margin-bottom: 4vh;
          }
          
          .input-section {
            margin-top: 3vh;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedWelcomePage;