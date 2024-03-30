import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'react-bootstrap/Button';

const ManagerCreateSchedule = () => {
  const [doctorUserName, setDoctorUserName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const isTimeValid = (date) => {
    const time = date.getMinutes();
    const hour = date.getHours();

    return time % 15 === 0 && (hour > 7 || (hour === 7 && time === 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isTimeValid(startDate) || !isTimeValid(endDate)) {
      alert('Invalid time selected. Time must be divisible by 15 minutes and after 8:00 AM.');
      return;
    }
  
    if (!doctorUserName) {
      alert('Doctor UserName is required');
      return;
    }
  
    startDate.setHours(startDate.getHours() + 1);
    endDate.setHours(endDate.getHours() + 1);
  
    const formattedStartDate = startDate.toISOString().slice(0, 19);
    const formattedEndDate = endDate.toISOString().slice(0, 19);
  
    try {
      console.log('Request Data:', formattedStartDate, formattedEndDate, doctorUserName);
      const apiUrl = `/api/Manager/CreateSchedule/${formattedStartDate}/${formattedEndDate}/${doctorUserName}`;
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        alert("Schedule created");
        window.location.href = '/manager/seeSchedule';
      } else {
        alert(response.status);
        console.log('Response:', response);
  
        try {
          const responseBody = await response.json();
          console.log('Response Body:', responseBody);
          // Extract and display specific error details if available
          // Example: console.log('Error Message:', responseBody.error);
        } catch (error) {
          console.error('Error parsing response body:', error);
        }
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      // Handle fetch errors, such as network issues or invalid requests
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px', // Adjust the width as needed
        margin: '0 auto', // Centers the form horizontally
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#e0f2f1',
      }}
    >
      <input
        type="text"
        value={doctorUserName}
        onChange={(e) => setDoctorUserName(e.target.value)}
        placeholder="Doctor UserName"
        style={{ marginBottom: '8px' }}
      />
  
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15} // Adjust this value as needed
        dateFormat="MMMM d, yyyy HH:mm"
        style={{ marginBottom: '8px', width: '100%' }} // Make date pickers wider
      />
  
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15} // Adjust this value as needed
        dateFormat="MMMM d, yyyy HH:mm"
        style={{ marginBottom: '8px', width: '125%' }} // Make date pickers wider
      />
  
      <Button type="submit" style={{ marginTop: '8px', width: '100%' }}>Create Schedule</Button>
    </form>
  );
};

export default ManagerCreateSchedule;
