import psycopg2

conn = psycopg2.connect(
    database="slotify_db",
    user="slotify_team",
    password="team_password",
    host="localhost",
    port="5432"
)
cur = conn.cursor()
cur.execute('''INSERT INTO users (user_username, user_first_name, user_middle_name, user_surname, user_email, user_password) VALUES ('lisaruwona', 'Lisa', 'Faith','Ruwona', 'lr@gmail.com', 'password123')''')

conn.commit()

cur.close()
conn.close()

def get_db_connection():
    return conn

def read_from_db(query, params=None): #read the queried data with optional params from the database 
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, params)
    result = cur.fetchall()
    cur.close()
    conn.close()
    return result

def write_to_db(query, params=None): #insert, update, or delete records in the database
    conn  = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, params)
    conn.commit()
    cur.close()
    conn.close()