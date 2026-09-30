import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import { shuffle } from "../utils";

export default function Questions() {
  //this show the questions & answers
  const [question, setQuestion] = useState([]);
  //this show the answer score
  const [showAnswers, setShowAnswers] = useState(false);
  
 

  // Fetch API, decode strings, and shuffle answers ONCE on mount. 1st fetch runs automatically when the componetn first loads 
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=20&difficulty=easy&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        //decode and shuffle once here so they stay in place
        //q stands for question from the api
        //you map over the incorrect because it is array of strings and the question and correct
        //answer is a single string. You are making the decode.. to make it easier later
        const formatted = data.results.map((q) => {
          const decodedQuestion = decode(q.question); 
          const decodedCorrect = decode(q.correct_answer);
          const decodedIncorrect = q.incorrect_answers.map((ans) => decode(ans));

        //this decodes the above and shuffles the incorrect and correct answers
        //so it not always the same number the answer right. 
        //you setquestion to formatted from the above const 
        //setisloading signaling react that the data fetching and formatting are finished
          return {
            ...q,
            question: decodedQuestion,
            correct_answer: decodedCorrect,
            allAnswers: shuffle([...decodedIncorrect, decodedCorrect]),
            userAnswer: null,
          };
        });
        setQuestion(formatted);
        setIsLoading(false);
      });
  }, []);

// this function tracks and saves the user shoices in real time while they are taking the quiz before they hit the final submit button
  // Update selected answer in state
  //useranswer is the data the user hoose while index is the position
  //when the showAnswer is shown, it stops from moving forward to the setQuestion.
  //that prevents user from changing anaswer.
  function answer(questionIndex, userAnswer) {
    if (showAnswers) return; // quiz have been submitted and results are revealed
    
    //teh argument prev  represent the previous (current)state array.
    //index is the current position in the map 0 for first question
    //singleQuestion is the current item being looked at
    //useranswer is the property name first one and second one is the variable value what user clicked
    //the index==questionindex is true, it creates an upddated copy of the questions the user choice saved inside it.( if true, say single question is shows the useranswer)
    //if false, it returns singlequestion complete unchanged.
    
    setQuestion((prev) =>
      prev.map((singleQuestion, index) =>
        index === questionIndex ? { ...singleQuestion, userAnswer: userAnswer } : singleQuestion
      )
    );
  }

  // Handle Play Again vs Check Answers the 2nd fetch to run a new set of questions
  function handleButtonClick() {
    if (showAnswers) {
      // Reset state and fetch new questions
      setShowAnswers(false);
      setQuestion([]);
      fetch("https://opentdb.com/api.php?amount=5&category=20&difficulty=easy&type=multiple")
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.results.map((q) => {
            const decodedQuestion = decode(q.question);
            const decodedCorrect = decode(q.correct_answer);
            const decodedIncorrect = q.incorrect_answers.map((ans) => decode(ans));

            return {
              ...q,
              question: decodedQuestion,
              correct_answer: decodedCorrect,
              allAnswers: shuffle([...decodedIncorrect, decodedCorrect]),
              userAnswer: null,
            };
          });
          setQuestion(formatted);
          setIsLoading(false);
        });
    } else {
      setShowAnswers(true);
    }
  }

  // Calculate total score BEFORE the return block
  const totalScore = `${
    question.filter((q) => q.userAnswer === q.correct_answer).length
  } / ${question.length}`;
  

  // Single return block at the bottom
  return (
    <main className="top">
      <div className="conatiner-questions">
        {question.map((item, index) => (
          <div key={index} className="question-card">
            <h3>{item.question}</h3>
            <div className="yellow-blob"></div>
            <div className="blue-blob"></div>
            <div className="answers-container">
              {item.allAnswers.map((answerText, i) => {
                const isSelected = item.userAnswer === answerText;
                const isCorrect = item.correct_answer === answerText;

                // Set dynamic classes for results feedback
                let btnClass = "answer-btn";
                if (showAnswers) {
                  if (isCorrect) {
                    btnClass += " correct";
                  } else if (isSelected) {
                    btnClass += " incorrect";
                  } else {
                    btnClass += " dimmed";
                  }
                } else if (isSelected) {
                  btnClass += " selected";
                }

                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => answer(index, answerText)}
                  >
                    {answerText}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showAnswers && (
        <span>You scored {totalScore} correct answers!</span>
      )}

      <button onClick={handleButtonClick}>
        {showAnswers ? "Play Again" : "Check answers"}
      </button>
    </main>
  );
}
