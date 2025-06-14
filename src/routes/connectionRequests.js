const express = require('express');
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const user = require('../models/users');
const connectionRequest = require('../models/sendRequest');
const userAuth = require('../middelware/Auth');
const { getToken, setTokenCookie } = require('../utils/TokenOps');
const { validateDataforRequest } = require('../utils/validations');
const {successResponse} = require('../utils/responseMapper');


const requestRouter = express.Router();

requestRouter.post('/api/v1/sendRequest/:status/:receiverId', userAuth, async (req, res) => {
    try {

        const { status, receiverId } = req?.params;
        const senderId = req?.user?._id;
        const { status: validatedStatus, receiverId: validatedReceiverId, senderId: validatedSenderId } =
            await validateDataforRequest(status, receiverId, senderId);

        const requestData = new connectionRequest({
            status: validatedStatus,
            receiverId: validatedReceiverId,
            senderId: validatedSenderId,
        });
        const data = await requestData.save();
        return res.status(200).send(successResponse(data))
            ;
    } catch (err) {
        return res.status(500).send('Internal Server Error ' + err.message);
    }
}
);

//API to get review requests
requestRouter.post('/api/v1/reviewRequest/:status/:userId', userAuth, async (req, res) => {
    try {
        const { status, userId } = req?.params;
        const touser = req?.user
        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            throw new Error('Invalid status');
        }
        const connectionRequestExists = await connectionRequest.findOne({
            senderId: userId,
            receiverId: touser._id,
            status: 'interested'
        })
        if (!connectionRequestExists) {
            throw new Error('No pending request found');
        }
        connectionRequestExists.status = status;
        const updatedRequest = await connectionRequestExists.save();

        if (!updatedRequest) {
            throw new Error('An error occurred while updating the request, please try again later');
        }

        return res.status(200).json(successResponse(updatedRequest));
    } catch (err) {
        return res.status(500).send('Internal Server Error ' + err.message);
    }
});

module.exports = requestRouter;

