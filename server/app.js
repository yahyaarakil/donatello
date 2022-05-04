require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouting = require('./routers/auth_routing');
const donatelloCommandsRouting= require('./routers/donatello_commands_routing');
const webSocketServer = require('./controllers/websocket_server');

const app = express();
app.use(express.json());
app.use('/auth', authRouting);
app.use(donatelloCommandsRouting);

var wss = null;

process.on('SIGINT', () => {
    console.log('Terminating Server');
    if (wss) {
        console.log('Terminating Websocket connections');
        wss.clients.forEach(ws => {
            ws.close();
        });
    }
    process.exit();
});

app.listen(process.env.HTTPS_PORT, () => {
    console.log('🟡 Starting Donatello Server');
    console.log('🟡 Establishing connection to Database');
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('✅ Connected to Database successfully');
    }).then(() => {
        console.log('🟡 Starting Websocket Server');
        webSocketServer.serveDonatello(process.env.WSS_PORT).then((ws) => {
            console.log(`✅ Websocket Server started successfully on port ${process.env.WSS_PORT}`);
            wss = ws;
            console.log(`✅ Server started successfully on port ${process.env.HTTPS_PORT}`);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
        console.log('❌ Unable to connect to Database, EXITING');
        process.exit();
    });
});