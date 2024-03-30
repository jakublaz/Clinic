import React, { useState } from 'react';
import axios from 'axios';

function ManagerCreateDoctor() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        specjalization: '',
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        console.log(formData);
        axios.post('/api/Manager/RegisterDoctor', formData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(() => {
              alert("You have successfully created a doctor");
              window.location.href = "/manager";
            })
            .catch((error) => {
              console.error('Error:', error);
              alert('Failed to create a doctor. Please try again.');
              // You can handle errors here
            });
    };
    

    const specjalizationOptions = [
        'Home',
        'ENT',
        'Dermatologist',
        'Ophthalmologist',
        'Neurologist',
        'Orthopedist',
        'Pediatrician',
    ];

    const formStyle = {
        backgroundColor: '#e0f2f1',
        padding: '20px',
        borderRadius: '10px',
        width: '50%',
        margin: '0 auto',
    };

    const inputStyle = {
        width: '100%',
        marginBottom: '15px',
    };

    return (
        <div style={formStyle}>
            <form>
                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="name"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="name">
                        Name
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="surname"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="surname">
                        Surname
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="userName"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="userName">
                        User Name
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="email"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="phoneNumber"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="phoneNumber">
                        Phone Number
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="password">
                        Password
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control form-control-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <label className="form-label" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                </div>

                <div className="form-outline mb-4">
                    <label htmlFor="specjalization">Specialization</label>
                    <select
                        id="specjalization"
                        className="form-select form-select-lg"
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="">Select specjalization</option>
                        {specjalizationOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                    onClick={handleSubmit}
                >
                    Register Doctor
                </button>
            </form>
        </div>
    );
}

export default ManagerCreateDoctor;
