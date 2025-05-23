"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPerkById, updatePerk } from '../../../firebase/services';
import FirebaseDebugger from '../../../components/FirebaseDebugger';

export default function PerkDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [perk, setPerk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  // Load perk data
  useEffect(() => {
    const fetchPerk = async () => {
      try {
        setLoading(true);
        const fetchedPerk = await getPerkById(id);
        
        if (!fetchedPerk) {
          setError("Perk not found");
          return;
        }
        
        setPerk(fetchedPerk);
      } catch (err) {
        console.error('Error fetching perk:', err);
        setError('Failed to load perk data');
        setShowDebugger(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPerk();
  }, [id]);

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

  // Format date to readable string
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'To Redeem':
        return 'bg-green-100 text-green-800';
      case 'Redeemed':
        return 'bg-white text-gray-600';
      case 'Expired':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-white text-gray-600';
    }
  };

  // Determine if perk is expiring soon (within 7 days)
  const isExpiringWithinDays = (days = 7) => {
    if (!perk || !perk.expiry) return false;
    
    const daysRemaining = getDaysRemaining(perk.expiry);
    return perk.status === 'To Redeem' && daysRemaining > 0 && daysRemaining <= days;
  };

  // Get expiry warning message and style
  const getExpiryWarning = () => {
    if (!perk || !perk.expiry) return null;
    
    const daysRemaining = getDaysRemaining(perk.expiry);
    
    if (daysRemaining <= 0) {
      return {
        message: `This perk expired on ${formatDate(perk.expiry)}.`,
        className: 'bg-red-50 border-l-4 border-red-400',
        iconClassName: 'text-red-400',
        textClassName: 'text-red-700',
        icon: (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (daysRemaining <= 7) {
      const urgencyLevel = daysRemaining <= 2 ? 'red' : 'yellow';
      return {
        message: `Expiring in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} on ${formatDate(perk.expiry)}.`,
        className: urgencyLevel === 'red' ? 'bg-red-50 border-l-4 border-red-400' : 'bg-yellow-50 border-l-4 border-yellow-400',
        iconClassName: urgencyLevel === 'red' ? 'text-red-400' : 'text-yellow-400',
        textClassName: urgencyLevel === 'red' ? 'text-red-700' : 'text-yellow-700',
        icon: (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      };
    }
    
    return null;
  };

  // Handle status change
  const handleStatusChange = async (newStatus: 'To Redeem' | 'Redeemed') => {
    if (!perk || newStatus === perk.status) return;
    
    try {
      setUpdatingStatus(true);
      await updatePerk(id, { status: newStatus });
      
      // Update local state
      setPerk({
        ...perk,
        status: newStatus
      });
      
      // Show success message
      setStatusUpdateSuccess(true);
      setTimeout(() => setStatusUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating perk status:', err);
      setError('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Check if perk has expired
  const isExpired = () => {
    if (!perk || !perk.expiry) return false;
    return getDaysRemaining(perk.expiry) <= 0;
  };
  
  // Get expiry comment based on days remaining
  const getExpiryComment = () => {
    if (!perk || !perk.expiry) return null;
    
    const daysRemaining = getDaysRemaining(perk.expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(perk.expiry);
    expiryDate.setHours(0, 0, 0, 0);
    
    if (expiryDate.getTime() === today.getTime()) {
      // Expires today
      return {
        message: `This perk expires today (${formatDate(perk.expiry)}).`,
        className: 'bg-yellow-50 border-l-4 border-yellow-400',
        iconClassName: 'text-yellow-400',
        textClassName: 'text-yellow-700',
        icon: (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (daysRemaining < 0) {
      // Already expired
      return {
        message: `This perk expired on ${formatDate(perk.expiry)}.`,
        className: 'bg-red-50 border-l-4 border-red-400',
        iconClassName: 'text-red-400',
        textClassName: 'text-red-700',
        icon: (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (daysRemaining <= 7) {
      const urgencyLevel = daysRemaining <= 2 ? 'red' : 'yellow';
      let message = '';
      
      if (daysRemaining === 1) {
        message = `Expiring tomorrow (${formatDate(perk.expiry)}).`;
      } else {
        message = `Expiring in ${daysRemaining} days on ${formatDate(perk.expiry)}.`;
      }
      
      return {
        message,
        className: urgencyLevel === 'red' ? 'bg-red-50 border-l-4 border-red-400' : 'bg-yellow-50 border-l-4 border-yellow-400',
        iconClassName: urgencyLevel === 'red' ? 'text-red-400' : 'text-yellow-400',
        textClassName: urgencyLevel === 'red' ? 'text-red-700' : 'text-yellow-700',
        icon: (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      };
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading perk details...</span>
        </div>
      </div>
    );
  }

  if (error || !perk) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error || 'Perk not found'}</p>
          <button 
            onClick={() => setShowDebugger(!showDebugger)} 
            className="text-sm text-red-700 underline mt-1"
          >
            {showDebugger ? 'Hide Firebase Debugger' : 'Show Firebase Debugger'}
          </button>
          {showDebugger && (
            <div className="mt-4">
              <FirebaseDebugger />
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link
            href="/perks"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Perks List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {statusUpdateSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Perk status updated successfully.</span>
        </div>
      )}
      
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{perk.business}</h1>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
          <Link 
            href="/perks"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to List
          </Link>
          <Link 
            href={`/perks/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </Link>
        </div>
      </div>

      {perk.status === 'To Redeem' && getExpiryComment() && (
        <div className={`mb-6 ${getExpiryComment()?.className} p-4`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className={getExpiryComment()?.iconClassName}>{getExpiryComment()?.icon}</div>
            </div>
            <div className="ml-3">
              <p className={`text-sm ${getExpiryComment()?.textClassName}`}>
                <strong>{getDaysRemaining(perk.expiry) <= 0 ? 'Expired:' : 'Expiring Soon:'}</strong> {getExpiryComment()?.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {isExpired() && perk.status !== 'Expired' && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Expired:</strong> This perk expired on {formatDate(perk.expiry)}.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Perk Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Complete information about this perk.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Business</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{perk.business}</dd>
            </div>
            {perk.benefits && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Benefits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{perk.benefits}</dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Valid Period</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {perk.startDate && formatDate(perk.startDate)} to {perk.expiry && formatDate(perk.expiry)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2 flex items-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-3 ${getStatusColorClass(perk.status)}`}>
                  {perk.status || 'To Redeem'}
                </span>
                
                <div className="relative">
                  <select
                    value={perk.status}
                    onChange={(e) => handleStatusChange(e.target.value as 'To Redeem' | 'Redeemed')}
                    className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    disabled={updatingStatus}
                  >
                    <option value="To Redeem">Mark as: To Redeem</option>
                    <option value="Redeemed">Mark as: Redeemed</option>
                  </select>
                  {updatingStatus && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-4 w-4 border-t-2 border-indigo-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </dd>
            </div>
            {perk.redemptionPhone && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Redemption Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={`tel:${perk.redemptionPhone}`} className="text-indigo-600 hover:text-indigo-900">
                    {perk.redemptionPhone}
                  </a>
                </dd>
              </div>
            )}
            {perk.redemptionEmail && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Redemption Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={`mailto:${perk.redemptionEmail}`} className="text-indigo-600 hover:text-indigo-900">
                    {perk.redemptionEmail}
                  </a>
                </dd>
              </div>
            )}
            {perk.redemptionLink && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Redemption Link</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={perk.redemptionLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 break-words">
                    {perk.redemptionLink}
                  </a>
                </dd>
              </div>
            )}
            {perk.notes && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">{perk.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
} 