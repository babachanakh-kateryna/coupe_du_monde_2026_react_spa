import api from '../api';
import type { AuthFiltres, User } from '../types/Auth';


export class AuthService {

    static async signup(filters?: AuthFiltres): Promise<User> {
        const response = await api.post('/auth/signup', { params: filters });
        return response.data.data.user;
    }

    static async signin(email: string, password: string): Promise<User> {
        const response = await api.post('/auth/signin', { email, password });
        return response.data.data.user;
    }

    static async me(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data.data;
    }

    static async signout(): Promise<void> {
        await api.post('/auth/signout');
    }
}