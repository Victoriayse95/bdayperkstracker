"use client";

import { useState } from 'react';
import Link from 'next/link';

// Define type for reminder objects
interface Reminder {
  id: number;
  business: string;
  perk: string;
  expiryDate: string;
  notifyDaysBefore: number;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      business: "Starbucks",
      perk: "Free birthday drink",
      expiryDate: "2023-05-15",
      notifyDaysBefore: 7,
      email: true,
      push: true,
      sms: false
    },
    {
      id: 2,
      business: "Sephora",
      perk: "Birthday beauty gift",
      expiryDate: "2023-05-15",
      notifyDaysBefore: 3,
      email: true,
      push: false,
      sms: false
    }
  ]);

  const [formData, setFormData] = useState<Reminder>({
    id: 0,
    business: "",
    perk: "",
    expiryDate: "",
    notifyDaysBefore: 7,
    email: true,
    push: false,
    sms: false
  });

  // Calculate days remaining until a date
  const getDaysRemaining = (dateString: string): number => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setReminders([
      ...reminders,
      {
        ...formData,
        id: Date.now()
      }
    ]);
    
    // Reset form
    setFormData({
      id: 0,
      business: "",
      perk: "",
      expiryDate: "",
      notifyDaysBefore: 7,
      email: true,
      push: false,
      sms: false
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
        <p className="text-lg text-gray-600">Get notified before your birthday perks expire</p>
      </div>
      
      {/* Set Up Reminders Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Set Up New Reminder</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="business"
                name="business"
                value={formData.business}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="perk" className="block text-sm font-medium text-gray-700 mb-1">
                Perk Description
              </label>
              <input
                type="text"
                id="perk"
                name="perk"
                value={formData.perk}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="notifyDaysBefore" className="block text-sm font-medium text-gray-700 mb-1">
                Notify Days Before
              </label>
              <select
                id="notifyDaysBefore"
                name="notifyDaysBefore"
                value={formData.notifyDaysBefore}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 day before</option>
                <option value={3}>3 days before</option>
                <option value={7}>1 week before</option>
                <option value={14}>2 weeks before</option>
                <option value={30}>30 days before</option>
              </select>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <p className="text-sm font-medium text-gray-700">Notification Methods</p>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email"
                  name="email"
                  checked={formData.email}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="email" className="ml-2 block text-sm text-gray-700">
                  Email Notification
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="push"
                  name="push"
                  checked={formData.push}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="push" className="ml-2 block text-sm text-gray-700">
                  Push Notification
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms"
                  name="sms"
                  checked={formData.sms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sms" className="ml-2 block text-sm text-gray-700">
                  SMS Notification
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
            >
              Add Reminder
            </button>
          </div>
        </form>
      </div>
      
      {/* Active Reminders */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200">Active Reminders</h2>
        
        {reminders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {reminders.map((reminder) => {
              const daysRemaining = getDaysRemaining(reminder.expiryDate);
              const isExpiringSoon = daysRemaining <= 7;
              
              return (
                <div key={reminder.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{reminder.business}</h3>
                    <p className="mt-1 text-sm text-gray-500">{reminder.perk}</p>
                    
                    <div className="mt-2 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isExpiringSoon ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {daysRemaining > 0 
                          ? `Expires in ${daysRemaining} days` 
                          : daysRemaining === 0 
                            ? 'Expires today!'
                            : 'Expired'}
                      </span>
                      
                      <span className="ml-4 text-xs text-gray-500">
                        Notifying {reminder.notifyDaysBefore} days before
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {reminder.email && (
                        <span className="inline-flex items-center p-1.5 rounded-full bg-indigo-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </span>
                      )}
                      
                      {reminder.push && (
                        <span className="inline-flex items-center p-1.5 rounded-full bg-green-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                        </span>
                      )}
                      
                      {reminder.sms && (
                        <span className="inline-flex items-center p-1.5 rounded-full bg-yellow-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                      <button className="ml-4 text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            You haven't set up any reminders yet. Use the form above to add your first reminder!
          </div>
        )}
      </div>
    </div>
  );
} 