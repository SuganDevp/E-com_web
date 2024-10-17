import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginService } from './loginService';
import './login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const location = useLocation();
    const from = location.state?.from || '/';
    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = await LoginService.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            setSuccess('Login successful!');
            navigate(from);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error logging in');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleLogin} className="mt-4">
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
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            {error && <p className="text-danger text-center mt-2">{error}</p>}
            {success && <p className="text-success text-center mt-2">{success}</p>}

            <p className="text-center mt-3"
                onClick={() => {
                    navigate('/signup', { state: { from } })
                }}>
                Don't have an account?
            </p>
        </div>
    );
};

export default Login;
