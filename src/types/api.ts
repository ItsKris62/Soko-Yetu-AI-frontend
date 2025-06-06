// TypeScript type definitions for API responses
import { User } from './user';

// Updated Product type
export interface Product {
  id: string; // Changed to string to handle large integers from unique_rowid()
  farmer_id: number;
  predefined_product_id: string; // Changed to string for large integers
  product_name: string; // Replaces 'name', fetched from predefined_products
  description?: string | null;
  price: number;
  image_url?: string | null;
  category_id: string; // Changed to string for large integers
  category_name?: string;
  county_id?: number;
  county_name?: string;
  ai_suggested_price?: number;
  ai_quality_grade?: number;
  created_at?: string;
  updated_at?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
}

// New PredefinedProduct type
export interface PredefinedProduct {
  id: string; // Changed to string for large integers
  name: string;
  category_id: string; // Changed to string for large integers
  category_name: string;
}

// Resource type
export interface Resource {
  id: string;
  title: string;
  description?: string | null;
  type: 'article' | 'video' | 'pdf';
  url: string;
  category: string;
  target_role?: 'farmer' | 'buyer' | null;
  created_at: string;
}

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
  country_id?: string; // Add country_id for filtering
  county_id?: string; // Changed to string for large integers
  sub_county_id?: string; // Add sub_county_id for filtering
  distance?: number;
  minPrice?: number;
  maxPrice?: number;
  qualityRating?: number;
  searchQuery?: string;
}

// Updated MarketplaceResponse type
export interface MarketplaceResponse {
  products: Product[];
  total: number;
  categories: string[];
  countries: { id: string; name: string }[];
  counties: { id: string; name: string; country_id: string }[];
  sub_counties: { id: string; name: string; county_id: string }[];
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
  countries: { id: string; name: string }[];
  counties: { id: string; name: string; country_id: string }[];
  subcounties: { id: string; name: string; county_id: string }[];
}

export interface ForumPost {
  id: string;
  user_id: number;
  title: string;
  content: string;
  category: string;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  reply_count: number;
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
}

export interface PostUpvote {
  id: string;
  post_id: string;
  user_id: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: number;
  type: string;
  reference_id: string;
  message: string;
  read: boolean;
  created_at: string;
}