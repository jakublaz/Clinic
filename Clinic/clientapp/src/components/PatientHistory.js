import React, { useState, useEffect } from 'react';

function PatientSpecialization() {
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch('/api/User/HistoryVisits', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const visitsData = await response.json();
                setVisits(visitsData);
            } catch (error) {
                console.error('Error fetching visits:', error);
            }
        };

        fetchVisits();
    }, []);

    return(
        <div style={{ padding: '20px' }}>
            <div style={{ maxHeight: '1000px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', backgroundColor: '#e0f2f1' }}>
                <h2>History Visits:</h2>
                <ul style={{ padding: '0', margin: '0' }}>
                    {visits.map((visit) => (
                        <li
                            key={visit.id}
                            style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px', cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Doctor Name: {visit.doctorName}</p>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Visit Date: {new Date(visit.visitDateTime).toLocaleString()}</p>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px'  }}>Specialization: {visit.specjalization}</p>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px'  }}>Description : {visit.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default PatientSpecialization;