// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function PrivateRoute({ children }) {
//   const { isAuthenticated, needs2FA } = useAuth();

//   if (!isAuthenticated && !needs2FA) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// export default PrivateRoute;
