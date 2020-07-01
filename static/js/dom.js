// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        this.buttonHandler();
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
            dom.buttonHandler();
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <li>${board.title}</li>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        //boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        boardsContainer.innerHTML = outerHtml;
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    buttonHandler: function () {
        let savenewBoardBtn = document.querySelector('#save-newboard-btn');
        let newBoardDiv = document.querySelector('.new-board-input');
        savenewBoardBtn.addEventListener('click', function () {
            let boardTitle = document.querySelector('#new-board-title').value;
            dataHandler.createNewBoard(boardTitle, function (response) {
                dom.loadBoards();
                console.log(response);
                newBoardDiv.classList.remove('visible')

            })
        })
        let newboardBtn = document.querySelector('#new-board-btn');
        newboardBtn.addEventListener('click', function() {
            newBoardDiv.classList.add('visible');
        })
        let boardTitleItems = document.getElementsByTagName('li');
        for (let boardTitleItem of boardTitleItems) {
            boardTitleItem.addEventListener('click', function() {
                console.log('működik')
            })
        }
    }
    // here comes more features
};
