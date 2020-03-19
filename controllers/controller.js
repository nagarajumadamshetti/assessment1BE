const models = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
async function signUp(req, res, next) {
    try {
        console.log("entered signup1")
        const hashedValue = passwordHash.generate(req.body.password);
        req.body.password = hashedValue;
        console.log("entered signup2")
        const users = await models.Users.create(req.body);
        res.status(200).json({
            users,
            message: "SignUp successful"
        });
    } catch (error) {
        res.status(404);
        next(error);
    }
}

async function signIn(req, res, next) {
    try {
        // let token = req.headers['access-token'];
        let token = null;
        const users = await models.Users.findOne({
            where: {
                username: req.body.username
            }
        });
        let match = null;
        if (users) {
            match = passwordHash.verify(req.body.password, users.password);
        }


        if (match) {
            //login
            token = await jwt.sign({ id: users.id }, 'keyboard cat 4 ever', { expiresIn: '1h' }); // Signing the token

            // users.jwtToken=token;
            res.status(200).json({
                message: "signin successful",
                token: token
            });
        }
        else {
            res.status(400).json({
                message: "signin Unsuccessful"
            });
        }
        //...
    } catch (error) {
        next(error);
    }
}
async function updatePassword(req, res, next) {
    try {
        const hashedValue = passwordHash.generate(req.body.newPassword);
        req.body.newPassword = hashedValue;
        console.log("entered updatepassword")
        const users = await models.Users.update({password:req.body.newPassword}, {
            where: {
                username: req.body.username
            }
        });
        res.status(200).json({
            users,
            message: "update successful"
        });
    } catch (error) {
        next(error);
    }
}
async function showActivities(req, res, next) {
    try {
        const token = req.headers['access-token'];
        let verified = jwt.verify(token, 'keyboard cat 4 ever');
        if (verified) {
            let payloadId = jwt.decode(token);
            const data = models.Activities.findAll({
                where: {
                    username: payloadId.id
                }
            })
            res.status(200).json({
                success: true,
                data: data
            })
        }
        else {
            res.status(400).json({
                success: false,
                message: "wrong credentials"
            })
        }
    } catch (error) {
        next(error);
    }
}
async function submitActivities(req, res, next) {
    try {
        const token = req.headers['access-token'];
        let verified = jwt.verify(token, 'keyboard cat 4 ever');
        if (verified) {
            let payloadId = jwt.decode(token);
            let newData = { ...req.body, username: payloadId.id }
            console.log(newData);
            const activities = await models.Activities.create(newData);
            res.status(200).json({
                activities,
                message: "activities adding successful"
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "wrong credentials"
            })
        }
    } catch (error) {
        next(error);
    }
}
module.exports = {
    signIn,
    signUp,
    showActivities,
    submitActivities,
    updatePassword
};
