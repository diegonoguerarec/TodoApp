const authService = require('../services/auth.services');

async function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Check for no values or empty strings
    if(!username || !password || username.trim() === '' || password.trim() === '') {
        return res.status(400).json({message: `Username and password are required`});
    }
    
    try {
        const newUser = await authService.register({username, password});

        res.status(201).json({message: `Created new User`, data: newUser});
    } catch (error) {
        if (error.message == 'Username already exists') {
            res.status(500).json({message: 'Username already exists'});
        }
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Check for no values or empty strings
    if(!username || !password || username.trim() === '' || password.trim() === '') {
        return res.status(400).json({message: `Username and password are required`});
    }
    
    try {
        const token = await authService.login({username, password});

        res.status(200).json({message: `Login successful`, data: token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {register, login};