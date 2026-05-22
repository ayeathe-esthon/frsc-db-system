import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Sidebar from './components/sidebar';
import Staff from './pages/staff';
import Departments from './pages/departments';
import Devices from './pages/devices';
import Login from './pages/login';
import { jwtDecode } from 'jwt-decode';
import ChangePassword from './pages/changePassword';

function ProtectedLayout({ children }) {
  const token = localStorage.getItem('frsc_token');
  const [isAuthorized, setIsAuthorized] = useState(() => (token ? null : false));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!token) return;

    const timeoutId = window.setTimeout(() => {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem('frsc_token');
          setIsAuthorized(false);
          return;
        }

        setRole(decoded.role);
        setIsAuthorized(true);
      } catch {
        localStorage.removeItem('frsc_token');
        setIsAuthorized(false);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [token]);

  if (isAuthorized === null) return null;
  if (!isAuthorized) return <Navigate to="/login" />;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', padding: '0', width: '100%' }}>
        {React.cloneElement(children, { role })}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/staff" element={<ProtectedLayout><Staff /></ProtectedLayout>} />
        <Route path="/departments" element={<ProtectedLayout><Departments /></ProtectedLayout>} />
        <Route path="/devices" element={<ProtectedLayout><Devices /></ProtectedLayout>} />
        <Route path="/change-password" element={<ProtectedLayout><ChangePassword /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;