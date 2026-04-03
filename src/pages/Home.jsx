import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Clock, Shield, IndianRupee, Paintbrush, Heart, Sparkles, Layers, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';

const CategoryRow = ({ category, catProjects, onProjectClick, onSeeAll }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section key={category} className="category-row reveal">
      <div className="category-header">
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{category} <span className="gold-text">Designs</span></h3>
        <button
          onClick={() => onSeeAll(category)}
          className="see-all-btn"
        >
          See All →
        </button>
      </div>
      
      <div className="carousel-container">
        {catProjects.length > 1 && (
          <>
            <button onClick={() => scroll('left')} className="carousel-arrow arrow-left"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll('right')} className="carousel-arrow arrow-right"><ChevronRight size={24} /></button>
          </>
        )}

        <div ref={scrollRef} className="carousel-track hide-scrollbar">
          {catProjects.map((project, i) => (
            <div key={project.id} onClick={() => onProjectClick(project.id)} className="project-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="project-card-image" style={{ backgroundImage: `url(${project.displayThumbnail || 'https://via.placeholder.com/400x300?text=No+Image'})` }} />
              <div className="project-card-overlay">
                <h4 className="project-card-name">{project.title}</h4>
                <p className="project-card-tag">{project.style}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
    
    const scrollVal = searchParams.get('scroll');
    if (scrollVal === 'about') {
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
    <div className="home-container">
      {/* ── HERO BANNER ── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        
        <div className="hero-content slide-right">
          <div className="hero-badge">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)', boxShadow: '0 0 10px var(--color-accent-primary)' }} />
            Premium Interior Design Studio
          </div>
          
          <h1 className="hero-title">
            Interiors you'll<br />
            <span className="gold-text">absolutely love.</span>
          </h1>
          
          <p className="hero-description">
            From modular kitchens to luxury living rooms — we craft bespoke spaces that reflect your unique lifestyle.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => { const el = document.getElementById('about'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Start Your Journey
            </button>
            <button
              className="btn-gold"
              onClick={() => navigate(currentUser ? '/projects' : '/login')}
            >
              {currentUser ? 'Explore Gallery' : 'Consult Now'}
            </button>
          </div>
        </div>


      </section>

      {/* ── ABOUT US SECTION ── */}
      <section id="about" className="about-section">
        <div className="about-image-container reveal">
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Studio Interior" 
            className="about-image"
          />
          <div className="glass-panel about-floating-card reveal" style={{ animationDelay: '0.3s' }}>
            <h3 className="gold-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>100+</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Dreams Realized</p>
          </div>
        </div>

        <div className="slide-right">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '50px', height: '2px', background: 'var(--color-accent-primary)' }} />
            <span style={{ color: 'var(--color-accent-primary)', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Our Vision</span>
          </div>
          
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Designing spaces that <br/><span className="gold-text">tell your story.</span>
          </h2>
          
          <p className="hero-description">
            At Rudraksha Design Studio, we are a fresh team of designers fueled by passion and a commitment to excellence. We believe that your home should be a direct reflection of your personality and aspirations.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div style={{ color: 'var(--color-accent-primary)', fontSize: '2rem', marginBottom: '1rem' }}><Sparkles /></div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.8rem', fontSize: '1.2rem' }}>Exquisite Detail</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Every corner is curated with precision and premium materials.</p>
            </div>
            <div className="reveal" style={{ animationDelay: '0.4s' }}>
              <div style={{ color: 'var(--color-accent-primary)', fontSize: '2rem', marginBottom: '1rem' }}><Clock /></div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.8rem', fontSize: '1.2rem' }}>Timely Delivery</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Your dream space, completed on schedule, without compromises.</p>
            </div>
          </div>
        </div>
      </section>

        <div className="features-scroller">
          <div className="features-track">
            {/* Double the list for seamless infinite scroll */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  { icon: <Sparkles size={32} />, label: "Modern Aesthetics", color: "#ffdf00" },
                  { icon: <Clock size={32} />, label: "Timely Delivery", color: "#ff007f" },
                  { icon: <Layers size={32} />, label: "3D Visuals", color: "#bf00ff" },
                  { icon: <Paintbrush size={32} />, label: "Expert Execution", color: "#00f5ff" },
                  { icon: <CheckCircle size={32} />, label: "Genuine Care", color: "#ff8c00" },
                  { icon: <Heart size={32} />, label: "Personalized Design", color: "#ff0040" },
                  { icon: <Shield size={32} />, label: "Quality Materials", color: "#007fff" },
                  { icon: <IndianRupee size={32} />, label: "Honest Pricing", color: "#00ff00" }
                ].map((item, idx) => (
                  <div key={`${i}-${idx}`} className="feature-item">
                    <div className="feature-icon" style={{ borderColor: item.color, color: item.color }}>{item.icon}</div>
                    <span className="feature-label">{item.label}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

      {/* ── GALLERY SECTION ── */}
      <div id="explore-gallery" style={{ padding: '8rem 5% 4rem', minHeight: '60vh' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Loading breathtaking designs...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem', background: 'var(--color-bg-secondary)', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
             <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No projects found</h3>
             <p style={{ color: 'var(--color-text-secondary)' }}>We're working on gathering more beautiful designs for this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {Object.entries(
              filteredProjects.reduce((acc, p) => {
                const cat = p.category || 'Other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(p);
                return acc;
              }, {})
            ).map(([category, catProjects]) => (
              <CategoryRow 
                key={category} 
                category={category} 
                catProjects={catProjects} 
                onProjectClick={handleProjectClick}
                onSeeAll={(cat) => navigate(`/projects?category=${encodeURIComponent(cat)}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
