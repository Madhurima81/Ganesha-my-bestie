import React, { useState, useEffect } from 'react';

const WordScramble = ({ words = ['cat', 'dog', 'sun', 'tree', 'book', 'moon', 'star', 'fish', 'bird', 'duck'] }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [result, setResult] = useState(null); // null, 'correct', 'incorrect'
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  
  // Helper function to scramble a word
  const scrambleWord = (word) => {
    // Convert to array, shuffle, and join back
    const wordArray = word.split('');
    
    // Fisher-Yates shuffle algorithm
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    const shuffled = wordArray.join('');
    
    // If the scrambled word is the same as the original, try again
    if (shuffled === word) {
      return scrambleWord(word);
    }
    
    return shuffled;
  };
  
  // Load a new word
  const loadNewWord = () => {
    // Choose a random word from the list
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setUserGuess('');
    setResult(null);
  };
  
  // Initialize with a word
  useEffect(() => {
    loadNewWord();
  }, []);
  
  // Handle guess submission
  const handleSubmit = () => {
    setAttempts(attempts + 1);
    
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      setResult('correct');
      setScore(score + 1);
      
      // Load a new word after a short delay
      setTimeout(() => {
        loadNewWord();
      }, 1500);
    } else {
      setResult('incorrect');
      
      // Reset after a short delay
      setTimeout(() => {
        setResult(null);
        setUserGuess('');
      }, 1500);
    }
  };
  
  // Handle hint
  const getHint = () => {
    // Set the first letter as a hint
    setUserGuess(currentWord[0]);
  };
  
  return (
    <div className="word-scramble" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '15px',
      maxWidth: '350px'
    }}>
      <h3 style={{ marginBottom: '5px' }}>Unscramble the Word</h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: '10px',
        fontSize: '14px'
      }}>
        <span>Score: {score}</span>
        <span>Attempts: {attempts}</span>
      </div>
      
      <div style={{
        backgroundColor: '#f0f8ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '15px',
        width: '100%',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '3px' }}>
          {scrambledWord.toUpperCase()}
        </p>
      </div>
      
      <div style={{ display: 'flex', width: '100%', marginBottom: '15px' }}>
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Type your answer"
          style={{
            padding: '10px',
            borderRadius: '8px 0 0 8px',
            border: '2px solid #ccc',
            borderRight: 'none',
            flex: 1,
            fontSize: '16px'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Check
        </button>
      </div>
      
      {result && (
        <div style={{
          padding: '10px',
          backgroundColor: result === 'correct' ? '#e8f5e9' : '#ffebee',
          borderRadius: '8px',
          marginBottom: '15px',
          width: '100%',
          textAlign: 'center'
        }}>
          <p>
            {result === 'correct' 
              ? '🎉 Correct! Great job!' 
              : `❌ Not quite. Try again!`}
          </p>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={getHint}
          style={{
            padding: '8px 15px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Hint
        </button>
        
        <button
          onClick={loadNewWord}
          style={{
            padding: '8px 15px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          New Word
        </button>
      </div>
    </div>
  );
};

export default WordScramble;