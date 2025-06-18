import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const TransactionFilters = ({ filters, onFilterChange }) => {
  const categories = [
    'Salary', 'Investment', 'Transfer', 'Withdrawal',
    'Deposit', 'Payment', 'Refund', 'Other'
  ];

  const statuses = ['success', 'pending', 'failed'];
  const types = ['credit', 'debit'];

  return (
    <div className="transaction-filters card mb-4">
      <div className="card-body">
        <div className="row g-3">
          {/* Type */}
          <div className="col-md-4">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filters.type}
              onChange={e => onFilterChange('type', e.target.value)}
            >
              <option value="">All</option>
              {types.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={e => onFilterChange('category', e.target.value)}
            >
              <option value="">All</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={e => onFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="col-12 mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => {
                onFilterChange('type', '');
                onFilterChange('category', '');
                onFilterChange('status', '');
              }}
            >
              <i className="fas fa-undo me-1"></i> Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters; 