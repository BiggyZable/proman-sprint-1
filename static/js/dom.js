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
        dataHandler.getStatuses(function (statuses) {
            dom.showColumns(statuses);
            dom.buttonHandlerColumns();
            dom.loadCards()
        })
    },
    showColumns: function (statuses) {
        let boardColumns = document.querySelectorAll('.board-columns');
        for (let boardColumn of boardColumns) {
            let boardColumnHTML = ''
            let boardTitle = boardColumn.dataset.boardtitle;
            let boardId = boardColumn.dataset.boardid;
            for (let status of statuses) {
                if (status.board_name === boardTitle) {
                    boardColumnHTML += `<div class="board-column">
                                            <div class="board-column-title" data-boardtitle="${boardTitle}">${status.status_name}</div>
                                            <div class="board-column-content" data-boardid="${boardId}" data-boardtitle="${boardTitle}" data-statustitle="${status.status_name}"></div>
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
                            <button class="card-add" data-boardid="${board.id}" data-boardtitle="${board.title}">Add Card</button>
                            <span class="card-add-form hidden" data-boardtitle="${board.title}">
                                <input type="text" class="card-add-input" data-boardtitle="${board.title}" value="">
                                <button class="card-save-btn" data-boardtitle="${board.title}">Save</button>
                            </span>
                            <button class="column-add" data-boardtitle="${board.title}">Add Column</button>
                            <span class="column-add-form hidden" data-boardtitle="${board.title}">
                                <input type="text" class="column-add-input" data-boardtitle="${board.title}" value="">
                                <button class="save-status-btn" data-boardtitle="${board.title}">Save</button>
                            </span>
                        </span>
                        <button class="board-toggle" data-boardtitle="${board.title}"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="board-columns hidden" data-boardtitle="${board.title}" data-boardid="${board.id}">
                        
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
    loadCards: function () {
        // retrieves cards and makes showCards called
        dataHandler.getCards(function (cards) {
            console.log('kaki', cards)
            dom.showCards(cards)
        })


    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            let statusName = card.status_name
            let boardId = card.board_id
            console.log(statusName, boardId)
            let column = document.querySelector(`.board-column-content[data-boardid="${boardId}"][data-statustitle="${statusName}"]`)
            console.log(column)
            let alreadyInCards = column.innerHTML
            let cardsHTML = alreadyInCards
            cardsHTML += `<div class="card">${card.title}</div>`
            column.innerHTML = cardsHTML
        }

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
                // document.addEventListener("click", function () {
                //     boardTitleItem.innerHTML = old_board_title
                // })
            })
        }
        let dropDownBtns = document.querySelectorAll('.board-toggle')
        for (let dropDownBtn of dropDownBtns) {
            dropDownBtn.addEventListener('click',() => {
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
        let addCardBtns = document.querySelectorAll('.card-add')
        for (let button of addCardBtns) {
            let boardTitle = button.dataset.boardtitle
            let boardId = button.dataset.boardid
            let cardInput = document.querySelector(`.card-add-form[data-boardtitle="${boardTitle}"]`)
            button.addEventListener('click' , function(){
                cardInput.classList.toggle('hidden')
            })

            cardInput.addEventListener('keyup', function(e) {

                if(e.keyCode === 13) {
                    cardInput.classList.toggle('hidden')
                    let cardTitle = document.querySelector(`.card-add-input[data-boardtitle="${boardTitle}"]`).value
                    let statusName = document.querySelector(`.board-column-content[data-boardtitle="${boardTitle}"]`).dataset.statustitle
                    console.log(statusName);
                    dataHandler.createNewCard(cardTitle, boardId, statusName, function(response){
                        console.log(response);
                    })
                    dom.loadStatuses()
                }
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
                inputField.addEventListener('keyup', function (event) {
                    if (event.keyCode === 13) {
                        let newColumnTitle = inputField.value
                        dataHandler.renameColumn(oldColumnTitle, newColumnTitle, boardTitle, function (response) {
                            console.log(response);
                            dom.loadStatuses();
                        })
                    } else if (event.keyCode === 27) {
                        columnTitle.innerHTML = oldColumnTitle
                    }
                })
                // document.addEventListener("click", function () {
                //     columnTitle.innerHTML = oldColumnTitle
                // })
            })
        }
    }
    // here comes more features
};
