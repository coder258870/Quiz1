import React from "react"

export default function StartGame(props) {
    return (
        
        <main className="top">
        <div className="yellow-blob"></div>
           <div className="blue-blob"></div>
            <h1>Quizzical</h1>
            <p>Some description if needed</p>
            <button onClick={props.startGameBegin}>Start quiz</button>
        </main>
    )
}