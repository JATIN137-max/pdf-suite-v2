const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'https://nextools-verse.vercel.app',
    'https://pdf-suite-v2.vercel.app',
    'http://localhost:5173'
];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (mobile apps, curl, etc.)
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


// Simple in-memory Ad store for now (until MongoDB is properly connected)
let ads = [
    { id: 1, type: 'banner', link: '#', imageUrl: 'https://via.placeholder.com/728x90.png?text=Ad+Banner+Space' },
    { id: 2, type: 'sidebar', link: '#', imageUrl: 'https://via.placeholder.com/300x250.png?text=Sidebar+Ad' }
];

const authController = require('./controllers/authController');
const blogController = require('./controllers/blogController');
const seedController = require('./controllers/seedController');
const aiController = require('./controllers/aiController');
const requireAuth = require('./middleware/auth');

// Routes
app.get('/api/ads', (req, res) => {
    res.json(ads);
});

// Auth & Payment Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/upgrade', authController.upgrade);

// Blog Routes
app.get('/api/blog', blogController.listPosts);
app.get('/api/blog/:slug', blogController.getPostBySlug);
app.get('/api/seed-blog', seedController.seedBlog);

// Solvent AI Route (logged-in users only - requireAuth checks the JWT
// before aiController runs, and aiController enforces the daily cap)
app.post('/api/ai/solvent-chat', requireAuth, aiController.chat);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+ 
    // but we can leave them out to prevent deprecation warnings
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});