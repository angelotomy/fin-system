import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: 'fas fa-chart-line', text: 'Dashboard' },
    { path: '/transactions', icon: 'fas fa-exchange-alt', text: 'Transactions' },
    { path: '/debit-credit', icon: 'fas fa-money-bill-wave', text: 'Debit/Credit' },
    { path: '/users', icon: 'fas fa-users', text: 'Users' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="brand">
          <i className="fas fa-university"></i>
          <span>FinSystem</span>
        </h3>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <i className={item.icon}></i>
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 