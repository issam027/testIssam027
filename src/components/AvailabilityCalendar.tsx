import React, { useState } from 'react';
import { Service, Availability } from '../types';
import { ChevronLeft, ChevronRight, X, DollarSign } from 'lucide-react';

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
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

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
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    return services.every((service) => {
      const serviceAvailability = availabilityData[service.id] || [];
      return serviceAvailability.some(
        (a) => a.date === dateStr && a.available
      );
    });
  };

  const getTotalPrice = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return services.reduce((total, service) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-5xl rounded-xl bg-white p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Calendar */}
          <div>
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Select Date & Time
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePrevMonth}
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-lg font-medium">
                    {selectedDate.toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500"
                  >
                    {day}
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
                      className={`aspect-square rounded-lg p-2 text-sm transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : isAvailable
                          ? 'hover:bg-blue-50 hover:text-blue-600'
                          : 'cursor-not-allowed bg-gray-50 text-gray-400'
                      } ${
                        isToday
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                      disabled={!isAvailable}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Select Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg px-4 py-2 text-sm transition-all ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <h3 className="mb-4 text-xl font-medium text-gray-900">Selected Services</h3>
              <div className="space-y-3">
                {services.map((service) => {
                  const price = getServicePrice(service);
                  const hasDiscount = price < service.basePrice;
                  
                  return (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-500">{service.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end text-gray-700">
                          <DollarSign className="h-4 w-4" />
                          <span className={hasDiscount ? 'text-green-600 font-semibold' : ''}>
                            {price}
                          </span>
                        </div>
                        {hasDiscount && (
                          <div className="text-sm text-gray-500 line-through">
                            ${service.basePrice}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Services</span>
                  <span className="font-medium">{services.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-xl font-semibold text-blue-600">
                      ${getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                className="mt-6 w-full rounded-lg bg-blue-500 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!selectedTime}
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