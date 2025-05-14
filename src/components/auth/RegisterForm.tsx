'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/utils/api';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import dynamic from 'next/dynamic';
// import Lottie from 'lottie-react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


import successAnimation from '@/../public/animations/success.json';
import errorAnimation from '@/../public/animations/error.json';

interface Country {
  id: string;
  name: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'farmer', // Default role
    country_id: '',
    county_id: '',
    sub_county_id: ''
  });

  const [countries, setCountries] = useState([]);
  const [counties, setCounties] = useState([]);
  const [subCounties, setSubCounties] = useState<Country[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusData, setStatusData] = useState<{
    animation: object;
    title: string;
    message: string;
  } | null>(null);
  
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';



  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // const response = await fetch('/api/locations/countries');
        // Use the API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/locations/countries`);
        
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch counties when country changes
  useEffect(() => {
    if (formData.country_id) {
      const fetchCounties = async () => {
        try {
          // const response = await fetch(`/api/locations/counties?country_id=${formData.country_id}`);
          // Use the API_BASE_URL
          const response = await fetch(`${API_BASE_URL}/locations/counties?country_id=${formData.country_id}`);
         
          const data = await response.json();
          setCounties(data);
          setFormData(prev => ({ ...prev, county_id: '', sub_county_id: '' }));
        } catch (error) {
          console.error('Error fetching counties:', error);
        }
      };
      fetchCounties();
    }
  }, [formData.country_id]);

  // Fetch sub-counties when county changes
  useEffect(() => {
    if (formData.county_id) {
      const fetchSubCounties = async () => {
        try {
          // const response = await fetch(`/api/locations/sub-counties?county_id=${formData.county_id}`);

          // Use the API_BASE_URL
          const response = await fetch(`${API_BASE_URL}/locations/sub-counties?county_id=${formData.county_id}`);
          
          const data = await response.json();
          setSubCounties(data);
          setFormData(prev => ({ ...prev, sub_county_id: '' }));
        } catch (error) {
          console.error('Error fetching sub-counties:', error);
          setSubCounties([]);
          setFormData(prev => ({ ...prev, sub_county_id: '' }));
        }
      };
      fetchSubCounties();
    }
  }, [formData.county_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { confirm_password, ...signupData } = formData;
      await signup(signupData);
      
      setStatusData({
        animation: successAnimation,
        title: 'Registration Successful',
        message: 'Redirecting to login page...'
      });
      setShowStatus(true);
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      
      setStatusData({
        animation: errorAnimation,
        title: 'Registration Failed',
        message: errorMessage
      });
      setShowStatus(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {showStatus && statusData ? (
        <div className="text-center p-6">
          <div className="w-32 h-32 mx-auto">
            <Lottie animationData={statusData.animation} loop={false} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-4">{statusData.title}</h3>
          <p className="text-gray-600 mt-2">{statusData.message}</p>
        </div>
      ) : (
        <>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 p-3 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'farmer' }))}
                  className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'farmer' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                    <span className="font-medium">Farmer</span>
                    <span className="text-xs text-gray-500 mt-1">Sell your products</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                  className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'buyer' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <span className="font-medium">Buyer</span>
                    <span className="text-xs text-gray-500 mt-1">Purchase farm products</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Location Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="country_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="country_id"
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country: Country) => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="county_id" className="block text-sm font-medium text-gray-700 mb-1">
                  County
                </label>
                <select
                  id="county_id"
                  name="county_id"
                  value={formData.county_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={!formData.country_id}
                  required
                >
                  <option value="">Select County</option>
                  {counties.map((county: Country) => (
                    <option key={county.id} value={county.id}>{county.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sub_county_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-County (Optional)
                </label>
                <select
                  id="sub_county_id"
                  name="sub_county_id"
                  value={formData.sub_county_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={!formData.county_id}
                >
                  <option value="">Select Sub-County</option>
                  {subCounties.map((subCounty: Country) => (
                    <option key={subCounty.id} value={subCounty.id}>{subCounty.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2 px-4 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign in
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default RegisterForm;