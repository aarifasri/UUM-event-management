// project/src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/common/Header';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';
import Dashboard from './components/dashboard/Dashboard';
import CreateEvent from './components/create/CreateEvent';
import EditEvent from './components/edit/EditEvent';
import { Event } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm switchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterForm switchToLogin={() => setAuthMode('login')} />
    );
  }
  
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setActiveTab('edit');
  };

  if (editingEvent) {
    return (
        <EditEvent 
            event={editingEvent} 
            onBack={() => {
                setEditingEvent(null);
                setActiveTab('dashboard');
            }}
            onEventUpdated={() => {
                setEditingEvent(null);
                setActiveTab('dashboard');
            }}
        />
    )
  }

  if (selectedEvent) {
    return (
      <EventDetails 
        event={selectedEvent} 
        onBack={() => setSelectedEvent(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'home' && (
        <EventList 
          onEventSelect={setSelectedEvent}
        />
      )}
      
      {activeTab === 'dashboard' && (
        <Dashboard 
            onEventSelect={setSelectedEvent}
            onEventEdit={handleEditEvent}
        />
      )}
      
      {activeTab === 'create' && user.role === 'organizer' && (
        <CreateEvent />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;