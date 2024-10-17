import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/auth`;

export class LoginService {

    static async login(email: string, password: string) {
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
