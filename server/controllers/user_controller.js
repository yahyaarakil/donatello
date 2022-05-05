const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        // generate salt
        bcrypt.genSalt().then((salt) => {
            bcrypt.hash(user.password, salt).then((hashedPassword) => {
                user.password = hashedPassword;
                // generate and save user
                user = new userModel(user);
                user.save().then((user) => {
                    console.log('👤 New user created and saved');
                    resolve(user);
                }).catch((err) => reject(err) );
            });
        }).catch((err) => reject(err));
    });
}

const stripUserObject = (user) => {
    return { email: user.email, role: user.role }
}

const loginUser = (user) => {
    return new Promise((resolve, reject) => {
        userModel.findOne({ email: user.email }).then((userRead) => {
            if (userRead) {
                bcrypt.compare(user.password, userRead.password).then((correctPassword) => {
                    if (correctPassword) {
                        user = stripUserObject(user);
                        token = jwt.sign(user, process.env.TOKEN_SIGNATURE_KEY);
                        resolve(token);
                    } else {
                        resolve(false);
                    }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(null);
            }
        }).catch((err) => reject(err));
    });
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;