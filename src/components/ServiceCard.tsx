import React from 'react';
import { Service } from '../types';
import { Calendar, DollarSign, MapPin } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded-full bg-blue-500/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {service.category}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">{service.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{service.description}</p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="ml-1 font-medium">${service.basePrice}</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="ml-1 text-sm truncate max-w-[120px]">{service.provider}</span>
            </div>
          </div>
          <button
            onClick={() => onSelect(service)}
            className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
            }`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {isSelected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>
    </div>
  );
}