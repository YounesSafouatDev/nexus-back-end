// config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const connectDB = async () => {
    try {
        const dbUri = "mongodb+srv://rinalinkDev:rinalinkdev@cluster0.pypdtdf.mongodb.net/nexus";
        if (!dbUri) {
            throw new Error('MONGO_URI not defined in environment variables');
        }
        await mongoose.connect(dbUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};
module.exports = connectDB;
