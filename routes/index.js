const express = require('express');
const router = express.Router();
const controller=require('../controllers/controller');

router.get('/users/showActivities',controller.showActivities);
router.post('/users/login',controller.signIn);
router.post('/users/signUp',controller.signUp);
// router.put('/users/updatePassword',controller.updatePassword);
router.post('/users/submitActivities',controller.submitActivities);
module.exports = router;
