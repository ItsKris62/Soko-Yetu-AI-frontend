import React from 'react'
import { FaCalendarAlt, FaCloudRain, FaThermometerHalf } from 'react-icons/fa'

interface SeasonalForecastData {
  planting_season: string
  rainfall_prediction: string
  temperature_trend: string
}

interface SeasonalForecastPanelProps {
  data?: SeasonalForecastData
}

/**
 * Displays seasonal forecast details from weather API.
 */
export default function SeasonalForecastPanel({ data }: SeasonalForecastPanelProps) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Seasonal Forecast</h3>
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-2xl" />
            <div>
              <p className="font-semibold">Planting Season</p>
              <p className="text-gray-600">{data.planting_season}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaCloudRain className="text-2xl" />
            <div>
              <p className="font-semibold">Rainfall Prediction</p>
              <p className="text-gray-600">{data.rainfall_prediction}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaThermometerHalf className="text-2xl" />
            <div>
              <p className="font-semibold">Temperature Trend</p>
              <p className="text-gray-600">{data.temperature_trend}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

