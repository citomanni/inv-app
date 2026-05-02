"use client";

interface AssetDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  propertyClass: string;
  units: number;
  squareFeet: number;
  stories: number;
  parkingSpaces: number;
  yearBuilt: number;
  acquired: string;
  description: string;
  images: string[];
}

const asset: AssetDetail = {
  id: "1",
  name: "10X Living at Breakfast Point",
  address: "9700 Panama City Beach Parkway",
  city: "Panama City Beach",
  state: "FL",
  zipCode: "32407",
  propertyType: "Multi-Family",
  propertyClass: "A",
  units: 360,
  squareFeet: 365472,
  stories: 3,
  parkingSpaces: 605,
  yearBuilt: 2007,
  acquired: "08/30/19",
  description:
    "10X Living at Breakfast Point is a 360-unit garden-style apartment community located in the heart of Panama City Beach, Florida. The property is within minutes of TripAdvisor's #3 ranked beach and 1.2 million square feet of upscale retail, golf courses and community attractions. The community has strong demand drivers including 4,100 jobs provided by the Tyndall Air Force Base and Naval Sea Systems. The property's amenities include a resort style swimming pool, fitness center, clubhouse, and business center.",
  images: ["/placeholder-breakfast-point.jpg"],
};

export function AssetDetails() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Property Image */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="relative h-48 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <svg
                className="w-20 h-20"
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
        </div>

        {/* Property Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-normal text-gray-700 mb-2">
            {asset.name}
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-600">
              {asset.address}, {asset.city}, {asset.state} {asset.zipCode}
            </p>
            <button className="text-red-500 hover:text-red-600 text-sm">
              📍 Map
            </button>
          </div>

          {/* Property Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                Property Type
              </div>
              <div className="text-gray-700 font-medium">
                {asset.propertyType}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                Property Class
              </div>
              <div className="text-gray-700 font-medium">
                {asset.propertyClass}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Units</div>
              <div className="text-gray-700 font-medium">{asset.units}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                Square Feet
              </div>
              <div className="text-gray-700 font-medium">
                {asset.squareFeet.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                Stories
              </div>
              <div className="text-gray-700 font-medium">{asset.stories}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                Parking Spaces
              </div>
              <div className="text-gray-700 font-medium">
                {asset.parkingSpaces}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                Year Built
              </div>
              <div className="text-gray-700 font-medium">{asset.yearBuilt}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase mb-1">Acquired</div>
            <div className="text-gray-700 font-medium">{asset.acquired}</div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm">
            {asset.description}
          </p>
        </div>
      </div>
    </div>
  );
}