import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Coffee, Info, Mail, Phone, Instagram, Facebook, Twitter, Check, ChevronRight, ChevronLeft, Sparkles, Box, Layout, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const WhatsAppIcon = ({ size = 20, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L22 4l-1.5 5.5Z" />
    <path d="M17 10c-.2-.4-.5-.8-1-1-.4-.1-.7 0-1 .2l-.3.3c-.3.3-.3.8 0 1.1l1.5 1.5c.3.3.8.3 1.1 0l.3-.3c.2-.3.3-.6.2-1Z" />
  </svg>
);

const WhatsAppLogoFull = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
    <footer style={styles.footer}>
      {/* ── GET ESTIMATE SECTION (Home Only) ── */}
      {isHomePage && (
        <section style={styles.estimateSection}>
          <div style={styles.container}>
            {step === 0 && (
              <>
                <h2 style={styles.estimateTitle}>Get an estimate for your <span style={{ color: 'var(--color-accent-primary)' }}>Home.</span></h2>
                <p style={styles.estimateSubtitle}>Professional interior cost calculator for your dream space.</p>
                
                <div style={styles.cardGrid}>
                  <div className="glass-panel" style={{ ...styles.estimateCard, maxWidth: '500px', margin: '0 auto' }}>
                    <div style={styles.iconContainer}>
                      <Home size={40} color="var(--color-accent-primary)" />
                      <div style={styles.plusOverlay}>＋</div>
                    </div>
                    <h3 style={styles.cardTitle}>Full Home Interiors</h3>
                    <p style={styles.cardDesc}>Select your rooms and style to get a personalized cost estimate.</p>
                    <button onClick={handleStartCalculation} style={styles.estimateBtn}>Start Calculation</button>
                  </div>
                </div>
              </>
            )}

          {step === 1 && (
            <div style={styles.stepContainer}>
              <h2 style={styles.stepTitle}>Which <span style={{ color: 'var(--color-accent-primary)' }}>Rooms</span> are we designing?</h2>
              <div style={styles.optionGrid}>
                {rooms.map(room => (
                  <div 
                    key={room.id}
                    onClick={() => toggleRoom(room.id)}
                    className="glass-panel"
                    style={{
                      ...styles.optionCard,
                      border: selectedRooms.includes(room.id) ? '2px solid var(--color-accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedRooms.includes(room.id) ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <div style={{ color: selectedRooms.includes(room.id) ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.4)' }}>
                      {room.icon}
                    </div>
                    <span>{room.label}</span>
                    {selectedRooms.includes(room.id) && <Check size={16} color="var(--color-accent-primary)" />}
                  </div>
                ))}
              </div>
              <div style={styles.navBtns}>
                <button onClick={() => setStep(0)} style={styles.backBtn}><ChevronLeft size={18} /> Back</button>
                <button 
                  disabled={selectedRooms.length === 0} 
                  onClick={() => setStep(2)} 
                  style={{ ...styles.estimateBtn, opacity: selectedRooms.length === 0 ? 0.5 : 1 }}
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={styles.stepContainer}>
              <h2 style={styles.stepTitle}>Choose your <span style={{ color: 'var(--color-accent-primary)' }}>Style</span> preference</h2>
              <div style={styles.styleGrid}>
                {styles_list.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className="glass-panel"
                    style={{
                      ...styles.styleCard,
                      border: selectedStyle === s.id ? '2px solid var(--color-accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedStyle === s.id ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <h4 style={{ color: selectedStyle === s.id ? 'var(--color-accent-primary)' : '#fff', marginBottom: '0.4rem' }}>{s.label}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
                  </div>
                ))}
              </div>
              <div style={styles.navBtns}>
                <button onClick={() => setStep(1)} style={styles.backBtn}><ChevronLeft size={18} /> Back</button>
                <button 
                  disabled={!selectedStyle || isSubmitting} 
                  onClick={handleGenerateEstimate} 
                  style={{ ...styles.estimateBtn, opacity: (!selectedStyle || isSubmitting) ? 0.5 : 1 }}
                >
                  {isSubmitting ? <><Loader2 size={18} className="spin-animation" /> Saving...</> : <>Generate Estimate <Sparkles size={18} /></>}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ ...styles.stepContainer, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={styles.stepTitle}>Estimate <span style={{ color: 'var(--color-accent-primary)' }}>Request Sent!</span></h2>
              <p style={{ ...styles.estimateSubtitle, margin: '0 auto 3rem' }}>Thank you! Our design team will analyze your preferences and contact you within 24 hours with a personalized quote.</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    const roomsText = selectedRooms.map(r => rooms.find(room => room.id === r)?.label).join(', ');
                    const styleText = styles_list.find(s => s.id === selectedStyle)?.label;
                    const message = encodeURIComponent(`Hi Rudraksha Design Studio! I'm interested in an interior estimate.\n\nRooms: ${roomsText}\nStyle: ${styleText}`);
                    window.open(`https://wa.me/919898384133?text=${message}`, '_blank');
                  }}
                  style={{ ...styles.estimateBtn, background: '#25D366', color: '#fff' }}
                >
                  <WhatsAppLogoFull size={20} /> Talk on WhatsApp
                </button>
                <button onClick={() => { setStep(0); setSelectedRooms([]); setSelectedStyle(null); }} style={styles.estimateBtn}>Calculate Another</button>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* ── MAIN FOOTER ── */}
      <section style={styles.mainFooter}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.brandCol}>
              <Link to="/" style={styles.footerLogoContainer}>
                <img src="/logomain.png" alt="Logo" style={styles.footerLogoImg} />
                <h2 style={styles.footerLogoText}>Rudraksha <span style={{ color: '#d4af37' }}>Design Studio</span></h2>
              </Link>
              <p style={styles.footerAbout}>
                Turning visions into breathtaking reality. We are a fresh team of designers dedicated to creating spaces that tell your unique story.
              </p>
              <div style={styles.socialLinks}>
                <a href="https://www.instagram.com/rudraksha_design_studio?igsh=MXFhNmdubHU2NW0zOA==" target="_blank" rel="noopener noreferrer" style={styles.socialIcon}><Instagram size={20} /></a>
                <a href="#" style={styles.socialIcon}><Facebook size={20} /></a>
                <a href="#" style={styles.socialIcon}><Twitter size={20} /></a>
              </div>
            </div>

            <div style={styles.linkCol}>
              <h4 style={styles.linkTitle}>Quick Links</h4>
              <Link to="/" style={styles.footerLink}>Home</Link>
              <Link to="/?scroll=about" style={styles.footerLink}>About Us</Link>
              <Link to="/projects" style={styles.footerLink}>Explore Designs</Link>
            </div>

            <div style={styles.linkCol}>
              <h4 style={styles.linkTitle}>Contact</h4>
              <div style={styles.contactItem}><Phone size={16} /> +91 XXXXXXXXXX</div>
              <div style={styles.contactItem}><Mail size={16} /> contact@rudrakshadesign.com</div>
            </div>
          </div>

          <div style={styles.bottomBar}>
            <p style={styles.copyright}>
              © {currentYear} Rudraksha Design Studio. All rights reserved.
            </p>
            <div style={styles.legalLinks}>
              <a href="#" style={styles.legalLink}>Privacy Policy</a>
              <a href="#" style={styles.legalLink}>Terms of Use</a>
            </div>
          </div>
        </div>

        {/* Floating Social Buttons */}
        <div style={styles.floatingButtonsContainer}>
          {/* WhatsApp Floating Icon */}
          <a 
            href="https://wa.me/919898384133" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.whatsappFloat}
            title="Chat on WhatsApp"
          >
            <div style={{ position: 'relative' }}>
              <div style={styles.whatsappPulse}></div>
              <WhatsAppLogoFull size={32} />
            </div>
          </a>

          {/* Instagram Floating Icon */}
          <a 
            href="https://www.instagram.com/rudraksha_design_studio?igsh=MXFhNmdubHU2NW0zOA==" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.instagramFloat}
            title="Follow on Instagram"
          >
            <div style={{ position: 'relative' }}>
              <div style={styles.instagramPulse}></div>
              <Instagram size={28} />
            </div>
          </a>
        </div>
      </section>
    </footer>
  );
}

const styles = {
  footer: {
    width: '100%',
    background: '#fff',
  },
  estimateSection: {
    padding: '8rem 2rem',
    background: 'var(--color-bg-primary)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  estimateTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
  },
  estimateSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1.1rem',
    marginBottom: '4rem',
    fontWeight: 500,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    justifyContent: 'center',
    maxWidth: '900px',
    margin: '0 auto',
  },
  estimateCard: {
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'rgba(212,175,55,0.08)',
    borderRadius: '8px',
    border: '1px solid rgba(212,175,55,0.2)',
  },
  plusOverlay: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '1.2rem',
    color: 'rgba(212,175,55,0.3)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '1rem',
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
    marginBottom: '2.5rem',
    lineHeight: 1.6,
  },
  estimateBtn: {
    background: 'var(--color-accent-primary)',
    color: '#000',
    border: 'none',
    padding: '1rem 2.5rem',
    borderRadius: '4px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  stepContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    animation: 'fadeIn 0.5s ease',
  },
  stepTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '3rem',
    letterSpacing: '-0.02em',
  },
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
    marginBottom: '3rem',
  },
  optionCard: {
    padding: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  styleCard: {
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
  },
  navBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    alignItems: 'center',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.3s',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    background: 'var(--color-accent-primary)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    color: '#000',
    margin: '0 auto 2rem',
  },
  mainFooter: {
    background: 'var(--color-bg-primary)',
    padding: '5rem 2rem 2rem',
    color: '#fff',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '4rem',
    paddingBottom: '4rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  brandCol: {
    maxWidth: '400px',
  },
  footerLogoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    textDecoration: 'none',
  },
  footerLogoImg: {
    height: '40px',
    width: 'auto',
  },
  footerLogoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  footerAbout: {
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.8,
    fontSize: '0.95rem',
    marginBottom: '2rem',
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transition: 'all 0.3s ease',
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  linkTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#d4af37',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.3s ease',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.95rem',
  },
  bottomBar: {
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.88rem',
  },
  legalLinks: {
    display: 'flex',
    gap: '2rem',
  },
  legalLink: {
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: '0.88rem',
  },
  floatingButtonsContainer: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    zIndex: 1000,
  },
  instagramFloat: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    color: 'white',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(220, 39, 67, 0.4)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  instagramPulse: {
    position: 'absolute',
    inset: '-10px',
    border: '2px solid #dc2743',
    borderRadius: '16px',
    animation: 'pulse 2s infinite',
    opacity: 0,
  },
  whatsappFloat: {
    width: '60px',
    height: '60px',
    background: '#25D366',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  whatsappPulse: {
    position: 'absolute',
    inset: '-10px',
    border: '2px solid #25D366',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    opacity: 0,
  }
};
