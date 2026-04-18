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

app.post('/todos', async (req, res) => {

    const data = {
        name: req.body.name,
        description: req.body.description,
    };

    const Todo = await prisma.todo.create({
        data: data
    });

    res.send({message:"Generated test task"});
});

app.get('/todos', (req, res) => {
    res.send({message:"Sending list of tasks"});
});

app.listen(port, () => {
    console.log(`TodoApp listening on port ${port}`);
});