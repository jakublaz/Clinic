import React, { Component } from 'react';

export default class About extends Component {
    render() {
        const specialties = [
            'Home care',
            'ENT',
            'Dermatologist',
            'Ophthalmologist',
            'Neurologist',
            'Orthopedist',
            'Pediatrician',
          ];
      return (
            <div>
                <h2>Our Clinic</h2>
                    <p>
                        At Polmedic Clinic, we are dedicated to helping everyone we meet. Our vision is to have life without pain.
                        We strive to provide exceptional healthcare services with a patient-centric approach,
                        focusing on general care.
                    </p>
      
                <h3>Services Offered</h3>
                    <p>
                    Our clinic offers a comprehensive range of medical services, including:
                    <ul>
                        {specialties.map((specialty, index) => (
                            <p key={index}>{specialty}</p>
                        ))}
                    </ul>
                        Our team of experienced medical professionals is committed to delivering personalized
                        care and ensuring the well-being of our patients.
                    </p>
            </div>
      );
    }
  }
  