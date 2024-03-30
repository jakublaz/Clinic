import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientVisits from '../components/PatientVisits';
import PatientSpecialization from '../components/PatientSpecialization';
import PatientHistory from '../components/PatientHistory';


const Patient = () => {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    // Fetch the activation status when the component mounts
    const fetchData = async () => {
        const userName = localStorage.getItem('username');
      try {
        const response = await axios.get(`/api/User/IsActivated/${userName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Assuming the response.data contains the activation status
        setIsActivated(response.data);
        console.log(isActivated);
      } catch (error) {
        console.error('Error fetching activation status:', error);
        // Handle errors if needed
      }
    };

    fetchData(); // Call the function
  }, []);

  return (
    <div>
        {isActivated ? (
            <>
                <PatientVisits />
                <PatientSpecialization />
                <PatientHistory />
            </>
        ) : (
            <div>
                <h1>Account is not activated</h1>
            </div>
        )}
    </div>
  );
};

export default Patient;
