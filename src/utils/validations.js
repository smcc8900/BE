const validation = (req) => {
    const allowedFields = ['firstName', 'lastName', 'Password','Email','skills'];
    if(!req || !req.body || typeof req.body !== 'object') {
        return false; // If req or req.body is undefined, return false
    }
    return Object.keys(req?.body).every(key => allowedFields.includes(key));
};

module.exports = { validation };
