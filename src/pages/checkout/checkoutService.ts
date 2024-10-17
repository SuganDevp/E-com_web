
import { ProductService } from '../products/productsService';

const CheckoutService = {
    async getProducts() {
        try {

            return ProductService.getProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getCartItems(cart: { [key: string]: number }) {
        try {
            const products = await this.getProducts();
            const items = products.filter((product: any) => cart[product.hsnCode]).map((product: any) => ({
                hsnCode: product.hsnCode,
                productName: product.productName,
                productImage: product.productImage,
                sellingPrice: product.sellingPrice,
                quantity: cart[product.hsnCode],
            }));
            return items;
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            throw error;
        }
    }
};

export default CheckoutService;
