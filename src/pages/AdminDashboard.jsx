import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'
  const [allProjects, setAllProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Interiors',
    style: 'Modern'
  });
  
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [threeDVideo, setThreeDVideo] = useState(null);
  const [completedVideo, setCompletedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch projects from Firestore
  const fetchProjects = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllProjects(docs);
    } catch (e) {
      console.error('Error fetching projects:', e);
      setMessage({ 
        text: `Fetch Error: ${e.message}. Please check if Firestore is enabled and rules allow reading.`, 
        type: 'error' 
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchProjects();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleImagesChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setThumbnailIndex(0); 
    }
  };

  const handleFileUpload = (file, path) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Individual file progress can be handled here if needed
        }, 
        (error) => reject(error), 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setMessage({ text: 'Please select at least one project image.', type: 'error' });
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage({ text: '', type: '' });

    try {
      const projectId = Date.now().toString();
      const imageUrls = [];
      
      // Calculate total files to upload for progress bar
      const totalFiles = images.length + (threeDVideo ? 1 : 0) + (completedVideo ? 1 : 0);
      let uploadedCount = 0;

      const updateProgress = () => {
        uploadedCount++;
        setProgress((uploadedCount / totalFiles) * 100);
      };

      // Upload Images
      for (let i = 0; i < images.length; i++) {
        const url = await handleFileUpload(images[i], `projects/${projectId}/images/${images[i].name}`);
        imageUrls.push(url);
        updateProgress();
      }

      // Upload Videos if they exist
      let threeDVideoUrl = null;
      if (threeDVideo) {
        threeDVideoUrl = await handleFileUpload(threeDVideo, `projects/${projectId}/videos/3d_${threeDVideo.name}`);
        updateProgress();
      }

      let completedVideoUrl = null;
      if (completedVideo) {
        completedVideoUrl = await handleFileUpload(completedVideo, `projects/${projectId}/videos/completed_${completedVideo.name}`);
        updateProgress();
      }

      // Save to Firestore
      const newProject = {
        title: formData.title,
        category: formData.category,
        style: formData.style,
        images: imageUrls, 
        thumbnailIndex: thumbnailIndex,
        threeDVideo: threeDVideoUrl,
        completedVideo: completedVideoUrl,
        createdAt: serverTimestamp(),
        localId: projectId // Keep track of the folder name in storage
      };
      
      await addDoc(collection(db, 'projects'), newProject);

      setMessage({ text: 'Project published successfully to Firebase!', type: 'success' });
      
      // Reset
      setTimeout(() => {
        setFormData({ title: '', category: 'Home Interiors', style: 'Modern' });
        setImages([]);
        setThumbnailIndex(0);
        setThreeDVideo(null);
        setCompletedVideo(null);
        setProgress(0);
        setUploading(false);
        if (e.target.reset) e.target.reset();
      }, 800);
      
    } catch (error) {
      console.error("Firebase upload error", error);
      setMessage({ text: 'Error uploading to Firebase. Check console and Firebase rules.', type: 'error' });
      setUploading(false);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm('Are you sure you want to delete this project? This will remove all files from storage too.')) return;

    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'projects', project.id));

      // 2. Delete files from Storage (Optional but recommended for cleanup)
      // Note: Firebase doesn't support deleting "folders", we'd need to delete each file ref.
      // For simplicity in this demo, we'll just delete the Firestore entry.
      // If we wanted to be thorough:
      /*
      for (const url of project.images) {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef).catch(err => console.error("Error deleting image:", err));
      }
      if (project.threeDVideo) await deleteObject(ref(storage, project.threeDVideo)).catch(e => {});
      if (project.completedVideo) await deleteObject(ref(storage, project.completedVideo)).catch(e => {});
      */

      setMessage({ text: 'Project deleted successfully!', type: 'success' });
      fetchProjects();
      
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (e) {
      console.error('Delete error:', e);
      setMessage({ text: 'Error deleting project.', type: 'error' });
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        {/* Sidebar Nav */}
        <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li>
              <button 
                onClick={() => setActiveTab('add')}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '10px',
                  background: activeTab === 'add' ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === 'add' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                  border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
                }}>
                + Add New Project
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('manage')}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '10px',
                  background: activeTab === 'manage' ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === 'manage' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                  border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
                }}>
                📁 Manage Projects
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="glass-panel" style={{ padding: '3rem' }}>
          {message.text && (
            <div style={{ 
              padding: '1rem', 
              marginBottom: '2rem', 
              borderRadius: '8px', 
              background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)',
              border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`
            }}>
              {message.text}
            </div>
          )}

          {activeTab === 'add' ? (
            <>
              <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Publish New Design</h2>
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={styles.label}>Project Title</label>
                  <input name="title" className="input-field" placeholder="e.g. Minimalist Urban Condo" required value={formData.title} onChange={handleChange} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={styles.label}>Category</label>
                    <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                      <option>Home Interiors</option>
                      <option>Modular Kitchen</option>
                      <option>Living Room</option>
                      <option>Bedroom</option>
                      <option>Wardrobe</option>
                      <option>Space Saving Furniture</option>
                      <option>Home Office</option>
                      <option>Bathroom</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Style</label>
                    <select name="style" className="input-field" value={formData.style} onChange={handleChange}>
                      <option>Modern</option>
                      <option>Classic</option>
                      <option>Minimalist</option>
                    </select>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <label style={styles.label}>Project Images Gallery (Required)</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Select multiple images. Click an image to set as Primary Thumbnail.</p>
                  <input type="file" required multiple accept="image/*" onChange={handleImagesChange} style={{ color: 'var(--color-text-primary)' }} />
                  
                  {images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                      {images.map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setThumbnailIndex(idx)}
                          style={{ 
                            height: '100px', 
                            backgroundImage: `url(${URL.createObjectURL(img)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: thumbnailIndex === idx ? '3px solid var(--color-accent-primary)' : '3px solid transparent',
                            transition: 'border 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          {thumbnailIndex === idx && (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)', fontSize: '0.7rem', textAlign: 'center', fontWeight: 'bold' }}>THUMBNAIL</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={styles.label}>3D Design Video (Optional)</label>
                    <input type="file" accept="video/*" onChange={handleThreeDVideoChange} style={{ color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label style={styles.label}>Completed Project Video (Optional)</label>
                    <input type="file" accept="video/*" onChange={handleCompletedVideoChange} style={{ color: 'var(--color-text-primary)' }} />
                  </div>
                </div>

                {uploading && (
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, background: 'var(--color-accent-primary)', height: '100%', transition: 'width 0.2s ease' }} />
                  </div>
                )}

                <button type="submit" disabled={uploading} className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                  {uploading ? `Uploading... ${Math.round(progress)}%` : 'Publish Project to Cloud'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem' }}>Manage Existing Designs</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{allProjects.length} Projects Total</span>
              </div>

              {fetching ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Syncing with cloud database...</p>
                </div>
              ) : allProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>No projects found on the server. Post your first design!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {allProjects.map((project) => (
                    <div key={project.id} className="glass-panel" style={{ 
                      padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {project.images && project.images[project.thumbnailIndex] && (
                          <div style={{
                            width: '80px', height: '60px', borderRadius: '6px',
                            backgroundImage: `url(${project.images[project.thumbnailIndex]})`,
                            backgroundSize: 'cover', backgroundPosition: 'center'
                          }} />
                        )}
                        <div>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{project.title}</h3>
                          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            <span>🏷️ {project.category}</span>
                            <span>🎨 {project.style}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteProject(project)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.6rem 1.2rem',
                          borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                          transition: 'all 0.2s', fontSize: '0.9rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontWeight: 500 }
}
