'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPerks, deletePerk, updatePerk, Perk, samplePerks } from '../../firebase/services';
import CategoryFilter, { PerkCategory } from '../../components/CategoryFilter';
import SortingOptions, { SortOption } from '../../components/SortingOptions';
import StatusFilter, { PerkStatus } from '../../components/StatusFilter';
import SearchBar from '../../components/SearchBar';
import CalendarView from '../../components/CalendarView';
import QuickActionButtons from '../../components/QuickActionButtons';
import RenewPerkButton from '../../components/RenewPerkButton';

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [filteredPerks, setFilteredPerks] = useState<Perk[]>([]);
  const [sortedPerks, setSortedPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<PerkCategory[]>(['food', 'beauty', 'retail', 'entertainment', 'other']);
  const [selectedStatuses, setSelectedStatuses] = useState<PerkStatus[]>(['To Redeem', 'Redeemed']);
  const [sortOption, setSortOption] = useState<SortOption>('expiry-asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchPerks = async () => {
    try {
      setLoading(true);
      
      // Create a timeout to fallback to sample data if fetching takes too long
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('Fetch taking too long, using sample data as fallback');
          setPerks(samplePerks);
          setFilteredPerks(samplePerks);
          setUsingSample(true);
          setLoading(false);
        }
      }, 5000);
      
      const fetchedPerks = await getAllPerks();
      
      // Clear timeout if we got the data in time
      clearTimeout(timeoutId);
      
      setPerks(fetchedPerks);
      setFilteredPerks(fetchedPerks);
      setError(null);
      
      // Check if we're using sample data (as defined in services.ts)
      if (fetchedPerks.some(perk => perk.id && perk.id.toString().startsWith('mock-'))) {
        setUsingSample(true);
      }
    } catch (err) {
      console.error('Error fetching perks:', err);
      setError('Failed to load perks. Using sample data for display.');
      setPerks(samplePerks);
      setFilteredPerks(samplePerks);
      setUsingSample(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerks();
  }, []);

  useEffect(() => {
    // Apply filters whenever perks, search term, or selected categories change
    const filtered = perks.filter(perk => {
      const matchesSearch = searchTerm === '' || 
        perk.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (perk.benefits && perk.benefits.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (perk.notes && perk.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategories.length === 0 || 
        (perk.category && selectedCategories.includes(perk.category as PerkCategory));
      
      const matchesStatus = selectedStatuses.length === 0 ||
        (perk.status && selectedStatuses.includes(perk.status));
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredPerks(filtered);
  }, [perks, searchTerm, selectedCategories, selectedStatuses]);

  // Apply sorting to filtered perks
  useEffect(() => {
    const sorted = [...filteredPerks].sort((a, b) => {
      switch (sortOption) {
        case 'expiry-asc':
          return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
        case 'expiry-desc':
          return new Date(b.expiry).getTime() - new Date(a.expiry).getTime();
        case 'business-asc':
          return a.business.localeCompare(b.business);
        case 'business-desc':
          return b.business.localeCompare(a.business);
        default:
          return 0;
      }
    });
    
    setSortedPerks(sorted);
  }, [filteredPerks, sortOption]);

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

  // Format date to readable string
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
          {/* Calendar View */}
          <CalendarView perks={perks} />
        
          {/* Filters and Controls */}
          <div className="mb-6">
            <button 
              className="md:hidden mb-4 w-full py-2 px-4 flex justify-between items-center border border-gray-300 rounded-md bg-white shadow-sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <span className="text-sm font-medium text-gray-700">Filters & Sort</span>
              <svg className={`w-5 h-5 transition-transform ${showMobileFilters ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className={`${showMobileFilters || 'hidden md:flex'} flex-col md:flex-row gap-4 mb-4`}>
              <SearchBar onSearch={setSearchTerm} />
              <div className="flex flex-col md:flex-row gap-3">
                <SortingOptions currentSort={sortOption} onSortChange={setSortOption} />
                <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
                <StatusFilter selectedStatuses={selectedStatuses} onStatusChange={setSelectedStatuses} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {sortedPerks.length} {sortedPerks.length === 1 ? 'perk' : 'perks'}
            </div>
            <Link
              href="/perks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Perk
            </Link>
          </div>

          {sortedPerks.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-md my-4">
              <p className="text-yellow-700">No perks found matching your filters. Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-gray-200 sm:rounded-lg shadow">
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                        <span>Business Name</span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/12">
                        Category
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
                    {sortedPerks.map((perk) => (
                      <tr key={perk.id} className={getRowBackgroundClass(perk.status)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {perk.business}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {perk.category || '-'}
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
                            <select 
                              value={perk.status}
                              onChange={(e) => handleUpdate(perk.id!, { status: e.target.value as 'To Redeem' | 'Redeemed' })}
                              className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(perk.status)}`}
                            >
                              <option value="To Redeem">To Redeem</option>
                              <option value="Redeemed">Redeemed</option>
                            </select>
                            {perk.expiry && (
                              <span className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getExpiryBadgeClass(getDaysRemaining(perk.expiry))}`}>
                                {getExpiryStatusText(perk.expiry)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words min-w-[200px]">
                          {perk.notes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col space-y-2">
                            <QuickActionButtons 
                              perk={perk} 
                              onStatusChange={handleUpdate} 
                            />
                            <RenewPerkButton
                              perk={perk}
                              onRenew={handleUpdate}
                            />
                            <div className="flex space-x-2">
                              <Link 
                                href={`/perks/${perk.id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </Link>
                              <button 
                                onClick={() => handleDelete(perk.id!)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 