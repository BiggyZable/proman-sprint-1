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
        dom.loadStatuses()
    },
    loadStatuses: function () {
        dataHandler.getStatuses( function (statuses) {
            dom.showColumns(statuses);
            dom.buttonHandlerColumns();
        })
    },
    showColumns: function (statuses) {
        let boardColumns = document.querySelectorAll('.board-columns');
        for (let boardColumn of boardColumns) {
            let boardColumnHTML = ''
            let boardTitle = boardColumn.dataset.boardtitle;
            for (let status of statuses) {
                if (status.board_name === boardTitle) {
                    boardColumnHTML += `<div class="board-column">
                                            <div class="board-column-title" data-boardtitle="${boardTitle}">${status.status_name}</div>
                                            <div class="board-column-content"></div>
                                        </div>`
                }
            }
            boardColumn.innerHTML = boardColumnHTML;
        }
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `
                <section class="board">
                    <div class="board-header"><span class="board-title">${board.title}</span>
                        <span class="board-specific hidden" data-boardtitle="${board.title}">
                            <button class="card-add">Add Card</button>
                            <button class="column-add" data-boardtitle="${board.title}">Add Column</button>
                            <span class="column-add-form hidden" data-boardtitle="${board.title}">
                                <input type="text" class="column-add-input" data-boardtitle="${board.title}" value="">
                                <button class="save-status-btn" data-boardtitle="${board.title}">Save</button>
                            </span>
                        </span>
                        <button class="board-toggle" data-boardtitle="${board.title}"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="board-columns hidden" data-boardtitle="${board.title}">
                        
                    </div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        let boardsContainer = document.querySelector('#boards');
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
                dom.init()
                console.log(response);
                newBoardDiv.classList.add('hidden');
            })
        })
        let newboardBtn = document.querySelector('#new-board-btn');
        newboardBtn.addEventListener('click', function () {
            newBoardDiv.classList.remove('hidden');
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
        let dropDownBtns = document.querySelectorAll('.board-toggle')
        for (let dropDownBtn of dropDownBtns) {
            dropDownBtn.addEventListener('click', function () {
                let boardTitle = dropDownBtn.dataset.boardtitle;
                let boardColumn = document.querySelector(`div.board-columns[data-boardtitle="${boardTitle}"]`);
                boardColumn.classList.toggle('hidden');
                let boardSpecificItems = document.querySelectorAll(`.board-specific[data-boardtitle="${boardTitle}"]`);
                for (let boardSpecificItem of boardSpecificItems) {
                    boardSpecificItem.classList.toggle('hidden');
                }
                if (dropDownBtn.firstElementChild.classList.contains('fa-chevron-down')) {
                    dropDownBtn.firstElementChild.classList.remove('fa-chevron-down');
                    dropDownBtn.firstElementChild.classList.add('fa-chevron-up');
                } else {
                    dropDownBtn.firstElementChild.classList.remove('fa-chevron-up');
                    dropDownBtn.firstElementChild.classList.add('fa-chevron-down');
                }
            })
        }
        let addNewColumnBtns = document.querySelectorAll('.column-add')
        for (let addNewColumnBtn of addNewColumnBtns) {
            addNewColumnBtn.addEventListener('click', function () {
                let boardTitle = addNewColumnBtn.dataset.boardtitle;
                let newColumnInputs = document.querySelectorAll(`.column-add-form[data-boardtitle="${boardTitle}"]`);
                for (let newColumnInput of newColumnInputs) {
                    newColumnInput.classList.toggle('hidden')
                }
            })
        }
        let saveNewStatusBtns = document.querySelectorAll('.save-status-btn');
        for (let saveNewStatusBtn of saveNewStatusBtns) {
            let boardTitle = saveNewStatusBtn.dataset.boardtitle
            saveNewStatusBtn.addEventListener('click', function () {
                let newStatusName = document.querySelector(`.column-add-input[data-boardtitle="${boardTitle}"]`).value
                dataHandler.addStatus(newStatusName, boardTitle, function (response) {
                    console.log(response);
                    dom.loadStatuses();
                })
            })
        }
    },
    buttonHandlerColumns: function () {
        let columnTitles = document.querySelectorAll('.board-column-title')
        for (let columnTitle of columnTitles) {
            let boardTitle = columnTitle.dataset.boardtitle
            columnTitle.addEventListener('dblclick', function () {
                let oldColumnTitle = columnTitle.innerHTML
                columnTitle.innerHTML = `<input type="text" value="${oldColumnTitle}" data-oldcolumntitle="${oldColumnTitle}">`
                let inputField = document.querySelector(`[data-oldcolumntitle="${oldColumnTitle}"]`)
                inputField.addEventListener('keypress', function (event) {
                    if (event.keyCode === 13) {
                        let newColumnTitle = inputField.value
                        // columnTitle.innerHTML = newColumnTitle
                        dataHandler.renameColumn(oldColumnTitle, newColumnTitle, boardTitle, function (response) {
                            console.log(response);
                            dom.loadStatuses();
                        })
                    }
                })
            })
        }
    }
    // here comes more features
};
