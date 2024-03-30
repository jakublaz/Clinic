import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';

const getUserInfoFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;
    console.log(decoded);

    return userRole;

  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUserName = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/Auth/Login', {
        username: username,
        password: password
      });

      setMessage('Login successful');
      localStorage.setItem('token', response.data.token);
      const userRole = getUserInfoFromToken(response.data.token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('username', username);

      switch (userRole) {
        case 'Manager':
          window.location.href = '/manager';
          break;
        case 'Doctor':
          window.location.href = '/doctor';
          break;
        case 'Patient':
          window.location.href = '/patient';
          break;
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage("Unauthorized, Wrong username or password ");
    }
  };

  return (
    <MDBContainer className="my-5">
      <form onSubmit={handleSubmit}>
        <MDBCard>
          <MDBRow className='g-0'>
          <MDBCol md='6'>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100'/>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2'>
                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                <span className="h1 fw-bold mb-0">Polmedic</span>
              </div>

              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>
            <MDBInput
              wrapperClass='mb-4'
              label='User Name'
              id='formControlLgLog'
              type='username'
              size="lg"
              onChange={handleUserName}
              value={username}
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Password'
              id='formControlLgPass'
              type='password'
              size="lg"
              onChange={handlePasswordChange}
              value={password}
            />
            <MDBBtn className="mb-4 px-5" color='dark' size='lg' type="submit">
              Login
            </MDBBtn>
            </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </form>
      <p>{message}</p>
    </MDBContainer>
  );
}

export default Login;
