interface UserStatsProps {
    totalProducts: number;
    completedTransactions: number;
    averageRating: number;
  }
  
  export default function UserStats({ totalProducts, completedTransactions, averageRating }: UserStatsProps) {
    return (
      <div className="flex gap-6 mt-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{totalProducts}</p>
          <p className="text-sm text-gray-600">Products Listed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{completedTransactions}</p>
          <p className="text-sm text-gray-600">Completed Transactions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{averageRating.toFixed(1)}</p>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>
      </div>
    );
  }