import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { AuthProvider } from './contexts/AuthContext';
import { TermsProvider } from './contexts/TermsContext';
import { GamesProvider } from './contexts/GamesContext';
import { AdminProvider } from './contexts/AdminContext';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { AuthCallback } from './pages/AuthCallback';
import { Games } from './pages/Games';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TermsManagement } from './pages/admin/TermsManagement';
import { GamesManagement } from './pages/admin/GamesManagement';
import { UsersManagement } from './pages/admin/UsersManagement';
import { AdminRoute } from './components/AdminRoute';
import './styles/header.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TermsProvider>
          <GamesProvider>
            <AdminProvider>
              <div className="app">
                <Header />
                <MainContent>
                  <Routes>
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/games" element={<Games />} />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/terms"
                      element={
                        <AdminRoute>
                          <TermsManagement />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/games"
                      element={
                        <AdminRoute>
                          <GamesManagement />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <UsersManagement />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </MainContent>
              </div>
            </AdminProvider>
          </GamesProvider>
        </TermsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;