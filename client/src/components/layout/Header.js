import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';
import { DEFAULT_AVATAR } from '../../utils/constants';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <header className="header">
      <div className="header-search">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Search..." />
      </div>
      
      <div className="header-right">
        <div className="notifications">
          <button className="icon-button">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </button>
        </div>
        
        <div className="user-menu" ref={userMenuRef}>
          <img
            alt="User avatar"
            className="rounded-circle"
            src={DEFAULT_AVATAR}
            width="40"
            height="40"
          />
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'User'}</span>
          </div>
          <button 
            className="icon-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <i className="fas fa-user me-2"></i>
                Profile
              </div>
              <div className="dropdown-item">
                <i className="fas fa-cog me-2"></i>
                Settings
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 