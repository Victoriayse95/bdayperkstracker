'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPerks, Perk } from '../../firebase/services';

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchPerks();
  }, []);

  // Sample perks data as fallback if no data in Firebase yet
  const samplePerks = [
    {
      id: '1',
      business: "Starbucks",
      contact: "555-123-4567",
      category: "Coffee & Drinks",
      expiry: "04/26/2023",
      value: "$5",
      status: "Reminder Sent",
      notes: "Free drink on birthday - mobile app required"
    },
    {
      id: '2',
      business: "Sephora",
      contact: "555-567-8901",
      category: "Beauty",
      expiry: "04/30/2023",
      value: "$10",
      status: "Service In Progress",
      notes: "Free beauty gift - Beauty Insider membership required"
    },
    {
      id: '3',
      business: "Baskin-Robbins",
      contact: "555-345-6789",
      category: "Food & Dessert",
      expiry: "04/20/2023",
      value: "$3",
      status: "Cancelled",
      notes: "Free ice cream scoop - birthday club membership needed"
    },
    {
      id: '4',
      business: "Denny's",
      contact: "555-901-2345",
      category: "Restaurants",
      expiry: "04/20/2023",
      value: "$8",
      status: "Reminder Sent",
      notes: "Free Grand Slam on birthday with valid ID"
    },
    {
      id: '5',
      business: "Ulta Beauty",
      contact: "555-234-5678",
      category: "Beauty",
      expiry: "04/20/2023",
      value: "$15",
      status: "Reminder Sent",
      notes: "Free birthday gift with any purchase - Ultamate Rewards membership required"
    }
  ];

  // Use sample perks if no data fetched yet
  const displayPerks = perks.length > 0 ? perks : samplePerks;

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
          <p className="text-yellow-700">No perks found in the database. Displaying sample data.</p>
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer flex items-center"
              >
                <span>Business Name</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Category
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Expiry Date
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Status
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayPerks.map((perk) => (
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
                  {perk.expiry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {perk.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    perk.status === 'Reminder Sent' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : perk.status === 'Service In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {perk.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {perk.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 