import api from '../api';
import type { ApiResponse } from '../types/Common';
import type { Stadium, StadiumFilters } from '../types/Stadium';

export class StadiumService {

    // Lister tous les stades
    static async getStadiums(filters?: StadiumFilters): Promise<Stadium[]> {
        const response = await api.get<ApiResponse<Stadium[]>>('/stadiums', { params: filters });
        return response.data.data;
    }

    //    Obtenir un stade
    static async getStadiumById(id: number): Promise<Stadium> {
        const response = await api.get<ApiResponse<Stadium>>(`/stadiums/${id}`);
        return response.data.data;
    }
}