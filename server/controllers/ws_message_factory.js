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
        return JSON.stringify({ id: this.id, request: { method: this.method, path: this.path, body: this.body } });
    }
}

class Response extends Message {
    constructor(id, code, body) {
        super(id, body);
        this.code = code;
    }

    serializeMessage() {
        return JSON.stringify({ id: this.id, response: { code: this.code, body: this.body } });
    }
}

const deserializeMessage = (messageText) => {
    try {
        parsed = JSON.parse(messageText);
        if (parsed.request) {
            return new Request(parsed.id, parsed.request.method.toLowerCase(), parsed.request.path.toLowerCase(), parsed.request.body);
        } else if (parsed.response) {
            return new Response(parsed.id, parsed.response.code, parsed.response.body);
        }
        // throw new Error('Invalid message');
    } catch (error) {
        // throw error;
    }
}

module.exports = {
    deserializeMessage: deserializeMessage,
    Request: Request,
    Response: Response,
}