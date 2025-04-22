"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function NewRedemptionPage() {
  const [formData, setFormData] = useState({
    redemptionMonth: '',
    redemptionDateFrom: '',
    redemptionDateTo: '',
    redemptionName: '',
    redemptionPerks: '',
    contactNumber: '',
    emailAddress: '',
    redemptionTerms: '',
    redemptionLink: '',
    signUpLink: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to Firebase
    console.log('Form submitted:', formData);
    alert('Redemption added successfully!');
    // Reset form or redirect
    setFormData({
      redemptionMonth: '',
      redemptionDateFrom: '',
      redemptionDateTo: '',
      redemptionName: '',
      redemptionPerks: '',
      contactNumber: '',
      emailAddress: '',
      redemptionTerms: '',
      redemptionLink: '',
      signUpLink: '',
      notes: ''
    });
  };

  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Redemption</h1>
        <p className="mt-2 text-gray-600">
          Enter details about a new birthday perk redemption
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Redemption Details */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Redemption Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="redemptionMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Redemption Month <span className="text-red-500">*</span>
                </label>
                <select
                  name="redemptionMonth"
                  id="redemptionMonth"
                  value={formData.redemptionMonth}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="redemptionDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  Redemption Date (From) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="redemptionDateFrom"
                  id="redemptionDateFrom"
                  value={formData.redemptionDateFrom}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="redemptionDateTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Redemption Date (To) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="redemptionDateTo"
                  id="redemptionDateTo"
                  value={formData.redemptionDateTo}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="redemptionName" className="block text-sm font-medium text-gray-700 mb-1">
                  Redemption Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="redemptionName"
                  id="redemptionName"
                  value={formData.redemptionName}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g. Starbucks Birthday Drink"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="redemptionPerks" className="block text-sm font-medium text-gray-700 mb-1">
                  Redemption Perks <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="redemptionPerks"
                  id="redemptionPerks"
                  value={formData.redemptionPerks}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g. Free drink of your choice"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g. 555-123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  id="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g. contact@company.com"
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Additional Information</h2>
            
            <div className="mb-6">
              <label htmlFor="redemptionTerms" className="block text-sm font-medium text-gray-700 mb-1">
                Redemption Terms
              </label>
              <textarea
                name="redemptionTerms"
                id="redemptionTerms"
                rows={3}
                value={formData.redemptionTerms}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter details about terms and conditions for this redemption"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="redemptionLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Redemption Link
                </label>
                <input
                  type="url"
                  name="redemptionLink"
                  id="redemptionLink"
                  value={formData.redemptionLink}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g. https://example.com/redeem"
                />
              </div>
              
              <div>
                <label htmlFor="signUpLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Sign-Up Link
                </label>
                <input
                  type="url"
                  name="signUpLink"
                  id="signUpLink"
                  value={formData.signUpLink}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g. https://example.com/signup"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter any additional notes or special instructions"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/redemptions"
              className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Redemption
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 