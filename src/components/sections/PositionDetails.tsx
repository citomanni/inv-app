"use client";

interface Position {
  investingEntity: string;
  contributed: number;
  distributed: number;
}

const positions: Position[] = [
  {
    investingEntity: "Oasis Capital LLC",
    contributed: 5000.0,
    distributed: 801.1,
  },
];

export function PositionDetails() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-normal text-gray-700 mb-6">
        Position Details
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Investing Entity ⇅
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Contributed ⇅
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Distributed ⇅
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">
                  {position.investingEntity}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  ${position.contributed.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  ${position.distributed.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}