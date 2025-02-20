from flask import Flask, jsonify, render_template, request, psycopg2, bcrypt
#database

app = Flask('__name__')
app.secret_key = 'setap_app'

#database configuration
db_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,
    database="setap_db",
    user="username",
    password="password",
    host="localhost"
)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    
    conn = db_pool.getconn()
    try:
        data = request.form  # Changed from request.json to request.form
        username = data['username']
        email = data['email']
        password = data['password']

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                        (username, email, hashed_password))
        conn.commit()

        return render_template('login.html', message='User registered successfully!')
    except psycopg2.Error as e:
        conn.rollback()
        return render_template('register.html', error=f'Registration failed: {str(e)}')
    finally:
        db_pool.putconn(conn)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    conn = db_pool.getconn()
    try:
        data = request.form  # Changed from request.json to request.form
        email = data['email']
        password = data['password']

        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cur.fetchone()

        if user:
            stored_password = user[3]  # password is at index 3 in the 'users' table

            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                return render_template('index.html', message='Login successful!')
            else:
                return render_template('login.html', error='Invalid password!')
        else:
            return render_template('login.html', error='User not found!')
    except psycopg2.Error as e:
        return render_template('login.html', error=f'Login failed: {str(e)}')
    finally:
        db_pool.putconn(conn)

if __name__ == '__main__':
    app.run(debug=True)