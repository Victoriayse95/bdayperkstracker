"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Calendar from '@/components/Calendar';
import { StarIcon } from '@heroicons/react/24/solid';

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
  }
];

// Filter redemptions for current month
const currentMonthRedemptions = sampleRedemptions.filter(
  redemption => redemption.redemptionMonth === currentMonth
);

export default function Home() {
  const [redemptions, setRedemptions] = useState(currentMonthRedemptions);
  const [activeDates, setActiveDates] = useState<Date[]>([]);

  // Set active dates on component mount
  useEffect(() => {
    // Set some active dates for the calendar (9th, 16th, 23rd of current month)
    const activeD = [9, 16, 23].map(day => new Date(currentYear, currentMonth, day));
    setActiveDates(activeD);
  }, []);

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

  return (
    <div className="bg-[#EEF2F7] min-h-screen">
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-[80px] bg-[#1E1E1E] fixed left-0 top-0 h-screen flex flex-col items-center pt-8 gap-8">
          <div className="text-white">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-[80px] p-8">
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Welcome back <span className="text-[#F5A3FF]">👋</span></h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search something"
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-[300px]"
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {/* Left 2 columns */}
              <div className="col-span-2">
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Your activities today (5)</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F0F9FF] p-5 rounded-xl relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">Birthday Perks</h3>
                          <div className="flex mt-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2 first:ml-0">
                                <Image 
                                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${30 + i}.jpg`}
                                  alt="User"
                                  width={28}
                                  height={28}
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium -ml-2">+3</div>
                          </div>
                        </div>
                        <div className="bg-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          <StarIcon className="h-3 w-3 text-yellow-400 mr-1" /> 4.9
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-[#FFE6F2] p-5 rounded-xl relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">Birthday Tools</h3>
                          <div className="flex mt-2">
                            {[4, 5, 6].map((i) => (
                              <div key={i} className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2 first:ml-0">
                                <Image 
                                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${40 + i}.jpg`}
                                  alt="User"
                                  width={28}
                                  height={28}
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium -ml-2">+6</div>
                          </div>
                        </div>
                        <div className="bg-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          <StarIcon className="h-3 w-3 text-yellow-400 mr-1" /> 4.8
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Learning progress</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#F0F9FF] rounded-xl p-5">
                      <div className="text-gray-500 mb-2 text-sm">Completed</div>
                      <div className="flex justify-between items-center">
                        <div className="text-4xl font-bold">18</div>
                        <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#FEF9C3] rounded-xl p-5">
                      <div className="text-gray-500 mb-2 text-sm">Your score</div>
                      <div className="flex justify-between items-center">
                        <div className="text-4xl font-bold">72</div>
                        <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#F3E8FF] rounded-xl p-5">
                      <div className="text-gray-500 mb-2 text-sm">Active</div>
                      <div className="flex justify-between items-center">
                        <div className="text-4xl font-bold">11</div>
                        <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perks List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Perks to Claim</h2>
                    <Link
                      href="/redemptions/new"
                      className="btn-primary flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New
                    </Link>
                  </div>

                  <div className="table-container">
                    <table className="pastel-table">
                      <thead>
                        <tr>
                          <th>Redemption Name</th>
                          <th>Contact</th>
                          <th>Perks</th>
                          <th>Valid Until</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {redemptions.map((redemption) => (
                          <tr key={redemption.id}>
                            <td>
                              <div className="font-medium text-gray-900">{redemption.name}</div>
                            </td>
                            <td>
                              <div className="text-gray-500">{redemption.contactNumber}</div>
                            </td>
                            <td>
                              <div className="text-gray-500">{redemption.perks}</div>
                            </td>
                            <td>
                              <div className="text-gray-500">{redemption.redemptionDateTo}</div>
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
                              <div className="flex justify-end space-x-1">
                                <button className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-red-600">
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
              </div>

              {/* Right column - schedule */}
              <div className="col-span-1">
                <h2 className="text-xl font-bold mb-4">Lesson schedule</h2>
                <div className="mb-4">
                  <Calendar
                    onDateSelect={() => {}} 
                    highlightedDates={activeDates}
                  />
                </div>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-start">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Webinar &quot;How to create a web hierarchy?&quot;</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-start">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Lesson &quot;Client psychology and communication strategy?&quot;</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-start">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Lesson &quot;Colour gradients and their use in UI&quot;</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
