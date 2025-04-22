"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Calendar from '@/components/Calendar';
import ActivityCard from '@/components/ActivityCard';

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
    status: "To Redeem",
    participants: [
      { id: 1, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: 2, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: 3, avatar: "https://randomuser.me/api/portraits/women/68.jpg" }
    ],
    rating: 4.9
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
    status: "Expiring Soon",
    participants: [
      { id: 4, avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
      { id: 5, avatar: "https://randomuser.me/api/portraits/men/51.jpg" },
      { id: 6, avatar: "https://randomuser.me/api/portraits/women/22.jpg" }
    ],
    rating: 4.8
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

// Sample webinar lessons data
const sampleLessons = [
  {
    id: 1,
    title: "Webinar 'How to create a web hierarchy?'",
    date: new Date(currentYear, currentMonth, 9),
    type: "webinar"
  },
  {
    id: 2,
    title: "Lesson 'Client psychology and communication strategy?'",
    date: new Date(currentYear, currentMonth, 16),
    type: "lesson"
  },
  {
    id: 3,
    title: "Lesson 'Colour gradients and their use in UI'",
    date: new Date(currentYear, currentMonth, 23),
    type: "lesson"
  }
];

export default function Home() {
  const [redemptions, setRedemptions] = useState(currentMonthRedemptions);
  const [userFirstName, setUserFirstName] = useState("Victoria");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeDates, setActiveDates] = useState<Date[]>([]);

  // Set active dates on component mount
  useEffect(() => {
    // Get all unique dates that have lessons
    const lessonDates = sampleLessons.map(lesson => lesson.date);
    setActiveDates(lessonDates);
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

  // Get month name
  const getMonthName = (monthIndex: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  // Filter lessons based on selected date
  const filteredLessons = selectedDate
    ? sampleLessons.filter(
        lesson => 
          lesson.date.getDate() === selectedDate.getDate() && 
          lesson.date.getMonth() === selectedDate.getMonth() && 
          lesson.date.getFullYear() === selectedDate.getFullYear()
      )
    : sampleLessons;

  return (
    <div className="app-container pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back <span className="text-[#F5A3FF]">👋</span></h1>
          </div>

          {/* Today's activities */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your activities today (5)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivityCard 
                title="UX/UI Design"
                participants={[
                  { id: 1, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                  { id: 2, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                  { id: 3, avatar: "https://randomuser.me/api/portraits/women/68.jpg" }
                ]}
                rating={4.9}
                color="light"
              />
              <ActivityCard 
                title="Analytics Tools"
                participants={[
                  { id: 4, avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
                  { id: 5, avatar: "https://randomuser.me/api/portraits/men/51.jpg" },
                  { id: 6, avatar: "https://randomuser.me/api/portraits/women/22.jpg" }
                ]}
                rating={4.8}
                color="pink"
              />
            </div>
          </div>

          {/* Learning progress */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Learning progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card card-light">
                <h3 className="text-gray-500 mb-2">Completed</h3>
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-bold">18</span>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="card" style={{ backgroundColor: '#FEF9C3' }}>
                <h3 className="text-gray-500 mb-2">Your score</h3>
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-bold">72</span>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="card" style={{ backgroundColor: '#F3E8FF' }}>
                <h3 className="text-gray-500 mb-2">Active</h3>
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-bold">11</span>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Redemptions Table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Perks to Claim</h2>
              <Link
                href="/redemptions/new"
                className="btn-primary flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className="flex space-x-2 justify-end">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Right column */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Lesson schedule</h2>
            <Calendar 
              onDateSelect={setSelectedDate}
              highlightedDates={activeDates}
            />
          </div>

          <div>
            {filteredLessons.map(lesson => (
              <div key={lesson.id} className="card mb-4 p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-gray-100 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
