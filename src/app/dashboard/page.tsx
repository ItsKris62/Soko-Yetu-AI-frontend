'use client';

import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../stores/authStore';
import { 
  fetchDashboardData, 
  fetchLocationData, 
  updateUserProfile, 
  uploadImage,
  createProduct,
  fetchUserProfile // Added this function
} from '../../utils/api';
import { DashboardData, LocationData } from '../../types/api';
import { User } from '../../types/user';
import { Product } from '../../types/product';
import UserStats from '../../components/dashboard/UserStats';
import ProductForm from '../../components/products/ProductForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useForm, SubmitHandler } from 'react-hook-form';

export default function DashboardPage() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    setError(null);
    try {
      const [dashboard, locations] = await Promise.all([
        fetchDashboardData(user.id, user.role || 'buyer'),
        fetchLocationData(),
      ]);
      setDashboardData(dashboard);
      setLocationData(locations);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle product creation
  const handleProductSubmit = async (formData: any) => {
    if (!user) return;
    
    setProductFormLoading(true);
    setProductFormError(null);
    
    try {
      const newProductData = { ...formData, farmer_id: user.id };
      const newProduct = await createProduct(newProductData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
      
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: [...prev.products, newProduct],
          stats: { ...prev.stats, total_products: prev.stats.total_products + 1 },
        };
      });
      
      setShowProductForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product.';
      setProductFormError(errorMessage);
      console.error('Product creation error:', err);
    } finally {
      setProductFormLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="py-12 px-6 text-center text-gray-600">
        Please log in to view your dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-12 px-6 text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#278783] mx-auto mb-4"></div>
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="py-12 px-6 text-center text-red-500">
        <div className="mb-4">{error || 'Failed to load dashboard data.'}</div>
        <Button 
          onClick={loadDashboardData}
          className="bg-[#278783] hover:bg-[#1f6b67] text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  const role = user.role || 'buyer';

  return (
    <div className="py-12 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar_url || 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739801586/unknown-user.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.src = 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739801586/unknown-user.png';
              }}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 capitalize">{role === 'farmer' ? 'Farmer' : 'Buyer'}</p>
              <p className="text-gray-600">
                {user.sub_county_name && `${user.sub_county_name}, `}
                {user.county_name && `${user.county_name}, `}
                {user.country_name}
              </p>
              <p className="text-gray-600">
                Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
              <UserStats
                totalProducts={dashboardData.stats.total_products}
                completedTransactions={dashboardData.stats.completed_transactions}
                averageRating={dashboardData.stats.average_rating}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex border-b overflow-x-auto">
            {['overview', 'products', 'transactions', 'reviews', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center capitalize whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-b-2 border-[#278783] text-[#278783] font-semibold' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab dashboardData={dashboardData} role={role} />
            )}

            {activeTab === 'products' && (
              <ProductsTab 
                dashboardData={dashboardData} 
                role={role} 
                onAddProduct={() => setShowProductForm(true)} 
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsTab transactions={dashboardData.transactions} />
            )}

            {activeTab === 'reviews' && (
              <ReviewsTab reviews={dashboardData.reviews} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab 
                user={user} 
                locationData={locationData} 
                setUser={setUser} 
                onUserUpdate={loadDashboardData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <Modal onClose={() => setShowProductForm(false)}>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
            {productFormError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {productFormError}
              </div>
            )}
            <ProductForm
              onSubmit={handleProductSubmit}
              onClose={() => setShowProductForm(false)}
              initialData={{ farmer_id: user.id } as Partial<Product>}
              isLoading={productFormLoading}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ dashboardData, role }: { dashboardData: DashboardData; role: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Overview</h3>
      <p className="text-gray-600 mb-6">
        Welcome to your dashboard! Here's a quick summary of your activity.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-[#FFEBD0] to-[#FFE4B5] p-6 rounded-lg shadow-sm">
          <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.total_products}</p>
          <p className="text-gray-600">Products {role === 'farmer' ? 'Listed' : 'Purchased'}</p>
        </div>
        <div className="bg-gradient-to-r from-[#E0F2E7] to-[#C8E6C9] p-6 rounded-lg shadow-sm">
          <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.completed_transactions}</p>
          <p className="text-gray-600">Completed Transactions</p>
        </div>
        <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-lg shadow-sm">
          <p className="text-2xl font-bold text-gray-800">
            {dashboardData.stats.average_rating > 0 ? dashboardData.stats.average_rating.toFixed(1) : 'N/A'}
          </p>
          <p className="text-gray-600">Average Rating</p>
        </div>
      </div>
    </div>
  );
}

// Products Tab Component
function ProductsTab({ 
  dashboardData, 
  role, 
  onAddProduct 
}: { 
  dashboardData: DashboardData; 
  role: string; 
  onAddProduct: () => void; 
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {role === 'farmer' ? 'Your Products' : 'Recent Purchases'}
        </h3>
        {role === 'farmer' && (
          <Button
            onClick={onAddProduct}
            className="bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors"
          >
            + Add Product
          </Button>
        )}
      </div>
      
      {dashboardData.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found.</p>
          {role === 'farmer' && (
            <Button
              onClick={onAddProduct}
              className="bg-[#278783] hover:bg-[#1f6b67] text-white"
            >
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={product.image_url || '/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h4>
              <p className="text-gray-600 mb-1">Price: KSH {product.price?.toLocaleString()}</p>
              {role === 'buyer' && typeof (product as any).quantity === 'number' && (
                <p className="text-gray-600">Quantity: {(product as any).quantity}</p>
              )}
              {product.description && (
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Transactions Tab Component
function TransactionsTab({ transactions }: { transactions: any[] }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No transactions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{transaction.product_name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-medium">{transaction.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">KSH {transaction.total_price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-medium text-xs">#{transaction.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reviews Tab Component
function ReviewsTab({ reviews }: { reviews: any[] }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Reviews</h3>
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{review.product_name}</h4>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>By: {review.reviewer_name}</p>
                <p>{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced Settings Tab Component
interface SettingsTabProps {
  user: User;
  locationData: LocationData | null;
  setUser: (user: User | null) => void;
  onUserUpdate: () => void;
}

function SettingsTab({ user, locationData, setUser, onUserUpdate }: SettingsTabProps) {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const { updateUser, logout } = useAuthStore();
  const [selectedCountry, setSelectedCountry] = useState(user.country_id?.toString() || '');
  const [selectedCounty, setSelectedCounty] = useState(user.county_id?.toString() || '');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar_url);
  const [nationalIdPreview, setNationalIdPreview] = useState<string | undefined>(user.national_id_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    reset 
  } = useForm<User>({ 
    defaultValues: currentUser 
  });

  // Fetch current user data from backend
  const fetchCurrentUserData = useCallback(async () => {
    if (!user?.id) return;
    
    setFetchingUser(true);
    setError(null);
    
    try {
      const userData = await fetchUserProfile(user.id);
      setCurrentUser(userData);
      reset(userData);
      setSelectedCountry(userData.country_id?.toString() || '');
      setSelectedCounty(userData.county_id?.toString() || '');
      setAvatarPreview(userData.avatar_url);
      setNationalIdPreview(userData.national_id_url);
    } catch (err) {
      setError('Failed to fetch user data from server.');
      console.error('Error fetching user data:', err);
    } finally {
      setFetchingUser(false);
    }
  }, [user?.id, reset]);

  useEffect(() => {
    fetchCurrentUserData();
  }, [fetchCurrentUserData]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Avatar file size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('National ID file size must be less than 5MB');
        return;
      }
      setNationalIdFile(file);
      setNationalIdPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const onSubmit: SubmitHandler<User> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      let avatar_url = currentUser.avatar_url;
      let national_id_url = currentUser.national_id_url;

      // Upload avatar if a new file is selected
      if (avatarFile) {
        try {
          avatar_url = await uploadImage(avatarFile);
        } catch (uploadError) {
          throw new Error('Failed to upload avatar image');
        }
      }

      // Upload national ID if a new file is selected
      if (nationalIdFile) {
        try {
          national_id_url = await uploadImage(nationalIdFile);
        } catch (uploadError) {
          throw new Error('Failed to upload national ID image');
        }
      }

      const updatedData: Partial<User> = {
        email: data.email,
        phone_number: data.phone_number,
        country_id: data.country_id,
        county_id: data.county_id,
        sub_county_id: data.sub_county_id,
        avatar_url,
        national_id_url,
      };

      // Update user profile
      await updateUserProfile(currentUser.id, updatedData);

      // Update local state
      const updatedUser = {
        ...currentUser,
        ...updatedData,
        country_name: locationData?.countries.find(c => c.id === data.country_id)?.name,
        county_name: locationData?.counties.find(c => c.id === data.county_id)?.name,
        sub_county_name: locationData?.subcounties.find(s => s.id === data.sub_county_id)?.name,
      };

      setCurrentUser(updatedUser);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      
      // Reset file inputs
      setAvatarFile(null);
      setNationalIdFile(null);
      
      // Trigger dashboard data refresh
      onUserUpdate();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      setError(errorMessage);
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCounties = locationData?.counties.filter(
    (county) => county.country_id === Number(selectedCountry)
  ) || [];
  
  const filteredSubcounties = locationData?.subcounties.filter(
    (subcounty) => subcounty.county_id === Number(selectedCounty)
  ) || [];

  if (fetchingUser) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#278783] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Account Settings</h3>
        <Button
          onClick={fetchCurrentUserData}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-4"
          disabled={fetchingUser}
        >
          Refresh Data
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Read-only fields */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              value={currentUser.first_name || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={currentUser.last_name || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          
          {/* Editable fields */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email *</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required', 
                pattern: { 
                  value: /^\S+@\S+$/i, 
                  message: 'Invalid email format' 
                } 
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
            <input
              type="tel"
              {...register('phone_number', { 
                required: 'Phone number is required', 
                pattern: { 
                  value: /^\+?\d{10,15}$/, 
                  message: 'Invalid phone number format' 
                } 
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <input
              type="text"
              value={currentUser.gender || 'Not specified'}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">National ID</label>
            <input
              type="text"
              value={currentUser.id_number || 'Not specified'}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        {/* Location fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Country *</label>
            <select
              {...register('country_id', { required: 'Country is required' })}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCountry(value);
                setValue('country_id', value ? parseInt(value) : undefined);
                setValue('county_id', undefined);
                setValue('sub_county_id', undefined);
                setSelectedCounty('');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
            >
              <option value="">Select Country</option>
              {locationData?.countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country_id && (
              <p className="text-red-500 text-sm mt-1">{errors.country_id.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">County *</label>
            <select
              {...register('county_id', { required: 'County is required' })}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCounty(value);
                setValue('county_id', value ? parseInt(value) : undefined);
                setValue('sub_county_id', undefined);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
              disabled={!selectedCountry}
            >
              <option value="">Select County</option>
              {filteredCounties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
            {errors.county_id && (
              <p className="text-red-500 text-sm mt-1">{errors.county_id.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Sub-County *</label>
            <select
              {...register('sub_county_id', { required: 'Sub-County is required' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
              disabled={!selectedCounty}
            >
              <option value="">Select Sub-County</option>
              {filteredSubcounties.map((subcounty) => (
                <option key={subcounty.id} value={subcounty.id}>
                  {subcounty.name}
                </option>
              ))}
            </select>
            {errors.sub_county_id && (
              <p className="text-red-500 text-sm mt-1">{errors.sub_county_id.message}</p>
            )}
          </div>
        </div>

        {/* File upload fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
            />
            <p className="text-gray-500 text-sm mt-1">Max file size: 5MB</p>
            {avatarPreview && (
              <div className="mt-4">
                <img 
                  src={avatarPreview} 
                  alt="Profile Preview" 
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-200" 
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">National ID Card</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNationalIdChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#278783] focus:border-transparent"
            />
            <p className="text-gray-500 text-sm mt-1">Max file size: 5MB</p>
            {nationalIdPreview && (
              <div className="mt-4">
                <img 
                  src={nationalIdPreview} 
                  alt="National ID Preview" 
                  className="w-32 h-32 object-cover rounded border-2 border-gray-200" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="bg-[#278783] hover:bg-[#1f6b67] text-white px-8 py-3 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}