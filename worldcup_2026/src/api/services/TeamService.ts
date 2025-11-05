import api from '../api';
import type { ApiResponse } from '../types/Common';
import type { Team } from '../types/Team';

export class TeamService {

    // Lister toutes les équipes
    static async getTeams(): Promise<Team[]> {
        const response = await api.get<ApiResponse<Team[]>>('/teams');
        return response.data.data;
    }

    // Obtenir une équipe par ID
    static async getTeamById(id: number): Promise<Team> {
        const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
        return response.data.data;
    }
}