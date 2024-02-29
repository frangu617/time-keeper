// server.js

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const router = require('./controllers/workLogController');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/workLogs', router);

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// // Routes
// // GET endpoint for getting all work logs
// app.get('/workLogs', getWorkLogs);
// // POST endpoint for creating a new work log
// app.post('/workLogs', createWorkLog);
// // DELETE endpoint for deleting a work log by ID
// app.delete('/workLogs/:id', deleteWorkLog);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
