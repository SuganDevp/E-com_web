import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartService } from './cartService';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const items = await CartService.getCartItems();
            setCartItems(items);
            calculateTotal(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const calculateTotal = (items: any[]) => {
        const total = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
        setTotalAmount(total);
    };

    const handleQuantityChange = async (hsnCode: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            await CartService.updateCartItem(hsnCode, quantity);
            fetchCartItems(); // Refresh cart items after update
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };

    const handleRemoveItem = async (hsnCode: string) => {
        try {
            await CartService.removeFromCart(hsnCode);
            fetchCartItems(); // Refresh cart items after removal
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/products">Shop Now</Link></p>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.hsnCode} className="cart-item row mb-4">
                            <div className="col-md-3">
                                <img src={item.productImage} alt={item.productName} className="img-fluid" />
                            </div>
                            <div className="col-md-4">
                                <h4>{item.productName}</h4>
                                <p>HSN Code: {item.hsnCode}</p>
                                <p>Price: ₹{item.sellingPrice.toFixed(2)}</p>
                            </div>
                            <div className="col-md-3 d-flex align-items-center">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleQuantityChange(item.hsnCode, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={item.quantity}
                                    readOnly
                                    className="form-control mx-2 text-center"
                                    style={{ width: '50px' }}
                                />
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleQuantityChange(item.hsnCode, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="col-md-2 d-flex align-items-center">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveItem(item.hsnCode)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-total text-right mt-5">
                        <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
                        <Link to="/checkout" className="btn btn-primary mt-3">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
