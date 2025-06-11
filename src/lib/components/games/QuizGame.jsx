const QuizGame = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    
    const handleAnswer = (isCorrect) => {
      if (isCorrect) {
        setScore(score + 1);
      }
      
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowResult(true);
      }
    };
    
    if (showResult) {
      return (
        <div className="quiz-results">
          <h2>Quiz Complete!</h2>
          <p>You scored {score} out of {questions.length}</p>
          <button onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setShowResult(false);
          }}>Play Again</button>
        </div>
      );
    }
    
    const question = questions[currentQuestion];
    
    return (
      <div className="quiz-game">
        <div className="question-counter">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <div className="question">
          <h2>{question.text}</h2>
          
          {question.image && <img src={question.image} alt="Question" />}
        </div>
        
        <div className="answers">
          {question.answers.map((answer, index) => (
            <button 
              key={index}
              className="answer-button"
              onClick={() => handleAnswer(answer.isCorrect)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    );
  };