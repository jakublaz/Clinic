import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function DoctorVisits() {
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch('/api/Doctor/MyVisits', {
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

    const handleStartVisit = (patientName, visitDateTime, description) => {
        window.location.href = `/DoctorVisitsSingle?patientName=${encodeURIComponent(patientName)}&visitDateTime=${encodeURIComponent(visitDateTime)}&description=${encodeURIComponent(description)}`;
    };
    
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxHeight: '1000px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', backgroundColor: '#e0f2f1' }}>
                <h2>My Visits:</h2>
                <ul style={{ padding: '0', margin: '0' }}>
                    {visits.map((visit) => (
                        <li
                            key={visit.id}
                            style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px', cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Patient Name: {visit.patientName}</p>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Visit Date: {new Date(visit.visitDateTime).toLocaleString()}</p>
                                <input type="text" value={visit.description} id="description" readOnly disabled style={{ display: 'none' }} />
                                <Button
                                    type="submit"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => handleStartVisit(visit.patientName, visit.visitDateTime, visit.description)}
                                >
                                    Start Visit
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DoctorVisits;
