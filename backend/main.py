class availability():
   
    def __init__(self): 
        pass
class Meeting(): 
    def __init__(self): 
        pass
class rooms_participant():
    def __init__(self):
        pass


class User:
    def __init__(self, user_name, email, password):
        self.user_name = user_name
        self.email = email
        self.password = password


    def __str__(self):
        return f"User(user_name='{self.user_name}', email='{self.email}')"


class UserAccountManager:
    def __init__(self):
        self.users = []

    def register_user(self, user):
        # Check if email already exists
        for existing_user in self.users:
            if existing_user.email == user.email:
                print("Account already exists")
                return

        self.users.append(user)
        print("Account created successfully")

    def login_user(self, user):
        found = False
        for existing_user in self.users:
            if existing_user.email == user.email:
                found = True
                if existing_user.password == user.password:
                    print("Logged in")
                else:
                    print("Password is incorrect")
                return  # Exit after finding a match

        if not found:
            print("Account doesn't exist")

    def delete_user(self, user):
        if user in self.users:
            self.users.remove(user)
            return 'user removed successfully'
        else:
            return "User doesn't exist"
        
    def __str__(self):
        output = ""
        for user in self.users:
            output += f"{user},\n"

        return output

        


def test_users():
    user1 = User("Jassi", 'jasdeep@wee.com', 'bvaecaeik339')
    user2 = User("Tannu", 'tannu@wee.com', 'vcwevr9')

    users = UserAccountManager()
    users.register_user(user1)
    users.register_user(user2)

    # Print users in a readable format
    print(users)

    users.delete_user(user2)

    print(users)


test_users()

