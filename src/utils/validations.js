const validation = (req) => {
    const allowedFields = ['firstName', 'lastName', 'Password', 'Email', 'skills'];
    if (!req || !req.body || typeof req.body !== 'object') {
        return false; // If req or req.body is undefined, return false
    }
    return Object.keys(req?.body).every(key => allowedFields.includes(key));
};

const validatePassword = (req) => {
    const { Password, confirmPassword } = req?.body || {};

    console.log('Password:', Password);
    console.log('Confirm Password:', confirmPassword);

    // Ensure both fields are present and are strings
    if (typeof Password !== 'string' || typeof confirmPassword !== 'string') {
        return false;
    }

    // Check if passwords match
    return Password === confirmPassword;
};

module.exports = { validatePassword };

module.exports = { validation, validatePassword };



