import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from 'idb-keyval';
import { Heart, ArrowLeft, Maximize } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [objectUrls, setObjectUrls] = useState({ images: [], threeDVideo: null, completedVideo: null });

  useEffect(() => {
    let urlsToRevoke = { images: [], threeDVideo: null, completedVideo: null };

    const fetchProject = async () => {
      try {
        const storedProjects = await get('localProjects') || [];
        const foundProject = storedProjects.find(p => p.id === id);
        
        if (foundProject) {
          setProject(foundProject);
          
          const newUrls = {
            images: foundProject.images ? foundProject.images.map(f => URL.createObjectURL(f)) : [],
            threeDVideo: foundProject.threeDVideo ? URL.createObjectURL(foundProject.threeDVideo) : null,
            completedVideo: foundProject.completedVideo ? URL.createObjectURL(foundProject.completedVideo) : null
          };
          
          setObjectUrls(newUrls);
          urlsToRevoke = newUrls; // save reference for cleanup
        } else {
          console.log("No such project in local storage!");
          navigate('/projects');
        }
      } catch (error) {
        console.error("Error fetching local project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();

    return () => {
      // Cleanup Object URLs to prevent memory leaks
      urlsToRevoke.images.forEach(u => URL.revokeObjectURL(u));
      if (urlsToRevoke.threeDVideo) URL.revokeObjectURL(urlsToRevoke.threeDVideo);
      if (urlsToRevoke.completedVideo) URL.revokeObjectURL(urlsToRevoke.completedVideo);
    }
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
        {/* Left Column: Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Completed Project Video */}
          {objectUrls.completedVideo && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: '#000' }}>
              <video src={objectUrls.completedVideo} controls autoPlay muted style={{ width: '100%', display: 'block', maxHeight: '500px' }} />
            </div>
          )}

          {/* 3D Design Video */}
          {objectUrls.threeDVideo && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: '#000' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', textAlign: 'center', fontWeight: 600 }}>3D Design Walkthrough</div>
              <video src={objectUrls.threeDVideo} controls loop muted style={{ width: '100%', display: 'block', maxHeight: '500px' }} />
            </div>
          )}

          {/* Image Gallery */}
          {objectUrls.images && objectUrls.images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {objectUrls.images.map((src, i) => (
                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', height: '250px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={src} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.02)', textAlign: 'center', borderRadius: '12px' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No images uploaded for this project.</p>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{project.title}</h1>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ padding: '0.3rem 0.8rem', background: 'var(--color-accent-primary)', color: 'var(--color-text-primary)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {project.category}
              </span>
              <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {project.style}
              </span>
            </div>

            {/* Generic description removed to prioritize images/video */}
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}></div>

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
