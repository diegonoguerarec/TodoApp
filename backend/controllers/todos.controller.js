const todosService = require('../services/todos.services');

async function create(req, res) {
    const name = req.body.name;
    const description = req.body.description;

    // Validations
    // Check for no values or empty strings
    if(!name || !description || name.trim() === '' || description.trim() === '') {
        return res.status(400).json({message: `Name and description are required`});
    }

    try {
        const newTodo = await todosService.createTodo({name: name.trim(), description: description.trim()});

        res.status(201).json({message: `Created new Todo`, data: newTodo});
    } catch (error) {
        if (error.code === 'P2002') { // Check for unique constraint error
            res.status(409).json({message: `Todo already exists`});
            console.error(error);
        } else {
            console.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
}

async function list(req, res) {
    const data = await todosService.listTodos();

    // Validations should go here

    res.status(200).json({message: `Sending all Todos`, count: data.length, data});
}

async function getById(req, res) {
    const id = req.params.id;

    // Check if id is a number
    if(isNaN(parseInt(id))) {
        return res.status(400).json({message: `Invalid id`});
    }

    // Call service
    try {
        const todo = await todosService.getTodoById(parseInt(id));
        res.status(200).json({message: `Sending Todo with id ${id}`, data: todo});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function update(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const completed = req.body.completed;

    // Validations
    // Check if id is a number
    if(isNaN(parseInt(id))) {
        return res.status(400).json({message: `Invalid id`});
    }

    const data = {};

    if (name !== undefined) {
        if (!name || name.trim() === '') {
            return res.status(400).json({message: `Name cannot be empty`});
        }
        data.name = name.trim();
    }

    if (description !== undefined) {
        if (!description || description.trim() === '') {
            return res.status(400).json({message: `Description cannot be empty`});
        }
        data.description = description.trim();
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({message: `Completed must be a boolean`});
        }
        data.completed = completed;
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({message: `At least one field is required`});
    }

    //Check if the given id exists for a Todo
    try {
        const updatedTodo = await todosService.updateTodo(parseInt(id), data);
        res.status(200).json({message: `Updated Todo with id ${id}`, data: updatedTodo});
    } catch (error) {
        if (error.code === 'P2025') { // If Todo with id does nos exist
            res.status(404).json({message: `Todo with id ${id} does not exist`});
            console.error(error);
        }else if (error.code === 'P2002') { // Check for unique constraint error
            res.status(409).json({message: `Todo already exists`});
            console.error(error);
        } else {
            console.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
}

async function remove(req, res) {
    const id = req.params.id;

    // Validations
    // Check if id is a number
    if(isNaN(parseInt(id))) {
        return res.status(400).json({message: `Invalid id`});
    }

    //Todo: Check if the given id exists for a Todo
    try {
        const deletedTodo = await todosService.deleteTodo(parseInt(id));
        res.status(200).json({message: `Deleted Todo with id ${id}`, data: deletedTodo});
    }
    catch (error) {
        if (error.code === 'P2025') { // If Todo with id does nos exist
            res.status(404).json({message: `Todo with id ${id} does not exist`});
            console.error(error);
        } else {
            console.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
}

module.exports = { create, list, getById, update, remove };