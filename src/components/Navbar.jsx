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
        <Link to="/" style={styles.logoLink}>
          <img src="/logomain.png" alt="Rudraksha Logo" style={styles.logoImage} />
          <span style={styles.logoText}>
            Rudraksha <span style={styles.logoAccent}>Design Studio</span>
          </span>
        </Link>
      </div>
      
      <div style={styles.links}>
        <Link to="/" style={styles.link}><Home size={18} /> Home</Link>
        <button 
          onClick={() => {
            if (window.location.pathname !== '/') {
              navigate('/?scroll=about');
            } else {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
          style={styles.link}
        >
          <Compass size={18} style={{ transform: 'rotate(90deg)' }} /> About
        </button>
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
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
  },
  logoImage: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    fontFamily: "'Outfit', sans-serif",
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
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: 0,
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
};
