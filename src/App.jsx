import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import AdminDashboard from './pages/AdminDashboard';
import LaunchingSoon from './pages/LaunchingSoon';
import Maintenance from './pages/Maintenance';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [siteStatus, setSiteStatus] = useState('launching_soon'); // 'live', 'maintenance', 'launching_soon'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to site settings in Firestore
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.status) {
          setSiteStatus(data.status);
        } else if (data.isLaunched !== undefined) {
          setSiteStatus(data.isLaunched ? 'live' : 'launching_soon');
        } else {
          setSiteStatus('launching_soon');
        }
      } else {
        setSiteStatus('launching_soon');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching launch status:", error);
      setSiteStatus('live'); // Fallback to launched if error
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading || authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Show Splash screen (LaunchingSoon or Maintenance) if not launched AND user is not an admin
  // We allow admins to see the site even if not launched
  const showSplash = siteStatus !== 'live' && !isAdmin;

  return (
    <Router>
      <ScrollToTop />
      {!showSplash && <Navbar />}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {showSplash ? (
            <>
              {siteStatus === 'maintenance' ? (
                <Route path="/" element={<Maintenance />} />
              ) : (
                <Route path="/" element={<LaunchingSoon />} />
              )}
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/project/:id" 
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>
      {!showSplash && <Footer />}
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

