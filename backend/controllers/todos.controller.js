const todosService = require('../services/todos.services');

async function create(req, res) {
    const name = req.body.name;
    const description = req.body.description;

    // Validations
    // Check for no values or empty strings
    if(!name || !description || name.trim() === '' || description.trim() === '') {
        return res.status(400).json({message: `Name and description are required`});
    }

    const newTodo = await todosService.createTodo({name: name.trim(), description: description.trim()});

    res.status(201).json({message: `Created new Todo`, data: newTodo});
}

async function list(req, res) {
    const data = await todosService.listTodos();

    // Validations should go here

    res.status(200).json({message: `Sending all Todos`, count: data.length, data});
}

async function update(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;

    // Validations
    // Check for no values or empty strings
    if(!name || !description || name.trim() === '' || description.trim() === '') {
        return res.status(400).json({message: `Name and description are required`});
    }

    // Check if id is a number
    if(isNaN(parseInt(id))) {
        return res.status(400).json({message: `Invalid id`});
    }

    //Todo: Check if the given id exists for a Todo

    const updatedTodo = await todosService.updateTodo(parseInt(id), {name: name.trim(), description: description.trim()});
    
    res.status(200).json({message: `Updated Todo with id ${id}`, data: updatedTodo});
}

async function remove(req, res) {
    const id = req.params.id;

    // Validations
    // Check if id is a number
    if(isNaN(parseInt(id))) {
        return res.status(400).json({message: `Invalid id`});
    }

    //Todo: Check if the given id exists for a Todo

    const deletedTodo = await todosService.deleteTodo(parseInt(id));

    res.status(200).json({message: `Deleted Todo with id ${id}`, data: deletedTodo});
}

module.exports = { create, list, update, remove };