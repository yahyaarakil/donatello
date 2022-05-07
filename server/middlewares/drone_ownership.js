const express = require('express');
const droneModel = require('../models/drone');

const droneOwnerShip = (req, res, next) => {
    droneModel.findOne({ id: req.params.droneID }).then((droneRead) => {
        // console.log(droneRead._id.toString());
        // console.log(req.user.drones);
        if (droneRead) {
            if (req.user.drones.includes(droneRead._id)) {
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