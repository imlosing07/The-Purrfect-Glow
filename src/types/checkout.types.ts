export type DeliveryMethod = 'pickup' | 'delivery';
export type StoreLocation = 'miraflores' | 'selva-alegre';
export type DeliveryTimeSlot = 'morning' | 'afternoon' | 'evening';

export interface CheckoutData {
  deliveryMethod: DeliveryMethod;
  // Pickup data
  storeLocation?: StoreLocation;
  // Delivery data
  customerName?: string;
  address?: string;
  reference?: string;
  timeSlot?: DeliveryTimeSlot;
}

export const STORE_LOCATIONS = {
  miraflores: {
    name: 'Miraflores',
    address: 'Av. Mariscal Castilla 834, Miraflores, Arequipa',
    icon: '🏪',
    mapUrl: 'https://maps.app.goo.gl/6KqBL55iNwjKQU3XA'
  },
  'selva-alegre': {
    name: 'Alto Selva Alegre',
    address: 'Av. Aviación 901, Alto Selva Alegre, Arequipa',
    icon: '🌳',
    mapUrl: 'https://maps.app.goo.gl/2JouRZukUE9ZNHVi6'
  }
} as const;

export const TIME_SLOTS = {
  morning: {
    label: 'Mañana',
    time: '9:00 AM - 1:00 PM',
    icon: '🌅'
  },
  afternoon: {
    label: 'Tarde',
    time: '2:00 PM - 6:00 PM',
    icon: '☀️'
  },
  evening: {
    label: 'Noche',
    time: '6:00 PM - 9:00 PM',
    icon: '🌙'
  }
} as const;
