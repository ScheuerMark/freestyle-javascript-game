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
    if (typeof that !== 'undefined' && this !== that) {
        that.classList.remove('selected-number');
    }
    that = this;
    that.classList.toggle('selected-number');
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

function waitForInput(that) {
    const inputField = document.getElementsByClassName('selected-number');
    if (!that.textContent) {
        that.textContent = inputField[0].textContent;
        that.classList.add('text-content');
    } else {
        that.textContent = '';
        that.classList.remove('text-content');
    }
}

function initClickListener() {
    const fields = document.getElementsByClassName('field');
    for (let field of fields) {
        field.addEventListener('click', function () {
            waitForInput(this);
        })
    }
}

function initGame() {
    createBoard();
    createInput();
    initClickListener();
    // Your game can start here, but define separate functions, don't write everything in here :)

}
