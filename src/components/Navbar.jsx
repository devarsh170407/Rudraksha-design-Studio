import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Home, Compass, User as UserIcon, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <nav style={styles.nav} className="glass-panel">
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logo}>
          Rudraksha<span style={styles.logoAccent}>Studio</span>
        </Link>
      </div>
      
      <div style={styles.links}>
        <Link to="/" style={styles.link}><Home size={18} /> Home</Link>
        <Link to="/projects" style={styles.link}><Compass size={18} /> Explore</Link>
        
        {currentUser ? (
          <>
            {isAdmin && (
              <Link to="/admin" style={styles.link}><Settings size={18} /> Admin</Link>
            )}
            <button onClick={handleLogout} className="btn-outline" style={styles.logoutBtn}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">
            <UserIcon size={18} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    margin: '1rem',
    position: 'sticky',
    top: '1rem',
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  logoAccent: {
    color: 'var(--color-accent-primary)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
};
