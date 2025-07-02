// project/src/components/events/EventList.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Grid, List, Calendar } from 'lucide-react';
import { Event } from '../../types';
import EventCard from './EventCard';

const API_URL = 'http://localhost:8080/api';

interface EventListProps {
  onEventSelect: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        const adaptedData = data.map((event: any) => ({
            ...event,
            id: event.id.toString(),
            organizer: event.organizer, // Keep the organizer as an object
            organizerId: event.organizer.id.toString(),
            tags: event.tags || [],
            image: event.imageUrl,
        }));
        setEvents(adaptedData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = ['all', ...Array.from(new Set(events.map(event => event.category)))];
  const locations = ['all', ...Array.from(new Set(events.map(event => event.location)))];

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
      
      let matchesPrice = true;
      if (priceRange === 'free') matchesPrice = event.price === 0;
      else if (priceRange === 'under-100') matchesPrice = event.price > 0 && event.price < 100;
      else if (priceRange === '100-300') matchesPrice = event.price >= 100 && event.price <= 300;
      else if (priceRange === 'over-300') matchesPrice = event.price > 300;

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          return b.currentAttendees - a.currentAttendees;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, selectedCategory, selectedLocation, priceRange, sortBy]);

  if (isLoading) {
    return <div className="text-center p-12">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center p-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
        <p className="text-gray-600">Find and join amazing events happening around you</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        {/* **THE FIX IS HERE:** Restored the Search Bar UI */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, tags, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {categories.map(category => (
                <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {locations.map(location => (
                <option key={location} value={location}>{location === 'all' ? 'All Locations' : location}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="under-100">Under RM100</option>
              <option value="100-300">RM100 - RM300</option>
              <option value="over-300">Over RM300</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="date">Date</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popularity">Popularity</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`flex-1 px-3 py-2 flex items-center justify-center ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                <Grid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`flex-1 px-3 py-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">{filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'} found</p>
      </div>

      {filteredAndSortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAndSortedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onSelect={onEventSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;