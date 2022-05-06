const WS = require('ws');
const messageFactory = require('./ws_message_factory');
const droneController = require('../controllers/drone_controller');

module.exports.serveDonatello = (WSS_PORT) => {
    return new Promise((resolve, reject) => {
        try {
            const wss = new WS.WebSocketServer({ port: WSS_PORT });
            wss.drones = {};
            wss.on('connection', (ws) => {
                console.log('Connection attempt to Websocket Server');
                ws.requests = {};

                // send/recieve functions
                ws.makeRequest = (method, path, body, cb) => {
                    do {
                        id = Math.floor(Math.random() * 4119);
                    } while (id in ws.requests);
                    request = new messageFactory.Request(id, method, path, body, cb);
                    ws.requests[request.id] = request;
                    ws.send(request.serializeMessage());
                }
                ws.sendResponse = (id, code, body) => {
                    response = new messageFactory.Response(id, code, body);
                    ws.send(response.serializeMessage());
                }

                // authenticate drone
                ws.drone = null;
                
                // on message
                ws.on('message', (data) => {
                    message = messageFactory.deserializeMessage(data);

                    // authentication
                    if (!ws.authenticated) {
                        if (message instanceof Request && message.method === 'post' && message.path === 'authenticate') {
                            ws = droneController.authenticateDrone(message.body);
                        }
                        if (!ws.authenticated) {
                            ws.sendResponse(message.id, 403, { message: 'Unauthenticated' });
                            return;
                        }
                        wss.drones[ws.id] = ws;
                        ws.sendResponse(message.id, 200, { message: 'Authenticated' });
                    }

                    // if request, handle
                    if (message instanceof Request) {
                        droneController.droneRequests[message.method][message.path](ws.authenticated, body).then((response) => {
                            ws.sendResponse(message.id, response.code, response.body);
                        }).catch((err) => console.log(err));
                    }
                    // if response, handle
                    else if (message instanceof Response) {
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