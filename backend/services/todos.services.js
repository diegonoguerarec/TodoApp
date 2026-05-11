const { prisma } = require('../db/prisma');

async function createTodo({name, description, user_id}) {
    // Business validation should be here
    return await prisma.todo.create({data: {name, description, user_id}});
}

async function listTodos(user_id) {
    // Business validation should be here
    return await prisma.todo.findMany({
        where: {user_id}
    });
}

async function getTodoById(id, user_id) {
    // Business validation should be here
    return await prisma.todo.findMany({
        where: {id: parseInt(id), user_id: user_id}
    });
}

async function updateTodo(id, user_id, data) {
    // Business validation should be here
    return await prisma.todo.updateMany({
        where: {id:parseInt(id), user_id: user_id},
        data
    });
}

async function deleteTodo(id, user_id) {
    // Business validation should be here
    return await prisma.todo.deleteMany({
        where: {id:parseInt(id), user_id: user_id}
    });
}

module.exports = { createTodo, listTodos, getTodoById, updateTodo, deleteTodo };