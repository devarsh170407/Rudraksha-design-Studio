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
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Design Gallery
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Find inspirations for your dream spaces.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem'}}>Room Type</label>
            <select 
              className="input-field" 
              style={{ width: '180px', padding: '0.5rem', background: 'var(--color-bg-secondary)' }}
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
          <div>
            <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem'}}>Style</label>
            <select 
              className="input-field" 
              style={{ width: '150px', padding: '0.5rem', background: 'var(--color-bg-secondary)' }}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredProjects.map((project, i) => (
            <div 
              key={project.id} 
              onClick={() => handleProjectClick(project.id)}
              style={{ 
                position: 'relative',
                height: '280px', 
                borderRadius: '16px',
                overflow: 'hidden', 
                cursor: 'pointer', 
                transition: 'all var(--transition-smooth)',
                animation: `fadeInUp 0.5s ease ${i * 0.1}s forwards`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
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
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '2.5rem 1.5rem 1.5rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                pointerEvents: 'none'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '0.2rem' }}>
                  {project.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  {project.style}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .project-img-bg:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
