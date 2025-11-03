// pour Filtrer par nom de groupe
export interface TeamFilters {
  group?: string;
}

export interface GroupTeam {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  continent: string;
  groupId: number;
  group: GroupTeam;
  createdAt: string;
  updatedAt: string;
  flagImagePath: string;
}