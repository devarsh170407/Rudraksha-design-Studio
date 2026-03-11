import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/storage'; // Note: query from firestore
import { collection as fsCollection, getDocs as fsGetDocs, query as fsQuery, orderBy as fsOrderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Filters state
  const [filterRoom, setFilterRoom] = useState('All');
  const [filterStyle, setFilterStyle] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = fsQuery(fsCollection(db, 'projects'), fsOrderBy('createdAt', 'desc'));
        const querySnapshot = await fsGetDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Design Gallery
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Find inspirations for your dream spaces.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem'}}>Room Type</label>
            <select 
              className="input-field" 
              style={{ width: '180px', padding: '0.5rem', background: '#141414' }}
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              <option value="All">All Rooms</option>
              <option value="Modular Kitchen">Modular Kitchen</option>
              <option value="Living Room">Living Room</option>
              <option value="Wardrobe">Wardrobe</option>
              <option value="TV Unit">TV Unit</option>
              <option value="Study Room">Study Room</option>
            </select>
          </div>
          <div>
            <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem'}}>Style</label>
            <select 
              className="input-field" 
              style={{ width: '150px', padding: '0.5rem', background: '#141414' }}
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
              className="glass-panel" 
              onClick={() => handleProjectClick(project.id)}
              style={{ 
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
              <div 
                style={{ 
                  height: '240px', 
                  backgroundImage: `url(${project.thumbnailUrl || 'https://via.placeholder.com/400x300?text=No+Image'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{project.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{project.category} • {project.style}</p>
                  <span style={{ color: 'var(--color-accent-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
                    {!currentUser ? 'Login to view' : 'View Details'}
                  </span>
                </div>
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
      `}</style>
    </div>
  );
}
