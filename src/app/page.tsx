"use client";

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
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900">Birthday Perks Tracker</h1>
              <p className="mt-2 text-sm text-gray-600">
                Track all your birthday freebies and special offers in one place!
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>Features coming soon:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Add and track birthday perks from your favorite businesses</li>
                  <li>Get reminders when your birthday is approaching</li>
                  <li>Keep track of redemption dates and requirements</li>
                  <li>Discover new perks from businesses near you</li>
                </ul>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Ready to explore?</p>
                <p>
                  <Link href="/perks" className="text-cyan-600 hover:text-cyan-700">
                    Browse available perks &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
