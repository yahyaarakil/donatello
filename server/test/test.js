require('dotenv').config();
const expect = require('chai').expect;
const assert = require('assert').strict;
const mongoose = require('mongoose');
// const app = require('../app');
const userController = require('../controllers/user_controller');
const droneController = require('../controllers/drone_controller');
const userDroneController = require('../controllers/user_drone_controller');

const userInput = {
    email:  'yahyaarakil2@gmail.com',
    password: 'testpassword2',
    name: 'yahya arakil'
};
var user;
var serverUser;

const droneInput = {
    id:  50,
    name: 'test_drone',
    password: 'testpassword12',
    email: 'yahyaarakil2@gmail.com'
}
var drone;
var droneServer;

describe("Database", async function() {
    it("Establishing conneciton", async function () {
        try {
            await mongoose.connect(process.env.MONGODB_URL);
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    describe("User interactions", async function() {
        it("Register user", async function() {
            user = await userController.createUser(userInput);
        });
        it("Logging in user", async function() {
            serverUser = await userController.loginUser(userInput);
        });
    });

    describe("Drone interactions", async function() {
        it("Register and login drone", async function() {
            drone = await droneController.authenticateDrone(droneInput);
            assert(drone);
        });
    });

    describe("User Drone interactions", async function() {
        it("Fetching drones", async function() {
            assert(await userDroneController.getAllDrones(user));
        });
        it("Fetching logs", async function() {
            assert(await userDroneController.getAllLogs(drone));
        });
        it("Scheduling mission", async function() {
            assert(await userDroneController.scheduleMission(drone, { pattern: [], time: 0, name: 'test_mission' }));
        });
        it("Setting drone mode", async function() {
            assert(await userDroneController.setMode(drone, { mode: 'rtl' }));
        });
        it("Fetching all missions", async function() {
            assert(await userDroneController.getAllMissions(drone));
        });
        it("Fetching vitals", async function() {
            assert(await userDroneController.getVitals(drone));
        });
        it("Fetching last location", async function() {
            assert(await userDroneController.getLastLocation(drone));
        });        
    });

    describe("Deleting test data", async function() {
        it("Deleting user", async function() {
            await user.remove();
        });
        it("Deleting drone", async function() {
            await drone.remove();
        });
    });
});