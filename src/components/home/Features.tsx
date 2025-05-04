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
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center">
    <Icon className="text-4xl mb-4 text-primary mx-auto" />
    <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const Features = () => (
  <section className="py-16 bg-gray-100">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
      Revolutionizing Agricultural Trade
    </h2>
    <p className="text-center text-gray-600 mb-12">
      Our AI-powered platform provides tools and insights to help farmers maximize profits and buyers source quality produce efficiently.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
      <FeatureCard
        icon={FaChartLine}
        title="AI Price Insights"
        description="Get real-time price recommendations based on market trends and demand."
      />
      <FeatureCard
        icon={FaStar}
        title="Quality Assessment"
        description="AI-powered quality ratings to help buyers make informed decisions."
      />
      <FeatureCard
        icon={FaMapMarkerAlt}
        title="Geolocation Matching"
        description="Connect with buyers and sellers in your vicinity for reduced logistics costs."
      /> 
      {/* --- Second Row --- */}
      <FeatureCard
        icon={FaChartBar} 
        title="Market Analysis" 
        description="Access comprehensive market data and trends to optimize your trading strategy." 
      />
      <FeatureCard
        icon={FaComments} 
        title="Direct Messaging" 
        description="Communicate directly with trading partners without intermediaries."
      />
      <FeatureCard
        icon={FaHistory}
        title="Transaction History" 
        description="Track all your past trades and build a trusted reputation on the platform." 
      />
    </div>
  </section>
);

export default Features;