const models = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require('sequelize')
const express = require('express');
const app = express();

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
        let msg=null;
        users = await models.Users.findOne({
            where: {
                username: req.body.username
            }
        });
        let match = null;
        if (users) {
            match = passwordHash.verify(req.body.password, users.password);
            msg=0;
            console.log("match value is ::  "+match)
        }
        else {
            // console.log("entered signup1")
            const hashedValue = passwordHash.generate(req.body.password);
            req.body.password = hashedValue;
            // console.log("entered signup2")
            users = await models.Users.create(req.body);
            match = true
            // app.get('/',(req,res,next)=>{

            // })
            msg=1;
        }

        if (match) {
            res.send({
                value:true,
                msg:msg
            });
            //login
            // token = await jwt.sign({ id: users.id }, 'keyboard cat 4 ever', { expiresIn: '1h' }); // Signing the token

            // users.jwtToken=token;
            // browser.cookie
            
        }
        else {
            res.send(
                {
                    value:false,
                    msg:msg
                }   
            );
            // res.status(400).json({
            //     message: "signin Unsuccessful"
            // });
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
        let verified = true
        if (verified) {

            const users = await models.Users.findOne({
                where: {
                    username: req.params.userName
                }
            });

            const data = await models.Activities.findAll({
                attributes: ['title', 'start_time', 'end_time', 'date'],
                where: {
                    userId: users.id,
                    date: moment(req.params.date).toDate()
                }
            });

            if (data) {

                res.send(data)
            }
            else
                res.send(null);
        }
        else {
            res.send(null);
        }
    } catch (error) {
        res.send(null);
        next(error);
    }
}
const postActivities = async (req, res, next) => {
    try {
        // const token = req.headers['access-token'];
        // let verified = jwt.verify(token, 'keyboard cat 4 ever');
        let verified = true
        if (true) {
            // let payloadId = jwt.decode(token);
            console.log("entered point1");
            const users = await models.Users.findOne({
                where: {
                    username: req.body.username
                }
            });
            console.log("entered point 2");
            let newData = { ...req.body.actSub, userId: users.id }
            // console.log(newData);
            console.log("entered point 3");
            const activities = await models.Activities.create(newData);
            console.log("entered point4");
            res.send(activities);
            console.log("entered point 5")
        }
    } catch (error) {
        res.send(null);
        next(error);
    }
}

const userReport = async (req, res, next) => {
    try {
        const users = await models.Users.findOne({
            where: {
                username: req.params.userName
            }
        });
        const data = await models.Activities.findAll({
            attributes: ['title', 'start_time', 'end_time', 'date'],
            where: {
                userId: users.id,
                date: {
                    [Op.between]: [moment().subtract(7, 'days').toDate(), moment().toDate()]
                },
                end_time: {
                    [Op.ne]: null
                }
            }
        });
        if (data) {
            const report = data;
            let hm = {};
            if (report)
                report.map((el, key) => {
                    if (hm[el.date] === undefined) {
                        hm[el.date] = {};
                        let a = moment(new Date())
                        let b = moment(el.date);
                        hm[el.date] = {
                            id: a.diff(b, 'days'),
                            date: el.date,
                            count: 1,
                            duration: Math.floor(Math.abs((moment(el.end_time, 'HH:mm:ss').diff(moment(el.start_time, 'HH:mm:ss'))) / 3600000)),
                        };
                    }
                    else {
                        let count = hm[el.date].count + 1;
                        let duration = hm[el.date].duration + Math.floor(Math.abs((moment(el.end_time, 'HH:mm:ss').diff(moment(el.start_time, 'HH:mm:ss'))) / 3600000))
                        hm[el.date].count = count;
                        hm[el.date].duration = duration;
                    }
                });
            res.send(hm);
        }
        else {
            res.send(null);
        }
    } catch (error) {
        res.send(null);
        next(error);
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
