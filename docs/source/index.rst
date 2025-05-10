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
Outline the needs and expectations of the project's target audience.

- Users should be able to sign up, log in, and manage their profiles.
- Tasks should be sortable by priority, due date, and assignee.
- The system should support team-based collaboration with multiple roles (Admin, Member, Viewer).
- A responsive design that works well on both desktop and mobile devices.

**Elements of Implementation**
Explain the key technologies or methodologies used to implement the project.

-Frontend:
HTML5, CSS3, and vanilla JavaScript were used to build the user interface. The design focuses on simplicity and accessibility for tasks like room creation and joining.

-Backend:
Node.js with Express.js was used to handle server-side logic, including routing, session handling, and API requests.

-Database:
PostgreSQL was used as the relational database system, managed through the pg Node.js library. It stores user data, room information, participants, and notifications.

-Authentication:
Session-based authentication was implemented using express-session to manage user login states securely across requests.

-Notifications (Planned):
Internal notification logic is implemented, with room to extend to email or push notifications in future iterations.

## Setup and Running Instructions
Provide detailed instructions for setting up and running the project.

**Prerequisites**
Before you begin, ensure you have the following installed on your machine:
1. Node.js installed (v16 or later recommended).
2. PostgreSQL installed and running locally.
3. A PostgreSQL database created (e.g., slotify_db) with correct user credentials.

**Steps to Set Up**
1. Clone the repository:
   ```bash
   git clone https://github.com/up2235881/SETAP-coursework-2D.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SETAP-coursework-2D
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure the database:
   ```
   -Ensure the database credentials in db_config.js match your local setup.
   -Run the provided database.sql script to create necessary tables.
   ```
5. Start the server:
   ```bash
   node server.js
   ```
The app should now be running on http://localhost:3000.

6. Open index.html in a browser to interact with the frontend.


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

