const userModel = require('../models/user');
const droneModel = require('../models/drone');
const logModel = require('../models/log');

const getAllDrones = (user) => {
    return new Promise((resolve, reject) => {
        try {
            user.populate('drones').then((populated) => {
                drones = []
                populated.drones.forEach(drone => {
                    drones.push({ id: drone.id, name: drone.name });
                });
                resolve(drones);
            }).catch(() => reject());
        } catch {
            reject();
        }
    });
}

const getAllLogs = (user, drone) => {
    return new Promise((resolve, reject) => {
        droneModel.find(drone).then((droneRead) => {
            droneRead = droneRead.populate();
            // resolve(droneRead.logs);
            resolve(True);
        }).catch((err) => reject(err));
    });
}

module.exports = {
    getAllDrones: getAllDrones,
    getAllLogs: getAllLogs,
}