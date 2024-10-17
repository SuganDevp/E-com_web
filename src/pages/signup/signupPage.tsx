import React, { useState } from 'react';
import { SignupService } from './signupService';
import './signup.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const location = useLocation();
    const from = location.state?.from || '/';
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = await SignupService.signup(username, email, password);
            setSuccess(data.message);
            navigate(from);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error signing up');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Signup</h2>
            <form onSubmit={handleSignup} className="mt-4">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Sign Up</button>
            </form>
            {error && <p className="text-danger text-center mt-2">{error}</p>}
            {success && <p className="text-success text-center mt-2">{success}</p>}
        </div>
    );
};

export default Signup;
