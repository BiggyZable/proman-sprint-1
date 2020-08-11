from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/add-board", methods=["POST"])
@json_response
def add_board():
    if request.method == "POST":
        board_title = request.get_json()
        data_handler.add_board(board_title)
        return f'ez itt a {board_title}'


@app.route("/rename-board", methods=["POST"])
@json_response
def rename_board():
    if request.method == "POST":
        old_board_title = request.get_json()['old_board_title']
        new_board_title = request.get_json()['new_board_title']
        data_handler.rename_board(old_board_title, new_board_title)
        return f'ez itt az uj {new_board_title} a {old_board_title} helyett'


@app.route("/get-statuses", methods=["GET"])
@json_response
def get_statuses():
    if request.method == "GET":
        return data_handler.get_statuses()


@app.route("/add-status", methods=["POST"])
@json_response
def add_status():
    if request.method == "POST":
        status_board_dict = request.get_json()
        status_name = status_board_dict['status_name']
        board_name = status_board_dict['board_name']
        data_handler.add_status(status_name)
        data_handler.add_status_link(status_name, board_name)
        return f'A new status was added: {status_name} to the board {board_name}'


@app.route("/rename-column", methods=["POST"])
@json_response
def rename_column():
    if request.method == "POST":
        column_title_dict = request.get_json()
        old_column_title = column_title_dict['old_column_title']
        new_column_title = column_title_dict['new_column_title']
        board_title = column_title_dict['board_title']
        data_handler.rename_column(old_column_title, new_column_title, board_title)
        return f'The name of the column {old_column_title} from board: {board_title} was renamed to {new_column_title}'


@app.route('/add-card', methods=['POST'])
@json_response
def add_new_card():
    if request.method == "POST":
        card_dict = request.get_json()
        card_title = card_dict['card_title']
        board_id = card_dict['board_id']
        status_name = card_dict['status_name']
        data_handler.add_new_card(card_title, board_id, status_name)
        return f'Added card: {card_title} to board {board_id}'

@app.route('/show-cards', methods=['GET'])
@json_response
def show_cards():
    if request.method == "GET":
        return data_handler.get_cards()



def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
