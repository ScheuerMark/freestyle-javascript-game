/*data = new FormData();
data.set('Foo',1);
data.set('Bar','boo');

let request = new XMLHttpRequest();
request.open("POST", '/postmethod', true);
request.send(data);
*/
let holes;
initGame();

function createBoard(width = 9) {
    const gameField = document.getElementsByClassName('game-field');
    for (let i = 0; i < Math.pow(width, 2); i++) {
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
        if (!checkIfDefault(highlightedField[0])) {
            highlightedField[0].textContent = this.textContent;
        }

        console.log(checkIfAllFieldValid());
    }
}

function createInput(width = 9) {
    const inputField = document.getElementsByClassName('input-numbers');
    for (let i = 0; i < width; i++) {
        const field = document.createElement('div');
        field.addEventListener('click', selectInput);
        field.classList.add('number-field');
        field.innerText = String(i + 1);
        inputField[0].appendChild(field);
    }
}

function getDefaultFieldsEditable() {
    const defaultFields = [];
    for (let field of document.getElementsByClassName('default-field')) {
        defaultFields.push(field);
    }
    return defaultFields;
}

function waitForInput(event) {
    //event.target (this)
    const inputField = document.getElementsByClassName('selected-number');
    const defaultFields = getDefaultFieldsEditable();
    if (!defaultFields.includes(this)) {
        if (inputField.length) {
            if (!this.textContent) {
                this.textContent = inputField[0].textContent;
                console.log(checkIfAllFieldValid());
            } else {
                if (inputField[0].textContent === this.textContent) {
                    this.textContent = '';
                    console.log(checkIfAllFieldValid());
                } else {
                    this.textContent = inputField[0].textContent;
                    console.log(checkIfAllFieldValid());
                }
            }
        } else {
            const highlightedField = document.getElementsByClassName('highlight');
            if (!highlightedField.length) {
                this.classList.add('highlight');
                that = this
            } else {
                if (highlightedField[0] === this) {
                    console.log("asd");
                    this.classList.remove('highlight');
                } else {
                    highlightedField[0].classList.remove('highlight');
                    this.classList.add('highlight');
                    that = this;
                }
            }
        }

        highlightRelatedFields();
    }

}

function removeTextContent(event) {
    event.preventDefault();
    const defaultFields = getDefaultFieldsEditable();
    if (!defaultFields.includes(this)) {
        this.textContent = '';
        console.log(checkIfAllFieldValid());
    }
}

function moveHighlightedField(direction) { // l,u,r,d

    let fields = [...document.getElementsByClassName('field')];
    //fields = [...fields];
    const highlightedField = document.getElementsByClassName('highlight')[0];
    let fieldIndex = fields.indexOf(highlightedField);
    let change = false;
    if (direction === 'r' && highlightedField.nextSibling) {
        highlightedField.nextSibling.classList.add('highlight');
        change = true
    } else if (direction === 'l' && highlightedField.previousSibling) {
        highlightedField.previousSibling.classList.add('highlight');
        change = true
    } else if (direction === 'u' && fields[fieldIndex - 9]) {
        fields[fieldIndex - 9].classList.add('highlight');
        change = true
    } else if (direction === 'd' && fields[fieldIndex + 9]) {
        fields[fieldIndex + 9].classList.add('highlight');
        change = true
    }

    if (change) {
        highlightedField.classList.remove('highlight');
    }
}

function checkIfDefault(field) {
    const defaultFields = getDefaultFieldsEditable();
    return defaultFields.includes(field);
}

function keyboardInput(event) {
    const highlightedField = document.getElementsByClassName('highlight');
    const defaultFields = getDefaultFieldsEditable();
    if (highlightedField.length) {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
            if (!checkIfDefault(highlightedField[0])) {
                highlightedField[0].textContent = event.key;
            }
            console.log(checkIfAllFieldValid());

        } else if (!defaultFields.includes(highlightedField[0]) && ['Backspace', 'NumpadDecimal', 'Delete'].includes(event.code)) {
            highlightedField[0].textContent = '';
            checkIfAllFieldValid();
        } else if ([37, 38, 39, 40].includes(event.keyCode)) {
            switch (event.keyCode) {
                case 37:
                    moveHighlightedField('l');//left
                    break;
                case 38:
                    moveHighlightedField('u');//up
                    break;
                case 39:
                    moveHighlightedField('r');//right
                    break;
                case 40:
                    moveHighlightedField('d');//down
                    break;
            }
        } else if (['Escape'].includes(event.code)) {
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

function highlightRelatedFields(width = 9) {
    let fields = document.getElementsByClassName("field");
    let field = document.getElementsByClassName("highlight")
    let highlightedFields = document.querySelectorAll(".field.light-highlight");


    highlightedFields.forEach(field => field.classList.remove("light-highlight"));
    if (field.length > 0) {
        field = field[0];
        let relatedFields = getRelatedFields(field, fields);
        Object.values(relatedFields).forEach(items => items.forEach(item => item.classList.add("light-highlight")));
    }
}

function showWinMessage() {
    const winH1 = document.createElement('h1');
    winH1.textContent = "You've won!";
    winH1.classList.add('bring-to-front');
    document.getElementsByTagName('body')[0].appendChild(winH1);
}

function showWinMessageModal() {
    const saveScoreModal = new bootstrap.Modal(document.getElementById("saveScoreModal"));
    const userScore = document.getElementById("userscore");
    userScore.setAttribute('value', String(getScore()));
    saveScoreModal.show(saveScoreModal);
}


function setDifficulty() {
    const difficulty = document.querySelectorAll("input[name='difficulty']");
    for (const level of difficulty) {
        level.addEventListener('click', function () {
            if (this.checked) {
                holes = parseInt(this.dataset.hole);
            }
        });
    }
}

let interval;
let sec;

function startTimer() {
    if (typeof interval !== "undefined") {
        clearInterval(interval);
    }
    sec = 0;

    function pad(val) {
        return val > 9 ? val : "0" + val;
    }

    interval = setInterval(function () {
        document.getElementById("seconds").innerHTML = pad(++sec % 60);
        document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
    }, 1000);


}

function getScore() {
    let score = (sec / 60) * holes;
    console.log(score)
    return score
}

function scoreForm() {
    const saveForm = document.getElementById("save-form");
    saveForm.addEventListener("click", function () {
        function sendData() {
            const XHR = new XMLHttpRequest();

            // Bind the FormData object and the form element
            //  const userName = document.getElementById("username");
            const saveScore = document.getElementById("save-score");
            const data = new FormData(saveScore);


            // Define what happens on successful data submission
            /* XHR.addEventListener( "load", function(event) {
               alert( event.target.responseText );
             } );*/

            // Define what happens in case of error
            XHR.addEventListener("error", function (event) {
                alert('Oops! Something went wrong.');
            });

            // Set up our request
            XHR.open("POST", '/', true);

            // The data sent is what the user provided in the form
            XHR.send(data);
        }

        sendData();
    });
}

let currentGame;

function initGame() {
    createBoard();
    createInput();
    initClickListener();

    //  console.log(difficultyModal);

    holes = 45;
    setDifficulty();
    const startGame = document.getElementById("control1");
    const startGameLabel = document.getElementById("control11")
    startGame.addEventListener('click', () => {

        const winMessagePresent = document.getElementsByClassName('bring-to-front');
        if (winMessagePresent.length) {
            winMessagePresent[0].remove();
        }
        startTimer();
        currentGame = newStartingBoard(holes);
        showBoard(currentGame);
        startGameLabel.textContent = 'New game';
        checkIfAllFieldValid();
    })
    const resetGame = document.getElementById("control2");
    resetGame.addEventListener('click', () => {
        showBoard(currentGame);
        checkIfAllFieldValid();
    })
}

