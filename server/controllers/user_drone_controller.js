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

const scheduleMission = (drone, body) => {
    return new Promise((resolve, reject) => {
        // console.log(wss);
        if (!wss.makeRequest(drone.id, 'POST', 'mission.schedule', {
            pattern: body.pattern,
            // [
            //     [35.24658776950742, 33.028336778184546],
            //     [35.2465098293795, 33.028543109507105],
            //     // [35.363998, 33.120464]
            // ],
            time: new Date().getTime()/1000 + 1,
            // time: body.time,
            name: body.name
        }, () => {resolve({ status: 200, message: 'Success' })} )) {
            resolve({ status: 403, message: 'Drone not connected' });
        }
    });
}

const setMode = (drone, body) => {
    return new Promise((resolve, reject) => {
        // console.log(wss);
        if (!wss.makeRequest(drone.id, 'POST', 'mission.mode', { mode: body.mode }, () => resolve({ status: 200, message: 'Success' }))) {
            resolve({ status: 403, message: 'Drone not connected' });
        }
    });
}

const getAllMissions = (drone, body) => {
    return new Promise((resolve, reject) => {
        // console.log(wss);
        if (!wss.makeRequest(drone.id, 'GET', 'mission.missions', {}, (authenticated, code, body) => resolve(body.missions))) {
            resolve({ status: 403, message: 'Drone not connected' });
        }
    });
}

module.exports = {
    getAllDrones: getAllDrones,
    getAllLogs: getAllLogs,
    getAllLogsBetween: getAllLogsBetween,
    scheduleMission: scheduleMission,
    setMode: setMode,
    getAllMissions: getAllMissions,
}