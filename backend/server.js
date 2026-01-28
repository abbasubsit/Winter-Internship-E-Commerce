import 'dotenv/config';
import express from 'express';
import path from 'path'; // Top par add karo
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// 2. Use Routes Here
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); // Add this
app.use('/api/products', productRoutes);  
app.use('/api/upload', uploadRoutes);  // Add this


// ... (Make uploads folder static)
// Yeh line sabse important hai 👇
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
