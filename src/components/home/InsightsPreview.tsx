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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function InsightsPreview() {
  const [insights, setInsights] = useState<InsightsPreviewData | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      const data = await fetchInsightsPreview();
      setInsights(data);
    };
    loadInsights();
  }, []);

  if (!insights) {
    return <div className="py-12 px-6 text-center text-gray-600">Loading insights...</div>;
  }

  // Price Trends Chart Data
  const priceTrendsData = {
    labels: insights.priceTrends.map((trend) => trend.date),
    datasets: [
      {
        label: 'Price (KSH)',
        data: insights.priceTrends.map((trend) => trend.price),
        borderColor: '#278783',
        backgroundColor: 'rgba(39, 135, 131, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price (KSH)' } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <section className="py-12 px-6 bg-[#FFEBD0]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 slide-up">AI-Powered Market Insights</h2>
        <p className="text-lg text-gray-600 mb-8 slide-up">
          Get a quick overview of market trends, demand, quality, and regional supply/demand.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Price Trends Graph */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Trends</h3>
            <div className="h-48">
              <Line data={priceTrendsData} options={chartOptions} />
            </div>
          </div>

          {/* Market Demand Indicators */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Demand</h3>
            <ul className="space-y-3">
              {insights.marketDemands.map((demand, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{demand.product_name}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#278783] h-2.5 rounded-full"
                      style={{ width: `${demand.demand_score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{demand.demand_score}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Assessment Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Assessment</h3>
            <ul className="space-y-3">
              {insights.qualityMetrics.map((metric, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{metric.product_name}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★★★★★</span>
                    <span className="text-sm text-gray-600">{metric.quality_grade}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Supply/Demand Map */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Supply/Demand</h3>
            <ul className="space-y-3">
              {insights.regionalData.map((region, index) => (
                <li key={index} className="text-gray-600">
                  <span className="font-medium">{region.county_name}</span>
                  <div className="flex justify-between mt-1">
                    <span>Supply: {region.supply} tons</span>
                    <span>Demand: {region.demand} tons</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-[#278783] h-2.5 rounded-full"
                      style={{ width: `${(region.supply / (region.supply + region.demand)) * 100}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/ai-insights">
            <button className="px-6 py-3 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors">
              View Full Insights
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}