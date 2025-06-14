const mongoose = require('mongoose');   
const validate =  require('validator'); // Importing mongoose-validator for custom validation
const userSchema = new mongoose.Schema(
    {
     firstName: String, 
     lastName: String,
     Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validate.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
     },
     ContactNumber: Number,
     Password: String, 
     Role: {
         type: String,
         enum: ['admin', 'user'],
         default: 'user'
     },
     skills: {
         type: [String],
         default: [],
            validate: {
                validator: function(v) {
                    return v.length <= 5; // Custom validation to limit skills to 5
                },
                message: 'You can only add up to 5 skills.'
            }   
     },
     photoUri: {
         type: String,
         default: 'https://example.com/default-profile.png' // Default profile picture URL
     },
    },
    {
        timestamps: true,   
    }
);
const users = mongoose.model('users', userSchema);

module.exports = users;