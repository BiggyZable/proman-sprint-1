import { dom } from "./dom.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();


}

init();

function makeBoard(){
    const boardContainer = document.getElementById('board-container')
    const boardSection = document.createElement('section');
    boardSection.setAttribute('class', 'board')
    const boardDiv = document.createElement('div');
    boardDiv.setAttribute('class', 'board-header');
    const boardSpan = document.createElement('span');
    boardSpan.setAttribute('class', 'span');
    const boardButton = document.createElement('button');
    boardButton.setAttribute('class', 'board-add');
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('class', 'board-toggle');
    boardDiv.appendChild(boardSpan);
    boardDiv.appendChild(boardButton);
    boardDiv.appendChild(toggleButton);
    boardSection.appendChild(boardDiv);
    boardColumns(boardSection);
    boardContainer.appendChild(boardSection);

}



function boardColumns(boardContainer){
    const boardColumns = document.createElement('div');
    boardColumns.setAttribute('class', 'board-columns');
    // the 4 number means, the number of columns
    for (let i = 0; i <= 4;i++);{
        const column = document.createElement('div');
        column.setAttribute('class', 'board-column');
        for (let j = 0; j <= 4;j++);{
            const card = createCard();
            column.appendChild(card);
        }
        boardColumns.appendChild(column);
    }

    boardContainer.appendChild(boardColumns);
}

function createCard(){
    const card = document.createElement('div');
    card.setAttribute('class','card');
    const cardRemove = document.createElement('div');
    cardRemove.setAttribute('class','card-remove');
    const cardTitle = document.createElement('div');
    cardTitle.setAttribute('class','card-title');
    const cardRemover = document.createElement('i');
    cardRemover.setAttribute('class','fas fa-trash-alt');
    cardRemove.appendChild(cardRemover);
    card.appendChild(cardRemove);
    card.appendChild(cardTitle);
    return card
}