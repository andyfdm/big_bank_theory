import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify2FA from './pages/Verify2FA';
import Dashboard from './pages/dashboard';
import Profile from './pages/Profile';
import Account from './pages/Account';

import HeaderBar from './components/headerBar';
import Chatbot from './components/Chatbot';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function AppContent() {
  const { isAuthenticated, needsVerification } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
      />
      <Route
        path="/verify-2fa-signup"
        element={needsVerification ? <Verify2FA isSignup /> : <Navigate to="/login" />}
      />
      <Route
        path="/verify-2fa"
        element={needsVerification ? <Verify2FA /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <HeaderBar />
            <main style={{ marginTop: 50 }}>
              <Dashboard />
            </main>
            <Chatbot />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <HeaderBar />
            <main style={{ marginTop: 50 }}>
              <Profile />
            </main>
            <Chatbot />
          </PrivateRoute>
        }
      />
      <Route
        path="/account/:accountId"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
