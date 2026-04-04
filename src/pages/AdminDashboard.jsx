import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  CheckCircle, 
  Circle, 
  Mail, 
  MessageCircle, 
  PhoneCall,
  Camera,
  Video,
  Clapperboard,
  UploadCloud,
  ChevronDown,
  Plus
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add'); // 'add', 'manage', 'leads', or 'settings'
  const [allProjects, setAllProjects] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [editingProject, setEditingProject] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ isLaunched: true });
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Interiors',
    style: 'Modern',
    projectStatus: 'Completed',
    description: ''
  });
  
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [threeDVideo, setThreeDVideo] = useState(null);
  const [completedVideo, setCompletedVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLaunchingAnim, setIsLaunchingAnim] = useState(false);
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

  const fetchLeads = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, 'estimates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEstimates(docs);

      const usersSnap = await getDocs(collection(db, 'users'));
      const uMap = {};
      usersSnap.docs.forEach(doc => {
        if (doc.data().phone) {
          uMap[doc.id] = doc.data().phone;
        }
      });
      setUsersMap(uMap);

    } catch (e) {
      console.error('Error fetching leads:', e);
      setMessage({ text: `Failed to load leads: ${e.message}`, type: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const siteDoc = await getDocs(query(collection(db, 'settings')));
      const siteData = siteDoc.docs.find(d => d.id === 'site')?.data();
      if (siteData) {
        setSiteSettings(siteData);
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  const toggleLaunch = async () => {
    const newStatus = !siteSettings.isLaunched;
    setUploading(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { ...siteSettings, isLaunched: newStatus, status: newStatus ? 'live' : 'maintenance' });
      setSiteSettings({ ...siteSettings, isLaunched: newStatus, status: newStatus ? 'live' : 'maintenance' });
      setMessage({ text: `Site is now ${newStatus ? 'LIVE' : 'UNDER MAINTENANCE'}`, type: 'success' });
    } catch (e) {
      console.error('Error toggling launch:', e);
      setMessage({ text: 'Error updating launch status.', type: 'error' });
    } finally {
      setTimeout(() => setMessage({text: '', type: ''}), 3000);
      setUploading(false);
    }
  };

  const handleTogglePermanent = async () => {
    const newPerm = !siteSettings.launchPermanent;
    setUploading(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { ...siteSettings, launchPermanent: newPerm });
      setSiteSettings({ ...siteSettings, launchPermanent: newPerm });
      setMessage({ text: `Permanent Launch is now ${newPerm ? 'Enabled' : 'Disabled'}`, type: 'success' });
    } catch (e) {
      console.error('Error toggling permanent config:', e);
      setMessage({ text: 'Error updating permanent status.', type: 'error' });
    } finally {
      setTimeout(() => setMessage({text: '', type: ''}), 3000);
      setUploading(false);
    }
  };

  const handleUpdateStatus = async (collectionName, docId, newStatus) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, { status: newStatus });
      
      // Update local state
      if (collectionName === 'estimates') {
        setEstimates(prev => prev.map(item => item.id === docId ? { ...item, status: newStatus } : item));
      }
      
      setMessage({ text: 'Status updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (e) {
      console.error('Error updating status:', e);
      setMessage({ text: 'Error updating status.', type: 'error' });
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchProjects();
    }
    if (activeTab === 'leads') {
      fetchLeads();
    }
    if (activeTab === 'settings') {
      fetchSettings();
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

  const handleThreeDVideoChange = (e) => {
    if (e.target.files[0]) setThreeDVideo(e.target.files[0]);
  };

  const handleCompletedVideoChange = (e) => {
    if (e.target.files[0]) setCompletedVideo(e.target.files[0]);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions (e.g., 1920px)
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.8 quality
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handlegithubUpload = async (file, path) => {
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    const GITHUB_USER = import.meta.env.VITE_GITHUB_USER;
    const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
    
    if (!GITHUB_TOKEN || !GITHUB_USER || !GITHUB_REPO) {
      throw new Error('GitHub configuration missing in .env');
    }

    // Filenames are now prefixed with a unique timestamp + random string
    // to guarantee no collisions even with rapid clicks
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const fileName = `${Date.now()}_${uniqueId}_${file.name.replace(/\s+/g, '_')}`;
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}/${fileName}`;
    
    const base64Content = await fileToBase64(file);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${fileName} via Admin Dashboard`,
        content: base64Content
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      // If we get a conflict (409), it means the file somehow already exists.
      // But with our naming convention, this shouldn't happen.
      throw new Error(error.message || `GitHub upload failed (${response.status})`);
    }

    return `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${path}/${fileName}`;
  };

  const deleteGithubFileByURL = async (fileUrl) => {
    if (!fileUrl || !fileUrl.includes('raw.githubusercontent.com')) return;
    
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    const GITHUB_USER = import.meta.env.VITE_GITHUB_USER;
    const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
    
    try {
      const prefix = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/`;
      if (!fileUrl.startsWith(prefix)) return;
      
      const path = fileUrl.replace(prefix, '');
      
      const getUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;
      const getRes = await fetch(getUrl, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });
      
      if (!getRes.ok) return;
      const fileData = await getRes.json();
      
      await fetch(getUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete ${path} via Admin Dashboard`,
          sha: fileData.sha
        })
      });
    } catch (err) {
      console.error('Error deleting file from GitHub:', err);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm('Delete this project permanently? This will also remove the uploaded files from GitHub storage.')) return;
    
    setMessage({ text: 'Deleting project and associated files...', type: '' });
    try {
      if (project.images && Array.isArray(project.images)) {
        for (const url of project.images) {
          await deleteGithubFileByURL(url);
        }
      }
      if (project.threeDVideo) await deleteGithubFileByURL(project.threeDVideo);
      if (project.completedVideo) await deleteGithubFileByURL(project.completedVideo);
      
      await deleteDoc(doc(db, 'projects', project.id));
      
      fetchProjects();
      setMessage({ text: 'Project and all associated files deleted successfully.', type: 'success' });
    } catch (e) {
      console.error('Error deleting project:', e);
      setMessage({ text: 'Error deleting project.', type: 'error' });
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
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
      // Use a robust project ID combining timestamp and random string
      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const totalFiles = images.length + (threeDVideo ? 1 : 0) + (completedVideo ? 1 : 0);
      let uploadedCount = 0;

      const updateProgress = () => {
        uploadedCount++;
        setProgress((uploadedCount / totalFiles) * 100);
      };

      // 1. Compress and Upload Images SEQUENTIALLY
      // Sequential upload is required to avoid GitHub SHA/Commit conflicts
      const imageUrls = [];
      for (const img of images) {
        const compressedImg = await compressImage(img);
        const url = await handlegithubUpload(compressedImg, `public/uploads/${projectId}/images`);
        imageUrls.push(url);
        updateProgress();
      }

      // 2. Upload Videos (Direct to GitHub, bypassing Vercel limits) - Also Sequentially
      let threeDVideoUrl = null;
      if (threeDVideo) {
        threeDVideoUrl = await handlegithubUpload(threeDVideo, `public/uploads/${projectId}/videos`);
        updateProgress();
      }

      let completedVideoUrl = null;
      if (completedVideo) {
        completedVideoUrl = await handlegithubUpload(completedVideo, `public/uploads/${projectId}/videos`);
        updateProgress();
      }

      // 3. Save to Firestore (Sanitized to avoid undefined fields)
      const newProject = {
        title: formData.title || 'Untitled Project',
        category: formData.category || 'Home Interiors',
        style: formData.style || 'Modern',
        images: imageUrls, 
        thumbnailIndex: thumbnailIndex,
        threeDVideo: threeDVideoUrl || '',
        completedVideo: completedVideoUrl || '',
        projectStatus: formData.projectStatus || 'Completed',
        description: formData.description || '',
        createdAt: serverTimestamp(),
        localId: projectId
      };
      
      await addDoc(collection(db, 'projects'), newProject);

      setMessage({ text: 'Project published! Images compressed and files saved to GitHub (Direct).', type: 'success' });
      
      // Reset
      setTimeout(() => {
        setFormData({ 
          title: '', category: 'Home Interiors', style: 'Modern', projectStatus: 'Completed', description: ''
        });
        setImages([]);
        setThumbnailIndex(0);
        setThreeDVideo(null);
        setCompletedVideo(null);
        setProgress(0);
        setUploading(false);
        if (e.target.reset) e.target.reset();
      }, 800);
      
    } catch (error) {
      console.error("Project upload error:", error);
      let errorMsg = `Upload Failed: ${error.message}`;
      
      if (error.message && error.message.includes('CORS')) {
        errorMsg = "CORS Error: GitHub or the browser is blocking the direct upload. Please check your GitHub token permissions.";
      }
      
      setMessage({ text: errorMsg, type: 'error' });
      setUploading(false);
    }
  };

  const handleToggleProjectStatus = async (project) => {
    const newStatus = project.projectStatus === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await updateDoc(doc(db, 'projects', project.id), { projectStatus: newStatus });
      setAllProjects(prev => prev.map(p => p.id === project.id ? { ...p, projectStatus: newStatus } : p));
      setMessage({ text: `Project marked as ${newStatus}`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (e) {
      console.error('Update status error:', e);
      setMessage({ text: 'Error updating project status.', type: 'error' });
    }
  };

  const handleEditInit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      style: project.style,
      projectStatus: project.projectStatus || 'Completed',
      description: project.description || ''
    });
    setImages([]); // This will be for NEW images added during edit
    setThumbnailIndex(project.thumbnailIndex || 0);
  };

  const handleRemoveExistingImage = (imgUrl) => {
    const newImages = editingProject.images.filter(url => url !== imgUrl);
    setEditingProject({ ...editingProject, images: newImages });
    if (thumbnailIndex >= newImages.length) {
        setThumbnailIndex(0);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setProgress(0);
    try {
      let finalImages = [...editingProject.images];
      
      if (images.length > 0) {
        setMessage({ text: 'Uploading new images...', type: '' });
        const projectId = editingProject.localId || `proj_edit_${Date.now()}`;
        for (const img of images) {
          const compressedImg = await compressImage(img);
          const url = await handlegithubUpload(compressedImg, `public/uploads/${projectId}/images`);
          finalImages.push(url);
          setProgress((finalImages.length / (images.length + editingProject.images.length)) * 100);
        }
      }

      const updatedProject = {
        title: formData.title || editingProject.title || 'Untitled Project',
        category: formData.category || editingProject.category || 'Home Interiors',
        style: formData.style || editingProject.style || 'Modern',
        projectStatus: formData.projectStatus || editingProject.projectStatus || 'Completed',
        description: formData.description || '',
        images: finalImages,
        thumbnailIndex: thumbnailIndex,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'projects', editingProject.id), updatedProject);
      
      setMessage({ text: 'Project updated successfully!', type: 'success' });
      setEditingProject(null);
      fetchProjects();
      
      // Reset
      setTimeout(() => {
        setFormData({ 
          title: '', category: 'Home Interiors', style: 'Modern', projectStatus: 'Completed', description: ''
        });
        setImages([]);
        setThumbnailIndex(0);
        setMessage({ text: '', type: '' });
        setUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Save edit error:", error);
      setMessage({ text: `Update Failed: ${error.message}`, type: 'error' });
      setUploading(false);
    }
  };

  return (
    <div className="container admin-container" style={{ padding: '2rem 1.5rem', minHeight: '80vh', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <h1 className="admin-title" style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Admin Dashboard</h1>
      
      <div className="admin-layout">
        {/* Sidebar Nav */}
        <aside className="glass-panel admin-sidebar">
          <ul className="admin-sidebar-list">
            <li>
              <button 
                onClick={() => setActiveTab('add')}
                className="admin-sidebar-btn"
                style={{
                  background: activeTab === 'add' ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === 'add' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)'
                }}>
                + Add New Project
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('manage')}
                className="admin-sidebar-btn"
                style={{
                  background: activeTab === 'manage' ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === 'manage' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)'
                }}>
                📁 Manage Existing Designs
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('leads')}
                className="admin-sidebar-btn"
                style={{
                  background: activeTab === 'leads' ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === 'leads' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)'
                }}>
                📊 Business Leads
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('settings')}
                className="admin-sidebar-btn"
                style={{
                  background: activeTab === 'settings' ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === 'settings' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)'
                }}>
                ⚙️ Site Settings
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="glass-panel admin-main-content">
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
                <div className="admin-form-group">
                  <label className="admin-label">Project Title</label>
                  <input name="title" className="admin-input" placeholder="e.g. Minimalist Urban Condo" required value={formData.title} onChange={handleChange} />
                </div>
                
                <div className="admin-form-row dropdown-row">
                  <div className="admin-select-wrapper">
                    <select name="category" className="admin-select" value={formData.category} onChange={handleChange}>
                      <option>Home Interiors</option>
                      <option>Modular Kitchen</option>
                      <option>Living Room</option>
                      <option>Bedroom</option>
                      <option>Wardrobe</option>
                      <option>Space Saving Furniture</option>
                      <option>Home Office</option>
                      <option>Bathroom</option>
                    </select>
                    <ChevronDown className="select-icon" size={18} />
                  </div>
                  <div className="admin-select-wrapper">
                    <select name="style" className="admin-select" value={formData.style} onChange={handleChange}>
                      <option>Modern</option>
                      <option>Classic</option>
                      <option>Minimalist</option>
                    </select>
                    <ChevronDown className="select-icon" size={18} />
                  </div>
                  <div className="admin-select-wrapper">
                    <select name="projectStatus" className="admin-select" value={formData.projectStatus} onChange={handleChange}>
                      <option>Completed</option>
                      <option>In Progress</option>
                    </select>
                    <ChevronDown className="select-icon" size={18} />
                  </div>
                </div>

                <div className="admin-dropzone-large" onClick={() => document.getElementById('gallery-input').click()}>
                  <div className="dropzone-content">
                    <div className="dropzone-icon-main">
                      <Camera size={40} strokeWidth={1.5} color="#2563eb" />
                    </div>
                    <div className="dropzone-text">
                      <span className="required-label">Project Images Gallery </span>
                      <span className="label-meta">(Required)</span>
                      <p>Drop images here or click to browse</p>
                    </div>
                  </div>
                  <input id="gallery-input" style={{ display: 'none' }} type="file" required multiple accept="image/*" onChange={handleImagesChange} />
                  
                  {images.length > 0 && (
                    <div className="gallery-preview-grid">
                      {images.map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={(e) => { e.stopPropagation(); setThumbnailIndex(idx); }}
                          className={`preview-item ${thumbnailIndex === idx ? 'active-thumb' : ''}`}
                          style={{ backgroundImage: `url(${URL.createObjectURL(img)})` }}
                        >
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="remove-preview">×</button>
                          {thumbnailIndex === idx && <div className="primary-tag">PRIMARY</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-form-row video-row">
                  <div className="admin-dropzone-small" onClick={() => document.getElementById('v3d-input').click()}>
                    <div className="dropzone-content">
                      <Video size={24} strokeWidth={1.5} color="#666" />
                      <div className="dropzone-text-small">
                        3D Design Video <span className="label-meta">(Optional)</span>
                      </div>
                    </div>
                    <input id="v3d-input" style={{ display: 'none' }} type="file" accept="video/*" onChange={handleThreeDVideoChange} />
                    {threeDVideo && <div className="file-ready">✓ {threeDVideo.name}</div>}
                  </div>
                  
                  <div className="admin-dropzone-small" onClick={() => document.getElementById('vcomp-input').click()}>
                    <div className="dropzone-content">
                      <Clapperboard size={24} strokeWidth={1.5} color="#666" />
                      <div className="dropzone-text-small">
                        Completed Video <span className="label-meta">(Optional)</span>
                      </div>
                    </div>
                    <input id="vcomp-input" style={{ display: 'none' }} type="file" accept="video/*" onChange={handleCompletedVideoChange} />
                    {completedVideo && <div className="file-ready">✓ {completedVideo.name}</div>}
                  </div>
                </div>

                <div>
                  <label className="admin-label">Project Description</label>
                  <textarea 
                    name="description" 
                    className="admin-input" 
                    placeholder="Describe the design story..." 
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    value={formData.description} 
                    onChange={handleChange} 
                  />
                </div>

                {uploading && (
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, background: 'var(--color-accent-primary)', height: '100%', transition: 'width 0.2s ease' }} />
                  </div>
                )}

                <button type="submit" disabled={uploading} className="publish-project-btn">
                  <UploadCloud size={20} />
                  {uploading ? `Uploading... ${Math.round(progress)}%` : 'Publish Project to Cloud'}
                </button>
              </form>
            </>
          ) : activeTab === 'manage' ? (
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
              ) : editingProject ? (
                /* EDIT UI */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>Edit Project: {editingProject.title}</h2>
                    <button onClick={() => setEditingProject(null)} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                  </div>
                  
                  <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <label style={styles.label}>Project Title</label>
                      <input name="title" className="input-field" required value={formData.title} onChange={handleChange} />
                    </div>

                    <div>
                      <label style={styles.label}>Project Description</label>
                      <textarea 
                        name="description" 
                        className="input-field" 
                        style={{ minHeight: '120px', resize: 'vertical' }}
                        value={formData.description} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
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
                      <div>
                        <label style={styles.label}>Project Status</label>
                        <select name="projectStatus" className="input-field" value={formData.projectStatus} onChange={handleChange}>
                          <option>Completed</option>
                          <option>In Progress</option>
                        </select>
                      </div>
                    </div>

                    {/* Current Images Management */}
                    <div>
                      <label style={styles.label}>Current Images (Click to set Primary)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
                        {editingProject.images.map((img, idx) => (
                          <div 
                            key={`existing-${idx}`}
                            onClick={() => setThumbnailIndex(idx)}
                            style={{ 
                              height: '100px', 
                              backgroundImage: `url(${img})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              border: thumbnailIndex === idx ? '3px solid var(--color-accent-primary)' : '2px solid rgba(255,255,255,0.1)',
                              position: 'relative'
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(img); }}
                              style={{
                                position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px',
                                background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                            {thumbnailIndex === idx && (
                              <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'var(--color-accent-primary)', color: '#000', fontSize: '0.6rem', textAlign: 'center', fontWeight: 'bold' }}>PRIMARY</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add More Images */}
                    <div className="file-upload-zone">
                      <div className="file-upload-icon">➕</div>
                      <label className="file-upload-text">
                        <span>Add Newer Photos</span>
                        <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>Drop images here or click to browse</p>
                      </label>
                      <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
                      
                      {images.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.8rem', marginTop: '1rem', width: '100%' }}>
                          {images.map((img, idx) => (
                            <div key={`new-${idx}`} style={{ height: '80px', backgroundImage: `url(${URL.createObjectURL(img)})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', position: 'relative' }}>
                               <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', width: '20px', height: '20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', fontSize: '10px' }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {uploading && (
                      <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px' }}>
                        <div style={{ width: `${progress}%`, background: 'var(--color-accent-primary)', height: '100%', transition: 'width 0.2s' }} />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" disabled={uploading} className="btn-primary" style={{ flex: 1 }}>
                        {uploading ? 'Updating Project...' : 'Save All Changes'}
                      </button>
                      <button type="button" onClick={() => setEditingProject(null)} className="btn-outline" style={{ flex: 1 }}>
                        Discard & Back
                      </button>
                    </div>
                  </form>
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
                      
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                onClick={() => handleEditInit(project)}
                                style={{
                                    background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb',
                                    border: '1px solid rgba(37, 99, 235, 0.2)',
                                    padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                                }}
                            >
                                Edit Details
                            </button>
                            <button 
                                onClick={() => handleToggleProjectStatus(project)}
                                style={{
                                background: project.projectStatus === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                color: project.projectStatus === 'Completed' ? '#22c55e' : '#eab308',
                                border: `1px solid ${project.projectStatus === 'Completed' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}`,
                                padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                                }}
                            >
                                {project.projectStatus || 'Completed'}
                            </button>
                          </div>
                          <button 
                            onClick={() => handleDeleteProject(project)}
                            style={{
                              background: 'transparent', color: 'rgba(239, 68, 68, 0.6)',
                              border: 'none', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline'
                            }}
                          >
                            Delete Permanent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : activeTab === 'settings' ? (
             <div style={{ maxWidth: '850px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Site Settings</h2>
              </div>
              
              {!siteSettings.launchPermanent ? (
                <div className="glass-panel" style={{ 
                  padding: '4rem 2rem', 
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.05) 0%, rgba(5, 5, 5, 0.8) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.05)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2rem'
                }}>
                  <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '3rem' }}>🌌</span>
                  </div>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Ready for the World?
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    Your site is currently in "Launching Soon" mode. When you are fully satisfied with your project galleries and ready to reveal your studio to the world, click the button below to initiate the Grand Launch.
                  </p>
                  <button 
                    onClick={async () => {
                      setIsLaunchingAnim(true);
                      setTimeout(async () => {
                        try {
                          await setDoc(doc(db, 'settings', 'site'), { ...siteSettings, isLaunched: true, status: 'live', launchPermanent: true });
                          setSiteSettings({ ...siteSettings, isLaunched: true, status: 'live', launchPermanent: true });
                        } catch(e) { console.error(e); }
                        setIsLaunchingAnim(false);
                      }, 4000);
                    }}
                    disabled={isLaunchingAnim}
                    style={{ 
                      padding: '1.5rem 3rem', fontSize: '1.2rem', borderRadius: '100px', 
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', border: 'none', 
                      boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)', color: 'white',
                      cursor: 'pointer', transition: 'transform 0.2s', fontWeight: 800, marginTop: '1rem'
                    }}
                  >
                    {isLaunchingAnim ? 'INITIATING...' : '🚀 INITIATE GRAND LAUNCH'}
                  </button>

                  <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
                    Note: Once the site is Grand Launched, the "Maintenance Mode" controls will be permanently unlocked here for future use.
                  </div>
                </div>
              ) : (
                <div className="glass-panel" style={{ 
                  padding: '3rem', 
                  borderRadius: '24px',
                  background: siteSettings.isLaunched 
                    ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.05) 0%, rgba(5, 5, 5, 0.8) 100%)' 
                    : 'linear-gradient(145deg, rgba(239, 68, 68, 0.05) 0%, rgba(5, 5, 5, 0.8) 100%)',
                  border: `1px solid ${siteSettings.isLaunched ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  boxShadow: siteSettings.isLaunched ? '0 10px 40px rgba(34, 197, 94, 0.05)' : '0 10px 40px rgba(239, 68, 68, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%',
                    background: siteSettings.isLaunched ? 'var(--color-success)' : 'var(--color-error)',
                    filter: 'blur(100px)', opacity: 0.15, zIndex: 0
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2.5rem' }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.2rem', borderRadius: '100px', background: siteSettings.isLaunched ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: siteSettings.isLaunched ? '#4ade80' : '#f87171', border: `1px solid ${siteSettings.isLaunched ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: siteSettings.isLaunched ? '#4ade80' : '#f87171', boxShadow: `0 0 10px ${siteSettings.isLaunched ? '#4ade80' : '#f87171'}` }} />
                          {siteSettings.isLaunched ? 'System Online' : 'System Offline'}
                        </div>
                        <h3 style={{ fontSize: '2.2rem', marginBottom: '0.8rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                          {siteSettings.isLaunched ? 'Global Launch Live' : 'Under Maintenance'}
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '450px', lineHeight: 1.7 }}>
                          {siteSettings.isLaunched 
                            ? 'Your website is completely public. Visitors can browse all projects, submit leads, and view interior plans seamlessly without restrictions.' 
                            : 'The public website is locked down. Only administrators can bypass the maintenance screen to edit content securely in the background.'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
                        <button 
                          onClick={toggleLaunch}
                          disabled={uploading}
                          className={siteSettings.isLaunched ? "btn-outline" : "btn-primary"}
                          style={{
                            padding: '1.2rem 2.5rem',
                            borderRadius: '16px',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            minWidth: '220px',
                            border: siteSettings.isLaunched ? '2px solid rgba(239,68,68,0.5)' : undefined,
                            color: siteSettings.isLaunched ? '#f87171' : undefined,
                            background: siteSettings.isLaunched ? 'rgba(239,68,68,0.05)' : undefined,
                            boxShadow: siteSettings.isLaunched ? 'none' : '0 10px 30px rgba(37, 99, 235, 0.5)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {siteSettings.isLaunched ? (
                             <>⚙️ Enter Maintenance</>
                          ) : (
                             <>🚀 Relaunch to Public</>
                          )}
                        </button>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center', opacity: 0.8 }}>
                           {siteSettings.isLaunched ? 'Hides site from visitors' : 'Makes site public instantly'}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                      <div style={{ background: 'linear-gradient(135deg, #2563eb, #60a5fa)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>i</div>
                      <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6 }}>
                        <strong style={{ color: '#60a5fa', fontWeight: 700 }}>Administrator Access:</strong> Because you are currently logged in to your Admin portal, you will automatically bypass the maintenance screen. To view the maintenance screen exactly as public visitors see it, open your website in an <strong style={{ color: 'white' }}>Incognito Window</strong> or log out first.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Business Leads & Estimates</h2>
                <button 
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="glass-panel"
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: `1px solid ${showCompleted ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                    color: showCompleted ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {showCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                  {showCompleted ? 'Showing All' : 'Hiding Completed'}
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--color-accent-primary)', fontSize: '1.2rem' }}>Project Inquiries (Estimates)</h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{estimates.length} Inquiries</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <th style={{ padding: '1rem' }}>User Email</th>
                          <th style={{ padding: '1rem' }}>Rooms</th>
                          <th style={{ padding: '1rem' }}>Style</th>
                          <th style={{ padding: '1rem' }}>Date</th>
                          <th style={{ padding: '1rem' }}>Status</th>
                          <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estimates
                          .filter(est => showCompleted || est.status !== 'done')
                          .map(est => (
                          <tr key={est.id} style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            opacity: est.status === 'done' ? 0.6 : 1,
                            background: est.status === 'done' ? 'rgba(0,0,0,0.2)' : 'transparent'
                          }}>
                            <td style={{ padding: '1rem' }}>{est.userEmail}</td>
                            <td style={{ padding: '1rem', fontSize: '0.85rem', maxWidth: '200px' }}>{est.roomsFormatted || est.rooms?.join(', ')}</td>
                            <td style={{ padding: '1rem' }}>{est.styleFormatted || est.style}</td>
                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                              {est.createdAt?.seconds ? new Date(est.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <button 
                                onClick={() => handleUpdateStatus('estimates', est.id, est.status === 'done' ? 'pending' : 'done')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: est.status === 'done' ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                  fontSize: '0.85rem'
                                }}
                              >
                                {est.status === 'done' ? <CheckCircle size={18} /> : <Circle size={18} />}
                                {est.status === 'done' ? 'Done' : 'Pending'}
                              </button>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.8rem' }}>
                                {usersMap[est.userId] && (
                                  <a href={`https://wa.me/91${usersMap[est.userId].replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}><MessageCircle size={18} /></a>
                                )}
                                <a href={`mailto:${est.userEmail}`} style={{ color: 'var(--color-accent-primary)' }}><Mail size={18} /></a>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {estimates.length === 0 && (
                          <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No inquiries found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
      
      {/* ── FULL SCREEN GRAND LAUNCH ANIMATION OVERLAY ── */}
      {isLaunchingAnim && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(20px)',
          zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: 'launchFadeIn 0.3s ease-out'
        }}>
          <div style={{ animation: 'launchRocket 4s ease-in forwards', fontSize: '6rem', marginBottom: '2rem', filter: 'drop-shadow(0 20px 20px rgba(239,68,68,0.5))' }}>
            🚀
          </div>
          <h2 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, textAlign: 'center', animation: 'pulseText 1.5s infinite' }}>
            Permanent Launch Initiated...
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginTop: '1rem' }}>
            Deploying final changes to the public. Unlock sequences activated.
          </p>
          <div style={{ width: '400px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '3rem', overflow: 'hidden' }}>
             <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #a78bfa)', animation: 'launchProgress 4s ease-in-out forwards' }} />
          </div>
          <style>{`
            @keyframes launchFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes launchRocket {
              0% { transform: translateY(0) scale(1); opacity: 1; }
              40% { transform: translateY(20px) scale(0.9); opacity: 1; }
              100% { transform: translateY(-1000px) scale(1.5); opacity: 0; }
            }
            @keyframes launchProgress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            @keyframes pulseText {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

const styles = {
  label: { display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontWeight: 500 }
};

// Admin Dashboard Exclusive Styles
const dashboardCSS = `
  .admin-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .admin-label {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .admin-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.9rem 1.2rem;
    border-radius: 12px;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
  }

  .admin-input:focus {
    border-color: #2563eb;
    background: rgba(255, 255, 255, 0.05);
  }

  .admin-form-row {
    display: flex;
    gap: 1rem;
  }

  .dropdown-row .admin-select-wrapper {
    flex: 1;
    position: relative;
  }

  .admin-select {
    width: 100%;
    appearance: none;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.8rem 1rem;
    padding-right: 2.5rem;
    border-radius: 12px;
    font-size: 0.95rem;
    cursor: pointer;
    outline: none;
  }

  .admin-select option {
    background: #1a1a1a;
    color: white;
  }

  .select-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: rgba(255, 255, 255, 0.4);
  }

  .admin-dropzone-large {
    border: 2px dashed rgba(37, 99, 235, 0.3);
    background: rgba(37, 99, 235, 0.02);
    border-radius: 16px;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .admin-dropzone-large:hover {
    background: rgba(37, 99, 235, 0.05);
    border-color: #2563eb;
  }

  .dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .dropzone-icon-main {
    width: 60px;
    height: 60px;
    background: rgba(37, 99, 235, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropzone-text {
    line-height: 1.4;
  }

  .required-label {
    font-weight: 600;
    color: white;
    font-size: 1.1rem;
  }

  .label-meta {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.85rem;
  }

  .dropzone-text p {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }

  .gallery-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    width: 100%;
    margin-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1.5rem;
  }

  .preview-item {
    height: 80px;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;
  }

  .active-thumb {
    border-color: #2563eb;
    box-shadow: 0 0 15px rgba(37, 99, 235, 0.3);
  }

  .remove-preview {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .primary-tag {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #2563eb;
    color: white;
    font-size: 0.6rem;
    font-weight: 800;
    text-align: center;
    padding: 2px 0;
  }

  .admin-dropzone-small {
    flex: 1;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .admin-dropzone-small:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .dropzone-text-small {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
  }

  .file-ready {
    font-size: 0.75rem;
    color: #2563eb;
    font-weight: 600;
    margin-top: 0.4rem;
  }

  .publish-project-btn {
    background: #2563eb;
    color: white;
    padding: 1.2rem;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    margin-top: 1rem;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
  }

  .publish-project-btn:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
  }

  .publish-project-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = dashboardCSS;
  document.head.appendChild(styleEl);
}

