"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// Sample redemption data - in a real app, this would come from Firebase
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

interface Redemption {
  id: number;
  name: string;
  perks: string;
  redemptionMonth: number;
  redemptionDateFrom: string;
  redemptionDateTo: string;
  contactNumber: string;
  emailAddress: string;
  terms: string;
  redemptionLink: string;
  signUpLink: string;
  notes: string;
  status: string;
}

const sampleRedemptions: Redemption[] = [
  {
    id: 1,
    name: "Starbucks Birthday Drink",
    perks: "Free drink of your choice",
    redemptionMonth: currentMonth, // Current month
    redemptionDateFrom: `${currentMonth + 1}/01/${currentYear}`,
    redemptionDateTo: `${currentMonth + 1}/30/${currentYear}`,
    contactNumber: "555-123-4567",
    emailAddress: "info@starbucks.com",
    terms: "Must be a Starbucks Rewards member. Show app.",
    redemptionLink: "https://starbucks.com/rewards",
    signUpLink: "https://starbucks.com/rewards/signup",
    notes: "Mobile app required for redemption",
    status: "To Redeem"
  },
  {
    id: 2,
    name: "Sephora Beauty Insider Gift",
    perks: "Free beauty gift during birthday month",
    redemptionMonth: currentMonth, // Current month
    redemptionDateFrom: `${currentMonth + 1}/01/${currentYear}`,
    redemptionDateTo: `${currentMonth + 1}/05/${currentYear}`, // Expiring soon (within 7 days)
    contactNumber: "555-567-8901",
    emailAddress: "info@sephora.com",
    terms: "Must be a Beauty Insider member. Valid in-store or online.",
    redemptionLink: "https://sephora.com/beauty-insider",
    signUpLink: "https://sephora.com/beauty-insider/signup",
    notes: "Choose from skincare or makeup option",
    status: "Expiring Soon"
  },
  {
    id: 3,
    name: "Baskin-Robbins Free Scoop",
    perks: "Free ice cream scoop",
    redemptionMonth: currentMonth, // Current month
    redemptionDateFrom: `${currentMonth + 1}/01/${currentYear}`,
    redemptionDateTo: `${currentMonth + 1}/30/${currentYear}`,
    contactNumber: "555-345-6789",
    emailAddress: "info@baskinrobbins.com",
    terms: "Join birthday club for redemption",
    redemptionLink: "https://baskinrobbins.com/birthday",
    signUpLink: "https://baskinrobbins.com/signup",
    notes: "Any flavor, single scoop only",
    status: "Redeemed"
  },
  {
    id: 4,
    name: "Ulta Beauty Birthday Gift",
    perks: "Free birthday gift with any purchase",
    redemptionMonth: currentMonth - 1, // Last month (expired)
    redemptionDateFrom: `${currentMonth}/01/${currentYear}`,
    redemptionDateTo: `${currentMonth}/30/${currentYear}`,
    contactNumber: "555-234-5678",
    emailAddress: "info@ulta.com",
    terms: "Must be Ultamate Rewards member",
    redemptionLink: "https://ulta.com/rewards",
    signUpLink: "https://ulta.com/rewards/signup",
    notes: "Gift changes quarterly",
    status: "Expired"
  },
  {
    id: 5,
    name: "Cheesecake Factory Birthday Slice",
    perks: "Free slice of cheesecake",
    redemptionMonth: currentMonth + 1, // Next month
    redemptionDateFrom: `${currentMonth + 2}/01/${currentYear}`,
    redemptionDateTo: `${currentMonth + 2}/30/${currentYear}`,
    contactNumber: "555-789-0123",
    emailAddress: "info@cheesecakefactory.com",
    terms: "Valid with purchase of an entree. Bring ID.",
    redemptionLink: "https://cheesecakefactory.com/birthday",
    signUpLink: "https://cheesecakefactory.com/signup",
    notes: "Valid for any cheesecake flavor",
    status: "To Redeem"
  }
];

export default function AllRedemptionsPage() {
  const [redemptions, setRedemptions] = useState(sampleRedemptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter redemptions based on search term
  const filteredRedemptions = redemptions.filter(redemption => 
    redemption.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    redemption.perks.toLowerCase().includes(searchTerm.toLowerCase()) ||
    redemption.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    redemption.contactNumber.includes(searchTerm) ||
    redemption.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort redemptions based on column and direction
  const sortedRedemptions = [...filteredRedemptions].sort((a: Redemption, b: Redemption) => {
    const valueA = a[sortColumn as keyof Redemption];
    const valueB = b[sortColumn as keyof Redemption];
    
    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Function to update redemption status
  const updateStatus = (id: number, newStatus: string) => {
    setRedemptions(prev => 
      prev.map(redemption => 
        redemption.id === id ? {...redemption, status: newStatus} : redemption
      )
    );
  };

  // Function to delete a redemption
  const deleteRedemption = (id: number) => {
    if (confirm('Are you sure you want to delete this redemption?')) {
      setRedemptions(prev => prev.filter(redemption => redemption.id !== id));
    }
  };

  // Get status class based on status value
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'To Redeem':
        return 'status-to-redeem';
      case 'Redeemed':
        return 'status-redeemed';
      case 'Expired':
        return 'status-expired';
      case 'Expiring Soon':
        return 'status-expiring';
      default:
        return 'status-to-redeem';
    }
  };

  // Get sort indicator
  const getSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="inline h-4 w-4 ml-1" />
      : <ChevronDownIcon className="inline h-4 w-4 ml-1" />;
  };

  return (
    <div className="app-container pb-10">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">All Redemptions</h1>
        <p className="mt-2 text-gray-600">
          Manage and view all birthday perk redemptions
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search redemptions..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent w-full"
          />
        </div>
        <Link
          href="/redemptions/new"
          className="btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Redemption
        </Link>
      </div>

      <div className="table-container">
        <table className="pastel-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="cursor-pointer"
              >
                Name {getSortIndicator('name')}
              </th>
              <th
                onClick={() => handleSort('perks')}
                className="cursor-pointer"
              >
                Perks {getSortIndicator('perks')}
              </th>
              <th
                onClick={() => handleSort('redemptionDateFrom')}
                className="cursor-pointer"
              >
                Valid From {getSortIndicator('redemptionDateFrom')}
              </th>
              <th
                onClick={() => handleSort('redemptionDateTo')}
                className="cursor-pointer"
              >
                Valid To {getSortIndicator('redemptionDateTo')}
              </th>
              <th
                onClick={() => handleSort('contactNumber')}
                className="cursor-pointer"
              >
                Contact {getSortIndicator('contactNumber')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="cursor-pointer"
              >
                Status {getSortIndicator('status')}
              </th>
              <th>
                Notes
              </th>
              <th className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRedemptions.map((redemption) => (
              <tr key={redemption.id}>
                <td>
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1 font-medium text-gray-900">
                    {redemption.name}
                  </div>
                </td>
                <td>
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1 text-gray-500">
                    {redemption.perks}
                  </div>
                </td>
                <td>
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1 text-gray-500">
                    {redemption.redemptionDateFrom}
                  </div>
                </td>
                <td>
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1 text-gray-500">
                    {redemption.redemptionDateTo}
                  </div>
                </td>
                <td>
                  <div className="text-gray-500">
                    <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1">
                      {redemption.contactNumber}
                    </div>
                    <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1 text-xs text-gray-400">
                      {redemption.emailAddress}
                    </div>
                  </div>
                </td>
                <td>
                  <select 
                    className={`status-badge ${getStatusClass(redemption.status)} border-0 outline-none cursor-pointer`}
                    value={redemption.status}
                    onChange={(e) => updateStatus(redemption.id, e.target.value)}
                  >
                    <option value="To Redeem">To Redeem</option>
                    <option value="Redeemed">Redeemed</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </td>
                <td>
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:rounded p-1 text-gray-500">
                    {redemption.notes}
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                      onClick={() => deleteRedemption(redemption.id)}
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 