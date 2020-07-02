import persistence
import connection
from psycopg2.extras import RealDictCursor

def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


@connection.connection_handler
def get_boards(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM boards
        ORDER BY id ASC
        """
    cursor.execute(query)
    return cursor.fetchall()

def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


@connection.connection_handler
def add_board(cursor: RealDictCursor, board_title: str) -> list:
    query = f"""
        INSERT INTO boards(title)
        VALUES ('{board_title}')
        """
    cursor.execute(query)


@connection.connection_handler
def rename_board(cursor: RealDictCursor, old_board_title: str, new_board_title: str) -> list:
    query = f"""
        UPDATE boards
        SET title = '{new_board_title}'
        WHERE title = '{old_board_title}'
        """
    cursor.execute(query)


@connection.connection_handler
def get_statuses(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM statuses
        ORDER BY id ASC
        """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def add_status(cursor: RealDictCursor, status_name: str) -> list:
    query = f"""
        INSERT INTO statuses(title)
        VALUES ('{status_name}')
        """
    cursor.execute(query)
