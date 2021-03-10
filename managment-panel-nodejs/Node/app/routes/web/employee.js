const express = require('express');
const router = express.Router();

//controller
const employeeController = require('../../http/controllers/employeeController');

router.get('/', employeeController.getEmployee);
//create
router.get('/new', employeeController.getNew);
router.post('/new', employeeController.postNew);
//edit
router.post('/edit', employeeController.postEdit);
//delete
router.post('/delete', employeeController.postDelete);
//get by id
router.get('/:id', employeeController.getSingle);
module.exports = router;


