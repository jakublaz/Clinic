import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'; // Assuming Button is imported from react-bootstrap

function DoctorVisitsSingle() {
    const params = new URLSearchParams(window.location.search);
    const patientName = params.get('patientName');
    const visitDateTime = params.get('visitDateTime');
    const [description, setDescription] = useState(params.get('description') || '');

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!visitDateTime || !description) {
            alert('Visit date and description are required.');
            return;
        }
    
        try {
            const encodedDate = encodeURIComponent(visitDateTime);
            const encodedDescription = encodeURIComponent(description);
    
            const response = await fetch(`/api/Doctor/StartVisit/${encodedDate}/${encodedDescription}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (response.ok) {
                alert('Visit started');
                window.location.href = '/doctor';
            } else {
                const errorMessage = await response.text();
                alert(`Error starting visit: ${errorMessage}`);
            }
        } catch (error) {
            alert(`Error starting visit: ${error}`);
        }
    };
    
    

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#e0f2f1' }}>
            <h1>Start Visit</h1>
            <p>patientName: {patientName}</p>
            <p>visitDateTime: {visitDateTime}</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    style={{ width: '50%', height: '200px', marginBottom: '10px' }}
                    wrap="soft" // Użyj "soft" dla zawijania tekstu
                />
                <Button type="submit">Finish Visit</Button>
            </form>
        </div>
    );
    
}

export default DoctorVisitsSingle;
