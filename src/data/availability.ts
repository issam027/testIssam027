import { Availability } from '../types';

export const generateAvailabilityData = (serviceId: string): Availability[] => {
  const availability: Availability[] = [];
  const today = new Date();
  const basePrice = parseInt(serviceId) * 100;
  
  // Generate availability for the next 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Make weekends more likely to be available (90%) than weekdays (60%)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const availabilityChance = isWeekend ? 0.9 : 0.6;
    
    const isAvailable = Math.random() < availabilityChance;
    
    // Generate special pricing based on various factors
    let specialPrice;
    if (isAvailable) {
      // Weekend surge pricing (10-30% more expensive)
      if (isWeekend) {
        specialPrice = Math.floor(basePrice * (1.1 + Math.random() * 0.2));
      }
      // Weekday discounts (10-25% cheaper)
      else {
        specialPrice = Math.floor(basePrice * (0.75 + Math.random() * 0.15));
      }
      
      // Special seasonal adjustments
      const month = date.getMonth();
      // Peak season (summer months)
      if (month >= 5 && month <= 7) {
        specialPrice = Math.floor(specialPrice * 1.2);
      }
      // Off-peak season (winter months)
      else if (month >= 11 || month <= 1) {
        specialPrice = Math.floor(specialPrice * 0.85);
      }
    }
    
    availability.push({
      date: date.toISOString().split('T')[0],
      available: isAvailable,
      specialPrice,
    });
  }
  
  return availability;
};