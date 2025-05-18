// Axios setup for API calls

import axios from 'axios';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, InsightsPreviewData, FilterParams, MarketplaceResponse, FeedbackRequest, FeedbackResponse } from '../types/api';
import { Product } from '@/types/product';

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dummy data for testing
const dummyUser: LoginResponse = {
  token: 'fake-jwt-token',
  user: {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'test@example.com',
    phone_number: '+254700000000',
  },
};


// Dummy data for testing
const dummyProducts: Product[] = [
  {
    id: 1,
    farmer_id: 1,
    name: 'Premium Maize',
    price: 4200,
    image_url: '/images/maize.jpg',
    category_id: 1,
    category_name: 'Cereals',
    county_id: 1,
    county_name: 'Nakuru County',
    ai_suggested_price: 3800,
    ai_quality_grade: '4.8',
  },
  {
    id: 2,
    farmer_id: 1,
    name: 'Organic Tomatoes',
    price: 150,
    image_url: '/images/tomatoes.jpg',
    category_id: 2,
    category_name: 'Vegetables',
    county_id: 2,
    county_name: 'Kiambu County',
    ai_suggested_price: 135,
    ai_quality_grade: '4.5',
  },
  {
    id: 3,
    farmer_id: 1,
    name: 'Fresh Avocados',
    price: 320,
    image_url: '/images/avocados.jpg',
    category_id: 3,
    category_name: 'Fruits',
    county_id: 3,
    county_name: 'Murang’a County',
    ai_suggested_price: 280,
    ai_quality_grade: '4.7',
  },
  {
    id: 4,
    farmer_id: 1,
    name: 'Red Beans',
    price: 500,
    image_url: '/images/red-beans.jpg',
    category_id: 4,
    category_name: 'Legumes',
    county_id: 4,
    county_name: 'Machakos County',
    ai_suggested_price: 450,
    ai_quality_grade: '4.6',
  },
  {
    id: 5,
    farmer_id: 1,
    name: 'Irish Potatoes',
    price: 2800,
    image_url: '/images/potatoes.jpg',
    category_id: 5,
    category_name: 'Tubers',
    county_id: 5,
    county_name: 'Nyandarua County',
    ai_suggested_price: 2500,
    ai_quality_grade: '4.4',
  },
  {
    id: 6,
    farmer_id: 1,
    name: 'Green Kales',
    price: 100,
    image_url: '/images/kales.jpg',
    category_id: 2,
    category_name: 'Vegetables',
    county_id: 6,
    county_name: 'Nairobi County',
    ai_suggested_price: 65,
    ai_quality_grade: '4.3',
  },
];


const dummyInsights: InsightsPreviewData = {
  priceTrends: [
    { date: '2025-01-01', price: 120, product_id: 1 },
    { date: '2025-02-01', price: 130, product_id: 1 },
    { date: '2025-03-01', price: 125, product_id: 1 },
    { date: '2025-04-01', price: 140, product_id: 1 },
  ],
  marketDemands: [
    { product_name: 'Maize', demand_score: 85 },
    { product_name: 'Tomatoes', demand_score: 70 },
    { product_name: 'Avocados', demand_score: 60 },
  ],
  qualityMetrics: [
    { product_name: 'Maize', quality_grade: '4.8' },
    { product_name: 'Tomatoes', quality_grade: '4.5' },
    { product_name: 'Avocados', quality_grade: '4.7' },
  ],
  regionalData: [
    { county_id: 1, county_name: 'Nakuru County', supply: 500, demand: 400 },
    { county_id: 2, county_name: 'Kiambu County', supply: 300, demand: 350 },
    { county_id: 3, county_name: 'Murang’a County', supply: 200, demand: 250 },
  ],
};



// Login API call with dummy data fallback
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
  } catch {
    // Simulate backend response for testing
    if (data.email === 'test@example.com' && data.password === 'password123') {
      return dummyUser;
    }
    throw new Error('Invalid credentials');
  }
};

// Signup API call with dummy data fallback
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>('/register', data);
    return response.data;
  } catch {
    // Simulate successful signup for testing
    return { message: 'User created successfully' };
  }
};

// Fetch products with pagination and filters
export const fetchProducts = async (
  page: number = 1,
  limit: number = 5,
  category?: string
): Promise<{ products: Product[]; total: number }> => {
  try {
    const response = await api.get<{ products: Product[]; total: number }>('/api/products', {
      params: { page, limit, category },
    });
    return response.data;
  } catch (error) {
    // Simulate backend response for testing
    let filteredProducts = dummyProducts;
    if (category) {
      filteredProducts = dummyProducts.filter((product) => product.category_name === category);
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length,
    };
  }
};

// Fetch categories for filtering
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/api/categories');
    return response.data;
  } catch (error) {
    // Simulate backend response for testing
    return ['Cereals', 'Vegetables', 'Fruits', 'Legumes', 'Tubers', 'Dairy'];
  }
};



// Feedback API call with dummy data fallback
export const submitFeedback = async (data: FeedbackRequest): Promise<FeedbackResponse> => {
  try {
    const response = await api.post<FeedbackResponse>('/api/feedback', data);
    return response.data;
  } catch (error) {
    // Simulate successful feedback submission for testing
    return { message: 'Feedback submitted successfully' };
  }
};

// Fetch insights preview data
export const fetchInsightsPreview = async (): Promise<InsightsPreviewData> => {
  try {
    const response = await api.get<InsightsPreviewData>('/api/insights/preview');
    return response.data;
  } catch (error) {
    // Simulate backend response for testing
    return dummyInsights;
  }
};


// Fetch marketplace data with filters and pagination
export const fetchMarketplaceData = async (
  page: number = 1,
  limit: number = 10,
  filters: FilterParams = {}
): Promise<MarketplaceResponse> => {
  try {
    const response = await api.get<MarketplaceResponse>('/api/marketplace', {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch {
    // Simulate backend response for testing
    let filteredProducts = dummyProducts;

    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter((p) => p.category_name === filters.category);
    }
    if (filters.county) {
      filteredProducts = filteredProducts.filter((p) => p.county_name === filters.county);
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.qualityRating) {
      filteredProducts = filteredProducts.filter(
        (p) => p.ai_quality_grade && parseFloat(p.ai_quality_grade) >= filters.qualityRating!
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      categories: ['Cereals', 'Vegetables', 'Fruits', 'Legumes', 'Tubers', 'Dairy'],
      counties: [
        { id: 1, name: 'Nakuru County' },
        { id: 2, name: 'Kiambu County' },
        { id: 3, name: 'Murang’a County' },
        { id: 4, name: 'Machakos County' },
        { id: 5, name: 'Nyandarua County' },
        { id: 6, name: 'Nairobi County' },
      ],
    };
  }
};