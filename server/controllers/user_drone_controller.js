const userModel = require('../models/user');
const droneModel = require('../models/drone');
const logModel = require('../models/log');
const wss = require('../controllers/websocket_server');

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

const getAllLogsBetween = (drone, start, end) => {
    return new Promise((resolve, reject) => {
        logModel.find({ drone: drone._id, createdAt: { "$gte": start, "$lte": end } }).then((logsRead) => {
            logs = [];
            logsRead.forEach(log => {
                logs.push({ createdAt: log.createdAt, message: log.message });
            });
            resolve(logs);
        }).catch((err) => reject(err));
    });
}

// # donatello.com.makeRequest(Request(Method.POST, 'mission.schedule', {
// #     'pattern': [
// #         (35.364147, 33.118160),
// #         (35.364391, 33.119475),
// #         (35.363998, 33.120464)
// #     ],
// #     'time': datetime.timestamp(datetime.now()) + 15

const scheduleMission = (drone, user, body) => {
    return new Promise((resolve, reject) => {
        // console.log(wss);
        if (!wss.makeRequest(drone.id, 'POST', 'mission.schedule', {
            pattern: [
                [35.364147, 33.118160],
                [35.364391, 33.119475],
                [35.363998, 33.120464]
            ],
            time: new Date().getTime()/1000 + 15
        }, () => {resolve({ status: 200, message: 'Success' })} )) {
            resolve({ status: 403, message: 'Drone not connected' });
        }
    });
}

const stopDrone = (drone, user, body) => {
    return new Promise((resolve, reject) => {
        // console.log(wss);
        if (!wss.makeRequest(drone.id, 'POST', 'stop', {}, () => resolve({ status: 200, message: 'Success' }))) {
            resolve({ status: 403, message: 'Drone not connected' });
        }
    });
}

module.exports = {
    getAllDrones: getAllDrones,
    getAllLogs: getAllLogs,
    getAllLogsBetween: getAllLogsBetween,
    scheduleMission: scheduleMission,
}