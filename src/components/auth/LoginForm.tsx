'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/utils/api';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import dynamic from 'next/dynamic';
import { setToken } from '@/utils/auth'; 

import loadingAnimation from '@/../public/animations/loading.json';
import successAnimation from '@/../public/animations/success.json';
import errorAnimation from '@/../public/animations/error.json';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

const LoginForm = ({ onSuccess, onNavigateToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // New state to track navigation
  const [statusData, setStatusData] = useState<{
    animation: unknown;
    title: string;
    message: string;
    isSuccess: boolean;
  } | null>(null);
  
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('Email is required.');
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required.');
      setIsLoading(false);
      return;
    }

    setError('');

    try {
      const { user, token } = await login({ email, password });
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Show success animation
      setStatusData({
        animation: successAnimation,
        title: 'Login Successful',
        message: 'Redirecting to your dashboard...',
        isSuccess: true,
      });
      setShowStatus(true);
      
      // Set navigation state and handle redirect
      setTimeout(() => {
        setIsNavigating(true);
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard');
        }
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      setError(errorMessage);
      
      // Show error animation
      setStatusData({
        animation: errorAnimation,
        title: 'Login Failed',
        message: errorMessage,
        isSuccess: false,
      });
      setShowStatus(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setShowStatus(false);
    setStatusData(null);
    setError('');
    setPassword(''); 
  };

  const handleSignUpClick = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      router.push('/auth/register');
    }
  };

  // Don't render anything if we're navigating after successful login
  if (isNavigating) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Add exit animation
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {showStatus && statusData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="text-center p-6"
        >
          <div className="w-32 h-32 mx-auto">
            <Lottie 
              animationData={statusData.animation} 
              loop={!statusData.isSuccess} // Only loop for loading/error, not success
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-4">{statusData.title}</h3>
          <p className="text-gray-600 mt-2">{statusData.message}</p>
          {!statusData.isSuccess && (
            <Button
              onClick={handleTryAgain}
              variant="secondary" 
              className="mt-6"
            >
              Try Again
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
                disabled={isLoading} // Disable during loading
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
                disabled={isLoading} // Disable during loading
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  disabled={isLoading} // Disable during loading
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a 
                  href="/auth/reset-password" 
                  className={`font-medium ${isLoading ? 'text-gray-400 pointer-events-none' : 'text-primary hover:text-primary-dark'}`}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2 px-4 flex justify-center items-center border border-gray-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 mr-2">
                    <Lottie animationData={loadingAnimation} loop={true} />
                  </div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={handleSignUpClick}
              className={`font-medium ${isLoading ? 'text-gray-400 pointer-events-none' : 'text-primary hover:text-primary-dark'}`}
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoginForm;