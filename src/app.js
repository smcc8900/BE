const express = require('express');
const db_status = require('./config/database');
const bcrypt = require('bcrypt');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
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