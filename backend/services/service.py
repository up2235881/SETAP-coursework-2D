from repository.user_repository import get_all_users, get_user_by_id, get_user_by_email, get_user_by_username,create_user, update_user, delete_user

def get_all_users_service():
    return get_all_users()

def get_user_by_id_service(user_id):
    return get_user_by_id(user_id)

def get_user_by_email_service(email):
    return get_user_by_email(email)

def get_user_by_username_service(username):
    return get_user_by_username(username)

def create_user_service(username, first_name, middle_name, surname, email, password):
    return create_user(username, first_name, middle_name, surname, email, password)

def update_user_service(user_id, username, first_name, middle_name, surname, email, password):
    return update_user(user_id, username, first_name, middle_name, surname, email, password)

def delete_user_service(user_id):
    return delete_user(user_id)