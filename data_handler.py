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
        VALUES ('{board_title}');
        INSERT INTO status_link(status_name, board_name)
        VALUES  ('New', '{board_title}'),
                ('In progress', '{board_title}'),
                ('Testing', '{board_title}'),
                ('Done', '{board_title}');
        """
    cursor.execute(query)


@connection.connection_handler
def rename_board(cursor: RealDictCursor, old_board_title: str, new_board_title: str) -> list:
    query = f"""
        UPDATE boards
        SET title = '{new_board_title}'
        WHERE title = '{old_board_title}';
        UPDATE status_link
        SET board_name ='{new_board_title}'
        WHERE board_name = '{old_board_title}'
        """
    cursor.execute(query)


@connection.connection_handler
def get_statuses(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM status_link
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


@connection.connection_handler
def add_status_link(cursor: RealDictCursor, status_name: str, board_name: str) -> list:
    query = f"""
            INSERT INTO status_link(status_name, board_name)
            VALUES ('{status_name}', '{board_name}')
            """
    cursor.execute(query)


@connection.connection_handler
def rename_column(cursor: RealDictCursor, old_column_title: str, new_column_title: str, board_title: str) -> list:
    query = f"""
            UPDATE status_link
            SET status_name = '{new_column_title}'
            WHERE status_name = '{old_column_title}' AND board_name = '{board_title}'
            """
    cursor.execute(query)


@connection.connection_handler
def add_new_card(cursor: RealDictCursor, card_title: str, board_id: int, status_name: str) -> list:
    query = f"""
        INSERT INTO cards(board_id, title, status_id, "order", status_name)
        VALUES ('{board_id}', '{card_title}', 1, 1, '{status_name}')
            """
    cursor.execute(query)

@connection.connection_handler
def get_cards(cursor: RealDictCursor) -> list:
    query = f"""
        SELECT * FROM cards
    """
    cursor.execute(query)
    return cursor.fetchall()