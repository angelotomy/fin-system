import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TransactionForm = ({ transaction, onSubmit, onCancel }) => {
  const isEditing = !!transaction;

  const initialValues = {
    userId: transaction?.userId || '',
    accountNumber: transaction?.accountNumber || '',
    type: transaction?.type || 'credit',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    category: transaction?.category || '',
    status: transaction?.status || 'pending',
    timestamp: transaction?.timestamp ? new Date(transaction.timestamp) : new Date()
  };

  const validationSchema = Yup.object({
    userId: Yup.string()
      .required('User ID is required'),
    accountNumber: Yup.string()
      .required('Account Number is required'),
    type: Yup.string()
      .oneOf(['debit', 'credit'], 'Invalid transaction type')
      .required('Type is required'),
    amount: Yup.number()
      .positive('Amount must be positive')
      .required('Amount is required'),
    description: Yup.string()
      .required('Description is required')
      .max(200, 'Description must be at most 200 characters'),
    category: Yup.string()
      .required('Category is required'),
    status: Yup.string()
      .oneOf(['success', 'failed', 'pending'], 'Invalid status')
      .required('Status is required'),
    timestamp: Yup.date()
      .required('Timestamp is required')
  });

  const categories = [
    'Salary', 'Investment', 'Transfer', 'Withdrawal',
    'Deposit', 'Payment', 'Refund', 'Other'
  ];

  return (
    <div className="transaction-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <div className="row g-3">
              {/* User ID */}
              <div className="col-md-6">
                <label htmlFor="userId" className="form-label">User ID</label>
                <Field
                  type="text"
                  id="userId"
                  name="userId"
                  className={`form-control ${errors.userId && touched.userId ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="userId" component="div" className="invalid-feedback" />
              </div>

              {/* Account Number */}
              <div className="col-md-6">
                <label htmlFor="accountNumber" className="form-label">Account Number</label>
                <Field
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  className={`form-control ${errors.accountNumber && touched.accountNumber ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="accountNumber" component="div" className="invalid-feedback" />
              </div>

              {/* Type */}
              <div className="col-md-6">
                <label htmlFor="type" className="form-label">Type</label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className={`form-select ${errors.type && touched.type ? 'is-invalid' : ''}`}
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </Field>
                <ErrorMessage name="type" component="div" className="invalid-feedback" />
              </div>

              {/* Amount */}
              <div className="col-md-6">
                <label htmlFor="amount" className="form-label">Amount</label>
                <Field
                  type="number"
                  id="amount"
                  name="amount"
                  step="0.01"
                  className={`form-control ${errors.amount && touched.amount ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="amount" component="div" className="invalid-feedback" />
              </div>

              {/* Description */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                  rows="3"
                />
                <ErrorMessage name="description" component="div" className="invalid-feedback" />
              </div>

              {/* Category */}
              <div className="col-md-4">
                <label htmlFor="category" className="form-label">Category</label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className={`form-select ${errors.category && touched.category ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="invalid-feedback" />
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label htmlFor="status" className="form-label">Status</label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className={`form-select ${errors.status && touched.status ? 'is-invalid' : ''}`}
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="invalid-feedback" />
              </div>

              {/* Timestamp */}
              <div className="col-md-4">
                <label htmlFor="timestamp" className="form-label">Timestamp</label>
                <DatePicker
                  selected={values.timestamp}
                  onChange={(date) => setFieldValue('timestamp', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className={`form-control ${errors.timestamp && touched.timestamp ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="timestamp" component="div" className="invalid-feedback" />
              </div>

              {/* Form Actions */}
              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-primary me-2">
                  {isEditing ? 'Update Transaction' : 'Create Transaction'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm; 