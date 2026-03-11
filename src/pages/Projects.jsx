import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section style={{
        width: '100%',
        position: 'relative',
        height: 'clamp(420px, 60vh, 680px)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          transform: 'scale(1.03)',
          transition: 'transform 8s ease',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(5,5,20,0.82) 0%, rgba(5,5,20,0.45) 55%, rgba(5,5,20,0.05) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
          maxWidth: '700px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '50px',
            padding: '0.3rem 0.9rem',
            marginBottom: '1.25rem',
            width: 'fit-content'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
            <span style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
              PREMIUM INTERIOR DESIGN
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 700, color: 'white',
            lineHeight: 1.2, marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            Interiors you'll<br />
            <span style={{ color: '#d4af37' }}>absolutely love.</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
            lineHeight: 1.65, marginBottom: '2rem', maxWidth: '480px',
          }}>
            From modular kitchens to luxury living rooms — we craft spaces that reflect your lifestyle. Without the stress.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', borderRadius: '10px' }}
              onClick={() => navigate('/')}
            >
              Browse Designs
            </button>
            <button
              style={{
                padding: '0.85rem 2rem', fontSize: '0.95rem', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.3)', color: 'white',
                background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
                fontFamily: "'Outfit', sans-serif", cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onClick={() => navigate('/login')}
            >
              Get Started Free
            </button>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))',
        }} />
      </section>
    </>
  );
}
