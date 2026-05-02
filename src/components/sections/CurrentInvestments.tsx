"use client";

interface Investment {
  fund: string;
  dateInvested: string;
  contributed: number;
  currentValue: number;
  totalDistributions: number;
  totalReturn: number;
  annualizedReturn: string;
}

const investments: Investment[] = [
  {
    fund: "Cardone Equity Fund V, LLC",
    dateInvested: "08/30/19",
    contributed: 5000.0,
    currentValue: 8401.1,
    totalDistributions: 801.1,
    totalReturn: 3401.1,
    annualizedReturn: "18.87%",
  },
  // Add more investments as needed
];

export function CurrentInvestments() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-normal text-gray-700 mb-6">
        Current Investments
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Fund
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Date Invested
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Contributed
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Current Value
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Total Distributions
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Total Return
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Annualized Return
              </th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:underline text-left">
                    {investment.fund}
                  </button>
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {investment.dateInvested}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  ${investment.contributed.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  ${investment.currentValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  ${investment.totalDistributions.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-right text-green-600 font-medium">
                  ${investment.totalReturn.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  {investment.annualizedReturn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}