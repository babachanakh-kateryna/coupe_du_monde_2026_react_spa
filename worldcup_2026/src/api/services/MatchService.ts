import api from '../api';
import type { ApiResponse } from '../types/Common';
import type { Match, MatchAvailability } from '../types/Match';

export class MatchService {

    //Lister tous les matchs
    static async getMatches(){
        //TO DO
    }

    //Obtenir la disponibilité de tous les matchs
    static async getAllMatchesWithAvailability(): Promise<MatchAvailability[]> {
        const response = await api.get<ApiResponse<MatchAvailability[]>>('/matches/availability');
        return response.data.data;
    }

    //Obtenir un match
    static async getMatchById(id: number): Promise<Match> {
        const response = await api.get<ApiResponse<Match>>(`/matches/${id}`);
        return response.data.data;
    }

    //Vérifier la disponibilité par catégorie
    static async getMatchAvailability(id: number): Promise<MatchAvailability> {
        const response = await api.get<ApiResponse<MatchAvailability>>(`/matches/${id}/availability`);
        return response.data.data;
    }
}