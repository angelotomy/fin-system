import React, { useState, useEffect, useCallback } from 'react';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const Transactions = () => {
  // State
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'transaction_type', direction: 'asc' });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: ''
  });
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Make fetchTransactions stable with useCallback
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/transactions', {
        params: {
          page: currentPage,
          sortBy: sortConfig.key,
          sortDirection: sortConfig.direction,
          transaction_type: filters.type?.toLowerCase(),
          category: filters.category,
          status: filters.status
        }
      });
      
      if (response.data.success) {
        setTransactions(response.data.data);
        setTotalPages(response.data.pagination.total_pages);
        setError(null);
      } else {
        setError(response.data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message || 'Error fetching transactions');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, sortConfig]);

  // Use fetchTransactions in useEffect
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Selection Handlers
  const handleSelectTransaction = (transactionId, isSelected) => {
    setSelectedTransactions(prev => {
      if (isSelected) {
        return [...prev, transactionId];
      }
      return prev.filter(id => id !== transactionId);
    });
  };

  const handleSelectAllTransactions = (isSelected) => {
    if (isSelected) {
      setSelectedTransactions(transactions.map(t => t.transaction_id));
    } else {
      setSelectedTransactions([]);
    }
  };

  // Bulk Action Handlers
  const handleBulkAction = async (action, selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) {
      toast.error('No transactions selected');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedIds.length} transaction(s)?`)) {
            await axios.delete('/api/transactions/bulk', { data: { transactionIds: selectedIds } });
            toast.success(`${selectedIds.length} transaction(s) deleted successfully`);
            setSelectedTransactions([]); // Clear selection
            fetchTransactions(); // Refresh the list
          }
          break;

        case 'markSuccess':
          await axios.post('/api/transactions/bulk-update-status', {
            transactionIds: selectedIds,
            status: 'success'
          });
          toast.success(`${selectedIds.length} transaction(s) marked as success`);
          fetchTransactions();
          break;

        case 'markFailed':
          await axios.post('/api/transactions/bulk-update-status', {
            transactionIds: selectedIds,
            status: 'failed'
          });
          toast.success(`${selectedIds.length} transaction(s) marked as failed`);
          fetchTransactions();
          break;

        default:
          console.warn('Unknown bulk action:', action);
          return;
      }
    } catch (err) {
      console.error(`Error performing bulk action ${action}:`, err);
      toast.error(err.response?.data?.message || `Failed to ${action} transactions`);
    }
  };

  // Other Handlers
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (transactionId) => {
    if (!transactionId) {
      toast.error('Invalid transaction ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/api/transactions/${transactionId}`);
        toast.success('Transaction deleted successfully');
        fetchTransactions(); // Refresh the transactions list
      } catch (err) {
        console.error('Error deleting transaction:', err);
        toast.error(err.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  return (
    <div className="transactions-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transactions</h2>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilters({
              type: '',
              category: '',
              status: ''
            });
            setCurrentPage(1);
          }}
        >
          <i className="fas fa-filter-circle-xmark me-1"></i> Reset Filters
        </button>
      </div>

      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onDelete={handleDelete}
          selectedTransactions={selectedTransactions}
          onSelectTransaction={handleSelectTransaction}
          onSelectAllTransactions={handleSelectAllTransactions}
          onBulkAction={handleBulkAction}
        />
      )}
    </div>
  );
};

export default Transactions; 