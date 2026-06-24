// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Box,
//   Typography,
//   Alert,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import WarningIcon from '@mui/icons-material/Warning';
// import SecurityIcon from '@mui/icons-material/Security';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// // import { useAuth } from '../context/AuthContext';
// import './AlertsComponent.css';

function AlertsComponent() {

  <>
    <p>I am alert tbc</p>
  </>
//   // const { user, addAlert } = useAuth();
//   const [alerts, setAlerts] = useState(user?.alerts || []);
//   const [selectedAlert, setSelectedAlert] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);

//   useEffect(() => {
//     setAlerts(user?.alerts || []);
//   }, [user?.alerts]);

//   // Simulate potential suspicious transactions
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const potentialAlerts = [
//         {
//           id: Math.random(),
//           type: 'unusual_location',
//           title: 'Login from unusual location',
//           description: 'Your account was accessed from New York, NY at 3:45 PM',
//           severity: 'warning',
//           timestamp: new Date(),
//           action: 'Review'
//         },
//         {
//           id: Math.random(),
//           type: 'large_transaction',
//           title: 'Large transaction detected',
//           description: 'A transaction of $2,500 was made to an external account',
//           severity: 'warning',
//           timestamp: new Date(),
//           action: 'Review'
//         }
//       ];

//       // Randomly add one alert
//       if (Math.random() > 0.7 && alerts.length < 5) {
//         const newAlert = potentialAlerts[Math.floor(Math.random() * potentialAlerts.length)];
//         addAlert(newAlert);
//       }
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [alerts.length, addAlert]);

//   const handleAlertClick = (alert) => {
//     setSelectedAlert(alert);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedAlert(null);
//   };

//   const handleApproveTransaction = () => {
//     const updatedAlert = {
//       ...selectedAlert,
//       status: 'approved',
//       severity: 'success'
//     };
//     setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? updatedAlert : a));
//     handleCloseDialog();
//   };

//   const handleDenyTransaction = () => {
//     const updatedAlert = {
//       ...selectedAlert,
//       status: 'denied',
//       severity: 'error'
//     };
//     setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? updatedAlert : a));
//     handleCloseDialog();
//   };

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case 'error':
//         return 'error';
//       case 'warning':
//         return 'warning';
//       case 'success':
//         return 'success';
//       default:
//         return 'info';
//     }
//   };

//   return (
//     <Card sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//         <SecurityIcon color="primary" />
//         <Typography variant="h6">Security Alerts</Typography>
//       </Box>

//       {alerts.length === 0 ? (
//         <Alert severity="success" icon={<CheckCircleIcon />}>
//           Your account is secure. No suspicious activities detected.
//         </Alert>
//       ) : (
//         <List>
//           {alerts.slice(0, 5).map((alert) => (
//             <ListItem
//               key={alert.id}
//               sx={{
//                 border: '1px solid #e0e0e0',
//                 borderRadius: '8px',
//                 mb: 1,
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#f5f5f5'
//                 }
//               }}
//               onClick={() => handleAlertClick(alert)}
//             >
//               <ListItemIcon>
//                 {alert.severity === 'error' ? (
//                   <WarningIcon color="error" />
//                 ) : alert.severity === 'success' ? (
//                   <CheckCircleIcon color="success" />
//                 ) : (
//                   <WarningIcon color="warning" />
//                 )}
//               </ListItemIcon>
//               <ListItemText
//                 primary={alert.title}
//                 secondary={
//                   <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
//                     <Typography variant="body2" color="textSecondary">
//                       {alert.description}
//                     </Typography>
//                     {alert.status && (
//                       <Chip
//                         label={alert.status}
//                         size="small"
//                         variant="outlined"
//                         color={getSeverityColor(alert.severity)}
//                       />
//                     )}
//                   </Box>
//                 }
//               />
//             </ListItem>
//           ))}
//         </List>
//       )}

//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>Alert Details</DialogTitle>
//         <DialogContent sx={{ py: 3 }}>
//           {selectedAlert && (
//             <Box>
//               <Alert severity={selectedAlert.severity} sx={{ mb: 2 }}>
//                 {selectedAlert.title}
//               </Alert>
//               <Typography variant="body2" sx={{ mb: 2 }}>
//                 {selectedAlert.description}
//               </Typography>
//               <Typography variant="caption" color="textSecondary">
//                 Detected at: {selectedAlert.timestamp?.toLocaleString() || 'N/A'}
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Close</Button>
//           {selectedAlert?.status !== 'approved' && selectedAlert?.status !== 'denied' && (
//             <>
//               <Button
//                 onClick={handleDenyTransaction}
//                 color="error"
//                 variant="contained"
//               >
//                 Report Fraud
//               </Button>
//               <Button
//                 onClick={handleApproveTransaction}
//                 color="primary"
//                 variant="contained"
//               >
//                 It's Me
//               </Button>
//             </>
//           )}
//         </DialogActions>
//       </Dialog>
//     </Card>
//   );
}

export default AlertsComponent;
