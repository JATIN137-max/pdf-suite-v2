const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'https://pdf-suite-v2.vercel.app',
    'http://localhost:5173'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authController = require('./controllers/authController');

app.get('/api/ads', (req, res) => { res.json([]); });
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/upgrade', authController.upgrade);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
