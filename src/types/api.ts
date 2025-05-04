// TypeScript type definitions for API responses

import { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user?: User;
}
  
export interface FeedbackRequest {
  user_id?: number | null;
  feedback: string;
  name: string; // For guest users or pre-filled for logged-in users
}

export interface FeedbackResponse {
  message: string;
}

export interface PriceTrend {
  date: string;
  price: number;
  product_id: number;
}

export interface MarketDemand {
  product_name: string;
  demand_score: number; // 0 to 100
}

export interface QualityMetric {
  product_name: string;
  quality_grade: string; // e.g., "4.5"
}

export interface RegionalSupplyDemand {
  county_id: number;
  county_name: string;
  supply: number; // e.g., tons
  demand: number; // e.g., tons
}

export interface InsightsPreviewData {
  priceTrends: PriceTrend[];
  marketDemands: MarketDemand[];
  qualityMetrics: QualityMetric[];
  regionalData: RegionalSupplyDemand[];
}

export interface FilterParams {
  category?: string;
  county?: string;
  distance?: number;
  minPrice?: number;
  maxPrice?: number;
  qualityRating?: number;
}

export interface MarketplaceResponse {
  products: Product[];
  total: number;
  categories: string[];
  counties: { id: number; name: string }[];
}