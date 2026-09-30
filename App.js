import React from 'react'
import StartGame from './components/Start'
import Questions from './components/Questions'

export default () => {
	const [ page, setPage ] = React.useState('start')



	function startGame() {
		setPage('questions') 
	}

	return (
		<main>
			{page == 'start' &&
				<StartGame startGameBegin={startGame}/>
			}
			{page == 'questions' && (
				<Questions />
			)}
		</main>
	)
} 