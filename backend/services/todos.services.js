const { prisma } = require('../db/prisma');

async function createTodo({name, description}) {
    return await prisma.todo.create({
        data: {
            name,
            description
        }
    });
}

async function listTodos() {
    return await prisma.todo.findMany();
}

async function updateTodo(id, {name, description}) {
    return await prisma.todo.update({
        where: {id:parseInt(id)},
        data: {name, description}
    });
}

async function deleteTodo(id) {
    return await prisma.todo.delete({
        where: {id:parseInt(id)}
    });
}

module.exports = { createTodo, listTodos, updateTodo, deleteTodo };