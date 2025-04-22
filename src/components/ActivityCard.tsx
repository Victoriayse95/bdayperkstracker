"use client";

import { ArrowUpRightIcon, StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ActivityCardProps {
  title: string;
  rating?: number;
  participants?: { id: number; avatar: string }[];
  color?: 'light' | 'pink';
  onClick?: () => void;
}

export default function ActivityCard({
  title,
  rating,
  participants = [],
  color = 'light',
  onClick
}: ActivityCardProps) {
  return (
    <div 
      className={`activity-card ${color === 'light' ? 'activity-card-light' : 'activity-card-pink'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <div className="avatar-group mt-2">
            {participants.map((participant) => (
              <div key={participant.id} className="relative avatar">
                <Image 
                  src={participant.avatar} 
                  alt="Participant avatar" 
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {participants.length > 0 && (
              <div className="avatar bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                +{participants.length}
              </div>
            )}
          </div>
        </div>
        
        {rating && (
          <div className="rating-badge">
            <StarIcon className="h-3 w-3 text-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4">
        <button className="p-2 rounded-full bg-white shadow-sm">
          <ArrowUpRightIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
} 