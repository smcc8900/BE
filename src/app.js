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


const authRouter = require('./routes/auth'); // Importing the auth routes
const userRoutes  = require('./routes/user'); // Importing the user routes

//Routes
app.use('/', authRouter); // Using the auth routes
app.use('/', userRoutes); // Using the user routes




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

