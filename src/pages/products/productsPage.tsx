import React, { useEffect, useState } from 'react';
import { Product, ProductService } from './productsService';
import { Link } from 'react-router-dom';
import './products.css';
import { CartService } from '../cart/cartService';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getProducts();
                setProducts(response);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const loadCart = async () => {
            try {
                const cartData = await CartService.getCart();
                setCart(cartData);
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        fetchProducts();
        loadCart();
    }, []);

    const addToCart = async (product: Product) => {
        const currentQuantity = cart[product.hsnCode] || 0;
        const updatedQuantity = currentQuantity + 1;

        setCart((prevCart) => ({
            ...prevCart,
            [product.hsnCode]: updatedQuantity,
        }));

        await CartService.addToCart(product.hsnCode, updatedQuantity);
    };

    // const handleQuantityChange = async (hsnCode: string, quantity: number) => {
    //     if (quantity < 0) return;

    //     setCart((prevCart) => ({
    //         ...prevCart,
    //         [hsnCode]: quantity,
    //     }));

    //     await CartService.updateCartItem(hsnCode, quantity);
    // };

    return (
        <div className="product-list">
            <div className="header">
                <h1>Products</h1>
            </div>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4" key={product.hsnCode}>
                        <div className="card">
                            <img
                                src={product.productImage}
                                alt={product.productName}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.productName}</h5>
                                <p className="card-text">{product.productDescription}</p>
                                <p className="card-text">
                                    <span className="text-danger">₹{product.sellingPrice}</span>{' '}
                                    <span className="text-muted">
                                        <del>₹{product.originalPrice}</del>
                                    </span>
                                </p>
                                {/* <div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            handleQuantityChange(
                                                product.hsnCode,
                                                Math.max(0, (cart[product.hsnCode] || 0) - 1)
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{cart[product.hsnCode] || 0}</span>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            handleQuantityChange(
                                                product.hsnCode,
                                                (cart[product.hsnCode] || 0) + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div> */}
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
