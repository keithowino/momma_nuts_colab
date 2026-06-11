import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LoginForm from './Login';
import SignupForm from './Signup';
import './Authorization.css' 

const url = "http://127.0.0.1:5000";

function Authorization() {
    let navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        if (token && user?.role === "admin") {
            fetchUsers();
        }
    }, [token, user]);

    const fetchUsers = () => {
        fetch(`${url}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error fetching users:', response.statusText);
                    throw new Error('Error fetching users');
                }
            })
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    };

    const handleLogout = () => {
        console.log("Logout button clicked");
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        navigate('/login');
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/users" /> : <LoginForm setUser={setUser} />} />
                <Route path="/signup" element={user ? <Navigate to="/users" /> : <SignupForm />} />
                <Route path="/users" element={user?.role === 'admin' ? <Users users={users} /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

function Users({ users }) {
    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.phone} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Authorization;
