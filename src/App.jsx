import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'admin' && user.role !== 'assistant-admin') return <Navigate to="/" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" />;
  return children;
};

import { SpeedInsights } from "@vercel/speed-insights/react";
import SplashScreen from './components/SplashScreen';
import InstallOverlay from './components/InstallOverlay';
import SessionWarning from './components/SessionWarning';
import { AnimatePresence, motion } from 'framer-motion';

import AboutDeveloper from './pages/AboutDeveloper';
import AboutApp from './pages/AboutApp';


import { SystemProvider, useSystem } from './context/SystemContext';
import MaintenanceMode from './pages/MaintenanceMode';

const MaintenanceGuard = ({ children }) => {
  const { maintenanceMode, maintenanceUntil, isAdmin, loading } = useSystem();

  if (loading) return null;

  if (maintenanceMode && !isAdmin) {
    return <MaintenanceMode maintenanceUntil={maintenanceUntil} />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Show splash screen for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <SystemProvider>
        <AttendanceProvider>
          <SpeedInsights />
          <InstallOverlay />
          <SessionWarning />
          <AnimatePresence mode="wait">
            {loading ? (
              <SplashScreen key="splash" />
            ) : (
              <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen"
              >
                <MaintenanceGuard>
                  <Router>
                    <Routes>
                      <Route
                        path="/auth"
                        element={
                          <PublicRoute>
                            <Auth />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/about-developer"
                        element={<AboutDeveloper />}
                      />
                      <Route
                        path="/about-app"
                        element={<AboutApp />}
                      />

                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Router>
                </MaintenanceGuard>
              </motion.div>
            )}
          </AnimatePresence>
        </AttendanceProvider>
      </SystemProvider>
    </AuthProvider>
  );
}

export default App;
