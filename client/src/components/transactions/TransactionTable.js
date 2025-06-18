import React from 'react';
import { format } from 'date-fns';

const TransactionTable = ({
  transactions,
  onSort,
  sortConfig,
  onPageChange,
  currentPage,
  totalPages,
  onViewDetails,
  onDelete,
  selectedTransactions,
  onSelectTransaction,
  onSelectAllTransactions,
  onBulkAction,
  onCategoryClick
}) => {
  const getStatusBadgeClass = (status) => {
    const classes = {
      'success': 'bg-success',
      'pending': 'bg-warning',
      'failed': 'bg-danger',
      'cancelled': 'bg-secondary'
    };
    return `badge ${classes[status?.toLowerCase()] || 'bg-primary'}`;
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const isAllSelected = transactions.length > 0 && 
    transactions.every(t => selectedTransactions.includes(t.transaction_id));

  const handleBulkAction = (action) => {
    if (selectedTransactions.length === 0) {
      return;
    }
    onBulkAction(action, selectedTransactions);
  };

  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-4">No transactions found</div>;
  }

  return (
    <div className="transaction-table card">
      <div className="card-body">
        {/* Bulk Actions */}
        {selectedTransactions.length > 0 && (
          <div className="bulk-actions mb-3">
            <div className="btn-group">
              <button
                className="btn btn-success"
                onClick={() => handleBulkAction('markSuccess')}
                title="Mark as Success"
              >
                <i className="fas fa-check-circle"></i>
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleBulkAction('markFailed')}
                title="Mark as Failed"
              >
                <i className="fas fa-times-circle"></i>
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleBulkAction('delete')}
                title="Delete Selected"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <span className="ms-3 text-muted">
              {selectedTransactions.length} transaction(s) selected
            </span>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllSelected}
                      onChange={(e) => onSelectAllTransactions(e.target.checked)}
                    />
                  </div>
                </th>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Account Number</th>
                <th onClick={() => onSort('transaction_type')}>
                  Type {getSortIcon('transaction_type')}
                </th>
                <th>Amount</th>
                <th>Timestamp</th>
                <th onClick={() => onSort('category')}>
                  Category {getSortIcon('category')}
                </th>
                <th onClick={() => onSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedTransactions.includes(transaction.transaction_id)}
                        onChange={(e) => onSelectTransaction(transaction.transaction_id, e.target.checked)}
                      />
                    </div>
                  </td>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.user_id || 'N/A'}</td>
                  <td>{transaction.account_number || 'N/A'}</td>
                  <td>
                    <span className={`badge ${transaction.transaction_type === 'credit' ? 'bg-success' : 'bg-danger'}`}>
                      {transaction.transaction_type ? transaction.transaction_type.toUpperCase() : 'N/A'}
                    </span>
                  </td>
                  <td className={transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'}>
                    ${Number(transaction.amount || 0).toFixed(2)}
                  </td>
                  <td>{transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span 
                      className="badge bg-info text-dark"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onCategoryClick && onCategoryClick(transaction.category)}
                    >
                      {transaction.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(transaction.status)}>
                      {(transaction.status || 'PENDING').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onViewDetails && onViewDetails(transaction.transaction_id)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete && onDelete(transaction.transaction_id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Showing page {currentPage} of {totalPages}
          </div>
          <nav>
            <ul className="pagination mb-0">
              {currentPage > 1 && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
              )}
              
              {[...Array(Math.min(10, totalPages))].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              {totalPages > 10 && currentPage <= 10 && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(11)}
                  >
                    Next
                  </button>
                </li>
              )}

              {currentPage > 10 && (
                <>
                  <li className="page-item">
                    <button className="page-link">...</button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => onPageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </li>
                  {currentPage !== totalPages && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* End of table */}
      </div>
    </div>
  );
};

export default TransactionTable; 