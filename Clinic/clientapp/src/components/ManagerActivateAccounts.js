import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ManagerAllAccounts() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/Manager/GetAllUsers', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const usersData = await response.json();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleActivate = async (userId) => {
        try{
            const response = await axios.put(`/api/Manager/Activate${userId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        
            if (!response.status === 200) {
                throw new Error('Failed to fetch data');
            }
            alert("User activated");
            window.location.reload();

        } catch(error) {
            console.error('Error activating user:', error);
        }
        console.log(`Activate user with ID: ${userId}`);
    };

    const handleDelete = (userId) => {
        try{
            const response = axios.delete(`/api/Manager/Delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        
            if (!response.status === 200) {
                throw new Error('Failed to fetch data');
            }
            alert("User deleted");
            window.location.reload();
        } catch(error) {
            console.error('Error deleting user:', error);
        }
        // Implement the delete logic using the userId
        console.log(`Delete user with ID: ${userId}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxHeight: '1000px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', backgroundColor: '#e0f2f1' }}>
                <h1 style={{ textAlign: 'center' }}>ManagerActivateAccounts</h1>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px' }}>Name</th>
                            <th style={{ padding: '8px' }}>Surname</th>
                            <th style={{ padding: '8px' }}>Username</th>
                            <th style={{ padding: '8px' }}>Email</th>
                            <th style={{ padding: '8px' }}>Phone Number</th>
                            <th style={{ padding: '8px' }}>Specjalization</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                            <th style={{ padding: '8px' }}>Updates</th>
                            <th style={{ padding: '8px' }}>Activation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={{ padding: '8px' }}>{user.name}</td>
                                <td style={{ padding: '8px' }}>{user.surname}</td>
                                <td style={{ padding: '8px' }}>{user.userName}</td>
                                <td style={{ padding: '8px' }}>{user.email}</td>
                                <td style={{ padding: '8px' }}>{user.phoneNumber}</td>
                                <td style={{ padding: '8px' }}>{user.specjalization}</td>
                                <td style={{ padding: '8px' }}>
                                    <Link to={`/manager/update/${user.id}`}>
                                        <Button>Update</Button>
                                     </Link>
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <Button onClick={() => handleDelete(user.id)}>Delete</Button>
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {user.activated === false ? (
                                        <Button onClick={() => handleActivate(user.id)}>Activate</Button>
                                    ) : (
                                        'Activated'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManagerAllAccounts;
