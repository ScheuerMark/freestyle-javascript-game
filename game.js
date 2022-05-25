initGame();

function createBoard(width=9) {
    const gameField = document.getElementsByClassName('game-field');
    for (let i=0; i < Math.pow(width, 2); i++) {
        const field = document.createElement('div');
        field.classList.add('field');
        gameField[0].appendChild(field);
    }
}

function selectInput() {
    const highlightedField = document.getElementsByClassName('highlight');
    if (!highlightedField.length) {
        if (typeof that !== 'undefined' && this !== that) {
            that.classList.remove('selected-number');
        }
        that = this;
        that.classList.toggle('selected-number');
    } else {
        that.textContent = this.textContent;
    }
}

function createInput (width=9) {
    const inputField = document.getElementsByClassName('input-numbers');
    for (let i=0; i < width; i++) {
        const field = document.createElement('div');
        field.addEventListener('click', selectInput);
        field.classList.add('number-field');
        field.innerText = String(i+1);
        inputField[0].appendChild(field);
    }
}

function getDefaultFieldsEditable () {
    const defaultFields = [];
    for (let field of document.getElementsByClassName('default-field')) {
        defaultFields.push(field);
    }
    return defaultFields;
}

function waitForInput() {
    const inputField = document.getElementsByClassName('selected-number');
    const defaultFields = getDefaultFieldsEditable();
    if (!defaultFields.includes(this)) {
        if (inputField.length) {
            if (!this.textContent) {
                this.textContent = inputField[0].textContent;
                this.classList.add('text-content');
            } else {
                if (inputField[0].textContent === this.textContent) {
                    this.classList.remove('text-content');
                } else {
                    this.textContent = inputField[0].textContent;
                }
            }
        } else {
            this.classList.remove('text-content');
            const highlightedField = document.getElementsByClassName('highlight');
            if (!highlightedField.length) {
                this.classList.add('highlight');
                that = this
            } else {
                if (that === this) {
                    this.classList.remove('highlight');
                } else {
                    that.classList.remove('highlight');
                    this.classList.add('highlight');
                    that = this;
                }
            }
        }
    }
    highlightRelatedFields();
}

function removeTextContent (event) {
    event.preventDefault();
    const defaultFields = getDefaultFieldsEditable();
    if (!defaultFields.includes(this)) {
        this.textContent = '';
        this.classList.remove('text-content');
    }
}

function keyboardInput (event) {
    const highlightedField = document.getElementsByClassName('highlight');
    if (highlightedField.length) {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
            highlightedField[0].textContent = event.key;
        } else {
            highlightedField[0].classList.remove('highlight');
        }
    }
    highlightRelatedFields();
}

function initClickListener() {
    const fields = document.getElementsByClassName('field');
    for (let field of fields) {
        field.addEventListener('click', waitForInput);
        field.addEventListener('contextmenu', removeTextContent);
        document.addEventListener('keyup', keyboardInput);
    }
}

// For testing purpose
function  createSomeDefaultField() {
    const fields = document.getElementsByClassName('field');
    for (let fieldIndex in fields) {
        if (fieldIndex < 9) {
            fields[fieldIndex].classList.add('default-field');
        }
    }
}

function highlightRelatedFields(width=9, field =document.getElementsByClassName("highlight")){
    let fields = document.getElementsByClassName("field");
    let highlightedFields = document.querySelectorAll(".field.light-highlight");

    highlightedFields.forEach(field => field.classList.remove("light-highlight"));

    if (field.length > 0){
        field = field[0];
        let fieldIndex =Array.from(fields).indexOf(field);
        let rowIndex = Math.floor(fieldIndex / width);
        let collIndex = fieldIndex % width;
        let firstFieldInRow = rowIndex*width;
        for (let i = firstFieldInRow; i < firstFieldInRow+9; i++){
            if (fields[i] !== field) {
                fields[i].classList.add("light-highlight")
            }
        }
        for (let i= 0;i<width*9;i+=width){
            if (fields[i] !== field) {
               fields[collIndex+i].classList.add("light-highlight");
            }
        }

        let boxRowIndex = Math.floor(rowIndex / Math.sqrt(width));
        let boxCollIndex = Math.floor(collIndex / Math.sqrt(width));
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){fields[(((boxCollIndex*3)+i)+((boxRowIndex*3)*9))+(j*9)].classList.add("light-highlight");}
        }
        console.log(boxCollIndex);
        console.log(boxRowIndex);
    }
}


function checkIfAllFieldValid(){
    let fields = document.getElementsByClassName("field");
    fields.forEach( field => {if(!checkIfFieldValid(field,fields)){return false}});
}

function checkIfFieldValid(field,fields){
    let fieldValues = getRelatedFieldValues(field,fields);

    if(fieldValues.row.includes("") || fieldValues.col.includes("")){return false};
    if(new Set(fieldValues.row).size !== fieldValues.row.length || new Set(fieldValues.col).size !== fieldValues.col.length){return false};
    return (new Set(fieldValues.block).size === fieldValues.block.length);

}

function getRelatedFieldValues(field,fields){
    let relatedFields = getRelatedFields(field,fields);
    return relatedFields.map(item => Array.from(item).map(i => i.innerHTML));

}

function getRelatedFields(field,fields){
    let fieldIndex =Array.from(fields).indexOf(field);
    let rowIndex = Math.floor(fieldIndex / width);
    let collIndex = fieldIndex % width;
    return {row :getRow(field,fields,rowIndex),
            col : getColl(field,fields,collIndex),
            block : getBlock(field,fields,rowIndex,collIndex)}
}

function getRow(field,fields,rowIndex,width=9){
    return document.querySelectorAll(`.field:nth-child(n+${1+rowIndex}):nth-child(-n+${width+rowIndex})`)
}

function getColl(field,fields,collIndex,width=9){
    return document.querySelectorAll(`.field:nth-child(9n-${width-(collIndex+1)})`)

}

function getBlock(field,fields,rowIndex,collIndex, width=9){
    let boxRowIndex = Math.floor(rowIndex / Math.sqrt(width));
    let boxCollIndex = Math.floor(collIndex / Math.sqrt(width));

    return document.querySelectorAll(`
                        .field:nth-child(9n+${(boxCollIndex*3+1)+(boxRowIndex*27)}):nth-child(-n+${(boxRowIndex+1)*27}),
                        .field:nth-child(9n+${boxCollIndex*3+2+(boxRowIndex*27)}):nth-child(-n+${(boxRowIndex+1)*27}),
                        .field:nth-child(9n+${boxCollIndex*3+3+(boxRowIndex*27)}):nth-child(-n+${(boxRowIndex+1)*27})`)
}


const BLANK_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let counter
const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function shuffle( array ) {
  let newArray = [...array]
  for ( let i = newArray.length - 1; i > 0; i-- ) {
      const j = Math.floor( Math.random() * ( i + 1 ) );
      [ newArray[ i ], newArray[ j ] ] = [ newArray[ j ], newArray[ i ] ];
  }
  return newArray;
}


/*--------------------------------------------------------------------------------------------
--------------------------------- Check if Location Safe -------------------------------------
--------------------------------------------------------------------------------------------*/

const rowSafe = (puzzleArray, emptyCell, num) => {
  // -1 is return value of .find() if value not found
  return puzzleArray[ emptyCell.rowIndex ].indexOf(num) == -1
}
const colSafe = (puzzleArray, emptyCell, num) => {
  return !puzzleArray.some(row => row[ emptyCell.colIndex ] == num )
}

const boxSafe = (puzzleArray, emptyCell, num) => {
  boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3) // Define top left corner of box region for empty cell
  boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3)
  let safe = true

  for ( boxRow of [0,1,2] ) {  // Each box region has 3 rows
    for ( boxCol of [0,1,2] ) { // Each box region has 3 columns
      if ( puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] == num ) { // Num is present in box region?
        safe = false // If number is found, it is not safe to place
      }
    }
  }
  return safe
}

const safeToPlace = ( puzzleArray, emptyCell, num ) => {
  return rowSafe(puzzleArray, emptyCell, num) &&
  colSafe(puzzleArray, emptyCell, num) &&
  boxSafe(puzzleArray, emptyCell, num)
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Obtain Next Empty Cell -------------------------------------
--------------------------------------------------------------------------------------------*/

const nextEmptyCell = puzzleArray => {
  const emptyCell = {rowIndex: "", colIndex: ""}

  puzzleArray.forEach( (row, rowIndex) => {
      if (emptyCell.colIndex !== "" ) return // If this key has already been assigned, skip iteration
      let firstZero = row.find( col => col === 0) // find first zero-element
      if (firstZero === undefined) return; // if no zero present, skip to next row
      emptyCell.rowIndex = rowIndex
      emptyCell.colIndex = row.indexOf(firstZero)
    })

  if (emptyCell.colIndex !== "" ) return emptyCell
  // If emptyCell was never assigned, there are no more zeros
  return false
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Generate Filled Board -------------------------------------
--------------------------------------------------------------------------------------------*/

const fillPuzzle = startingBoard => {
  const emptyCell = nextEmptyCell(startingBoard)
  // If there are no more zeros, the board is finished, return it
  if (!emptyCell) return startingBoard

  // Shuffled [0 - 9 ] array fills board randomly each pass
  for (num of shuffle(numArray) ) {
    // counter is a global variable tracking the number of iterations performed in generating a puzzle
    // Most puzzles generate in < 500ms, but occassionally random generation could run in to
    // heavy backtracking and result in a long wait. Best to abort this attempt and restart.
    // 20_000_000 iteration maximum is approximately 1.3 sec runtime.
    // See initializer function for more
    counter++
    if ( counter > 20_000_000 ) throw new Error ("Recursion Timeout")
    if ( safeToPlace( startingBoard, emptyCell, num) ) {
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num // If safe to place number, place it
      // Recursively call the fill function to place num in next empty cell
      if ( fillPuzzle(startingBoard) ) return startingBoard
      // If we were unable to place the future num, that num was wrong. Reset it and try next value
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0
    }
  }
  return false // If unable to place any number, return false, which triggers previous round to go to next num
}

const newSolvedBoard = _ => {
  const newBoard = BLANK_BOARD.map(row => row.slice() ) // Create an unaffiliated clone of a fresh board
  fillPuzzle(newBoard) // Populate the board using backtracking algorithm
  return newBoard
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Generate Playable Board ------------------------------------
--------------------------------------------------------------------------------------------*/

const pokeHoles = (startingBoard, holes) => {
  const removedVals = []

  while (removedVals.length < holes) {
    const val = Math.floor(Math.random() * 81) // Value between 0-81
    const randomRowIndex = Math.floor(val / 9) // Integer 0-8 for row index
    const randomColIndex = val % 9

    if (!startingBoard[ randomRowIndex ]) continue // guard against cloning error
    if ( startingBoard[ randomRowIndex ][ randomColIndex ] == 0 ) continue // If cell already empty, restart loop

    removedVals.push({  // Store the current value at the coordinates
      rowIndex: randomRowIndex,
      colIndex: randomColIndex,
      val: startingBoard[ randomRowIndex ][ randomColIndex ]
    })
    startingBoard[ randomRowIndex ][ randomColIndex ] = 0 // "poke a hole" in the board at the coords
    const proposedBoard = startingBoard.map ( row => row.slice() ) // Clone this changed board

    // Attempt to solve the board after removing value. If it cannot be solved, restore the old value.
    // and remove that option from the list
    if ( !fillPuzzle( proposedBoard ) ) {
      startingBoard[ randomRowIndex ][ randomColIndex ] = removedVals.pop().val
    }
  }
  return [removedVals, startingBoard]
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Initialize -------------------------------------
--------------------------------------------------------------------------------------------*/

function newStartingBoard  (holes) {
  // Reset global iteration counter to 0 and Try to generate a new game.
  // If counter reaches its maximum limit in the fillPuzzle function, current attemp will abort
  // To prevent the abort from crashing the script, the error is caught and used to re-run
  // this function
  try {
    counter = 0
    let solvedBoard = newSolvedBoard()

    // Clone the populated board and poke holes in it.
    // Stored the removed values for clues
    let [removedVals, startingBoard] = pokeHoles( solvedBoard.map ( row => row.slice() ), holes)

    return [removedVals, startingBoard, solvedBoard]

  } catch (error) {
    return newStartingBoard(holes)
  }
}

console.log(newStartingBoard(64));
// The board will be completely solved once for each item in the empty cell list.
// The empty cell array is rotated on each iteration, so that the order of the empty cells
// And thus the order of solving the game, is different each time.
// The solution for each attempt is pushed to a possibleSolutions array as a string
// Multiple solutions are identified by taking a unique Set from the possible solutions
// and measuring its length. If multiple possible solutions are found at any point
// If will return true, prompting the pokeHoles function to select a new value for removal.

function multiplePossibleSolutions (boardToCheck) {
  const possibleSolutions = []
  const emptyCellArray = emptyCellCoords(boardToCheck)
  for (let index = 0; index < emptyCellArray.length; index++) {
    // Rotate a clone of the emptyCellArray by one for each iteration
    emptyCellClone = [...emptyCellArray]
    const startingPoint = emptyCellClone.splice(index, 1);
    emptyCellClone.unshift( startingPoint[0] )
    thisSolution = fillFromArray( boardToCheck.map( row => row.slice() ) , emptyCellClone)
    possibleSolutions.push( thisSolution.join() )
    if (Array.from(new Set(possibleSolutions)).length > 1 ) return true
  }
  return false
}

// This will attempt to solve the puzzle by placing values into the board in the order that
// the empty cells list presents
function fillFromArray(startingBoard, emptyCellArray) {
  const emptyCell = nextStillEmptyCell(startingBoard, emptyCellArray)
  if (!emptyCell) return startingBoard
  for (num of shuffle(numArray) ) {
    pokeCounter++
    if ( pokeCounter > 60_000_000 ) throw new Error ("Poke Timeout")
    if ( safeToPlace( startingBoard, emptyCell, num) ) {
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num
      if ( fillFromArray(startingBoard, emptyCellArray) ) return startingBoard
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0
    }
  }
  return false
}

// As numbers get placed, not all of the initial cells are still empty.
// This will find the next still empty cell in the list
function nextStillEmptyCell (startingBoard, emptyCellArray) {
  for (coords of emptyCellArray) {
    if (startingBoard[ coords.row ][ coords.col ] === 0) return {rowIndex: coords.row, colIndex: coords.col}
  }
  return false
}

// Generate array from range, inclusive of start & endbounds.
const range = (start, end) => {
  const length = end - start + 1
  return Array.from( {length} , ( _ , i) => start + i)
}

// Get a list of all empty cells in the board from top-left to bottom-right
function emptyCellCoords (startingBoard) {
    const listOfEmptyCells = []
    for (const row of range(0, 8)) {
        for (const col of range(0, 8)) {
            if (startingBoard[row][col] === 0) listOfEmptyCells.push({row, col})
        }
    }
    return listOfEmptyCells
}

function showBoard(startingBoard){
    let fieldsToFill = document.getElementsByClassName("field");
    for (let i=0; i<fieldsToFill.length; i++){
        fieldsToFill[i].innerHTML = startingBoard[1].flat()[i];
        if (fieldsToFill[i].innerHTML === "0"){
            fieldsToFill[i].innerHTML = "";
        } else {
            fieldsToFill[i].classList.add("default-field");
        }
    }
}

showBoard(newStartingBoard(64));


function initGame() {
    createBoard();
    createInput();
    // createSomeDefaultField() // For testing purpose
    initClickListener();
    // Your game can start here, but define separate functions, don't write everything in here :)

}
