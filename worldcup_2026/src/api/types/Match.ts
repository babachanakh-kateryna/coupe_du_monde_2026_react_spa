import type { Stadium } from './Stadium';
import type { Team } from './Team';
import type { TicketCategory } from './Tickets';

export interface MatchesListResponse {
  matches: Match[];
  total: number;
  page: number;
  limit: number;
}

export type MatchStatus = 'upcoming' | 'ongoing' | 'finished' | 'scheduled';
export type MatchStage = 'group_stage' | 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  status: MatchStatus;
  stage: MatchStage;
  date: string;
  availableSeats: number;
  priceMultiplier: number | string;
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

// /matches/availability
export interface MatchAvailability extends Match {
  categories?: Record<TicketCategory, CategoryAvailability>;
}

export interface MatchFilters {
  status?: string;
  stage?: string;
  teamId?: number;
  stadiumId?: number;
  startDate?: string;
  endDate?: string;
}

// /matches/{id}/availability
export interface MatchAvailabilityDetailed {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: string;
  totalAvailableSeats: number;
  categories: Record<TicketCategory, CategoryAvailability>;
}