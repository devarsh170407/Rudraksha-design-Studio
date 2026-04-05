import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Home, LogOut, Shield, Map, LayoutGrid, User as UserIcon, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
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
          className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(false)}
        >
          <Home size={18} /> Home
        </Link>
        <button 
          onClick={() => {
            setIsMenuOpen(false);
            if (location.pathname !== '/') {
              navigate('/?scroll=about');
            } else {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
          className="navbar-link"
        >
          <Map size={18} /> About
        </button>
        <Link 
          to="/projects" 
          className={`navbar-link ${location.pathname === '/projects' ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(false)}
        >
          <LayoutGrid size={18} /> Explore
        </Link>
        
        {currentUser ? (
          <>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield size={18} /> Admin
              </Link>
            )}
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }} 
              className="navbar-link logout-btn"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="navbar-link login-link"
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

