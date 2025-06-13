const express = require('express');
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const user = require('../models/users');
const userAuth = require('../middelware/Auth');
const { getToken, setTokenCookie, clearTokenCookie } = require('../utils/TokenOps');


authRouter.post('/api/v1/user/save', async (req, res) => {
    const ecryptedPassword = await bcrypt.hash(req.body?.Password, 10);
    const { firstName, lastName, Email, Password } = req.body;
    const userData = new user({
        firstName,
        lastName,
        Email,
        Password: ecryptedPassword
    });
    try {
        await userData.save()
        return res.status(200).send('User created successfully');
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).send('Internal Server Error');

    }
}
);


authRouter.post('/api/v1/login', async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const userData = await user.findOne({ Email: Email });
        if (!userData) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await bcrypt.compare(Password, userData.Password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid Username or Password');
        }
        const token = getToken(userData._id);
        setTokenCookie(res, token);
        return res.status(200).send('Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error' + error);
    }
})

authRouter.post('/api/v1/logout', (req, res) => {
    clearTokenCookie(res); // Clear the token cookie
    return res.status(200).send('Logout successful');
})
module.exports = authRouter;

