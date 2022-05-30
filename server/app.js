require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const authRouting = require('./routers/auth_routing');
const donatelloCommandsRouting= require('./routers/donatello_commands_routing');
const userDroneRouter = require('./routers/user_drone_router');
const webSocketServer = require('./controllers/websocket_server');

const app = express();
app.use(cors({ origin: process.env.APP_ORIGIN }))
app.use(express.json());
app.use('/auth', authRouting);
app.use(donatelloCommandsRouting);
app.use('/drones', userDroneRouter);

var wss = null;

var inject_start = null;
var inject_stop = null;

process.on('SIGINT', () => {
    console.log('🟡Terminating Server');
    if (wss) {
        console.log('🟡Terminating Websocket connections');
        wss.clients.forEach(ws => {
            ws.close();
        });
    }
    console.log('🟡Terminating connection to Database');
    mongoose.disconnect().then(() => {
        console.log('✅Server exitting gracefully');
        if (inject_stop) {
            inject_stop(true);
        }
        process.exit();
    });
});

app.listen(process.env.HTTPS_PORT, () => {
    console.log('🟡Starting Donatello Server');
    console.log('🟡Establishing connection to Database');
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('🟢Connected to Database successfully');
    }).then(() => {
        console.log('🟡Starting Websocket Server');
        webSocketServer.serveDonatello(process.env.WSS_PORT).then((ws) => {
            console.log(`🟢Websocket Server started successfully on port ${process.env.WSS_PORT}`);
            wss = ws;
            console.log(`✅Server started successfully on port ${process.env.HTTPS_PORT}`);
            
            if (inject_start) {
                inject_start(app);
            }
        }).catch((err) => {
            // console.log(err);
        });
    }).catch((err) => {
        // console.log(err);
        console.log('❌Unable to connect to Database, EXITING');
        process.exit();
    });
});

module.exports.start = () => {
    return new Promise((resolve, reject) => {
        inject_start = resolve;
    });
}

module.exports.stop = () => {
    return new Promise((resolve, reject) => {
        inject_stop = resolve;
        process.emit('SIGINT');
    });
}