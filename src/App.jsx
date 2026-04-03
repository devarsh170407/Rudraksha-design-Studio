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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [isLaunched, setIsLaunched] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to site settings in Firestore
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) {
        setIsLaunched(doc.data().isLaunched);
      } else {
        // Default to not launched if document doesn't exist
        setIsLaunched(false);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching launch status:", error);
      setIsLaunched(true); // Fallback to launched if error
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

  // Show LaunchingSoon if not launched AND user is not an admin
  // We allow admins to see the site even if not launched
  // We also allow the login page to be accessible
  const showMaintenance = !isLaunched && !isAdmin;

  return (
    <Router>
      <ScrollToTop />
      {!showMaintenance && <Navbar />}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {showMaintenance ? (
            <>
              <Route path="/" element={<LaunchingSoon />} />
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
      {!showMaintenance && <Footer />}
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

