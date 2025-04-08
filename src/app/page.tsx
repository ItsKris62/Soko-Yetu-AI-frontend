import Hero from '../sections/HeroSection'
import FeatureGrid from '../sections/FeaturesGrid'
import ProductShowcase from '../sections/ProductShowcase'
import InsightsDashboard from '../sections/InsightsDashboard'
import Testimonials from '../sections/Testimonials'
import CTASection from '../sections/CTASection'
import LoginModal from '../sections/LoginModal'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <ProductShowcase />
      <InsightsDashboard />
      <Testimonials />
      <CTASection />
      <LoginModal />
    </>
  )
}
