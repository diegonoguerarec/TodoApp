const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/todos', (req, res) => {
    res.send({message:"Sending list of tasks"});
});

app.listen(port, () => {
    console.log(`TodoApp listening on port ${port}`);
});