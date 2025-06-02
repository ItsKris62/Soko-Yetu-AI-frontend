'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchInsightsPreview } from '@/utils/api';
import { InsightsPreviewData } from '@/types/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InsightsPreview() {
  const [insights, setInsights] = useState<InsightsPreviewData | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await fetchInsightsPreview();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
        // Optionally, set a default value or show an error message
      }
    };
    loadInsights();
  }, []);

  if (!insights) {
    return (
      <div className="py-16 px-6 bg-gradient-to-br from-[#FFEBD0] to-[#FFE4B5]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#278783] border-t-transparent"></div>
          </div>
          <p className="text-lg text-gray-700 font-medium">Loading market insights...</p>
        </div>
      </div>
    );
  }

  // Price Trends Chart Data
  const priceTrendsData = {
    labels: insights.priceTrends?.map((trend) => trend.date) ?? [],
    datasets: [
      {
        label: 'Price (KSH)',
        data: insights.priceTrends?.map((trend) => trend.price) ?? [],
        borderColor: '#278783',
        backgroundColor: 'rgba(39, 135, 131, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#278783',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        title: { display: true, text: 'Date', font: { size: 12, weight: 'bold' } },
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: { 
        title: { display: true, text: 'Price (KSH)', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      },
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#278783',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#278783',
      }
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-[#FFEBD0] via-[#FFE8C7] to-[#FFE4B5] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#278783] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF6B35] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#278783] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#278783] to-[#1f6b67] rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4 slide-up">
            AI-Powered Market Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto slide-up leading-relaxed">
            Get a comprehensive overview of market trends, demand patterns, quality metrics, and regional supply dynamics.
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Price Trends Graph */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#278783] to-[#1f6b67] rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Price Trends</h3>
            </div>
            <div className="h-56 relative">
              <Line data={priceTrendsData} options={chartOptions} />
            </div>
          </div>

          {/* Market Demand Indicators */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#e55a2b] rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Market Demand</h3>
            </div>
            <div className="space-y-5">
              {insights.marketDemands?.map((demand, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {demand.product_name}
                    </span>
                    <span className="text-sm font-bold text-[#278783] bg-[#278783]/10 px-2 py-1 rounded-full">
                      {demand.demand_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#278783] to-[#1f6b67] h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${demand.demand_score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Assessment Metrics */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Quality Assessment</h3>
            </div>
            <div className="space-y-5">
              {insights.qualityMetrics?.map((metric, index) => (
                <div key={index} className="group p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      {metric.product_name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-600 bg-white px-2 py-1 rounded-full">
                        {metric.quality_grade}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Supply/Demand Map */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Regional Supply/Demand</h3>
            </div>
            <div className="space-y-5">
              {insights.regionalData?.map((region, index) => (
                <div key={index} className="group p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-800 mb-3 group-hover:text-gray-900">
                    {region.county_name}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#278783] rounded-full mr-2"></div>
                      <span className="text-gray-600">Supply: <span className="font-semibold text-gray-800">{region.supply} tons</span></span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#FF6B35] rounded-full mr-2"></div>
                      <span className="text-gray-600">Demand: <span className="font-semibold text-gray-800">{region.demand} tons</span></span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#278783] to-[#1f6b67] h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(region.supply / (region.supply + region.demand)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Supply Ratio: {Math.round((region.supply / (region.supply + region.demand)) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/ai-insights">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-[#278783] to-[#1f6b67] text-white font-semibold rounded-2xl hover:from-[#1f6b67] hover:to-[#278783] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#278783]/30">
              <span className="relative z-10 flex items-center">
                View Full Insights
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}