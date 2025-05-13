document.addEventListener('DOMContentLoaded', () => {
  const roomsList = document.getElementById('my-rooms');
  const meetingsList = document.getElementById('my-meetings');
  const noRoomsMessage = document.getElementById('no-rooms-message');
  const noMeetingsMessage = document.getElementById('no-meetings-message');

  // Load dashboard data
  fetch('/api/dashboard', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      // Display Rooms
      if (data.rooms && data.rooms.length > 0) {
        data.rooms.forEach(room => {
          const li = document.createElement('li');
          li.textContent = room.room_name;
          roomsList.appendChild(li);
        });
      } else {
        noRoomsMessage.style.display = 'block';
      }

      // Display Meetings
      if (data.upcomingMeetings && data.upcomingMeetings.length > 0) {
        data.upcomingMeetings.forEach(meeting => {
          const li = document.createElement('li');
          li.textContent = `${meeting.meeting_topic} in ${meeting.room_name} at ${new Date(meeting.start_time).toLocaleString()}`;
          meetingsList.appendChild(li);
        });
      } else {
        noMeetingsMessage.style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Failed to load dashboard data:', err);
    });

  // Handle Create Room
  document.getElementById('create-room-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const roomName = document.getElementById('create-room-name').value;

    fetch('/api/rooms/create', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_name: roomName })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Room created!');
        window.location.reload(); 
      })
      .catch(err => {
        console.error('Error creating room:', err);
        alert('Error creating room');
      });
  });

  // Handle Join Room
  document.getElementById('join-room-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const roomCode = document.getElementById('join-room-code').value;

    fetch('/api/rooms/join', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_code: roomCode })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Joined room!');
        window.location.reload(); 
      })
      .catch(err => {
        console.error('Error joining room:', err);
        alert('Error joining room');
      });
  });
});
