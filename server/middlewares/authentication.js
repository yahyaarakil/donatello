const express = require('express');
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    token = req.headers['token'];
    if (!token) {
        res.status(401).json({ message: 'No token in header' });
    } else {
        jwt.verify(token, process.env.TOKEN_SIGNATURE_KEY, (err, user) => {
            if (err) {
                res.status(403).json({ message: 'Access revoked or invalid token' });
            } else {
                req.user = user;
                next();
            }
        });
    }
}

module.exports = authenticateUser;