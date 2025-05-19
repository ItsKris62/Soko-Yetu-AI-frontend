// TypeScript type definitions for API responses

import { User } from './user';

import { Product } from './product';

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

export interface UserStats {
  totalProductsListed: number;
  completedTransactions: number;
  rating: number;
}

export interface Transaction {
  id: number;
  buyer_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  product_name: string;
  reviewer_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface DashboardResponse {
  user: User;
  stats: UserStats;
  products: Product[];
  transactions: Transaction[];
  reviews: Review[];
}

export interface DashboardData {
  user: User;
  stats: {
    total_products: number;
    completed_transactions: number;
    average_rating: number;
  };
  transactions: Transaction[];
  reviews: Review[];
  products: Product[];
}

export interface LocationData {
  countries: { id: number; name: string }[];
  counties: { id: number; name: string; country_id: number }[];
  subcounties: { id: number; name: string; county_id: number }[];
}