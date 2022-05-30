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
                        resolve(null);
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
                resolve(droneRead);
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
                    resolve(droneRead);
                }).catch((err) => reject(err));
            }
        }).catch((err) => reject(err));
    });
}

const postLog = (drone, log) => {
    return new Promise((resolve, reject) => {
        log.drone = drone._id;
        log = new logModel(log);
        log.save().then((logRead) => {
            drone.logs.push(logRead._id);
            drone.save().then(() => resolve({ code: 200, body: {} })).catch((err) => resolve({ code: 500, body: {} }));
        }).catch((err) => resolve({ code: 500, body: {} }));
    });
}

const postLocation = (drone, location) => {
    return new Promise((resolve, reject) => {
        drone.last_location = location.location;
        drone.save().then((droneRead) => resolve({ code: 200, body: {} })).catch((err) => resolve({ code: 500, body: {} }))
    });
}

const droneRequests = {
    'post': {
        'post_log': postLog,
        'post_location': postLocation
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