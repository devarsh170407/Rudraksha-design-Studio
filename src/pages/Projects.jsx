import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Play, ArrowLeft, Filter, Sparkles } from 'lucide-react';
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

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

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
        <motion.div 
          style={{ y: yHero }}
          className="projects-hero-bg" 
        />
        <div className="projects-hero-overlay" />
        
        <motion.div style={{ opacity: opacityHero }} className="hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="hero-badge"
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)', boxShadow: '0 0 10px var(--color-accent-primary)' }} />
            Our Portfolio
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hero-title"
          >
            Curated Design<br />
            <span className="gold-text">Masterpieces.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-description"
          >
            Explore our collection of premium interior designs, from concept to completion.
          </motion.p>
        </motion.div>
      </section>

      {/* ── FILTERS SECTION ── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="filters-section"
      >
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
      </motion.section>

      {/* ── PROJECTS GALLERY ── */}
      <section className="projects-gallery" id="explore-gallery">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Loading breathtaking designs...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="empty-state"
            style={{ textAlign: 'center', padding: '6rem', background: 'var(--color-bg-secondary)', borderRadius: '30px', border: '1px dashed var(--glass-border)' }}
          >
             <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No projects found</h3>
             <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters to see more designs.</p>
             <button onClick={() => { setFilterRoom('All'); setFilterStyle('All'); }} className="btn-gold" style={{ marginTop: '2rem' }}>Reset Filters</button>
          </motion.div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project, i) => (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="project-card-v2" 
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
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold" 
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', borderRadius: '8px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = encodeURIComponent(`Hi! I'm interested in the "${project.title}" project. Can you provide more details?`);
                      window.open(`https://wa.me/919898384133?text=${msg}`, '_blank');
                    }}
                  >
                    Discuss Project
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
