"use client";

import { useState } from 'react';
import { Perk, updatePerk } from '../firebase/services';

interface QuickActionButtonsProps {
  perk: Perk;
  onStatusChange: (perkId: string, updatedData: Partial<Perk>) => void;
}

const QuickActionButtons = ({ perk, onStatusChange }: QuickActionButtonsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newStatus = perk.status === 'To Redeem' ? 'Redeemed' : 'To Redeem';
      await onStatusChange(perk.id!, { status: newStatus });
    } catch (error) {
      console.error('Error updating perk status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getDaysRemaining = (expiryDateStr: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiryDateStr);
    expiryDate.setHours(0, 0, 0, 0);
    
    // For same-day expiry, return 0 (expires today, not expired yet)
    if (expiryDate.getTime() === today.getTime()) {
      return 0;
    }
    
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isUrgent = perk.expiry && getDaysRemaining(perk.expiry) <= 3;

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleStatusToggle}
        disabled={isUpdating}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          perk.status === 'To Redeem'
            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isUrgent && perk.status === 'To Redeem' ? 'animate-pulse' : ''}`}
        title={perk.status === 'To Redeem' ? 'Mark as Redeemed' : 'Mark as To Redeem'}
      >
        {isUpdating ? (
          <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
        ) : perk.status === 'To Redeem' ? (
          'Mark Redeemed'
        ) : (
          'Undo'
        )}
      </button>
    </div>
  );
};

export default QuickActionButtons; 