import React from 'react';
import { DEFAULT_AVATAR } from '../utils/constants';

const Users = () => {
  return (
    <div className="users">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Users</h1>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add New User
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        alt="User avatar"
                        className="rounded-circle"
                        src={DEFAULT_AVATAR}
                        width="40"
                        height="40"
                      />
                      <div>
                        <div className="fw-bold">John Doe</div>
                        <div className="text-muted small">ID: #12345</div>
                      </div>
                    </div>
                  </td>
                  <td>john@example.com</td>
                  <td><span className="badge bg-primary">Admin</span></td>
                  <td><span className="badge bg-success">Active</span></td>
                  <td>2024-02-20 10:30 AM</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 