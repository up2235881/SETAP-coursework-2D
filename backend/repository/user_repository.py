import psycopg2
from models.user_model import User

def db_conn():
    return psycopg2.connect(
    database="slotify_db",
    user="slotify_team",
    password="team_password",
    host="localhost",
    port="5432"
    )

def get_all_users():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''SELECT * FROM users''')
    data = cur.fetchall()
    cur.close()
    conn.close()
    
    users = [User(id=user[0], username=user[1], first_name=user[2], middle_name=user[3], surname=user[4], email=user[5], password=user[6]) for user in users]

    return users

def get_user_by_id(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''SELECT * FROM users WHERE user_id = %s''', (user_id))
    user_data = cur.fetchone()
    cur.close()
    conn.close()

    if user_data:
        return User(id = user_data[0], username= user_data[1], first_name=user_data[2], middle_name= user_data[3], surname= user_data[4], email=user_data[5], password= user_data[6])
    else:
        None

def get_user_by_email(email):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''SELECT * FROM users WHERE user_email = %s''', (email))
    user_data = cur.fetchone()
    cur.close()
    conn.close()

    if user_data:
        return User(id = user_data[0], username= user_data[1], first_name=user_data[2], middle_name= user_data[3], surname= user_data[4], email=user_data[5], password= user_data[6])
    else:
        None

def get_user_by_username(username):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''SELECT * FROM users WHERE user_username = %s''', (username))
    user_data = cur.fetchone()
    cur.close()
    conn.close()

    if user_data:
        return User(id = user_data[0], username= user_data[1], first_name=user_data[2], middle_name= user_data[3], surname= user_data[4], email=user_data[5], password= user_data[6])
    else:
        None

def create_user(username, first_name, middle_name, surname, email, password):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''INSERT INTO users (user_username, user_first_name, user_middle_name, user_surname, user_email, user_password) VALUES (%s, %s)''', (username, first_name, middle_name, surname, email, password))
    new_user_id = cur.fetchone[0]
    conn.commit()
    cur.close()
    conn.close()

    return new_user_id

def update_user(user_id, username, first_name, middle_name, surname, email, password):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''UPDATE users SET user_username = %s, user_first_name = %s, user_middle_name = %s, user_surname = %s, user_email = %s, user_password = %s WHERE user_id = %s''', (username, first_name, middle_name, surname, email, password, user_id))
    conn.commit()
    cur.close()
    conn.close()

def delete_user(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''DELETE FROM users WHERE user_id = %s ''', (user_id))
    conn.commit()
    cur.close()
    conn.close()