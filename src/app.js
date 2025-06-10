const express = require('express');
const db_status = require('./config/database');
const bcrypt = require('bcrypt');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
const { getToken,verifyToken,setTokenCookie,clearTokenCookie } = require('./utils/TokenOps');
const userAuth = require('./middelware/Auth'); // Importing the userAuth middleware



const user = require('./models/users');
const e = require('express');


db_status().then(() => {
    console.log('Database connected successfully');
    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    }
    );
}
).catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
}
);

// save API to create a new user
app.post('/api/user/save', async (req, res) => {
    // Logic to create a new user
    const ecryptedPassword = await bcrypt.hash(req.body?.Password, 10);
    const { firstName, lastName, Email, Password } = req.body;
    const userData = new user({
        firstName,
        lastName,
        Email,
        Password: ecryptedPassword
    });
    try {
        await userData.save()
        return res.status(200).send('User created successfully');
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).send('Internal Server Error');

    }
}
);

// API to get all users or a specific user by email
app.get('/api/getUsers', userAuth, async (req, res) => {
    res.status(200).json(req?.user);
});

//Api to delete a user by id
app.delete('/api/deletUser', async (req, res) => {
    // Logic to delete a user by id
    try {
        const userId = req.body?.userId;
        const deletedUser = await user.findByIdAndDelete(userId);
        // const deletedUser = await user.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
}
);

// API to update a user by id
app.patch('/api/updateUser', async (req, res) => {
    const userId = req.body?.userId;

    const data = req.body
    try{
        const UpdatedData = await user.findByIdAndUpdate(userId,data, {new: true, runValidators: true});
        if(UpdatedData){return res.status(200).send(UpdatedData); }
        else{
            return res.status(404).send('User not found');
        }
                         
    }catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error'+err);
    }
    
})

//API to Login a user
app.post('/api/login', async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const userData = await user.findOne({ Email: Email });
        if (!userData) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await bcrypt.compare(Password, userData.Password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }
        const token = getToken(userData._id);
        setTokenCookie(res, token);
        return res.status(200).send('Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error' + error);
    }
})


