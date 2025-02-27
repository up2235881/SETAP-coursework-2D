class User:
    def __init__(self, user_id, username, first_name, middle_name, surname, email, password):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.password = password

    def to_dict(self):
        """Convert object to dictionary (for JSON responses)"""
        return {
            "user_id" : self.user_id,
            "username" : self.username,
            "email" : self.email,
            "password" : self.password
        }

