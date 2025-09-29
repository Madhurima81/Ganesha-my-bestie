import React, { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onStart, setUserName }) => {
  const [name, setName] = useState('');
  const [animation, setAnimation] = useState(false);
  const [characterPosition, setCharacterPosition] = useState(0);
  
  // Animate Ganesha character on load
  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 500);
    
    // Move Ganesha slightly back and forth
    const intervalId = setInterval(() => {
      setCharacterPosition(prev => {
        const newPosition = prev + (Math.random() * 10 - 5);
        return Math.min(Math.max(newPosition, -20), 20); // Keep within reasonable bounds
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      // Play button click sound
      const clickSound = new Audio('/audio/button-click.mp3');
      clickSound.volume = 0.3;
      clickSound.play().catch(e => console.log("Audio play prevented:", e));
      
      // Trigger start with slight delay for sound
      setTimeout(() => {
        onStart();
      }, 300);
    }
  };
  
  return (
    <div className="welcome-container">
      <div className={`welcome-content ${animation ? 'animated' : ''}`}>
        <div className="book-title">
          <h1>Ganesha's Magical Journey</h1>
          <div className="book-subtitle">Learn the Vakratunda Mahakaya Shloka</div>
        </div>
        
        <div 
          className="ganesha-character"
          style={{ transform: `translateX(${characterPosition}px)` }}
        >
          <span role="img" aria-label="Ganesha" className="ganesha-emoji">🐘</span>
        </div>
        
        <div className="greeting">
          <p>Hello there, little friend!</p>
          <p>Are you ready to learn a magical prayer with Ganesha?</p>
        </div>
        
        <form className="name-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="nameInput">What's your name?</label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              autoComplete="off"
            />
          </div>
          
          <button 
            type="submit" 
            className="start-button"
            disabled={!name.trim()}
          >
            Let's Begin!
          </button>
        </form>
        
        <div className="welcome-footer">
          <div className="features">
            <div className="feature">
              <span role="img" aria-label="Book">📚</span>
              <span>Learn the Shloka</span>
            </div>
            <div className="feature">
              <span role="img" aria-label="Game">🎮</span>
              <span>Fun Games</span>
            </div>
            <div className="feature">
              <span role="img" aria-label="Magic">✨</span>
              <span>Magic Powers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="welcome-decoration top-left"></div>
      <div className="welcome-decoration top-right"></div>
      <div className="welcome-decoration bottom-left"></div>
      <div className="welcome-decoration bottom-right"></div>
    </div>
  );
};

export default WelcomePage;