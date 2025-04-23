"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { Perk } from '../firebase/services';
import Link from 'next/link';

interface CalendarViewProps {
  perks: Perk[];
}

const CalendarView = ({ perks }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Helper to check if a perk expires on a specific date
  const getPerksByDate = (date: Date) => {
    return perks.filter(perk => {
      const expiryDate = new Date(perk.expiry);
      return isSameDay(expiryDate, date);
    });
  };

  // Get perks for current month
  const getPerksForCurrentMonth = () => {
    return perks.filter(perk => {
      const expiryDate = new Date(perk.expiry);
      return expiryDate.getMonth() === currentDate.getMonth() && 
             expiryDate.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(a.expiry).getDate() - new Date(b.expiry).getDate());
  };

  // Helper to get background color based on perk status and days remaining
  const getBackgroundColor = (date: Date) => {
    const perksOnDate = getPerksByDate(date);
    if (perksOnDate.length === 0) return '';
    
    // Check if any perk on this date is expiring soon
    const hasUrgentPerk = perksOnDate.some(perk => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiryDate = new Date(perk.expiry);
      expiryDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysDiff <= 7 && perk.status === 'To Redeem';
    });
    
    return hasUrgentPerk ? 'bg-yellow-100' : 'bg-blue-50';
  };

  const toggleCalendarView = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'd');
        const perksForDay = getPerksByDate(cloneDay);
        const hasPerks = perksForDay.length > 0;
        const backgroundColor = getBackgroundColor(cloneDay);
        
        days.push(
          <div
            key={day.toString()}
            className={`border min-h-[40px] md:min-h-[80px] p-1 md:p-2 ${
              !isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : hasPerks ? backgroundColor : ''
            } ${isSameDay(day, new Date()) ? 'ring-2 ring-indigo-600 rounded' : ''}`}
          >
            <div className="text-right text-xs md:text-sm">{formattedDate}</div>
            {hasPerks && (
              <div className="mt-1">
                {perksForDay.slice(0, 2).map((perk) => (
                  <Link 
                    key={perk.id} 
                    href={`/perks/${perk.id}`}
                    className={`block text-xs truncate mb-1 p-1 rounded ${
                      perk.status === 'Redeemed' ? 'bg-gray-100' : 'bg-indigo-100 hover:bg-indigo-200'
                    }`}
                  >
                    {perk.business}
                  </Link>
                ))}
                {perksForDay.length > 2 && (
                  <span className="text-xs text-gray-500">+{perksForDay.length - 2} more</span>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-4 overflow-x-auto">{rows}</div>;
  };

  const renderListView = () => {
    const monthPerks = getPerksForCurrentMonth();
    
    return (
      <div className="mb-4">
        {monthPerks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No perks expire this month</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {monthPerks.map(perk => (
              <li key={perk.id} className="py-3">
                <Link href={`/perks/${perk.id}`} className="flex items-start hover:bg-gray-50 p-2 rounded">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900">{perk.business}</p>
                    <p className="text-xs text-gray-500">Expires: {format(new Date(perk.expiry), 'MMM d, yyyy')}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    perk.status === 'Redeemed' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {perk.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-md shadow-sm border p-4 mb-6 overflow-hidden">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-lg font-medium">Perk Calendar</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="text-xs md:text-sm bg-gray-100 px-2 py-1 rounded text-gray-700 hover:bg-gray-200"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={toggleCalendarView}
            className="text-xs md:text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>
      </div>
      
      {showCalendar && (
        <>
          {renderHeader()}
          {viewMode === 'grid' ? (
            <>
              {renderDays()}
              {renderCells()}
            </>
          ) : (
            renderListView()
          )}
        </>
      )}
    </div>
  );
};

export default CalendarView; 