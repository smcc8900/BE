const express = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/users');
const userAuth = require('../middelware/Auth');
const { getToken, setTokenCookie } = require('../utils/TokenOps');
const { validation } = require('../utils/validations');

const userRoutes = express.Router();

// API to get all users or a specific user by email
userRoutes.get('/api/v1/getUsers', userAuth, async (req, res) => {
    res.status(200).json(req?.user);
});

// API to update user details
userRoutes.patch('/api/v1/updateUser', userAuth, async (req, res) => {
    try {
        if (!validation(req)) {
            console.error('Invalid request data:', req.body);
            throw new Error('Invalid request data');
        }
        const updateData = await user.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
        if (!updateData) {
            throw new Error('An error occurred while updating the user,please try again later');
        }
        res.status(200).json(updateData);
    } catch (err) {
        res.status(500).send('Internal Server Error ' + err.message);
    }
})

module.exports = userRoutes
