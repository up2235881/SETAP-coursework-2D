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

*Slot-ify* is a mobile - based group scheduling and collaboration application developed to help students coordinate team meetings and manage shared tasks more effectively. The system enables users to register and log in securely, create or join rooms, input their availability, automatically find the best meeting times, and upload or view meeting notes.

The goal of the project is to address common challenges in teamwork - such as difficulty in aligning schedules and maintaining clear communication by offering an all in one collaborative space. 

# Project Documentation

## Scope of the Project
This section provides an overview of the project's purpose, goals, and scope.

- **Project Purpose**: Describe the main reason for the project. For example, "This project aims to create a web-based task management tool to help teams collaborate effectively."
- **Goals**: List the specific goals and objectives. For example:
  - Allow users to create, assign, and track tasks.
  - Provide real-time notifications and updates.
  - Integrate with third-party tools like Slack and Google Calendar.

## User Requirements
Outline the needs and expectations of the project's target audience.

- Users should be able to sign up, log in, and manage their profiles.
- Tasks should be sortable by priority, due date, and assignee.
- The system should support team-based collaboration with multiple roles (Admin, Member, Viewer).
- A responsive design that works well on both desktop and mobile devices.

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

