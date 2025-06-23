# Logout Feature Implementation

## Overview
This document describes the logout functionality that has been added to the financial system.

## Features Implemented

### 1. Authentication Context
- Created `AuthContext` to manage user authentication state
- Provides login, logout, and user state management
- Handles token storage and removal
- Manages axios authorization headers

### 2. Logout Button
- Added logout button in the header user dropdown menu
- Dropdown includes Profile, Settings, and Logout options
- Click outside to close dropdown functionality
- Professional styling with hover effects

### 3. Server-side Logout Endpoint
- Added `/api/admin/logout` endpoint
- Requires authentication to access
- Logs logout events in audit trail
- Returns success message

### 4. Enhanced Security
- Automatic token removal on logout
- Axios interceptors for automatic token handling
- 401 error handling with automatic redirect to login
- Proper cleanup of authorization headers

## Files Modified/Created

### Client-side
- `client/src/contexts/AuthContext.js` - New authentication context
- `client/src/App.js` - Updated to use AuthProvider
- `client/src/pages/Login.js` - Updated to use auth context
- `client/src/components/layout/Header.js` - Added logout dropdown
- `client/src/components/layout/Header.css` - Added dropdown styles
- `client/src/utils/axiosConfig.js` - Added interceptors

### Server-side
- `server/controllers/adminController.js` - Added logout controller
- `server/routes/adminRoutes.js` - Added logout route

## Usage

### For Users
1. Click on the user avatar/name in the header
2. A dropdown menu will appear
3. Click "Logout" to sign out
4. You'll be redirected to the login page

### For Developers
```javascript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

## Security Features
- JWT token-based authentication
- Automatic token expiration handling
- Audit logging for login/logout events
- Secure token storage in localStorage
- Automatic cleanup on logout

## Testing
1. Start both client and server
2. Log in with valid credentials
3. Click the user menu in the header
4. Click "Logout"
5. Verify you're redirected to login page
6. Verify you can't access protected routes without logging in again 