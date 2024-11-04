import React, { useState, useEffect } from 'react';
import { ServiceGrid } from './components/ServiceGrid';
import { CategoryFilter } from './components/CategoryFilter';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ThemeToggle } from './components/ThemeToggle';
import { services } from './data/services';
import { generateAvailabilityData } from './data/availability';
import { Service, ServiceCategory, Availability } from './types';
import { CalendarRange, Menu, X } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<Record<string, Availability[]>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarRange className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <h1 className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Wedding Event Scheduler
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                Selected Services: {selectedServices.size}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Category Filter */}
      <div className={`
        fixed inset-0 z-20 bg-white dark:bg-gray-800 transform transition-transform duration-300 lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 pt-16">
          <CategoryFilter
            selected={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              setIsMobileMenuOpen(false);
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:py-8 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-8">
          {/* Desktop Category Filter */}
          <div className="hidden lg:block sticky top-0 z-20 -mx-4 bg-gray-50/80 dark:bg-gray-900/80 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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

        {/* Selected Services Summary - Mobile Optimized */}
        {selectedServices.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 p-4 shadow-lg transition-colors">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedServices.size} services
                  </span>
                  <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">selected</span>
                </div>
                <button
                  onClick={() => setShowAvailability(true)}
                  className="rounded-lg bg-blue-500 px-4 sm:px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
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