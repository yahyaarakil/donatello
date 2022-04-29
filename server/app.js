const express = require('express');

const app = express();
app.listen(8000, () => {
    console.log('Starting Donatello Server');
    console.log('Establishing connection to Database');
});