import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Coffee, Info, Mail, Phone, Instagram, Facebook, Twitter, Check, ChevronRight, ChevronLeft, Sparkles, Box, Layout, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Footer.css';

const WhatsAppLogoFull = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramLogoOfficial = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [step, setStep] = useState(0); // 0: Intro, 1: Rooms, 2: Styles, 3: Success
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHomePage = location.pathname === '/';

  const rooms = [
    { id: 'interiors', label: 'Home Interiors', icon: <Home size={20} /> },
    { id: 'kitchen', label: 'Modular Kitchen', icon: <Coffee size={20} /> },
    { id: 'living', label: 'Living Room', icon: <Layout size={20} /> },
    { id: 'bedroom', label: 'Bedroom', icon: <Box size={20} /> },
    { id: 'wardrobe', label: 'Wardrobe', icon: <Layout size={20} /> },
    { id: 'furniture', label: 'Space Saving', icon: <Sparkles size={20} /> },
    { id: 'office', label: 'Home Office', icon: <Layout size={20} /> },
    { id: 'bathroom', label: 'Bathroom', icon: <Sparkles size={20} /> }
  ];

  const styles_list = [
    { id: 'modern', label: 'Modern', desc: 'Clean lines & bold colors' },
    { id: 'classic', label: 'Classic', desc: 'Timeless & elegant' },
    { id: 'minimalist', label: 'Minimalist', desc: 'Simple & functional' },
    { id: 'luxury', label: 'Luxury', desc: 'Opulent & detailed' }
  ];

  const toggleRoom = (id) => {
    setSelectedRooms(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleStartCalculation = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setStep(1);
    }
  };

  const handleGenerateEstimate = async () => {
    setIsSubmitting(true);
    try {
      const roomsText = selectedRooms.map(r => rooms.find(room => room.id === r)?.label).join(', ');
      const styleText = styles_list.find(s => s.id === selectedStyle)?.label;
      
      await addDoc(collection(db, 'estimates'), {
        rooms: selectedRooms,
        roomsFormatted: roomsText,
        style: selectedStyle,
        styleFormatted: styleText,
        createdAt: serverTimestamp(),
        userEmail: currentUser?.email,
        userId: currentUser?.uid,
        status: 'new'
      });
      
      setStep(3);
    } catch (error) {
      console.error("Error saving estimate:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      {/* ── GET ESTIMATE SECTION (Home Only) ── */}
      {isHomePage && (
        <section id="estimate-section" className="estimate-section">
          <div className="container">
            {step === 0 && (
              <div className="reveal">
                <h2 className="estimate-title">Get an estimate for your <span style={{ color: 'var(--color-accent-primary)' }}>Home.</span></h2>
                <p className="estimate-subtitle">Professional interior cost calculator for your dream space.</p>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="glass-panel estimate-card" style={{ maxWidth: '500px' }}>
                    <div className="estimate-icon-container">
                      <Home size={40} />
                      <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '1.2rem', opacity: 0.3 }}>＋</div>
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1rem' }}>Full Home Interiors</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>Select your rooms and style to get a personalized cost estimate.</p>
                    <button onClick={handleStartCalculation} className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Start Calculation</button>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="reveal">
                <h2 className="estimate-title">Which <span style={{ color: 'var(--color-accent-primary)' }}>Rooms</span> are we designing?</h2>
                <div className="option-grid">
                  {rooms.map(room => (
                    <div 
                      key={room.id}
                      onClick={() => toggleRoom(room.id)}
                      className={`glass-panel option-card ${selectedRooms.includes(room.id) ? 'selected' : ''}`}
                    >
                      <div style={{ color: selectedRooms.includes(room.id) ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.4)' }}>
                        {room.icon}
                      </div>
                      <span style={{ fontWeight: 600 }}>{room.label}</span>
                      {selectedRooms.includes(room.id) && <Check size={18} color="var(--color-accent-primary)" style={{ marginLeft: 'auto' }} />}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
                  <button onClick={() => setStep(0)} style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ChevronLeft size={18} /> Back</button>
                  <button 
                    disabled={selectedRooms.length === 0} 
                    onClick={() => setStep(2)} 
                    className="btn-primary"
                    style={{ opacity: selectedRooms.length === 0 ? 0.5 : 1, padding: '0.8rem 2rem' }}
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="reveal">
                <h2 className="estimate-title">Choose your <span style={{ color: 'var(--color-accent-primary)' }}>Style</span> preference</h2>
                <div className="option-grid">
                  {styles_list.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`glass-panel option-card ${selectedStyle === s.id ? 'selected' : ''}`}
                      style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', padding: '1.5rem' }}
                    >
                      <h4 style={{ color: selectedStyle === s.id ? 'var(--color-accent-primary)' : '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{s.label}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
                  <button onClick={() => setStep(1)} style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ChevronLeft size={18} /> Back</button>
                  <button 
                    disabled={!selectedStyle || isSubmitting} 
                    onClick={handleGenerateEstimate} 
                    className="btn-primary"
                    style={{ opacity: (!selectedStyle || isSubmitting) ? 0.5 : 1, padding: '0.8rem 2rem' }}
                  >
                    {isSubmitting ? <><Loader2 size={18} className="spin-animation" /> Saving...</> : <>Generate Estimate <Sparkles size={18} /></>}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="reveal" style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--color-accent-primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#fff', margin: '0 auto 2rem', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)' }}>✓</div>
                <h2 className="estimate-title">Estimate <span style={{ color: 'var(--color-accent-primary)' }}>Request Sent!</span></h2>
                <p className="estimate-subtitle">Thank you! Our design team will analyze your preferences and contact you within 24 hours with a personalized quote.</p>
                
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => {
                      const roomsText = selectedRooms.map(r => rooms.find(room => room.id === r)?.label).join(', ');
                      const styleText = styles_list.find(s => s.id === selectedStyle)?.label;
                      const message = encodeURIComponent(`Hi Rudraksha Design Studio! I'm interested in an interior estimate.\n\nRooms: ${roomsText}\nStyle: ${styleText}`);
                      window.open(`https://wa.me/919898384133?text=${message}`, '_blank');
                    }}
                    className="btn-primary"
                    style={{ background: '#25D366', border: 'none', color: '#fff' }}
                  >
                    <WhatsAppLogoFull size={20} /> Talk on WhatsApp
                  </button>
                  <button onClick={() => { setStep(0); setSelectedRooms([]); setSelectedStyle(null); }} className="btn-outline">Calculate Another</button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── MAIN FOOTER ── */}
      <section className="main-footer">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-container">
              <img src="/logomain.png" alt="Logo" className="footer-logo-img" />
              <h2 className="footer-logo-text">Rudraksha <span className="navbar-logo-accent">Design Studio</span></h2>
            </Link>
            <p className="footer-about">
              Turning visions into breathtaking reality. We are a fresh team of designers dedicated to creating spaces that tell your unique story.
            </p>
            <div className="footer-social-links">
              <a href="https://www.instagram.com/rudraksha_design_studio?igsh=MXFhNmdubHU2NW0zOA==" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><Instagram size={20} /></a>
              <a href="https://wa.me/919898384133" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><WhatsAppLogoFull size={20} /></a>
              <a href="#" className="footer-social-icon"><Facebook size={20} /></a>
            </div>
          </div>

          <div className="footer-link-col">
            <h4 className="footer-link-title">Quick Links</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/?scroll=about" className="footer-link">About Us</Link>
            <Link to="/projects" className="footer-link">Explore Designs</Link>
          </div>

          <div className="footer-link-col">
            <h4 className="footer-link-title">Contact</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}><Phone size={16} /> +91 98983 84133</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', wordBreak: 'break-all' }}><Mail size={16} /> contact@rudrakshadesign.com</div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Rudraksha Design Studio. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" className="footer-link" style={{ fontSize: '0.9rem' }}>Privacy Policy</a>
            <a href="#" className="footer-link" style={{ fontSize: '0.9rem' }}>Terms of Use</a>
          </div>
        </div>

        {/* Floating Social Buttons */}
        <div className="floating-actions">
          {/* WhatsApp Floating Icon */}
          <a 
            href="https://wa.me/919898384133" 
            target="_blank" 
            rel="noopener noreferrer"
            className="float-btn"
            style={{ background: '#25D366' }}
            title="Chat on WhatsApp"
          >
            <WhatsAppLogoFull size={32} />
          </a>

          {/* Instagram Floating Icon */}
          <a 
            href="https://www.instagram.com/rudraksha_design_studio?igsh=MXFhNmdubHU2NW0zOA==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="float-btn"
            style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
            title="Follow on Instagram"
          >
            <InstagramLogoOfficial size={34} />
          </a>
        </div>
      </section>
    </footer>
  );
}

