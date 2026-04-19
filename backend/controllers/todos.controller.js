const todosService = require('../services/todos.services');

async function create(req, res) {
    const {name, description} = req.body;

    // Validations should go here

    const newTodo = await todosService.createTodo({name, description});

    res.status(201).json({message: `Created new Todo`, data: newTodo});
}

async function list(req, res) {
    const data = await todosService.listTodos();

    res.status(200).json({message: `Sending all Todos`, count: data.length, data});
}

async function update(req, res) {
    const id = req.params.id;
    const {name, description} = req.body;

    const updatedTodo = await todosService.updateTodo(id, {name, description});
    res.status(200).json({message: `Updated Todo with id ${id}`, data: updatedTodo});
}

async function remove(req, res) {
    const id = req.params.id;

    const deletedTodo = await todosService.deleteTodo(id);

    res.status(200).json({message: `Deleted Todo with id ${id}`, data: updatedTodo});
}

module.exports = { create, list, update, remove };