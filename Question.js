import React from "react"
import { decode } from 'html-entities'
import {shuffle} from '../utils'
import { useState } from "react";



// this is the answers and score

export default function Question(props) {
    const [question, setQuestion] = useState(props.question)

    //this shuffles the anwswers and question

    const [allAnswers] = useState(shuffle([props.question.correct_answer,...props.question.incorrect_answers])
    )

    const answerButton = allAnswers.map((answerText, index)=> {
        //if props.showAnswers is true(meaning the quiz is over) disabled becomes true so 
        //user cannot click the button anymore. This will go over to the questions.js file
        const disabled =props.showAnswers
        
        //this changes the color
        let className = "answer-button"

        //this changes the color of the button

        if (props.showAnswers){
             // once results revealed it turns props.showAnswers true and the answer green
        if (answerText === question.correct_answer) {
            className += " correct-answer"
          // onces results revealed props.showAnswers is true and the it wasnt correct nor clicked
          // it turns to faded Navy and opacity
        } else if (answerText === question.userAnswer){
         className += " incorrect-answer" }
       // once while playing props.showAnswwers is false after you click a button, 
       //this is the currently selected choice before submitting and turns light/pink/soft red
        } else if (answerText === question.userAnswer){
            className += " answered"

        }
//this is the button to show answers
//you have to have index from above for a key, the classname is the color going change from the prop
//answer is the function below to run the function and disabled is the false or turn
//answerText is what is picked
        return <button key={index} className={className} onClick={answer} disabled={disabled}>{answerText}</button>
   })
   
   
   // this allows you do know what button user picked
   //this acts as a child component event listener
  function answer(event) {
		const answerText = event.target.textContent
		setQuestion(prev => (
			{...prev, userAnswer: answerText}
		))
		props.answer(props.questionIndex, answerText) 
   
   
   }
   
   //need to add the return part for the colors to export to questions.js
   //and calulate the score
   //Purpose: Inserts the array of <button> elements created earlier by your .map() loop./React  automatically iterates through the array and renders every button inside this container.
	return (
        <div className="conatiner-questions">
            <h3>{decode(props.question)}</h3>
            <div className="answers-container">
                {answerButton}
            </div>
        </div>
    )
}
