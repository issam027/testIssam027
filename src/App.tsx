import React, { useState, useEffect } from 'react';
import { ServiceGrid } from './components/ServiceGrid';
import { CategoryFilter } from './components/CategoryFilter';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { services } from './data/services';
import { generateAvailabilityData } from './data/availability';
import { Service, ServiceCategory, Availability } from './types';
import { CalendarRange } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<Record<string, Availability[]>>({});

  useEffect(() => {
    // Generate availability data for all services
    const data: Record<string, Availability[]> = {};
    services.forEach((service) => {
      data[service.id] = generateAvailabilityData(service.id);
    });
    setAvailabilityData(data);
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(service.id)) {
        next.delete(service.id);
      } else {
        next.add(service.id);
      }
      return next;
    });
  };

  const selectedServicesList = services.filter((service) =>
    selectedServices.has(service.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarRange className="h-8 w-8 text-blue-500" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Wedding Event Scheduler
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Selected Services: {selectedServices.size}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Category Filter */}
          <div className="sticky top-0 z-20 -mx-4 bg-gray-50/80 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {/* Services Grid */}
          <ServiceGrid
            services={services}
            selectedServices={selectedServices}
            onServiceSelect={handleServiceSelect}
            category={selectedCategory}
          />
        </div>

        {/* Selected Services Summary */}
        {selectedServices.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 shadow-lg">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedServices.size} services selected
                  </span>
                </div>
                <button
                  onClick={() => setShowAvailability(true)}
                  className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Availability Calendar Modal */}
        {showAvailability && selectedServices.size > 0 && (
          <AvailabilityCalendar
            services={selectedServicesList}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onClose={() => setShowAvailability(false)}
            availabilityData={availabilityData}
          />
        )}
      </main>
    </div>
  );
}

export default App;