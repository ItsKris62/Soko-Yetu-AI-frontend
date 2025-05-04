'use client';

import { Product } from '../../types/product';

interface MapViewProps {
  products: Product[];
}

export default function MapView({ products }: MapViewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-64">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Locations</h3>
      <p className="text-gray-600">
        Map view placeholder - Showing {products.length} products on the map.
      </p>
      {/* Integrate Leaflet here */}
    </div>
  );
}