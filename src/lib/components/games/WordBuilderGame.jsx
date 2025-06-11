const WordBuilderGame = ({ words }) => {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [letterTiles, setLetterTiles] = useState([]);
    const [placedLetters, setPlacedLetters] = useState([]);
    const [complete, setComplete] = useState(false);
    
    // Initialize letter tiles
    useEffect(() => {
      const shuffledLetters = currentWord.word.split('')
        .sort(() => Math.random() - 0.5)
        .map((letter, index) => ({
          id: index,
          letter,
          isPlaced: false
        }));
        
      setLetterTiles(shuffledLetters);
      setPlacedLetters(Array(currentWord.word.length).fill(null));
      setComplete(false);
    }, [currentWord]);
    
    const handleLetterClick = (letter) => {
      if (letter.isPlaced) return;
      
      // Find first empty slot
      const emptyIndex = placedLetters.findIndex(l => l === null);
      if (emptyIndex !== -1) {
        // Place letter
        const newPlacedLetters = [...placedLetters];
        newPlacedLetters[emptyIndex] = letter;
        setPlacedLetters(newPlacedLetters);
        
        // Mark letter as placed
        const newLetterTiles = letterTiles.map(l => 
          l.id === letter.id ? { ...l, isPlaced: true } : l
        );
        setLetterTiles(newLetterTiles);
        
        // Check if word is complete
        if (!newPlacedLetters.includes(null)) {
          const wordFormed = newPlacedLetters.map(l => l.letter).join('');
          if (wordFormed === currentWord.word) {
            setComplete(true);
          }
        }
      }
    };
    
    const handlePlacedLetterClick = (index) => {
      const letter = placedLetters[index];
      if (letter === null) return;
      
      // Remove letter from placed
      const newPlacedLetters = [...placedLetters];
      newPlacedLetters[index] = null;
      setPlacedLetters(newPlacedLetters);
      
      // Mark letter as not placed
      const newLetterTiles = letterTiles.map(l => 
        l.id === letter.id ? { ...l, isPlaced: false } : l
      );
      setLetterTiles(newLetterTiles);
    };
    
    return (
      <div className="word-builder-game">
        <div className="word-hint">
          <h2>Hint: {currentWord.hint}</h2>
          {currentWord.image && <img src={currentWord.image} alt="Hint" />}
        </div>
        
        <div className="letter-slots">
          {placedLetters.map((letter, index) => (
            <div 
              key={index} 
              className={`letter-slot ${letter ? 'filled' : 'empty'}`}
              onClick={() => handlePlacedLetterClick(index)}
            >
              {letter ? letter.letter : ''}
            </div>
          ))}
        </div>
        
        <div className="letter-tiles">
          {letterTiles.map(letter => (
            <div
              key={letter.id}
              className={`letter-tile ${letter.isPlaced ? 'placed' : ''}`}
              onClick={() => !letter.isPlaced && handleLetterClick(letter)}
            >
              {letter.isPlaced ? '' : letter.letter}
            </div>
          ))}
        </div>
        
        {complete && (
          <div className="word-complete">
            <h2>Correct!</h2>
            <p>{currentWord.word}: {currentWord.meaning}</p>
            <button onClick={() => {
              const currentIndex = words.findIndex(w => w.word === currentWord.word);
              const nextIndex = (currentIndex + 1) % words.length;
              setCurrentWord(words[nextIndex]);
            }}>Next Word</button>
          </div>
        )}
      </div>
    );
  };