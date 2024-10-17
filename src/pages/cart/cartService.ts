
import axios from 'axios';
import { ProductService } from '../products/productsService';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/cart`;

export class CartService {
    static isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    static async getProducts() {
        try {
            return ProductService.getProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getCart() {
        if (this.isLoggedIn()) {
            try {
                const response = await axios.get(`${BASE_URL}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        } else {
            const localCart = localStorage.getItem('cart');
            return localCart ? JSON.parse(localCart) : {};
        }
    }

    static async getCartItems() {
        try {
            const cart = await this.getCart();
            const products = await this.getProducts();
            const items = products
                .filter((product: any) => cart[product.hsnCode])
                .map((product: any) => ({
                    productId: product.hsnCode,
                    hsnCode: product.hsnCode,
                    productName: product.productName,
                    productImage: product.productImage,
                    sellingPrice: product.sellingPrice,
                    quantity: cart[product.hsnCode],
                }));
            return items;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }

    static async syncCartWithAPI(localCart: { [key: string]: number }) {
        if (this.isLoggedIn()) {
            try {
                const cartItems = Object.keys(localCart).map((hsnCode) => ({
                    productId: hsnCode,
                    quantity: localCart[hsnCode],
                }));
                await axios.post(`${BASE_URL}/sync`, { items: cartItems }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            } catch (error) {
                throw error;
            }
        }
    }

    static async addToCart(hsnCode: string, quantity: number) {
        const isLoggedIn = this.isLoggedIn();
        if (isLoggedIn) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/add`,
                    { productId: hsnCode, quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart') || '{}');
            localCart[hsnCode] = (localCart[hsnCode] || 0) + quantity;
            localStorage.setItem('cart', JSON.stringify(localCart));
        }
    }

    static async updateCartItem(hsnCode: string, quantity: number) {
        const isLoggedIn = this.isLoggedIn();
        if (isLoggedIn) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/update`,
                    { productId: hsnCode, quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart') || '{}');
            localCart[hsnCode] = quantity;
            localStorage.setItem('cart', JSON.stringify(localCart));
        }
    }

    static async removeFromCart(hsnCode: string) {
        const isLoggedIn = this.isLoggedIn();
        if (isLoggedIn) {
            try {
                const response = await axios.delete(`${BASE_URL}/remove`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    data: { productId: hsnCode },
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart') || '{}');
            delete localCart[hsnCode];
            localStorage.setItem('cart', JSON.stringify(localCart));
        }
    }

    static async clearCart() {
        const isLoggedIn = this.isLoggedIn();
        if (isLoggedIn) {
            try {
                const response = await axios.delete(`${BASE_URL}/clear`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        } else {
            localStorage.removeItem('cart');
        }
    }
}
