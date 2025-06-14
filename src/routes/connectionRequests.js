const express = require('express');
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const user = require('../models/users');
const connectionRequest = require('../models/sendRequest');
const userAuth = require('../middelware/Auth');
const { getToken, setTokenCookie } = require('../utils/TokenOps');
const { validateDataforRequest } = require('../utils/validations');

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
        return res.status(200).send(
            {
                Message: 'Connection request sent successfully',
                data
            })
            ;
    } catch (err) {
        return res.status(500).send('Internal Server Error ' + err.message);
    }
}
);

module.exports = requestRouter;

