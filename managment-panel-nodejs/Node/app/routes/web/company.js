const express = require('express');
const router = express.Router();

//controller
const companyController = require('../../http/controllers/companyController');

router.get('/', companyController.getCompany);
//create
router.get('/new', companyController.getNew);
router.post('/new', companyController.postNew);
//edit
router.post('/edit', companyController.postEdit);
//delete
router.post('/delete', companyController.postDelete);

//get by id
router.get('/:id', companyController.getSingle);
module.exports = router;
