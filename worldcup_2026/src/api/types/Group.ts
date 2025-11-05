export interface Group {
  id: number;
  name: string;
  teams: GroupTeams[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupTeams {
  id: number;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  continent: string;
  groupId: number;
  createdAt: string;
  updatedAt: string;
  flagImagePath: string;
}