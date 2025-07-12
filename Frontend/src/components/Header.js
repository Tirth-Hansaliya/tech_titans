import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/dashboard" className="header-btn">Home</Link>
        <Link to="/profile" className="header-btn">Profile</Link>
      </div>
      <div className="header-right">
        <Link to="/requests" className="header-btn">Requests</Link>
        <Link to="/register" className="header-btn">Register</Link>
        <Link to="/login" className="header-btn">Login</Link>
      </div>
    </header>
  );
}
