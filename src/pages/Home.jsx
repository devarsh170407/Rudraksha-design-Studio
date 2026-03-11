import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Modular Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Wardrobe', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'TV Unit', image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Study Room', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #f3e5ab 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
          Redefine Your Living Space
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          Discover curated interior designs tailored to your lifestyle. From elegant modular kitchens to luxurious living rooms, explore premium concepts that inspire.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/projects')}>
            Explore Designs
          </button>
        </div>
      </section>

      {/* Category Section */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>Browse by Category</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {categories.map((cat, index) => (
            <div 
              key={cat.name} 
              className="category-card"
              onClick={() => navigate('/projects')}
              style={{
                position: 'relative',
                height: '350px',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                animation: `fadeInUp 0.6s ease ${index * 0.1}s forwards`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  backgroundImage: `url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
                className="category-bg"
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem 1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inject Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .category-card:hover .category-bg {
          transform: scale(1.08);
        }
      `}</style>
    </>
  );
}
