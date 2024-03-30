import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function Manager() {
    const buttonStyle = {
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
    };

    return (
        <div>
            <Link to="/manager/createdoctor">
                <Button variant="primary" style={buttonStyle}>
                    Create Doctor
                </Button>
            </Link>
            <Link to="/manager/allaccounts">
                <Button variant="primary" style={buttonStyle}>
                    All Accounts
                </Button>
            </Link>
            <Link to="/manager/createschedule">
                <Button variant="primary" style={buttonStyle}>
                    Create Schedule
                </Button>
            </Link>
            <Link to="/manager/seeschedule">
                <Button variant="primary" style={buttonStyle}>
                    See Schedule
                </Button>
            </Link>

        </div>
    );
}

export default Manager;
