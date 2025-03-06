from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import psycopg2
import uuid  # For generating invite codes
from config import Config
from database_access.db_access import get_db_connection, put_db_connection

room_bp = Blueprint('room', __name__)



@room_bp.route('/create', methods=['GET', 'POST'])
def create_room():
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))

    if request.method == 'GET':
        return render_template('create_room.html')

    conn = None
    try:
        conn = get_db_connection()
        data = request.form
        room_name = data['room_name']
        user_id = session['user_id']
        invite_code = str(uuid.uuid4())  # Generate a unique invite code

        with conn.cursor() as cur:
            # Create the room in the database
            cur.execute(
                "INSERT INTO rooms (user_id, room_name, invite_code) VALUES (%s, %s, %s) RETURNING room_id",
                (user_id, room_name, invite_code)
            )
            room_id = cur.fetchone()[0]  # Retrieve the room_id of the newly created room
            conn.commit()

            flash('Room created successfully', 'success')
            return redirect(url_for('room.room_dashboard', room_id=room_id))  # Redirect to the new room

    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        flash(f'Failed to create room: {e}', 'error')
        return render_template('create_room.html')  # Stay on the create room page with an error message
    finally:
        if conn:
            put_db_connection(conn)
