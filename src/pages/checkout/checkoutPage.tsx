import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './checkout.css';
import { CartService } from '../cart/cartService';

interface CartItem {
    hsnCode: string;
    productName: string;
    productImage: string;
    sellingPrice: number;
    quantity: number;
}

const Checkout: React.FC = () => {
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
            fetchCartItems();
        }

        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const fetchCartItems = async () => {
        try {
            const items = await CartService.getCartItems();
            setCartItems(items);
            calculateTotalAmount(items);
        } catch (error) {
            console.error('Failed to fetch cart items', error);
        }
    };

    const calculateTotalAmount = (items: CartItem[]) => {
        const total = items.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
        setTotalAmount(total);
    };

    const handlePlaceOrder = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to place an order.');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (cartItems.length > 0) {
            setOrderPlaced(true);
            console.log('Order placed:', { items: cartItems, totalAmount });
            localStorage.removeItem('cart');
        }
    };

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            {orderPlaced ? (
                <div>
                    <h2>Thank you for your order!</h2>
                    <p>Your order has been placed successfully.</p>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty!</p>
                    ) : (
                        <div>
                            <div className="row">
                                {cartItems.map(item => (
                                    <div className="col-md-4" key={item.hsnCode}>
                                        <div className="card">
                                            <img src={item.productImage} alt={item.productName} className="card-img-top" />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.productName}</h5>
                                                <p className="card-text">₹{item.sellingPrice} x {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h2>Total Amount: ₹{totalAmount}</h2>
                            <p>Payment Method: Cash</p>
                            <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order</button>
                        </div>
                    )}
                    <Link to="/cart" className="btn btn-secondary mt-4">Back to Cart</Link>
                </div>
            )}
        </div>
    );
};

export default Checkout;
