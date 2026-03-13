import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Heart, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such project in Firestore!");
          navigate('/projects');
        }
      } catch (error) {
        console.error("Error fetching Firestore project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, project]);

  const handleNext = () => {
    if (!project?.images) return;
    setSelectedImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const handlePrev = () => {
    if (!project?.images) return;
    setSelectedImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading project details...</div>;
  }

  if (!project) return null;

  return (
    <>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Completed Project Video */}
          {project.completedVideo && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: '#000' }}>
              <video src={project.completedVideo} controls autoPlay muted style={{ width: '100%', display: 'block', maxHeight: '500px' }} />
            </div>
          )}

          {/* 3D Design Video */}
          {project.threeDVideo && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: '#000' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', textAlign: 'center', fontWeight: 600 }}>3D Design Walkthrough</div>
              <video src={project.threeDVideo} controls loop muted style={{ width: '100%', display: 'block', maxHeight: '500px' }} />
            </div>
          )}

          {/* Image Gallery */}
          {project.images && project.images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {project.images.map((src, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i)}
                  style={{ 
                    borderRadius: '12px', overflow: 'hidden', height: '250px', 
                    border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
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
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.3rem 0.8rem', background: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {project.category}
              </span>
              <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {project.style}
              </span>
            </div>

            <div style={{ 
              marginBottom: '2rem', 
              padding: '1rem', 
              borderRadius: '12px', 
              background: project.projectStatus === 'In Progress' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              border: `1px solid ${project.projectStatus === 'In Progress' ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}>
              <div style={{ 
                width: '10px', height: '10px', borderRadius: '50%', 
                background: project.projectStatus === 'In Progress' ? '#eab308' : '#22c55e',
                boxShadow: `0 0 10px ${project.projectStatus === 'In Progress' ? '#eab308' : '#22c55e'}` 
              }} />
              <span style={{ 
                fontWeight: 600, 
                color: project.projectStatus === 'In Progress' ? '#eab308' : '#22c55e',
                fontSize: '0.9rem' 
              }}>
                Status: {project.projectStatus || 'Completed'}
              </span>
            </div>

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

    {/* Lightbox Modal */}
    {selectedImageIndex !== null && project.images && (
      <div 
        onClick={() => setSelectedImageIndex(null)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.95)' , backdropFilter: 'blur(15px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', cursor: 'default',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        {/* Navigation Buttons */}
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{
            position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            width: '50px', height: '50px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 1001
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <ChevronLeft size={30} />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{
            position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            width: '50px', height: '50px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 1001
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <ChevronRight size={30} />
        </button>

        <button 
          onClick={() => setSelectedImageIndex(null)}
          style={{
            position: 'absolute', top: '2rem', right: '2rem',
            background: 'white', color: 'black', border: 'none',
            width: '45px', height: '45px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 1002, boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
          <img 
            src={project.images[selectedImageIndex]} 
            alt="Fullscreen" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} 
          />
          {/* Index Indicator */}
          <div style={{
            position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 500
          }}>
            {selectedImageIndex + 1} / {project.images.length}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @media (max-width: 768px) {
            button { display: none !important; }
            .close-btn { display: flex !important; }
          }
        `}</style>
      </div>
    )}
    </>
  );
}
