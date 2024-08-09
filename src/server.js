// Import required modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
// Load environment variables from .env file
dotenv.config();
const connectDB = require('./config/dataBase');
// const apiRoutes = require('./api/v1/routes/auth');
const authRoutes = require('./api/v1/routes/auth');
const postRoutes = require('./api/v1/routes/post');

// Initialize express app
const app = express();
// Connect to MongoDB
connectDB();
// Use morgan for request logging in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Use body-parser to parse request bodies
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount routes
// app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/api/posts', postRoutes);
// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send({ error: 'Not Found' });
});

// Handle other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

// Get port from environment and store in Express
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`The server is running now 💫💤✅`);
});

module.exports = app;
