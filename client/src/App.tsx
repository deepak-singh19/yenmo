import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
          <Route path="/" element={<Dashboard />} />  
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </Router>
    // </AuthProvider>
  );
};

export default App;
