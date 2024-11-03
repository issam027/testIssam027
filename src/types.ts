export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  imageUrl: string;
  provider: string;
  basePrice: number;
}

export interface Availability {
  date: string;
  available: boolean;
  specialPrice?: number;
}

export type ServiceCategory = 
  | 'venue'
  | 'catering'
  | 'music'
  | 'photography'
  | 'decoration'
  | 'entertainment';

export interface SelectedService {
  serviceId: string;
  category: ServiceCategory;
  date?: string;
}