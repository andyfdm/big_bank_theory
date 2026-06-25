import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/dashboard';
import Profile from './pages/Profile';
import Account from './pages/Account'

// Components
import HeaderBar from './components/headerBar';
import Chatbot from './components/Chatbot';
import PrivateRoute from './components/PrivateRoute';

// light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

// dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#91D0D7',
    },
  },
});

// function AppContent() {
//   const { isAuthenticated, needs2FA } = useAuth();

//   return (
//     <Routes>
//       {/* Auth Routes */}
//       <Route 
//         path="/login" 
//         element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
//       />
//       <Route 
//         path="/signup" 
//         element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
//       />
//       <Route 
//         path="/verify-2fa-signup" 
//         element={needs2FA ? <Verify2FA isSignup={true} /> : <Navigate to="/login" />} 
//       />
//       <Route 
//         path="/verify-2fa" 
//         element={needs2FA ? <Verify2FA isSignup={false} /> : <Navigate to="/login" />} 
//       />

//       {/* Protected Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <PrivateRoute>
//             <HeaderBar />
//             <Dashboard />
//             <Chatbot />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <PrivateRoute>
//             <HeaderBar />
//             <Profile />
//             <Chatbot />
//           </PrivateRoute>
//         }
//       />

//       {/* Default Route */}
//       <Route 
//         path="/" 
//         element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
//       />

//       {/* Catch all */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// }

function App() {
  return (
    //TODO: Re-enable routing and auth context when ready
    // <AuthProvider>
    //   <BrowserRouter>
    //     <AppContent />
    //   </BrowserRouter>
    // </AuthProvider>
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <HeaderBar />
        {/* <Dashboard /> */}
        <Account/>
        {/* <Profile /> */}
        {/* <Login/> */}
      </ThemeProvider>
    </>

  );
}

export default App;
