const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 'Red';
let board = [];

const theMatrix = document.querySelector('#the-matrix');
const playerTurn = document.querySelector('#player-turn');
const colorTurn = document.querySelector('#color-turn');
const rules = document.querySelector('#rules');
const winner = document.querySelector('a');
const resetGame = document.querySelector('#reset');

function makeBoard() {
	for (let y = 0; y < HEIGHT; y++) {
		let temp = [];
		for (let x = 0; x < WIDTH; x++) {
			temp.push(null);
		}
		board.push(temp);
	}
}

function makeHtmlBoard() {
	let htmlBoard = document.getElementById('board');

	const top = document.createElement('tr');
	winner.classList.add('hide');
	resetGame.classList.add('hide');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);
	top.addEventListener('click', nextColor);
	top.addEventListener('mouseover', nextColor);

	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	function nextColor(e) {
		currPlayer === 'Red' ? top.setAttribute('class', 'p1') : top.setAttribute('class', 'p2');
	}

	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

function findSpotForCol(x) {
	let temp = null;
	for (let i = 0; i < HEIGHT; i++) {
		if (board[i][x] === null) {
			temp = i;
		}
	}
	if (temp !== null) {
		return temp;
	} else {
		return null;
	}
}

function placeInTable(y, x) {
	let temp = document.getElementById(`${y}-${x}`);
	let newDiv = document.createElement('div');
	newDiv.classList.add('piece');
	currPlayer === 'Red' ? newDiv.classList.add('p1') : newDiv.classList.add('p2');
	temp.append(newDiv);
}

function endGame(msg) {
	setTimeout(() => {
		theMatrix.classList.add('hide');
		winner.classList.remove('hide');
		resetGame.classList.remove('hide');
		//no preventDefault() needed on this one :)
		winner.innerText = `${msg}`;
		if (currPlayer === 'Red') {
			winner.classList.add('p1');
		} else {
			winner.classList.add('p2');
		}
	}, 700);
}

function handleClick(evt) {
	let x = +evt.target.id;

	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	placeInTable(y, x);
	board[y][x] = currPlayer;

	if (checkForWin()) {
		return endGame(`${currPlayer} won!`);
	}

	let aTie = board.every((val) => {
		return val === null;
	});

	if (aTie) {
		endGame('Uhhh...');
	}

	currPlayer === 'Red' ? (currPlayer = 'Blue') : (currPlayer = 'Red');
	playerTurn.append(currPlayer);
	playerTurn.innerHTML = `<B>${currPlayer} Player's turn!<B>`;
	currPlayer === 'Red'
		? playerTurn.setAttribute('class', 'playerTurn1')
		: playerTurn.setAttribute('class', 'playerTurn2');
}

function checkForWin() {
	function _win(cells) {
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
