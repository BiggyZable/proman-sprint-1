// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        this.buttonHandler();
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            dom.buttonHandler();
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `
                <section class="board">
                    <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
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
        newboardBtn.addEventListener('click', function () {
            newBoardDiv.classList.add('visible');
        })
        let boardTitleItems = document.querySelectorAll('.board-title');
        for (let boardTitleItem of boardTitleItems) {
            boardTitleItem.addEventListener('dblclick', function () {
                let old_board_title = boardTitleItem.innerHTML
                boardTitleItem.innerHTML = `<input type="text" value="${old_board_title}" data-oldtitle="${old_board_title}">
                                            <button type="button" class="btn btn-primary save-boardname-btn">Save</button>`
                let renameBoardBtns = document.querySelectorAll('.save-boardname-btn')
                for (let renameBoardBtn of renameBoardBtns) {
                    renameBoardBtn.addEventListener('click', () => {
                        let new_board_title = document.querySelector(`[data-oldtitle='${old_board_title}']`).value;
                        dataHandler.renameBoard(old_board_title, new_board_title, function (response) {
                            console.log(response);
                            dom.loadBoards();
                        })
                    })
                }
            })
        }
    }
    // here comes more features
};
