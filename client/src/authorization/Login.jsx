import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import momma from "../assets/mommanut.png";

const url = "http://127.0.0.1:5000";

function LoginForm() {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
    
        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: formData.get('identifier'),
                    password: formData.get('password')
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Invalid credentials");
                return;
            }
    
            const data = await response.json();
    
            localStorage.setItem("access_token", data.create_token);
            localStorage.setItem("user", JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
                role: data.role
            }));
    
            window.dispatchEvent(new Event("storage"));
    
            setToken(data.create_token);
            setUser({ name: data.user.name, role: data.role });

            alert(`Welcome ${data.user.name}, you are logged in successfully.`);
    
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    
    if (token && user) {
        return user.role === "admin" ? <Navigate to="/admin-products" /> : <Navigate to="/user-products" />;
    }

    return (
        <div className="signupContainer">
            <div className="signupCard">
                <div className="signupLeft">
                    <div className="signupImagePlaceholder">
                        <img src={momma} alt="momma nut" />
                    </div>
                </div>
                <div className="signupRight">
                    <form className="signupForm" onSubmit={handleLogin}>
                        <h2>Log in to your account</h2>

                        <input
                            className="signupInput"
                            type="text"
                            name="identifier"
                            placeholder="Enter email or phone..."
                            required
                        />

                        <div className="passwordWrapper">
                            <input
                                className="signupInput"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password..."
                                required
                            />
                            <span className="togglePassword" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="text-right text-sm mb-2">
                            <Link to="/forgot-password" className="text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button className="signupButton" type="submit">Log In</button>

                        <p className="signupFooter">Don't have an account? <a href="/signup">Sign up</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
