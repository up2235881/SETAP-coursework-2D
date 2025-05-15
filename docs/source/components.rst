Components
==========

**Main Components of the Project**

   **Frontend Components**
      
      - *HTML Pages:*

         - index.html: Provides a landing interface for users to either create or join a room.

         - createroom.html: Contains the room creation form with client-side validation.

         - joinroom.html: Allows users to enter a room via an invite code.

      - *JavaScript:*

         - index.js: Handles form validation and user interactions, and sends requests to the backend API.

      - *Styling:*

         - styling.css: Provides consistent and responsive styling for all pages using custom layout and UI classes.

   **Backend Structure**
      - *Routing Modules:*

         - userRoutes.js: Handles user-related endpoints such as registration and login.

         - roomRoutes.js: Manages room creation, joining, updating, and deletion.

      - *Logic & Data Access:*

         - userModel.js and roomModel.js: Contain functions that process user input, perform validations, and interact directly with the database.

      - *Middleware:*

         - authMiddleware.js: Restricts access to certain API routes based on user session authentication.

   **Database Structure**
      - *Schema Overview (database.sql):*

         - users: Stores user credentials and account details.

         - rooms: Keeps track of room metadata like name, creator, and invite code.

         - room_participants: Records user-room associations and join timestamps.

         - notifications: Logs messages related to user actions (e.g., joining rooms), prepared for future integration with external notification services.
