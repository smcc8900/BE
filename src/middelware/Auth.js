const jwt = require('jsonwebtoken');
const user = require('../models/users');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Assuming the token is stored in a cookie
        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }
        
        const decoded = jwt.verify(token, 'BE@Starter'); // Verify the token
        const {id} =  decoded; // Extract user ID from the decoded token
        console.log('Decoded user ID:', decoded); // Log the user ID for debugging
        const userData = await user.findById(id);
        if (!userData) {
            return res.status(404).send('User not found')   ;
        }
        req.user = userData; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send('Unauthorized: Invalid token');
    }
};

module.exports = userAuth;