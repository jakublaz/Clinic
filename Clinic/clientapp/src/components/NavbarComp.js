import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import{BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from './Home';
import NotFound from './NotFound';
import Contact from './Contact';
import About from './About';
import Login from './../pages/Login';
import Manager from './../pages/Manager';
import Doctor from './../pages/Doctor';
import Patient from './../pages/Patient';
import Signin from './../pages/Signin';
import DoctorVisitsSingle from './DoctorVisitSingle';
import ManagerCreateDoctor from './ManagerCreateDoctor';
import ManagerAllAccounts from './ManagerActivateAccounts';
import ManagerSeeSchedule from './ManagerSeeSchedule';
import ManagerCreateSchedule from './ManagerCreateSchedule';
import ManagerImagine from './ManagerImagine';
import ManagerUpdate from './ManagerUpdate';

export default class NavbarComp extends Component {
    render(){
        const isLoggedIn = localStorage.getItem('token'); // Assuming token is stored upon login
        const username = localStorage.getItem('username'); // Assuming username is stored upon login
        const userRole = localStorage.getItem('role'); // Assuming role is stored upon login

        const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = '/home';
        };
        return (
            <Router>
                <div>
            <Navbar bg="dark" variant={"dark"} expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to={"/home"}>Clinic</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to={"/home"}>Home</Nav.Link>
                            <Nav.Link as={Link} to={"/about"}>About</Nav.Link>
                            <NavDropdown title="More" id="navbarScrollingDropdown">
                                <NavDropdown.Item as={Link} to={"/contact"}>Contact</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={"/BLANK"}>
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to={"/BLANK"}>
                                    Something else here
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    <Form inline>
                        {isLoggedIn ? (
                            <>
                            <Row>
                                <Col xs="auto">
                                    <Link to="/logout">
                                        <Button type="submit" onClick={handleLogout}>Log out</Button>
                                    </Link>
                                </Col>
                                <Col xs="auto">
                                    <Link to={`/${userRole}`}>
                                        <Button type="submit">{username}</Button>
                                    </Link>
                                </Col>
                            </Row>
                        </>
                        ): (
                            <>
                            <Row>
                            <Col xs="auto">
                                <Link to="/login">
                                    <Button type="submit">Log in</Button>
                                </Link>
                            </Col>
                            <Col xs="auto">
                                <Link to="/signin">
                                    <Button type="submit">Sign in</Button>
                                </Link>
                            </Col>
                        </Row>
                        </>
                        )}
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </div>
        <div>
            <Routes>
            <Route path="/BLANK" element={<NotFound />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />

            {/* after log in */}
            <Route path="/manager" element={<><Manager /><ManagerImagine/></>} />
            <Route path="/manager/createdoctor" element={<><Manager/><ManagerCreateDoctor /></>} />
            <Route path="/manager/allaccounts" element={<><Manager/><ManagerAllAccounts /></>} />
            <Route path="/manager/createschedule" element={<><Manager/><ManagerCreateSchedule /></>} />
            <Route path="/manager/seeschedule" element={<><Manager/><ManagerSeeSchedule /></>} />
            <Route path="/manager/update/:userId" element={<><Manager/><ManagerUpdate /></>} />

            <Route path="/doctor" element={<Doctor />} />
            <Route path="/DoctorVisitsSingle" element={<DoctorVisitsSingle />} />

            <Route path="/patient" element={<Patient/>} />
            </Routes>
        </div>
        </Router>
        )
    }
}