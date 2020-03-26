const express = require('express');
const router = express.Router();
const controller=require('../controllers/controller');

router.post('/users/getActivities',controller.getActivities);
router.post('/users/login',controller.signIn);
// router.post('/users/signUp',controller.signUp);
// router.put('/users/updatePassword',controller.updatePassword);
router.post('/users/submitActivities',controller.postActivities);
router.post('/users/userReport',controller.userReport);
module.exports = router;
