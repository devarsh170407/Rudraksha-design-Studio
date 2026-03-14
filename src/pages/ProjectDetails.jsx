import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Heart, ArrowLeft, ChevronLeft, ChevronRight, X, ShieldCheck, Clock, Users, Wrench, Share2, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

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
    <div className="container" style={{ padding: '1rem 1.5rem 4rem', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Breadcrumbs / Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
         <span onClick={() => navigate('/projects')} style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color=''}>Explore</span>
         <span>/</span>
         <span style={{ color: 'var(--color-accent-secondary)', fontWeight: 600 }}>{project.category}</span>
         <span>/</span>
         <span style={{ opacity: 0.6 }}>{project.title}</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 400px', 
        gap: '2.5rem',
        background: 'var(--color-bg-secondary)',
        borderRadius: '32px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.03)',
        padding: '2.5rem',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
      }}>
        
        {/* Left Column: Media Feature */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Main Carousel Wrapper */}
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '550px', background: '#000', border: '1px solid rgba(255,255,255,0.05)' }}>
            {project.images && project.images.map((src, i) => (
              <div 
                key={i}
                style={{
                  position: 'absolute', inset: 0,
                  opacity: i === activeSlide ? 1 : 0,
                  transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: i === activeSlide ? 'auto' : 'none'
                }}
              >
                <img 
                  src={src} 
                  alt={`Slide ${i}`} 
                  onClick={() => setSelectedImageIndex(i)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                />
              </div>
            ))}

            {/* Carousel Controls */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '0.8rem', zIndex: 10 }}>
              <button onClick={handlePrev} className="carousel-btn"><ChevronLeft size={20} /></button>
              <button onClick={handleNext} className="carousel-btn"><ChevronRight size={20} /></button>
            </div>

            {/* Indicators */}
            <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
              {project.images?.map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: i === activeSlide ? '24px' : '8px', 
                    height: '8px', 
                    borderRadius: '4px',
                    background: i === activeSlide ? 'var(--color-accent-secondary)' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease'
                  }} 
                />
              ))}
            </div>

            <div style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1rem' }}>
              ✦ PREMIUM VIEW {activeSlide + 1}/{project.images?.length}
            </div>
          </div>

          {/* Videos Grid Below Carousel */}
          {(project.completedVideo || project.threeDVideo) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               {project.completedVideo && (
                 <div className="vid-container">
                    <span className="vid-label">LIVE SITE WALKTHROUGH</span>
                    <video src={project.completedVideo} controls muted style={{ width: '100%', borderRadius: '16px' }} />
                 </div>
               )}
               {project.threeDVideo && (
                 <div className="vid-container" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
                    <span className="vid-label" style={{ color: 'var(--color-accent-secondary)' }}>3D ARCHITECTURAL VIEW</span>
                    <video src={project.threeDVideo} controls loop muted style={{ width: '100%', borderRadius: '16px' }} />
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Right Column: Interaction Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem' }}>{project.title}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              A signature {(project?.style || 'Modern').toLowerCase()} approach to modern {(project?.category || 'Interiors').toLowerCase()} design.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
             <div className="spec-card"><span className="spec-title">LAYOUT</span><span className="spec-val">L-Shaped Island</span></div>
             <div className="spec-card"><span className="spec-title">DIMENSION</span><span className="spec-val">12 x 14 feet</span></div>
             <div className="spec-card"><span className="spec-title">COLOUR</span><span className="spec-val">Metallic & White</span></div>
             <div className="spec-card"><span className="spec-title">MATERIAL</span><span className="spec-val">BWR Plywood</span></div>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
             <div className="guar-item"><ShieldCheck size={18} className="gold" /><span>10 YEAR WARRANTY</span></div>
             <div className="guar-item"><Clock size={18} className="gold" /><span>45 DAYS DELIVERY</span></div>
             <div className="guar-item"><Users size={18} className="gold" /><span>750+ EXPERTS</span></div>
             <div className="guar-item"><Wrench size={18} className="gold" /><span>POST INSTALL</span></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button className="cta-primary">BOOK FREE DESIGN SESSION</button>
             <button className="cta-outline"><Heart size={18} /> SAVE TO WISHLIST</button>
          </div>

          {/* Share */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
             <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', letterSpacing: '0.1rem', display: 'block', marginBottom: '1rem' }}>SHARE THIS DESIGN</span>
             <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Share2 size={20} className="share-icon" />
                <Instagram size={20} className="share-icon" />
                <Facebook size={20} className="share-icon" />
                <MessageCircle size={20} className="share-icon" />
             </div>
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
      </div>
    )}

    <style>{`
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
