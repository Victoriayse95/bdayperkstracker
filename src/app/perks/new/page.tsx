"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addPerk } from '../../../firebase/services';
import FirebaseDebugger from '../../../components/FirebaseDebugger';

export default function NewPerkPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    business: '',
    contact: '',
    category: '',
    startDate: '',
    expiry: '',
    redemptionPhone: '',
    redemptionEmail: '',
    status: 'To Redeem' as 'To Redeem' | 'Redeemed' | 'Expired',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Set a timeout to handle stuck loading state
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('The operation is taking longer than expected. Please check your Firebase connection and try again.');
        setShowDebugger(true);
      }
    }, 15000);

    try {
      console.log('Submitting form data:', formData);
      
      // Validate form
      const requiredFields = ['business', 'category', 'startDate', 'expiry'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          clearTimeout(loadingTimeout);
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      console.log('Form validation passed, attempting to save to Firestore');
      
      // Set a timeout for the Firebase operation
      const timeoutPromise = new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out. Please try again.')), 15000)
      );
      
      // Add to Firestore with timeout handling
      const addPerkPromise = addPerk(formData);
      
      const perkId = await Promise.race([addPerkPromise, timeoutPromise]);
      console.log('Perk added successfully with ID:', perkId);

      // Check if this is a mock ID (indicating Firebase is unavailable)
      const isMockId = perkId.toString().startsWith('mock-');
      
      if (isMockId) {
        clearTimeout(loadingTimeout);
        setLoading(false);
        setSuccess("Your perk has been saved locally. However, due to Firebase connection issues, it won't be persisted to the database. You can view it temporarily in the perks list.");
        setTimeout(() => {
          router.push('/perks');
        }, 3000);
      } else {
        // Regular successful save
        clearTimeout(loadingTimeout);
        setSuccess("Perk added successfully!");
        setTimeout(() => {
          router.push('/perks');
        }, 1000);
      }
    } catch (err) {
      clearTimeout(loadingTimeout);
      console.error('Detailed error in form submission:', err);
      
      // Show Firebase debugger if error occurs
      setShowDebugger(true);
      
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          setError('Operation timed out. The database might be unavailable. Try again later.');
        } else if (err.message.includes('permission-denied')) {
          setError('Permission denied. You may not have access to add perks.');
        } else if (err.message.includes('unavailable')) {
          setError('Firestore service is currently unavailable. Please try again later.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please check your connection and try again.');
      }
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Add New Perk</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link 
            href="/perks"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to List
          </Link>
        </div>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => setShowDebugger(!showDebugger)} 
                className="text-sm text-red-700 underline mt-1"
              >
                {showDebugger ? 'Hide Firebase Debugger' : 'Show Firebase Debugger'}
              </button>
            </div>
          </div>
        </div>
      )}

      {(showDebugger || error) && (
        <div className="mb-6">
          <FirebaseDebugger />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="business" className="block text-sm font-medium text-gray-700">
              Business Name*
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="business"
                id="business"
                value={formData.business}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="contact"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category*
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                <option value="Food & Dessert">Food & Dessert</option>
                <option value="Coffee & Drinks">Coffee & Drinks</option>
                <option value="Beauty">Beauty</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Retail">Retail</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date*
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
              Expiry Date*
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="expiry"
                id="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="redemptionPhone" className="block text-sm font-medium text-gray-700">
              Redemption Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                name="redemptionPhone"
                id="redemptionPhone"
                value={formData.redemptionPhone}
                onChange={handleChange}
                placeholder="800-123-4567"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="redemptionEmail" className="block text-sm font-medium text-gray-700">
              Redemption Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="redemptionEmail"
                id="redemptionEmail"
                value={formData.redemptionEmail}
                onChange={handleChange}
                placeholder="support@example.com"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-1">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="To Redeem">To Redeem</option>
                <option value="Redeemed">Redeemed</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              href="/perks"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 