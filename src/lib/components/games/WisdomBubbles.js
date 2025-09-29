import React, { useState } from 'react';
import './WisdomBubbles.css';

const WisdomBubbles = () => {
  const [activeBubble, setActiveBubble] = useState(null);
  
  const wisdomBubbles = [
    {
      id: 1,
      title: "Removes Obstacles",
      emoji: "🚧",
      description: "Just like Ganesha removes obstacles, the shloka helps clear away problems in your path. When you're stuck or facing a tough challenge, chanting can help you find a way through!",
      color: "#FFD700" // Gold
    },
    {
      id: 2,
      title: "Builds Courage",
      emoji: "🦁",
      description: "When you feel scared or nervous, this shloka gives you bravery! It reminds you that Ganesha is there to help you face your fears, like before a test or when trying something new.",
      color: "#FF6B6B" // Coral
    },
    {
      id: 3,
      title: "Helps You Focus",
      emoji: "🧠",
      description: "Sometimes our minds jump around like monkeys! Chanting this shloka helps calm your thoughts so you can concentrate better on homework, reading, or anything important.",
      color: "#4ECDC4" // Teal
    },
    {
      id: 4,
      title: "Brings Good Energy",
      emoji: "✨",
      description: "The shloka creates positive energy around you. It's like having a shield of happy, protective light that keeps negative thoughts away and attracts good things!",
      color: "#9D65C9" // Purple
    },
    {
      id: 5,
      title: "Starts Things Right",
      emoji: "🏁",
      description: "In India, people always chant this before starting something new - like a trip, a new school year, or a big project. It's like asking for a smooth journey ahead!",
      color: "#5CA4EA" // Blue
    },
    {
      id: 6,
      title: "Gives Wisdom",
      emoji: "🧙‍♂️",
      description: "Ganesha is the god of wisdom and intelligence. Chanting this shloka helps your brain work better and makes learning new things easier and more fun!",
      color: "#67D5B5" // Green
    }
  ];
  
  const handleBubbleClick = (id) => {
    // If clicking the same bubble, close it
    if (activeBubble === id) {
      setActiveBubble(null);
    } else {
      setActiveBubble(id);
      
      // Optional: play a gentle pop sound when opening a bubble
      const popSound = new Audio('/audio/bubble-pop.mp3');
      popSound.volume = 0.3;
      popSound.play().catch(e => console.log("Audio play prevented:", e));
    }
  };
  
  return (
    <div className="wisdom-bubbles-container">
      <div className="ganesha-image">
        <span role="img" aria-label="Ganesha" className="ganesha-emoji">🐘</span>
      </div>
      
      <div className="bubbles-wrapper">
        {wisdomBubbles.map((bubble) => (
          <div 
            key={bubble.id}
            className={`wisdom-bubble ${activeBubble === bubble.id ? 'active' : ''}`}
            style={{
              backgroundColor: bubble.color,
              transform: `rotate(${(bubble.id * 30) % 60 - 30}deg) translate(${(bubble.id % 3) * 10}px, ${(bubble.id % 2) * -15}px)`
            }}
            onClick={() => handleBubbleClick(bubble.id)}
          >
            <div className="bubble-content">
              <div className="bubble-emoji">{bubble.emoji}</div>
              <div className="bubble-title">{bubble.title}</div>
              
              {activeBubble === bubble.id && (
                <div className="bubble-description">
                  {bubble.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="wisdom-instruction">
        <p>Tap on each bubble to discover the magical benefits of chanting the shloka!</p>
      </div>
    </div>
  );
};

export default WisdomBubbles;