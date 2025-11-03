import api from '../api';
import type { ApiResponse } from '../types/Common';
import type { Group } from '../types/Group';

export class GroupService {

    // Lister tous les groupes
    static async getGroups(): Promise<Group[]> {
        const response = await api.get<ApiResponse<Group[]>>('/groups');
        return response.data.data;
    }

    // Obtenir un groupe
    static async getGroupById(id: number): Promise<Group> {
        const response = await api.get<ApiResponse<Group>>(`/groups/${id}`);
        return response.data.data;
    }
}