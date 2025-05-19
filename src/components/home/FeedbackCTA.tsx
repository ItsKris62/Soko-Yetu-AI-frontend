'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useAuthStore } from '../../stores/authStore';
import { getUserFromToken } from '../../utils/auth';
import { submitFeedback } from '../../utils/api';
import { showToast } from '../common/Toast';
import Button from '@/components/common/Button';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

type FeedbackForm = {
  name: string;
  feedback: string;
};

export default function FeedbackCTA() {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FeedbackForm>();
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Pre-fill name for logged-in users
  useEffect(() => {
    if (user) {
      const fullName = `${user.first_name} ${user.last_name}`;
      setValue('name', fullName);
    } else {
      const tokenUser = getUserFromToken();
      if (tokenUser) {
        // Fetch user details if needed (e.g., via API call)
        setValue('name', 'John Doe'); // Placeholder; replace with API call if needed
      }
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FeedbackForm> = async (data) => {
    setLoading(true);
    try {
      const feedbackData = {
        user_id: user?.id || null,
        feedback: data.feedback,
        name: data.name,
      };
      const response = await submitFeedback(feedbackData);
      
      // Load animation data first
      const res = await fetch('/animations/sending-success-animation.json');
      setAnimationData(await res.json());
      setShowAnimation(true); // Then show animation
      showToast(response.message, 'success');
      // We will reset the form after the animation completes
    } catch {
      showToast('Failed to submit feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    reset(); // Reset form fields
    setShowAnimation(false); // Hide animation
    setAnimationData(null); // Optional: clear animation data
  };

  return (
    <section className="bg-primary py-12 px-6 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 slide-up">We Value Your Feedback!</h2>
        <p className="text-lg mb-8 slide-up">
          Help us improve Soko Yetu by sharing your thoughts. Your feedback matters!
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg text-gray-800 slide-up">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">Your Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full p-3 border border-gray-300 rounded-lg input-focus"
              placeholder="Enter your name"
              aria-invalid={errors.name ? 'true' : 'false'}
              readOnly={!!user} // Make readonly for logged-in users
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-gray-700 mb-1 font-medium">Your Feedback</label>
            <textarea
              id="feedback"
              {...register('feedback', { required: 'Feedback is required', minLength: { value: 10, message: 'Feedback must be at least 10 characters' } })}
              className="w-full p-3 border border-gray-300 rounded-lg input-focus"
              placeholder="Tell us what you think..."
              rows={4}
              aria-invalid={errors.feedback ? 'true' : 'false'}
            />
            {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback.message}</p>}
          </div>
          <Button
            type="submit"
            variant='primary'
            className="w-full bg-primary hover:bg-light text-white transition-colors"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
        {showAnimation && animationData && (
          <div className="mt-6 flex justify-center">
            <Lottie
              options={{ loop: false, autoplay: true, animationData: animationData }}
              height={100}
              width={100}
              eventListeners={[
                {
                  eventName: 'complete',
                  callback: handleAnimationComplete,
                },
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
}