const WS = require('ws');
const messageFactory = require('./ws_message_factory');
const droneController = require('../controllers/drone_controller');

// send/recieve functions
const makeRequest = (ws, method, path, body, cb) => {
    do {
        id = Math.floor(Math.random() * 4119);
    } while (id in ws.requests);
    request = new messageFactory.Request(id, method, path, body, cb);
    ws.requests[request.id] = request;
    ws.send(request.serializeMessage());
}

const sendResponse = (ws, id, code, body) => {
    response = new messageFactory.Response(id, code, body);
    ws.send(response.serializeMessage());
}

module.exports.serveDonatello = (WSS_PORT) => {
    return new Promise((resolve, reject) => {
        try {
            const wss = new WS.WebSocketServer({ port: WSS_PORT });
            wss.drones = {};
            wss.on('connection', (ws) => {
                console.log('Connection attempt to Websocket Server');
                ws.requests = {};

                // authenticate drone
                ws.authenticated = null;
                
                // on message
                ws.on('message', async (data) => {
                    message = messageFactory.deserializeMessage(data);

                    // authentication
                    if (!ws.authenticated) {
                        if (message instanceof messageFactory.Request && message.method.toLowerCase() === 'post' && message.path === 'authenticate') {
                            try {
                                ws.authenticated = await droneController.authenticateDrone(Object.assign(message.body));
                            } catch {
                                ws.authenticated = null;
                            }
                        }
                        if (!ws.authenticated) {
                            sendResponse(ws, message.id, 403, { message: 'Unauthorized' });
                            return;
                        }
                        wss.drones[ws.id] = ws;
                        sendResponse(ws, message.id, 200, { message: 'Authenticated' });
                        console.log('Websocket server authenticated a drone');
                        return;
                    }

                    // if request, handle
                    if (message instanceof messageFactory.Request) {
                        droneController.droneRequests[message.method][message.path](ws.authenticated, body).then((response) => {
                            sendResponse(ws, message.id, response.code, response.body);
                        }).catch((err) => console.log(err));
                    }
                    // if response, handle
                    else if (message instanceof messageFactory.Response) {
                        request = ws.requests[message.id];
                        request.cb(ws.authenticated, message.code, message.body);
                        delete ws.requests[message.id];
                    }
                });

                // heartbeat
                ws.isAlive = true;
                ws.on('pong', () => ws.isAlive = true);
            
                const interval = setInterval(() => {
                    if (ws.isAlive === false) ws.terminate();
                    ws.isAlive = false;
                    ws.ping();
                }, 3000);
                
                ws.on('close', () => {
                    console.log('Connection closed by client');
                    delete wss.drones[ws.id];
                    clearInterval(interval);
                });
            });

            resolve(wss);
        }
        catch(err) {
            reject(err);
        }
    });
}