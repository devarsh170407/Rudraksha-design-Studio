import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Home, Compass, User as UserIcon, LogOut, Settings, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-logo-container">
        <Link to="/" className="navbar-logo-link">
          <img src="/logomain.png" alt="Rudraksha Logo" className="navbar-logo-image" />
          <span className="navbar-logo-text">
            Rudraksha <span className="navbar-logo-accent">Design Studio</span>
          </span>
        </Link>
      </div>
      
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className="navbar-link" 
          onClick={() => setIsMenuOpen(false)}
        >
          <Home size={18} /> Home
        </Link>
        <button 
          onClick={() => {
            setIsMenuOpen(false);
            if (window.location.pathname !== '/') {
              navigate('/?scroll=about');
            } else {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
          className="navbar-link"
        >
          <Compass size={18} style={{ transform: 'rotate(90deg)' }} /> About
        </button>
        <button 
          onClick={() => {
            setIsMenuOpen(false);
            if (window.location.pathname !== '/') {
              navigate('/projects');
            } else {
              const el = document.getElementById('explore-gallery');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/projects');
              }
            }
          }} 
          className="navbar-link"
        >
          <Compass size={18} /> Explore
        </button>
        
        {currentUser ? (
          <>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={18} /> Admin
              </Link>
            )}
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }} 
              className="navbar-link logout-btn"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="btn-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserIcon size={18} /> Login
          </Link>
        )}
      </div>

      <div className="mobile-menu-btn" onClick={toggleMenu}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </nav>
  );
}

