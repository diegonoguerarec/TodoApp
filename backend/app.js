const express = require('express');
const todosRouter = require('./routes/todos.routes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use Json parser middleware
app.use(express.json());

// Allow frontend apps (e.g. Vite dev server) to call this API
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/todos', todosRouter);

module.exports = { app };