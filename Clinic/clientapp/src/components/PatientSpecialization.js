import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

function PatientSpecialization() {
    const [visitsDoctorSpeciality, setVisitsDoctorSpeciality] = useState([]);
    const [specjalization, setSpecjalization] = useState('');

    const SeeAllVisitsDoctor = async (specialization) => {
        try {
            const url = `/api/Manager/SeeAllVisitsDoctorSpeciality/${specialization}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const visitsDoctorSpecialityData = await response.json();
            setVisitsDoctorSpeciality(visitsDoctorSpecialityData);
            if (visitsDoctorSpecialityData.length === 0) {
                alert("There are no available visits for this specialization");
            }
        } catch (error) {
            console.error('Error fetching visits:', error);
        }
    };

    const scheduleVisit = async (visitDateTime, doctorId) => {
        try {
            const url = `/api/User/ScheduleVisit/${encodeURIComponent(visitDateTime)}/${doctorId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ visitDateTime, doctorId }),
            });

            if (!response.ok) {
                throw new Error('Failed to schedule visit');
            }
            window.location.reload();
            alert("You have scheduled a visit");
        } catch (error) {
            console.error('Error scheduling visit:', error);
        }
    };

    const specializationOptions = [
        'Home',
        'ENT',
        'Dermatologist',
        'Ophthalmologist',
        'Neurologist',
        'Orthopedist',
        'Pediatrician',
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxHeight: '1000px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', backgroundColor: '#e0f2f1' }}>
                <h2>Visits by Specialization:</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <select
                        value={specjalization}
                        onChange={(e) => setSpecjalization(e.target.value)}
                        style={{
                            width: '200px',
                            marginRight: '10px',
                            fontSize: '16px',
                            padding: '5px'
                        }}
                    >
                        <option value="">Select Specialization</option>
                        {specializationOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <Button onClick={() => SeeAllVisitsDoctor(specjalization)}>See Visits</Button>
                </div>
                <ul style={{ padding: '0', margin: '0', maxHeight: '600px', overflowY: 'scroll' }}>
                    {visitsDoctorSpeciality.map((visit) => (
                        <li
                            key={visit.id}
                            style={{
                                marginBottom: '10px',
                                borderBottom: '1px solid #eee',
                                paddingBottom: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Doctor Name: {visit.doctorName}</p>
                            <p style={{ margin: '0', fontSize: '16px', marginRight: '20px' }}>Visit Date: {new Date(visit.visitDateTime).toLocaleString()}</p>
                            <input type="text" value={visit.doctorId} id="doctorId" readOnly disabled style={{ display: 'none' }} />
                            <Button onClick={() => scheduleVisit(visit.visitDateTime, visit.doctorId)}>Schedule</Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PatientSpecialization;
