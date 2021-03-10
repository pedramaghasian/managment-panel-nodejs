const express = require('express');
const router = express.Router();

//controllers
const homeController = require('../../http/controllers/homeController');

router.get('/', homeController.getHome);

module.exports = router;
