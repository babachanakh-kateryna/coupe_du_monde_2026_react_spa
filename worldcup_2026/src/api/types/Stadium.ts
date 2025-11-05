export interface Stadium {
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

export interface StadiumFilters {
  country?: string;
  city?: string;
  minCapacity?: number;
  maxCapacity?: number;
}