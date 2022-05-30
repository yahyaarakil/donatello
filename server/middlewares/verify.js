// function factory
const verifyRequest = (constraints) => {
    return (req, res, next) => {
        for (let index = 0; index < Object.entries(constraints).length; index++) {
            const attribute = Object.entries(constraints)[index];
            if (!req.body[attribute[0]] && attribute[1].required) {
                console.log(req);
                console.log(req.body);
                return res.status(400).json({ message: 'Malformed Request' });
            }
        }
        next();
    }
}

module.exports = verifyRequest;