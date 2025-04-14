const grid = document.getElementById('grid');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');

const rows = 6;
const cols = 5;

const wordList = ['CASAS', 'LIVRO', 'FRUTA', 'NINJA', 'VELAS', 'FALTA', 'CANTO', 'JOGAR', 'NORTE', 'FLORE'];
const secretWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

let currentRow = 0;
let currentCol = 0;
let board = Array.from({ length: rows }, () => Array(cols).fill(''));
//js
const letters = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '←']
];

function createGrid() {
  for (let i = 0; i < rows * cols; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    grid.appendChild(tile);
  }
}

function createKeyboard() {
  letters.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');

    row.forEach(key => {
      const button = document.createElement('button');
      button.textContent = key;
      button.classList.add('key');
      if (key === 'Enter' || key === '←') {
        button.classList.add('wide');
      }
      button.addEventListener('click', () => handleKey(key));
      rowDiv.appendChild(button);
    });

    keyboard.appendChild(rowDiv);
  });
}

function handleKey(key) {
  if (key === '←') {
    deleteLetter();
    return;
  }

  if (key === 'Enter') {
    submitGuess();
    return;
  }

  if (currentCol < cols && /^[a-zA-Z]$/.test(key)) {
    const letter = key.toUpperCase();
    board[currentRow][currentCol] = letter;
    updateTile(currentRow, currentCol, letter);
    currentCol++;
  }
}

function updateTile(row, col, letter) {
  const index = row * cols + col;
  const tile = grid.children[index];
  tile.textContent = letter;
  tile.classList.add('filled');
}

function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    board[currentRow][currentCol] = '';
    updateTile(currentRow, currentCol, '');
    const index = currentRow * cols + currentCol;
    const tile = grid.children[index];
    tile.classList.remove('filled');
  }
}

function submitGuess() {
  if (currentCol < cols) {
    showMessage('Complete a palavra!');
    return;
  }

  const guess = board[currentRow].join('');
  checkGuess(guess);
}

function checkGuess(guess) {
  const guessLetters = guess.split('');
  const targetLetters = secretWord.split('');
  const indexBase = currentRow * cols;

  for (let i = 0; i < cols; i++) {
    const tile = grid.children[indexBase + i];
    const keyBtn = getKeyButton(guessLetters[i]);

    if (guessLetters[i] === targetLetters[i]) {
      tile.classList.add('correct');
      targetLetters[i] = null;
      guessLetters[i] = null;
      keyBtn.classList.add('correct');
    }
  }

  for (let i = 0; i < cols; i++) {
    const tile = grid.children[indexBase + i];
    const keyBtn = getKeyButton(board[currentRow][i]);

    if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
      tile.classList.add('present');
      keyBtn.classList.add('present');
      targetLetters[targetLetters.indexOf(guessLetters[i])] = null;
    } else if (guessLetters[i]) {
      tile.classList.add('absent');
      keyBtn.classList.add('absent');
    }
  }

  if (guess === secretWord) {
    showMessage('Parabéns! Você acertou!');
  } else if (currentRow < rows - 1) {
    currentRow++;
    currentCol = 0;
  } else {
    showMessage(`Fim de jogo! A palavra era "${secretWord}"`);
  }
}

function getKeyButton(letter) {
  return [...keyboard.querySelectorAll('.key')].find(
    btn => btn.textContent.toLowerCase() === letter.toLowerCase()
  );
}

function showMessage(msg) {
  message.textContent = msg;
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === 'Backspace') {
    handleKey('←');
  } else if (key === 'Enter') {
    handleKey('Enter');
  } else if (/^[a-zA-Z]$/.test(key)) {
    handleKey(key);
  }
});

createGrid();
createKeyboard();