const jwt = require('jsonwebtoken');



const getToken = (userId) => {        
    // Generate a token for the user
    const token = jwt.sign({ id: userId },   
        'BE@Starter',
        { expiresIn: '1h' } // Token expires in 1 hour
    );
    return token;
}
const verifyToken = (token) => {
    // Verify the token
    try {
        const decoded = jwt.verify(token, 'BE@Starter');
        return decoded; // Returns user data if token is valid
    } catch (error) {
        throw new Error('Invalid token');
    }
}
const setTokenCookie = (res, token) => {
    // Set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 3600000 // 1 hour
    });
}
const clearTokenCookie = (res) => {
    // Clear the token cookie
    res.clearCookie('token');
}

module.exports = {
    getToken,
    verifyToken,
    setTokenCookie,
    clearTokenCookie
};