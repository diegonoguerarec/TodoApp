require('dotenv').config();

const express = require('express');
const authRouter = require('./routes/auth.routes');
const todosRouter = require('./routes/todos.routes');
const cors = require('cors');

const app = express();

// Use Json parser middleware
app.use(express.json());

const allowedOrigin = (process.env.CORS_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean);

// Allow frontend apps to call this API
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigin.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/auth', authRouter);
app.use('/todos', todosRouter);

module.exports = { app };