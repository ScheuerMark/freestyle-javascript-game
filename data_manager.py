import database_common
from psycopg2 import sql

@database_common.connection_handler
def add_user(cursor, new_score_form):
    query = sql.SQL("INSERT INTO sudoku_scores (user_name, user_score, registration_date)  VALUES ({}, {},(SELECT NOW()::timestamp(0)))").format(sql.Literal(new_score_form['user_name']), sql.Literal(float(new_score_form['user_score'])))
    cursor.execute(query)


@database_common.connection_handler
def list_scores(cursor):
    query = "SELECT user_name, user_score, registration_date FROM sudoku_scores ORDER BY user_score"
    cursor.execute(query)
    return cursor.fetchall()

