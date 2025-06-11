const express = require('express');
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const user = require('../models/users');
const userAuth = require('../middelware/Auth');
const { getToken, setTokenCookie } = require('../utils/TokenOps');

const userRoutes = express.Router();
// API to get all users or a specific user by email

userRoutes.get('/api/v1/getUsers', userAuth, async (req, res) => {
    console.log("Fetching user data for:", req);
    res.status(200).json(req?.user);    
});

module.exports = userRoutes
