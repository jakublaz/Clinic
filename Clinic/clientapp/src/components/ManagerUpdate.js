import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ManagerUpdate() {
    const { userId } = useParams();
    const [user, setUser] = useState({
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        password: '',
        specjalization: '',
        userName: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/Manager/GetUserById/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`/api/Manager/UpdateUser/${userId}`, user, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                alert('User updated');
                window.location.href = '/manager/allaccounts';
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
        console.log("User updated");
    };

    const isSpecjalizationNull = user.specjalization === null || user.specjalization === 'none';


    return (
        <div style={{ margin: 'auto', maxWidth: '500px', padding: '20px' }}>
            <div style={{ maxHeight: '1000px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', backgroundColor: '#e0f2f1' }}>
                <h1>ManagerUpdate</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={user.name} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="surname" className="form-label">Surname</label>
                        <input type="text" className="form-control" id="surname" name="surname" value={user.surname} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Username</label>
                        <input type="text" className="form-control" id="userName" name="userName" value={user.userName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="specjalization" className="form-label">Specjalization</label>
                        {isSpecjalizationNull ? (
                            <input type="text" className="form-control" id="specjalization" name="specjalization" value={user.specjalization || ''} readOnly />
                        ) : (
                            <input type="text" className="form-control" id="specjalization" name="specjalization" value={user.specjalization} onChange={handleChange} />
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ManagerUpdate;
