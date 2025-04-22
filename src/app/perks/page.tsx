'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPerks, deletePerk, updatePerk, Perk } from '../../firebase/services';

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);

  const fetchPerks = async () => {
    try {
      setLoading(true);
      const fetchedPerks = await getAllPerks();
      setPerks(fetchedPerks);
      setError(null);
    } catch (err) {
      console.error('Error fetching perks:', err);
      setError('Failed to load perks. Please try again later.');
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
      fetchPerks(); // Refresh perks after update
    } catch (error) {
      console.error('Error updating perk:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this perk?')) {
      try {
        await deletePerk(id);
        fetchPerks(); // Refresh perks after deletion
      } catch (error) {
        console.error('Error deleting perk:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Redeem':
        return 'bg-blue-100 text-blue-800';
      case 'Redeemed':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md my-4">
          <p className="text-red-700">{error}</p>
          <p className="text-red-600 mt-2">Using sample data for display</p>
        </div>
      ) : perks.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-md my-4">
          <p className="text-yellow-700">No perks found in the database. Add your first perk!</p>
        </div>
      ) : null}

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

      <div className="overflow-hidden bg-white shadow border border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <span>Business Name</span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Expiry Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {perks.map((perk) => (
              <tr key={perk.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {perk.business}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {perk.contact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {perk.category}
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
                <td className="px-6 py-4 text-sm text-gray-500">
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
  );
} 