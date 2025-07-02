import { Event, Ticket, Registration, EventUpdate } from '../types';

export const mockEvents: Event[] = [
  {
    id: 'event_1',
    title: 'Tech Conference 2025',
    description: 'Join industry leaders and innovators for a comprehensive tech conference featuring the latest in AI, machine learning, and software development. This full-day event includes keynote speeches, workshop sessions, networking opportunities, and exhibitions from leading tech companies.',
    shortDescription: 'Industry-leading tech conference with AI, ML, and software development focus.',
    date: '2025-03-15',
    time: '09:00',
    location: 'San Francisco, CA',
    venue: 'Moscone Convention Center',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 299,
    maxAttendees: 500,
    currentAttendees: 387,
    organizerId: 'org_1',
    organizer: 'TechEvents Inc.',
    status: 'upcoming',
    tags: ['Technology', 'AI', 'Machine Learning', 'Networking'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event_2',
    title: 'Digital Marketing Summit',
    description: 'Discover the latest trends and strategies in digital marketing. Learn from expert speakers about social media marketing, content creation, SEO, and conversion optimization. Perfect for marketers, entrepreneurs, and business owners.',
    shortDescription: 'Latest digital marketing trends and strategies summit.',
    date: '2025-02-28',
    time: '10:00',
    location: 'New York, NY',
    venue: 'Jacob K. Javits Convention Center',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 199,
    maxAttendees: 300,
    currentAttendees: 245,
    organizerId: 'org_2',
    organizer: 'Marketing Pro Events',
    status: 'upcoming',
    tags: ['Marketing', 'Digital', 'SEO', 'Social Media'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event_3',
    title: 'Startup Pitch Night',
    description: 'An exciting evening where innovative startups present their ideas to potential investors and industry experts. Network with entrepreneurs, investors, and thought leaders in the startup ecosystem.',
    shortDescription: 'Startup presentations and networking event for entrepreneurs.',
    date: '2025-02-20',
    time: '18:00',
    location: 'Austin, TX',
    venue: 'Austin Convention Center',
    category: 'Business',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 75,
    maxAttendees: 150,
    currentAttendees: 98,
    organizerId: 'org_3',
    organizer: 'Startup Austin',
    status: 'upcoming',
    tags: ['Startup', 'Investment', 'Networking', 'Business'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event_4',
    title: 'Web Development Bootcamp',
    description: 'Intensive 3-day workshop covering modern web development technologies including React, Node.js, and MongoDB. Hands-on learning with experienced instructors and real-world projects.',
    shortDescription: '3-day intensive web development workshop.',
    date: '2025-03-10',
    time: '09:00',
    location: 'Seattle, WA',
    venue: 'Seattle Center',
    category: 'Education',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 450,
    maxAttendees: 80,
    currentAttendees: 65,
    organizerId: 'org_4',
    organizer: 'CodeAcademy Pro',
    status: 'upcoming',
    tags: ['Web Development', 'React', 'Node.js', 'Workshop'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event_5',
    title: 'Music Festival 2025',
    description: 'Two days of amazing live music featuring local and international artists across multiple genres. Food trucks, art installations, and unforgettable performances in a beautiful outdoor setting.',
    shortDescription: 'Two-day music festival with multiple artists and genres.',
    date: '2025-06-15',
    time: '12:00',
    location: 'Los Angeles, CA',
    venue: 'Griffith Park',
    category: 'Entertainment',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 150,
    maxAttendees: 2000,
    currentAttendees: 1456,
    organizerId: 'org_5',
    organizer: 'LA Music Events',
    status: 'upcoming',
    tags: ['Music', 'Festival', 'Entertainment', 'Outdoor'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'event_6',
    title: 'Food & Wine Tasting',
    description: 'An elegant evening of gourmet food pairings and premium wine tastings led by renowned chefs and sommeliers. Learn about wine regions, tasting techniques, and culinary arts.',
    shortDescription: 'Gourmet food and premium wine tasting experience.',
    date: '2025-04-12',
    time: '19:00',
    location: 'Napa Valley, CA',
    venue: 'Silverado Resort',
    category: 'Food & Drink',
    image: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 125,
    maxAttendees: 100,
    currentAttendees: 78,
    organizerId: 'org_6',
    organizer: 'Culinary Experiences',
    status: 'upcoming',
    tags: ['Food', 'Wine', 'Tasting', 'Culinary'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'ticket_1',
    eventId: 'event_1',
    userId: 'user_1',
    purchaseDate: '2025-01-15T10:30:00Z',
    status: 'active',
    qrCode: 'QR_TC2025_001',
    price: 299,
    ticketType: 'regular'
  },
  {
    id: 'ticket_2',
    eventId: 'event_3',
    userId: 'user_1',
    purchaseDate: '2025-01-20T14:45:00Z',
    status: 'active',
    qrCode: 'QR_SPN_002',
    price: 75,
    ticketType: 'early-bird'
  }
];

export const mockRegistrations: Registration[] = [
  {
    id: 'reg_1',
    eventId: 'event_2',
    userId: 'user_1',
    registrationDate: '2025-01-18T09:15:00Z',
    status: 'confirmed',
    attendeeInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      specialRequests: 'Vegetarian meal preference'
    }
  }
];

export const mockEventUpdates: EventUpdate[] = [
  {
    id: 'update_1',
    eventId: 'event_1',
    title: 'Speaker Update',
    message: 'We\'re excited to announce that Dr. Sarah Chen, AI Research Director at Google, will be joining our keynote panel!',
    type: 'info',
    timestamp: '2025-01-22T15:30:00Z',
    isRead: false
  },
  {
    id: 'update_2',
    eventId: 'event_3',
    title: 'Venue Change',
    message: 'Due to increased attendance, we\'re moving to the larger ballroom. Check your email for the updated location details.',
    type: 'important',
    timestamp: '2025-01-21T11:20:00Z',
    isRead: true
  }
];