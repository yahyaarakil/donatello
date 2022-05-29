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
    if (req.query.start && req.query.end) {
        userDroneController.getAllLogsBetween(req.drone, new Date(req.query.start * 1000), new Date(req.query.end * 1000)).then((logs) => {
            res.status(200).json(logs);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Error' });
        });
    } else {
        userDroneController.getAllLogs(req.drone).then((logs) => {
            res.status(200).json(logs);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Error' });
        });
    }
});

router.get('/:droneID/missions', (req, res) => {
    userDroneController.getAllMissions(req.drone, req.user).then((missions) => {
        res.status(200).json(missions);
    }).catch((err) => {
        res.status(500).json({ message: 'Error' });
    });
});

router.post('/:droneID/missions/schedule', (req, res) => {
    userDroneController.scheduleMission(req.drone, req.body).then((response) => {
        res.status(response.status).json({ message: response.message });
    });
});

router.post('/:droneID/missions/mode/:mode', (req, res) => {
    userDroneController.setMode(req.drone, req.params).then((response) => {
        res.status(response.status).json({ message: response.message });
    });
});

router.get('/', (req, res) => {
    userDroneController.getAllDrones(req.user).then((drones) => {
        res.status(200).json(drones);
    }).catch((err) => {
        res.status(500).json({ message: 'Error' });
    });
});

module.exports = router;