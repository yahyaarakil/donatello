const WS = require('ws');

module.exports.serveDonatello = (WSS_PORT) => {
    const promise = new Promise((resolve, reject) => {
        try {
            const wss = new WS.WebSocketServer({ port: WSS_PORT });
            wss.on('connection', (ws) => {
                console.log('Connection attempt to Websocket Server');
                // authenticate drone

                
                // on message
                ws.on('message', (data) => {
                    console.log('received: %s', data);
                    // ws.send('Received');
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
                    clearInterval(interval);
                });
            });

            resolve(wss);
        }
        catch(err) {
            reject(err);
        }
    });
    return promise;
}