const userModel = require('../models/user');
const droneModel = require('../models/drone');
const logModel = require('../models/log');

const getAllDrones = (user) => {
    return new Promise((resolve, reject) => {
        user.populate('drones').then((populated) => {
            drones = [];
            populated.drones.forEach(drone => {
                drones.push({ id: drone.id, name: drone.name });
            });
            resolve(drones);
        }).catch(() => reject());
    });
}

const getAllLogs = (drone) => {
    return new Promise((resolve, reject) => {
        drone.populate('logs').then((populated) => {
            logs = [];
            populated.logs.forEach(log => {
                logs.push({ createdAt: log.createdAt, message: log.message });
            });
            resolve(logs);
        }).catch(() => reject());
    });
}

module.exports = {
    getAllDrones: getAllDrones,
    getAllLogs: getAllLogs,
}