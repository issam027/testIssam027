import React, { useState } from 'react';
import { Service, Availability } from '../types';
import { ChevronLeft, ChevronRight, X, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';

interface AvailabilityCalendarProps {
  services: Service[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  availabilityData: Record<string, Availability[]>;
}

export function AvailabilityCalendar({
  services,
  selectedDate,
  onDateChange,
  onClose,
  availabilityData,
}: AvailabilityCalendarProps) {
  const [selectedTime, setSelectedTime] = useState<string>();
  const [enabledServices, setEnabledServices] = useState<Set<string>>(
    new Set(services.map(s => s.id))
  );
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const toggleService = (serviceId: string) => {
    setEnabledServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  };

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  };

  const isDateAvailable = (day: number) => {
    if (enabledServices.size === 0) return false;
    
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    return services
      .filter(service => enabledServices.has(service.id))
      .every((service) => {
        const serviceAvailability = availabilityData[service.id] || [];
        return serviceAvailability.some(
          (a) => a.date === dateStr && a.available
        );
      });
  };

  const getTotalPrice = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return services
      .filter(service => enabledServices.has(service.id))
      .reduce((total, service) => {
        const serviceAvailability = availabilityData[service.id] || [];
        const dayAvailability = serviceAvailability.find(a => a.date === dateStr);
        return total + (dayAvailability?.specialPrice || service.basePrice);
      }, 0);
  };

  const getServicePrice = (service: Service) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const serviceAvailability = availabilityData[service.id] || [];
    const dayAvailability = serviceAvailability.find(a => a.date === dateStr);
    return dayAvailability?.specialPrice || service.basePrice;
  };

  const isSelectedDay = (day: number) => {
    return selectedDate.getDate() === day;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 p-4 md:p-8 m-4 rounded-xl shadow-xl transition-colors">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calendar */}
          <div>
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                  Select Date & Time
                </h2>
                <div className="flex items-center space-x-2 md:space-x-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white min-w-[140px] text-center">
                    {selectedDate.toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                    >
                      {window.innerWidth < 400 ? day.charAt(0) : day}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const isAvailable = isDateAvailable(day);
                    const isToday = new Date().toDateString() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toDateString();
                    const isSelected = isSelectedDay(day);

                    return (
                      <button
                        key={day}
                        onClick={() => isAvailable && handleDateSelect(day)}
                        className={`aspect-square rounded-lg p-1 md:p-2 text-sm transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : isAvailable
                            ? 'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                            : 'cursor-not-allowed bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        } ${
                          isToday
                            ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                            : ''
                        }`}
                        disabled={!isAvailable}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg px-2 md:px-4 py-2 text-sm transition-all ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Selected Services & Summary */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">Selected Services</h3>
                <button
                  onClick={() => {
                    if (enabledServices.size === services.length) {
                      setEnabledServices(new Set());
                    } else {
                      setEnabledServices(new Set(services.map(s => s.id)));
                    }
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {enabledServices.size === services.length ? 'Disable All' : 'Enable All'}
                </button>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {services.map((service) => {
                  const price = getServicePrice(service);
                  const hasDiscount = price < service.basePrice;
                  const isEnabled = enabledServices.has(service.id);
                  
                  return (
                    <div
                      key={service.id}
                      className={`flex items-center justify-between rounded-lg p-3 md:p-4 transition-colors ${
                        isEnabled 
                          ? 'bg-gray-50 dark:bg-gray-700/50' 
                          : 'bg-gray-100 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleService(service.id)}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                          aria-label={`Toggle ${service.name}`}
                        >
                          {isEnabled ? (
                            <ToggleRight className="h-6 w-6 text-blue-500" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          )}
                        </button>
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className={`h-12 w-12 rounded-lg object-cover transition-opacity ${
                            !isEnabled ? 'opacity-50' : ''
                          }`}
                          loading="lazy"
                        />
                        <div>
                          <h4 className={`font-medium text-sm md:text-base ${
                            isEnabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {service.name}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{service.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end text-gray-700 dark:text-gray-300">
                          <DollarSign className="h-4 w-4" />
                          <span className={`
                            ${hasDiscount ? 'text-green-600 dark:text-green-400 font-semibold' : ''}
                            ${!isEnabled ? 'opacity-50' : ''}
                          `}>
                            {price}
                          </span>
                        </div>
                        {hasDiscount && (
                          <div className={`text-xs md:text-sm text-gray-500 dark:text-gray-400 line-through ${
                            !isEnabled ? 'opacity-50' : ''
                          }`}>
                            ${service.basePrice}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Enabled Services</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {enabledServices.size} of {services.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Time</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      ${getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                className="mt-6 w-full rounded-lg bg-blue-500 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={!selectedTime || enabledServices.size === 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}