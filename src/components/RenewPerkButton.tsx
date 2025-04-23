"use client";

import { useState } from 'react';
import { Perk } from '../firebase/services';

interface RenewPerkButtonProps {
  perk: Perk;
  onRenew: (perkId: string, updatedData: Partial<Perk>) => void;
}

const RenewPerkButton = ({ perk, onRenew }: RenewPerkButtonProps) => {
  const [isRenewing, setIsRenewing] = useState(false);
  
  // Calculate a new date exactly one year from the provided date
  const addOneYear = (dateString: string): string => {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const handleRenew = async () => {
    if (isRenewing) return;
    
    setIsRenewing(true);
    try {
      // Add one year to both the start date and expiry date
      const newStartDate = addOneYear(perk.startDate);
      const newExpiryDate = addOneYear(perk.expiry);
      
      // Reset status to 'To Redeem' and update dates
      await onRenew(perk.id!, {
        startDate: newStartDate,
        expiry: newExpiryDate,
        status: 'To Redeem',
        notes: (perk.notes || '') + `\n(Renewed on ${new Date().toLocaleDateString('en-US')})`
      });
    } catch (error) {
      console.error('Error renewing perk:', error);
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <button
      onClick={handleRenew}
      disabled={isRenewing}
      className={`px-3 py-1 text-xs font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors ${
        isRenewing ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Renew this perk for next year"
    >
      {isRenewing ? (
        <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
      ) : (
        'Renew for Next Year'
      )}
    </button>
  );
};

export default RenewPerkButton; 