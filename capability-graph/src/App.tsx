// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';

import { useAuth } from './context/AuthContext';
import { Hexagon, Loader2 } from 'lucide-react';

import { LandingPage }           from './pages/LandingPage';
import { LoginPage }             from './pages/LoginPage';
import { SignupPage }            from './pages/SignupPage';
import { ForgotPasswordPage }    from './pages/ForgotPasswordPage';
import { ResetPasswordPage }     from './pages/ResetPasswordPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { OnboardingPage }        from './pages/OnboardingPage';
import { AIProcessingPage }      from './pages/AIProcessingPage';
import { AIReviewPage }          from './pages/AIReviewPage';
import { DashboardPage }         from './pages/DashboardPage';
import { PublicProfilePage }     from './pages/PublicProfilePage';

// Directs logged-in users directly to their dashboard, while showing the landing page to guests
const RootRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', width: '100vw',
        background: '#07090f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Hexagon size={18} color="white" fill="white" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
          <Loader2 size={16} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* App entry: redirects logged-in users directly to /dashboard, shows LandingPage for guests */}
          <Route path="/"            element={<RootRoute />} />
          <Route path="/landing"     element={<LandingPage />} />
          <Route path="/u/:username" element={<PublicProfilePage />} />
          <Route path="/profile"     element={<PublicProfilePage />} />

          {/* Public-only routes: redirects to /dashboard if already authenticated */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } />
          <Route path="/signup" element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          } />
          <Route path="/reset-password" element={
            <ResetPasswordPage />
          } />

          {/* Verification screen */}
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Protected routes: redirects to /login if unauthenticated */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage initialPage="dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/graph" element={
            <ProtectedRoute>
              <DashboardPage initialPage="graph" />
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <DashboardPage initialPage="projects" />
            </ProtectedRoute>
          } />
          <Route path="/skills" element={
            <ProtectedRoute>
              <DashboardPage initialPage="skills" />
            </ProtectedRoute>
          } />
          <Route path="/experience" element={
            <ProtectedRoute>
              <DashboardPage initialPage="experience" />
            </ProtectedRoute>
          } />
          <Route path="/education" element={
            <ProtectedRoute>
              <DashboardPage initialPage="education" />
            </ProtectedRoute>
          } />
          <Route path="/evidence" element={
            <ProtectedRoute>
              <DashboardPage initialPage="evidence" />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardPage initialPage="settings" />
            </ProtectedRoute>
          } />
          <Route path="/add-information" element={
            <ProtectedRoute>
              <DashboardPage initialPage="add" />
            </ProtectedRoute>
          } />

          {/* Onboarding & AI extraction pipeline */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />
          <Route path="/ai-processing" element={
            <ProtectedRoute>
              <AIProcessingPage />
            </ProtectedRoute>
          } />
          <Route path="/ai-review" element={
            <ProtectedRoute>
              <AIReviewPage />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
