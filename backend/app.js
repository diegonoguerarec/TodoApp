const express = require('express');
const todosRouter = require('./routes/todos.routes');
require('dotenv').config();

const app = express();

// Use Json parser middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/todos', todosRouter);

module.exports = { app };