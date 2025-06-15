const express = require('express');
const bcrypt = require('bcrypt');
const userAuth = require('../middelware/Auth');
const { getToken, setTokenCookie } = require('../utils/TokenOps');
const { validation, validatePassword } = require('../utils/validations');
const {successResponse} = require('../utils/responseMapper');
const user = require('../models/users');
const connectionRequest = require('../models/sendRequest');

const userRoutes = express.Router();

// API to get all users or a specific user by email
userRoutes.get('/api/v1/getUsers', userAuth, async (req, res) => {
    res.status(200).json(successResponse(req?.user));
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
        res.status(200).json(successResponse(updateData));
    } catch (err) {
        res.status(500).send('Internal Server Error ' + err.message);
    }
})

//API to udpdate user Password
userRoutes.patch('/api/v1/updatePassword', userAuth, async (req, res) => {
    try {
        if (!validatePassword(req)) {
            throw new Error('Invalid password format or passwords do not match');
        }
        const updatedPassword = await bcrypt.hash(req.body.Password, 10);
        const updateData = await user.findByIdAndUpdate(req.user._id, { Password: updatedPassword }, { new: true, runValidators: true });
        if (!updateData) {
            throw new Error('An error occurred while updating the password, please try again later');
        }
        const token = getToken(updateData._id);
        setTokenCookie(res, token);
        res.status(200).json(successResponse(updateData));
    } catch (err) {
        return res.status(500).send('Internal Server Error ' + err.message);
    }

})

// API to get all requests
userRoutes.get('/api/v1/getAllPendingRequest', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const allUsers = await connectionRequest.find({ 
            receiverId:userId,
            status: 'interested'
        }).populate("senderId",['firstName','lastName','photoUri']); 
        res.status(200).json(successResponse(allUsers));
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = userRoutes
