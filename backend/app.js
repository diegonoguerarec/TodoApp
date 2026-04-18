const express = require('express');
require('dotenv').config();

// Prisma setup
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const app = express();
const port = 3000;

// Use Json parser middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

// Create a new Todo
app.post('/todos', async (req, res) => {

    const data = {
        name: req.body.name,
        description: req.body.description,
    };

    const Todo = await prisma.todo.create({
        data: data
    });

    //res.send({message:"Generated test task"});
    res.status(200).json({
        message: "Created new Todo",
        task: Todo
    });
});

// Get all Todos
app.get('/todos', async (req, res) => {

    const Todos = await prisma.todo.findMany();

    //res.send(JSON.stringify({Todos}, null, 4));
    res.status(200).json({
        message: "Sending all todos",
        count: Todos.length,
        data: Todos
    });
});

// Update todo by id
// Only for name and description
app.put('/todos/:id', async (req, res) => {
    const id = req.params.id;

    // Get data from body
    const data = {
        name: req.body.name,
        description: req.body.description,
    };

    const updateTodo = await prisma.todo.update({
        where: {id:parseInt(id)},
        data: data
    });

    res.status(200).json({
        message: `Updated Todo with id ${id}`,
        data: updateTodo
    });
});

// Delete Todo by id
app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;

    const deleteUser = await prisma.todo.delete({
        where: {id:parseInt(id)}
    });

    res.status(200).json({
        message: `Deleted Todo with id ${id}`,
        data: deleteUser
    });
});

app.listen(port, () => {
    console.log(`TodoApp listening on port ${port}`);
});