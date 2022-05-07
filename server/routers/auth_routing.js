const express = require('express');
const userController = require('../controllers/user_controller');
const userAuthMiddleware = require('../middlewares/user_authentication');
const verifyRequest = require('../middlewares/verify');

const router = express.Router();

router.post(
    '/register',
    verifyRequest({
        email: { type: String, required: true},
        password: { type: String, required: true},
        name: { type: String, required: true},
    }),
    (req, res) => {
    // verify request
    user = req.body;
    // call controller function
    userController.createUser(user).then((user) => {
        res.status(200).json({ message: 'User Created' });
    }).catch((err) => {
        res.status(500).json({ message: 'An error has occurred '});
    });
});

router.post(
    '/login',
    verifyRequest({
        email: { type: String, required: true},
        password: { type: String, required: true},
    }),
    (req, res) => {
    // verify request
    user = req.body;
    // call controller function
    userController.loginUser(user).then((token) => {
        if (token && token !== false){
            res.status(200).json({ token: token });
        } else if (token === null) {
            res.status(401).json({ message: 'User not found' });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    }).catch((err) => {
        res.status(400).json({ message: 'Bad request' });
    });
});

router.post('/test', userAuthMiddleware, (req, res) => {
    res.status(200).json({ message: 'Logged in' });
});

module.exports = router;