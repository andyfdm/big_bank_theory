# FDM Bank - Banking Application

## Project Overview
A modern, secure banking web application built with React featuring authentication, 2FA security, account management, customer support chatbot, and fraud detection alerts.

## Features Implemented

### 1. **Authentication System**
- **Sign Up**: Create new accounts with name, email, phone, and password
- **Login**: Secure login with email and password
- **Two-Factor Authentication (2FA)**: 
  - TOTP-based 2FA using speakeasy
  - QR code generation for authenticator apps
  - Manual entry code support
  - Verification during login and signup

### 2. **Dashboard**
- Display user's accounts with balances
- Quick action buttons for payments and transfers
- Recent transaction history
- Statistics cards for account overview
- Integrated security alerts display
- Personalized welcome message with user's name

### 3. **Security Alerts System**
- Real-time suspicious transaction detection
- Alert types:
  - Unusual login locations
  - Large transaction amounts
  - Fraud detection notifications
- User can approve or deny transactions
- Historical alert tracking
- Alert severity levels (warning, error, success)

### 4. **Customer Support Chatbot**
- Floating chatbot widget
- AI-like responses for:
  - Account balance inquiries
  - Transfer instructions
  - Security questions
  - Fraud prevention guidance
- Chat history display
- Typing indicators
- 24/7 availability
- Responsive design for mobile

### 5. **User Profile Management**
- View account details
- Edit profile information:
  - Full name
  - Email
  - Phone number
- Security settings display
- 2FA status
- Logout functionality
- User avatar with initials

### 6. **Navigation & Routing**
- React Router implementation
- Protected routes for authenticated users
- Automatic redirection:
  - Unauthenticated users → Login page
  - Authenticated users → Dashboard
- Navigation between Dashboard and Profile
- Responsive header with user menu

### 7. **Data Persistence**
- LocalStorage-based data persistence
- User information storage
- 2FA secret storage
- Automatic session restoration

## Technology Stack

### Frontend
- **React 19.2.7** - UI library
- **React Router DOM** - Client-side routing
- **Material-UI (MUI) 6.0.0** - UI component library
- **Emotion** - CSS-in-JS styling

### Security & Authentication
- **Speakeasy** - TOTP/2FA library
- **QRCode.react** - QR code generation

### Utilities
- **Axios** - HTTP client (installed, ready for backend integration)
- **date-fns** - Date formatting (installed, ready for use)
- **React Transition Group** - Animation support

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AlertsComponent.js - Security alerts display
│   │   ├── AlertsComponent.css
│   │   ├── Chatbot.js - Customer support chatbot
│   │   ├── Chatbot.css
│   │   ├── PrivateRoute.js - Route protection
│   │   ├── headerBar.js - Navigation header
│   │   ├── headerBar.css
│   │   ├── accountCard.js - Account display card
│   │   ├── payCard.js - Payment action card
│   │   ├── statCard.js - Statistics card
│   │   ├── paymentHistory.js - Transaction history item
│   │   └── [other existing components]
│   ├── context/
│   │   └── AuthContext.js - Authentication state management
│   ├── pages/
│   │   ├── Login.js - Login page
│   │   ├── Signup.js - Sign up page
│   │   ├── Verify2FA.js - 2FA verification page
│   │   ├── Profile.js - User profile page
│   │   ├── dashboard.js - Main dashboard
│   │   ├── auth.css - Auth pages styling
│   │   ├── Profile.css - Profile page styling
│   │   └── dashboard.css - Dashboard styling
│   ├── App.js - Main app component with routing
│   ├── App.css - Global styling
│   └── [other files]
├── package.json
└── [other config files]
```

## Usage Flow

### New User Registration
1. Click "Sign Up" on the login page
2. Enter name, email, phone, and create password
3. System generates 2FA secret
4. Scan QR code with authenticator app or enter code manually
5. Enter 6-digit code from authenticator
6. Successfully logged in and redirected to Dashboard

### Existing User Login
1. Enter email and password
2. Submit login form
3. 2FA verification page appears
4. Enter 6-digit code from authenticator
5. Redirected to Dashboard

### Dashboard Features
- View all connected accounts with balances
- Quick payment/transfer actions
- Recent transaction history
- Security alerts for suspicious activity
- Access customer support chatbot anytime

### Profile Management
- Edit profile information
- Change name, email, or phone number
- View 2FA security status
- Logout option

### Security Features
- 2FA protection on all accounts
- Real-time fraud alerts
- User verification prompts for suspicious activities
- Account history and activity tracking

## Environment & Running

### Development
```bash
cd frontend
npm install
npm start
```

The application will start on port 3000 (or the next available port if 3000 is in use).

### Build
```bash
npm run build
```

Creates an optimized production build.

## Authentication Details

### Default Test Credentials
- **Email**: any valid email format
- **Password**: minimum 6 characters
- **2FA**: Use any authenticator app (Google Authenticator, Authy, etc.)

The app uses mock authentication for demonstration purposes and stores user data in localStorage.

## Future Enhancements

1. **Backend Integration**
   - Connect to real banking API
   - Real user authentication
   - Persistent database storage
   - Encrypted password storage

2. **Additional Features**
   - Bill payment scheduling
   - Money transfer history
   - Investment portfolio view
   - Loan management
   - Credit card management
   - Mobile app support

3. **Security Improvements**
   - Implement session timeout
   - Add fingerprint authentication
   - Enhanced encryption
   - Audit logging

4. **UX Improvements**
   - Dark mode support
   - Internationalization (i18n)
   - Accessibility enhancements
   - Performance optimization

## Notes

- All user data is currently stored in browser localStorage for demonstration
- The chatbot uses predefined responses for different query types
- Security alerts are simulated for demonstration purposes
- In a production environment, these features would connect to real backend services
