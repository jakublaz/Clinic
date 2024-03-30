import React, { useState } from 'react';
import axios from 'axios';

function Signin() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: ''
      });

      const [agreeTerms, setAgreeTerms] = useState(false);

      const handleagreeTerms = (e) => {
        setAgreeTerms(e.target.checked);
      };
    
      const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
      
        // Update the state based on the input type
        setFormData((prevData) => ({
          ...prevData,
          [id]: type === 'checkbox' ? checked : value,
        }));
      };
      
    
      const handleSubmit = () => {
        if(agreeTerms === true){

        axios.post('/api/User/RegisterPatient', formData)
          .then((response) => {
            alert("You have been registered");
            window.location.href = "/home";
          })
          .catch((error) => {
            console.error('Error:', error);
            alert("Error: " + error.message);
          });
        }else{
            alert("You have to agree with terms and conditions and the passwords have to be the same")
        }
      };
  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">Create an account</h2>

                  <form>
                    <div className="form-outline mb-4">
                      <input type="text" id="name" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="name">Your Name</label>
                    </div>

                    <div className="form-outline mb-4">
                      <input type="text" id="surname" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="surname">Your Surname</label>
                    </div>

                    <div className="form-outline mb-4">
                      <input type="text" id="userName" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="userName">Your User Name</label>
                    </div>

                    <div className="form-outline mb-4">
                      <input type="email" id="email" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="email">Your Email</label>
                    </div>

                    <div className="form-outline mb-4">
                      <input type="email" id="phoneNumber" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="phoneNumber">Your Phone Number</label>
                    </div>

                    <div className="form-outline mb-4">
                      <input type="password" id="password" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="password">Password</label>
                    </div>

                    <div className="form-outline mb-4">
                      <input type="password" id="confirmPassword" className="form-control form-control-lg" onChange={handleChange} />
                      <label className="form-label" htmlFor="confirmPassword">Repeat your password</label>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-5">
                      <input className="Terms" type="checkbox" value="" id="Terms" onChange={handleagreeTerms} />
                      <label className="form-check-label" htmlFor="Terms">
                        I agree all statements in Terms of service
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body "
                        onClick={handleSubmit}
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Have already an account? <a href="/login" className="fw-bold text-body"><u>Login here</u></a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signin;
