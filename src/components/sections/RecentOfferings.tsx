"use client";

interface Offering {
  id: string;
  title: string;
  image: string;
  fundedDate: string;
  targetIRR: string;
  targetCashOnCash: string;
  targetEquityMultiple: string;
}

const offerings: Offering[] = [
  {
    id: "1",
    title: "Cardone Equity Fund 20, LLC",
    image: "/placeholder-property-1.jpg",
    fundedDate: "04/15/22",
    targetIRR: "15.00%",
    targetCashOnCash: "6.00%",
    targetEquityMultiple: "2.50x",
  },
  {
    id: "2",
    title: "Cardone Equity Fund XVII, LLC",
    image: "/placeholder-property-2.jpg",
    fundedDate: "03/01/22",
    targetIRR: "15.00%",
    targetCashOnCash: "6.00%",
    targetEquityMultiple: "2.50x",
  },
  {
    id: "3",
    title: "Cardone Equity Fund XVIII, LLC",
    image: "/placeholder-property-3.jpg",
    fundedDate: "03/01/22",
    targetIRR: "23.00%",
    targetCashOnCash: "6.00%",
    targetEquityMultiple: "4.50x",
  },
];

export function RecentOfferings() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-normal text-gray-700 mb-6">
        Recent Offerings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings.map((offering) => (
          <div
            key={offering.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg text-center text-gray-700 font-normal mb-4">
                {offering.title}
              </h3>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Funded on</span>
                  <span className="text-gray-700">{offering.fundedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Investor IRR</span>
                  <span className="text-gray-700">{offering.targetIRR}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Cash on Cash</span>
                  <span className="text-gray-700">
                    {offering.targetCashOnCash}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Equity Multiple</span>
                  <span className="text-gray-700">
                    {offering.targetEquityMultiple}
                  </span>
                </div>
              </div>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded transition-colors text-sm">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}