// project/src/types/index.ts

// This is the User interface that matches the backend response.
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'attendee' | 'organizer';
}

// Keep your other interfaces like Event, etc. as they are.
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  category: string;
  image: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  organizerId: string;
  organizer: User; // Changed from string to User
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// **THE FIX IS HERE:** Replace your old Ticket interface with this one.
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  status: 'active' | 'used' | 'cancelled' | 'refunded';
  qrCode: string;
  price: number;
  ticketType: 'regular' | 'vip' | 'early-bird';
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  // --- ADD THE FOLLOWING FIELDS ---
  eventVenue: string;
  eventImageUrl: string;
  eventTime: string;
}

// ... your other interfaces (Registration, EventUpdate) ...
export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  attendeeInfo: {
    name: string;
    email: string;
    phone?: string;
    specialRequests?: string;
  };
}

export interface EventUpdate {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'important' | 'cancellation';
  timestamp: string;
  isRead: boolean;
}