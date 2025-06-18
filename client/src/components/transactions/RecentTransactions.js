import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import TransactionTable from './TransactionTable';

const RecentTransactions = ({ 
  transactions, 
  onViewDetails,
  onCategoryClick,
  availableCategories 
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'summary'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const itemsPerPage = 10;

  const getStatusBadgeClass = (status) => {
    const classes = {
      'success': 'bg-success',
      'pending': 'bg-warning',
      'failed': 'bg-danger'
    };
    return `badge ${classes[status.toLowerCase()] || 'bg-primary'}`;
  };

  const calculateSummary = () => {
    return transactions.reduce((acc, transaction) => {
      const type = transaction.transaction_type;
      acc[type] = acc[type] || { count: 0, total: 0 };
      acc[type].count++;
      acc[type].total += transaction.amount;
      return acc;
    }, {});
  };

  const getUniqueCategories = () => {
    const categories = new Set(transactions.map(t => t.category));
    return ['all', ...Array.from(categories)];
  };

  const filteredTransactions = selectedCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === selectedCategory);

  const handleExport = () => {
    try {
      // Convert transactions to CSV
      const headers = ['Date', 'Type', 'Amount', 'Category', 'Status', 'Description'];
      const csvContent = [
        headers.join(','),
        ...filteredTransactions.map(t => [
          format(new Date(t.timestamp), 'yyyy-MM-dd HH:mm'),
          t.transaction_type,
          t.amount.toFixed(2),
          t.category,
          t.status,
          `"${t.description.replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Transactions exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    }
  };

  const handleSort = (key) => {
    setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectTransaction = (transaction) => {
    setSelectedTransactions([transaction]);
  };

  const handleSelectAllTransactions = (transactions) => {
    setSelectedTransactions(transactions);
  };

  const handleBulkAction = (action) => {
    // Implement bulk action logic here
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      onCategoryClick(null);
    } else {
      onCategoryClick(category);
    }
  };

  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-4">No transactions found</div>;
  }

  return (
    <div className="recent-transactions">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="card-title mb-0">Recent Transactions</h5>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list me-1"></i> List
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'summary' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('summary')}
          >
            <i className="fas fa-chart-pie me-1"></i> Summary
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleExport}
            disabled={!transactions.length}
          >
            <i className="fas fa-download me-1"></i> Export
          </button>
        </div>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <label className="me-2">Filter by Category:</label>
          <select 
            className="form-select form-select-sm" 
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        onSort={handleSort}
        sortConfig={sortConfig}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={Math.ceil(transactions.length / itemsPerPage)}
        onViewDetails={onViewDetails}
        selectedTransactions={selectedTransactions}
        onSelectTransaction={handleSelectTransaction}
        onSelectAllTransactions={handleSelectAllTransactions}
        onBulkAction={handleBulkAction}
        onCategoryClick={onCategoryClick}
      />
    </div>
  );
};

export default RecentTransactions; 