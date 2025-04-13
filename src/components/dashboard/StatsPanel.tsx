export default function StatsPanel({ stats }: { stats: any }) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex justify-between"><span>Products Listed</span><span className="font-medium">{stats?.products || 0}</span></li>
          <li className="flex justify-between"><span>Completed Transactions</span><span className="font-medium">{stats?.completed || 0}</span></li>
          <li className="flex justify-between"><span>Rating</span><span className="font-medium">{stats?.rating || 4.8}</span></li>
          <li className="flex justify-between"><span>Response Rate</span><span className="font-medium">{stats?.response_rate || 95}%</span></li>
          <li className="flex justify-between"><span>Delivery Reliability</span><span className="font-medium">{stats?.delivery_rate || 98}%</span></li>
        </ul>
      </div>
    )
  }
  