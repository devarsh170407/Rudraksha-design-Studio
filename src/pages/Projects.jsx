import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

export default function Projects() {
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
        height: 'clamp(380px, 50vh, 560px)', overflow: 'hidden',
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
            background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.4)',
            borderRadius: '50px', padding: '0.3rem 0.9rem',
            marginBottom: '1.25rem', width: 'fit-content'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent-primary)' }} />
            <span style={{ color: 'var(--color-accent-primary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
              PREMIUM INTERIOR DESIGN
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 700, color: 'white',
            lineHeight: 1.2, marginBottom: '0.75rem', letterSpacing: '-0.02em',
          }}>
            Interiors you'll<br />
            <span style={{ color: 'var(--color-accent-primary)' }}>absolutely love.</span>
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
              onClick={() => { const el = document.getElementById('explore-gallery'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Browse by Category
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

      {/* ── BROWSE BY CATEGORY + GALLERY ── */}
      <div id="explore-gallery" style={{ padding: '2.5rem 3% 4rem' }}>

        {/* Dropdown filters */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            BROWSE BY CATEGORY
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Category dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500 }}>Room Type</label>
              <select
                value={filterRoom}
                onChange={e => setFilterRoom(e.target.value)}
                style={{
                  padding: '0.65rem 2.5rem 0.65rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: filterRoom === 'All' ? '#a1a1aa' : '#fff',
                  fontSize: '0.9rem',
                  fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '200px',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.85rem center',
                }}
              >
                <option value="All" style={{ background: '#0f172a' }}>All Categories</option>
                {CATEGORIES.filter(c => c.name !== 'All').map(cat => (
                  <option key={cat.name} value={cat.name} style={{ background: '#0f172a' }}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Style dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500 }}>Style</label>
              <select
                value={filterStyle}
                onChange={e => setFilterStyle(e.target.value)}
                style={{
                  padding: '0.65rem 2.5rem 0.65rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: filterStyle === 'All' ? '#a1a1aa' : '#fff',
                  fontSize: '0.9rem',
                  fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '160px',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.85rem center',
                }}
              >
                {STYLES.map(s => (
                  <option key={s} value={s} style={{ background: '#0f172a' }}>{s === 'All' ? 'All Styles' : s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects */}
        {filterRoom === 'All' ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <p style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: '#fff' }}>Select a category to explore designs</p>
            <p style={{ fontSize: '0.88rem' }}>Use the dropdown above to filter by room type or style.</p>
          </div>
        ) : loading ? (
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
                    style={{ color: 'var(--color-accent-primary)', fontSize: '0.88rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
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
                      
                      {/* Status Badge */}
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        padding: '0.3rem 0.7rem', borderRadius: '6px',
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.05em', zIndex: 2,
                        background: project.projectStatus === 'In Progress' ? 'rgba(234, 179, 8, 0.9)' : 'rgba(34, 197, 94, 0.9)',
                        color: project.projectStatus === 'In Progress' ? '#000' : '#fff',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        {project.projectStatus || 'Completed'}
                      </div>

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
      </div>

      <style>{`
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
