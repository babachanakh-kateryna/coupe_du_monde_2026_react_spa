import api from '../api';
import type { ApiResponse } from '../types/Common';
import type { Team, TeamFilters } from '../types/Team';

export class TeamService {

    // Lister toutes les équipes
    static async getTeams(filters?: TeamFilters): Promise<Team[]> {
        const response = await api.get<ApiResponse<Team[]>>('/teams', { params: filters });
        return response.data.data;
    }

    // Obtenir une équipe par ID
    static async getTeamById(id: number): Promise<Team> {
        const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
        return response.data.data;
    }
}