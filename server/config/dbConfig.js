// const mongoose = require('mongoose');

// mongoose.connect(process.env.mongo_url);

// const connection = mongoose.connection;

// // Verify connection
// connection.on('connected', () => {
//   console.log('MongoDB Connection Successful');
// });

// // Verify connection error
// connection.on('error', (err) => {
//   console.log('MongoDB Connection Error:', err);
// });

// dbConfig.js
const mongoose = require('mongoose');
require('dotenv').config

const uri = process.env.mongo_url; // Replace this with your actual MongoDB connection string

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

module.exports = mongoose;
