const WS = require('ws');

module.exports.serveDonatello = (WSS_PORT) => {
    const promise = new Promise((resolve, reject) => {
        try {
            const wss = new WS.WebSocketServer({ port: WSS_PORT });
            wss.on('connection', (ws) => {
                // authenticate drone

                // on message
                ws.on('message', (data) => {
                    console.log('received: %s', data);
                    // ws.send('Received');
                });
            });
            wss.on('close', (ws) => {
                console.log('Connection closing by client');
            });
            resolve(wss);
        }
        catch(err) {
            reject(err);
        }
    });
    return promise;
}