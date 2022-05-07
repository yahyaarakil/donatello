const express = require('express');
const verify = require('../middlewares/verify');
const userAuthMiddleware = require('../middlewares/user_authentication');
const droneOwnerShip = require('../middlewares/drone_ownership');
const userDroneController = require('../controllers/user_drone_controller');

const router = express.Router();

// only logged in users
router.use(userAuthMiddleware);

// accesssing a drone requires ownership
router.use('/:droneID', droneOwnerShip);


router.get('/:droneID', (req, res) => {
    res.status(200).json({ id: req.drone.id, name: req.drone.name });
});

router.get('/:droneID/logs', (req, res) => {
    res.status(200).json(req.user);
});

router.get('/', (req, res) => {
    userDroneController.getAllDrones(req.user).then((drones) => {
        res.status(200).json(drones);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    });
});

module.exports = router;