const connectionRequest = require('../models/sendRequest');
const user = require('../models/users');
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

const validateDataforRequest = async(status, receiverId, senderId) => {
  const allowedStatus = ['ignore', 'interested'];

    if (!allowedStatus.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }
    if (!receiverId || !senderId) {
        throw new Error('Receiver ID and Sender ID are required');
    }
    if (receiverId == senderId) {
        throw new Error('Receiver ID and Sender ID cannot be the same');
    }
    const receiverExists = await user.findById(receiverId);
    if (!receiverExists) {
        throw new Error('Receiver does not exist');
    }
    const existingConnection = await connectionRequest.findOne({
         $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]       
    });
    if (existingConnection) {
        throw new Error('Connection request already exists between these users');
    }

    return {
        status,
        receiverId,
        senderId
    };
}

module.exports = { validation, validatePassword,validateDataforRequest };



