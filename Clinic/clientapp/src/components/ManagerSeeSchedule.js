import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagerSeeSchedule() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = [];
  const [scheduleData, setScheduleData] = useState([]);
  const [action, setAction] = useState('info');

  // Generating times from 8:00 to 20:00 with a step of 15 minutes
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(time);
    }
  }

  const fetchWeeklySchedule = async () => {
    try {
      const response = await axios.get('/api/Manager/SeeSchedule', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.status === 200) {
        throw new Error('Network response was not ok');
      }
  
      const data = response.data;
      setScheduleData(data); // Set the retrieved data into state
    } catch (error) {
      console.error('There was an error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchWeeklySchedule(); // Fetch data when the component mounts
  }, []);

  const createVisit = async (dateTime, doctorUserName) => {
    try {
      const url = `/api/Manager/CreateVisit/${dateTime}/${doctorUserName}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Visit created successfully');
        window.location.reload();
      // Handle success, if needed
      } else {
        const errorData = await response.json();
        const errorMessage = errorData?.error || 'An error occurred';
  
        alert(errorMessage);
  
        console.error('Error response:', errorData);
        console.error('Status code:', response.status);
      }
    } catch (error) {
      alert(error.message);
      console.error('Error setting up the request:', error.message);
    // Handle error, show a message, etc.
    }
  };

  const deleteVisit = async (dateTime, doctorUserName) => {
    try {
      const url = `/api/Manager/DeleteVisit/${dateTime}/${doctorUserName}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Visit deleted successfully');
        window.location.reload();

      } else {
        const errorData = await response.json();
        const errorMessage = errorData?.error || 'An error occurred';
        
        alert(errorMessage);

        console.error('Error response:', errorData);
        console.error('Status code:', response.status);
      }
    } catch (error) {
      alert(error.message);
      console.error('Error setting up the request:', error.message);
    }
  };

  function createFormattedDateTime(day, time) {
    const getDateForDayOfWeek = (dayOfWeek) => {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const targetDayOfWeek = weekdays.indexOf(dayOfWeek);
  
      const difference = targetDayOfWeek - currentDayOfWeek;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + difference);
  
      return targetDate;
    };
  
    const [hour, minute] = time.split(':');
    const targetDate = getDateForDayOfWeek(day);
  
    if (!isNaN(targetDate.getFullYear()) && !isNaN(targetDate.getMonth() + 1) && !isNaN(targetDate.getDate())) {
      const selectedDateTime = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        parseInt(hour, 10) + 1,
        parseInt(minute, 10),
        0
      );
  
      if (!isNaN(selectedDateTime.getTime())) {
        const formattedDateTime = selectedDateTime.toISOString().split('.')[0];
        return formattedDateTime;
      } else {
        console.error('Invalid date');
        return null;
      }
    } else {
      console.error('Invalid year, month, or date');
      return null;
    }
  }
  

  const handleCellClick = (day, time, doctorName) => {

    const date = createFormattedDateTime(day, time);
    if(date == null){
      alert("Invalid date");
      return;
    }

    if (action === 'add') {
      var selecteddoctor = window.prompt("Select Doctor, Write username");
      if(selecteddoctor){
        createVisit(date, selecteddoctor);
      }else{
        alert("No doctor selected");
        return;
      }
    }
    else if (action === 'delete') {
      if(doctorName == null){
        alert("No visit scheduled at this time");
        return;
      }

      var confirmed = window.confirm("Are you sure you want to delete this visit?");

      if(confirmed){
        deleteVisit(date, doctorName);
      }
    }
    else if (action === 'info') {
      if(doctorName == null){
        alert("No visit scheduled at this time");
        return;
      }
      // alert(`Clicked on ${day} at ${time} with action ${action}`);
      var visit = scheduleData.find(visit => {
        const visitTime = new Date(visit.visitDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const visitDate = new Date(visit.visitDateTime).toLocaleDateString('en-US', { weekday: 'long' });

        return day === visitDate && time === visitTime && visit.doctorName === doctorName;
      });

      if(visit == null){
        alert("No visit scheduled at this time");
        return;
      }

      const formattedDateTime = new Date(visit.visitDateTime).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      
      alert(`Visit info\nDoctor Name: ${visit.doctorName}\nPatient Name: ${visit.patientName}\nVisit time: ${formattedDateTime}`);
    }
    // You can perform any action or display content here
  }


  function getMonday() {
    const today = new Date();
    const day = today.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ...)
  
    // Calculate the difference between the current day and Monday (assuming Monday is the start of the week)
    const diffToMonday = day === 0 ? 6 : day - 1;
  
    // Calculate the date for Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
  
    return monday;
  }
  
  function getFriday() {
    const monday = getMonday();
  
    // Calculate the date for Friday (adding 4 days to Monday)
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
  
    return friday;
  }
  
  // Usage
  const mondayDate = getMonday();
  const fridayDate = getFriday();

  const handleActionClick = (selectedAction) => {
    setAction(selectedAction);
  };

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <h2>Weekly Schedule from {mondayDate.toLocaleDateString()} to {fridayDate.toLocaleDateString()}</h2>
        <div className="btn-group" role="group" aria-label="Actions">
          <button
            type="button"
            className={`btn ${action === 'add' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleActionClick('add')}
          >
            Add
          </button>
          <button
            type="button"
            className={`btn ${action === 'delete' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => handleActionClick('delete')}
          >
            Delete
          </button>
          <button
            type="button"
            className={`btn ${action === 'info' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => handleActionClick('info')}
          >
            Info
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr className="table-dark">
              <th></th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
            <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="table-dark">{time}</td>
                  {days.map(day => {
                    const visits = scheduleData.filter(visit => {
                    const visitTime = new Date(visit.visitDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const visitDate = new Date(visit.visitDateTime).toLocaleDateString('en-US', { weekday: 'long' });

                    return day === visitDate && time === visitTime;
                  });

                return (
                  <td key={`${day}-${time}`} className="schedule-cell">
                    <div className="visit-blocks">
                      {visits.map((visit, index) => (
                        <div
                          key={`${day}-${time}-${index}`}
                          onClick={() => handleCellClick(day, time, visit.doctorName)}
                          className={`visit-info ${visit.patientId !== null ? 'occupied-cell' : 'empty-cell'}`}
                          style={{ backgroundColor: visit.patientId !== null ? 'lightcoral' : 'lightgreen' }}
                        >
                          <strong>{visit.doctorName}</strong>
                          <br />
                          {visit.patientName}
                        </div>
                      ))}
                      {/* Render an empty cell with onClick for areas without visits */}
                      {visits.length === 0 && (
                        <div
                          key={`empty-${day}-${time}`}
                          onClick={() => handleCellClick(day, time, null)}
                          className="empty-cell"
                        >
                        {/* Content for empty cell */}
                          -
                        </div>
                      )}
                    </div>
                  </td>
                );
                })}
              </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerSeeSchedule;
