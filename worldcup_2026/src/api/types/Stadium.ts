export interface Stadium {
  id: number;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  capacity: number;
  timezone: string;
  features: string[];
}

export interface StadiumFilters {
  country?: string;
  city?: string;
  minCapacity?: number;
  maxCapacity?: number;
}