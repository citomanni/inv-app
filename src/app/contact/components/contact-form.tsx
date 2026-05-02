'use client';

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobilePhone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }

    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = 'Mobile Phone Number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful submission
      console.log('Form submitted:', formData);
      alert('Thank you! Your message has been sent successfully.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        mobilePhone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        We&apos;d Love to Hear From You
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Row - First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.firstName 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
              placeholder=""
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.lastName 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
              placeholder=""
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Second Row - Mobile Phone and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="mobilePhone"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.mobilePhone 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
              placeholder=""
            />
            {errors.mobilePhone && (
              <p className="mt-1 text-sm text-red-600">{errors.mobilePhone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border  shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.email 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
              placeholder=""
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message<span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full px-4 py-0 border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
              errors.message 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-gray-50'
            }`}
            placeholder=""
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-2 bg-[#172E4E] text-white font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'SUBMIT'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}