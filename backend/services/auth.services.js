const { prisma } = require('../db/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register({username, password}) {
    // Find user
    const user = await prisma.user.findUnique({
        where: {username: username}
    });

    if (user) {
        throw new Error("Username already exists");
    }
    
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword
        }
    });

    return {id: newUser.id, username};
}

async function login({username, password}) {

    // Find user
    const user = await prisma.user.findUnique({
        where: {username: username}
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error("Invalid credentials");
    }

    // Genetare JWT
    const token = await jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return token;
}

module.exports = {register, login};