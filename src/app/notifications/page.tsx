'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPerks, updatePerk, Perk } from '../../firebase/services';

export default function NotificationsPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPerks = async () => {
      try {
        setLoading(true);
        const allPerks = await getAllPerks();
        setPerks(allPerks);
        setError(null);
      } catch (err) {
        console.error('Error fetching perks:', err);
        setError('Failed to load perks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerks();
    
    // Load read notifications from localStorage
    const savedReadNotifications = localStorage.getItem('readNotifications');
    if (savedReadNotifications) {
      try {
        setReadNotifications(new Set(JSON.parse(savedReadNotifications)));
      } catch (e) {
        console.error('Error loading read notifications from localStorage:', e);
      }
    }
  }, []);

  const isExpiringWithinDays = (expiryDateStr: string, days: number): boolean => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Parse the expiry date
      const [month, day, year] = expiryDateStr.split('/').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      expiryDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= 0 && diffDays <= days;
    } catch (e) {
      console.error('Error parsing date:', e);
      return false;
    }
  };

  const expiringPerks = perks.filter(perk => 
    perk.status === 'To Redeem' && 
    isExpiringWithinDays(perk.expiry, 7)
  );

  const markAsRead = (id: string) => {
    const newReadNotifications = new Set(readNotifications);
    newReadNotifications.add(id);
    setReadNotifications(newReadNotifications);
    localStorage.setItem('readNotifications', JSON.stringify([...newReadNotifications]));
  };

  const markAsUnread = (id: string) => {
    const newReadNotifications = new Set(readNotifications);
    newReadNotifications.delete(id);
    setReadNotifications(newReadNotifications);
    localStorage.setItem('readNotifications', JSON.stringify([...newReadNotifications]));
  };

  const markAllAsRead = () => {
    const newReadNotifications = new Set([...readNotifications]);
    expiringPerks.forEach(perk => {
      if (perk.id) newReadNotifications.add(perk.id);
    });
    setReadNotifications(newReadNotifications);
    localStorage.setItem('readNotifications', JSON.stringify([...newReadNotifications]));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-lg text-gray-600">Perks expiring within the next 7 days</p>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md my-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : expiringPerks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 text-lg">No notifications at this time. Check back later!</p>
          <Link 
            href="/perks" 
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View All Perks
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-gray-700">
              Showing {expiringPerks.length} notification{expiringPerks.length !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
            >
              Mark All as Read
            </button>
          </div>
          
          <div className="space-y-4">
            {expiringPerks.map(perk => {
              const isRead = perk.id ? readNotifications.has(perk.id) : false;
              
              return (
                <div 
                  key={perk.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                    isRead ? 'border-gray-300' : 'border-yellow-500'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {perk.business} - Expiring Soon
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Perk expires on {perk.expiry}
                        </p>
                      </div>
                      <div>
                        {isRead ? (
                          <button 
                            onClick={() => markAsUnread(perk.id!)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Mark as Unread
                          </button>
                        ) : (
                          <button 
                            onClick={() => markAsRead(perk.id!)}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      {perk.notes}
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <Link
                        href={`/perks/${perk.id}/edit`}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => {
                          if (perk.id) {
                            updatePerk(perk.id, { status: 'Redeemed' });
                            // Remove from notifications list
                            setPerks(perks.map(p => p.id === perk.id ? { ...p, status: 'Redeemed' } : p));
                          }
                        }}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        Mark as Redeemed
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
} 