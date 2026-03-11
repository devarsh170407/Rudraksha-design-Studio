import React, { useState, useEffect } from 'react';
import { get } from 'idb-keyval';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  
  // Filters state
  const [filterRoom, setFilterRoom] = useState(searchParams.get('category') || 'All');
  const [filterStyle, setFilterStyle] = useState('All');

  // Listen to URL changes if navigating from home page again
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilterRoom(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storedProjects = await get('localProjects') || [];
        
        // Sort descending by created time
        storedProjects.sort((a, b) => b.createdAt - a.createdAt);
        
        // Prepare Object URLs for the thumbnails so we don't recreate them every render
        const projectsWithThumbnails = storedProjects.map(p => {
          const thumbFile = p.images && p.images[p.thumbnailIndex] ? p.images[p.thumbnailIndex] : null;
          return {
            ...p,
            displayThumbnail: thumbFile ? URL.createObjectURL(thumbFile) : null
          };
        });
        
        setProjects(projectsWithThumbnails);
      } catch (error) {
        console.error("Error fetching local projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    
    // Cleanup ObjectURLs on unmount
    return () => {
      projects.forEach(p => {
        if (p.displayThumbnail) URL.revokeObjectURL(p.displayThumbnail);
      });
    }
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchRoom = filterRoom === 'All' || p.category === filterRoom;
    const matchStyle = filterStyle === 'All' || p.style === filterStyle;
    return matchRoom && matchStyle;
  });

  const handleProjectClick = (projectId) => {
    if (!currentUser) {
       navigate('/login');
    } else {
       navigate(`/project/${projectId}`);
    }
  };

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div className="projects-header-text">
          <h1 className="projects-title">
            Design Gallery
          </h1>
          <p className="projects-subtitle">Find inspirations for your dream spaces.</p>
        </div>
        
        <div className="projects-filters">
          <div className="filter-group">
            <label className="filter-label">Room Type</label>
            <select 
              className="input-field filter-select filter-room" 
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Home Interiors">Home Interiors</option>
              <option value="Modular Kitchen">Modular Kitchen</option>
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Wardrobe">Wardrobe</option>
              <option value="Space Saving Furniture">Space Saving Furniture</option>
              <option value="Home Office">Home Office</option>
              <option value="Bathroom">Bathroom</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Style</label>
            <select 
              className="input-field filter-select filter-style" 
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
            >
              <option value="All">All Styles</option>
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
              <option value="Minimalist">Minimalist</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>Loading breathtaking designs...</div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
          No projects found matching the current filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {Object.entries(
            filteredProjects.reduce((acc, project) => {
              if (!acc[project.category]) acc[project.category] = [];
              acc[project.category].push(project);
              return acc;
            }, {})
          ).map(([category, catProjects]) => (
            <section key={category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{category} Designs</h2>
                <button 
                  onClick={() => setFilterRoom(category)}
                  style={{ color: 'var(--color-accent-secondary)', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                >
                  See All
                </button>
              </div>
              
              {/* Horizontal Scroll Layout for Categories */}
              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                overflowX: 'auto', 
                paddingBottom: '1rem',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch' 
              }} className="hide-scrollbar">
                
                {catProjects.map((project, i) => (
                  <div 
                    key={project.id} 
                    onClick={() => handleProjectClick(project.id)}
                    className="project-card"
                    style={{ 
                      animation: `fadeInUp 0.5s ease ${i * 0.1}s forwards`
                    }}
                  >
                    {/* Full Bleed Image Background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${project.displayThumbnail || 'https://via.placeholder.com/400x300?text=No+Image'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.6s ease'
                      }}
                      className="project-img-bg"
                    />
                    
                    {/* Gradient Overlay for Text Visibility */}
                    <div className="project-card-overlay">
                      <h3 className="project-card-title">
                        {project.title}
                      </h3>
                      <p className="project-card-subtitle">
                        {project.style}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      <style>{`
        .projects-page {
          padding: 2rem 3%;
          min-height: 80vh;
          width: 100%;
          max-width: 100%;
        }
        .projects-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
          gap: 2rem;
        }
        .projects-title {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ffffff, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .projects-subtitle {
          color: var(--color-text-secondary);
          font-size: 1.1rem;
        }
        .projects-filters {
          display: flex;
          gap: 1rem;
          background: rgba(255,255,255,0.03);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .filter-group {
          /* container for label and select */
        }
        .filter-label {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.3rem;
        }
        .filter-select {
          padding: 0.5rem;
          background: var(--color-bg-secondary);
        }
        .filter-room {
          width: 180px;
        }
        .filter-style {
          width: 150px;
        }
        
        .project-card {
          min-width: 320px;
          max-width: 400px;
          flex: 0 0 auto;
          scroll-snap-align: start;
          position: relative;
          height: 240px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-smooth);
          opacity: 0;
          transform: translateY(20px);
        }
        
        .project-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 24px rgba(0,0,0,0.4);
        }
        
        .project-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1.5rem 1.2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          pointer-events: none;
        }
        
        .project-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 0.2rem;
        }
        
        .project-card-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .project-img-bg:hover {
          transform: scale(1.05);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .projects-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          .projects-filters {
            width: 100%;
            flex-wrap: wrap;
          }
          .filter-group {
            flex: 1;
            min-width: 120px;
          }
          .filter-select {
            width: 100%;
          }
          .projects-title {
            font-size: 2.2rem;
          }
          .projects-page {
            padding: 1.5rem 4%;
          }
        }
        
        @media (max-width: 480px) {
          .project-card {
            min-width: 85vw; /* Almost full width on very small screens */
            max-width: 85vw;
          }
          .projects-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
