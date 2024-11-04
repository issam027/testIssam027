import React from 'react';
import { Service, ServiceCategory } from '../types';
import { ServiceCard } from './ServiceCard';

interface ServiceGridProps {
  services: Service[];
  selectedServices: Set<string>;
  onServiceSelect: (service: Service) => void;
  category?: ServiceCategory;
}

export function ServiceGrid({
  services,
  selectedServices,
  onServiceSelect,
  category,
}: ServiceGridProps) {
  const filteredServices = category
    ? services.filter((service) => service.category === category)
    : services;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isSelected={selectedServices.has(service.id)}
          onSelect={onServiceSelect}
        />
      ))}
      {filteredServices.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No services found in this category.</p>
        </div>
      )}
    </div>
  );
}