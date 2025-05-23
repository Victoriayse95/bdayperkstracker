"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPerks, Perk, samplePerks, updatePerk } from '../firebase/services';
import CalendarView from '../components/CalendarView';

export default function Home() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [currentDate] = useState(new Date());

  // Filter for current month perks that aren't expired and aren't redeemed
  const currentMonthPerks = perks.filter(perk => {
    const expiryDate = new Date(perk.expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if not expired (including today as not expired)
    const notExpired = expiryDate.getTime() >= today.getTime();
    
    // Check if not redeemed
    const notRedeemed = perk.status !== 'Redeemed';
    
    // Check if in current month
    const inCurrentMonth = expiryDate.getMonth() === currentDate.getMonth() && 
                          expiryDate.getFullYear() === currentDate.getFullYear();
                          
    return inCurrentMonth && notExpired && notRedeemed;
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
    
    // For same-day expiry, return 0 (expires today, not expired yet)
    if (expiryDate.getTime() === today.getTime()) {
      return 0;
    }
    
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status class based on perk status
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'To Redeem':
        return 'bg-green-100 text-green-800';
      case 'Redeemed':
        return 'bg-white text-gray-600';
      default:
        return 'bg-white text-gray-600';
    }
  };

  // Format date to readable string
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get expiry status text
  const getExpiryStatusText = (expiryDateStr: string): string => {
    const daysRemaining = getDaysRemaining(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiryDateStr);
    expiryDate.setHours(0, 0, 0, 0);
    
    // Check if today is the expiry date
    if (expiryDate.getTime() === today.getTime()) {
      return 'Expires today!';
    } else if (daysRemaining < 0) {
      return 'Expired';
    } else if (daysRemaining === 1) {
      return 'Expires tomorrow!';
    } else if (daysRemaining <= 7) {
      return `Expires in ${daysRemaining} days`;
    }
    return formatDate(expiryDateStr);
  };

  // Get expiry badge class based on days remaining
  const getExpiryBadgeClass = (daysRemaining: number): string => {
    if (daysRemaining <= 2) {
      return 'bg-red-100 text-red-800';
    } else if (daysRemaining <= 7) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  // Get row background class based on status and days remaining
  const getRowBackgroundClass = (status: string, daysRemaining: number): string => {
    if (status === 'To Redeem') {
      if (daysRemaining <= 2) {
        return 'bg-red-50';
      } else if (daysRemaining <= 7) {
        return 'bg-yellow-50';
      }
      return 'bg-green-50';
    } else if (status === 'Redeemed') {
      return '';
    }
    return '';
  };

  const getCurrentMonthName = (): string => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Mark perk as redeemed
  const handleMarkRedeemed = async (perkId: string) => {
    try {
      await updatePerk(perkId, { status: 'Redeemed' });
      // Update local state
      setPerks(currentPerks => 
        currentPerks.map(perk => 
          perk.id === perkId ? { ...perk, status: 'Redeemed' } : perk
        )
      );
    } catch (error) {
      console.error('Error updating perk status:', error);
    }
  };

  // Renew perk for next year
  const handleRenewPerk = async (perk: Perk) => {
    try {
      // Add one year to both the start date and expiry date
      const startDate = new Date(perk.startDate);
      startDate.setFullYear(startDate.getFullYear() + 1);
      const newStartDate = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      const expiryDate = new Date(perk.expiry);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const newExpiryDate = expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      // Reset status to 'To Redeem' and update dates
      await updatePerk(perk.id!, {
        startDate: newStartDate,
        expiry: newExpiryDate,
        status: 'To Redeem',
        notes: (perk.notes || '') + `\n(Renewed on ${new Date().toLocaleDateString('en-US')})`
      });

      // Update local state
      await fetchPerks();
    } catch (error) {
      console.error('Error renewing perk:', error);
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">{getCurrentMonthName()} Perks To Redeem</h1>
        <p className="mt-2 text-gray-600">
          Pending birthday perks that are still active and not yet redeemed
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
          <p className="text-blue-700">No active perks to redeem this month. Redeemed perks and expired perks are hidden from this view.</p>
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Redemption Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Redemption Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Redemption Link
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer min-w-[250px]">
                      Benefits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Expiry Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                      Status
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
                    const daysRemaining = getDaysRemaining(perk.expiry);
                    const statusClass = getStatusClass(perk.status);
                    const expiryBadgeClass = getExpiryBadgeClass(daysRemaining);
                    const rowBackgroundClass = getRowBackgroundClass(perk.status, daysRemaining);
                    
                    return (
                    <tr key={perk.id} className={rowBackgroundClass}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {perk.business}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perk.redemptionPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perk.redemptionEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perk.redemptionLink ? (
                          <a href={perk.redemptionLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            {perk.redemptionLink.length > 25 ? `${perk.redemptionLink.substring(0, 25)}...` : perk.redemptionLink}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 min-w-[250px] break-words">
                        {perk.benefits || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(perk.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(perk.expiry)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                            {perk.status}
                          </span>
                          <span className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${expiryBadgeClass}`}>
                            {getExpiryStatusText(perk.expiry)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 break-words min-w-[200px]">
                        {perk.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative group">
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded inline-flex items-center">
                            <span>Actions</span>
                            <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-lg z-10 hidden group-hover:block">
                            <div className="py-1 border-b">
                              <button
                                onClick={() => handleMarkRedeemed(perk.id!)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                              >
                                Mark Redeemed
                              </button>
                              <button
                                onClick={() => handleRenewPerk(perk)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                              >
                                Renew for Next Year
                              </button>
                            </div>
                            <div className="py-1">
                              <Link 
                                href={`/perks/${perk.id}/edit`}
                                className="block px-4 py-2 text-sm text-indigo-700 hover:bg-gray-100 hover:text-indigo-900 w-full text-left"
                              >
                                Edit
                              </Link>
                              <Link 
                                href={`/perks/${perk.id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
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
      
      {/* Calendar View */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perk Calendar</h2>
        <CalendarView perks={perks} />
      </div>
    </div>
  );
}
