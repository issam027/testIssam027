import React from 'react';
import { ServiceCategory } from '../types';
import { Music, Camera, Utensils, Building2, PartyPopper, Flower2 } from 'lucide-react';

const categories: { value: ServiceCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'venue', label: 'Venues', icon: <Building2 className="h-5 w-5" /> },
  { value: 'catering', label: 'Catering', icon: <Utensils className="h-5 w-5" /> },
  { value: 'music', label: 'Music', icon: <Music className="h-5 w-5" /> },
  { value: 'photography', label: 'Photography', icon: <Camera className="h-5 w-5" /> },
  { value: 'entertainment', label: 'Entertainment', icon: <PartyPopper className="h-5 w-5" /> },
  { value: 'decoration', label: 'Decoration', icon: <Flower2 className="h-5 w-5" /> },
];

interface CategoryFilterProps {
  selected?: ServiceCategory;
  onChange: (category?: ServiceCategory) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onChange(undefined)}
        className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !selected
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Services
      </button>
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onChange(category.value)}
          className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === category.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.icon}
          <span className="ml-2">{category.label}</span>
        </button>
      ))}
    </div>
  );
}