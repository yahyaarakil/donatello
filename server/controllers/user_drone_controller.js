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
        }).catch((err) => reject(err));
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
        }).catch((err) => reject(err));
    });
}

const getAllLogsBetween = (drone, startDay, endDay) => {
    return new Promise((resolve, reject) => {
        logModel.find({ drone: drone._id, createdAt: { "$gte": startDay, "$lte": endDay } }).then((logsRead) => {
            logs = [];
            logsRead.forEach(log => {
                logs.push({ createdAt: log.createdAt, message: log.message });
            });
            resolve(logs);
        }).catch((err) => reject(err));
    });
}

module.exports = {
    getAllDrones: getAllDrones,
    getAllLogs: getAllLogs,
    getAllLogsBetween: getAllLogsBetween,
}