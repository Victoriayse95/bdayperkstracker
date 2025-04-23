'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPerks, deletePerk, updatePerk, Perk, samplePerks } from '../../firebase/services';

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);

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

  const handleEdit = (perk: Perk) => {
    setEditingPerk(perk);
  };

  const handleUpdate = async (id: string, updatedData: Partial<Perk>) => {
    try {
      await updatePerk(id, updatedData);
      setEditingPerk(null);
      
      // Update the local state immediately for better UX
      setPerks(currentPerks => 
        currentPerks.map(perk => 
          perk.id === id ? { ...perk, ...updatedData } : perk
        )
      );
      
      // Only refetch if we're not using sample data
      if (!usingSample) {
        fetchPerks();
      }
    } catch (error) {
      console.error('Error updating perk:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this perk?')) {
      try {
        await deletePerk(id);
        // Update UI immediately
        setPerks(currentPerks => currentPerks.filter(perk => perk.id !== id));
      } catch (error) {
        console.error('Error deleting perk:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Redeem':
        return 'bg-green-100 text-green-800';
      case 'Redeemed':
        return 'bg-white text-gray-600';
      case 'Expired':
        return 'bg-gray-200 text-gray-700';
      case 'Expiring in 7 days':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-white text-gray-600';
    }
  };

  // Get row background class based on status
  const getRowBackgroundClass = (status: string) => {
    switch (status) {
      case 'To Redeem':
        return 'bg-green-50';
      case 'Redeemed':
        return '';
      case 'Expired':
        return 'bg-gray-100';
      case 'Expiring in 7 days':
        return 'bg-red-50';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">All Perks</h1>
        <p className="mt-2 text-gray-600">
          A comprehensive list of all perks in the system
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

      {perks.length === 0 && !loading ? (
        <div className="bg-yellow-50 p-4 rounded-md my-4">
          <p className="text-yellow-700">No perks found in the database. Add your first perk!</p>
          <Link
            href="/perks/new"
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Perk
          </Link>
        </div>
      ) : null}

      {perks.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="w-1/3">
              <input
                type="text"
                placeholder="Search perks..."
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div>
              <Link
                href="/perks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add New Perk
              </Link>
            </div>
          </div>

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
                  {perks.map((perk) => (
                    <tr key={perk.id} className={getRowBackgroundClass(perk.status)}>
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
                        {perk.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perk.expiry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={perk.status}
                          onChange={(e) => handleUpdate(perk.id!, { status: e.target.value as 'To Redeem' | 'Redeemed' | 'Expired' })}
                          className={`px-2 text-xs leading-5 font-semibold rounded-full ${getStatusColor(perk.status)}`}
                        >
                          <option value="To Redeem">To Redeem</option>
                          <option value="Redeemed">Redeemed</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 break-words min-w-[200px]">
                        {perk.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/perks/${perk.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(perk.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 