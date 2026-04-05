import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { Heart, ChevronLeft, ChevronRight, X, Sparkles, Paintbrush, Share2, Facebook, Instagram, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
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
    if (!currentUser) { setIsSaved(false); return; }
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
    if (!currentUser) { navigate('/login'); return; }
    setIsSaving(true);
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await setDoc(userDocRef, {
        savedProjects: isSaved ? arrayRemove(id) : arrayUnion(id)
      }, { merge: true });
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (!project?.images) return;
    setActiveSlide((prev) => (prev + 1) % project.images.length);
  };

  const handlePrev = () => {
    if (!project?.images) return;
    setActiveSlide((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--color-bg-primary)', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="spinner" 
          style={{ margin: '0 auto 2rem' }}
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          style={{ letterSpacing: '0.1rem' }}
        >
          CURATING DESIGN DETAILS...
        </motion.p>
      </div>
    );
  }

  if (!project || !id) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--color-bg-primary)', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}
      >
         <span onClick={() => navigate('/projects')} style={{ cursor: 'pointer', transition: 'color 0.3s' }}>Explore</span>
         <span style={{ opacity: 0.4 }}>/</span>
         <span onClick={() => navigate('/projects')} style={{ cursor: 'pointer', transition: 'color 0.3s' }}>{project.category}</span>
         <span style={{ opacity: 0.4 }}>/</span>
         <span style={{ opacity: 0.6 }}>{project.title}</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="project-details-grid"
        style={{ 
          display: 'grid', gridTemplateColumns: '1.6fr 1fr', 
          background: 'var(--color-bg-secondary)', borderRadius: '32px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', marginBottom: '2rem'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '700px', background: '#000' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img src={project.images[activeSlide]} alt="Slide" onClick={() => setSelectedImageIndex(activeSlide)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
            </motion.div>
          </AnimatePresence>

          <button onClick={handlePrev} className="carousel-btn-float" style={{ left: '2rem' }}><ChevronLeft size={28} /></button>
          <button onClick={handleNext} className="carousel-btn-float" style={{ right: '2rem' }}><ChevronRight size={28} /></button>
        </div>

        <div className="interaction-panel" style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.2rem' }}>{project.title}</h1>
            <div className="gold-text" style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2rem', marginBottom: '1rem' }}>{(project?.category || '').toUpperCase()}</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8 }}>{project.description}</p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleToggleSave}
            disabled={isSaving}
            className="cta-outline" 
            style={{ 
              padding: '1.2rem', borderRadius: '16px', display: 'flex', gap: '0.8rem', alignItems: 'center', justifyContent: 'center',
              borderColor: isSaved ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.2)',
              color: isSaved ? 'var(--color-accent-primary)' : 'white'
            }}
          >
            {isSaving ? <Loader2 size={20} className="spin-animation" /> : <Heart size={20} fill={isSaved ? "var(--color-accent-primary)" : "none"} />}
            {isSaved ? 'SAVED TO COLLECTION' : 'SAVE TO COLLECTION'}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            onClick={() => setSelectedImageIndex(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              src={project.images[selectedImageIndex]} 
              style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }} 
            />
            <button style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', borderRadius: '50%', padding: '0.5rem' }}><X size={24} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .carousel-btn-float { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.3); backdrop-filter: blur(15px); color: white; border: 1px solid rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; cursor: pointer; z-index: 10; }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cta-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s; }
        .cta-outline:hover { background: rgba(255,255,255,0.05); border-color: white; }
      `}</style>
    </div>
    </>
  );
}
