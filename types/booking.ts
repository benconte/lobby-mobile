import { Ionicons } from "@expo/vector-icons";

// Hotel Types
export interface HotelDetails {
  id: string;
  name: string;
  image_url: string; // Add this
  photos?: string[];
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  price: string;
  rating: number;
  review_count: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Update BookingData to be more specific
export interface ReviewBookingData {
  rooms: Room;  // No longer nullable
  guestInfo: GuestInfo;  // No longer nullable
  preferences: {
    preferences: string[];
    specialRequests?: string;
  };  // No longer nullable
  paymentMethod: PaymentInfo;  // No longer nullable
}

export interface ReviewBookingProps {
  bookingDetails: BookingDetails;
  bookingData: ReviewBookingData;  // Use the non-nullable version
  hotelDetails: HotelDetails;
  onConfirm: () => void;
}

// Add a type for the booking summary
export interface BookingSummary {
  hotel: {
    name: string;
    address: string;
    image: string;
  };
  dates: {
    checkIn: Date;
    checkOut: Date;
    nights: number;
  };
  guests: {
    adults: number;
    children: number;
  };
  room: {
    name: string;
    price: number;
  };
  pricing: {
    roomTotal: number;
    taxes: number;
    fees: number;
    total: number;
  };
}

// Room Types
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  maxOccupancy: number;
  bedType: string;
  images: string[];
  amenities: RoomAmenity[];
  features: string[];
  cancellationPolicy: string;
}

export interface RoomAmenity {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
}

// Guest Types
export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

// Preferences Types
export interface BookingPreferences {
  preferences: string[];
  specialRequests?: string;
}

export interface PreferenceOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  last4?: string;
}

export interface PaymentInfo {
  paymentMethod: string;  // 'visa' | 'mastercard' | 'new-card'
  cardDetails?: CardDetails;
  billingInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  last4?: string;
}

// Booking Types
export interface BookingData {
  rooms?: Room;
  guestInfo?: GuestInfo;
  preferences?: BookingPreferences;
  paymentMethod?: PaymentInfo;  // Make sure this key matches
}

export interface BookingDetails {
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  nights: number;
  guestInfo?: GuestInfo;
  rooms?: Room;
  preferences?: BookingPreferences;
  paymentMethod?: PaymentInfo;
}

// Component Props Types
export interface RoomSelectionProps {
  bookingDetails: BookingDetails;
  hotelDetails: HotelDetails | null;
  onNext: (roomData: Room) => void;
}

export interface GuestFormProps {
  bookingDetails: BookingDetails;
  onNext: (data: GuestInfo) => void;
}

export interface PreferencesProps {
  bookingDetails: BookingDetails;
  onNext: (data: BookingPreferences) => void;
}

export interface PaymentProps {
  bookingDetails: BookingDetails;
  onNext: (data: PaymentInfo) => void;
}

// export interface ReviewBookingProps {
//   bookingDetails: BookingDetails;
//   bookingData: BookingData;
//   hotelDetails: HotelDetails | null;
//   onConfirm: () => void;
// }

// Checkout Types
export type CheckoutStepType = 'rooms' | 'guest-info' | 'preferences' | 'payment' | 'review';

export interface CheckoutStepInfo {
  id: CheckoutStepType;
  title: string;
  shortTitle: string;
}

// This is how you'll define steps in your component:
export const CHECKOUT_STEPS: CheckoutStepInfo[] = [
  { id: 'rooms', title: 'Select Room', shortTitle: 'Room' },
  { id: 'guest-info', title: 'Guest Details', shortTitle: 'Guest' },
  { id: 'preferences', title: 'Preferences', shortTitle: 'Prefs' },
  { id: 'payment', title: 'Payment', shortTitle: 'Pay' },
  { id: 'review', title: 'Review', shortTitle: 'Review' },
];

// Updated Checkout component types
export interface CheckoutProps {
  id: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export interface CheckoutState {
  currentStep: CheckoutStepType;
  bookingData: BookingData;
  hotelDetails: HotelDetails | null;
  loading: boolean;
}

// Review Types
export interface BookingSummary {
  hotel: {
    name: string;
    address: string;
    image: string;
  };
  dates: {
    checkIn: Date;
    checkOut: Date;
    nights: number;
  };
  guests: {
    adults: number;
    children: number;
  };
  room: {
    name: string;
    price: number;
  };
  pricing: {
    roomTotal: number;
    taxes: number;
    fees: number;
    total: number;
  };
}

// Modal Types
export interface RoomComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

// Constants and Enums
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export const ROOM_TYPES = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  SUITE: 'suite',
} as const;

export type RoomType = typeof ROOM_TYPES[keyof typeof ROOM_TYPES];