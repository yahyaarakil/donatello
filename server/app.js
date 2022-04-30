const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRouting = require('./routers/auth_routing');
const donatelloCommandsRouting= require('./routers/donatello_commands_routing');

const app = express();
app.use(authRouting);
app.use(donatelloCommandsRouting);

app.listen(8000, () => {
    console.log('Starting Donatello Server');
    console.log('Establishing connection to Database');
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Connected to Database successfully');
        serve_donatello();
    }).catch(err => {
        console.log('Unable to connect to Database, EXITING');
    });
});