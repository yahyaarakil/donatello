const express = require('express');
const droneModel = require('../models/drone');

const droneOwnerShip = (req, res, next) => {
    droneModel.findOne({ id: req.params.droneID }).then((droneRead) => {
        if (droneRead) {
            if (droneRead._id in req.user.drones) {
                req.drone = droneRead;
                next();
            } else {
                res.status(403).json({ message: 'Does not own drone' })
            }
        } else {
            res.status(404).json({ message: 'No drone found' })
        }

    }).catch((err) => res.status(500).json({ message: 'Error' }));
}

module.exports = droneOwnerShip;