import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Play, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './Projects.css';



const STYLES = ['All', 'Modern', 'Classic', 'Minimalist', 'Luxury'];

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

    const scrollVal = searchParams.get('scroll');
    if (scrollVal) {
      setTimeout(() => {
        const el = document.getElementById(scrollVal);
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
          displayThumbnail: (doc.data().images && doc.data().images[doc.data().thumbnailIndex]) || 'https://via.placeholder.com/400x300?text=No+Image'
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
    <div className="projects-container">
      {/* ── PROJECTS HERO ── */}
      <section className="projects-hero">
        <div className="projects-hero-bg" />
        <div className="projects-hero-overlay" />
        
        <div className="hero-content slide-right">
          <div className="hero-badge">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)', boxShadow: '0 0 10px var(--color-accent-primary)' }} />
            Our Portfolio
          </div>
          
          <h1 className="hero-title">
            Curated Design<br />
            <span className="gold-text">Masterpieces.</span>
          </h1>
          
          <p className="hero-description">
            Explore our collection of premium interior designs, from concept to completion.
          </p>
        </div>
      </section>

      {/* ── FILTERS SECTION ── */}
      <section className="filters-section">
        <div className="filters-wrapper">
          <div className="filter-group">
            <label className="filter-label"><Filter size={14} style={{ marginRight: '8px' }} /> Category</label>
            <select
              value={filterRoom}
              onChange={e => setFilterRoom(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <optgroup label="🏠 Residential Interior Design (Home)">
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kids Room">Kids Room</option>
                <option value="Guest Room">Guest Room</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Dining Room">Dining Room</option>
                <option value="Study Room / Home Office">Study Room / Home Office</option>
                <option value="Utility / Laundry Area">Utility / Laundry Area</option>
                <option value="Balcony / Terrace">Balcony / Terrace</option>
                <option value="Entrance / Foyer">Entrance / Foyer</option>
                <option value="Pooja Room (important in Indian homes)">Pooja Room (important in Indian homes)</option>
                <option value="Walk-in Closet / Wardrobe">Walk-in Closet / Wardrobe</option>
              </optgroup>
              <optgroup label="🏢 Commercial Interior Design">
                <option value="Office">Office</option>
                <option value="Retail Store / Showroom">Retail Store / Showroom</option>
                <option value="Restaurant / Café">Restaurant / Café</option>
                <option value="Hotel / Resort">Hotel / Resort</option>
                <option value="Hospital / Clinic">Hospital / Clinic</option>
                <option value="Educational Spaces (Schools, Colleges, Libraries)">Educational Spaces (Schools, Colleges, Libraries)</option>
                <option value="Co-working Spaces">Co-working Spaces</option>
                <option value="Salons / Spa">Salons / Spa</option>
              </optgroup>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label"><Sparkles size={14} style={{ marginRight: '8px' }} /> Design Style</label>
            <select
              value={filterStyle}
              onChange={e => setFilterStyle(e.target.value)}
              className="filter-select"
            >
              {STYLES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Styles' : s}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            {filteredProjects.length} Projects found
          </div>
        </div>
      </section>

      {/* ── PROJECTS GALLERY ── */}
      <section className="projects-gallery" id="explore-gallery">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Loading breathtaking designs...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem', background: 'var(--color-bg-secondary)', borderRadius: '30px', border: '1px dashed var(--glass-border)' }}>
             <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No projects found</h3>
             <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters to see more designs.</p>
             <button onClick={() => { setFilterRoom('All'); setFilterStyle('All'); }} className="btn-outline" style={{ marginTop: '2rem' }}>Reset Filters</button>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project, i) => (
              <div 
                key={project.id} 
                className="project-card-v2 reveal" 
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => handleProjectClick(project.id)}
              >
                <div 
                  style={{ 
                    position: 'absolute', inset: 0, 
                    backgroundImage: `url(${project.displayThumbnail || 'https://via.placeholder.com/400x300?text=No+Image'})`, 
                    backgroundSize: 'cover', backgroundPosition: 'center', 
                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                  className="project-img-bg" 
                />
                
                <div className={`project-status-badge ${project.projectStatus === 'In Progress' ? 'status-progress' : 'status-completed'}`}>
                  {project.projectStatus || 'Completed'}
                </div>

                <div className="project-card-overlay-v2">
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>{project.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>{project.style} • {project.category}</p>
                  </div>
                  
                  <button 
                    className="btn-gold" 
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', borderRadius: '8px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = encodeURIComponent(`Hi! I'm interested in the "${project.title}" project. Can you provide more details?`);
                      window.open(`https://wa.me/919898384133?text=${msg}`, '_blank');
                    }}
                  >
                    Discuss Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
