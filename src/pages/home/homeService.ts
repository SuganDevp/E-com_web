import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/products`;

export class HomeService {

    static async getProducts(): Promise<Product[]> {
        try {
            const response = await axios.get(BASE_URL);
            return response.data.products;
        } catch (error) {
            console.log('%csrc/pages/products/productsService.tsx:12 error', 'color: #007acc;', error);
            return [];
        }
    }


    static async getProductById(id: string): Promise<Product | undefined> {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.log('%csrc/pages/products/productsService.tsx:23 error', 'color: #007acc;', error);
        }
    }

}

export interface Product {
    id: string;
    productName: string;
    productDescription: string;
    productImage: string;
    originalPrice: number;
    discountPrice: number;
    sellingPrice: number;
    quantity: number;
    uom: string;
    hsnCode: string;
}
