import React, { useState } from 'react';
import './ShlokaPowerUps.css';

const ShlokaPowerUps = () => {
  // State variables
  const [currentScenario, setCurrentScenario] = useState(0);
  const [shlokaActivated, setShlokaActivated] = useState(false);
  const [showingShloka, setShowingShloka] = useState(false);
  
  // Define different scenarios
  const scenarios = [
    {
      id: 1,
      title: "School Presentation Anxiety",
      description: "Ravi feels nervous about giving a presentation in front of the whole class.",
      problem: "My heart is beating so fast... what if I forget what to say?",
      solution: "The shloka gives Ravi confidence to speak clearly and calmly.",
      beforeImage: "nervous-student.png",
      afterImage: "confident-student.png",
      powerUp: "Confidence Boost",
      message: "The shloka helps you overcome fear and speak with confidence!"
    },
    {
      id: 2,
      title: "Difficult Math Homework",
      description: "Priya is stuck on a difficult math problem and feels like giving up.",
      problem: "This is too hard! I'll never understand it...",
      solution: "The shloka helps Priya focus her mind and think clearly.",
      beforeImage: "confused-student.png",
      afterImage: "understanding-student.png",
      powerUp: "Focus Power",
      message: "The shloka helps you concentrate and solve difficult problems!"
    },
    {
      id: 3,
      title: "New School Jitters",
      description: "Arjun is starting at a new school and doesn't know anyone.",
      problem: "What if nobody wants to be my friend?",
      solution: "The shloka gives Arjun the courage to introduce himself to others.",
      beforeImage: "lonely-student.png",
      afterImage: "friendly-student.png",
      powerUp: "Friendship Charm",
      message: "The shloka gives you courage to make new friends!"
    },
    {
      id: 4,
      title: "Sports Competition",
      description: "Meera is about to compete in an important race and feels nervous.",
      problem: "There are so many good runners. What if I come in last?",
      solution: "The shloka helps Meera focus on doing her best rather than worrying.",
      beforeImage: "nervous-athlete.png",
      afterImage: "determined-athlete.png",
      powerUp: "Performance Enhancer",
      message: "The shloka helps you perform your best under pressure!"
    }
  ];

  // Handle shloka activation
  const activateShloka = () => {
    // First show the shloka recitation
    setShowingShloka(true);
    
    // After a delay, show the transformation
    setTimeout(() => {
      setShowingShloka(false);
      setShlokaActivated(true);
      
      // Automatically reset for the next scenario after viewing the result
      setTimeout(() => {
        const nextScenario = (currentScenario + 1) % scenarios.length;
        setCurrentScenario(nextScenario);
        setShlokaActivated(false);
      }, 5000);
    }, 4000);
  };

  // Reset the current scenario
  const resetScenario = () => {
    setShlokaActivated(false);
  };

  // Navigate to a specific scenario
  const goToScenario = (index) => {
    setCurrentScenario(index);
    setShlokaActivated(false);
  };

  // Get the current scenario
  const scenario = scenarios[currentScenario];

  return (
    <div className="shloka-power-ups-container">
      <h2>Shloka Power-Ups</h2>
      <p className="intro-text">
        Reciting the Ganesha shloka can give you special powers to overcome challenges!
      </p>
      
      {/* Scenario Selection */}
      <div className="scenario-selector">
        <h3>Choose a Challenge:</h3>
        <div className="scenario-buttons">
          {scenarios.map((s, index) => (
            <button
              key={s.id}
              className={`scenario-button ${currentScenario === index ? 'active' : ''}`}
              onClick={() => goToScenario(index)}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current Scenario Display */}
      <div className="scenario-display">
        <h3>{scenario.title}</h3>
        <p className="scenario-description">{scenario.description}</p>
        
        <div className="scenario-visual">
          {/* Before/After States */}
          <div className={`character-state ${shlokaActivated ? 'hidden' : ''}`}>
            <div className="character-image before-image">
              {/* Replace with actual image in production */}
              <div className="placeholder-image">
                <span className="emotion-emoji">😰</span>
              </div>
            </div>
            <div className="character-thoughts">
              <p>{scenario.problem}</p>
            </div>
          </div>
          
          {/* Shloka Recitation Animation */}
          <div className={`shloka-animation ${showingShloka ? 'visible' : ''}`}>
            <div className="shloka-text">
              <p>Vakratunda Mahakaya</p>
              <p>Suryakoti Samaprabha</p>
              <p>Nirvighnam Kuru Me Deva</p>
              <p>Sarva Karyeshu Sarvada</p>
            </div>
            <div className="glowing-energy"></div>
          </div>
          
          {/* After State */}
          <div className={`character-state ${shlokaActivated ? 'visible' : 'hidden'}`}>
            <div className="character-image after-image">
              {/* Replace with actual image in production */}
              <div className="placeholder-image">
                <span className="emotion-emoji">😊</span>
              </div>
            </div>
            <div className="character-thoughts success">
              <div className="power-up-badge">
                <span>{scenario.powerUp}!</span>
              </div>
              <p>{scenario.solution}</p>
            </div>
          </div>
        </div>
        
        {/* Activation Button */}
        {!shlokaActivated && !showingShloka && (
          <button 
            className="activate-shloka-button"
            onClick={activateShloka}
          >
            Say the Shloka!
          </button>
        )}
        
        {/* Success Message */}
        {shlokaActivated && (
          <div className="power-up-message">
            <h3>Shloka Power-Up Activated!</h3>
            <p>{scenario.message}</p>
          </div>
        )}
      </div>
      
      {/* Information about the shloka */}
      <div className="shloka-info">
        <h3>About the Ganesha Shloka</h3>
        <p>
          The Ganesha shloka is a special verse that helps remove obstacles and gives us
          strength when we face challenges. Reciting it can help us feel confident,
          focused, and brave!
        </p>
        <div className="shloka-benefits">
          <div className="benefit">
            <span className="benefit-icon">🧠</span>
            <span className="benefit-text">Improves focus</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">💪</span>
            <span className="benefit-text">Builds courage</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">😌</span>
            <span className="benefit-text">Reduces stress</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🚀</span>
            <span className="benefit-text">Removes obstacles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShlokaPowerUps;