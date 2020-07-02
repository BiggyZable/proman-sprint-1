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
        print(board_title)
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
        status_name = request.get_json()
        data_handler.add_status(status_name)
        return f'A new status was added: {status_name}'


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
