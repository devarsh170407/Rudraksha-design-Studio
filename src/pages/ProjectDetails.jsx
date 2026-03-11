import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Heart, ArrowLeft, Maximize } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          console.log("No such document!");
          navigate('/projects');
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading project details...</div>;
  }

  if (!project) return null;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}
        className="btn-outline"
      >
        <ArrowLeft size={18} /> Back to Gallery
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) 1fr', gap: '3rem' }}>
        
        {/* Left Column: Media */}
        <div>
          {/* Main Thumbnail View */}
          <div style={{ 
            width: '100%', 
            height: '500px', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <img 
              src={project.thumbnailUrl} 
              alt={project.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          
          {/* Gallery placeholder (future expansion for multiple images/3D) */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <Maximize size={24} style={{ marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }} />
              <p style={{ fontSize: '0.9rem' }}>3D View (Coming Soon)</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>More images will appear here</p>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{project.title}</h1>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ padding: '0.3rem 0.8rem', background: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {project.category}
              </span>
              <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {project.style}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem 0' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Budget</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>₹{project.budget?.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Size</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{project.size} sqft</p>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Heart size={18} /> Save to Wishlist
            </button>
            <button className="btn-outline" style={{ width: '100%' }}>
              Compare Design
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
