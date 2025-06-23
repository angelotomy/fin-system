require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');

const TOTAL_RECORDS = 1000000; // 1 million dummydata
const BATCH_SIZE = 1000;
const TOTAL_BATCHES = Math.ceil(TOTAL_RECORDS / BATCH_SIZE);

const CATEGORIES = [
    'Salary',
    'Rent',
    'Utilities',
    'Groceries',
    'Shopping',
    'Entertainment',
    'Travel',
    'Healthcare',
    'Education',
    'Investment',
    'Insurance',
    'Dining',
    'Transportation',
    'Bills',
    'Other'
];

const SAMPLE_USER_IDS = Array.from({ length: 100 }, () => faker.string.uuid());
const SAMPLE_ACCOUNT_NUMBERS = Array.from({ length: 50 }, () => 
    faker.finance.accountNumber(10)
);

const getRandomDate = () => {
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return faker.date.between({ from: oneYearAgo, to: now });
};

const generateTransaction = () => ({
    transaction_id: uuidv4(),
    user_id: faker.helpers.arrayElement(SAMPLE_USER_IDS),
    account_number: faker.helpers.arrayElement(SAMPLE_ACCOUNT_NUMBERS),
    transaction_type: faker.helpers.arrayElement(['debit', 'credit']),
    amount: parseFloat(faker.finance.amount({ min: 10, max: 50000, dec: 2 })),
    description: faker.helpers.arrayElement([
        'Monthly Salary',
        'Rent Payment',
        'Grocery Shopping',
        'Utility Bill',
        'Online Purchase',
        'Restaurant Payment',
        'Investment Deposit',
        'Insurance Premium',
        'Medical Expense',
        'Travel Booking'
    ]),
    timestamp: getRandomDate(),
    category: faker.helpers.arrayElement(CATEGORIES),
    status: faker.helpers.arrayElement(['success', 'failed', 'pending']),
    is_deleted: false
});

async function generateAndInsertTransactions() {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-system');
        console.log('Connected to MongoDB');

        console.time('Data Generation');
        let totalInserted = 0;

        for (let batchNumber = 1; batchNumber <= TOTAL_BATCHES; batchNumber++) {
            const batchTransactions = Array.from({ length: BATCH_SIZE }, generateTransaction);
            
            await Transaction.insertMany(batchTransactions, { ordered: false });
            
            totalInserted += batchTransactions.length;
            
            // Progress update
            const progress = ((batchNumber / TOTAL_BATCHES) * 100).toFixed(2);
            console.log(`Progress: ${progress}% (${totalInserted.toLocaleString()} records inserted)`);
        }

        console.timeEnd('Data Generation');
        console.log(`Successfully inserted ${totalInserted.toLocaleString()} records`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await mongoose.disconnect();
    process.exit(1);
});

// Run the script
generateAndInsertTransactions(); 