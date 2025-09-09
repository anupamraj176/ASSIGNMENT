// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// --- INITIALIZE APP ---
const app = express();

// --- MIDDLEWARE ---
// Enable Cross-Origin Resource Sharing for your frontend
app.use(cors());
// Enable express to parse JSON bodies in requests
app.use(express.json());


// --- API ROUTES ---
app.get('/', (req, res) => res.send('API is running...'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/customers', require('./routes/customers'));
// app.use('/api/leads', require('./routes/leads'));


// --- START SERVER ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
