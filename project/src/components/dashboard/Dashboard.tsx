// project/src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Users, MapPin, Calendar, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Event, Ticket as TicketType } from '../../types';

const API_URL = 'http://localhost:8080/api';

interface DashboardProps {
  onEventSelect: (event: Event) => void;
  onEventEdit: (event: Event) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onEventSelect, onEventEdit }) => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [myTickets, setMyTickets] = useState<TicketType[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrganizedEvents = async () => {
    if (!token || user?.role !== 'organizer') return;
    try {
      const eventsResponse = await fetch(`${API_URL}/events/my-organized`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        const adaptedEvents = eventsData.map((event: any) => ({
          ...event,
          id: event.id.toString(),
          organizer: event.organizer,
          organizerId: event.organizer.id.toString(),
          tags: event.tags || [],
          image: event.imageUrl,
        }));
        setOrganizedEvents(adaptedEvents);
      } else {
        console.error('Failed to fetch organized events');
      }
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    const fetchDataForDashboard = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const ticketsResponse = await fetch(`${API_URL}/my-tickets`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ticketsResponse.ok) {
          const ticketsData = await ticketsResponse.json();
          setMyTickets(ticketsData);
        } else {
          console.error('Failed to fetch tickets');
          setError('Failed to fetch your tickets.');
        }

        if (user?.role === 'organizer') {
            await fetchOrganizedEvents();
        }

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataForDashboard();
  }, [token, user?.role]);

  const handleDelete = async (eventId: string) => {
    if (!token) return;
    if (window.confirm('Are you sure you want to delete this event?')) {
        try {
            const response = await fetch(`${API_URL}/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                await fetchOrganizedEvents();
            } else {
                alert('Failed to delete event.');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred while deleting the event.');
        }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Time N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tickets', label: 'My Tickets' },
    ...(user?.role === 'organizer' ? [{ id: 'organized', label: 'Organized Events' }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's your dashboard overview.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'tickets' && (
             <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Tickets ({myTickets.length})</h3>
              {isLoading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                myTickets.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {myTickets.map(ticket => (
                       <div key={ticket.id} className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-lg">
                         <div className="md:w-1/3">
                           <img
                            src={ticket.eventImageUrl || 'https://placehold.co/600x400/eeeeee/cccccc?text=No+Image'}
                            alt={ticket.eventTitle}
                            className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="p-5 flex flex-col justify-between md:w-2/3">
                           <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)} mb-2`}>
                                Ticket {ticket.status}
                            </span>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{ticket.eventTitle}</h4>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center text-sm"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {formatDate(ticket.eventDate)}</p>
                                <p className="flex items-center text-sm"><Clock className="h-4 w-4 mr-2 text-blue-500" /> {formatTime(ticket.eventTime)}</p>
                                <p className="flex items-center text-sm"><MapPin className="h-4 w-4 mr-2 text-red-500" /> {ticket.eventVenue}, {ticket.eventLocation}</p>
                            </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center text-gray-800">
                               <DollarSign className="h-5 w-5 mr-1 text-green-600"/>
                               <span className="font-semibold">{ticket.price > 0 ? `RM${ticket.price.toFixed(2)}` : 'Free'}</span>
                            </div>
                           </div>
                         </div>
                       </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h4>
                    <p className="text-gray-600">Register for an event to get your first ticket.</p>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === 'organized' && user?.role === 'organizer' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Organized Events</h3>
              {isLoading ? <p>Loading...</p> : (
                organizedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {organizedEvents.map(event => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-32 rounded-lg object-cover mb-4 cursor-pointer"
                          onClick={() => onEventSelect(event)}
                        />
                        <h4 className="font-semibold text-gray-900 mb-2 cursor-pointer" onClick={() => onEventSelect(event)}>{event.title}</h4>
                        <p className="text-sm text-gray-600" onClick={() => onEventSelect(event)}>
                          {formatDate(event.date)} - {event.currentAttendees} / {event.maxAttendees} attendees
                        </p>
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => onEventEdit(event)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h4>
                    <p className="text-gray-600">Start creating events to build your community!</p>
                  </div>
                )
              )}
            </div>
          )}

           {activeTab === 'overview' && (
             <div>
                <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
                <p className="mt-2 text-gray-600">Welcome to your dashboard. Select a tab to see your tickets or organized events.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;