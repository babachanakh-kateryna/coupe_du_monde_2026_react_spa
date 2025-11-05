export interface TeamGroup {
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
  group: TeamGroup;
  createdAt: string;
  updatedAt: string;
  flagImagePath: string;
}