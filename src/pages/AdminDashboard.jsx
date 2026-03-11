import React, { useState } from 'react';
// import { db, storage } from '../firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Interiors',
    style: 'Modern'
  });
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!thumbnailFile) {
      setMessage({ text: 'Please select a primary thumbnail.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      // Convert image to base64 Data URL for local storage
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64Image = reader.result;
        
        // Save to LocalStorage
        const existingProjects = JSON.parse(localStorage.getItem('localProjects') || '[]');
        
        const newProject = {
          id: Date.now().toString(),
          title: formData.title,
          category: formData.category,
          style: formData.style,
          thumbnailUrl: base64Image,
          createdAt: Date.now()
        };
        
        existingProjects.push(newProject);
        localStorage.setItem('localProjects', JSON.stringify(existingProjects));

        setProgress(100);
        setMessage({ text: 'Project saved locally in your browser!', type: 'success' });
        
        // Reset
        setTimeout(() => {
          setFormData({ title: '', category: 'Home Interiors', style: 'Modern' });
          setThumbnailFile(null);
          setProgress(0);
          setUploading(false);
          e.target.reset();
        }, 800);
      };

      // Handle file reading error
      reader.onerror = () => {
        setMessage({ text: 'Failed to read image file.', type: 'error' });
        setUploading(false);
      }

      // Start reading
      reader.readAsDataURL(thumbnailFile);
      
      // Simulate progress for UI
      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setProgress(prog);
        if (prog >= 80) clearInterval(interval);
      }, 100);
      
    } catch (error) {
      console.error("Local save error", error);
      setMessage({ text: 'Error saving locally.', type: 'error' });
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        {/* Sidebar Nav */}
        <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ color: 'var(--color-text-primary)', backgroundColor: 'var(--color-accent-primary)', fontWeight: 600, padding: '0.5rem', borderRadius: '8px' }}>+ Add New Project</li>
          </ul>
        </aside>

        {/* Main Content Form */}
        <main className="glass-panel" style={{ padding: '3rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Publish New Design</h2>
          
          {message.text && (
            <div style={{ 
              padding: '1rem', 
              marginBottom: '2rem', 
              borderRadius: '8px', 
              background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)'
            }}>
              {message.text}
            </div>
          )}

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
              <label style={styles.label}>Primary Thumbnail (Required)</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>This image appears on the project card.</p>
              <input type="file" required accept="image/*" onChange={handleFileChange} style={{ color: 'var(--color-text-primary)' }} />
            </div>

            {uploading && (
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, background: 'var(--color-accent-primary)', height: '100%', transition: 'width 0.2s ease' }} />
              </div>
            )}

            <button type="submit" disabled={uploading} className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
              {uploading ? `Saving... ${Math.round(progress)}%` : 'Save Project Locally'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontWeight: 500 }
}
