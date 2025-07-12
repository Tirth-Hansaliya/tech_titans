import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import VideoCall from './components/VideoCall';
import Requests from './components/Requests';

function App() {
   
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('userId') // Persist login across refresh
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <>
                <Header />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <>
                <Header />
                <Profile />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/requests"
          element={
            isLoggedIn ? (
              <>
                <Header />
                <Requests />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
  
}

export default App;
