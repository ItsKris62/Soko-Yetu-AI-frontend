export default function OverviewPanel() {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <p className="text-gray-600">
          Supplying quality farm produce directly to buyers through AI-driven marketplace insights.
        </p>
  
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold">Business Hours</p>
            <p>Mon - Sat: 8:00AM – 6:00PM</p>
          </div>
          <div>
            <p className="font-semibold">Payment Methods</p>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-1 bg-neutral-100 rounded text-xs">M-PESA</span>
              <span className="px-2 py-1 bg-neutral-100 rounded text-xs">Bank Transfer</span>
              <span className="px-2 py-1 bg-neutral-100 rounded text-xs">Cash</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  