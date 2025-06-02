"use client";

import { 
  FaChartLine, 
  FaStar, 
  FaMapMarkerAlt, 
  FaChartBar, 
  FaComments, 
  FaHistory  
} from 'react-icons/fa';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => (
  <div 
    className="group relative p-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500"></div>
    
    {/* Icon container with animated background */}
    <div className="relative mb-6 flex justify-center">
      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-150"></div>
        <Icon className="relative text-5xl text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>
    </div>
    
    {/* Content */}
    <div className="relative text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
        {description}
      </p>
    </div>
    
    {/* Animated border effect */}
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
  </div>
);

const Features = () => (
  <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/4 rounded-full blur-2xl"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">Platform Features</span>
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-6">
          Revolutionizing Agricultural Trade
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Our AI-powered platform provides comprehensive tools and insights to help farmers maximize profits 
            and enable buyers to source quality produce efficiently through intelligent automation.
          </p>
          
          {/* Stats indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-500">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500">Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-500">Smart Matching</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        <FeatureCard
          icon={FaChartLine}
          title="AI Price Insights"
          description="Get real-time price recommendations powered by machine learning algorithms that analyze market trends, seasonal patterns, and demand forecasts."
          delay={0}
        />
        <FeatureCard
          icon={FaStar}
          title="Quality Assessment"
          description="Advanced AI-powered quality ratings using computer vision and data analytics to help buyers make informed purchasing decisions."
          delay={100}
        />
        <FeatureCard
          icon={FaMapMarkerAlt}
          title="Geolocation Matching"
          description="Smart proximity-based matching system that connects buyers and sellers in optimal locations to minimize logistics costs and delivery times."
          delay={200}
        />
        <FeatureCard
          icon={FaChartBar} 
          title="Market Analysis" 
          description="Access comprehensive market intelligence with detailed analytics, trend forecasting, and strategic insights to optimize your trading decisions."
          delay={300}
        />
        <FeatureCard
          icon={FaComments} 
          title="Direct Messaging" 
          description="Secure, integrated communication platform enabling direct negotiations and relationship building between trading partners without intermediaries."
          delay={400}
        />
        <FeatureCard
          icon={FaHistory}
          title="Transaction History" 
          description="Complete transaction tracking and reputation management system that builds trust and credibility within the trading community."
          delay={500}
        />
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-20 text-center">
        <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/10">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Join thousands of farmers and buyers</p>
            <p className="text-xs text-gray-600">Already transforming agricultural trade with our platform</p>
          </div>
        </div>
      </div>
    </div>

    {/* Floating elements for visual interest */}
    <div className="absolute top-1/4 right-10 w-4 h-4 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
    <div className="absolute bottom-1/4 left-20 w-3 h-3 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary/25 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
  </section>
);

export default Features;