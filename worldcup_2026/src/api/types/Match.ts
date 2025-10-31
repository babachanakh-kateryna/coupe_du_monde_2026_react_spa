import type { Stadium } from "./Stadium";
import type { Team } from "./Team";
import type { TicketCategory } from "./Tickets";

export type MatchStatus = 'upcoming' | 'ongoing' | 'finished';
export type MatchStage = 'group_stage' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  status: MatchStatus;
  stage: MatchStage;
  date: string;
  availableSeats: number;
  priceMultiplier: number;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
}

export interface CategoryAvailability {
  available: boolean;
  totalSeats: number;
  availableSeats: number;
  soldSeats: number;
  price: number;
}

export interface MatchAvailability {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  status: MatchStatus;
  stage: MatchStage;
  date: string;
  availableSeats: number;
  priceMultiplier: number;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
  categories: Record<TicketCategory, CategoryAvailability>;
}