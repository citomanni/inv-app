"use client"

import { useState } from "react";

const Form = () => {
     const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    smsOptIn: "receive",
    accreditedInvestor: "no",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };
  return (
<div className="bg-[#1C2D49] w-full md:min-w-[443px] rounded-xl font-bold px-8 py-[60px] text-white mt-[30px]">
              <h2 className="text-[34px] font-normal mb-11 text-center">
                GET STARTED
              </h2>

              <div className="space-y-6 px-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 justify-left">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2"
                    >
                      First<span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-1 rounded-xl bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2"
                    >
                      Last<span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-1 rounded-xl bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email<span className="text-red-500 text-lg">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-1 rounded-xl bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone<span className="text-red-500 text-lg">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center bg-white rounded-l-lg px-3">
                      🇳🇬
                      <span className="ml-2 text-gray-600">+234</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-1 rounded-r-xl w-full bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* SMS Options */}
                <div>
                  <p className="text-sm font-medium mb-3">
                    Opt in for SMS?
                    <span className="text-red-500 text-lg">*</span>
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smsOptIn"
                        value="receive"
                        checked={formData.smsOptIn === "receive"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        Receive information via SMS
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smsOptIn"
                        value="no-receive"
                        checked={formData.smsOptIn === "no-receive"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        Do not receive SMS Texts
                      </span>
                    </label>
                  </div>
                </div>

                {/* Accredited Investor */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Are you an Accredited Investor?
                    <span className="text-red-500 text-lg">*</span>
                  </p>
                  <p className="text-xs text-gray-300 mb-3">
                    (Have a net worth of over $1M excluding the value of your
                    home
                    <br />
                    OR earn more than $200K annually ($300K with spouse) for the
                    <br />
                    past two years.)
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accreditedInvestor"
                        value="no"
                        checked={formData.accreditedInvestor === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accreditedInvestor"
                        value="yes"
                        checked={formData.accreditedInvestor === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-[#316B1F] hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-8 mb-20"
                >
                  Get Information Now
                </button>
              </div>
            </div>  )
}

export default Form