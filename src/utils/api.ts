
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStore'; // import zustand store for authentication
// import types for API requests and responses
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  FeedbackRequest,
  FeedbackResponse,
  InsightsPreviewData,
  FilterParams,
  MarketplaceResponse,
  DashboardData,
  LocationData,
  Transaction,
  Review,
  Product,
  User,
  Category,
  PredefinedProduct,
} from '../types/api';

// Import user-related types (including Country, County, SubCounty)
import { Country, County, SubCounty } from '../types/user';

// Determine the base URL
let effectiveBaseURL = 'http://localhost:5000/api';

// Check for environment variable to set base URL
if (process.env.NEXT_PUBLIC_API_URL) {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  // Ensure the URL ends with '/api'
  if (envUrl.endsWith('/api')) {
    effectiveBaseURL = envUrl;
  } else if (envUrl.endsWith('/')) {
    effectiveBaseURL = `${envUrl}api`;
  } else {
    effectiveBaseURL = `${envUrl}/api`;
  }
}

// Configure axios instance
const api = axios.create({
  baseURL: effectiveBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable CSRF token support
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Attempt to refresh token if 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post<LoginResponse>('/auth/refresh');
        useAuthStore.getState().setAuth(data.user, data.token);
        localStorage.setItem('auth_token', data.token); // Backward compatibility
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.token}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Extract error message from response
    const errorData = error.response?.data as { error?: string } | undefined;
    const errorMessage =
      errorData?.error ||
      error.message ||
      'An unexpected error occurred';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Generic authenticated request helper
export const authenticatedRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
          (axiosError.response?.data as { error?: string })?.error ||
          axiosError.message ||
          'Request failed'
        );
  }
};

// ------------------------------------
//      Authentication API calls
// ------------------------------------

// Login and Signup API calls
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await authenticatedRequest<LoginResponse>('post', '/auth/login', data);
  useAuthStore.getState().setAuth(response.user, response.token);
  localStorage.setItem('auth_token', response.token); // Backward compatibility
  return response;
};

// ---------------------------------------
//      Register a new user
// ----------------------------------------

export const signup = async (data: SignupRequest): Promise<LoginResponse> => {
  const response = await authenticatedRequest<LoginResponse>('post', '/auth/register', data);
  useAuthStore.getState().setAuth(response.user, response.token);
  localStorage.setItem('auth_token', response.token); // Backward compatibility
  return response;
};

// ---------------------------------------
//      User Profile Management API calls
// ----------------------------------------

// Fetch user profile
export const fetchUserProfile = async (userId: number): Promise<User> => {
  return authenticatedRequest<User>('get', `/users/${userId}`);
};

// Update user profile
export const updateUserProfile = async (userId: number, data: Partial<User>): Promise<User> => {
  const updatedUser = await authenticatedRequest<User>('put', `/users/${userId}`, data);
  useAuthStore.getState().updateUser(updatedUser);
  return updatedUser;
};

// Token refresh
export const refreshToken = async (): Promise<LoginResponse> => {
  const response = await authenticatedRequest<LoginResponse>('post', '/auth/refresh');
  useAuthStore.getState().setAuth(response.user, response.token);
  localStorage.setItem('auth_token', response.token); // Backward compatibility
  return response;
};

// Session validation
export const checkSessionTimeout = async (): Promise<boolean> => {
  try {
    await authenticatedRequest('get', '/auth/validate');
    return true;
  } catch {
    useAuthStore.getState().logout();
    return false;
  }
};

// Dummy data (updated to match types/api.ts)
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
    id: '1',
    farmer_id: 1,
    predefined_product_id: '1',
    product_name: 'Maize',
    price: 4200,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747660158/sweet-corn.png',
    category_id: '1074583482281361409',
    category_name: 'Cereals',
    county_id: 1,
    county_name: 'Nakuru County',
    ai_suggested_price: 3800,
    ai_quality_grade: 4.8,
  },
  {
    id: '2',
    farmer_id: 1,
    predefined_product_id: '2',
    product_name: 'Tomatoes',
    price: 150,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747634226/red-tomatoes.png',
    category_id: '1067026787098886145',
    category_name: 'Vegetables',
    county_id: 2,
    county_name: 'Kiambu County',
    ai_suggested_price: 135,
    ai_quality_grade: 4.5,
  },
  {
    id: '3',
    farmer_id: 1,
    predefined_product_id: '3',
    product_name: 'Avocados',
    price: 320,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747634473/avocado.png',
    category_id: '1067026787099017217',
    category_name: 'Fruits',
    county_id: 3,
    county_name: 'Murang’a County',
    ai_suggested_price: 280,
    ai_quality_grade: 4.7,
  },
  {
    id: '4',
    farmer_id: 1,
    predefined_product_id: '2',
    product_name: 'Red Beans',
    price: 500,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747637030/red-beans.png',
    category_id: '1074583482281459713',
    category_name: 'Legumes',
    county_id: 4,
    county_name: 'Machakos County',
    ai_suggested_price: 450,
    ai_quality_grade: 4.6,
  },
  {
    id: '5',
    farmer_id: 1,
    predefined_product_id: '13',
    product_name: 'Irish Potatoes',
    price: 2800,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747634222/potatoes.png',
    category_id: '1074583482281492481',
    category_name: 'Tubers',
    county_id: 5,
    county_name: 'Nyandarua County',
    ai_suggested_price: 2500,
    ai_quality_grade: 4.4,
  },
  {
    id: '6',
    farmer_id: 1,
    predefined_product_id: '3',
    product_name: 'Green Kales',
    price: 100,
    image_url: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1747637029/kales.png',
    category_id: '1067026787098886145',
    category_name: 'Vegetables',
    county_id: 6,
    county_name: 'Nairobi County',
    ai_suggested_price: 65,
    ai_quality_grade: 4.3,
  },
];

const dummyCategories: Category[] = [
  { id: '1067026787098886145', name: 'Vegetables' },
  { id: '1067026787099017217', name: 'Fruits' },
  { id: '1067026787099049985', name: 'Grains' },
  { id: '1074583482281361409', name: 'Cereals' },
  { id: '1074583482281459713', name: 'Legumes' },
  { id: '1074583482281492481', name: 'Tubers' },
  { id: '1074583482281525249', name: 'Dairy' },
  { id: '1074583482281558017', name: 'Herbs and Spices' },
  { id: '1074583482281590785', name: 'Nuts' },
];

const dummyPredefinedProducts: PredefinedProduct[] = [
  { id: '1', name: 'Tomatoes', category_id: '1067026787098886145', category_name: 'Vegetables' },
  { id: '2', name: 'Onions', category_id: '1067026787098886145', category_name: 'Vegetables' },
  { id: '3', name: 'Kales (Sukuma Wiki)', category_id: '1067026787098886145', category_name: 'Vegetables' },
  { id: '4', name: 'Avocados', category_id: '1067026787099017217', category_name: 'Fruits' },
  { id: '5', name: 'Mangoes', category_id: '1067026787099017217', category_name: 'Fruits' },
  { id: '6', name: 'Bananas', category_id: '1067026787099017217', category_name: 'Fruits' },
  { id: '7', name: 'Rice', category_id: '1067026787099049985', category_name: 'Grains' },
  { id: '8', name: 'Sorghum', category_id: '1067026787099049985', category_name: 'Grains' },
  { id: '9', name: 'Maize', category_id: '1074583482281361409', category_name: 'Cereals' },
  { id: '10', name: 'Wheat', category_id: '1074583482281361409', category_name: 'Cereals' },
  { id: '11', name: 'Beans', category_id: '1074583482281459713', category_name: 'Legumes' },
  { id: '12', name: 'Peas', category_id: '1074583482281459713', category_name: 'Legumes' },
  { id: '13', name: 'Potatoes (Irish Potatoes)', category_id: '1074583482281492481', category_name: 'Tubers' },
  { id: '14', name: 'Sweet Potatoes', category_id: '1074583482281492481', category_name: 'Tubers' },
  { id: '15', name: 'Milk', category_id: '1074583482281525249', category_name: 'Dairy' },
  { id: '16', name: 'Cheese', category_id: '1074583482281525249', category_name: 'Dairy' },
  { id: '17', name: 'Coriander (Dhania)', category_id: '1074583482281558017', category_name: 'Herbs and Spices' },
  { id: '18', name: 'Garlic', category_id: '1074583482281558017', category_name: 'Herbs and Spices' },
  { id: '19', name: 'Cashew Nuts', category_id: '1074583482281590785', category_name: 'Nuts' },
  { id: '20', name: 'Macadamia Nuts', category_id: '1074583482281590785', category_name: 'Nuts' },
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
  {
    id: 1,
    buyer_id: 2,
    product_id: 1,
    product_name: 'Premium Maize',
    quantity: 2,
    total_price: 8400,
    status: 'delivered',
    created_at: '2025-04-01T00:00:00Z',
  },
  {
    id: 2,
    buyer_id: 2,
    product_id: 2,
    product_name: 'Organic Tomatoes',
    quantity: 5,
    total_price: 750,
    status: 'shipped',
    created_at: '2025-04-02T00:00:00Z',
  },
];

const dummyReviews: Review[] = [
  {
    id: 1,
    product_id: 1,
    product_name: 'Premium Maize',
    reviewer_id: 2,
    reviewer_name: 'Jane Smith',
    rating: 5,
    comment: 'Excellent quality!',
    created_at: '2025-04-03T00:00:00Z',
  },
  {
    id: 2,
    product_id: 2,
    product_name: 'Organic Tomatoes',
    reviewer_id: 2,
    reviewer_name: 'Jane Smith',
    rating: 4,
    comment: 'Very fresh.',
    created_at: '2025-04-04T00:00:00Z',
  },
];

const dummyNotifications = [
  { id: 1, message: 'Your order has been shipped!', read: false, created_at: '2025-05-18T12:00:00Z' },
  { id: 2, message: 'New review on your product!', read: false, created_at: '2025-05-17T09:00:00Z' },
];

const dummyMessages = [
  {
    id: 1,
    sender_id: 2,
    sender_name: 'Jane Smith',
    content: 'Hi, is your maize still available?',
    read: false,
    created_at: '2025-05-18T14:00:00Z',
  },
  {
    id: 2,
    sender_id: 2,
    sender_name: 'Jane Smith',
    content: 'Can you deliver to Nairobi?',
    read: false,
    created_at: '2025-05-18T14:05:00Z',
  },
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

// Product-related API calls
export const fetchProducts = async (
  page: number = 1,
  limit: number = 8,
  category?: string
): Promise<{ products: Product[]; total: number }> => {
  try {
    const response = await authenticatedRequest<{ products: Product[]; total: number }>(
      'get',
      '/products',
      null,
      { params: { page, limit, category } }
    );
    return response;
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

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    return await authenticatedRequest<Category[]>('get', '/categories');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching categories:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error fetching categories:', error.message);
    } else {
      console.error('Error fetching categories:', error);
    }
    return dummyCategories;
  }
};

export const fetchPredefinedProducts = async (categoryId?: string): Promise<PredefinedProduct[]> => {
  try {
    return await authenticatedRequest<PredefinedProduct[]>(
      'get',
      '/predefined-products',
      null,
      { params: { categoryId } }
    );
  } catch {
    return categoryId
      ? dummyPredefinedProducts.filter((p) => p.category_id.toString() === categoryId.toString())
      : dummyPredefinedProducts;
  }
};

// -----------------------------
// Location APIs
// -----------------------------

/**
 * Fetches list of countries.
 */
export const fetchCountries = async (): Promise<Country[]> => {
  try {
    return await authenticatedRequest<Country[]>('get', '/locations/countries');
  } catch (error: any) {
    console.error('Error fetching countries:', error.message);
    return [{ id: 1071943693188038657, name: 'Kenya' }];
  }
};

/**
 * Fetches counties by country ID.
 */
export const fetchCounties = async (
  countryId?: string
): Promise<County[]> => {
  try {
    return await authenticatedRequest<County[]>(
      'get',
      '/locations/counties',
      null,
      { params: { countryId } }
    );
  } catch (error: any) {
    console.error('Error fetching counties:', error.message);
    return [];
  }
};

/**
 * Fetches sub-counties by county ID.
 */
export const fetchSubCounties = async (
  countyId?: string
): Promise<SubCounty[]> => {
  try {
    return await authenticatedRequest<SubCounty[]>(
      'get',
      '/locations/sub-counties',
      null,
      { params: { countyId } }
    );
  } catch (error: any) {
    console.error('Error fetching sub-counties:', error.message);
    return [];
  }
};

export const createProduct = async (
  data: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> => {
  try {
    return await authenticatedRequest<Product>('post', '/products', data);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to add product');
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    return await authenticatedRequest<Product>('get', `/products/${id}`);
  } catch {
    const product = dummyProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
};

export const submitFeedback = async (data: FeedbackRequest): Promise<FeedbackResponse> => {
  try {
    return await authenticatedRequest<FeedbackResponse>('post', '/feedback', data);
  } catch {
    return { message: 'Feedback submitted successfully' };
  }
};

export const fetchInsightsPreview = async (): Promise<InsightsPreviewData> => {
  try {
    return await authenticatedRequest<InsightsPreviewData>('get', '/insights/preview');
  } catch {
    return dummyInsights;
  }
};

export const fetchDashboardData = async (
  userId: number,
  role: 'farmer' | 'buyer'
): Promise<DashboardData> => {
  try {
    return await authenticatedRequest<DashboardData>(
      'get',
      `/dashboard/${userId}`,
      null,
      { params: { role } }
    );
  } catch {
    return {
      user: dummyUser.user,
      stats: { total_products: 0, completed_transactions: 0, average_rating: 0 },
      transactions: [],
      reviews: [],
      products: [],
    };
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await authenticatedRequest<{ secure_url: string }>(
      'post',
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.secure_url;
  } catch {
    throw new Error('Failed to upload image');
  }
};

export const fetchLocationData = async (): Promise<LocationData> => {
  try {
    return await authenticatedRequest<LocationData>('get', '/locations');
  } catch {
    return {
      countries: [{ id: 1, name: 'Kenya' }],
      counties: [],
      subcounties: [],
    };
  }
};

export const fetchMarketplaceData = async (
  page: number = 1,
  limit: number = 10,
  filters: FilterParams = {}
): Promise<MarketplaceResponse> => {
  try {
    return await authenticatedRequest<MarketplaceResponse>(
      'get',
      '/marketplace',
      null,
      { params: { page, limit, ...filters } }
    );
  } catch {
    let filteredProducts = dummyProducts;
    if (filters.category) {
      filteredProducts = filteredProducts.filter((p) => p.category_name === filters.category);
    }
    if (filters.county_id) {
      filteredProducts = filteredProducts.filter((p) => p.county_id?.toString() === filters.county_id);
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.qualityRating) {
      filteredProducts = filteredProducts.filter(
        (p) => p.ai_quality_grade && Number(p.ai_quality_grade) >= filters.qualityRating!
      );
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.product_name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      categories: dummyCategories.map((c) => c.name),
      countries: [{ id: '1', name: 'Kenya' }],
      counties: [
        { id: '1', name: 'Nakuru County', country_id: '1' },
        { id: '2', name: 'Kiambu County', country_id: '1' },
        { id: '3', name: 'Murang’a County', country_id: '1' },
        { id: '4', name: 'Machakos County', country_id: '1' },
        { id: '5', name: 'Nyandarua County', country_id: '1' },
        { id: '6', name: 'Nairobi County', country_id: '1' },
      ],
      sub_counties: [],
    };
  }
};

export interface OrderRequest {
  buyer_id?: number;
  product_id: number;
  quantity: number;
  total_price: number;
}

export const placeOrder = async (data: OrderRequest): Promise<void> => {
  try {
    await authenticatedRequest('post', '/orders', data);
  } catch {
    console.log('Order placed:', data);
  }
};

export const fetchNotifications = async (
  userId: number
): Promise<{ id: number; message: string; read: boolean; created_at: string }[]> => {
  try {
    return await authenticatedRequest('get', `/notifications/${userId}`);
  } catch {
    return dummyNotifications;
  }
};

export const fetchMessages = async (
  userId: number
): Promise<{ id: number; sender_id: number; sender_name: string; content: string; read: boolean; created_at: string }[]> => {
  try {
    return await authenticatedRequest('get', `/messages/${userId}`);
  } catch {
    return dummyMessages;
  }
};

export const markMessageAsRead = async (messageId: number): Promise<void> => {
  try {
    await authenticatedRequest('put', `/messages/${messageId}/read`);
  } catch {
    console.log('Message marked as read:', messageId);
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await authenticatedRequest('put', `/notifications/${notificationId}/read`);
  } catch {
    console.log('Notification marked as read:', notificationId);
  }
};