import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import ShiftRequestScreen from './components/ShiftRequest';
import ShiftManager from './components/ShiftManager';
import EventManager from './components/EventManager';
import StaffManager from './components/StaffManager';
import { ViewState, Staff, ShiftRequest, FacilityEvent } from './types';
import { INITIAL_REQUESTS, MOCK_EVENTS, MOCK_STAFF } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Staff | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  
  // Lifted state
  const [requests, setRequests] = useState<ShiftRequest[]>(INITIAL_REQUESTS);
  const [events, setEvents] = useState<FacilityEvent[]>(MOCK_EVENTS);
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);

  const handleLogin = (user: Staff) => {
    setCurrentUser(user);
    // If admin, go to manager dashboard by default, else go to request screen
    setCurrentView(user.isAdmin ? 'MANAGER' : 'REQUEST');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
  };

  const handleSaveRequests = (newRequests: ShiftRequest[]) => {
    // Merge new requests for this user into the global state
    // In a real app, this would be an API call
    setRequests(prev => {
      const filtered = prev.filter(r => r.staffId !== currentUser?.id);
      return [...filtered, ...newRequests];
    });
  };

  if (!currentUser || currentView === 'LOGIN') {
    return <Login onLogin={handleLogin} staffList={staffList} />;
  }

  return (
    <Layout
      currentUser={currentUser}
      currentView={currentView}
      setView={setCurrentView}
      onLogout={handleLogout}
    >
      {currentView === 'REQUEST' && (
        <ShiftRequestScreen
          currentUser={currentUser}
          events={events}
          existingRequests={requests}
          onSaveRequests={handleSaveRequests}
        />
      )}
      
      {currentView === 'MANAGER' && (
        <ShiftManager
          requests={requests}
          events={events}
          staffList={staffList}
        />
      )}

      {currentView === 'STAFF' && (
         <StaffManager 
           staffList={staffList} 
           onUpdateStaff={setStaffList} 
         />
      )}

      {currentView === 'EVENTS' && (
         <EventManager 
           events={events} 
           onUpdateEvents={setEvents} 
         />
      )}
    </Layout>
  );
};

export default App;