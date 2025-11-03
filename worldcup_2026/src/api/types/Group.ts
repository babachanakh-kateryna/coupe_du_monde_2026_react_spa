import type { Team } from "./Team";

export interface Group {
  id: number;
  name: string;
  teams: Team[];
  createdAt: string;
  updatedAt: string;
}