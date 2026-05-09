const express = require('express');
const authRouter = require('./routes/auth.routes');
const todosRouter = require('./routes/todos.routes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use Json parser middleware
app.use(express.json());

// Allow frontend apps to call this API
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/auth', authRouter);
app.use('/todos', todosRouter);

module.exports = { app };