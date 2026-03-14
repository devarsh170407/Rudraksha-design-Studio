import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { Heart, ArrowLeft, ChevronLeft, ChevronRight, X, Sparkles, Paintbrush, Share2, Facebook, Instagram, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { currentUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // Real-time listener for user's saved projects
  useEffect(() => {
    if (!currentUser) {
      setIsSaved(false);
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const savedProjects = docSnap.data().savedProjects || [];
        setIsSaved(savedProjects.includes(id));
      }
    });

    return () => unsubscribe();
  }, [currentUser, id]);

  const handleToggleSave = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsSaving(true);
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      await setDoc(userDocRef, {
        savedProjects: isSaved ? arrayRemove(id) : arrayUnion(id)
      }, { merge: true });
    } catch (error) {
      console.error("Error updating collection:", error);
      alert("Failed to update collection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
    setActiveSlide((prev) => (prev + 1) % project.images.length);
  };

  const handlePrev = () => {
    if (!project?.images) return;
    setActiveSlide((prev) => (prev - 1 + project.images.length) % project.images.length);
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
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--color-bg-primary)', color: 'white', minHeight: '100vh' }}>
        <div className="spinner" style={{ margin: '0 auto 2rem' }}></div>
        <p style={{ letterSpacing: '0.1rem', opacity: 0.6 }}>CURATING DESIGN DETAILS...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--color-bg-primary)', color: 'white', minHeight: '100vh' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Design Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>We couldn't locate the specific project details you're looking for.</p>
        <button onClick={() => navigate('/projects')} className="cta-outline" style={{ margin: '0 auto', width: 'auto', padding: '1rem 2rem' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .project-details-grid {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .project-details-grid::-webkit-scrollbar {
          display: none;
        }
        .interaction-panel {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .interaction-panel::-webkit-scrollbar {
          width: 4px;
        }
        .interaction-panel::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    <div className="container" style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', background: 'var(--color-bg-primary)', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Breadcrumbs / Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
         <span onClick={() => navigate('/projects')} style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color=''}>Explore</span>
         <span style={{ opacity: 0.4 }}>/</span>
         <span onClick={() => navigate('/projects')} style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color=''}>{project.category}</span>
         <span style={{ opacity: 0.4 }}>/</span>
         <span style={{ opacity: 0.6 }}>{project.title}</span>
      </div>

      <div 
        className="project-details-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.6fr 1fr', 
          gap: '0',
          background: 'var(--color-bg-secondary)',
          borderRadius: '32px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.03)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          marginBottom: '2rem'
        }}
      >
        
        {/* Left Column: Massive Cinematic Media Feature */}
        <div style={{ position: 'relative', width: '100%', height: '700px', background: '#000' }}>
          {project?.images && project.images.map((src, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute', inset: 0,
                opacity: i === activeSlide ? 1 : 0,
                transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: i === activeSlide ? 'auto' : 'none'
              }}
            >
              {src ? (
                <img 
                  src={src} 
                  alt={`Slide ${i}`} 
                  onClick={() => setSelectedImageIndex(i)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                  IMAGE NOT AVAILABLE
                </div>
              )}
            </div>
          ))}

          {/* Carousel Controls - Centered on sides */}
          <button 
            onClick={handlePrev} 
            className="carousel-btn-float" 
            style={{ left: '2rem' }}
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={handleNext} 
            className="carousel-btn-float" 
            style={{ right: '2rem' }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Indicators */}
          <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.8rem', zIndex: 10 }}>
            {project.images?.map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  width: i === activeSlide ? '40px' : '10px', 
                  height: '10px', 
                  borderRadius: '5px',
                  background: i === activeSlide ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.4s ease'
                }} 
              />
            ))}
          </div>

          <div style={{ 
            position: 'absolute', top: '2.5rem', left: '2.5rem', 
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', 
            color: 'white', padding: '0.6rem 1.2rem', borderRadius: '40px', 
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            ✦ FULL VIEW {activeSlide + 1}/{project.images?.length}
          </div>
        </div>

        {/* Right Column: Interaction & Story Panel */}
        <div 
          className="interaction-panel"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            padding: '2.5rem 3rem',
            minHeight: '700px',
            background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)'
          }}
        >
          
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>{project.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--color-accent-primary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2rem' }}>{(project?.category || 'Interiors').toUpperCase()}</span>
              <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.15rem' }}>{(project?.style || 'Modern').toUpperCase()}</span>
            </div>
            
            {project.description && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                {project.description}
              </p>
            )}
          </div>

          <div>
             <h3 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2rem', marginBottom: '1rem' }}>STUDIO EXCELLENCE</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="guar-item" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}><Sparkles size={20} className="gold" /><span style={{ fontSize: '0.6rem', letterSpacing: '0.05rem' }}>MODERN</span></div>
                <div className="guar-item" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}><Paintbrush size={20} className="gold" /><span style={{ fontSize: '0.6rem', letterSpacing: '0.05rem' }}>EXPERT</span></div>
                <div className="guar-item" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}><Heart size={20} className="gold" /><span style={{ fontSize: '0.6rem', letterSpacing: '0.05rem' }}>PERSONAL</span></div>
             </div>
          </div>

          <button 
            onClick={handleToggleSave}
            disabled={isSaving}
            className="cta-outline" 
            style={{ 
              padding: '1.2rem', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              borderRadius: '16px', 
              display: 'flex', 
              gap: '0.8rem', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderColor: isSaved ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.2)',
              background: isSaved ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              color: isSaved ? 'var(--color-accent-primary)' : 'white',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
              {isSaving ? (
                <Loader2 size={20} className="spin-animation" />
              ) : (
                <Heart size={20} fill={isSaved ? "var(--color-accent-primary)" : "none"} />
              )}
              {isSaved ? 'SAVED TO COLLECTION' : 'SAVE TO COLLECTION'}
          </button>

          {/* Share */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
             <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2rem', display: 'block', marginBottom: '1.2rem' }}>SHARE THIS STORY</span>
             <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Share2 size={22} className="share-icon" />
                <Instagram size={22} className="share-icon" />
                <Facebook size={22} className="share-icon" />
                <MessageCircle size={22} className="share-icon" />
             </div>
          </div>
        </div>

      </div>

      {/* Videos Section Below Main Grid */}
      {(project.completedVideo || project.threeDVideo) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
           {project.completedVideo && (
             <div className="vid-container">
                <span className="vid-label">LIVE SITE WALKTHROUGH</span>
                <video src={project.completedVideo} controls muted style={{ width: '100%', borderRadius: '24px' }} />
             </div>
           )}
           {project.threeDVideo && (
             <div className="vid-container" style={{ borderColor: 'rgba(37, 99, 235, 0.3)' }}>
                <span className="vid-label" style={{ color: 'var(--color-accent-primary)' }}>3D ARCHITECTURAL VIEW</span>
                <video src={project.threeDVideo} controls loop muted style={{ width: '100%', borderRadius: '24px' }} />
             </div>
           )}
        </div>
      )}
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
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!project?.images) return;
            setSelectedImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
          }}
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
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!project?.images) return;
            setSelectedImageIndex((prev) => (prev + 1) % project.images.length);
          }}
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
        </button>        <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
          {project.images && project.images[selectedImageIndex] ? (
            <img 
              src={project.images[selectedImageIndex]} 
              alt="Fullscreen" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} 
            />
          ) : (
            <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Image not found</div>
          )}
          {/* Index Indicator */}
          <div style={{
            position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 500
          }}>
            {selectedImageIndex + 1} / {project.images?.length || 0}
          </div>
        </div>
      </div>
    )}

    <style>{`
      .carousel-btn-float {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(15px);
        color: white;
        border: 1px solid rgba(255,255,255,0.1);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10;
      }
      .carousel-btn-float:hover {
        background: var(--color-accent-secondary);
        color: black;
        border-color: var(--color-accent-secondary);
        transform: translateY(-50%) scale(1.1);
      }
      .carousel-btn {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
        width: 45px;
        height: 45px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .carousel-btn:hover {
        background: var(--color-accent-secondary);
        color: black;
        border-color: var(--color-accent-secondary);
        transform: scale(1.1);
      }
      .vid-container {
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 1rem;
        background: rgba(255,255,255,0.02);
      }
      .vid-label {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.15rem;
        display: block;
        margin-bottom: 0.8rem;
        opacity: 0.8;
      }
      .spec-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.05);
        padding: 1.2rem;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .spec-title { font-size: 0.65rem; color: var(--color-text-secondary); letter-spacing: 0.1rem; }
      .spec-val { font-size: 0.9rem; font-weight: 600; color: white; }
      .guar-item {
         display: flex;
         flex-direction: column;
         align-items: center;
         text-align: center;
         gap: 0.5rem;
      }
      .guar-item span { font-size: 0.55rem; font-weight: 700; color: var(--color-text-secondary); letter-spacing: 0.05rem; }
      .gold { color: var(--color-accent-secondary); }
      .cta-primary {
         background: var(--color-accent-primary);
         color: white;
         border: none;
         padding: 1.2rem;
         border-radius: 12px;
         font-weight: 700;
         letter-spacing: 0.05rem;
         cursor: pointer;
         transition: all 0.3s;
      }
      .cta-primary:hover {
         filter: brightness(1.2);
         transform: translateY(-2px);
         box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
      }
      .cta-outline {
         background: transparent;
         border: 1px solid rgba(255,255,255,0.2);
         color: white;
         padding: 1.2rem;
         border-radius: 12px;
         font-weight: 600;
         letter-spacing: 0.05rem;
         cursor: pointer;
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 0.8rem;
         transition: all 0.3s;
      }
      .cta-outline:hover {
         background: rgba(255,255,255,0.05);
         border-color: white;
      }
      .share-icon { color: var(--color-text-secondary); cursor: pointer; transition: color 0.3s; }
      .share-icon:hover { color: var(--color-accent-secondary); }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255,255,255,0.1);
        border-top-color: var(--color-accent-secondary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (max-width: 768px) {
        button { display: none !important; }
        .carousel-btn { display: flex !important; }
        .close-btn { display: flex !important; }
      }
    `}</style>
    </>
  );
}
