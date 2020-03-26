const models = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const moment=require('moment');
const { Op } = require('sequelize')

// async function signUp(req, res, next) {
//     try {
//         console.log("entered signup1")
//         const hashedValue = passwordHash.generate(req.body.password);
//         req.body.password = hashedValue;
//         console.log("entered signup2")
//         const users = await models.Users.create(req.body);
//         res.status(200).json({
//             users,
//             message: "SignUp successful"
//         });
//     } catch (error) {
//         res.status(404);
//         next(error);
//     }
// }


async function signIn(req, res, next) {
    try {
        // let token = req.headers['access-token'];
        let token = null;
        let users = null;
        users = await models.Users.findOne({
            where: {
                username: req.body.username
            }
        });
        let match = null;
        if (users) {
            match = passwordHash.verify(req.body.password, users.password);
        }
        else {
            console.log("entered signup1")
            const hashedValue = passwordHash.generate(req.body.password);
            req.body.password = hashedValue;
            console.log("entered signup2")
            users = await models.Users.create(req.body);
            match = true
        }

        if (match) {
            //login
            // token = await jwt.sign({ id: users.id }, 'keyboard cat 4 ever', { expiresIn: '1h' }); // Signing the token

            // users.jwtToken=token;
            // browser.cookie
            res.status(200).json({
                message: "signin successful",
                // token: token
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

// async function updatePassword(req, res, next) {
//     try {
//         const hashedValue = passwordHash.generate(req.body.newPassword);
//         req.body.newPassword = hashedValue;
//         console.log("entered updatepassword")
//         const users = await models.Users.update({ password: req.body.newPassword }, {
//             where: {
//                 username: req.body.username
//             }
//         });
//         res.status(200).json({
//             users,
//             message: "update successful"
//         });
//         res.send(users)
//     } catch (error) {
//         next(error);
//     }
// }

const getActivities = async (req, res, next) => {
    try {
        // const token = req.headers['access-token'];
        // let verified = jwt.verify(token, 'keyboard cat 4 ever');
        console.log(' The console.log::::');
        let verified = true
        if (verified) {
            // let payloadId = jwt.decode(token);
            console.log(req.body);
            console.log(req.query);
            console.log(req.params);
            const users = await models.Users.findOne({
                where: {
                    username: req.body.username || req.query.username
                }
            });
            console.log(users)
            console.log("USers")
            const data = await models.Activities.findAll({
                where: {
                    userId: users.id
                }
            });
            console.log(data);
            if (data) {
                res.send(data)
                console.log(data)
            }
            else
                res.send(null);
        }
        else {
            res.send(null);
        }
    } catch (error) {
        // next(error);
        console.log(error)
        res.send(null);
    }
}
async function postActivities(req, res, next) {
    try {
        // const token = req.headers['access-token'];
        // let verified = jwt.verify(token, 'keyboard cat 4 ever');
        let verified = true
        if (true) {
            // let payloadId = jwt.decode(token);
            const users = await models.Users.findOne({
                where: {
                    username: req.body.username
                }
            });
            console.log(users);
            console.log(users.id)
            // let newData = { ...req.body, username: payloadId.id }

            if (users) {
                let newData = { ...req.body.actSub, userId: users.id }
                console.log(newData);
                const activities = await models.Activities.create(newData);
                res.status(200).json({
                    activities,
                    message: "activities adding successful"
                });
            }
            else{
                res.status(404).json({
                    success:false,
                    message:"user not found"
                })
            }
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

const userReport = async (req, res, next) =>
 {
    const users = await models.Users.findOne({
        where: {
            username: req.body.username
        }
    });
    const data = await models.Activities.findAll({
        where: {
            userId: users.id,
            date:{
                [Op.gte]: moment().subtract(7, 'days').toDate()
            }
        }
    });
    console.log(data);
    if(data)
    {
        res.status(200).json({
            data
        })
    }
}
module.exports = {
    signIn,
    // signUp,
    getActivities,
    postActivities,
    // updatePassword,
    userReport
};
