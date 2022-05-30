require('dotenv').config();
const expect = require('chai').expect;
const assert = require('assert').strict;

const userModel = require('../models/user');
const droneModel = require('../models/drone');
const logModel = require('../models/log');
const droneController = require('../controllers/drone_controller');
const userDroneController = require('../controllers/user_drone_controller');


var token;

var app = null;
var user = null;
var drone = null;

// REQUESTS
var http = require('http');

const makeRequest = (method, path, token, body) => {
    return new Promise((resolve, reject) => {
        var options = {
            host: 'localhost',
            path: path,
            port: 8080,
            method: method,

            headers: {
                'token': token,
            }
        };

        if (method !== 'GET') {
            options.headers['Content-Type'] = 'application/json';
        }
        
        callback = (res) => {
            var str = ''
            res.on('data', (chunk) => {
                str += chunk;
            });
        
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(str));
                } else {
                    resolve(false);
                }
            });
        
            res.on('error', (error) => {
                reject(error);
            });
        }
        
        var req = http.request(options, callback);

        if (method !== 'GET') {
            data = JSON.stringify(body);
            req.write(data, () => req.end());
        } else {
            req.end();
        }
    });
}

describe("HTTP End-to-end test", async function() {
    it("Establishing server", async function () {
        try {
            process.env.MONGODB_URL = process.env.MONGODB_TEST_URL;
            app = await require('../app').start();
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    describe("User interactions", async function() {
        it("Register user", async function() {
            res = await makeRequest('POST', '/auth/register', '', {
                'email': "yahyaarakil@gmail.com",
                'password': "lmao123",
                'name': "Yahya Arakil"
            });

        });
        it("Logging in user", async function() {
            res = await makeRequest('POST', '/auth/login', '', {
                'email': "yahyaarakil@gmail.com",
                'password': "lmao123",
            });
            token = res.token;
        });
    });

    describe("Drone interactions", async function() {
        it("Register and login drone", async function() {
            drone = await droneController.authenticateDrone({
                id:  50,
                name: 'test_drone',
                password: 'testpassword12',
                email: 'yahyaarakil@gmail.com'
            });
            assert(drone);
        });
        it("Drone posting log", async function() {
            log = await droneController.droneRequests['post']['post_log'](drone, { 'message': 'log_test' });
            assert(log);
        });
    });

    describe("User Drone interactions", async function() {
        it("Fetching drones", async function() {
            res = await makeRequest('GET', '/drones', token, {});
            assert(res[0].id == 50);
        });
        it("Fetching logs", async function() {
            res = await makeRequest('GET', '/drones/50/logs', token, {});
            assert(res.length == 1);
        });
        it("Scheduling mission", async function() {
            res = await makeRequest('POST', '/drones/50/missions/schedule', token, {
                "pattern": [
                    [35.24658776950742, 33.028336778184546],
                    [35.2465098293795, 33.028543109507105]
                ],
                "name": "pool cleaning",
                "time": 541654616
            });
        });
        it("Setting drone mode", async function() {
            res = await makeRequest('POST', '/drones/50/missions/mode/rtl', token, {});
        });
        it("Fetching all missions", async function() {
            res = await makeRequest('GET', '/drones/50/missions/', token, {});
            console.log(res);
        });
        it("Fetching vitals", async function() {
            res = await makeRequest('GET', '/drones/50/vitals', token, {});
            console.log(res);
        });
        it("Fetching last location", async function() {
            res = await makeRequest('GET', '/drones/50/last_location', token, {});
            console.log(res);
        });        
    });

    describe("Deleting test data", async function() {
        it("Deleting logs", async function() {
            try {
                await logModel.deleteMany({});
                assert(true);
            } catch {
                assert(false);
            }
        });
        it("Deleting drone", async function() {
            try {
                await droneModel.deleteMany({});
                assert(true);
            } catch {
                assert(false);
            }
        });
        it("Deleting user", async function() {
            try {
                await userModel.deleteMany({});
                assert(true);
            } catch {
                assert(false);
            }
        });
    });

    // it("Stopping server", async function () {
    //     try {
    //         app = await require('../app').stop();
    //         assert(true);
    //     } catch (error) {
    //         assert(false);
    //     }
    // });
});