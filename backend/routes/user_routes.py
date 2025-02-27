from flask import Blueprint, jsonify, request
from services.service import get_all_users_service, get_user_by_id_service, get_user_by_email_service, get_user_by_username_service,create_user_service, update_user_service, delete_user_service
import bcrypt

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get("username")
        first_name = data.get('first name')
        #middle_name = None or data['middle name']
        surname  = data.get('surname')
        email = data.get('email')
        password = data.get('password')

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        if not all([username, first_name, surname, email, password]):
            return jsonify({"error": "Missing required fields"}), 400
        
        user_id = create_user_service(username, first_name, surname, email, hashed_password)
        return jsonify({"message" : "User registred successfully!", "user_id" : user_id}), 201
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    
@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if not password:
            return jsonify({"error": "Passwrod is required"}), 400
        
        user = None

        if email:
            user = get_user_by_email_service(email)
        elif username:
            user = get_user_by_username_service(username)

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
        
        return jsonify({"error" : "invalid credentials"}), 401
    
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
        