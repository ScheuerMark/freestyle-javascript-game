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
    if (!defaultFields.includes(this)
    ) {
        if (inputField.length) {
            if (!this.textContent) {
                this.textContent = inputField[0].textContent;
                this.classList.add('text-content');
            } else {
                if (inputField[0].textContent === this.textContent) {
                    this.textContent = '';
                    this.classList.remove('text-content');
                } else {
                    this.textContent = inputField[0].textContent;
                }
            }
        } else {
            this.textContent = '';
            this.classList.remove('text-content');
        }
    }
}

function initClickListener() {
    const fields = document.getElementsByClassName('field');
    for (let field of fields) {
        field.addEventListener('click', waitForInput);
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

function initGame() {
    createBoard();
    createInput();
    createSomeDefaultField() // For testing purpose
    initClickListener();
    // Your game can start here, but define separate functions, don't write everything in here :)

}
