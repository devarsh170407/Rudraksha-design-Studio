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
          <h2 style={styles.estimateTitle}>Get an estimate for your <span style={{ color: 'var(--color-accent-primary)' }}>Home.</span></h2>
          <p style={styles.estimateSubtitle}>Calculate the cost of doing up your home interiors now.</p>
          
          <div style={styles.cardGrid}>
            <div className="glass-panel" style={styles.estimateCard}>
              <div style={styles.iconContainer}>
                <Home size={40} color="var(--color-accent-primary)" />
                <div style={styles.plusOverlay}>＋</div>
              </div>
              <h3 style={styles.cardTitle}>Full Home Interiors</h3>
              <p style={styles.cardDesc}>Get the estimate price for your full home interiors.</p>
              <button style={styles.estimateBtn}>Get Free Estimate</button>
            </div>

            <div className="glass-panel" style={styles.estimateCard}>
              <div style={styles.iconContainer}>
                <Coffee size={40} color="var(--color-accent-primary)" />
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
    background: 'rgba(212,175,55,0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(212,175,55,0.1)',
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
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
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
