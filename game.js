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
                    // this.textContent = ''; // event handler is applied instead
                    this.classList.remove('text-content');
                } else {
                    this.textContent = inputField[0].textContent;
                }
            }
        } else {
            // this.textContent = ''; // event handler is applied instead
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

function initClickListener() {
    const fields = document.getElementsByClassName('field');
    for (let field of fields) {
        field.addEventListener('click', waitForInput);
        field.addEventListener('contextmenu', removeTextContent);
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


function initGame() {
    createBoard();
    createInput();
    // createSomeDefaultField() // For testing purpose
    initClickListener();
    showBoard(newStartingBoard(64));
    // Your game can start here, but define separate functions, don't write everything in here :)

}
