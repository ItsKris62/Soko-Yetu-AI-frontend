export default function ProductShowcase() {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-8">Featured Products</h2>
          <p className="mb-6 text-gray-600">
            Discover high-quality agricultural products from verified farmers.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {['maize', 'tomatoes', 'avocados'].map((product, i) => (
              <div
                key={i}
                className="rounded border shadow-sm overflow-hidden bg-white"
              >
                <img
                  src={`https://res.cloudinary.com/your-cloud-name/image/upload/v1712345678/agriconnect/products/${product}.jpg`}
                  alt={product}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg capitalize">{product}</h4>
                  <p className="text-sm text-gray-600">Nakuru County</p>
                  <p className="text-sm text-green-700 font-semibold">AI Suggested: KSh 3,800</p>
                  <div className="mt-3 flex gap-2">
                    <button className="bg-secondary text-white px-4 py-2 rounded text-sm">Contact</button>
                    <button className="border px-4 py-2 rounded text-sm">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  