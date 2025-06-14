const mongoose = require('mongoose');  

const connectionRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            //ref: 'users',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            //ref: 'users',
            required: true
        },
        status: {
            type: String,
            enum: ['ignore', 'interested','accepted', 'rejected'],
            message: `{VALUE} is not a valid status`,            
        },
    },
    {
        timestamps: true
    }
);


// connectionRequestSchema.pre('save', function(next) {
//     if (this.senderId == this.receiverId) {
//         throw new Error('senderId and receiverId cannot be the same');
//     }
//     next();
// });
connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

const connectionRequest = mongoose.model('connectionRequest', connectionRequestSchema);

module.exports = connectionRequest;

