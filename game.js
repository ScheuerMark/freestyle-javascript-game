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

function highlightRelatedFields(width=9){
    let fields = document.getElementsByClassName("field");
    let field =document.getElementsByClassName("highlight")
    let highlightedFields = document.querySelectorAll(".field.light-highlight");


    highlightedFields.forEach(field => field.classList.remove("light-highlight"));
    if (field.length > 0){
        field = field[0];
        let relatedFields = getRelatedFields(field,fields);
        Object.values(relatedFields).forEach(items => items.forEach(item => item.classList.add("light-highlight")));
    }
}





function initGame() {
    createBoard();
    createInput();
    // createSomeDefaultField() // For testing purpose
    initClickListener();
    showBoard(newStartingBoard(64));
    // Your game can start here, but define separate functions, don't write everything in here :)

}
