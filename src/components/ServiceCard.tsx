import React, { memo, useState } from 'react';
import { Service } from '../types';
import { Calendar, DollarSign, MapPin, Clock, Users, Info, X } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export const ServiceCard = memo(function ServiceCard({ 
  service, 
  isSelected, 
  onSelect 
}: ServiceCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent flip when clicking the select button
    if ((e.target as HTMLElement).closest('button')) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="h-[400px] perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of the card */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="mb-2 flex items-center space-x-2">
                <span className="rounded-full bg-blue-500/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {service.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold line-clamp-2">{service.name}</h3>
            </div>
          </div>

          <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-grow">
              {service.description}
            </p>
            <div className="flex flex-col gap-3">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(service);
                }}
                className={`flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {isSelected ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close details"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {service.name}
            </h3>

            <div className="space-y-4 flex-grow">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">4-6 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Capacity</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Up to 300 guests</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Provider</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{service.provider}</p>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(service);
              }}
              className={`w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});