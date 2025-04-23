"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPerks, Perk, samplePerks } from '../firebase/services';

export default function Home() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [currentDate] = useState(new Date());

  // Filter for current month perks
  const currentMonthPerks = perks.filter(perk => {
    const expiryDate = new Date(perk.expiry);
    return expiryDate.getMonth() === currentDate.getMonth() && 
           expiryDate.getFullYear() === currentDate.getFullYear();
  });

  const fetchPerks = async () => {
    try {
      setLoading(true);
      
      // Create a timeout to fallback to sample data if fetching takes too long
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('Fetch taking too long, using sample data as fallback');
          setPerks(samplePerks);
          setUsingSample(true);
          setLoading(false);
        }
      }, 5000);
      
      const fetchedPerks = await getAllPerks();
      
      // Clear timeout if we got the data in time
      clearTimeout(timeoutId);
      
      setPerks(fetchedPerks);
      setError(null);
      
      // Check if we're using sample data (as defined in services.ts)
      if (fetchedPerks.some(perk => perk.id && perk.id.toString().startsWith('mock-'))) {
        setUsingSample(true);
      }
    } catch (err) {
      console.error('Error fetching perks:', err);
      setError('Failed to load perks. Using sample data for display.');
      setPerks(samplePerks);
      setUsingSample(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerks();
  }, []);

  // Calculate days remaining until expiry
  const getDaysRemaining = (expiryDateStr: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiryDateStr);
    expiryDate.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status class based on days remaining
  const getExpiryStatusClass = (expiryDateStr: string): string => {
    const daysRemaining = getDaysRemaining(expiryDateStr);
    
    if (daysRemaining <= 0) {
      return 'bg-red-100 text-red-800'; // Expired
    } else if (daysRemaining <= 7) {
      return 'bg-yellow-100 text-yellow-800'; // Expiring soon
    }
    return 'bg-blue-100 text-blue-800'; // Normal
  };

  // Format date to readable string
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get expiry status text
  const getExpiryStatusText = (expiryDateStr: string): string => {
    const daysRemaining = getDaysRemaining(expiryDateStr);
    
    if (daysRemaining <= 0) {
      return 'Expired';
    } else if (daysRemaining === 1) {
      return 'Expires tomorrow!';
    } else if (daysRemaining <= 7) {
      return `Expires in ${daysRemaining} days`;
    }
    return formatDate(expiryDateStr);
  };

  const getCurrentMonthName = (): string => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">{getCurrentMonthName()} Perks</h1>
        <p className="mt-2 text-gray-600">
          Birthday perks expiring this month
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading perks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md my-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : usingSample ? (
        <div className="bg-yellow-50 p-4 rounded-md my-4">
          <p className="text-yellow-700">
            <strong>Note:</strong> Using sample demonstration data. Firebase connection might be unavailable. 
            Your changes will appear temporarily but won't be permanently saved.
          </p>
        </div>
      ) : null}

      {currentMonthPerks.length === 0 && !loading ? (
        <div className="bg-blue-50 p-4 rounded-md my-4">
          <p className="text-blue-700">No perks expiring this month. Check back later or add new perks!</p>
          <Link
            href="/perks/new"
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Perk
          </Link>
        </div>
      ) : null}

      {currentMonthPerks.length > 0 && (
        <>
          <div className="overflow-x-auto w-full border border-gray-200 sm:rounded-lg shadow">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      <span>Business Name</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer min-w-[250px]">
                      Benefits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Expiry Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMonthPerks.map((perk) => {
                    const expiryStatusClass = getExpiryStatusClass(perk.expiry);
                    const daysRemaining = getDaysRemaining(perk.expiry);
                    
                    return (
                    <tr key={perk.id} className={daysRemaining <= 7 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {perk.business}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 min-w-[250px] break-words">
                        {perk.benefits || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(perk.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${expiryStatusClass}`}>
                          {getExpiryStatusText(perk.expiry)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 break-words min-w-[200px]">
                        {perk.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/perks/${perk.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link
              href="/perks"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Perks
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
