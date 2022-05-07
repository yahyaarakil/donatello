const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authenticateUser = (req, res, next) => {
    token = req.headers['token'];
    if (!token) {
        res.status(401).json({ message: 'No token in header' });
    } else {
        jwt.verify(token, process.env.TOKEN_SIGNATURE_KEY, (err, user) => {
            if (err) {
                res.status(403).json({ message: 'Access revoked or invalid token' });
            } else {
                userModel.findOne(user).then((userRead) => {
                    req.user = userRead;
                    next();
                }).catch((err) => res.status(500).json({ message: 'Error with user' }));
            }
        });
    }
}

module.exports = authenticateUser;