import React, { useState, useEffect } from 'react';

const StoryBuilder = () => {
  // State variables
  const [storyElements, setStoryElements] = useState({
    character: '',
    feeling: '',
    place: '',
    obstacle: '',
    goal: '',
    helpType: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [storyCompleted, setStoryCompleted] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [animation, setAnimation] = useState('');
  const [showHint, setShowHint] = useState(true);

  // Options for each story element
  const storyOptions = {
    character: [
      { text: 'You (a kid)', emoji: '👧👦' },
      { text: 'A student', emoji: '🧒' },
      { text: 'A little artist', emoji: '🎨' },
      { text: 'A young athlete', emoji: '🏃‍♀️' },
      { text: 'A junior chef', emoji: '👩‍🍳' }
    ],
    feeling: [
      { text: 'nervous', emoji: '😰' },
      { text: 'scared', emoji: '😨' },
      { text: 'worried', emoji: '😟' },
      { text: 'confused', emoji: '🤔' },
      { text: 'frustrated', emoji: '😣' }
    ],
    place: [
      { text: 'school', emoji: '🏫' },
      { text: 'home', emoji: '🏠' },
      { text: 'playground', emoji: '🛝' },
      { text: 'sports field', emoji: '⚽' },
      { text: 'birthday party', emoji: '🎂' }
    ],
    obstacle: [
      { text: 'a difficult test', emoji: '📝' },
      { text: 'learning something new', emoji: '📚' },
      { text: 'making new friends', emoji: '👥' },
      { text: 'performing in front of people', emoji: '🎭' },
      { text: 'a complicated puzzle', emoji: '🧩' }
    ],
    goal: [
      { text: 'do your best', emoji: '🌟' },
      { text: 'feel confident', emoji: '💪' },
      { text: 'solve the problem', emoji: '✅' },
      { text: 'have fun', emoji: '😄' },
      { text: 'learn something new', emoji: '🧠' }
    ],
    helpType: [
      { text: 'courage', emoji: '🦁' },
      { text: 'wisdom', emoji: '🦉' },
      { text: 'patience', emoji: '🐢' },
      { text: 'creativity', emoji: '💡' },
      { text: 'calmness', emoji: '🧘' }
    ]
  };

  // Questions to ask the user
  const questions = [
    { question: "Who is our main character?", field: "character" },
    { question: "How are they feeling?", field: "feeling" },
    { question: "Where are they?", field: "place" },
    { question: "What obstacle are they facing?", field: "obstacle" },
    { question: "What do they want to achieve?", field: "goal" },
    { question: "What type of help do they need from Ganesha?", field: "helpType" }
  ];

  // Get current question
  const getCurrentQuestion = () => {
    if (currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  // Create and update the story text whenever elements change
  useEffect(() => {
    if (storyCompleted) {
      generateStory();
    }
  }, [storyElements, storyCompleted]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    const currentField = questions[currentQuestion].field;
    
    // Update story elements
    setStoryElements({
      ...storyElements,
      [currentField]: option
    });
    
    // Animate the selection
    setAnimation('selected');
    setTimeout(() => setAnimation(''), 500);
    
    // Move to next question or complete the story
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStoryCompleted(true);
      }
      setShowHint(false);
    }, 700);
  };

  // Generate the full story text based on selected elements
  const generateStory = () => {
    if (!storyCompleted) return;
    
    const { character, feeling, place, obstacle, goal, helpType } = storyElements;
    
    const story = `
      Once upon a time, ${character.text} was at the ${place.text} feeling very ${feeling.text}. 
      They were facing ${obstacle.text} and really wanted to ${goal.text}.
      
      But the obstacle seemed too big to overcome! That's when they remembered what their parents taught them.
      
      "When we face difficulties, we can ask Lord Ganesha for help by saying his special shloka!"
      
      So they took a deep breath and recited:
      
      "Vakratunda Mahakaya Suryakoti Samaprabha
      Nirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada"
      
      As they said these special words, they could feel Ganesha's ${helpType.text} filling them up!
      
      The obstacle that seemed so big before now felt manageable. With Ganesha's blessing, they were able to face the challenge with new strength.
      
      That day, they learned that whenever they need help, Ganesha's shloka can give them the power to overcome any obstacle!
    `;
    
    // Remove extra whitespace and trim
    const cleanedStory = story.replace(/\s+/g, ' ').trim();
    setStoryText(cleanedStory);
  };

  // Reset the story builder
  const resetStory = () => {
    setStoryElements({
      character: '',
      feeling: '',
      place: '',
      obstacle: '',
      goal: '',
      helpType: ''
    });
    setCurrentQuestion(0);
    setStoryCompleted(false);
    setStoryText('');
    setShowHint(true);
  };

  // Get the appropriate background color based on the current question
  const getBackgroundColor = () => {
    const colors = [
      '#FFE0B2', // orange light - character
      '#E1BEE7', // purple light - feeling
      '#B2DFDB', // teal light - place
      '#FFCCBC', // deep orange light - obstacle
      '#C5CAE9', // indigo light - goal
      '#DCEDC8', // lime light - help type
    ];
    
    return currentQuestion < colors.length ? colors[currentQuestion] : colors[0];
  };

  // Get proper color for read again button
  const getReadAgainColor = () => {
    const field = questions[questions.length - 1].field;
    const selectedOption = storyElements[field];
    if (!selectedOption) return '#2196F3';
    
    // Get colors based on help type
    const helpTypeColors = {
      'courage': '#E53935', // red
      'wisdom': '#7B1FA2', // purple
      'patience': '#388E3C', // green
      'creativity': '#FFA000', // amber
      'calmness': '#0288D1'  // blue
    };
    
    return helpTypeColors[selectedOption.text] || '#2196F3';
  };

  return (
    <div className="story-builder-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      padding: '15px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'background-color 0.5s ease',
      position: 'relative'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        marginBottom: '15px'
      }}>
        Create Your Ganesha Story!
      </h2>
      
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: '#333',
        marginBottom: '20px'
      }}>
        Answer the questions to build a story about when to say Ganesha's shloka!
      </p>
      
      {/* Story building questions */}
      {!storyCompleted && (
        <div className="question-container" style={{
          backgroundColor: getBackgroundColor(),
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transition: 'background-color 0.5s ease'
        }}>
          <div className="question-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span style={{ 
              backgroundColor: '#fff', 
              padding: '5px 15px', 
              borderRadius: '20px',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              color: '#666',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            
            <button
              onClick={resetStory}
              style={{
                backgroundColor: 'transparent',
                color: '#5D1049',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>↺</span> Restart
            </button>
          </div>
          
          <h3 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            marginBottom: '25px',
            color: '#333'
          }}>
            {getCurrentQuestion()?.question}
          </h3>
          
          {/* Show hint on first question */}
          {showHint && currentQuestion === 0 && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '10px 15px',
              borderRadius: '10px',
              marginBottom: '15px',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              color: '#666',
              textAlign: 'center',
              animation: 'fadeIn 0.5s'
            }}>
              <p style={{ margin: '0' }}>
                Click on one of the options below to build your story!
              </p>
            </div>
          )}
          
          <div className="options-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginBottom: '10px'
          }}>
            {getCurrentQuestion() && storyOptions[getCurrentQuestion().field].map((option, index) => (
              <div
                key={index}
                className={`option ${animation === 'selected' ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '15px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  transform: 'scale(1)',
                  height: '100%',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 10px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <span style={{ fontSize: '28px', marginBottom: '8px' }}>
                  {option.emoji}
                </span>
                <span style={{ 
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {option.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Completed story display */}
      {storyCompleted && (
        <div className="completed-story" style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          animation: 'fadeIn 0.5s'
        }}>
          <h3 style={{ 
            color: '#5D1049', 
            textAlign: 'center',
            fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
            marginBottom: '20px'
          }}>
            Your Story is Ready!
          </h3>
          
          <div className="story-elements-summary" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px'
          }}>
            {Object.entries(storyElements).map(([key, value]) => (
              <div 
                key={key}
                style={{
                  backgroundColor: 'white',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                }}
              >
                <span>{value.emoji}</span>
                <span>{value.text}</span>
              </div>
            ))}
          </div>
          
          <div className="story-text" style={{
            lineHeight: '1.6',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            backgroundColor: '#FFFDE7', // Light yellow background for the story
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px dashed #FFD54F', // Light gold dashed border
            whiteSpace: 'pre-line' // Preserve line breaks in story
          }}>
            {storyText}
          </div>
          
          <div className="story-actions" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={resetStory}
              style={{
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                padding: '10px 20px',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>🔄</span> Create New Story
            </button>
            
            <button
              onClick={() => {
                setAnimation('reading');
                setTimeout(() => setAnimation(''), 500);
                
                // This would scroll to the story text in a real implementation
                const storyTextElement = document.querySelector('.story-text');
                if (storyTextElement) {
                  storyTextElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                backgroundColor: getReadAgainColor(),
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                padding: '10px 20px',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background-color 0.3s'
              }}
            >
              <span>📖</span> Read Again
            </button>
          </div>
        </div>
      )}
      
      <div style={{ textAlign: 'center', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#666' }}>
        <p>This story shows how Ganesha's shloka can help in everyday situations!</p>
      </div>
      
      {/* Animations */}
      <style jsx>{`
        @keyframes selected {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .selected {
          animation: selected 0.5s;
        }
      `}</style>
    </div>
  );
};

export default StoryBuilder;