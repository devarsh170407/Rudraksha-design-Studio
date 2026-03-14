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
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          marginBottom: '3rem', 
          color: 'var(--color-text-secondary)',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '0.6rem 1.2rem',
          borderRadius: '30px',
          fontSize: '0.9rem',
          letterSpacing: '0.05rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
          e.currentTarget.style.transform = 'translateX(-5px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <ArrowLeft size={16} /> Back to Gallery
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.6fr) 1fr', gap: '4rem' }}>
        
        {/* Left Column: Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Completed Project Video */}
          {project.completedVideo && (
            <div style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              border: '1px solid var(--glass-border)', 
              background: '#000',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              animation: 'fadeInUp 0.8s ease' 
            }}>
              <video src={project.completedVideo} controls autoPlay muted style={{ width: '100%', display: 'block', maxHeight: '600px' }} />
            </div>
          )}

          {/* 3D Design Video */}
          {project.threeDVideo && (
            <div style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              border: '1px solid var(--color-accent-secondary)', 
              background: '#000',
              boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)',
              animation: 'fadeInUp 1s ease'
            }}>
              <div style={{ 
                padding: '1.2rem', 
                background: 'linear-gradient(90deg, rgba(212,175,55,0.1), transparent)', 
                textAlign: 'center', 
                fontWeight: 600,
                color: 'var(--color-accent-secondary)',
                letterSpacing: '0.1rem',
                textTransform: 'uppercase',
                fontSize: '0.8rem'
              }}>
                ✦ 3D Design Walkthrough ✦
              </div>
              <video src={project.threeDVideo} controls loop muted style={{ width: '100%', display: 'block', maxHeight: '600px' }} />
            </div>
          )}

          {/* Image Gallery - Masterpiece Layout */}
          {project.images && project.images.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Featured Main Image */}
              <div 
                onClick={() => setSelectedImageIndex(0)}
                style={{ 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  height: '500px', 
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.1)', 
                  cursor: 'pointer',
                  animation: 'fadeInUp 0.6s ease',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                }}
                onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}
              >
                <img 
                  src={project.images[0]} 
                  alt="Feature View" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                />
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7))',
                  display: 'flex', alignItems: 'flex-end', padding: '2rem'
                }}>
                  <span style={{ color: 'white', fontSize: '0.9rem', letterSpacing: '0.1rem', textTransform: 'uppercase', opacity: 0.8 }}>
                    Primary Perspective
                  </span>
                </div>
              </div>

              {/* Secondary Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {project.images.slice(1).map((src, i) => (
                  <div 
                    key={i + 1} 
                    onClick={() => setSelectedImageIndex(i + 1)}
                    style={{ 
                      borderRadius: '20px', 
                      overflow: 'hidden', 
                      height: '300px', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      cursor: 'pointer',
                      animation: `fadeInUp ${0.7 + (i * 0.1)}s ease`,
                      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                      transition: 'all 0.4s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.borderColor = 'var(--color-accent-secondary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <img src={src} alt={`Detail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '5rem', background: 'rgba(255,255,255,0.01)', textAlign: 'center', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.05rem' }}>Collection is being curated...</p>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div style={{ position: 'sticky', top: '120px', alignSelf: 'start', animation: 'fadeInRight 0.8s ease' }}>
          <div className="glass-panel" style={{ 
            padding: '3.5rem 3rem', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            background: 'linear-gradient(135deg, rgba(20,20,20,0.8), rgba(10,10,10,0.95))',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
          }}>
            <h1 style={{ 
              fontSize: '3.2rem', 
              marginBottom: '1.5rem', 
              lineHeight: 1.1, 
              fontWeight: 700, 
              letterSpacing: '-0.02rem',
              background: 'linear-gradient(to right, #fff, #a1a1aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{project.title}</h1>
            
            <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <span style={{ 
                padding: '0.4rem 1.2rem', 
                background: 'rgba(212, 175, 55, 0.1)', 
                color: 'var(--color-accent-secondary)', 
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '30px', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1rem'
              }}>
                {project.category}
              </span>
              <span style={{ 
                padding: '0.4rem 1.2rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                color: 'var(--color-text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '30px', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1rem'
              }}>
                {project.style}
              </span>
            </div>

            <div style={{ 
              marginBottom: '3rem', 
              padding: '1.2rem 1.5rem', 
              borderRadius: '16px', 
              background: project.projectStatus === 'In Progress' ? 'rgba(234, 179, 8, 0.05)' : 'rgba(34, 197, 94, 0.05)',
              border: `1px solid ${project.projectStatus === 'In Progress' ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '12px', height: '12px', borderRadius: '50%', 
                  background: project.projectStatus === 'In Progress' ? '#eab308' : '#22c55e',
                  boxShadow: `0 0 15px ${project.projectStatus === 'In Progress' ? '#eab308' : '#22c55e'}` 
                }} />
                <span style={{ 
                  fontWeight: 600, 
                  color: project.projectStatus === 'In Progress' ? '#eab308' : '#22c55e',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05rem'
                }}>
                  {project.projectStatus || 'Completed'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', opacity: 0.6 }}>Design Status</span>
            </div>

            <div style={{ 
              marginBottom: '3rem', 
              padding: '2rem', 
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                "Every design detail in this {project.category.toLowerCase()} has been meticulously crafted to embody the {project.style.toLowerCase()} aesthetic, ensuring a perfect balance of luxury and functionality."
              </p>
            </div>

            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                padding: '1.2rem',
                borderRadius: '16px',
                marginBottom: '1rem', 
                fontSize: '1rem',
                letterSpacing: '0.05rem',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
                background: 'var(--color-accent-primary)'
              }}
            >
              <Heart size={20} fill="currentColor" /> Add to My Collection
            </button>
            <button 
              className="btn-outline" 
              style={{ 
                width: '100%',
                padding: '1.2rem',
                borderRadius: '16px',
                fontSize: '1rem',
                letterSpacing: '0.05rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Request Design Tour
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
          @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          @keyframes fadeInRight { 
            from { opacity: 0; transform: translateX(30px); } 
            to { opacity: 1; transform: translateX(0); } 
          }
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
