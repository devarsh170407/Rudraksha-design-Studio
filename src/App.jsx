import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import GlobalLaunchOverlay from './components/GlobalLaunchOverlay';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [siteStatus, setSiteStatus] = useState('launching_soon'); // 'live', 'maintenance', 'launching_soon'
  const [loading, setLoading] = useState(true);
  const [isGlobalLaunching, setIsGlobalLaunching] = useState(false);
  const prevStatusRef = React.useRef('loading');
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to site settings in Firestore
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      let currentFirebaseStatus = 'launching_soon';
      if (doc.exists()) {
        const data = doc.data();
        if (data.status) {
          currentFirebaseStatus = data.status;
        } else if (data.isLaunched !== undefined) {
          currentFirebaseStatus = data.isLaunched ? 'live' : 'launching_soon';
        }
      }

      // If transition from launching_soon/maintenance -> live
      if (prevStatusRef.current !== 'loading' && prevStatusRef.current !== 'live' && currentFirebaseStatus === 'live') {
         setIsGlobalLaunching(true);
         navigate('/');
      }
      
      prevStatusRef.current = currentFirebaseStatus;
      setSiteStatus(currentFirebaseStatus);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching launch status:", error);
      setSiteStatus('launching_soon'); // Fallback to safe mode if error
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
    <>
      <ScrollToTop />
      {isGlobalLaunching && <GlobalLaunchOverlay onComplete={() => setIsGlobalLaunching(false)} />}
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

