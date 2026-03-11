import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Coffee, Info, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      {/* ── GET ESTIMATE SECTION ── */}
      <section style={styles.estimateSection}>
        <div style={styles.container}>
          <h2 style={styles.estimateTitle}>Get an estimate for your <span style={{ color: '#ff4d4d' }}>Home.</span></h2>
          <p style={styles.estimateSubtitle}>Calculate the cost of doing up your home interiors now.</p>
          
          <div style={styles.cardGrid}>
            <div style={styles.estimateCard}>
              <div style={styles.iconContainer}>
                <Home size={40} color="#333" />
                <div style={styles.plusOverlay}>＋</div>
              </div>
              <h3 style={styles.cardTitle}>Full Home Interiors</h3>
              <p style={styles.cardDesc}>Get the estimate price for your full home interiors.</p>
              <button style={styles.estimateBtn}>Get Free Estimate</button>
            </div>

            <div style={styles.estimateCard}>
              <div style={styles.iconContainer}>
                <Coffee size={40} color="#333" />
                <div style={styles.plusOverlay}>＋</div>
              </div>
              <h3 style={styles.cardTitle}>Kitchen</h3>
              <p style={styles.cardDesc}>Get costing for your kitchen interiors.</p>
              <button style={styles.estimateBtn}>Get Free Estimate</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN FOOTER ── */}
      <section style={styles.mainFooter}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.brandCol}>
              <h2 style={styles.footerLogo}>Rudraksha <span style={{ color: '#d4af37' }}>Design Studio</span></h2>
              <p style={styles.footerAbout}>
                Turning visions into breathtaking reality. We are a fresh team of designers dedicated to creating spaces that tell your unique story.
              </p>
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialIcon}><Instagram size={20} /></a>
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
    padding: '4rem 2rem',
    background: '#fafafa',
    textAlign: 'center',
    borderTop: '1px solid #eee',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  estimateTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#333',
    marginBottom: '0.5rem',
  },
  estimateSubtitle: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '3rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    justifyContent: 'center',
  },
  estimateCard: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    border: '1px solid #f0f0f0',
    transition: 'transform 0.3s ease',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f8f8f8',
    borderRadius: '12px',
  },
  plusOverlay: {
    position: 'absolute',
    top: '0',
    right: '-5px',
    fontSize: '1.5rem',
    color: '#ddd',
    fontWeight: 300,
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: '0.8rem',
  },
  cardDesc: {
    color: '#777',
    fontSize: '0.95rem',
    marginBottom: '2rem',
    lineHeight: 1.5,
  },
  estimateBtn: {
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'background 0.3s ease',
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
  footerLogo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
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
  }
};
