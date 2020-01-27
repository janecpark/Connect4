/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const reset = document.querySelector('button')
const msg = document.querySelector('#msg')
let isGameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  // need to make a board with 6 arrays (height)
  // and 7 items (width)

  for(let y = 0; y < HEIGHT; y++){
    board[y] = []
    for(let x = 0; x < WIDTH; x++){
      board[y][x] = null;
    }
  }
  
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')
  // Append top row with a click event
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create and append rows 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //needs to start at 5 and decrement if the spot is taken
  for(let y = HEIGHT-1; y >= 0; y--){
    if(!board[y][x]){
      return y; 
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div')
  piece.className = ('pieces')
  piece.classList.add('piece')
  piece.classList.add(`p${currPlayer}`)
  piece.classList.add('slide-bottom')
  piece.style.right = '.5px';
  const spot = document.getElementById(`${y}-${x}`)
  spot.append(piece);
}

/** endGame: announce game end */
function endGame(message) {
   msg.innerText = message
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  if(isGameOver){
    return;
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // console.log(`X: ${x}`)

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // console.log(`Y: ${y}`)

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    isGameOver = true;

      return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(isEveryCellFilled()){
    return endGame(`It's a tie`)
  }
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1
}

function isEveryCellFilled(){
   const newArray = board.flat()
    return newArray.every(el => el!== null)
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) { //loop through all the rows
    for (let x = 0; x < WIDTH; x++) { // loop through all the cells
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; 
      //check to see if 4 in a row match horizontally by incrementing the x value
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //check to see if 4 in a row match vertically by incrementing the y value
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //check to see if 4 in a row match diagonally to the right by incrementing the x and y value
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //check to see if 4 in a row match diagonally to the left by incrementing the x and y value

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        //check to see if there is a winner
        return true;
      }
    }
  }
}

  reset.addEventListener('click', function(){
    isGameOver = false; 
    document.querySelectorAll('.pieces').forEach(el=> el.parentNode.removeChild(el));
    msg.innerText = ''
    currPlayer = 1;
    for(let y = 0; y < HEIGHT; y++){
      for(let x = 0; x < WIDTH; x++){
        board[y][x] = null;
      }
    }
  })


makeBoard();
makeHtmlBoard();
