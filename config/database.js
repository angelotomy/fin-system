const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://angelo:Cheesecake37@finance-cluster.19iqrki.mongodb.net/financial-system?retryWrites=true&w=majority&appName=finance-cluster');
        
        console.log(`MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Reason:', error.reason);
        process.exit(1);
    }
};

module.exports = connectDB; 