class Message {
    constructor(id, body) {
        this.id = id;
        this.body = body;
    }
}

class Request extends Message {
    constructor(id, method, path, body, cb) {
        super(id, body);
        this.method = method;
        this.path = path;
        this.cb = cb;
    }

    serializeMessage() {
        return JSON.stringify({ id: id, request: { method: method, path: path, body: body } });
    }
}

class Response extends Message {
    constructor(id, code, body) {
        super(id, body);
        this.code = code;
    }

    serializeMessage() {
        return JSON.stringify({ id: id, response: { code: code, body: body } });
    }
}

const deserializeMessage = (messageText) => {
    try {
        parsed = JSON.parse(messageText);
        if (Object.keys(parsed)[0].toLocaleLowerCase() == 'request') {
            return new Request(parsed.id, parsed.method, parsed.path, parsed.body);
        } else if (Object.keys(parsed)[0].toLocaleLowerCase() == 'response') {
            return new Response(parsed.id, parsed.code, parsed.body);
        }
        throw new Error('Invalid message');
    } catch (error) {
        throw error;
    }
}

module.exports = {
    deserializeMessage: deserializeMessage,
    Request: Request,
    Response: Response,
}