import connection

@connection.connection_handler
def get_boards(cursor):
    cursor.execute("""
    SELECT * FROM boards
    """)
    result = cursor.fetchall()
    return result



# @connection.connection_handler
# def store_board(cursor, b_id, b_title):
#     cursor.execute("""
#     insert into boards
#     values (%(b_id)s,%(b_title)s)
#     """,
#                    {'b_id': b_id, 'b_title': b_title})
#
# @connection.connection_handler
# def update_board_title(cursor, b_id, b_title):
#     cursor.execute("""
#     update boards
#     set title = %(b_title)s
#     where id = %(b_id)s""",
#                    {'b_id':b_id, 'b_title':b_title})