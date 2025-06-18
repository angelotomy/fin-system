import React from 'react';

const Settings = () => {
  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Profile Settings</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" defaultValue="John Doe" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="john@example.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Profile Picture</label>
                  <input type="file" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Change Password</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Notification Settings</h5>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="emailNotif" defaultChecked />
                <label className="form-check-label" htmlFor="emailNotif">
                  Email Notifications
                </label>
              </div>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="smsNotif" />
                <label className="form-check-label" htmlFor="smsNotif">
                  SMS Notifications
                </label>
              </div>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="loginAlert" defaultChecked />
                <label className="form-check-label" htmlFor="loginAlert">
                  Login Alerts
                </label>
              </div>
              <button className="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Account Settings</h5>
              <div className="mb-3">
                <label className="form-label">Language</label>
                <select className="form-select">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Time Zone</label>
                <select className="form-select">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
              <button className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 