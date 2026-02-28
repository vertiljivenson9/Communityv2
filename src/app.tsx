import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Loader } from '@/components/Loader';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Communities } from '@/pages/Communities';
import { CommunityPage } from '@/pages/CommunityPage';
import { Profile } from '@/pages/Profile';
import { About } from '@/pages/About';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Layout with Navbar
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function App() {
  const { fetchUser } = useAuthStore();
  const { applyTheme } = useThemeStore();

  useEffect(() => {
    fetchUser();
    applyTheme();
  }, [fetchUser, applyTheme]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'inherit',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/about" 
          element={
            <MainLayout>
              <About />
            </MainLayout>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/communities" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Communities />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/communities/:slug" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <CommunityPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/communities/create" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Communities />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-communities" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Communities />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Communities />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
