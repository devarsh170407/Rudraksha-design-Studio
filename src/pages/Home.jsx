import React, { useState, useEffect } from 'react';
import { get } from 'idb-keyval';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
  }, [searchParams]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const stored = await get('localProjects') || [];
        stored.sort((a, b) => b.createdAt - a.createdAt);
        const withThumbs = stored.map(p => {
          const f = p.images && p.images[p.thumbnailIndex] ? p.images[p.thumbnailIndex] : null;
          return { ...p, displayThumbnail: f ? URL.createObjectURL(f) : null };
        });
        setProjects(withThumbs);
      } catch (e) {
        console.error('Error fetching projects:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    return () => projects.forEach(p => { if (p.displayThumbnail) URL.revokeObjectURL(p.displayThumbnail); });
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
    <div className="projects-page">

      {/* ── PAGE HEADER ── */}
      <header style={{ padding: '3rem 3% 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
          background: 'linear-gradient(to right, #ffffff, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '0.4rem',
        }}>Design Gallery</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
          Browse inspiring spaces crafted by Rudraksha Design Studio.
        </p>
      </header>

      {/* ── CATEGORY VISUAL CARDS ── */}
      <section style={{ padding: '2rem 3%' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
          BROWSE BY CATEGORY
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
          {CATEGORIES.map(cat => {
            const active = filterRoom === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setFilterRoom(cat.name)}
                style={{
                  flex: '0 0 auto',
                  position: 'relative',
                  width: cat.name === 'All' ? '80px' : '130px',
                  height: '90px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: active ? '2.5px solid #d4af37' : '2px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  background: cat.name === 'All' ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : 'transparent',
                  transition: 'border-color 0.2s, transform 0.2s',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {cat.image && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: active
                    ? 'linear-gradient(to top, rgba(212,175,55,0.6), rgba(0,0,0,0.4))'
                    : 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))',
                }} />
                <span style={{
                  position: 'absolute', bottom: '8px', left: 0, right: 0,
                  textAlign: 'center', fontSize: '0.7rem', fontWeight: 600,
                  color: 'white', padding: '0 4px', lineHeight: 1.3,
                }}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Style filter pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setFilterStyle(s)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '50px',
                fontSize: '0.82rem', fontWeight: 500,
                fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
                background: filterStyle === s ? '#2563eb' : 'rgba(255,255,255,0.05)',
                color: filterStyle === s ? 'white' : '#a1a1aa',
                border: filterStyle === s ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.09)',
                transition: 'all 0.2s',
              }}
            >
              {s === 'All' ? 'All Styles' : s}
            </button>
          ))}
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
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
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>{category} Designs</h2>
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
                        <h3 className="project-card-title">{project.title}</h3>
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

      <style>{`
        .projects-page { min-height: 80vh; width: 100%; max-width: 100%; }
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
    </div>
  );
}
