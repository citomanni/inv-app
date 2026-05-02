"use client";

interface PropertyDetail {
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
  photoCount?: number;
}

const properties: PropertyDetail[] = [
  {
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
  },
  {
    id: "2",
    name: "10X Living at Delray",
    address: "14050 Pacific Point Place",
    city: "Delray Beach",
    state: "FL",
    zipCode: "33484",
    propertyType: "Multi-Family",
    propertyClass: "A",
    units: 346,
    squareFeet: 362000,
    stories: 3,
    parkingSpaces: 779,
    yearBuilt: 2017,
    acquired: "09/27/18",
    description:
      "10X Living at Delray is a 346-unit, garden-style apartment community located west of Delray Beach, Florida's Atlantic Avenue, a desirable destination which has 140+ restaurants and 130+ retail shops. The property is located on 31 acres and surrounded by a 3.5-acre lake and multiple parks. The property's resort-like amenities include a movie theater, pet park, swimming pool, and fitness center.",
    photoCount: 4,
  },
  {
    id: "3",
    name: "10X Living at Sawgrass",
    address: "2903 NW 130th Avenue",
    city: "Sunrise",
    state: "FL",
    zipCode: "33323",
    propertyType: "Multi-Family",
    propertyClass: "A",
    units: 501,
    squareFeet: 495246,
    stories: 4,
    parkingSpaces: 890,
    yearBuilt: 2013,
    acquired: "06/27/19",
    description:
      "10X Living at Sawgrass is a 501-unit, garden- and mid-rise apartment community located in Sunrise, Florida. The property is less than two miles from the 612-acre Sawgrass International Corporate Park and is within walking distance to the 2.3 million square foot Sawgrass Mills Mall. The property's amenities include a playground, state of the art fitness center, a resort style swimming pool, clubhouse, and business center.",
    photoCount: 3,
  },
];

export function TenXLiving() {
  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
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
              {property.photoCount && (
                <button className="text-blue-600 text-sm mt-2 hover:underline">
                  {property.photoCount} photos
                </button>
              )}
            </div>

            {/* Property Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-normal text-gray-700 mb-2">
                {property.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-gray-600">
                  {property.address}, {property.city}, {property.state}{" "}
                  {property.zipCode}
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
                    {property.propertyType}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    Property Class
                  </div>
                  <div className="text-gray-700 font-medium">
                    {property.propertyClass}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    Units
                  </div>
                  <div className="text-gray-700 font-medium">
                    {property.units}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    Square Feet
                  </div>
                  <div className="text-gray-700 font-medium">
                    {property.squareFeet.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    Stories
                  </div>
                  <div className="text-gray-700 font-medium">
                    {property.stories}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    Parking Spaces
                  </div>
                  <div className="text-gray-700 font-medium">
                    {property.parkingSpaces}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    Year Built
                  </div>
                  <div className="text-gray-700 font-medium">
                    {property.yearBuilt}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Acquired
                </div>
                <div className="text-gray-700 font-medium">
                  {property.acquired}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm">
                {property.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}