import React from 'react';
import TransactionForm from './TransactionForm';

const TransactionModal = ({ isOpen, onClose, transaction, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = async (values) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {transaction ? 'Edit Transaction' : 'New Transaction'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TransactionForm
                transaction={transaction}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default TransactionModal; 