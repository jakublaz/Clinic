import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function PatientVisits() {
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch('/api/User/MyVisits', {
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

    const cancelVisit = async (visitDateTime, doctorId) => {
        try {
            const url = `/api/User/CancelVisit/${encodeURIComponent(visitDateTime)}/${doctorId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ visitDateTime, doctorId }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel visit');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error canceling visit:', error);
            alert("There is an error while canceling visit");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxHeight: '1000px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', backgroundColor: '#e0f2f1' }}>
                <h2>Next Visits:</h2>
                <ul style={{ padding: '0', margin: '0' }}>
                    {visits.map((visit) => (
                        <li
                            key={visit.id}
                            style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px', cursor: 'pointer' }}
                            onClick={() => cancelVisit(visit.visitDateTime, visit.doctorId)}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Doctor Name: {visit.doctorName}</p>
                                <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Visit Date: {new Date(visit.visitDateTime).toLocaleString()}</p>
                                <p style={{ margin: '0', fontSize: '16px' }}>Specialization: {visit.specialization}</p>
                                <input type="text" value={visit.doctorId} id="doctorId" readOnly disabled style={{ display: 'none' }} />
                                <Button type="submit" style={{ marginLeft: '10px' }}>Resign</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PatientVisits;
