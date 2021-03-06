// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(data),
            headers: new Headers({
                'content-type': 'application/json'
            })
        })
        .then(response => response.json())
        .then(json_response => callback(json_response));
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response)
        })
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCards: function (callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get('/show-cards', (response) => {
            this._data['cards'] = response;
            callback(response)
        })
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/add-board', boardTitle, (response) => {
            callback(response)
        })
    },
    createNewCard: function (cardTitle, boardId, statusName, callback) {
        let cardDict = {card_title: cardTitle, board_id: boardId, status_name: statusName}
        this._api_post('/add-card', cardDict, (response) => {
            callback(response)
        })
    },
    renameBoard: function (old_board_title, new_board_title, callback) {
        let titleDict = {
            old_board_title: old_board_title,
            new_board_title: new_board_title
        }
        this._api_post('/rename-board', titleDict, (response) => {
            callback(response)
        })
    },
    addStatus: function (status_name, board_name, callback) {
        let statusNameBoardName = {
            status_name: status_name,
            board_name: board_name
        }
        this._api_post('/add-status', statusNameBoardName, (response) => {
            callback(response)
        })
    },
    renameColumn: function (oldColumnTitle, newColumnTitle, boardTitle, callback) {
        let titleDict = {
            old_column_title: oldColumnTitle,
            new_column_title: newColumnTitle,
            board_title: boardTitle
        }
        this._api_post('/rename-column', titleDict, (response) => {
            callback(response)
        })
    }

    // here comes more features
};
