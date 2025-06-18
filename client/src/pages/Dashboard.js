import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    total_transactions: 0,
    total_credit: 0,
    total_debit: 0,
    credit_count: 0,
    debit_count: 0
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/summary');
      if (response.data.success) {
        setSummaryData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Transactions</h5>
              <p className="card-text display-4">
                {summaryData.total_transactions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Credit</h5>
              <p className="card-text display-4 text-success">
                ${summaryData.total_credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <small className="text-muted">
                {summaryData.credit_count.toLocaleString()} transactions
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Debit</h5>
              <p className="card-text display-4 text-danger">
                ${summaryData.total_debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <small className="text-muted">
                {summaryData.debit_count.toLocaleString()} transactions
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 