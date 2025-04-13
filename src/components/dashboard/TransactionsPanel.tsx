export default function TransactionsPanel({ transactions }: { transactions: any[] }) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ul className="space-y-4">
          {transactions.map((tx, i) => (
            <li key={i} className="flex justify-between">
              <div>
                <p className="font-medium">{tx.produce_type}</p>
                <p className="text-xs text-gray-500">{new Date(tx.ordered_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-700">KES {tx.total_price.toLocaleString()}</p>
                <span className={`text-xs ${tx.status === 'completed' ? 'text-green-600' : 'text-yellow-500'}`}>{tx.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  