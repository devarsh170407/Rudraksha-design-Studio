import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Clock, Shield, IndianRupee, Paintbrush, Heart, Sparkles, Layers, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  { name: 'All',                    image: '' },
  { name: 'Home Interiors',         image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Modular Kitchen',        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Living Room',            image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Bedroom',                image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Wardrobe',               image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Space Saving Furniture', image: 'https://images.unsplash.com/photo-1583847268964-b28e2023d537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Home Office',            image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
  { name: 'Bathroom',               image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75' },
];

const STYLES = ['All', 'Modern', 'Classic', 'Minimalist'];

export default function Home() {
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const { currentUser }               = useAuth();
  const navigate                      = useNavigate();
  const [searchParams]                = useSearchParams();
  const [filterRoom,  setFilterRoom]  = useState(searchParams.get('category') || 'All');
  const [filterStyle, setFilterStyle] = useState('All');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setFilterRoom(cat);
    
    const scroll = searchParams.get('scroll');
    if (scroll === 'about') {
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          displayThumbnail: doc.data().images[doc.data().thumbnailIndex]
        }));
        setProjects(docs);
      } catch (e) {
        console.error('Error fetching projects:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchRoom  = filterRoom  === 'All' || p.category === filterRoom;
    const matchStyle = filterStyle === 'All' || p.style    === filterStyle;
    return matchRoom && matchStyle;
  });

  const handleProjectClick = id => {
    if (!currentUser) navigate('/login');
    else navigate(`/project/${id}`);
  };

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section style={{
        width: '100%', position: 'relative',
        height: 'clamp(420px, 60vh, 680px)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=85")',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          transform: 'scale(1.03)', transition: 'transform 8s ease',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(5,5,20,0.82) 0%, rgba(5,5,20,0.45) 55%, rgba(5,5,20,0.05) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 4rem', maxWidth: '700px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '50px', padding: '0.3rem 0.9rem',
            marginBottom: '1.25rem', width: 'fit-content'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
            <span style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
              PREMIUM INTERIOR DESIGN
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 700, color: 'white',
            lineHeight: 1.2, marginBottom: '0.75rem', letterSpacing: '-0.02em',
          }}>
            Interiors you'll<br />
            <span style={{ color: '#d4af37' }}>absolutely love.</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
            lineHeight: 1.65, marginBottom: '2rem', maxWidth: '480px',
          }}>
            From modular kitchens to luxury living rooms — we craft spaces that reflect your lifestyle. Without the stress.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', borderRadius: '10px' }}
              onClick={() => { const el = document.getElementById('gallery'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Explore Designs
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

      {/* ── ABOUT US SECTION ── */}
      <section id="about" style={{ padding: '8rem 4rem', background: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%', height: '500px', borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Studio Interior" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="glass-panel" style={{
              position: 'absolute', bottom: '-2rem', right: '-2rem', padding: '1.5rem',
              maxWidth: '220px', textAlign: 'center', border: '1px solid rgba(212,175,55,0.3)'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#d4af37', fontWeight: 700, marginBottom: '0.2rem' }}>NEW</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em' }}>FRESH PERSPECTIVE IN DESIGN</p>
            </div>
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#d4af37' }} />
              <span style={{ color: '#d4af37', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.2em' }}>OUR STORY</span>
            </div>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '2.5rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Designing spaces that <span style={{ color: '#d4af37' }}>tell your story.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              At Rudraksha Design Studio, we are a fresh team of designers fueled by passion and a commitment to excellence. We believe that your home should be a direct reflection of your personality and aspirations. 
              <br /><br />
              As a growing studio, we bring a modern perspective and a tireless dedication to every project. We don't just design rooms; we create personal environments where your vision comes to life with genuine care and innovation.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: '#d4af37', fontSize: '1.5rem' }}>✦</div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.4rem' }}>Exquisite Detail</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Every corner is curated with precision and premium materials.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: '#d4af37', fontSize: '1.5rem' }}>✦</div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.4rem' }}>Timely Delivery</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Your dream space, completed on schedule, without compromises.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Accent */}
        <div style={{ 
          position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', 
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)', zIndex: 0
        }} />
      </section>

      {/* ── WHY CHOOSE US AUTO-SCROLLER ── */}
      <section style={{ 
        padding: '6rem 0', background: 'var(--color-bg-primary)', position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '0 4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '5rem', letterSpacing: '-0.02em' }}>
            Why Choose <span style={{ color: '#d4af37' }}>Rudraksha</span>
          </h2>
        </div>

        {/* Slider Track with Fading Masks */}
        <div style={{ 
          position: 'relative', width: '100%', overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}>
          <div className="slider-track" style={{ 
            display: 'flex', width: 'max-content', gap: '6rem',
            animation: 'scroll 30s linear infinite'
          }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '6rem', alignItems: 'center' }}>
                {[
                  { icon: <Heart size={48} />, label: "Personalized Design", color: "#ff4d4d" },
                  { icon: <Shield size={48} />, label: "Quality Materials", color: "#4d94ff" },
                  { icon: <IndianRupee size={48} />, label: "Honest Pricing", color: "#22c55e" },
                  { icon: <Sparkles size={48} />, label: "Modern Aesthetics", color: "#ffcc00" },
                  { icon: <Clock size={48} />, label: "Timely Delivery", color: "#ff66b2" },
                  { icon: <Layers size={48} />, label: "3D Visuals", color: "#a64dff" },
                  { icon: <Paintbrush size={48} />, label: "Expert Execution", color: "#00cccc" },
                  { icon: <CheckCircle size={48} />, label: "Genuine Care", color: "#ff8533" }
                ].map((item, idx) => (
                  <div key={idx} className="feature-item-slider" style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem',
                    minWidth: '240px'
                  }}>
                    <div style={{ color: item.color, transition: 'transform 0.3s ease' }}>{item.icon}</div>
                    <h4 style={{ 
                      color: 'white', fontSize: '1rem', fontWeight: 500, margin: 0, 
                      letterSpacing: '0.02em', whiteSpace: 'nowrap'
                    }}>
                      {item.label}
                    </h4>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY SECTION ── */}
      <div id="gallery" className="projects-page">





        {/* Projects */}
        <section style={{ padding: '0 3% 4rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
              Loading breathtaking designs...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
              No projects found for this category yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              {Object.entries(
                filteredProjects.reduce((acc, p) => {
                  if (!acc[p.category]) acc[p.category] = [];
                  acc[p.category].push(p);
                  return acc;
                }, {})
              ).map(([category, catProjects]) => (
                <section key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600 }}>{category} Designs</h3>
                    <button
                      onClick={() => setFilterRoom(category)}
                      style={{ color: '#d4af37', fontSize: '0.88rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                    >
                      See All →
                    </button>
                  </div>
                  <div style={{
                    display: 'flex', gap: '1.5rem',
                    overflowX: 'auto', paddingBottom: '1rem',
                    scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
                  }} className="hide-scrollbar">
                    {catProjects.map((project, i) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="project-card"
                        style={{ animation: `fadeInUp 0.5s ease ${i * 0.08}s forwards` }}
                      >
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundImage: `url(${project.displayThumbnail || 'https://via.placeholder.com/400x300?text=No+Image'})`,
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          transition: 'transform 0.6s ease',
                        }} className="project-img-bg" />
                        <div className="project-card-overlay">
                          <h4 className="project-card-title">{project.title}</h4>
                          <p className="project-card-subtitle">{project.style}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .projects-page { min-height: 60vh; width: 100%; max-width: 100%; }
        .feature-item-slider:hover > div:first-child { transform: scale(1.2); }
        
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .slider-track:hover { animation-play-state: paused; }
        
        .project-card {
          min-width: 320px; max-width: 400px; flex: 0 0 auto;
          scroll-snap-align: start; position: relative;
          height: 240px; border-radius: 12px; overflow: hidden;
          cursor: pointer; transition: all var(--transition-smooth);
          opacity: 0; transform: translateY(20px);
        }
        .project-card:hover { transform: translateY(-6px) !important; box-shadow: 0 12px 24px rgba(0,0,0,0.4); }
        .project-card-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 2rem 1.5rem 1.2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
          display: flex; flex-direction: column; justify-content: flex-end; pointer-events: none;
        }
        .project-card-title { font-size: 1.1rem; font-weight: 600; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); margin-bottom: 0.2rem; }
        .project-card-subtitle { color: rgba(255,255,255,0.7); font-size: 0.85rem; }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .project-img-bg:hover { transform: scale(1.05); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 480px) {
          .project-card { min-width: 85vw; max-width: 85vw; }
        }
      `}</style>
    </>
  );
}
