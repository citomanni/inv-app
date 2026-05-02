"use client";

interface PerformanceMetric {
  metric: string;
  fundValue: string;
  target: string;
  isAboveTarget?: boolean;
  isBelowTarget?: boolean;
}

const performanceData: PerformanceMetric[] = [
  {
    metric: "Annualized Cash on Cash",
    fundValue: "4.27%",
    target: "6.00%",
    isBelowTarget: true,
  },
  {
    metric: "Estimated IRR",
    fundValue: "18.87%",
    target: "15.00%",
    isAboveTarget: true,
  },
  {
    metric: "Estimated Equity Multiple",
    fundValue: "1.68x",
    target: "2.50x",
    isBelowTarget: true,
  },
];

export function Performance() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-normal text-gray-700 mb-6">Performance</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Metric
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Cardone Equity Fund V, LLC*
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">{item.metric}</td>
                <td
                  className={`py-4 px-4 text-right font-medium ${
                    item.isAboveTarget
                      ? "text-green-600"
                      : item.isBelowTarget
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {item.fundValue}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  {item.target}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">*Last updated 09/26/22</p>
      </div>
    </div>
  );
}