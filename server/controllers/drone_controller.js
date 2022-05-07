const bcrypt = require('bcrypt');
const droneModel = require('../models/drone');
const userModel = require('../models/user');
const logModel = require('../models/log');
const messageFactory = require('./ws_message_factory');

const registerDrone = (drone) => {
    return new Promise((resolve, reject) => {
        // generate salt
        bcrypt.genSalt().then((salt) => {
            bcrypt.hash(drone.password, salt).then((hashedPassword) => {
                drone.password = hashedPassword;

                // find associated user
                userModel.findOne({ email: drone.email }).then((user) => {
                    if (user) {
                        drone.user = user._id;
                        drone = new droneModel(drone);
                        user.drones.push(drone._id);
                        user.save().then((user) => {
                            drone.save().then((drone) => {
                                console.log('🤖 New drone registered');
                                resolve(drone);
                            }).catch((err) => reject(err));
                        }).catch((err) => reject(err));
                    } else {
                        reject(null);
                    }
                }).catch((err) => reject(err));
            });
        }).catch((err) => reject(err));
    });
}

const stripDroneObject = (drone) => {
    return { id: drone.id, name: drone.name }
}

const loginDrone = (drone, droneRead) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(drone.password, droneRead.password).then((correctPassword) => {
            if (correctPassword) {
                drone = stripDroneObject(droneRead);
                resolve(drone);
            } else {
                resolve(null);
            }
        }).catch((err) => reject(err));
    });
}

const authenticateDrone = (drone) => {
    return new Promise((resolve, reject) => {
        droneModel.findOne({ id: drone.id }).then((droneRead) => {
            // if registered before
            if (droneRead) {
                loginDrone(drone, droneRead).then((drone) => {
                    resolve(drone);
                }).catch((err) => reject(err));
            } else {
                // register for first time
                registerDrone(Object.assign(drone)).then((droneRead) => {
                    drone = stripDroneObject(droneRead);
                    resolve(drone);
                }).catch((err) => reject(err));
            }
        }).catch((err) => reject(err));
    });
}

const postLog = (drone, log) => {
    return new Promise((resolve, reject) => {
        droneModel.findOne(drone).then((droneRead) => {
            log.drone = droneRead._id;
            log = new logModel(log);
            log.save().then((logRead) => {
                droneRead.logs.push(log._id);
                droneRead.save().then(() => resolve({ code: 200, body: {} })).catch((err) => reject(err));
            }).catch((err) => resolve({ code: 500, body: {} }));
        }).catch((err) => resolve({ code: 500, body: {} }));
    });
}

const droneRequests = {
    'post': {
        'post_log': postLog
    },
    'get': {

    }
}

const serverRequests = {
}

module.exports = {
    authenticateDrone: authenticateDrone,
    droneRequests: droneRequests,
    serverRequests: serverRequests,
}