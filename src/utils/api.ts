import axios from 'axios';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, InsightsPreviewData, FilterParams, MarketplaceResponse, FeedbackRequest, FeedbackResponse, DashboardData, LocationData, Transaction, Review } from '../types/api';
import { Product } from '@/types/product';
import { User } from '@/types/user';

// Configure axios instance with a general baseURL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
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
    role: 'farmer',
  },
};

const dummyProducts: Product[] = [
  {
    id: 1,
    farmer_id: 1,
    name: 'Premium Maize',
    price: 4200,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747660158/sweet-corn.png',
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
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747634226/red-tomatoes.png',
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
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747634473/avocado.png',
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
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747637030/red-beans.png',
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
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747634222/potatoes.png',
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
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747637029/kales.png',
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

const dummyTransactions: Transaction[] = [
  { id: 1, buyer_id: 2, farmer_id: 1, product_id: 1, product_name: 'Premium Maize', quantity: 2, total_price: 8400, status: 'delivered', created_at: '2025-04-01T00:00:00Z' },
  { id: 2, buyer_id: 2, farmer_id: 1, product_id: 2, product_name: 'Organic Tomatoes', quantity: 5, total_price: 750, status: 'shipped', created_at: '2025-04-02T00:00:00Z' },
];

const dummyReviews: Review[] = [
  { id: 1, product_id: 1, product_name: 'Premium Maize', reviewer_id: 2, reviewer_name: 'Jane Smith', rating: 5, comment: 'Excellent quality!', created_at: '2025-04-03T00:00:00Z' },
  { id: 2, product_id: 2, product_name: 'Organic Tomatoes', reviewer_id: 2, reviewer_name: 'Jane Smith', rating: 4, comment: 'Very fresh.', created_at: '2025-04-04T00:00:00Z' },
];

const dummyDashboardData: DashboardData = {
  user: dummyUser.user,
  stats: {
    total_products: 2,
    completed_transactions: 10,
    average_rating: 4.8,
  },
  transactions: dummyTransactions,
  reviews: dummyReviews,
  products: dummyProducts,
};

const dummyNotifications = [
  { id: 1, message: 'Your order has been shipped!', read: false, created_at: '2025-05-18T12:00:00Z' },
  { id: 2, message: 'New review on your product!', read: false, created_at: '2025-05-17T09:00:00Z' },
];

const dummyMessages = [
  { id: 1, sender_id: 2, sender_name: 'Jane Smith', content: 'Hi, is your maize still available?', read: false, created_at: '2025-05-18T14:00:00Z' },
  { id: 2, sender_id: 2, sender_name: 'Jane Smith', content: 'Can you deliver to Nairobi?', read: false, created_at: '2025-05-18T14:05:00Z' },
];

// Authentication API calls
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  } catch {
    if (data.email === 'test@example.com' && data.password === 'password123') {
      return dummyUser;
    }
    throw new Error('Invalid credentials');
  }
};

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>('/auth/register', data);
    return response.data;
  } catch {
    return { message: 'User created successfully' };
  }
};

// Product-related API calls
export const fetchProducts = async (
  page: number = 1,
  limit: number = 5,
  category?: string
): Promise<{ products: Product[]; total: number }> => {
  try {
    const response = await api.get<{ products: Product[]; total: number }>('/products', {
      params: { page, limit, category },
    });
    return response.data;
  } catch {
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

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/categories');
    return response.data;
  } catch {
    return ['Cereals', 'Vegetables', 'Fruits', 'Legumes', 'Tubers', 'Dairy'];
  }
};

export const fetchCounties = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await api.get<{ id: number; name: string }[]>('/counties');
    return response.data;
  } catch {
    return [
      { id: 1, name: 'Nakuru County' },
      { id: 2, name: 'Kiambu County' },
      { id: 3, name: 'Murang’a County' },
      { id: 4, name: 'Machakos County' },
      { id: 5, name: 'Nyandarua County' },
      { id: 6, name: 'Nairobi County' },
    ];
  }
};

export const addProduct = async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  try {
    await api.post('/products', data);
  } catch {
    console.log('Product added:', data);
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch {
    const product = dummyProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
};

// Feedback API call
export const submitFeedback = async (data: FeedbackRequest): Promise<FeedbackResponse> => {
  try {
    const response = await api.post<FeedbackResponse>('/feedback', data);
    return response.data;
  } catch {
    return { message: 'Feedback submitted successfully' };
  }
};

// Insights API call
export const fetchInsightsPreview = async (): Promise<InsightsPreviewData> => {
  try {
    const response = await api.get<InsightsPreviewData>('/insights/preview');
    return response.data;
  } catch {
    return dummyInsights;
  }
};

// Dashboard API call
export const fetchDashboardData = async (userId: number, role: 'farmer' | 'buyer'): Promise<DashboardData> => {
  try {
    const response = await api.get<DashboardData>(`/dashboard/${userId}`, { params: { role } });
    return response.data;
  } catch {
    return {
      ...dummyDashboardData,
      user: { ...dummyUser.user, role },
      products: role === 'farmer' ? dummyProducts : dummyTransactions.map((t) => ({
        id: t.product_id,
        name: t.product_name,
        price: t.total_price / t.quantity,
        quantity: t.quantity,
      } as Product)),
      transactions: role === 'farmer'
        ? dummyTransactions.filter((t) => t.farmer_id === userId)
        : dummyTransactions.filter((t) => t.buyer_id === userId),
    };
  }
};

// Location API call
export const fetchLocationData = async (): Promise<LocationData> => {
  try {
    const response = await api.get<LocationData>('/locations');
    return response.data;
  } catch {
    return {
      countries: [{ id: 1, name: 'Kenya' }],
      counties: [
        { id: 1, name: 'Nakuru County', country_id: 1 },
        { id: 2, name: 'Kiambu County', country_id: 1 },
        { id: 3, name: 'Murang’a County', country_id: 1 },
      ],
      subcounties: [
        { id: 1, name: 'Naivasha', county_id: 1 },
        { id: 2, name: 'Thika', county_id: 2 },
        { id: 3, name: 'Gatundu', county_id: 2 },
      ],
    };
  }
};

// User profile API call
export const updateUserProfile = async (userId: number, data: Partial<User>): Promise<void> => {
  try {
    await api.put(`/users/${userId}`, data);
  } catch {
    console.log('User updated:', data);
  }
};

// Marketplace API call
export const fetchMarketplaceData = async (
  page: number = 1,
  limit: number = 10,
  filters: FilterParams = {}
): Promise<MarketplaceResponse> => {
  try {
    const response = await api.get<MarketplaceResponse>('/marketplace', {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch {
    let filteredProducts = dummyProducts;
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

// Order-related API calls
export interface OrderRequest {
  buyer_id?: number;
  product_id: number;
  quantity: number;
  total_price: number;
}

export const placeOrder = async (data: OrderRequest): Promise<void> => {
  try {
    await api.post('/orders', data);
  } catch {
    console.log('Order placed:', data);
  }
};

// Notifications and Messages API calls
export const fetchNotifications = async (userId: number): Promise<{ id: number; message: string; read: boolean; created_at: string }[]> => {
  try {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  } catch {
    return dummyNotifications;
  }
};

export const fetchMessages = async (userId: number): Promise<{ id: number; sender_id: number; sender_name: string; content: string; read: boolean; created_at: string }[]> => {
  try {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  } catch {
    return dummyMessages;
  }
};

export const markMessageAsRead = async (messageId: number): Promise<void> => {
  try {
    await api.put(`/messages/${messageId}/read`);
  } catch {
    console.log('Message marked as read:', messageId);
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
  } catch {
    console.log('Notification marked as read:', notificationId);
  }
};