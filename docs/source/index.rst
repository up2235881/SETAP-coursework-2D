.. Slotify-Mine documentation master file, created by
   sphinx-quickstart on Wed Apr 30 14:41:41 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Slot-ify documentation
==========================

Add your content using ``reStructuredText`` syntax. See the
`reStructuredText <https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html>`_
documentation for details.

**Scope of the Project**

**Project Purpose**: Slot-ify is a web - based group scheduling and collaboration application developed to help students coordinate team meetings and manage shared tasks more effectively. The system enables users to register and log in securely, create or join rooms, input their availability, automatically find the best meeting times, and upload or view meeting notes.

**Goals**: The goal of the project is to address common challenges in teamwork - such as difficulty in aligning schedules and maintaining clear communication by offering an all in one collaborative space. 

**User Requirements**

   

   **Authentication**
      - A user can only access room-related features if they are logged in.
      - Session-based authentication (req.session.user_id) ensures only authenticated users can create or join rooms.

   **Create Room**
      - A logged-in user can create a new room by providing a room name.
      - Upon creation, a unique 6-character invite code is automatically generated and stored along with the room.

   **Join Room via Invite Code**
      - A user can join an existing room by submitting a valid invite code.
      - The system checks that the room exists and that the user is not already a participant.
      - Once joined, the user is added to the room’s participant list, and a notification is created.

   **Access Room Information**
      - A user can retrieve room details either by room ID or by room name.
   
   **Update or Delete Room**
      - Users can update or delete a room they created using the room ID.
      - Room name updates are validated to ensure data consistency.
   
   **Receive Notifications**
      - When a user joins a room, a notification is automatically generated to confirm the action.

## Elements of Implementation
Explain the key technologies or methodologies used to implement the project.

- **Frontend**: React.js for the user interface.
- **Backend**: Node.js with Express.js for the server-side logic.
- **Database**: MongoDB for data storage.
- **Authentication**: JSON Web Tokens (JWT) for secure login and session management.
- **Hosting**: Deployed on AWS with CI/CD pipelines using GitHub Actions.
- **Testing**: Jest for unit tests and Cypress for end-to-end testing.

## Setup and Running Instructions
Provide detailed instructions for setting up and running the project.

### Prerequisites
1. Node.js installed (v16 or later).
2. MongoDB instance running locally or in the cloud.
3. An AWS account for deployment (if applicable).

### Steps to Set Up
1. Clone the repository:
   ```bash
   git clone https://github.com/up2235881/SETAP-coursework-2D.git
   ```
2. Navigate to the project directory:
   ```bash
   cd project-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the following environment variables:
   ```
   PORT=3000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   ```

### Running the Project
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Main Components of the Project
Discuss the critical components of the project and their roles.

### Frontend
- **Components**: TaskList, TaskForm, UserProfile, etc.
- **State Management**: Context API for global state.

### Backend
- **API Endpoints**:
  - `POST /api/tasks`: Create a new task.
  - `GET /api/tasks`: Retrieve tasks.
  - `PUT /api/tasks/:id`: Update a task.
  - `DELETE /api/tasks/:id`: Delete a task.
- **Middleware**: Authentication, logging, and error handling.

### Database
- **Schema**:
  - **User**: Defines user details like name, email, and role.
  - **Task**: Defines task details like title, description, status, and assignee.


.. toctree::
   :maxdepth: 2
   :caption: Contents:

