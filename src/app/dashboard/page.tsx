'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { fetchDashboardData, fetchLocationData, updateUserProfile, createProduct } from '../../utils/api'; // Added createProduct
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

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadData = async () => {
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
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <div className="py-12 px-6 text-center text-gray-600">Please log in to view your dashboard.</div>;
  }

  if (loading) {
    return <div className="py-12 px-6 text-center text-gray-600">Loading...</div>;
  }

  if (error || !dashboardData) {
    return <div className="py-12 px-6 text-center text-red-500">{error || 'Failed to load dashboard data.'}</div>;
  }

  const role = user.role || 'buyer';

  return (
    <div className="py-12 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar_url || '/images/placeholder.jpg'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">{role === 'farmer' ? 'Farmer' : 'Buyer'}</p>
              <p className="text-gray-600">
                {user.sub_county_name}, {user.county_name}, {user.country_name}
              </p>
              <p className="text-gray-600">Joined: {new Date(user.created_at!).toLocaleDateString()}</p>
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
          <div className="flex border-b">
            {['overview', 'products', 'transactions', 'reviews', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center capitalize ${
                  activeTab === tab ? 'border-b-2 border-[#278783] text-[#278783] font-semibold' : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Overview</h3>
                <p className="text-gray-600">
                  Welcome to your dashboard! Here’s a quick summary of your activity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-[#FFEBD0] p-4 rounded-lg">
                    <p className="text-lg font-semibold text-gray-800">{dashboardData.stats.total_products}</p>
                    <p className="text-gray-600">Products {role === 'farmer' ? 'Listed' : 'Purchased'}</p>
                  </div>
                  <div className="bg-[#FFEBD0] p-4 rounded-lg">
                    <p className="text-lg font-semibold text-gray-800">{dashboardData.stats.completed_transactions}</p>
                    <p className="text-gray-600">Completed Transactions</p>
                  </div>
                  <div className="bg-[#FFEBD0] p-4 rounded-lg">
                    <p className="text-lg font-semibold text-gray-800">{dashboardData.stats.average_rating.toFixed(1)}</p>
                    <p className="text-gray-600">Average Rating</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {role === 'farmer' ? 'Your Products' : 'Recent Purchases'}
                  </h3>
                  {role === 'farmer' && (
                    <Button
                      onClick={() => setShowProductForm(true)}
                      className="bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors"
                    >
                      + Add Product
                    </Button>
                  )}
                </div>
                {dashboardData.products.length === 0 ? (
                  <p className="text-gray-600">No products found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.products.map((product) => (
                      <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                        <img
                          src={product.image_url || '/images/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-gray-600">Price: KSH {product.price}</p>
                        {role === 'buyer' && typeof (product as any).quantity === 'number' && (
                          <p className="text-gray-600">Quantity: {(product as any).quantity}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                {dashboardData.transactions.length === 0 ? (
                  <p className="text-gray-600">No transactions found.</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.transactions.map((transaction) => (
                      <div key={transaction.id} className="bg-white p-4 rounded-lg shadow-md">
                        <p className="text-gray-800 font-semibold">{transaction.product_name}</p>
                        <p className="text-gray-600">Quantity: {transaction.quantity}</p>
                        <p className="text-gray-600">Total: KSH {transaction.total_price}</p>
                        <p className="text-gray-600">Status: {transaction.status}</p>
                        <p className="text-gray-600">Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
                {dashboardData.reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews found.</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.reviews.map((review) => (
                      <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                        <p className="text-gray-800 font-semibold">{review.product_name}</p>
                        <p className="text-gray-600">Reviewer: {review.reviewer_name}</p>
                        <p className="text-gray-600">Rating: {review.rating} / 5</p>
                        <p className="text-gray-600">Comment: {review.comment}</p>
                        <p className="text-gray-600">Date: {new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsTab user={dashboardData.user} locationData={locationData} setUser={setUser} />
            )}
          </div>
        </div>
      </div>

      {showProductForm && (
        <Modal onClose={() => setShowProductForm(false)}>
          {productFormError && <p className="text-red-500 mb-4">{productFormError}</p>}
          <ProductForm
            onSubmit={async (formData) => {
              if (!user) return;
              setProductFormLoading(true);
              setProductFormError(null);
              try {
                // Assuming formData includes farmer_id or it's added here
                // The Product type might need adjustment based on what ProductForm provides
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
                setProductFormError(err instanceof Error ? err.message : 'Failed to add product.');
              } finally {
                setProductFormLoading(false);
              }
            }}
            onClose={() => setShowProductForm(false)}
            initialData={{ farmer_id: user.id } as Partial<Product>} // Use Partial<Product> for more flexibility
            isLoading={productFormLoading}
          />
        </Modal>
      )}
    </div>
  );
}

// Settings Tab Component
interface SettingsTabProps {
  user: User;
  locationData: LocationData | null;
  setUser: (user: User | null) => void;
}

function SettingsTab({ user, locationData, setUser }: SettingsTabProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<User>({ defaultValues: user });
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(user.country_id || '');
  const [selectedCounty, setSelectedCounty] = useState(user.county_id || '');

  const resetFormValues = useCallback(() => {
    setValue('email', user.email);
    setValue('phone_number', user.phone_number);
    setValue('country_id', user.country_id);
    setValue('county_id', user.county_id);
    setValue('sub_county_id', user.sub_county_id);
    setSelectedCountry(user.country_id || '');
    setSelectedCounty(user.county_id || '');
  }, [user, setValue]);

  useEffect(() => {
    resetFormValues();
  }, [user, resetFormValues]); // locationData is implicitly handled if user object changes due to locationData related fetches


  const onSubmit: SubmitHandler<User> = async (data) => {
    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        email: data.email,
        phone_number: data.phone_number,
        country_id: data.country_id,
        county_id: data.county_id,
        sub_county_id: data.sub_county_id,
      });
      // Update user in auth store
      setUser({
        ...user,
        email: data.email,
        phone_number: data.phone_number,
        country_id: data.country_id,
        county_id: data.county_id,
        sub_county_id: data.sub_county_id,
        country_name: locationData?.countries.find(c => c.id === data.country_id)?.name,
        county_name: locationData?.counties.find(c => c.id === data.county_id)?.name,
        sub_county_name: locationData?.subcounties.find(s => s.id === data.sub_county_id)?.name,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCounties = locationData?.counties.filter((county) => county.country_id === Number(selectedCountry)) || [];
  const filteredSubcounties = locationData?.subcounties.filter((subcounty) => subcounty.county_id === Number(selectedCounty)) || [];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Settings</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">First Name (Read-only)</label>
          <input
            type="text"
            value={user.first_name}
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Last Name (Read-only)</label>
          <input
            type="text"
            value={user.last_name}
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            {...register('phone_number', { required: 'Phone number is required', pattern: { value: /^\+?\d{10,15}$/, message: 'Invalid phone number' } })}
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
          {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Gender (Read-only)</label>
          <input
            type="text"
            value={user.gender || 'Not specified'}
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">National ID (Read-only)</label>
          <input
            type="text"
            value={user.id_number || 'Not specified'}
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Country</label>
          <select
            {...register('country_id', { required: 'Country is required' })}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setValue('country_id', parseInt(e.target.value));
              setValue('county_id', undefined);
              setValue('sub_county_id', undefined);
            }}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Country</option>
            {locationData?.countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
          {errors.country_id && <p className="text-red-500 text-sm mt-1">{errors.country_id.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">County</label>
          <select
            {...register('county_id', { required: 'County is required' })}
            onChange={(e) => {
              setSelectedCounty(e.target.value);
              setValue('county_id', parseInt(e.target.value));
              setValue('sub_county_id', undefined);
            }}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select County</option>
            {filteredCounties.map((county) => (
              <option key={county.id} value={county.id}>{county.name}</option>
            ))}
          </select>
          {errors.county_id && <p className="text-red-500 text-sm mt-1">{errors.county_id.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Sub-County</label>
          <select
            {...register('sub_county_id', { required: 'Sub-County is required' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Sub-County</option>
            {filteredSubcounties.map((subcounty) => (
              <option key={subcounty.id} value={subcounty.id}>{subcounty.name}</option>
            ))}
          </select>
          {errors.sub_county_id && <p className="text-red-500 text-sm mt-1">{errors.sub_county_id.message}</p>}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}