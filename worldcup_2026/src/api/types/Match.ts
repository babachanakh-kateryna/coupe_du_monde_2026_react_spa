import type { TicketCategory } from './Tickets';

export type MatchStatus = 'upcoming' | 'ongoing' | 'finished' | 'scheduled';
export type MatchStage = 'group_stage' | 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';

export interface Match {
  id: number;
  homeTeamId: number;
  homeTeam: MatchTeam;
  awayTeamId: number;
  awayTeam: MatchTeam;
  stadiumId: number;
  stadium: MatchStadium;
  status: MatchStatus;
  stage: MatchStage;
  date: string;
  availableSeats: number;
  priceMultiplier: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchTeam {
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

export interface MatchStadium {
  id: number;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  capacity: number;
  timezone: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
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