'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import dynamic from 'next/dynamic';
import useAuthStore from '../../stores/authStore';
import { getUserFromToken } from '../../utils/auth';
import { submitFeedback } from '../../utils/api';
import { showToast } from '../common/Toast';
import Button from '@/components/common/Button';
import { useDebounce } from '../../hooks/useDebounce';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

type FeedbackForm = {
  name: string;
  feedback: string;
};

export default function FeedbackCTA() {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<FeedbackForm>();
  const [loading, setLoading] = useState(false);
  const [animationLoading, setAnimationLoading] = useState(false);
  const [animationData, setAnimationData] = useState<unknown | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const watchedFeedback = watch('feedback', '');
  const debouncedFeedback = useDebounce(watchedFeedback, 300);
  const feedbackLength = debouncedFeedback.length || 0;

  // Enhanced user detection and name pre-filling
  useEffect(() => {
    let currentUser = user;

    // If no user from store, try to get from token
    if (!currentUser) {
      currentUser = getUserFromToken();
    }

    if (currentUser) {
      setIsLoggedIn(true);
      let fullName = '';
      if (currentUser.first_name && currentUser.last_name) {
        fullName = `${currentUser.first_name} ${currentUser.last_name}`.trim();
      } else if (currentUser.name) {
        fullName = currentUser.name.trim();
      } else if (currentUser.username) {
        fullName = currentUser.username.trim();
      } else {
        fullName = 'Verified User';
      }

      if (fullName) {
        setValue('name', fullName, { shouldValidate: true });
      }
    } else {
      setIsLoggedIn(false);
      setValue('name', '', { shouldValidate: false });
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FeedbackForm> = async (data) => {
    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedFeedback = data.feedback.trim().replace(/\s+/g, ' ');
      const sanitizedName = data.name ? data.name.trim().replace(/\s+/g, ' ') : null;

      // Prepare feedback data
      const feedbackData = {
        user_id: isLoggedIn && user?.id ? user.id : null,
        feedback: sanitizedFeedback,
        name: sanitizedName,
      };

      // Submit feedback
      const response = await submitFeedback(feedbackData);

      // Load and show success animation
      setAnimationLoading(true);
      try {
        const animationResponse = await fetch('/animations/sending-success-animation.json');
        if (animationResponse.ok) {
          const animationJson = await animationResponse.json();
          setAnimationData(animationJson);
          setShowAnimation(true);
        } else {
          throw new Error('Animation failed to load');
        }
      } catch (animationError) {
        console.warn('Failed to load animation:', animationError);
        handleAnimationComplete();
      } finally {
        setAnimationLoading(false);
      }

      showToast(response.message || 'Feedback submitted successfully!', 'success');
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      let errorMessage = 'Failed to submit feedback. Please try again.';
      if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid input. Please check your feedback and try again.';
      } else if (error.status === 429) {
        errorMessage = 'Too many submissions. Please try again later.';
      }
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    // Reset form fields
    reset({ name: '', feedback: '' });

    // Re-populate name field if user is logged in
    if (isLoggedIn && user) {
      let fullName = '';
      if (user.first_name && user.last_name) {
        fullName = `${user.first_name} ${user.last_name}`.trim();
      } else if (user.name) {
        fullName = user.name.trim();
      } else if (user.username) {
        fullName = user.username.trim();
      } else {
        fullName = 'Verified User';
      }
      setValue('name', fullName, { shouldValidate: true });
    }

    // Clear animation states
    setShowAnimation(false);
    setAnimationData(null);
    setLoading(false);

    // Restore focus to the form
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.focus();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 py-16 px-6 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 id="feedback-form-title" className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            We Value Your Feedback!
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Help us improve Soko Yetu by sharing your thoughts. Your feedback drives our innovation and helps us serve you better.
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20">
            {/* Show success animation or form */}
            {showAnimation && animationData ? (
              <div className="flex flex-col items-center space-y-6 py-8">
                <div className="bg-green-50 rounded-full p-4">
                  <Lottie
                    options={{ 
                      loop: false, 
                      autoplay: true, 
                      animationData: animationData 
                    }}
                    height={120}
                    width={120}
                    eventListeners={[
                      {
                        eventName: 'complete',
                        callback: handleAnimationComplete,
                      },
                    ]}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">Feedback Submitted!</h3>
                  <p className="text-green-600">Thank you for helping us improve Soko Yetu</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-labelledby="feedback-form-title">
                {/* User Status Indicator */}
                {isLoggedIn && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4" aria-live="polite">
                    <div className="flex items-center text-blue-700 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Logged in as a verified user
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Your Name
                    {isLoggedIn && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>}
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      {...register('name', { 
                        required: isLoggedIn ? false : 'Name is required',
                        minLength: isLoggedIn ? undefined : { value: 2, message: 'Name must be at least 2 characters' },
                        maxLength: { value: 100, message: 'Name must be less than 100 characters' }
                      })}
                      className={`w-full p-4 border-2 rounded-xl transition-all duration-200 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/20 outline-none ${
                        errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      } ${isLoggedIn ? 'cursor-not-allowed opacity-75' : ''} text-black`}
                      placeholder={isLoggedIn ? "Your name (auto-filled)" : "Enter your full name (optional)"}
                      readOnly={isLoggedIn}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {isLoggedIn && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm font-medium flex items-center" role="alert">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Feedback Field */}
                <div className="space-y-2">
                  <label htmlFor="feedback" className="flex items-center justify-between text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Your Feedback
                    </div>
                    <span className={`text-xs ${feedbackLength < 10 ? 'text-gray-400' : feedbackLength > 1000 ? 'text-orange-500' : 'text-green-500'}`} aria-live="polite">
                      {feedbackLength}/1000
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="feedback"
                      {...register('feedback', { 
                        required: 'Feedback is required', 
                        minLength: { value: 10, message: 'Feedback must be at least 10 characters' },
                        maxLength: { value: 1000, message: 'Feedback must be less than 1000 characters' }
                      })}
                      className={`w-full p-4 border-2 rounded-xl transition-all duration-200 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/20 outline-none resize-none ${
                        errors.feedback ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      } text-black`}
                      placeholder="Share your thoughts, suggestions, or experiences with us. We appreciate detailed feedback that helps us understand your needs better..."
                      rows={6}
                      maxLength={1000}
                      aria-invalid={errors.feedback ? 'true' : 'false'}
                      aria-describedby={errors.feedback ? 'feedback-error' : undefined}
                    />
                    <div className="absolute bottom-3 right-3">
                      <div className={`w-3 h-3 rounded-full transition-colors ${feedbackLength >= 10 ? 'bg-green-400' : 'bg-gray-300'}`} aria-hidden="true"></div>
                    </div>
                  </div>
                  {errors.feedback && (
                    <p id="feedback-error" className="text-red-500 text-sm font-medium flex items-center" role="alert">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.feedback.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    disabled={loading || animationLoading}
                  >
                    {loading || animationLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8 text-white/80">
            <p className="text-sm">
              {isLoggedIn 
                ? "Your feedback will be associated with your account for better follow-up." 
                : "Your feedback is anonymous and helps us build better experiences for everyone."
              }
              <br />
              <span className="font-medium">Thank you for being part of our community!</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}