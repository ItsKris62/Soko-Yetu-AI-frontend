import Hero from '@/components/home/hero';
import Features from '@/components/home/Features';
import ProductSection from '@/components/home/ProductSection';
import Testimonials from '@/components/home/Testimonials';
import FeedbackCTA from '@/components/home/FeedbackCTA';
import InsightsPreview from '@/components/home/InsightsPreview'

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <ProductSection />
      <InsightsPreview />
      <Testimonials />
      <FeedbackCTA />
    </div>
  );
}