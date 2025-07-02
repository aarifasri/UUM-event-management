// project/src/components/events/EventDetails.tsx
import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, DollarSign, Tag, ArrowLeft, 
  Share2, Heart, Ticket, User, Phone, Mail, MessageSquare 
} from 'lucide-react';
import { Event } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:8080/api';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack }) => {
  const { user, token } = useAuth();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: {[key: string]: string} = {
      'Technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'Marketing': 'bg-purple-100 text-purple-800 border-purple-200',
      'Business': 'bg-green-100 text-green-800 border-green-200',
      'Education': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Entertainment': 'bg-pink-100 text-pink-800 border-pink-200',
      'Food & Drink': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');
    setSuccess('');

    if (!token) {
      setError('You must be logged in to register.');
      setIsRegistering(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(registrationData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed.');
      }
      setSuccess('Registration successful! Your ticket has been generated.');
      setTimeout(() => {
        setShowRegistrationForm(false);
        setSuccess('');
      }, 3000); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const attendancePercentage = event.maxAttendees > 0 ? (event.currentAttendees / event.maxAttendees) * 100 : 0;
  const spotsLeft = event.maxAttendees - event.currentAttendees;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* **FIX IS HERE:** Restored the entire JSX body of the component */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Heart className="h-5 w-5" /></button>
              <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Share2 className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>{event.status}</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(event.category)}`}><Tag className="h-3 w-3 mr-1" />{event.category}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{event.title}</h1>
                <p className="text-lg text-gray-200">{event.shortDescription}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center"><div className="p-3 bg-blue-100 rounded-lg mr-4"><Calendar className="h-6 w-6 text-blue-600" /></div><div><p className="text-sm text-gray-600">Date & Time</p><p className="font-semibold text-gray-900">{formatDate(event.date)}</p><p className="text-sm text-gray-700">{formatTime(event.time)}</p></div></div>
                <div className="flex items-center"><div className="p-3 bg-red-100 rounded-lg mr-4"><MapPin className="h-6 w-6 text-red-600" /></div><div><p className="text-sm text-gray-600">Location</p><p className="font-semibold text-gray-900">{event.venue}</p><p className="text-sm text-gray-700">{event.location}</p></div></div>
                <div className="flex items-center"><div className="p-3 bg-green-100 rounded-lg mr-4"><Users className="h-6 w-6 text-green-600" /></div><div><p className="text-sm text-gray-600">Attendance</p><p className="font-semibold text-gray-900">{event.currentAttendees} / {event.maxAttendees}</p><p className="text-sm text-gray-700">{spotsLeft} spots left</p></div></div>
                <div className="flex items-center"><div className="p-3 bg-purple-100 rounded-lg mr-4"><User className="h-6 w-6 text-purple-600" /></div><div><p className="text-sm text-gray-600">Organizer</p><p className="font-semibold text-gray-900">{event.organizer.name}</p></div></div>
              </div>
              <div className="mb-6"><div className="flex justify-between text-sm text-gray-600 mb-2"><span>Event Capacity</span><span>{attendancePercentage.toFixed(0)}% Full</span></div><div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.min(attendancePercentage, 100)}%` }}></div></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"><h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2><p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p></div>

            {event.tags && event.tags.length > 0 && (<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"><h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2><div className="flex flex-wrap gap-3">{event.tags.map((tag, index) => (<span key={index} className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">{tag}</span>))}</div></div>)}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="text-center mb-6"><div className="flex items-center justify-center mb-4"><DollarSign className="h-8 w-8 text-green-500 mr-2" /><span className="text-4xl font-bold text-gray-900">{event.price > 0 ? `RM${event.price}`: 'Free'}</span></div><p className="text-gray-600">per ticket</p></div>
              {event.status === 'upcoming' && spotsLeft > 0 ? (<button onClick={() => setShowRegistrationForm(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center"><Ticket className="h-5 w-5 mr-2" />Register Now</button>) : (<button disabled className="w-full bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg cursor-not-allowed flex items-center justify-center">{spotsLeft === 0 ? 'Sold Out' : 'Registration Closed'}</button>)}
              {spotsLeft <= 10 && spotsLeft > 0 && (<p className="text-center text-orange-600 text-sm mt-3 font-medium">Only {spotsLeft} spots left!</p>)}
            </div>
          </div>
        </div>
      </div>

      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200"><h3 className="text-2xl font-bold text-gray-900">Register for Event</h3><p className="text-gray-600 mt-1">{event.title}</p></div>
            <form onSubmit={handleRegistration} className="p-6 space-y-4">
              {error && <div className="text-red-600 p-3 bg-red-50 rounded-lg">{error}</div>}
              {success && <div className="text-green-600 p-3 bg-green-50 rounded-lg">{success}</div>}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" required value={registrationData.name} onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your full name" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" required value={registrationData.email} onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="tel" value={registrationData.phone} onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your phone number" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label><div className="relative"><MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><textarea value={registrationData.specialRequests} onChange={(e) => setRegistrationData({ ...registrationData, specialRequests: e.target.value })} rows={3} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Any dietary restrictions, accessibility needs, etc." /></div></div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowRegistrationForm(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isRegistering} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{isRegistering ? 'Processing...' : 'Complete Registration'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;