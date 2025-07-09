const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // to parse JSON requests

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
