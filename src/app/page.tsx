"use client";

import { useState } from 'react';
import Link from 'next/link';

// Sample redemption data - in a real app, this would come from Firebase
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const sampleRedemptions = [
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
  }
];

// Filter redemptions for current month
const currentMonthRedemptions = sampleRedemptions.filter(
  redemption => redemption.redemptionMonth === currentMonth
);

export default function Home() {
  const [redemptions, setRedemptions] = useState(currentMonthRedemptions);

  // Function to update redemption status
  const updateStatus = (id: number, newStatus: string) => {
    setRedemptions(prev => 
      prev.map(redemption => 
        redemption.id === id ? {...redemption, status: newStatus} : redemption
      )
    );
  };

  // Get status class based on status value
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'To Redeem':
        return 'bg-blue-100 text-blue-800';
      case 'Redeemed':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-gray-100 text-gray-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">Perks to Claim</h1>
        <p className="mt-2 text-gray-600">
          Birthday perks available for redemption this month
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="w-80">
          <input
            type="text"
            placeholder="Search redemptions..."
            className="px-3 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <Link
          href="/redemptions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Redemption
        </Link>
      </div>

      <div className="overflow-hidden bg-white shadow border border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Redemption Name
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
                Redemption Perks
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Valid Until
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Notes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {redemptions.map((redemption) => (
              <tr key={redemption.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded px-2 py-1">
                    {redemption.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded px-2 py-1">
                    {redemption.contactNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded px-2 py-1">
                    {redemption.perks}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded px-2 py-1">
                    {redemption.redemptionDateTo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusClass(redemption.status)} border-0 outline-none cursor-pointer`}
                    value={redemption.status}
                    onChange={(e) => updateStatus(redemption.id, e.target.value)}
                  >
                    <option value="To Redeem">To Redeem</option>
                    <option value="Redeemed">Redeemed</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div contentEditable className="outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded px-2 py-1">
                    {redemption.notes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
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
