const express = require('express');
const router = express.Router();



const homeRouter = require('./home');
router.use('/', homeRouter);

const companyRouter = require('./company');
router.use('/company', companyRouter);

const employeeRouter = require('./employee');
router.use('/employee', employeeRouter);




module.exports = router;
