const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const droneModel = require('../models/drone');
const userModel = require('../models/user');

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
                        drone.save().then((drone) => {
                            console.log('🤖 New drone registered');
                            resolve(drone);
                        }).catch((err) => reject(err));
                    } else {
                        reject(false);
                    }
                }).catch((err) => reject(err));
            });
        }).catch((err) => reject(err));
    });
}

const loginDrone = (droneRead) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(drone.password, droneRead.password).then((correctPassword) => {
            if (correctPassword) {
                drone = stripDroneObject(droneRead);
                token = jwt.sign(drone, process.env.TOKEN_SIGNATURE_KEY);
                resolve(token);
            } else {
                resolve(false);
            }
        }).catch((err) => reject(err));
    });
}

const authenticateDrone = (drone) => {
    return new Promise((resolve, reject) => {
        droneModel.fineOne({ id: drone.id }).then((droneRead) => {
            // if registered before
            if (droneRead) {
                loginDrone(droneRead).then((token) => {
                    resolve(token);
                }).catch((err) => reject(err));
            } else {
                // register for first time
                registerDrone(drone).then(() => {
                    loginDrone(drone).then((token) => {
                        resolve(token);
                    }).catch((err) => reject(err));
                }).catch((err) => reject(err));
            }
        }).catch((err) => reject(err));
    });
}