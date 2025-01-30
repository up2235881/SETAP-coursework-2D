--------- CREATE ENUM TYPES ---------

CREATE TYPE
    meeting_status AS ENUM ('Scheduled', 'Cancelled');

CREATE TYPE
    day AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

CREATE TYPE
    notification_status AS ENUM ('Sent', 'Failed');


--------- CREATE TABLES ---------

CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        user_student_id VARCHAR(10) NOT NULL,
        user_email VARCHAR(150) NOT NULL,
        user_password VARCHAR(50) NOT NULL,
        user_first_name VARCHAR(50) NOT NULL,
        user_middle_name VARCHAR(50),
        user_surname VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
       
CREATE TABLE rooms(
    room_id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    room_name VARCHAR(50) NOT NULL,
    invite_code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE notifications(
    notification_id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    notification_type ENUM NOT NULL,
    message TEXT,
    sent_at TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    notification_status ENUM ('') NOT NULL,
    FOREIGN KEY user_id REFERENCES user(user_id)
);

CREATE TABLE meetings (
    meeting_id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    meeting_location TEXT,
    meeting_status ENUM,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE availability(
    availability_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    meeting_id INT NOT NULL,
    day ENUM,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings (meeting_id)
);


CREATE TABLE notes(
    note_id SERIAL PRIMARY KEY NOT NULL,
    content TEXT NULL,
    attachment VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by TIMESTAMP NOT NULL,
    FOREIGN KEY room_id REFERENCES Rooms(room_id)
);

CREATE TABLE meeting_participants(
    meeting_id INT NOT NULL,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    availability_id INT NOT NULL,
    is_attending boolean,
    notified_at TIMESTAMP NOT NULL,
    FOREIGN KEY (meeting_id) REFERENCES meetings (meeting_id),
    FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (availability_id) REFERENCES availability (availability_id)
);

CREATE TABLE room_participants(
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
);