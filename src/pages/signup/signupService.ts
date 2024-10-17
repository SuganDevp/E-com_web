import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/auth`;

export class SignupService {


    static async signup(username: string, email: string, password: string) {
        try {
            const response = await axios.post(`${BASE_URL}/signup`, {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
