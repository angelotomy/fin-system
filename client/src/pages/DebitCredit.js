import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import RecentTransactions from '../components/transactions/RecentTransactions';

const DebitCredit = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    fetchCategories();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/transactions/categories');
      if (isMounted.current && response.data.success) {
        setAvailableCategories(response.data.data);
      } else {
        // Fallback to default categories if API response is not successful
        const defaultCategories = [
          'Salary', 'Investment', 'Transfer', 'Withdrawal', 'Deposit',
          'Payment', 'Refund', 'Shopping', 'Food', 'Transportation',
          'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Other'
        ];
        setAvailableCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      // Fallback to default categories if API fails
      const defaultCategories = [
        'Salary', 'Investment', 'Transfer', 'Withdrawal', 'Deposit',
        'Payment', 'Refund', 'Shopping', 'Food', 'Transportation',
        'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Other'
      ];
      setAvailableCategories(defaultCategories);
    }
  };

  const validationSchema = Yup.object({
    account_number: Yup.string().required('Account number is required'),
    transaction_type: Yup.string().oneOf(['debit', 'credit'], 'Invalid transaction type').required('Transaction type is required'),
    amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
    category: Yup.string().required('Category is required')
  });

  const initialValues = {
    account_number: '',
    transaction_type: 'debit',
    amount: '',
    category: ''
  };

  const fetchRecentTransactions = async (accountNumber, category = null) => {
    try {
      const params = {
        limit: category ? 100 : 10,
        sort_by: 'timestamp',
        sort_order: 'desc'
      };
      if (accountNumber) params.account_number = accountNumber;
      if (category) params.category = category;
      const response = await axiosInstance.get('/transactions', { params });
      if (isMounted.current) {
        setRecentTransactions(response.data.data);
        if (category) {
          toast.info(`Showing all transactions in category: ${category}`);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchRecentTransactions(null, category);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    fetchRecentTransactions();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 10000);
      const transactionId = `TXN${timestamp}${randomNum}`;
      const transactionData = {
        ...values,
        user_id: 'default_user',
        transaction_id: transactionId,
        status: 'pending',
        description: `${values.transaction_type === 'credit' ? 'Credit' : 'Debit'} transaction - ${values.category}`,
        timestamp: new Date()
      };
      const response = await axiosInstance.post('/accounts/transaction', transactionData);
      if (isMounted.current) {
        if (response.data.success) {
          toast.success('Transaction completed successfully!');
          await fetchRecentTransactions(values.account_number);
          window.dispatchEvent(new Event('transactionUpdated'));
          resetForm();
        } else {
          toast.error(response.data.error || 'Failed to process transaction');
        }
      }
    } catch (error) {
      if (isMounted.current) {
        if (error.response?.data?.error === 'Insufficient funds') {
          toast.error('Transaction failed: Insufficient balance in the account');
        } else {
          const errorMessage = error.response?.data?.error || 'Failed to process transaction';
          toast.error(errorMessage);
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setSubmitting(false);
      }
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  return (
    <div className="debit-credit">
      <h1>Debit/Credit Transaction</h1>
      {selectedCategory && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>Showing all transactions in category: <strong>{selectedCategory}</strong></span>
          <button className="btn btn-sm btn-outline-dark" onClick={clearCategoryFilter}>
            Clear Filter
          </button>
        </div>
      )}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">New Transaction</h5>
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="account_number" className="form-label">Account Number</label>
                      <Field
                        type="text"
                        id="account_number"
                        name="account_number"
                        className="form-control"
                        onBlur={(e) => {
                          if (e.target.value) {
                            fetchRecentTransactions(e.target.value);
                          }
                        }}
                      />
                      <ErrorMessage name="account_number" component="div" className="text-danger" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="transaction_type" className="form-label">Transaction Type</label>
                      <Field
                        as="select"
                        id="transaction_type"
                        name="transaction_type"
                        className="form-select"
                      >
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                      </Field>
                      <ErrorMessage name="transaction_type" component="div" className="text-danger" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">Amount</label>
                      <Field
                        type="number"
                        id="amount"
                        name="amount"
                        className="form-control"
                        step="0.01"
                      />
                      <ErrorMessage name="amount" component="div" className="text-danger" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Category</label>
                      <Field
                        as="select"
                        id="category"
                        name="category"
                        className="form-select"
                      >
                        <option value="">Select Category</option>
                        {availableCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-danger" />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Transaction'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Transactions</h5>
              <RecentTransactions
                transactions={recentTransactions}
                onViewDetails={handleViewDetails}
                onCategoryClick={handleCategoryClick}
                availableCategories={availableCategories}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transaction Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="transaction-details">
                  <p>
                    <strong>Transaction ID:</strong>
                    <span className="ms-2">{selectedTransaction.transaction_id}</span>
                  </p>
                  <p>
                    <strong>Date:</strong>
                    <span className="ms-2">
                      {format(new Date(selectedTransaction.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </p>
                  <p>
                    <strong>Type:</strong>
                    <span className={`ms-2 badge ${selectedTransaction.transaction_type === 'credit' ? 'bg-success' : 'bg-danger'}`}>
                      {selectedTransaction.transaction_type}
                    </span>
                  </p>
                  <p>
                    <strong>Amount:</strong>
                    <span className={`ms-2 ${selectedTransaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'}`}>
                      ${selectedTransaction.amount.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <strong>Category:</strong>
                    <span className="ms-2">{selectedTransaction.category}</span>
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`ms-2 badge ${selectedTransaction.status === 'success' ? 'bg-success' : 'bg-danger'}`}>
                      {selectedTransaction.status}
                    </span>
                  </p>
                  <p>
                    <strong>Description:</strong>
                    <span className="ms-2">{selectedTransaction.description}</span>
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default DebitCredit; 