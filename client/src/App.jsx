
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkerProfile from './pages/WorkerProfile';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {user && (
          <nav style={{ padding: '1rem', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--accent-primary)' }}>GigVerify</h2>
            <div>
              <span style={{ marginRight: '1rem' }}>{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--glass-border)' }}>Logout</button>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route element={<PrivateRoute user={user} />}>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/worker/:id" element={<WorkerProfile user={user} />} />
            <Route path="/admin" element={<AdminPanel user={user} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
