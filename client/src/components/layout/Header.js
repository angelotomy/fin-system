import React from 'react';
import './Header.css';
import { DEFAULT_AVATAR } from '../../utils/constants';

const Header = () => {
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
        
        <div className="user-menu">
          <img
            alt="User avatar"
            className="rounded-circle"
            src={DEFAULT_AVATAR}
            width="40"
            height="40"
          />
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">Administrator</span>
          </div>
          <button className="icon-button">
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 