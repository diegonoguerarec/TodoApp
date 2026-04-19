const { prisma } = require('../db/prisma');

async function createTodo({name, description}) {
    // Business validation should be here
    return await prisma.todo.create({
        data: {
            name,
            description
        }
    });
}

async function listTodos() {
    // Business validation should be here
    return await prisma.todo.findMany();
}

async function updateTodo(id, {name, description}) {
    // Business validation should be here
    return await prisma.todo.update({
        where: {id:parseInt(id)},
        data: {name, description}
    });
}

async function deleteTodo(id) {
    // Business validation should be here
    return await prisma.todo.delete({
        where: {id:parseInt(id)}
    });
}

module.exports = { createTodo, listTodos, updateTodo, deleteTodo };