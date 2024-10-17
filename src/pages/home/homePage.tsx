import React from 'react';
import ProductList from '../products/productsPage';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosCart, IoIosLogOut } from "react-icons/io";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <div>
            <div className='d-flex justify-content-between mx-3'>
                <h1 className=''>Welcome to E-Commerce App</h1>
                <div className='d-flex align-items-center'>
                    {token ? (
                        <span className="me-4 mt-5">{username}</span>
                    ) : (
                        <Link to="/login" className="me-4 mt-5 text-decoration-none">Login</Link>
                    )}
                    <Link to="/cart" className="mt-5 me-3"><IoIosCart size={25} /></Link>

                    {token && (
                        <button onClick={handleLogout} className="btn btn-link me-4 mt-5 text-decoration-none"><IoIosLogOut size={25} /></button>
                    )}
                </div>
            </div>
            <ProductList />
        </div>
    );
};

export default Home;
